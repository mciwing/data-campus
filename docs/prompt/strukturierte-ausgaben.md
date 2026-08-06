# 5. Strukturierte Ausgaben

Wer Ergebnisse weiterverarbeiten will, braucht **vorhersagbare Formate**. LLMs können ihre Antworten gezielt strukturieren – als Tabelle, JSON, Markdown oder nach einer Vorlage.

Solange du die Antwort selbst liest, ist Fließtext in Ordnung. Sobald aber ein **Programm** die Antwort weiterverarbeitet – eine Tabelle füllt, eine Datenbank beschreibt, eine Website baut – wird Fließtext zum Problem. Dann brauchst du Struktur.

---

## Warum Struktur mehr ist als Kosmetik

!!! quote "Merksatz"

    Ein Format ist nicht nur eine Darstellungsform – es ist ein **Denkraster**. Wer neun Felder eines Canvas vorgibt, zwingt das Modell, an alle neun zu denken.

Ein vorgegebenes Format bewirkt gleich dreierlei:

1. **Vollständigkeit** – leere Felder fallen sofort auf.
2. **Vergleichbarkeit** – zwei Antworten lassen sich nebeneinanderlegen.
3. **Weiterverarbeitbarkeit** – Python kann das Ergebnis direkt einlesen.

---

## Die vier Formate

=== ":material-table: Tabelle"

    **Wofür:** Vergleiche, Bewertungen, alles mit gleichen Merkmalen über mehrere Objekte.

    ```title="Prompt"
    Vergleiche die drei Vertriebskanäle in einer Markdown-Tabelle
    mit den Spalten: Kanal | Reichweite | Kosten | Aufwand.
    Eine Zeile pro Kanal, keine Erklärung davor oder danach.
    ```

    ✅ Sehr lesbar für Menschen · ❌ mühsam maschinell auszuwerten, wenn Zellen Kommas enthalten.

=== ":material-code-json: JSON"

    **Wofür:** alles, was ein Programm weiterverarbeiten soll.

    ```title="Prompt"
    Antworte ausschließlich mit gültigem JSON, ohne Markdown-Codeblock
    und ohne Erklärung. Schema:

    {
      "idee": "<string>",
      "risiken": [{"titel": "<string>", "schwere": "hoch|mittel|niedrig"}],
      "bewertung": <zahl 1-10>
    }
    ```

    ✅ Direkt in Python einlesbar · ❌ kleine Modelle produzieren gern *fast* gültiges JSON (siehe Labor unten).

=== ":material-language-markdown: Markdown"

    **Wofür:** Dokumentation, Berichte, Website-Inhalte – Text mit Gliederung.

    ```title="Prompt"
    Gib das Ergebnis als Markdown aus:
    - eine H2-Überschrift pro Abschnitt
    - darunter maximal 3 Stichpunkte
    - Fachbegriffe **fett**
    Keine Einleitung.
    ```

    ✅ Menschenlesbar *und* strukturiert · ❌ kein festes Schema erzwingbar.

=== ":material-file-document-outline: Vorlage"

    **Wofür:** wiederkehrende Dokumente mit fester Gliederung.

    ```title="Prompt"
    Fülle exakt diese Vorlage aus. Ersetze nur die <Platzhalter>,
    ändere nichts an der Struktur:

    PRODUKT: <name>
    ZIELGRUPPE: <eine Zeile>
    NUTZEN: <maximal 20 Wörter>
    PREIS: <zahl> EUR
    RISIKO: <ein Satz>
    ```

    ✅ Funktioniert auch bei sehr kleinen Modellen ⭐ · ❌ unflexibel bei variabler Feldanzahl.

???+ tip "Die Format-Rangfolge für kleine Modelle"

    Je kleiner das Modell, desto einfacher muss das Format sein:

    **Vorlage** (am robustesten) → **Markdown** → **Tabelle** → **JSON** (am fehleranfälligsten)

    Wenn `qwen2.5:0.5b` an deinem JSON scheitert: nimm eine `SCHLÜSSEL: Wert`-Vorlage und wandle sie in Python selbst in JSON um. Das ist fast immer schneller als drei weitere Prompt-Iterationen.

---

## Der JSON-Modus

Ollama kann das Modell technisch dazu **zwingen**, gültiges JSON zu erzeugen – mit der Option `--format json`:

