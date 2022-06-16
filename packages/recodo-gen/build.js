const chokidar = require('chokidar');

const { isComponent: _isComponent, isDoc: _isDoc } = require('./utils');
const { updateHandle } = require('./libs');

module.exports = ({ rootPath, componentRegExp, docRegExp, babelrc, resolver, updateExamples, updateDocs }) => {
    const examples = {};
    const docs = {};

    const isComponent = path => _isComponent(path, componentRegExp);
    const isDoc = path => _isDoc(path, docRegExp);

    const scope = { rootPath, examples, docs, isComponent, isDoc, babelrc, resolver, updateExamples, updateDocs };

    const watcher = chokidar
        .watch(rootPath)
        .on('add', _path => updateHandle(_path, scope))
        .on('change', _path => updateHandle(_path, scope))
        .on('ready', () => {
            watcher.close();
        });
};
