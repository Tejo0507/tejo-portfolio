import { useMemo } from "react"
import { useOSStore, type OSTheme } from "@/store/osStore"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

const themeOptions: Array<{ id: OSTheme; label: string; description: string; Icon: typeof Sun }> = [
  {
    id: "dark",
    label: "Dusk Mode",
    description: "Deep walnut hues with muted highlights.",
    Icon: Moon,
  },
  {
    id: "light",
    label: "Dawn Mode",
    description: "Soft clay base with warm parchment glow.",
    Icon: Sun,
  },
]

export default function ThemeSwitcher() {
  const theme = useOSStore((state) => state.theme)
  const toggleTheme = useOSStore((state) => state.toggleTheme)
  const setTheme = useOSStore((state) => state.setTheme)

  const activeMeta = useMemo(() => themeOptions.find((option) => option.id === theme), [theme])

  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-[#5E4B43]/40 bg-[#1B110D] p-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-[#5E4B43]">Palette control</p>
        <h2 className="text-2xl font-semibold text-[#F7E6D4]">Choose your mood</h2>
        <p className="text-sm text-[#F7E6D4]/70">
          Toggle between dusk and dawn skins. Shortcuts: <kbd className="rounded bg-[#2E1F1B] px-2">Ctrl</kbd> +
          <kbd className="rounded bg-[#2E1F1B] px-2">Shift</kbd> + <kbd className="rounded bg-[#2E1F1B] px-2">L</kbd> coming soon.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {themeOptions.map(({ id, label, description, Icon }) => {
          const isActive = id === theme
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(id)}
              className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition ${
                isActive ? "border-[#F7E6D4]/60 bg-[#2E1F1B]" : "border-[#5E4B43]/40 bg-[#120904]"
              }`}
            >
              <span className="flex items-center gap-2 text-[#F7E6D4]">
                <Icon className="h-5 w-5" />
                <span className="text-lg font-semibold">{label}</span>
              </span>
              <p className="text-sm text-[#F7E6D4]/70">{description}</p>
            </motion.button>
          )
        })}
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={toggleTheme}
        className="mt-auto rounded-2xl border border-[#5E4B43]/50 bg-[#2E1F1B] px-4 py-3 text-sm uppercase tracking-[0.4em] text-[#F7E6D4]"
      >
        Quick toggle
      </motion.button>

      <div className="rounded-2xl border border-dashed border-[#5E4B43]/30 bg-[#120904] p-4 text-sm text-[#F7E6D4]/70">
        <p>{activeMeta?.description ?? "Preview unavailable."}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#5E4B43]">Currently active · {activeMeta?.label}</p>
      </div>
    </div>
  )
}
