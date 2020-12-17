import { MetadataScanner } from '../metadata-scanner';
import { IncludesDescriptionRule, IncludesEqualsBooleanRule } from '../rules';

export default class ApprovalProcessScanner extends MetadataScanner {
    protected metadataFilePattern = '*.approvalProcess-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
        this.addRule(new IncludesEqualsBooleanRule());
    }
}
