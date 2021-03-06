import React, { HTMLAttributes, useContext } from 'react';

import LiveContext from './LiveContext';

const LiveError = (props: HTMLAttributes<HTMLPreElement>) => {
    const { error } = useContext(LiveContext);
    return error ? (
        <pre {...props}>
            <code>{error + ''}</code>
        </pre>
    ) : null;
};
export default LiveError;
