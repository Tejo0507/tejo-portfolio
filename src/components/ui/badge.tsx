import { cn } from "@/utils"
import type { HTMLAttributes } from "react"

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#5E4B43]/50 px-3 py-1 text-xs uppercase tracking-wide text-[#d8cdc6]",
        className
      )}
      {...props}
    />
  )
}
