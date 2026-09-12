import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[var(--radius-sm)] border-2 border-ink bg-paper px-3 font-mono text-lg text-ink",
        "placeholder:text-faint",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
