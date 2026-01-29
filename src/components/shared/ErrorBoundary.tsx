"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="glass-card p-12 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold">Something went wrong</h2>
                    <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest opacity-60 max-w-xs mx-auto">
                        The Connect system encountered a disruption in this sector.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="flex items-center space-x-2 mx-auto bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-xs font-bold transition-all border border-glass-border"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        <span>Try Again</span>
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
