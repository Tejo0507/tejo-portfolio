import * as React from "react"
import { cn } from "@/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[120px] w-full rounded-2xl border border-[#5E4B43]/40 bg-[#2E1F1B]/40 px-4 py-3 text-sm text-[#F6F3F0] placeholder:text-[#d8cdc6]/70",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E4B43] focus-visible:ring-offset-2 ring-offset-[#2E1F1B]",
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"
