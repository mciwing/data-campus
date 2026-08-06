# 10. Evaluation von KI-Ergebnissen

KI-Ausgaben sind nicht automatisch korrekt. Wer professionell mit generativer KI arbeitet, muss Ergebnisse **systematisch bewerten und überprüfen**.

Bisher ging es darum, *bessere Antworten zu erzeugen*. Jetzt geht es darum, *zu erkennen, ob eine Antwort gut ist* – die Fähigkeit, die den Unterschied zwischen KI-Nutzung und KI-Kompetenz ausmacht.

---

## Vier Qualitätskriterien

<div class="grid cards" markdown>

- :material-check-decagram: **Korrektheit**

    ---

    Stimmen die Fakten? Sind Zahlen, Namen und Jahreszahlen belegbar?

    *Prüfung:* unabhängige Quelle

- :material-format-list-checks: **Vollständigkeit**

    ---

    Wurde alles beantwortet, was gefragt war? Fehlt eine relevante Perspektive?

    *Prüfung:* Abgleich mit dem eigenen Prompt

- :material-target: **Relevanz**

    ---

    Passt die Antwort zu *meiner* Situation – oder auf jede beliebige?

    *Prüfung:* Austauschtest (siehe unten)

- :material-scale-balance: **Ausgewogenheit**

    ---

    Werden Gegenargumente genannt? Oder nur eine Seite?

    *Prüfung:* [kritischer Gegenprompt](kritisches.md)

</div>

???+ tip "Der Austauschtest 🔄"

    Der schnellste Relevanz-Check: **Ersetze in der Antwort deine Geschäftsidee durch eine völlig andere.** Ergibt der Text immer noch Sinn?

    > „Achten Sie auf eine klare Positionierung und beobachten Sie den Wettbewerb genau."

    Das gilt für einen Bio-Lieferdienst genauso wie für eine Hundeschule oder eine Softwarefirma. Solche Sätze sind **Füllmaterial**, keine Analyse.

---

## Halluzinationen erkennen

Du kennst das Phänomen bereits aus [Kapitel 1](halluzinationen-kontextfenster.md). Hier geht es um die praktische Erkennung.

???+ process "Fünf Warnsignale"

    1. **Konkrete Zahlen ohne Quelle** – „Der Markt wächst um 12,4 % jährlich." Woher?
    2. **Eigennamen und Titel** – erfundene Studien, Bücher, Paragrafen und Personen sind der Klassiker.
    3. **Verdächtige Glätte** – wenn alles perfekt zusammenpasst, ist es oft konstruiert statt recherchiert.
    4. **Zeitbezogene Aussagen** – das Modell kennt seine eigenen Wissensgrenzen schlecht („aktuell", „seit letztem Jahr").
    5. **Selbstsicherheit bei Nischenwissen** – je spezieller die Frage, desto wahrscheinlicher die Erfindung.

!!! danger "Der gefährlichste Fall"

    Halluzinationen sind **nicht** die offensichtlich falschen Antworten – die fallen auf. Gefährlich sind die **plausiblen**: eine erfundene Zahl, die genau im erwarteten Bereich liegt. Sie überlebt jede oberflächliche Prüfung und landet in deiner Präsentation.

### Selbstauskunft erzwingen

Ein wirksamer Trick: Lass das Modell seine eigene Unsicherheit **markieren**.

```title="Unsicherheits-Prompt"
Beantworte die Frage und markiere JEDE Aussage:
[BELEGT]   – du bist sicher, das stimmt
[ANNAHME]  – plausibel, aber nicht sicher
[GESCHÄTZT] – eine Zahl, die du nicht kennst

Nenne am Ende die drei Aussagen, bei denen du am unsichersten bist.
```

!!! warning "Auch die Selbsteinschätzung ist nur Vorhersage"

    Das Modell *weiß* nicht, was es weiß. Die Markierungen sind selbst wieder Wahrscheinlichkeitsausgaben. Sie helfen als **Priorisierung** für deine Prüfung – sie ersetzen sie nicht.

---

## Bias erkennen

???+ defi "Bias"

    Eine systematische Verzerrung in den Ausgaben, die auf Ungleichgewichte in den Trainingsdaten zurückgeht.

    Typische Formen im Geschäftskontext:

    | Form | Beispiel |
    |---|---|
    | **Kulturell** | US-amerikanische Geschäftsmodelle und Rechtslagen als Standard |
    | **Sprachlich** | englische Quellen dominieren, deutschsprachige Besonderheiten fehlen |
    | **Größen-Bias** | Ratschläge passen zu Startups mit Wagniskapital, nicht zu Zwei-Personen-Betrieben |
    | **Optimismus** | Wachstumsszenarien werden häufiger genannt als Sättigung oder Rückgang |

