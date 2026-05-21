import Script from "next/script";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Antes do paint: claro por padrão; escuro só se o usuário salvou `dark`. */
const inline = `(()=>{try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);if(s==="dark")document.documentElement.removeAttribute("data-theme");else document.documentElement.setAttribute("data-theme","light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export function ThemeInitScript() {
  return <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: inline }} />;
}
