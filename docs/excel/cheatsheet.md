# Cheatsheet: Zahlenformate

Excel erlaubt es, eigene **Zahlenformate** zu definieren — über *Start* → *Zahl* → *Weitere Zahlenformate* → *Benutzerdefiniert*. In diesem Cheatsheet findest du die wichtigsten Platzhalter und Format-Codes auf einen Blick.

## Grundlegende Platzhalter

| Code | Bedeutung |
|---|---|
| `0` | Zeigt **nicht-signifikante Nullen** an, wenn eine Zahl weniger Stellen hat als Nullen im Format. |
| `#` | Zeigt **nur signifikante Ziffern** an — nicht-signifikante Nullen werden ignoriert. |
| `,` (Komma) | Dezimaltrennzeichen |
| `.` (Punkt) | 1.000er-Trennzeichen oder Anzeige in Tausendern |
| `?` | Reserviert Platz für nicht-signifikante Nullen, zeigt sie aber als Leerzeichen — nützlich, um Dezimalpunkte auszurichten |

### Beispiele: Nullen und Ziffern

| Format | Eingabe | Anzeige |
|---|---|---|
| `0` | 31 | 31 |
| `0,00` | 31,123 | 31,12 |
| `00 000` | 3100 | 03 100 |
| `#.##0` | 4261 | 4.261 |
| `#.##0,00` | 45,786 | 45,79 |

### Beispiele: Tausender-Trennzeichen

| Format | Eingabe | Anzeige |
|---|---|---|
| `#.##0` | 2600 | 2.600 |
| `0.` | 12000 | 12 |

Ein nachgestellter Punkt teilt die Zahl durch 1.000 (Anzeige in Tausendern), ohne den Wert zu verändern.

## Text in Formaten

Um **Text gemeinsam mit Zahlen** in einer Zelle anzuzeigen, gibt es zwei Wege:

- Text in **Anführungszeichen** (`"…"`) setzen
- Vor ein einzelnes Zeichen einen **Backslash** (`\`) setzen

| Format | Eingabe | Anzeige |
|---|---|---|
| `0 "Stk."` | 71 | 71 Stk. |
| `0 \g` | 5 | 5 g |

## Auffüllen und Abstände

| Code | Wirkung |
|---|---|
| `*<Zeichen>` | Teilt die Anzeige in einen **links- und rechtsbündigen Teil**. Der Abstand dazwischen wird mit dem angegebenen Zeichen aufgefüllt. |
| `_<Zeichen>` | Erzeugt einen **Abstand in der Breite des angegebenen Zeichens** (Alternative: Leerzeichen). |

### Beispiele: Auffüllen

| Format | Eingabe | Anzeige |
|---|---|---|
| `"EUR"* 0` | 25 | EUR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25 |
| `"EUR"*.0` | 25 | EUR..........25 |

### Beispiele: Abstände

| Format | Eingabe | Anzeige |
|---|---|---|
| `"EUR"_-0` | 8 | EUR 8 |
| `"EUR"_-0_-` | 8 | EUR 8 |
| `_-"EUR"* 0_-` | 8 | EUR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 |

## Datums- und Uhrzeit-Codes

### Tage

| Code | Bedeutung |
|---|---|
| `T` | Tage als 1–31 |
| `TT` | Tage als 01–31 (immer zweistellig) |
| `TTT` | Tage als So–Sa |
| `TTTT` | Tage als Sonntag–Samstag |

### Monate

| Code | Bedeutung |
|---|---|
| `M` | Monate als 1–12 |
| `MM` | Monate als 01–12 (immer zweistellig) |
| `MMM` | Monate als Jan–Dez |
| `MMMM` | Monate als Januar–Dezember |
| `MMMMM` | Monate mit dem ersten Buchstaben des Monats |

### Jahre

| Code | Bedeutung |
|---|---|
| `JJ` | Jahre als 00–99 |
| `JJJJ` | Jahre als 1900–9999 |

### Stunden, Minuten, Sekunden

| Code | Bedeutung |
|---|---|
| `h` | Stunden als 0–23 |
| `hh` | Stunden als 00–23 |
| `m` | Minuten als 0–59 |
| `mm` | Minuten als 00–59 |
| `s` | Sekunden als 0–59 |
| `ss` | Sekunden als 00–59 |

!!! warning "Hinweis"
    `m` und `mm` werden je nach Kontext als **Monat** oder **Minute** interpretiert. Direkt nach `h`/`hh` (Stunden) oder vor `s`/`ss` (Sekunden) erkennt Excel sie als Minuten.

## Bereiche und Bedingungen

Bereiche werden genutzt, um **unterschiedliche Formate** (positive/negative Zahlen, Nullwerte etc.) oder Bedingungen anzugeben. Sie werden mit einem **Semikolon** (`;`) voneinander getrennt. Die Reihenfolge ist:

```
<positiv>;<negativ>;<null>;<text>
```

### Beispiele: Vorzeichen und Nullwerte

| Beschreibung | Format | Eingabe | Anzeige |
|---|---|---|---|
| Nullwerte als `-` darstellen | `0;-0;-` | 0 | - |
| Negative Zahlen rot darstellen | `0;[Rot]-0` | -7 | -7 (in rot) |
| Nullwerte ausblenden | `Standard;-Standard` | 0 | *(leer)* |

### Verfügbare Farb-Codes

Innerhalb eckiger Klammern können Farben angegeben werden:

`[Schwarz]` &nbsp;·&nbsp; `[Blau]` &nbsp;·&nbsp; `[Zyan]` &nbsp;·&nbsp; `[Grün]` &nbsp;·&nbsp; `[Magenta]` &nbsp;·&nbsp; `[Weiß]` &nbsp;·&nbsp; `[Gelb]` &nbsp;·&nbsp; `[Rot]`

### Bedingte Formate

Innerhalb eckiger Klammern können auch **Vergleichsoperatoren** verwendet werden, um abhängig vom Wert ein Format zuzuweisen:

```
[>=1000000] 0,00.. " Mio";
[>=1000] 0,00. " T";
0
```

Dieses Format zeigt Werte ab 1.000.000 in Millionen, ab 1.000 in Tausend und sonst als ganze Zahl an.

## Häufige praktische Beispiele

| Anwendung | Format |
|---|---|
| Prozent mit zwei Dezimalstellen | `0,00 %` |
| Währung in Euro | `#.##0,00 "€"` |
| Telefonnummer | `+## (0) ### ###-####` |
| IBAN-Gruppen | `0000\ 0000\ 0000\ 0000\ 0000\ 00` |
| Datum lang | `TTTT, T. MMMM JJJJ` |
| Negative Zahl in Klammern | `#.##0,00;(#.##0,00)` |

!!! tip "Tipp"
    Wenn dir ein Excel-Standardformat fast passt, aber nicht ganz: Wähle es zuerst aus, gehe dann auf *Benutzerdefiniert* — Excel zeigt dort den dahinterliegenden Format-Code, den du als Vorlage anpassen kannst.
