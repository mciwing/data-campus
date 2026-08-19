# Evaluation von KI-Ergebnissen

KI-Ausgaben sind nicht automatisch korrekt. Wer professionell mit generativer KI arbeitet, muss Ergebnisse **systematisch bewerten und überprüfen**.

Bisher ging es darum, *bessere Antworten zu erzeugen*. Jetzt geht es darum, *zu erkennen, ob eine Antwort gut ist* - die Fähigkeit, die den Unterschied zwischen KI-Nutzung und KI-Kompetenz ausmacht.

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

    Passt die Antwort zu *meiner* Situation - oder auf jede beliebige?

    *Prüfung:* Austauschtest (siehe unten)

- :material-scale-balance: **Ausgewogenheit**

    ---

    Werden Gegenargumente genannt? Oder nur eine Seite?

    *Prüfung:* [kritischer Gegenprompt](kritisches.md)

</div>

???+ tip "Der Austauschtest"

    Der schnellste Relevanz-Check: **Ersetze in der Antwort deine Geschäftsidee durch eine völlig andere.** Ergibt der Text immer noch Sinn?

    > „Achten Sie auf eine klare Positionierung und beobachten Sie den Wettbewerb genau."

    Das gilt für einen Bio-Lieferdienst genauso wie für eine Hundeschule oder eine Softwarefirma. Solche Sätze sind **Füllmaterial**, keine Analyse.

---

## Halluzinationen erkennen

Halluzinationen sind **nicht** die offensichtlich falschen Antworten - die fallen auf. Gefährlich sind die **plausiblen**: eine erfundene Zahl, die genau im erwarteten Bereich liegt. Sie überlebt jede oberflächliche Prüfung und landet in deiner Präsentation. Du kennst das Phänomen bereits aus [Halluzinationen und Kontextfenster](halluzinationen-kontextfenster.md). Hier geht es um die praktische Erkennung.[^hallucination]

???+ process "Fünf Warnsignale"

    1. **Konkrete Zahlen ohne Quelle** - „Der Markt wächst um 12,4 % jährlich." Woher?
    2. **Eigennamen und Titel** - erfundene Studien, Bücher, Paragrafen und Personen sind der Klassiker.
    3. **Verdächtige Glätte** - wenn alles perfekt zusammenpasst, ist es oft konstruiert statt recherchiert.
    4. **Zeitbezogene Aussagen** - das Modell kennt seine eigenen Wissensgrenzen schlecht („aktuell", „seit letztem Jahr").
    5. **Selbstsicherheit bei Nischenwissen** - je spezieller die Frage, desto wahrscheinlicher die Erfindung.

    

### Selbstauskunft erzwingen

Ein wirksamer Trick: Lass das Modell seine eigene Unsicherheit **markieren**.

```{.text .ollama title="Unsicherheits-Prompt"}
Beantworte die Frage und markiere JEDE Aussage:
...[BELEGT]   - du bist sicher, das stimmt
...[ANNAHME]  - plausibel, aber nicht sicher
...[GESCHÄTZT] - eine Zahl, die du nicht kennst
...
...Nenne am Ende die drei Aussagen, bei denen du am unsichersten bist.
```

!!! warning "Auch die Selbsteinschätzung ist nur Vorhersage"

    Das Modell *weiß* nicht, was es weiß. Die Markierungen sind selbst wieder Wahrscheinlichkeitsausgaben. Sie helfen als **Priorisierung** für deine Prüfung - sie ersetzen sie nicht.

---

## Bias erkennen

???+ defi "Bias"

    Eine systematische Verzerrung in den Ausgaben, die auf Ungleichgewichte in den Trainingsdaten zurückgeht.[^bender]

    Typische Formen im Geschäftskontext:

    <div style="text-align:center; max-width:760px; margin:16px auto;">
    <table role="table"
            style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
        <thead>
        <tr style="background:#009485; color:#fff;">
            <th style="text-align:left; padding:12px 14px; font-weight:700;">Form</th>
            <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Kulturell</td>
            <td style="padding:10px 14px;">US-amerikanische Geschäftsmodelle und Rechtslagen als Standard</td>
        </tr>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Sprachlich</td>
            <td style="padding:10px 14px;">englische Quellen dominieren, deutschsprachige Besonderheiten fehlen</td>
        </tr>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Größen-Bias</td>
            <td style="padding:10px 14px;">Ratschläge passen zu Startups mit Wagniskapital, nicht zu Zwei-Personen-Betrieben</td>
        </tr>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Optimismus</td>
            <td style="padding:10px 14px;">Wachstumsszenarien werden häufiger genannt als Sättigung oder Rückgang</td>
        </tr>
        </tbody>
    </table>
    </div>

