# Intern: Übersicht aller Ollama-Labs

Interne Sammelübersicht **aller 🔬 Ollama-Lab-Übungen** des Prompt-Engineering-Kurses, geordnet nach der **Kapitelreihenfolge aus der Navigation** (`mkdocs.yml`).
Nicht Teil der veröffentlichten Doku - dient als Planungs- und Kontrollinstrument (Abfolge, Aufwand, Artefakte).

**Stand: 19.08.2026** - alle in der Vorfassung angemerkten Verbesserungen sind umgesetzt; siehe [Änderungsprotokoll](#anderungsprotokoll) am Ende.

**Legende:** `!!! lab` = Pflichtübung · `??? lab` = eingeklappt/optional · 🐍 = optionaler Python-Block am Kapitelende · 🎯 = Übung hat einen Erwartungshorizont (`??? success "Was du beobachten solltest"`)

---

## Roter Faden

- **Ab dem Kapitel „Anatomie"** arbeiten alle Labs an **einer eigenen Geschäftsidee** der Studierenden (`idee.md`), die in „Kritisches Prompting" als **Version 2** fortgeschrieben wird.
- Jedes Kapitel endet mit einem Eintrag in der wachsenden Prompt-Sammlung `prompts.md`; alle Messwerte laufen in `lab_log.md` zusammen.
- Standardmodell: `gemma3:1b`; Härtetests gegen `gemma3:270m`, Vergleich nach oben mit `gemma3:4b`.
- Standardparameter: `temperature 0.7` als Alltagswert, **`0.2` für jeden Zähllauf** (im Setup-Lab als Regel eingeführt).
- Abschluss: **Portfolio-Check** am Ende des Evaluationskapitels führt alle Artefakte zusammen.

**Alle Übungen sind Pflicht und bauen aufeinander auf.** Innerhalb eines Kapitels liefert die erste Übung den Vergleichspunkt und die letzte das **Artefakt** (`prompts.md`-Eintrag), das im nächsten Kapitel gebraucht wird. Von den neun `prompts.md`-Einträgen entstehen sieben in der jeweils letzten Übung eines Kapitels, `idee.md` in Anatomie Ü1 - deshalb gibt es bewusst **keine** Kernübungs-Markierung und keinen verkürzten Pfad.

**Artefakte, die im Kursverlauf entstehen:**

| Datei | entsteht in |
|---|---|
| `lab_log.md` | Setup, Einführungsbox (Laborbuch für alle Messwerte) |
| `idee.md` | Anatomie, Übung 1 |
| `prompts.md` → `## 01 Beschreibung` | Anatomie, Übung 4 |
| `testfaelle.md` | Shot Prompting, Übung 1 |
| `prompts.md` → `## 02a Canvas (Few-Shot)` | Shot Prompting, Übung 3 |
| `prompt_log.md` | Iteratives, Übung 1 |
| `prompts.md` → `## 02b Canvas (iteriert)` | Iteratives, Übung 3 (**ersetzt 02a nicht mehr**) |
| `prompts.md` → `## 03 Canvas strukturiert` | Strukturierte Ausgaben, Übung 4 |
| `prompts.md` → `## 04 Rollen` | Rollen, Übung 3 |
| `kette_1_markt.md`, `kette_2_swot.md`, … | Chaining, Übung 3 |
| `prompts.md` → `## 05 Kette` | Chaining, Übung 5 |
| `kritik.md` | Kritisches Prompting, Übung 2 (angelegt) + 3 (gefüllt) |
| `prompts.md` → `## 06 Kritik` | Kritisches Prompting, Übung 4 |
| `idee.md` **v2** | Kritisches Prompting, Übung 5 |
| `prompts.md` → `## 07 Multimodal` | Multimodal, Übung 3 |
| `prompts.md` → `## 08 Evaluation` | Evaluation, Übung 5 |
| Portfolio (alles zusammen) | Evaluation, Abschlussübung |

---

## 1 · Setup: Lokales LLM mit Ollama

Quelle: `docs/prompt/ollama-setup.md` · noch **ohne** eigene Geschäftsidee (mit Hinweis, sie schon hier zu verwenden)

Vorangestellt: `!!! adv "So arbeitest du in allen Labs 📓"` - stellt klar, dass die Übungen aufeinander aufbauen, und führt die Temperaturregel für Zähllaufe, die n=5-Warnung und das `lab_log.md` ein.

| # | Titel | Inhalt |
|---|---|---|
| 1 🎯 | Der Realitätscheck 🧪 | Derselbe Sachverhalt zweimal an `gemma3:1b` - schlampig vs. präzise. Hinweis: eigene Idee statt Café verwenden. |
| 2 🎯 | Temperatur erfühlen 🌡️ | Derselbe Prompt bei `0.0` / **`0.7`** / `1.5`, Ergebnisse ins `lab_log.md`. |
|  🎯 | Der Modell-Vergleich ⚖️ | Schlechter und guter Prompt an `270m` / `1b` / `4b`. **Ein guter Prompt ersetzt oft ein größeres Modell.** |
| 4 🎯 | Das Kontextfenster zum Überlaufen bringen 🪟 | `num_ctx 512`, Systemregel setzen, zählen, nach wie vielen Runden sie bricht; Gegenprobe mit `4096`. |

---

## 2 · Anatomie eines guten Prompts

Quelle: `docs/prompt/anatomie.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Deine Geschäftsidee festlegen 💡 | Idee in 3-5 Sätzen in `idee.md`. Enthält eine Warnbox mit **Negativ- und Positivbeispiel** (vage Idee sabotiert alle folgenden Labs). |
|  🎯 | Die fünf Bausteine einzeln zuschalten | 5 Stufen: Aufgabe → Rolle → Kontext → Einschränkungen → Format, mit **fertiger Bewertungstabelle** für `lab_log.md`. |
| 3 🎯 | Der rosa Elefant 🐘 | Negative vs. positive Einschränkung, je 3×, mit **Zählregel `x/3`**. |
| 4 | Härtetest und Prompt sichern | Bester Prompt auf `gemma3:270m` → `prompts.md ## 01`. Tipp-Box etabliert den Härtetest als **wiederkehrendes Ritual**. |
| 🐍 | `bausteine.py` | Alle fünf Stufen automatisch durchlaufen. |

---

## 3 · Shot Prompting

Quelle: `docs/prompt/shot-prompting.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 🎯 | Zero-Shot vs. Few-Shot messen | Testfälle **vorab** in `testfaelle.md` einfrieren (inkl. Beispielblock mit Grenzfällen); **zwei getrennte Messgrößen**: Formattreue und Richtigkeit. |
| 2 🎯 | Deinen Stil beibringen | Zwei eigene Namen vorgeben, dritten ergänzen lassen; Stilwechsel als Gegenprobe. |
|  🎯 | Business Model Canvas erzeugen | Canvas Zero- vs. Few-Shot → `prompts.md ## 02a`; Härtetest-Erinnerung. |
| 🐍 | `fewshot_builder.py` | Few-Shot-Prompts programmatisch bauen. |

---

## 4 · Iterative Prompting

Quelle: `docs/prompt/iteratives.md`

| # | Titel | Inhalt |
|---|---|---|
|  🎯 | Eine Schraube pro Runde | ≥ 4 Runden, je genau eine Änderung; Protokoll in `prompt_log.md`. |
| 2 🎯 | Das Modell als Prompt-Kritiker | Modell nach fehlenden Informationen fragen. Erwartungsblock benennt den **blinden Fleck** (Selbsteinschätzung) und den Vorgriff auf Kapitel 10. |
| 3 🎯 | Wo hört es auf? | Sättigung + **Metrik-Blindheit als Pflichtfrage** + **Sabotage-Runde** → `prompts.md ## 02b` (02a bleibt stehen). |
| 🐍 | `bewerter.py` | Automatisches Scoring; Text zeigt jetzt den **Regressions-Nutzen**, statt die Kernlehre zu doppeln. |

---

## 5 · Strukturierte Ausgaben

Quelle: `docs/prompt/strukturierte-ausgaben.md`

Vorangestellt: `!!! adv "Erst die Messbedingungen 🌡️"` - `temperature 0.2`, `/clear`, und ein **Prüfmittel für den Terminal-Pfad**: `… | python -m json.tool`.

| # | Titel | Inhalt |
|---|---|---|
| 1 🎯 | Wie zuverlässig ist JSON? | 5× ohne / 5× mit `--format json`. Erwartungsblock trennt **gültiges** von **erwartetem** JSON. |
|  🎯 | Vorlage schlägt JSON | `SCHLÜSSEL: Wert`-Vorlage vs. JSON, auch auf `gemma3:270m`. Erwartungsblock erklärt **alles-oder-nichts vs. fehlertolerant**. |
| 3 🎯 | Der Reparatur-Prompt | Fehler im selben Chat benennen + **Abbruchregel nach zwei Versuchen** (Kontext verschmutzt sonst). |
| 4 | Dein Canvas in mehreren Formaten | Auf **zwei** Formate reduziert (Mensch/Maschine); Tipp-Box mit **Gruppenaufteilung** für alle vier. |
| 🐍 | `json_pruefen.py` | JSON einlesen und Schema prüfen. |

---

## 6 · Rollenbasiertes Prompting

Quelle: `docs/prompt/rollen.md`

| # | Titel | Inhalt |
|---|---|---|
|  🎯 | Vier Rollen, deine Idee | Vier vollständige Rollen; **Matrixvorlage** als Codeblock; Erwartungsblock inkl. Diagnose „alle Rollen sagen dasselbe → Rollen zu dünn". |
| 2 | Wirkt die Rolle wirklich? | Wortzählung ohne/mit Rolle, Gegenprobe `270m`. Warnbox: **Messgröße ist mit Absicht grob**, Rückverweis auf Kapitel 4. |
| 3 🎯 | Den Zielkonflikt finden | Konflikt benennen, **auflösen** und die Änderung festhalten (fließt in `idee.md` v2 ein) → `prompts.md ## 04`. |
| Box | Rollen tragen die Vorurteile ihrer Trainingsdaten 🧭 | Bias-Reflexion mit Gegentest, Brücke zu Kapitel 10. |
| 🐍 | `rollenrunde.py` | Alle Rollen automatisch durchlaufen, Einzelnennungen (⭐) ausweisen. |

---

## 7 · Prompt Chaining

Quelle: `docs/prompt/chaining.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 🎯 | Der Monolith - bewusst scheitern lassen | Alles in einem Prompt; **Hinweis, wie man den Monolith zuverlässig an die Grenze bringt**. |
| 2 | Die Kette zuerst zeichnen | Papier-Diagramm **vor** der Ausführung (war vorher Übung 4). |
|  🎯 | Dieselbe Aufgabe als Kette | Drei Schritte; **Terminal-Muster mit Dateieingabe** (`$(cat …)` / PowerShell-Variante) statt Copy-Paste. |
| 4 🎯 | Der Kontrollpunkt - und was ohne ihn passiert | Vollständigkeitszählung **plus Fehlerfortpflanzungs-Test**: falsche Zahl einschleusen und verfolgen. |
| 5 | Die Kette abschließen | Optionaler `4b`-Lauf → `prompts.md ## 05`. |
| 🐍 | `kette.py` | Kette automatisieren, Zwischenergebnisse sichern. |

---

## 8 · Kritisches Prompting

Quelle: `docs/prompt/kritisches.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 🎯 | Sycophancy an der eigenen Idee nachweisen | Drei Framings, Wortzählung **plus Ja/Nein-Frage nach dem K.-o.-Risiko**. |
| 2 🎯 | Das Pre-Mortem | Szenario 2028; **legt `kritik.md` an** (vorher erst in Übung 3). |
|  🎯 | Der Red-Team-Durchlauf | Vier Angreifer, 12 Punkte in `kritik.md`. |
| 4 | Aus Kritik Arbeit machen | ✅/❓/❌ - **jedes ❌ ist begründungspflichtig** (eigene Warnbox: dort verschwindet unbequeme Kritik). |
| 5 🎯 | Die Idee fortschreiben | **`idee.md` v2** aus Änderungen, Zielkonflikt und Canvas-Erkenntnissen; v1 bleibt stehen. |
| 🐍 | `redteam.py` | Red Team automatisieren. |

---

## 9 · Multimodales Prompting

Quelle: `docs/prompt/multimodal.md` · beginnt im Browser statt im Terminal; Modellwahl ist Eigenrecherche.

Vorangestellt: `!!! adv "Wenn dein Rechner nicht mitspielt 💻"` - **Fallback** über Cloud-Modelle (`?c=cloud`, inkl. Datenschutzhinweis) oder Partnerarbeit, plus `ollama rm` zum Aufräumen.

| # | Titel | Inhalt |
|---|---|---|
| 1 | Modelle nach Fähigkeit filtern | `?c=vision`, drei passende Modelle mit Name, Größe, Kontextfenster notieren. |
|  🎯 | Herausfinden, wie eine Datei in den Prompt kommt | Eigenrecherche - mit eingeklapptem **Auffangblock** (Bildpfad im Prompt, Erkennungstest, PDF-Umweg) für den Fall, dass es hakt. |
| 3 🎯 | Ausprobieren | Vision-Modell vs. `gemma3:1b`, unbelegte Aussagen markieren → `prompts.md ## 07`. |
| 🐍 | `bild_beschreiben.py` | **Neu**: `images=[…]` in `ollama.chat`, niedrige Temperatur, „nicht erkennbar" als erlaubter Ausweg. |

---

## 10 · Evaluation von KI-Ergebnissen

Quelle: `docs/prompt/evaluation.md`

| # | Titel | Inhalt |
|---|---|---|
|  🎯 | Halluzinationen provozieren | Vier unbeantwortbare Branchenfragen, eine davon zu belegen versuchen. |
| 2 🎯 | Unsicherheit markieren lassen | `[BELEGT]`/`[ANNAHME]`/`[GESCHÄTZT]`; Erwartungsblock schließt die **Klammer zu Kapitel 4 Übung 2**. |
| 3 | Faktenprüfung deiner Marktanalyse | Als **Hausaufgabe** deklariert; Warnbox trennt den Laboranteil (markieren, Tabelle anlegen) von der Recherche zu Hause. |
| 4 🎯 | Der Austauschtest - dein Füllmaterial-Anteil | **Eigenständige Übung mit Namen** (vorher Punkt 1 einer Sammelübung). |
| 5 🎯 | Bias aufspüren | Unausgesprochene Annahmen, Rückverweis auf die Rollen → `prompts.md ## 08`. |
| 🐍 | `faktencheck.py` | Prüfpflichtige Angaben per Regex finden. |

### Abschluss: dein Portfolio *(eigener Abschnitt nach dem Lab)*

| # | Titel | Inhalt |
|---|---|---|
| Abschluss | Der Portfolio-Check | Bestandsaufnahme aller neun `prompts.md`-Einträge, ein Satz je Eintrag, die besten drei markieren, `idee.md` v1 gegen v2 lesen. |
| ??? 🎯 | Der Realitätsabgleich - gilt das auch für die Großen? ⚖️ | optional | Bester und schlechtester Prompt gegen ein großes Modell. Kernaussage: Große Modelle **verdecken** schlechte Prompts, sie beheben sie nicht. |

---

## Zahlen auf einen Blick

| Kapitel | Pflicht | Optional | 🎯 Erwartungshorizont | 🐍 |
|---|---|---|---|---|
| Setup | 4 | - | 4 | - |
| Anatomie | 4 | - | 2 | ✅ |
| Shot Prompting | 3 | - | 3 | ✅ |
| Iteratives | 3 | - | 3 | ✅ |
| Strukturierte Ausgaben | 4 | - | 3 | ✅ |
| Rollen | 3 | - | 2 | ✅ |
| Chaining | 5 | - | 3 | ✅ |
| Kritisches | 5 | - | 4 | ✅ |
| Multimodal | 3 | - | 2 | ✅ |
| Evaluation (inkl. Portfolio) | 6 | 1 | 5 | ✅ |
| **Summe** | **40** | **1** | **31** | **9** |

Zum Vergleich der Ausgangsstand: 32 Pflichtübungen, **1** Erwartungshorizont.

---

## Änderungsprotokoll

Umgesetzt am **19.08.2026** - alle Punkte der Vorfassung dieser Datei.

### Kapitelübergreifend

- **Erwartungshorizonte**: von 1 auf 31 eingeklappte `??? success`-Blöcke.
- **Keine Zeitangaben und keine Kernübungs-Markierung.** Beides war zwischenzeitlich eingeführt und wurde wieder entfernt: Die Labs sind vollständig zu bearbeiten, weil die Artefaktkette sonst reißt. Die Konventionsbox im Setup und `prompt/index.md` sagen das ausdrücklich.
- **`lab_log.md`** als Laborbuch im Setup eingeführt (Tabellenvorlage), in allen Kapiteln referenziert.
- **Messbedingungen**: `temperature 0.2` + `/clear` für Zähllaufe, inkl. ehrlicher n=5-Notiz.
- **Metrik-Skepsis als roter Faden** explizit gemacht: Kapitel 4 (Pflichtteil statt 🐍), 6 (Wortzählung), 10 (Selbsteinschätzung) verweisen aufeinander.
- **Härtetest** als wiederkehrendes Ritual etabliert (Kap. 2, erinnert in Kap. 3).

### Fehlerkorrekturen

- `ollama-setup.md`: Verweis auf die nicht existierende „Übung 0" → Übung 1.
- `ollama-setup.md`: Tippfehler „Auch hier wiede" → „wieder".

### Neue Übungen

- **Setup Ü4 - Kontextfenster zum Überlaufen bringen** (`num_ctx 512`). *Abweichung vom Vorschlag:* Das Lab liegt im Setup-Kapitel, nicht im Kapitel „Halluzinationen und Kontextfenster" - dieses kommt in der Navigation **vor** der Ollama-Installation, dort wäre die Übung nicht ausführbar. Das Kontextfenster-Kapitel verweist mit einer `adv`-Box darauf.
- **Chaining Ü2** - Kette zeichnen (aus der alten Sammelübung 4 herausgelöst und nach vorn gezogen).
- **Kritisches Ü5** - `idee.md` v2 fortschreiben; schließt den Bogen zu Kapitel 2.
- **Evaluation Ü4** - Austauschtest als eigene Übung mit Namen „Füllmaterial-Anteil".
- **Evaluation Abschluss** - Portfolio-Check (Pflicht) und Realitätsabgleich gegen ein großes Modell (optional).
- **Multimodal 🐍** - `bild_beschreiben.py`; das Kapitel war das einzige ohne Python-Block.

### Umbauten

- Setup Ü3 von optional auf Pflicht (trägt die Kursthese).
- Shot Ü1: Testfälle vorab einfrieren, Formattreue **und** Richtigkeit getrennt messen.
- Iteratives Ü3: Metrik-Blindheit und Sabotage-Runde in den Pflichtteil; `## 02a`/`## 02b` statt Überschreiben.
- Strukturierte Ausgaben: `python -m json.tool` als Prüfmittel, Abbruchregel für Reparaturen, Ü4 von vier auf zwei Formate reduziert (Gruppenvariante als Tipp).
- Rollen: Matrixvorlage, Zielkonflikt muss aufgelöst werden, Bias-Box ergänzt.
- Chaining Ü3/Ü4: Dateieingabe statt Copy-Paste, Fehlerfortpflanzungs-Test ergänzt.
- Kritisches Ü4: Begründungspflicht für ❌; `kritik.md` bereits in Ü2 angelegt.
- Evaluation Ü3: als Hausaufgabe deklariert, Laboranteil abgegrenzt.
- Anatomie: Negativbeispiel für `idee.md`, Bewertungstabelle, Zählregel beim rosa Elefanten.

### Offen / bewusst nicht umgesetzt

- Nichts. Der einzige Vorschlag, der nicht wortgleich umgesetzt wurde, ist die Verortung des Kontextfenster-Labs (siehe oben).
