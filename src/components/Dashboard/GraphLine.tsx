import { memo } from "react"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import type { WeeklyActivityPoint } from "@/data/sampleDashboardStats"
import { motion, useReducedMotion } from "framer-motion"

interface GraphLineProps {
  data: WeeklyActivityPoint[]
}

const tooltipStyle = {
  backgroundColor: "#2E1F1B",
  border: "1px solid rgba(94,75,67,0.4)",
  borderRadius: "12px",
  color: "#F2E4DC",
  padding: "8px 12px",
}

const GraphLineComponent = ({ data }: GraphLineProps) => {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div initial={prefersReduced ? undefined : { opacity: 0, y: 12 }} animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(94,75,67,0.2)" strokeDasharray="4 8" />
            <XAxis dataKey="week" stroke="rgba(247,230,212,0.6)" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke="rgba(247,230,212,0.6)" tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip cursor={{ stroke: "#5E4B43", strokeWidth: 1 }} contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="visits" stroke="#F2E4DC" strokeWidth={3} dot={false} isAnimationActive={!prefersReduced} />
            <Line type="monotone" dataKey="aiLab" stroke="#5E4B43" strokeWidth={2} dot={false} strokeDasharray="6 6" isAnimationActive={!prefersReduced} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">Weekly visits and AI Lab interactions trend.</p>
    </motion.div>
  )
}

export const GraphLine = memo(GraphLineComponent)
