# Einführung in die Welt der Daten

Daten sind heute der **Treibstoff der digitalen Welt**. Ob beim Online-Shopping, bei der Navigation mit Google Maps oder beim Streamen auf Spotify - überall werden Daten erzeugt, übertragen und analysiert.
Unternehmen treffen auf Basis von Daten Entscheidungen, Maschinen reagieren auf Messwerte, und selbst unser Smartphone lernt aus unseren Gewohnheiten.

Ohne Daten würde vieles, was für uns selbstverständlich ist, schlicht **nicht funktionieren**. Doch um zu verstehen, warum Daten so zentral sind, müssen wir uns zunächst ansehen, was Daten eigentlich sind - und wie sie sich von **Information** und **Wissen** unterscheiden.

---

## Von Daten zum Wissen

Daten sind zunächst einmal **Rohmaterial** - einzelne, isolierte Fakten, die für sich genommen keine Bedeutung tragen.
Erst wenn wir sie **in einen Kontext setzen (Semantik)**, entstehen Informationen. Und wenn wir diese Informationen **anwenden und verknüpfen (Pragmatik)**, also Entscheidungen daraus ableiten, sprechen wir von Wissen.

<div style="text-align: center;">
    <img src="https://derwirtschaftsinformatiker.de/wp-content/uploads/2012/09/wissenspyramide_derwirtschaftsinformatiker.png" alt="Hieratische Zahlen">
    <figcaption>Quelle: <a href="https://derwirtschaftsinformatiker.de/wp-content/uploads/2012/09/wissenspyramide_derwirtschaftsinformatiker.png">Der Wirtschaftsinformatiker</a></figcaption>
</div>




| Ebene           | Beschreibung                  | Beispiel                                                                           |
| --------------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| **Daten**       | Einzelne, unbehandelte Fakten | `23.5`                                                                             |
| **Information** | Daten mit Bedeutung           | „Die Temperatur im Raum 101 beträgt 23,5 °C.“                                      |
| **Wissen**      | Angewandte Information        | „Wenn die Temperatur über 23 °C liegt, soll die Klimaanlage eingeschaltet werden.“ |

Dieses Prinzip begegnet uns täglich:
In einer Fitness-App werden Schritte gezählt (**Daten**), daraus wird der Kalorienverbrauch berechnet (**Information**) - und das Wissen daraus motiviert uns, unser Tagesziel zu erreichen (**Wissen**).

Damit wird klar: Daten sind nicht Selbstzweck, sondern der Ausgangspunkt eines **Verarbeitungsprozesses**, der von der Erfassung bis zur Anwendung reicht.

---
???+ question "Reflexionsfrage"
    Überlege dir ein Beispiel aus deinem Alltag, bei dem du unbewusst Daten in Information oder Wissen verwandelst.

---

## Klassische Daten vs. Big Data

Wenn wir von „Daten“ sprechen, denken viele zunächst an Tabellen mit Zahlen und Texten - **klassische Daten**, wie sie in Excel oder relationalen Datenbanken gespeichert sind. Diese Daten sind meist **strukturiert**, leicht zu durchsuchen und stammen aus klar definierten Quellen (z. B. Kundendaten, Rechnungen, Lagerbestände).

Mit dem digitalen Wandel kamen jedoch neue Formen der Datenerzeugung hinzu: Sensoren, Smartphones, soziale Netzwerke, Kameras, Maschinen. Dadurch entstanden riesige, heterogene Datenmengen - das Zeitalter der **Big Data**.

Big Data wird oft durch die **3 V** beschrieben:

1. **Volume** - die Menge: Daten im Terabyte- oder Petabyte-Bereich.
2. **Velocity** - die Geschwindigkeit: Daten entstehen in Echtzeit, z. B. bei Börsenkursen oder in Industrieanlagen.
3. **Variety** - die Vielfalt: Texte, Bilder, Videos, Audiosignale, Sensordaten u. v. m.

<div style="text-align: center;">
    <img src="/assets/data/ibm.png" alt="Big Data 3Vs" style="max-width: 90%;">
    <figcaption>Quelle: <a href="https://blogdozouza.wordpress.com/2016/01/21/extracting-business-value-from-the-4-vs-of-big-data/">IBM</a></figcaption>
</div>

Diese Vielfalt bringt Chancen, aber auch neue Herausforderungen. Während klassische Datenbanken gut geeignet sind, strukturierte Informationen zu speichern, müssen Big-Data-Systeme **unstrukturierte Daten** verarbeiten, **Verknüpfungen herstellen** und **Muster erkennen** - oft mithilfe von künstlicher Intelligenz.


