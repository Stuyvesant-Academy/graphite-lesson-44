import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-lg font-bold tracking-normal transition-[transform,background-color,color,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-desk disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        cream:
          "bg-ink text-paper hover:opacity-90 rounded-[var(--radius-md)]",
        oxblood:
          "bg-ink text-paper hover:opacity-90 rounded-[var(--radius-md)]",
        ghost:
          "bg-transparent text-ink hover:bg-paper-dark rounded-[var(--radius-md)]",
        paper:
          "bg-ink text-paper hover:opacity-90 rounded-[var(--radius-sm)]",
        outline:
          "border-2 border-ink bg-transparent text-ink hover:bg-paper-dark rounded-[var(--radius-md)]",
      },
      size: {
        default: "h-12 px-5",
        lg: "h-14 px-6 text-lg",
        sm: "h-11 px-3 text-base",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "cream",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
