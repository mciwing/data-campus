# Intern: Übersicht aller Ollama-Labs

Interne Sammelübersicht **aller 🔬 Ollama-Lab-Übungen** des Prompt-Engineering-Kurses, geordnet nach der **Kapitelreihenfolge aus der Navigation** (`mkdocs.yml`).
Nicht Teil der veröffentlichten Doku - dient als Planungs- und Kontrollinstrument (Abfolge, Aufwand, Artefakte).

**Stand: 19.08.2026** - alle in der Vorfassung angemerkten Verbesserungen sind umgesetzt; siehe [Änderungsprotokoll](#anderungsprotokoll) am Ende.

**Legende:** `!!! lab` = Pflichtübung · `??? lab` = eingeklappt/optional · 🐍 = optionaler Python-Block am Kapitelende · 🎯 = Übung hat einen Erwartungshorizont (`??? success "Was du beobachten solltest"`)

---

## Roter Faden

- **Ab dem Kapitel „Anatomie"** arbeiten alle Labs an **einer eigenen Geschäftsidee** der Studierenden (`idee.md`), die in „Kritisches Prompting" als **Version 2** fortgeschrieben wird.
- Der gesamte Kurs kommt mit **zwei Dateien** aus: `idee.md` und `lab_log.md`. Jedes Kapitel füllt dort seinen eigenen Abschnitt.
- Standardmodell: `gemma3:1b`; Härtetests gegen `gemma3:270m`, Vergleich nach oben mit `gemma3:4b`.
- Standardparameter: `temperature 0.7` als Alltagswert, **`0.2` für jeden Zähllauf** (im Setup-Lab als Regel eingeführt).
- Abschluss: **Portfolio-Check** am Ende des Evaluationskapitels führt alle Artefakte zusammen.

**Alle Übungen sind Pflicht und bauen aufeinander auf.** Innerhalb eines Kapitels liefert die erste Übung den Vergleichspunkt und die letzte das **Artefakt** (den `lab_log.md`-Abschnitt), das im nächsten Kapitel gebraucht wird - deshalb gibt es bewusst **keine** Kernübungs-Markierung und keinen verkürzten Pfad.

**Artefakte, die im Kursverlauf entstehen:** Der gesamte Kurs kommt mit **zwei Dateien** aus, beide im Ordner `prompt-labor`, beide im Setup-Lab angelegt.

| Datei | Inhalt |
|---|---|
| `idee.md` | Geschäftsidee in 3-5 Sätzen (Anatomie Ü1), am Kursende als **v2** fortgeschrieben (Kritisches Ü5). |
| `lab_log.md` | Laborbuch mit allem Übrigen, gegliedert nach Abschnitten (siehe unten). |

**Abschnitte im `lab_log.md`:**

| Abschnitt | entsteht in | Inhalt |
|---|---|---|
| `## 00 Setup` | Setup Ü2 | Messwerte-Tabelle (Temperaturvergleich) |
| `## 01 Beschreibung` | Anatomie Ü2/Ü4 | Bewertungstabelle der fünf Stufen, finaler Prompt |
| `## 02a Canvas (Few-Shot)` | Shot Ü1/Ü3 | Testfälle, Trefferquoten, Canvas-Prompt |
| `## 02b Canvas (iteriert)` | Iteratives Ü1/Ü3 | Iterationsprotokoll (was geändert / was bewirkt), beste Fassung |
| `## 03 Canvas strukturiert` | Strukturierte Ü1-Ü4 | Trefferquoten je Format, zuverlässigster Prompt |
| `## 04 Rollen` | Rollen Ü1/Ü3 | Rollenmatrix, vier Rollendefinitionen, Zielkonflikt |
| `## 05 Kette` | Chaining Ü3-Ü5 | Zwischenergebnisse Schritt 1-3, die drei Kettenprompts |
| `## 06 Kritik` | Kritisches Ü2-Ü4 | Pre-Mortem, 12 Red-Team-Punkte mit ✅/❓/❌, Kritik-Prompts |
| `## 07 Multimodal` | Multimodal Ü1/Ü3 | Modellrecherche, Bildprompt, unbelegte Aussagen |
| `## 08 Evaluation` | Evaluation Ü3-Ü5 | Prüftabelle, Füllmaterial-Anteil, Prüf-Prompt |

Nur das Python-Skript `kette.py` legt daneben temporäre `zwischenstand_*.txt`-Dateien an - reine Arbeitsdateien, deren Inhalt ins Laborbuch wandert.

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
| 4 | Härtetest und Prompt sichern | Bester Prompt auf `gemma3:270m` → `lab_log.md ## 01`. Tipp-Box etabliert den Härtetest als **wiederkehrendes Ritual**. |
| 🐍 | `bausteine.py` | Alle fünf Stufen automatisch durchlaufen. |

---

## 3 · Shot Prompting

Quelle: `docs/prompt/shot-prompting.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 🎯 | Zero-Shot vs. Few-Shot messen | Testfälle **vorab** in `lab_log.md → `## 02a`` einfrieren (inkl. Beispielblock mit Grenzfällen); **zwei getrennte Messgrößen**: Formattreue und Richtigkeit. |
| 2 🎯 | Deinen Stil beibringen | Zwei eigene Namen vorgeben, dritten ergänzen lassen; Stilwechsel als Gegenprobe. |
|  🎯 | Business Model Canvas erzeugen | Canvas Zero- vs. Few-Shot → `lab_log.md ## 02a`; Härtetest-Erinnerung. |
| 🐍 | `fewshot_builder.py` | Few-Shot-Prompts programmatisch bauen. |

---

## 4 · Iterative Prompting

Quelle: `docs/prompt/iteratives.md`

| # | Titel | Inhalt |
|---|---|---|
|  🎯 | Eine Schraube pro Runde | ≥ 4 Runden, je genau eine Änderung; Protokoll im `lab_log.md` unter `## 02b`. |
| 2 🎯 | Das Modell als Prompt-Kritiker | Modell nach fehlenden Informationen fragen. Erwartungsblock benennt den **blinden Fleck** (Selbsteinschätzung) und den Vorgriff auf Kapitel 10. |
| 3 🎯 | Wo hört es auf? | Sättigung + **Metrik-Blindheit als Pflichtfrage** + **Sabotage-Runde** → `lab_log.md ## 02b` (02a bleibt stehen). |
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
| 3 🎯 | Den Zielkonflikt finden | Konflikt benennen, **auflösen** und die Änderung festhalten (fließt in `idee.md` v2 ein) → `lab_log.md ## 04`. |
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
| 5 | Die Kette abschließen | Optionaler `4b`-Lauf → `lab_log.md ## 05`. |
| 🐍 | `kette.py` | Kette automatisieren, Zwischenergebnisse sichern. |

---

## 8 · Kritisches Prompting

Quelle: `docs/prompt/kritisches.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 🎯 | Sycophancy an der eigenen Idee nachweisen | Drei Framings, Wortzählung **plus Ja/Nein-Frage nach dem K.-o.-Risiko**. |
| 2 🎯 | Das Pre-Mortem | Szenario 2028; **legt den Abschnitt `## 06 Kritik` an** (vorher erst in Übung 3). |
|  🎯 | Der Red-Team-Durchlauf | Vier Angreifer, 12 Punkte unter `## 06 Kritik`. |
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
| 3 🎯 | Ausprobieren | Vision-Modell vs. `gemma3:1b`, unbelegte Aussagen markieren → `lab_log.md ## 07`. |
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
| 5 🎯 | Bias aufspüren | Unausgesprochene Annahmen, Rückverweis auf die Rollen → `lab_log.md ## 08`. |
| 🐍 | `faktencheck.py` | Prüfpflichtige Angaben per Regex finden. |

### Abschluss: dein Portfolio *(eigener Abschnitt nach dem Lab)*

| # | Titel | Inhalt |
|---|---|---|
| Abschluss | Der Portfolio-Check | Bestandsaufnahme aller neun `lab_log.md`-Abschnitte, ein Satz je Prompt, die besten drei markieren, `idee.md` v1 gegen v2 lesen. |
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
- Kritisches Ü4: Begründungspflicht für ❌; der Kritik-Abschnitt wird bereits in Ü2 angelegt.
- Evaluation Ü3: als Hausaufgabe deklariert, Laboranteil abgegrenzt.
- Anatomie: Negativbeispiel für `idee.md`, Bewertungstabelle, Zählregel beim rosa Elefanten.

### Offen / bewusst nicht umgesetzt

- Nichts. Der einzige Vorschlag, der nicht wortgleich umgesetzt wurde, ist die Verortung des Kontextfenster-Labs (siehe oben).

### Nachtrag: Konsolidierung auf zwei Dateien

Ursprünglich verteilten sich die Ergebnisse auf sechs Dateien (`prompts.md`, `prompt_log.md`, `testfaelle.md`, `kritik.md`, `kette_*.md` plus `idee.md`). Auf Wunsch reduziert auf **`idee.md` + `lab_log.md`**: Das Laborbuch ist nach Kapitelabschnitten gegliedert und nimmt Messwerte, Prompts und Zwischenergebnisse gemeinsam auf.

Betroffene Anpassungen: Setup-Arbeitsordner (Gerüst mit allen Abschnitten), sämtliche „Speichere … in"-Sätze der zehn Kapitel, die Kette in Chaining Ü3 (Zwischenergebnisse statt Dateien; der `$(cat …)`-Terminaltrick entfällt), `redteam.py` gibt jetzt aus statt zu schreiben, `kette.py` schreibt temporäre `.txt`-Arbeitsdateien.
