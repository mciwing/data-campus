# Grundlagen von Daten und Speicherung

## Zahlensysteme

Im Laufe der Geschichte unserer Menschheit haben sich verschiedene Zahlensysteme entwickelt, die jeweils an die Bedürfnisse der Gesellschaften angepasst waren. 

<div style="text-align: center;">
    <img src="https://kryptografie.de/kryptografie/chiffre/images/hieratische-zahlen.png" alt="Hieratische Zahlen">
    <figcaption>Quelle: <a href="https://kryptografie.de/kryptografie/chiffre/images/hieratische-zahlen.png">Kryptografie.de</a></figcaption>
</div>

Das ägyptische Zahlensystem beispielsweise ist ein additives Zehnersystem, bei dem für jede Zehnerpotenz (Einer, Zehner, Hunderter usw.) ein eigenes Hieroglyphen-Symbol verwendet wird, das beliebig oft wiederholt werden kann, um die jeweilige Zahl darzustellen. Heute sind insbesondere **Stellenwertsysteme** von Bedeutung: Jede Stelle einer Zahl hat eine bestimmte Wertigkeit, die sich aus der Basis des Systems ergibt.  

???+ example "Beispiel: Dezimalsystem (Basis 10)"  
    Die Zahl `123` setzt sich aus Hunderten, Zehnern und Einern zusammen:  

    $$1 \cdot 10^2 + 2 \cdot 10^1 + 3 \cdot 10^0 = 123$$  

    Die Basis **10** verwendet die Ziffern `0–9`. Das Zeichen „3“ repräsentiert den Wert 3 und wird mit entsprechenden Vielfachen von 10 multipliziert - Abhängig von der Position in der Zahl.

<div style="text-align: center;">
    <img src="https://i.programmerhumor.io/2023/05/programmerhumor-io-programming-memes-3e4ebbbe0686a47.jpg" alt="Programmerhumor" style="width:50%; margin-bottom: 1em;">
    <figcaption>Quelle: <a href="https://i.programmerhumor.io/2023/05/programmerhumor-io-programming-memes-3e4ebbbe0686a47.jpg">Programmerhumor.io</a></figcaption>
</div>

Für all jene, die diesen  Witz noch nicht verstehen: Kein Problem. Einfach weiterlesen. 😉 

---

### Wichtige Zahlensysteme

Neben dem uns vertrauten Dezimalsystem gibt es noch weitere Zahlensysteme, die speziell in der Informatik häufiger verwendet werden. Jedes System bietet unterschiedliche Vorteile und Einschränkungen. Gängige Zahlensysteme in der IT sind: 

| Zahlensystem      | Basis | Ziffern                          | Beispiel |
|-------------------|-------|----------------------------------|---------|
| Dezimalsystem     | 10    | 0–9                              | 7345₁₀  |
| Binärsystem       | 2     | 0, 1                             | 1001₂   |
| Oktalsystem       | 8     | 0–7                              | 7345₈   |
| Hexadezimalsystem | 16    | 0–9, A–F                         | CAFE₁₆  |

Die Basis `b` gibt an, wie viele Ziffern im System verwendet werden. Die Ziffern sind die Symbole, die für die Zahlen verwendet werden. Mathematisch lässt sich eine Zahl `X` in der jeweiligen Basis wie folgt darstellen:

???+ defi "Positions- oder Stellenwertsystem"
    Allgemein gilt für eine positive Zahl `X` in Basis `b`:

    $$X = \sum_{i=0}^{n-1} x_i \cdot b^i$$  

    mit den Ziffern $x_i \in \{0, 1, …, b-1\}$.  

Die Basis wird oft tiefgestellt oder durch Symbole gekennzeichnet: `O` für Oktal, `H` für Hexadezimal. Beim Dezimalsystem wird die Basis 10 meist weggelassen.

???+ question "Aufgabe: Zahlensysteme"
    Stelle die nachfolgenden Zahlen ensprechend ihrer Basis mit der allgemeinen Formel dar. 

    1. 1010₂
    2. 1755₁₀
    3. A4B₁₆
    4. 1755

    Beispiel: 
    $213₁₀ = 2 \cdot \underbrace{10^2}_{100} + 1 \cdot \underbrace{10^1}_{10} + 3 \cdot \underbrace{10^0}_{1}$

---

### Basisumwandlung

Prinzipiell ist es möglich, jede Zahl in ein anderes Zahlensystem umzuwandeln. Dafür stehen uns verschiedene Verfahren zur Verfügung. Meist verwendet man das Dezimalsystem als Zwischenzahlensystem. 


**Umwandlung in das Dezimalsystem (b → 10)**