!!! example "Bias sichtbar machen"

    Frag dieselbe Sache zweimal – einmal neutral, einmal mit explizitem Gegen-Rahmen:

    - *„Welche Vertriebskanäle empfiehlst du?"*
    - *„Welche Vertriebskanäle empfiehlst du, wenn wir kein Werbebudget haben und nicht wachsen wollen?"*

    Wenn die zweite Antwort völlig andere Kanäle nennt, war die erste vom Wachstums-Bias geprägt.

---

## Verifikation: der Ablauf

???+ process "Vier Schritte"

    1. **Prüfpflichtiges markieren** – jede Zahl, jeden Eigennamen, jede Jahreszahl im Text hervorheben.
    2. **Priorisieren** – was passiert, wenn diese Aussage falsch ist? Nur bei relevanten Folgen lohnt der Aufwand.
    3. **Unabhängig prüfen** – Statistik Austria, WKO, Branchenverbände, Originalstudien. **Nicht** durch dieselbe KI erneut fragen.
    4. **Ergebnis festhalten** – ✅ bestätigt · ❓ unklar · ❌ widerlegt. Das ✅-Ergebnis mit Quelle notieren.

!!! danger "Die Selbstbestätigungs-Falle"

    *„Stimmt das, was du eben gesagt hast?"* ist **keine** Verifikation. Das Modell prüft nichts nach – es erzeugt lediglich die wahrscheinlichste Antwort auf eine Rückfrage. Und die lautet meistens: „Ja, das ist korrekt."

    Eine Aussage gilt erst als geprüft, wenn sie **außerhalb** des Modells bestätigt wurde.

---

## 🔬 Ollama-Labor

!!! example "Übung 1: Halluzinationen provozieren"

    Der beste Weg, Halluzinationen zu erkennen, ist, sie absichtlich zu erzeugen.

    ```python title="halluzination.py"
    from llm import frage

    fragen = [
        "Wie groß war der Markt für Bio-Lieferdienste in Innsbruck im Jahr 2024?",
        "Nenne drei wissenschaftliche Studien zur Preiselastizität bei Bio-Lebensmitteln.",
        "Welche Förderungen gibt es 2026 in Tirol für nachhaltige Lieferdienste?",
        "Wer ist der Marktführer für Lastenrad-Logistik in Westösterreich?",
    ]

    for f in fragen:
        print(f"\n{'=' * 60}\nFRAGE: {f}\n{'=' * 60}")
        print(frage(f))
    ```

    **Deine Aufgabe:** Versuche, **eine einzige** der genannten Zahlen, Studien oder Namen im Internet zu belegen. Wie viele halten der Prüfung stand? (Erwartung bei `qwen2.5:0.5b`: nahezu keine.)

!!! example "Übung 2: Unsicherheitsmarkierung testen"

    ```python title="unsicherheit.py"
    from llm import frage

    ohne = frage("Beschreibe den Markt für Bio-Lieferdienste in Innsbruck. "
                 "Maximal 100 Wörter.")

    mit = frage("""Beschreibe den Markt für Bio-Lieferdienste in Innsbruck.
    Maximal 100 Wörter.

    WICHTIG: Markiere jede Aussage mit einem der folgenden Tags:
    [BELEGT] – du bist sicher
    [ANNAHME] – plausibel, aber ungeprüft
    [GESCHÄTZT] – eine Zahl, die du nicht kennst""")

    print(f"OHNE MARKIERUNG:\n{ohne}\n\n{'=' * 60}\n")
    print(f"MIT MARKIERUNG:\n{mit}\n")

    for tag in ["[BELEGT]", "[ANNAHME]", "[GESCHÄTZT]"]:
        print(f"{tag:<14} {mit.count(tag)}x")
    ```

    **Beobachte:** Hält sich das kleine Modell überhaupt an die Markierung? Und – noch interessanter – sind die `[BELEGT]`-Aussagen wirklich belegt?

