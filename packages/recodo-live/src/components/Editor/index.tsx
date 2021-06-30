import React, { CSSProperties, Fragment, useCallback, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Highlight, { Language, Prism, PrismTheme } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';

const noop = () => {};

const highlightCode = (code: string, theme: PrismTheme, language: Language) => (
    <Highlight Prism={Prism} code={code} theme={theme} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
            <Fragment>
                {tokens.map((line, i) => (
                    // eslint-disable-next-line react/jsx-key
                    <div {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                            // eslint-disable-next-line react/jsx-key
                            <span {...getTokenProps({ token, key })} />
                        ))}
                    </div>
                ))}
            </Fragment>
        )}
    </Highlight>
);

export interface CodeEditorProps {
    code: string;
    disabled?: boolean;
    language?: Language;
    onChange?: (code: string) => void;
    style?: CSSProperties;
    theme?: PrismTheme;
}

const CodeEditor = ({
    code: _code,
    language = 'javascript',
    onChange = noop,
    style,
    theme = nightOwl as PrismTheme,
    ...rest
}: CodeEditorProps) => {
    const [code, setCode] = useState(_code);
    const _highlightCode = useCallback(code => highlightCode(code, theme, language), [theme]);
    const updateContent = useCallback((code: string) => {
        onChange(code);
        setCode(code);
    }, []);

    return (
        <Editor
            value={code}
            padding={10}
            highlight={_highlightCode}
            onValueChange={updateContent}
            style={{
                whiteSpace: 'pre',
                fontFamily: 'monospace',
                ...(theme.plain as CSSProperties),
                ...style
            }}
            {...rest}
        />
    );
};

export default CodeEditor;
