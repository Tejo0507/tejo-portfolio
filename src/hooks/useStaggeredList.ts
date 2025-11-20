import { useMemo } from "react"
import type { MotionProps } from "framer-motion"

export function useStaggeredList(length: number, delayStep = 0.08): MotionProps[] {
  return useMemo(
    () =>
      Array.from({ length }).map((_, index) => ({
        initial: { opacity: 0, y: 12 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { delay: index * delayStep, duration: 0.4, ease: "easeOut" },
        },
      })),
    [length, delayStep]
  )
}
