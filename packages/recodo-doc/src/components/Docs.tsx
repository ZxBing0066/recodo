import React, { useContext } from 'react';
import MDX from '@mdx-js/runtime';

import { DocContext } from './Provider';

const Docs = ({ name, subName }: { name: string; subName?: string }) => {
    const { docs } = useContext(DocContext);

    const docInfo = docs?.[name]?.[subName || name]?.info;

    return (
        <div>
            <MDX>{docInfo}</MDX>
        </div>
    );
};

export default Docs;
