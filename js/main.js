// =========================================================
// L&L Meu Mundo Cristão | menu, animações ao rolar e seções da home
// =========================================================

(() => {
const $ = (id) => document.getElementById(id);
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".ano").forEach((el) => { el.textContent = new Date().getFullYear(); });

// ---------- Menu do celular ----------
const menuBtn = $("menuBtn");
const menu = $("menuMobile");
if (menuBtn) {
  const fechar = () => { menu.classList.remove("aberto"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "Abrir menu"); };
  menuBtn.addEventListener("click", () => {
    const abre = !menu.classList.contains("aberto");
    menu.classList.toggle("aberto", abre);
    menuBtn.setAttribute("aria-expanded", String(abre));
    menuBtn.setAttribute("aria-label", abre ? "Fechar menu" : "Abrir menu");
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) fechar(); });
}

// borda no topo depois de rolar
const nav = $("nav");
if (nav) {
  const marca = () => nav.classList.toggle("rolou", scrollY > 8);
  addEventListener("scroll", marca, { passive: true });
  marca();
}

// ---------- Aparecer ao rolar (espera a abertura terminar) ----------
function revelar() {
  const itens = document.querySelectorAll(".revela");
  if (!("IntersectionObserver" in window)) { itens.forEach((el) => el.classList.add("visto")); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visto"); obs.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  itens.forEach((el) => obs.observe(el));
}
if (document.documentElement.classList.contains("intro-on")) document.addEventListener("intro:fim", revelar, { once: true });
else revelar();

// ---------- Hero: fotos acompanham o mouse ----------
const heroFotos = $("heroFotos");
if (heroFotos && !semMovimento && matchMedia("(hover: hover)").matches) {
  const camadas = heroFotos.querySelectorAll("[data-prof]");
  let quadro = 0;
  heroFotos.closest(".hero").addEventListener("pointermove", (e) => {
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(() => {
      const r = heroFotos.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      camadas.forEach((c) => {
        const p = Number(c.dataset.prof);
        c.style.transform = `translate(${(x * p).toFixed(1)}px, ${(y * p).toFixed(1)}px)`;
      });
    });
  });
}

// ---------- Destaques ----------
const trilho = $("trilho");
if (trilho && typeof PRODUTOS !== "undefined") {
  const DESTAQUES = ["luxo-caramelo-royal", "xadrez-mostarda", "premium-terracota", "luxo-grafite", "premium-prata", "luxo-cobre", "xadrez-cores", "luxo-royal-dourado"];
  trilho.innerHTML = DESTAQUES.map((id) => PRODUTOS.find((p) => p.id === id)).filter(Boolean).map((p) => `
    <article class="produto produto-mini">
      <a class="produto-foto" href="catalogo.html?p=${p.id}" aria-label="Ver ${p.nome}">
        <span class="produto-tag">${CATEGORIAS[p.cat].replace("Linha ", "")}</span>
        <img src="${foto(p)}" alt="Gravata ${p.nome}" loading="lazy" width="900" height="1200">
        ${p.fotos > 1 ? `<img class="f2" src="${foto(p, 2)}" alt="" loading="lazy" width="900" height="1200">` : ""}
      </a>
      <div class="produto-corpo">
        <h3>${p.nome}</h3>
        <div class="bolinhas">${p.cores.map((c) => `<i style="background:${CORES[c].hex}" title="${CORES[c].nome}"></i>`).join("")}</div>
      </div>
    </article>`).join("");

  const volta = $("setaVolta");
  const vai = $("setaVai");
  const passo = () => trilho.firstElementChild.getBoundingClientRect().width + 18;
  volta.addEventListener("click", () => trilho.scrollBy({ left: -passo() * 2, behavior: semMovimento ? "auto" : "smooth" }));
  vai.addEventListener("click", () => trilho.scrollBy({ left: passo() * 2, behavior: semMovimento ? "auto" : "smooth" }));
  const setas = () => {
    volta.disabled = trilho.scrollLeft < 4;
    vai.disabled = trilho.scrollLeft + trilho.clientWidth > trilho.scrollWidth - 4;
  };
  trilho.addEventListener("scroll", setas, { passive: true });
  addEventListener("resize", setas);
  setas();
}

// ---------- Anatomia: número na gravata ↔ item da lista ----------
const anatLista = $("anatLista");
if (anatLista) {
  const itens = [...anatLista.querySelectorAll(".anat-item")];
  const pontos = [...document.querySelectorAll(".ponto")];
  const ativar = (i) => {
    itens.forEach((b, j) => b.classList.toggle("ativo", i === j));
    pontos.forEach((b, j) => { b.classList.toggle("ativo", i === j); b.setAttribute("aria-pressed", String(i === j)); });
  };
  itens.forEach((b, i) => b.addEventListener("click", () => ativar(i)));
  pontos.forEach((b) => {
    b.addEventListener("click", () => {
      const i = Number(b.dataset.alvo);
      ativar(i);
      // no celular a lista fica embaixo: leva até o texto
      if (innerWidth < 900) itens[i].scrollIntoView({ behavior: semMovimento ? "auto" : "smooth", block: "center" });
    });
    b.addEventListener("pointerenter", () => ativar(Number(b.dataset.alvo)));
  });
  ativar(0);
}
})();
