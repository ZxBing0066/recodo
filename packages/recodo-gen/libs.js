const fs = require('fs-extra');
const path = require('path');
const reactDocs = require('react-docgen');
const _ = require('lodash');
const doctrine = require('doctrine');

const { getDirName, getDocName } = require('./utils');

const prepare = (_path, { rootPath, examples, docs }) => {
    const relativePath = path.relative(rootPath, _path);
    const dirName = getDirName(relativePath);
    if (!(dirName in examples)) {
        examples[dirName] = {};
    }
    if (!(dirName in docs)) {
        docs[dirName] = {};
    }
    const example = examples[dirName];
    const doc = docs[dirName];
    return {
        example,
        doc,
        relativePath,
        dirName
    };
};

const updateDescription = info => {
    if (info.description) {
        info.description = doctrine.parse(info.description);
    }
};

const updateJSDOC = info => {
    updateDescription(info);
    _.each(info.methods, updateDescription);
    _.each(info.props, updateDescription);
};

const updateHandle = (_path, scope) => {
    const { isComponent, isDoc, rootPath, babelrc, updateExamples, updateDocs } = scope;
    const { example, doc, relativePath } = prepare(_path, scope);

    if (isComponent(relativePath)) {
        // 组件
        try {
            const componentInfo = reactDocs.parse(
                fs.readFileSync(_path),
                reactDocs.resolver.findAllExportedComponentDefinitions,
                null,
                {
                    filename: _path,
                    cwd: rootPath,
                    configFile: babelrc
                }
            );
            const componentName = componentInfo.displayName;
            const pre = _.find(example, info => {
                return info.path === _path;
            });
            if (pre && pre.name !== componentName) {
                delete example[pre.name];
            }
            updateJSDOC(componentInfo);
            example[componentName] = {
                path: relativePath,
                name: componentName,
                info: componentInfo
            };
            updateExamples(scope.examples);
        } catch (error) {
            if (error.message === 'No suitable component definition found.') {
                // console.error(`${_path} is not a valid component file, please check you glob expression`);
            } else if (error.message === 'did not recognize object of type "ChainExpression"') {
                console.error('由于文档依赖包有些问题，暂时不支持 optional chain 语法，请暂时先不要在组件中使用');
            } else {
                console.error(error);
            }
        }
    } else if (isDoc(relativePath)) {
        // 文档
        const docContent = fs.readFileSync(_path, 'utf8');
        const docName = getDocName(relativePath);
        doc[docName] = {
            path: relativePath,
            name: docName,
            info: docContent
        };
        updateDocs(scope.docs);
    }
};
const cleanHandle = (_path, scope) => {
    const { isComponent, isDoc, updateDocs, updateExamples } = scope;
    const { example, doc } = prepare(_path, scope);

    if (isComponent(_path)) {
        const pre = _.find(example, info => {
            return info.path === _path;
        });
        delete example[pre.displayName];
        updateExamples(scope.examples);
    } else if (isDoc(_path)) {
        const pre = _.find(doc, info => {
            return info.path === _path;
        });
        delete doc[pre.name];
        updateDocs(scope.docs);
    }
};

module.exports = {
    cleanHandle,
    updateHandle
};
