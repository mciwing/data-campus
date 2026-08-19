# Intern: Übersicht aller Ollama-Labs

Interne Sammelübersicht **aller 🔬 Ollama-Lab-Übungen** des Prompt-Engineering-Kurses, geordnet nach der **Kapitelreihenfolge aus der Navigation** (`mkdocs.yml`).
Nicht Teil der veröffentlichten Doku - dient als Planungs- und Kontrollinstrument (Abfolge, Aufwand, Artefakte).

**Legende:** `!!! lab` = Pflichtübung · `??? lab` = eingeklappt/optional · 🐍 = optionaler Python-Block am Kapitelende

---

## Roter Faden

- **Ab dem Kapitel „Anatomie"** arbeiten alle Labs an **einer eigenen Geschäftsidee** der Studierenden (`idee.md`).
- Jedes Kapitel endet mit einem Eintrag in der wachsenden Prompt-Sammlung `prompts.md`.
- Standardmodell: `gemma3:1b`; Härtetests gegen `gemma3:270m`, Vergleich nach oben mit `gemma3:4b`.

**Artefakte, die im Kursverlauf entstehen:**

| Datei | entsteht in |
|---|---|
| `idee.md` | Anatomie, Übung 1 |
| `prompts.md` → `## 01 Beschreibung` | Anatomie, Übung 4 |
| `prompts.md` → `## 02 Canvas` | Shot Prompting, Übung 3 (überarbeitet in Iteratives, Übung 3) |
| `prompt_log.md` | Iteratives, Übung 1 |
| `prompts.md` → `## 03 Canvas strukturiert` | Strukturierte Ausgaben, Übung 4 |
| `prompts.md` → `## 04 Rollen` | Rollen, Übung 3 |
| `kette_1_markt.md`, `kette_2_swot.md`, … | Chaining, Übung 2 |
| `prompts.md` → `## 05 Kette` | Chaining, Übung 4 |
| `kritik.md` | Kritisches Prompting, Übung 3 |
| `prompts.md` → `## 06 Kritik` | Kritisches Prompting, Übung 4 |
| `prompts.md` → `## 07 Multimodal` | Multimodal, Übung |
| `prompts.md` → `## 08 Evaluation` | Evaluation, Übung 4 |

---

## 1 · Setup: Lokales LLM mit Ollama

Quelle: `docs/prompt/ollama-setup.md` · noch **ohne** eigene Geschäftsidee

