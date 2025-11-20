import { useMemo, useState } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { addMatrices, determinant, multiplyMatrices, transposeMatrix, type Matrix } from "@/utils/matrix"

const parseMatrix = (text: string): Matrix => {
  return text
    .trim()
    .split(/\n+/)
    .map((row) => row.split(/[,\s]+/).filter(Boolean).map(Number))
}

const formatMatrix = (matrix: Matrix) => matrix.map((row) => row.join(" \u2022 ")).join("\n")

export default function MatrixCalculatorTool() {
  const defaultA = "1,2,3\n4,5,6\n7,8,9"
  const defaultB = "1,0,0\n0,1,0\n0,0,1"
  const [matrixA, setMatrixA] = useState(defaultA)
  const [matrixB, setMatrixB] = useState(defaultB)

  const parsedA = useMemo(() => parseMatrix(matrixA), [matrixA])
  const parsedB = useMemo(() => parseMatrix(matrixB), [matrixB])

  const additions = useMemo(() => safeCompute(() => addMatrices(parsedA, parsedB)), [parsedA, parsedB])
  const mult = useMemo(() => safeCompute(() => multiplyMatrices(parsedA, parsedB)), [parsedA, parsedB])
  const transpose = useMemo(() => safeCompute(() => transposeMatrix(parsedA)), [parsedA])
  const det = useMemo(() => safeCompute(() => determinant(parsedA)), [parsedA])

  const steps = [
    "Paste matrices in CSV form. Rows split on new lines; columns split by commas.",
    "We convert them into number arrays and run simple linear algebra helpers (sum/multiply/transpose).",
    "Use this as a preprocessing checkpoint before feeding matrices into ML workflows.",
  ]

  const reset = () => {
    setMatrixA(defaultA)
    setMatrixB(defaultB)
  }

  return (
    <ToolContainer
      toolId="matrix"
      title="Matrix Calculator"
      description="Quick preprocessing helper for AI pipelines."
      onReset={reset}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Matrix A</CardTitle>
            <CardDescription>Comma-separated rows</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={matrixA} onChange={(event) => setMatrixA(event.target.value)} aria-label="Matrix A" />
          </CardContent>
        </Card>
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Matrix B</CardTitle>
            <CardDescription>Same dimensions for addition</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={matrixB} onChange={(event) => setMatrixB(event.target.value)} aria-label="Matrix B" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <ResultCard title="A + B" data={additions} />
        <ResultCard title="A × B" data={mult} />
        <ResultCard title="Transpose A" data={transpose} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Determinant (A)</CardTitle>
            <CardDescription>Supports 2×2 or 3×3</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-[#F6F3F0]">
              {typeof det === "number" ? det : "Need square matrix"}
            </p>
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}

function ResultCard({ title, data }: { title: string; data: Matrix | string }) {
  return (
    <Card className="bg-[#2E1F1B]/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.isArray(data) ? (
          <pre className="text-sm text-[#F6F3F0]">{formatMatrix(data)}</pre>
        ) : (
          <p className="text-sm text-[#d8cdc6]/80">{data}</p>
        )}
      </CardContent>
    </Card>
  )
}

function safeCompute<T>(fn: () => T): T | string {
  try {
    return fn()
  } catch (error) {
    return error instanceof Error ? error.message : "Unable to compute"
  }
}
