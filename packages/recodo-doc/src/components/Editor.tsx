import React, { createContext, useState, useEffect } from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'recodo-live';

import mod from '../mod';

export const ComponentContext = createContext({});

interface EditorProps {
    live?: boolean;
    render?: boolean;
    noEditor?: boolean;
    static?: boolean;
    code: string;
    language: string;
}
export const Editor = ({ live, render, static: _static, noEditor, code, language }: EditorProps) => {
    console.log(live, render, _static, noEditor, code, language);

    if (_static) {
        return (
            <Highlight {...defaultProps} code={code.trim()} language={language as Language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={{ ...style, padding: '20px' }}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        );
    }
    if (live) {
        return (
            <LiveProvider code={code.trim()}>
                <LivePreview />
                <LiveEditor />
                <LiveError />
            </LiveProvider>
        );
    }
    return null;
};

export const RemoteEditor = ({ codeUrl, ...rest }: { codeUrl: string } & Omit<EditorProps, 'code'>) => {
    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                let raw = (await mod.import({ file: codeUrl, type: 'raw' })) as string;
                let demoStartMatch = raw.match(/\/\/\s*demo\s*start\s*/);
                let demoStartIndex = demoStartMatch ? demoStartMatch.index + demoStartMatch[0].length : undefined;
                let demoEndMatch = raw.match(/\/\/\s*demo\s*end\s*/);
                let demoEndIndex = demoEndMatch ? demoEndMatch.index : undefined;
                raw = raw.slice(demoStartIndex, demoEndIndex) + '\nreturn <Demo />;';
                if (!mounted) return;
                setCode(raw);
            } catch (error) {
                console.error(error);
                if (!mounted) return;
                setError(error);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return <span>...loading</span>;
    }
    if (error) {
        return <div>{error + ''}</div>;
    }
    return <Editor code={code} {...rest} />;
};
