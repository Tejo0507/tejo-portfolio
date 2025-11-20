import { useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminAuth } from "@/store/adminAuth"

interface AdminLoginFormProps {
  onSuccess?: () => void
  inline?: boolean
}

export function AdminLoginForm({ onSuccess, inline }: AdminLoginFormProps) {
  const { login, attempts, setInactivityMinutes } = useAdminAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ok = login(password)
    if (!ok) {
      setError("Incorrect passphrase. Try again.")
      return
    }
    setPassword("")
    setError(null)
    setInactivityMinutes(5)
    onSuccess?.()
  }

  const card = (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-3xl border border-[#5E4B43]/40 bg-[#120906]/90 p-8 text-[#F2E4DC] shadow-2xl backdrop-blur"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Admin login</p>
      <h1 className="mt-2 text-3xl font-semibold">Unlock studio</h1>
      <p className="mt-2 text-sm text-[#F2E4DC]/70">Private controls live here. Keep the passphrase safe.</p>

      <label className="mt-8 block space-y-2 text-sm">
        <span>Passphrase</span>
        <Input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error ? (
        <p className="mt-2 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-[#F2E4DC]/50">Attempts: {attempts}</p>

      <Button type="submit" className="mt-6 w-full bg-[#5E4B43] text-[#120906]">
        Unlock
      </Button>
    </form>
  )

  if (inline) {
    return card
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0503] px-6 py-12 text-[#F2E4DC]">
      <div className="w-full max-w-lg">{card}</div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0503] px-6 py-12 text-[#F2E4DC]">
      <div className="w-full max-w-lg">
        <AdminLoginForm />
      </div>
    </div>
  )
}
