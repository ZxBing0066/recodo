import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';

import Code from './Code';

const components = {
    h1: props => <h1 style={{ color: 'tomato' }} {...props} />,
    code: Code
};

interface Content {
    docs?: any;
    examples?: any;
    scope?: Record<string, any>;
    modules?: Record<string, any>;
}

export const DocContext = createContext<Content>({});

interface ProviderProps {
    content: Content | (() => Promise<Content>);
    children: ReactNode;
    scope?: Record<string, any>;
    modules?: Record<string, any>;
}

const Provider = ({ content, children, scope, modules }: ProviderProps) => {
    const [_content, setContent] = useState<Content>(() => (typeof content === 'function' ? null : content));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(() => (typeof content === 'function' ? true : false));

    useEffect(() => {
        let mounted = true;
        if (typeof content === 'function') {
            (async () => {
                try {
                    const result = await content();
                    if (!mounted) return;
                    setContent(result);
                } catch (error) {
                    console.error(error);
                    if (!mounted) return;
                    setError(error);
                } finally {
                    if (!mounted) return;
                    setLoading(false);
                }
            })();
        }
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return <div>loading</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    return (
        <DocContext.Provider value={{ ..._content, scope, modules }}>
            <MDXProvider components={components}>{children}</MDXProvider>
        </DocContext.Provider>
    );
};

export default Provider;
