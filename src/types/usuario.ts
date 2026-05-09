export type EnderecoSalvo = {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type Usuario = {
  id: string;
  email: string;
  nome: string;
  telefone: string;
  /** Hash bcrypt-like (SHA-256 + salt para ambiente de teste). */
  senhaHash: string;
  endereco?: EnderecoSalvo;
  criadoEm: string;
  atualizadoEm: string;
};

/** Dados retornados ao cliente — nunca inclui senhaHash. */
export type UsuarioPublico = Omit<Usuario, "senhaHash">;
