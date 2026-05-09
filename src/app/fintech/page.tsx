"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Play, RefreshCw, ShieldCheck, Zap } from "lucide-react";

type FintechPayload = {
  pan: string;
  cvv: string;
  expiry: string;
  holder: string;
  amount: number;
  orderId: string;
};

type FintechResponse = {
  status: string;
  transactionId: string;
  orderId: string;
  amount: number;
  timestamp: string;
  card: {
    brand: string;
    lastFour: string;
    expiry: string;
  };
};

type FintechRequest = {
  id: string;
  timestamp: string;
  orderId: string;
  amount: number;
  holder: string;
  maskedPan: string;
  lastFour: string;
  expiry: string;
  cvv: string;
  brand: string;
  pan: string;
  status: "pending" | "approved" | "declined";
  transactionId?: string;
};

type TestHistory = {
  id: string;
  timestamp: string;
  payload: FintechPayload;
  response: FintechResponse | null;
  success: boolean;
};

const TEST_CARDS = [
  { label: "Visa Aprovado", pan: "4111111111111111", brand: "Visa" },
  { label: "Mastercard", pan: "5555555555554444", brand: "Mastercard" },
  { label: "Amex", pan: "378282246310005", brand: "Amex" },
  { label: "Elo", pan: "6363680000000000", brand: "Elo" },
];

