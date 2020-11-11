import { Severity } from './file-alert';
import { MetadataFile } from './metadata-scanner';
import { Rule } from './rule';

// TODO Move the generic rules out into a seperate module
export class IncludesDescriptionRule extends Rule {
    protected severity = Severity.MODERATE;
    protected errorMessage = 'The metadata does not include a description';
    public isViolated(metadata: MetadataFile): boolean {
        let isViolated = false;
        const desctiptionMatch = metadata.getContents().match(/<description>[^]*<\/description>/);
        if (!metadata.isManagedMetadata() && !desctiptionMatch) {
            isViolated = true;
            this.lineNumber = desctiptionMatch.index;
            this.violationLine = desctiptionMatch[1];
        }
        return isViolated;
    }
}

export class IncludesEqualsBooleanRule extends Rule {
    protected severity = Severity.MINOR;
    protected errorMessage = 'The formula contains a comparison of a checkbox (boolean) to the keyword true or false, this is unnessisary as the boolean itself can be used';
    private surroundingText: string;

    public constructor(surroundingText?: string) {
        super();
        this.surroundingText = surroundingText || '<formula>{innerText}<\/formula>';
    }

    protected isViolated(metadata: MetadataFile): boolean {
        const equalsBooleanMatch = metadata.getContents().match(this.getRegexPattern());
        if (equalsBooleanMatch) {
            this.lineNumber = equalsBooleanMatch.index;
            this.violationLine = equalsBooleanMatch[1];
        }
        return !!equalsBooleanMatch;
    }

    private getRegexPattern(): RegExp {
        return new RegExp(this.surroundingText.replace('{innerText}', this.getEqualsText()), 'mi');
    }

    private getEqualsText(): string {
        return '([^]+=\\s*(false|true)[^]*)';
    }
}

export class SkipAutomationRule extends Rule {
    protected severity = Severity.MODERATE;
    protected skipAutomation: string;
    protected errorMessage: string;
    public constructor(skipAutomation: string) {
        super();
        this.skipAutomation = skipAutomation;
        this.errorMessage = 'The file does not include the line ' + this.skipAutomation;
    }
    public isViolated(metadata: MetadataFile): boolean {
        return !metadata.getContents().includes(this.skipAutomation);
    }
}

export class DeactivatedMetadataRule extends Rule {
    protected severity = Severity.MODERATE;
    protected activeFlag: string;
    protected errorMessage = 'Deactivated metadata should not be included in source control, please consider removing from the source';
    public constructor(activeFlag: string) {
        super();
        this.activeFlag = activeFlag;
    }
    public isViolated(metadata: MetadataFile): boolean {
        return !metadata.getContents().includes(this.activeFlag);
    }
}

export class NamingConventionRule extends Rule {
    protected severity = Severity.HIGH;
    protected errorMessage = 'The name of the metadata object does not match the suggested convention';
    protected namingPattern: RegExp;

    public constructor(namingPattern: RegExp) {
        super();
        this.namingPattern = namingPattern;
    }
    public isViolated(metadata: MetadataFile): boolean {
        if (!this.namingPattern) {
            throw new Error('The naiming pattern has not been defined');
        }
        const lastPathDeliiter = metadata.getPath().lastIndexOf('/');
        const startOfExtension = metadata.getPath().indexOf('.');
        const fileName = metadata.getPath().substring(lastPathDeliiter, startOfExtension);
        return this.namingPattern.test(fileName);
    }
}

// TODO Include custom defined rules, and configuration to disable / enable rules as well as adding different priorities to those
// TODO include rules for checking plain text passwords in named credentials
// TODO could make the rules parse the XML and use checks on if nodes exist in the tree
// TODO Naming convention rules
// TODO Add templates for creating new plugins and scanners using the https://github.com/jondot/hygen and npx (as in browserforce)
