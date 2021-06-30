import React, { Component, useContext } from 'react';

import LiveContext from '../components/Live/LiveContext';

const errorBoundary = Element => {
    class ErrorBoundary extends Component {
        state = {};
        componentDidCatch(error) {
            const { onError } = this.props;
            onError?.(error);
        }
        static getDerivedStateFromError(error) {
            return { error };
        }
        render() {
            const { error } = this.props;
            if (this.state.error) return null;
            if (error) {
                return null;
            } else {
                try {
                    if (Element == null) return null;
                    return typeof Element === 'function' ? <Element /> : Element;
                } catch (error) {
                    onError?.(error);
                    return null;
                }
            }
        }
    }
    return () => {
        const { error, onError } = useContext(LiveContext);
        return <ErrorBoundary error={error} onError={onError} />;
    };
};

export default errorBoundary;
