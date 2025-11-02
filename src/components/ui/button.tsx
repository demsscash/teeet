import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
  {
    variants: {
      variant: {
        default:
          "btn-primary",
        destructive:
          "btn btn-outline text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 focus-visible:ring-red-500",
        outline:
          "btn-outline border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus-visible:ring-primary-500",
        secondary:
          "btn-secondary bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500",
        ghost:
          "btn-ghost hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus-visible:ring-gray-500",
        link: "text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500",
      },
      size: {
        default: "btn-lg",
        sm: "btn-sm",
        lg: "px-8 py-4 text-base",
        icon: "w-10 h-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
