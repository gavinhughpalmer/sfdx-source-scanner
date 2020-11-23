import { expect } from 'chai';
import * as rules from '../../src/main/rules';
import { MetadataMock } from "./mocks";

describe('IncludesDescriptionRule', () => {
    let mockFile: MetadataMock;
    let includesDescriptionRule: rules.IncludesDescriptionRule;
    beforeEach(() => {
        mockFile = new MetadataMock('fake/file/path.txt');
        includesDescriptionRule = new rules.IncludesDescriptionRule();
    });
    it('should not validate for included description', () => {
        mockFile.setRawContents('someFileContents<description>This is my description</description>some other contents');
        expect(includesDescriptionRule.scan(mockFile).length).to.equal(0);
    });
    it('should validate for excluded description', () => {
        mockFile.setRawContents('someFileContents...some other contents');
        expect(includesDescriptionRule.scan(mockFile).length).to.equal(1);
    });
});

describe('IncludesEqualsBooleanRule', () => {
    let mockFile: MetadataMock;
    let includesEqualsBooleanRule: rules.IncludesEqualsBooleanRule;
    beforeEach(() => {
        mockFile = new MetadataMock('fake/file/path.txt');
        includesEqualsBooleanRule = new rules.IncludesEqualsBooleanRule();
    });
    it('should not validate for no boolean equality', () => {
        mockFile.setRawContents('someFileContents<formula>IF(Is_Active__c, 1, 2)</formula>some other contents');
        expect(includesEqualsBooleanRule.scan(mockFile).length).to.equal(0);
    });
    it('should validate for a boolean equality', () => {
        mockFile.setRawContents('someFileContents<formula>IF(Is_Active__c = TRUE, 1, 2)</formula>some other contents');
        expect(includesEqualsBooleanRule.scan(mockFile).length).to.equal(1);
    });
    // TODO Tests for the position (ie line number) of the error
});

describe('SkipAutomationRule', () => {
    let mockFile: MetadataMock;
    let skipAutomationRule: rules.SkipAutomationRule;
    const skipAutomationLine = 'NOT($Setup.Configuration__c.Are_Validations_Off__c)';
    beforeEach(() => {
        mockFile = new MetadataMock('fake/file/path.txt');
        skipAutomationRule = new rules.SkipAutomationRule(skipAutomationLine);
    });
    it('should not validate when the line is included', () => {
        mockFile.setRawContents(`someFileContents${skipAutomationLine}some other contents`);
        expect(skipAutomationRule.scan(mockFile).length).to.equal(0);
    });
    it('should validate when the line is not included', () => {
        mockFile.setRawContents('someFileContents<formula>IF(Is_Active__c = TRUE, 1, 2)</formula>some other contents');
        expect(skipAutomationRule.scan(mockFile).length).to.equal(1);
    });
    // TODO Tests for the position (ie line number) of the error
});

describe('DeactivatedMetadataRule', () => {
    let mockFile: MetadataMock;
    let deactivatedMetadataRule: rules.DeactivatedMetadataRule;
    const deactivatedLine = '<status>Inactive</status>';
    const activatedLine = '<status>Active</status>';
    beforeEach(() => {
        mockFile = new MetadataMock('fake/file/path.txt');
        deactivatedMetadataRule = new rules.DeactivatedMetadataRule(activatedLine);
    });
    it('should validate when the deactivated line is included', () => {
        mockFile.setRawContents(`someFileContents${deactivatedLine}some other contents`);
        expect(deactivatedMetadataRule.scan(mockFile).length).to.equal(1);
    });
    it('should not validate when the deactivated line is not included', () => {
        mockFile.setRawContents(`someFileContents${activatedLine}some other contents`);
        expect(deactivatedMetadataRule.scan(mockFile).length).to.equal(0);
    });
});

describe('NamingConventionRule', () => {
    let mockFile: MetadataMock;
    let namingConventionRule: rules.NamingConventionRule;
    const fileNamingConvention = /[A-Z][a-zA-Z0-9_]*/;
    beforeEach(() => {
        namingConventionRule = new rules.NamingConventionRule(fileNamingConvention);
    });
    it('should not validate when the file name matches the pattern', () => {
        mockFile = new MetadataMock('fake/file/Path.field-meta.xml');
        expect(namingConventionRule.scan(mockFile).length).to.equal(0);
    });
    it('should validate when the file name does not match the pattern', () => {
        mockFile = new MetadataMock('fake/file/path.field-meta.xml');
        expect(namingConventionRule.scan(mockFile).length).to.equal(1);
    });
});