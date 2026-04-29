# Grundlagen

Damit wir Excel produktiv einsetzen können, brauchen wir zuerst ein solides Fundament: Welche Tasten gibt es, wie ist eine Arbeitsmappe aufgebaut, wie navigieren wir effizient und wie geben wir die ersten Formeln ein? Genau darum geht es in diesem Kapitel.

## Tastenbelegung

Um Excel — und auch andere Software — effizient bedienen zu können, lernen wir in den kommenden Kapiteln einige **Shortcuts** (deutsch: Tastenkombination) kennen. Zur Wiederholung findest du hier die wichtigsten Tasten einer klassischen QWERTZ-Tastatur:

![Klassisches Layout einer QWERTZ-Tastatur](../assets/excel/grundlagen/Tastatur.svg)

1. <kbd>ESC</kbd>: Escape, Menüfenster abbrechen
2. <kbd>TAB</kbd>: Tabulator
3. <kbd>CAPS LOCK</kbd>: Permanente Großschreibung ein/aus
4. <kbd>SHIFT</kbd> (oder UMSCHALT): Zweite Funktion oder Großschreibung
5. <kbd>STRG</kbd> (oder CTRL): Steuerungs- oder Controltaste
6. <kbd>FN</kbd>: Funktions-Taste. Um die zweite Belegung zu nutzen, muss erst die Funktionstaste gedrückt werden.
7. <kbd>START</kbd> (Windows-Taste)
8. <kbd>ALT</kbd>: Alternativ-Taste
9. <kbd>Leertaste</kbd>
10. <kbd>ALT GR</kbd>: Alternativ-Groß-Taste
11. <kbd>ENTER</kbd> (oder RETURN, EINGABE, BESTÄTIGUNG): Fenster mit OK bestätigen oder Absatzzeichen in der Textverarbeitung
12. <kbd>BACKSPACE</kbd>: Löschen eines Zeichens links vom Cursor
13. <kbd>ENTF</kbd> (oder DEL): Löschen eines Zeichens rechts vom Cursor
14. <kbd>POS1</kbd>: Cursor an den Anfang der Zeile
15. <kbd>ENDE</kbd>: Cursor ans Ende der Zeile
16. <kbd>BILD ↑</kbd>: Einen Bildschirmausschnitt nach oben springen
17. <kbd>BILD ↓</kbd>: Einen Bildschirmausschnitt nach unten springen
18. **Pfeiltasten**: Cursor eine Spalte nach links/rechts bzw. eine Zeile nach oben/unten setzen

## Datei öffnen, speichern und schließen

| Aktion | Shortcut |
|---|---|
| Excel öffnen | Klick auf die Verknüpfung im Startmenü oder Doppelklick auf die Verknüpfung am Desktop |
| Arbeitsmappe öffnen | Doppelklick auf die Excel-Datei — oder bei geöffnetem Excel <kbd>STRG</kbd> + <kbd>O</kbd> |
| Mehrere Arbeitsmappen gleichzeitig öffnen | Mehrere Dateien anwählen und dann <kbd>ENTER</kbd> |
| Startbildschirm ausblenden | *Datei* → *Optionen* → *Allgemein* → *Startbildschirm beim Start dieser Anwendung anzeigen* → Häkchen entfernen |
| Arbeitsmappe schließen, Programm offen halten | <kbd>STRG</kbd> + <kbd>F4</kbd> |
| Arbeitsmappe und Programm schließen | <kbd>ALT</kbd> + <kbd>F4</kbd> |
| Arbeitsmappe speichern | <kbd>STRG</kbd> + <kbd>S</kbd> |
| Speichern unter | <kbd>F12</kbd> |
| Neue Arbeitsmappe erstellen | <kbd>STRG</kbd> + <kbd>N</kbd> |

## Hierarchischer Aufbau von Excel

![Graphische Darstellung der Hierarchie in Excel](../assets/excel/grundlagen/Hierarchie.svg)

- **Excel-Applikation**: Software, die auch ohne offene Arbeitsmappe läuft. Es können mehrere Arbeitsmappen gleichzeitig in einer Excel-Applikation geöffnet werden.
- **Arbeitsmappe**: Entspricht einer Excel-Datei. Die Arbeitsmappe besitzt ein oder mehrere Arbeitsblätter.
- **Arbeitsblatt**: Dort befinden sich die Zellen.
- **Zeilen und Spalten**: Der Zellbereich eines Arbeitsblattes ist in **1.048.576 Zeilen** und **16.384 Spalten** (A bis XFD) unterteilt.
- **Zellen**: Sind die kleinste Einheit und können Information (Text, Zahlen, Wahrheitswerte) beinhalten. Jede Zelle hat eine Zelladresse, die sich aus Spalten- und Zeilenangabe zusammensetzt.

