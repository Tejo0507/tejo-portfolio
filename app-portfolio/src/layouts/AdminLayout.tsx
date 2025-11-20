import type { FC } from "react"
import { Outlet } from "react-router-dom"

export const AdminLayout: FC = () => {
  return (
    <div>
      <header>
        <h1>Admin portal</h1>
      </header>
      <section>
        <Outlet />
      </section>
      <footer>
        <small>Admin footer placeholder</small>
      </footer>
    </div>
  )
}
