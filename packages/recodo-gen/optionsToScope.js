const { isComponent: _isComponent, isDoc: _isDoc } = require('./utils');

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

module.exports = getScopeByOptions;
