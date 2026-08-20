# Tabellen & Pivot-Tabellen

In diesem Kapitel beschäftigen wir uns mit dem Thema **Tabellen**. In Excel existieren neben der klassischen Anordnung als Liste auch die Möglichkeiten, Zellbereiche als (dezidierte) Tabellen zu definieren - nicht nur so zu formatieren - und sogenannte **Pivot-Tabellen** zu erstellen.

## Tabellen

Tabellen in Excel sind zusammenhängende Informationen, die meistens eine gewisse Struktur haben und mit einer Überschrift versehen sind. Wichtig: Eine reine Formatierung und Strukturierung als Tabelle reicht nicht - es muss dezidiert eine Tabelle definiert werden.

### Erstellen

Um eine Tabelle in Excel zu erstellen, gibt es mehrere Wege:

- *Start* → *Formatvorlagen* → *Als Tabelle formatieren*
- *Einfügen* → *Tabellen* → *Tabelle*
- <kbd>STRG</kbd> + <kbd>T</kbd>

In allen Fällen öffnet sich anschließend ein Dialog, in dem du den Bereich nochmals überarbeiten kannst (falls noch nicht der richtige gewählt wurde) und festlegst, ob die Tabelle eine Überschrift besitzt. Bei der ersten Variante kann zusätzlich vorab ein optisches Layout gewählt werden - eine Änderung ist natürlich später jederzeit möglich. An der Funktion ändert das nichts.

### Verwenden

Beim Erstellen einer Tabelle wird automatisch ein **Name** zugewiesen. Standardmäßig startet dieser mit "Tabelle" und einer laufenden Nummer (wie der Name geändert werden kann, folgt im nächsten Abschnitt). Dieser Name wird benötigt, um die Funktionalitäten der Tabelle richtig zu nutzen. Den aktuellen Namen erkennst du, indem du alle Zellen der Tabelle markierst (exklusive Überschriften) und ihn aus der Adressdropdownbox abliest.

Dieser Name kann nun wie unter [Zellbezüge](grundlagen.md#zellbezuge) beschrieben als **benannter Zellbezug** verwendet werden. Beispielsweise referenziert der Befehl `Tabelle1[Nummern]` die Spalte *Nummern* in der Tabelle. Innerhalb der Tabelle kann mit `@` auf die jeweilige Spalte in der gleichen Zeile **referenziert** werden - z. B. `[@Nummern]`.

!!! warning "Hinweis"
    Diese Eigenschaften sind besonders später beim Umgang mit **Pivot-Tabellen** nützlich. Durch das nachträgliche Hinzufügen von Einträgen ergeben sich keine Probleme - sie werden in der Pivot-Auswertung automatisch ergänzt.

![Formatierte Tabelle mit zwei Spalten und vier Zeilen inklusive Überschrift. In der linken oberen Ecke findet man den Namen der Tabelle (hier 'Tabelle1')](../assets/excel/tabellen/sc_tabelle.png)

Wenn eine Tabelle wie oben erstellt wurde, erscheinen in den Überschriften zusätzliche Schaltflächen - der **AutoFilter**. Damit lassen sich Inhalte sortieren oder filtern (denke auch an die bereits kennengelernten Wildcards).

Innerhalb einer Tabelle kann sehr schnell mit <kbd>TAB</kbd> navigiert werden. Wenn du am Ende einer Tabelle angelangt bist und <kbd>TAB</kbd> drückst, wird die Tabelle um eine neue Zeile erweitert. Gleiches gilt, wenn du in einer Zelle direkt unterhalb oder neben der Tabelle einen Wert einträgst - der Tabellenbereich wird automatisch um die neue Zeile/Spalte erweitert. Das Ende einer Tabelle wird durch ein kleines Dreieck am rechten unteren Rand der letzten Zelle angezeigt.

Ein weiterer Vorteil: Wenn in einer Spalte andere Spalten in einer Formel ausgewertet werden, wird die Formel automatisch für alle Zeilen angewendet und für jede Zeile separat berechnet.

### Ändern

Wenn eine Tabelle definiert wurde und eine Zelle in der Tabelle ausgewählt ist, gibt es einen neuen Eintrag im Menüband namens *Tabellenentwurf*. Darin verstecken sich mehrere zusätzliche Optionen:

![Neue Registerkarte 'Tabellenentwurf'](../assets/excel/tabellen/sc_tabelleMenu1.png)

![Tabellenformatvorlagen](../assets/excel/tabellen/sc_tabelleMenu2.png)

Eine Auswahl an möglichen Einstellungen:

- **Tabellenname**: Hier kann der zuvor beschriebene Name geändert werden.
- **Tabellengröße ändern**: Der Bereich der Tabelle kann hier oder per Drag-and-Drop des kleinen Dreiecks am Ende der Tabelle angepasst werden.
- **In Bereich konvertieren**: Die Tabelle wird wieder in einen Bereich (Liste) umgewandelt und verliert sämtliche Eigenschaften - außer der optischen Formatierung.
- **Datenschnitt einfügen**: Mit Datenschnitten lassen sich schnell erste Elemente eines Dashboards erstellen. Datenschnitte beziehen sich auf eine auswählbare Spalte und liefern eine grafische Oberfläche, mit der du Daten schnell durch An- und Abwählen filtern kannst (Mehrfachauswahl mit <kbd>SHIFT</kbd>). Wenn ein Datenschnitt erstellt wurde, öffnet sich ein neuer Eintrag im Menüband zum Anpassen der Oberfläche.
- **Tabellenformatoptionen**: Hier können neben rein optischen Einstellungen (gebänderte Zeilen/Spalten, erste/letzte Spalte) auch die Filterschaltflächen aktiviert/deaktiviert werden - und eine Kopfzeile (Überschriften) oder Ergebniszeile (mit zusätzlichen automatischen Operationen wie Summe, die sich entsprechend der Filter anpassen) ein- bzw. ausgeblendet werden.
- **Tabellenformatvorlagen**: Aus einer Vielzahl an Vorlagen kann die optische Gestaltung gewählt werden.

!!! question "Übungsaufgabe"
    Nachdem wir nun Tabellen kennengelernt haben, ist es an der Zeit, das Erlernte zu üben:

    - :material-microsoft-excel: `06_Tabellen.xlsx`

## Pivot-Tabellen und Pivot-Charts

**Pivot-Tabellen** sind eine besondere Möglichkeit, Datensätze in Listenform möglichst einfach zu analysieren. Um sich damit näher auseinanderzusetzen, folgt eine Selbstlerneinheit.

!!! tip "Selbstlerneinheit"
    Betrachte das nachfolgende Dokument und versuche, die einzelnen Schritte nachzuvollziehen. Begleitet werden die Aufgaben mit der zugehörigen Excel-Datei.

    - :material-file-pdf-box: `SLE_Pivot.pdf`
    - :material-microsoft-excel: `SLE_Pivot.xlsx`

!!! question "Übungsaufgabe"
    Aufbauend auf der Tabelle und dem Dokument aus der Selbstlerneinheit kannst du nun die nachfolgenden Übungen bearbeiten.

    - :material-file-pdf-box: `06_Pivot.pdf`
    - :material-microsoft-excel: `SLE_Pivot.xlsx`
