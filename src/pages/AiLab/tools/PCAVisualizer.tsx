import { useMemo, useState } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { ScatterPlot } from "@/components/AiLab/ScatterPlot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAiLabStore } from "@/store/aiLabStore"
import { runPCA } from "@/utils/pca"
import { detectNumericFields } from "@/utils/scaling"
import { aiLabSampleData } from "@/data/aiLabSamples"

export default function PCAVisualizerTool() {
  const uploadedData = useAiLabStore((state) => state.uploadedData)
  const [plotKey, setPlotKey] = useState(0)

  const numericMatrix = useMemo(() => {
    const rows = uploadedData?.rows?.length ? uploadedData.rows : aiLabSampleData
    const numericFields = detectNumericFields(rows as Record<string, unknown>[])
    if (numericFields.length < 2) return null
    return rows.map((row) => numericFields.map((field) => Number((row as Record<string, number>)[field])))
  }, [uploadedData])

  const { projected, components } = useMemo(() => {
    if (!numericMatrix) return { projected: [], components: [] }
    return runPCA(numericMatrix)
  }, [numericMatrix])

  const steps = [
    "Take the numeric columns from the data playground (or fallback demo rows).",
    "Center the data, build a covariance matrix, and grab the top two eigenvectors.",
    "Project the samples onto those components to visualize high-dimensional structure in 2D.",
  ]

  const reset = () => setPlotKey((prev) => prev + 1)

  return (
    <ToolContainer
      toolId="pca"
      title="PCA Visualizer"
      description="Minimal 2D projection with handcrafted math."
      onReset={reset}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Projection</CardTitle>
            <CardDescription>{projected.length} points</CardDescription>
          </CardHeader>
          <CardContent>
            <ScatterPlot key={plotKey} points={projected.map((point) => ({ x: point.x, y: point.y }))} />
          </CardContent>
        </Card>
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>Top eigenvectors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#d8cdc6]/80">
            {components.length ? (
              components.map((component, idx) => (
                <div key={`component-${idx}`} className="rounded-2xl bg-[#5E4B43]/20 p-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f0e5db]/70">PC{idx + 1}</p>
                  <p>{component.map((value) => value.toFixed(2)).join(", ")}</p>
                </div>
              ))
            ) : (
              <p>Need at least two numeric features. Upload a dataset with more columns to see PCA.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}
