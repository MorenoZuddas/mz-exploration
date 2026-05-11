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
        class: "bg-[var(--color-comp-btn-blue-bg)] text-[var(--color-comp-btn-blue-text)] hover:bg-[var(--color-comp-btn-blue-bg-hover)] hover:shadow-sm",
      },
      {
        variant: "default",
        tone: "purple",
        class: "bg-[var(--color-comp-btn-purple-bg)] text-[var(--color-comp-btn-purple-text)] hover:bg-[var(--color-comp-btn-purple-bg-hover)] hover:shadow-sm",
      },
      {
        variant: "default",
        tone: "black",
        class: "bg-[var(--color-comp-btn-black-bg)] text-[var(--color-comp-btn-black-text)] hover:bg-[var(--color-comp-btn-black-bg-hover)] hover:shadow-sm",
      },
      {
        variant: "outline",
        tone: "current",
        class: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      {
        variant: "outline",
        tone: "blue",
        class: "border border-[var(--color-comp-btn-blue-outline-border)] bg-transparent text-[var(--color-comp-btn-blue-outline-text)] hover:bg-[var(--color-comp-btn-blue-outline-bg-hover)]",
      },
      {
        variant: "outline",
        tone: "purple",
        class: "border border-[var(--color-comp-btn-purple-outline-border)] bg-transparent text-[var(--color-comp-btn-purple-outline-text)] hover:bg-[var(--color-comp-btn-purple-outline-bg-hover)]",
      },
      {
        variant: "outline",
        tone: "black",
        class: "border border-[var(--color-comp-btn-black-outline-border)] bg-transparent text-[var(--color-comp-btn-black-outline-text)] hover:bg-[var(--color-comp-btn-black-outline-bg-hover)]",
      },
      {
        variant: "secondary",
        tone: "current",
        class: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm",
      },
      {
        variant: "secondary",
        tone: "blue",
        class: "bg-[var(--color-comp-btn-blue-secondary-bg)] text-[var(--color-comp-btn-blue-secondary-text)] hover:bg-[var(--color-comp-btn-blue-secondary-bg-hover)]",
      },
      {
        variant: "secondary",
        tone: "purple",
        class: "bg-[var(--color-comp-btn-purple-secondary-bg)] text-[var(--color-comp-btn-purple-secondary-text)] hover:bg-[var(--color-comp-btn-purple-secondary-bg-hover)]",
      },
      {
        variant: "secondary",
        tone: "black",
        class: "bg-[var(--color-comp-btn-black-secondary-bg)] text-[var(--color-comp-btn-black-secondary-text)] hover:bg-[var(--color-comp-btn-black-secondary-bg-hover)]",
      },
      {
        variant: "ghost",
        tone: "current",
        class: "hover:bg-accent hover:text-accent-foreground",
      },
      {
        variant: "ghost",
        tone: "blue",
        class: "text-[var(--color-comp-btn-blue-ghost-text)] hover:bg-[var(--color-comp-btn-blue-ghost-bg-hover)] hover:text-[var(--color-comp-btn-blue-outline-text)]",
      },
      {
        variant: "ghost",
        tone: "purple",
        class: "text-[var(--color-comp-btn-purple-ghost-text)] hover:bg-[var(--color-comp-btn-purple-ghost-bg-hover)] hover:text-[var(--color-comp-btn-purple-outline-text)]",
      },
      {
        variant: "ghost",
        tone: "black",
        class: "text-[var(--color-comp-btn-black-ghost-text)] hover:bg-[var(--color-comp-btn-black-ghost-bg-hover)] hover:text-[var(--color-comp-btn-black-bg-hover)]",
      },
      {
        variant: "link",
        tone: "current",
        class: "text-primary underline-offset-4 hover:underline",
      },
      {
        variant: "link",
        tone: "blue",
        class: "text-[var(--color-comp-btn-blue-outline-text)] underline-offset-4 hover:text-[var(--color-comp-btn-blue-bg-hover)] hover:underline",
      },
      {
        variant: "link",
        tone: "purple",
        class: "text-[var(--color-comp-btn-purple-outline-text)] underline-offset-4 hover:text-[var(--color-comp-btn-purple-bg-hover)] hover:underline",
      },
      {
        variant: "link",
        tone: "black",
        class: "text-[var(--color-comp-btn-black-outline-text)] underline-offset-4 hover:text-[var(--color-comp-btn-black-bg-hover)] hover:underline",
      },
      {
        variant: "default",
        tone: "navy",
        class: "bg-[var(--color-comp-btn-navy-bg)] text-[var(--color-comp-btn-black-text)] hover:bg-[var(--color-comp-btn-navy-bg-hover)] hover:shadow-sm",
      },
      {
        variant: "default",
        tone: "white",
        class: "bg-[var(--color-comp-btn-white-bg)] text-[var(--color-comp-btn-white-text)] hover:bg-[var(--color-comp-btn-white-bg-hover)] hover:shadow-sm",
      },
      {
        variant: "default",
        tone: "transparent-white",
        class: "bg-transparent border border-white text-white hover:bg-white/10 dark:hover:bg-white/20",
      },
      {
        variant: "outline",
        tone: "navy",
        class: "border border-[var(--color-comp-btn-black-outline-border)] bg-transparent text-[var(--color-comp-btn-black-outline-text)] hover:bg-[var(--color-comp-btn-black-outline-bg-hover)]",
      },
      {
        variant: "outline",
        tone: "white",
        class: "border border-white bg-transparent text-white hover:bg-white/10 dark:hover:bg-white/20",
      },
      {
        variant: "outline",
        tone: "transparent-white",
        class: "border border-white bg-transparent text-white hover:bg-white/10 dark:hover:bg-white/20",
      },
      {
        variant: "secondary",
        tone: "navy",
        class: "bg-[var(--color-ref-slate-800)] text-[var(--color-role-text-inverse)] hover:bg-[var(--color-ref-slate-700)]",
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
