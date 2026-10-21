// =========================================================
// L&L Meu Mundo Cristão | lista de produtos (usada na home e no catálogo)
//
// Para editar os produtos, mexa só na lista PRODUTOS abaixo.
// fotos: arquivos em assets/img/produtos/ (a primeira é a capa do card)
// cores: usadas no filtro por cor
// variantes: quando a foto mostra mais de uma gravata, o cliente escolhe a cor
// tags: palavras extras que a busca também encontra
// =========================================================

const WHATSAPP = "5519991180486";

// fotos tiradas do Instagram @l.meumundocristao
// TODO: confirmar com o Lucas os nomes, a linha de cada gravata e o que tem em estoque
const PRODUTOS = [
  // linha Luxo
  { id: "luxo-grafite", cat: "luxo", nome: "Luxo Grafite Medalhão", fotos: 2, cores: ["cinza", "rosa"],
    desc: "Grafite com medalhões em rosé. Discreta de longe, rica de perto.", tags: "chumbo" },
  { id: "luxo-caramelo-royal", cat: "luxo", nome: "Luxo Caramelo e Royal", fotos: 2, cores: ["marrom", "azul"],
    desc: "Fundo caramelo com desenhos em azul royal. Fica ótima com terno cinza ou azul.", tags: "dourado mostarda" },
  { id: "luxo-rose", cat: "luxo", nome: "Luxo Rosé Medalhão", fotos: 2, cores: ["rosa", "marrom"],
    desc: "Rosé com medalhões em marrom e dourado, para ocasiões de dia.", tags: "casamento padrinho" },
  { id: "luxo-cobre", cat: "luxo", nome: "Luxo Cobre e Marinho", fotos: 3, cores: ["marrom", "azul"],
    desc: "Cobre com medalhões em marinho. Combina com terno azul-marinho.", tags: "laranja" },
  { id: "luxo-caramelo", cat: "luxo", nome: "Luxo Caramelo Medalhão", fotos: 1, cores: ["marrom", "azul"],
    desc: "Caramelo com medalhões azuis espaçados, clássica.", tags: "dourado mostarda" },
  { id: "luxo-royal-dourado", cat: "luxo", nome: "Luxo Royal e Dourado", fotos: 1, cores: ["azul", "dourado"],
    desc: "Azul royal com dourado em desenho geométrico, para quem gosta de destaque.", tags: "amarelo" },
  { id: "luxo-trio-classico", cat: "luxo", nome: "Luxo Clássicas", fotos: 1, cores: ["azul", "vinho", "cinza"],
    variantes: ["Cinza azulado", "Marinho poá", "Vinho floral"],
    desc: "Três clássicas para o dia a dia: cinza azulado, marinho com poá e vinho floral.", tags: "bolinhas pois bordo" },
  { id: "luxo-trio-royal", cat: "luxo", nome: "Luxo Royal, Dourada e Marinho", fotos: 2, cores: ["azul", "dourado"],
    variantes: ["Royal", "Dourada", "Marinho"],
    desc: "Tons fortes com desenhos em relevo.", tags: "amarelo" },

  // linha Premium (jacquard)
  { id: "premium-prata", cat: "premium", nome: "Premium Prata Geométrica", fotos: 1, cores: ["cinza", "azul"],
    desc: "Prata com desenho geométrico em azul claro e cobre.", tags: "jacquard cinza" },
  { id: "premium-lavanda", cat: "premium", nome: "Premium Lavanda Quadriculada", fotos: 1, cores: ["azul", "marrom"],
    desc: "Lavanda com quadriculado cobre, diferente e elegante.", tags: "jacquard roxo lilas" },
  { id: "premium-terracota", cat: "premium", nome: "Premium Terracota Medalhão", fotos: 1, cores: ["vermelho", "marrom"],
    desc: "Terracota com medalhões grandes. Esquenta qualquer terno escuro.", tags: "jacquard laranja" },
  { id: "premium-trio-jacquard", cat: "premium", nome: "Premium Jacquard", fotos: 2, cores: ["azul", "preto", "vinho"],
    variantes: ["Azul", "Grafite", "Vinho"],
    desc: "Jacquard em três cores: azul, grafite e vinho.", tags: "jacquard bordo" },
  { id: "premium-trio-oliva", cat: "premium", nome: "Premium Marinho, Oliva e Lavanda", fotos: 3, cores: ["azul", "verde"],
    variantes: ["Marinho", "Oliva", "Lavanda"],
    desc: "Marinho com detalhes, oliva com medalhões e lavanda geométrica.", tags: "jacquard verde mostarda" },
  { id: "premium-trio-azul", cat: "premium", nome: "Premium Tons de Azul", fotos: 1, cores: ["azul"],
    variantes: ["Xadrez azul", "Marinho poá", "Azul arabesco"],
    desc: "Três azuis para combinar com camisa branca ou azul clara.", tags: "jacquard" },

  // linha Xadrez
  { id: "xadrez-cores", cat: "xadrez", nome: "Xadrez Premium", fotos: 3, cores: ["azul", "vermelho", "verde", "marrom", "rosa"],
    variantes: ["Azul", "Vermelho", "Marrom", "Verde e marinho", "Rosé"],
    desc: "Variedade de cores com 7 cm de ponta (semi slim).", tags: "quadriculado" },
  { id: "xadrez-mostarda", cat: "xadrez", nome: "Xadrez Mostarda", fotos: 3, cores: ["dourado", "marrom"],
    desc: "Mostarda com preto e marrom. Fica perfeita com blazer marrom.", tags: "amarelo terra" },
  { id: "xadrez-grafite", cat: "xadrez", nome: "Xadrez Grafite e Vinho", fotos: 3, cores: ["cinza", "vinho"],
    desc: "Grafite, vinho e branco. Combina com terno cinza.", tags: "chumbo bordo" },
];

const CATEGORIAS = {
  luxo:    "Linha Luxo",
  premium: "Linha Premium",
  xadrez:  "Linha Xadrez",
};

const CORES = {
  vermelho: { nome: "Vermelho", hex: "#b3121e" },
  vinho:    { nome: "Vinho",    hex: "#6e2340" },
  rosa:     { nome: "Rosé",     hex: "#d6a2ad" },
  azul:     { nome: "Azul",     hex: "#2b55a8" },
  verde:    { nome: "Verde",    hex: "#7a8a2c" },
  marrom:   { nome: "Marrom",   hex: "#8a5a34" },
  dourado:  { nome: "Dourado",  hex: "#c9a24a" },
  cinza:    { nome: "Cinza",    hex: "#7a8093" },
  preto:    { nome: "Preto",    hex: "#1d1d22" },
};

// o que cada linha tem (aparece na janela do produto)
const FICHA = {
  luxo:    ["Tecido tipo seda", "1200 fios", "7 cm de ponta (semi slim)", "Costura reforçada", "Entretela dupla"],
  premium: ["Tecido jacquard", "1200 fios", "7 cm de ponta (semi slim)", "Costura reforçada", "Entretela dupla"],
  xadrez:  ["Tecido de excelência", "7 cm de ponta (semi slim)", "Costura reforçada", "Variedade de cores"],
};

const foto = (p, n = 1) => `assets/img/produtos/${p.id}-${n}.jpg`;
