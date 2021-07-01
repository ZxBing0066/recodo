## recodo-doc

### 安装

```sh
npm install recodo-doc
```

### 使用

```js
import { Provider, Page } from 'recodo-doc';

export default () => {
    return (
        <Provider content={{ examples, docs }}>
            <Page name={'Component'} />
        </Provider>
    );
};
```

### 演示
