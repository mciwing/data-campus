# Strukturierte Ausgaben

Wer Ergebnisse weiterverarbeiten will, braucht **vorhersagbare Formate**. LLMs können ihre Antworten gezielt strukturieren - als Tabelle, JSON, Markdown oder nach einer Vorlage.

Solange du die Antwort selbst liest, ist Fließtext in Ordnung. Sobald aber ein **Programm** die Antwort weiterverarbeitet - eine Tabelle füllt, eine Datenbank beschreibt, eine Website baut - wird Fließtext zum Problem. Dann brauchst du Struktur.

---

## Warum Struktur mehr als Kosmetik ist

!!! quote "Merksatz"

    Ein Format ist nicht nur eine Darstellungsform - es ist ein **Denkraster**. Wer neun Felder eines Canvas vorgibt, zwingt das Modell, an alle neun zu denken.

Ein vorgegebenes Format bewirkt gleich dreierlei:

1. **Vollständigkeit** - leere Felder fallen sofort auf.
2. **Vergleichbarkeit** - zwei Antworten lassen sich nebeneinanderlegen.
3. **Weiterverarbeitbarkeit** - Python kann das Ergebnis direkt einlesen.

---

## Vier bekannte Formate

=== ":material-table: Tabelle"

    **Wofür:** Vergleiche, Bewertungen, alles mit gleichen Merkmalen über mehrere Objekte.

    ```{.text .ollama title="Ollama Chat"}
    Vergleiche die drei Vertriebskanäle in einer Markdown-Tabelle
    ...mit den Spalten: Kanal | Reichweite | Kosten | Aufwand.
    ...Eine Zeile pro Kanal, keine Erklärung davor oder danach.
    ```

    ✅ Sehr lesbar für Menschen · ❌ mühsam maschinell auszuwerten, wenn Zellen Kommas enthalten.

=== ":material-code-json: JSON"

    **Wofür:** alles, was ein Programm weiterverarbeiten soll.

    ```{.text .ollama title="Ollama Chat"}
    Antworte ausschließlich mit gültigem JSON, ohne Markdown-Codeblock
    ...und ohne Erklärung. Schema:
    ...
    ...{
    ...  "idee": "<string>",
    ...  "risiken": [{"titel": "<string>", "schwere": "hoch|mittel|niedrig"}],
    ...  "bewertung": <zahl 1-10>
    ...}
    ```

    ✅ Direkt in Python einlesbar · ❌ kleine Modelle produzieren gern *fast* gültiges JSON (siehe Labor unten).

=== ":material-language-markdown: Markdown"

    **Wofür:** Dokumentation, Berichte, Website-Inhalte - Text mit Gliederung.

    ```{.text .ollama title="Ollama Chat"}
    Gib das Ergebnis als Markdown aus:
    ...- eine H2-Überschrift pro Abschnitt
    ...- darunter maximal 3 Stichpunkte
    ...- Fachbegriffe **fett**
    ...Keine Einleitung.
    ```

    ✅ Menschenlesbar *und* strukturiert · ❌ kein festes Schema erzwingbar.

=== ":material-file-document-outline: Vorlage"

    **Wofür:** wiederkehrende Dokumente mit fester Gliederung.

    ```{.text .ollama title="Ollama Chat"}
    Fülle exakt diese Vorlage aus. Ersetze nur die <Platzhalter>,
    ...ändere nichts an der Struktur:
    ...
    ...PRODUKT: <name>
    ...ZIELGRUPPE: <eine Zeile>
    ...NUTZEN: <maximal 20 Wörter>
    ...PREIS: <zahl> EUR
    ...RISIKO: <ein Satz>
    ```

    ✅ Funktioniert auch bei sehr kleinen Modellen ⭐ · ❌ unflexibel bei variabler Feldanzahl.

