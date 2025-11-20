import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HowItWorksProps {
  steps: string[]
}

export function HowItWorks({ steps }: HowItWorksProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#2E1F1B]/30 p-4">
      <Button
        variant="ghost"
        className="flex w-full items-center justify-between text-left text-[#F6F3F0]"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="how-it-works"
      >
        <span className="text-base font-semibold">How it works</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </Button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.ol
            id="how-it-works"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-4 space-y-3 pl-6 text-sm text-[#f0e5db]"
          >
            {steps.map((step) => (
              <li key={step} className="list-decimal">
                {step}
              </li>
            ))}
          </motion.ol>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
