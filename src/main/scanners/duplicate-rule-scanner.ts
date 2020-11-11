import { MetadataScanner } from '../metadata-scanner';
import { IncludesDescriptionRule } from '../rules';

export default class DuplicateRuleScanner extends MetadataScanner {

    protected metadataFilePattern = '*.duplicateRule-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
    }
}
