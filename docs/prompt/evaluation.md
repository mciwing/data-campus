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

Du kennst das Phänomen bereits aus [Kapitel 1](halluzinationen-kontextfenster.md). Hier geht es um die praktische Erkennung.[^hallucination]

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

    Eine systematische Verzerrung in den Ausgaben, die auf Ungleichgewichte in den Trainingsdaten zurückgeht.[^bender]

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

???+ defi "Kann eine KI eine andere KI bewerten? 🔬"

    Der Gedanke liegt nahe – und wird in der Praxis unter dem Namen *LLM-as-a-Judge* auch eingesetzt. Zheng et al.[^judge] haben untersucht, wie gut das funktioniert, und dabei drei systematische Verzerrungen gefunden:

    | Verzerrung | Was passiert |
    |---|---|
    | **Positions-Bias** | Von zwei Antworten wird bevorzugt die **zuerst gezeigte** gewählt |
    | **Längen-Bias** | Längere Antworten werden besser bewertet – unabhängig vom Inhalt |
    | **Selbstbevorzugung** | Ein Modell bewertet die **eigenen** Ausgaben milder |

    Für **Stil und Vollständigkeit** ist eine KI-Bewertung trotzdem brauchbar. Für **Korrektheit** nicht: Ein Modell, das eine Zahl erfunden hat, hat keinen Zugang zu einer Quelle, an der es sie prüfen könnte. Es kann nur erneut raten.

---

## 🔬 Ollama-Labor

!!! example "Übung 1: Halluzinationen provozieren"

    Der beste Weg, Halluzinationen zu erkennen, ist, sie absichtlich zu erzeugen. Stelle Fragen, deren Antwort das Modell unmöglich wissen kann:

    ```bash
    ollama run qwen2.5:0.5b "Wie groß war der Markt für Bio-Lieferdienste in Innsbruck im Jahr 2024?"
    ```

    ```title="Beispielausgabe"
    Der Markt für Bio-Lieferdienste in Innsbruck belief sich 2024 auf ein
    Volumen von etwa 3,2 Millionen Euro und wuchs gegenüber dem Vorjahr um
    rund 12,4 %. Rund 45 % der Haushalte im Stadtgebiet nutzen mittlerweile
    zumindest gelegentlich einen Lieferdienst für Bio-Produkte.
    ```

    Drei präzise Zahlen, souverän vorgetragen, **vollständig erfunden**. Keine Unsicherheit, kein Hinweis, keine Quelle.

    ```bash
    ollama run qwen2.5:0.5b "Nenne drei wissenschaftliche Studien zur Preiselastizität bei Bio-Lebensmitteln."
    ```

    ```title="Beispielausgabe"
    1. Müller, T. & Bauer, S. (2019): Preissensitivität im Bio-Segment.
       Journal of Food Economics, 34(2), 112–128.
    2. Hofer, A. (2021): Konsumverhalten bei ökologischen Lebensmitteln.
       Universität Wien, Institut für Agrarökonomie.
    3. Schmidt, K. et al. (2020): Elastizität und Zahlungsbereitschaft.
       European Review of Agricultural Economics, 47(4), 601–620.
    ```

    Format, Autorennamen, Jahrgänge, Seitenzahlen – alles perfekt plausibel. Und mit hoher Wahrscheinlichkeit existiert keine dieser Studien.

    **Deine Aufgabe:** Versuche, **eine einzige** der genannten Zahlen oder Studien im Internet zu belegen. Wie viele halten der Prüfung stand? Stelle zusätzlich diese beiden Fragen:

    - *„Welche Förderungen gibt es 2026 in Tirol für nachhaltige Lieferdienste?"*
    - *„Wer ist der Marktführer für Lastenrad-Logistik in Westösterreich?"*

!!! example "Übung 2: Unsicherheitsmarkierung testen"

    Kann das Modell selbst sagen, was es nicht weiß?

    ```title="Terminal"
    >>> """
    ... Beschreibe den Markt für Bio-Lieferdienste in Innsbruck.
    ... Maximal 100 Wörter.
    ...
    ... WICHTIG: Markiere jede Aussage mit einem dieser Tags:
    ... [BELEGT] – du bist sicher
    ... [ANNAHME] – plausibel, aber ungeprüft
    ... [GESCHÄTZT] – eine Zahl, die du nicht kennst
    ... """
    ```

    ```title="Beispielausgabe"
    [BELEGT] Innsbruck ist die Landeshauptstadt Tirols mit rund 130.000
    Einwohnern. [ANNAHME] Das Interesse an regionalen Bio-Produkten ist dort
    überdurchschnittlich ausgeprägt. [GESCHÄTZT] Etwa 15.000 Haushalte
    kommen als Zielgruppe infrage. [ANNAHME] Die größten Wettbewerber sind
    Supermarktketten mit eigenem Lieferservice.
    ```

    Das ist deutlich besser als Übung 1 – die Zahl ist jetzt als Schätzung gekennzeichnet.

    **Deine Aufgabe:** Prüfe die `[BELEGT]`-Aussagen. Sind sie wirklich belegt? Wiederhole den Prompt dreimal – bleiben dieselben Aussagen in derselben Kategorie? (Wenn nicht, weißt du, wie viel die Selbsteinschätzung wert ist.)

