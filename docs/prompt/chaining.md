# Prompt Chaining

Komplexe Aufgaben lassen sich selten in einem einzigen Prompt lösen. Beim **Prompt Chaining** wird eine Aufgabe in **mehrere aufeinander aufbauende Schritte** zerlegt – das Ergebnis des einen Prompts wird zur Eingabe des nächsten.

Das ist dieselbe Idee wie beim Programmieren: Statt einer Funktion mit 300 Zeilen schreibst du fünf kleine, die du einzeln testen kannst.

---

## Warum ein Prompt oft nicht reicht

!!! quote "Merksatz"

    Ein LLM verteilt seine „Aufmerksamkeit" auf **alles**, was im Prompt steht. Fünf Aufgaben in einem Prompt heißen: jede bekommt ein Fünftel.

Bei einem großen Modell fällt das kaum auf. Bei `gemma3:1b` sofort:

=== "❌ Alles auf einmal"

    ```title="monolith.txt"
    Analysiere meine Geschäftsidee (Bio-Lieferdienst in Innsbruck),
    erstelle eine Marktanalyse, mache eine SWOT-Analyse und leite daraus
    drei konkrete Verbesserungsvorschläge ab.
    ```

    **Ergebnis:** Alle vier Teile werden angerissen, keiner ausgeführt. Meist bricht das Modell nach der Marktanalyse ab oder wiederholt sich.

=== "✅ Als Kette"

    ```title="kette.txt"
    Schritt 1 → Idee präzise beschreiben
    Schritt 2 → Marktanalyse (nutzt Ergebnis 1)
    Schritt 3 → SWOT (nutzt Ergebnis 1 + 2)
    Schritt 4 → Verbesserungen (nutzt Ergebnis 3)
    ```

    **Ergebnis:** Jeder Schritt bekommt die volle Aufmerksamkeit – und du kannst nach jedem Schritt korrigieren.

---

## Der Workflow

```mermaid
flowchart LR
    I[💡 Idee]:::peach --> S1(1 · Beschreibung<br/>präzisieren):::teal
    S1 --> S2(2 · Marktanalyse):::teal
    S2 --> S3(3 · SWOT):::teal
    S3 --> S4(4 · Verbesserungen):::teal
    S4 --> E[📋 Ergebnis]:::peach

    S1 -.-> S3
    S2 -.-> S4

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;
```

Die gestrichelten Linien zeigen: Manche Schritte brauchen **mehrere** Vorergebnisse.

---

## Vier Vorteile einer Kette

???+ adv "Warum sich der Mehraufwand lohnt"

    1. **Kontrollpunkte** – Nach jedem Schritt kannst du prüfen und korrigieren, statt am Ende alles zu verwerfen.[^aichains]
    2. **Fehler pflanzen sich nicht fort** – Eine falsche Marktanalyse fällt sofort auf, nicht erst im Endergebnis.
    3. **Wiederverwendbarkeit** – Der SWOT-Schritt funktioniert auch für jede andere Idee.
    4. **Kleinere Kontextfenster** – Jeder Prompt braucht nur die Ergebnisse, die er wirklich benötigt ([Kontextfenster](halluzinationen-kontextfenster.md)).

???+ defi "Verwandt, aber nicht dasselbe: Chain-of-Thought"

    Neben dem *Chaining* über mehrere Prompts gibt es **Chain-of-Thought**[^cot]: Das Modell wird gebeten, seine Zwischenschritte **innerhalb einer Antwort** auszuformulieren – *„Denke Schritt für Schritt."*

    | | Prompt Chaining | Chain-of-Thought |
    |---|---|---|
    | Wo? | mehrere Prompts | ein einziger Prompt |
    | Kontrolle | du prüfst nach jedem Schritt | keine Zwischenkontrolle |
    | Steuerung | du legst die Schritte fest | das Modell entscheidet selbst |

    !!! warning "Warum das in unserem Labor kaum wirkt"

        Wei et al. zeigen, dass Chain-of-Thought eine **emergente Fähigkeit** ist: Sie tritt erst bei sehr großen Modellen (ab etwa 100 Mrd. Parametern) zuverlässig auf. Bei kleineren Modellen erzeugt „Denke Schritt für Schritt" oft nur *längere*, aber nicht *bessere* Antworten.

        Bei `gemma3:1b` – rund 100-mal kleiner – bringt der Zauberspruch also wenig. Das explizite Zerlegen in mehrere Prompts dagegen sehr viel. Genau deshalb ist Chaining unser Werkzeug der Wahl.

