import type { ButtonProps } from "@/types/button";
import * as React from "react";
import { cn } from "@/lib/utils";


export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants = {
      primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
      secondary: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
      outline: "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800",
      ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
      danger: "bg-rose-600 text-white hover:bg-rose-700",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
