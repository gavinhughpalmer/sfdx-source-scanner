import { Severity } from '../file-alert';
import { Metadata, MetadataScanner } from '../metadata-scanner';
import { Rule } from '../rule';
import { IncludesDescriptionRule, IncludesEqualsBooleanRule, NamingConventionRule } from '../rules';

export default class FieldScanner extends MetadataScanner {

    protected metadataFilePattern = '*.field-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
        this.addRule(new IncludesEqualsBooleanRule());
        this.addRule(new ExcludeStandardFieldsRule());
        this.addRule(new NamingConventionRule(/[A-Z][a-zA-Z0-9_]*/));
    }
}

class ExcludeStandardFieldsRule extends Rule {
    protected severity = Severity.LOW;
    protected errorMessage = 'Please consider removing standard fields from source control, they can often cause problems';
    protected isViolated(metadata: Metadata): boolean {
        return !metadata.getPath().endsWith('__c.field-meta.xml');
    }
}
