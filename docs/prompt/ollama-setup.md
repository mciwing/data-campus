# Setup: Dein eigenes LLM mit Ollama

Ab jetzt wird es praktisch. In den folgenden Kapiteln lernst du Prompting-Techniken nicht nur *kennen*, sondern probierst jede einzelne **selbst aus** – auf deinem eigenen Laptop, ohne Account, ohne Kreditkarte, ohne dass deine Daten das Gerät verlassen.

Dafür nutzen wir **Ollama**: ein kleines Programm, das Sprachmodelle lokal ausführt. Du brauchst dafür **keine Programmierkenntnisse** – alles läuft über ein Terminalfenster.

!!! quote "Warum wir absichtlich *schlechte* Modelle verwenden"

    Die Modelle, die du gleich installierst, sind **winzig** – teilweise 1000-mal kleiner als GPT-5. Sie machen Fehler, schweifen ab und ignorieren Anweisungen.

    **Genau das ist der Punkt.** 🎯

    Ein starkes Modell wie ChatGPT versteht auch einen schlampigen Prompt und liefert trotzdem etwas Brauchbares. Dabei lernst du nichts – dein Prompt wird nie *geprüft*. Ein winziges Modell ist gnadenlos ehrlich: Es liefert nur dann ein gutes Ergebnis, wenn dein Prompt wirklich gut ist.

    Wer auf einem 1-Milliarden-Parameter-Modell saubere Ergebnisse erzeugt, kann Prompt Engineering. Alles Größere ist danach ein Kinderspiel.[^brown]

!!! info "Brauche ich Python?"

    **Nein.** Der gesamte Kurs ist so aufgebaut, dass du alle Übungen im **Terminal** erledigen kannst.

    Zusätzlich findest du in jedem Kapitel einen eingeklappten Block **🐍 Optional (Python)**. Er zeigt, wie sich dieselbe Aufgabe automatisieren lässt. Wer mag, probiert es aus. Wer nicht, überspringt es ohne Verlust.

---

## 1) Ollama installieren

Die Installation läuft auf jedem Betriebssystem etwas anders – Ollama beschreibt sie für **Windows, macOS und Linux** selbst und hält die Anleitung aktuell. Deshalb verweisen wir hier bewusst dorthin, statt eine zweite Version zu pflegen, die irgendwann veraltet:

