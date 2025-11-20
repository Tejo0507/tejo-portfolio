import { Suspense, type FC } from "react"
import { Desktop } from "@/os/Desktop"
// Hotkeys temporarily disabled to address a Max update depth error; will restore after root cause fixed.

const OSPage: FC = () => {
  // Hotkeys disabled for stability

  return (
    <main className="relative min-h-screen bg-[#1A0F0B] text-[#F7E6D4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,75,67,0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute left-6 top-6 z-10 max-w-md rounded-3xl border border-[#5E4B43]/40 bg-[#120904]/70 p-4 text-sm leading-relaxed">
        <p className="font-semibold uppercase tracking-[0.4em] text-[#5E4B43]">OS workspace</p>
        <p>Drag icons, right-click for actions, and try shortcuts: Alt+Tab to cycle windows, Ctrl+N for Notes, Ctrl+T for Terminal.</p>
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-sm uppercase tracking-[0.5em] text-[#F7E6D4]/60">
            Booting Mini OS…
          </div>
        }
      >
        <Desktop />
      </Suspense>
    </main>
  )
}

export default OSPage