!!! danger "Der Preis der Struktur ⚖️"

    Struktur ist nicht gratis. Tam et al.[^tam] haben gemessen, was passiert, wenn man Modelle zu striktem JSON zwingt: Auf **Denkaufgaben** fiel die Leistung teilweise deutlich ab - je enger das Format, desto stärker der Einbruch.

    Die Erklärung ist einleuchtend: Beim freien Antworten kann ein Modell „laut mitdenken" und sich über Zwischenschritte zur Lösung vorarbeiten. Ein festes Schema erzwingt die Antwort **sofort**, ohne Umweg.

    👉 Praktische Regel: **Erst denken lassen, dann formatieren.** Nutze zwei Schritte ([Prompt Chaining](chaining.md)) - Schritt 1 analysiert frei, Schritt 2 gießt das Ergebnis in JSON. Das ist zuverlässiger als beides in einem Prompt zu verlangen.

???+ tip "Die Format-Rangfolge für kleine Modelle"

    Je kleiner das Modell, desto einfacher muss das Format sein:

    **Vorlage** (am robustesten) → **Markdown** → **Tabelle** → **JSON** (am fehleranfälligsten)

    Wenn `gemma3:1b` an deinem JSON scheitert: nimm eine `SCHLÜSSEL: Wert`-Vorlage und wandle sie in Python selbst in JSON um. Das ist fast immer schneller als drei weitere Prompt-Iterationen.

---

## Der Ollama JSON-Modus

<div style="text-align: center;">
    <img src="https://i.programmerhumor.io/2025/06/c5b8b1145b14842fa8b4ded98c26b52afc289d50339c5ce502b37ddf69f37b23.jpeg" alt="JSON-Meme" style="max-width: 50%;">
    <figcaption>Quelle: <a href="https://i.programmerhumor.io/2025/06/c5b8b1145b14842fa8b4ded98c26b52afc289d50339c5ce502b37ddf69f37b23.jpeg">Programmerhumor.io</a></figcaption>
</div>

Ollama kann das Modell technisch dazu **zwingen**, gültiges JSON zu erzeugen - mit der Option `--format json`:

```title="Terminal"
ollama run --format json gemma3:1b "Nenne 3 Risiken für einen Bio-Lieferdienst. Antworte als JSON mit dem Schlüssel 'risiken', jeder Eintrag mit 'titel' und 'schwere' (hoch, mittel oder niedrig)."
```

```{.text .no-copy title="Beispielausgabe"}
{
  "risiken": [
    {"titel": "Kühlkette bei der Zustellung", "schwere": "hoch"},
    {"titel": "Verderb bei schwankender Nachfrage", "schwere": "mittel"},
    {"titel": "Preisdruck durch Supermärkte", "schwere": "hoch"}
  ]
}
```

Diese Option erzwingt syntaktisch gültiges JSON **auf Ebene der Token-Auswahl**: Tokens, die das JSON ungültig machen würden, werden gar nicht erst zur Auswahl zugelassen. Das Modell *kann* damit kein kaputtes JSON mehr erzeugen.[^willard]

!!! warning "Gültig ≠ richtig"

    `--format json` garantiert nur die **Syntax**, nicht das **Schema**. Du bekommst garantiert gültiges JSON - aber vielleicht so:

    ```title="Ebenfalls gültiges JSON - aber unbrauchbar"
    {
      "risks": [
        {"name": "Kühlkette", "severity": "sehr hoch"}
      ]
    }
    ```

    Englische Schlüssel, andere Feldnamen, ein Wert außerhalb der drei erlaubten. Syntaktisch einwandfrei, für die Weiterverarbeitung wertlos.

    👉 Beschreibe das Schema trotzdem **im Prompt** - und prüfe die Ausgabe.

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren - hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! adv "Erst die Messbedingungen 🌡️"

    Dieses Lab besteht fast nur aus Zähllaufen. Damit du Formattreue misst und nicht das Würfeln, gilt hier durchgehend die Regel aus dem [Setup](ollama-setup.md): **`/set parameter temperature 0.2`** und **`/clear` vor jedem Lauf**.

    Und du brauchst ein **Prüfmittel**. „Sieht nach JSON aus" reicht nicht - genau die subtilen Fehler (ein Komma zu viel, eine fehlende Klammer) übersieht das Auge. Lass die Maschine urteilen:

    ```title="Terminal"
    ollama run gemma3:1b --format json "Nenne 3 Risiken für ..." | python -m json.tool
    ```

    Kommt eingerücktes JSON zurück, war die Antwort gültig. Kommt `Expecting value` oder `Extra data`, war sie es nicht - unabhängig davon, wie gut sie aussah.

