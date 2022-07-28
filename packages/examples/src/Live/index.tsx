import React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'recodo-live';

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


const Live = () => {
    return (
        <LiveProvider code={code} onError={console.error} modules={{ react: React }}>
            <LivePreview />
            <LiveEditor />
            <LiveError />
        </LiveProvider>
    );
};
export default Live;
