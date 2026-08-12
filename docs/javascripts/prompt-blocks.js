/*
 * Chat-/REPL-Blöcke mit nicht kopierbarem Prompt-Zeichen.
 *
 * Verwendung im Markdown (Sprache zuerst, dann die Klasse):
 *
 *   ```{ .text .ollama title="Ollama Chat" }
 *   Was ist ein Business Model Canvas?
 *   ```
 *
 * Angezeigt wird `>>> Was ist ein Business Model Canvas?`, kopiert wird nur
 * `Was ist ein Business Model Canvas?`.
 *
 * Das Prompt-Zeichen steht nicht im DOM-Text, sondern kommt aus einem
 * CSS-::before (siehe extra.css). Pseudo-Elemente landen weder in der
 * Textauswahl noch in `innerText` - Material liest beim Kopieren genau
 * diesen Wert aus (`el.innerText` in der Clipboard-Integration), das Zeichen
 * kann also gar nicht mitkopiert werden.
 *
 * Zeilen dürfen `>>>` oder `...` (Fortsetzung mehrzeiliger Eingaben) auch
 * explizit im Quelltext tragen; das Zeichen wird dann aus dem Text entfernt
 * und als Pseudo-Element neu gesetzt. Zeilen ohne Zeichen bekommen `>>>`,
 * Leerzeilen bleiben leer.
 *
 * Eingefügt wird über Text-Node-Splits statt über innerHTML, damit ein
 * eventuelles Syntax-Highlighting (z. B. bei `{ .bash .ollama }`) erhalten
 * bleibt.
 */

(function () {
  const MARKER = /^(>>>|\.\.\.)([ \t]?)/;
  const CLASS = { ">>>": "md-prompt", "...": "md-prompt md-prompt--cont" };

  /* Alle Zeilenanfänge im Code-Block sammeln: {node, offset, strip, marker} */
  function collect(code) {
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    const spots = [];
    let atLineStart = true;

    for (const node of nodes) {
      const text = node.nodeValue;
      let pos = 0;

      while (pos < text.length) {
        if (!atLineStart) {
          const nl = text.indexOf("\n", pos);
          if (nl === -1) break;
          pos = nl + 1;
          atLineStart = true;
          continue;
        }

        // Leerzeile: kein Prompt-Zeichen
        if (text[pos] === "\n") {
          pos += 1;
          continue;
        }

        const match = text.slice(pos).match(MARKER);
        spots.push({
          node: node,
          offset: pos,
          strip: match ? match[0].length : 0,
          marker: match ? match[1] : ">>>"
        });
        atLineStart = false;
      }
    }
    return spots;
  }

  function decorate(block) {
    const code = block.querySelector("code");
    if (!code || code.hasAttribute("data-md-prompt")) return;
    code.setAttribute("data-md-prompt", "");

    // Von hinten nach vorne einfügen, damit die Offsets gültig bleiben
    const spots = collect(code);
    for (let i = spots.length - 1; i >= 0; i--) {
      const spot = spots[i];
      const tail = spot.node.splitText(spot.offset);
      if (spot.strip) tail.deleteData(0, spot.strip);

      const span = document.createElement("span");
      span.className = CLASS[spot.marker];
      tail.parentNode.insertBefore(span, tail);
    }
  }

  const init = () => document.querySelectorAll(".ollama").forEach(decorate);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
