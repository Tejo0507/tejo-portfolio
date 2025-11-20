import { useMemo, useState } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/AiLab/LineChart"
import { generateLinearData, normalizeSeries } from "@/utils/aiMath"

export default function NumberPredictorTool() {
  const [value, setValue] = useState(4)
  const data = useMemo(() => generateLinearData(25), [])
  const predicted = Number((3 * value + 2).toFixed(2))
  const normalizedY = normalizeSeries(data.map((point) => point.y))

  const steps = [
    "Sample y = 3x + 2 pairs are generated with tiny noise to mimic data collection.",
    "We normalize the y-series to show how scaling helps a simple line fit stay stable.",
    "Type any x to see the model's closed-form prediction without waiting for training.",
  ]

  const reset = () => setValue(4)

  return (
    <ToolContainer
      toolId="number-predictor"
      title="Number Predictor"
      description="Mini regression sandbox for the line y = 3x + 2."
      onReset={reset}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Predict</CardTitle>
            <CardDescription>Plug in any x value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="predict-x">Input</Label>
              <Input
                id="predict-x"
                type="number"
                value={value}
                min={-10}
                max={10}
                step={0.1}
                onChange={(event) => setValue(Number(event.target.value))}
              />
            </div>
            <div className="rounded-2xl bg-[#5E4B43]/20 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8cdc6]/70">Prediction</p>
              <p className="text-4xl font-semibold text-[#F6F3F0]">{predicted}</p>
              <p className="text-sm text-[#f0e5db]/80">Model formula: y = 3x + 2</p>
            </div>
            <LineChart data={normalizedY} color="#FFCE9E" />
          </CardContent>
        </Card>
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Sample rows</CardTitle>
            <CardDescription>First 12 synthetic points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-auto rounded-2xl border border-[#5E4B43]/30">
              <table className="w-full text-left text-xs text-[#F6F3F0]">
                <thead className="bg-[#2E1F1B]">
                  <tr>
                    <th className="px-4 py-2">x</th>
                    <th className="px-4 py-2">y</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 12).map((point, idx) => (
                    <tr key={`point-${idx}`} className="border-t border-[#5E4B43]/20">
                      <td className="px-4 py-2">{point.x.toFixed(2)}</td>
                      <td className="px-4 py-2">{point.y.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}
