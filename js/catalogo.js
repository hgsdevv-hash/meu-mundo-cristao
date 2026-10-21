// =========================================================
// L&L Meu Mundo Cristão | catálogo e lista de pedido pelo WhatsApp
// Os produtos ficam em js/gravatas.js
// =========================================================

(() => {
const CHAVE = "mmc-lista";
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);
const porId = (id) => PRODUTOS.find((p) => p.id === id);

// ---------- Lista: cada item é uma gravata + cor ("id|cor") ----------
let lista = {};
try { lista = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { lista = {}; }
// tira itens que saíram do catálogo
Object.keys(lista).forEach((k) => { if (!porId(k.split("|")[0])) delete lista[k]; });

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) { /* sem armazenamento: só não lembra */ }
}
const chave = (id, cor = "") => `${id}|${cor}`;
const qtdDe = (id) => Object.entries(lista).filter(([k]) => k.startsWith(id + "|")).reduce((s, [, n]) => s + n, 0);

// ---------- Busca e filtros (ficam no endereço, dá para mandar o link) ----------
const buscaEl = $("busca");
const ordemEl = $("ordem");
const lado = $("catLado");
const toggleBtn = $("catToggle");

const url = new URLSearchParams(location.search);
const estado = {
  q: (url.get("q") || "").trim(),
  cat: CATEGORIAS[url.get("cat")] ? url.get("cat") : "todas",
  cor: CORES[url.get("cor")] ? url.get("cor") : "",
  ordem: ["destaque", "az", "za", "linha"].includes(url.get("ordem")) ? url.get("ordem") : "destaque",
};
buscaEl.value = estado.q;
ordemEl.value = estado.ordem;