## Benutzeroberfläche

![Excel-Benutzeroberfläche](../assets/excel/grundlagen/sc1.svg)

1. **Excel-Applikation** (Application)
2. **Arbeitsmappe** (Workbook)
3. **Arbeitsblatt** (Worksheet)
4. **Zeilen** (Rows)
5. **Spalten** (Columns)
6. **Zellen** (Cells)
7. **Schnellzugriff** (Quick Access Toolbar)
8. **Menüband** (Ribbon)
9. **Registerkarten** (Tabs)
10. **Bearbeitungsleiste** (Formula Bar)
11. **Statusleiste** (Status Bar)

Speziell der **Schnellzugriff** kann einiges an Zeit sparen. Zum Anpassen gibt es folgende Möglichkeiten:

- **Ein-/Ausblenden**: Standardmäßig kann es sein, dass der Schnellzugriff ausgeblendet ist und nur das Speichern-Symbol angezeigt wird. Geändert wird das durch Rechtsklick auf das Symbol → *Symbolleiste für den Schnellzugriff anzeigen*.
- **Anpassen**:
    - *Datei* → *Optionen* → *Symbolleiste für den Schnellzugriff*
    - Am rechten Ende des Schnellzugriffs gibt es ein Dropdown-Menü zum Hinzufügen/Entfernen von Funktionen
    - Rechtsklick auf eine Funktion in den Registerkarten → *Zu Symbolleiste für den Schnellzugriff hinzufügen*
    - Rechtsklick auf ein Symbol → *Aus Symbolleiste für den Schnellzugriff entfernen*

Auch die **Statusleiste** kann sehr hilfreich sein. Wenn du beispielsweise mehrere Zellen markierst, werden gewisse Operationen — z. B. Anzahl, Mittelwert, Summe — automatisch berechnet. Die Statusleiste lässt sich per Rechtsklick anpassen.

## Daten eingeben und markieren

| Aktion | Shortcut |
|---|---|
| Zellinhalt überschreiben | Zelle auswählen und tippen — Inhalt der Zelle wird überschrieben |
| Zellinhalt ergänzen | Zelle auswählen und in die Bearbeitungsleiste klicken, oder <kbd>F2</kbd>, oder Doppelklick auf die Zelle |
| Angrenzenden Zellbereich selektieren | Mit gedrückter Maustaste auswählen — oder Zelle auswählen → <kbd>SHIFT</kbd> halten → weitere Zellen anklicken |
| Nicht angrenzende Zellen selektieren | Zelle auswählen → <kbd>STRG</kbd> halten → weitere Zellen anklicken |
| Eingabe bestätigen | <kbd>ENTER</kbd> drücken oder andere Zelle anklicken |
| Gleichen Inhalt in mehrere Zellen schreiben | Mehrere Zellen auswählen → <kbd>F2</kbd> → Wert eingeben → mit <kbd>STRG</kbd> + <kbd>ENTER</kbd> bestätigen |
| Mehrere Arbeitsblätter selektieren | Ein Arbeitsblatt anklicken und mit gedrücktem <kbd>SHIFT</kbd> oder <kbd>STRG</kbd> weitere anklicken |
| Alle Zellen auswählen | Auf das Dreieck links oben klicken |
| Aktuellen Zellblock auswählen | <kbd>STRG</kbd> + <kbd>A</kbd> |

## Zeilen und Spalten

