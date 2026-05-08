"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/utils";
import { STORE_CONFIG } from "@/config/store";
import { getSelecao } from "@/data/selecoes";

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

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    for (const k of REQUIRED) {
      if (!data[k] || data[k].trim().length < 2) errs[k] = "Obrigatório";
    }
    if (data.uf && data.uf.length !== 2) errs.uf = "Use 2 letras (ex: SP)";
    if (data.cep && data.cep.replace(/\D/g, "").length !== 8) errs.cep = "CEP inválido";
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
      errs.email = "E-mail inválido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
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
    linhas.push(`*Pagamento:* PIX`);
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
    return linhas.join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const pedido = {
        id: orderId,
        items,
        totalPrice,
        cliente: data,
        criadoEm: new Date().toISOString(),
      };
      window.localStorage.setItem("copa2026:ultimoPedido", JSON.stringify(pedido));
    } catch {}

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

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card title="Seus dados">
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
            <Field label="E-mail" error={errors.email} className="sm:col-span-2">
              <input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="seu@email.com"
                className="form-input"
              />
            </Field>
          </div>
        </Card>

        <Card title="Endereço de entrega">
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
        </Card>

        <Card title="Observações (opcional)">
          <Field label="Algo que precisamos saber?">
            <textarea
              value={data.observacoes}
              onChange={(e) => update("observacoes", e.target.value)}
              rows={3}
              placeholder="Ex: presente, ponto de referência, preferência de horário..."
              className="form-input min-h-24 resize-y"
            />
          </Field>
        </Card>
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

            <button
              type="submit"
              className="btn-primary mt-6 w-full"
            >
              <MessageCircle className="h-4 w-4" />
              Pagar com PIX e enviar pedido
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
              Ao confirmar, vamos abrir o WhatsApp com o resumo do seu pedido para
              acertarmos frete e enviar o QR Code do PIX.
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Card({
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
