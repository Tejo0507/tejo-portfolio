import { memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AiToolId } from "@/store/aiLabStore"

interface ToolCardProps {
  id: AiToolId
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Advanced"
  icon: LucideIcon
  onOpen: (tool: AiToolId) => void
}

export const ToolCard = memo(function ToolCard({ id, title, description, difficulty, icon: Icon, onOpen }: ToolCardProps) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Card className="h-full bg-gradient-to-br from-[#2E1F1B]/90 to-[#5E4B43]/60">
        <CardHeader className="gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-[#2E1F1B]/60 p-3 text-[#f4ebe1] shadow-inner">
                <Icon className="h-6 w-6" />
              </span>
              <CardTitle className="text-[#F6F3F0]">{title}</CardTitle>
            </div>
            <Badge className="border-[#F6F3F0]/20 text-[#F6F3F0]/80">{difficulty}</Badge>
          </div>
          <CardDescription className="text-[#f0e5db]/80">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button onClick={() => onOpen(id)} className="rounded-2xl shadow-lg" aria-label={`Open ${title} tool`}>
            Open Tool
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
})