Das Umrechnen in das Dezimalsystem ist besonders einfach. Jede Ziffer wird mit ihrer Stellenwertigkeit multipliziert und anschließend aufsummiert.  

???+ example "Beispiel: Umwandlung in das Dezimalsystem"

    $$1001₂ = 1 \cdot 2^3 + 0 \cdot 2^2 + 0 \cdot 2^1 + 1 \cdot 2^0 = 9_{10}$$  

    $$7345₈ = 7 \cdot 8^3 + 3 \cdot 8^2 + 4 \cdot 8^1 + 5 \cdot 8^0 = 3813_{10}$$  

    $$CAFE_{16} = 12 \cdot 16^3 + 10 \cdot 16^2 + 15 \cdot 16^1 + 14 \cdot 16^0 = 51966_{10}$$  



**Umwandlung vom Dezimalsystem in ein Beliebiges Zahlensystem (10 → b)**

Die Ausgangszahl wird wiederholt durch die Zielbasis geteilt bis der Quotient 0 ist. Die Reste ergeben die Ziffern der neuen Darstellung von rechts nach links.  

???+ example "Beispiele: Umwandlung vom Dezimalsystem in ein Beliebiges Zahlensystem"  

    - Vom Dezimal- ins Oktalsystem:  


    $$327₁₀ ÷ 8 = 40 \text{ Rest } 7$$

    $$40 ÷ 8 = 5 \text{ Rest } 0$$

    $$5 ÷ 8 = 0 \text{ Rest } 5$$

    Ergebnis: $327₁₀ = 507₈$


    - Vom Dezimal- ins Hexadezimalsystem:  


    $$327 ÷ 16 = 20 \text{ Rest } 7$$

    $$20 ÷ 16 = 1 \text{ Rest } 4$$

    $$1 ÷ 16 = 0 \text{ Rest } 1$$

    Ergebnis: $327₁₀ = 147₁₆$


???+ question "Aufgabe: Basisumwandlung"
    Wandle die nachfolgenden Zahlen in die geforderte Basis um.

    1. 1010₂ zu Dezimal
    2. 1755₁₀ zu Oktal
    3. A4B₁₆ zu Binär
    4. 1755₁₀ zu Hexadezimal

---




### Festkommaarithmetik

Nicht nur ganze Zahlen, auch rationale Zahlen können in verschiedenen Basen dargestellt werden. Dabei wird zwischen **Vorkomma- und Nachkommateil** unterschieden:

???+ defi "Positions- oder Stellenwertsystem"
    Allgemein gilt für eine Zahl `X` in Basis `b` mit `n` Vorkomma- und `m` Nachkommastellen:

    $$X = \sum_{i=0}^{n-1} x_i \cdot b^i + \sum_{i=-m}^{-1} x_i \cdot b^i$$  

    mit den Ziffern $x_i \in \{0, 1, …, b-1\}$. 

???+ example "Beispiel: Festkommaarithmetik"
  
    Die Zahl `10,625₁₀` lässt sich zerlegen in:

    $$10,625₁₀ = \underbrace{1 \cdot 10^1 + 0 \cdot 10^0}_{Vorkomma} + \underbrace{6 \cdot 10^{-1} + 2 \cdot 10^{-2} + 5 \cdot 10^{-3}}_{Nachkomma}$$  

