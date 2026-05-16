"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Imagem do catálogo — aparece na hora enquanto o GLB / WebGL carregam. */
const STATIC_ALBUM_IMG = "/images/panini/album-capa-dura-ouro.jpg";

const HeroAlbum3DCanvas = dynamic(
  () => import("./HeroAlbum3DCanvas").then((m) => m.HeroAlbum3DCanvas),
  { ssr: false, loading: () => null },
);

type HeroAlbum3DProps = {
  className?: string;
};

export function HeroAlbum3D({ className }: HeroAlbum3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mountCanvas, setMountCanvas] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setInView(true);
      },
      { rootMargin: "200px", threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setMountCanvas(true), 100);
    return () => window.clearTimeout(t);
  }, [inView]);

  const onModelReady = useCallback(() => setModelReady(true), []);
  const onRemount = useCallback(() => setModelReady(false), []);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-transparent",
        className,
      )}
    >
      <Image
        src={STATIC_ALBUM_IMG}
        alt="Álbum oficial FIFA World Cup 2026™ — capa dura"
        fill
        className={cn(
          "object-contain transition-opacity duration-700 ease-out",
          modelReady ? "opacity-0" : "opacity-100",
        )}
        sizes="(max-width: 768px) 92vw, 520px"
        priority
        draggable={false}
      />
      {mountCanvas && (
        <HeroAlbum3DCanvas
          className={cn(
            "absolute inset-0 z-[1] transition-opacity duration-700 ease-out",
            modelReady ? "opacity-100" : "opacity-0",
          )}
          onModelReady={onModelReady}
          onRemount={onRemount}
        />
      )}
    </div>
  );
}
