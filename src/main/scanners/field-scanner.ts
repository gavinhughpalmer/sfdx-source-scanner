import { Severity } from '../file-alert';
import { MetadataFile, MetadataScanner } from '../metadata-scanner';
import { Rule } from '../rule';
import { IncludesDescriptionRule, IncludesEqualsBooleanRule } from '../rules';

export default class FieldScanner extends MetadataScanner {

    protected metadataFilePattern = '*.field-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
        this.addRule(new IncludesEqualsBooleanRule());
        this.addRule(new ExcludeStandardFieldsRule());
    }
}

class ExcludeStandardFieldsRule extends Rule {
    protected severity = Severity.LOW;
    protected errorMessage = 'Please consider removing standard fields from source control, they can often cause problems';
    public isViolated(metadata: MetadataFile): boolean {
        return !metadata.getPath().endsWith('__c.field-meta.xml');
    }
}
