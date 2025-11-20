import type { ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="w-[90%] max-w-md rounded-3xl border border-[#5E4B43]/40 bg-[#1B120D]/95 p-6 shadow-2xl"
            initial={{ y: prefersReducedMotion ? 0 : 24, opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: prefersReducedMotion ? 0 : 24, opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#F2E4DC]">{title}</h2>
              {description ? <p className="text-sm text-[#F2E4DC]/70">{description}</p> : null}
              {children}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className={destructive ? "bg-rose-500 text-white hover:bg-rose-400" : "bg-[#5E4B43] text-[#120906]"}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
              <Button variant="outline" className="border-[#5E4B43]/40 text-[#F2E4DC]" onClick={onCancel}>
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
