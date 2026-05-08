"use client";

import Link from "next/link";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Bounds, ContactShadows, Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { cn } from "@/lib/utils";

const MODEL_URL =
  process.env.NEXT_PUBLIC_HERO_MODEL_URL ??
  "/models/3dcopa.glb";
const FALLBACK_VIEWER = "https://www.meshy.ai/s/HWk5NQ";

function WebglContextGuard({ onContextLost }: { onContextLost: () => void }) {
  const gl = useThree((s) => s.gl);
  const onContextLostRef = useRef(onContextLost);
  onContextLostRef.current = onContextLost;

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (e: Event) => {
      e.preventDefault();
      onContextLostRef.current();
    };
    canvas.addEventListener("webglcontextlost", handleLost);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [gl]);

  return null;
}

function AlbumModel() {
  const gltf = useGLTF(MODEL_URL);
  const model = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.2 / maxAxis;

    cloned.position.sub(center);
    cloned.scale.setScalar(scale);
    cloned.rotation.y = Math.PI * 0.2;

    return cloned;
  }, [gltf.scene]);

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.25}>
      <primitive object={model} />
    </Float>
  );
}

function LoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
      <span className="rounded-full border border-border bg-surface/85 px-4 py-2 font-display text-sm tracking-[0.2em] text-muted backdrop-blur-sm">
        CARREGANDO 3D…
      </span>
    </div>
  );
}

function ModelErrorOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col justify-end bg-gradient-to-t from-background/95 via-background/40 to-transparent p-4 text-center md:p-6">
      <p className="text-xs text-foreground/90 md:text-sm">
        Modelo 3D indisponível. Coloque{" "}
        <span className="font-mono text-[10px] text-brand-cyan">public/models/3dcopa.glb</span>.
      </p>
      <Link
        href={FALLBACK_VIEWER}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto mt-3 inline-flex justify-center text-[11px] font-semibold uppercase tracking-widest text-brand-yellow hover:underline"
      >
        Abrir visualização Meshy
      </Link>
    </div>
  );
}

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // noop
  }

  render() {
    if (this.state.hasError) return <ModelErrorOverlay />;
    return this.props.children;
  }
}

function WebglCrashedOverlay({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-4 border border-border/60 bg-background/90 px-6 text-center backdrop-blur-sm">
      <p className="max-w-sm text-sm leading-relaxed text-foreground/90">
        O navegador interrompeu a aceleração gráfica do 3D (WebGL). Isso pode acontecer com muitas abas abertas
        ou driver de vídeo instável.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-brand-yellow/80 bg-brand-yellow/20 px-6 py-2.5 font-display text-xs font-semibold uppercase tracking-widest text-foreground transition hover:bg-brand-yellow/30"
      >
        Tentar carregar o 3D de novo
      </button>
    </div>
  );
}

type HeroAlbum3DProps = {
  className?: string;
};

export function HeroAlbum3D({
  className,
}: HeroAlbum3DProps) {
  const [webglCrashed, setWebglCrashed] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  const handleContextLost = useCallback(() => {
    setWebglCrashed(true);
  }, []);

  const handleRetryWebgl = useCallback(() => {
    setWebglCrashed(false);
    setCanvasKey((k) => k + 1);
  }, []);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-transparent",
        className,
      )}
    >
      {webglCrashed && <WebglCrashedOverlay onRetry={handleRetryWebgl} />}
      <ModelErrorBoundary>
        <Suspense fallback={webglCrashed ? null : <LoadingOverlay />}>
          {!webglCrashed && (
            <Canvas
              key={canvasKey}
              className="touch-none absolute inset-0 z-[1] !bg-transparent"
              dpr={[1, 2]}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "default",
                failIfMajorPerformanceCaveat: false,
                stencil: false,
                depth: true,
              }}
              camera={{ position: [0, 0.8, 5.4], fov: 32 }}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
              <WebglContextGuard onContextLost={handleContextLost} />
              <ambientLight intensity={1} />
              <hemisphereLight intensity={1.1} groundColor="#111827" />
              <directionalLight position={[4, 6, 4]} intensity={2.6} color="#fff0bf" />
              <directionalLight position={[-4, 3, -2]} intensity={1.5} color="#7ad7ff" />

              <Bounds fit clip observe margin={1.42}>
                <AlbumModel />
              </Bounds>

              <ContactShadows position={[0, -1.4, 0]} opacity={0.2} blur={1.6} scale={5} />
              <Environment preset="sunset" environmentIntensity={0.75} />

              <OrbitControls
                makeDefault
                enableRotate
                enableZoom
                enablePan
                zoomSpeed={0.85}
                rotateSpeed={0.8}
                panSpeed={0.65}
                dampingFactor={0.08}
                enableDamping
                autoRotate={true}
                autoRotateSpeed={0.6}
                minPolarAngle={Math.PI / 2.4}
                maxPolarAngle={Math.PI / 1.85}
                minDistance={2.8}
                maxDistance={8}
              />
            </Canvas>
          )}
        </Suspense>
      </ModelErrorBoundary>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
