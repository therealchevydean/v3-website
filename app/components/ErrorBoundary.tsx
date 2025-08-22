"use client";
import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }
  componentDidCatch(error: any, info: any) {
    // Optional: log somewhere
    console.error("Map error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
          Failed to render map. {this.state.message && <span className="opacity-80">({this.state.message})</span>}
        </div>
      );
    }
    return this.props.children;
  }
}
