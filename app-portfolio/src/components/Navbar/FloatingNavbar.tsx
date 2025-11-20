import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Timetable", href: "/timetable" },
  { label: "AI Lab", href: "/ai-lab" },
  { label: "Upcoming Features", href: "/upcoming-features" },
  { label: "Contact", href: "/contact" },
]

export function FloatingNavbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <motion.nav
        aria-label="Primary"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.45, 0.05, 0.25, 0.95] }}
        className="pointer-events-auto w-full max-w-5xl rounded-2xl border border-medium/10 bg-dark/60 text-sm text-medium/90 shadow-depth backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-xs uppercase tracking-[0.3em] text-medium/70">Tejo • Portfolio</span>
          <div className="flex items-center gap-5">
            {navItems.map(({ label, href }) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  [
                    "relative text-sm font-medium tracking-wide text-medium/80 transition-colors duration-smooth ease-smooth",
                    isActive ? "text-medium" : "hover:text-medium",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <span className="group inline-flex flex-col items-center gap-1">
                    <span>{label}</span>
                    <span
                      className={[
                        "block h-0.5 origin-center rounded-full bg-medium transition-all duration-300",
                        isActive ? "w-full opacity-90" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-80",
                      ].join(" ")}
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </motion.nav>
    </div>
  )
}
