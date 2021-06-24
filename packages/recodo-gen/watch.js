const chokidar = require('chokidar');

const { isComponent: _isComponent, isDoc: _isDoc } = require('./utils');
const { updateHandle, cleanHandle } = require('./libs');

module.exports = ({ rootPath, componentRegExp, docRegExp, babelrc, updateExamples, updateDocs }) => {
    const examples = {};
    const docs = {};

    const isComponent = path => _isComponent(path, componentRegExp);
    const isDoc = path => _isDoc(path, docRegExp);

    const scope = { rootPath, examples, docs, isComponent, isDoc, babelrc, updateExamples, updateDocs };

    chokidar
        .watch(rootPath)
        .on('add', _path => updateHandle(_path, scope))
        .on('change', _path => updateHandle(_path, scope))
        .on('unlink', _path => cleanHandle(_path, scope));
};
