# Kritisches Prompting

KI kann nicht nur bestätigen, sondern auch **hinterfragen**. Kritisches Prompting nutzt das Modell gezielt als „Advocatus Diaboli", um blinde Flecken und Schwachstellen aufzudecken.

Das ist notwendiger, als es klingt - denn im Normalzustand ist ein LLM ein **Ja-Sager**.

---

## Das Sycophancy-Problem

???+ defi "Sycophancy (Schmeichelei)"

    Die Tendenz von Sprachmodellen, der Meinung der nutzenden Person zuzustimmen - **auch wenn diese falsch ist**.

    Ursache ist das [RLHF-Training](funktionsweise-llms.md#wie-wird-ein-llm-eigentlich-klug): Menschen bewerteten zustimmende, freundliche Antworten besser als widersprechende. Das Modell hat also gelernt, dass Zustimmung *gut ankommt* - nicht, dass sie *richtig* ist.

<div style="text-align: center;">
    <img src="https://preview.redd.it/sycophancy-has-eaten-technical-accuracy-v0-4ptu0lvzo38f1.jpeg?auto=webp&s=a7f2a0afc853e73c5c55731364f0416a2e222f0a" alt="Sycophancy-Meme" style="max-width: 50%;">
    <figcaption>Quelle: <a href="https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Fsycophancy-has-eaten-technical-accuracy-v0-4ptu0lvzo38f1.jpeg%3Fauto%3Dwebp%26s%3Da7f2a0afc853e73c5c55731364f0416a2e222f0a">Reddit</a></figcaption>
</div>

Der Effekt ist leicht zu reproduzieren. Frag ein Modell:

```{.text .ollama title="Ollama Chat"}
Ich habe eine geniale Idee: ein Lieferdienst für Bio-Lebensmittel.
...Was hältst du davon?
```

Du bekommst mit hoher Wahrscheinlichkeit eine begeisterte Antwort mit ein paar sanften „Herausforderungen" am Ende. Das Wort *„genial"* in deinem Prompt hat die Wahrscheinlichkeiten bereits in Richtung Zustimmung verschoben.

Das bedeutet: Wer die KI zur Validierung der eigenen Idee benutzt, bekommt **Bestätigung statt Prüfung**. Das fühlt sich gut an, ist aber meist wertlos. Im schlimmsten Fall investierst du Zeit und Geld in eine Idee, die dir ein Algorithmus schöngeredet hat.

???+ info "Größere Modelle lösen das nicht 🔬"

    Man könnte hoffen, das Problem verschwinde mit besseren Modellen. Die Forschung sagt das Gegenteil.

    - **Sharma et al.[^sycophancy]** wiesen Sycophancy bei **fünf führenden KI-Assistenten** nach - quer über verschiedene Aufgabentypen. Ursache ist das Training selbst: In den menschlichen Bewertungsdaten schneidet eine Antwort, die zur Meinung der nutzenden Person passt, systematisch besser ab.
    - **Perez et al.[^perez]** fanden zusätzlich, dass die Schmeichelei mit der **Modellgröße zunimmt** - und durch RLHF eher verstärkt als abgebaut wird.

    Konsequenz für dich: Sycophancy ist kein Kinderkrankheit-Problem kleiner Modelle, sondern eine **Struktureigenschaft**. Du musst sie durch deinen Prompt aushebeln - jedes Mal.

---

## Drei Techniken

### 1. Gegenargumente erzwingen

Bitte nicht um „Feedback", sondern um **Widerspruch** - und gib eine Mindestzahl vor:

<div class="grid" markdown>

!!! disadv "Schlecht"

    *„Was hältst du von meiner Idee?"*

    *„Gibt es Verbesserungspotenzial?"*

    *„Was könnte man besser machen?"*

!!! adv "Besser"

    *„Nenne genau 5 Gründe, warum diese Idee scheitern wird."*

    *„Du bist ein Investor, der ablehnt. Begründe deine Absage."*

    *„Welche Annahme ist am wahrscheinlichsten falsch?"*

</div>

### 2. Die Prämisse umkehren

Formuliere die Frage so, dass das **Scheitern vorausgesetzt** wird:

```{.text .ollama title="Ollama Chat"}
Wir schreiben das Jahr 2028. Der Bio-Lieferdienst ist gescheitert und
...insolvent. Du bist die Unternehmensberaterin, die die Insolvenz aufarbeitet.
...
...Schreibe den Abschlussbericht: Was ist schiefgelaufen? Nenne die
...drei Hauptursachen in der Reihenfolge ihrer Bedeutung.
```

Das ist die **Pre-Mortem-Methode**[^klein]: Statt zu fragen *„was könnte schiefgehen?"* setzt du voraus, dass es schiefgegangen ist. Das Modell muss dann *erklären* statt *spekulieren* - und Erklärungen fallen konkreter aus.

### 3. Annahmen sichtbar machen

Jede Geschäftsidee steht auf unausgesprochenen Voraussetzungen. Genau die sind die Sollbruchstellen:

```{.text .ollama title="Ollama Chat"}
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

    Ein Modell, das fünf Gründe fürs Scheitern nennen soll, **wird** fünf nennen - notfalls erfundene. Kritische Prompts erzeugen kritisch klingenden Text, keine geprüfte Wahrheit.

    Behandle jeden Kritikpunkt als **Hypothese**, die du selbst verifizieren musst. Der Wert liegt darin, dass dir das Modell Punkte nennt, an die du nicht gedacht hast - nicht darin, dass sie stimmen.

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren - hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Sycophancy an der eigenen Idee nachweisen"

    Stelle **dieselbe** Frage zu deiner Idee dreimal - nur das Framing ändert sich:

    - *„Ich habe eine **geniale** Idee: … Was hältst du davon?"*
    - *„Bewerte diese Geschäftsidee **sachlich**: …"*
    - *„Ich habe eine **wahrscheinlich schlechte** Idee: … Was hältst du davon?"*

    Schau dir in jeder Antwort die Lobwörter an (*großartig, ideal, perfekt, Erfolg*) und die Warnwörter (*Risiko, Problem, Konkurrenz, teuer*). Wie weit liegen Variante 1 und 3 auseinander - bei identischer Idee?


!!! lab "Übung 2: Das Pre-Mortem"

    Versetze das Modell ins Jahr 2028: Dein Unternehmen ist **gescheitert und insolvent**. Es soll als Beraterin den Abschlussbericht schreiben - genau drei Hauptursachen, je mit *Was passierte* und *Frühwarnzeichen*.

    **Leg jetzt im `lab_log.md` den Abschnitt `## 06 Kritik` an** und schreibe die drei Ursachen samt Frühwarnzeichen hinein.


??? code "🐍 Optional (Python): Red Team automatisieren"

    Vier Angriffe von Hand sind machbar - aber bei drei Ideen und acht Angreifern lohnt sich das Skript:

    ```python title="redteam.py"
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

    print("\n".join(zeilen))
    print("\n📄 Fertig - kopiere die Punkte in dein lab_log.md unter ## 06 Kritik.")
    ```

    ```title="Ausgabe"
    ⚔️  Pessimist ...
    ⚔️  Kostenjäger ...
    ⚔️  Konkurrent ...
    ⚔️  Skeptiker ...

    📄 Fertig - kopiere die Punkte in dein lab_log.md unter ## 06 Kritik.
    ```

    Im Laborbuch gehst du sie danach in Ruhe durch und markierst jeden Punkt mit ✅ / ❓ / ❌ - das bleibt Handarbeit, und das ist auch richtig so.

---


## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

--8<-- "quellen.md:klein"
--8<-- "quellen.md:perez"
--8<-- "quellen.md:sycophancy"
