import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/utils"

export interface PageTurnPage {
  id: string
  html: string
  label: string
}

interface PageTurnProps {
  pages: PageTurnPage[]
  direction: "forward" | "backward"
  onPrevious: () => void
  onNext: () => void
  isTwoPage: boolean
  className?: string
}

export function PageTurn({ pages, direction, onNext, onPrevious, isTwoPage, className }: PageTurnProps) {
  const prefersReducedMotion = useReducedMotion()

  const variants = {
    enter: (dir: "forward" | "backward") => ({
      rotateY: prefersReducedMotion ? 0 : dir === "forward" ? -35 : 35,
      opacity: prefersReducedMotion ? 1 : 0,
      filter: prefersReducedMotion ? "" : "brightness(0.9)",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      filter: "brightness(1)",
    },
    exit: (dir: "forward" | "backward") => ({
      rotateY: prefersReducedMotion ? 0 : dir === "forward" ? 35 : -35,
      opacity: prefersReducedMotion ? 1 : 0,
      filter: prefersReducedMotion ? "" : "brightness(0.9)",
    }),
  }

  return (
    <div className={cn("relative flex h-full w-full items-stretch", className)} aria-live="polite">
      <button
        type="button"
        aria-label="Go to previous page"
        onClick={onPrevious}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-2 text-[#F7E6D4] shadow-lg shadow-[#2E1F1B]/30 transition hover:bg-[#5E4B43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7E6D4]"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Go to next page"
        onClick={onNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-2 text-[#F7E6D4] shadow-lg shadow-[#2E1F1B]/30 transition hover:bg-[#5E4B43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7E6D4]"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        className={cn(
          "flex w-full flex-1 gap-6 rounded-2xl bg-[#2E1F1B]/80 p-6 text-[#F7E6D4] shadow-2xl shadow-[#2E1F1B]/50",
          isTwoPage ? "flex-row" : "flex-col"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {pages.map((page) => (
            <motion.article
              key={page.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.6,
                ease: "easeInOut",
              }}
              className={cn(
                "flex-1 rounded-2xl border border-[#5E4B43]/40 bg-[#2E1F1B] p-6 text-base leading-relaxed",
                isTwoPage ? "max-w-[50%]" : "w-full"
              )}
            >
              <div className="prose prose-invert max-w-none prose-headings:text-[#F7E6D4] prose-strong:text-[#F7E6D4] prose-a:text-[#F7E6D4]">
                <div dangerouslySetInnerHTML={{ __html: page.html }} aria-label={page.label} />
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
