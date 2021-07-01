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

<iframe src="https://codesandbox.io/embed/recodo-doc-d6h1v?fontsize=14&hidenavigation=1&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="recodo-doc"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Components

#### Docs

```tsx
import { Provider, Page } from 'recodo-doc';

export default () => {
    return (
        <Provider content={{ examples, docs }}>
            <Docs name="Component" subName="SubComponent" />
        </Provider>
    );
};
```

#### Props

```tsx
import { Provider, Page } from 'recodo-doc';

export default () => {
    return (
        <Provider content={{ examples, docs }}>
            <Props name="Component" subName="SubComponent" />
        </Provider>
    );
};
```