// tira acentos e maiúsculas, para "medalhao" achar "medalhão"
const normal = (t) => (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
PRODUTOS.forEach((p, i) => {
  p.ordem = i;
  p.busca = normal([p.nome, p.desc, CATEGORIAS[p.cat], p.cores.map((c) => CORES[c].nome).join(" "), (p.variantes || []).join(" "), p.tags].join(" "));
});

function porBusca() {
  const termos = normal(estado.q).split(/\s+/).filter(Boolean);
  return PRODUTOS.filter((p) => termos.every((t) => p.busca.includes(t)));
}

function filtrados() {
  const lista = porBusca().filter((p) => (estado.cat === "todas" || p.cat === estado.cat) && (!estado.cor || p.cores.includes(estado.cor)));
  const ord = {
    destaque: (a, b) => a.ordem - b.ordem,
    az: (a, b) => a.nome.localeCompare(b.nome, "pt-BR"),
    za: (a, b) => b.nome.localeCompare(a.nome, "pt-BR"),
    linha: (a, b) => Object.keys(CATEGORIAS).indexOf(a.cat) - Object.keys(CATEGORIAS).indexOf(b.cat) || a.ordem - b.ordem,
  }[estado.ordem];
  return lista.sort(ord);
}

function salvarURL(produto) {
  const u = new URLSearchParams();
  if (estado.q) u.set("q", estado.q);
  if (estado.cat !== "todas") u.set("cat", estado.cat);
  if (estado.cor) u.set("cor", estado.cor);
  if (estado.ordem !== "destaque") u.set("ordem", estado.ordem);
  if (produto) u.set("p", produto);
  const s = u.toString();
  history.replaceState(null, "", s ? "?" + s : location.pathname);
}

// ---------- Lado: linhas e cores com contagem ----------
function renderLado() {
  const base = porBusca();
  const naCor = base.filter((p) => !estado.cor || p.cores.includes(estado.cor));
  const conta = (cat) => naCor.filter((p) => cat === "todas" || p.cat === cat).length;
  $("catLista").innerHTML = ["todas", ...Object.keys(CATEGORIAS)].map((c) => `
    <li><button type="button" data-cat="${c}" aria-pressed="${estado.cat === c}">
      ${c === "todas" ? "Todas as gravatas" : CATEGORIAS[c]} <small>${conta(c)}</small>
    </button></li>`).join("");

  const naLinha = base.filter((p) => estado.cat === "todas" || p.cat === estado.cat);
  $("catCores").innerHTML = Object.entries(CORES).map(([c, { nome, hex }]) => {
    const n = naLinha.filter((p) => p.cores.includes(c)).length;
    return `<button type="button" data-cor="${c}" style="background:${hex}" aria-pressed="${estado.cor === c}" aria-label="${nome} (${n})" title="${nome} (${n})" ${n ? "" : "disabled"}></button>`;
  }).join("");

  const filtros = (estado.cat !== "todas") + Boolean(estado.cor);
  $("catLimpar").hidden = !filtros && !estado.q;
  $("catToggleConta").textContent = filtros || "";
}

function renderChips() {
  const chips = [];
  if (estado.q) chips.push(`<button type="button" class="chip" data-tira="q">“${estado.q.replace(/</g, "&lt;")}”</button>`);
  if (estado.cat !== "todas") chips.push(`<button type="button" class="chip" data-tira="cat">${CATEGORIAS[estado.cat]}</button>`);
  if (estado.cor) chips.push(`<button type="button" class="chip" data-tira="cor">${CORES[estado.cor].nome}</button>`);
  $("catChips").innerHTML = chips.join("");
}

// ---------- Cards ----------
function acaoHTML(p) {
  if (p.variantes) {
    const n = qtdDe(p.id);
    return `<button type="button" class="btn ${n ? "btn-outline" : "btn-primary"}" data-abre="${p.id}">${n ? `Na lista (${n})` : "Escolher cor"}</button>`;
  }
  const n = lista[chave(p.id)] || 0;
  if (!n) return `<button type="button" class="btn btn-primary" data-add="${p.id}">Adicionar</button>`;
  return `<div class="qtd" role="group" aria-label="Quantidade de ${p.nome}">
      <button type="button" data-menos="${chave(p.id)}" aria-label="Tirar uma">−</button>
      <output aria-live="polite">${n}</output>
      <button type="button" data-mais="${chave(p.id)}" aria-label="Pôr mais uma">+</button>
    </div>`;
}

function cardHTML(p, i) {
  return `<article class="produto" id="card-${p.id}" style="--i:${i}">
    <button type="button" class="produto-foto" data-abre="${p.id}" aria-label="Ver detalhes de ${p.nome}">
      <span class="produto-tag">${CATEGORIAS[p.cat].replace("Linha ", "")}</span>
      <img src="${foto(p)}" alt="Gravata ${p.nome}" loading="lazy" width="900" height="1200">
      ${p.fotos > 1 ? `<img class="f2" src="${foto(p, 2)}" alt="" loading="lazy" width="900" height="1200"><span class="produto-fotos">${p.fotos} fotos</span>` : ""}
    </button>
    <div class="produto-corpo">
      <h3>${p.nome}</h3>
      <div class="bolinhas">${p.cores.map((c) => `<i style="background:${CORES[c].hex}" title="${CORES[c].nome}"></i>`).join("")}${p.variantes ? `<span>${p.variantes.length} opções</span>` : ""}</div>
      <p>${p.desc}</p>
      <div class="produto-acoes">
        <button type="button" class="btn btn-outline ver" data-abre="${p.id}">Detalhes</button>
        <span class="acao" style="display:flex;flex:1">${acaoHTML(p)}</span>
      </div>
    </div>
  </article>`;
}

function renderProdutos() {
  const itens = filtrados();
  $("produtos").innerHTML = itens.map(cardHTML).join("");
  $("catVazio").hidden = itens.length > 0;
  $("catInfo").innerHTML = itens.length
    ? `<b>${itens.length}</b> ${itens.length === 1 ? "gravata" : "gravatas"}${estado.cat !== "todas" ? ` na ${CATEGORIAS[estado.cat]}` : ""}`
    : "Nenhuma gravata";
  renderLado();
  renderChips();
  salvarURL(modal.open ? modal.dataset.id : "");
}

function atualizarCard(id) {
  const card = $("card-" + id);
  if (card) card.querySelector(".acao").innerHTML = acaoHTML(porId(id));
}

function mudar(k, delta, origem) {
  const n = (lista[k] || 0) + delta;
  if (n > 0) lista[k] = n; else delete lista[k];
  salvar();
  const id = k.split("|")[0];
  atualizarCard(id);
  if (delta > 0 && origem) voar(origem, id);
  atualizarLista(delta > 0);
  if (!gaveta.hidden) renderGaveta();
}

// ---------- Eventos dos filtros ----------
buscaEl.addEventListener("input", () => { estado.q = buscaEl.value.trim(); renderProdutos(); });
$("catBusca").addEventListener("submit", (e) => { e.preventDefault(); buscaEl.blur(); $("produtos").scrollIntoView({ behavior: semMovimento ? "auto" : "smooth", block: "start" }); });
$("catLista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]");
  if (!b) return;
  estado.cat = b.dataset.cat;
  renderProdutos();
});
$("catCores").addEventListener("click", (e) => {
  const b = e.target.closest("[data-cor]");
  if (!b) return;
  estado.cor = estado.cor === b.dataset.cor ? "" : b.dataset.cor;
  renderProdutos();
});
function limparTudo() {
  Object.assign(estado, { q: "", cat: "todas", cor: "" });
  buscaEl.value = "";
  renderProdutos();
}
$("catLimpar").addEventListener("click", limparTudo);
$("catVazioLimpar").addEventListener("click", limparTudo);
$("catChips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tira]");
  if (!b) return;
  const t = b.dataset.tira;
  if (t === "q") { estado.q = ""; buscaEl.value = ""; }
  if (t === "cat") estado.cat = "todas";
  if (t === "cor") estado.cor = "";
  renderProdutos();
});
ordemEl.addEventListener("change", () => { estado.ordem = ordemEl.value; renderProdutos(); });
toggleBtn.addEventListener("click", () => {
  const abre = !lado.classList.contains("aberto");
  lado.classList.toggle("aberto", abre);
  toggleBtn.setAttribute("aria-expanded", String(abre));
});

