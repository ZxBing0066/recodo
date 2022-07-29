import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Language, PrismTheme } from 'prism-react-renderer';

import LiveContext from './LiveContext';
import { generateElement, renderElementAsync } from '../../transpile';

const transpile = ({
    code,
    transformCode,
    scope,
    modules,
    noInline
}: {
    code: string;
    transformCode?: (code: string) => string;
    scope?: Record<string, any>;
    modules?: Record<string, any>;
    noInline?: boolean;
}): [element: React.ComponentType | null, error: Error | null] => {
    let element = null;
    let error = null;
    const input = {
        code: transformCode ? transformCode(code) : code,
        scope,
        modules
    };
    try {
        if (noInline) {
            renderElementAsync(
                input,
                ele => (element = ele),
                err => (error = err)
            );
        } else {
            element = generateElement(input, err => (error = err));
        }
    } catch (err) {
        element = null;
        error = err as Error;
    }
    return [element, error];
};

const LiveProvider = ({
    children,
    code: _code = '',
    language = 'jsx',
    disabled,
    noInline,
    theme,
    transformCode,
    scope,
    modules,
    onError
}: {
    children: ReactNode;
    code: string;
    language?: Language;
    disabled?: boolean;
    noInline?: boolean;
    theme?: PrismTheme;
    transformCode?: (code: string) => string;
    scope?: Record<string, any>;
    modules?: Record<string, any>;
    onError?: (error: Error) => void;
}) => {
    const [error, setError] = useState<Error | null>(null);
    const [element, setElement] = useState<React.ComponentType | null>(null);
    const [code, setCode] = useState(_code);

    const onChange = useCallback((code: string) => {
        setCode(code);
    }, []);

    useEffect(() => {
        const [element, error] = transpile({ code, transformCode, scope, modules, noInline });
        setElement(() => element);
        setError(error);
        error && onError?.(error);
    }, [code, transformCode, scope, modules, noInline, onError]);

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
