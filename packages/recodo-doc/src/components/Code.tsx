import React from 'react';

import { Editor, RemoteEditor } from './Editor';

const Code = ({ children, className, live, render, metastring }) => {
    const language = className.replace(/language-/, '');
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
        return <RemoteEditor {...options} codeUrl={codePath} />;
    }

    return <Editor {...options} code={children} />;
};
export default Code;
