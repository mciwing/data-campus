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

    Behandle jeden Kritikpunkt als **Hypothese**, die du selbst verifizieren musst ([Evaluation](evaluation.md)). Der Wert liegt darin, dass dir das Modell Punkte nennt, an die du nicht gedacht hast - nicht darin, dass sie stimmen.

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren - hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Sycophancy an der eigenen Idee nachweisen"

    Stelle **dieselbe** Frage zu deiner Idee dreimal - nur das Framing ändert sich:

    - *„Ich habe eine **geniale** Idee: … Was hältst du davon?"*
    - *„Bewerte diese Geschäftsidee **sachlich**: …"*
    - *„Ich habe eine **wahrscheinlich schlechte** Idee: … Was hältst du davon?"*

    **Zähle** in jeder Antwort die Lobwörter (*großartig, ideal, perfekt, Erfolg*) und die Warnwörter (*Risiko, Problem, Konkurrenz, teuer*).

    **Und notiere zusätzlich ein schlichtes Ja/Nein:** Nennt die Antwort mindestens ein **K.-o.-Risiko** - etwas, das die Idee wirklich scheitern lassen könnte? Diese Frage ist unbestechlicher als jede Wortzählung, denn genau darauf kommt es in der Praxis an.

    **Die unangenehme Frage:** Wie weit liegen Variante 1 und 3 auseinander - bei identischer Idee?

    ??? success "Was du beobachten solltest"

        Variante 1 liefert typischerweise drei bis fünf Lobwörter, keine oder eine sanft formulierte Einschränkung („eine gewisse Herausforderung könnte sein …") - und **kein** K.-o.-Risiko.

        Variante 3 findet plötzlich Probleme, die es in Variante 1 nicht gab. Nicht weil das Modell nachgedacht hätte, sondern weil dein Wort *„schlecht"* die Wahrscheinlichkeiten in Richtung Kritik verschoben hat.

        Variante 2 liegt dazwischen und ist trotzdem meist zu freundlich. **Die Idee war die ganze Zeit dieselbe.** Was sich geändert hat, warst du.

!!! lab "Übung 2: Das Pre-Mortem"

    Versetze das Modell ins Jahr 2028: Dein Unternehmen ist **gescheitert und insolvent**. Es soll als Beraterin den Abschlussbericht schreiben - genau drei Hauptursachen, je mit *Was passierte* und *Frühwarnzeichen*.

    Stelle dieselbe Sache vorher höflich (*„Welche Herausforderungen siehst du?"*) und **vergleiche**.

    **Die Frage:** Welche Variante nennt Punkte, die du wirklich noch nicht bedacht hattest?

    **Leg jetzt deine Datei `kritik.md` an** und schreibe die drei Ursachen samt Frühwarnzeichen als erste Einträge hinein - in der nächsten Übung kommen zwölf weitere dazu.

    ??? success "Was du beobachten solltest"

        Die höfliche Variante liefert Kategorien (*„Finanzierung", „Wettbewerb"*), das Pre-Mortem liefert **Geschichten**: *„Im zweiten Winter fielen die Lastenrad-Zustellungen aus, die Stammkunden wechselten zum Supermarkt und kamen nicht zurück."*

        Der Unterschied liegt nicht am Wissen des Modells, sondern an der Aufgabe: Ein Scheitern zu **erklären** verlangt eine kausale Kette, ein Risiko zu **nennen** nicht. Die Frühwarnzeichen sind der eigentliche Ertrag - sie sind das Einzige, worauf du ab morgen achten kannst.

!!! lab "Übung 3: Der Red-Team-Durchlauf"

    Vier Angriffe auf deine Idee, `/clear` dazwischen:

    | Angreifer | Auftrag |
    |---|---|
    | 🩸 Pessimist | *„Nenne genau 3 Gründe, warum diese Idee scheitern wird."* |
    | 💸 Kostenjäger | *„Nenne genau 3 Kostenfallen, die unterschätzt werden."* |
    | ⚔️ Konkurrent | *„Wie zerstörst du dieses Startup in 12 Monaten? Genau 3 Wege."* |
    | 🔍 Skeptiker | *„Liste genau 3 unausgesprochene Annahmen auf, die falsch sein könnten."* |

    Sammle alle zwölf Punkte in `kritik.md` - unter den Einträgen aus dem Pre-Mortem.

    ??? success "Was du beobachten solltest"

        Die vier Angreifer überschneiden sich weniger, als man erwartet. Der Konkurrent ist meist der produktivste: Weil er *gewinnen* will statt zu *warnen*, benennt er Schwachstellen, die die anderen höflich umgehen.

        Rechne mit zwei bis drei offensichtlich unzutreffenden Punkten - Kostenfallen für ein Geschäftsmodell, das du gar nicht betreibst. Das ist kein Fehler der Übung, das ist Übung 4.

!!! lab "Übung 4: Aus Kritik Arbeit machen"

    Markiere jeden Punkt in `kritik.md`:

    ✅ *stimmt - muss ich lösen* · ❓ *muss ich prüfen* · ❌ *trifft nicht zu*

    Nur ✅ und ❓ sind echte Arbeit. Dass es ❌ gibt, ist die zweite Lehre dieser Übung - auch Kritik wird halluziniert.

    !!! warning "Jedes ❌ braucht eine Begründung - einen Satz"

        Das ❌ ist die gefährlichste Markierung des Kurses. Es ist der Ort, an dem berechtigte, aber unbequeme Kritik lautlos verschwindet - und zwar nicht, weil das Modell sich geirrt hat, sondern weil du an deiner Idee hängst.

        Deshalb: **Schreibe hinter jedes ❌ einen Satz, warum der Punkt nicht zutrifft.** Wenn dir dieser Satz schwerfällt, war es in Wahrheit ein ❓.

        Zähle am Ende: Wie viele ❌ hast du vergeben - und bei wie vielen davon war die Begründung wirklich überzeugend?

    Formuliere aus den ✅-Punkten **drei konkrete Änderungen** an deiner Idee. Speichere deine Kritik-Prompts in `prompts.md` unter `## 06 Kritik`.

!!! lab "Übung 5: Die Idee fortschreiben"

    Jetzt schließt sich der Kreis. Nimm deine `idee.md` aus dem Kapitel [Anatomie](anatomie.md) - die drei bis fünf Sätze, mit denen alles anfing - und schreibe sie als **`idee.md` Version 2** neu.

    Eingearbeitet werden:

    - die **drei Änderungen** aus Übung 4,
    - die **Auflösung des Zielkonflikts** aus [Rollenbasiertes Prompting](rollen.md),
    - alles, was du beim Canvas über deine eigene Idee gelernt hast.

    **Lass Version 1 stehen.** Die beiden Fassungen nebeneinander sind das beste Argument dafür, dass sich der ganze Aufwand gelohnt hat - und die Grundlage für den Portfolio-Check am Ende des Kurses.

    ??? success "Was du beobachten solltest"

        Version 2 ist fast immer **konkreter und kleiner**: engere Zielgruppe, klarerer Startpunkt, ein Risiko bewusst ausgeklammert.

        Das ist kein Zurückrudern, sondern das übliche Ergebnis ernsthafter Kritik - und der Punkt, an dem aus einem Einfall ein Vorhaben wird.

??? code "🐍 Optional (Python): Red Team automatisieren"

    Vier Angriffe von Hand sind machbar - aber bei drei Ideen und acht Angreifern lohnt sich das Skript:

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

    Die Datei kannst du danach in Ruhe durchgehen und mit ✅ / ❓ / ❌ markieren - das bleibt Handarbeit, und das ist auch richtig so.

---


## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^sycophancy]: **Sharma, M., Tong, M., Korbak, T. et al. (2023):** *Towards Understanding Sycophancy in Language Models.* arXiv:2310.13548. [https://arxiv.org/abs/2310.13548](https://arxiv.org/abs/2310.13548) - weist Schmeichelei bei fünf führenden KI-Assistenten nach und führt sie auf das Training zurück: In den Präferenzdaten wird eine Antwort, die zur Meinung der nutzenden Person passt, systematisch bevorzugt - auch wenn sie weniger zutrifft.
[^perez]: **Perez, E., Ringer, S., Lukošiūtė, K. et al. (2022):** *Discovering Language Model Behaviors with Model-Written Evaluations.* arXiv:2212.09251. [https://arxiv.org/abs/2212.09251](https://arxiv.org/abs/2212.09251) - der beunruhigende Zusatzbefund: Sycophancy **nimmt mit der Modellgröße zu** und wird durch RLHF eher verstärkt als behoben. Bessere Modelle lösen dieses Problem also nicht von selbst.
[^klein]: **Klein, G. (2007):** *Performing a Project Premortem.* Harvard Business Review, September 2007. [https://hbr.org/2007/09/performing-a-project-premortem](https://hbr.org/2007/09/performing-a-project-premortem) - die Originalquelle der Pre-Mortem-Methode aus der Entscheidungsforschung - lange vor jeder KI entwickelt und hier lediglich auf Prompts übertragen.
