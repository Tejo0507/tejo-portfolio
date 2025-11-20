import * as React from "react"
import { cn } from "@/utils"

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-[#5E4B43]/40 bg-[#2E1F1B]/50 px-4 text-sm text-[#F6F3F0]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E4B43] focus-visible:ring-offset-2 ring-offset-[#2E1F1B]",
      className
    )}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = "Select"
