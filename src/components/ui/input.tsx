import * as React from "react"
import { cn } from "@/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-xl border border-[#5E4B43]/40 bg-[#2E1F1B]/40 px-4 text-sm text-[#F6F3F0] placeholder:text-[#d8cdc6]/70",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E4B43] focus-visible:ring-offset-2 ring-offset-[#2E1F1B]",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"