!!! example "Bias sichtbar machen"

    Frag dieselbe Sache zweimal - einmal neutral, einmal mit explizitem Gegen-Rahmen:

    - *„Welche Vertriebskanäle empfiehlst du?"*
    - *„Welche Vertriebskanäle empfiehlst du, wenn wir kein Werbebudget haben und nicht wachsen wollen?"*

    Wenn die zweite Antwort völlig andere Kanäle nennt, war die erste vom Wachstums-Bias geprägt.

---

## Verifikation: der Ablauf

???+ process "Vier Schritte"

    1. **Prüfpflichtiges markieren** - jede Zahl, jeden Eigennamen, jede Jahreszahl im Text hervorheben.
    2. **Priorisieren** - was passiert, wenn diese Aussage falsch ist? Nur bei relevanten Folgen lohnt der Aufwand.
    3. **Unabhängig prüfen** - Statistik Austria, WKO, Branchenverbände, Originalstudien. **Nicht** durch dieselbe KI erneut fragen.
    4. **Ergebnis festhalten** - ✅ bestätigt · ❓ unklar · ❌ widerlegt. Das ✅-Ergebnis mit Quelle notieren.

!!! danger "Die Selbstbestätigungs-Falle"

    *„Stimmt das, was du eben gesagt hast?"* ist **keine** Verifikation. Das Modell prüft nichts nach - es erzeugt lediglich die wahrscheinlichste Antwort auf eine Rückfrage. Und die lautet meistens: „Ja, das ist korrekt."

    Eine Aussage gilt erst als geprüft, wenn sie **außerhalb** des Modells bestätigt wurde.

???+ defi "Kann eine KI eine andere KI bewerten? 🔬"

    Der Gedanke liegt nahe - und wird in der Praxis unter dem Namen *LLM-as-a-Judge* auch eingesetzt. Zheng et al.[^judge] haben untersucht, wie gut das funktioniert, und dabei drei systematische Verzerrungen gefunden:

    <div style="text-align:center; max-width:760px; margin:16px auto;">
    <table role="table"
            style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
        <thead>
        <tr style="background:#009485; color:#fff;">
            <th style="text-align:left; padding:12px 14px; font-weight:700;">Verzerrung</th>
            <th style="text-align:left; padding:12px 14px; font-weight:700;">Was passiert</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Positions-Bias</td>
            <td style="padding:10px 14px;">Von zwei Antworten wird bevorzugt die <strong>zuerst gezeigte</strong> gewählt</td>
        </tr>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Längen-Bias</td>
            <td style="padding:10px 14px;">Längere Antworten werden besser bewertet - unabhängig vom Inhalt</td>
        </tr>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Selbstbevorzugung</td>
            <td style="padding:10px 14px;">Ein Modell bewertet die <strong>eigenen</strong> Ausgaben milder</td>
        </tr>
        </tbody>
    </table>
    </div>

    Für **Stil und Vollständigkeit** ist eine KI-Bewertung trotzdem brauchbar. Für **Korrektheit** nicht: Ein Modell, das eine Zahl erfunden hat, hat keinen Zugang zu einer Quelle, an der es sie prüfen könnte. Es kann nur erneut raten.

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren - hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Halluzinationen provozieren"

    Stelle dem Modell **vier Fragen zu deiner Branche**, deren Antwort es unmöglich wissen kann - Marktvolumen deiner Region im Vorjahr, wissenschaftliche Studien zu deinem Thema, aktuelle Förderungen, der regionale Marktführer.

    **Dann der eigentliche Test:** Versuche, **eine einzige** der genannten Zahlen, Studien oder Namen im Internet zu belegen. Wie viele halten stand?

    ??? success "Was du beobachten solltest"

        Du bekommst vier flüssige, konkrete, vollständig formulierte Antworten - mit Prozentwerten auf eine Nachkommastelle und Studien mit Autorennamen und Jahreszahl.

        Und dann findest du meist **keine einzige** davon wieder. Besonders lehrreich sind die erfundenen Studien: Autor, Titel und Jahr wirken einzeln plausibel, weil das Modell sie aus echten Bausteinen zusammensetzt - nur diese Kombination hat es nie gegeben.

        Merke dir das Gefühl von diesem Moment. Es ist der Grund, warum es dieses Kapitel gibt.

