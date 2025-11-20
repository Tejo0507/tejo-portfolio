import { useMemo } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { DataUploader } from "@/components/AiLab/DataUploader"
import { LineChart } from "@/components/AiLab/LineChart"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAiLabStore } from "@/store/aiLabStore"
import { aiLabSampleData } from "@/data/aiLabSamples"

export default function ScalingPlaygroundTool() {
  const scaledData = useAiLabStore((state) => state.scaledData)
  const chartData = useAiLabStore((state) => state.chartData)
  const uploadedData = useAiLabStore((state) => state.uploadedData)
  const setUploadedData = useAiLabStore((state) => state.setUploadedData)

  const scaledFields = useMemo(() => {
    if (!scaledData.length) return [] as string[]
    return Object.keys(scaledData[0]).filter((field) => field.endsWith("_scaled"))
  }, [scaledData])

  const steps = [
    "Upload data or keep the sample set. Pick min-max or standard scaling.",
    "We compute scaled columns and preview diagnostics instantly.",
    "Charts show normalized values so you can see how scaling stabilizes the range.",
  ]

  const reset = () => {
    setUploadedData({ name: "Sample Sessions", rows: aiLabSampleData.map((row) => ({ ...row })) })
  }

  return (
    <ToolContainer
      toolId="scaling"
      title="Feature Scaling"
      description="Min-max vs. standard scaling with live diagnostics."
      onReset={reset}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <DataUploader />
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Scaled Preview</CardTitle>
            <CardDescription>
              {scaledFields.length ? "New normalized columns" : "Apply scaling to see normalized columns"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scaledFields.length ? (
              <div className="max-h-64 overflow-auto rounded-2xl border border-[#5E4B43]/30">
                <table className="w-full text-left text-xs text-[#F6F3F0]">
                  <thead className="bg-[#2E1F1B]">
                    <tr>
                      {scaledFields.map((field) => (
                        <th key={field} className="px-4 py-2">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scaledData.slice(0, 12).map((row, idx) => (
                      <tr key={`scaled-${idx}`} className="border-t border-[#5E4B43]/20">
                        {scaledFields.map((field) => (
                          <td key={`${field}-${idx}`} className="px-4 py-2">
                            {Number(row[field]).toFixed(3)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-[#d8cdc6]/80">
                Upload a CSV and apply scaling to see normalized fields appended with <code>_scaled</code>.
              </p>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8cdc6]/70">Chart</p>
              <LineChart data={chartData.length ? chartData : [0]} color="#FFCE9E" />
              <p className="text-xs text-[#d8cdc6]/70">Dataset: {uploadedData?.name ?? "n/a"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}