| Aktion | Shortcut |
|---|---|
| Zeile selektieren | Auf den Zeilenkopf klicken oder <kbd>SHIFT</kbd> + <kbd>Leertaste</kbd> |
| Spalte selektieren | Auf den Spaltenkopf klicken oder <kbd>STRG</kbd> + <kbd>Leertaste</kbd> |
| Mehrere Spalten oder Zeilen selektieren | Mit gedrücktem <kbd>SHIFT</kbd> oder <kbd>STRG</kbd> auf Spalten- bzw. Zeilenköpfe klicken |
| Zeilen/Spalten einfügen | <kbd>STRG</kbd> + <kbd>+</kbd> |
| Zeilen/Spalten löschen | <kbd>STRG</kbd> + <kbd>-</kbd> |
| Spalten ausblenden | <kbd>STRG</kbd> + <kbd>8</kbd> |
| Spalten einblenden | <kbd>STRG</kbd> + <kbd>SHIFT</kbd> + <kbd>8</kbd> |
| Zeilen ausblenden | <kbd>STRG</kbd> + <kbd>9</kbd> |
| Zeilen einblenden | <kbd>STRG</kbd> + <kbd>SHIFT</kbd> + <kbd>9</kbd> |

Die **Zeilen- und Spaltengröße** kann beliebig angepasst werden. Dabei gibt es mehrere Möglichkeiten:

- **Manuell**: An den Spalten- und Zeilenbeschriftungen kann am Rand mit klicken → halten → ziehen die Größe geändert werden.
- **Automatisch**: Durch Doppelklick auf den Rand wird die Größe automatisch angepasst. Es können auch gleichzeitig mehrere Spalten und Zeilen automatisch angepasst werden.
- **Exakter Wert**: Sollen die Größen genau festgelegt werden, müssen die Zeilen/Spalten markiert werden und anschließend mit der rechten Maustaste auf die Beschriftung geklickt werden. Anschließend kann *Spaltenbreite* bzw. *Zeilenhöhe* ausgewählt und ein Wert eingetragen werden.

## Navigation in und zwischen Arbeitsblättern

| Aktion | Shortcut |
|---|---|
| In bestimmte Zelle springen | Zelladresse links oben in die Dropdownbox eingeben |
| Zur nächsten angrenzenden Zelle springen | Pfeiltaste |
| Innerhalb eines Zellbereichs bzw. zwischen Zellbereichen springen | <kbd>STRG</kbd> + Pfeiltaste |
| Einen Bildschirmausschnitt nach oben/unten springen | <kbd>BILD ↑</kbd> / <kbd>BILD ↓</kbd> |
| An den Anfang des Arbeitsblattes | <kbd>STRG</kbd> + <kbd>POS1</kbd> |
| Ans Ende des Arbeitsblattes | <kbd>STRG</kbd> + <kbd>ENDE</kbd> |
| Navigation zwischen Arbeitsblättern | <kbd>STRG</kbd> + <kbd>BILD ↑</kbd> / <kbd>STRG</kbd> + <kbd>BILD ↓</kbd> |
| Navigation zwischen Arbeitsmappen | <kbd>ALT</kbd> + <kbd>TAB</kbd> |

## Rechenoperatoren

| Aktion | Operator |
|---|---|
| Gleichheitszeichen (Formel einleiten) | `=` |
| Addition | `+` |
| Subtraktion | `-` |
| Multiplikation | `*` |
| Division | `/` |
| Exponent | `^` |
| Wurzel | `^(1/2)` oder `^(0,5)` |
| Klammern | `( )` |

## Vergleichsoperatoren

| Aktion | Operator | Aktion | Operator |
|---|---|---|---|
| Gleichheit | `=` | Ungleich | `<>` |
| Kleiner | `<` | Kleiner gleich | `<=` |
| Größer | `>` | Größer gleich | `>=` |

## Zellbezüge

| Bezug | Bedeutung |
|---|---|
| `A1` | relativer Bezug auf die Zelle A1 |
| `$A$1` | absoluter Bezug auf die Zelle A1 |
| `A$1` | relative Spaltenangabe und absolute Zeilenangabe |
| `$A1` | absolute Spaltenangabe und relative Zeilenangabe |
| Wechsel des Zellbezugs | Mit <kbd>F4</kbd> kann zwischen den verschiedenen Zellbezugs-Varianten umgeschaltet werden |

Neben den klassischen Zellbezügen gibt es die Möglichkeit, Zellen oder Bereichen einen **Namen** zu geben. Diese Namen können anschließend in Formeln oder als Bezüge verwendet werden. Dafür gibt es im Wesentlichen folgende Wege:

