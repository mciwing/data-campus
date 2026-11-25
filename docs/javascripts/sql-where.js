// Interaktive Tests für die WHERE-Klausel.
// Verwendung im Markdown:
//   <div class="sql-where"></div>   einfache Vergleichsoperatoren (=, !=, >, <, >=, <=)
//   <div class="sql-logic"></div>   verknüpfte Vergleiche (AND, OR, NOT, IN, BETWEEN)
//   <div class="sql-like"></div>    Mustersuche mit LIKE / ILIKE
//   <div class="sql-sort"></div>    Sortieren mit ORDER BY (inkl. NULL-Werte)
//   <div class="sql-page"></div>    Paginierung mit LIMIT und OFFSET

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
    const SQL_HEAD = `SELECT ${COLS.join(', ')}\nFROM lieferungen\nWHERE `;

    const OPS = [
        { sym: '=', title: 'Gleich', text: true, test: (a, b) => a === b },
        { sym: '!=', title: 'Ungleich', text: true, test: (a, b) => a !== b },
        { sym: '>', title: 'Größer als', test: (a, b) => a > b },
        { sym: '<', title: 'Kleiner als', test: (a, b) => a < b },
        { sym: '>=', title: 'Größer oder gleich', test: (a, b) => a >= b },
        { sym: '<=', title: 'Kleiner oder gleich', test: (a, b) => a <= b }
    ];

    let uid = 0;

    // --- Gemeinsame Bausteine ------------------------------------------------
    const el = (tag, cls, text) => {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined) node.textContent = text;
        return node;
    };

    const kw = text => el('span', 'sqlw-kw', text);
    const mark = ok => (ok ? '✓' : '✗');
    const quote = s => `'${s.replace(/'/g, "''")}'`;
    const parseNum = raw => (raw.trim() === '' ? NaN : Number(raw));

    // Abfrage-Block mit SELECT- und FROM-Zeile, WHERE-Zeile und Kopier-Button
    // wie bei den normalen Code-Blöcken des Themes.
    function buildQuery(getSql, cols = COLS) {
        const query = el('div', 'sqlw-query');

        const line1 = el('div', 'sqlw-line');
        line1.append(kw('SELECT'), ' ' + cols.join(', '));
        const line2 = el('div', 'sqlw-line');
        line2.append(kw('FROM'), ' lieferungen');
        const whereLine = el('div', 'sqlw-line sqlw-where');

        const nav = el('nav', 'md-code__nav');
        const copyBtn = el('button', 'md-code__button');
        copyBtn.type = 'button';
        copyBtn.dataset.mdType = 'copy';
        copyBtn.title = 'In Zwischenablage kopieren';
        copyBtn.setAttribute('aria-label', 'Abfrage in Zwischenablage kopieren');
        nav.appendChild(copyBtn);

        copyBtn.addEventListener('click', async () => {
            const sqlText = getSql();
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
        });

        query.append(nav, line1, line2, whereLine);
        return { query, whereLine, copyBtn };
    }

    // Zusammenfassung, Tabelle mit allen Zeilen und Umschalter zum Ausblenden
    function buildTable() {
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

        const toggle = el('label', 'sqlw-toggle');
        const hideChk = el('input');
        hideChk.type = 'checkbox';
        toggle.append(hideChk, ' Herausgefilterte Zeilen ausblenden (so sieht das Ergebnis der Abfrage aus)');

        return { summary, stage, toggle, hideChk, headCells, rows };
    }

    // Wertet alle Zeilen aus und aktualisiert Tabelle und Zusammenfassung.
    //   hl:        Namen der Spalten, die in der Bedingung vorkommen
    //   evaluate:  Zeile -> { pass, text } oder null, wenn die Eingabe ungültig ist
    //   condition: Bedingung als Text (für die Zusammenfassung)
    //   invalid:   Hinweistext bei ungültiger Eingabe (sonst leer)
    //   note:      zusätzlicher Hinweis
    function renderResult(root, t, { hl, evaluate, condition, invalid, note }) {
        const valid = !invalid;
        const hlIdx = hl.map(name => COLS.indexOf(name));
        t.headCells.forEach((c, i) => c.classList.toggle('is-hl', hlIdx.includes(i)));
        root.classList.toggle('is-hiding', t.hideChk.checked && valid);

        let kept = 0;
        t.rows.forEach(row => {
            row.cells.forEach((c, i) => c.classList.toggle('is-hl', hlIdx.includes(i)));
            if (!valid) {
                row.node.classList.remove('is-in', 'is-out');
                row.check.textContent = '';
                return;
            }
            const res = evaluate(row.data);
            if (res.pass) kept++;
            row.node.classList.toggle('is-in', res.pass);
            row.node.classList.toggle('is-out', !res.pass);
            row.check.textContent = res.text;
        });

        if (!valid) {
            t.summary.textContent = invalid;
            return;
        }
        const total = t.rows.length;
        const out = total - kept;
        const outText = out === 0
            ? 'Keine Zeile wird herausgefiltert.'
            : `${out} ${out === 1 ? 'Zeile wird' : 'Zeilen werden'} herausgefiltert.`;
        t.summary.replaceChildren(
            el('strong', null, `${kept} von ${total} Zeilen`),
            ' erfüllen die Bedingung ',
            el('code', null, condition),
            ' und bleiben im Ergebnis. ',
            el('strong', null, outText)
        );
        if (note) t.summary.appendChild(el('span', 'sqlw-note', ' ' + note));
    }

    // --- Widget 1: einfache Vergleichsoperatoren --------------------------------
    function initWhere(root) {
        if (root.dataset.ready) return;
        root.dataset.ready = 'true';
        root.classList.add('sqlw-root');

        let field = 'menge';
        let op = OPS[2];
        let sqlText = '';

        const q = buildQuery(() => sqlText);
        const t = buildTable();

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

        q.whereLine.append(kw('WHERE'), fieldSel, opsBox, valueBox, el('span', null, ';'));
        root.append(q.query, t.summary, t.stage, t.toggle);

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

        function update() {
            const f = FIELDS[field];
            const raw = valueInp.value;
            const value = f.text ? raw : parseNum(raw);
            const valid = f.text || Number.isFinite(value);

            opBtns.forEach((b, i) => {
                const o = OPS[i];
                const allowed = !f.text || !!o.text;
                const active = o === op;
                b.disabled = !allowed;
                b.title = allowed ? o.title : `${o.title} - hier nur für Zahlenspalten`;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            valueInp.classList.toggle('is-invalid', !valid);

            sqlText = valid ? `${SQL_HEAD}${field} ${op.sym} ${f.text ? quote(value) : value};` : '';
            q.copyBtn.disabled = !valid;

            renderResult(root, t, {
                hl: [field],
                condition: `${field} ${op.sym} ${f.text ? `'${value}'` : value}`,
                invalid: valid ? '' : 'Bitte eine Zahl als Vergleichswert eingeben.',
                note: f.text ? 'Texte müssen exakt übereinstimmen - auch Groß- und Kleinschreibung.' : '',
                evaluate: r => {
                    const pass = op.test(r[field], value);
                    return {
                        pass,
                        text: f.text
                            ? (pass ? 'erfüllt ✓' : 'nicht erfüllt ✗')
                            : `${f.fmt(r[field])} ${op.sym} ${value} ${mark(pass)}`
                    };
                }
            });
        }

        fieldSel.addEventListener('change', () => setField(fieldSel.value));
        valueInp.addEventListener('input', update);
        t.hideChk.addEventListener('change', update);

        setField(field);
    }

    // --- Widget 2: verknüpfte Vergleiche ----------------------------------------
    const MODES = [
        { key: 'AND', title: 'Beide Bedingungen müssen erfüllt sein' },
        { key: 'OR', title: 'Mindestens eine Bedingung muss erfüllt sein' },
        { key: 'NOT', title: 'Negiert eine Bedingung' },
        { key: 'IN', title: 'Prüft, ob Wert in einer Liste enthalten ist' },
        { key: 'BETWEEN', title: 'Prüft, ob Wert in einem Bereich liegt (inklusiv)' }
    ];
    const LIEFERANTEN = Array.from(new Set(DATA.map(r => r.lieferant))).sort();

    function initLogic(root) {
        if (root.dataset.ready) return;
        root.dataset.ready = 'true';
        root.classList.add('sqlw-root');

        let mode = 'AND';
        let sqlText = '';
        const inList = new Set(['Aluminium AG', 'Elektronik Weber']);

        const q = buildQuery(() => sqlText);
        const t = buildTable();

        // Auswahl des Operators
        const modesBox = el('div', 'sqlw-modes');
        modesBox.appendChild(el('span', 'sqlw-modes-label', 'Operator:'));
        const modeGroup = el('span', 'sqlw-ops');
        modeGroup.setAttribute('role', 'group');
        modeGroup.setAttribute('aria-label', 'Verknüpfungsoperator');
        const modeBtns = MODES.map(m => {
            const b = el('button', 'sqlw-op', m.key);
            b.type = 'button';
            b.title = m.title;
            b.addEventListener('click', () => { mode = m.key; renderWhere(); update(); });
            modeGroup.appendChild(b);
            return b;
        });
        modesBox.appendChild(modeGroup);

        // BETWEEN: zwei Grenzen
        const numInput = (label, start) => {
            const inp = el('input', 'sqlw-value');
            inp.type = 'number';
            inp.step = 50;
            inp.value = start;
            inp.setAttribute('aria-label', label);
            inp.addEventListener('input', update);
            return inp;
        };
        const loInp = numInput('Untere Grenze', 100);
        const hiInp = numInput('Obere Grenze', 500);

        // IN: Werte der Liste an- und abwählen
        const inText = el('span', 'sqlw-inlist');
        const chips = el('div', 'sqlw-chips');
        chips.appendChild(el('span', 'sqlw-chips-label', 'Werte in der Liste:'));
        const chipBtns = LIEFERANTEN.map(name => {
            const b = el('button', 'sqlw-chip', name);
            b.type = 'button';
            b.addEventListener('click', () => {
                if (inList.has(name)) inList.delete(name); else inList.add(name);
                update();
            });
            chips.appendChild(b);
            return b;
        });

        q.query.appendChild(chips);
        root.append(modesBox, q.query, t.summary, t.stage, t.toggle);

        const txt = s => el('span', null, s);

        // WHERE-Zeile passend zum gewählten Operator aufbauen
        function renderWhere() {
            const parts = [kw('WHERE')];
            if (mode === 'AND' || mode === 'OR') {
                parts.push(txt('menge > 200'), kw(mode), txt("status = 'Geliefert'"));
            } else if (mode === 'NOT') {
                parts.push(kw('NOT'), txt("status = 'Geliefert'"));
            } else if (mode === 'IN') {
                parts.push(txt('lieferant'), kw('IN'), inText);
            } else {
                parts.push(txt('menge'), kw('BETWEEN'), loInp, kw('AND'), hiInp);
            }
            const last = parts[parts.length - 1];
            const end = el('span', 'sqlw-end');
            end.append(last, ';');
            parts[parts.length - 1] = end;
            q.whereLine.replaceChildren(...parts);
            chips.hidden = mode !== 'IN';
        }

        function update() {
            modeBtns.forEach((b, i) => {
                const active = MODES[i].key === mode;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            let spec;
            if (mode === 'AND' || mode === 'OR') {
                spec = {
                    hl: ['menge', 'status'],
                    condition: `menge > 200 ${mode} status = 'Geliefert'`,
                    note: (mode === 'AND'
                        ? 'Beide Bedingungen müssen erfüllt sein.'
                        : 'Mindestens eine der beiden Bedingungen muss erfüllt sein.') +
                        ' Die Spalte „Prüfung" zeigt das Ergebnis der ersten und der zweiten Bedingung und dahinter das Gesamtergebnis.',
                    evaluate: r => {
                        const a = r.menge > 200;
                        const b = r.status === 'Geliefert';
                        const pass = mode === 'AND' ? a && b : a || b;
                        return { pass, text: `${mark(a)} ${mode} ${mark(b)} → ${mark(pass)}` };
                    }
                };
            } else if (mode === 'NOT') {
                spec = {
                    hl: ['status'],
                    condition: "NOT status = 'Geliefert'",
                    note: 'NOT kehrt das Ergebnis der Bedingung um.',
                    evaluate: r => {
                        const a = r.status === 'Geliefert';
                        return { pass: !a, text: `NOT ${mark(a)} → ${mark(!a)}` };
                    }
                };
            } else if (mode === 'IN') {
                const list = LIEFERANTEN.filter(n => inList.has(n));
                chipBtns.forEach((b, i) => {
                    const on = inList.has(LIEFERANTEN[i]);
                    b.classList.toggle('is-active', on);
                    b.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
                inText.textContent = `(${list.map(quote).join(', ')})`;
                spec = {
                    hl: ['lieferant'],
                    condition: `lieferant IN (${list.map(quote).join(', ')})`,
                    invalid: list.length ? '' : 'Bitte mindestens einen Wert für die Liste auswählen.',
                    note: 'Der Wert muss mit einem Eintrag der Liste übereinstimmen.',
                    evaluate: r => {
                        const pass = inList.has(r.lieferant);
                        return { pass, text: pass ? 'in Liste ✓' : 'nicht dabei ✗' };
                    }
                };
            } else {
                const lo = parseNum(loInp.value);
                const hi = parseNum(hiInp.value);
                loInp.classList.toggle('is-invalid', !Number.isFinite(lo));
                hiInp.classList.toggle('is-invalid', !Number.isFinite(hi));
                spec = {
                    hl: ['menge'],
                    condition: `menge BETWEEN ${lo} AND ${hi}`,
                    invalid: Number.isFinite(lo) && Number.isFinite(hi) ? '' : 'Bitte für beide Grenzen eine Zahl eingeben.',
                    note: lo > hi
                        ? 'Die untere Grenze ist größer als die obere - deshalb erfüllt keine Zeile die Bedingung.'
                        : 'Beide Grenzen sind eingeschlossen.',
                    evaluate: r => {
                        const pass = r.menge >= lo && r.menge <= hi;
                        return { pass, text: pass ? 'im Bereich ✓' : 'außerhalb ✗' };
                    }
                };
            }

            sqlText = spec.invalid ? '' : `${SQL_HEAD}${spec.condition};`;
            q.copyBtn.disabled = !!spec.invalid;
            renderResult(root, t, spec);
        }

        t.hideChk.addEventListener('change', update);

        renderWhere();
        update();
    }

    // --- Widget 3: Mustersuche mit LIKE ------------------------------------------
    const LIKE_FIELDS = COLS.filter(c => FIELDS[c].text);
    const LIKE_PRESETS = ['%GmbH%', 'Stahl%', '%Weber', '_l%', 'A___%', '%M8', '%blech%'];

    // Übersetzt ein LIKE-Muster in einen regulären Ausdruck:
    // % = beliebig viele Zeichen, _ = genau ein Zeichen
    function likeToRegex(pattern, ignoreCase) {
        const body = Array.from(pattern).map(ch => {
            if (ch === '%') return '[\\s\\S]*';
            if (ch === '_') return '[\\s\\S]';
            return ch.replace(/[.*+?^${}()|[\]\\\/-]/g, '\\$&');
        }).join('');
        return new RegExp(`^${body}$`, ignoreCase ? 'i' : '');
    }

    function initLike(root) {
        if (root.dataset.ready) return;
        root.dataset.ready = 'true';
        root.classList.add('sqlw-root');

        let field = 'lieferant';
        let op = 'LIKE';
        let sqlText = '';

        const q = buildQuery(() => sqlText);
        const t = buildTable();

        const fieldSel = el('select', 'sqlw-field');
        fieldSel.setAttribute('aria-label', 'Spalte');
        LIKE_FIELDS.forEach(name => {
            const o = el('option', null, name);
            o.value = name;
            fieldSel.appendChild(o);
        });
        fieldSel.value = field;

        const opsBox = el('span', 'sqlw-ops');
        opsBox.setAttribute('role', 'group');
        opsBox.setAttribute('aria-label', 'Operator');
        const opBtns = [
            ['LIKE', 'Groß- und Kleinschreibung wird beachtet'],
            ['ILIKE', 'Groß- und Kleinschreibung wird ignoriert']
        ].map(([name, title]) => {
            const b = el('button', 'sqlw-op', name);
            b.type = 'button';
            b.title = title;
            b.addEventListener('click', () => { op = name; update(); });
            opsBox.appendChild(b);
            return b;
        });

        const valueBox = el('span', 'sqlw-valuebox is-text');
        const patternInp = el('input', 'sqlw-value');
        patternInp.type = 'text';
        patternInp.value = LIKE_PRESETS[0];
        patternInp.setAttribute('aria-label', 'Muster');
        patternInp.autocomplete = 'off';
        patternInp.spellcheck = false;
        valueBox.append(el('span', 'sqlw-quote', "'"), patternInp, el('span', 'sqlw-quote', "'"));

        // Beispielmuster zum Anklicken
        const chips = el('div', 'sqlw-chips');
        chips.appendChild(el('span', 'sqlw-chips-label', 'Muster zum Ausprobieren:'));
        const chipBtns = LIKE_PRESETS.map(p => {
            const b = el('button', 'sqlw-chip', p);
            b.type = 'button';
            b.addEventListener('click', () => { patternInp.value = p; update(); });
            chips.appendChild(b);
            return b;
        });

        q.whereLine.append(kw('WHERE'), fieldSel, opsBox, valueBox, el('span', null, ';'));
        q.query.appendChild(chips);
        root.append(q.query, t.summary, t.stage, t.toggle);

        function update() {
            const pattern = patternInp.value;
            const regex = likeToRegex(pattern, op === 'ILIKE');

            opBtns.forEach(b => {
                const active = b.textContent === op;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            chipBtns.forEach((b, i) => {
                const on = LIKE_PRESETS[i] === pattern;
                b.classList.toggle('is-active', on);
                b.setAttribute('aria-pressed', on ? 'true' : 'false');
            });

            sqlText = `${SQL_HEAD}${field} ${op} ${quote(pattern)};`;

            const hasWildcard = /[%_]/.test(pattern);
            renderResult(root, t, {
                hl: [field],
                condition: `${field} ${op} '${pattern}'`,
                note: (hasWildcard
                    ? '% steht für beliebig viele Zeichen (auch 0), _ für genau ein Zeichen.'
                    : 'Ohne Platzhalter muss der Text exakt übereinstimmen - probiere % oder _.') +
                    (op === 'LIKE'
                        ? ' Groß- und Kleinschreibung wird beachtet.'
                        : ' Groß- und Kleinschreibung wird ignoriert.'),
                evaluate: r => {
                    const pass = regex.test(r[field]);
                    return { pass, text: pass ? 'passt ✓' : 'passt nicht ✗' };
                }
            });
        }

        fieldSel.addEventListener('change', () => { field = fieldSel.value; update(); });
        patternInp.addEventListener('input', update);
        t.hideChk.addEventListener('change', update);

        update();
    }

    // --- Widget 4: Sortieren mit ORDER BY (inkl. NULL-Werte) ---------------------
    // Damit NULL-Werte sichtbar werden, fehlt hier bei den bestellten Lieferungen
    // das Lieferdatum (im Datenbank-Setup sind diese Werte befüllt).
    const SORT_COLS = [
        { name: 'lieferant' },
        { name: 'material' },
        { name: 'menge', num: true },
        { name: 'lieferdatum' }
    ];
    const SORT_NAMES = SORT_COLS.map(c => c.name);
    const SORT_DATES = ['2024-03-15', '2024-03-18', '2024-03-20', null, '2024-03-16', null, '2024-03-19', '2024-03-21', '2024-03-17', null];
    const SORT_DATA = DATA.map((r, i) => ({ id: i, lieferant: r.lieferant, material: r.material, menge: r.menge, lieferdatum: SORT_DATES[i] }));
    const NULL_COUNT = SORT_DATES.filter(d => d === null).length;
    const NULL_MODES = [
        { key: '', label: 'Standard', title: 'Keine Angabe: Standardverhalten von PostgreSQL' },
        { key: 'NULLS FIRST', label: 'NULLS FIRST', title: 'NULL-Werte zuerst' },
        { key: 'NULLS LAST', label: 'NULLS LAST', title: 'NULL-Werte am Ende' }
    ];

    function initSort(root) {
        if (root.dataset.ready) return;
        root.dataset.ready = 'true';
        root.classList.add('sqlw-root');

        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Sortierschlüssel: erste Spalte (mit NULL-Option) und optionale zweite Spalte
        const key1 = { col: 'lieferdatum', dir: 'ASC', nulls: '' };
        const key2 = { col: '', dir: 'ASC', nulls: '' };
        let sqlText = '';

        const q = buildQuery(() => sqlText, SORT_NAMES);

        const colSelect = (label, withNone) => {
            const sel = el('select', 'sqlw-field');
            sel.setAttribute('aria-label', label);
            if (withNone) {
                const o = el('option', null, '(keine weitere Spalte)');
                o.value = '';
                sel.appendChild(o);
            }
            SORT_NAMES.forEach(name => {
                const o = el('option', null, name);
                o.value = name;
                sel.appendChild(o);
            });
            return sel;
        };

        // Gruppe aus Umschalt-Buttons; gibt eine Funktion zum Aktualisieren zurück
        const buttonGroup = (label, items, getValue, setValue) => {
            const box = el('span', 'sqlw-ops');
            box.setAttribute('role', 'group');
            box.setAttribute('aria-label', label);
            const btns = items.map(it => {
                const b = el('button', 'sqlw-op', it.label);
                b.type = 'button';
                b.title = it.title;
                b.addEventListener('click', () => { setValue(it.key); update(); });
                box.appendChild(b);
                return b;
            });
            const sync = () => btns.forEach((b, i) => {
                const active = items[i].key === getValue();
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            return { box, sync };
        };

        const DIRS = [
            { key: 'ASC', label: 'ASC', title: 'Aufsteigend: A→Z, 0→9, alt→neu' },
            { key: 'DESC', label: 'DESC', title: 'Absteigend: Z→A, 9→0, neu→alt' }
        ];

        const sel1 = colSelect('Sortierspalte');
        sel1.value = key1.col;
        const dir1 = buttonGroup('Sortierrichtung', DIRS, () => key1.dir, v => { key1.dir = v; });
        const nulls1 = buttonGroup('Umgang mit NULL-Werten', NULL_MODES, () => key1.nulls, v => { key1.nulls = v; });
        const sel2 = colSelect('Zweite Sortierspalte', true);
        const dir2 = buttonGroup('Sortierrichtung der zweiten Spalte', DIRS, () => key2.dir, v => { key2.dir = v; });

        const comma = el('span', null, ',');
        const semi1 = el('span', null, ';');
        const semi2 = el('span', null, ';');

        q.whereLine.append(kw('ORDER BY'), sel1, dir1.box, nulls1.box, comma, semi1);
        const line4 = el('div', 'sqlw-line sqlw-where sqlw-then');
        line4.append(sel2, dir2.box, semi2);
        q.query.appendChild(line4);

        // Tabelle
        const summary = el('div', 'sqlw-summary');
        summary.setAttribute('aria-live', 'polite');
        const stage = el('div', 'sqlw-stage');
        const rowsBox = el('div', 'sqlw-rows is-sort');
        stage.appendChild(rowsBox);

        const head = el('div', 'sqlw-row sqlw-head sqlw-sortrow');
        const headCells = SORT_COLS.map(c => {
            const cell = el('span', 'sqlw-cell', c.name);
            head.appendChild(cell);
            return cell;
        });
        rowsBox.appendChild(head);

        const rows = SORT_DATA.map(r => {
            const node = el('div', 'sqlw-row sqlw-sortrow');
            const cells = SORT_COLS.map(c => {
                const v = r[c.name];
                const cell = el('span', 'sqlw-cell', v === null ? 'NULL' : String(v));
                if (c.num) cell.classList.add('is-num');
                if (v === null) cell.classList.add('is-null');
                node.appendChild(cell);
                return cell;
            });
            rowsBox.appendChild(node);
            return { data: r, node, cells };
        });

        const hint = el('div', 'sqlw-note sqlw-hint',
            'Hinweis: Damit NULL-Werte sichtbar werden, fehlt in diesem Beispiel bei den bestellten Lieferungen das Lieferdatum. ' +
            'In der Tabelle aus dem Datenbank-Setup sind diese Werte befüllt - dort liefert die Abfrage deshalb eine andere Reihenfolge.');

        root.append(q.query, summary, stage, hint);

        // Vergleich zweier Zeilen nach einem Sortierschlüssel (wie in PostgreSQL:
        // ohne Angabe stehen NULL-Werte bei ASC am Ende und bei DESC am Anfang)
        function compare(a, b, key) {
            const x = a[key.col];
            const y = b[key.col];
            if (x === null || y === null) {
                if (x === y) return 0;
                const first = key.nulls ? key.nulls === 'NULLS FIRST' : key.dir === 'DESC';
                return (x === null) === first ? -1 : 1;
            }
            const c = typeof x === 'number' ? x - y : x.localeCompare(y, 'de');
            return key.dir === 'ASC' ? c : -c;
        }

        const dirText = d => (d === 'ASC' ? 'aufsteigend' : 'absteigend');

        function update() {
            if (key2.col === key1.col) key2.col = '';
            sel2.value = key2.col;
            Array.from(sel2.options).forEach(o => { o.disabled = o.value === key1.col; });

            const keys = key2.col ? [key1, key2] : [key1];
            dir1.sync();
            nulls1.sync();
            dir2.sync();
            dir2.box.hidden = !key2.col;
            comma.hidden = !key2.col;
            semi1.hidden = !!key2.col;
            semi2.hidden = !key2.col;

            const keyText = k => `${k.col} ${k.dir}${k.nulls ? ' ' + k.nulls : ''}`;
            const orderBy = keys.map(keyText).join(', ');
            sqlText = `SELECT ${SORT_NAMES.join(', ')}\nFROM lieferungen\nORDER BY ${orderBy};`;

            // Sortieren (stabil) und Zeilen mit Animation an die neue Position bringen
            const sorted = rows.slice().sort((a, b) => {
                for (const k of keys) {
                    const c = compare(a.data, b.data, k);
                    if (c) return c;
                }
                return a.data.id - b.data.id;
            });
            const before = new Map(rows.map(r => [r, r.node.getBoundingClientRect().top]));
            rowsBox.append(...sorted.map(r => r.node));
            if (!reduce) {
                sorted.forEach(r => {
                    const dy = before.get(r) - r.node.getBoundingClientRect().top;
                    if (dy) {
                        r.node.animate(
                            [{ transform: `translateY(${dy}px)` }, { transform: 'none' }],
                            { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)' }
                        );
                    }
                });
            }

            const i1 = SORT_NAMES.indexOf(key1.col);
            const i2 = SORT_NAMES.indexOf(key2.col);
            headCells.forEach((c, i) => c.classList.toggle('is-hl', i === i1 || i === i2));
            rows.forEach(r => r.cells.forEach((c, i) => c.classList.toggle('is-hl', i === i1 || i === i2)));

            // Zusammenfassung
            const parts = [
                'Sortiert wird nach ', el('code', null, key1.col), ` ${dirText(key1.dir)}`
            ];
            if (key2.col) {
                parts.push(' - bei gleichen Werten zusätzlich nach ', el('code', null, key2.col), ` ${dirText(key2.dir)}`);
            }
            parts.push('. ');
            if (key1.col === 'lieferdatum') {
                const first = key1.nulls ? key1.nulls === 'NULLS FIRST' : key1.dir === 'DESC';
                parts.push(el('strong', null, `Die ${NULL_COUNT} Zeilen mit NULL stehen ${first ? 'am Anfang' : 'am Ende'}`));
                parts.push(key1.nulls
                    ? ` - festgelegt durch ${key1.nulls}.`
                    : ` - das ist das Standardverhalten bei ${key1.dir}.`);
            } else {
                parts.push(key1.nulls
                    ? `Die Spalte ${key1.col} enthält keine NULL-Werte - ${key1.nulls} hat hier keine Auswirkung. Wähle lieferdatum, um den Effekt zu sehen.`
                    : `Die Spalte ${key1.col} enthält keine NULL-Werte. Wähle lieferdatum, um den Umgang mit NULL zu testen.`);
                if (key2.col === 'lieferdatum') {
                    parts.push(` Für die zweite Spalte gilt bei NULL das Standardverhalten (bei ${key2.dir} ${key2.dir === 'DESC' ? 'am Anfang' : 'am Ende'}).`);
                }
            }
            summary.replaceChildren(...parts);
        }

        sel1.addEventListener('change', () => { key1.col = sel1.value; update(); });
        sel2.addEventListener('change', () => { key2.col = sel2.value; update(); });

        update();
    }

    // --- Widget 5: Paginierung mit LIMIT und OFFSET ------------------------------
    const PAGE_COLS = ['material', 'lieferdatum', 'lieferant'];
    const PAGE_DATES = ['2024-03-15', '2024-03-18', '2024-03-20', '2024-03-22', '2024-03-16', '2024-03-25', '2024-03-19', '2024-03-21', '2024-03-17', '2024-03-28'];
    // Ergebnis von: SELECT ... FROM lieferungen ORDER BY lieferdatum ASC
    const PAGE_DATA = DATA
        .map((r, i) => ({ material: r.material, lieferdatum: PAGE_DATES[i], lieferant: r.lieferant }))
        .sort((a, b) => a.lieferdatum.localeCompare(b.lieferdatum));
    const PAGE_SIZES = [3, 5, 10];

    function initPage(root) {
        if (root.dataset.ready) return;
        root.dataset.ready = 'true';
        root.classList.add('sqlw-root');

        const total = PAGE_DATA.length;
        let size = 3;
        let page = 1;
        let sqlText = '';

        // Kopfzeile: Ergebnisse pro Seite + Anzeige des Bereichs
        const bar = el('div', 'sqlw-pagebar');
        const sizeBox = el('span', 'sqlw-pagesize');
        sizeBox.appendChild(el('span', 'sqlw-modes-label', 'Ergebnisse pro Seite:'));
        const sizeGroup = el('span', 'sqlw-ops');
        sizeGroup.setAttribute('role', 'group');
        sizeGroup.setAttribute('aria-label', 'Ergebnisse pro Seite');
        const sizeBtns = PAGE_SIZES.map(n => {
            const b = el('button', 'sqlw-op', String(n));
            b.type = 'button';
            b.addEventListener('click', () => {
                // Der erste sichtbare Eintrag bleibt auch nach dem Wechsel sichtbar
                const firstIndex = (page - 1) * size;
                size = n;
                page = Math.floor(firstIndex / size) + 1;
                update();
            });
            sizeGroup.appendChild(b);
            return b;
        });
        sizeBox.appendChild(sizeGroup);
        const range = el('span', 'sqlw-pagerange');
        range.setAttribute('aria-live', 'polite');
        bar.append(sizeBox, range);

        // Tabelle mit den Zeilen der aktuellen Seite
        const stage = el('div', 'sqlw-stage');
        const rowsBox = el('div', 'sqlw-rows is-page');
        stage.appendChild(rowsBox);
        const head = el('div', 'sqlw-row sqlw-head sqlw-pagerow');
        head.appendChild(el('span', 'sqlw-cell is-num', '#'));
        PAGE_COLS.forEach(c => head.appendChild(el('span', 'sqlw-cell', c)));

        // Seitennavigation
        const pager = el('nav', 'sqlw-pager');
        pager.setAttribute('aria-label', 'Seiten');

        // Abfrage
        const q = buildQuery(() => sqlText, PAGE_COLS);
        q.whereLine.append(kw('ORDER BY'), el('span', null, 'lieferdatum ASC'));
        const limitLine = el('div', 'sqlw-line sqlw-where');
        const limitNum = el('span', 'sqlw-numhl');
        const offsetNum = el('span', 'sqlw-numhl');
        const end = el('span', 'sqlw-end');
        end.append(offsetNum, ';');
        limitLine.append(kw('LIMIT'), limitNum, kw('OFFSET'), end);
        q.query.appendChild(limitLine);

        const summary = el('div', 'sqlw-summary');
        summary.setAttribute('aria-live', 'polite');

        root.append(bar, stage, pager, q.query, summary);

        const pageBtn = (label, target, opts = {}) => {
            const b = el('button', 'sqlw-pagebtn', label);
            b.type = 'button';
            if (opts.title) b.setAttribute('aria-label', opts.title);
            if (opts.current) {
                b.classList.add('is-active');
                b.setAttribute('aria-current', 'page');
            }
            b.disabled = !!opts.disabled;
            b.addEventListener('click', () => { page = target; update(); });
            return b;
        };

        function update() {
            const pages = Math.ceil(total / size);
            page = Math.min(Math.max(page, 1), pages);
            const offset = (page - 1) * size;
            const visible = PAGE_DATA.slice(offset, offset + size);

            sizeBtns.forEach((b, i) => {
                const active = PAGE_SIZES[i] === size;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            range.textContent = `Zeige ${offset + 1}-${offset + visible.length} von ${total} Lieferungen`;

            // Zeilen der Seite; leere Platzhalter halten die Höhe konstant
            const nodes = [head];
            for (let i = 0; i < size; i++) {
                const r = visible[i];
                const node = el('div', 'sqlw-row sqlw-pagerow');
                if (r) {
                    node.appendChild(el('span', 'sqlw-cell is-num sqlw-pos', String(offset + i + 1)));
                    PAGE_COLS.forEach(c => node.appendChild(el('span', 'sqlw-cell', r[c])));
                } else {
                    node.classList.add('is-empty');
                    node.setAttribute('aria-hidden', 'true');
                    node.appendChild(el('span', 'sqlw-cell', ' '));
                }
                nodes.push(node);
            }
            rowsBox.replaceChildren(...nodes);

            // Seitennavigation neu aufbauen (Fokus auf dem zuletzt benutzten Button halten)
            const focused = pager.contains(document.activeElement) ? document.activeElement.dataset.role : null;
            const prev = pageBtn('‹ Zurück', page - 1, { disabled: page === 1, title: 'Vorherige Seite' });
            prev.dataset.role = 'prev';
            const next = pageBtn('Weiter ›', page + 1, { disabled: page === pages, title: 'Nächste Seite' });
            next.dataset.role = 'next';
            const nums = [];
            for (let p = 1; p <= pages; p++) {
                const b = pageBtn(String(p), p, { current: p === page, title: `Seite ${p}` });
                b.dataset.role = 'p' + p;
                nums.push(b);
            }
            pager.replaceChildren(prev, ...nums, next);
            if (focused) {
                let target = pager.querySelector(`[data-role="${focused}"]`);
                if (!target || target.disabled) target = pager.querySelector('[aria-current="page"]');
                if (target) target.focus();
            }

            // Abfrage und Erklärung
            limitNum.textContent = String(size);
            offsetNum.textContent = String(offset);
            sqlText = `SELECT ${PAGE_COLS.join(', ')}\nFROM lieferungen\nORDER BY lieferdatum ASC\nLIMIT ${size} OFFSET ${offset};`;

            summary.replaceChildren(
                el('strong', null, `Seite ${page} von ${pages}: `),
                el('code', null, `LIMIT ${size}`),
                ' ist die Anzahl der Ergebnisse pro Seite. ',
                el('code', null, `OFFSET ${offset}`),
                ` überspringt die Zeilen der vorherigen Seiten: (Seite - 1) × Ergebnisse pro Seite = (${page} - 1) × ${size} = ${offset}.`
            );
            if (visible.length < size) {
                summary.appendChild(el('span', 'sqlw-note',
                    ` Auf der letzten Seite ${visible.length === 1 ? 'ist nur noch 1 Zeile' : `sind nur noch ${visible.length} Zeilen`} übrig - LIMIT gibt dann einfach weniger zurück.`));
            }
        }

        update();
    }

    function initAll() {
        document.querySelectorAll('.sql-page').forEach(initPage);
        document.querySelectorAll('.sql-sort').forEach(initSort);
        document.querySelectorAll('.sql-like').forEach(initLike);
        document.querySelectorAll('.sql-where').forEach(initWhere);
        document.querySelectorAll('.sql-logic').forEach(initLogic);
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
