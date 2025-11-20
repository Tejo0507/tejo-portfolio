import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const whispers = [
  "Every shortcut you master whispers confidence into interviews.",
  "Shipping playful UIs is a love letter to your future teammates.",
  "Stay curious—every bug is just a breadcrumb to mastery.",
  "Great portfolios feel like little operating systems people want to live in.",
]

export default function EasterEgg() {
  const [index, setIndex] = useState(0)
  const quote = useMemo(() => whispers[index], [index])

  const cycleQuote = () => {
    setIndex((prev) => (prev + 1) % whispers.length)
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-[#5E4B43]/40 bg-[#120904] p-6 text-[#F7E6D4]">
      <header className="flex items-center gap-3 text-[#F7E6D4]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F120D]/80">
          <Sparkles className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#5E4B43]">Hidden garden</p>
          <h2 className="text-2xl font-semibold">Soft encouragements</h2>
        </div>
      </header>

      <motion.div
        key={quote}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 rounded-2xl border border-[#5E4B43]/30 bg-[#1C100B] p-4 text-lg leading-relaxed text-[#F7E6D4]"
      >
        {quote}
      </motion.div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={cycleQuote}
        className="rounded-2xl border border-[#5E4B43]/40 bg-[#2E1F1B] px-4 py-3 text-sm uppercase tracking-[0.4em] text-[#F7E6D4]"
      >
        New whisper
      </motion.button>

      <p className="text-xs text-[#F7E6D4]/60">
        Hint: double-click the desktop wallpaper to cycle wallpapers next sprint.
      </p>
    </div>
  )
}
