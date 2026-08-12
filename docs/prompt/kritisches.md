# Kritisches Prompting

KI kann nicht nur bestätigen, sondern auch **hinterfragen**. Kritisches Prompting nutzt das Modell gezielt als „Advocatus Diaboli", um blinde Flecken und Schwachstellen aufzudecken.

Das ist notwendiger, als es klingt – denn im Normalzustand ist ein LLM ein **Ja-Sager**.

---

## Das Sycophancy-Problem

???+ defi "Sycophancy (Schmeichelei)"

    Die Tendenz von Sprachmodellen, der Meinung der nutzenden Person zuzustimmen – **auch wenn diese falsch ist**.

    Ursache ist das [RLHF-Training](funktionsweise-llms.md#wie-wird-ein-llm-eigentlich-klug): Menschen bewerteten zustimmende, freundliche Antworten besser als widersprechende. Das Modell hat also gelernt, dass Zustimmung *gut ankommt* – nicht, dass sie *richtig* ist.

Der Effekt ist leicht zu reproduzieren. Frag ein Modell:

```{.text .ollama title="Ollama Chat"}
Ich habe eine geniale Idee: ein Lieferdienst für Bio-Lebensmittel.
...Was hältst du davon?
```

Du bekommst mit hoher Wahrscheinlichkeit eine begeisterte Antwort mit ein paar sanften „Herausforderungen" am Ende. Das Wort *„genial"* in deinem Prompt hat die Wahrscheinlichkeiten bereits in Richtung Zustimmung verschoben.

!!! warning "Warum das gefährlich ist"

    Wer die KI zur Validierung der eigenen Idee benutzt, bekommt **Bestätigung statt Prüfung**. Das fühlt sich gut an und ist wertlos. Im schlimmsten Fall investierst du Zeit und Geld in eine Idee, die dir ein Algorithmus schöngeredet hat.

???+ disadv "Größere Modelle lösen das nicht 🔬"

    Man könnte hoffen, das Problem verschwinde mit besseren Modellen. Die Forschung sagt das Gegenteil.

    - **Sharma et al.[^sycophancy]** wiesen Sycophancy bei **fünf führenden KI-Assistenten** nach – quer über verschiedene Aufgabentypen. Ursache ist das Training selbst: In den menschlichen Bewertungsdaten schneidet eine Antwort, die zur Meinung der nutzenden Person passt, systematisch besser ab.
    - **Perez et al.[^perez]** fanden zusätzlich, dass die Schmeichelei mit der **Modellgröße zunimmt** – und durch RLHF eher verstärkt als abgebaut wird.

    👉 Konsequenz für dich: Sycophancy ist kein Kinderkrankheit-Problem kleiner Modelle, sondern eine **Struktureigenschaft**. Du musst sie durch deinen Prompt aushebeln – jedes Mal.

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

```{.text .ollama title="Pre-Mortem-Prompt"}
Wir schreiben das Jahr 2028. Der Bio-Lieferdienst ist gescheitert und
...insolvent. Du bist die Unternehmensberaterin, die die Insolvenz aufarbeitet.
...
...Schreibe den Abschlussbericht: Was ist schiefgelaufen? Nenne die
...drei Hauptursachen in der Reihenfolge ihrer Bedeutung.
```

Das ist die **Pre-Mortem-Methode**[^klein]: Statt zu fragen *„was könnte schiefgehen?"* setzt du voraus, dass es schiefgegangen ist. Das Modell muss dann *erklären* statt *spekulieren* – und Erklärungen fallen konkreter aus.

### 3. Annahmen sichtbar machen

Jede Geschäftsidee steht auf unausgesprochenen Voraussetzungen. Genau die sind die Sollbruchstellen:

```{.text .ollama title="Annahmen-Prompt"}
Liste alle impliziten Annahmen auf, die in dieser Geschäftsidee stecken
...und die NICHT explizit genannt wurden.
...
...Format je Annahme:
...ANNAHME: <ein Satz>
...Falls falsch: <was passiert dann?>
...Prüfbar durch: <eine konkrete Maßnahme>
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

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren – hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Sycophancy an der eigenen Idee nachweisen"

    Stelle **dieselbe** Frage zu deiner Idee dreimal – nur das Framing ändert sich:

    - *„Ich habe eine **geniale** Idee: … Was hältst du davon?"*
    - *„Bewerte diese Geschäftsidee **sachlich**: …"*
    - *„Ich habe eine **wahrscheinlich schlechte** Idee: … Was hältst du davon?"*

    **Zähle** in jeder Antwort die Lobwörter (*großartig, ideal, perfekt, Erfolg*) und die Warnwörter (*Risiko, Problem, Konkurrenz, teuer*).

    **Die unangenehme Frage:** Wie weit liegen Variante 1 und 3 auseinander – bei identischer Idee?

!!! lab "Übung 2: Das Pre-Mortem"

    Versetze das Modell ins Jahr 2028: Dein Unternehmen ist **gescheitert und insolvent**. Es soll als Beraterin den Abschlussbericht schreiben – genau drei Hauptursachen, je mit *Was passierte* und *Frühwarnzeichen*.

    Stelle dieselbe Sache vorher höflich (*„Welche Herausforderungen siehst du?"*) und **vergleiche**.

    **Die Frage:** Welche Variante nennt Punkte, die du wirklich noch nicht bedacht hattest?

!!! lab "Übung 3: Der Red-Team-Durchlauf"

    Vier Angriffe auf deine Idee, `/clear` dazwischen:

    | Angreifer | Auftrag |
    |---|---|
    | 🩸 Pessimist | *„Nenne genau 3 Gründe, warum diese Idee scheitern wird."* |
    | 💸 Kostenjäger | *„Nenne genau 3 Kostenfallen, die unterschätzt werden."* |
    | ⚔️ Konkurrent | *„Wie zerstörst du dieses Startup in 12 Monaten? Genau 3 Wege."* |
    | 🔍 Skeptiker | *„Liste genau 3 unausgesprochene Annahmen auf, die falsch sein könnten."* |

    Sammle alle zwölf Punkte in `kritik.md`.

!!! lab "Übung 4: Aus Kritik Arbeit machen"

    Markiere jeden der zwölf Punkte:

    ✅ *stimmt – muss ich lösen* · ❓ *muss ich prüfen* · ❌ *trifft nicht zu*

    Nur ✅ und ❓ sind echte Arbeit. Dass es ❌ gibt, ist die zweite Lehre dieser Übung – auch Kritik wird halluziniert.

    Formuliere aus den ✅-Punkten **drei konkrete Änderungen** an deiner Idee. Speichere deine Kritik-Prompts in `prompts.md` unter `## 06 Kritik`.

??? code "🐍 Optional (Python): Red Team automatisieren"

    Vier Angriffe von Hand sind machbar – aber bei drei Ideen und acht Angreifern lohnt sich das Skript:

    ```python title="redteam.py"
    from pathlib import Path
    from llm import frage

    IDEE = ("Bio-Lieferdienst in Innsbruck, zwei Gründer, "
            "15.000 € Startkapital, Lastenrad-Zustellung.")

    ANGRIFFE = {
        "Pessimist":   "Nenne genau 3 Gründe, warum diese Idee scheitern wird.",
        "Kostenjäger": "Nenne genau 3 Kostenfallen, die unterschätzt werden.",
        "Konkurrent":  ("Du bist ein etablierter Wettbewerber. Wie zerstörst du "
                        "dieses Startup innerhalb von 12 Monaten? Genau 3 Wege."),
        "Skeptiker":   ("Liste genau 3 implizite Annahmen auf, die nicht "
                        "ausgesprochen wurden und falsch sein könnten."),
    }

    zeilen = ["# Red-Team-Bericht", "", f"**Idee:** {IDEE}", ""]

    for name, auftrag in ANGRIFFE.items():
        print(f"⚔️  {name} ...")
        kritik = frage(f"Geschäftsidee: {IDEE}\n\n{auftrag}\n"
                       "Antworte auf Deutsch, ein Satz pro Punkt, keine Einleitung.")
        zeilen += [f"## {name}", "", kritik, ""]

    Path("kritik.md").write_text("\n".join(zeilen), encoding="utf-8")
    print("\n📄 12 Kritikpunkte gespeichert in kritik.md")
    ```

    ```title="Ausgabe"
    ⚔️  Pessimist ...
    ⚔️  Kostenjäger ...
    ⚔️  Konkurrent ...
    ⚔️  Skeptiker ...

    📄 12 Kritikpunkte gespeichert in kritik.md
    ```

    Die Datei kannst du danach in Ruhe durchgehen und mit ✅ / ❓ / ❌ markieren – das bleibt Handarbeit, und das ist auch richtig so.

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

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^sycophancy]: **Sharma, M., Tong, M., Korbak, T. et al. (2023):** *Towards Understanding Sycophancy in Language Models.* arXiv:2310.13548. [https://arxiv.org/abs/2310.13548](https://arxiv.org/abs/2310.13548) — weist Schmeichelei bei fünf führenden KI-Assistenten nach und führt sie auf das Training zurück: In den Präferenzdaten wird eine Antwort, die zur Meinung der nutzenden Person passt, systematisch bevorzugt – auch wenn sie weniger zutrifft.
[^perez]: **Perez, E., Ringer, S., Lukošiūtė, K. et al. (2022):** *Discovering Language Model Behaviors with Model-Written Evaluations.* arXiv:2212.09251. [https://arxiv.org/abs/2212.09251](https://arxiv.org/abs/2212.09251) — der beunruhigende Zusatzbefund: Sycophancy **nimmt mit der Modellgröße zu** und wird durch RLHF eher verstärkt als behoben. Bessere Modelle lösen dieses Problem also nicht von selbst.
[^klein]: **Klein, G. (2007):** *Performing a Project Premortem.* Harvard Business Review, September 2007. [https://hbr.org/2007/09/performing-a-project-premortem](https://hbr.org/2007/09/performing-a-project-premortem) — die Originalquelle der Pre-Mortem-Methode aus der Entscheidungsforschung – lange vor jeder KI entwickelt und hier lediglich auf Prompts übertragen.
