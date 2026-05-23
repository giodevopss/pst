import { cn } from "@/lib/utils";

type HeroAlbum3DLoadingProps = {
  className?: string;
};

export function HeroAlbum3DLoading({ className }: HeroAlbum3DLoadingProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] flex items-center justify-center",
        className,
      )}
    >
      <span className="rounded-full border border-border bg-surface/85 px-4 py-2 font-display text-sm tracking-[0.2em] text-muted backdrop-blur-sm">
        Carregando 3D…
      </span>
    </div>
  );
}
