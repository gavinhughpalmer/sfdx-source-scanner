import { flags, SfdxCommand } from '@salesforce/command';
import { fs, Messages, SfdxError } from '@salesforce/core';
import { RuleSetManager } from '../../../main/config/rule-set-manager';
import { FileAlert } from '../../../main/file-alert';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdx-source-scanner', 'org');

export default class Scan extends SfdxCommand {
    public static description = messages.getMessage('commandDescription');

    public static examples = [
        `$ sfdx config:scan --rulesetfile sfdx-config-rule-set.json --targetdir force-app --errorlevel 2
    Errors in the files have been identified
  `
    ];

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // TODO add formatting options for the results file
        resultsfile: flags.string({ char: 'r', description: messages.getMessage('resultsFileDescription') }),
        rulesetfile: flags.string({
            char: 's',
            description: messages.getMessage('ruleSetFileDescription'),
            required: true
        }),
        targetdir: flags.string({
            char: 'd',
            description: messages.getMessage('targetDirectoryDescription'),
            default: 'force-app'
        }),
        errorlevel: flags.number({ char: 'e', description: messages.getMessage('errorLevelDescription'), default: 3 })
    };

    protected static requiresUsername = false;
    protected static supportsDevhubUsername = false;
    protected static requiresProject = true;

    public async run(): Promise<FileAlert[]> {
        const targetDir = this.flags.targetdir as string;
        const errorLevel = this.flags.errorlevel as number;
        if (errorLevel < 1 || errorLevel > 5) {
            throw new SfdxError(
                'The provided error level sits outside the severity range, enter a number between 1 and 5'
            );
        }
        const ruleSetManager = await RuleSetManager.getRuleSet(this.flags.rulesetfile as string);
        let fileViolations = await ruleSetManager.runRuleSet(targetDir);
        fileViolations = this.flatten(fileViolations);
        if (!!this.flags.resultsfile) {
            // Could use the writeJson, if I can find a way to convert the fileViolations into an AnyJson type
            await fs.writeFile(this.flags.resultsfile as string, JSON.stringify(fileViolations, null, 2));
        } else {
            fileViolations.forEach(violation => this.ux.error(violation));
        }
        const hasFileErrors = fileViolations.reduce((hasErrors, violation) => violation.severity >= errorLevel || hasErrors, false);
        if (hasFileErrors) {
            throw new SfdxError('Errors in the files have been identified');
        }
        return fileViolations;
    }

    private flatten<T>(array: T[]): T[] {
        // to be replaced with fileViolations.flat(1) once made available in JS
        return [].concat.apply([], array);
    }
}
