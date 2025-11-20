import type { PropsWithChildren, ReactElement } from "react"
import { Outlet } from "react-router-dom"

export function MainLayout({ children }: PropsWithChildren): ReactElement {
  const content = children ?? <Outlet />

  return (
    <div className="min-h-screen bg-dark text-medium">
      <main>{content}</main>
    </div>
  )
}
