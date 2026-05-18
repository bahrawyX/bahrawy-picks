import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-zinc-800 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white text-zinc-900 shadow hover:bg-white/80",
        secondary:
          "border-transparent bg-zinc-800 text-white hover:bg-zinc-800/80",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-600/80",
        outline: "text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
