/** Snapshot enviado pelo checkout para remarketing (sem dados sensíveis de pagamento). */
export type RemarketingCheckoutItem = {
  produtoId: string;
  nome: string;
  quantidade: number;
  linhaTotal: number;
};

export type CheckoutAbandonCliente = {
  email?: string;
  nome?: string;
  telefone?: string;
  cep?: string;
  cidade?: string;
  uf?: string;
};

export type CheckoutAbandonPayload = {
  sessionId: string;
  cliente: CheckoutAbandonCliente;
  paymentModo: "pix" | "cartao";
  subtotalLoja: number;
  totalComPagamentoEscolhido: number;
  items: RemarketingCheckoutItem[];
  referrer?: string;
};

export type CheckoutAbandonDoc = Omit<CheckoutAbandonPayload, never> & {
  path: "/checkout";
  ultimaCapturaClienteEm: string;
  criadoEm: string;
  atualizadoEm: string;
};
