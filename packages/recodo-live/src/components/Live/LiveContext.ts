import { Language, PrismTheme } from 'prism-react-renderer';
import React, { createContext } from 'react';

const LiveContext = createContext<{
    code: string;
    language: Language;
    theme?: PrismTheme;
    disabled?: boolean;
    onError?: (error: Error) => void;
    onChange?: (code: string) => void;
    error?: Error | null;
    element?: React.ComponentType | null;
}>({
    code: '',
    language: 'javascript'
});

export default LiveContext;
