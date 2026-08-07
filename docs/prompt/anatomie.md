# 2. Anatomie eines guten Prompts

Ein wirkungsvoller Prompt ist kein Zufall, sondern folgt einer **klaren Struktur**. Wer die Bausteine kennt, kann gezielt steuern, was das Modell liefert.

Die meisten Menschen prompten wie beim Googeln: ein paar Stichworte, Enter, Daumen drücken. Bei einer Suchmaschine funktioniert das, weil sie nur *finden* muss. Ein LLM soll aber *erzeugen* – und dafür braucht es dieselbe Art von Briefing, die du auch einem neuen Teammitglied geben würdest.[^zuckarelli]

!!! info "Voraussetzung für dieses Kapitel"

    Ab hier arbeiten wir praktisch. Wenn du es noch nicht getan hast, richte zuerst deinen lokalen Playground ein:

    👉 **[Setup: Dein eigenes LLM mit Ollama](ollama-setup.md)**

---

## Die fünf Bausteine

Ein vollständiger Prompt besteht aus fünf Elementen.[^schulhoff] Nicht jeder Prompt braucht alle fünf – aber je schwieriger die Aufgabe und je kleiner das Modell, desto mehr davon solltest du liefern.

```mermaid
flowchart TB
    R[🎭 Rolle<br/>Wer bist du?]:::teal --> K[📚 Kontext<br/>Was musst du wissen?]:::teal
    K --> A[🎯 Aufgabe<br/>Was sollst du tun?]:::peach
    A --> E[🚧 Einschränkungen<br/>Was gilt dabei?]:::teal
    E --> F[📄 Format<br/>Wie soll es aussehen?]:::teal
    F --> O[Antwort]:::peach

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;
```

!!! quote "Merksatz"

    **R-K-A-E-F** – *Rolle, Kontext, Aufgabe, Einschränkungen, Format.*

    Wenn eine Antwort enttäuscht, geh die fünf Buchstaben durch. In neun von zehn Fällen fehlt einer davon.

---

### 🎭 Rolle

