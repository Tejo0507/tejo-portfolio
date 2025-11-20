import { useState } from "react"
import { motion } from "framer-motion"
import { useSkillStore } from "@/store/skillStore"

const STORAGE_KEY = "portfolio.currentlyLearning"

interface LearningItem {
  id: string
  title: string
  detail: string
  eta: string
  progress: number
}

const learningItems: LearningItem[] = [
  { id: "rag", title: "LLM Guardrails", detail: "Building safer LangChain workflows.", eta: "2 weeks", progress: 45 },
  { id: "orchestration", title: "Workflow Orchestration", detail: "Temporal-style experiments in TS.", eta: "1 week", progress: 30 },
  { id: "viz", title: "Creative Data Viz", detail: "WebGL sketches for the OS dashboards.", eta: "3 weeks", progress: 50 },
]

type StoredState = Record<string, { progress: number; completed: boolean }>

export default function CurrentlyLearning() {
  const markLearningDone = useSkillStore((state) => state.markLearningDone)
  const [state, setState] = useState<StoredState>(() => {
    if (typeof window === "undefined") return {}
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    try {
      return JSON.parse(raw)
    } catch (error) {
      console.warn("Failed to parse learning state", error)
      return {}
    }
  })

  const persist = (next: StoredState) => {
    setState(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }

  const handleMarkDone = (id: string) => {
    const next = {
      ...state,
      [id]: { progress: 100, completed: true },
    }
    persist(next)
    markLearningDone(id)
  }

  return (
    <section aria-labelledby="currently-learning" className="space-y-4 rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-medium/70">In Focus</p>
          <h2 id="currently-learning" className="text-2xl font-semibold text-medium">
            Currently learning
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {learningItems.map((item) => {
          const stored = state[item.id]
          const progress = stored?.progress ?? item.progress
          const completed = stored?.completed ?? false

          return (
            <motion.article
              key={item.id}
              className="rounded-2xl border border-medium/15 bg-dark/70 p-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: [0.45, 0.05, 0.25, 0.95] }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-medium">{item.title}</h3>
                  <p className="text-sm text-medium/80">{item.detail}</p>
                </div>
                <span className="text-xs text-medium/70">ETA {item.eta}</span>
              </div>
              <div className="mt-3 h-2 rounded-full border border-medium/15 bg-dark/40" aria-hidden>
                <motion.div
                  className="h-full rounded-full bg-medium"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: [0.45, 0.05, 0.25, 0.95] }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-medium/70">
                <span>{progress}% complete</span>
                <button
                  type="button"
                  onClick={() => handleMarkDone(item.id)}
                  disabled={completed}
                  className="rounded-xl border border-medium/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-medium transition-colors duration-smooth ease-smooth hover:bg-dark/60 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {completed ? "Practice logged" : "Mark practice done"}
                </button>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
