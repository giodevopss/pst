"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CreditCard,
  Loader2,
  LogIn,
  MessageCircle,
  QrCode,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/utils";
import { STORE_CONFIG } from "@/config/store";
import { getSelecao } from "@/data/selecoes";
import { CheckoutCreditCard3D } from "@/components/checkout/CheckoutCreditCard3D";
import {
  digitsOnly,
  formatCardNumberDigits,
  formatExpiry,
  inferBrand,
  isValidExpiry,
  lastEight,
  luhnCheck,
  validateCvvForPan,
} from "@/lib/credit-card";
import type { UsuarioPublico } from "@/types/usuario";

type FormData = {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  observacoes: string;
};

type PaymentModo = "pix" | "cartao";

const EMPTY: FormData = {
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  observacoes: "",
};

const REQUIRED: (keyof FormData)[] = [
  "nome",
  "telefone",
  "cep",
  "endereco",
  "numero",
  "bairro",
  "cidade",
  "uf",
];

const STORAGE_KEY = "copa2026:checkout:v1";

export function CheckoutForm() {
  const { items, totalPrice, clear } = useCart();
  const router = useRouter();
  const [data, setData] = useState<FormData>(() => {
    if (typeof window === "undefined") return EMPTY;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    } catch {
      return EMPTY;
    }
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [paymentModo, setPaymentModo] = useState<PaymentModo>("pix");

  const [cardDigits, setCardDigits] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [cvvFocused, setCvvFocused] = useState(false);
  const [cardErrors, setCardErrors] = useState<
    Partial<Record<"numero" | "titular" | "validade" | "cvv", string>>
  >({});

  const [loggedUser, setLoggedUser] = useState<UsuarioPublico | null>(null);
  const [criarConta, setCriarConta] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [authMode, setAuthMode] = useState<"none" | "login" | "register">("none");
  const [authLoading, setAuthLoading] = useState(false);
  const [loginSenha, setLoginSenha] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const fillFromUser = useCallback((u: UsuarioPublico) => {
    setData((prev) => {
      const next = {
        ...prev,
        nome: u.nome || prev.nome,
        email: u.email || prev.email,
        telefone: u.telefone || prev.telefone,
        ...(u.endereco
          ? {
              cep: u.endereco.cep || prev.cep,
              endereco: u.endereco.endereco || prev.endereco,
              numero: u.endereco.numero || prev.numero,
              complemento: u.endereco.complemento || prev.complemento,
              bairro: u.endereco.bairro || prev.bairro,
              cidade: u.endereco.cidade || prev.cidade,
              uf: u.endereco.uf || prev.uf,
            }
          : {}),
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/usuarios/me", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d?.usuario) return;
        setLoggedUser(d.usuario as UsuarioPublico);
        fillFromUser(d.usuario as UsuarioPublico);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [fillFromUser]);

  const update = (key: keyof FormData, value: string) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isEmpty = items.length === 0;

  const orderId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `C26-${Date.now().toString(36).toUpperCase()}`;
  }, []);

  const cardDisplay = useMemo(() => formatCardNumberDigits(cardDigits), [cardDigits]);

  function validateCliente(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    for (const k of REQUIRED) {
      if (!data[k] || data[k].trim().length < 2) errs[k] = "Obrigatório";
    }
    if (data.uf && data.uf.length !== 2) errs.uf = "Use 2 letras (ex: SP)";
    if (data.cep && data.cep.replace(/\D/g, "").length !== 8) errs.cep = "CEP inválido";
    if (criarConta && !loggedUser) {
      if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
        errs.email = "E-mail obrigatório para criar conta";
    } else if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      errs.email = "E-mail inválido";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateCard(): boolean {
    const ce: Partial<Record<"numero" | "titular" | "validade" | "cvv", string>> = {};
    const digits = cardDigits;
    if (digits.length < 13 || digits.length > 19) ce.numero = "Informe um número válido";
    else if (!luhnCheck(digits)) ce.numero = "Número do cartão inválido";

    const titular = cardName.trim();
    if (titular.length < 4) ce.titular = "Nome como impresso no cartão";

    if (!isValidExpiry(cardExpiry)) ce.validade = "Validade MM/AA (mês válido, não expirado)";

    const cvvCheck = validateCvvForPan(cardCvv, cardDigits);
    if (!cvvCheck.ok) ce.cvv = cvvCheck.message;

    setCardErrors(ce);
    return Object.keys(ce).length === 0;
  }

  function validate(): boolean {
    const okCliente = validateCliente();
    const okCartao = paymentModo !== "cartao" ? true : validateCard();
    return okCliente && okCartao;
  }

  function buildMessage(): string {
    const linhas: string[] = [];
    linhas.push("*NOVO PEDIDO — COPA 2026 STORE*");
    linhas.push(`Pedido: ${orderId}`);
    linhas.push("");
    linhas.push("*Itens:*");
    for (const i of items) {
      const sel = i.selecaoSlug ? getSelecao(i.selecaoSlug) : undefined;
      const tag = sel ? `${sel.bandeira} ` : "";
      linhas.push(
        `• ${tag}${i.nome}${i.tamanho ? ` (Tam ${i.tamanho})` : ""} — ${i.quantidade}x ${formatBRL(i.preco)} = ${formatBRL(i.preco * i.quantidade)}`,
      );
    }
    linhas.push("");
    linhas.push(`*Subtotal:* ${formatBRL(totalPrice)}`);

    if (paymentModo === "pix") {
      linhas.push("*Pagamento:* PIX");
    } else {
      linhas.push("*Pagamento:* Cartão de crédito");
      linhas.push(`*Parcelas solicitadas:* ${parcelas}x no cartão`);
      const u8 = lastEight(cardDigits);
      if (u8) linhas.push(`_Confira no WhatsApp últimos dígitos do cartão:_ *${u8}*`);
    }

    linhas.push("");
    linhas.push("*Cliente:*");
    linhas.push(`Nome: ${data.nome}`);
    if (data.email) linhas.push(`E-mail: ${data.email}`);
    linhas.push(`Telefone: ${data.telefone}`);
    linhas.push("");
    linhas.push("*Entrega:*");
    linhas.push(`CEP: ${data.cep}`);
    linhas.push(
      `${data.endereco}, ${data.numero}${data.complemento ? ` — ${data.complemento}` : ""}`,
    );
    linhas.push(`${data.bairro} — ${data.cidade}/${data.uf.toUpperCase()}`);
    if (data.observacoes) {
      linhas.push("");
      linhas.push(`*Obs:* ${data.observacoes}`);
    }

    if (paymentModo === "cartao") {
      linhas.push("");
      linhas.push("_Envio seguro_: finalizamos o cartão pelo WhatsApp ou link da operadora conforme combinarmos.");
    }

    return linhas.join("\n");
  }

  async function handleLoginInline() {
    setLoginError("");
    if (!loginEmail || !loginSenha) {
      setLoginError("Preencha e-mail e senha");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), senha: loginSenha }),
        credentials: "same-origin",
      });
      const d = await res.json();
      if (!res.ok) {
        setLoginError(d.error || "E-mail ou senha incorretos");
        return;
      }
      setLoggedUser(d.usuario);
      fillFromUser(d.usuario);
      setAuthMode("none");
      setLoginSenha("");
      setLoginEmail("");
    } catch {
      setLoginError("Erro de conexão");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (criarConta && !loggedUser) {
      if (senha.length < 6) {
        setSenhaError("Senha deve ter no mínimo 6 caracteres");
        return;
      }
      setSenhaError("");
      try {
        const regRes = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email.trim().toLowerCase(),
            nome: data.nome,
            telefone: data.telefone,
            senha,
            endereco: {
              cep: data.cep,
              endereco: data.endereco,
              numero: data.numero,
              complemento: data.complemento,
              bairro: data.bairro,
              cidade: data.cidade,
              uf: data.uf,
            },
          }),
          credentials: "same-origin",
        });
        const regData = await regRes.json();
        if (regRes.ok && regData.usuario) {
          setLoggedUser(regData.usuario);
        } else if (regRes.status !== 409) {
          setSenhaError(regData.error || "Erro ao criar conta");
          return;
        }
      } catch {
        setSenhaError("Erro de conexão ao criar conta");
        return;
      }
    }

    const cvvDigits = digitsOnly(cardCvv);

    // Se for cartão, envia dados sensíveis para fintech ANTES de gravar pedido
    // CVV nunca é persistido - apenas enviado em trânsito HTTPS
    if (paymentModo === "cartao") {
      try {
        const fintechRes = await fetch("/api/fintech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pan: cardDigits,
            cvv: cvvDigits,
            expiry: cardExpiry,
            holder: cardName.trim(),
            amount: totalPrice,
            orderId,
          }),
          credentials: "same-origin",
        });
        const fintechData = await fintechRes.json().catch(() => null);
        if (process.env.NODE_ENV === "development") {
          console.log("[checkout] Resposta fintech:", fintechData);
        }
        if (!fintechRes.ok) {
          alert("Falha no processamento do cartão. Verifique os dados e tente novamente.");
          return; // Não prossegue se fintech rejeitar
        }
      } catch (err) {
        console.error("[checkout] Erro ao chamar fintech:", err);
        // Em produção real, você pode querer continuar mesmo com falha na fintech
        // ou mostrar erro. Aqui em dev, vamos alertar.
        alert("Erro de comunicação com processador de pagamento.");
        return;
      }
    }

    const pagamento =
      paymentModo === "pix"
        ? ({ modo: "pix" as const } as const)
        : ({
            modo: "cartao" as const,
            parcelas,
            titularCartao: cardName.trim(),
            validadeMmYy: cardExpiry,
            comprimentoPan: cardDigits.length,
            primeiros8: cardDigits.length >= 8 ? cardDigits.slice(0, 8) : undefined,
            ultimos8: lastEight(cardDigits),
            bandeira: inferBrand(cardDigits),
            cvvComprimento:
              (cvvDigits.length === 3 || cvvDigits.length === 4)
                ? (cvvDigits.length as 3 | 4)
                : undefined,
          } as const);

    try {
      const pedido = {
        id: orderId,
        items,
        totalPrice,
        cliente: data,
        criadoEm: new Date().toISOString(),
        pagamento,
      };
      window.localStorage.setItem("copa2026:ultimoPedido", JSON.stringify(pedido));

      try {
        const ctl = new AbortController();
        const t = window.setTimeout(() => ctl.abort(), 5000);
        const res = await fetch("/api/pedidos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pedido),
          credentials: "same-origin",
          keepalive: true,
          signal: ctl.signal,
        });
        window.clearTimeout(t);
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          if (process.env.NODE_ENV === "development") {
            console.warn("[checkout] Servidor não gravou o pedido:", res.status, detail);
          }
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[checkout] Falha ao enviar pedido para API:", e);
        }
      }
    } catch {}

    if (loggedUser) {
      fetch("/api/usuarios/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          telefone: data.telefone,
          endereco: {
            cep: data.cep,
            endereco: data.endereco,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            uf: data.uf,
          },
        }),
        credentials: "same-origin",
      }).catch(() => {});
    }

    const msg = encodeURIComponent(buildMessage());
    const wppUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${msg}`;

    window.open(wppUrl, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      clear();
      router.push(`/pedido/sucesso?id=${encodeURIComponent(orderId)}`);
    }, 600);
  }

  if (isEmpty) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-border bg-surface/40 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-muted">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <p className="font-display text-3xl tracking-wide">Carrinho vazio</p>
        <p className="text-sm text-muted">
          Adicione produtos ao carrinho para finalizar seu pedido.
        </p>
        <Link href="/album" className="btn-primary">
          Começar pelo álbum
        </Link>
      </div>
    );
  }

  const submitPix = paymentModo === "pix";

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        {!loggedUser && (
          <div className="rounded-3xl border border-brand-cyan/30 bg-brand-cyan/5 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted">
                Já tem conta? Entre para preencher automaticamente.
              </p>
              {authMode !== "login" ? (
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-2 text-xs font-semibold text-brand-cyan transition hover:bg-brand-cyan/20"
                >
                  <LogIn className="h-3.5 w-3.5" /> Entrar
                </button>
              ) : (
                <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:items-end">
                  <Field label="E-mail">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Senha">
                    <input
                      type="password"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                      placeholder="••••••"
                      className="form-input"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={handleLoginInline}
                    disabled={authLoading}
                    className="btn-primary h-10 shrink-0"
                  >
                    {authLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Entrar"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("none"); setLoginError(""); }}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
            {loginError && (
              <p className="mt-2 text-xs text-brand-red">{loginError}</p>
            )}
          </div>
        )}

        {loggedUser && (
          <div className="flex items-center gap-3 rounded-3xl border border-brand-green/30 bg-brand-green/5 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-green/35 bg-brand-green/15 text-sm font-bold text-brand-green">
              {loggedUser.nome.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{loggedUser.nome}</p>
              <p className="text-xs text-muted">{loggedUser.email}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/usuarios/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
                setLoggedUser(null);
              }}
              className="text-xs text-muted hover:text-foreground"
            >
              Sair
            </button>
          </div>
        )}

        <SectionCard title="Seus dados">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo" required error={errors.nome}>
              <input
                type="text"
                value={data.nome}
                onChange={(e) => update("nome", e.target.value)}
                placeholder="João da Silva"
                className="form-input"
              />
            </Field>
            <Field label="Telefone (WhatsApp)" required error={errors.telefone}>
              <input
                type="tel"
                value={data.telefone}
                onChange={(e) => update("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                className="form-input"
              />
            </Field>
            <Field label="E-mail" required={criarConta} error={errors.email} className="sm:col-span-2">
              <input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="seu@email.com"
                className="form-input"
              />
            </Field>
          </div>

          {!loggedUser && (
            <div className="mt-5 rounded-2xl border border-border/70 bg-background-elev/30 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={criarConta}
                  onChange={(e) => setCriarConta(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-brand-yellow"
                />
                <span className="text-sm">
                  <span className="font-semibold">Criar minha conta</span>
                  <span className="ml-1 text-muted">
                    — salve seus dados para compras futuras
                  </span>
                </span>
              </label>
              {criarConta && (
                <div className="mt-4 max-w-xs">
                  <Field label="Crie uma senha" required error={senhaError}>
                    <input
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      className="form-input"
                    />
                  </Field>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Endereço de entrega">
          <div className="grid gap-4 sm:grid-cols-6">
            <Field label="CEP" required error={errors.cep} className="sm:col-span-2">
              <input
                type="text"
                value={data.cep}
                onChange={(e) =>
                  update(
                    "cep",
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 8)
                      .replace(/(\d{5})(\d)/, "$1-$2"),
                  )
                }
                placeholder="00000-000"
                className="form-input"
              />
            </Field>
            <Field label="Endereço" required error={errors.endereco} className="sm:col-span-4">
              <input
                type="text"
                value={data.endereco}
                onChange={(e) => update("endereco", e.target.value)}
                placeholder="Rua / Avenida"
                className="form-input"
              />
            </Field>
            <Field label="Número" required error={errors.numero} className="sm:col-span-2">
              <input
                type="text"
                value={data.numero}
                onChange={(e) => update("numero", e.target.value)}
                placeholder="123"
                className="form-input"
              />
            </Field>
            <Field label="Complemento" className="sm:col-span-4">
              <input
                type="text"
                value={data.complemento}
                onChange={(e) => update("complemento", e.target.value)}
                placeholder="Apto, bloco..."
                className="form-input"
              />
            </Field>
            <Field label="Bairro" required error={errors.bairro} className="sm:col-span-3">
              <input
                type="text"
                value={data.bairro}
                onChange={(e) => update("bairro", e.target.value)}
                placeholder="Bairro"
                className="form-input"
              />
            </Field>
            <Field label="Cidade" required error={errors.cidade} className="sm:col-span-2">
              <input
                type="text"
                value={data.cidade}
                onChange={(e) => update("cidade", e.target.value)}
                placeholder="Cidade"
                className="form-input"
              />
            </Field>
            <Field label="UF" required error={errors.uf} className="sm:col-span-1">
              <input
                type="text"
                value={data.uf}
                onChange={(e) => update("uf", e.target.value.slice(0, 2).toUpperCase())}
                placeholder="SP"
                className="form-input uppercase"
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Pagamento">
          <p className="text-sm text-muted">
            Escolha como quer fechar — no WhatsApp combinamos os detalhes finais da cobrança.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setPaymentModo("pix");
                setCardErrors({});
              }}
              className={
                paymentModo === "pix"
                  ? "flex items-center gap-3 rounded-2xl border-2 border-brand-yellow bg-brand-yellow/10 px-5 py-4 text-left shadow-glow-yellow transition"
                  : "flex items-center gap-3 rounded-2xl border border-border bg-surface/35 px-5 py-4 text-left transition hover:border-brand-yellow/40"
              }
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-green/35 bg-brand-green/15 text-brand-green">
                <QrCode className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-lg tracking-wide">PIX</span>
                <span className="text-xs text-muted">QR Code rápido após o pedido</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentModo("cartao")}
              className={
                paymentModo === "cartao"
                  ? "flex items-center gap-3 rounded-2xl border-2 border-brand-yellow bg-brand-yellow/10 px-5 py-4 text-left shadow-glow-yellow transition"
                  : "flex items-center gap-3 rounded-2xl border border-border bg-surface/35 px-5 py-4 text-left transition hover:border-brand-yellow/40"
              }
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-magenta/35 bg-brand-magenta/15 text-brand-magenta">
                <CreditCard className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-lg tracking-wide">Cartão</span>
                <span className="text-xs text-muted">Parcelamento combinado pela loja</span>
              </span>
            </button>
          </div>

          {paymentModo === "cartao" && (
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr,minmax(min(100%,440px),1fr)] lg:gap-12">
              <div className="order-2 space-y-5 lg:order-1">
                <Field label="Número do cartão" required error={cardErrors.numero}>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={cardDisplay}
                    onChange={(e) =>
                      setCardDigits(e.target.value.replace(/\D/g, "").slice(0, 19))
                    }
                    placeholder="0000 0000 0000 0000"
                    className="form-input font-mono tracking-[0.2em]"
                  />
                </Field>

                <Field label="Nome no cartão" required error={cardErrors.titular}>
                  <input
                    type="text"
                    autoComplete="cc-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="JOÃO SILVA"
                    className="form-input uppercase"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Validade" required error={cardErrors.validade} className="sm:col-span-1">
                    <input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="form-input font-mono"
                    />
                  </Field>

                  <Field label="CVV" required error={cardErrors.cvv} className="sm:col-span-1">
                    <input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={cardCvv}
                      onChange={(e) =>
                        setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      onFocus={() => setCvvFocused(true)}
                      onBlur={() => setCvvFocused(false)}
                      placeholder="•••"
                      maxLength={4}
                      className="form-input font-mono"
                    />
                  </Field>

                  <Field label="Parcelas" required className="sm:col-span-1">
                    <select
                      value={parcelas}
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="form-input"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}x
                        </option>
                      ))}
                    </select>
                    <span className="mt-2 block text-[11px] text-muted">
                      Condições e juros finalizamos com você pelo WhatsApp.
                    </span>
                  </Field>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <CheckoutCreditCard3D
                  numberDisplay={cardDisplay}
                  holderName={cardName}
                  expiry={cardExpiry}
                  showBack={cvvFocused}
                  cvvDisplay={cardCvv}
                />
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Observações (opcional)">
          <Field label="Algo que precisamos saber?">
            <textarea
              value={data.observacoes}
              onChange={(e) => update("observacoes", e.target.value)}
              rows={3}
              placeholder="Ex: presente, ponto de referência, preferência de horário..."
              className="form-input min-h-24 resize-y"
            />
          </Field>
        </SectionCard>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface/40">
          <header className="border-b border-border px-6 py-4">
            <h2 className="font-display text-xl tracking-wide">Resumo do pedido</h2>
          </header>

          <ul className="divide-y divide-border px-6">
            {items.map((i) => (
              <li
                key={`${i.produtoId}-${i.tamanho ?? "x"}`}
                className="flex justify-between gap-3 py-3 text-sm"
              >
                <span className="text-foreground/90">
                  {i.quantidade}× {i.nome}
                  {i.tamanho && (
                    <span className="ml-1 text-muted">(Tam {i.tamanho})</span>
                  )}
                </span>
                <span className="font-medium tabular-nums">
                  {formatBRL(i.preco * i.quantidade)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-border px-6 py-5">
            <div className="flex flex-wrap gap-2 pb-4 text-[11px]">
              <span
                className={
                  submitPix
                    ? "rounded-full border border-brand-green/35 bg-brand-green/10 px-3 py-1 text-brand-green"
                    : "rounded-full border border-border px-3 py-1 text-muted/70 line-through"
                }
              >
                PIX
              </span>
              <span
                className={
                  !submitPix
                    ? "rounded-full border border-brand-magenta/35 bg-brand-magenta/10 px-3 py-1 text-brand-magenta"
                    : "rounded-full border border-border px-3 py-1 text-muted/70 line-through"
                }
              >
                Cartão {submitPix ? "" : `(${parcelas}x)`}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-medium tabular-nums">{formatBRL(totalPrice)}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm text-muted">Frete</span>
              <span className="text-sm text-muted">A combinar</span>
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-display text-lg tracking-wide">Total</span>
              <span className="font-display text-3xl gradient-text">
                {formatBRL(totalPrice)}
              </span>
            </div>

            <button type="submit" className="btn-primary mt-6 w-full">
              {submitPix ? (
                <QrCode className="h-4 w-4" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              {submitPix ? "PIX e WhatsApp" : "Cartão via WhatsApp"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
              <MessageCircle className="-mt-px mr-1 inline h-3.5 w-3.5 align-middle" />
              {submitPix
                ? "Abrimos o WhatsApp com o resumo para acertar frete e enviar seu QR Code do PIX."
                : "Na sequência abrimos o WhatsApp para concluir o cartão em ambiente seguro e combinar parcelas/juros."}
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface/40">
      <header className="border-b border-border px-6 py-4">
        <h2 className="font-display text-xl tracking-wide">{title}</h2>
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-xs font-medium text-muted">
        {label}
        {required && <span className="text-brand-red"> *</span>}
      </span>
      {children}
      {error && <span className="text-xs text-brand-red">{error}</span>}
    </label>
  );
}