<div style="text-align: center;">
    <img src="https://pbs.twimg.com/media/GT4L3DrXkAEcyv6?format=jpg&name=900x900" alt="Big Data 3Vs" style="max-width: 90%;">
    <figcaption>Quelle: <a href="https://pbs.twimg.com/media/GT4L3DrXkAEcyv6?format=jpg&name=900x900">localiq.com</a></figcaption>
</div>

> **Praxisbeispiel:**
> Ein Online-Shop speichert seine Bestellungen (klassische Daten) in einer Datenbank.
> Zusätzlich analysiert er Social-Media-Beiträge, Wetterdaten und Standortinformationen (Big Data), um vorherzusagen, welche Produkte morgen besonders gefragt sein werden.

Damit verschiebt sich der Fokus: Weg vom reinen Speichern - hin zum **Verstehen und Nutzen** der Daten.


???+ question "Big Data"
    Überlege drei Situationen, in denen Unternehmen Big Data nutzen könnten.
    Schreibe zu jedem Beispiel kurz dazu, welche der drei „V“-Eigenschaften (Volume, Velocity, Variety) besonders relevant ist.



<div style="text-align: center;">
    <img src="https://i.imgflip.com/a8h3ro.jpg" alt="Big Data 3Vs" style="max-width: 90%;">
    <figcaption>Quelle: <a href="https://i.imgflip.com/a8h3ro.jpg">imgflip</a></figcaption>
</div>

---

## Welche Arten von Daten gibt es?

Um Daten sinnvoll zu verwalten, ist es hilfreich, ihre **Form** und **Herkunft** zu verstehen. Denn je nach Art benötigen sie unterschiedliche Speicher- und Analyseverfahren.

| Datenart                | Beschreibung                                    | Beispiele                                 |
| ----------------------- | ----------------------------------------------- | ----------------------------------------- |
| **Tabellarische Daten** | Strukturiert, in Spalten und Zeilen organisiert | Excel-Tabellen, Kundendatenbanken         |
| **Bilddaten**           | Visuelle Informationen                          | Fotos, Röntgenbilder, Satellitenaufnahmen |
| **Audiodaten**          | Schall- und Sprachsignale                       | Musik, Podcasts, Maschinenklänge          |
| **Videodaten**          | Kombination aus Bild- und Audiospuren           | YouTube-Clips, Überwachungskameras        |
| **Textdaten**           | Unstrukturierte Sprache oder Schrift            | E-Mails, Chatverläufe, Tweets             |
| **Sensordaten**         | Physikalische Messwerte                         | Temperatur, Luftfeuchtigkeit, Bewegung    |

In der Praxis treten oft **Mischformen** auf:
Ein modernes Auto erzeugt Bilddaten (Kameras), Sensordaten (Radar, Lidar) und Textdaten (Fehlerprotokolle) – gleichzeitig und in Echtzeit.

Dieser technologische Mix zeigt, dass der Begriff 'Daten' weit über Tabellen hinausgeht: **Alles, was sich digital erfassen und speichern lässt, sind Daten.**

---

## Attributtypen - Wie Daten beschrieben werden

Um Daten zu strukturieren, werden sie in **Attribute** zerlegt - also Merkmale, die ein Objekt oder Ereignis beschreiben.
Beispiel: Für das Objekt *Student* könnten die Attribute **Name**, **Matrikelnummer**, **Studiengang** und **Geburtsdatum** definiert werden.

Nicht jedes Attribut ist gleichartig. In der Statistik und Datenanalyse unterscheidet man verschiedene **Skalenniveaus**:

| Typ                    | Beschreibung                       | Beispiele                                                     |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------- |
| **Nominal**            | Kategorien ohne Reihenfolge        | Geschlecht, Studienrichtung, Farbe                            |
| **Ordinal**            | Geordnete Kategorien               | Schulnoten, Kundenzufriedenheit („hoch“, „mittel“, „niedrig“) |
| **Intervallskaliert**  | Gleiche Abstände, kein Nullpunkt   | Temperatur in °C, Jahreszahlen                                |
| **Verhältnisskaliert** | Abstände mit natürlichem Nullpunkt | Alter, Gewicht, Umsatz                                        |
| **Zeitlich**           | Zeitpunkte oder Zeiträume          | Kaufdatum, Dauer, Uhrzeit                                     |

