import { MetadataScanner } from '../metadata-scanner';
import { IncludesDescriptionRule } from '../rules';

export default class PermissionSetScanner extends MetadataScanner {

    protected metadataFilePattern = '*.permissionset-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
    }
}

// TODO validate the fields present in the permission set (and for profile) are included in the field metadata