??? question "Übung 3: Der Fakten-Extraktor (Python)"

    Schreibe ein Skript, das alle prüfpflichtigen Aussagen aus einem KI-Text herausfiltert.

    ```python title="faktencheck.py"
    import re

    def finde_pruefpflichtiges(text):
        """Gibt ein dict mit gefundenen Zahlen, Prozentwerten und Jahren zurück."""
        funde = {}
        # TODO 1: Prozentangaben finden (z. B. "12,4 %", "5%")
        # TODO 2: Jahreszahlen finden (1900–2099)
        # TODO 3: Geldbeträge finden (z. B. "15.000 €", "2 Mio. EUR")
        # TODO 4: Ergebnis als Checkliste ausgeben
        return funde

    text = """Der Markt wächst um 12,4 % jährlich und erreichte 2024 ein
    Volumen von 3,2 Mio. EUR. Rund 45% der Haushalte kaufen bereits bio."""
    finde_pruefpflichtiges(text)
    ```

    ??? success "Lösungsvorschlag"

        ```python title="faktencheck.py"
        import re

        MUSTER = {
            "Prozentwerte": r"\d+(?:[.,]\d+)?\s*%",
            "Jahreszahlen": r"\b(?:19|20)\d{2}\b",
            "Geldbeträge":  r"\d+(?:[.,]\d+)*\s*(?:Mio\.|Mrd\.|Tsd\.)?\s*(?:€|EUR)",
        }

        def finde_pruefpflichtiges(text):
            funde = {name: re.findall(muster, text)
                     for name, muster in MUSTER.items()}

            gesamt = sum(len(v) for v in funde.values())
            print(f"\n🔍 {gesamt} prüfpflichtige Angaben gefunden\n")

            for name, treffer in funde.items():
                if treffer:
                    print(f"{name}:")
                    for t in treffer:
                        print(f"  [ ] {t:<15} → Quelle: ________________")

            return funde
        ```

        **Die Checkliste mit den leeren Kästchen ist der eigentliche Punkt.** Sie zwingt dich, für jede Zahl eine Quelle einzutragen – oder sie zu streichen. Ohne diese Disziplin wandern KI-Zahlen ungeprüft in echte Dokumente.

        **Erweiterungsidee:** Ergänze ein Muster für Eigennamen (Großbuchstabe am Wortanfang, nicht am Satzanfang) – erfundene Studien und Personen sind die häufigste Halluzinationsform.

---

???+ question "Selbsttest"

    1. Was ist der Austauschtest und wozu dient er?
    2. Warum ist die Rückfrage „Stimmt das wirklich?" keine Verifikation?
    3. Welche Halluzination ist gefährlicher – eine offensichtlich falsche Zahl oder eine plausible? Warum?

    ??? success "Lösungsskizze"

        1. Man ersetzt in der Antwort die eigene Idee durch eine völlig andere. Ergibt der Text weiterhin Sinn, ist er nicht auf den konkreten Fall bezogen, sondern Füllmaterial – ein Relevanzmangel.
        2. Weil das Modell nichts nachschlägt, sondern nur die wahrscheinlichste Antwort auf eine Rückfrage erzeugt – und die lautet meist „ja". Verifikation braucht eine **unabhängige** Quelle außerhalb des Modells.
        3. Die **plausible**. Eine offensichtlich falsche Zahl fällt sofort auf. Eine Zahl im erwarteten Bereich übersteht jede oberflächliche Prüfung und wird ungeprüft weiterverwendet.

---

!!! example "Lab"

    **Faktenprüfung einer KI-generierten Marktanalyse**

    Überprüfe eine KI-generierte Marktanalyse zu deiner Geschäftsidee auf ihre Richtigkeit. Identifiziere mögliche Halluzinationen oder Verzerrungen und verifiziere zentrale Aussagen mit verlässlichen Quellen.

    **Konkrete Schritte:**

    1. Erzeuge eine Marktanalyse zu deiner Idee (nutze deine Kette aus [Kapitel 7](chaining.md)).
    2. Lass `finde_pruefpflichtiges()` (Übung 3) darüber laufen und erstelle die Checkliste.
    3. Prüfe **mindestens fünf** Angaben mit unabhängigen Quellen (Statistik Austria, WKO, Branchenverbände).
    4. Trage für jede Angabe ein: ✅ bestätigt (mit Quelle) · ❓ unklar · ❌ widerlegt.
    5. Wende den **Austauschtest** auf den Fließtext an: Wie viel Prozent des Textes überlebt ihn?
    6. Prüfe auf **Bias**: Nenne mindestens eine Stelle, an der die Analyse eine unausgesprochene Annahme über Größe, Wachstum oder Kultur macht.
    7. Speichere deinen Prüf-Prompt als `prompts/08_evaluation.md`.

---

## Quellen

!!! info "Literatur"

    - **Ji, Z. et al. (2023):** *Survey of Hallucination in Natural Language Generation.* ACM Computing Surveys. [https://arxiv.org/abs/2202.03629](https://arxiv.org/abs/2202.03629)
    - **Bender, E. M. et al. (2021):** *On the Dangers of Stochastic Parrots.* FAccT '21. [https://doi.org/10.1145/3442188.3445922](https://doi.org/10.1145/3442188.3445922)
    - **Statistik Austria:** [https://www.statistik.at](https://www.statistik.at)
    - **Zuckarelli, J. (2025):** *Programmieren mit ChatGPT*. Springer Nature. [https://doi.org/10.1007/978-3-662-69433-6](https://doi.org/10.1007/978-3-662-69433-6)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