???+ disadv "Und die Kosten"

    - **Mehr Aufrufe** = mehr Zeit und (bei kommerziellen Modellen) mehr Geld.
    - **Fehlerfortpflanzung bleibt möglich:** Wenn Schritt 1 halluziniert, baut alles Weitere darauf auf. Deshalb: **Zwischenergebnisse prüfen.**
    - **Mehr Code** als ein einzelner Prompt.

---

## Ketten sauber bauen

???+ process "Die Regeln"

    1. **Ein klares Ergebnis pro Schritt.** Wenn du den Schritt nicht in einem Satz beschreiben kannst, ist er zu groß.
    2. **Strukturierte Zwischenergebnisse.** Jeder Schritt liefert ein [festes Format](strukturierte-ausgaben.md) – dann kann der nächste zuverlässig darauf zugreifen.
    3. **Nur weitergeben, was gebraucht wird.** Nicht die komplette Historie anhängen, sondern gezielt die relevanten Teile.
    4. **Nach jedem Schritt validieren.** Mindestens: Ist die Antwort nicht leer und hat sie das erwartete Format?
    5. **Zwischenergebnisse speichern.** Dann musst du bei einem Fehler in Schritt 4 nicht wieder bei Schritt 1 anfangen.[^schulhoff]

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren – hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Der Monolith – bewusst scheitern lassen"

    Verlange in **einem einzigen** Prompt alles auf einmal für deine Idee: (1) Marktanalyse, (2) SWOT-Analyse, (3) drei Verbesserungsvorschläge.

    **Prüfe:** Wie viele der drei Teile kommen wirklich brauchbar an? Wo bricht der Text ab?

!!! lab "Übung 2: Dieselbe Aufgabe als Kette"

    Jetzt in drei Schritten, jeder mit festem Format und `/clear` dazwischen:

    | Schritt | Ergebnis | Format |
    |---|---|---|
    | 1 | Zielmarkt | 3 Stichpunkte: Zielgruppe, Marktgröße, Wettbewerber |
    | 2 | SWOT | genau 2 Punkte je Kategorie |
    | 3 | Verbesserungen | 3 Vorschläge mit *Adressiert* und *Erster Schritt* |

    Das Ergebnis jedes Schritts kopierst du in den nächsten Prompt. Speichere die Zwischenstände als `kette_1_markt.md`, `kette_2_swot.md`, …

    **Vergleiche** das Endergebnis mit dem Monolith aus Übung 1.

!!! lab "Übung 3: Der Kontrollpunkt"

    Führe Schritt 2 **fünfmal** aus und zähle, wie oft alle vier SWOT-Kategorien vorkommen.

    Wenn eine fehlt: nicht neu starten, sondern gezielt nachfassen – *„In deiner Antwort fehlen die CHANCEN. Gib die vollständige SWOT-Analyse erneut aus."*

    **Optional:** dasselbe auf `gemma3:270m`. Dort wirst du den Kontrollpunkt fast immer brauchen.

!!! lab "Übung 4: Die Kette abschließen"

    Zeichne deine Kette zuerst **auf Papier**: Welche Schritte, welche Ein- und Ausgaben?

    **Optional:** Lass die komplette Kette zusätzlich auf `gemma3:4b` laufen. Wo ist der Unterschied am größten – am Anfang oder am Ende?

    Notiere alle Kettenschritte in `prompts.md` unter `## 05 Kette`.

