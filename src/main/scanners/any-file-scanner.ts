import { validate as validateXML } from 'fast-xml-parser';
import { Severity } from '../file-alert';
import { MetadataFile, MetadataScanner } from '../metadata-scanner';
import { Rule } from '../rule';

export default class AnyFileScanner extends MetadataScanner {

    protected metadataFilePattern = '*.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IsValidXMLRule());
        this.addRule(new ContainsIdRule());
        this.addRule(new ContainsUnresolvedConflictsRule());
    }
}

class IsValidXMLRule extends Rule {
    protected severity = Severity.EXTREME;
    protected errorMessage = 'The XML file is not formatted correctly, this will not be deployed successfully';
    public isViolated(metadata: MetadataFile): boolean {
        return validateXML(metadata.getContents()) !== true;
    }
}

// This may provide false positives, but this is defined as a low priority for this reason
class ContainsIdRule extends Rule {
    protected severity = Severity.LOW;
    protected errorMessage = 'A potential Id has been identified in this file, consider removing the hardcoded refrence';
    public isViolated(metadata: MetadataFile): boolean {
        const idMatches = metadata.getContents().match(/[^0-9a-zA-Z<]([0-9a-zA-Z]{18})[^0-9a-zA-Z>]/);
        if (idMatches) {
            const potentialId = idMatches[1];
            return /\d/.test(potentialId);
        }
        return false;
    }
}

class ContainsUnresolvedConflictsRule extends Rule {
    protected severity = Severity.EXTREME;
    protected errorMessage = 'An unresolved merge conflict has been identified, please resolve before proceeding';
    public isViolated(metadata: MetadataFile): boolean {
        return metadata.getContents().includes('<<<<<<<');
    }
}