!!! example "Übung 3: Die Prüf-Checkliste"

    Nimm eine beliebige KI-Marktanalyse und markiere jede **Zahl**, jeden **Eigennamen** und jede **Jahreszahl**. Übertrage sie in eine Tabelle:

    ```markdown title="faktencheck.md"
    | Angabe             | Quelle geprüft?      | Ergebnis |
    |--------------------|----------------------|----------|
    | 3,2 Mio. EUR       | Statistik Austria    | ❌ nicht auffindbar |
    | 12,4 % Wachstum    | –                    | ❓ offen |
    | 45 % der Haushalte | –                    | ❓ offen |
    | Müller & Bauer 2019| Google Scholar       | ❌ existiert nicht |
    | 130.000 Einwohner  | Stadt Innsbruck      | ✅ bestätigt |
    ```

    Die leeren Zellen sind der eigentliche Punkt: Sie zwingen dich, für jede Zahl eine Quelle einzutragen – oder sie zu streichen. Ohne diese Disziplin wandern KI-Zahlen ungeprüft in echte Dokumente.

    **Deine Aufgabe:** Fülle die Tabelle für deine eigene Marktanalyse aus. Wie hoch ist dein Anteil ✅ nach ehrlicher Prüfung?

??? code "🐍 Optional (Python): prüfpflichtige Angaben automatisch finden"

    Zahlen von Hand zu markieren ist mühsam und fehleranfällig. Ein regulärer Ausdruck findet sie zuverlässiger:

    ```python title="faktencheck.py"
    import re

    MUSTER = {
        "Prozentwerte": r"\d+(?:[.,]\d+)?\s*%",
        "Jahreszahlen": r"\b(?:19|20)\d{2}\b",
        "Geldbeträge":  r"\d+(?:[.,]\d+)*\s*(?:Mio\.|Mrd\.|Tsd\.)?\s*(?:€|EUR)",
    }

    text = """Der Markt wächst um 12,4 % jährlich und erreichte 2024 ein
    Volumen von 3,2 Mio. EUR. Rund 45% der Haushalte kaufen bereits bio."""

    funde = {name: re.findall(muster, text) for name, muster in MUSTER.items()}
    gesamt = sum(len(v) for v in funde.values())

    print(f"🔍 {gesamt} prüfpflichtige Angaben gefunden\n")
    for name, treffer in funde.items():
        if treffer:
            print(f"{name}:")
            for t in treffer:
                print(f"  [ ] {t:<15} → Quelle: ________________")
    ```

    ```title="Ausgabe"
    🔍 5 prüfpflichtige Angaben gefunden

    Prozentwerte:
      [ ] 12,4 %          → Quelle: ________________
      [ ] 45%             → Quelle: ________________
    Jahreszahlen:
      [ ] 2024            → Quelle: ________________
    Geldbeträge:
      [ ] 3,2 Mio. EUR    → Quelle: ________________
    ```

    **Erweiterungsidee:** Ergänze ein Muster für Eigennamen (Großbuchstabe am Wortanfang, nicht am Satzanfang) – erfundene Studien und Personen sind die häufigste Halluzinationsform und die, die am ehesten unbemerkt durchrutscht.

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
    2. Erstelle die Prüf-Checkliste aus Übung 3 – markiere jede Zahl, jeden Namen, jede Jahreszahl.
    3. Prüfe **mindestens fünf** Angaben mit unabhängigen Quellen (Statistik Austria, WKO, Branchenverbände).
    4. Trage für jede Angabe ein: ✅ bestätigt (mit Quelle) · ❓ unklar · ❌ widerlegt.
    5. Wende den **Austauschtest** auf den Fließtext an: Wie viel Prozent des Textes überlebt ihn?
    6. Prüfe auf **Bias**: Nenne mindestens eine Stelle, an der die Analyse eine unausgesprochene Annahme über Größe, Wachstum oder Kultur macht.
    7. Notiere deinen Prüf-Prompt in `prompts.md` unter `## 08 Evaluation`.

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^hallucination]: **Ji, Z., Lee, N., Frieske, R. et al. (2023):** *Survey of Hallucination in Natural Language Generation.* ACM Computing Surveys. arXiv:2202.03629. [https://arxiv.org/abs/2202.03629](https://arxiv.org/abs/2202.03629) — die Standardübersicht zum Thema. Führt die für dich wichtige Unterscheidung ein: **intrinsische** Halluzinationen widersprechen der mitgelieferten Quelle, **extrinsische** lassen sich an ihr überhaupt nicht prüfen – Letztere sind die gefährlicheren.
[^bender]: **Bender, E. M., Gebru, T., McMillan-Major, A. & Shmitchell, S. (2021):** *On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?* FAccT '21, S. 610–623. [https://doi.org/10.1145/3442188.3445922](https://doi.org/10.1145/3442188.3445922) — die grundlegende Arbeit zu Bias in Sprachmodellen: Trainingsdaten aus dem Internet bilden bestehende Ungleichgewichte ab, und schiere Datenmenge behebt das nicht, sondern zementiert es.
[^judge]: **Zheng, L., Chiang, W.-L., Sheng, Y. et al. (2023):** *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.* arXiv:2306.05685. [https://arxiv.org/abs/2306.05685](https://arxiv.org/abs/2306.05685) — untersucht, ob ein Modell die Ausgaben eines anderen bewerten kann. Ergebnis: teilweise ja – aber mit klaren Verzerrungen (Vorliebe für längere Antworten, für die eigene Ausgabe, für die zuerst gezeigte Option). Der Grund, warum du Ergebnisse nicht von derselben KI prüfen lassen solltest.
!!! info "Quellen zur Verifikation"

    - **Statistik Austria:** [https://www.statistik.at](https://www.statistik.at)
    - **WKO Branchendaten:** [https://www.wko.at/statistik](https://www.wko.at/statistik)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
