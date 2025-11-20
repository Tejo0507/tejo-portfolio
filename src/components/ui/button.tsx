import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ring-offset-[#2E1F1B]",
  {
    variants: {
      variant: {
        default: "bg-[#5E4B43] text-white shadow hover:bg-[#6d5a51]",
        ghost: "bg-transparent text-[#5E4B43] hover:bg-[#5E4B43]/10",
        outline: "border border-[#5E4B43]/50 text-[#5E4B43] hover:bg-[#5E4B4320]",
        subtle: "bg-[#2E1F1B]/70 text-white hover:bg-[#2E1F1B]/80",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-2xl px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, ...rest } = props
  return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...rest} />
})

Button.displayName = "Button"
