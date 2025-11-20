import { memo } from "react"
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import type { SkillMaturityDatum } from "@/data/sampleDashboardStats"
import { motion, useReducedMotion } from "framer-motion"

interface GraphRadialProps {
  data: SkillMaturityDatum[]
}

const GraphRadialComponent = ({ data }: GraphRadialProps) => {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }} animate={prefersReduced ? undefined : { opacity: 1, scale: 1 }}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="20%" outerRadius="90%" barSize={16} data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background dataKey="maturity" cornerRadius={20} fill="#F2E4DC" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">Skill maturity radial chart.</p>
    </motion.div>
  )
}

export const GraphRadial = memo(GraphRadialComponent)
