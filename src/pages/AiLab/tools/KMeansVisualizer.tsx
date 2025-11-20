import { useMemo, useState } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { ScatterPlot } from "@/components/AiLab/ScatterPlot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAiLabStore } from "@/store/aiLabStore"
import { generateClusterPoints, runKMeans } from "@/utils/kmeans"
import { detectNumericFields } from "@/utils/scaling"

export default function KMeansVisualizerTool() {
  const uploadedData = useAiLabStore((state) => state.uploadedData)
  const [clusterCount, setClusterCount] = useState(3)
  const [seed, setSeed] = useState(0)

  const datasetPoints = useMemo(() => {
    if (!uploadedData?.rows?.length) return null
    const numericFields = detectNumericFields(uploadedData.rows)
    if (numericFields.length < 2) return null
    return uploadedData.rows.slice(0, 120).map((row) => ({
      x: Number(row[numericFields[0]]),
      y: Number(row[numericFields[1]]),
    }))
  }, [uploadedData])

  const basePoints = useMemo(() => datasetPoints ?? generateClusterPoints(3 + (seed % 3), 18), [datasetPoints, seed])
  const { points, centroids } = useMemo(() => runKMeans([...basePoints], clusterCount), [basePoints, clusterCount])

  const steps = [
    "Take either uploaded CSV rows (first two numeric columns) or synthetic blobs.",
    "Assign each point to the nearest centroid, then recompute the centroid as the cluster mean.",
    "Repeat a few rounds to see clusters settle into a calm arrangement.",
  ]

  const reset = () => {
    setClusterCount(3)
    setSeed((prev) => prev + 1)
  }

  return (
    <ToolContainer
      toolId="kmeans"
      title="K-Means Visualizer"
      description="Watch centroids chase your data around the canvas."
      onReset={reset}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Scatter view</CardTitle>
            <CardDescription>Colored by cluster assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <ScatterPlot points={points} centroids={centroids} />
          </CardContent>
        </Card>
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Adjust clusters or shuffle samples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cluster-count">Clusters</Label>
              <Input
                id="cluster-count"
                type="number"
                min={2}
                max={6}
                value={clusterCount}
                onChange={(event) => setClusterCount(Number(event.target.value))}
              />
            </div>
            <Button variant="ghost" className="rounded-2xl" onClick={() => setSeed((prev) => prev + 1)}>
              Shuffle points
            </Button>
            <p className="text-xs text-[#d8cdc6]/80">
              {datasetPoints ? "Using uploaded dataset" : "Using generated blobs"} — bring your own CSV to see custom clusters.
            </p>
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}
