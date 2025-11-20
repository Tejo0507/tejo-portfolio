import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

export function CursorGradient() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const smoothX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.6 })
  const smoothY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.6 })

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [x, y])

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          left: smoothX,
          top: smoothY,
          background:
            "radial-gradient(circle, rgba(94,75,67,0.45) 0%, rgba(46,31,27,0.05) 45%, rgba(46,31,27,0) 70%)",
          boxShadow: "0 0 120px rgba(94,75,67,0.35)",
        }}
      />
    </div>
  )
}
