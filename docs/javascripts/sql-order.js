// Interaktive Darstellung der logischen Ausführungsreihenfolge einer SQL-Abfrage.
// Verwendung im Markdown: <div class="sql-order"></div>

(function () {
    const DATA = [
        [1, 'Stahlwerk Salzgitter', 12.50, 'Geliefert', 'Lager Nord'],
        [2, 'Aluminium AG', 25.00, 'Geliefert', 'Lager Sued'],
        [3, 'Kunststoff GmbH', 8.75, 'In Transit', 'Lager Nord'],
        [4, 'Stahlwerk Salzgitter', 45.00, 'Bestellt', 'Lager Ost'],
        [5, 'Schrauben Meyer', 0.15, 'Geliefert', 'Lager Nord'],
        [6, 'Aluminium AG', 18.50, 'Bestellt', 'Lager Sued'],
        [7, 'Elektronik Weber', 12.90, 'Geliefert', 'Lager Ost'],
        [8, 'Kunststoff GmbH', 2.30, 'In Transit', 'Lager Nord'],
        [9, 'Schrauben Meyer', 0.08, 'Geliefert', 'Lager Nord'],
        [10, 'Elektronik Weber', 22.00, 'Bestellt', 'Lager Ost']
    ].map(r => ({ id: r[0], lieferant: r[1], preis: r[2], status: r[3], ziel: r[4] }));

    const COLS = ['lieferung_id', 'lieferant', 'preis_pro_einheit', 'status', 'zielstandort'];
    const RESULT_COLS = ['zielstandort', 'durchschnittspreis'];
    const GROUP_NAMES = ['Lager Nord', 'Lager Ost', 'Lager Sued'];
    const fmt = n => n.toFixed(2);

    // --- Die Abfrage Schritt für Schritt berechnen ---------------------------
    const filtered = DATA.filter(r => r.status === 'Geliefert');
    const groups = GROUP_NAMES
        .map((name, i) => {
            const rows = filtered.filter(r => r.ziel === name);
            const avg = rows.reduce((s, r) => s + r.preis, 0) / (rows.length || 1);
            return { name, i, rows, avg, pass: avg > 10 };
        })
        .filter(g => g.rows.length > 0);
    const passing = groups.filter(g => g.pass);
    const sorted = passing.slice().sort((a, b) => b.avg - a.avg);

    // --- Ansichten -----------------------------------------------------------
    const rowItem = (r, g) => ({
        key: 'r' + r.id,
        type: 'row',
        group: g,
        cells: [r.id, r.lieferant, fmt(r.preis), r.status, r.ziel]
    });

    const rowView = (rows, hl) => ({ cols: COLS, hl, items: rows.map(r => rowItem(r)) });

    const groupView = (gs, showAvg, hl) => ({
        cols: COLS,
        hl,
        items: gs.flatMap(g => [
            { key: 'g' + g.i, type: 'group', group: g.i, name: g.name, count: g.rows.length, avg: showAvg ? g.avg : null, pass: g.pass },
            ...g.rows.map(r => rowItem(r, g.i))
        ])
    });

    const resultView = gs => ({
        cols: RESULT_COLS,
        alias: 1,
        hl: -1,
        items: gs.map(g => ({ key: 'g' + g.i, type: 'result', group: g.i, cells: [g.name, fmt(g.avg)] }))
    });

    const V = {
        from: rowView(DATA, -1),
        where: rowView(filtered, 3),
        group: groupView(groups, false, 4),
        havingPre: groupView(groups, true, 2),
        having: groupView(passing, true, 2),
        select: resultView(passing),
        order: resultView(sorted),
        limit: resultView(sorted.slice(0, 1))
    };

    const dropped = groups.filter(g => !g.pass).map(g => `${g.name} (${fmt(g.avg)})`).join(', ');

    // Schritte mit `skip: true` kommen in der Abfrage nicht vor: Sie werden
    // ausgegraut angezeigt, sind nicht anklickbar und werden ausgelassen.
    const STEPS = [
        {
            label: 'FROM', view: V.from,
            text: `Zuerst wird festgelegt, woher die Daten kommen: alle <strong>${DATA.length} Zeilen</strong> der Tabelle <code>lieferungen</code>. <em>(Zur Übersicht zeigen wir nur 5 der 8 Spalten.)</em>`
        },
        { label: 'JOIN', skip: true },
        {
            label: 'WHERE', view: V.where, mode: 'filter',
            text: `Jede <strong>einzelne Zeile</strong> wird geprüft: Nur Lieferungen mit <code>status = 'Geliefert'</code> bleiben übrig (${filtered.length} von ${DATA.length}).`
        },
        {
            label: 'GROUP BY', view: V.group,
            text: `Die verbleibenden Zeilen werden nach <code>zielstandort</code> zu <strong>${groups.length} Gruppen</strong> zusammengefasst.`
        },
        {
            label: 'HAVING', pre: V.havingPre, view: V.having, mode: 'filter',
            text: `Für jede <strong>Gruppe</strong> wird <code>AVG(preis_pro_einheit)</code> berechnet. ${dropped} liegt nicht über 10 und fällt weg. Den Alias <code>durchschnittspreis</code> gibt es hier <strong>noch nicht</strong>!`
        },
        {
            label: 'SELECT', view: V.select,
            text: 'Erst jetzt werden die Ausgabespalten berechnet: Aus jeder Gruppe wird eine Zeile - und der <strong>Alias</strong> <code>durchschnittspreis</code> entsteht.'
        },
        { label: 'DISTINCT', skip: true },
        {
            label: 'ORDER BY', view: V.order,
            text: 'Das Ergebnis wird absteigend sortiert. Hier <strong>darf</strong> der Alias <code>durchschnittspreis</code> verwendet werden - <code>SELECT</code> ist ja bereits gelaufen.'
        },
        {
            label: 'LIMIT / OFFSET', view: V.limit, mode: 'filter',
            text: 'Zum Schluss wird die Ergebnismenge begrenzt: Nur die <strong>erste Zeile</strong> bleibt übrig.'
        }
    ];

    // Indizes der Schritte, die tatsächlich ausgeführt werden
    const ACTIVE = STEPS.map((s, i) => (s.skip ? -1 : i)).filter(i => i >= 0);

    // Die Abfrage, wie wir sie schreiben - mit dem Schritt, in dem die Zeile ausgeführt wird
    const SQL = [
        [5, 'SELECT', ' zielstandort,'],
        [5, '', '       AVG(preis_pro_einheit) AS durchschnittspreis'],
        [0, 'FROM', ' lieferungen'],
        [2, 'WHERE', " status = 'Geliefert'"],
        [3, 'GROUP BY', ' zielstandort'],
        [4, 'HAVING', ' AVG(preis_pro_einheit) > 10'],
        [7, 'ORDER BY', ' durchschnittspreis DESC'],
        [8, 'LIMIT', ' 1;']
    ];

    // --- Hilfsfunktionen -----------------------------------------------------
    const el = (tag, cls, text) => {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined) node.textContent = text;
        return node;
    };

    function init(root) {
        if (root.dataset.ready) return;
        root.dataset.ready = 'true';

        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const T = reduce ? 0 : 1;
        const wait = ms => new Promise(res => setTimeout(res, ms * T));

        let cur = ACTIVE[0];
        let runId = 0;

        // Schritte (links)
        const stepsBox = el('div', 'sqlo-steps');
        const stepBtns = STEPS.map((s, i) => {
            const b = el('button', 'sqlo-step', `${i + 1}. ${s.label}`);
            b.type = 'button';
            if (s.skip) {
                b.classList.add('is-skip');
                b.disabled = true;
                b.title = 'Kommt in dieser Abfrage nicht vor';
            } else {
                b.addEventListener('click', () => goTo(i));
            }
            stepsBox.appendChild(b);
            return b;
        });

        // Abfrage, Erklärung, Daten (rechts)
        const main = el('div', 'sqlo-main');

        const sqlBox = el('pre', 'sqlo-sql');
        const sqlLines = SQL.map(([step, kw, rest]) => {
            const line = el('span', 'sqlo-line');
            line.appendChild(el('span', 'sqlo-num', kw ? String(step + 1) : ''));
            if (kw) line.appendChild(el('span', 'sqlo-kw', kw));
            line.appendChild(document.createTextNode(rest));
            line.dataset.step = step;
            sqlBox.appendChild(line);
            return line;
        });

        const caption = el('div', 'sqlo-caption');
        caption.setAttribute('aria-live', 'polite');

        const stage = el('div', 'sqlo-stage');
        const rowsBox = el('div', 'sqlo-rows');
        stage.appendChild(rowsBox);

        const controls = el('div', 'sqlo-controls');
        const prevBtn = el('button', 'sqlo-btn', '◀ Zurück');
        const nextBtn = el('button', 'sqlo-btn', 'Weiter ▶');
        const playBtn = el('button', 'sqlo-btn sqlo-btn-play', '▶ Abspielen');
        [prevBtn, nextBtn, playBtn].forEach(b => { b.type = 'button'; controls.appendChild(b); });
        prevBtn.addEventListener('click', () => goTo(ACTIVE[ACTIVE.indexOf(cur) - 1]));
        nextBtn.addEventListener('click', () => goTo(ACTIVE[ACTIVE.indexOf(cur) + 1]));
        playBtn.addEventListener('click', playAll);

        main.append(sqlBox, caption, stage, controls);
        root.append(stepsBox, main);

        // --- Rendering -------------------------------------------------------
        function buildItem(item, view) {
            if (item.type === 'group') {
                const node = el('div', `sqlo-group sqlo-g${item.group}`);
                node.appendChild(el('span', 'sqlo-group-name', item.name));
                node.appendChild(el('span', 'sqlo-group-count', item.count === 1 ? '1 Zeile' : `${item.count} Zeilen`));
                if (item.avg !== null) {
                    const badge = el('span', 'sqlo-badge ' + (item.pass ? 'is-pass' : 'is-fail'));
                    badge.textContent = `AVG(preis_pro_einheit) = ${fmt(item.avg)} ${item.pass ? '✓' : '✗'}`;
                    node.appendChild(badge);
                }
                return node;
            }
            const node = el('div', `sqlo-row sqlo-c${view.cols.length}`);
            if (item.group !== undefined) node.classList.add('sqlo-g' + item.group);
            if (item.type === 'result') node.classList.add('sqlo-result');
            item.cells.forEach((c, i) => {
                const cell = el('span', 'sqlo-cell', String(c));
                if (i === view.hl) cell.classList.add('is-hl');
                if (i === view.alias) cell.classList.add('is-alias');
                node.appendChild(cell);
            });
            return node;
        }

        function buildHead(view) {
            const head = el('div', `sqlo-row sqlo-head sqlo-c${view.cols.length}`);
            view.cols.forEach((c, i) => {
                const cell = el('span', 'sqlo-cell', c);
                if (i === view.hl) cell.classList.add('is-hl');
                if (i === view.alias) {
                    cell.classList.add('is-alias');
                    cell.appendChild(el('span', 'sqlo-alias-tag', 'Alias'));
                }
                head.appendChild(cell);
            });
            head.dataset.key = 'head' + view.cols.length;
            return head;
        }

        // Wechselt zur Ansicht `view`. mode: 'filter' (rot markieren, dann entfernen),
        // 'fade' (ausblenden) oder null (sofort).
        async function transition(view, mode, my) {
            const newKeys = new Set(view.items.map(it => it.key));
            newKeys.add('head' + view.cols.length);
            const oldNodes = Array.from(rowsBox.children);
            const leaving = oldNodes.filter(n => !newKeys.has(n.dataset.key));

            if (mode && leaving.length && T) {
                if (mode === 'filter') {
                    leaving.forEach(n => n.classList.add('is-out'));
                    await wait(850);
                    if (my !== runId) return;
                }
                leaving.forEach(n => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
                await wait(300);
                if (my !== runId) return;
            }

            const before = new Map();
            oldNodes.forEach(n => before.set(n.dataset.key, n.getBoundingClientRect()));

            const nodes = [buildHead(view)];
            view.items.forEach(item => {
                const node = buildItem(item, view);
                node.dataset.key = item.key;
                nodes.push(node);
            });
            rowsBox.replaceChildren(...nodes);

            if (T) {
                nodes.forEach(node => {
                    const old = before.get(node.dataset.key);
                    if (old) {
                        const now = node.getBoundingClientRect();
                        const dx = old.left - now.left;
                        const dy = old.top - now.top;
                        if (dx || dy) {
                            node.animate(
                                [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
                                { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)' }
                            );
                        }
                    } else {
                        node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
                    }
                });
                await wait(550);
            }
        }

        function setActive(i) {
            cur = i;
            stepBtns.forEach((b, k) => {
                b.classList.toggle('is-active', k === i);
                if (!STEPS[k].skip) b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
            });
            sqlLines.forEach(line => {
                const s = Number(line.dataset.step);
                line.classList.toggle('is-active', s === i);
                line.classList.toggle('is-todo', s > i);
            });
            caption.innerHTML = `<strong>Schritt ${i + 1}: ${STEPS[i].label}</strong> ${STEPS[i].text}`;
            prevBtn.disabled = i === ACTIVE[0];
            nextBtn.disabled = i === ACTIVE[ACTIVE.length - 1];
        }

        // Spielt genau einen Schritt (vorwärts) ab
        async function play(i, my) {
            const step = STEPS[i];
            setActive(i);
            if (step.pre) {
                await transition(step.pre, 'fade', my);
                if (my !== runId) return;
                await wait(1300);
                if (my !== runId) return;
            }
            await transition(step.view, step.mode || 'fade', my);
        }

        async function goTo(target) {
            if (target === undefined || target === cur || !STEPS[target] || STEPS[target].skip) return;
            const my = ++runId;
            if (target > cur) {
                // Übersprungene Schritte dazwischen der Reihe nach abspielen
                const path = ACTIVE.filter(s => s > cur && s <= target);
                for (const s of path) {
                    await play(s, my);
                    if (my !== runId) return;
                }
            } else {
                setActive(target);
                await transition(STEPS[target].view, null, my);
            }
        }

        async function playAll() {
            const my = ++runId;
            setActive(ACTIVE[0]);
            await transition(STEPS[ACTIVE[0]].view, null, my);
            for (const s of ACTIVE.slice(1)) {
                if (my !== runId) return;
                await wait(1500);
                if (my !== runId) return;
                await play(s, my);
            }
        }

        // Startzustand
        setActive(cur);
        transition(STEPS[cur].view, null, runId).then(() => {
            if (stage.offsetHeight) stage.style.minHeight = stage.offsetHeight + 'px';
        });
    }

    function initAll() {
        document.querySelectorAll('.sql-order').forEach(init);
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
