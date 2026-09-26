"use strict";

// Emojis do começo dos botões viram um "selo" redondo e uniforme (mesmo tamanho, borda e sombra em qualquer aparelho),
// em vez de figurinhas soltas de tamanhos e estilos diferentes. O texto do botão não muda (só ganha um <span>).
(function () {
  const SEL = ".menu-btn, .pill-btn, .link-btn.with-emoji";
  const LEAD = /^((?![▶◀↺↩▸►])(?:\p{Extended_Pictographic})(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*)\s*/u;

  function wrap(btn) {
    const n = btn.firstChild;
    if (!n || n.nodeType !== 3) return;
    const m = LEAD.exec(n.nodeValue);
    if (!m) return;
    const chip = document.createElement("span");
    chip.className = "e-chip";
    chip.setAttribute("aria-hidden", "true");
    chip.textContent = m[1];
    n.nodeValue = n.nodeValue.slice(m[0].length);
    btn.insertBefore(chip, n);
  }

  function scan(root) { (root.querySelectorAll ? root.querySelectorAll(SEL) : []).forEach(wrap); if (root.matches && root.matches(SEL)) wrap(root); }

  let queued = false;
  function later() { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; scan(document); }); }

  function start() {
    scan(document);
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
