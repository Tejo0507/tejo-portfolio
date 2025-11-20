import { AppRouter } from "./router"
import { AppErrorBoundary } from "@/components/Dev/AppErrorBoundary"

export default function App() {
  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-WalnutDark text-WalnutLight antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-8 lg:px-12">
          <AppRouter />
        </div>
      </div>
    </AppErrorBoundary>
  )
}
