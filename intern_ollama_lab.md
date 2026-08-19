# Intern: Übersicht aller Ollama-Labs

Interne Sammelübersicht **aller 🔬 Ollama-Lab-Übungen** des Prompt-Engineering-Kurses, geordnet nach der **Kapitelreihenfolge aus der Navigation** (`mkdocs.yml`).
Nicht Teil der veröffentlichten Doku - dient als Planungs- und Kontrollinstrument (Abfolge, Aufwand, Artefakte).

**Stand: 19.08.2026**, nach Entfernen des Kapitels *Evaluation von KI-Ergebnissen* und nach den manuellen Kürzungen in den Kapiteln 2-8. Diese Datei gibt den **Ist-Zustand** wieder, nicht den früher geplanten.

**Legende:** `!!! lab` = Pflichtübung · `??? lab` = eingeklappt/optional · 🐍 = optionaler Python-Block am Kapitelende · 🎯 = Übung hat einen Erwartungshorizont (`??? success`)

---

## Roter Faden

- **Ab dem Kapitel „Anatomie"** arbeiten alle Labs an **einer eigenen Geschäftsidee** der Studierenden (`idee.md`).
- Der gesamte Kurs kommt mit **zwei Dateien** aus: `idee.md` und `lab_log.md`. Jedes Kapitel füllt dort seinen eigenen Abschnitt.
- Standardmodell: `gemma3:1b`; die Vergleichsmodelle `gemma3:270m` und `gemma3:4b` sind ein **optionaler** Download.
- Standardparameter: `temperature 0.7` als Alltagswert, **`0.2` für jeden Zähllauf**.
- Alle Übungen sind **Pflicht und bauen aufeinander auf** - keine Kernübungs-Markierung, kein verkürzter Pfad.
- Abschluss: **Portfolio-Check** am Ende des Ausblick-Kapitels, das jetzt das letzte des Kurses ist.

**Abschnitte im `lab_log.md`:**

| Abschnitt | entsteht in | Inhalt |
|---|---|---|
| `## 00 Setup` | Setup Ü2 | Namen bei temp 0.0 / 0.7 / 1.5 |
| `## 01 Beschreibung` | Anatomie Ü2 | Bewertungstabelle der fünf Stufen |
| `## 02a Canvas (Few-Shot)` | Shot Ü1/Ü2 | Testfälle, Trefferquoten, Canvas-Prompt |
| `## 02b Canvas (iteriert)` | Iteratives Ü1 | Iterationsprotokoll: was geändert, was bewirkt |
| `## 03 Canvas strukturiert` | Strukturierte Ü3 | Trefferquoten je Format |
| `## 04 Rollen` | Rollen Ü1/Ü2 | Rollenmatrix, vier Rollendefinitionen, Zielkonflikt |
| `## 05 Kette` | Chaining Ü2 | Zwischenergebnisse Schritt 1-3 |
| `## 06 Kritik` | Kritisches Ü2 | Pre-Mortem: drei Ursachen mit Frühwarnzeichen |

Daneben legt nur das Python-Skript `kette.py` temporäre `zwischenstand_*.txt`-Dateien an.

---

## 1 · Setup: Lokales LLM mit Ollama

Quelle: `docs/prompt/ollama-setup.md` · noch **ohne** eigene Geschäftsidee

Vorangestellt: `!!! info "So arbeitest du in allen Labs"` - Übungen bauen aufeinander auf; Arbeitsordner `prompt-labor` mit `idee.md` + `lab_log.md` samt Gerüst aller Abschnitte.