<div class="center-button" markdown>
[:material-link-variant: **Ollama herunterladen und installieren**](https://ollama.com/download){ .md-button .md-button--primary target="_blank" rel="noopener" }
</div>

Folge dort einfach der Anleitung für dein System. Danach läuft Ollama im Hintergrund – erkennbar am 🦙-Symbol in der Taskleiste (Windows) bzw. Menüleiste (macOS).

!!! info "Reicht mein Laptop?"

    Für die Modelle in diesem Kurs brauchst du **mindestens 8 GB RAM**. Eine eigene Grafikkarte ist **nicht** erforderlich – die Modelle sind bewusst klein gewählt.

### Terminal öffnen und Installation prüfen

???+ tip "Wo finde ich das Terminal?"

    - **Windows:** <kbd>Win</kbd>+<kbd>R</kbd> drücken, `cmd` eingeben, <kbd>Enter</kbd>. (Oder Startmenü → *Terminal*.)
    - **macOS:** <kbd>Cmd</kbd>+<kbd>Leertaste</kbd>, `Terminal` eingeben, <kbd>Enter</kbd>.
    - **Linux:** <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>.

Tippe im Terminal:

```bash
ollama --version
```

```title="Ausgabe"
ollama version is 0.6.2
```

Wenn eine Versionsnummer erscheint, hat alles geklappt. 🎉

??? warning "Es erscheint „Befehl nicht gefunden" / „is not recognized""

    - **Terminal neu öffnen.** Der Suchpfad wird erst in neuen Fenstern aktualisiert.
    - **Läuft Ollama überhaupt?** Suche das 🦙-Symbol in Taskleiste/Menüleiste. Falls nicht vorhanden: Ollama aus dem Startmenü bzw. Programme-Ordner starten.
    - **Linux:** In einem zweiten Terminal `ollama serve` laufen lassen.

---

## 2) Modelle herunterladen

Ein Modell wird **einmal** heruntergeladen und liegt danach lokal auf deiner Festplatte. Für den gesamten Kurs brauchst du genau **ein** Modell:

<div class="grid cards" markdown>

- :material-school: **`gemma3:1b`**

    ---

    **~815 MB** · 1 Mrd. Parameter

    Unser **Standardmodell** für alle Labore. Klein genug, um schlechte Prompts abzustrafen – groß genug, um bei guten Prompts sauber zu liefern.

</div>

???+ defi "Modellnamen lesen: was bedeutet `1b`?"

    Der Teil nach dem Doppelpunkt gibt die **Anzahl der Parameter** an – also wie viele einstellbare Zahlen im Modell stecken. Sie sind das, was beim Training „gelernt" wird.
    `1b` steht also für 1 billion (englisch) = 1 Milliarde (deutsch) – also eine Milliarde einstellbare Parameter.

    **Achtung, falscher Freund:** Englisch *billion* ist die deutsche **Milliarde** (10⁹), nicht die Billion (10¹²).

    **Faustregel:** Mehr Parameter = mehr implizit gespeichertes Wissen und feinere Nuancen – aber auch mehr Speicherbedarf, mehr Rechenzeit und höhere Kosten.

Zum Installieren genügt ein Befehl im Terminal:

```bash
ollama pull gemma3:1b
```

Prüfe anschließend, ob es angekommen ist:

```bash
ollama list
```

```title="Ausgabe (Beispiel)"
NAME               ID              SIZE      MODIFIED
gemma3:1b          8648f39daa8f    815 MB    2 minutes ago
```

Das war's – damit haben wir unser erstes lokales LLM installiert.

??? tip "Optional: zwei Modelle zum Vergleichen"

    In einigen Kapiteln gibt es freiwillige Zusatzübungen, die denselben Prompt auf einem **kleineren** und einem **größeren** Modell ausprobieren. Wenn du dort mitmachen möchtest, lade dir diese beiden dazu:

    ```bash
    ollama pull gemma3:270m
    ollama pull gemma3:4b
    ```

    | Modell | Größe | Wozu |
    |---|---|---|
    | `gemma3:270m` | ~290 MB | **Der Extremtest.** Knapp viermal kleiner. Vergisst Anweisungen, erfindet Fakten, driftet ab. Was hier funktioniert, funktioniert überall. |
    | `gemma3:4b` | ~3,3 GB | **Das Kontrastmodell.** Viermal größer – und weil alle drei aus derselben Familie stammen, ist der Unterschied wirklich die **Größe** und nicht die Trainingsdaten. Zeigt, wie viel Größe einen guten Prompt ersetzt: weniger, als man denkt. |

    Du kannst sie auch später jederzeit nachladen. Ein Modell wieder loswerden: `ollama rm gemma3:270m`

---

## 3) Dein erster Prompt

Für einen **einzelnen** Prompt hängst du ihn direkt an den Befehl an:

```bash
ollama run gemma3:1b "Nenne drei Risiken eines Bio-Lieferdienstes."
```

```title="Beispielausgabe"
Hier sind drei Risiken, die mit dem Betrieb eines Bio-Lieferdienstes verbunden sind:

1.  **Hohe Kosten und Margen:** Bio-Produkte sind oft teurer als konventionelle
    Produkte. Dies kann zu hohen Produktionskosten führen, was sich in geringeren
    Gewinnmargen für den Lieferdienst auswirken kann.
2.  **Lieferkettenprobleme und -risiken:** Der Bio-Sektor ist anfällig für
    Lieferkettenunterbrechungen aufgrund von Wetterbedingungen, Transportproblemen
    oder Schäden an Produkten während des Transports.
3.  **Nachhaltigkeits- und ethische Fragen:** Der Bio-Sektor ist oft mit
    Umweltfragen verbunden, etwa der Notwendigkeit, nachhaltige Anbaumethoden
    zu gewährleisten.

Diese Risiken können für Bio-Lieferdienste eine Herausforderung darstellen, da sie
die Rentabilität und Glaubwürdigkeit des Unternehmens beeinträchtigen können.
```

!!! warning "Deine Ausgabe wird anders aussehen"

    Alle Ausgaben in diesem Kurs sind **Beispiele**. Sprachmodelle antworten nicht jedes Mal gleich – schon derselbe Prompt liefert beim zweiten Aufruf einen anderen Text.

    Wer daraus einzelne Durchläufe verallgemeinert, zieht schnell falsche Schlüsse – ein Muster, das sich bei Prompting-Neulingen regelmäßig nachweisen lässt.[^johnny]

    Achte deshalb nie auf den *exakten Wortlaut*, sondern auf **Muster**: Ist die Antwort auf Deutsch? Hält sie das Format ein? Ist sie konkret oder allgemein? Genau darum geht es in den Laboren.

### Der Chat-Modus

Ohne Prompt am Ende des `ollama` Aufrufs startet ein fortlaufender Chat:

```bash
ollama run gemma3:1b
```

```title="Terminal"
>>> Was ist ein Business Model Canvas?
```

Das Modell antwortet – Wort für Wort, genau wie in [Station 5](funktionsweise-llms.md#5-das-nachste-token) beschrieben. Der Chat merkt sich dabei den bisherigen Verlauf (dein **Kontextfenster**).

???+ process "Die wichtigsten Befehle im Chat"

    1. `/bye` – Chat beenden und zurück ins Terminal
    2. `/clear` – Kontextfenster leeren, bei null anfangen
    3. `/set system "Du bist ein Unternehmensberater."` – eine **Systemrolle** setzen (mehr dazu in [Rollenbasiertes Prompting](rollen.md))
    4. `/set parameter temperature 0.2` – die Kreativität einstellen (siehe unten)
    5. `/show info` – technische Daten des Modells anzeigen
    6. `"""` – mehrzeilige Eingabe starten **und** beenden

### Mehrzeilige Prompts eingeben

Das brauchst du ab Kapitel 2 ständig – gute Prompts sind selten einzeilig. Tippe im Chat drei Anführungszeichen, dann deinen Text über mehrere Zeilen, dann wieder drei Anführungszeichen:

```title="Terminal"
>>> """
... # ROLLE
... Du bist Risikokapitalgeberin mit 15 Jahren Erfahrung.
...
... # AUFGABE
... Nenne die drei größten Risiken eines Bio-Lieferdienstes.
... """
```

Erst nach dem schließenden `"""` beginnt das Modell zu antworten.

???+ tip "Noch bequemer: Prompt in einer Datei schreiben"

    Lange Prompts tippt niemand gern im Terminal. Schreibe sie stattdessen in einem Texteditor und kopiere sie zwischen die `"""`.

    Lege dir dafür einen Ordner `prompt-labor` mit einer Datei `prompts.md` an – dort sammelst du im Lauf des Kurses alle Prompts, die funktioniert haben. Am Ende wird daraus deine [Prompt Library](libraries.md).

---

## 4) Die Stellschrauben

Zwei Einstellungen verändern das Verhalten des Modells spürbar. Du setzt sie im Chat-Modus mit `/set parameter`:

<div style="text-align:center; max-width:720px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Befehl</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Wirkung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>/set parameter temperature 0.2</code></td>
        <td style="padding:10px 14px;"><strong>Kreativität</strong> zwischen <code>0.0</code> und ca. <code>1.5</code>. Niedrig = vorhersagbar und faktennah. Hoch = kreativ, aber chaotisch und halluzinationsanfällig.</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>/set parameter num_predict 150</code></td>
        <td style="padding:10px 14px;"><strong>Maximale Antwortlänge</strong> in Tokens. Verhindert, dass kleine Modelle endlos weiterschwafeln.</td>
    </tr>
    </tbody>
</table>
</div>

???+ tip "Es gibt noch mehr Stellschrauben"

    Ollama kennt eine ganze Reihe weiterer Parameter – etwa `top_k`, `top_p`, `repeat_penalty` oder `num_ctx` (die Größe des [Kontextfensters](halluzinationen-kontextfenster.md)). Für den Kurs brauchst du sie nicht, aber wer tiefer einsteigen will, findet die vollständige Liste mit Wertebereichen hier: [Valid Parameters and Values](https://docs.ollama.com/modelfile#valid-parameters-and-values){ target="_blank" rel="noopener" } *(englisch)*

!!! warning "Dieselbe Frage, zwei verschiedene Antworten"

    Sprachmodelle antworten nicht reproduzierbar. Wenn du zwei Prompts vergleichst, kann der Unterschied also auch **reiner Zufall** sein. Zwei Ursachen kannst du selbst ausschalten:

    **1. Der Chatverlauf.** Fragst du im selben Chat zweimal dasselbe, steht beim zweiten Mal die erste Antwort mit im Kontext – die Ausgangslage ist gar nicht dieselbe.

    **2. Die Temperatur.** Bei jedem Wert über `0` würfelt das Modell bei der Wortauswahl mit.

    👉 Für einen fairen Vergleich also beides setzen:

    ```title="Terminal"
    >>> /set parameter temperature 0
    >>> /clear
    ```

    Auch damit bleibt eine **Restunschärfe**: Fließkomma-Berechnungen auf CPU und GPU sind nicht bit-genau wiederholbar, gelegentlich weicht eine Antwort trotzdem ab. Verlass dich deshalb nie auf einen einzelnen Durchlauf – führe jeden Vergleich **mehrfach** aus und achte auf das **Muster**, nicht auf den Wortlaut.

---

## 🔬 Ollama-Labor

!!! lab "Übung 1: Der Realitätscheck 🧪"

    Stelle demselben Modell zweimal dieselbe Sache – einmal schlampig, einmal präzise.

    ```bash
    ollama run gemma3:1b "Schreib was über mein Café"
    ```

    ```bash
    ollama run gemma3:1b "Schreibe genau 3 Sätze Werbetext für ein veganes Café in Innsbruck. Zielgruppe: Studierende. Ton: locker, ohne Superlative."
    ```

    Vergleiche den Output. Was fällt dir auf?


!!! lab "Übung 2: Temperatur erfühlen 🌡️"

    Starte den Chat-Modus und probiere denselben Prompt bei verschiedenen Temperaturen:

    ```title="Terminal"
    ollama run gemma3:1b

    >>> /set parameter temperature 0.0
    >>> Erfinde einen Namen für ein veganes Café in Innsbruck.
    >>> /clear
    >>> /set parameter temperature 1.5
    >>> Erfinde einen Namen für ein veganes Café in Innsbruck.
    ```

    Auch hier wiede: was fällt dir auf? Probiere auch verschiedene Temperaturen

??? lab "Übung 3: Der Modell-Vergleich (optional) ⚖️"

    Für diese Übung brauchst du die beiden **Vergleichsmodelle** aus Schritt 2. Schicke denselben **schlechten** Prompt an alle drei:

    ```bash
    ollama run gemma3:270m "Schreib was über mein Café"
    ollama run gemma3:1b   "Schreib was über mein Café"
    ollama run gemma3:4b   "Schreib was über mein Café"
    ```

    Wiederhole das Ganze mit dem **guten** Prompt aus Übung 0.

    ??? success "Was du beobachten solltest"

        Beim **schlechten** Prompt sind alle drei Modelle schwach – das größere ist nur etwas eloquenter im Danebenliegen.

        Beim **guten** Prompt springt die Qualität bei *allen* Modellen deutlich nach oben. Der Sprung durch den besseren Prompt ist meist **größer** als der Sprung durch das größere Modell.

        👉 Das ist die zentrale Botschaft dieses Kurses: **Ein guter Prompt ersetzt oft ein größeres Modell.**

---

## 🐍 Optional: Ollama aus Python steuern

Diesen Abschnitt kannst du **überspringen** – für den Kurs brauchst du ihn nicht. Er lohnt sich, wenn du viele Varianten systematisch vergleichen willst: zehn Prompts, drei Modelle, fünf Wiederholungen. Von Hand wird das mühsam.

??? code "🐍 Einrichtung und erstes Skript"

    Bibliothek installieren:

    ```bash
    pip install ollama
    ```

    Datei `erster_prompt.py` anlegen:

    ```python title="erster_prompt.py"
    import ollama

    antwort = ollama.chat(
        model="gemma3:1b",
        messages=[
            {"role": "user", "content": "Nenne drei Risiken eines Bio-Lieferdienstes."}
        ],
    )

    print(antwort["message"]["content"])
    ```

    Ausführen mit `python erster_prompt.py`:

    ```title="Ausgabe"
    1. Hohe Logistikkosten durch gekühlten Transport.
    2. Verderbliche Ware führt zu Verlusten bei schwankender Nachfrage.
    3. Starke Konkurrenz durch etablierte Supermärkte mit Lieferservice.
    ```

    **Zur `messages`-Liste:** Ein Chat ist technisch nur eine Liste von Nachrichten mit je einer `role` – `system` (Grundsatz-Anweisung), `user` (deine Eingaben), `assistant` (bisherige Antworten). Das Modell hat **kein Gedächtnis**: Bei jedem Aufruf schickst du die komplette Liste erneut mit. Genau deshalb füllt sich das [Kontextfenster](halluzinationen-kontextfenster.md).

??? code "🐍 Der Werkzeugkasten `llm.py`"

    Diese Datei wird in den optionalen Python-Blöcken der folgenden Kapitel immer wieder importiert. Lege sie einmal an:

    ```python title="llm.py"
    """Kleiner Helfer für die optionalen Python-Übungen."""

    import ollama

    KURSMODELL = "gemma3:1b"


    # temperatur=0 -> Antworten sind weitgehend wiederholbar.
    # Genau das willst du beim Vergleichen von Prompts.
    def frage(prompt, system=None, model=KURSMODELL, temperatur=0.0):
        """Schickt einen einzelnen Prompt an das Modell und gibt den Text zurück."""
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        antwort = ollama.chat(
            model=model,
            messages=messages,
            options={"temperature": temperatur},
        )
        return antwort["message"]["content"]
    ```

    Verwendung:

    ```python title="test.py"
    from llm import frage

    print(frage("Was ist ein Business Model Canvas?"))
    print(frage("Bewerte diese Idee: veganes Café.",
                system="Du bist ein skeptischer Investor."))
    ```

    ```title="Ausgabe (gekürzt)"
    Das Business Model Canvas ist ein Werkzeug zur Darstellung eines
    Geschäftsmodells auf einer Seite. Es besteht aus neun Feldern ...

    Der Markt für vegane Gastronomie wächst, ist aber in Städten bereits
    dicht besetzt. Entscheidend wären für mich die Mietkosten pro
    Quadratmeter und der durchschnittliche Bon pro Gast ...
    ```

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^brown]: **Brown, T. B. et al. (2020):** *Language Models are Few-Shot Learners.* arXiv:2005.14165. [https://arxiv.org/abs/2005.14165](https://arxiv.org/abs/2005.14165) — zeigt, dass die Leistung eines Modells mit der Parameterzahl stark zunimmt. Genau deshalb sind kleine Modelle so stark auf gute Prompts angewiesen.
[^johnny]: **Zamfirescu-Pereira, J. D., Wong, R. Y., Hartmann, B. & Yang, Q. (2023):** *Why Johnny Can't Prompt: How Non-AI Experts Try (and Fail) to Design LLM Prompts.* CHI '23, S. 1–21. [https://doi.org/10.1145/3544548.3581388](https://doi.org/10.1145/3544548.3581388) — empirische Studie: Ohne Rückmeldung über die Wirkung ihrer Prompts entwickeln Nicht-Fachleute keine systematische Vorgehensweise. Das eigene Labor ist genau diese Rückmeldung.
!!! info "Werkzeug-Dokumentation"

    - **Ollama:** [https://github.com/ollama/ollama/blob/main/README.md](https://github.com/ollama/ollama/blob/main/README.md)
    - **Ollama Python Library:** [https://github.com/ollama/ollama-python](https://github.com/ollama/ollama-python)
    - **Modell-Bibliothek:** [https://ollama.com/library](https://ollama.com/library)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
