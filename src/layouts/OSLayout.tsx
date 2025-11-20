import type { FC } from "react"
import { Outlet } from "react-router-dom"

export const OSLayout: FC = () => {
  return (
    <div>
      <header>
        <h1>OS workspace</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
