"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/pedidos";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Não foi possível entrar.");
        return;
      }
      const allowedNext = next.startsWith("/admin") || next.startsWith("/fintech");
      window.location.href = allowedNext ? next : "/admin/pedidos";
    } catch {
      setError("Erro de rede. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Senha</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          placeholder="••••••••"
          required
        />
      </label>
      {error && <p className="text-sm text-brand-red">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        <Lock className="h-4 w-4" />
        {loading ? "Entrando…" : "Entrar"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
