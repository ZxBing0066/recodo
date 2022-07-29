import React from 'react';

import { Modules, Scope } from '../interface';
import { _poly } from './transform';

const evalCode = (code: string, scope: Scope = {}, modules: Modules = {}) => {
    const scopeKeys = Object.keys(scope);
    const scopeValues = scopeKeys.map(key => scope[key]);

    const codeType =
        code.indexOf('exports.default') >= 0
            ? 'exportsDefault'
            : code.indexOf('module.exports') >= 0
            ? 'moduleExports'
            : 'other';

    const _require = (name: string) => {
        return modules[name];
    };
    const _exports = {};
    const _module = { exports: _exports };
    switch (codeType) {
        case 'exportsDefault': {
            const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, code);
            res(_poly, React, _require, _exports, _module, ...scopeValues);
            const Component = (_exports as { default: React.ComponentType }).default;
            return <Component />;
        }
        case 'moduleExports': {
            const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, code);
            res(_poly, React, _require, _exports, _module, ...scopeValues);
            const Component = _module.exports as React.ComponentType;
            return <Component />;
        }
        default: {
            let comp;
            try {
                // try is that a anonymous function or a jsx block
                const _code = `return (${code.trim().replace(/;$/, '').replace(/^!/, '')})`;
                const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, _code);
                comp = res(_poly, React, _require, _exports, _module, ...scopeValues);
            } catch (error) {
                // format of manually return jsx block
                const _code = `return (function() {${code}})();`;
                const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, _code);
                comp = res(_poly, React, _require, _exports, _module, ...scopeValues);
            }
            // when return a class component or a function component
            if (comp.prototype instanceof React.Component || typeof comp === 'function')
                return React.createElement(comp);

            return comp;
        }
    }
};

export default evalCode;
