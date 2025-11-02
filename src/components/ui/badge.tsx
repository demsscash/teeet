import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "badge inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-white border-0 shadow-soft hover:shadow-medium hover:scale-105",
        secondary:
          "bg-gradient-secondary text-white border-0 shadow-soft hover:shadow-medium hover:scale-105",
        destructive:
          "bg-gradient-danger text-white border-0 shadow-soft hover:shadow-medium hover:scale-105",
        outline:
          "bg-white text-primary-600 border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:shadow-soft",
        success:
          "bg-gradient-success text-white border-0 shadow-soft hover:shadow-medium hover:scale-105",
        warning:
          "bg-gradient-warning text-white border-0 shadow-soft hover:shadow-medium hover:scale-105",
        info:
          "bg-gradient-info text-white border-0 shadow-soft hover:shadow-medium hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
