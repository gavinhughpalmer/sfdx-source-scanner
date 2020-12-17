import { MetadataScanner } from '../metadata-scanner';
import { IncludesDescriptionRule, NamingConventionRule } from '../rules';

export default class ObjectScanner extends MetadataScanner {
    protected metadataFilePattern = '*__c.object-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
        this.addRule(new NamingConventionRule(/[A-Z][a-zA-Z0-9_]*/));
    }
}
