import { useMemo, useState } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { tokenize, splitIntoBigrams } from "@/utils/tokenizer"

export default function TextTokenizerTool() {
  const defaultText = "Dreaming up patient interfaces for curious minds."
  const [text, setText] = useState(defaultText)
  const stats = useMemo(() => tokenize(text), [text])
  const bigrams = useMemo(() => splitIntoBigrams(stats.tokens), [stats.tokens])

  const steps = [
    "Normalize by lowercasing and removing punctuation so repeated words align.",
    "Split on whitespace to compute token counts and surface unique vocabulary.",
    "Generate bigrams (pairs) to hint at sequence awareness without heavy models.",
  ]

  const reset = () => setText(defaultText)

  return (
    <ToolContainer
      toolId="tokenizer"
      title="Text Tokenizer"
      description="Peek under the hood of NLP preprocessing."
      onReset={reset}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Plain text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={text} onChange={(event) => setText(event.target.value)} aria-label="Tokenizer text" />
            <p className="mt-2 text-xs text-[#d8cdc6]/70">Tokens: {stats.tokens.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Stats</CardTitle>
            <CardDescription>Frequencies & bigrams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#f0e5db]/80">
            <div className="rounded-2xl bg-[#5E4B43]/20 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d8cdc6]/70">Unique Tokens</p>
              <p className="text-3xl font-semibold text-[#F6F3F0]">{stats.uniqueCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide">Top Words</p>
              <ul className="mt-2 space-y-1">
                {Object.entries(stats.frequency)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([token, count]) => (
                    <li key={token} className="flex items-center justify-between rounded-xl bg-[#2E1F1B]/50 px-3 py-2">
                      <span>{token}</span>
                      <span>{count}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide">Bigrams</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {bigrams.slice(0, 12).map((pair) => (
                  <span key={pair} className="rounded-full border border-[#5E4B43]/30 px-3 py-1">
                    {pair}
                  </span>
                ))}
                {!bigrams.length ? <span>No pairs yet</span> : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}