??? code "🐍 Optional (Python): die Kette automatisieren"

    Zwischenergebnisse von Hand zu kopieren ist genau die Arbeit, die ein Skript abnimmt:

    ```python title="kette.py"
    from pathlib import Path
    from llm import frage

    IDEE = ("Lieferdienst für regionale Bio-Lebensmittel in Innsbruck, "
            "zwei Gründer, 15.000 € Startkapital, Lastenrad-Zustellung.")

    SCHRITTE = [
        ("markt", "Idee: {start}\n\nBeschreibe den Zielmarkt in genau 3 "
                  "Stichpunkten: Zielgruppe, Marktgröße, Wettbewerber."),
        ("swot",  "Idee: {start}\n\nMarktanalyse:\n{eingabe}\n\nErstelle eine "
                  "SWOT-Analyse. Genau 2 Punkte pro Kategorie.\nFormat:\n"
                  "STÄRKEN: ...\nSCHWÄCHEN: ...\nCHANCEN: ...\nRISIKEN: ..."),
        ("plan",  "SWOT:\n{eingabe}\n\nLeite daraus genau 3 konkrete "
                  "Verbesserungsvorschläge ab."),
    ]


    def kette(schritte, startwert):
        ergebnisse = {}
        eingabe = startwert

        for nummer, (name, vorlage) in enumerate(schritte, start=1):
            print(f"\n{'=' * 55}\nSCHRITT {nummer}/{len(schritte)}: {name}\n{'=' * 55}")

            antwort = frage(vorlage.format(eingabe=eingabe, start=startwert))
            if not antwort.strip():
                raise RuntimeError(f"Schritt '{name}' lieferte nichts zurück.")

            print(antwort)
            ergebnisse[name] = antwort
            eingabe = antwort          # Ergebnis wird Eingabe des nächsten Schritts

            Path(f"kette_{nummer}_{name}.md").write_text(antwort, encoding="utf-8")

        return ergebnisse


    kette(SCHRITTE, IDEE)
    ```

    ```title="Ausgabe (gekürzt)"
    =======================================================
    SCHRITT 1/3: markt
    =======================================================
    - Zielgruppe: Berufstätige Haushalte in Innsbruck ...

    =======================================================
    SCHRITT 2/3: swot
    =======================================================
    STÄRKEN: Direkter Kontakt zu regionalen Produzenten ...

    =======================================================
    SCHRITT 3/3: plan
    =======================================================
    VORSCHLAG 1: Abo-Modell einführen ...
    ```

    Zwei Details lohnen sich zu merken:

    - **`{start}` bleibt in jedem Schritt verfügbar.** Manche Schritte brauchen die Originalidee *und* das letzte Zwischenergebnis – die gestrichelten Pfeile im Diagramm oben.
    - **Zwischenergebnisse landen als Datei auf der Platte.** Scheitert Schritt 3, startest du dort neu, statt die ganze Kette zu wiederholen.

---

???+ question "Selbsttest"

    1. Warum liefert ein Prompt mit vier Teilaufgaben bei kleinen Modellen so schlechte Ergebnisse?
    2. Nenne zwei Vorteile und einen Nachteil des Prompt Chaining.
    3. Warum sollte jeder Kettenschritt ein festes Ausgabeformat haben?

    ??? success "Lösungsskizze"

        1. Weil sich die „Aufmerksamkeit" des Modells auf alle Teile verteilt und die Antwortlänge begrenzt ist. Jede Teilaufgabe bekommt nur einen Bruchteil – meist wird die erste ausgeführt und der Rest angerissen.
        2. **Vorteile:** Kontrollpunkte nach jedem Schritt, wiederverwendbare Bausteine, kleinere Kontextfenster. **Nachteil:** mehr Aufrufe (Zeit/Kosten), und ein Fehler in Schritt 1 pflanzt sich fort, wenn man nicht prüft.
        3. Damit der nächste Schritt zuverlässig auf das Ergebnis zugreifen kann. Bei Fließtext musst du raten, wo die relevante Information steht – bei `STÄRKEN: …` nicht.

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^aichains]: **Wu, T., Terry, M. & Cai, C. J. (2022):** *AI Chains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts.* CHI '22. [https://doi.org/10.1145/3491102.3517582](https://doi.org/10.1145/3491102.3517582) · arXiv:2110.01691 — das namensgebende Paper. In einer Studie mit 20 Personen verbesserte Chaining nicht nur die Ergebnisqualität, sondern vor allem **Transparenz und Steuerbarkeit** – die Kontrollpunkte aus Übung 3.
[^cot]: **Wei, J., Wang, X., Schuurmans, D. et al. (2022):** *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.* arXiv:2201.11903. [https://arxiv.org/abs/2201.11903](https://arxiv.org/abs/2201.11903) — der verwandte Ansatz **innerhalb** eines Prompts (siehe Kasten oben). Wichtig für uns: Der Effekt tritt erst ab etwa 100 Mrd. Parametern zuverlässig auf – bei unseren Modellen also nicht.
[^schulhoff]: **Schulhoff, S., Ilie, M., Balepur, N. et al. (2024):** *The Prompt Report: A Systematic Survey of Prompt Engineering Techniques.* arXiv:2406.06608. [https://arxiv.org/abs/2406.06608](https://arxiv.org/abs/2406.06608)
