import { Severity } from '../file-alert';
import { Metadata, MetadataScanner } from '../metadata-scanner';
import { Rule } from '../rule';
import { IncludesEqualsBooleanRule } from '../rules';

export default class WorkflowScanner extends MetadataScanner {
    protected metadataFilePattern = '*.workflow-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesEqualsBooleanRule());
        this.addRule(new WorkflowIncludesDescriptionRule());
        this.addRule(new EmailAlertIncludesDescriptionRule());
        this.addRule(new FieldUpdateIncludesDescriptionRule());
        this.addRule(new WorkflowInactiveRule());
        this.addRule(new WorkflowBypassRule());
    }

    public scanMetadata(rule: Rule, metadata: Metadata): void {
        const workflowChildrenMetadata: WorkflowMetadata[] = this.getChildMetadata(rule, metadata);
        for (const childMetadata of workflowChildrenMetadata) {
            super.scanMetadata(rule, childMetadata);
        }
    }

    private getChildMetadata(rule: Rule, parentMetadata: Metadata): Metadata[] {
        const workflow = parentMetadata.getParsedContents();
        const childMetadata: WorkflowMetadata[] = [];
        const ruleType = this.getRuleType(rule);
        if (ruleType === '') {
            childMetadata.push(parentMetadata);
        } else {
            const childContents: object[] = workflow[ruleType] as object[];
            for (const contents of childContents) {
                childMetadata.push(new WorkflowMetadata(parentMetadata, contents));
            }
        }

        return childMetadata;
    }

    private getRuleType(rule: Rule): string {
        switch (rule.constructor) {
            case WorkflowRule:
                return 'rules';
            case EmailAlertRule:
                return 'alerts';
            case FieldUpdateRule:
                return 'fieldUpdates';
            default:
                // No child type found
                return '';
        }
    }
}

// TODO other components of workflow rules (eg outbound messages)
abstract class WorkflowRule extends Rule {}
abstract class EmailAlertRule extends Rule {}
abstract class FieldUpdateRule extends Rule {}

// TODO there seems to be unnessisary boilerplate code here, is there a better way this can be achieved
class WorkflowIncludesDescriptionRule extends WorkflowRule {
    public severity = Severity.MODERATE;
    public errorMessage = 'The metadata does not include a description'; // TODO Move the description message elsewhere
    protected isViolated(metadata: Metadata): boolean {
        return !includesDescription(metadata.getParsedContents());
    }
}

class EmailAlertIncludesDescriptionRule extends WorkflowRule {
    public severity = Severity.MODERATE;
    public errorMessage = 'The metadata does not include a description';
    protected isViolated(metadata: Metadata): boolean {
        return !includesDescription(metadata.getParsedContents());
    }
}

class FieldUpdateIncludesDescriptionRule extends WorkflowRule {
    public severity = Severity.MODERATE;
    public errorMessage = 'The metadata does not include a description';
    protected isViolated(metadata: Metadata): boolean {
        return !includesDescription(metadata.getParsedContents());
    }
}

function includesDescription(metadataObject: object): boolean {
    return metadataObject.hasOwnProperty('description');
}

class WorkflowInactiveRule extends WorkflowRule {
    public severity = Severity.MODERATE;
    public errorMessage =
        'Deactivated metadata should not be included in source control, please consider removing from the source';
    protected isViolated(metadata: Metadata): boolean {
        return metadata.getParsedContents()['active'] !== 'true';
    }
}

class WorkflowBypassRule extends WorkflowRule {
    public severity = Severity.MODERATE;
    public errorMessage = 'The bypass workflow line should be included within the workflow rule';
    public skipWorkflowLine = 'NOT($Setup.Configuration__c.Are_Workflows_Off__c)';
    protected isViolated(metadata: Metadata): boolean {
        const ruleContents = metadata.getParsedContents();

        return (
            ruleContents.hasOwnProperty('formula') &&
            (ruleContents['formula'] as string).includes(this.skipWorkflowLine)
        );
    }
}

class WorkflowMetadata extends Metadata {
    public constructor(parentMetadata: Metadata, metadataContents: object) {
        super(parentMetadata.getPath());
        this.metadataContents = parentMetadata.getRawContents();
        this.parsedMetadata = metadataContents;
    }
}

// TODO need to figure out how to include the breakdown of workflow rules, then include:
//  * bypass metadata
