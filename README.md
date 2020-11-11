sfdx-source-scanner
=========================

This package will scan salesforce metadata files to validate for certain rules

[![Version](https://img.shields.io/npm/v/sfdx-source-scanner.svg)](https://npmjs.org/package/sfdx-source-scanner)
[![CircleCI](https://circleci.com/gh/gavinhughpalmer/sfdx-source-scanner/tree/master.svg?style=shield)](https://circleci.com/gh/gavinhughpalmer/sfdx-source-scanner/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/gavinhughpalmer/sfdx-source-scanner?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-source-scanner/branch/master)
[![Codecov](https://codecov.io/gh/gavinhughpalmer/sfdx-source-scanner/branch/master/graph/badge.svg)](https://codecov.io/gh/gavinhughpalmer/sfdx-source-scanner)
[![Greenkeeper](https://badges.greenkeeper.io/gavinhughpalmer/sfdx-source-scanner.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/gavinhughpalmer/sfdx-source-scanner/badge.svg)](https://snyk.io/test/github/gavinhughpalmer/sfdx-source-scanner)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-source-scanner.svg)](https://npmjs.org/package/sfdx-source-scanner)
[![License](https://img.shields.io/npm/l/sfdx-source-scanner.svg)](https://github.com/gavinhughpalmer/sfdx-source-scanner/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-source-scanner
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-source-scanner/0.0.0 darwin-x64 node-v14.13.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx scanner:source:scan -s <string> [-r <string>] [-d <string>] [-e <number>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-scannersourcescan--s-string--r-string--d-string--e-number---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx scanner:source:scan -s <string> [-r <string>] [-d <string>] [-e <number>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

This utility will scan salesforce metadata (in source format) to identify any potential issues, this can be built into CI pipelines to ensure work admins are checking in is up to standard

```
USAGE
  $ sfdx scanner:source:scan -s <string> [-r <string>] [-d <string>] [-e <number>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --targetdir=targetdir                                                         [default: force-app] The directory
                                                                                    that should be targeted whilst
                                                                                    scanning the files

  -e, --errorlevel=errorlevel                                                       [default: 3] The level at which the
                                                                                    severty should raise an error,
                                                                                    otherwise the results will be logged
                                                                                    silently. Numbers range between 1-5,
                                                                                    where 1 is Minor and 5 is Extreme

  -r, --resultsfile=resultsfile                                                     The path to the file that the
                                                                                    results should be written to

  -s, --rulesetfile=rulesetfile                                                     (required) The file path for the
                                                                                    rule set that should be applied

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx config:scan --targetdir force-app --errorlevel 2
       Errors in the files have been identified
```

_See code: [lib/commands/scanner/source/scan.js](https://github.com/gavinhughpalmer/sfdx-source-scanner/blob/v0.0.0/lib/commands/scanner/source/scan.js)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
