/** Solicitação de pedido personalizado (atacado) — gravada no SQLite e lida no admin. */
export type LojistaPedidoPersonalizadoRegistro = {
  id: string;
  criadoEm: string;
  /** E-mail ou telefone para resposta. */
  contato: string;
  /** Texto livre com volumes, prazos, cidade etc. */
  mensagem: string;
};
