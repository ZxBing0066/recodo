import React, { ReactNode, useContext } from 'react';

import { anchorCls, anchorIconCls } from './cls';
import Code from './Code';
import { GroupContext } from './Page';

const AnchorIcon = (
    <svg focusable="false" height="16" width="16" version="1.1" viewBox="0 0 16 16" className={anchorIconCls}>
        <path
            fillRule="evenodd"
            d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
    </svg>
);

export const Hn = ({ children, level, node }: { children: ReactNode; level: number; node?: any }) => {
    const { name, subName } = useContext(GroupContext);
    const Component = `h${level}`;

    if (Array.isArray(children) && children.length === 1) {
        children = children[0];
    }

    if (typeof children === 'string') {
        let title = children;
        if (subName !== name) {
            title = subName + '--' + title;
        }
        return React.createElement(Component, {
            children: (
                <>
                    <a href={`#${title}`} id={title} className={anchorCls}>
                        {AnchorIcon}
                    </a>
                    {children}
                </>
            )
        });
    } else {
        return React.createElement(Component, {
            children
        });
    }
};

const components = {
    code: Code,
    pre: 'div',
    h1: Hn,
    h2: Hn,
    h3: Hn,
    h4: Hn,
    h5: Hn,
    h6: Hn
};

export default components;
