import { validate as validateXML } from 'fast-xml-parser';
import { Severity } from '../file-alert';
import { Metadata, MetadataScanner } from '../metadata-scanner';
import { Rule } from '../rule';

// TODO Should each of these scanner classes be extending the metadata scanner or just accepting input as a constructor?
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
    protected isViolated(metadata: Metadata): boolean {
        const xmlValidationResult = validateXML(metadata.getRawContents());
        // TODO consider having a raise validation method on the parent class, then we are running the scan method, because at the moment the isViolated method has side effects
        if (xmlValidationResult !== true) {
            this.lineNumber = xmlValidationResult.err.line;
            this.violationLine = xmlValidationResult.err.msg;
        }
        return xmlValidationResult !== true;
    }
}

// This may provide false positives, but this is defined as a low priority for this reason
class ContainsIdRule extends Rule {
    protected severity = Severity.LOW;
    protected errorMessage = 'A potential Id has been identified in this file, consider removing the hardcoded refrence';
    protected isViolated(metadata: Metadata): boolean {
        const idMatches = metadata.getRawContents().match(/[^0-9a-zA-Z<]([0-9a-zA-Z]{18})[^0-9a-zA-Z>]/);
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
    protected isViolated(metadata: Metadata): boolean {
        return metadata.getRawContents().includes('<<<<<<<');
    }
}
