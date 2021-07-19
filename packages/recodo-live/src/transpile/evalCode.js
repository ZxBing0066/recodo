import React from 'react';

import { _poly } from './transform';

const evalCode = (code, scope, modules) => {
    const scopeKeys = Object.keys(scope);
    const scopeValues = scopeKeys.map(key => scope[key]);

    let codeType =
        code.indexOf('exports.default') >= 0
            ? 'exportsDefault'
            : code.indexOf('module.exports') >= 0
            ? 'moduleExports'
            : 'other';

    const _require = name => {
        return modules[name];
    };
    const _exports = {};
    const _module = { exports: _exports };

    switch (codeType) {
        case 'exportsDefault': {
            const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, code);
            res(_poly, React, _require, _exports, _module, ...scopeValues);
            const Component = _exports.default;
            return <Component />;
        }
        case 'moduleExports': {
            const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, code);
            res(_poly, React, _require, _exports, _module, ...scopeValues);
            const Component = _module.exports;
            return <Component />;
        }
        default: {
            code = `return (function() {${code}})();`;
            const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, code);
            return res(_poly, React, _require, _exports, _module, ...scopeValues);
        }
    }
};

export default evalCode;
