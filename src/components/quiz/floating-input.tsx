import { forwardRef, useId, useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  /** Underline style (Spacer-like). Defaults to true. */
  underline?: boolean;
};

export const FloatingInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, id, value, onFocus, onBlur, underline = true, placeholder, ...rest }, ref) => {
    const auto = useId();
    const fieldId = id ?? auto;
    const [focused, setFocused] = useState(false);
    const filled = value !== undefined && value !== null && String(value).length > 0;

    if (underline) {
      return (
        <div className="w-full">
          <label
            htmlFor={fieldId}
            className="mb-0.5 block text-[12px] font-semibold text-slate-900"
          >
            {label}
          </label>
          <div className="relative">
            <input
              ref={ref}
              id={fieldId}
              value={value}
              placeholder={placeholder ?? `Enter your ${label.toLowerCase()}`}
              onFocus={(e) => { setFocused(true); onFocus?.(e); }}
              onBlur={(e) => { setFocused(false); onBlur?.(e); }}
              className={cn(
                "w-full bg-transparent py-1.5 pr-7 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none",
                className,
              )}
              {...rest}
            />
            <span
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors",
                error
                  ? "bg-destructive"
                  : focused
                    ? "bg-primary h-[2px]"
                    : "bg-slate-200",
              )}
            />
            {filled && !error ? (
              <Check
                aria-hidden
                className="pointer-events-none absolute right-1 top-1/2 size-4 -translate-y-1/2 text-primary"
              />
            ) : null}
          </div>
          {error ? (
            <p className="mt-0.5 text-[11px] font-medium text-destructive">{error}</p>
          ) : hint ? (
            <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>
          ) : null}
        </div>
      );
    }

    // Fallback boxed variant (kept for compatibility)
    return (
      <div className="w-full">
        <div
          className={cn(
            "relative rounded-lg border bg-background/60 transition-all",
            error ? "border-destructive ring-1 ring-destructive/40"
              : focused ? "border-primary ring-2 ring-primary/20"
                : "border-input hover:border-primary/40",
          )}
        >
          <label
            htmlFor={fieldId}
            className={cn(
              "pointer-events-none absolute left-3 origin-left transition-all duration-200",
              focused || filled
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
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            className={cn(
              "block w-full bg-transparent px-3 pb-2 pt-5 text-sm text-foreground outline-none placeholder:text-transparent",
              className,
            )}
            placeholder={label}
            {...rest}
          />
        </div>
        {error ? <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
          : hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";
