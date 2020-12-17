import { fs } from '@salesforce/core';
import { FileAlert } from '../file-alert';
import { MetadataScanner } from '../metadata-scanner';

export class RuleSetManager {
    private readonly ruleSet: RuleSet;

    private constructor(ruleSet: RuleSet) {
        this.ruleSet = ruleSet;
    }
    public static async getRuleSet(ruleSetPath: string): Promise<RuleSetManager> {
        const fileContents = await fs.readJson(ruleSetPath);

        return new RuleSetManager((fileContents as unknown) as RuleSet);
    }

    public async runRuleSet(targetDir: string): Promise<FileAlert[]> {
        const scanJobs = [];
        for (const scannerConfig of this.ruleSet.scanners) {
            const scannerInstance = await this.createScanner(scannerConfig, targetDir);
            scanJobs.push(scannerInstance.run());
        }

        return Promise.all(scanJobs);
    }

    private async createScanner(scannerConfig: ScannerConfig, targetDir: string): Promise<MetadataScanner> {
        const scannerModule = await import(`../scanners/${scannerConfig.name}`);
        const scannerInstance = new scannerModule.default(targetDir);
        // TODO Validate input file (eg only ignore or execute provided)
        if (scannerConfig.exclude) {
            for (const excludedRules of scannerConfig.exclude) {
                scannerInstance.excludeRule(excludedRules);
            }

            return scannerInstance;
        }
        if (scannerConfig.ignore) {
            scannerInstance.ignoreFiles(scannerConfig.ignore);
        }
        if (scannerConfig.include) {
            for (const includedRule of scannerConfig.include) {
                this.enableRule(scannerInstance, includedRule);
            }
        }

        return scannerInstance;
    }

    private enableRule(scannerInstance: MetadataScanner, includedRule: RuleConfig): void {
        scannerInstance.includeRule(includedRule.name);
        const rule = scannerInstance.getRule(includedRule.name);
        rule.severity = includedRule.severity || rule.severity;
        rule.errorMessage = includedRule.errorMessage || rule.errorMessage;
        if (includedRule.properties) {
            for (const property of includedRule.properties) {
                rule[property.name] = property.value;
            }
        }
    }
}

interface RuleSet {
    name: string;
    description: string;
    scanners: ScannerConfig[];
}

interface ScannerConfig {
    name: string;
    include?: RuleConfig[];
    exclude?: string[];
    ignore?: string[];
}

// TODO to be extended in the various rule classes with their additional config
interface RuleConfig {
    name: string;
    severity?: number;
    errorMessage?: string;
    ignore?: string[];
    properties?: RuleProperty[];
}

interface RuleProperty {
    name: string;
    value: string | number;
}
