// =========================================================
// Abertura: gravata vermelha se amarrando e a marca aparecendo
// Passa uma vez por visita (sessionStorage). Pulável com clique ou tecla.
// Quem pede menos movimento no sistema não vê a abertura.
// =========================================================

(() => {
  const CHAVE = "mmc-intro-vista";
  const forcar = new URLSearchParams(location.search).has("intro");
  let vista = false;
  try { vista = sessionStorage.getItem(CHAVE) === "1"; } catch (e) { /* sem armazenamento: mostra */ }
  if (!forcar && (vista || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  try { sessionStorage.setItem(CHAVE, "1"); } catch (e) { /* tudo bem */ }

  // cada trecho da faixa: [caminho, atrás do nó?, espessura, início (s), duração (s)]
  // a ordem da lista é a ordem de empilhamento (o último fica por cima)
  const TRECHOS = [
    ["M146 128 C154 108 142 82 122 72",                    true,  22, 1.55, 0.32], // sobe por trás até o colarinho
    ["M150 113 C162 117 160 124 146 124 L98 121",            true,  22, 0.92, 0.32], // volta por trás
    ["M104 64 C108 86 116 100 136 108 L150 113",             false, 24, 0.55, 0.38], // cruza pela frente
    ["M122 72 C120 92 119 112 120 132 L120 326",             false, 25, 1.86, 0.62], // desce pela laçada: vira a lâmina
    ["M98 121 C86 122 88 133 101 133 L146 128",              false, 23, 1.24, 0.32], // a volta da frente: vira o nó
  ];

  const faixa = TRECHOS.map(([d, atras, w, ini, dur]) => `
      <path class="ti-borda" d="${d}" pathLength="1" stroke-width="${w + 3}" style="--ini:${ini}s;--dur:${dur}s"/>
      <path class="ti-faixa${atras ? " atras" : ""}" d="${d}" pathLength="1" stroke-width="${w}" style="--ini:${ini}s;--dur:${dur}s"/>`).join("");

  const el = document.createElement("div");
  el.className = "intro";
  el.setAttribute("role", "presentation");
  el.innerHTML = `
    <div class="intro-palco">
      <svg class="intro-svg" viewBox="0 0 240 360" aria-hidden="true">
        <defs>
          <pattern id="tiTrama" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <rect width="4" height="4" fill="#b3121e"/><rect width="2" height="4" fill="#c91d2a"/>
          </pattern>
          <linearGradient id="tiVolume" x1="0" x2="1">
            <stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/>
            <stop offset="1" stop-color="#000" stop-opacity=".35"/>
          </linearGradient>
          <linearGradient id="tiNo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
          </linearGradient>
          <linearGradient id="tiBrilho" x1="0" x2="1">
            <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
          <clipPath id="tiForma"><path d="M106 102 Q120 98 134 102 L128 134 Q120 137 112 134 Z M112.5 135 Q120 138 127.5 135 L142 300 L120 328 L98 300 Z"/></clipPath>
        </defs>

        <!-- camisa: só o contorno -->
        <g class="ti-camisa">
          <path d="M30 200 Q44 120 92 54 M210 200 Q196 120 148 54"/>
          <path d="M120 96 V330"/>
        </g>

        <!-- a gravata ainda solta: lado largo e lado estreito -->
        <path class="ti-volta" d="M96 60 Q120 74 144 60" pathLength="1"/>
        <path class="ti-borda ti-solta estreita" d="M136 64 C138 140 139 200 140 250" pathLength="1" stroke-width="16"/>
        <path class="ti-faixa ti-solta estreita" d="M136 64 C138 140 139 200 140 250" pathLength="1" stroke-width="13"/>
        <path class="ti-borda ti-solta larga" d="M104 64 C100 160 97 250 96 330" pathLength="1" stroke-width="27"/>
        <path class="ti-faixa ti-solta larga" d="M104 64 C100 160 97 250 96 330" pathLength="1" stroke-width="24"/>

        <!-- o nó sendo dado -->
        <g class="ti-no-dado">${faixa}</g>

        <!-- a gravata pronta, com o nó apertado -->
        <g class="ti-pronta">
          <g class="ti-lamina">
            <path d="M112.5 135 Q120 138 127.5 135 L142 300 L120 328 L98 300 Z" fill="url(#tiTrama)"/>
            <path d="M112.5 135 Q120 138 127.5 135 L142 300 L120 328 L98 300 Z" fill="url(#tiVolume)"/>
            <path d="M100 298 L120 324 L140 298" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".8" stroke-dasharray="2 1.6"/>
          </g>
          <g class="ti-no">
            <path d="M106 102 Q120 98 134 102 L128 134 Q120 137 112 134 Z" fill="url(#tiTrama)"/>
            <path d="M106 102 Q120 98 134 102 L128 134 Q120 137 112 134 Z" fill="url(#tiNo)"/>
          </g>
          <g clip-path="url(#tiForma)"><rect class="ti-brilho" x="60" y="90" width="34" height="260" fill="url(#tiBrilho)" transform="skewX(-14)"/></g>
        </g>

        <!-- colarinho por cima da volta da gravata -->
        <g class="ti-colarinho">
          <path d="M92 48 L119 88 L100 112 Z"/>
          <path d="M148 48 L121 88 L140 112 Z"/>
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
  const relogio = setTimeout(encerrar, 4600);
  const pular = () => { clearTimeout(relogio); encerrar(); };
  el.addEventListener("click", pular);
  document.addEventListener("keydown", pular, { once: true });
})();