Die richtige Zuordnung ist entscheidend, da sie bestimmt, **welche Analysen zulässig sind**:
Mit Nominaldaten kann man zählen, mit Ordinaldaten sortieren und mit Verhältnisskalen rechnen. Wer also Daten richtig verstehen will, muss wissen, welchen Typ sie haben.

---

> **🔍 Mini-Aufgabe:**
> Nimm eine Tabelle (z. B. eine Excel-Datei) deiner Wahl und bestimme den Datentyp von fünf Spalten.
> Überlege: Welche Spalten lassen sich sortieren? Bei welchen darf man Mittelwerte bilden?

---

## Übergang: Von Daten zur Struktur

Wir haben nun gesehen, dass Daten viele Formen annehmen können - von Zahlen in Tabellen bis zu Videos aus der Kamera.
Doch egal, wie unterschiedlich sie sind: Wenn wir sie effizient speichern, durchsuchen und kombinieren wollen, brauchen wir eine **Struktur**.

Hier kommen **Datenmodelle und Datenbanksysteme** ins Spiel. Sie bilden die Brücke zwischen den rohen Daten und ihrer sinnvollen Nutzung in Anwendungen.
Im nächsten Kapitel wirst du lernen, **wie Daten organisiert, modelliert und in Datenbanken verwaltet werden**, damit aus ihnen Wissen entstehen kann.

---

> **Merke:**
> Daten sind der Anfang - nicht das Ziel.
> Erst durch Struktur, Bedeutung und Anwendung werden sie wertvoll.

---

### 🧩 Kapitelzusammenfassung

* Daten sind Rohinformationen, die erst durch Kontext zu Information und Wissen werden.
* Big Data erweitert klassische Daten um neue Dimensionen: Menge, Geschwindigkeit und Vielfalt.
* Es gibt viele Arten von Daten – von Tabellen bis zu Videos.
* Attribute beschreiben Objekte; ihr Typ entscheidet, welche Analysen sinnvoll sind.
* Daten allein sind wertlos – entscheidend ist ihre **Struktur und Nutzung**.

---

> **💭 Reflexionsfrage zum Abschluss:**
> Wenn du morgen ein eigenes Unternehmen gründest – welche Daten würdest du sammeln, und wie würdest du daraus Wissen gewinnen?

---

Möchtest du, dass ich im **nächsten Kapitel** („Datenmodellierung und Speicherung“) direkt anschließe – also mit Fokus auf **Datenorganisation, Entitäten, Attribute, Relationen und erste Datenmodelle (z. B. ER-Modell)** im gleichen Stil (Markdown + Aufgaben + Praxisbezug)?



xxxx
xxxx
xxxx


Perfekt 🙌 — hier ist dein vollständig **didaktisch aufbereitetes deutsches Lehrkapitel** zu *„Grundlagen zu Daten“* im gleichen Stil wie dein vorheriges Kapitel *„Einführung“*.
Es ist als **Markdown-Skriptum** gestaltet, mit fließenden Übergängen, klaren Überschriften, Aufgaben, Beispielen und Reflexionsfragen.

---

## Warum es wichtig ist, Daten zu verstehen

Bevor wir Daten analysieren oder Modelle darauf anwenden, müssen wir sie **verstehen**.
Das bedeutet: Wir müssen wissen, **welche Eigenschaften die Daten haben**, **welche Strukturen sie aufweisen** und **welche Probleme sie mitbringen**.

Denn reale Daten sind selten „sauber“:

* Sensordaten enthalten oft **fehlende Werte oder Messfehler**,
* Social-Media-Daten sind **unstrukturiert** (Text, Bild, Video),
* Finanzdaten enthalten **Ausreißer oder extreme Werte**, die Analysen verzerren können.

Ein gutes Verständnis der Daten ist deshalb die Grundlage jeder erfolgreichen **Datenvorverarbeitung** – also der Phase, in der Daten aufbereitet, bereinigt und in ein nutzbares Format gebracht werden.
Nur wer seine Daten kennt, kann sie richtig **interpretieren** und **nutzen**.

---

> **Praxisbeispiel:**
> Du entwickelst ein Smart-Home-System mit Temperatursensoren.
> Manche Sensoren liefern Ausreißer (z. B. 130 °C).
> Wenn du die Daten nicht vorher prüfst, beeinflussen diese fehlerhaften Werte alle Berechnungen – und das System reagiert falsch.

