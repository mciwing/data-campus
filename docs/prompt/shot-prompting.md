# Shot Prompting

Manchmal genügt eine reine Anweisung, manchmal helfen **Beispiele** dem Modell, die gewünschte Antwort zu treffen. Die Wahl des richtigen Ansatzes ist eine zentrale Prompting-Entscheidung.

Der Name klingt technischer, als es ist: Ein **Shot** ist schlicht ein *Beispiel*, das du im Prompt mitlieferst. Kein Beispiel = Zero-Shot. Ein paar Beispiele = Few-Shot. Geprägt haben diese Begriffe Brown et al. in jenem Paper, das GPT-3 vorstellte - der Titel *„Language Models are Few-Shot Learners"* war Programm.[^brown]

!!! quote "Merksatz"
    Ein *Shot* ist kein Versuch. „Few-Shot" heißt nicht, dass du das Modell mehrmals fragst - es heißt, dass in **einem** Prompt mehrere Beispiele stehen.

Warum das so gut funktioniert, kennst du aus dem Alltag: Versuche einmal, in Worten zu erklären, wie man einen Krawattenknoten bindet. Und dann mach es jemandem einfach vor. **Zeigen ist oft einfacher als beschreiben** - und manches lässt sich überhaupt nur zeigen. Genau das ist der Unterschied zwischen einer Anweisung und einem Beispiel.

<div style="text-align: center;">
    <img src="https://i.pinimg.com/564x/d1/30/14/d130149b34e580788e188cb0cca52ec7.jpg" alt="Meme mit der Überschrift „Wenn du keine Krawatte binden kannst…“ - daneben eine Person, die sich statt einer Krawatte einen Schuhlöffel unter den Hemdkragen geklemmt hat." style="max-width: 300px;">
    <figcaption>Wer eine Anleitung nur gehört hat, produziert erstaunliche Ergebnisse. (Quelle: <a href="https://i.pinimg.com/564x/d1/30/14/d130149b34e580788e188cb0cca52ec7.jpg" target="_blank" rel="noopener">Pinterest</a>)</figcaption>
</div>


---

## Die drei Ansätze

### Zero-Shot

Bei Zero-Shot Prompting beschreibst du die Aufgabe ohne ein einziges Beispiel zu nennen. Das ist der Normalfall: Praktisch alles, was du bisher in einen Chatbot getippt hast, war Zero-Shot. Und meistens genügt es auch, denn Aufgaben wie *übersetzen*, *zusammenfassen* oder *klassifizieren* hat das Modell im Training millionenfach gesehen.

```{.text .ollama title="Ollama Chat"}
Klassifiziere die folgende Kundenbewertung als positiv, neutral oder negativ.
...
...Bewertung: "Die Lieferung kam pünktlich, aber das Gemüse war welk."
```

```{.text .no-copy title="Beispielausgabe"}
Negativ
Die negative Bewertung deutet darauf hin, dass der Service von Qualität her ablings ist und ein Problem mit dem
Produkt selbst besteht.
```

Wenn wir uns die Antwort ansehen, merken wir: Inhaltlich ist sie **richtig** - und trotzdem eventuell unbrauchbar, sobald du hundert Bewertungen auswerten willst. Das Modell liefert eine Begründung mit, die niemand bestellt hat. Dies steht nicht im Widerspruch zu deiner Anweisung - du hast schlicht nie gesagt, wie die Antwort **aussehen** soll.

---

### One-Shot

Im Gegensatz zu Zero-Shot zeigt One-Shot Prompting ein - einziges - Beispiel, und damit meist auch das Format und die Erwartungshaltung. Wenn du dir das nachfolgende Beispiel anschaust, erkennst du, wie viel in diesen zwei Zeilen steckt, ohne dass ein einziges Wort es erklärt: die Feldnamen `Bewertung` und `Kategorie`, ihre Reihenfolge, die Kleinschreibung des Labels - und vor allem, dass die Antwort aus **einem Wort** besteht und nicht aus einem Absatz.

```{.text .ollama title="Ollama Chat"}
Klassifiziere Kundenbewertungen.
...
...Bewertung: "Alles top, gerne wieder!"
...Kategorie: positiv
...
...Bewertung: "Die Lieferung kam pünktlich, aber das Gemüse war welk."
...Kategorie:
```

```{.text .no-copy title="Beispielausgabe"}
negativ
```

