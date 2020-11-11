import * as glob from 'fast-glob';
import * as fs from 'fs';
import { FileAlert } from './file-alert';
import { Rule } from './rule';

export class MetadataScanner {
    protected metadataFilePattern: string;
    protected rules: Rule[];
    private rulesMap: Map<string, Rule> = new Map();
    private ignoredFiles: string[];

    private baseDir: string;

    public constructor(baseDir: string) {
        this.baseDir = baseDir;
    }

    public getMetadataFilePattern(): string {
        return this.baseDir + '/**/' + this.metadataFilePattern;
    }

    public async run(): Promise<FileAlert[]> {
        const alerts: FileAlert[] = [];
        for (const metadataPath of await glob([this.getMetadataFilePattern()])) {
            const metadataFile = new MetadataFile(metadataPath);
            for (const rule of this.rulesMap.values()) {
                rule.ignoreFiles(this.ignoredFiles);
                for (const violation of rule.scan(metadataFile)) {
                    violation['filePath'] = metadataPath;
                    alerts.push(violation as FileAlert);
                }
            }
        }
        return alerts;
    }

    public excludeRule(ruleName: string): void {
        this.rulesMap.get(ruleName).disable();
    }

    public includeRule(ruleName: string): void {
        // how to ensure others are disabled here?
        this.rulesMap.get(ruleName).enable();
    }

    public ignoreFiles(ignoredFiles: string[]): void {
        this.ignoredFiles = ignoredFiles;
    }

    protected addRule(ruleToAdd: Rule): void {
        this.rulesMap.set(ruleToAdd.constructor.name, ruleToAdd);
    }
}

export class MetadataFile {

    private metadataPath: string;
    private metadataContents: string;

    constructor(metadataPath: string) {
        this.metadataPath = metadataPath;
    }

    public getPath(): string {
        return this.metadataPath;
    }

    public getContents() {
        if (!this.metadataContents) {
            this.metadataContents = fs.readFileSync(this.metadataPath, 'utf8');
        }
        return this.metadataContents;
    }

    public isManagedMetadata() {
        return this.metadataPath.match(/[\w\d]+__[\w\d]+__c.\w+-meta\.xml/);
    }
}
