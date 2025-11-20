import type { FC } from "react"
import { useLocation } from "react-router-dom"

const RouteErrorBoundary: FC = () => {
  const location = useLocation()

  return (
    <div>
      <h1>Page not found</h1>
      <p>The path "{location.pathname}" does not exist yet.</p>
    </div>
  )
}

export default RouteErrorBoundary