// cliques nos cards
$("produtos").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.abre) abrirProduto(b.dataset.abre);
  else if (b.dataset.add) mudar(chave(b.dataset.add), 1, b.closest(".produto").querySelector(".produto-foto img"));
  else if (b.dataset.mais) mudar(b.dataset.mais, 1);
  else if (b.dataset.menos) mudar(b.dataset.menos, -1);
});

// ---------- Janela do produto ----------
const modal = $("modal");
let qtdModal = 1;

function abrirProduto(id) {
  const p = porId(id);
  if (!p) return;
  qtdModal = 1;
  modal.dataset.id = id;
  const fotos = Array.from({ length: p.fotos }, (_, i) => foto(p, i + 1));
  $("modalConteudo").innerHTML = `
    <div class="galeria">
      <div class="galeria-trilho" id="galTrilho" tabindex="0" aria-label="Fotos de ${p.nome}">
        ${fotos.map((f, i) => `<img src="${f}" alt="${p.nome}, foto ${i + 1} de ${fotos.length}" width="900" height="1200">`).join("")}
      </div>
      ${fotos.length > 1 ? `<div class="galeria-miniaturas" id="galMinis">${fotos.map((f, i) => `<button type="button" data-foto="${i}" aria-label="Foto ${i + 1}" aria-current="${i === 0}"><img src="${f}" alt=""></button>`).join("")}</div>` : ""}
    </div>
    <div class="modal-txt">
      <span class="eyebrow">${CATEGORIAS[p.cat]}</span>
      <h2 id="modalNome">${p.nome}</h2>
      <p class="modal-desc">${p.desc}</p>
      <ul class="ficha">${FICHA[p.cat].map((f) => `<li>${f}</li>`).join("")}</ul>
      ${p.variantes ? `<fieldset class="variantes"><legend>Escolha a cor</legend><div>
        ${p.variantes.map((v, i) => `<label><input type="radio" name="variante" value="${v}" ${i === 0 ? "checked" : ""}><span>${v}</span></label>`).join("")}
      </div></fieldset>` : ""}
      <div class="modal-acoes">
        <div class="modal-linha">
          <div class="qtd" role="group" aria-label="Quantidade">
            <button type="button" id="mMenos" aria-label="Tirar uma">−</button>
            <output id="mQtd" aria-live="polite">1</output>
            <button type="button" id="mMais" aria-label="Pôr mais uma">+</button>
          </div>
          <button type="button" class="btn btn-primary" id="mAdd">Adicionar à lista</button>
        </div>
        <a class="btn btn-whats" id="mWhats" href="#" target="_blank" rel="noopener">
          <svg class="i" aria-hidden="true"><use href="#i-whats"/></svg> Pedir só esta no WhatsApp
        </a>
        <p class="modal-nota">Preço e prazo de envio são passados pelo WhatsApp.</p>
      </div>
    </div>`;

  const trilho = $("galTrilho");
  const minis = $("galMinis");
  if (minis) {
    minis.addEventListener("click", (e) => {
      const b = e.target.closest("[data-foto]");
      if (b) trilho.scrollTo({ left: trilho.clientWidth * Number(b.dataset.foto), behavior: semMovimento ? "auto" : "smooth" });
    });
    trilho.addEventListener("scroll", () => {
      const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
      minis.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", String(i === j)));
    }, { passive: true });
  }

  const variante = () => (modal.querySelector("input[name=variante]:checked") || {}).value || "";
  const linkSo = () => {
    const txt = `Olá! Vim pelo site e quero a gravata ${p.nome}${variante() ? ` (${variante()})` : ""}, ${qtdModal} ${qtdModal === 1 ? "unidade" : "unidades"}. Qual o valor e o prazo de envio?`;
    $("mWhats").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`;
  };
  const qtd = (d) => { qtdModal = Math.max(1, qtdModal + d); $("mQtd").textContent = qtdModal; linkSo(); };
  $("mMenos").addEventListener("click", () => qtd(-1));
  $("mMais").addEventListener("click", () => qtd(1));
  modal.addEventListener("change", linkSo);
  $("mAdd").addEventListener("click", () => {
    mudar(chave(p.id, variante()), qtdModal, trilho.querySelector("img"));
    fecharProduto();
  });
  linkSo();

  if (!modal.open) modal.showModal();
  salvarURL(id);
}

function fecharProduto() {
  if (modal.open) modal.close();
}
modal.addEventListener("close", () => { delete modal.dataset.id; salvarURL(); });
$("modalFechar").addEventListener("click", fecharProduto);
// clique fora da janela fecha
modal.addEventListener("click", (e) => { if (e.target === modal) fecharProduto(); });

// ---------- Foto voando até a barra da lista ----------
function voar(img, id) {
  if (semMovimento || !img) return;
  const de = img.getBoundingClientRect();
  barra.hidden = false;
  const para = $("listaConta").getBoundingClientRect();
  const v = document.createElement("img");
  v.src = foto(porId(id));
  v.className = "voando";
  Object.assign(v.style, { left: de.left + "px", top: de.top + "px", width: de.width + "px", height: de.height + "px" });
  document.body.appendChild(v);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const dx = para.left + para.width / 2 - (de.left + de.width / 2);
    const dy = para.top + para.height / 2 - (de.top + de.height / 2);
    v.style.transform = `translate(${dx}px, ${dy}px) scale(${32 / de.width})`;
    v.style.opacity = ".3";
  }));
  setTimeout(() => v.remove(), 750);
}

// ---------- Barra, gaveta e mensagem do WhatsApp ----------
const barra = $("listaBarra");
const gaveta = $("gaveta");
const abrirBtn = $("listaAbrir");

function mensagem() {
  const linhas = Object.entries(lista).map(([k, n]) => {
    const [id, cor] = k.split("|");
    return `• ${n}x ${porId(id).nome}${cor ? ` (${cor})` : ""}`;
  });
  const nota = $("listaNota").value.trim();
  return `Olá! Vim pelo site e montei esta lista de gravatas:\n\n${linhas.join("\n")}${nota ? `\n\nObservação: ${nota}` : ""}\n\nPode me passar o valor e o prazo de envio?`;
}
const linkWhats = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem())}`;

function atualizarLista(pular) {
  const total = Object.values(lista).reduce((s, n) => s + n, 0);
  barra.hidden = total === 0;
  document.body.classList.toggle("tem-lista", total > 0);
  const conta = $("listaConta");
  conta.textContent = total;
  if (pular && !semMovimento) { conta.classList.remove("pula"); void conta.offsetWidth; conta.classList.add("pula"); }
  $("listaEnviar").href = linkWhats();
  $("listaEnviarBarra").href = linkWhats();
  if (!total && !gaveta.hidden) fecharGaveta();
}

function renderGaveta() {
  $("gavetaLista").innerHTML = Object.entries(lista).map(([k, n]) => {
    const [id, cor] = k.split("|");
    const p = porId(id);
    return `<li>
      <img src="${foto(p)}" alt="">
      <div><b>${p.nome}</b><small>${cor || CATEGORIAS[p.cat]}</small></div>
      <div class="qtd" role="group" aria-label="Quantidade de ${p.nome}">
        <button type="button" data-menos="${k}" aria-label="Tirar uma">−</button><output>${n}</output><button type="button" data-mais="${k}" aria-label="Pôr mais uma">+</button>
      </div>
    </li>`;
  }).join("");
}
function abrirGaveta() {
  renderGaveta();
  gaveta.hidden = false;
  abrirBtn.setAttribute("aria-expanded", "true");
  $("gavetaFechar").focus();
}
function fecharGaveta() {
  gaveta.hidden = true;
  abrirBtn.setAttribute("aria-expanded", "false");
  abrirBtn.focus();
}
abrirBtn.addEventListener("click", abrirGaveta);
$("gavetaFechar").addEventListener("click", fecharGaveta);
gaveta.addEventListener("click", (e) => {
  if (e.target === gaveta) return fecharGaveta();
  const b = e.target.closest("button");
  if (b && b.dataset.mais) mudar(b.dataset.mais, 1);
  if (b && b.dataset.menos) mudar(b.dataset.menos, -1);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !gaveta.hidden) fecharGaveta(); });
$("listaNota").addEventListener("input", () => { $("listaEnviar").href = linkWhats(); $("listaEnviarBarra").href = linkWhats(); });
$("listaLimpar").addEventListener("click", () => {
  const ids = new Set(Object.keys(lista).map((k) => k.split("|")[0]));
  lista = {};
  salvar();
  ids.forEach(atualizarCard);
  atualizarLista();
});

// ---------- Início ----------
renderProdutos();
atualizarLista();
const pedido = url.get("p");
if (pedido && porId(pedido)) abrirProduto(pedido);
})();
