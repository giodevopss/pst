/** Formato 4 espaços entre grupos; Amex opcional omitido por simplicidade (16 dígitos padrão). */
export function formatCardNumberDigits(digits: string, maxLen = 19): string {
  const d = digits.replace(/\D/g, "").slice(0, maxLen);
  const chunks: string[] = [];
  for (let i = 0; i < d.length; i += 4) {
    chunks.push(d.slice(i, i + 4));
  }
  return chunks.join(" ");
}

export type CardBrand = "visa" | "mastercard" | "elo" | "amex" | "generic";

export function inferBrand(digitsOnly: string): CardBrand {
  const d = digitsOnly;
  if (/^4/.test(d)) return "visa";
  if (/^5[1-5]/.test(d) || /^2(2[2-9]\d|[3-6]\d{2}|7[01]\d|720)/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  // ELO ranges simplificadas (uso comum no BR)
  if (/^(636368|438935|504175|451416|636297)/.test(d)) return "elo";
  if (/^(5067|4576|4011)/.test(d)) return "elo";
  return "generic";
}

export function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Máscara visual para linha tipo CVV (apenas bullets, igual ao comprimento). */
export function maskCvvBullets(length: number): string {
  if (length < 3 || length > 4) return "—";
  return "•".repeat(length);
}

/** Resultado da validação de CVV conforme PAN (sem armazenar CVV em servidor). */
export type ValidacaoCvv = { ok: true } | { ok: false; message: string };

/**
 * CVV apenas dígitos. AmEx (BIN 34/37): exatamente 4. Demais bandeiras reconhecíveis: 3.
 * Com BIN indeterminado (ainda incompleto): aceita 3 ou 4 até o PAN permitir inferir melhor.
 */
export function validateCvvForPan(cvvRaw: string, panDigits: string): ValidacaoCvv {
  const cvv = digitsOnly(cvvRaw);
  if (!/^\d+$/.test(cvv)) {
    return { ok: false, message: "CVV só deve conter números." };
  }
  if (cvv.length === 0) {
    return { ok: false, message: "Informe o código de segurança (CVV/CID)." };
  }

  const pan = digitsOnly(panDigits);
  const brand = inferBrand(pan);

  if (brand === "amex") {
    if (!/^\d{4}$/.test(cvv)) {
      return {
        ok: false,
        message: "American Express: CID na frente do cartão tem 4 dígitos.",
      };
    }
    return { ok: true };
  }

  if (brand !== "generic") {
    if (!/^\d{3}$/.test(cvv)) {
      return {
        ok: false,
        message: "CVV no verso do cartão: exatamente 3 dígitos.",
      };
    }
    return { ok: true };
  }

  // Bandeira ainda incerta pelo número incompleto
  if (/^\d{3,4}$/.test(cvv)) {
    return { ok: true };
  }
  return {
    ok: false,
    message: "Informe 3 dígitos (maioria dos cartões) ou 4 se for American Express.",
  };
}

export function formatExpiry(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

/** Últimos 8 dígitos do PAN (exige pelo menos 8 dígitos no número). */
export function lastEight(digitsOnlyStr: string): string | undefined {
  const d = digitsOnlyStr.replace(/\D/g, "");
  return d.length >= 8 ? d.slice(-8) : undefined;
}

/** Valida MM/YY e não expirado (com tolerância mês atual). */
export function isValidExpiry(expiry: string): boolean {
  const m = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mm = Number(m[1]);
  const yy = Number(m[2]);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const cy = now.getFullYear() % 100;
  const cm = now.getMonth() + 1;
  return yy > cy || (yy === cy && mm >= cm);
}

/** Linha exibida no cartão: dígitos + bullets nos grupos vazios. */
export function displayCardNumberLine(digitsGrouped: string): string {
  const clean = digitsGrouped.replace(/\D/g, "");
  if (clean.length === 0) return "•••• •••• •••• ••••";
  const targetLen = 16;
  const parts: string[] = [];
  for (let i = 0; i < targetLen; i += 4) {
    const seg = clean.slice(i, i + 4);
    if (seg.length === 0) parts.push("••••");
    else if (seg.length < 4) parts.push(`${seg}${"•".repeat(4 - seg.length)}`);
    else parts.push(seg);
  }
  if (clean.length > targetLen) {
    const extra = clean.slice(targetLen);
    parts.push(extra.length ? ` ${extra}` : "");
  }
  return parts.join(" ");
}

export function luhnCheck(cardNum: string): boolean {
  const d = digitsOnly(cardNum);
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48;
    if (n < 0 || n > 9) return false;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}
