import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    "relative inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-300  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_a]:relative [&_a]:z-10",
    "before:absolute before:cursor-pointer before:inset-0 before:border before:border-transparent before:rounded-[inherit] before:bg-transparent before:opacity-0 before:transition-opacity before:ease-in-out hover:before:opacity-100"
  ),
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-secondary-foreground",
        outline:
          "border border-[#534B5D] button-gradient bg-opacity-50 hover:text-accent-foreground",
        "outline-faded":
          "border border-accent bg-[#15151b] text-gray-9 hover:bg-accent hover:text-foreground",
        link: "text-gray-9 hover:text-foreground",
        none: "",
      },
      size: {
        default: "h-10 rounded-md px-5 text-xs leading-none uppercase",
        xs: "h-[22px] rounded-full px-2.25 text-xs leading-none tracking-tighter",
        sm: "h-8 rounded-md px-4 text-[0.8125rem]",
        md: "h-7 rounded-full px-3 text-sm xl:text-[15px]",
        lg: "h-12 rounded-md text-sm leading-none px-6 uppercase",
        icon: "size-9",
        none: "",
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
  ({ className, variant, size, asChild = false, children, ...rest }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className)
    const baseTextClasses =
      "relative z-10 inline-flex whitespace-nowrap items-center justify-center gap-1 w-full"

    if (asChild && React.isValidElement(children)) {
      const elementToClone = children as React.ReactElement<
        { className?: string; children?: React.ReactNode } & Record<
          string,
          unknown
        >
      >
      return React.cloneElement(elementToClone, {
        ...rest,
        ref,
        "data-slot": "button",
        className: cn(classes, elementToClone.props.className),
        children: (
          <span className={baseTextClasses}>
            {elementToClone.props.children}
          </span>
        ),
      })
    }

    return (
      <button ref={ref} className={classes} data-slot="button" {...rest}>
        <span className={baseTextClasses}>{children}</span>
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