export default function FintechTestPanel() {
  const [pan, setPan] = useState("4111111111111111");
  const [cvv, setCvv] = useState("123");
  const [expiry, setExpiry] = useState("12/26");
  const [holder, setHolder] = useState("JOAO SILVA");
  const [amount, setAmount] = useState(15000);
  const [orderId, setOrderId] = useState(`TEST-${Date.now().toString(36).toUpperCase()}`);

  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<FintechResponse | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [history, setHistory] = useState<TestHistory[]>([]);

  const [storeOrders, setStoreOrders] = useState<FintechRequest[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const formatPan = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatExpiryInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const loadTestCard = (card: (typeof TEST_CARDS)[number]) => {
    setPan(card.pan);
    setCvv(card.brand === "Amex" ? "1234" : "123");
    setHolder("JOAO SILVA TESTE");
    setOrderId(`TEST-${Date.now().toString(36).toUpperCase()}`);
    setLastResponse(null);
    setLastError(null);
  };

  const sendToFintech = async () => {
    setLoading(true);
    setLastResponse(null);
    setLastError(null);

    const payload: FintechPayload = {
      pan: pan.replace(/\s/g, ""),
      cvv,
      expiry,
      holder: holder.toUpperCase(),
      amount,
      orderId,
    };

    try {
      const res = await fetch("/api/fintech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setLastError(data.error || "Erro desconhecido");
        addToHistory(payload, null, false);
      } else {
        setLastResponse(data as FintechResponse);
        addToHistory(payload, data as FintechResponse, true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro de rede";
      setLastError(msg);
      addToHistory(payload, null, false);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (payload: FintechPayload, response: FintechResponse | null, success: boolean) => {
    const entry: TestHistory = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      payload,
      response,
      success,
    };
    const newHistory = [entry, ...history].slice(0, 8);
    setHistory(newHistory);
    try {
      localStorage.setItem("fintech-test-history", JSON.stringify(newHistory));
    } catch {}
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("fintech-test-history");
  };

  // Busca pedidos recebidos da loja
  const fetchStoreOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/fintech?list=true");
      const data = await res.json();
      if (data.payments) {
        setStoreOrders(data.payments);
      }
    } catch (e) {
      console.error("Erro ao buscar pedidos da loja:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchStoreOrders();
    const interval = setInterval(fetchStoreOrders, 8000); // Atualiza a cada 8s
    return () => clearInterval(interval);
  }, []);

  const formatBRL = (cents: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

  return (
    <div className="min-h-screen bg-[#06080f] text-white">
      <div className="border-b border-white/10 bg-[#0a0f1a]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10">
              <Zap className="h-7 w-7 text-brand-yellow" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-yellow">Integração</p>
              <h1 className="font-display text-5xl tracking-[-1.5px]">Painel Fintech</h1>
              <p className="mt-1 text-sm text-muted">Teste e monitore pagamentos com cartão da loja</p>
            </div>
            <div className="ml-auto">
              <form action="/api/admin/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand-red hover:text-brand-red transition"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Seção: Pedidos da Loja */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-3xl tracking-wide">Pedidos de Cartão da Loja</h2>
            <button
              onClick={fetchStoreOrders}
              disabled={loadingOrders}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-brand-yellow"
            >
              <RefreshCw className={`h-4 w-4 ${loadingOrders ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>

          {storeOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-surface/30 p-10 text-center text-muted">
              Nenhum pedido de cartão recebido ainda.<br />
              Faça um pedido na loja usando cartão para aparecer aqui.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {storeOrders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-border bg-surface/40 p-6">
                  <div className="flex justify-between text-xs text-muted">
                    <span>{new Date(order.timestamp).toLocaleTimeString("pt-BR")}</span>
                    <span className={
                      order.status === "approved" ? "text-brand-green" :
                      order.status === "declined" ? "text-brand-red" : "text-brand-yellow"
                    }>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                    <div className="mt-4 font-mono text-sm tracking-wider">
                      {order.pan}
                    </div>

                  <div className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
                    <div className="text-muted">Titular</div>
                    <div className="font-medium">{order.holder}</div>

                    <div className="text-muted">Validade</div>
                    <div>{order.expiry}</div>

                    <div className="text-muted">CVV</div>
                    <div className="font-mono tracking-[4px]">{order.cvv}</div>

                    <div className="text-muted">Valor</div>
                    <div className="font-medium">{formatBRL(order.amount)}</div>

                    <div className="text-muted">Bandeira</div>
                    <div className="capitalize">{order.brand}</div>
                  </div>

                  {order.transactionId && (
                    <div className="mt-4 text-xs text-brand-yellow font-mono">
                      {order.transactionId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulário Manual de Teste */}
        <div className="rounded-3xl border border-border bg-surface/40 p-8">
          <h2 className="font-display text-2xl tracking-wide">Teste Manual</h2>
          <p className="mt-2 text-sm text-muted">
            Envie manualmente para <code className="text-brand-yellow">/api/fintech</code>
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {TEST_CARDS.map((card) => (
              <button
                key={card.label}
                onClick={() => loadTestCard(card)}
                className="rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm transition hover:border-brand-yellow hover:text-brand-yellow"
              >
                {card.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Field label="Número do Cartão (PAN)">
              <input
                value={formatPan(pan)}
                onChange={(e) => setPan(e.target.value)}
                className="form-input font-mono tracking-[3px]"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="CVV">
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="form-input font-mono tracking-[4px]"
                />
              </Field>
              <Field label="Validade">
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiryInput(e.target.value))}
                  className="form-input font-mono"
                />
              </Field>
            </div>

            <Field label="Titular">
              <input value={holder} onChange={(e) => setHolder(e.target.value.toUpperCase())} className="form-input" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Valor (centavos)">
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="form-input" />
              </Field>
              <Field label="Order ID">
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="form-input font-mono" />
              </Field>
            </div>
          </div>

          <button onClick={sendToFintech} disabled={loading} className="btn-primary mt-8 w-full disabled:opacity-60">
            {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Enviando...</> : <>Enviar para Fintech <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>

        {/* Resultado e Histórico */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-surface/40 p-8">
            <h3 className="font-display text-xl">Última Resposta</h3>
            {lastError && <div className="mt-4 rounded-2xl border border-brand-red/40 bg-brand-red/10 p-4 text-sm text-brand-red">{lastError}</div>}
            {lastResponse && (
              <pre className="mt-4 overflow-auto rounded-2xl bg-black/60 p-5 text-xs text-brand-green">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            )}
            {!lastResponse && !lastError && <p className="mt-8 text-center text-sm text-muted">Nenhuma chamada manual ainda.</p>}
          </div>

          <div className="rounded-3xl border border-border bg-surface/40 p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl">Histórico de Testes Manuais</h3>
              {history.length > 0 && <button onClick={clearHistory} className="text-xs text-muted hover:text-white">Limpar</button>}
            </div>
            {history.length === 0 && <p className="text-sm text-muted">Seus testes manuais aparecerão aqui.</p>}
            <div className="space-y-3 mt-4">
              {history.map((h) => (
                <div key={h.id} className="rounded-2xl border border-border/60 bg-background-elev/40 p-4 text-sm">
                  <div className="flex justify-between text-xs text-muted">
                    <span>{new Date(h.timestamp).toLocaleTimeString("pt-BR")}</span>
                    <span className={h.success ? "text-brand-green" : "text-brand-red"}>{h.success ? "OK" : "ERRO"}</span>
                  </div>
                  <div className="mt-2 font-mono text-xs">
                    {h.payload.pan.slice(0, 4)} •••• •••• {h.payload.pan.slice(-4)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
