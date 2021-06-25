import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';

import { CodeContext } from './Code';
import { DocContext } from './Provider';

const Docs = ({ name, subName }: { name: string; subName?: string }) => {
    const { docs, components } = useContext(DocContext);
    const docInfo = docs?.[name]?.[subName || name]?.info;

    return (
        <div>
            <CodeContext.Provider value={{ name, subName }}>
                <ReactMarkdown components={components}>{docInfo}</ReactMarkdown>
            </CodeContext.Provider>
        </div>
    );
};

export default Docs;
