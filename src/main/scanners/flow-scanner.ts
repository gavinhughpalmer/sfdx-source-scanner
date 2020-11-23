import { Severity } from '../file-alert';
import { Metadata, MetadataScanner } from '../metadata-scanner';
import { Rule, Violation } from '../rule';
import { DeactivatedMetadataRule, IncludesDescriptionRule, IncludesEqualsBooleanRule, NamingConventionRule, SkipAutomationRule } from '../rules';

export default class FlowScanner extends MetadataScanner {

    protected metadataFilePattern = '*.flow-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new ProcessBuilderNamingRule());
        this.addRule(new SingleProcessBuilderPerObjectRule());
        this.addRule(new IncludesDescriptionRule());
        this.addRule(new IncludesEqualsBooleanRule('<formulas>[^]+<expression>{innerText}<\/expression>[^]+<\/formulas>'));
        this.addRule(new SkipProcessBuilderRule());
        this.addRule(new DeactivatedMetadataRule('<status>Active</status>'));
        this.addRule(new NamingConventionRule(/[A-Z][a-zA-Z0-9_]*_Handler/));
    }
}

abstract class ProcessBuilderRule extends Rule {

    public static isProcessBuilder(flowContents: string): boolean {
        return flowContents.includes('<processType>Workflow</processType>');
    }

    public scanOverride(metadata: Metadata): Violation[] {
        if (!ProcessBuilderRule.isProcessBuilder(metadata.getRawContents())) {
            return [];
        }
        return super.scanOverride(metadata);
    }
}

class ProcessBuilderNamingRule extends ProcessBuilderRule {
    public severity = Severity.MODERATE;
    public errorMessage = 'The process builder does not follow the naming convention';
    protected isViolated(metadata: Metadata): boolean {
        return !metadata.getPath().includes('_Handler');
    }
}

class SingleProcessBuilderPerObjectRule extends ProcessBuilderRule {
    public severity = Severity.HIGH;
    public errorMessage = 'There are multiple process builders for the objet';
    private processBuilderObjects = new Set();
    protected isViolated(metadata: Metadata): boolean {
        const matches = metadata.getRawContents().match(/<name>ObjectType<\/name>\s*<value>\s*<stringValue>(\w*)<\/stringValue>/);
        if (matches && matches[1]) {
            const objectName = matches[1].toLowerCase();
            const alreadyHasProcessBuilder = this.processBuilderObjects.has(objectName);
            this.processBuilderObjects.add(objectName);
            return alreadyHasProcessBuilder;
        }
        return true;
    }
}

class SkipProcessBuilderRule extends SkipAutomationRule {
    public constructor() {
        super('$Setup.Configuration__c.Are_Processes_Off__c');
    }
    protected isViolated(metadata: Metadata): boolean {
        return ProcessBuilderRule.isProcessBuilder(metadata.getRawContents()) && super.isViolated(metadata);
    }
}

// TODO Include logic to check the structure of flow files to ensure they are valid, will require deep analysis of the flow structure to understand how it all sits together, one item is if a processMetadataValue is a formula, the element refrence will need to be a formula ref in the format formula_6_...
