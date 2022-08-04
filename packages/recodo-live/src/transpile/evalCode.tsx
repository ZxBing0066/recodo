import React from 'react';

import { Modules, Scope } from '../interface';
import { _poly } from './transform';

const cleanMultipleLineComment = (codeRef: { v: string }) => {
    const _code = codeRef.v.replace(/^\/\*(.|\s)*?\*\//, '').trim();
    const tag = _code.length !== codeRef.v.length;
    codeRef.v = _code;
    return tag;
};
const cleanSingleLineComment = (codeRef: { v: string }) => {
    const _code = codeRef.v.replace(/^\/\/.*/, '').trim();
    const tag = _code.length !== codeRef.v.length;
    codeRef.v = _code;
    return tag;
};

const cleanPreComment = (codeRef: { v: string }) => {
    return cleanMultipleLineComment(codeRef) || cleanSingleLineComment(codeRef);
};

const isJsxBlock = (code: string) => {
    code = code.trim();
    const codeRef = { v: code };
    // clean comment
    while (cleanPreComment(codeRef)) {
        //
    }
    code = codeRef.v;
    return code.startsWith('<') ? code : false;
};

const isSingleAnonymousFunction = (code: string) => {
    code = code.trim().replace(/;$/, '');
    const codeRef = { v: code };
    // clean comment
    while (cleanPreComment(codeRef)) {
        //
    }
    code = codeRef.v;

    if (!code.startsWith('!function') || !code.endsWith('}')) return false;
    const stack: string[] = [];
    const quoteMap: Record<string, 1> = { '"': 1, "'": 1, '`': 1 };
    let firstBeginAngleBracket = false;
    const l = code.length;
    for (let i = 0; i < l; i++) {
        const s = code[i];
        const latestSymbol = stack[stack.length - 1];
        // is in quote
        if (latestSymbol && quoteMap[latestSymbol]) {
            if (s === latestSymbol) {
                stack.pop();
            } else {
                stack.push(s);
            }
        } else {
            if (s === '{') {
                if (!firstBeginAngleBracket) {
                    firstBeginAngleBracket = true;
                } else {
                    stack.push(s);
                }
            } else if (s === '}') {
                if (!firstBeginAngleBracket) return false;
                if (stack.length === 0 && i === l - 1) return code;
                if (latestSymbol === '{') {
                    stack.pop();
                    continue;
                }
                return false;
            }
        }
    }
};

const evalCode = (code: string, scope: Scope = {}, modules: Modules = {}, sourceCode: string) => {
    const scopeKeys = Object.keys(scope);
    const scopeValues = scopeKeys.map(key => scope[key]);

    const codeType =
        code.indexOf('exports.default') >= 0
            ? 'exportsDefault'
            : code.indexOf('module.exports') >= 0
            ? 'moduleExports'
            : 'other';

    code = code.trim();

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
            if (!code) return null;
            // return jsx or a anonymous function
            let _code = isJsxBlock(sourceCode) ? code : isSingleAnonymousFunction(code);
            if (_code) {
                _code = `return (${_code.replace(/^!function/, 'function')})`;
            } else {
                // format of manually return jsx block
                _code = `return (function() {${code}})();`;
            }
            const res = new Function('_poly', 'React', 'require', 'exports', 'module', ...scopeKeys, _code);
            const comp = res(_poly, React, _require, _exports, _module, ...scopeValues);

            return comp;
        }
    }
};

export default evalCode;
