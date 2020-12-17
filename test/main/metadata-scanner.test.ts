import { expect } from 'chai';
import * as path from 'path';
import { Metadata, MetadataError } from '../../src/main/metadata-scanner';

describe('Metadata Class', () => {
    it('Should return the path directory', () => {
        const aTestPath = 'this/is/my/test/path.txt';
        const metadata = new Metadata(aTestPath);
        expect(metadata.getPath()).to.equal(aTestPath);
    });
    it('Should return the file contents', () => {
        const metadata = new Metadata(path.join(__dirname, 'resources/testFile.xml'));
        expect(metadata.getRawContents()).to.contain('Test file contents');
    });
    it('Should throw an error for an invalid file path', () => {
        const metadata = new Metadata('this/is/not/a/file/path.txt');
        expect(metadata.getRawContents.bind(metadata)).to.throw(MetadataError);
    });
    it('Should return the parsed file contents', () => {
        const metadata = new Metadata(path.join(__dirname, 'resources/testFile.xml'));
        expect(metadata.getParsedContents()).to.eql({
            TestObject: {
                field1: 'Value 1',
                field2: 'Test file contents'
            }
        });
    });
    it('Should return true for a managed package field', () => {
        const metadata = new Metadata('force-app/main/default/objects/sbqq__Test__c.object-meta.xml');
        expect(metadata.isManagedMetadata()).to.be.true;
    });
    it('Should return false for a non managed package field', () => {
        const metadata = new Metadata('force-app/main/default/objects/Test__c.object-meta.xml');
        expect(metadata.isManagedMetadata()).to.be.false;
    });
});

describe('MetadataScanner class', () => {
    // TODO
    it('Should include a rule when the include is called', () => {});
    it('Should exclude a rule when the exclude is called', () => {});
    it('Should ignore a file when it is added', () => {});
});
