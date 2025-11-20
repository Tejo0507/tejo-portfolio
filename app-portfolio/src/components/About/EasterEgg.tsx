import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function EasterEgg() {
  const clickCountRef = useRef(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClick = () => {
    const next = clickCountRef.current + 1
    clickCountRef.current = next

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      clickCountRef.current = 0
    }, 2000)

    if (next >= 3) {
      setIsUnlocked(true)
      clickCountRef.current = 0
    }
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <motion.button
        type="button"
        aria-label="Signature easter egg"
        onClick={handleClick}
        className="rounded-full border border-medium/30 bg-dark/40 px-4 py-2 text-lg font-semibold text-medium shadow-soft transition-colors duration-smooth ease-smooth hover:border-medium/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/50"
        whileTap={{ scale: 0.95 }}
      >
        T.
      </motion.button>
      <span className="text-xs text-medium/70">(tap thrice)</span>

      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            role="dialog"
            aria-label="Secret message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.45, 0.05, 0.25, 0.95] }}
            className="absolute left-1/2 top-full z-20 mt-4 w-64 -translate-x-1/2 rounded-2xl border border-medium/20 bg-dark/90 p-4 text-center text-sm text-medium shadow-depth backdrop-blur"
          >
            <p className="font-semibold">Desk mode activated</p>
            <p className="mt-1 text-medium/80">You found the hidden note. Take a stretch, then keep building.</p>
            <button
              type="button"
              onClick={() => setIsUnlocked(false)}
              className="mt-3 w-full rounded-xl border border-medium/30 px-3 py-2 text-medium/80 transition-colors duration-smooth ease-smooth hover:bg-dark/60"
            >
              Back to work
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
