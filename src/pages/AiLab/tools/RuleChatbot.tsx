import { useState } from "react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  role: "user" | "bot"
  text: string
}

const RULES: { keywords: string[]; reply: string }[] = [
  { keywords: ["hello", "hi"], reply: "Hi there! I'm a tiny rule-based friend happy to chat about AI." },
  { keywords: ["ai", "ml"], reply: "My maker loves pairing human-first UI with transparent machine learning demos." },
  { keywords: ["portfolio", "work"], reply: "You can roam through mini OS widgets, study helpers, and this AI Lab." },
  { keywords: ["thanks", "thank"], reply: "Always glad to help. Want to explore another tool?" },
]

const defaultReply = "I'm a humble scripted bot. Try asking about AI, ML, or the portfolio!"

export default function RuleChatbotTool() {
  const initialBotMessage: Message = {
    role: "bot",
    text: "Hey there! I'm a tiny rule-based mentor. Ask me anything about this AI Lab.",
  }
  const [message, setMessage] = useState("")
  const [history, setHistory] = useState<Message[]>([initialBotMessage])

  const sendMessage = () => {
    if (!message.trim()) return
    const input = message.trim()
    const lower = input.toLowerCase()
    const match = RULES.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword)))
    const reply = match ? match.reply : defaultReply
    setHistory((prev) => [...prev, { role: "user", text: input }, { role: "bot", text: reply }])
    setMessage("")
  }

  const steps = [
    "No API calls—just a deterministic set of keyword rules.",
    "Every message is compared against the keywords, returning the first matching response.",
    "This shows how chat UX can still feel warm even without heavyweight models.",
  ]

  const reset = () => {
    setMessage("")
    setHistory([initialBotMessage])
  }

  return (
    <ToolContainer
      toolId="chatbot"
      title="Pocket Chatbot"
      description="Rule-based friend for gentle nudges."
      onReset={reset}
    >
      <Card className="bg-[#2E1F1B]/60">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>Scripted but empathetic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-72 overflow-auto rounded-2xl border border-[#5E4B43]/30 bg-[#1f1412]/60 p-4 text-sm">
            {history.map((entry, idx) => (
              <div key={`msg-${idx}`} className="mb-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d8cdc6]/70">{entry.role}</p>
                <p className="text-[#F6F3F0]">{entry.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={message}
              placeholder="Ask about AI Lab"
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage()
              }}
            />
            <Button className="rounded-2xl" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}
