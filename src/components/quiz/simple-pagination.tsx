import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SimplePagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-[var(--shadow-soft)]">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> sur{" "}
        <span className="font-semibold text-foreground">{pageCount}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          size="icon"
          variant="outline"
          className="size-8 rounded-full"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Précédent"
        >
          <ChevronLeft className="size-4" />
        </Button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={
              "min-w-8 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors " +
              (p === page
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary")
            }
          >
            {p}
          </button>
        ))}
        <Button
          size="icon"
          variant="outline"
          className="size-8 rounded-full"
          onClick={() => onChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          aria-label="Suivant"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