???+ tip "Der Trick hier: die letzte Zeile offen lassen"

    Der Prompt endet mit `Kategorie:` - und da hört er auf. Kein Fragezeichen, keine Bitte, keine Erklärung.

    Das ist kein Schönheitsfehler, sondern der Kern der Technik. Ein Sprachmodell macht nichts anderes, als [den Text fortzusetzen](funktionsweise-llms.md#5-das-nachste-token). Eine angefangene Zeile ist deshalb die stärkste Anweisung, die du geben kannst: Die einzige plausible Fortsetzung ist genau das eine Wort, das du willst.

    Schreibst du stattdessen *„Wie lautet die Kategorie?"*, ist auch *„Die Kategorie dieser Bewertung lautet: negativ."* eine völlig plausible Fortsetzung - und schon hast du wieder einen Satz statt eines Labels.

---

### Few-Shot

Für Aufgaben mit **eigenen Regeln**, Grenzfällen oder ungewöhnlichen Formaten, eignet sich Few-Shot besonders gut. Dabei übergibt man dem LLM mehrere Beispiele - idealerweise auch **Grenzfälle**.

**Welche** Beispiele du wählst, ist dabei keine Nebensache. Liu et al. haben systematisch untersucht, was ein gutes Beispiel ausmacht, und kommen zu einem klaren Ergebnis: Beispiele, die dem aktuellen Fall **inhaltlich ähneln**, wirken deutlich besser als zufällig gewählte.[^liu] Nimm deine Beispiele also aus demselben Themenfeld wie die Fälle, die du später wirklich bearbeiten willst.

```{.text .ollama title="Ollama Chat"}
Klassifiziere Kundenbewertungen.
...
...Bewertung: "Alles top, gerne wieder!"
...Kategorie: positiv
...
...Bewertung: "Ware kam an. Nichts Besonderes."
...Kategorie: neutral
...
...Bewertung: "Zwei Tage zu spät und die Hälfte fehlte."
...Kategorie: negativ
...
...Bewertung: "Super Qualität, aber viel zu teuer."
...Kategorie: neutral
...
...Bewertung: "Die Lieferung kam pünktlich, aber das Gemüse war welk."
...Kategorie:
```

```{.text .no-copy title="Beispielausgabe"}
negativ
```


???+ example "Beispiele sind Definitionen"

    Sieh dir das vierte Beispiel an: *„Super Qualität, aber viel zu teuer."* → **neutral**. Man könnte es genauso gut *negativ* nennen - beides wäre vertretbar.

    Und genau das ist der Punkt: Es gibt hier keine objektiv richtige Antwort. Es gibt nur **deine Festlegung**. Ein gemischtes Urteil als *neutral* einzustufen ist eine Entscheidung, die das Modell unmöglich erraten kann.

    Solche Grenzfälle in Worte zu fassen wird schnell mühsam - *„Wenn Lob und Kritik sich ungefähr die Waage halten, dann …"*. Ein einziges Beispiel erledigt dasselbe in zwei Zeilen. **Deshalb gehören genau die Fälle in den Prompt, bei denen du selbst kurz überlegen musstest.**

---

## Die drei Ansätze im Vergleich

Eine generell beste Methode gibt es nicht. Es gibt nur die **billigste, die für deine Aufgabe noch funktioniert** - und die findest du nicht durch Nachdenken, sondern durch Ausprobieren. Fang deshalb mit der einfachsten Variante an und rüste erst nach, wenn das Ergebnis es verlangt.


<div style="text-align:center; max-width:780px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;"></th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Zero-Shot</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">One-Shot</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Few-Shot</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Beispiele im Prompt</td>
        <td style="padding:10px 14px;">keine</td>
        <td style="padding:10px 14px;">eines</td>
        <td style="padding:10px 14px;">drei bis fünf</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Aufwand für dich</td>
        <td style="padding:10px 14px;">keiner</td>
        <td style="padding:10px 14px;">gering</td>
        <td style="padding:10px 14px;">spürbar</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Token-Verbrauch</td>
        <td style="padding:10px 14px;">niedrig</td>
        <td style="padding:10px 14px;">mittel</td>
        <td style="padding:10px 14px;">hoch</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Formattreue</td>
        <td style="padding:10px 14px;">wackelig</td>
        <td style="padding:10px 14px;">gut</td>
        <td style="padding:10px 14px;">sehr gut</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Vermittelt Grenzfälle</td>
        <td style="padding:10px 14px;">nein</td>
        <td style="padding:10px 14px;">kaum</td>
        <td style="padding:10px 14px;">ja</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Typischer Einsatz</td>
        <td style="padding:10px 14px;">einmalige Fragen</td>
        <td style="padding:10px 14px;">Format festzurren</td>
        <td style="padding:10px 14px;">wiederkehrende Aufgaben mit eigenen Regeln</td>
    </tr>
    </tbody>
</table>
</div>

Die Reihenfolge der Spalten ist zugleich die Reihenfolge, in der du vorgehen solltest: **von links nach rechts, aber nur so weit wie nötig.** Jede Spalte weiter rechts kostet Tokens und Vorbereitungszeit - und die zahlst du bei *jedem* Aufruf.

???+ defi "In-Context Learning"

    Das Modell **lernt** durch Few-Shot-Prompting nicht wirklich dazu - seine Parameter ändern sich nicht. Es erkennt lediglich im Kontext ein **Muster** und setzt es fort. Fachbegriff: *In-Context Learning*[^brown].

    Deshalb ist die Wirkung nach dem Chat auch wieder weg. Wer dauerhaft ein Verhalten will, braucht Fine-Tuning - oder eine Prompt-Sammlung, aus der er die Beispiele jedes Mal wieder mitschickt.

    In-Context Learning ist inzwischen ein eigenes Forschungsfeld; Dong et al. bieten dazu einen aktuellen Überblick.[^dong] Bemerkenswert ist, dass niemand die Fähigkeit einprogrammiert hat: Sie tauchte ab einer gewissen Modellgröße einfach auf - ein Nebenprodukt des Trainings, das bis heute nicht abschließend erklärt ist.

!!! tip "Unterschied: kleine vs. große Modelle"

    Ein großes Modell braucht selten Beispiele - es rät richtig. **Kleine Modelle profitieren dramatisch von Few-Shot.** Wenn `gemma3:1b` deine Aufgabe partout nicht versteht: gib ihm zwei Beispiele, statt den Anweisungstext ein viertes Mal umzuformulieren.

---

Man würde annehmen, das Modell lerne aus Beispielen die **richtige Zuordnung**. Min et al.[^min] haben das geprüft und die Labels in den Beispielen **absichtlich falsch** gesetzt - „Alles top!" → *negativ*. Das Ergebnis: Die Leistung brach kaum ein.

Was Beispiele tatsächlich vermitteln, sind drei andere Dinge:

1. den **Label-Raum** (welche Antworten überhaupt zulässig sind),
2. die **Eingabeverteilung** (wie die Aufgaben aussehen),
3. das **Format** der Antwort.

Der Befund ist allerdings nicht das letzte Wort: Yoo et al. haben die Studie mit anderen Aufgaben wiederholt und zeigen, dass richtige Labels **je nach Aufgabe und Modell sehr wohl** ins Gewicht fallen.[^yoo] Die ehrliche Zusammenfassung lautet also: Format und Abdeckung wirken *immer*, korrekte Labels wirken *manchmal*.


!!! warning "Drei typische Few-Shot-Fallen"

    - **Unausgewogene Beispiele:** Nur positive Beispiele → das Modell klassifiziert alles als positiv. Decke *alle* Kategorien ab.[^zhao]
    - **Uneinheitliches Format:** Wenn deine Beispiele mal `Kategorie:` und mal `Bewertung:` schreiben, kopiert das Modell die Inkonsistenz.

        <div style="text-align: center;">
            <img src="https://substack-post-media.s3.amazonaws.com/public/images/5b934fac-6ff5-4d85-81b2-490645eadfa7_1082x1285.jpeg" alt="Comic: Ein Roboter bekommt das Streichen eines Zauns vorgemacht und ahmt es exakt nach - inklusive der nur halb gestrichenen Latten." style="max-width: 300px;">
            <figcaption>Few-Shot heißt Nachahmen: Das Modell übernimmt dein Muster - auch die Unsauberkeiten darin. (Quelle: <a href="https://substack-post-media.s3.amazonaws.com/public/images/5b934fac-6ff5-4d85-81b2-490645eadfa7_1082x1285.jpeg" target="_blank" rel="noopener">Substack</a>)</figcaption>
        </div>

    - **Zu viele Beispiele:** Der Zugewinn flacht mit jedem weiteren Beispiel ab - schon Brown et al. zeigen das an GPT-3[^brown] -, der Token-Verbrauch steigt aber linear weiter. Und bei kleinen Modellen droht das [Kontextfenster](halluzinationen-kontextfenster.md) überzulaufen. Als Faustregel für den Kurs: drei bis fünf Beispiele.

???+ warning "Die vierte Falle: die Reihenfolge"

    Man würde erwarten, dass es egal ist, in welcher Reihenfolge die Beispiele stehen. Ist es nicht. Lu et al. haben sämtliche Permutationen derselben Beispiele durchgetestet - und fanden Unterschiede **zwischen nahezu bestem Ergebnis und blindem Raten**, allein durch die Reihenfolge.[^lu]

    Zwei Details aus der Studie sind für die Praxis wichtig:

    - Der Effekt verschwindet nicht bei größeren Modellen.
    - Eine Reihenfolge, die bei einem Modell gut funktioniert, lässt sich **nicht** auf ein anderes Modell übertragen.

    Zhao et al. liefern die Erklärung: Modelle bevorzugen Labels, die **häufiger** vorkommen und die **zuletzt** im Prompt standen.[^zhao] Stehen deine drei negativen Beispiele alle am Ende, kippt die Vorhersage in Richtung *negativ*.

    👉 Misch die Kategorien durch, statt sie zu gruppieren. Und wenn ein Few-Shot-Prompt unerklärlich schlecht läuft: zieh einmal die Reihenfolge um, bevor du am Text feilst.

---

!!! quote "Ausblick: Beispiele, die *denken* zeigen"

    Bisher haben unsere Beispiele nur **Eingabe → Ausgabe** gezeigt. Wei et al. haben eine Kleinigkeit geändert: Sie schrieben in die Beispiele auch den **Rechenweg** dazu - und plötzlich lösten Modelle Aufgaben, an denen sie zuvor gescheitert waren.[^wei]

    Diese Technik heißt *Chain-of-Thought* und ist nichts anderes als Few-Shot mit ausformulierten Zwischenschritten. Du triffst sie im Kapitel [Kritisches Prompting](kritisches.md) wieder.

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren - hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Zero-Shot vs. Few-Shot messen"

    Denk dir eine **Klassifikationsaufgabe** aus deinem Geschäftsfeld aus - etwa Kundenanfragen in *Beschwerde / Frage / Lob* einsortieren. Schreibe dir **fünf Testfälle** auf, darunter mindestens einen Grenzfall.

    Dann beide Varianten durchspielen:

    1. **Zero-Shot** - nur die Anweisung, dazu *„Antworte mit genau einem Wort."*
    2. **Few-Shot** - dieselbe Anweisung plus drei Beispiele, letztes Label offen lassen.

    **Zähle:** Wie oft bekommst du wirklich nur ein Wort zurück? Notiere beide Trefferquoten als Bruch.

!!! lab "Übung 2: Deinen Stil beibringen"

    Few-Shot überträgt **Stil** - etwas, das sich schwer beschreiben lässt.

    Schreibe zwei Produkt- oder Angebotsnamen im Stil deiner Idee selbst und lass das Modell den dritten ergänzen. Tausche danach die Beispiele gegen einen **völlig anderen** Stil (z. B. englische Tech-Namen) und wiederhole.

    **Die Frage:** Übernimmt das Modell den neuen Stil, ohne dass du ihn je beschrieben hast?

!!! lab "Übung 3: Business Model Canvas erzeugen"

    Jetzt das große Stück - dein Canvas[^osterwalder], einmal auf beide Arten:

    1. **Zero-Shot:** *„Erstelle ein Business Model Canvas für [deine Idee]."* Zähle: Wie viele der neun Felder kommen?
    2. **Few-Shot:** Gib **zwei** vollständig ausgefüllte Felder eines *fremden* Beispiels vor (etwa für einen Fahrradkurier) und lass den Rest für deine Idee ergänzen.

    **Vergleiche** nach Vollständigkeit (0-9 Felder), Formattreue und inhaltlicher Substanz.

    Speichere den besseren Prompt in `prompts.md` unter `## 02 Canvas`.

??? code "🐍 Optional (Python): Few-Shot-Baukasten"

    Beispiele von Hand in jeden Prompt zu kopieren wird schnell mühsam. Diese Funktion baut den Prompt automatisch:

    ```python title="fewshot_builder.py"
    def baue_fewshot(anweisung, beispiele, neue_eingabe,
                     label_in="Eingabe", label_out="Ausgabe"):
        teile = [anweisung, ""]

        for eingabe, ausgabe in beispiele:
            teile.append(f"{label_in}: {eingabe}")
            teile.append(f"{label_out}: {ausgabe}")
            teile.append("")

        teile.append(f"{label_in}: {neue_eingabe}")
        teile.append(f"{label_out}:")      # bewusst offen lassen!

        return "\n".join(teile)


    prompt = baue_fewshot(
        "Klassifiziere Kundenbewertungen. Antworte mit genau einem Wort.",
        [("Alles top!", "positiv"), ("Kam zu spät.", "negativ")],
        "Preis okay, Qualität mittel.",
        label_in="Bewertung", label_out="Kategorie",
    )
    print(prompt)
    ```

    ```title="Ausgabe"
    Klassifiziere Kundenbewertungen. Antworte mit genau einem Wort.

    Bewertung: Alles top!
    Kategorie: positiv

    Bewertung: Kam zu spät.
    Kategorie: negativ

    Bewertung: Preis okay, Qualität mittel.
    Kategorie:
    ```

    Damit lässt sich der Prompt anschließend an `frage()` übergeben - und du kannst zwanzig Testfälle durchlaufen lassen, statt zwanzigmal zu tippen.

---


## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^brown]: **Brown, T. B., Mann, B., Ryder, N. et al. (2020):** *Language Models are Few-Shot Learners.* arXiv:2005.14165. [https://arxiv.org/abs/2005.14165](https://arxiv.org/abs/2005.14165) - das Paper, das die Begriffe *Zero-Shot*, *One-Shot* und *Few-Shot* geprägt hat. Zeigt auch, dass der Nutzen von Beispielen mit der Modellgröße *abnimmt* - die Grundlage unseres Kurs-Tricks.
[^min]: **Min, S., Lyu, X., Holtzman, A. et al. (2022):** *Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?* arXiv:2202.12837. [https://arxiv.org/abs/2202.12837](https://arxiv.org/abs/2202.12837) - überraschender Befund: Selbst **falsch gelabelte** Beispiele helfen kaum weniger als richtige. Entscheidend sind Format, Label-Raum und Eingabeverteilung - nicht die Korrektheit. Das erklärt, warum die *Struktur* deiner Beispiele so wichtig ist.
[^zhao]: **Zhao, T. Z., Wallace, E., Feng, S. et al. (2021):** *Calibrate Before Use: Improving Few-Shot Performance of Language Models.* arXiv:2102.09690. [https://arxiv.org/abs/2102.09690](https://arxiv.org/abs/2102.09690) - belegt die Verzerrung durch unausgewogene Beispiele: Das Modell bevorzugt Labels, die häufiger oder zuletzt im Prompt vorkommen.
[^liu]: **Liu, J., Shen, D., Zhang, Y. et al. (2022):** *What Makes Good In-Context Examples for GPT-3?* Proceedings of DeeLIO 2022 (Workshop @ ACL), S. 100-114. [https://aclanthology.org/2022.deelio-1.10/](https://aclanthology.org/2022.deelio-1.10/) - die Auswahl der Beispiele ist entscheidend: semantisch ähnliche Beispiele schlagen zufällig gezogene deutlich.
[^lu]: **Lu, Y., Bartolo, M., Moore, A. et al. (2022):** *Fantastically Ordered Prompts and Where to Find Them: Overcoming Few-Shot Prompt Order Sensitivity.* ACL 2022. arXiv:2104.08786. [https://arxiv.org/abs/2104.08786](https://arxiv.org/abs/2104.08786) - dieselben Beispiele, andere Reihenfolge: Die Ergebnisse schwanken zwischen nahezu bestem Wert und Zufallsniveau. Der Effekt bleibt auch bei großen Modellen bestehen.
[^yoo]: **Yoo, K. M., Kim, J., Kim, H. J. et al. (2022):** *Ground-Truth Labels Matter: A Deeper Look into Input-Label Demonstrations.* EMNLP 2022. arXiv:2205.12685. [https://arxiv.org/abs/2205.12685](https://arxiv.org/abs/2205.12685) - die Gegenposition zu Min et al.: Je nach Aufgabe und Modell wirken korrekte Labels sehr wohl. Beide Befunde zusammen ergeben das differenzierte Bild im Kapitel.
[^dong]: **Dong, Q., Li, L., Dai, D. et al. (2024):** *A Survey on In-context Learning.* EMNLP 2024, S. 1107-1128. [https://aclanthology.org/2024.emnlp-main.64/](https://aclanthology.org/2024.emnlp-main.64/) - Überblicksarbeit zum gesamten Feld: Definitionen, Auswahl- und Anordnungsstrategien für Beispiele sowie Erklärungsansätze, warum In-Context Learning überhaupt funktioniert.
[^wei]: **Wei, J., Wang, X., Schuurmans, D. et al. (2022):** *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.* arXiv:2201.11903. [https://arxiv.org/abs/2201.11903](https://arxiv.org/abs/2201.11903) - Few-Shot-Beispiele, die den Lösungsweg mitliefern, verbessern das Ergebnis bei mehrschrittigen Aufgaben erheblich.
[^osterwalder]: **Osterwalder, A. & Pigneur, Y. (2010):** *Business Model Generation: A Handbook for Visionaries, Game Changers, and Challengers.* Wiley, ISBN 978-0-470-87641-1.
