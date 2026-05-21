import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/cirt-mdg-logo.svg"
      alt="Logo CIRT MDG"
      className={cn("h-10 w-auto md:h-12", className)}
    />
  );
}