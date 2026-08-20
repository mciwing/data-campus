# Makros

Als letztes Kapitel beschäftigen wir uns mit den einfachsten Dingen rund um Excel-Makros. **Makros** sind kleine "Programme", die uns gewisse Arbeitsschritte automatisiert wiederholen lassen. Sie eignen sich daher besonders für Aufgaben, die ständig gleich ablaufen und öfter vorkommen.

## Makro aufnehmen

Generell gibt es in Excel zwei Möglichkeiten, Makros zu erstellen: **Programmierung mittels Code** oder **Aufzeichnung von Arbeitsschritten**. Aufgrund der knappen Zeit gehen wir hier nur auf die zweite Variante ein.

Um eine **Aufzeichnung eines Makros** zu starten, gibt es zwei Möglichkeiten. Eine weitere führt über das Menüband *Entwicklertools*, das ggf. erst eingeblendet werden muss (*Optionen* → *Menüband anpassen* → auf der rechten Seite *Entwicklertools* anhaken).

![Zwei Wege zur Aufzeichnung von Makros](../assets/excel/makros/sc_aufzeichnen.svg)

Unabhängig vom Weg öffnet sich ein neues Dialogfenster. Folgende Einstellungen können getroffen werden:

- **Makroname**: Name, unter dem das Makro gespeichert werden soll.
- **Tastenkombination**: Optional ein Shortcut. **Achtung**: Dabei können auch gängige Shortcuts (wie <kbd>STRG</kbd> + <kbd>C</kbd>) lokal überschrieben werden. Durch Drücken von <kbd>SHIFT</kbd> sind weitere Kombinationen möglich.
- **Makro speichern in**: Typischerweise werden Makros in der gleichen Arbeitsmappe (*diese Arbeitsmappe*) gespeichert und sind nur dort aufrufbar. Außerdem gibt es die Möglichkeit, eine *neue Arbeitsmappe* zu erstellen oder eine *persönliche Makroarbeitsmappe* anzulegen. Letztere kann verwendet werden, um Makros zu definieren, die später vom Ersteller in mehreren Arbeitsmappen genutzt werden - sie wird fortan mit allen Excel-Mappen geöffnet.
- **Beschreibung**: Optionale Beschreibung des Makros.

Nach Bestätigung mit *OK* läuft die Aufnahme. In der Statusleiste wird das optisch angezeigt. Nun können beliebige Schritte durchgeführt werden. Am Ende wird das **Stoppsymbol** in der Statuszeile geklickt - oder über *Ansicht* → *Makros* → *Aufzeichnung beenden* wird die Aufnahme beendet.

![Links: Dialogfenster zum Aufzeichnen eines neuen Makros. Rechts: Übersicht über alle bereits erstellten Makros](../assets/excel/makros/sc_makroneu.png)

![Übersicht über alle bereits erstellten Makros](../assets/excel/makros/sc_makrouebersicht.png)

## Makro bearbeiten

Um alle Makros **anzuzeigen**, die bereits zur Verfügung stehen oder aufgezeichnet wurden, kann mit <kbd>ALT</kbd> + <kbd>F8</kbd> oder unter *Ansicht* → *Makros* → *Makros anzeigen* eine Übersicht geöffnet werden. Darin können Makros gelöscht, bearbeitet, Optionen angepasst (z. B. Shortcut) oder ausgeführt werden.

## Makro ausführen

Zum **Ausführen** von Makros gibt es mehrere Möglichkeiten:

- **Makroübersicht**: Klick auf *Ausführen*.
- **Shortcut**: Der beim Erstellen vergebene Shortcut.
- **Shape**: Eine Verknüpfung mit einem Element herstellen - z. B. ein Rechteck zeichnen, dann Rechtsklick → *Makro zuweisen* → Makro auswählen. Anschließend kann das Rechteck wie eine Schaltfläche verwendet werden.
- **Button**: Unter *Entwicklertools* → *Steuerelemente* → *Einfügen* → *Formularsteuerelemente* → *Schaltfläche* einen Button einfügen und mit einem Makro verknüpfen. Mit gedrückter <kbd>ALT</kbd>-Taste kann am Gitternetz gerastert werden.
- **Schnellzugriff**: Unter *Optionen* → *Symbolleiste für den Schnellzugriff* unter *Befehle auswählen* auf *Makros* gehen - und das entsprechende Makro hinzufügen.

## Makro programmieren

Um den Sprung zu **Visual Basic for Applications (VBA)** zu schaffen, kannst du unter *Ansicht* → *Makros* → *Makros anzeigen* auf *Bearbeiten* klicken. Anschließend wird der Code, der im Hintergrund läuft, angezeigt und kann nach Bedarf geändert werden.

![Darstellung des VBA-Codes in Excel](../assets/excel/makros/sc_vba.png)

!!! question "Übungsaufgabe"
    Nachdem wir nun eine einfache Möglichkeit kennengelernt haben, Makros zu erstellen, ist es an der Zeit, das Erlernte zu üben. Probiere die in diesem Kapitel beschriebenen Tätigkeiten an einer beliebigen Datei aus.
