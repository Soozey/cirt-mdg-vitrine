import { forwardRef, useId, useState } from "react";

import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const FloatingInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, id, value, onFocus, onBlur, ...rest }, ref) => {
    const auto = useId();
    const fieldId = id ?? auto;
    const [focused, setFocused] = useState(false);
    const filled = value !== undefined && value !== null && String(value).length > 0;
    const float = focused || filled;

    return (
      <div className="w-full">
        <div
          className={cn(
            "relative rounded-lg border bg-background/60 transition-all",
            error
              ? "border-destructive ring-1 ring-destructive/40"
              : focused
                ? "border-primary ring-2 ring-primary/20"
                : "border-input hover:border-primary/40",
          )}
        >
          <label
            htmlFor={fieldId}
            className={cn(
              "pointer-events-none absolute left-3 origin-left transition-all duration-200",
              float
                ? "top-1.5 text-[11px] font-medium text-primary"
                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            )}
          >
            {label}
          </label>
          <input
            ref={ref}
            id={fieldId}
            value={value}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className={cn(
              "block w-full bg-transparent px-3 pb-2 pt-5 text-sm text-foreground outline-none placeholder:text-transparent",
              className,
            )}
            placeholder={label}
            {...rest}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";