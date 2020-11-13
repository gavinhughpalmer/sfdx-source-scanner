import { Severity } from './file-alert';
import { MetadataFile } from './metadata-scanner';

export abstract class Rule {
    protected severity: Severity;
    protected errorMessage: string;
    protected lineNumber: number;
    protected violationLine: string;
    private enabled: boolean = true;
    private ignoredFiles: Set<string>;

    // This method should not be overridden as it contains validation, the method below can be
    public scan(metadata: MetadataFile): Violation[] {
        if (this.ignoredFiles.has(metadata.getPath()) || !this.enabled) {
            return [];
        }
        return this.scanOverride(metadata);
    }
    protected scanOverride(metadata: MetadataFile): Violation[] {
        if (this.isViolated(metadata)) {
            return [this.createViolation()];
        }
        return [];
    }
    public ignoreFiles(ignoredFiles: string[]) {
        this.ignoredFiles = new Set(ignoredFiles);
    }
    public enable(): void {
        this.enabled = true;
    }
    public disable(): void {
        this.enabled = false;
    }
    protected isViolated(metadata: MetadataFile): boolean {
        return false;
    }
    protected createViolation(): Violation {
        return {
            lineNumber: this.lineNumber,
            errorMessage: this.errorMessage,
            severity: this.severity,
            violationLine: this.violationLine
        };
    }
}

export interface Violation {
    lineNumber?: number;
    violationLine?: string;
    errorMessage: string;
    severity: Severity;
}
