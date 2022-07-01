const fs = require('fs-extra');
const path = require('path');
const reactDocs = require('react-docgen');
const _ = require('lodash');
const doctrine = require('doctrine');

const { getDirName, getDocName } = require('./utils');

const infoMap = {};
const docMap = {};

const prepare = (_path, { componentPath }) => {
    const relativePath = path.relative(componentPath, _path);
    const name = getDirName(relativePath);
    if (!(name in infoMap)) {
        infoMap[name] = {};
    }
    if (!(name in docMap)) {
        docMap[name] = {};
    }
    const info = infoMap[name];
    const doc = docMap[name];
    return {
        info,
        doc,
        name,
        relativePath
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

const updateIndex = ({ targetPath }) => {
    const index = path.join(targetPath, 'index.js');
    let content = `const infoMap = {`;
    _.each(infoMap, (info, key) => {
        content += `${key}: require('./${key}.info.json'),`;
    });
    content += `};`;
    content += `const docMap = {`;
    _.each(docMap, (info, key) => {
        content += `${key}: require('./${key}.doc.json'),`;
    });
    content += `};`;
    content += `module.exports = { infoMap, docMap };`;
    fs.ensureFileSync(index);
    fs.outputFileSync(index, content);
};

const updateComponentInfo = (name, { targetPath }) => {
    const file = path.join(targetPath, `${name}.info.json`);
    const info = infoMap[name];
    fs.ensureFileSync(file);
    fs.outputFileSync(file, JSON.stringify(info));
    updateIndex({ targetPath });
};

const clearComponentInfo = (name, { targetPath }) => {
    const file = path.join(targetPath, `${name}.info.json`);
    const info = infoMap[name];
    if (Object.keys(info).length === 0) {
        fs.removeSync(file);
    } else {
        fs.outputFileSync(file, JSON.stringify(info));
    }
    updateIndex({ targetPath });
};

const updateComponentDoc = (name, { targetPath }) => {
    const file = path.join(targetPath, `${name}.doc.json`);
    const doc = docMap[name];
    fs.ensureFileSync(file);
    fs.outputFileSync(file, JSON.stringify(doc));
    updateIndex({ targetPath });
};

const clearComponentDoc = (name, { targetPath }) => {
    const file = path.join(targetPath, `${name}.doc.json`);
    const doc = docMap[name];
    if (Object.keys(doc).length === 0) {
        fs.removeSync(file);
    } else {
        fs.outputFileSync(file, JSON.stringify(doc));
    }
    updateIndex({ targetPath });
};

const updateHandle = (_path, scope) => {
    const { isComponent, isDoc, componentPath, babelrc, resolver } = scope;
    const { info, doc, name, relativePath } = prepare(_path, scope);

    if (isComponent(relativePath)) {
        // 组件
        try {
            const componentInfo = reactDocs.parse(fs.readFileSync(_path), reactDocs.resolver[resolver], null, {
                filename: _path,
                cwd: componentPath,
                configFile: babelrc
            });
            // 清理上次数据
            _.each(info, (_info, name) => {
                if (_info.path === relativePath) {
                    delete info[name];
                }
            });
            const isList = Array.isArray(componentInfo);
            const writeComponentInfo = componentInfo => {
                const componentName = componentInfo.displayName;
                updateJSDOC(componentInfo);
                info[componentName] = {
                    path: relativePath,
                    name: componentName,
                    info: componentInfo
                };
            };
            isList ? componentInfo.forEach(writeComponentInfo) : writeComponentInfo(componentInfo);
            updateComponentInfo(name, scope);
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
        updateComponentDoc(name, scope);
    }
};

const cleanHandle = (_path, scope) => {
    const { isComponent, isDoc } = scope;
    const { info, doc, name, relativePath } = prepare(_path, scope);

    if (isComponent(relativePath)) {
        _.each(info, (_info, name) => {
            if (_info.path === relativePath) {
                delete info[name];
            }
        });
        clearComponentInfo(name, scope);
    } else if (isDoc(relativePath)) {
        const pre = _.find(doc, info => {
            return info.path === relativePath;
        });
        delete doc[pre.name];
        clearComponentDoc(name, scope);
    }
};

module.exports = {
    cleanHandle,
    updateHandle
};
