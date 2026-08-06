# 9. Multimodales Prompting

Moderne KI-Modelle verarbeiten nicht nur Text, sondern auch **Bilder, Dokumente und Diagramme**. Multimodales Prompting erweitert die Möglichkeiten erheblich – von der Analyse einer Website bis zur Auswertung einer Präsentation.

---

## Was „multimodal" bedeutet

???+ defi "Modalität"

    Eine **Modalität** ist eine Art von Eingabe oder Ausgabe: Text, Bild, Audio, Video. Ein **multimodales Modell** kann mehrere davon gleichzeitig verarbeiten.

    Technisch ändert sich weniger, als man denkt: Ein Bild wird in **Bild-Tokens** zerlegt und wie Text-Tokens in denselben Vektorraum eingebettet. Ab da läuft alles wie in [Station 2](funktionsweise-llms.md#station-2-word-embeddings-wortern-bedeutung-geben) beschrieben – das Modell „sieht" nicht, es rechnet.

```mermaid
flowchart LR
    T[📝 Text]:::teal --> V[gemeinsamer<br/>Vektorraum]:::peach
    B[🖼️ Bild]:::teal --> V
    D[📄 PDF]:::teal --> V
    V --> M[Transformer]:::teal
    M --> A[Antwort]:::peach

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;
```

!!! warning "Ein Bild kostet viele Tokens"

    Ein einzelnes Bild verbraucht je nach Auflösung schnell **1.000 bis 2.000 Tokens** – so viel wie zwei Seiten Text. Bei kleinen Modellen ist das [Kontextfenster](halluzinationen-kontextfenster.md) damit sofort halb voll.

    👉 Ein Bild pro Prompt. Und lieber ein Ausschnitt als ein Screenshot der ganzen Seite.

---

## Die Modalitäten in der Praxis

=== ":material-image: Bilder"

    **Typische Aufgaben:** Produktfotos beschreiben, Logos bewerten, Screenshots analysieren, Handschrift transkribieren.

    ```title="Prompt"
    Beschreibe dieses Produktfoto für einen Online-Shop.
    Nenne: (1) das Produkt, (2) drei sichtbare Eigenschaften,
    (3) die vermutliche Zielgruppe.
    Beschreibe nur, was tatsächlich zu sehen ist.
    ```

    Der letzte Satz ist entscheidend – ohne ihn ergänzt das Modell gern Details, die gar nicht im Bild sind.

=== ":material-file-pdf-box: PDFs"

    **Typische Aufgaben:** Berichte zusammenfassen, Verträge nach Klauseln durchsuchen, Studien auswerten.

    ```title="Prompt"
    Fasse dieses PDF zusammen. Struktur:
    - Kernaussage (1 Satz)
    - 3 wichtigste Zahlen mit Seitenangabe
    - 2 offene Fragen

    Zitiere für jede Zahl die Seite. Findest du eine Angabe nicht,
    schreibe [NICHT IM DOKUMENT].
    ```

    **Achtung:** Manche Werkzeuge extrahieren nur den Text, andere „sehen" die Seite als Bild. Bei Tabellen und Diagrammen macht das einen großen Unterschied.

=== ":material-chart-box-outline: Diagramme"

    **Typische Aufgaben:** Trends aus Charts ablesen, Zahlen aus Grafiken extrahieren.

    ```title="Prompt"
    Lies die Werte aus diesem Balkendiagramm ab.
    Gib sie als Tabelle aus: Kategorie | Wert | abgelesen/geschätzt.
    Markiere jeden Wert, den du nicht eindeutig ablesen kannst,
    als "geschätzt".
    ```

    !!! danger "Zahlen aus Diagrammen sind unzuverlässig"

        Das Ablesen exakter Werte gehört zu den fehleranfälligsten Aufgaben überhaupt. Nutze es für **Trends** („steigt seit 2021"), nicht für **Zahlen** in einer Präsentation.

=== ":material-presentation: Präsentationen"

    **Typische Aufgaben:** Pitchdecks analysieren, Foliensätze zusammenfassen, Argumentationslinien prüfen.

    ```title="Prompt"
    Du bist Investorin und siehst dieses Pitchdeck zum ersten Mal.

    1. Welche Kernaussage nimmst du mit?
    2. Welche Information fehlt dir, um zu entscheiden?
    3. Welche Folie würdest du streichen?
    ```

    Kombiniert Multimodalität mit [rollenbasiertem Prompting](rollen.md) – besonders wirkungsvoll.

---

## Agenten :material-paperclip:

Wenn ein Modell nicht nur *antwortet*, sondern **Werkzeuge benutzt** – eine Website aufrufen, ein PDF öffnen, Code ausführen, eine Datei schreiben – spricht man von einem **Agenten**.

???+ defi "Agent"

    Ein System, das ein LLM in einer Schleife betreibt: *Ziel verstehen → Werkzeug wählen → ausführen → Ergebnis bewerten → nächster Schritt*, bis das Ziel erreicht ist.

    Der Unterschied zu [Prompt Chaining](chaining.md): Bei einer Kette legst **du** die Schritte vorher fest. Ein Agent entscheidet **selbst**, welcher Schritt als Nächstes kommt.

<div class="grid cards" markdown>

- :material-web: **Web-Recherche**

    ---

    Das Modell sucht selbstständig, öffnet Seiten und fasst zusammen – mit Quellenangabe.

- :material-file-search-outline: **Dokumenten-Analyse**

    ---

    Mehrere PDFs werden geöffnet, verglichen und in einer Tabelle gegenübergestellt.

- :material-code-braces: **Code-Ausführung**

    ---

    Berechnungen werden nicht *geschätzt*, sondern tatsächlich gerechnet – ein direktes Gegenmittel zur [Rechenschwäche](staerken-grenzen.md) von LLMs.

</div>

!!! tip "Mehr Fähigkeit heißt mehr Prüfpflicht"

    Ein Agent, der zehn Schritte selbst entscheidet, kann auch zehnmal falsch abbiegen – und begründet das Ergebnis am Ende überzeugend. Prüfe bei Agenten immer den **Weg**, nicht nur das Ergebnis.

---

## 🔬 Ollama-Labor

Für Bilder brauchst du ein **Vision-Modell**. Unsere Textmodelle können das nicht.

!!! info "Zusätzliches Modell nötig"

    ```bash
    ollama pull moondream
    ```

    **~1,7 GB** · Das kleinste brauchbare Vision-Modell. Es versteht **nur Englisch** – wir prompten hier also auf Englisch und lassen ins Deutsche übersetzen.

    Kein Speicherplatz? Dann überspringe Übung 1 und 2 und bearbeite stattdessen die **Alternative** weiter unten mit einem Browser-Modell.

!!! example "Übung 1: Was sieht das Modell wirklich?"

    Nimm ein beliebiges Foto (z. B. `produkt.jpg`) und lass es beschreiben.

    ```python title="bild.py"
    import ollama

    def sieh(bildpfad, prompt, model="moondream"):
        antwort = ollama.chat(
            model=model,
            messages=[{"role": "user", "content": prompt, "images": [bildpfad]}],
            options={"temperature": 0.1},
        )
        return antwort["message"]["content"]

    prompts = {
        "offen":     "Describe this image.",
        "gelenkt":   ("Describe only what is literally visible: objects, colors, "
                      "text. Do not guess or interpret."),
        "strukturiert": ("List exactly 3 visible objects, one per line, "
                         "format: OBJECT: <name>"),
    }

    for name, p in prompts.items():
        print(f"\n--- {name} ---\n{sieh('produkt.jpg', p)}")
    ```

    **Deine Aufgabe:** Wo erfindet das Modell Details, die gar nicht im Bild sind? Welcher Prompt reduziert das Erfinden am stärksten?

!!! example "Übung 2: Bild + Übersetzung als Kette"

    `moondream` kann kein Deutsch – aber `qwen2.5:0.5b` schon. Kombiniere beide zu einer [Kette](chaining.md).

    ```python title="bild_kette.py"
    from llm import frage
    from bild import sieh

    # Schritt 1: Vision-Modell beschreibt (englisch)
    beschreibung = sieh("produkt.jpg",
                        "Describe this product photo factually in 3 sentences.")
    print(f"EN: {beschreibung}\n")

    # Schritt 2: Textmodell macht daraus deutschen Marketing-Text
    text = frage(f"""Hier ist eine englische Bildbeschreibung:
    {beschreibung}

    Schreibe daraus eine deutsche Produktbeschreibung für einen Online-Shop.
    Maximal 40 Wörter, sachlich, keine Superlative.""")
    print(f"DE: {text}")
    ```

    **Das Prinzip ist wichtiger als das Ergebnis:** Zwei spezialisierte kleine Modelle in Reihe schlagen oft ein einzelnes mittleres Modell.

??? question "Übung 3: Text aus einer Website analysieren (Python, ohne Vision)"

    Funktioniert ohne Vision-Modell – wir holen den Text einer Website und lassen ihn auswerten.

    ```python title="webanalyse.py"
    # pip install requests beautifulsoup4
    import requests
    from bs4 import BeautifulSoup
    from llm import frage

    def hole_text(url, max_zeichen=3000):
        """Lädt eine Seite und gibt den sichtbaren Text zurück."""
        # TODO 1: Seite mit requests.get() laden
        # TODO 2: mit BeautifulSoup parsen, script/style entfernen
        # TODO 3: Text extrahieren und auf max_zeichen kürzen
        ...

    text = hole_text("https://example.com")
    print(frage(f"""Hier ist der Text einer Unternehmenswebsite:

    {text}

    Leite daraus ab:
    WERTANGEBOT: <ein Satz>
    ZIELGRUPPE: <ein Satz>
    ERLÖSMODELL: <ein Satz, oder [UNKLAR]>

    Nutze ausschließlich Informationen aus dem Text."""))
    ```

    ??? success "Lösungsvorschlag"

        ```python title="webanalyse.py"
        import requests
        from bs4 import BeautifulSoup

        def hole_text(url, max_zeichen=3000):
            antwort = requests.get(url, timeout=10,
                                   headers={"User-Agent": "Mozilla/5.0"})
            antwort.raise_for_status()

            suppe = BeautifulSoup(antwort.text, "html.parser")
            for tag in suppe(["script", "style", "nav", "footer"]):
                tag.decompose()

            text = " ".join(suppe.get_text(separator=" ").split())
            return text[:max_zeichen]
        ```

        **Warum die Kürzung auf 3.000 Zeichen?** Das Kontextfenster von `qwen2.5:0.5b` ist klein. Schickst du eine ganze Website hinein, verliert das Modell den Anfang – und damit deine Anweisung. Die Begrenzung ist keine Bequemlichkeit, sondern Notwendigkeit.

        **Und der letzte Satz im Prompt** („Nutze ausschließlich Informationen aus dem Text") ist dein wichtigster Schutz gegen Halluzinationen. Ohne ihn ergänzt das Modell fröhlich, was auf so einer Website *üblicherweise* steht.

??? tip "Alternative ohne lokales Vision-Modell"

    Nutze ein Browser-Modell (ChatGPT, Claude, Gemini – jeweils kostenlose Version) für die Bild-Aufgaben:

    1. Lade den Screenshot einer Unternehmenswebsite hoch.
    2. Prompte: *„Leite aus dieser Seite das Business Model Canvas ab. Markiere jedes Feld, das du nur vermutest, mit [ANNAHME]."*
    3. Zähle anschließend, wie viele Felder mit `[ANNAHME]` markiert sind – das ist dein Unsicherheitsmaß.

    **Datenschutz-Hinweis:** Alles, was du hochlädst, verlässt dein Gerät. Keine personenbezogenen Daten, keine internen Unterlagen. Genau dieser Punkt ist einer der Gründe, warum wir im Kurs lokal arbeiten.

---

???+ question "Selbsttest"

    1. Was passiert technisch mit einem Bild, bevor das Modell es verarbeitet?
    2. Warum sind aus Diagrammen abgelesene Zahlen unzuverlässig?
    3. Worin unterscheidet sich ein Agent von einer Prompt-Kette?

    ??? success "Lösungsskizze"

        1. Es wird in **Bild-Tokens** zerlegt und in denselben Vektorraum eingebettet wie Text. Danach ist es für den Transformer nur noch eine weitere Token-Folge – es wird gerechnet, nicht „gesehen".
        2. Weil das Modell keine Werte misst, sondern **plausible Zahlen vorhersagt**. Für Trends reicht das; für exakte Werte nicht.
        3. Bei einer Kette legst du die Schritte **vorab** fest. Ein Agent entscheidet **selbst**, welches Werkzeug er als Nächstes einsetzt – mächtiger, aber schwerer zu kontrollieren.

---

!!! example "Lab"

    **Analyse existierender Geschäftsmodelle**

    Analysiere bestehende Geschäftsmodelle anhand von Webseiten oder Präsentationen. Lass dir Stärken, Schwächen und Erfolgsfaktoren herausarbeiten und vergleiche sie mit deiner eigenen Idee.

    **Konkrete Schritte:**

    1. Wähle **zwei** existierende Unternehmen aus deiner Branche.
    2. Extrahiere ihre Website-Texte mit `hole_text()` (Übung 3).
    3. Lass für beide ein Business Model Canvas ableiten – mit `[ANNAHME]`-Markierung für alles Erschlossene.
    4. Stelle beide Canvas und dein eigenes in einer **Vergleichstabelle** gegenüber.
    5. Beantworte: Welches Feld füllen die etablierten Anbieter besser als du – und warum?
    6. Speichere den Analyse-Prompt als `prompts/07_wettbewerb.md`.

---

## Quellen

!!! info "Literatur"

    - **Ollama (2025):** *Vision models.* [https://ollama.com/search?c=vision](https://ollama.com/search?c=vision)
    - **Radford, A. et al. (2021):** *Learning Transferable Visual Models From Natural Language Supervision (CLIP).* arXiv:2103.00020. [https://arxiv.org/abs/2103.00020](https://arxiv.org/abs/2103.00020)
    - **Anthropic (2025):** *Building effective agents.* [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