```bash
ollama run --format json qwen2.5:0.5b "Nenne 3 Risiken für einen Bio-Lieferdienst. Antworte als JSON mit dem Schlüssel 'risiken', jeder Eintrag mit 'titel' und 'schwere' (hoch, mittel oder niedrig)."
```

```title="Beispielausgabe"
{
  "risiken": [
    {"titel": "Kühlkette bei der Zustellung", "schwere": "hoch"},
    {"titel": "Verderb bei schwankender Nachfrage", "schwere": "mittel"},
    {"titel": "Preisdruck durch Supermärkte", "schwere": "hoch"}
  ]
}
```

Diese Option erzwingt syntaktisch gültiges JSON **auf Ebene der Token-Auswahl**: Tokens, die das JSON ungültig machen würden, werden gar nicht erst zur Auswahl zugelassen. Das Modell *kann* damit kein kaputtes JSON mehr erzeugen.

!!! warning "Gültig ≠ richtig"

    `--format json` garantiert nur die **Syntax**, nicht das **Schema**. Du bekommst garantiert gültiges JSON – aber vielleicht so:

    ```title="Ebenfalls gültiges JSON – aber unbrauchbar"
    {
      "risks": [
        {"name": "Kühlkette", "severity": "sehr hoch"}
      ]
    }
    ```

    Englische Schlüssel, andere Feldnamen, ein Wert außerhalb der drei erlaubten. Syntaktisch einwandfrei, für die Weiterverarbeitung wertlos.

    👉 Beschreibe das Schema trotzdem **im Prompt** – und prüfe die Ausgabe.

---

## 🔬 Ollama-Labor

