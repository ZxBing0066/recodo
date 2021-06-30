import React, { useContext } from 'react';

import LiveContext from './LiveContext';

const LiveError = props => {
    const { error } = useContext(LiveContext);
    return error ? <pre {...props}>{error + ''}</pre> : null;
};
export default LiveError;
