# Setup: Dein eigenes LLM mit Ollama 🦙

Ab jetzt wird es praktisch. In den folgenden Kapiteln lernst du Prompting-Techniken nicht nur *kennen*, sondern probierst jede einzelne **selbst aus** – auf deinem eigenen Laptop, ohne Account, ohne Kreditkarte, ohne dass deine Daten das Gerät verlassen.

Dafür nutzen wir **Ollama**: ein kleines Programm, das Sprachmodelle lokal ausführt. Du brauchst dafür **keine Programmierkenntnisse** – alles läuft über ein Terminalfenster.

!!! quote "Warum wir absichtlich *schlechte* Modelle verwenden"

    Die Modelle, die du gleich installierst, sind **winzig** – teilweise 1000-mal kleiner als GPT-5. Sie machen Fehler, schweifen ab und ignorieren Anweisungen.

    **Genau das ist der Punkt.** 🎯

    Ein starkes Modell wie ChatGPT versteht auch einen schlampigen Prompt und liefert trotzdem etwas Brauchbares. Dabei lernst du nichts – dein Prompt wird nie *geprüft*. Ein winziges Modell ist gnadenlos ehrlich: Es liefert nur dann ein gutes Ergebnis, wenn dein Prompt wirklich gut ist.

    Wer auf einem 0,5-Milliarden-Parameter-Modell saubere Ergebnisse erzeugt, kann Prompt Engineering. Alles Größere ist danach ein Kinderspiel.

!!! info "Brauche ich Python?"

    **Nein.** Der gesamte Kurs ist so aufgebaut, dass du alle Übungen im **Terminal** erledigen kannst.

    Zusätzlich findest du in jedem Kapitel einen eingeklappten Block **🐍 Optional (Python)**. Er zeigt, wie sich dieselbe Aufgabe automatisieren lässt – **inklusive der Ausgabe**, damit du den Code auch dann verstehst, wenn du ihn nie ausführst. Wer mag, probiert es aus. Wer nicht, überspringt es ohne Verlust.

---

## Schritt 1: Ollama installieren

