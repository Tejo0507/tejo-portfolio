import { useEffect } from "react"
import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/AiLab/Sidebar"
import { useAiLabStore, type AiToolId } from "@/store/aiLabStore"
import { AI_TOOL_META, getToolMeta } from "@/data/aiLabTools"

interface ToolContainerProps {
  toolId: AiToolId
  title: string
  description: string
  children: ReactNode
  onReset?: () => void
}

export function ToolContainer({ toolId, title, description, children, onReset }: ToolContainerProps) {
  const setSelectedTool = useAiLabStore((state) => state.setSelectedTool)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setSelectedTool(toolId)
  }, [toolId, setSelectedTool])

  const meta = getToolMeta(toolId)

  return (
    <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
      <Sidebar items={AI_TOOL_META.map((tool) => ({ id: tool.id, title: tool.title, summary: tool.description }))} />
      <motion.section
        layout
        initial={prefersReducedMotion ? false : { opacity: 0, x: 32 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-5 rounded-3xl border border-[#5E4B43]/40 bg-gradient-to-br from-[#2E1F1B]/80 to-[#5E4B43]/40 p-6 shadow-[0_25px_80px_rgba(46,31,27,0.55)]"
      >
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d8cdc6]/70">{meta.difficulty} TOOL</p>
            <h1 className="text-2xl font-semibold text-[#F6F3F0]">{title}</h1>
            <p className="text-sm text-[#f0e5db]/80">{description}</p>
          </div>
          {onReset ? (
            <Button variant="ghost" className="rounded-2xl" onClick={onReset} aria-label="Reset tool state">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          ) : null}
        </header>
        <div className="space-y-4">{children}</div>
      </motion.section>
    </div>
  )
}
