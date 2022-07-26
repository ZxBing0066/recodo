const chokidar = require('chokidar');

const { updateHandle, initial } = require('./libs');
const optionsToScope = require('./optionsToScope');

/**
 * 构建文档信息
 * @param {string} scope.componentPath 组件所在的目录
 * @param {string} scope.targetPath 构建的目标目录
 * @param {string} scope.babelrc 自定义 babelrc 文件
 * @param {string} scope.resolver 自定义 resolver
 * @param {string} scope.componentRegExp 组件匹配正则
 * @param {string} scope.docRegExp 文档匹配正则
 * @param {function} scope.callback 构建完成回调
 */
module.exports = scope => {
    return new Promise(resolve => {
        scope = optionsToScope(scope);
        initial(scope);
        const watcher = chokidar
            .watch(scope.componentPath)
            .on('add', _path => updateHandle(_path, scope))
            .on('change', _path => updateHandle(_path, scope))
            .on('ready', () => {
                watcher.close();
                resolve();
                if (scope.callback) scope.callback();
            });
    });
};
