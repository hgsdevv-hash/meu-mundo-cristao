// =========================================================
// Abertura: gravata vermelha se amarrando e a marca aparecendo
// A volta do colarinho se desenha, o nó cai e aperta, a gravata desce,
// balança e brilha. Passa uma vez por visita (sessionStorage); ?intro força.
// Pulável com clique ou tecla. Quem pede menos movimento não vê a abertura.
// =========================================================

(() => {
  const CHAVE = "mmc-intro-vista";
  const forcar = new URLSearchParams(location.search).has("intro");
  let vista = false;
  try { vista = sessionStorage.getItem(CHAVE) === "1"; } catch (e) { /* sem armazenamento: mostra */ }
  if (!forcar && (vista || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  try { sessionStorage.setItem(CHAVE, "1"); } catch (e) { /* tudo bem */ }

  const NO = "M82 34 Q100 28 118 34 L110 72 Q100 76 90 72 Z";
  const LAMINA = "M90 73 Q100 77 110 73 L132 280 L100 316 L68 280 Z";

  const el = document.createElement("div");
  el.className = "intro";
  el.setAttribute("role", "presentation");
  el.innerHTML = `
    <div class="intro-palco">
      <svg class="intro-svg" viewBox="0 0 200 330" aria-hidden="true">
        <defs>
          <pattern id="tiTrama" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <rect width="4" height="4" fill="#b3121e"/><rect width="2" height="4" fill="#c91d2a"/>
          </pattern>
          <linearGradient id="tiVolume" x1="0" x2="1">
            <stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/>
            <stop offset="1" stop-color="#000" stop-opacity=".35"/>
          </linearGradient>
          <linearGradient id="tiSombraNo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
          </linearGradient>
          <linearGradient id="tiBrilho" x1="0" x2="1">
            <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
          <clipPath id="tiForma"><path d="${NO} ${LAMINA}"/></clipPath>
        </defs>

        <path class="ti-volta" d="M56 18 Q100 50 144 18" pathLength="1"/>

        <g class="ti-gravata">
          <g class="ti-lamina">
            <path d="${LAMINA}" fill="url(#tiTrama)"/>
            <path d="${LAMINA}" fill="url(#tiVolume)"/>
            <path d="M71 278 L100 312 L129 278" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".9" stroke-dasharray="2.2 1.8"/>
          </g>
          <g class="ti-no">
            <path d="${NO}" fill="url(#tiTrama)"/>
            <path d="${NO}" fill="url(#tiSombraNo)"/>
            <path d="M86 37 Q100 33 114 37" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/>
          </g>
          <g clip-path="url(#tiForma)"><rect class="ti-brilho" x="40" y="20" width="34" height="310" fill="url(#tiBrilho)"/></g>
        </g>
      </svg>

      <div class="intro-marca">
        <span class="intro-ll">L<em>&amp;</em>L</span>
        <span class="intro-nome">Meu Mundo Cristão</span>
        <span class="intro-sub">Gravatas · Camisas · Acessórios</span>
      </div>
    </div>
    <button type="button" class="intro-pular">Pular</button>`;

  document.documentElement.classList.add("intro-on");
  document.body.prepend(el);

  let fim = false;
  function encerrar() {
    if (fim) return;
    fim = true;
    el.classList.add("saindo");
    document.documentElement.classList.remove("intro-on");
    document.dispatchEvent(new CustomEvent("intro:fim"));
    setTimeout(() => el.remove(), 900);
  }
  const relogio = setTimeout(encerrar, 3900);
  const pular = () => { clearTimeout(relogio); encerrar(); };
  el.addEventListener("click", pular);
  document.addEventListener("keydown", pular, { once: true });
})();
