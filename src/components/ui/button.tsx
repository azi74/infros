import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl",
        outline:
          "border border-glass-border bg-glass-bg backdrop-blur-sm hover:bg-secondary/80 hover:text-secondary-foreground rounded-2xl",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-2xl",
        ghost: "hover:bg-secondary/50 hover:text-foreground rounded-2xl",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass hover:bg-secondary/30 text-foreground rounded-2xl",
        terraform: "bg-gradient-terraform text-background hover:opacity-90 rounded-2xl font-semibold",
        ansible: "bg-gradient-ansible text-foreground hover:opacity-90 rounded-2xl font-semibold",
        hero: "bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-2xl font-semibold shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 rounded-xl",
        lg: "h-14 px-8 py-4 text-base rounded-2xl",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