=== ":material-microsoft-windows: Windows"

    1. Lade den Installer von [ollama.com/download](https://ollama.com/download) herunter.
    2. Führe `OllamaSetup.exe` aus und folge dem Assistenten (keine Admin-Rechte nötig).
    3. Ollama startet automatisch und läuft ab jetzt im Hintergrund – erkennbar am 🦙-Symbol im Infobereich der Taskleiste.

    **Systemvoraussetzung:** Windows 10 oder neuer, mindestens **8 GB RAM**. Eine Grafikkarte ist *nicht* erforderlich.

=== ":material-apple: macOS"

    1. Lade die App von [ollama.com/download](https://ollama.com/download) herunter.
    2. Entpacke sie und ziehe `Ollama.app` in den Ordner *Programme*.
    3. Starte die App einmal – danach läuft sie im Hintergrund (🦙 in der Menüleiste).

    Alternativ per Homebrew:

    ```bash
    brew install ollama
    ```

    **Systemvoraussetzung:** macOS 12+, mindestens **8 GB RAM**. Auf Apple Silicon (M1–M4) läuft alles besonders flott.

=== ":material-linux: Linux"

    Ein einziger Befehl genügt:

    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```

    Danach den Dienst starten (falls nicht automatisch geschehen):

    ```bash
    ollama serve
    ```

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

## Schritt 2: Deine Modelle herunterladen

Ein Modell wird **einmal** heruntergeladen und liegt danach lokal auf deiner Festplatte. Wir arbeiten im Kurs mit drei bewusst kleinen Modellen:

<div class="grid cards" markdown>

- :material-feather: **`gemma3:270m` — Das Winzige**

    ---

    **~290 MB** · 270 Mio. Parameter

    Kaum größer als ein Foto-Album. Vergisst Anweisungen, erfindet Fakten, driftet ab. Unser **Extremtest**: Was hier funktioniert, funktioniert überall.

- :material-school: **`qwen2.5:0.5b` — Das Kursmodell** ⭐

    ---

    **~400 MB** · 500 Mio. Parameter

    Unser **Standardmodell** für alle Labore. Klein genug, um schlechte Prompts abzustrafen – groß genug, um bei guten Prompts sauber zu liefern.

- :material-rocket-launch: **`llama3.2:1b` — Der Vergleich**

    ---

    **~1,3 GB** · 1 Mrd. Parameter

    Deutlich besser im Deutschen. Nutzen wir als **Kontrastmodell**: Wie viel Modellgröße ersetzt einen guten Prompt? (Antwort: weniger als du denkst.)

</div>

Lade alle drei herunter – zusammen rund **2 GB**:

```bash
ollama pull gemma3:270m
ollama pull qwen2.5:0.5b
ollama pull llama3.2:1b
```

Prüfe anschließend, was installiert ist:

```bash
ollama list
```

```title="Ausgabe (Beispiel)"
NAME               ID              SIZE      MODIFIED
llama3.2:1b        baf6a787fdff    1.3 GB    2 minutes ago
qwen2.5:0.5b       a8b0c5157701    397 MB    3 minutes ago
gemma3:270m        e7d36fb2c3b3    292 MB    4 minutes ago
```

???+ tip "Wenig Speicherplatz oder langsames Internet?"

    Es reicht völlig, **nur `qwen2.5:0.5b`** zu laden. Alle Pflicht-Übungen im Kurs funktionieren damit. `gemma3:270m` und `llama3.2:1b` brauchst du nur für die optionalen Vergleichsexperimente.

    Ein Modell wieder loswerden: `ollama rm gemma3:270m`

---

## Schritt 3: Dein erster Prompt

Für einen **einzelnen** Prompt hängst du ihn direkt an den Befehl an:

```bash
ollama run qwen2.5:0.5b "Nenne drei Risiken eines Bio-Lieferdienstes."
```

```title="Beispielausgabe"
1. Hohe Logistikkosten durch gekühlten Transport.
2. Verderbliche Ware führt zu Verlusten bei schwankender Nachfrage.
3. Starke Konkurrenz durch etablierte Supermärkte mit Lieferservice.
```

!!! warning "Deine Ausgabe wird anders aussehen"

    Alle Ausgaben in diesem Kurs sind **Beispiele**. Sprachmodelle antworten nicht jedes Mal gleich – schon derselbe Prompt liefert beim zweiten Aufruf einen anderen Text.

    Achte deshalb nie auf den *exakten Wortlaut*, sondern auf **Muster**: Ist die Antwort auf Deutsch? Hält sie das Format ein? Ist sie konkret oder allgemein? Genau darum geht es in den Laboren.

### Der Chat-Modus

Ohne Prompt am Ende startet ein fortlaufender Chat:

```bash
ollama run qwen2.5:0.5b
```

```title="Terminal"
>>> Was ist ein Business Model Canvas?
```

Das Modell antwortet – Wort für Wort, genau wie in [Station 5](funktionsweise-llms.md#station-5-das-nachste-token-ein-wort-nach-dem-anderen) beschrieben. Der Chat merkt sich dabei den bisherigen Verlauf (dein **Kontextfenster**).

???+ process "Die wichtigsten Befehle im Chat"

    1. `/bye` – Chat beenden und zurück ins Terminal
    2. `/clear` – Kontextfenster leeren, bei null anfangen
    3. `/set system "Du bist ein Unternehmensberater."` – eine **Systemrolle** setzen (mehr dazu in [Rollenbasiertes Prompting](rollen.md))
    4. `/set parameter temperature 0.2` – die Kreativität einstellen (siehe unten)
    5. `/show info` – technische Daten des Modells anzeigen
    6. `"""` – mehrzeilige Eingabe starten **und** beenden

### Mehrzeilige Prompts eingeben ⭐

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

## Schritt 4: Die Stellschrauben

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
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>/set parameter seed 42</code></td>
        <td style="padding:10px 14px;"><strong>Zufalls-Startwert.</strong> Gleicher Seed + gleicher Prompt = gleiche Antwort. Nützlich, wenn du zwei Prompts fair vergleichen willst.</td>
    </tr>
    </tbody>
</table>
</div>

!!! warning "Nicht-Determinismus"

    Ohne festen `seed` bekommst du bei identischem Prompt **unterschiedliche Antworten**. Wenn du also zwei Prompts vergleichst, kann der Unterschied auch reiner Zufall sein.

    👉 Führe jeden Vergleich **mehrfach** aus und achte auf das Gesamtbild – nicht auf einen einzelnen Durchlauf.

---

## 🔬 Deine ersten Experimente

!!! example "Übung 0: Der Realitätscheck 🧪"

    Stelle demselben Modell zweimal dieselbe Sache – einmal schlampig, einmal präzise.

    ```bash
    ollama run qwen2.5:0.5b "Schreib was über mein Café"
    ```

    ```title="Beispielausgabe"
    Cafés sind beliebte Orte, an denen Menschen zusammenkommen, um Kaffee
    zu trinken und sich zu unterhalten. Die Geschichte des Kaffeehauses
    reicht bis ins 17. Jahrhundert zurück. Möchten Sie mehr über die
    Geschichte von Cafés erfahren oder benötigen Sie Hilfe bei einem
    bestimmten Aspekt Ihres Cafés?
    ```

    ```bash
    ollama run qwen2.5:0.5b "Schreibe genau 3 Sätze Werbetext für ein veganes Café in Innsbruck. Zielgruppe: Studierende. Ton: locker, ohne Superlative."
    ```

    ```title="Beispielausgabe"
    Mitten in Innsbruck gibt es jetzt ein Café, in dem alles vegan ist –
    vom Kuchen bis zum Cappuccino. Mit Studierendenausweis zahlst du
    weniger, und WLAN gibt es sowieso. Komm vorbei, wenn die Bibliothek
    zu voll ist.
    ```

    Prompt 1 liefert eine Enzyklopädie-Einleitung über Cafés im Allgemeinen – und stellt am Ende eine Rückfrage, statt die Aufgabe zu erledigen. Prompt 2 liefert trotz des winzigen Modells etwas, das man tatsächlich verwenden könnte.

    **Das ist der gesamte Kurs in zwei Befehlen.** Genau diesen Effekt zerlegen wir ab dem nächsten Kapitel in seine Bestandteile.

!!! example "Übung 1: Temperatur erfühlen 🌡️"

    Starte den Chat-Modus und probiere denselben Prompt bei verschiedenen Temperaturen:

    ```title="Terminal"
    ollama run qwen2.5:0.5b

    >>> /set parameter temperature 0.0
    >>> Erfinde einen Namen für ein veganes Café in Innsbruck.
    >>> /set parameter temperature 1.5
    >>> Erfinde einen Namen für ein veganes Café in Innsbruck.
    ```

    ```title="Beispielausgabe bei temperature 0.0"
    Grünes Café
    ```

    ```title="Beispielausgabe bei temperature 1.5"
    Wie wäre es mit "Sprossenwerk Alpin"? Oder – falls es verspielter sein
    darf – "Karottenkaiser", "Nordkette Nosh" oder "Tofu & Türmchen".
    ```

    **Deine Aufgabe:** Probiere auch `0.5` und `1.0`. Ab welchem Wert wird es kreativ? Ab welchem unbrauchbar? Notiere dir deinen persönlichen Sweet Spot – du brauchst ihn in allen weiteren Kapiteln.

??? example "Übung 2: Der Modell-Vergleich (optional) ⚖️"

    Schicke **denselben schlechten** Prompt an alle drei Modelle:

    ```bash
    ollama run gemma3:270m  "Schreib was über mein Café"
    ollama run qwen2.5:0.5b "Schreib was über mein Café"
    ollama run llama3.2:1b  "Schreib was über mein Café"
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
        model="qwen2.5:0.5b",
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

    KURSMODELL = "qwen2.5:0.5b"


    def frage(prompt, system=None, model=KURSMODELL, temperatur=0.3, seed=42):
        """Schickt einen einzelnen Prompt an das Modell und gibt den Text zurück."""
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        antwort = ollama.chat(
            model=model,
            messages=messages,
            options={"temperature": temperatur, "seed": seed},
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

## Fehlerbehebung 🔧

??? warning "„model not found" / „pull model manifest failed""

    Das Modell ist nicht geladen. Prüfe mit `ollama list`, was da ist, und lade es ggf. nach: `ollama pull qwen2.5:0.5b`. Achte auf **exakte** Schreibweise inklusive Tag (`qwen2.5:0.5b`, nicht `qwen2.5`).

??? warning "Die Antworten kommen extrem langsam"

    - Schließe speicherhungrige Programme (Browser mit 50 Tabs 👀).
    - Nimm ein kleineres Modell: `gemma3:270m` statt `llama3.2:1b`.
    - Begrenze die Antwortlänge mit `/set parameter num_predict 150`.
    - Die erste Antwort nach dem Start dauert immer länger – das Modell wird in den Arbeitsspeicher geladen.

??? warning "Das Modell antwortet auf Englisch, obwohl ich Deutsch frage"

    Typisch für sehr kleine Modelle. Zwei Gegenmittel:

    1. Anweisung explizit in den Prompt: *„Antworte ausschließlich auf Deutsch."*
    2. `llama3.2:1b` verwenden – das Modell mit der besten Deutsch-Fähigkeit unter unseren dreien.

    Merke dir das: Was ein Modell **nicht gut kann**, musst du im Prompt **explizit einfordern**.

??? warning "Python: „ConnectionError" oder „Failed to connect to Ollama""

    Der Ollama-Dienst läuft nicht. Starte die Ollama-App (Windows/macOS) bzw. `ollama serve` (Linux) und versuche es erneut. Test im Browser: [http://localhost:11434](http://localhost:11434) sollte „Ollama is running" anzeigen.

---

???+ question "Selbsttest: Bereit fürs Labor?"

    1. Warum arbeiten wir in diesem Kurs absichtlich mit sehr kleinen Modellen?
    2. Wie gibst du im Chat-Modus einen mehrzeiligen Prompt ein?
    3. Warum solltest du einen Prompt-Vergleich nie an einem einzelnen Durchlauf festmachen?

    ??? success "Lösungsskizze"

        1. Weil kleine Modelle schlechte Prompts **nicht kompensieren** können. Der Qualitätsunterschied zwischen einem schwachen und einem starken Prompt wird dadurch sichtbar – bei großen Modellen verschwimmt er.
        2. Mit `"""` – einmal vor und einmal nach dem Text. Erst nach dem schließenden `"""` antwortet das Modell.
        3. Weil Sprachmodelle nicht deterministisch sind: Derselbe Prompt liefert beim zweiten Aufruf einen anderen Text. Ein einzelner guter oder schlechter Durchlauf kann reiner Zufall sein.

---

!!! example "Lab"

    **Playground einrichten**

    1. Installiere Ollama und lade mindestens `qwen2.5:0.5b`.
    2. Lege einen Ordner `prompt-labor` mit einer Datei `prompts.md` an.
    3. Führe Übung 0 und Übung 1 durch und halte deine Beobachtungen schriftlich fest.
    4. Notiere deine Geschäftsidee aus [Kapitel 1](einfuehrung.md) in einer Datei `idee.md` – du brauchst sie ab jetzt in jedem Labor.

---

## Quellen

!!! info "Weiterführende Links"

    - **Ollama Dokumentation:** [https://github.com/ollama/ollama/blob/main/README.md](https://github.com/ollama/ollama/blob/main/README.md)
    - **Ollama Python Library:** [https://github.com/ollama/ollama-python](https://github.com/ollama/ollama-python)
    - **Modell-Bibliothek:** [https://ollama.com/library](https://ollama.com/library)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
