import { MetadataScanner } from '../metadata-scanner';
import { IncludesDescriptionRule } from '../rules';

export default class ObjectScanner extends MetadataScanner {

    protected metadataFilePattern = '*__c.object-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
    }
}
