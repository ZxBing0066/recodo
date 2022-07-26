#!/usr/bin/env node

/* eslint-disable node/shebang */
const yargs = require('yargs');

const watch = require('./watch');
const build = require('./build');

yargs.usage(`
$0 <cmd> [args]
`);

const sharedOptions = {
    componentPath: {
        alias: 'p',
        type: 'string',
        describe: 'Path for find components',
        require: true
    },
    targetPath: {
        alias: 't',
        type: 'string',
        default: 'recodo-gen-output',
        describe: 'Path for place build files'
    },
    babelrc: {
        alias: 'b',
        type: 'string',
        describe: 'Path for custom babelrc file'
    },
    componentRegExp: {
        alias: 'c',
        type: 'string',
        default: '^[^/\\\\]+(\\/|\\\\)[A-Z][A-Za-z_-]*.(j|t)s(x)?$',
        describe: 'RegExp for match component file'
    },
    docRegExp: {
        alias: 'd',
        type: 'string',
        default: '^[^/\\\\]+(\\/|\\\\)[A-Z][A-Za-z_-]*.md(x)?$',
        describe: 'RegExp for match doc file'
    },
    resolver: {
        alias: 'r',
        type: 'string',
        describe: 'Choose type of resolver',
        choices: [
            'findExportedComponentDefinition',
            'findAllComponentDefinitions',
            'findAllExportedComponentDefinitions'
        ],
        default: 'findAllExportedComponentDefinitions'
    }
};

yargs.command(
    'watch',
    'Watch components change to update docs',
    yargs => yargs.options(sharedOptions),
    (argv = {}) => {
        try {
            watch(argv);
        } catch (error) {
            console.error(error);
        }
    }
);

yargs.command(
    'build',
    'Build components docs',
    yargs => yargs.options(sharedOptions),
    (argv = {}) => {
        try {
            build(argv);
        } catch (error) {
            console.error(error);
        }
    }
);

yargs.demandCommand().strict().argv;
