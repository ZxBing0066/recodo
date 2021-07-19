import Node from '../Node.js';

export default class ExportNamedDeclaration extends Node {
    transpile(code, transforms) {
        const { start, end, specifiers } = this;
        let replaceCode = '';
        specifiers.forEach(specifier => {
            replaceCode += `exports.${specifier.local.name} = ${specifier.exported.name};`;
        });
        code.overwrite(start, end, replaceCode);
        super.transpile(code, transforms);
    }
}
