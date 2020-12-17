import * as glob from 'fast-glob';
import { parse as parseXml } from 'fast-xml-parser';
import * as fs from 'fs';
import { FileAlert } from './file-alert';
import { Rule, Violation } from './rule';

export abstract class MetadataScanner {
    protected metadataFilePattern: string;
    protected rules: Rule[];
    private readonly rulesMap: Map<string, Rule> = new Map();
    private ignoredFiles: string[];
    private readonly alerts: FileAlert[] = [];

    private readonly baseDir: string;

    public constructor(baseDir: string) {
        this.baseDir = baseDir;
    }

    public getMetadataFilePattern(): string {
        return this.baseDir + '/**/' + this.metadataFilePattern;
    }

    public async run(): Promise<FileAlert[]> {
        for (const metadataPath of await glob(this.getMetadataFilePattern(), { ignore: this.ignoredFiles })) {
            const metadataFile = new Metadata(metadataPath);
            for (const rule of this.rulesMap.values()) {
                this.scanMetadata(rule, metadataFile);
            }
        }

        return this.alerts;
    }

    public excludeRule(ruleName: string): void {
        this.rulesMap.get(ruleName).disable();
    }

    public includeRule(ruleName: string): void {
        this.rulesMap.get(ruleName).enable();
    }

    public ignoreFiles(ignoredFiles: string[]): void {
        this.ignoredFiles = ignoredFiles;
    }

    public getRule(ruleName: string): Rule {
        return this.rulesMap.get(ruleName);
    }

    protected scanMetadata(rule: Rule, metadata: Metadata): void {
        for (const violation of rule.scan(metadata)) {
            this.raiseAlert(metadata, violation);
        }
    }

    protected raiseAlert(metadata: Metadata, violation: Violation): void {
        violation['filePath'] = metadata.getPath();
        this.alerts.push(violation as FileAlert);
    }

    protected addRule(ruleToAdd: Rule): void {
        this.rulesMap.set(ruleToAdd.constructor.name, ruleToAdd);
    }
}

export class Metadata {
    protected metadataFilePath: string;
    protected metadataContents: string;
    protected parsedMetadata: object;

    constructor(metadataFilePath: string) {
        this.metadataFilePath = metadataFilePath;
    }

    public getPath(): string {
        return this.metadataFilePath;
    }

    public getRawContents(): string {
        if (!fs.existsSync(this.metadataFilePath)) {
            throw new MetadataError(`The file path ${this.metadataFilePath} does not exist`);
        }
        if (!this.metadataContents) {
            this.metadataContents = fs.readFileSync(this.metadataFilePath, 'utf8');
        }

        return this.metadataContents;
    }

    public getParsedContents(): object {
        if (!this.parsedMetadata) {
            this.parsedMetadata = parseXml(this.getRawContents());
        }

        return this.parsedMetadata;
    }

    public isManagedMetadata(): boolean {
        return !!this.metadataFilePath.match(/[\w\d]+__[\w\d]+__c.\w+-meta\.xml/);
    }
}

export class MetadataError extends Error {}