---

## Datensatz, Objekte und Attribute

Wenn wir von Daten sprechen, müssen wir unterscheiden, **worüber** wir sprechen:
Sind es ganze Datensätze? Einzelne Objekte? Oder einzelne Merkmale?

### 🔹 Datensatz

Ein **Datensatz** (engl. *dataset*) ist eine **Sammlung zusammenhängender Daten**, meist in strukturierter Form.
Er besteht aus mehreren **Objekten**, die jeweils durch **Attribute** beschrieben werden.
In Tabellenform entspricht jede **Zeile** einem Objekt und jede **Spalte** einem Attribut.

> **Beispiel:** Eine Excel-Tabelle mit Kundendaten – jede Zeile ist ein Kunde, jede Spalte ein Attribut wie Name, Alter, Umsatz.

---

### 🔹 Objekt

Ein **Objekt** (auch *Instanz* oder *Eintrag*) ist eine **Einheit innerhalb des Datensatzes**.
Es repräsentiert eine konkrete Entität – etwa eine Person, ein Produkt oder ein Ereignis.
Jedes Objekt wird durch **Attributwerte** beschrieben.

> Beispiel:
> Ein Kunde in der Datenbank mit den Werten
> Name = „Anna“, Alter = 25, Umsatz = 320 €

---

### 🔹 Attribut

Ein **Attribut** beschreibt ein bestimmtes **Merkmal eines Objekts**.
In einer Tabelle sind Attribute die **Spaltenüberschriften**.
Sie geben an, welche Eigenschaften gespeichert werden – z. B. Alter, Name, Geschlecht oder Wohnort.

---

???+ example "Beispiel: Aufbau eines Datensatzes" <figure markdown="span">
![Datensatz](../assets/databasics/Dataset_3.png){ width=100% } </figure>
Der Datensatz zeigt drei Objekte (Zeilen) und sieben Attribute (Spalten).
Jedes Objekt wird durch die gleichen Merkmale beschrieben.

---

> **🧠 Denkfrage:**
> Welche „Objekte“ und „Attribute“ würdest du in einem Datensatz zu deiner Lieblings-App finden?
> (Tipp: Bei Spotify wären es z. B. Songs = Objekte und Lautstärke, Tanzbarkeit, Energie = Attribute.)

---

## Qualitative vs. Quantitative Daten

Daten unterscheiden sich nicht nur im Inhalt, sondern auch in der **Art der Darstellung**.

### 🔸 Qualitative (kategorische) Daten

Diese beschreiben **Eigenschaften oder Zustände** – sie geben an, **welcher Kategorie** etwas angehört.
Sie lassen sich **nicht berechnen oder messen**.

> Beispiele:
>
> * Geschlecht (m/w/d)
> * Augenfarbe (blau, braun, grün)
> * Nationalität (AT, DE, IT)

---

### 🔸 Quantitative (numerische) Daten

Diese messen eine **Größe** oder **Menge**.
Sie können **gerechnet** werden und sind oft Grundlage für statistische Analysen.

Man unterscheidet:

* **Diskrete Variablen**: Endlich viele Werte (z. B. Anzahl der Kinder = 0, 1, 2, 3 …)
* **Stetige Variablen**: Unendlich viele Werte im Intervall (z. B. Gewicht = 65,3 kg)

---

???+ example "Beispiel: Qualitativ vs. Quantitativ"
- **Qualitativ:** Religion, Geschlecht, Wohnort
- **Quantitativ – diskret:** Anzahl der Bestellungen, Stückzahl
- **Quantitativ – stetig:** Umsatz in €, Temperatur, Körpergröße

---

> **💡 Mini-Übung:**
> Nenne zu jedem der folgenden Begriffe, ob er qualitativ oder quantitativ ist:
> „Postleitzahl“, „Körpergröße“, „Note“, „Blutgruppe“.
> *(Tipp: Nicht alle Zahlen sind automatisch quantitativ!)*

---

## Attributtypen

Nachdem wir qualitative und quantitative Daten unterschieden haben, betrachten wir nun **feinere Abstufungen**, sogenannte **Skalenniveaus**.
Diese bestimmen, **welche mathematischen Operationen** erlaubt sind – z. B. ob man Mittelwerte bilden darf oder nur vergleichen kann.

---

### Nominale Attribute

Nominale Attribute sind **Kategorien ohne natürliche Reihenfolge**.
Sie bestehen aus Namen, Symbolen oder Codes, die Gruppen kennzeichnen.