| # | Titel | Inhalt |
|---|---|---|
| 1 | Der Realitätscheck | Derselbe Sachverhalt zweimal an `gemma3:1b` - schlampig vs. präzise. |
| 2 🎯 | Temperatur erfühlen | Derselbe Prompt bei `0.0` / `0.7` / `1.5`, Namen ins `lab_log.md`. |
| 3 🎯 | Das Kontextfenster zum Überlaufen bringen | `num_ctx 512`, Regel setzen, zählen, nach wie vielen Runden sie bricht; Gegenprobe `4096`. |
| 4 🎯 | Der Modell-Vergleich *(optional, `??? lab`)* | Schlechter und guter Prompt an `270m` / `1b` / `4b`. **Ein guter Prompt ersetzt oft ein größeres Modell.** |
| 🐍 | eigener Kapitelabschnitt „Ollama aus Python steuern" | Einrichtung, `llm.py`. |

---

## 2 · Anatomie eines guten Prompts

Quelle: `docs/prompt/anatomie.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Deine Geschäftsidee festlegen 💡 | Idee in 3-5 Sätzen in `idee.md`; Warnbox mit Negativ- und Positivbeispiel. |
| 2 | Die fünf Bausteine einzeln zuschalten | Aufgabe → Rolle → Kontext → Einschränkungen → Format, mit Bewertungstabelle fürs `lab_log.md`. |
| 3 | Der rosa Elefant 🐘 | Negative vs. positive Einschränkung, je 3×, eigene bessere Formulierung suchen. |
| 🐍 | `bausteine.py` | Alle fünf Stufen automatisch durchlaufen. |

---

## 3 · Shot Prompting

Quelle: `docs/prompt/shot-prompting.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Zero-Shot vs. Few-Shot messen | Klassifikationsaufgabe, erst Zero-Shot; dann fünf Testfälle (inkl. Grenzfällen) ins `lab_log.md`, dann Few-Shot. **Formattreue und Richtigkeit getrennt zählen.** |
| 2 | Business Model Canvas erzeugen | Canvas Zero- vs. Few-Shot, Vergleich nach Vollständigkeit → `## 02a`. |
| 🐍 | `fewshot_builder.py` | Few-Shot-Prompts programmatisch bauen. |

---

## 4 · Iterative Prompting

Quelle: `docs/prompt/iteratives.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Eine Schraube pro Runde | ≥ 4 Runden, je genau eine Änderung; Protokoll unter `## 02b`. |
| 2 | Das Modell als Prompt-Kritiker | Modell nach den drei fehlenden Informationen fragen, Abgleich mit den fünf Bausteinen. |
| 🐍 | `bewerter.py` | Automatisches Scoring; zeigt Metrik-Sättigung und den Regressions-Nutzen. |

---

## 5 · Strukturierte Ausgaben

Quelle: `docs/prompt/strukturierte-ausgaben.md`

Vorangestellt: `!!! info "Erst die Messbedingungen"` - `temperature 0.2`, `/clear`, Prüfmittel `… | python -m json.tool`.

| # | Titel | Inhalt |
|---|---|---|
| 1 | Wie zuverlässig ist JSON? | 5× ohne / 5× mit `--format json`, gültiges JSON zählen. |
| 2 | Der Reparatur-Prompt | Fehler im selben Chat benennen; **Abbruchregel nach zwei Versuchen**. |
| 3 | Dein Canvas in mehreren Formaten | Zwei Formate (Mensch/Maschine), je fünf Läufe → `## 03`. |
| 🐍 | `json_pruefen.py` | JSON einlesen und Schema prüfen. |

---

## 6 · Rollenbasiertes Prompting

Quelle: `docs/prompt/rollen.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Vier Rollen, deine Idee | Experte · Investor · Kunde · Konkurrent via `/set system`; Matrix mit Einzelnennungen. |
| 2 | Den Zielkonflikt finden | Widerspruch benennen, **auflösen**, Änderung festhalten → `## 04 Rollen`. |
| Box | Rollen tragen die Vorurteile ihrer Trainingsdaten | Bias-Reflexion mit Gegentest. |
| 🐍 | `rollenrunde.py` | Alle Rollen automatisch durchlaufen, Einzelnennungen ausweisen. |

