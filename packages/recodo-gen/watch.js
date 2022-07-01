const chokidar = require('chokidar');

const { updateHandle, cleanHandle } = require('./libs');

module.exports = scope => {
    chokidar
        .watch(scope.componentPath)
        .on('add', _path => updateHandle(_path, scope))
        .on('change', _path => updateHandle(_path, scope))
        .on('unlink', _path => cleanHandle(_path, scope));
};