```py
cars = ['BMW', 'Audi', 'VW', 'Skoda', 'Tesla', 'Audi']
```

Man kann prüfen, ob zwei Werte **gleich** oder **ungleich** sind, aber nicht, ob einer „größer“ ist.

> Beispiel:
>
> * Haarfarbe: blond, braun, schwarz
> * Beruf: Lehrer, Arzt, Programmierer

Nominale Attribute können auch als **Zahlen codiert** werden – diese Zahlen haben aber **keine rechnerische Bedeutung**:

```py
cars_num = [1, 2, 3, 4, 5, 2]
```

Ein Mittelwert dieser Zahlen wäre sinnlos – der **häufigste Wert (Modus)** dagegen ist sinnvoll.

```py
import statistics
statistics.mode(cars)
# Ausgabe: Audi
```

---

> **Sonderfall:**
> **Binäre Attribute** haben nur zwei Zustände, etwa:
>
> * Raucher: Ja = 1, Nein = 0
> * Test positiv = 1, negativ = 0

---

### Ordinale Attribute

Ordinale Attribute haben eine **natürliche Reihenfolge**, aber die **Abstände zwischen den Stufen** sind nicht messbar.

```py
drinks = ['klein', 'klein', 'mittel', 'mittel', 'groß']
```

Hier ist *groß > mittel > klein*, aber man weiß nicht, **wie viel** größer.

> Beispiele:
>
> * Schulnoten (1 < 2 < 3 < 4 < 5)
> * Zufriedenheitsbewertungen (hoch, mittel, niedrig)
> * T-Shirt-Größen (S, M, L, XL)

Erlaubt sind also **Vergleiche** („besser als“, „kleiner als“),
aber **keine Differenz- oder Durchschnittsberechnungen**.

---

### Intervallskalierte Attribute

Intervallskalierte Attribute besitzen **gleiche Abstände** zwischen den Werten,
aber **keinen echten Nullpunkt** (der Nullpunkt ist willkürlich).

> Beispiele:
>
> * Temperatur in °C (0 °C ist nicht „keine Temperatur“)
> * Kalenderjahre (das Jahr 0 ist willkürlich gewählt)

Differenzen sind sinnvoll, Verhältnisse („doppelt so warm“) nicht.

---

### Verhältnisskalierte Attribute

Hier gibt es einen **natürlichen Nullpunkt** – das Fehlen der Eigenschaft.
Damit sind **Verhältnisse** (z. B. doppelt so viel) sinnvoll interpretierbar.

> Beispiele:
>
> * Temperatur in Kelvin
> * Alter, Einkommen, Gewicht, Entfernung

Diese Skala erlaubt **alle mathematischen Operationen**: Mittelwert, Median, Varianz, Verhältnisvergleiche usw.

---

> **📘 Merke:**
> Je höher das Skalenniveau, desto mehr Rechenoperationen sind erlaubt.
> Nominal → Ordinal → Intervall → Verhältnis

---

???+ question "Übungsaufgabe: Attributtypen bestimmen"
Bestimme für die folgenden Attribute den Skalenniveau-Typ und begründe deine Entscheidung:
- Alter
- Beruf
- Schulnote
- Temperatur in °C
- Entfernung in Metern

---

## Zusammenfassung

* **Daten zu verstehen** ist der erste Schritt jeder Analyse.
* Wir unterscheiden zwischen **Datensatz**, **Objekt** und **Attribut**.
* Attribute können **qualitativ** oder **quantitativ** sein.
* Je nach Skalenniveau (nominal, ordinal, intervall-, verhältnisskaliert) sind unterschiedliche **Operationen erlaubt**.
* Der korrekte Umgang mit Attributtypen verhindert **Fehlinterpretationen** in Analysen.

---

> **💭 Reflexionsfrage:**
> Wenn du ein Fitness-Tracker-Unternehmen gründest – welche Attributtypen würdest du erfassen (z. B. Schrittzahl, Puls, Aktivitätstyp)?
> Welche davon sind nominal, ordinal oder quantitativ?

---

Möchtest du, dass ich im **nächsten Kapitel** (z. B. *„Datenmodellierung und Datenstrukturen“*) direkt anschließe – also mit Fokus auf **Entitäten, Attribute, Relationen und erste Datenmodelle (z. B. ER-Modell)** im gleichen Stil (Markdown + Beispiele + Aufgaben)?
