import { Metadata, MetadataScanner } from '../../src/main/metadata-scanner';

export class MetadataMock extends Metadata {

    private mockedRawContents: string;
    private mockedParsedContents: object;

    public setRawContents(rawContents: string): void {
        this.mockedRawContents = rawContents;
    }

    public setParsedContents(parsedContents: object): void {
        this.mockedParsedContents = parsedContents;
    }

    public getRawContents(): string {
        return this.mockedRawContents;
    }

    public getParsedContents(): object {
        return this.mockedParsedContents;
    }
}

export class MockMetadataScanner extends MetadataScanner {

}