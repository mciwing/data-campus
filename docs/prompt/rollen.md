# Rollenbasiertes Prompting

Indem das Modell eine **bestimmte Rolle** einnimmt, verändern sich Blickwinkel, Wortwahl und Bewertungsmaßstäbe. So lässt sich dieselbe Frage aus völlig unterschiedlichen Perspektiven beleuchten.

Du kennst das Prinzip schon aus [Anatomie eines guten Prompts](anatomie.md) als einen der fünf Bausteine. Hier gehen wir tiefer: Rollen sind nicht nur ein Stil-Trick, sondern ein **Analysewerkzeug**.

---

## Warum Rollen überhaupt wirken

Ein LLM hat kein „Ich", das in eine Rolle schlüpft - es **simuliert** eine Rolle, statt eine zu *sein*.[^shanahan] Was tatsächlich passiert: Der Rollenbegriff im Prompt verschiebt über die [Attention](funktionsweise-llms.md#4-attention) die Wahrscheinlichkeiten aller folgenden Tokens.

*„Du bist Wirtschaftsprüferin"* macht Wörter wie *Risikorückstellung*, *Nachweis* und *Konformität* wahrscheinlicher - und Wörter wie *cool*, *revolutionär*, *disruptiv* unwahrscheinlicher.

???+ defi "Die Systemrolle"

    Technisch gibt es zwei Wege, eine Rolle zu setzen:

    <div style="text-align:center; max-width:720px; margin:16px auto;">
    <table role="table"
            style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
        <thead>
        <tr style="background:#009485; color:#fff;">
            <th style="text-align:left; padding:12px 14px; font-weight:700;">Weg</th>
            <th style="text-align:left; padding:12px 14px; font-weight:700;">Wirkung</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Im User-Prompt („Du bist …")</td>
            <td style="padding:10px 14px;">gilt für diesen einen Prompt, wird im langen Chat leicht „vergessen"</td>
        </tr>
        <tr>
            <td style="background:#00948511; padding:10px 14px; font-weight:600;">Als <code>system</code>-Message</td>
            <td style="padding:10px 14px;">gilt für den <strong>gesamten</strong> Chat, deutlich stabiler</td>
        </tr>
        </tbody>
    </table>
    </div>

    Im Chat setzt du die Systemrolle mit `/set system`:

    ```{.text .ollama title="Ollama Chat"}
    /set system "Du bist Risikokapitalgeberin mit 15 Jahren Erfahrung."
    ```

    Ab jetzt gilt sie für **jede** folgende Frage - du musst die Rolle nicht in jedem Prompt wiederholen:

    ```{.text .ollama title="Ollama Chat"}
    Bewerte diese Idee: ein Lieferdienst für regionale Bio-Lebensmittel.
    ```

    Mit `/show system` kannst du jederzeit nachsehen, welche Rolle gerade gesetzt ist.

---

## Die vier Perspektiven

Für die Bewertung einer Geschäftsidee haben sich vier Rollen bewährt. Jede deckt **andere** Schwachstellen auf.

<div class="grid cards" markdown>

- :material-school-outline: **Experte**

    ---

    *„Du bist Professorin für Entrepreneurship mit Schwerpunkt Lebensmittellogistik."*

    Fragt nach: Machbarkeit, Fachstandards, bekannten Fehlerquellen

    Blinder Fleck: unterschätzt oft die Praxis

- :material-cash-multiple: **Investor** 

    ---

    *„Du bist Business Angel und investierst 50.000-200.000 € in Frühphasen-Startups."*

    Fragt nach: Marktgröße, Skalierbarkeit, Ausstiegsszenario, Team

    Blinder Fleck: ignoriert kleine, aber solide Geschäfte

- :material-account-heart-outline: **Kunde**

    ---

    *„Du bist berufstätiger Vater, 38, zwei Kinder, kaufst bisher im Supermarkt ein."*

    Fragt nach: Nutzen, Preis, Bequemlichkeit, Vertrauen

    Blinder Fleck: denkt nicht wirtschaftlich

- :material-sword-cross: **Konkurrent**

    ---

    *„Du bist Geschäftsführerin eines etablierten Lieferdienstes mit 200 Mitarbeitenden."*

    Fragt nach: Wie greife ich an? Was kopiere ich in drei Wochen?

    Blinder Fleck: überschätzt die eigene Position

</div>

!!! tip "Der eigentliche Wert liegt im Widerspruch"

    Interessant wird es dort, wo sich die Rollen **widersprechen**. Wenn der Investor Skalierung fordert und der Kunde Regionalität schätzt, hast du einen echten Zielkonflikt gefunden - etwas, das dir kein einzelner Prompt geliefert hätte.

---

## Was Rollen können und was nicht

Zheng et al.[^persona] haben **162 verschiedene Rollen** systematisch auf Faktenfragen getestet. Ergebnis: Eine Rolle im System-Prompt verbesserte die **sachliche Richtigkeit im Mittel nicht**. Manche Rollen halfen, andere schadeten - und welche das jeweils war, ließ sich nicht vorhersagen.

Das widerspricht diesem Kapitel nicht, es schärft es:

<div style="text-align:center; max-width:780px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Wofür Rollen taugen</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Wofür nicht</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Perspektive</strong> - andere Aspekte werden betont</td>
        <td style="padding:10px 14px;"><strong>Richtigkeit</strong> - Fakten werden nicht korrekter</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Ton und Wortwahl</strong> anpassen</td>
        <td style="padding:10px 14px;"><strong>Wissen</strong> erzeugen, das im Modell fehlt</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Widersprüche</strong> zwischen Sichtweisen sichtbar machen</td>
        <td style="padding:10px 14px;">Rechen- oder Logikleistung verbessern</td>
    </tr>
    </tbody>
</table>
</div>

Nutze Rollen als **Perspektivwechsel**, nicht als Qualitätsverstärker. Bei Fragen mit einer richtigen Antwort bringt „Du bist Expertin für X" nichts - dort helfen Kontext und Beispiele.

!!! warning "Grenzen der Rolle"

    Eine Rolle ändert **Stil und Fokus** - aber sie schafft **kein Wissen**. Ein Modell, das den Innsbrucker Lebensmittelmarkt nicht kennt, kennt ihn auch als „Expertin für den Innsbrucker Lebensmittelmarkt" nicht. Es klingt dann nur **überzeugender falsch**.

    Rollen erhöhen das Halluzinationsrisiko, weil sie Selbstsicherheit erzeugen. Prüfe Fakten immer nach ([Evaluation](evaluation.md)).

---

## 🔬 Ollama-Lab

Alles ab hier drehst du an **deiner eigenen Geschäftsidee**. Die Beispiele oben im Kapitel zeigen das Verfahren - hier wendest du es an. Terminal auf, `ollama run gemma3:1b`, los.

!!! lab "Übung 1: Vier Rollen, deine Idee"

    Formuliere für deine Geschäftsidee vier **vollständige** Rollen - jeweils mit Funktion, Erfahrung, Haltung und Auftrag:

    🎓 Experte · 💰 Investor · 🛒 Kunde · ⚔️ Konkurrent

    Schicke jede mit `/set system` los, `/clear` zwischen den Rollen. Frage jeweils nach den **zwei größten Schwachstellen**.

    **Baue eine Matrix:** Zeilen = Rollen, Spalten = genannte Punkte. Markiere die **Einzelnennungen** - Punkte, die nur *eine* Rolle sieht. Genau dort liegt der Gewinn; was alle sagen, hättest du auch ohne Rollen bekommen.

!!! lab "Übung 2: Wirkt die Rolle wirklich?"

    Stelle dieselbe Frage zu deiner Idee **einmal ohne** und **einmal mit** Investoren-Rolle.

    **Zähle die Investoren-Wörter** in beiden Antworten: *Markt, Marge, Umsatz, Kapital, skalieren, Wettbewerb, Risiko*.

    Wiederhole es auf `gemma3:270m`. **Beobachte:** Sehr kleine Modelle „vergessen" die Systemrolle oft nach wenigen Sätzen.

!!! lab "Übung 3: Den Zielkonflikt finden"

    Geh deine Matrix aus Übung 1 durch und suche eine Stelle, an der sich zwei Rollen **widersprechen** - etwa Investor fordert Skalierung, Kunde schätzt Regionalität.

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
        "💰 Investor": ("Du bist Business Angel und investierst 50.000-200.000 € in "
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
        print(f"{marker}{begriff:<12} {len(nenner)}/4      {', '.join(nenner) or '-'}")
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

    Der **Stern** markiert Themen, die nur eine einzige Rolle anspricht - genau dort steckt der Mehrwert. „Logistik" nennen drei von vier Rollen; das hättest du auch ohne Rollen bekommen.

---


## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^shanahan]: **Shanahan, M., McDonell, K. & Reynolds, L. (2023):** *Role play with large language models.* Nature 623, S. 493-498. [https://doi.org/10.1038/s41586-023-06647-8](https://doi.org/10.1038/s41586-023-06647-8) - der theoretische Rahmen dieses Kapitels: Ein Dialogsystem „ist" keine Rolle, es **simuliert** sie. Die Autoren zeigen, warum diese Unterscheidung nötig ist, um über KI-Verhalten zu sprechen, ohne es zu vermenschlichen.
[^persona]: **Zheng, M., Pei, J., Logeswaran, L. et al. (2023):** *When „A Helpful Assistant" Is Not Really Helpful: Personas in System Prompts Do Not Improve Performances of Large Language Models.* arXiv:2311.10054. [https://arxiv.org/abs/2311.10054](https://arxiv.org/abs/2311.10054) - der Gegenbefund, siehe Kasten „Was Rollen nicht können" oben.
[^white]: **White, J., Fu, Q., Hays, S. et al. (2023):** *A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.* arXiv:2302.11382. [https://arxiv.org/abs/2302.11382](https://arxiv.org/abs/2302.11382) - beschreibt die Rollenvorgabe als *Persona Pattern* - eines der grundlegenden Entwurfsmuster im Prompting.
