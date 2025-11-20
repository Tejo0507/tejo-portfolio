import { motion, type MotionProps } from "framer-motion"
import { cn } from "@/utils"

export type MiniFeatureCardProps = {
  title: string
  description: string
  statusLabel?: string
  motionProps?: MotionProps
}

const baseVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export function MiniFeatureCard({ title, description, statusLabel, motionProps }: MiniFeatureCardProps) {
  return (
    <motion.article
      variants={baseVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...motionProps}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/90 px-5 py-6",
        "text-left shadow-[0_12px_45px_rgba(46,31,27,0.35)]"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground/95 tracking-wide">{title}</h3>
        {statusLabel ? (
          <span className="rounded-full border border-primary/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary/80">
            {statusLabel}
          </span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.article>
  )
}
