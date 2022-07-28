import React, { useContext } from 'react';

import LiveContext from './LiveContext';
import Editor, { CodeEditorProps } from '../Editor';

const LiveEditor = ({ code: codeProp, ...props }: CodeEditorProps) => {
    const { code, language, theme, disabled, onChange } = useContext(LiveContext);

    return (
        <Editor
            theme={theme}
            code={codeProp ?? code ?? ''}
            language={language}
            disabled={disabled}
            onChange={onChange}
            {...props}
        />
    );
};
export default LiveEditor;
