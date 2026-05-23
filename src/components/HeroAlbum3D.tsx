"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HeroAlbum3DLoading } from "./HeroAlbum3DLoading";

const HeroAlbum3DCanvas = dynamic(
  () => import("./HeroAlbum3DCanvas").then((m) => m.HeroAlbum3DCanvas),
  { ssr: false, loading: () => <HeroAlbum3DLoading /> },
);

type HeroAlbum3DProps = {
  className?: string;
};

export function HeroAlbum3D({ className }: HeroAlbum3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    void import("./HeroAlbum3DCanvas");
  }, []);

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
      {!modelReady && <HeroAlbum3DLoading />}
      <HeroAlbum3DCanvas
        className={cn(
          "absolute inset-0 z-[1] transition-opacity duration-700 ease-out",
          modelReady ? "opacity-100" : "opacity-0",
        )}
        onModelReady={onModelReady}
        onRemount={onRemount}
      />
    </div>
  );
}
