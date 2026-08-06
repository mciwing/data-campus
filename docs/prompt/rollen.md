# 6. Rollenbasiertes Prompting

Indem das Modell eine **bestimmte Rolle** einnimmt, verändern sich Blickwinkel, Wortwahl und Bewertungsmaßstäbe. So lässt sich dieselbe Frage aus völlig unterschiedlichen Perspektiven beleuchten.

Du kennst das Prinzip schon aus [Kapitel 2](anatomie.md) als einen der fünf Bausteine. Hier gehen wir tiefer: Rollen sind nicht nur ein Stil-Trick, sondern ein **Analysewerkzeug**.

---

## Warum Rollen überhaupt wirken

Ein LLM hat kein „Ich", das in eine Rolle schlüpft. Was tatsächlich passiert: Der Rollenbegriff im Prompt verschiebt über die [Attention](funktionsweise-llms.md#station-4-attention-bedeutung-im-kontext) die Wahrscheinlichkeiten aller folgenden Tokens.

*„Du bist Wirtschaftsprüferin"* macht Wörter wie *Risikorückstellung*, *Nachweis* und *Konformität* wahrscheinlicher – und Wörter wie *cool*, *revolutionär*, *disruptiv* unwahrscheinlicher.

???+ defi "Die Systemrolle"

    Technisch gibt es zwei Wege, eine Rolle zu setzen:

    | Weg | Wirkung |
    |---|---|
    | **Im User-Prompt** („Du bist …") | gilt für diesen einen Prompt, wird im langen Chat leicht „vergessen" |
    | **Als `system`-Message** | gilt für den **gesamten** Chat, deutlich stabiler |

    ```python
    ollama.chat(model="qwen2.5:0.5b", messages=[
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

---

## 🔬 Ollama-Labor

!!! example "Übung 1: Vier Rollen, eine Idee"

    ```python title="rollen.py"
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

    for name, rolle in ROLLEN.items():
        print(f"\n{'=' * 60}\n{name}\n{'=' * 60}")
        print(frage(f"{IDEE}\n\n{AUFGABE}", system=rolle))
    ```

    **Deine Aufgabe:** Lege eine Tabelle an – Zeilen = Rollen, Spalten = genannte Schwachstellen. Welche Schwachstelle nennt **nur eine** Rolle? Das ist der wertvollste Fund.

!!! example "Übung 2: Wirkt die Rolle wirklich?"

    Ein ehrlicher Test: Vergleiche mit **und ohne** Rolle bei identischem Seed.

    ```python title="rolle_wirkung.py"
    from llm import frage

    frage_text = "Bewerte in 3 Sätzen: Lieferdienst für Bio-Lebensmittel in Innsbruck."

    ohne = frage(frage_text)
    mit = frage(frage_text, system=("Du bist Business Angel mit 15 Jahren Erfahrung. "
                                    "Du bist skeptisch und zahlengetrieben."))

    print(f"OHNE ROLLE:\n{ohne}\n")
    print(f"MIT ROLLE:\n{mit}\n")

    # Grobe Messung: Wie oft fallen "Investoren-Wörter"?
    SIGNAL = ["markt", "skalier", "umsatz", "risiko", "wettbewerb", "marge", "kapital"]
    for name, text in [("ohne", ohne), ("mit", mit)]:
        treffer = sum(text.lower().count(w) for w in SIGNAL)
        print(f"Investoren-Vokabular {name} Rolle: {treffer} Treffer")
    ```

    Wiederhole den Test mit `gemma3:270m`. **Wichtige Beobachtung:** Sehr kleine Modelle ignorieren Rollen häufiger – sie „vergessen" die Systemrolle nach wenigen Sätzen.

??? question "Übung 3: Rollen-Runde als Funktion (Python)"

    Baue eine wiederverwendbare Funktion, die eine Frage automatisch durch alle Rollen schickt und die Ergebnisse sammelt.

    ```python title="rollenrunde.py"
    from llm import frage

    def rollenrunde(idee, aufgabe, rollen):
        """Gibt ein dict {rollenname: antwort} zurück."""
        # TODO 1: über alle Rollen iterieren und frage(...) mit system= aufrufen
        # TODO 2: Fortschritt ausgeben (welche Rolle läuft gerade)
        # TODO 3: Ergebnisse in einem Dictionary sammeln und zurückgeben
        ...

    def gemeinsame_themen(ergebnisse, begriffe):
        """Zählt, wie viele Rollen einen Begriff erwähnen."""
        # TODO: für jeden Begriff zählen, in wie vielen Antworten er vorkommt
        ...
    ```

    ??? success "Lösungsvorschlag"

        ```python title="rollenrunde.py"
        from llm import frage

        def rollenrunde(idee, aufgabe, rollen):
            ergebnisse = {}
            for name, rolle in rollen.items():
                print(f"⏳ {name} denkt nach ...")
                ergebnisse[name] = frage(f"{idee}\n\n{aufgabe}", system=rolle)
            return ergebnisse

        def gemeinsame_themen(ergebnisse, begriffe):
            print(f"\n{'Begriff':<18} {'Rollen':<8} Wer?")
            print("-" * 55)
            for begriff in begriffe:
                nenner = [name for name, text in ergebnisse.items()
                          if begriff.lower() in text.lower()]
                marker = "⭐" if len(nenner) == 1 else "  "
                print(f"{marker}{begriff:<16} {len(nenner)}/{len(ergebnisse):<6} "
                      f"{', '.join(nenner) or '–'}")
        ```

        Der **Stern** markiert Begriffe, die nur eine einzige Rolle erwähnt – genau dort steckt der Mehrwert des rollenbasierten Prompting. Was alle sagen, hättest du auch ohne Rollen bekommen.

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

!!! example "Lab"

    **Geschäftsmodell aus verschiedenen Perspektiven bewerten**

    Lass dein Geschäftsmodell nacheinander von einem Experten, einem Investor, einem Kunden und einem Konkurrenten bewerten. Halte fest, welche Stärken und Schwächen jede Rolle aufdeckt.

    **Konkrete Schritte:**

    1. Formuliere für jede der vier Rollen eine vollständige Rollenbeschreibung (Funktion, Erfahrung, Haltung, Auftrag).
    2. Schicke deine Idee mit `rollenrunde()` durch alle vier.
    3. Erstelle eine Matrix: Zeilen = Rollen, Spalten = genannte Punkte. Markiere die **Einzelnennungen**.
    4. Finde mindestens einen **Zielkonflikt** zwischen zwei Rollen und beschreibe ihn in zwei Sätzen.
    5. Speichere deine Rollendefinitionen als `prompts/04_rollen.md`.

---

## Quellen

!!! info "Literatur"

    - **Zuckarelli, J. (2025):** *Programmieren mit ChatGPT*. Springer Nature. [https://doi.org/10.1007/978-3-662-69433-6](https://doi.org/10.1007/978-3-662-69433-6)
    - **Anthropic (2025):** *Giving Claude a role with a system prompt.* [https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts)
    - **Osterwalder, A. & Pigneur, Y. (2010):** *Business Model Generation.* Wiley.

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
