import Script from "next/script";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const inline = `(()=>{try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);if(s==="light")document.documentElement.setAttribute("data-theme","light");}catch(e){}})();`;

export function ThemeInitScript() {
  return <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: inline }} />;
}
