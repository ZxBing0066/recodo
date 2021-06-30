import React, { createContext, useContext } from 'react';

import { codeCls } from './cls';
import { Editor, RemoteEditor } from './Editor';
import { DocContext } from './Provider';

export const CodeContext = createContext<{ name?: string; subName?: string }>({});

const Code = ({ children, className, live = true, render, node, inline }) => {
    const { name, subName } = useContext(CodeContext);
    const { getRemoteUrl } = useContext(DocContext);

    if (inline) return <code>{children}</code>;

    const language = className?.replace(/language-/, '');
    const metastring = node?.data?.meta;
    const metaOptions =
        metastring === 'static'
            ? { static: true }
            : metastring === 'noeditor'
            ? { noEditor: true }
            : metastring
            ? JSON.parse(metastring)
            : {};
    let { static: _static, noEditor, codepath: codePath } = metaOptions;
    if (_static) {
        live = false;
        render = false;
    }
    const options = {
        live,
        render,
        static: _static,
        noEditor,
        language
    };

    if (codePath) {
        const codeUrl = getRemoteUrl ? getRemoteUrl(codePath, name, subName) : codePath;
        return (
            <div className={codeCls}>
                <RemoteEditor {...options} codeUrl={codeUrl} />
            </div>
        );
    }

    return (
        <div className={codeCls}>
            <Editor {...options} code={children} />
        </div>
    );
};
export default Code;
