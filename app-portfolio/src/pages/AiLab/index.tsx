import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { ToolCard } from "@/components/AiLab/ToolCard"
import { DataUploader } from "@/components/AiLab/DataUploader"
import { ModelPlayground } from "@/components/AiLab/ModelPlayground"
import { AI_TOOL_META } from "@/data/aiLabTools"
import { useAiLabStore } from "@/store/aiLabStore"
import { Button } from "@/components/ui/button"

export default function AiLabPage() {
  const navigate = useNavigate()
  const setSelectedTool = useAiLabStore((state) => state.setSelectedTool)
  const prefersReducedMotion = useReducedMotion()

  const cards = useMemo(() => AI_TOOL_META, [])

  useEffect(() => {
    setSelectedTool(null)
  }, [setSelectedTool])

  const handleOpen = (toolId: typeof cards[number]["id"]) => {
    setSelectedTool(toolId)
    navigate(`/ai-lab/${toolId}`)
  }

  return (
    <div className="space-y-8 bg-gradient-to-b from-[#2E1F1B] via-[#311f1b] to-[#5E4B43]/60 px-4 py-10 text-[#F6F3F0]">
      <motion.section
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B]/60 p-8 shadow-[0_40px_80px_rgba(46,31,27,0.65)]"
      >
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#d8cdc6]/70">
            <Sparkles className="h-4 w-4" /> AI LAB
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[#F6F3F0]">
            Mini AI experiments you can feel and remix right in the browser.
          </h1>
          <p className="text-base text-[#f0e5db]/80">
            Each tool is handcrafted to explain a core concept—classification, clustering, scaling, and more.
            Everything runs locally, so you can explore safely at your own pace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-2xl" onClick={() => handleOpen("image-classification")}>Start with vision</Button>
            <Button variant="ghost" className="rounded-2xl" onClick={() => handleOpen("scaling")}>Jump to data</Button>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataUploader />
        <ModelPlayground />
      </div>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#d8cdc6]/80">Explore</p>
          <h2 className="text-2xl font-semibold text-[#F6F3F0]">Tool dashboard</h2>
          <p className="text-sm text-[#f0e5db]/80">Pick any card to jump into a focused demo.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <ToolCard key={card.id} {...card} onOpen={handleOpen} />
          ))}
        </div>
      </section>
    </div>
  )
}