!!! lab "Übung 1: Wie zuverlässig ist JSON?"

    Lass dir drei Risiken deiner Geschäftsidee als JSON ausgeben - Schlüssel `risiken`, je Eintrag `titel` und `schwere`.

    Führe das **fünfmal ohne** und **fünfmal mit** `--format json` aus.

    **Zähle:** Wie oft ist das Ergebnis wirklich gültiges JSON? Achte besonders auf einleitende Sätze, umschließende Codeblöcke und Kommas zu viel.

    ??? success "Was du beobachten solltest"

        **Ohne** `--format json` liegt die Quote typischerweise bei 1/5 bis 3/5. Der häufigste Fehler ist kein Syntaxfehler, sondern Höflichkeit: *„Gerne! Hier ist das JSON:"* davor, ein erklärender Satz danach, das Ganze in ```` ```json ````-Zäunen.

        **Mit** `--format json` sind es fast immer 5/5 - die Syntax wird technisch erzwungen.

        Der Haken zeigt sich erst beim Lesen: Die *Struktur* kann trotzdem falsch sein. Statt `{"risiken": [...]}` kommt manchmal `{"risiko1": ..., "risiko2": ...}`, oder `schwere` enthält einen ganzen Satz. **Gültiges JSON ist nicht dasselbe wie erwartetes JSON** - dazu der 🐍-Block unten.

!!! lab "Übung 2: Vorlage schlägt JSON"

    Baue für deine Idee eine **Vorlage** im Stil `SCHLÜSSEL: Wert` - etwa PRODUKT, ZIELGRUPPE, NUTZEN, PREIS, RISIKO.

    Fünfmal ausführen, Trefferquote mit Übung 1 vergleichen. Danach dasselbe auf `gemma3:270m`.

    **Die Frage:** Was überlebt beim winzigsten Modell - JSON oder Vorlage?

    ??? success "Was du beobachten solltest"

        Das Ergebnis ist kontraintuitiv, also erschrick nicht: **Auf `gemma3:270m` gewinnt die Vorlage deutlich.** Das JSON bricht dort mitten in der Klammerstruktur ab, verliert Anführungszeichen oder erfindet Schlüssel. Die `SCHLÜSSEL: Wert`-Zeilen kommen dagegen meist vollständig durch - notfalls mit einer Zeile zu viel, die du einfach ignorierst.

        Der Grund: JSON ist **alles-oder-nichts**. Ein fehlendes Zeichen macht die gesamte Antwort unbrauchbar. Eine Zeilenvorlage ist **fehlertolerant** - vier von fünf Zeilen sind vier verwertbare Zeilen.

        👉 Praxisregel: JSON, wenn ein Programm es weiterverarbeitet. Vorlage, wenn ein Mensch es liest oder das Modell klein ist.

!!! lab "Übung 3: Der Reparatur-Prompt"

    Wenn ein Format nicht stimmt, fang nicht von vorn an. Sag im **selben Chat**, was falsch war:

    ```{.text .ollama title="Ollama Chat"}
    Deine Antwort enthielt einleitenden Text.
    ...Gib das JSON erneut aus - ohne jeden Text davor oder danach.
    ```

    **Probiere aus:** Wie oft brauchst du diese Korrekturrunde? Und reicht eine, oder musst du nachfassen?

    **Die Abbruchregel:** Nach **zwei** erfolglosen Reparaturversuchen hörst du auf zu bitten und baust den Prompt um. Wer dreimal nachfasst, hat den Chat mit lauter fehlerhaften Beispielen gefüllt - und die stehen jetzt als Kontext im Fenster und machen den nächsten Fehler *wahrscheinlicher*. `/clear` und neu formulieren ist ab da schneller.

    ??? success "Was du beobachten solltest"

        Eine Reparaturrunde reicht meistens - der Hinweis auf den konkreten Fehler wirkt zuverlässiger als jede Vorab-Ermahnung.

        Was du dabei bemerkst: Das Modell entschuldigt sich, korrigiert brav - und macht denselben Fehler zwei Antworten später wieder. Es hat nichts *gelernt*, es hat nur den letzten Hinweis noch im Kontextfenster.

