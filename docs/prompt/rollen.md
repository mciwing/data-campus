# 6. Rollenbasiertes Prompting

Indem das Modell eine **bestimmte Rolle** einnimmt, verändern sich Blickwinkel, Wortwahl und Bewertungsmaßstäbe. So lässt sich dieselbe Frage aus völlig unterschiedlichen Perspektiven beleuchten.

Du kennst das Prinzip schon aus [Kapitel 2](anatomie.md) als einen der fünf Bausteine. Hier gehen wir tiefer: Rollen sind nicht nur ein Stil-Trick, sondern ein **Analysewerkzeug**.

---

## Warum Rollen überhaupt wirken

Ein LLM hat kein „Ich", das in eine Rolle schlüpft – es **simuliert** eine Rolle, statt eine zu *sein*.[^shanahan] Was tatsächlich passiert: Der Rollenbegriff im Prompt verschiebt über die [Attention](funktionsweise-llms.md#4-attention) die Wahrscheinlichkeiten aller folgenden Tokens.

*„Du bist Wirtschaftsprüferin"* macht Wörter wie *Risikorückstellung*, *Nachweis* und *Konformität* wahrscheinlicher – und Wörter wie *cool*, *revolutionär*, *disruptiv* unwahrscheinlicher.

???+ defi "Die Systemrolle"

    Technisch gibt es zwei Wege, eine Rolle zu setzen:

    | Weg | Wirkung |
    |---|---|
    | **Im User-Prompt** („Du bist …") | gilt für diesen einen Prompt, wird im langen Chat leicht „vergessen" |
    | **Als `system`-Message** | gilt für den **gesamten** Chat, deutlich stabiler |

    ```python
    ollama.chat(model="gemma3:1b", messages=[
        {"role": "system", "content": "Du bist Risikokapitalgeberin."},
        {"role": "user",   "content": "Bewerte diese Idee: ..."},
    ])
    ```

    Auf der Kommandozeile: `/set system "Du bist Risikokapitalgeberin."`

---

## Die vier Perspektiven

Für die Bewertung einer Geschäftsidee haben sich vier Rollen bewährt. Jede deckt **andere** Schwachstellen auf.

<div class="grid cards" markdown>

- :material-school-outline: **Experte** 🎓

    ---

    *„Du bist Professorin für Entrepreneurship mit Schwerpunkt Lebensmittellogistik."*

    Fragt nach: Machbarkeit, Fachstandards, bekannten Fehlerquellen

    Blinder Fleck: unterschätzt oft die Praxis

- :material-cash-multiple: **Investor** 💰

    ---

    *„Du bist Business Angel und investierst 50.000–200.000 € in Frühphasen-Startups."*

    Fragt nach: Marktgröße, Skalierbarkeit, Ausstiegsszenario, Team

    Blinder Fleck: ignoriert kleine, aber solide Geschäfte

- :material-account-heart-outline: **Kunde** 🛒

    ---

    *„Du bist berufstätiger Vater, 38, zwei Kinder, kaufst bisher im Supermarkt ein."*

    Fragt nach: Nutzen, Preis, Bequemlichkeit, Vertrauen

    Blinder Fleck: denkt nicht wirtschaftlich

- :material-sword-cross: **Konkurrent** ⚔️

    ---

    *„Du bist Geschäftsführerin eines etablierten Lieferdienstes mit 200 Mitarbeitenden."*

    Fragt nach: Wie greife ich an? Was kopiere ich in drei Wochen?

    Blinder Fleck: überschätzt die eigene Position

</div>

!!! tip "Der eigentliche Wert liegt im Widerspruch"

    Interessant wird es dort, wo sich die Rollen **widersprechen**. Wenn der Investor Skalierung fordert und der Kunde Regionalität schätzt, hast du einen echten Zielkonflikt gefunden – etwas, das dir kein einzelner Prompt geliefert hätte.

---

## Eine Rolle richtig bauen

???+ process "Vier Zutaten einer wirksamen Rolle"

    1. **Funktion** – *Risikokapitalgeberin*, nicht „Experte"
    2. **Erfahrung** – *15 Jahre in der Lebensmittelbranche*
    3. **Haltung** – *skeptisch, zahlengetrieben, direkt*
    4. **Auftrag** – *Du prüfst, ob du investieren würdest*

        In der Literatur heißt dieses Muster *Persona Pattern*.[^white]

    ```title="Vollständige Rolle"
    Du bist Business Angel mit 15 Jahren Erfahrung in der
    Lebensmittelbranche. Du hast über 40 Startups begleitet, von denen
    30 gescheitert sind. Du bist skeptisch, zahlengetrieben und
    formulierst direkt. Deine Aufgabe: entscheiden, ob du in die
    vorgestellte Idee investieren würdest.
    ```

!!! warning "Grenzen der Rolle"

    Eine Rolle ändert **Stil und Fokus** – aber sie schafft **kein Wissen**. Ein Modell, das den Innsbrucker Lebensmittelmarkt nicht kennt, kennt ihn auch als „Expertin für den Innsbrucker Lebensmittelmarkt" nicht. Es klingt dann nur **überzeugender falsch**.

    👉 Rollen erhöhen das Halluzinationsrisiko, weil sie Selbstsicherheit erzeugen. Prüfe Fakten immer nach ([Evaluation](evaluation.md)).

???+ disadv "Was Rollen nicht können 🔬"

    Rollenprompting gilt weithin als Wundermittel – die Forschung ist deutlich zurückhaltender.

    Zheng et al.[^persona] haben **162 verschiedene Rollen** systematisch auf Faktenfragen getestet. Ergebnis: Eine Rolle im System-Prompt verbesserte die **sachliche Richtigkeit im Mittel nicht**. Manche Rollen halfen, andere schadeten – und welche das jeweils war, ließ sich nicht vorhersagen.

    Das widerspricht diesem Kapitel nicht, es schärft es:

    | Wofür Rollen taugen | Wofür nicht |
    |---|---|
    | **Perspektive** – andere Aspekte werden betont | **Richtigkeit** – Fakten werden nicht korrekter |
    | **Ton und Wortwahl** anpassen | **Wissen** erzeugen, das im Modell fehlt |
    | **Widersprüche** zwischen Sichtweisen sichtbar machen | Rechen- oder Logikleistung verbessern |

    👉 Nutze Rollen als **Perspektivwechsel**, nicht als Qualitätsverstärker. Bei Fragen mit einer richtigen Antwort bringt „Du bist Expertin für X" nichts – dort helfen Kontext und Beispiele.

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren – hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Vier Rollen, deine Idee"

    Formuliere für deine Geschäftsidee vier **vollständige** Rollen – jeweils mit Funktion, Erfahrung, Haltung und Auftrag:

    🎓 Experte · 💰 Investor · 🛒 Kunde · ⚔️ Konkurrent

    Schicke jede mit `/set system` los, `/clear` zwischen den Rollen. Frage jeweils nach den **zwei größten Schwachstellen**.

    **Baue eine Matrix:** Zeilen = Rollen, Spalten = genannte Punkte. Markiere die **Einzelnennungen** – Punkte, die nur *eine* Rolle sieht. Genau dort liegt der Gewinn; was alle sagen, hättest du auch ohne Rollen bekommen.

!!! lab "Übung 2: Wirkt die Rolle wirklich?"

    Stelle dieselbe Frage zu deiner Idee **einmal ohne** und **einmal mit** Investoren-Rolle.

    **Zähle die Investoren-Wörter** in beiden Antworten: *Markt, Marge, Umsatz, Kapital, skalieren, Wettbewerb, Risiko*.

    Wiederhole es auf `gemma3:270m`. **Beobachte:** Sehr kleine Modelle „vergessen" die Systemrolle oft nach wenigen Sätzen.

!!! lab "Übung 3: Den Zielkonflikt finden"

    Geh deine Matrix aus Übung 1 durch und suche eine Stelle, an der sich zwei Rollen **widersprechen** – etwa Investor fordert Skalierung, Kunde schätzt Regionalität.

    Beschreibe den Konflikt in zwei Sätzen. Das ist ein echter Fund: etwas, das dir kein einzelner Prompt geliefert hätte.

    Speichere deine vier Rollendefinitionen in `prompts.md` unter `## 04 Rollen`.

??? code "🐍 Optional (Python): alle Rollen automatisch durchlaufen"

    Vier Rollen von Hand durchzuklicken ist machbar. Bei acht Rollen und drei Ideen wird es mühsam:

    ```python title="rollenrunde.py"
    from llm import frage

    IDEE = ("Ein Lieferdienst für regionale Bio-Lebensmittel in Innsbruck. "
            "Zwei Gründer, 15.000 € Startkapital, Lieferung per Lastenrad.")

    ROLLEN = {
        "🎓 Experte": ("Du bist Professorin für Entrepreneurship mit Schwerpunkt "
                       "Lebensmittellogistik. Du bewertest fachlich und nüchtern."),
        "💰 Investor": ("Du bist Business Angel und investierst 50.000–200.000 € in "
                        "Frühphasen-Startups. Du bist skeptisch und zahlengetrieben."),
        "🛒 Kunde": ("Du bist berufstätiger Vater, 38 Jahre, zwei Kinder, kaufst "
                     "bisher im Supermarkt. Du achtest auf Preis und Zeitersparnis."),
        "⚔️ Konkurrent": ("Du bist Geschäftsführerin eines etablierten Lieferdienstes "
                          "mit 200 Mitarbeitenden. Du willst den Neuling verdrängen."),
    }

    AUFGABE = ("Nenne aus deiner Perspektive die zwei größten Schwachstellen "
               "dieser Idee. Maximal 2 Sätze pro Punkt. Antworte auf Deutsch.")

    ergebnisse = {}
    for name, rolle in ROLLEN.items():
        ergebnisse[name] = frage(f"{IDEE}\n\n{AUFGABE}", system=rolle)

    # Wer nennt welches Thema? Einzelnennungen sind die interessanten.
    BEGRIFFE = ["Kapital", "Skalier", "Preis", "Zeit", "Logistik", "Wettbewerb"]

    print(f"{'Begriff':<14} {'Rollen':<8} Wer?")
    print("-" * 60)
    for begriff in BEGRIFFE:
        nenner = [n for n, t in ergebnisse.items() if begriff.lower() in t.lower()]
        marker = "⭐" if len(nenner) == 1 else "  "
        print(f"{marker}{begriff:<12} {len(nenner)}/4      {', '.join(nenner) or '–'}")
    ```

    ```title="Ausgabe"
    Begriff        Rollen   Wer?
    ------------------------------------------------------------
    ⭐Kapital       1/4      💰 Investor
    ⭐Skalier       1/4      💰 Investor
      Preis        2/4      🛒 Kunde, ⚔️ Konkurrent
    ⭐Zeit          1/4      🛒 Kunde
      Logistik     3/4      🎓 Experte, 💰 Investor, ⚔️ Konkurrent
      Wettbewerb   2/4      🎓 Experte, ⚔️ Konkurrent
    ```

    Der **Stern** markiert Themen, die nur eine einzige Rolle anspricht – genau dort steckt der Mehrwert. „Logistik" nennen drei von vier Rollen; das hättest du auch ohne Rollen bekommen.

---

???+

---

???+ question "Selbsttest"

    1. Was passiert technisch, wenn du eine Rolle vorgibst?
    2. Worin liegt der Unterschied zwischen einer Rolle im User-Prompt und einer `system`-Message?
    3. Warum erhöht eine Expertenrolle das Halluzinationsrisiko?

    ??? success "Lösungsskizze"

        1. Der Rollenbegriff verschiebt über die Attention die Wahrscheinlichkeiten der folgenden Tokens – fachtypische Wörter werden wahrscheinlicher, andere unwahrscheinlicher. Es „schlüpft" niemand in eine Rolle.
        2. Die `system`-Message gilt für den **gesamten** Chat und bleibt stabiler; eine Rolle im User-Prompt wirkt nur für diesen einen Prompt und geht im langen Verlauf leichter unter.
        3. Weil die Rolle **Selbstsicherheit im Ton** erzeugt, aber **kein zusätzliches Wissen**. Fehlt dem Modell die Information, klingt die erfundene Antwort nun autoritativ statt vage – und ist damit schwerer als Fehler zu erkennen.

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^shanahan]: **Shanahan, M., McDonell, K. & Reynolds, L. (2023):** *Role play with large language models.* Nature 623, S. 493–498. [https://doi.org/10.1038/s41586-023-06647-8](https://doi.org/10.1038/s41586-023-06647-8) — der theoretische Rahmen dieses Kapitels: Ein Dialogsystem „ist" keine Rolle, es **simuliert** sie. Die Autoren zeigen, warum diese Unterscheidung nötig ist, um über KI-Verhalten zu sprechen, ohne es zu vermenschlichen.
[^persona]: **Zheng, M., Pei, J., Logeswaran, L. et al. (2023):** *When „A Helpful Assistant" Is Not Really Helpful: Personas in System Prompts Do Not Improve Performances of Large Language Models.* arXiv:2311.10054. [https://arxiv.org/abs/2311.10054](https://arxiv.org/abs/2311.10054) — der Gegenbefund, siehe Kasten „Was Rollen nicht können" oben.
[^white]: **White, J., Fu, Q., Hays, S. et al. (2023):** *A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.* arXiv:2302.11382. [https://arxiv.org/abs/2302.11382](https://arxiv.org/abs/2302.11382) — beschreibt die Rollenvorgabe als *Persona Pattern* – eines der grundlegenden Entwurfsmuster im Prompting.
