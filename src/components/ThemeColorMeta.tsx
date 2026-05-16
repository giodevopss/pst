"use client";

import { useEffect } from "react";
import { themeColorFor, type SiteTheme } from "@/lib/theme";

function syncMeta(theme: SiteTheme) {
  const content = themeColorFor(theme);
  let el = document.querySelector('meta[name="theme-color"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "theme-color");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function domTheme(): SiteTheme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function ThemeColorMeta() {
  useEffect(() => {
    const run = () => syncMeta(domTheme());
    run();
    const obs = new MutationObserver(run);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return null;
}
