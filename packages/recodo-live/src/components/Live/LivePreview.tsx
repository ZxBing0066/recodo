import React, { ComponentType, ReactHTML, useContext } from 'react';

import LiveContext from './LiveContext';

const LivePreview = ({ Component = 'div', ...rest }: { Component: keyof ReactHTML | ComponentType }) => {
    const { element: Element } = useContext(LiveContext);

    return <Component {...rest}>{Element && <Element />}</Component>;
};

export default LivePreview;
