import Node from '../Node.js';

export default class ExportDefaultDeclaration extends Node {
    transpile(code, transforms) {
        const { start, end, declaration } = this;
        const replaceCode = `module.exports = ${declaration.name};`;
        code.overwrite(start, end, replaceCode);
        super.transpile(code, transforms);
    }
}