Die Konvertierung zwischen verschiedenen Basen in der Festkommaarithmetik ist ebenfalls möglich, wird aber hier nicht weiter behandelt. Eine Beschreibung findet sich beispielsweise [hier](https://www.elektronik-kompendium.de/sites/dig/1807241.htm).

---

### Negative Zahlen


Bisher haben wir nur positive ganze Zahlen betrachtet. Um auch negative Zahlen darstellen zu können, gibt es verschiedene Verfahren. Die wichtigsten sind **Vorzeichen-Betrag**, **Einerkomplement** und **Zweierkomplement**.


#### Vorzeichen-Betrag-Darstellung
- Das höchstwertige Bit (MSB = Most Significant Bit) dient als **Vorzeichenbit**:  
  - `0` → Zahl ist positiv  
  - `1` → Zahl ist negativ  
- Die restlichen Bits geben den Betrag an.  

**Beispiel (4 Bit):**  
- `0101` = +5  
- `1101` = −5  

⚠️ Problem: Es gibt zwei Darstellungen für die Null (`0000` und `1000`). Außerdem sind Rechenoperationen (Addition/Subtraktion) aufwendig.  

---

#### Einerkomplement-Darstellung
- Positive Zahlen wie gewohnt.  
- Negative Zahlen entstehen durch **Bitweise Invertierung** (alle 0 → 1 und 1 → 0).  

**Beispiel (4 Bit):**  
- +5 = `0101`  
- −5 = Invertierung → `1010`  

Eigenschaften:  
- Einfach zu bilden.  
- Aber: Auch hier gibt es **zwei Darstellungen der Null** (`0000` und `1111`).  
- Addition erfordert Übertrag-Korrekturen.  

---

#### Zweierkomplement-Darstellung
Das heute in Computern gebräuchlichste Verfahren.  

Bildung:  
1. Zahl im Einerkomplement darstellen (alle Bits invertieren).  
2. Anschließend **1 addieren**.  

**Beispiel (4 Bit):**  
- +5 = `0101`  
- Einerkomplement von 5 = `1010`  
- +1 = `1011` → also −5  

Vorteile:  
- **Nur eine Null** (`0000`).  
- Addition und Subtraktion funktionieren ohne Sonderregeln.  
- Wertebereich bei n Bit:  
  - Von −2^(n−1) bis +2^(n−1) − 1  
  - z. B. bei 8 Bit: −128 bis +127  

---

#### Übersicht (4 Bit Beispiel)

| Zahl | Vorzeichen-Betrag | Einerkomplement | Zweierkomplement |
|------|-------------------|-----------------|------------------|
| +5   | 0101              | 0101            | 0101             |
| −5   | 1101              | 1010            | 1011             |

👉 In der Praxis nutzen **alle modernen Prozessoren das Zweierkomplement**, da es die Rechenlogik deutlich vereinfacht.



xxxxx
xxxxx
xxxxx
xxxxx


### Binärsystem
In der Informatik hat sich das **Binärsystem** (Basis 2) durchgesetzt, weil es perfekt zu den physikalischen Eigenschaften elektronischer Systeme passt. Gründe dafür sind:  

- **Einfache physikalische Realisierung**: Elektronische Bauteile (Transistoren) kennen zuverlässig nur zwei stabile Zustände: leitend (1) oder nicht leitend (0). Auch andere Trägersysteme wie Magnetisierung, Licht, Spannung lassen sich leicht auf an/aus abbilden.
- **Hohe Störsicherheit**:  Mit nur zwei Zuständen (0 oder 1) sind Signale weniger fehleranfällig. Schon kleine Abweichungen lassen sich durch Schwellwerte tolerieren, ohne dass der Informationsgehalt verloren geht.  
- **Einfache elektronische Verarbeitung**: Logikgatter wie AND, OR, NOT lassen sich direkt auf das Binärsystem abbilden. Dadurch ist die Umsetzung von Rechenoperationen in Hardware effizient und robust.

???+ defi "Bit"
    Ein **Bit** (==B== inary Dig ==it==) ist die kleinste Informationseinheit in der Informatik und representiert eine Stelle einer Binärzahl. Ein Bit kann zwei Zustände annehmen: `0` oder `1`. Die Interpretation der Zustände kann abhängig vom jeweiligen Kontext auch variieren. Beispiele sind Lich an/aus, Wahr/Falsch, Hochspannung/Niederspannung.

    
Nachdem wir nun wissen, dass ein Bit zwei verschiedene Zustände annehmen kann, können demnach `n` bit $2^n$ verschiedene Zustände darstellen.

- 1 Bit: $2^1 = 2$ Zustände
    - [0, 1]
- 2 Bit: $2^2 = 4$ Zustände
    - [00, 01, 10, 11]
- 3 Bit: $2^3 = 8$ Zustände
    - [000, 001, 010, 011, 100, 101, 110, 111]

Diese Reihe lässt sich beliebig fortsetzen: 

2 - 4 - 8 - 16 - 32 - 64 - 128 - 256 - 512 - 1024 - 2048 - 4096 ...

Dem ein oder anderen werden dabei bestimmte Zahlen bekannt vorkommen. Sei es beim Blick auf den Speicherplatz eures neuen Smartphones,beim Kauf einer neuen Festplatte oder bei der Auflösung eures neuen Monitors. Nun wisst ihr auch, woher diese Zahlen kommen.


Da ein einzelnes Bit sehr wenig Information bereitstellt, werden mehrere Bits meist zu einer Gruppe zusammengefasst. Dabei hat sich heutzutage die Größe von 8 Bit als praktisch erwiesen. Diese Gruppe wird auch als **Byte** bezeichnet. Computer können heutzutage nicht jedes einzelne Bit separat adressieren oder lesen/schreiben - sie arbeiten blockweise. Bytes sind dabei also die kleinste adressierbare Einheit.

???+ tip "Warum 8 Bit?"
    Früher hatten verschiedene Systeme Bytes mit 6, 7 oder 9 Bits, aber 8 Bits hat sich als praktisch erwiesen und dementsprechend als Standard etabliert. Damit passt es ich schön in das binäre System ein (16 Bit = 2 Byte, 32 Bit = 4 Byte,...). Weiters reichen die 265 Zustände aus, um z.B. alle Zeichen einer Tastatur (ASCII) abzubilden. Beispielsweise der Buchstabe 'A' (ASCII-Code 65) wird als `0100 0001` (Dezimal: 65) dargestellt.


<div style="text-align: center;">
    <img src="https://i.programmerhumor.io/2023/05/programmerhumor-io-programming-memes-ea8bd859d8c97cb.png" alt="Byte" style="width:70%;">
    <figcaption>Quelle: <a href="https://i.programmerhumor.io/2023/05/programmerhumor-io-programming-memes-ea8bd859d8c97cb.png">Programmerhumor.io</a></figcaption>
</div>




xxxxxxxx
xxxxxx
xxxxxxxx


## Speicherung von Daten



???+ info "Binärsystem"
    In unserer heutigen Zeit sind nicht nur Nummern, sondern jegliche digitale Information als binäre Information gespeichert. 

    <div style="text-align: center;">
    <img src="https://cns1.rc.fas.harvard.edu/wp-content/uploads/2016/09/CDDVDBluRay.png" alt="CDDVDBluRay" style="width:100%; margin-bottom: 1em;">
    <figcaption>Quelle: <a href="https://cns1.rc.fas.harvard.edu/wp-content/uploads/2016/09/CDDVDBluRay.png">Harvard University</a></figcaption>
    </div>

Alle Daten (Zahlen, Texte, Bilder, Programme) werden letztlich als **Folge von Bits** gespeichert.  
Die Speicherung unterscheidet sich je nach **Medium**.

BILD ALS BINÄRWERT
https://lospec.com/palette-list/3-bit-rgb
### Festplatte (HDD)

- Mechanisches Prinzip: magnetische Beschichtung auf rotierender Scheibe  
- Lese-/Schreibkopf magnetisiert winzige Bereiche → **0 oder 1**  
- Datenzugriff:  
  - **sequentiell** schnell (z. B. Lesen großer Dateien)  
  - **zufällig** langsamer (wegen Kopfbewegung)  

???+ info
    Typische Datenraten: 100–200 MB/s  
    Zugriffszeit: ~10 ms (wegen mechanischer Bewegung)

### Solid State Drive (SSD)

- Elektronische Speicherung in **Flash-Speicherzellen**  
- Jede Zelle speichert Ladungszustände in einem Floating-Gate-Transistor  
- **0 oder 1**: Ladung vorhanden oder nicht  
- Keine Mechanik → **sehr schnelle Zugriffe**  
- Mehrere Bits pro Zelle möglich (SLC, MLC, TLC, QLC)  

???+ tip
    Typische Datenraten: 500 MB/s (SATA-SSD) bis mehrere GB/s (NVMe-SSD)  
    Zugriffszeit: ~0,1 ms  

### Vergleich HDD vs. SSD

| Merkmal         | HDD                           | SSD                          |
|-----------------|-------------------------------|------------------------------|
| Technik         | Magnetische Scheiben, Köpfe   | Elektronische Flash-Zellen   |
| Geschwindigkeit | Mittel, v.a. bei Random-IO    | Sehr hoch                    |
| Haltbarkeit     | Mechanisch anfällig           | Begrenzte Schreibzyklen      |
| Kosten          | Günstiger pro TB              | Teurer pro TB                |
| Einsatz         | Archivierung, große Datenmengen | Betriebssystem, Programme, Datenbanken |

---

## Recap

- **Zahlensysteme:**  
  Computer speichern alles in Binär (0 und 1).  
  Dezimal und Hexadezimal dienen uns als praktische Darstellungsformen.  

- **Speicherung:**  
  - HDD: Magnetisch, langsamer, aber günstig und mit großer Kapazität  
  - SSD: Elektronisch, schnell, aber teurer und begrenzte Lebensdauer  

???+ question "Quiz: Speicherung"
    Welche Aussage ist korrekt?

    - [ ] Eine HDD speichert Daten ausschließlich mit elektrischen Ladungen.  
    - [x] Eine SSD speichert Bits in Flash-Zellen ohne bewegliche Teile.  
    - [ ] Hexadezimalzahlen sind ein eigenes Speichermedium.  
am ende

https://i.programmerhumor.io/2021/07/programmerhumor-io-python-memes-backend-memes-9b216513a3c4b09.jpg