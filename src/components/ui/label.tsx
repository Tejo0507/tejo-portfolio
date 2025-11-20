import * as React from "react"
import { cn } from "@/utils"

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium text-[#F6F3F0]/80", className)} {...props} />
  )
)
Label.displayName = "Label"
