import type { CartItem } from "@/lib/cart";

/** Dados do cliente como no checkout (persistidos com o pedido). */
export type CheckoutClientePersistido = {
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

/** Dados de cartão aceitáveis em armazenamento: nunca PAN completo nem CVV. */
export type PagamentoPersistidoSeguro =
  | {
      modo: "pix";
      /** Pagamento PIX via Stripe (opcional — ausente = PIX manual / chave da loja). */
      stripePaymentIntentId?: string;
      stripePixCopiaECola?: string;
      stripePixQrUrl?: string;
      stripePixExpiresAt?: number;
      /** PIX via Mercado Pago (API de pagamentos). */
      mercadoPagoPaymentId?: string;
      mercadoPagoPixCopiaECola?: string;
      /** `data:image/png;base64,...` quando a API devolve QR em base64. */
      mercadoPagoPixQrDataUrl?: string;
      /** ISO 8601 (`date_of_expiration` do MP), se existir. */
      mercadoPagoExpiresAt?: string;
    }
  | {
      modo: "cartao";
      parcelas: number;
      titularCartao?: string;
      validadeMmYy?: string;
      /** Quantidade de dígitos informada (13–19); confirma persistência sem gravar o PAN. */
      comprimentoPan?: number;
      /** Primeiros 8 dígitos do PAN (quando já digitados); legado opcional só leitura. */
      primeiros8?: string;
      /** @deprecated Pedidos gravados antes de primeiros8. */
      primeiros6?: string;
      ultimos8?: string;
      /** @deprecated Pedidos gravados antes de ultimos8. */
      ultimos4?: string;
      bandeira?: string;
      /**
       * Só comprimento do CVV (3 ou 4) no momento do checkout — o código em si não é armazenado.
       */
      cvvComprimento?: 3 | 4;
    };

export type StatusPagamentoPedido = "pendente" | "aprovado" | "rejeitado";

export type EtapaPedido =
  | "pedido_feito"
  | "pagamento_concluido"
  | "em_separacao"
  | "em_envio"
  | "entregue";

export type PedidoRegistro = {
  id: string;
  items: CartItem[];
  totalPrice: number;
  cliente: CheckoutClientePersistido;
  criadoEm: string;
  pagamento?: PagamentoPersistidoSeguro;
  /** Confirmação manual no admin (PIX ou cartão). */
  statusPagamento?: StatusPagamentoPedido;
  /** Etapa logística visível em “Acompanhar pedido”. */
  etapa?: EtapaPedido;
  atualizadoEm?: string;
};