| # | Titel | Inhalt |
|---|---|---|
| 1 | Der Realitätscheck 🧪 | Derselbe Sachverhalt zweimal an `gemma3:1b` - einmal schlampig (*„Schreib was über mein Café"*), einmal präzise (3 Sätze, Zielgruppe, Ton). Output vergleichen. |
| 2 | Temperatur erfühlen 🌡️ | Chat-Modus, derselbe Prompt bei `temperature 0.0` vs. `1.5` (mit `/clear` dazwischen), weitere Werte ausprobieren. |
| 3 | Der Modell-Vergleich ⚖️ *(optional, `??? lab`)* | Schlechter und guter Prompt an `gemma3:270m` / `1b` / `4b`. Erkenntnis: **Ein guter Prompt ersetzt oft ein größeres Modell.** |

---

## 2 · Anatomie eines guten Prompts

Quelle: `docs/prompt/anatomie.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Deine Geschäftsidee festlegen 💡 | Idee in 3-5 Sätzen in `idee.md`: Angebot/Zielgruppe, Problem, Ausgangslage (Ort, Team, Startkapital). Ab jetzt **Kontext-Baustein** in jedem Prompt. |
| 2 | Die fünf Bausteine einzeln zuschalten | Aufgabe *„Nenne die drei größten Risiken."* in 5 Stufen ausbauen: Aufgabe → + Rolle → + Kontext → + Einschränkungen → + Format. Jede Stufe 0-5 Punkte in Konkretheit / Nutzbarkeit / Formattreue. Leitfrage: Wo liegt der größte Sprung (meist 2 → 3)? |
| 3 | Der rosa Elefant 🐘 | Dieselbe Einschränkung negativ (*„Schreibe KEINE Einleitung."*) vs. positiv (*„Beginne direkt mit dem ersten Fakt."*), je 3× mit `/clear`. |
| 4 | Härtetest und Prompt sichern | Bester Prompt aus Übung 2 auf `gemma3:270m`; welcher Baustein müsste deutlicher werden? Finalen Prompt nach `prompts.md` → `## 01 Beschreibung`. |
| 🐍 | `bausteine.py` | Alle fünf Stufen automatisch durchlaufen (benötigt `llm.py` aus dem Setup). |

---

## 3 · Shot Prompting

Quelle: `docs/prompt/shot-prompting.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Zero-Shot vs. Few-Shot messen | Eigene Klassifikationsaufgabe (z. B. Beschwerde/Frage/Lob), 5 Testfälle inkl. Grenzfall. Zero-Shot vs. Few-Shot (3 Beispiele, letztes Label offen). Beide Trefferquoten als Bruch notieren. |
| 2 | Deinen Stil beibringen | Zwei eigene Produkt-/Angebotsnamen vorgeben, dritten ergänzen lassen; danach Beispiele gegen völlig anderen Stil tauschen. Frage: Übernimmt das Modell den Stil, ohne dass er je beschrieben wurde? |
| 3 | Business Model Canvas erzeugen | Canvas Zero-Shot (wie viele der 9 Felder?) vs. Few-Shot (2 vollständige Felder eines fremden Beispiels vorgeben). Vergleich nach Vollständigkeit, Formattreue, Substanz → `prompts.md` → `## 02 Canvas`. |
| 🐍 | `fewshot_builder.py` | Few-Shot-Prompts programmatisch bauen (Anweisung + Beispielpaare + offen gelassenes Label). |

---

## 4 · Iterative Prompting

Quelle: `docs/prompt/iteratives.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Eine Schraube pro Runde | Canvas-Prompt in ≥ 4 Runden verbessern, pro Runde genau **eine** Änderung (Baseline → 9 Feldnamen → Kontext → Format/Umfang). Messgröße: Anzahl vorhandener Felder. Protokoll in `prompt_log.md`. |
| 2 | Das Modell als Prompt-Kritiker | Schwächsten Prompt im selben Chat fragen, welche drei Informationen gefehlt haben. Abgleich mit den fünf Bausteinen aus Kapitel 2. |
| 3 | Wo hört es auf? | Weiter iterieren bis zur Sättigung: Nach welcher Runde kein Zuwachs mehr? Welche Änderung hat sogar **verschlechtert**? Beste Version ersetzt `prompts.md` → `## 02 Canvas`. |
| 🐍 | `bewerter.py` | Prompts automatisch scoren (Pflichtbegriffe + Längenstrafe). Lehre: Eine Metrik misst nur, was sie misst - sie ersetzt das Lesen nicht. |

---

## 5 · Strukturierte Ausgaben

Quelle: `docs/prompt/strukturierte-ausgaben.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Wie zuverlässig ist JSON? | 3 Risiken als JSON (`risiken` → `titel`, `schwere`), je 5× **ohne** und **mit** `--format json`. Zählen: Wie oft gültiges JSON? |
| 2 | Vorlage schlägt JSON | Eigene `SCHLÜSSEL: Wert`-Vorlage (PRODUKT, ZIELGRUPPE, NUTZEN, PREIS, RISIKO), 5×, danach auf `gemma3:270m`. Frage: Was überlebt beim winzigsten Modell - JSON oder Vorlage? |
| 3 | Der Reparatur-Prompt | Formatfehler im **selben Chat** benennen und erneut ausgeben lassen. Wie oft braucht es die Korrekturrunde - reicht eine? |
| 4 | Dein Canvas in vier Formaten | Canvas als Tabelle / JSON / Markdown / Vorlage, je 5×, Fehlversuche notieren, Einsatzzweck festhalten → `prompts.md` → `## 03 Canvas strukturiert`. |
| 🐍 | `json_pruefen.py` | JSON einlesen und **Schema** prüfen. Lehre: `format="json"` sichert die Syntax, nicht die erlaubten Werte. |

---

## 6 · Rollenbasiertes Prompting

Quelle: `docs/prompt/rollen.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Vier Rollen, deine Idee | Vier vollständige Rollen (🎓 Experte · 💰 Investor · 🛒 Kunde · ⚔️ Konkurrent) mit Funktion, Erfahrung, Haltung, Auftrag; via `/set system`, `/clear` dazwischen; je zwei größte Schwachstellen. Matrix Rollen × Punkte, **Einzelnennungen** markieren. |
| 2 | Wirkt die Rolle wirklich? | Dieselbe Frage ohne/mit Investoren-Rolle; Investoren-Wörter zählen (Markt, Marge, Umsatz, Kapital, skalieren, Wettbewerb, Risiko). Wiederholung auf `gemma3:270m` - kleine Modelle „vergessen" die Systemrolle. |
| 3 | Den Zielkonflikt finden | Widerspruch zwischen zwei Rollen suchen (z. B. Skalierung vs. Regionalität) und in zwei Sätzen beschreiben → Rollendefinitionen nach `prompts.md` → `## 04 Rollen`. |
| 🐍 | `rollenrunde.py` | Alle Rollen automatisch durchlaufen und Einzelnennungen (⭐) in einer Begriffsmatrix ausweisen. |

---

## 7 · Prompt Chaining

Quelle: `docs/prompt/chaining.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Der Monolith - bewusst scheitern lassen | Marktanalyse + SWOT + 3 Verbesserungen in **einem** Prompt. Wie viele Teile kommen brauchbar an, wo bricht der Text ab? |
| 2 | Dieselbe Aufgabe als Kette | Drei Schritte mit festem Format und `/clear`: Zielmarkt (3 Stichpunkte) → SWOT (2 Punkte je Kategorie) → 3 Verbesserungen (*Adressiert*, *Erster Schritt*). Zwischenstände als `kette_1_markt.md`, `kette_2_swot.md`, … Vergleich mit Übung 1. |
| 3 | Der Kontrollpunkt | Schritt 2 fünfmal ausführen, Vollständigkeit der 4 SWOT-Kategorien zählen; bei Lücke gezielt nachfassen statt neu starten. Optional auf `gemma3:270m`. |
| 4 | Die Kette abschließen | Kette zuerst auf Papier zeichnen (Schritte, Ein-/Ausgaben); optional komplette Kette auf `gemma3:4b` - wo ist der Unterschied am größten, am Anfang oder am Ende? → `prompts.md` → `## 05 Kette`. |
| 🐍 | `kette.py` | Kette automatisieren; `{start}` bleibt in jedem Schritt verfügbar, Zwischenergebnisse landen als Datei auf der Platte. |

---

## 8 · Kritisches Prompting

Quelle: `docs/prompt/kritisches.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Sycophancy an der eigenen Idee nachweisen | Dieselbe Frage in drei Framings (genial / sachlich / wahrscheinlich schlecht); Lob- und Warnwörter zählen. Frage: Wie weit liegen Variante 1 und 3 bei identischer Idee auseinander? |
| 2 | Das Pre-Mortem | Szenario 2028, Unternehmen gescheitert: Abschlussbericht mit genau 3 Hauptursachen (*Was passierte*, *Frühwarnzeichen*); Vergleich mit der höflichen Variante. |
| 3 | Der Red-Team-Durchlauf | Vier Angriffe mit `/clear` dazwischen: 🩸 Pessimist · 💸 Kostenjäger · ⚔️ Konkurrent · 🔍 Skeptiker, je genau 3 Punkte → 12 Punkte in `kritik.md`. |
| 4 | Aus Kritik Arbeit machen | Alle 12 Punkte markieren (✅ lösen · ❓ prüfen · ❌ trifft nicht zu - **auch Kritik wird halluziniert**), daraus 3 konkrete Änderungen ableiten → `prompts.md` → `## 06 Kritik`. |
| 🐍 | `redteam.py` | Red Team automatisieren und Bericht nach `kritik.md` schreiben; die Bewertung bleibt Handarbeit. |

---

## 9 · Multimodales Prompting

Quelle: `docs/prompt/multimodal.md` · **Sonderfall:** eine große, dreiteilige Übung; startet im Browser statt im Terminal, das Modell suchen die Studierenden selbst.

| Teil | Titel | Inhalt |
|---|---|---|
| 1 | Modelle nach Fähigkeit filtern | [ollama.com/search](https://ollama.com/search) nach **Vision / Tools / Thinking / Embedding / Cloud** filtern (`?c=vision`). Drei passende Vision-Modelle wählen (Download < halber freier RAM), je Name mit Tag, Größe, Kontextfenster notieren. |
| 2 | Herausfinden, wie eine Datei in den Prompt kommt | Selbst recherchieren (Modellseiten, [Ollama-Doku](https://docs.ollama.com)): Wie übergibt man ein **Bild** an `ollama run`? Woran erkennt man, dass es angenommen wurde? Und wie steht es um **PDFs**? |
| 3 | Ausprobieren | Modell per `ollama pull` laden, Bild zur eigenen Geschäftsidee schicken, ausdrücklich nur Sichtbares beschreiben lassen; unbelegte Aussagen markieren; Gegenprobe mit `gemma3:1b` (kein `vision`) → `prompts.md` → `## 07 Multimodal`. |

---

## 10 · Evaluation von KI-Ergebnissen

Quelle: `docs/prompt/evaluation.md`

| # | Titel | Inhalt |
|---|---|---|
| 1 | Halluzinationen provozieren | Vier unbeantwortbare Branchenfragen (regionales Marktvolumen im Vorjahr, Studien, aktuelle Förderungen, regionaler Marktführer); anschließend **eine** Angabe im Internet zu belegen versuchen. |
| 2 | Unsicherheit markieren lassen | Dieselben Fragen mit Kennzeichnung `[BELEGT]` · `[ANNAHME]` · `[GESCHÄTZT]`; hält sich das Modell daran, und stimmt `[BELEGT]` wirklich? Dreimal wiederholen - bleiben die Kategorien stabil? |
| 3 | Faktenprüfung deiner Marktanalyse | Marktanalyse aus der Kette (Kapitel 7) nehmen, jede Zahl / jeden Eigennamen / jede Jahreszahl markieren, in die Prüftabelle übertragen, ≥ 5 Angaben mit unabhängigen Quellen (Statistik Austria, WKO, Branchenverbände) prüfen - nicht mit derselben KI. |
| 4 | Austauschtest und Bias | Geschäftsidee im Fließtext austauschen → wie viel Prozent ergibt weiterhin Sinn (Füllmaterial-Anteil)? Mindestens eine unausgesprochene Annahme zu Größe, Wachstum oder Kultur finden → `prompts.md` → `## 08 Evaluation`. |
| 🐍 | `faktencheck.py` | Prüfpflichtige Angaben per Regex finden (Prozentwerte, Jahreszahlen, Geldbeträge); Erweiterungsidee: Muster für Eigennamen. |

---

## Zahlen auf einen Blick

| Kapitel | Pflicht | Optional | 🐍 Python |
|---|---|---|---|
| Setup | 2 | 1 | - |
| Anatomie | 4 | - | ✅ |
| Shot Prompting | 3 | - | ✅ |
| Iteratives | 3 | - | ✅ |
| Strukturierte Ausgaben | 4 | - | ✅ |
| Rollen | 3 | - | ✅ |
| Chaining | 4 | - | ✅ |
| Kritisches | 4 | - | ✅ |
| Multimodal | 1 (dreiteilig) | - | - |
| Evaluation | 4 | - | ✅ |
| **Summe** | **32** | **1** | **8** |
