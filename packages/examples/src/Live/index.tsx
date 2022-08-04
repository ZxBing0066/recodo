import React, { HTMLAttributes } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'recodo-live';

const codes = [
    `const D = () => {
    return (
        <div>
            <div>demo</div>
        </div>
    );
}
return <D />`,
    `<div>jsx block</div>`,
    `() => {
    const a = function() {};
    return <div>anonymous function</div>
}`,
    `import React from 'react';
class Demo extends React.Component {
    render() {
        return (
            <div>
            import export class component
            </div>
        );
    }
}
export default Demo;`
];

const Block = (props: HTMLAttributes<HTMLDivElement>) => {
    return <div {...props} style={{ border: '1px solid #ccc', padding: '2em', marginBottom: '1em' }} />;
};

const Live = () => {
    return (
        <>
            {codes.map((code, index) => {
                return (
                    <Block key={index}>
                        <LiveProvider code={code} onError={console.error} modules={{ react: React }}>
                            <LivePreview />
                            <LiveEditor />
                            <LiveError />
                        </LiveProvider>
                    </Block>
                );
            })}
            <Block>
                <LiveProvider
                    code={`/* @jsx jsx */
<div>use custom jsx to render</div>`}
                    onError={console.error}
                    modules={{ react: React }}
                    scope={{ jsx: React.createElement }}
                >
                    <LivePreview />
                    <LiveEditor />
                    <LiveError />
                </LiveProvider>
            </Block>
        </>
    );
};
export default Live;
