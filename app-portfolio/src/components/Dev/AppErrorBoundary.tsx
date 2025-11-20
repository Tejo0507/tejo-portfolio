import React from "react"

interface AppErrorBoundaryState { error: Error | null }

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (typeof console !== "undefined") {
      console.error("[AppErrorBoundary]", error, info)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center text-[#F7E6D4]">
          <h1 className="text-2xl font-semibold">Something broke</h1>
          <p className="max-w-md text-sm text-[#F7E6D4]/80">An unexpected error crashed this view. The UI stays mounted so you can refresh without a total blank. Error message:</p>
          <pre className="overflow-auto rounded-2xl border border-[#5E4B43]/40 bg-[#2E1F1B] p-4 text-left text-xs leading-relaxed">{this.state.error.message}</pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="rounded-2xl border border-[#5E4B43]/50 px-4 py-2 text-sm text-[#F7E6D4]/80 hover:text-[#F7E6D4]"
          >
            Dismiss
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