!!! lab "Übung 4: Dein Canvas in mehreren Formaten"

    Erzeuge dein Business Model Canvas in **zwei** Formaten deiner Wahl - eines für Menschen (Tabelle oder Markdown), eines für Maschinen (JSON oder Vorlage).

    Führe jedes Format fünfmal aus und notiere die Fehlversuche. Halte für jedes fest: *Wofür würde ich es einsetzen?*

    Speichere den zuverlässigsten Prompt in `prompts.md` unter `## 03 Canvas strukturiert`.

    !!! tip "Für Gruppen: alle vier Formate abdecken"

        Im Kurs lohnt sich die Arbeitsteilung - jede Person nimmt **ein** Format (Tabelle, JSON, Markdown, Vorlage), alle führen fünf Läufe durch, danach werden die Trefferquoten nebeneinandergelegt. So habt ihr in einem Bruchteil der Zeit gemeinsam eine Datengrundlage, für die eine Person allein alle zwanzig Läufe machen müsste.

??? code "🐍 Optional (Python): JSON einlesen und Schema prüfen"

    Der Punkt von JSON ist die Weiterverarbeitung. So sieht sie aus:

    ```python title="json_pruefen.py"
    import json
    import ollama

    ERLAUBTE_SCHWERE = {"hoch", "mittel", "niedrig"}

    antwort = ollama.chat(
        model="gemma3:1b",
        messages=[{"role": "user", "content":
                   "Nenne 3 Risiken für einen Bio-Lieferdienst. JSON mit "
                   "Schlüssel 'risiken', je Eintrag 'titel' und 'schwere'."}],
        format="json",
        options={"temperature": 0.1},
    )["message"]["content"]

    daten = json.loads(antwort)

    for i, eintrag in enumerate(daten.get("risiken", []), start=1):
        titel = eintrag.get("titel", "???")
        schwere = str(eintrag.get("schwere", "")).lower()
        ok = "✅" if schwere in ERLAUBTE_SCHWERE else "❌"
        print(f"{ok} [{schwere:>9}] {titel}")
    ```

    ```title="Ausgabe"
    ✅ [     hoch] Kühlkette bei der Zustellung
    ✅ [   mittel] Verderb bei schwankender Nachfrage
    ❌ [sehr hoch] Preisdruck durch Supermärkte
    ```

    Beachte den dritten Eintrag: Das JSON ist **syntaktisch gültig**, aber `"sehr hoch"` steht nicht in der erlaubten Menge. Genau deshalb reicht `format="json"` allein nicht - die Schema-Prüfung musst du selbst machen.

---


## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^willard]: **Willard, B. T. & Louf, R. (2023):** *Efficient Guided Generation for Large Language Models.* arXiv:2307.09702. [https://arxiv.org/abs/2307.09702](https://arxiv.org/abs/2307.09702) - beschreibt das Verfahren hinter `--format json`: Die Ausgabe wird über einen endlichen Automaten geführt, der ungültige Tokens gar nicht erst zur Auswahl zulässt. Deshalb ist gültige Syntax garantiert - und nur die Syntax.
[^tam]: **Tam, Z. R., Wu, C.-K., Tsai, Y.-L. et al. (2024):** *Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models.* arXiv:2408.02442. [https://arxiv.org/abs/2408.02442](https://arxiv.org/abs/2408.02442) - wichtiger Gegenbefund: Strenge Formatvorgaben können die **Denkleistung senken**. Siehe den Kasten „Der Preis der Struktur" oben.
[^osterwalder]: **Osterwalder, A. & Pigneur, Y. (2010):** *Business Model Generation: A Handbook for Visionaries, Game Changers, and Challengers.* Wiley, ISBN 978-0-470-87641-1.
