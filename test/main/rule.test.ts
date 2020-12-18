import { expect } from 'chai';
import { Severity } from '../../src/main/file-alert';
import { Metadata } from '../../src/main/metadata-scanner';
import { MetadataMock } from './mocks';
import { Rule } from '../../src/main/rule';

class MockRule extends Rule {
    public severity: Severity = Severity.EXTREME;
    public errorMessage: string = 'An error has occured';
    protected lineNumber: number = 2;
    protected violationLine: string = 'The error line';

    public isViolating: boolean;

    protected isViolated(metadata: Metadata): boolean {
        return this.isViolating;
    }
}

describe('Rule Class', () => {
    let mockRule: MockRule;
    const filePath = 'this/is/a/file/path.txt';
    let mockFile = new MetadataMock(filePath);
    beforeEach(() => {
        mockRule = new MockRule();
    });
    it('Should create a violation when enabled', () => {
        mockRule.isViolating = true;
        expect(mockRule.scan(mockFile).length).to.equal(1);
    });
    it('Should not create a violation', () => {
        mockRule.isViolating = false;
        expect(mockRule.scan(mockFile).length).to.equal(0);
    });
    it('Should not create a violation when disabled', () => {
        mockRule.isViolating = true;
        mockRule.disable();
        expect(mockRule.scan(mockFile).length).to.equal(0);
    });
    it('Should not create a violation when file is ignored', () => {
        mockRule.isViolating = true;
        mockRule.ignoreFiles([filePath]);
        expect(mockRule.scan(mockFile).length).to.equal(0);
    });
});
