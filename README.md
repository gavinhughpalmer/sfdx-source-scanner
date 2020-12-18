sfdx-source-scanner
=========================

**This product is in beta, please use with caution. Any feedback on the functionality or contributions are welcomed.**

The source scanner will run static analysis on Salesforce source to ensure both best practices and potential errors are avoided. The scanner is configurable, this will allow you to define the rules that are executed, any files that you wish to ignore rules on, the severity of each rule and any specific error messages that should be output when a rule is violated.

[![Version](https://img.shields.io/npm/v/sfdx-source-scanner.svg)](https://npmjs.org/package/sfdx-source-scanner)
[![CircleCI](https://circleci.com/gh/gavinhughpalmer/sfdx-source-scanner/tree/master.svg?style=shield)](https://circleci.com/gh/gavinhughpalmer/sfdx-source-scanner/tree/master)
[![Known Vulnerabilities](https://snyk.io/test/github/gavinhughpalmer/sfdx-source-scanner/badge.svg)](https://snyk.io/test/github/gavinhughpalmer/sfdx-source-scanner)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-source-scanner.svg)](https://npmjs.org/package/sfdx-source-scanner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- toc -->
* [Installation](#installation)
* [Usage](#usage)
* [Rule Sets](#rule-sets)
* [Rule Refrence](#rule-refrence)
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->


<!-- install -->

# Installation
To install the source scanner you can either use NPM or the sfdx plugins command to install as shown below.
```sh-session
$ npm install -g sfdx-source-scanner
```

```sh-session
$ sfdx plugins:install sfdx-source-scanner
```
# Usage
Once the plugin is installed it can be executed using the below [Commands](#commands) section, the plugin expects a rule refrence to be passed in this allows you to configure the rule refrence, there will be more detail below at [Rule Sets](#rule-sets).
<!-- Can we generate this from a file in the repo? -->
```json
{
    "name": "Example Rule Set (All)",
    "description": "This rule set shows all the scanners as enabled",
    "scanners": [
        { "name": "any-file-scanner" },
        { "name": "approval-process-scanner" },
        { "name": "duplicate-rule-scanner" },
        { "name": "flow-scanner" },
        { "name": "field-scanner" },
        { "name": "object-scanner" },
        { "name": "permission-set-scanner" },
        { "name": "quick-action-scanner" },
        { "name": "validation-rule-scanner" },
        { "name": "workflow-scanner" }
    ]
}
```
*Additional example rulesets can be found at [examples](/src/main/config/examples)*

## Commands
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

_See code: [lib/commands/scanner/source/scan.js](https://github.com/gavinhughpalmer/sfdx-source-scanner/blob/v0.0.1/lib/commands/scanner/source/scan.js)_
<!-- commandsstop -->

# Rule Sets
A ruleset will be required to be specified for any project that plans to use the source scanner, this can be provided into the CLI using the `--rulesetfile` argument. An example of all the various parameters that can be provided into the scanner can be found at [example rule set](/src/main/config/examples/rule-set-example.json).

The ruleset is defined as a json file, where the top level elements define,
1. name - this specifies the name assigned to the ruleset.
2. description - This can be used for documentation on the ruleset that is defined
3. scanners - this provdes a list of objects for each scanner that can be included, more details on the object and the fields that can be provided is described below.

Scanner objects, the scanner objects define the scanners that should be running when the scanner is executed. Anything that is not included in the list will not be executed. The scanner consists of 4 fields, name, include, exclude and ignore.

## name
The name describes the name of the scanner to be included, this can be found below (it is the name of the js module), the list is provided below in the [Rule Refrence](#rule-refrence).

## include
The include accepts an array of objects that describes the rules that should be included and how they should be configured, details of what should be provided in here is described below. Any rules that are not in the include will still be included, unless specifically called out in the exclude attribute.
The fields under include are name, severity, errorMessage, ignore and properties

### name
The name is provided as a string which contains the rule refrence (ie the class name of the rule being applied).

### severity
The severity argument will override the severity defined at the class level. This can work in conjunction with the errorlevel argument that gets passed into the CLI to determine what will throw an error when the command is executing.

### errorMessage
The errorMessage argument will override the error message that is provided in the default class implementaton.

### ignore
The ignore parameter will accept a list of file paths which are to be ignored for the current rule execution. Only the full path will be accepted.

### properties
The properties parameter will accept an object to allow for overriding of other parameters in the specific rule. This will accept a name, which is the parameter name in the class, the value will provide the value that should be accepted in this parameter.

## exclude
This parameter accepts an array of rule names (as strings) to exclude from the scanning execution. The name of the rule is defined as the class name that is used in the execution. These are specified below.

## ignore
This parameter accepts an array of file path strings, the file path provided will then be ignored in the scanning execution for the scanner it sits within. This applies for the full scanner level, an additional ignore level can be provided at the rule level. The full path must be provided here, no wildcard paths or partial paths can be entered.

<!-- TODO Can we autogenerate the rule refrence, this could be done with a documentor in the classes -->
# Rule Refrence
The rules are executed by a number of scanners, each scanner is defined for a set of files (based of a file name pattern, mostly the extension for that file), within each scanner a number of rules are defined. A few of the rules are reused across a number of scanners. Below we will go into the detail for each of the scanners and the rules that are available for each.

## Any File Scanner

## Approval Process Scanner

## Duplicate Rule Scanner

## Filed Scanner

## Flow Scanner

## Object Scanner

## Permission Set Scanner

## Quick Action Scanner

## Validation Rule Scanner

## Workflow Rule Scanner
The workflow rule scanner is slightly unique as this actually splits the file up to scan for the components that make up the workflow rule, that is the rule itself, field updates and email alerts

### Workflow Rule

### Field Update Rule

### Email Alert Rule

# Contributing
