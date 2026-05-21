import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
  align = "left",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 font-display text-[1.75rem] leading-tight tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-base text-muted">{description}</p>
        )}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand-yellow"
        >
          {cta.label}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
