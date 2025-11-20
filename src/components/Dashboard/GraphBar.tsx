import { memo } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { ProjectCategoryDatum } from "@/data/sampleDashboardStats"
import { motion, useReducedMotion } from "framer-motion"

interface GraphBarProps {
  data: ProjectCategoryDatum[]
}

const GraphBarComponent = ({ data }: GraphBarProps) => {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div initial={prefersReduced ? undefined : { opacity: 0, y: 12 }} animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 6" stroke="rgba(94,75,67,0.25)" />
            <XAxis dataKey="category" stroke="rgba(247,230,212,0.6)" tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(247,230,212,0.6)" tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "rgba(94,75,67,0.15)" }} contentStyle={{ backgroundColor: "#2E1F1B", borderRadius: 12 }} />
            <Bar dataKey="views" fill="#5E4B43" radius={[12, 12, 0, 0]} isAnimationActive={!prefersReduced} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">Project category distribution chart.</p>
    </motion.div>
  )
}

export const GraphBar = memo(GraphBarComponent)
