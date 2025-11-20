import { useMemo, useState } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const LEXICON: Record<string, number> = {
  calm: 2,
  cozy: 1,
  confident: 3,
  excited: 2,
  proud: 2,
  tired: -2,
  anxious: -3,
  unsure: -2,
  frustrated: -3,
  overwhelmed: -2,
  hopeful: 3,
  curious: 1,
}

const LABELS = [
  { range: [-10, -1], label: "Reflective", color: "text-[#FFB4A2]" },
  { range: [0, 2], label: "Balanced", color: "text-[#F6F3F0]" },
  { range: [3, 10], label: "Upbeat", color: "text-[#D4F4C4]" },
]

const analyzeText = (text: string) => {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
  const score = tokens.reduce((total, token) => total + (LEXICON[token] ?? 0), 0)
  const label = LABELS.find((entry) => score >= entry.range[0] && score <= entry.range[1]) ?? LABELS[1]
  return { score, label: label.label, color: label.color, tokens }
}

export default function TextSentimentTool() {
  const defaultText = "I feel curious yet calm about trying new AI tools today."
  const [text, setText] = useState(defaultText)
  const { score, label, color, tokens } = useMemo(() => analyzeText(text), [text])

  const steps = [
    "We clean the sentence, split it into tokens, and search a friendly lexicon of emotional words.",
    "Each token contributes a small positive or negative weight. No API calls, just tiny math.",
    "The final score maps to a tone tag so you can sense how lightweight sentiment models feel.",
  ]

  const reset = () => setText(defaultText)

  return (
    <ToolContainer
      toolId="text-sentiment"
      title="Text Sentiment"
      description="Lexicon-based sentiment explorer for human-friendly copy."
      onReset={reset}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Describe your mood or copy snippet</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={text} onChange={(event) => setText(event.target.value)} aria-label="Sentiment text" />
            <p className="mt-2 text-xs text-[#d8cdc6]/70">All processing stays in your browser.</p>
          </CardContent>
        </Card>
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Instant tone summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-[#5E4B43]/20 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8cdc6]/70">Mood</p>
              <p className={`text-3xl font-semibold ${color}`}>{label}</p>
              <p className="text-sm text-[#f0e5db]/80">Score {score}</p>
            </div>
            <div className="space-y-2 text-xs text-[#d8cdc6]/80">
              <p className="font-semibold uppercase tracking-wide">Tokens</p>
              <div className="flex flex-wrap gap-2">
                {tokens.slice(0, 20).map((token, idx) => (
                  <Badge key={`${token}-${idx}`} className="border-[#5E4B43]/30 text-[#f0e5db]/90">
                    {token}
                  </Badge>
                ))}
                {!tokens.length ? <span>No tokens yet</span> : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}
