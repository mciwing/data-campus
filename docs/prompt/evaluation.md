# Evaluation von KI-Ergebnissen

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

Du kennst das Phänomen bereits aus [Halluzinationen und Kontextfenster](halluzinationen-kontextfenster.md). Hier geht es um die praktische Erkennung.[^hallucination]

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

```{.text .ollama title="Unsicherheits-Prompt"}
Beantworte die Frage und markiere JEDE Aussage:
...[BELEGT]   – du bist sicher, das stimmt
...[ANNAHME]  – plausibel, aber nicht sicher
...[GESCHÄTZT] – eine Zahl, die du nicht kennst
...
...Nenne am Ende die drei Aussagen, bei denen du am unsichersten bist.
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

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren – hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Halluzinationen provozieren"

    Stelle dem Modell **vier Fragen zu deiner Branche**, deren Antwort es unmöglich wissen kann – Marktvolumen deiner Region im Vorjahr, wissenschaftliche Studien zu deinem Thema, aktuelle Förderungen, der regionale Marktführer.

    **Dann der eigentliche Test:** Versuche, **eine einzige** der genannten Zahlen, Studien oder Namen im Internet zu belegen. Wie viele halten stand?

!!! lab "Übung 2: Unsicherheit markieren lassen"

    Stelle dieselben Fragen erneut, diesmal mit der Auflage, jede Aussage zu kennzeichnen:

    `[BELEGT]` · `[ANNAHME]` · `[GESCHÄTZT]`

    **Prüfe zweierlei:** Hält sich das Modell überhaupt daran? Und sind die `[BELEGT]`-Aussagen wirklich belegt?

    Wiederhole den Prompt dreimal – bleiben dieselben Aussagen in derselben Kategorie? Die Antwort sagt dir, was die Selbsteinschätzung wert ist.

!!! lab "Übung 3: Faktenprüfung deiner Marktanalyse"

    Nimm die Marktanalyse aus deiner Kette in [Prompt Chaining](chaining.md) und markiere **jede Zahl, jeden Eigennamen, jede Jahreszahl**.

    Übertrage sie in eine Tabelle und prüfe **mindestens fünf** Angaben mit unabhängigen Quellen – [Statistik Austria](https://www.statistik.at), WKO, Branchenverbände. Nicht durch dieselbe KI.

    | Angabe | Quelle geprüft? | Ergebnis |
    |---|---|---|
    | … | … | ✅ / ❓ / ❌ |

    **Wie hoch ist dein Anteil ✅ nach ehrlicher Prüfung?**

!!! lab "Übung 4: Austauschtest und Bias"

    1. **Austauschtest:** Ersetze im Fließtext deine Geschäftsidee durch eine völlig andere. Wie viel Prozent des Textes ergibt trotzdem noch Sinn? Das ist dein Füllmaterial-Anteil.
    2. **Bias:** Finde mindestens eine Stelle, an der die Analyse eine unausgesprochene Annahme über Größe, Wachstum oder Kultur macht.

    Speichere deinen Prüf-Prompt in `prompts.md` unter `## 08 Evaluation`.

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

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^hallucination]: **Ji, Z., Lee, N., Frieske, R. et al. (2023):** *Survey of Hallucination in Natural Language Generation.* ACM Computing Surveys. arXiv:2202.03629. [https://arxiv.org/abs/2202.03629](https://arxiv.org/abs/2202.03629) — die Standardübersicht zum Thema. Führt die für dich wichtige Unterscheidung ein: **intrinsische** Halluzinationen widersprechen der mitgelieferten Quelle, **extrinsische** lassen sich an ihr überhaupt nicht prüfen – Letztere sind die gefährlicheren.
[^bender]: **Bender, E. M., Gebru, T., McMillan-Major, A. & Shmitchell, S. (2021):** *On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?* FAccT '21, S. 610–623. [https://doi.org/10.1145/3442188.3445922](https://doi.org/10.1145/3442188.3445922) — die grundlegende Arbeit zu Bias in Sprachmodellen: Trainingsdaten aus dem Internet bilden bestehende Ungleichgewichte ab, und schiere Datenmenge behebt das nicht, sondern zementiert es.
[^judge]: **Zheng, L., Chiang, W.-L., Sheng, Y. et al. (2023):** *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.* arXiv:2306.05685. [https://arxiv.org/abs/2306.05685](https://arxiv.org/abs/2306.05685) — untersucht, ob ein Modell die Ausgaben eines anderen bewerten kann. Ergebnis: teilweise ja – aber mit klaren Verzerrungen (Vorliebe für längere Antworten, für die eigene Ausgabe, für die zuerst gezeigte Option). Der Grund, warum du Ergebnisse nicht von derselben KI prüfen lassen solltest.
!!! info "Quellen zur Verifikation"

    - **Statistik Austria:** [https://www.statistik.at](https://www.statistik.at)
    - **WKO Branchendaten:** [https://www.wko.at/statistik](https://www.wko.at/statistik)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
