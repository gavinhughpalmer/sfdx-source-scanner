import { MetadataScanner } from '../metadata-scanner';
import { IncludesEqualsBooleanRule } from '../rules';

export default class WorkflowScanner extends MetadataScanner {

    protected metadataFilePattern = '*.workflow-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesEqualsBooleanRule());
    }
}

// TODO need to figure out how to include the breakdown of workflow rules, then include:
//  * descriptions (for rules, field updates and alerts)
//  * active rules
//  * bypass metadata
