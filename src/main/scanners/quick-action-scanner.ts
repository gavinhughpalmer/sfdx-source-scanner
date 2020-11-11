import { MetadataScanner } from '../metadata-scanner';
import { IncludesDescriptionRule } from '../rules';

export default class QuickActionScanner extends MetadataScanner {

    protected metadataFilePattern = '*.quickAction-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
    }
}
