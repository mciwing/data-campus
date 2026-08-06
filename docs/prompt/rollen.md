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

    Mit `/set system` wechselst du die Rolle, ohne den Chat neu zu starten. **Wichtig:** nach jedem Rollenwechsel `/clear`, sonst mischen sich die Perspektiven.

    ```title="Terminal"
    ollama run qwen2.5:0.5b

    >>> /set system "Du bist Business Angel und investierst 50.000–200.000 € in Frühphasen-Startups. Du bist skeptisch und zahlengetrieben."
    >>> /clear
    >>> """
    ... Ein Lieferdienst für regionale Bio-Lebensmittel in Innsbruck.
    ... Zwei Gründer, 15.000 € Startkapital, Lieferung per Lastenrad.
    ...
    ... Nenne aus deiner Perspektive die zwei größten Schwachstellen dieser Idee.
    ... Maximal 2 Sätze pro Punkt. Antworte auf Deutsch.
    ... """
    ```

    ```title="Beispielausgabe — 💰 Investor"
    1. Das Startkapital trägt kein Wachstum. 15.000 € reichen für ein Lastenrad
       und wenige Monate Betrieb, nicht für den Aufbau eines Kundenstamms.
    2. Das Modell skaliert schlecht. Jede zusätzliche Lieferung kostet
       Fahrzeit – ein Deckungsbeitrag entsteht erst bei hoher Dichte.
    ```

    Jetzt dieselbe Frage aus Kundensicht:

    ```title="Terminal"
    >>> /set system "Du bist berufstätiger Vater, 38 Jahre, zwei Kinder, kaufst bisher im Supermarkt. Du achtest auf Preis und Zeitersparnis."
    >>> /clear
    ```

    ```title="Beispielausgabe — 🛒 Kunde"
    1. Ich weiß nicht, wann geliefert wird. Wenn ich zu Hause sein muss,
       spare ich keine Zeit gegenüber dem Supermarkt.
    2. Bio ist teurer, und ich kaufe für vier Personen ein. Ohne klaren
       Preisvergleich probiere ich das nicht aus.
    ```

    Zwei völlig verschiedene Schwachstellen – bei identischer Frage.

    **Deine Aufgabe:** Führe alle vier Rollen durch (Experte, Investor, Kunde, Konkurrent – Beschreibungen siehe oben). Lege eine Tabelle an: Zeilen = Rollen, Spalten = genannte Schwachstellen. Welche Schwachstelle nennt **nur eine einzige** Rolle? Das ist dein wertvollster Fund.

!!! example "Übung 2: Wirkt die Rolle wirklich?"

    Ein ehrlicher Test – dieselbe Frage mit und ohne Rolle:

    ```bash
    ollama run qwen2.5:0.5b "Bewerte in 3 Sätzen: Lieferdienst für Bio-Lebensmittel in Innsbruck."
    ```

    ```title="Beispielausgabe — ohne Rolle"
    Ein Lieferdienst für Bio-Lebensmittel ist eine zeitgemäße Idee, da das
    Bewusstsein für nachhaltige Ernährung wächst. Innsbruck bietet als Stadt
    mit umweltbewusster Bevölkerung gute Voraussetzungen. Wichtig sind eine
    zuverlässige Logistik und eine klare Positionierung.
    ```

    ```title="Beispielausgabe — mit Investoren-Rolle"
    Der adressierbare Markt in Innsbruck ist klein, das begrenzt die
    Umsatzobergrenze. Die Marge bei Frischware ist niedrig, während die
    Zustellkosten pro Bestellung hoch bleiben. Ohne Kapital für Wachstum
    sehe ich kein Investment.
    ```

    **Deine Aufgabe:** Zähle in beiden Antworten die „Investoren-Wörter": *Markt, Marge, Umsatz, Kapital, skalieren, Wettbewerb, Risiko*. Wiederhole den Test danach mit `gemma3:270m`.

    **Wichtige Beobachtung:** Sehr kleine Modelle ignorieren Rollen häufiger – sie „vergessen" die Systemrolle nach wenigen Sätzen und fallen in den neutralen Ton zurück.

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
    2. Schicke deine Idee mit `/set system` + `/clear` durch alle vier Rollen.
    3. Erstelle eine Matrix: Zeilen = Rollen, Spalten = genannte Punkte. Markiere die **Einzelnennungen** – sie sind der eigentliche Gewinn.
    4. Finde mindestens einen **Zielkonflikt** zwischen zwei Rollen und beschreibe ihn in zwei Sätzen.
    5. Notiere deine vier Rollendefinitionen in `prompts.md` unter `## 04 Rollen`.

---

## Quellen

!!! info "Literatur"

    - **Zuckarelli, J. (2025):** *Programmieren mit ChatGPT*. Springer Nature. [https://doi.org/10.1007/978-3-662-69433-6](https://doi.org/10.1007/978-3-662-69433-6)
    - **Anthropic (2025):** *Giving Claude a role with a system prompt.* [https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts)
    - **Osterwalder, A. & Pigneur, Y. (2010):** *Business Model Generation.* Wiley.

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.
