import { Severity } from './file-alert';
import { Metadata } from './metadata-scanner';

export abstract class Rule {
    public severity: Severity;
    public errorMessage: string;
    protected lineNumber: number;
    protected violationLine: string;
    private enabled: boolean = true;
    private ignoredFiles: Set<string> = new Set();

    // This method should not be overridden as it contains validation, the method below can be
    public scan(metadata: Metadata): Violation[] {
        if (this.ignoredFiles.has(metadata.getPath()) || !this.enabled) {
            return [];
        }
        return this.scanOverride(metadata);
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
    protected scanOverride(metadata: Metadata): Violation[] {
        if (this.isViolated(metadata)) {
            return [this.createViolation()];
        }
        return [];
    }
    protected abstract isViolated(metadata: Metadata): boolean;
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
