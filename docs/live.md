## recodo-live

### 安装

依赖 recodo-compiler

```sh
npm install recodo-compiler recodo-live
```

### 使用

```js
import { LiveProvider, LiveEditor, LivePreview } from 'recodo-live';

const code = `
const D = () => {
    return (
        <div>
            <div>demo</div>
        </div>
    );
}
return <D />
`;

const Demo = () => {
    return (
        <LiveProvider code={code}>
            <LivePreview />
            <LiveEditor />
        </LiveProvider>
    );
};
```

### 演示

<iframe src="https://codesandbox.io/embed/recodo-live-9vb49?fontsize=14&hidenavigation=1&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="recodo-live"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