!!! lab "Übung 2: Unsicherheit markieren lassen"

    Stelle dieselben Fragen erneut, diesmal mit der Auflage, jede Aussage zu kennzeichnen:

    `[BELEGT]` · `[ANNAHME]` · `[GESCHÄTZT]`

    **Prüfe zweierlei:** Hält sich das Modell überhaupt daran? Und sind die `[BELEGT]`-Aussagen wirklich belegt?

    Wiederhole den Prompt dreimal - bleiben dieselben Aussagen in derselben Kategorie? Die Antwort sagt dir, was die Selbsteinschätzung wert ist.

    ??? success "Was du beobachten solltest - und der Rückbezug"

        An das *Format* hält sich das Modell meist brav. An die *Bedeutung* nicht: Erfundene Zahlen tragen genauso selbstverständlich ein `[BELEGT]` wie echte, und über drei Läufe wandern dieselben Aussagen zwischen den Kategorien hin und her.

        Damit hast du die Gegenprobe zum [iterativen Prompting](iteratives.md) in der Hand. Dort hast du das Modell gefragt, **welche Informationen ihm fehlen** - und die Antwort war brauchbar. Hier fragst du, **was es weiß** - und die Antwort ist wertlos.

        Der Unterschied ist kein Zufall: Das eine ist eine Sprachaufgabe („was fehlt einem Text dieser Art?"), das andere eine Faktenfrage über die eigene Wissensbasis. Für Letzteres hat ein Sprachmodell kein Organ.

        👉 Die Markierungen sind trotzdem nützlich - nicht als Urteil, sondern als **Arbeitsliste**: Sie zeigen dir, wo das Modell überhaupt Fakten behauptet.

!!! lab "Übung 3: Faktenprüfung deiner Marktanalyse · Hausaufgabe"

    !!! warning "Diese Übung passt nicht in eine Laboreinheit"

        Fünf Angaben ernsthaft mit externen Quellen zu prüfen dauert länger als alles andere in diesem Kurs - das ist keine Schwäche der Aufgabe, sondern ihre Aussage: **Nachprüfen kostet mehr Zeit als Erzeugen.** Genau deshalb wird es so oft übersprungen.

        Im Labor machst du **Schritt 1 und 2** (markieren, Tabelle anlegen), die eigentliche Recherche nimmst du mit nach Hause.

    **Schritt 1:** Nimm die Marktanalyse aus deiner Kette in [Prompt Chaining](chaining.md) und markiere **jede Zahl, jeden Eigennamen, jede Jahreszahl**.

    **Schritt 2:** Übertrage sie in eine Tabelle im `lab_log.md` unter `## 08 Evaluation`.

    **Schritt 3:** Prüfe **mindestens fünf** Angaben mit unabhängigen Quellen - [Statistik Austria](https://www.statistik.at), WKO, Branchenverbände. Nicht durch dieselbe KI.

    <div style="text-align:center; max-width:620px; margin:16px auto;">
    <table role="table"
            style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
        <thead>
        <tr style="background:#009485; color:#fff;">
            <th style="text-align:left; padding:12px 14px; font-weight:700;">Angabe</th>
            <th style="text-align:center; padding:12px 14px; font-weight:700;">Quelle geprüft?</th>
            <th style="text-align:center; padding:12px 14px; font-weight:700;">Ergebnis</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="background:#00948511; padding:10px 14px;">…</td>
            <td style="padding:10px 14px; text-align:center;">…</td>
            <td style="padding:10px 14px; text-align:center;">✅ / ❓ / ❌</td>
        </tr>
        </tbody>
    </table>
    </div>

    **Wie hoch ist dein Anteil ✅ nach ehrlicher Prüfung?**

!!! lab "Übung 4: Der Austauschtest - dein Füllmaterial-Anteil"

    Der schnellste Substanztest, den es gibt, und du brauchst dafür kein Modell:

    Nimm einen KI-erzeugten Fließtext über deine Idee und **ersetze deine Geschäftsidee durch eine völlig andere** - aus dem Bio-Lieferdienst wird eine Yogaschule, aus der Softwarefirma ein Friseursalon. Nur die Bezeichnung tauschen, sonst nichts ändern.

    Dann lies den Text noch einmal und markiere jeden Satz, der **immer noch stimmt**.

    **Der Anteil markierter Sätze ist dein Füllmaterial-Anteil.** Notiere ihn in Prozent in dein `lab_log.md`.

    ??? success "Was du beobachten solltest"

        Erwarte etwas zwischen 40 % und 70 %. Sätze wie *„Eine klare Positionierung ist entscheidend für den Markterfolg"* oder *„Die Kundenbindung sollte kontinuierlich gestärkt werden"* überleben jeden Austausch - sie sagen über deine Idee genau nichts.

        Der Test funktioniert übrigens auch bei Texten von Menschen. Du wirst ihn nach diesem Kapitel nicht mehr los.

        👉 Und die praktische Konsequenz: Was den Austauschtest überlebt, hättest du nicht generieren lassen müssen. Der Weg zu weniger Füllmaterial führt über die fünf Bausteine aus [Anatomie](anatomie.md) - vor allem über **Kontext**.

!!! lab "Übung 5: Bias aufspüren"

    Finde in deiner Analyse mindestens eine Stelle, an der der Text eine **unausgesprochene Annahme** macht - über Größe, Wachstum oder Kultur.

    Typische Kandidaten: dass Wachstum das Ziel ist. Dass Digitalisierung eine Verbesserung ist. Dass der Markt einem westlichen Konsummuster folgt. Dass Konkurrenz schlecht ist.

    Speichere deinen Prüf-Prompt im `lab_log.md` unter `## 08 Evaluation`.

    ??? success "Was du beobachten solltest"

        Am häufigsten findet sich die **Wachstumsannahme**: Der Text behandelt Skalierung selbstverständlich als Ziel, obwohl viele gute Geschäftsideen bewusst klein bleiben.

        Das ist kein Fehler des Modells im engeren Sinn - es gibt wieder, was in seinen Trainingsdaten überwiegt. Dieselbe Mechanik hast du bei den [Rollen](rollen.md) gesehen: Du bekommst nicht *eine* Perspektive, du bekommst den statistischen Durchschnitt.

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

    **Erweiterungsidee:** Ergänze ein Muster für Eigennamen (Großbuchstabe am Wortanfang, nicht am Satzanfang) - erfundene Studien und Personen sind die häufigste Halluzinationsform und die, die am ehesten unbemerkt durchrutscht.

---

## 🎓 Abschluss: dein Portfolio

Acht Kapitel, acht Prompts, ein Laborbuch und zwei Fassungen deiner Idee. Zeit, das Ganze einmal als Ganzes anzusehen.

!!! lab "Abschlussübung: Der Portfolio-Check"

    **1 · Bestandsaufnahme.** Geh dein `lab_log.md` durch. Vollständig hat es diese Abschnitte:

    | Eintrag | aus Kapitel |
    |---|---|
    | `## 01 Beschreibung` | [Anatomie](anatomie.md) |
    | `## 02a Canvas (Few-Shot)` | [Shot Prompting](shot-prompting.md) |
    | `## 02b Canvas (iteriert)` | [Iteratives Prompting](iteratives.md) |
    | `## 03 Canvas strukturiert` | [Strukturierte Ausgaben](strukturierte-ausgaben.md) |
    | `## 04 Rollen` | [Rollenbasiertes Prompting](rollen.md) |
    | `## 05 Kette` | [Prompt Chaining](chaining.md) |
    | `## 06 Kritik` | [Kritisches Prompting](kritisches.md) |
    | `## 07 Multimodal` | [Multimodales Prompting](multimodal.md) |
    | `## 08 Evaluation` | dieses Kapitel |

    **Fehlt dir ein Eintrag?** Halte fest, welcher - und welche Technik dir damit fehlt. Eine ehrliche Lücke ist ein besseres Ergebnis als ein nachträglich hingeschriebener Prompt, den du nie ausprobiert hast.

    **2 · Ein Satz je Eintrag.** Schreibe hinter jeden Prompt **eine** Zeile: *Welche Technik trägt ihn - und woran erkennt man das?* Wenn dir die Zeile nicht einfällt, ist der Eintrag Deko und kann weg.

    **3 · Die besten drei.** Markiere die drei Prompts, die du morgen tatsächlich wieder benutzen würdest. Was haben sie gemeinsam? Bei den meisten ist die Antwort: **viel Kontext, klares Format, eine einzige Aufgabe.**

    **4 · Der Vergleich.** Lies `idee.md` Version 1 und Version 2 nacheinander. Der Unterschied zwischen den beiden ist das Ergebnis dieses Kurses - nicht die Prompts.

??? lab "Optional: Der Realitätsabgleich - gilt das auch für die Großen? ⚖️"

    Der ganze Kurs läuft auf einem absichtlich schwachen Modell. Die naheliegende Frage: **Wäre das alles mit einem großen Modell nicht überflüssig gewesen?**

    Probier es aus. Nimm deinen besten und deinen schlechtesten Prompt aus dem `lab_log.md` und schicke beide an ein großes Modell - `gemma3:4b` lokal, ein Cloud-Modell über [ollama.com](https://ollama.com/search?c=cloud) oder einen der bekannten Chat-Dienste. Vergleiche mit den Antworten von `gemma3:1b`.

    ??? success "Was du beobachten solltest"

        Beim **guten** Prompt schrumpft der Abstand: Das große Modell formuliert eleganter, aber inhaltlich liegen beide erstaunlich nah beieinander. Der Prompt hat die Arbeit gemacht.

        Beim **schlechten** Prompt ist der Abstand riesig - das große Modell rettet erstaunlich viel. Es rät besser, was du gemeint haben könntest.

        Und genau darin liegt die Falle: Ein großes Modell **verdeckt** schlechte Prompts, es behebt sie nicht. Es liefert etwas Brauchbares, aber nicht unbedingt das, was du wolltest - und du merkst den Unterschied nicht mehr, weil das Ergebnis gut klingt.

        👉 Was du hier gelernt hast, wird durch bessere Modelle nicht überflüssig. Es wird nur **schwerer zu überprüfen**. Deshalb üben wir es am Zwerg.

---


## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^hallucination]: **Ji, Z., Lee, N., Frieske, R. et al. (2023):** *Survey of Hallucination in Natural Language Generation.* ACM Computing Surveys. arXiv:2202.03629. [https://arxiv.org/abs/2202.03629](https://arxiv.org/abs/2202.03629) - die Standardübersicht zum Thema. Führt die für dich wichtige Unterscheidung ein: **intrinsische** Halluzinationen widersprechen der mitgelieferten Quelle, **extrinsische** lassen sich an ihr überhaupt nicht prüfen - Letztere sind die gefährlicheren.
[^bender]: **Bender, E. M., Gebru, T., McMillan-Major, A. & Shmitchell, S. (2021):** *On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?* FAccT '21, S. 610-623. [https://doi.org/10.1145/3442188.3445922](https://doi.org/10.1145/3442188.3445922) - die grundlegende Arbeit zu Bias in Sprachmodellen: Trainingsdaten aus dem Internet bilden bestehende Ungleichgewichte ab, und schiere Datenmenge behebt das nicht, sondern zementiert es.
[^judge]: **Zheng, L., Chiang, W.-L., Sheng, Y. et al. (2023):** *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.* arXiv:2306.05685. [https://arxiv.org/abs/2306.05685](https://arxiv.org/abs/2306.05685) - untersucht, ob ein Modell die Ausgaben eines anderen bewerten kann. Ergebnis: teilweise ja - aber mit klaren Verzerrungen (Vorliebe für längere Antworten, für die eigene Ausgabe, für die zuerst gezeigte Option). Der Grund, warum du Ergebnisse nicht von derselben KI prüfen lassen solltest.