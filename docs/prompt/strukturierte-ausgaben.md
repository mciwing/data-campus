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

Ollama kann das Modell technisch dazu **zwingen**, gültiges JSON zu erzeugen – über den Parameter `format`:

```python title="json_modus.py" hl_lines="12"
import ollama
import json

antwort = ollama.chat(
    model="qwen2.5:0.5b",
    messages=[{
        "role": "user",
        "content": ("Nenne 3 Risiken für einen Bio-Lieferdienst. "
                    'Antworte als JSON: {"risiken": [{"titel": "...", '
                    '"schwere": "hoch|mittel|niedrig"}]}'),
    }],
    format="json",   # <-- der entscheidende Parameter
    options={"temperature": 0.1},
)

daten = json.loads(antwort["message"]["content"])
for r in daten["risiken"]:
    print(f"[{r['schwere']:>7}] {r['titel']}")
```

`format="json"` erzwingt syntaktisch gültiges JSON **auf Ebene der Token-Auswahl**: Tokens, die das JSON ungültig machen würden, werden gar nicht erst zur Auswahl zugelassen. Das Modell *kann* damit kein kaputtes JSON mehr erzeugen.

!!! warning "Gültig ≠ richtig"

    `format="json"` garantiert nur die **Syntax**, nicht das **Schema**. Du bekommst garantiert gültiges JSON – aber vielleicht mit dem Schlüssel `"risks"` statt `"risiken"`, oder mit `"schwere": "sehr hoch"` statt einem der drei erlaubten Werte.

    👉 Beschreibe das Schema trotzdem **im Prompt** und **validiere** in Python.

---

## 🔬 Ollama-Labor

!!! example "Übung 1: Wie oft klappt JSON ohne Zwang?"

    Miss den Unterschied zwischen „bitte JSON" und erzwungenem JSON.

    ```python title="json_test.py"
    import json
    import ollama

    PROMPT = ('Nenne 2 Risiken für einen Bio-Lieferdienst. Antworte NUR mit JSON '
              'im Format: {"risiken": [{"titel": "...", "schwere": "hoch"}]}')

    def versuche(erzwingen, runden=5):
        erfolge = 0
        for i in range(runden):
            kwargs = {"format": "json"} if erzwingen else {}
            antwort = ollama.chat(
                model="qwen2.5:0.5b",
                messages=[{"role": "user", "content": PROMPT}],
                options={"temperature": 0.3, "seed": i},
                **kwargs,
            )["message"]["content"]

            try:
                json.loads(antwort)
                erfolge += 1
                print(f"  {i + 1}. ✅ gültig")
            except json.JSONDecodeError:
                print(f"  {i + 1}. ❌ {antwort[:60]!r}...")
        return erfolge

    print("OHNE format='json':")
    a = versuche(erzwingen=False)
    print("\nMIT format='json':")
    b = versuche(erzwingen=True)
    print(f"\nErgebnis: {a}/5 vs. {b}/5")
    ```

    **Typisches Ergebnis:** Ohne Zwang scheitert das kleine Modell oft an Kleinigkeiten – ein einleitender Satz, ein ```-Codeblock drumherum, ein Komma zu viel. Mit `format="json"` sind es 5/5.

!!! example "Übung 2: Vorlage schlägt JSON"

    Zeige, dass das simpelste Format bei kleinen Modellen am zuverlässigsten ist.

    ```python title="vorlage.py"
    from llm import frage

    prompt = """Fülle exakt diese Vorlage für einen Bio-Lieferdienst in
    Innsbruck aus. Ersetze nur die <Platzhalter>. Keine Erklärung.

    PRODUKT: <name>
    ZIELGRUPPE: <eine Zeile>
    NUTZEN: <maximal 15 Wörter>
    PREIS: <zahl> EUR
    RISIKO: <ein Satz>"""

    antwort = frage(prompt)
    print(antwort)

    # Vorlage in ein Dictionary umwandeln
    daten = {}
    for zeile in antwort.splitlines():
        if ":" in zeile:
            schluessel, wert = zeile.split(":", 1)
            daten[schluessel.strip()] = wert.strip()

    print("\nAls Dictionary:")
    for k, v in daten.items():
        print(f"  {k:<12} = {v}")
    ```

    **Erkenntnis:** Fünf Zeilen Python ersetzen den ganzen JSON-Kampf – und funktionieren selbst mit `gemma3:270m`.

??? question "Übung 3: Schema-Validierung (Python)"

    `format="json"` garantiert Syntax, nicht Inhalt. Schreibe den Validator dazu.

    ```python title="validator.py"
    ERLAUBTE_SCHWERE = {"hoch", "mittel", "niedrig"}

    def validiere(daten):
        """Gibt eine Liste von Fehlermeldungen zurück (leer = alles ok)."""
        fehler = []
        # TODO 1: Existiert der Schlüssel "risiken" und ist es eine Liste?
        # TODO 2: Hat jeder Eintrag die Schlüssel "titel" und "schwere"?
        # TODO 3: Ist "schwere" einer der erlaubten Werte?
        return fehler

    print(validiere({"risiken": [{"titel": "Kosten", "schwere": "sehr hoch"}]}))
    # erwartet: Hinweis auf ungültigen Wert "sehr hoch"
    ```

    ??? success "Lösungsvorschlag"

        ```python title="validator.py"
        ERLAUBTE_SCHWERE = {"hoch", "mittel", "niedrig"}

        def validiere(daten):
            fehler = []

            if "risiken" not in daten:
                return ["Schlüssel 'risiken' fehlt"]
            if not isinstance(daten["risiken"], list):
                return ["'risiken' ist keine Liste"]

            for i, eintrag in enumerate(daten["risiken"], start=1):
                for pflicht in ("titel", "schwere"):
                    if pflicht not in eintrag:
                        fehler.append(f"Eintrag {i}: '{pflicht}' fehlt")

                schwere = str(eintrag.get("schwere", "")).lower()
                if schwere and schwere not in ERLAUBTE_SCHWERE:
                    fehler.append(
                        f"Eintrag {i}: '{schwere}' ist kein erlaubter Wert "
                        f"({', '.join(sorted(ERLAUBTE_SCHWERE))})"
                    )

            return fehler
        ```

        **Der professionelle Ablauf:** erzeugen → validieren → bei Fehler **mit der Fehlermeldung** neu prompten. Genau so arbeiten produktive KI-Systeme:

        ```python
        fehler = validiere(daten)
        if fehler:
            antwort = frage(f"{PROMPT}\n\nDein letzter Versuch hatte diese "
                            f"Fehler: {'; '.join(fehler)}. Korrigiere sie.")
        ```

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
    2. Führe jedes Format **fünfmal** mit unterschiedlichem `seed` aus und zähle die Fehlversuche.
    3. Schreibe ein kleines Skript, das die JSON-Variante einliest und die neun Felder als Liste ausgibt.
    4. Notiere für jedes Format eine Empfehlung: *Wofür würde ich es einsetzen?*
    5. Speichere den zuverlässigsten Prompt als `prompts/03_canvas_json.md`.

---

## Quellen

!!! info "Literatur"

    - **Ollama (2025):** *Structured outputs.* [https://ollama.com/blog/structured-outputs](https://ollama.com/blog/structured-outputs)
    - **Osterwalder, A. & Pigneur, Y. (2010):** *Business Model Generation.* Wiley.
    - **OpenAI (2025):** *Structured Outputs.* [https://platform.openai.com/docs/guides/structured-outputs](https://platform.openai.com/docs/guides/structured-outputs)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
