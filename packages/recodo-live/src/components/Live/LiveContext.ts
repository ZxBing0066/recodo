import { Language, PrismTheme } from 'prism-react-renderer';
import { ReactComponentLike } from 'prop-types';
import { createContext } from 'react';

const LiveContext = createContext<{
    code: string;
    language: Language;
    theme?: PrismTheme;
    disabled?: boolean;
    onError?: (error: Error) => void;
    onChange?: (code: string) => void;
    error?: Error;
    element?: ReactComponentLike;
}>({
    code: '',
    language: 'javascript'
});

export default LiveContext;
