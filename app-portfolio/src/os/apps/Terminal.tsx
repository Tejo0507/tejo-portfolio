import { type FormEvent, useState } from "react"
import { OS_APPS, useOSStore, type OSAppId } from "@/store/osStore"

interface TerminalLine {
  id: string
  prompt: string
  output: string
}

const PROMPT = "walnut-os"

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: "welcome", prompt: PROMPT, output: "Type 'help' to see available commands." },
  ])
  const [command, setCommand] = useState("")
  const launchApp = useOSStore((state) => state.launchApp)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!command.trim()) return
    const input = command.trim()
    const output = runCommand(input, launchApp)
    setLines((prev) => [...prev, { id: `${Date.now()}`, prompt: `${PROMPT} $ ${input}`, output }])
    setCommand("")
  }

  return (
    <div className="flex h-full flex-col rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B] font-mono text-[#CAC7C6] shadow-[0_0_40px_rgba(46,31,27,0.45)]">
      <div className="flex-1 space-y-3 overflow-auto p-4 text-sm">
        {lines.map((line) => (
          <div key={line.id}>
            <p>{line.prompt}</p>
            <p className="text-[#BFA99A]">{line.output}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#5E4B43]/50 px-4 py-3">
        <span className="text-[#5E4B43]">$</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="flex-1 bg-transparent text-[#CAC7C6] placeholder-[#5E4B43]/70 outline-none"
          aria-label="Terminal input"
          autoFocus
        />
      </form>
    </div>
  )
}

function runCommand(input: string, launchApp: (appId: OSAppId) => void) {
  const [command, ...rest] = input.split(/\s+/)
  if (command === "help") {
    return "Commands: help, list, open <app>"
  }
  if (command === "list") {
    return `Apps: ${OS_APPS.map((app) => app.id).join(", ")}`
  }
  if (command === "open") {
    const target = rest[0]
    if (!target) return "Usage: open <app>"
    const match = OS_APPS.find((app) => app.id === target)
    if (match) {
      launchApp(match.id)
      return `Opening ${match.title}…`
    }
    return `Unknown app: ${target}`
  }
  return `Unknown command: ${command}`
}
