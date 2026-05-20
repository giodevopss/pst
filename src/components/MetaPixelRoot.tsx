"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackMetaPageView } from "@/lib/meta-pixel-client";

function MetaPageViewOnRoute({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    trackMetaPageView();
  }, [pathname, searchParams, enabled]);

  return null;
}

type Props = {
  pixelId: string;
};

/**
 * Snippet oficial Meta Pixel (bootstrap + init + PageView).
 * @see https://developers.facebook.com/docs/meta-pixel/get-started
 */
export function MetaPixelRoot({ pixelId }: Props) {
  return (
    <>
      <Script
        id="meta-pixel-code"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`,
        }}
      />
      <Suspense fallback={null}>
        <MetaPageViewOnRoute enabled />
      </Suspense>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