!!! example "Übung 1: Wie oft klappt JSON ohne Zwang?"

    Führe **denselben** Prompt fünfmal aus – einmal ohne, einmal mit `--format json`.

    **Ohne Zwang:**

    ```bash
    ollama run qwen2.5:0.5b "Nenne 2 Risiken für einen Bio-Lieferdienst. Antworte NUR mit JSON, Schlüssel 'risiken', je Eintrag 'titel' und 'schwere'."
    ```

    ````title="Beispielausgabe — Versuch 1 ❌"
    Gerne! Hier ist die Antwort im JSON-Format:

    ```json
    {"risiken": [{"titel": "Logistik", "schwere": "hoch"}]}
    ```

    Ich hoffe, das hilft weiter!
    ````

    ```title="Beispielausgabe — Versuch 2 ❌"
    {"risiken": [{"titel": "Kühlkette", "schwere": "hoch"},]}
    ```

    Versuch 1 ist von Text umrahmt, Versuch 2 hat ein Komma zu viel vor der schließenden Klammer. Beides ist **kein** gültiges JSON – ein Programm bricht hier ab.

    **Mit Zwang:**

    ```bash
    ollama run --format json qwen2.5:0.5b "Nenne 2 Risiken für einen Bio-Lieferdienst. Antworte NUR mit JSON, Schlüssel 'risiken', je Eintrag 'titel' und 'schwere'."
    ```

    ```title="Beispielausgabe — jedes Mal gültig ✅"
    {"risiken": [{"titel": "Kühlkette", "schwere": "hoch"}, {"titel": "Nachfrageschwankungen", "schwere": "mittel"}]}
    ```

    **Deine Aufgabe:** Fünf Durchläufe pro Variante. Notiere die Trefferquote (z. B. „ohne: 2/5, mit: 5/5"). Prüfe zusätzlich bei den gültigen Ausgaben: Stimmen auch die **Schlüsselnamen** und sind alle `schwere`-Werte aus der erlaubten Menge?

!!! example "Übung 2: Vorlage schlägt JSON"

    Das simpelste Format ist bei kleinen Modellen das zuverlässigste.

    ```title="Terminal"
    >>> """
    ... Fülle exakt diese Vorlage für einen Bio-Lieferdienst in Innsbruck aus.
    ... Ersetze nur die <Platzhalter>. Keine Erklärung.
    ...
    ... PRODUKT: <name>
    ... ZIELGRUPPE: <eine Zeile>
    ... NUTZEN: <maximal 15 Wörter>
    ... PREIS: <zahl> EUR
    ... RISIKO: <ein Satz>
    ... """
    ```

    ```title="Beispielausgabe"
    PRODUKT: Inntal Frischbox
    ZIELGRUPPE: Berufstätige Familien in Innsbruck und Umgebung
    NUTZEN: Regionale Bio-Ware wöchentlich bis an die Wohnungstür geliefert
    PREIS: 29 EUR
    RISIKO: Bei geringer Bestellmenge sind die Lieferkosten pro Box zu hoch.
    ```

    **Deine Aufgabe:** Führe diesen Prompt fünfmal aus und vergleiche die Trefferquote mit der JSON-Variante aus Übung 1. Probiere ihn danach auch auf `gemma3:270m` – dem winzigsten Modell. Was funktioniert dort noch, JSON oder Vorlage?

!!! example "Übung 3: Der Reparatur-Prompt"

    Wenn das Format nicht stimmt, musst du nicht von vorn anfangen. Sag im **selben Chat**, was falsch war:

    ```title="Terminal"
    >>> Deine Antwort enthielt einleitenden Text und einen Codeblock.
    ... Gib das JSON erneut aus – ohne jeden Text davor oder danach.
    ```

    ```title="Beispielausgabe"
    {"risiken": [{"titel": "Kühlkette", "schwere": "hoch"}]}
    ```

    Das ist **die** Kerntechnik für strukturierte Ausgaben: erzeugen → prüfen → mit der konkreten Fehlerbeschreibung nachbessern. Genau so arbeiten auch produktive KI-Systeme, nur automatisiert.

??? code "🐍 Optional (Python): JSON einlesen und Schema prüfen"

    Der Punkt von JSON ist die Weiterverarbeitung. So sieht sie aus:

    ```python title="json_pruefen.py"
    import json
    import ollama

    ERLAUBTE_SCHWERE = {"hoch", "mittel", "niedrig"}

    antwort = ollama.chat(
        model="qwen2.5:0.5b",
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

    Beachte den dritten Eintrag: Das JSON ist **syntaktisch gültig**, aber `"sehr hoch"` steht nicht in der erlaubten Menge. Genau deshalb reicht `format="json"` allein nicht – die Schema-Prüfung musst du selbst machen.

---

???+ question "Selbsttest"

    1. Welches Format ist bei sehr kleinen Modellen am robustesten – und warum?
    2. Was garantiert `format="json"` in Ollama, und was nicht?
    3. Nenne zwei Gründe, warum ein vorgegebenes Format die inhaltliche Qualität verbessert.

    ??? success "Lösungsskizze"

        1. Die **Vorlage** (`SCHLÜSSEL: Wert`). Sie verlangt keine geschachtelte Struktur, keine Klammern und keine korrekte Kommasetzung – das Modell muss nur Zeilen fortsetzen.
        2. Garantiert ist die **Syntax** (gültiges JSON). Nicht garantiert ist das **Schema**: Schlüsselnamen, Datentypen und erlaubte Werte musst du selbst prüfen.
        3. (a) Es erzwingt **Vollständigkeit** – leere Felder fallen auf. (b) Es macht Antworten **vergleichbar**, weil dieselben Kategorien immer an derselben Stelle stehen.

---

!!! example "Lab"

    **Business Model Canvas in verschiedenen Formaten erzeugen**

    Lass dir dein Business Model Canvas in mehreren Formaten ausgeben – als Tabelle, als JSON und als Markdown. Bewerte, welches Format sich für welchen Zweck eignet.

    **Konkrete Schritte:**

    1. Erzeuge dein Canvas in allen vier Formaten (Tabelle, JSON, Markdown, Vorlage) mit `qwen2.5:0.5b`.
    2. Führe jedes Format **fünfmal** aus und notiere die Fehlversuche als Bruch.
    3. Wiederhole den zuverlässigsten und den unzuverlässigsten Prompt auf `gemma3:270m`. Verschiebt sich die Rangfolge?
    4. Notiere für jedes Format eine Empfehlung: *Wofür würde ich es einsetzen?*
    5. Trage den zuverlässigsten Prompt in deine `prompts.md` unter `## 03 Canvas strukturiert` ein.

---

## Quellen

!!! info "Literatur"

    - **Ollama (2025):** *Structured outputs.* [https://ollama.com/blog/structured-outputs](https://ollama.com/blog/structured-outputs)
    - **Osterwalder, A. & Pigneur, Y. (2010):** *Business Model Generation.* Wiley.
    - **OpenAI (2025):** *Structured Outputs.* [https://platform.openai.com/docs/guides/structured-outputs](https://platform.openai.com/docs/guides/structured-outputs)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
