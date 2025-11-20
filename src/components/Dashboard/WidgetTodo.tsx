import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle } from "lucide-react"

interface TodoItem {
  id: string
  label: string
  done: boolean
}

const seed: TodoItem[] = [
  { id: "todo-1", label: "Polish AI Lab notes", done: false },
  { id: "todo-2", label: "Record dashboard tour", done: true },
]

export function WidgetTodo() {
  const [todos, setTodos] = useState<TodoItem[]>(seed)
  const [draft, setDraft] = useState("")

  const addTodo = () => {
    if (!draft.trim()) return
    setTodos((items) => [{ id: crypto.randomUUID(), label: draft.trim(), done: false }, ...items])
    setDraft("")
  }

  const toggle = (id: string) => {
    setTodos((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  return (
    <motion.div layout className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4 text-[#F2E4DC]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">Quick todos</p>
      <div className="mt-3 flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add action item"
          className="border-[#5E4B43]/30 bg-[#120906] text-sm"
          onKeyDown={(event) => {
            if (event.key === "Enter") addTodo()
          }}
          aria-label="Add todo"
        />
        <Button type="button" onClick={addTodo} className="bg-[#5E4B43] text-[#120906]">
          Save
        </Button>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {todos.map((todo) => (
          <li key={todo.id}>
            <button
              type="button"
              onClick={() => toggle(todo.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-[#5E4B43]/30 px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5E4B43]"
              aria-pressed={todo.done}
            >
              {todo.done ? <CheckCircle className="h-4 w-4 text-emerald-300" /> : <Circle className="h-4 w-4 text-[#F2E4DC]/50" />}
              <span className={todo.done ? "text-[#F2E4DC]/40 line-through" : "text-[#F2E4DC]"}>{todo.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
