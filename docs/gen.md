## recodo-gen

读取组件的注释和 markdown 文件，生成文档。

### 安装

```sh
npm install recodo-gen
```

### 使用

```sh
npx recodo-gen build -t ./components/button.jsx
```

### 参数

| 参数                  | 说明                            | 格式                                                                                                                       |
| --------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| --help                | Show help                       | [boolean]                                                                                                                  |
| --version             | Show version number             | [boolean]                                                                                                                  |
| -p, --componentPath   | Path for find components        | [string] [required]                                                                                                        |
| -t, --targetPath      | Path for place build files      | [string] [default: "recodo-gen-output"]                                                                                    |
| -b, --babelrc         | Path for custom babelrc file    | [string]                                                                                                                   |
| -c, --componentRegExp | RegExp for match component file | [string] [default: "^[^/\\]+(\/\|\\)[A-Z][a-za-z_-]\*.(j\|t)s(x)?$"]                                                       |
| -d, --docRegExp       | RegExp for match doc file       | [string] [default: "^[^/\\]+(\/\|\\)[A-Z][a-za-z_-]\*.md(x)?$"]                                                            |
| -r, --resolver        | Choose type of resolver         | [string] [choices] "findExportedComponentDefinition", "findAllComponentDefinitions", "findAllExportedComponentDefinitions" |
