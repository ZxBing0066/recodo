const isComponent = (path, reg) => !!path.match(reg || /\.(j|t)s(x)?$/);
const isDoc = (path, reg) => !!path.match(reg || /\.md(x)?$/);

const getDirName = _path => _path.split('/')[0];
const getDocName = _path => {
    const split = _path.split('/');
    const fileName = split[split.length - 1];
    return fileName.split('.')[0];
};

module.exports = { isComponent, isDoc, getDirName, getDocName };
