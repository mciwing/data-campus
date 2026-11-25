// Interaktiver Test der Vergleichsoperatoren in einer WHERE-Klausel.
// Verwendung im Markdown: <div class="sql-where"></div>

(function () {
    const DATA = [
        ['Stahlwerk Salzgitter', 'Stahlblech 2mm', 500, 12.50, 'Geliefert'],
        ['Aluminium AG', 'Aluminiumprofile', 200, 25.00, 'Geliefert'],
        ['Kunststoff GmbH', 'PVC-Platten', 150, 8.75, 'In Transit'],
        ['Stahlwerk Salzgitter', 'Stahlprofil IPE200', 80, 45.00, 'Bestellt'],
        ['Schrauben Meyer', 'Sechskantschrauben M8', 5000, 0.15, 'Geliefert'],
        ['Aluminium AG', 'Aluminiumblech 3mm', 300, 18.50, 'Bestellt'],
        ['Elektronik Weber', 'Sensoren Typ A', 100, 12.90, 'Geliefert'],
        ['Kunststoff GmbH', 'Gummiband 10mm', 800, 2.30, 'In Transit'],
        ['Schrauben Meyer', 'Muttern M8', 5000, 0.08, 'Geliefert'],
        ['Elektronik Weber', 'Kabelbaum 5m', 50, 22.00, 'Bestellt']
    ].map(r => ({ lieferant: r[0], material: r[1], menge: r[2], preis_pro_einheit: r[3], status: r[4] }));

    // Spalten der Tabelle. Zahlenspalten erlauben alle Operatoren,
    // Textspalten nur "=" und "!=".
    const FIELDS = {
        lieferant: { text: true, start: 'Aluminium AG' },
        material: { text: true, start: 'PVC-Platten' },
        menge: { fmt: n => String(n), start: 100, step: 50 },
        preis_pro_einheit: { fmt: n => n.toFixed(2), start: 10, step: 0.5 },
        status: { text: true, start: 'Geliefert' }
    };
    const COLS = Object.keys(FIELDS);

    const OPS = [
        { sym: '=', title: 'Gleich', text: true, test: (a, b) => a === b },
        { sym: '!=', title: 'Ungleich', text: true, test: (a, b) => a !== b },
        { sym: '>', title: 'Größer als', test: (a, b) => a > b },
        { sym: '<', title: 'Kleiner als', test: (a, b) => a < b },
        { sym: '>=', title: 'Größer oder gleich', test: (a, b) => a >= b },
        { sym: '<=', title: 'Kleiner oder gleich', test: (a, b) => a <= b }
    ];

    let uid = 0;

    const el = (tag, cls, text) => {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined) node.textContent = text;
        return node;
    };

    function init(root) {
        if (root.dataset.ready) return;
        root.dataset.ready = 'true';

        let field = 'menge';
        let op = OPS[2];

        // --- Abfrage mit Eingabefeldern ---------------------------------------
        const query = el('div', 'sqlw-query');

        const line1 = el('div', 'sqlw-line');
        line1.append(el('span', 'sqlw-kw', 'SELECT'), ' ' + COLS.join(', '));
        const line2 = el('div', 'sqlw-line');
        line2.append(el('span', 'sqlw-kw', 'FROM'), ' lieferungen');

        const line3 = el('div', 'sqlw-line sqlw-where');
        line3.appendChild(el('span', 'sqlw-kw', 'WHERE'));

        const fieldSel = el('select', 'sqlw-field');
        fieldSel.setAttribute('aria-label', 'Spalte');
        COLS.forEach(name => {
            const o = el('option', null, name);
            o.value = name;
            fieldSel.appendChild(o);
        });
        fieldSel.value = field;

        const opsBox = el('span', 'sqlw-ops');
        opsBox.setAttribute('role', 'group');
        opsBox.setAttribute('aria-label', 'Vergleichsoperator');
        const opBtns = OPS.map(o => {
            const b = el('button', 'sqlw-op', o.sym);
            b.type = 'button';
            b.addEventListener('click', () => { op = o; update(); });
            opsBox.appendChild(b);
            return b;
        });

        // Vergleichswert: Zahl oder Text (Text steht in SQL in Hochkommas)
        const valueBox = el('span', 'sqlw-valuebox');
        const valueInp = el('input', 'sqlw-value');
        valueInp.setAttribute('aria-label', 'Vergleichswert');
        valueInp.autocomplete = 'off';
        valueInp.spellcheck = false;
        const hints = el('datalist');
        hints.id = 'sqlw-hints-' + (++uid);
        valueBox.append(el('span', 'sqlw-quote', "'"), valueInp, el('span', 'sqlw-quote', "'"), hints);

        line3.append(fieldSel, opsBox, valueBox, el('span', null, ';'));

        // Kopier-Button wie bei den normalen Code-Blöcken des Themes
        const nav = el('nav', 'md-code__nav');
        const copyBtn = el('button', 'md-code__button');
        copyBtn.type = 'button';
        copyBtn.dataset.mdType = 'copy';
        copyBtn.title = 'In Zwischenablage kopieren';
        copyBtn.setAttribute('aria-label', 'Abfrage in Zwischenablage kopieren');
        copyBtn.addEventListener('click', copyQuery);
        nav.appendChild(copyBtn);

        query.append(nav, line1, line2, line3);

        let sqlText = '';

        async function copyQuery() {
            if (!sqlText) return;
            try {
                await navigator.clipboard.writeText(sqlText);
            } catch (err) {
                // Fallback, falls die Clipboard-API nicht verfügbar ist
                const ta = el('textarea');
                ta.value = sqlText;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                const ok = document.execCommand('copy');
                ta.remove();
                if (!ok) return;
            }
            copyBtn.classList.add('md-code__button--active');
            setTimeout(() => copyBtn.classList.remove('md-code__button--active'), 1500);
            // Dieselbe Meldung wie bei den Code-Blöcken des Themes anzeigen
            const dialog = document.querySelector('[data-md-component="dialog"]');
            const inner = dialog && dialog.querySelector('.md-dialog__inner');
            if (inner) {
                inner.textContent = 'In Zwischenablage kopiert';
                dialog.classList.add('md-dialog--active');
                setTimeout(() => dialog.classList.remove('md-dialog--active'), 2000);
            }
        }

        // --- Zusammenfassung und Tabelle ---------------------------------------
        const summary = el('div', 'sqlw-summary');
        summary.setAttribute('aria-live', 'polite');

        const stage = el('div', 'sqlw-stage');
        const rowsBox = el('div', 'sqlw-rows');
        stage.appendChild(rowsBox);

        const head = el('div', 'sqlw-row sqlw-head');
        const headCells = COLS.map(c => {
            const cell = el('span', 'sqlw-cell', c);
            head.appendChild(cell);
            return cell;
        });
        head.appendChild(el('span', 'sqlw-cell sqlw-check', 'Prüfung'));
        rowsBox.appendChild(head);

        const rows = DATA.map(r => {
            const node = el('div', 'sqlw-row');
            const cells = COLS.map(c => {
                const f = FIELDS[c];
                const cell = el('span', 'sqlw-cell', f.text ? r[c] : f.fmt(r[c]));
                if (!f.text) cell.classList.add('is-num');
                node.appendChild(cell);
                return cell;
            });
            const check = el('span', 'sqlw-cell sqlw-check');
            node.appendChild(check);
            rowsBox.appendChild(node);
            return { data: r, node, cells, check };
        });

        const footer = el('label', 'sqlw-toggle');
        const hideChk = el('input');
        hideChk.type = 'checkbox';
        footer.append(hideChk, ' Herausgefilterte Zeilen ausblenden (so sieht das Ergebnis der Abfrage aus)');

        root.append(query, summary, stage, footer);

        // --- Spaltenwechsel -----------------------------------------------------
        function setField(name) {
            field = name;
            const f = FIELDS[name];
            valueBox.classList.toggle('is-text', !!f.text);
            if (f.text) {
                valueInp.type = 'text';
                valueInp.removeAttribute('step');
                // Vorhandene Werte der Spalte als Vorschläge
                const values = Array.from(new Set(DATA.map(r => r[name]))).sort();
                hints.replaceChildren(...values.map(v => {
                    const o = el('option');
                    o.value = v;
                    return o;
                }));
                valueInp.setAttribute('list', hints.id);
                if (!op.text) op = OPS[0];
            } else {
                valueInp.removeAttribute('list');
                valueInp.type = 'number';
                valueInp.step = f.step;
            }
            valueInp.value = f.start;
            update();
        }

        // --- Auswertung ---------------------------------------------------------
        function update() {
            const f = FIELDS[field];
            const hlIndex = COLS.indexOf(field);
            const raw = valueInp.value;
            const value = f.text ? raw : (raw.trim() === '' ? NaN : Number(raw));
            const valid = f.text || Number.isFinite(value);
            // So steht der Vergleichswert in der Abfrage
            const shown = f.text ? `'${value}'` : String(value);

            opBtns.forEach((b, i) => {
                const o = OPS[i];
                const allowed = !f.text || !!o.text;
                const active = o === op;
                b.disabled = !allowed;
                b.title = allowed ? o.title : `${o.title} - hier nur für Zahlenspalten`;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            headCells.forEach((c, i) => c.classList.toggle('is-hl', i === hlIndex));
            valueInp.classList.toggle('is-invalid', !valid);

            // Abfrage als Text für den Kopier-Button (Hochkommas im Text verdoppeln)
            const literal = f.text ? `'${value.replace(/'/g, "''")}'` : String(value);
            sqlText = valid
                ? `SELECT ${COLS.join(', ')}\nFROM lieferungen\nWHERE ${field} ${op.sym} ${literal};`
                : '';
            copyBtn.disabled = !valid;
            root.classList.toggle('is-hiding', hideChk.checked && valid);

            let kept = 0;
            rows.forEach(row => {
                row.cells.forEach((c, i) => c.classList.toggle('is-hl', i === hlIndex));
                if (!valid) {
                    row.node.classList.remove('is-in', 'is-out');
                    row.check.textContent = '';
                    return;
                }
                const pass = op.test(row.data[field], value);
                if (pass) kept++;
                row.node.classList.toggle('is-in', pass);
                row.node.classList.toggle('is-out', !pass);
                row.check.textContent = f.text
                    ? (pass ? 'erfüllt ✓' : 'nicht erfüllt ✗')
                    : `${f.fmt(row.data[field])} ${op.sym} ${value} ${pass ? '✓' : '✗'}`;
            });

            if (!valid) {
                summary.textContent = 'Bitte eine Zahl als Vergleichswert eingeben.';
                return;
            }
            const out = rows.length - kept;
            const outText = out === 0
                ? 'Keine Zeile wird herausgefiltert.'
                : `${out} ${out === 1 ? 'Zeile wird' : 'Zeilen werden'} herausgefiltert.`;
            summary.replaceChildren(
                el('strong', null, `${kept} von ${rows.length} Zeilen`),
                ' erfüllen die Bedingung ',
                el('code', null, `${field} ${op.sym} ${shown}`),
                ' und bleiben im Ergebnis. ',
                el('strong', null, outText)
            );
            if (f.text) {
                summary.appendChild(el('span', 'sqlw-note', ' Texte müssen exakt übereinstimmen - auch Groß- und Kleinschreibung.'));
            }
        }

        fieldSel.addEventListener('change', () => setField(fieldSel.value));
        valueInp.addEventListener('input', update);
        hideChk.addEventListener('change', update);

        setField(field);
    }

    function initAll() {
        document.querySelectorAll('.sql-where').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
    // Instant Navigation (falls aktiviert)
    if (window.document$ && typeof window.document$.subscribe === 'function') {
        window.document$.subscribe(initAll);
    }
})();