---

## 7 · Prompt Chaining

Quelle: `docs/prompt/chaining.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Der Monolith - bewusst scheitern lassen | Alles in einem Prompt; Hinweis, wie man ihn zuverlässig an die Grenze bringt. |
| 2 | Dieselbe Aufgabe als Kette | Kette erst zeichnen, dann in drei Schritten ausführen; Zwischenergebnisse unter `## 05 Kette`; Vergleich mit Ü1. |
| 🐍 | `kette.py` | Kette automatisieren, Zwischenstände als temporäre `.txt`. |

---

## 8 · Kritisches Prompting

Quelle: `docs/prompt/kritisches.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Sycophancy an der eigenen Idee nachweisen | Drei Framings, Lob- und Warnwörter vergleichen. |
| 2 | Das Pre-Mortem | Szenario 2028; drei Ursachen mit Frühwarnzeichen → legt `## 06 Kritik` an. |
| 🐍 | `redteam.py` | Vier Angreifer automatisch durchlaufen, Ausgabe zum Übertragen ins Laborbuch. |

---

## 9 · Ausblick *(letztes Kapitel)*

Quelle: `docs/prompt/ausblick.md` (ehemals `multimodal.md`) · **kein Ollama-Lab mehr** - reines Lesekapitel plus Kursabschluss.

| Abschnitt | Inhalt |
|---|---|
| Multimodales Prompting | Was multimodal bedeutet (Modalität, Token-Kosten, „unser Kursmodell sieht nichts“) und die Modalitäten in der Praxis. |
| Bias | Aus dem entfernten Evaluationskapitel gerettet: Definition mit vier Bias-Formen (kulturell, sprachlich, Größe, Optimismus) und die Übung „Bias sichtbar machen“ über den Gegen-Rahmen. |
| Begrifflichkeiten: Tool, Agent, Skill, Plugin, MCP | Neu geschrieben. Je ein Abschnitt pro Begriff, Agenten-Definition und Meme aus dem alten Abschnitt übernommen, Landkarten-Tabelle mit Alltagsvergleichen, Warnung, dass die Begriffe nicht geschützt sind. |
| Abschluss des Kurses | Portfolio-Check (Pflicht) über alle `lab_log.md`-Abschnitte; Schritt 4 schreibt `idee.md` v2. Dazu der optionale Realitätsabgleich gegen ein großes Modell. |

**Entfallen mit dem Lab:** die drei Multimodal-Übungen (Modellsuche, Dateiübergabe, Ausprobieren), die Hardware-Fallback-Box und der Python-Block `bild_beschreiben.py`. Damit gibt es auch keinen `## 07 Multimodal`-Abschnitt im Laborbuch mehr.

---

## Zahlen auf einen Blick

| Kapitel | Pflicht | Optional | Erwartungshorizont | Python |
|---|---|---|---|---|
| Setup | 3 | 1 | 3 | eigener Abschnitt |
| Anatomie | 3 | - | - | x |
| Shot Prompting | 2 | - | - | x |
| Iteratives | 2 | - | - | x |
| Strukturierte Ausgaben | 3 | - | - | x |
| Rollen | 2 | - | - | x |
| Chaining | 2 | - | - | x |
| Kritisches | 2 | - | - | x |
| Ausblick (nur Portfolio-Check) | 1 | 1 | 1 | - |
| **Summe** | **20** | **2** | **4** | **7** |

Acht Kapitel mit Lab, ein Ausblick ohne.

---

## Offene Punkte

!!! warning "Ein loses Ende"

    **`## 06 Kritik` bleibt dünn.** Der Abschnitt wird im Pre-Mortem angelegt; der Red-Team-Durchlauf, der ihn mit zwölf Punkten gefüllt hat, ist bei der Überarbeitung entfallen. Der Python-Block `redteam.py` verweist weiterhin auf diesen Abschnitt.

    *(Erledigt: `idee.md` v2 wird jetzt im Portfolio-Check selbst geschrieben - Schritt 4 - statt in der entfallenen Kritisches-Übung.)*

