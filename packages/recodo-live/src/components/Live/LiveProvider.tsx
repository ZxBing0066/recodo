import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Language, PrismTheme } from 'prism-react-renderer';

import LiveContext from './LiveContext';
import { generateElement } from '../../transpile';

const transpile = ({
    code,
    transformCode,
    scope,
    modules
}: {
    code: string;
    transformCode?: (code: string) => string;
    scope?: Record<string, any>;
    modules?: Record<string, any>;
}): [element: React.ComponentType | null, error: Error | null] => {
    let element = null;
    let error = null;
    const input = {
        code: transformCode ? transformCode(code) : code,
        scope,
        modules
    };
    try {
        // if (noInline) {
        //     renderElementAsync(
        //         input,
        //         ele => (element = ele),
        //         err => (error = err)
        //     );
        // } else {
        element = generateElement(input, err => (error = err));
        // }
    } catch (err) {
        element = null;
        error = err as Error;
    }
    return [element, error];
};

const debounce = <T extends (...args: any[]) => any>(fn: T, delay = 100) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return ((...args: any[]) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn(...args);
        }, delay);
    }) as T;
};

const LiveProvider = ({
    children,
    code: _code = '',
    language = 'jsx',
    disabled,
    theme,
    transformCode,
    scope,
    modules,
    onError,
    wait = 500
}: {
    /** LiveEditor, LivePreview, LiveError... */
    children: ReactNode;
    /** default code */
    code: string;
    /** code language */
    language?: Language;
    /** disabled editor */
    disabled?: boolean;
    /** prism theme for editor */
    theme?: PrismTheme;
    /** transform code before compile */
    transformCode?: (code: string) => string;
    /** code exec context */
    scope?: Record<string, any>;
    /** modules support in import or require */
    modules?: Record<string, any>;
    /** error callback */
    onError?: (error: Error) => void;
    /** debounce wait duration to exec code, for better performance or reduce flash */
    wait?: number;
}) => {
    const [error, setError] = useState<Error | null>(null);
    const [element, setElement] = useState<React.ComponentType | null>(null);
    const [code, setCode] = useState(_code);

    const onChange = useMemo(
        () =>
            debounce((code: string) => {
                setCode(code);
            }, wait),
        [wait]
    );

    useEffect(() => {
        const [element, error] = transpile({ code, transformCode, scope, modules });
        setElement(() => element);
        setError(error);
        error && onError?.(error);
    }, [code, transformCode, scope, modules, onError]);

    return (
        <LiveContext.Provider
            value={{
                element,
                error,
                code,
                language,
                theme,
                disabled,
                onError: setError,
                onChange: onChange
            }}
        >
            {children}
        </LiveContext.Provider>
    );
};

export default LiveProvider;
