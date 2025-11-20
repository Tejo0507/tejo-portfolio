import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/AiLab/LineChart"
import { generateLinearData, gradientStep, meanSquaredError, type LinearPoint } from "@/utils/aiMath"

export function ModelPlayground() {
  const prefersReducedMotion = useReducedMotion()
  const points = useMemo(() => generateLinearData(24), [])
  const [training, setTraining] = useState(false)
  const [slope, setSlope] = useState(1)
  const [intercept, setIntercept] = useState(0)
  const [lossHistory, setLossHistory] = useState<number[]>([])
  const rafRef = useRef<number | null>(null)
  const slopeRef = useRef(1)
  const interceptRef = useRef(0)

  useEffect(() => {
    slopeRef.current = slope
  }, [slope])

  useEffect(() => {
    interceptRef.current = intercept
  }, [intercept])

  useEffect(() => {
    if (!training) {
      cancelAnimationFrame(rafRef.current ?? 0)
      return
    }
    const step = () => {
      const { slope: nextSlope, intercept: nextIntercept, loss } = gradientStep(
        points,
        slopeRef.current,
        interceptRef.current,
        0.03
      )
      setSlope(nextSlope)
      setIntercept(nextIntercept)
      setLossHistory((prev) => [...prev.slice(-60), Number(loss.toFixed(3))])
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current ?? 0)
  }, [training, points])

  const reset = () => {
    setTraining(false)
    setSlope(1)
    setIntercept(0)
    setLossHistory([])
  }

  const baselineLoss = meanSquaredError(points, slope, intercept).toFixed(3)

  return (
    <Card className="border-[#5E4B43]/40 bg-[#2E1F1B]/40">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-[#F6F3F0]">Model Playground</CardTitle>
          <p className="text-sm text-[#d8cdc6]/80">Gradient descent demo for y = 3x + 2</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="rounded-2xl"
            onClick={() => setTraining((prev) => !prev)}
            aria-label={training ? "Pause training" : "Start training"}
          >
            {training ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {training ? "Pause" : "Train"}
          </Button>
          <Button variant="outline" className="rounded-2xl" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <div className="space-y-4">
            <LineChart data={lossHistory} color="#FFCE9E" />
            <div className="grid grid-cols-3 gap-3 text-center text-sm text-[#f0e5db]">
              <div className="rounded-2xl bg-[#2E1F1B]/60 p-3">
                <p className="text-xs uppercase tracking-wide text-[#d8cdc6]/70">Slope</p>
                <p className="text-lg font-semibold">{slope.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-[#2E1F1B]/60 p-3">
                <p className="text-xs uppercase tracking-wide text-[#d8cdc6]/70">Intercept</p>
                <p className="text-lg font-semibold">{intercept.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-[#2E1F1B]/60 p-3">
                <p className="text-xs uppercase tracking-wide text-[#d8cdc6]/70">Loss</p>
                <p className="text-lg font-semibold">{baselineLoss}</p>
              </div>
            </div>
          </div>
          <DatasetPreview points={points} />
        </motion.div>
      </CardContent>
    </Card>
  )
}

function DatasetPreview({ points }: { points: LinearPoint[] }) {
  return (
    <div className="rounded-2xl border border-[#5E4B43]/30 bg-[#2E1F1B]/50 p-4">
      <p className="text-sm font-semibold text-[#F6F3F0]">Training Samples</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#f0e5db]/90">
        {points.slice(0, 10).map((point, idx) => (
          <div key={`point-${idx}`} className="rounded-xl bg-[#5E4B43]/20 px-3 py-2">
            <p className="font-semibold">x = {point.x.toFixed(2)}</p>
            <p className="text-[#d8cdc6]/80">y → {point.y.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
