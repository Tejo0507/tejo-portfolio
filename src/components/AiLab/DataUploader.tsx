import { useRef, useState } from "react"
import { Upload, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAiLabStore } from "@/store/aiLabStore"
import type { ScalingMethod } from "@/utils/scaling"

const methods: { label: string; value: ScalingMethod }[] = [
  { label: "Min-Max", value: "min-max" },
  { label: "Standardize", value: "standard" },
]

const parseCsv = (text: string) => {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/)
  const headers = headerLine.split(",").map((h) => h.trim())
  return rows
    .map((row) => {
      const values = row.split(",").map((value) => value.trim())
      if (values.length !== headers.length) return null
      const entry: Record<string, unknown> = {}
      headers.forEach((header, idx) => {
        const numeric = Number(values[idx])
        entry[header] = Number.isNaN(numeric) ? values[idx] : numeric
      })
      return entry
    })
    .filter(Boolean) as Record<string, unknown>[]
}

export function DataUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadedData = useAiLabStore((state) => state.uploadedData)
  const setUploadedData = useAiLabStore((state) => state.setUploadedData)
  const applyScaling = useAiLabStore((state) => state.applyScaling)
  const [method, setMethod] = useState<ScalingMethod>("min-max")
  const [toast, setToast] = useState<string>("")

  const handleFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = String(event.target?.result ?? "")
      const parsed = parseCsv(text)
      setUploadedData({ name: file.name, rows: parsed })
      setToast(`Loaded ${parsed.length} rows from ${file.name}`)
      inputRef.current?.blur()
    }
    reader.readAsText(file)
  }

  const handleScaling = () => {
    const { diagnostics } = applyScaling(method)
    setToast(
      diagnostics.length
        ? `Scaled ${diagnostics.length} values using ${method}`
        : "No numeric columns to scale just yet"
    )
    setTimeout(() => setToast(""), 2600)
  }

  const previewRows = uploadedData?.rows.slice(0, 20) ?? []
  const headers = previewRows[0] ? Object.keys(previewRows[0]) : []
  const dtypeSummary = headers.map((header) => {
    const sample = previewRows[0]?.[header]
    if (typeof sample === "number") return "numeric"
    if (typeof sample === "string") return "text"
    return "unknown"
  })

  return (
    <Card className="border-[#5E4B43]/30 bg-[#2E1F1B]/40">
      <CardHeader>
        <CardTitle className="text-[#F6F3F0]">Data Playground</CardTitle>
        <CardDescription>Upload CSV files, preview rows, and test scaling strategies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="ai-lab-upload">Upload CSV</Label>
            <div className="flex gap-3">
              <Input
                id="ai-lab-upload"
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={(event) => handleFile(event.target.files?.[0])}
                className="cursor-pointer"
              />
              <Button
                variant="ghost"
                className="rounded-2xl"
                onClick={() => handleFile(inputRef.current?.files?.[0] ?? null)}
                aria-label="Process file"
              >
                <Upload className="mr-2 h-4 w-4" />
                Load
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="scaling-method">Scaling Method</Label>
            <div className="flex gap-3">
              <Select
                id="scaling-method"
                value={method}
                onChange={(event) => setMethod(event.target.value as ScalingMethod)}
              >
                {methods.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Button variant="outline" className="rounded-2xl" onClick={handleScaling}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Apply
              </Button>
            </div>
          </div>
        </div>

        {toast ? (
          <div
            role="status"
            className="rounded-2xl border border-[#5E4B43]/40 bg-[#5E4B43]/20 px-4 py-3 text-sm text-[#f7eee5]"
          >
            {toast}
          </div>
        ) : null}

        <div className="space-y-3">
          {headers.length ? (
            <div className="flex flex-wrap gap-2 text-xs text-[#d8cdc6]/90">
              {headers.map((header, idx) => (
                <span
                  key={`dtype-${header}`}
                  className="rounded-full border border-[#5E4B43]/40 px-3 py-1 text-[11px] uppercase tracking-wide"
                >
                  {header} • {dtypeSummary[idx]}
                </span>
              ))}
            </div>
          ) : null}

          <div className="max-h-72 overflow-auto rounded-2xl border border-[#5E4B43]/20 bg-[#2E1F1B]/60">
          <table className="w-full text-left text-sm text-[#F6F3F0]/90">
            <thead className="sticky top-0 bg-[#2E1F1B]">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-3 font-semibold tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, idx) => (
                <tr key={`row-${idx}`} className="border-t border-[#5E4B43]/20">
                  {headers.map((header) => (
                    <td key={`${header}-${idx}`} className="px-4 py-2 text-xs">
                      {String(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
              {!previewRows.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#d8cdc6]/70" colSpan={headers.length || 1}>
                    Upload any CSV or keep the sample data to explore scaling.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
