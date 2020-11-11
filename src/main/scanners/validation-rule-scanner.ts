import { MetadataScanner } from '../metadata-scanner';
import { DeactivatedMetadataRule, IncludesDescriptionRule, IncludesEqualsBooleanRule, SkipAutomationRule } from '../rules';

export default class ValidationRuleScanner extends MetadataScanner {

    protected metadataFilePattern = '*.validationRule-meta.xml';
    public constructor(baseDir: string) {
        super(baseDir);
        this.addRule(new IncludesDescriptionRule());
        this.addRule(new IncludesEqualsBooleanRule('<errorConditionFormula>{innerText}<\/errorConditionFormula>'));
        this.addRule(new SkipAutomationRule('NOT($Setup.Configuration__c.Are_Validations_Off__c)'));
        this.addRule(new DeactivatedMetadataRule('<active>true</active>'));
    }
}
