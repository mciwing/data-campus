# 8. Kritisches Prompting

KI kann nicht nur bestätigen, sondern auch **hinterfragen**. Kritisches Prompting nutzt das Modell gezielt als „Advocatus Diaboli", um blinde Flecken und Schwachstellen aufzudecken.

Das ist notwendiger, als es klingt – denn im Normalzustand ist ein LLM ein **Ja-Sager**.

---

## Das Sycophancy-Problem

???+ defi "Sycophancy (Schmeichelei)"

    Die Tendenz von Sprachmodellen, der Meinung der nutzenden Person zuzustimmen – **auch wenn diese falsch ist**.

    Ursache ist das [RLHF-Training](funktionsweise-llms.md#wie-wird-ein-llm-eigentlich-klug-das-training): Menschen bewerteten zustimmende, freundliche Antworten besser als widersprechende. Das Modell hat also gelernt, dass Zustimmung *gut ankommt* – nicht, dass sie *richtig* ist.

Der Effekt ist leicht zu reproduzieren. Frag ein Modell:

> *„Ich habe eine geniale Idee: ein Lieferdienst für Bio-Lebensmittel. Was hältst du davon?"*

Du bekommst mit hoher Wahrscheinlichkeit eine begeisterte Antwort mit ein paar sanften „Herausforderungen" am Ende. Das Wort *„genial"* in deinem Prompt hat die Wahrscheinlichkeiten bereits in Richtung Zustimmung verschoben.

!!! warning "Warum das gefährlich ist"

    Wer die KI zur Validierung der eigenen Idee benutzt, bekommt **Bestätigung statt Prüfung**. Das fühlt sich gut an und ist wertlos. Im schlimmsten Fall investierst du Zeit und Geld in eine Idee, die dir ein Algorithmus schöngeredet hat.

---

## Drei Techniken

### 1. Gegenargumente erzwingen

Bitte nicht um „Feedback", sondern um **Widerspruch** – und gib eine Mindestzahl vor:

<div class="grid cards" markdown>

- :material-close-circle: **Wirkungslos**

    ---

    *„Was hältst du von meiner Idee?"*
    *„Gibt es Verbesserungspotenzial?"*
    *„Was könnte man besser machen?"*

- :material-check-circle: **Wirksam**

    ---

    *„Nenne genau 5 Gründe, warum diese Idee scheitern wird."*
    *„Du bist ein Investor, der ablehnt. Begründe deine Absage."*
    *„Welche Annahme ist am wahrscheinlichsten falsch?"*

</div>

???+ tip "Der Zahlen-Trick"

    „Nenne **genau fünf** Schwachstellen" wirkt stärker als „Nenne Schwachstellen". Ohne Zahl hört das Modell nach zwei höflichen Punkten auf. Mit Zahl muss es weitergraben – und Punkt 4 und 5 sind oft die interessantesten.

### 2. Die Prämisse umkehren

Formuliere die Frage so, dass das **Scheitern vorausgesetzt** wird:

```title="Pre-Mortem-Prompt"
Wir schreiben das Jahr 2028. Der Bio-Lieferdienst ist gescheitert und
insolvent. Du bist die Unternehmensberaterin, die die Insolvenz aufarbeitet.

Schreibe den Abschlussbericht: Was ist schiefgelaufen? Nenne die
drei Hauptursachen in der Reihenfolge ihrer Bedeutung.
```

Das ist die **Pre-Mortem-Methode** (Klein, 2007): Statt zu fragen *„was könnte schiefgehen?"* setzt du voraus, dass es schiefgegangen ist. Das Modell muss dann *erklären* statt *spekulieren* – und Erklärungen fallen konkreter aus.

### 3. Annahmen sichtbar machen

Jede Geschäftsidee steht auf unausgesprochenen Voraussetzungen. Genau die sind die Sollbruchstellen:

```title="Annahmen-Prompt"
Liste alle impliziten Annahmen auf, die in dieser Geschäftsidee stecken
und die NICHT explizit genannt wurden.

Format je Annahme:
ANNAHME: <ein Satz>
Falls falsch: <was passiert dann?>
Prüfbar durch: <eine konkrete Maßnahme>
```

!!! quote "Merksatz"

    Eine Idee scheitert selten an dem, was du bedacht hast. Sie scheitert an dem, was du für **selbstverständlich** gehalten hast.

---

## Kritik einordnen

!!! danger "Kritik ist auch nur Wahrscheinlichkeit"

    Ein Modell, das fünf Gründe fürs Scheitern nennen soll, **wird** fünf nennen – notfalls erfundene. Kritische Prompts erzeugen kritisch klingenden Text, keine geprüfte Wahrheit.

    Behandle jeden Kritikpunkt als **Hypothese**, die du selbst verifizieren musst ([Evaluation](evaluation.md)). Der Wert liegt darin, dass dir das Modell Punkte nennt, an die du nicht gedacht hast – nicht darin, dass sie stimmen.

???+ process "Kritik nutzbar machen"

    1. **Sammeln** – alle Kritikpunkte ungefiltert notieren.
    2. **Sortieren** – nach *Eintrittswahrscheinlichkeit* × *Schadenshöhe*.
    3. **Prüfen** – ist der Punkt sachlich zutreffend? Wo ist der Beleg?
    4. **Entscheiden** – lösen, akzeptieren oder verwerfen.
    5. **Dokumentieren** – auch das bewusste Ignorieren ist eine Entscheidung.

---

## 🔬 Ollama-Labor

!!! example "Übung 1: Sycophancy nachweisen"

    Dieselbe Idee, zwei Framings – beobachte, wie das Modell die Wertung übernimmt.

    ```python title="sycophancy.py"
    from llm import frage

    IDEE = "ein Lieferdienst für Bio-Lebensmittel in Innsbruck per Lastenrad"

    varianten = {
        "POSITIV geframed":
            f"Ich habe eine geniale Idee: {IDEE}. Was hältst du davon?",
        "NEUTRAL geframed":
            f"Bewerte diese Geschäftsidee sachlich: {IDEE}.",
        "NEGATIV geframed":
            f"Ich habe eine wahrscheinlich schlechte Idee: {IDEE}. Was hältst du davon?",
    }

    POSITIV_WOERTER = ["großartig", "toll", "super", "vielversprechend",
                       "spannend", "gut", "innovativ", "genial"]
    NEGATIV_WOERTER = ["problem", "risiko", "schwierig", "kaum", "gering",
                       "scheitern", "konkurrenz", "teuer"]

    for name, prompt in varianten.items():
        antwort = frage(prompt).lower()
        p = sum(antwort.count(w) for w in POSITIV_WOERTER)
        n = sum(antwort.count(w) for w in NEGATIV_WOERTER)
        print(f"\n{name}\n  positiv: {p:>2} | negativ: {n:>2}")
        print(f"  {antwort[:200]}...")
    ```

    **Erwartung:** Die positiv geframte Variante erzeugt deutlich mehr Lob – bei *identischer* Idee. Das ist Sycophancy, live gemessen.

!!! example "Übung 2: Das Pre-Mortem"

    ```python title="premortem.py"
    from llm import frage

    IDEE = ("Lieferdienst für regionale Bio-Lebensmittel in Innsbruck, "
            "zwei Gründer, 15.000 € Startkapital, Lastenrad-Zustellung.")

    hoeflich = frage(f"Idee: {IDEE}\n\nWelche Herausforderungen siehst du?")

    premortem = frage(f"""Wir schreiben das Jahr 2028. Dieses Unternehmen ist
    gescheitert und insolvent:

    {IDEE}

    Du bist die Unternehmensberaterin, die die Insolvenz aufarbeitet. Schreibe
    den Abschlussbericht. Nenne genau 3 Hauptursachen des Scheiterns, sortiert
    nach Bedeutung. Format:
    URSACHE <n>: <Titel>
    Was passierte: <ein Satz>
    Frühwarnzeichen: <ein Satz>""")

    print(f"HÖFLICHE FRAGE:\n{hoeflich}\n\n{'=' * 60}\n")
    print(f"PRE-MORTEM:\n{premortem}")
    ```

    Vergleiche: Welche Variante liefert Punkte, die du **wirklich** noch nicht bedacht hattest?

??? question "Übung 3: Der Red-Team-Durchlauf (Python)"

    Baue eine Funktion, die eine Idee durch mehrere kritische Perspektiven schickt und die Kritikpunkte sammelt.

    ```python title="redteam.py"
    from llm import frage

    ANGRIFFE = {
        "Pessimist":  "Nenne genau 3 Gründe, warum diese Idee scheitern wird.",
        "Kostenjäger": "Nenne genau 3 Kostenfallen, die unterschätzt werden.",
        "Konkurrent": ("Du bist ein etablierter Wettbewerber. Wie zerstörst du "
                       "dieses Startup innerhalb von 12 Monaten? Genau 3 Wege."),
        "Skeptiker":  ("Liste genau 3 implizite Annahmen auf, die nicht "
                       "ausgesprochen wurden und falsch sein könnten."),
    }

    def redteam(idee, angriffe=ANGRIFFE):
        """Gibt {angriffsname: kritik} zurück."""
        # TODO 1: jeden Angriff mit der Idee kombinieren und frage() aufrufen
        # TODO 2: Ergebnisse sammeln und ausgeben
        # TODO 3: am Ende alle Kritikpunkte in eine Datei kritik.md schreiben
        ...
    ```

    ??? success "Lösungsvorschlag"

        ```python title="redteam.py"
        from pathlib import Path
        from llm import frage

        def redteam(idee, angriffe=ANGRIFFE):
            ergebnisse = {}

            for name, auftrag in angriffe.items():
                print(f"\n{'=' * 55}\n⚔️  {name}\n{'=' * 55}")
                antwort = frage(
                    f"Geschäftsidee: {idee}\n\n{auftrag}\n"
                    "Antworte auf Deutsch, ein Satz pro Punkt, keine Einleitung."
                )
                print(antwort)
                ergebnisse[name] = antwort

            # Gesammelte Kritik als Markdown sichern
            zeilen = ["# Red-Team-Bericht\n", f"**Idee:** {idee}\n"]
            for name, kritik in ergebnisse.items():
                zeilen.append(f"\n## {name}\n\n{kritik}\n")
            Path("kritik.md").write_text("\n".join(zeilen), encoding="utf-8")
            print("\n📄 Gespeichert als kritik.md")

            return ergebnisse
        ```

        **Der nächste Schritt** ist der eigentlich wertvolle: Lies `kritik.md` durch und markiere jeden Punkt mit ✅ *(stimmt, muss ich lösen)*, ❓ *(muss ich prüfen)* oder ❌ *(trifft nicht zu)*. Nur die ✅ und ❓ sind Arbeit – die ❌ sind Halluzinationen.

---

???+ question "Selbsttest"

    1. Was bedeutet *Sycophancy* und wie entsteht sie?
    2. Warum ist „Nenne genau 5 Schwachstellen" wirksamer als „Was könnte man verbessern?"
    3. Warum darfst du KI-Kritik nicht ungeprüft übernehmen?

    ??? success "Lösungsskizze"

        1. Die Neigung des Modells, der nutzenden Person zuzustimmen – auch bei falschen Aussagen. Sie entsteht im RLHF-Training, weil Menschen zustimmende Antworten besser bewertet haben.
        2. Weil die feste Zahl das Modell zwingt, über die zwei naheliegenden Höflichkeitspunkte hinauszugehen. Ohne Zahl endet es nach den offensichtlichen Punkten.
        3. Weil kritischer Text nach demselben Wahrscheinlichkeitsprinzip entsteht wie zustimmender. Wer fünf Gründe fordert, bekommt fünf – notfalls erfundene. Jeder Punkt ist eine Hypothese, kein Befund.

---

!!! example "Lab"

    **Eigene Geschäftsidee zerstören lassen**

    Fordere die KI auf, deine Geschäftsidee so hart wie möglich zu kritisieren und alle Schwachstellen offenzulegen. Nutze die Gegenargumente, um deine Idee robuster zu machen.

    **Konkrete Schritte:**

    1. Weise zuerst die **Sycophancy** an deiner eigenen Idee nach (Übung 1) – mit positivem und neutralem Framing.
    2. Schicke deine Idee durch den **Red-Team-Durchlauf** (Übung 3).
    3. Ergänze ein **Pre-Mortem** für das Jahr 2028.
    4. Sortiere alle Kritikpunkte in `kritik.md` nach ✅ / ❓ / ❌ und begründe je Punkt in einem Satz.
    5. Formuliere aus den ✅-Punkten **drei konkrete Änderungen** an deiner Idee.
    6. Speichere deine besten Kritik-Prompts als `prompts/06_kritik.md`.

---

## Quellen

!!! info "Literatur"

    - **Sharma, M. et al. (2023):** *Towards Understanding Sycophancy in Language Models.* arXiv:2310.13548. [https://arxiv.org/abs/2310.13548](https://arxiv.org/abs/2310.13548)
    - **Klein, G. (2007):** *Performing a Project Premortem.* Harvard Business Review. [https://hbr.org/2007/09/performing-a-project-premortem](https://hbr.org/2007/09/performing-a-project-premortem)
    - **Ouyang, L. et al. (2022):** *Training language models to follow instructions with human feedback.* arXiv:2203.02155. [https://arxiv.org/abs/2203.02155](https://arxiv.org/abs/2203.02155)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
