import Image from "next/image";
import Link from "next/link";
import { SITE_LOGO } from "@/config/brand";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Navbar (padrão) ou rodapé (um pouco maior). */
  variant?: "header" | "footer";
};

export function Logo({ className, variant = "header" }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex min-w-0 max-w-full items-center outline-none ring-brand-yellow/40 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Image
        src={SITE_LOGO.src}
        alt={SITE_LOGO.alt}
        width={SITE_LOGO.width}
        height={SITE_LOGO.height}
        className={cn(
          "w-auto max-w-full object-contain object-left",
          isFooter
            ? "h-10 sm:h-12 md:h-14 md:max-w-[min(100%,400px)]"
            : "h-8 max-w-[min(100%,calc(100vw-10.5rem))] sm:h-10 sm:max-w-[min(100%,calc(100vw-12rem))] md:h-12 md:max-w-[min(100%,min(92vw,420px))] lg:h-[3.25rem]",
        )}
        sizes={
          isFooter
            ? "(max-width: 640px) 200px, (max-width: 768px) 280px, 400px"
            : "(max-width: 640px) 180px, (max-width: 1024px) 320px, 420px"
        }
        priority
      />
    </Link>
  );
}
