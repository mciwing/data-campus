Keine Icon-Overrides in mkdocs.yml — es gilt überall das Material-Standardset. Hier die vollständige Übersicht: 574 Admonitions in 16 Typen.

Eingebaute Typen (Material-Standard)

┌──────────┬────────┬──────────────────┬───────────────────┬──────────────────────────────────────────┐
│   Typ    │ Anzahl │   Akzentfarbe    │      Symbol       │                Verteilung                │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ info     │    131 │ #00b8d4 Cyan     │ ℹ Info-Kreis      │ database 110, prompt 14, excel 4, data 3 │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ example  │    129 │ #7c4dff Violett  │ Reagenzglas       │ database 90, data 27, prompt 8, excel 4  │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ question │     66 │ #64dd17 Hellgrün │ ? im Kreis        │ database 42, excel 12, data 8, prompt 4  │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ warning  │     65 │ #ff9100 Orange   │ ! im Dreieck      │ excel 32, database 16, prompt 14, data 3 │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ tip      │     43 │ #00bfa5 Türkis   │ Flamme            │ prompt 18, database 14, data 6, excel 5  │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ quote    │     14 │ #9e9e9e Grau     │ Anführungszeichen │ prompt 14                                │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ danger   │     10 │ #ff1744 Rot      │ Blitz             │ database 5, prompt 5                     │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ success  │      8 │ #00c853 Grün     │ Häkchen           │ prompt 7, database 1                     │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ note     │      2 │ #448aff Blau     │ Stift             │ excel 2                                  │
├──────────┼────────┼──────────────────┼───────────────────┼──────────────────────────────────────────┤
│ abstract │      1 │ #00b0ff Hellblau │ Klemmbrett        │ excel 1                                  │
└──────────┴────────┴──────────────────┴───────────────────┴──────────────────────────────────────────┘

Ungenutzt bleiben failure (#ff5252) und bug (#f50057).

Eigene Typen (in extra.css definiert, Font-Awesome-Icons)

┌─────────┬────────┬────────────────────┬────────────────────┬──────────┐
│   Typ   │ Anzahl │    Akzentfarbe     │       Symbol       │  Rahmen  │
├─────────┼────────┼────────────────────┼────────────────────┼──────────┤
│ code    │     39 │ #848484 Grau       │ </> Code           │ ✅ grau  │
├─────────┼────────┼────────────────────┼────────────────────┼──────────┤
│ defi    │     33 │ #E87F2B Orange     │ Buch               │ ⚠️ fehlt │
├─────────┼────────┼────────────────────┼────────────────────┼──────────┤
│ lab     │     20 │ #64DD17 Grün       │ Erlenmeyerkolben   │ ⚠️ fehlt │
├─────────┼────────┼────────────────────┼────────────────────┼──────────┤
│ adv     │      6 │ #267E26 Dunkelgrün │ ⊞ Plus im Quadrat  │ ✅       │
├─────────┼────────┼────────────────────┼────────────────────┼──────────┤
│ disadv  │      4 │ #FF0000 Rot        │ ⊟ Minus im Quadrat │ ✅       │
├─────────┼────────┼────────────────────┼────────────────────┼──────────┤
│ process │      3 │ #848484 Grau       │ Sitemap            │ ✅ grau  │
└─────────┴────────┴────────────────────┴────────────────────┴──────────┘

Drei Auffälligkeiten

1. defi und lab haben keine border-color. Bei beiden setzt die CSS nur background-color und die Icon-Farbe — der linke Rahmenbalken bleibt dadurch auf dem Standard-Blau von note. Ein oranges Buch-Icon mit blauem Rahmen, bzw. ein grüner Kolben mit blauem Rahmen. Zwei Zeilen CSS würden das angleichen.

2. lab und question sind farbgleich. Beide nutzen #64dd17 — der Kommentar in extra.css sagt es sogar explizit („identisch zu question"). Unterscheidbar sind sie nur am Icon.

3. code und process sind visuell identisch. Gleiches Grau, gleicher Hintergrund — auch hier trennt nur das Symbol.

Für dein aktuelles Kapitel

Der Excel-Kurs nutzt bislang nur 7 Typen, mit einer ungewöhnlichen Schlagseite: 32× warning gegenüber 4× info. Ein Teil davon sind Stolperfallen (da passt warning), viele stammen aber aus den älteren Abschnitten, wo !!! warning "Hinweis" als allgemeiner Hinweiskasten verwendet wird — inhaltlich eher info oder note. Die defi-Box wäre für Begriffsdefinitionen (Zellbezug, Wahrheitswert, Arbeitsmappe) naheliegend, kommt im Excel-Kurs aber gar nicht vor.

Wenn du magst, gehe ich die 32 warning-Boxen durch und schlage pro Stelle den passenderen Typ vor.

---

## Neu: `facts` (Fun Facts)

| Eigenschaft | Wert |
|---|---|
| Akzentfarbe | `#E91E63` Magenta - `rgb(233, 30, 99)` |
| Hintergrund | `rgba(233, 30, 99, 0.1)` |
| Rahmen | gesetzt (anders als bei `defi` und `lab`) |
| Symbol | Font Awesome 7.1 solid, `lightbulb` (Gluehbirne) |
| Definiert in | `docs/stylesheets/extra.css` |

Verwendung:

    !!! facts "Fun Fact"
        Ein Excel-Arbeitsblatt hat 1.048.576 Zeilen und 16.384 Spalten.

    ???+ facts "Fun Fact"      <- aufklappbar

Magenta wurde gewaehlt, weil diese Farbfamilie sonst nirgends auf der Seite
vorkommt - dadurch klar getrennt von `warning` (Orange), `danger` (Rot) und
`example` (Violett).

Bereits umgestellt: die 3 Fun-Fact-Boxen in `docs/excel/grundlagen.md`
(vorher `!!! example "Fun Fact"`).
