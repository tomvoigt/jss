import React, { Component, ErrorInfo, ReactNode } from "react";

export interface ErrorBoundaryProps {
    children?: ReactNode;
}

interface ErrorState {
    hasError?: boolean,
    error?: Error,
    errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    // static getDerivedStateFromError(error: Error): ErrorState {
        // Update state so the next render will show the fallback UI.
        // console.log(error);
        // return { hasError: true };
    // }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError || this.state.error) {
            // You can render any custom fallback UI
            return <div>Something went wrong.</div>;
        }
        return this.props.children;
    }
}
export function withErrorBoundary() {
    return function withErrorBoundaryHOC<TComponentProps>(
        Component: React.ComponentType<TComponentProps>,
        errorBoundaryProps?: ErrorBoundaryProps
    ) {
        return function errorWrapper(props: TComponentProps) {
            return (
                <ErrorBoundary {...errorBoundaryProps}>
                    <Component {...props} />
                </ErrorBoundary>
            )
        }
    }
}