1. **Zelle(n) selektieren**
2. **Zelle(n) benennen**:
    1. **Adressdropdownbox**: Direkt in der linken oberen Ecke einen Namen für die Zelle(n) vergeben.
    2. **Namen definieren**: Unter *Formeln* → *Definierte Namen* → *Namen definieren* öffnet sich ein eigenes Fenster, in dem ein Name für die Zelle(n) vergeben werden kann. Zusätzlich kann der Geltungsbereich (z. B. die ganze Arbeitsmappe) festgelegt werden.
    3. **Namensmanager**: Unter *Formeln* → *Definierte Namen* → *Namensmanager* findest du eine Übersicht über alle bereits vergebenen Namen. Hier kann auch ein neuer Name angelegt werden — es öffnet sich das gleiche Fenster wie bei *Namen definieren*.
    4. **Aus Auswahl erstellen**: Wenn du einem Zellbereich einen bereits in der obersten/untersten Zeile/Spalte definierten Namen geben willst, kannst du dies über *Formeln* → *Definierte Namen* → *Aus Auswahl erstellen* erledigen.

![Vier Möglichkeiten, einem Zellbereich einen Namen zu geben: 2a) Adressdropdownbox, 2b) Namen definieren, 2c) Namensmanager, 2d) Aus Auswahl erstellen](../assets/excel/grundlagen/sc2.svg)

## Formeln und Funktionen

| Beispiel | Erklärung |
|---|---|
| `=2+2` | Formeln beginnen mit einem Gleichheitszeichen. Soll die Formel als Text dargestellt werden, muss vor das Gleichheitszeichen ein `'` gestellt werden. |
| `=SUMME(A1:A10)` | Funktionen (hier `SUMME`) können in Formeln eingebaut werden. |
| `=PI()` | In der Klammer stehen üblicherweise Parameter. Gewisse Funktionen wie `PI` benötigen keine Parameter und werden daher leer gelassen. |
| `=SUMME(20;20)` | Bei mehreren Parametern werden diese durch ein Semikolon getrennt. |
| `SUMME(Zahl1;[Zahl2];...)` | In der Beschreibung von Funktionen werden optionale Parameter mit eckigen Klammern gekennzeichnet. |
| `=SUMME(;)` | Parameter können durch alleiniges Setzen des Semikolons übersprungen werden. |
| `=SUMME(B6;B8)` | Parameter können sowohl direkt als Zahl/Text als auch als Zellbezüge angegeben werden. |
| `=KLEIN("Text")` | Input im Textformat muss in Anführungszeichen eingetragen werden. |

Nachdem eine Formel eingegeben und mit <kbd>ENTER</kbd> bestätigt wurde, wird das Ergebnis in der Zelle angezeigt. Um die **Formel wieder anzuzeigen** (z. B. zur Kontrolle), navigierst du zur Zelle und findest die Formel in der Bearbeitungsleiste. Manchmal möchtest du aber alle Formeln einblenden, ohne einzeln über die Zellen zu navigieren. Dazu gehst du auf *Formeln* → *Formelüberwachung* → *Formeln anzeigen*. Durch Aktivieren und Deaktivieren wechselst du zwischen den zwei Modi (Formel oder Ergebnis).

Es gibt in Excel eine große Auswahl an fertigen Funktionen. Um die richtige zu finden, gibt es mehrere Möglichkeiten:

1. **Registerkarte**: Unter *Formeln* → *Funktion einfügen* öffnet sich ein Fenster mit einem Überblick über alle Funktionen. Zusätzlich wird erläutert, wie man die Funktion anwendet.
2. **Bearbeitungsleiste**: Links neben der Bearbeitungsleiste findest du das Symbol *fx*. Durch Klick gelangst du zum gleichen Fenster wie zuvor.
3. **Zellbearbeitung**: Wenn du beim Bearbeiten einer Zelle mit dem Gleichheitszeichen beginnst, werden automatisch Vorschläge aufgelistet. Eine Funktion ist dabei blau hervorgehoben. Mit den Pfeiltasten kannst du zwischen den Vorschlägen navigieren, mit <kbd>TAB</kbd> die markierte Funktion wählen.

![Drei Möglichkeiten, Funktionen einzufügen: 1) Registerkarte, 2) Bearbeitungsleiste, 3) Zellbearbeitung](../assets/excel/grundlagen/sc3.svg)

!!! question "Übungsaufgabe"
    Nachdem wir nun die Grundlagen von Excel kennengelernt haben, ist es an der Zeit, das Erlernte zu üben. Bearbeite die Übungsaufgaben aus der Angabe:

    - :material-microsoft-excel: `01_Grundlagen.xlsx`
