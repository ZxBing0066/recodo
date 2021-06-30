import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'recodo-live';

import github from 'prism-react-renderer/themes/github';
import nightOwlLight from 'prism-react-renderer/themes/nightOwlLight';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import shadesOfPurple from 'prism-react-renderer/themes/shadesOfPurple';
import palenight from 'prism-react-renderer/themes/palenight';

const themeList = [github, nightOwlLight, palenight, nightOwl, shadesOfPurple];

import mod from '../mod';
import { DocContext } from './Provider';
import {
    codeCollapseButton,
    codeEditorCls,
    codeErrorCls,
    codeLoadingCls,
    codePreviewCls,
    codeThemeSwitcherCls,
    codeThemeSwitcherCurrentCls,
    codeToolbarCls
} from './cls';

export const ComponentContext = createContext({});

const ThemeSwitcher = ({ current, onChange }) => {
    const clickHandler = useCallback(
        e => {
            const i = (e.target as Element).getAttribute('data-i');
            onChange(i);
        },
        [onChange]
    );
    return (
        <div className={codeThemeSwitcherCls}>
            {themeList.map((theme, i) => (
                <span
                    style={{ background: theme.plain.backgroundColor }}
                    key={i}
                    data-i={i}
                    onClick={clickHandler}
                    className={current == i ? codeThemeSwitcherCurrentCls : ' '}
                ></span>
            ))}
        </div>
    );
};

interface EditorProps {
    live?: boolean;
    render?: boolean;
    noEditor?: boolean;
    static?: boolean;
    code: string;
    language: string;
}
export const Editor = ({ live, render, static: _static, noEditor, code, language }: EditorProps) => {
    const { scope, modules } = useContext(DocContext);
    const [theme, setTheme] = useState(0);
    const [collapse, setCollapse] = useState(true);
    code = (code + '')?.trim?.();

    if (_static) {
        const toolbar = (
            <div className={codeToolbarCls}>
                <span></span>
                <ThemeSwitcher current={theme} onChange={setTheme} />
            </div>
        );
        return (
            <LiveProvider code={code} language={language}>
                {toolbar}
                <div className={codeEditorCls}>
                    <LiveEditor theme={themeList[theme]} disabled />
                </div>
            </LiveProvider>
        );
    }
    if (render || noEditor) {
        return (
            <LiveProvider code={code} language={language} scope={scope} modules={modules}>
                <div className={codePreviewCls}>
                    <LivePreview />
                    <LiveError className={codeErrorCls} />
                </div>
            </LiveProvider>
        );
    }

    const toolbar = (
        <div className={codeToolbarCls}>
            <div className={codeCollapseButton} data-active={collapse} onClick={() => setCollapse(!collapse)}>
                VIEW CODE
            </div>
            <ThemeSwitcher current={theme} onChange={setTheme} />
        </div>
    );
    return (
        <LiveProvider code={code} language={language} scope={scope} modules={modules}>
            <div className={codePreviewCls}>
                <LivePreview />
                <LiveError className={codeErrorCls} />
            </div>
            {toolbar}
            <div className={codeEditorCls} style={{ display: collapse ? 'none' : 'block' }}>
                <LiveEditor theme={themeList[theme]} />
            </div>
        </LiveProvider>
    );
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
        return <span className={codeLoadingCls}>...loading</span>;
    }
    if (error) {
        return <pre className={codeErrorCls}>{error + ''}</pre>;
    }
    return <Editor code={code} {...rest} />;
};
