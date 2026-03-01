import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  /** Error message to display - also sets aria-invalid */
  error?: string
  /** ID of element that describes this input for accessibility */
  describedBy?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, describedBy, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    const hasError = Boolean(error)
    const descriptionId = describedBy || ariaDescribedBy

    return (
      <input
        type={type}
        aria-invalid={hasError ? "true" : undefined}
        aria-describedby={descriptionId || undefined}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          hasError && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
