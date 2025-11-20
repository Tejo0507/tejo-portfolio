import * as React from "react"
import { cn } from "@/utils"

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({ className, checked, ...props }, ref) => (
  <button
    ref={ref}
    role="switch"
    aria-checked={checked}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full border border-[#5E4B43]/50 transition-colors",
      checked ? "bg-[#5E4B43]" : "bg-transparent",
      className
    )}
    {...props}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 rounded-full bg-white transition-transform",
        checked ? "translate-x-5" : "translate-x-1"
      )}
    />
  </button>
))
Switch.displayName = "Switch"
