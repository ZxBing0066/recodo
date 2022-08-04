const { isComponent: _isComponent, isDoc: _isDoc } = require('./utils');

const getScopeByOptions = ({ componentRegExp, docRegExp, ...rest }) => {
    const isComponent = path => _isComponent(path, new RegExp(componentRegExp));
    const isDoc = path => _isDoc(path, new RegExp(docRegExp));

    const scope = {
        isComponent,
        isDoc,
        ...rest
    };
    return scope;
};

module.exports = getScopeByOptions;