---

## Änderungsprotokoll

### Umbau: Multimodal → Ausblick

- `docs/prompt/multimodal.md` → **`docs/prompt/ausblick.md`**, Nav-Eintrag heißt jetzt *Ausblick*, Kapitelkarte in `prompt/index.md` entsprechend (Multimodal · Bias · Tools, Agenten, Skills, MCP).
- Kapitelaufbau: **Multimodales Prompting** (bisherige Inhalte, eine Ebene tiefer gerückt) → **Bias** (aus dem entfernten Evaluationskapitel samt Quelle Bender et al.) → **Begrifflichkeiten** (neu) → **Abschluss des Kurses**.
- **Kein Ollama-Lab mehr**: die drei Übungen, die Hardware-Box und `bild_beschreiben.py` sind entfallen; `## 07 Multimodal` aus dem Laborbuch-Gerüst und der Portfolio-Tabelle entfernt.
- Portfolio-Check Schritt 4 schreibt jetzt selbst die `idee.md` v2 - vorher hing er an einer Übung, die es nicht mehr gibt.

### Entfernt: Kapitel „Evaluation von KI-Ergebnissen"

- `docs/prompt/evaluation.md` gelöscht, Nav-Eintrag in `mkdocs.yml` entfernt, Kapitelkarte in `prompt/index.md` entfernt.
- Der **Portfolio-Check** und der optionale **Realitätsabgleich** sind ins letzte Kapitel gewandert (heute `ausblick.md`) - sie sind Kursabschluss, nicht Evaluationsstoff.
- `## 08 Evaluation` aus dem `lab_log.md`-Gerüst und aus der Portfolio-Tabelle entfernt.
- Sieben eingehende Verweise umformuliert statt nur entlinkt - in `funktionsweise-llms.md`, `halluzinationen-kontextfenster.md`, `staerken-grenzen.md`, `kritisches.md`, `rollen.md` (2×) und dem heutigen `ausblick.md`. Wo bisher aufs Kapitel verwiesen wurde, steht jetzt die Sache selbst („mit unabhängigen Quellen, nicht mit derselben KI") oder ein Verweis auf *Halluzinationen und Kontextfenster*.
- `mkdocs build --strict` ohne Warnungen; keine Restvorkommen von `evaluation.md`.

### Früher umgesetzt und weiterhin aktiv

- **Zwei-Dateien-Prinzip** (`idee.md` + `lab_log.md`) statt sechs Einzeldateien.
- **Messbedingungen** für Zähllaufe (`temperature 0.2`, `/clear`), Prüfmittel `python -m json.tool`.
- **Kontextfenster-Lab** im Setup (das Kapitel *Halluzinationen und Kontextfenster* liegt vor der Ollama-Installation und verweist mit einer Box darauf).
- **Bias-Box** bei den Rollen, **Abbruchregel** beim Reparatur-Prompt, **Hardware-Fallback** bei Multimodal, **`bild_beschreiben.py`** als dortiger Python-Block.
- **Modell-Vergleich** im Setup als letzte, optionale Übung; die Vergleichsmodelle sind ein optionaler Download.
- Fehlerkorrekturen: Verweis auf die nicht existierende „Übung 0", Tippfehler „wiede", tote Referenz „aus Schritt 2".

### Zurückgenommen

- **Zeitangaben** an den Übungstiteln - wieder entfernt.
- **Kernübungs-Markierung (⭐)** samt Minimalpfad - wieder entfernt; alle Übungen sind Pflicht.
- **Erwartungshorizonte** (`??? success`) in den Kapiteln 2-8 - in der manuellen Überarbeitung entfernt; erhalten sind sie nur im Setup und in Multimodal.
