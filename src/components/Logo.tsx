import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/logo-copa-panini.png";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex shrink-0 items-center outline-none ring-brand-yellow/40 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="FIFA World Cup, Panini Brasil e Brasil"
        width={489}
        height={190}
        className="h-10 w-auto max-w-[min(100vw-6rem,280px)] object-contain object-left md:h-12 md:max-w-[320px]"
        sizes="(max-width: 768px) 280px, 320px"
        priority
      />
    </Link>
  );
}
