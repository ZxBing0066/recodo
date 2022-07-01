#!/usr/bin/env node

/* eslint-disable node/shebang */
const yargs = require('yargs');

const { isComponent: _isComponent, isDoc: _isDoc } = require('./utils');
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

const getScopeByOptions = ({ componentPath, targetPath, componentRegExp, docRegExp, babelrc, resolver }) => {
    const isComponent = path => _isComponent(path, new RegExp(componentRegExp));
    const isDoc = path => _isDoc(path, new RegExp(docRegExp));

    const scope = {
        // path of component directory
        componentPath,
        // path of target directory for put build file
        targetPath,
        // custom babel file
        babelrc,
        // custom resolver
        resolver,
        isComponent,
        isDoc
    };
    return scope;
};

yargs.command(
    'watch',
    'Watch components change to update docs',
    yargs => yargs.options(sharedOptions),
    (argv = {}) => {
        try {
            watch(getScopeByOptions(argv));
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
            build(getScopeByOptions(argv));
        } catch (error) {
            console.error(error);
        }
    }
);

yargs.demandCommand().strict().argv;
