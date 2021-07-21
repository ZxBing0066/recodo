import React, { createContext, useContext } from 'react';

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
        return <RemoteEditor {...options} codeUrl={codeUrl} />;
    }

    return <Editor {...options} code={children} />;
};
export default Code;
