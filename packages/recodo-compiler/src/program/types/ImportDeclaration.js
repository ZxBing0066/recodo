import Node from '../Node.js';

export default class ImportDeclaration extends Node {
	transpile(code, transforms) {
		const { start, end, source, specifiers } = this;
		const sourceName = source.value
		let importDefaultSpecifier = null;
		let importSpecifiers = [];
		let replaceCode = '';
		specifiers.forEach(specifier => {
			if (specifier.type === 'ImportDefaultSpecifier') {
				importDefaultSpecifier = specifier.local.name;
			} else if (specifier.type === 'ImportSpecifier') {
				importSpecifiers.push({
					imported: specifier.imported.name,
					local: specifier.local.name
				})
			}
		})
		if (importDefaultSpecifier) {
			replaceCode += `const ${importDefaultSpecifier} = __modules['${sourceName}'].__esModule ? __modules['${sourceName}'].default : __modules['${sourceName}'];`;
		}
		if (importSpecifiers.length) {
			replaceCode += `\nconst { ${importSpecifiers.map(({ imported, local }) => imported === local ? imported : `${imported}: ${local}`).join(', ')} } = __modules['${sourceName}'];`;
		}
		code.overwrite(start, end, replaceCode);
		super.transpile(code, transforms);
	}
}
