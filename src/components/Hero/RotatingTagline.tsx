import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface RotatingTaglineProps {
  lines: string[]
  intervalMs?: number
}

export function RotatingTagline({ lines, intervalMs = 2600 }: RotatingTaglineProps) {
  const safeLines = useMemo(() => (lines.length > 0 ? lines : [""]), [lines])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeLines.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [intervalMs, safeLines.length])

  return (
    <div className="h-12 overflow-hidden text-lg font-medium text-medium/90">
      <AnimatePresence mode="wait">
        <motion.p
          key={safeLines[index]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6, ease: [0.45, 0.05, 0.25, 0.95] }}
          className="leading-relaxed text-medium"
        >
          {safeLines[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
