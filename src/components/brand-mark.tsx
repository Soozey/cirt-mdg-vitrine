import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/cirt-shield.png"
        alt=""
        aria-hidden
        className={cn(
          "h-9 w-auto md:h-10",
          isLight ? "" : "[filter:hue-rotate(0deg)]",
        )}
      />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-base font-bold tracking-tight md:text-lg",
            isLight ? "text-nav-deep-foreground" : "text-primary-deep",
          )}
        >
          CIRT<span className={cn(isLight ? "text-iris-lime" : "text-iris-violet")}>MDG</span>
        </span>
        <span
          className={cn(
            "text-[9px] font-semibold uppercase tracking-[0.18em] md:text-[10px]",
            isLight ? "text-nav-deep-foreground/70" : "text-muted-foreground",
          )}
        >
          Computer Incident Response Team
        </span>
      </div>
    </div>
  );
}