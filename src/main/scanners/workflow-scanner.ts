import { Metadata, MetadataScanner } from '../metadata-scanner';
import { Rule } from '../rule';
import { IncludesEqualsBooleanRule } from '../rules';

export default class WorkflowScanner extends MetadataScanner {

    protected metadataFilePattern = '*.workflow-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesEqualsBooleanRule());
    }

    public scanMetadata(rule: Rule, metadata: Metadata): void {
        const childMetadata: WorkflowMetadata = this.getChildMetadata(rule, metadata);
        // for (const metadata of childMetadata) {
        super.scanMetadata(rule, childMetadata);
        // }
    }

    private getChildMetadata(rule: Rule, parentMetadata: Metadata): WorkflowMetadata {
        const workflow = parentMetadata.getParsedContents();
        // TODO This doesn't handle all the records that will be in each child
        // const workflowMetadata =
        // for (const contents of workflow[fieldValue]) {

        // }
        switch (rule.constructor) {
            case WorkflowRule:
                return new WorkflowMetadata(parentMetadata, workflow['rules']);
            case EmailAlertRule:
                return new WorkflowMetadata(parentMetadata, workflow['alerts']);
            case FieldUpdateRule:
                return new WorkflowMetadata(parentMetadata, workflow['fieldUpdates']);
            default:
                // No child type found
                return parentMetadata;
        }
    }
}

abstract class WorkflowRule extends Rule {

}

abstract class EmailAlertRule extends Rule {

}

abstract class FieldUpdateRule extends Rule {

}

class WorkflowMetadata extends Metadata {
    public constructor(parentMetadata: Metadata, metadataContents: object) {
        super(parentMetadata.getPath());
        this.metadataContents = parentMetadata.getRawContents();
        this.parsedMetadata = metadataContents;
    }
}

// TODO need to figure out how to include the breakdown of workflow rules, then include:
//  * descriptions (for rules, field updates and alerts)
//  * active rules
//  * bypass metadata