Die Rolle legt fest, aus **welcher Perspektive** das Modell antwortet. Technisch ist das kein Zaubertrick, sondern eine direkte Folge der [Attention](funktionsweise-llms.md#station-4-attention-bedeutung-im-kontext): Das Wort *„Steuerberaterin"* im Prompt verschiebt sämtliche folgenden Wortvorhersagen in Richtung Fachsprache, Vorsicht und Paragrafen.

<div class="grid cards" markdown>

- :material-close-circle: **Ohne Rolle**

    ---

    *„Bewerte meine Geschäftsidee."*

    → allgemeine, unverbindliche Aufzählung

- :material-check-circle: **Mit Rolle**

    ---

    *„Du bist Risikokapitalgeberin mit 15 Jahren Erfahrung in der Food-Branche. Bewerte meine Geschäftsidee."*

    → konkrete Kennzahlen, kritische Rückfragen, Fokus auf Skalierbarkeit

</div>

???+ tip "Je spezifischer, desto besser"

    „Du bist Experte" bringt fast nichts – das Modell hält sich ohnehin für alles zuständig. Wirksam wird die Rolle erst durch **Spezifikation**: Fachgebiet, Erfahrungsjahre, Haltung, Zielgruppe.

    Weil das so mächtig ist, bekommt es ein eigenes Kapitel: [Rollenbasiertes Prompting](rollen.md).

---

### 📚 Kontext

Das Modell kennt **deine** Situation nicht. Es weiß nichts über dein Unternehmen, deine Zielgruppe, deine Vorgeschichte – außer dem, was im Prompt steht. Alles, was du weglässt, **erfindet** das Modell (siehe [Halluzinationen](halluzinationen-kontextfenster.md)).

???+ example "Was gehört in den Kontext?"

    - **Ausgangslage:** *„Wir sind ein Zwei-Personen-Startup mit 15.000 € Startkapital."*
    - **Zielgruppe:** *„Studierende zwischen 20 und 28 in Innsbruck."*
    - **Bisheriges:** *„Eine Umfrage unter 40 Personen ergab: der Preis ist das größte Hindernis."*
    - **Zweck:** *„Der Text ist für einen Pitch vor Business Angels gedacht."*

!!! warning "Die häufigste Ursache für schlechte Antworten"

    Nicht ein „falsch formulierter" Prompt, sondern **fehlender Kontext**. Wenn dich eine Antwort enttäuscht, frage dich zuerst: *Hätte ein Mensch mit genau diesen Informationen es besser gekonnt?* Meistens lautet die Antwort: nein.

---

### 🎯 Aufgabe

Die Aufgabe ist der Kern: **ein Verb, ein Ergebnis**. Vage Verben erzeugen vage Antworten.

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">❌ Vage</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">✅ Präzise</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">„Schreib was über X"</td>
        <td style="padding:10px 14px;">„Schreibe eine Produktbeschreibung für X in 80 Wörtern"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">„Analysiere das"</td>
        <td style="padding:10px 14px;">„Nenne die 3 größten Risiken und begründe jedes in einem Satz"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">„Mach es besser"</td>
        <td style="padding:10px 14px;">„Ersetze alle Fachbegriffe durch Alltagssprache"</td>
    </tr>
    </tbody>
</table>
</div>

???+ defi "Eine Aufgabe pro Prompt"

    Kleine Modelle führen **eine** Anweisung zuverlässig aus, zwei manchmal, fünf fast nie. Brauchst du mehrere Dinge, zerlege sie in mehrere Prompts – genau das ist [Prompt Chaining](chaining.md).

---

### 🚧 Einschränkungen

Einschränkungen grenzen den Lösungsraum ein: Umfang, Stil, Tonalität, Sprache, Tabus.

- **Umfang:** *„Maximal 100 Wörter."* / *„Genau 5 Stichpunkte."*
- **Stil & Ton:** *„Sachlich, ohne Marketing-Superlative."*
- **Sprache:** *„Antworte ausschließlich auf Deutsch."*
- **Tabus:** *„Erfinde keine Zahlen. Fehlt dir eine Angabe, schreibe `[UNBEKANNT]`."*
- **Zielgruppe:** *„Erkläre es so, dass es eine 15-jährige Person versteht."*

!!! tip "Positiv statt negativ formulieren"

    „Schreibe **keine** Einleitung" wirkt schlechter als „**Beginne direkt** mit dem ersten Stichpunkt". Ein LLM sagt das nächste wahrscheinliche Token voraus – erwähnst du „Einleitung", machst du Einleitungs-Tokens *wahrscheinlicher*.

    👉 Denk an den rosa Elefanten, an den du gerade nicht denken sollst. 🐘

---

### 📄 Ausgabeformat

Sag dem Modell **exakt**, wie das Ergebnis aussehen soll – am besten, indem du das Format vormachst:

```title="Format-Vorgabe im Prompt"
Gib das Ergebnis in genau diesem Format aus:

RISIKO 1: <Name>
Wahrscheinlichkeit: <hoch|mittel|niedrig>
Gegenmaßnahme: <ein Satz>
```

Das ist so wirksam, dass [Strukturierte Ausgaben](strukturierte-ausgaben.md) ein eigenes Kapitel bekommen.

---

## Vom schlechten zum guten Prompt

Dieselbe Absicht, zwei Prompts:

=== "❌ Der typische Prompt"

    ```title="prompt_schlecht.txt"
    Bewerte meine Geschäftsidee: ein Lieferdienst für Bio-Lebensmittel.
    ```

    **Was zurückkommt:** eine allgemeine Liste („Marktforschung ist wichtig", „achten Sie auf die Konkurrenz"), die auf *jede* Geschäftsidee passt. Nutzwert: nahe null.

=== "✅ Der strukturierte Prompt"

    ```title="prompt_gut.txt"
    # ROLLE
    Du bist Risikokapitalgeberin mit 15 Jahren Erfahrung in der
    Lebensmittelbranche.

    # KONTEXT
    Ein Zwei-Personen-Startup in Innsbruck plant einen Lieferdienst für
    regionale Bio-Lebensmittel. Startkapital: 15.000 €. Zielgruppe:
    berufstätige Familien. Es gibt bereits zwei überregionale Wettbewerber.

    # AUFGABE
    Nenne die drei größten Risiken, an denen dieses Geschäftsmodell
    scheitern könnte.

    # EINSCHRÄNKUNGEN
    - Antworte auf Deutsch.
    - Maximal 2 Sätze pro Risiko.
    - Erfinde keine Marktzahlen. Fehlt dir eine Information,
      schreibe [ANNAHME] davor.

    # FORMAT
    RISIKO <n>: <Titel>
    Warum kritisch: <ein Satz>
    Gegenmaßnahme: <ein Satz>
    ```

    **Was zurückkommt:** konkrete, auf diesen Fall zugeschnittene Risiken in einem Format, das du direkt in eine Präsentation kopieren kannst.

???+ tip "Überschriften als Struktur-Anker"

    Die `#`-Überschriften sind kein Selbstzweck. Sie trennen die Abschnitte für das Modell sauber voneinander – besonders hilfreich bei kleinen Modellen, die sonst Kontext und Aufgabe vermischen. `#`, `---` oder XML-Tags wie `<kontext>…</kontext>` funktionieren alle gut. Wichtig ist nur: **konsistent bleiben**. Solche wiederverwendbaren Strukturen werden in der Literatur als *Prompt Patterns* beschrieben – Entwurfsmuster für Prompts.[^white]

---

## 🔬 Ollama-Labor

Zeit, den Unterschied selbst zu messen. Alles im Terminal mit dem Kursmodell `qwen2.5:0.5b`.

!!! example "Übung 1: Die Bausteine einzeln zuschalten"

    Baue den Prompt schrittweise auf und beobachte, wo der größte Sprung passiert. Starte den Chat-Modus:

    ```bash
    ollama run qwen2.5:0.5b
    ```

    **Stufe 1 – nur die Aufgabe:**

    ```title="Terminal"
    >>> Nenne die drei größten Risiken für einen Bio-Lieferdienst.
    ```

    ```title="Beispielausgabe"
    Bio-Lieferdienste stehen vor mehreren Herausforderungen. Erstens ist
    die Logistik anspruchsvoll. Zweitens spielt die Qualitätssicherung eine
    große Rolle. Drittens sollte man den Markt genau beobachten und die
    Konkurrenz im Blick behalten.
    ```

    **Stufe 3 – mit Rolle und Kontext** (`/clear` nicht vergessen):

    ```title="Terminal"
    >>> /clear
    >>> """
    ... Du bist Risikokapitalgeberin mit 15 Jahren Erfahrung in der
    ... Lebensmittelbranche.
    ...
    ... Ein Zwei-Personen-Startup in Innsbruck, 15.000 € Startkapital,
    ... Zielgruppe berufstätige Familien, zwei große Wettbewerber.
    ...
    ... Nenne die drei größten Risiken für diesen Bio-Lieferdienst.
    ... """
    ```

    ```title="Beispielausgabe"
    Mit 15.000 € Startkapital ist die Kühlkette das erste Problem – ein
    gebrauchtes Kühlfahrzeug verbraucht davon bereits einen erheblichen Teil.
    Zweitens sind zwei Personen zu wenig, um Einkauf, Zustellung und
    Kundenservice parallel abzudecken. Drittens können die etablierten
    Wettbewerber ihre Preise unterbieten, sobald Sie relevant werden.
    ```

    **Stufe 5 – zusätzlich mit Einschränkungen und Format:**

    ```title="Terminal"
    >>> /clear
    >>> """
    ... Du bist Risikokapitalgeberin mit 15 Jahren Erfahrung in der
    ... Lebensmittelbranche.
    ...
    ... Ein Zwei-Personen-Startup in Innsbruck, 15.000 € Startkapital,
    ... Zielgruppe berufstätige Familien, zwei große Wettbewerber.
    ...
    ... Nenne die drei größten Risiken für diesen Bio-Lieferdienst.
    ...
    ... Antworte auf Deutsch. Maximal 2 Sätze pro Risiko. Erfinde keine Zahlen.
    ...
    ... Format je Risiko:
    ... RISIKO <n>: <Titel>
    ... Gegenmaßnahme: <ein Satz>
    ... """
    ```

    ```title="Beispielausgabe"
    RISIKO 1: Kühlkette
    Gegenmaßnahme: Zu Beginn nur ungekühlte Trockenware anbieten.

    RISIKO 2: Personelle Überlastung
    Gegenmaßnahme: Zustellung auf zwei feste Wochentage bündeln.

    RISIKO 3: Preiskampf mit Wettbewerbern
    Gegenmaßnahme: Über Regionalität statt über den Preis positionieren.
    ```

    **Deine Aufgabe:** Probiere auch Stufe 2 (nur + Rolle) und Stufe 4 (ohne Format). Bewerte jede Stufe mit 0–5 Punkten in den Kategorien *Konkretheit*, *Nutzbarkeit* und *Formattreue*. Zwischen welchen beiden Stufen liegt der größte Sprung?

!!! example "Übung 2: Der rosa Elefant 🐘"

    Prüfe die Regel „positiv statt negativ" selbst nach. Führe **jeden** Befehl dreimal aus:

    ```bash
    ollama run qwen2.5:0.5b "Beschreibe ein veganes Café in Innsbruck. Schreibe KEINE Einleitung und verwende KEINE Superlative."
    ```

    ```title="Beispielausgabe (negativ formuliert)"
    Gerne! Hier ist eine Beschreibung ohne Einleitung: Das Café ist ein
    fantastischer Ort für alle, die vegane Küche lieben ...
    ```

    ```bash
    ollama run qwen2.5:0.5b "Beschreibe ein veganes Café in Innsbruck. Beginne direkt mit dem ersten Fakt. Verwende ausschließlich sachliche Adjektive."
    ```

    ```title="Beispielausgabe (positiv formuliert)"
    Das Café liegt in der Innsbrucker Altstadt und bietet ausschließlich
    pflanzliche Speisen an. Die Karte umfasst Frühstück, Mittagsgerichte
    und hausgemachte Kuchen ...
    ```

    Beachte die erste Ausgabe: Das Modell **kündigt an**, keine Einleitung zu schreiben – und schreibt damit genau eine. Danach folgt prompt ein „fantastisch".

    **Deine Aufgabe:** Wie oft hält sich das Modell in drei Durchläufen jeweils an die Vorgabe? Notiere das Ergebnis als Bruch, z. B. „negativ: 1/3, positiv: 3/3".

??? code "🐍 Optional (Python): alle fünf Stufen automatisch durchlaufen"

    Statt fünfmal von Hand zu tippen, erledigt das ein Skript. Benötigt `llm.py` aus dem [Setup](ollama-setup.md).

    ```python title="bausteine.py"
    from llm import frage

    aufgabe = "Nenne die drei größten Risiken für einen Bio-Lieferdienst."
    rolle   = ("Du bist Risikokapitalgeberin mit 15 Jahren Erfahrung "
               "in der Lebensmittelbranche.")
    kontext = ("Ein Zwei-Personen-Startup in Innsbruck, 15.000 € Startkapital, "
               "Zielgruppe berufstätige Familien, zwei große Wettbewerber.")
    limits  = "Antworte auf Deutsch. Maximal 2 Sätze pro Risiko. Erfinde keine Zahlen."
    format_ = "Format je Risiko:\nRISIKO <n>: <Titel>\nGegenmaßnahme: <ein Satz>"

    stufen = {
        "1 – nur Aufgabe":       aufgabe,
        "2 – + Rolle":           f"{rolle}\n\n{aufgabe}",
        "3 – + Kontext":         f"{rolle}\n\n{kontext}\n\n{aufgabe}",
        "4 – + Einschränkungen": f"{rolle}\n\n{kontext}\n\n{aufgabe}\n\n{limits}",
        "5 – + Format":          f"{rolle}\n\n{kontext}\n\n{aufgabe}\n\n{limits}\n\n{format_}",
    }

    for name, prompt in stufen.items():
        print(f"\n{'=' * 60}\n{name}\n{'=' * 60}")
        print(frage(prompt))
    ```

    ```title="Ausgabe (gekürzt)"
    ============================================================
    1 – nur Aufgabe
    ============================================================
    Bio-Lieferdienste stehen vor mehreren Herausforderungen. Erstens ist
    die Logistik anspruchsvoll ...

    ============================================================
    5 – + Format
    ============================================================
    RISIKO 1: Kühlkette
    Gegenmaßnahme: Zu Beginn nur ungekühlte Trockenware anbieten.
    ...
    ```

    Der Gewinn ist nicht die Ausgabe – die bekommst du im Terminal genauso. Der Gewinn ist, dass du **eine Zeile ändern** und alle fünf Stufen erneut vergleichen kannst.

---

???+ question "Selbsttest"

    1. Nenne die fünf Bausteine eines vollständigen Prompts.
    2. Warum funktioniert „Schreibe keine Einleitung" schlechter als „Beginne direkt mit dem ersten Fakt"?
    3. Ein Kollege beschwert sich, die KI liefere nur Allgemeinplätze. Welcher Baustein fehlt vermutlich?

    ??? success "Lösungsskizze"

        1. Rolle, Kontext, Aufgabe, Einschränkungen, Format.
        2. Weil das Modell das **wahrscheinlichste nächste Token** vorhersagt. Das Wort „Einleitung" im Prompt macht Einleitungs-Tokens wahrscheinlicher – die Verneinung wiegt für die Wahrscheinlichkeitsrechnung weniger als das erwähnte Konzept selbst.
        3. Der **Kontext**. Ohne konkrete Angaben zu Situation, Zielgruppe und Zweck kann das Modell nur produzieren, was auf alles passt – und damit auf nichts richtig.

---

???+ lab "Lab"

    **Geschäftsidee auswählen**

    Wähle eine Geschäftsidee, die dich durch den gesamten Kurs begleiten wird. Sie bildet den roten Faden für alle folgenden Labs – von der Beschreibung über das Business Model Canvas bis zur kritischen Bewertung.

    **Tipp:** Wähle etwas, zu dem du selbst eine Meinung hast – dann fällt dir später auf, wenn die KI Unsinn erzählt. Halte die Idee in drei bis fünf Sätzen in einer Datei `idee.md` fest.


!!! example "Lab"

    **Business-Idee durch unterschiedlich formulierte Prompts beschreiben**

    Beschreibe deine Geschäftsidee mit mehreren, unterschiedlich aufgebauten Prompts. Variiere bewusst Rolle, Kontext und Ausgabeformat und vergleiche, wie sich die Ergebnisse verändern.

    **Konkrete Schritte:**

    1. Formuliere einen **Minimal-Prompt** (nur die Aufgabe) und lass ihn auf `qwen2.5:0.5b` laufen.
    2. Baue daraus einen **vollständigen RKAEF-Prompt** für deine Idee.
    3. Lass deinen guten Prompt zusätzlich auf `gemma3:270m` laufen. Bleibt das Ergebnis auch dort brauchbar?
    4. Notiere den finalen Prompt in deiner `prompts.md` unter der Überschrift `## 01 Beschreibung` – er ist der erste Eintrag deiner späteren [Prompt Library](libraries.md).

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^schulhoff]: **Schulhoff, S., Ilie, M., Balepur, N. et al. (2024):** *The Prompt Report: A Systematic Survey of Prompt Engineering Techniques.* arXiv:2406.06608. [https://arxiv.org/abs/2406.06608](https://arxiv.org/abs/2406.06608) — die derzeit umfassendste Systematik: 58 Prompting-Techniken und ein einheitliches Vokabular. Die hier verwendeten Bausteine finden sich dort als *Role*, *Additional Information*, *Directive*, *Style Instructions* und *Output Formatting*.
[^white]: **White, J., Fu, Q., Hays, S. et al. (2023):** *A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.* arXiv:2302.11382. [https://arxiv.org/abs/2302.11382](https://arxiv.org/abs/2302.11382) — überträgt den Gedanken der Software-Entwurfsmuster auf Prompts: wiederverwendbare Strukturen statt Einzelfalllösungen.
[^zuckarelli]: **Zuckarelli, J. L. (2025):** *Programmieren mit ChatGPT: Eine kompakte Einführung.* Springer, ISBN 978-3-662-69432-9. [https://doi.org/10.1007/978-3-662-69433-6](https://doi.org/10.1007/978-3-662-69433-6)
