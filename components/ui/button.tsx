import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "",
        secondary: "",
        ghost: "",
        link: "hover:translate-y-0",
      },
      tone: {
        current: "",
        blue: "",
        purple: "",
        black: "",
        navy: "",
        white: "",
        "transparent-white": "",
      },
      size: {
        xs: "h-8 px-2.5 text-xs",
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
      radius: {
        sm: "rounded-sm",
        default: "rounded-md",
        lg: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
      width: {
        auto: "",
        full: "w-full",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        tone: "current",
        class: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm",
      },
      {
        variant: "default",
        tone: "blue",
        class: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-sm",
      },
      {
        variant: "default",
        tone: "purple",
        class: "bg-violet-700 text-white hover:bg-violet-800 hover:shadow-sm",
      },
      {
        variant: "default",
        tone: "black",
        class: "bg-slate-900 text-white hover:bg-black hover:shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
      },
      {
        variant: "outline",
        tone: "current",
        class: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      {
        variant: "outline",
        tone: "blue",
        class: "border border-blue-600 bg-transparent text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950/40",
      },
      {
        variant: "outline",
        tone: "purple",
        class: "border border-violet-700 bg-transparent text-violet-800 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/40",
      },
      {
        variant: "outline",
        tone: "black",
        class: "border border-slate-900 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-slate-200 dark:text-slate-100 dark:hover:bg-slate-800",
      },
      {
        variant: "secondary",
        tone: "current",
        class: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm",
      },
      {
        variant: "secondary",
        tone: "blue",
        class: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/60",
      },
      {
        variant: "secondary",
        tone: "purple",
        class: "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-950/60",
      },
      {
        variant: "secondary",
        tone: "black",
        class: "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      },
      {
        variant: "ghost",
        tone: "current",
        class: "hover:bg-accent hover:text-accent-foreground",
      },
      {
        variant: "ghost",
        tone: "blue",
        class: "text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-200",
      },
      {
        variant: "ghost",
        tone: "purple",
        class: "text-violet-700 hover:bg-violet-50 hover:text-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/40 dark:hover:text-violet-200",
      },
      {
        variant: "ghost",
        tone: "black",
        class: "text-slate-900 hover:bg-slate-100 hover:text-black dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white",
      },
      {
        variant: "link",
        tone: "current",
        class: "text-primary underline-offset-4 hover:underline",
      },
      {
        variant: "link",
        tone: "blue",
        class: "text-blue-700 underline-offset-4 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200",
      },
      {
        variant: "link",
        tone: "purple",
        class: "text-violet-700 underline-offset-4 hover:text-violet-800 hover:underline dark:text-violet-300 dark:hover:text-violet-200",
      },
      {
        variant: "link",
        tone: "black",
        class: "text-slate-900 underline-offset-4 hover:text-black hover:underline dark:text-slate-100 dark:hover:text-white",
      },
      {
        variant: "default",
        tone: "navy",
        class: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-sm dark:bg-slate-950 dark:hover:bg-slate-900",
      },
      {
        variant: "default",
        tone: "white",
        class: "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
      },
      {
        variant: "default",
        tone: "transparent-white",
        class: "bg-transparent border border-white text-white hover:bg-white/10 dark:hover:bg-white/20",
      },
      {
        variant: "outline",
        tone: "navy",
        class: "border border-slate-900 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
      },
      {
        variant: "outline",
        tone: "white",
        class: "border border-white bg-transparent text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/20",
      },
      {
        variant: "outline",
        tone: "transparent-white",
        class: "border border-white bg-transparent text-white hover:bg-white/10 dark:hover:bg-white/20",
      },
      {
        variant: "secondary",
        tone: "navy",
        class: "bg-slate-800 text-slate-100 hover:bg-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
      },
      {
        variant: "secondary",
        tone: "white",
        class: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100",
      },
      {
        variant: "secondary",
        tone: "transparent-white",
        class: "bg-white/20 text-white hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20",
      },
      {
        variant: "ghost",
        tone: "navy",
        class: "text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100",
      },
      {
        variant: "ghost",
        tone: "white",
        class: "text-white hover:bg-white/10 hover:text-white dark:text-white dark:hover:bg-white/20 dark:hover:text-white",
      },
      {
        variant: "ghost",
        tone: "transparent-white",
        class: "text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/20",
      },
      {
        variant: "link",
        tone: "navy",
        class: "text-slate-900 underline-offset-4 hover:text-slate-700 hover:underline dark:text-slate-100 dark:hover:text-slate-200",
      },
      {
        variant: "link",
        tone: "white",
        class: "text-white underline-offset-4 hover:text-slate-200 hover:underline dark:text-white dark:hover:text-slate-100",
      },
      {
        variant: "link",
        tone: "transparent-white",
        class: "text-white underline-offset-4 hover:text-slate-200 hover:underline dark:text-white dark:hover:text-slate-100",
      },
    ],
    defaultVariants: {
      variant: "default",
      tone: "current",
      size: "default",
      radius: "default",
      width: "auto",
    },
  }
)

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
export type ButtonTone = NonNullable<VariantProps<typeof buttonVariants>["tone"]>
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      tone,
      size,
      radius,
      width,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, tone, size, radius, width, className })
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
