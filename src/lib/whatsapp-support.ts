import { STORE_CONFIG } from "@/config/store";

/** Link wa.me para abrir conversa no WhatsApp (nova aba / app). */
export function whatsappSupportHref(message?: string): string {
  const base = `https://wa.me/${STORE_CONFIG.whatsapp.e164}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function whatsappSupportMessagePedido(pedidoId: string): string {
  return `Olá! Preciso de ajuda com meu pedido ${pedidoId} na Copa 2026 Store.`;
}
