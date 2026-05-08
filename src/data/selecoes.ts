export type Selecao = {
  slug: string;
  nome: string;
  bandeira: string;
  cores: {
    primaria: string;
    secundaria: string;
    terciaria?: string;
  };
  grupo?: string;
  popularidade: number;
  destaque?: boolean;
  apelido?: string;
};

export const SELECOES: Selecao[] = [
  {
    slug: "brasil",
    nome: "Brasil",
    bandeira: "🇧🇷",
    cores: { primaria: "#FFDF00", secundaria: "#009C3B", terciaria: "#002776" },
    popularidade: 100,
    destaque: true,
    apelido: "Seleção Canarinho",
  },
  {
    slug: "argentina",
    nome: "Argentina",
    bandeira: "🇦🇷",
    cores: { primaria: "#75AADB", secundaria: "#FFFFFF", terciaria: "#F6B40E" },
    popularidade: 95,
    destaque: true,
    apelido: "Albiceleste",
  },
  {
    slug: "franca",
    nome: "França",
    bandeira: "🇫🇷",
    cores: { primaria: "#0055A4", secundaria: "#FFFFFF", terciaria: "#EF4135" },
    popularidade: 92,
    destaque: true,
    apelido: "Les Bleus",
  },
  {
    slug: "alemanha",
    nome: "Alemanha",
    bandeira: "🇩🇪",
    cores: { primaria: "#000000", secundaria: "#DD0000", terciaria: "#FFCE00" },
    popularidade: 88,
    destaque: true,
    apelido: "Die Mannschaft",
  },
  {
    slug: "espanha",
    nome: "Espanha",
    bandeira: "🇪🇸",
    cores: { primaria: "#AA151B", secundaria: "#F1BF00" },
    popularidade: 86,
    destaque: true,
    apelido: "La Roja",
  },
  {
    slug: "inglaterra",
    nome: "Inglaterra",
    bandeira: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    cores: { primaria: "#FFFFFF", secundaria: "#CE1124", terciaria: "#012169" },
    popularidade: 84,
    destaque: true,
    apelido: "Three Lions",
  },
  {
    slug: "portugal",
    nome: "Portugal",
    bandeira: "🇵🇹",
    cores: { primaria: "#046A38", secundaria: "#DA291C", terciaria: "#FFD100" },
    popularidade: 82,
    destaque: true,
    apelido: "Seleção das Quinas",
  },
  {
    slug: "holanda",
    nome: "Holanda",
    bandeira: "🇳🇱",
    cores: { primaria: "#FF6B00", secundaria: "#21468B", terciaria: "#FFFFFF" },
    popularidade: 78,
    destaque: true,
    apelido: "Oranje",
  },
  {
    slug: "italia",
    nome: "Itália",
    bandeira: "🇮🇹",
    cores: { primaria: "#0066CC", secundaria: "#FFFFFF", terciaria: "#009246" },
    popularidade: 76,
    apelido: "Azzurra",
  },
  {
    slug: "belgica",
    nome: "Bélgica",
    bandeira: "🇧🇪",
    cores: { primaria: "#ED2939", secundaria: "#000000", terciaria: "#FAE042" },
    popularidade: 72,
    apelido: "Diabos Vermelhos",
  },
  {
    slug: "croacia",
    nome: "Croácia",
    bandeira: "🇭🇷",
    cores: { primaria: "#FF0000", secundaria: "#FFFFFF", terciaria: "#171796" },
    popularidade: 70,
    apelido: "Vatreni",
  },
  {
    slug: "uruguai",
    nome: "Uruguai",
    bandeira: "🇺🇾",
    cores: { primaria: "#7BB3E0", secundaria: "#FFFFFF", terciaria: "#FCD116" },
    popularidade: 68,
    apelido: "La Celeste",
  },
  {
    slug: "mexico",
    nome: "México",
    bandeira: "🇲🇽",
    cores: { primaria: "#006847", secundaria: "#CE1126", terciaria: "#FFFFFF" },
    popularidade: 66,
    apelido: "El Tri",
  },
  {
    slug: "estados-unidos",
    nome: "Estados Unidos",
    bandeira: "🇺🇸",
    cores: { primaria: "#3C3B6E", secundaria: "#B22234", terciaria: "#FFFFFF" },
    popularidade: 60,
    apelido: "USMNT",
  },
  {
    slug: "canada",
    nome: "Canadá",
    bandeira: "🇨🇦",
    cores: { primaria: "#D52B1E", secundaria: "#FFFFFF" },
    popularidade: 55,
    apelido: "Les Rouges",
  },
  {
    slug: "japao",
    nome: "Japão",
    bandeira: "🇯🇵",
    cores: { primaria: "#0033A0", secundaria: "#BC002D", terciaria: "#FFFFFF" },
    popularidade: 58,
    apelido: "Samurai Blue",
  },
];

export function getSelecao(slug: string) {
  return SELECOES.find((s) => s.slug === slug);
}

export const SELECOES_DESTAQUE = SELECOES.filter((s) => s.destaque);
