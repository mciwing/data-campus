/*
 * Nicht kopierbare Inhalte (Klasse `no-copy`), sprachunabhängig.
 *
 * Einzelner Code-Block - Sprache muss als erster Eintrag mit Punkt stehen,
 * für Blöcke ohne Sprache `.text` verwenden:
 *
 *   ```{ .sql .no-copy }
 *   SELECT * FROM kunden;
 *   ```
 *
 * Beliebiger Bereich (mehrere Blöcke, Tabellen, Fließtext):
 *
 *   <div class="no-copy" markdown>
 *   ...
 *   </div>
 *
 * Das Kopier-Icon blendet Material bei `.no-copy` selbst aus, beim
 * div-Wrapper übernimmt das die CSS-Regel in extra.css. Dieses Skript
 * verhindert zusätzlich Kopieren per Tastatur, Kontextmenü und Drag & Drop.
 * Kein echter Schutz (Quelltext bleibt lesbar), aber eine wirksame Hürde,
 * damit Code tatsächlich abgetippt wird.
 */

(function () {
  const inNoCopy = (node) => {
    const el = node instanceof Element ? node : node && node.parentElement;
    return Boolean(el && el.closest(".no-copy"));
  };

  // Kopieren / Ausschneiden aus einem gesperrten Block blockieren
  ["copy", "cut"].forEach((type) => {
    document.addEventListener(
      type,
      (event) => {
        const selection = document.getSelection();
        if (!selection || selection.isCollapsed) return;
        if (inNoCopy(selection.anchorNode) || inNoCopy(selection.focusNode)) {
          event.preventDefault();
        }
      },
      true
    );
  });

  // Kontextmenü und Ziehen des Textes unterbinden
  ["contextmenu", "dragstart"].forEach((type) => {
    document.addEventListener(
      type,
      (event) => {
        if (inNoCopy(event.target)) event.preventDefault();
      },
      true
    );
  });
})();
