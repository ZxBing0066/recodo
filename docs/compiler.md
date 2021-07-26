## recodo-compiler

Javascript 运行时代码编译器。

-   支持 JSX
-   支持 import、export

### 安装

```sh
npm install recodo-compiler
```

### 使用

```js
import { transform } from 'recodo-compiler';

const code = `
class MyCom extend Component {
    render() {
        return (
            <div className='my-com'>
                my component
            </div>
        );
    }
}
`;

console.log(transform(code).code);
```

### 演示

<iframe
    src="https://codesandbox.io/embed/recodo-compiler-gewzi?autoresize=1&fontsize=14&hidenavigation=1&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="recodo-compiler"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
