import { Violation } from './rule';

export interface FileAlert extends Violation {
    filePath: string;
}

export enum Severity {
    MINOR = 1,
    LOW,
    MODERATE,
    HIGH,
    EXTREME,
}
