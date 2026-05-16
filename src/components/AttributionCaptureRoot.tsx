"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureAttributionFromSearch } from "@/lib/attribution";

function AttributionInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureAttributionFromSearch(searchParams.toString());
  }, [searchParams]);

  return null;
}

export function AttributionCaptureRoot() {
  return (
    <Suspense fallback={null}>
      <AttributionInner />
    </Suspense>
  );
}
