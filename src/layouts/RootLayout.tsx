import type { PropsWithChildren } from "react"
import { cn } from "@/utils"

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className={cn(
          "mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-16",
          "sm:px-10 lg:px-14"
        )}
      >
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.5em] text-primary/60">Portfolio OS</p>
          <p className="font-serif text-2xl text-foreground">Tejo's living lab for craft and study.</p>
        </header>
        <main className="flex-1 pb-16">{children}</main>
        <footer className="text-xs text-muted-foreground">
          Crafted with a two-tone palette to keep the focus on intent over noise.
        </footer>
      </div>
    </div>
  )
}
