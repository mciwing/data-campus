# Grundlagen Daten(speicherung)

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

???+ example "Vorzeichen-Betrag Darstellung"

    Die Zahl $5$ wird im binären Zahlensystem wiefolgt dargestellt

    $$ 101 $$
 
    Wenn wir nun $\pm 5$ mit Vorzeichen und Betrag darstellen wollen müssten wir ein zusätzliches Bit mit dem entsprechenden Vorzeichen voranstellen: 

    $$ \underbrace{0}_{+} 101 \rightarrow +5$$  

    $$ \underbrace{1}_{-} 101 \rightarrow -5$$  

Diese Darstellung ist durchaus einfach nachzuvollziehen hat allerdings den Nachteil, dass es zwei Darstellungen für Null gibt: `0000` und `1000`. Weiters sind Rechenoperationen - wie beispielsweise Addition und Subtraktion - aufwändiger als bei anderen Darstellungen. 

---

#### Einerkomplement-Darstellung
- Positive Zahlen wie gewohnt.  
- Negative Zahlen entstehen durch **Bitweise Invertierung** (alle 0 → 1 und 1 → 0).
- Auch hier gibt es ein **Vorzeichenbit** (zeigt an, ob invertiert wurde oder nicht)

???+ example "Einerkomplement Darstellung"

    Bleiben wir bei unserem Beispiel von zuvor. Wir möchten die Zahlen $\pm 5$ nun in Einerkomplement Darstellung realisieren:

    Die Darstellung der positiven Zahl bleibt gleich (inklusive Vorzeichenbit)
 
    $$ \underbrace{0}_{+} 101 \rightarrow +5$$  

    Für die negative Darstellung wird die positive Zahl negiert/invertiert.


    $$ 0101 \rightarrow 1010$$  

Vorteil der Einerkomplement Darstellung ist, dass durch die negierte Darstellung der negativen Zahlen (Invertierung), eine Subtraktion einfach durch eine Addition der Negativen zahl realisiert werden kann. Sprich: $3-4 = 3+(-4)$. Aber, wie auch bei der Vorzeichen-Betrag Darstellung gibt es auch hier zwei Darstellungen der Null: `0000` und `1111`. Weiters wird bei der Addition eine Übertrag-Korrektur benötigt. Dies können wir mit der Zweierkomplement-Darstellung lösen.

<div style="text-align: center;">
    <img src="https://i.programmerhumor.io/2023/10/programmerhumor-io-programming-memes-2570089582bf52b.jpg" alt="Programmerhumor" style="width:50%; margin-bottom: 1em;">
    <figcaption>Quelle: <a href="https://i.programmerhumor.io/2023/10/programmerhumor-io-programming-memes-2570089582bf52b.jpg">Programmerhumor.io</a></figcaption>
</div>



---

#### Zweierkomplement-Darstellung

Die Zweierkomplement-Darstellung ist das heute in Computern gebräuchlichste Verfahren zum Umgang mit negativen zahlen. Die Bildung des Zweierkomplements baut dabei auf dem Einserkomplement auf:

- Positive Zahlen wie gewohnt
- Negative Zahlen:
    1. Zahl im Einerkomplement darstellen (alle Bits invertieren).  
    2. Anschließend **1 addieren**.  


???+ example "Zweierkomplement Darstellung" 
    Nun wollen wir die Zahlen $\pm 5$ im Zweierkomplement darstellen. Wie bleibt die positive Darstellung wie gehabt (inklusive Vorzeichenbit):

    $$ \underbrace{0}_{+} 101 \rightarrow +5$$  

    Für die negative Darstellung bilden wir zuerst das Einerkomplement
    
    $$ 0101 \rightarrow 1010$$

    und addieren anschließend $1$ 

    $$ 
    \begin{array}{cr}
         & 1010 \\
         + & 0001 \\ \hline
         & 1011
    \end{array}
    $$

     

Das Zwierkomplement bietet mehrere Vorteile:   
- Es gibt nun nur **eine Darstellung der Null** (`0000`).  
- Addition und Subtraktion funktionieren ohne Sonderregeln.  



---

**Gegenüberstellung der verschiedenen Darstellungen**

| Zahl | Vorzeichen-Betrag | Einerkomplement | Zweierkomplement |
|------|-------------------|-----------------|------------------|
| +5   | 0101              | 0101            | 0101             |
| −5   | 1101              | 1010            | 1011             |

???+ question "Negative Zahlen"
    Stellen Sie die Zahl $-7$ in allen drei verschiedenen Darstellungsarten dar.

## Binärsystem
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
    Früher hatten verschiedene Systeme Bytes mit 6, 7 oder 9 Bits, aber 8 Bits hat sich als praktisch erwiesen und dementsprechend als Standard etabliert. Damit passt es ich schön in das binäre System ein (16 Bit = 2 Byte, 32 Bit = 4 Byte,...). Weiters reichten die 265 Zustände aus, um z.B. alle Zeichen einer Tastatur abzubilden.


<div style="text-align: center;">
    <img src="https://i.programmerhumor.io/2023/05/programmerhumor-io-programming-memes-ea8bd859d8c97cb.png" alt="Byte" style="width:70%;">
    <figcaption>Quelle: <a href="https://i.programmerhumor.io/2023/05/programmerhumor-io-programming-memes-ea8bd859d8c97cb.png">Programmerhumor.io</a></figcaption>
</div>

## Wie werden Daten gespeichert?

In unserer heutigen Zeit sind nicht nur Nummern, sondern jegliche digitale Information als binäre Information gespeichert. 

<div style="text-align: center;">
<img src="https://cns1.rc.fas.harvard.edu/wp-content/uploads/2016/09/CDDVDBluRay.png" alt="CDDVDBluRay" style="width:100%; margin-bottom: 1em;">
<figcaption>Quelle: <a href="https://cns1.rc.fas.harvard.edu/wp-content/uploads/2016/09/CDDVDBluRay.png">Harvard University</a></figcaption>
</div>

Alle Daten (Zahlen, Texte, Bilder, Programme) werden letztlich als **Folge von Bits** gespeichert. Wir wollen uns zwei Beispiele etwas näher anschauen:

### Bilder


Stellen wir uns vor, wir haben mehrere Lampen in einem Array angeordnet und können jede Lampe unabhängig voneinander ansteuern. Es gibt zwei mögliche Zustände: Lampe ein oder aus. Wenn die Lampe aus ist, ist dieser Bereich schwarz, wenn die lampe leuchtet, ist dieser Bereich weiß. Genau so können wir uns auch ein Schwarz-Weiß Bild vorstellen. Jede Lampe representiert einen Pixel und wird durch ein Bit (1/0) beschrieben. 
<div style="text-align: center">
    <img src="/assets/database/grundlagen/img_1c_min2.png" style="width: 20%;">
</div>

???+ example "Minimalbeispiel"

    <div style="text-align: center">
        <img src="/assets/database/grundlagen/img_1c.png" style="width: 50%;">
    </div>

    ??? code "Python Code"
        ```python
        import cv2
        import matplotlib.pyplot as plt
        import numpy as np
        # read svg image
        img = cv2.imread("logo.svg", cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # only use one channel (blue)
        img1c = img[:, :, 2]

        # everything < 128 = 0, everything >= 128 = 255
        img1c = np.where(img1c < 128, 0, 255)

        #show image
        plt.imshow(img1c, cmap="gray")
        # hide axis
        plt.axis("off")
        # show image
        plt.show()
        ```

Neben Schwarz/Weiß Bildern ist das Vorgehen bei farbigen Bildern analog. Um mehrere Farben darzustellen müssen wir nun mehr wissen als 'Lampe an/aus'. Wir brauchen nun mehrere farbige Lampen und müssen diese getrennt ansteuern können. Sehr häufig werden dabei die Farben RGB (Rot Grün Blau) verwendet. Auch andere Farbräume wie CYMK finden ihren Einsaz (z.b. im Druckwesen bevorzugt). 

Dies bedeutet nun, dass jeder Pixel aus 3 Bit Informationen besteht: 1 Bit jeweils für Rot, Grün und Blau. Damit sind in Summe $2^3 = 8$ verschiedene Farben möglich. 

<div style="text-align: center">
    <img src="/assets/database/grundlagen/img_3c_gesamt.png" style="width: 80%;">

</div>

???+ example "Minimalbeispiel"

    <div style="text-align: center">
        <img src="/assets/database/grundlagen/img_3c.png" style="width: 50%;">
    </div>

    ??? code "Python Code"
        ```python
        import cv2
        import matplotlib.pyplot as plt
        import numpy as np
        # read svg image
        img = cv2.imread("logo.svg", cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # everything < 128 = 0, everything >= 128 = 255
        img3c = np.where(img < 128, 0, 255)

        #show image as rgb
        plt.imshow(img3c)
        # hide axis
        plt.axis("off")
        # show image
        plt.show()
        ```

Da unsere Welt sehr farbenfroh ist, und wir uns nicht mit acht verschiedenen Farben begnügen wollen, können wir anstelle von einem Bit pro Farbe, mehrere Bits verwenden. Beispielsweise bei '24 Bit RGB' werden pro Farbe 8 Bit (also ein Byte) verwendet. Es können somit pro Farbe $2^8 = 256$ verschiedene Stufein eingestellt werden und ergebn in Summe damit 16.7 Million verschiedene Farben.  

<div style="text-align: center">
    <img src="/assets/database/grundlagen/img_24c_gesamt.png" style="width: 80%;">
</div>

???+ example "Minimalbeispiel"

    <div style="text-align: center">
        <img src="/assets/database/grundlagen/img_24c.png" style="width: 50%;">
    </div>

    ??? code "Python Code"
        ```python
        import cv2
        import matplotlib.pyplot as plt
        import numpy as np
        # read svg image
        img = cv2.imread("logo.svg", cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # everything < 128 = 0, everything >= 128 = 255
        img3c = np.where(img < 128, 0, 255)

        #show image as rgb
        plt.imshow(img3c)
        # hide axis
        plt.axis("off")
        # show image
        plt.show()
        ```

???+ tip "Hexadezimaldarstellung" 
    Die Darstellung der 8 Bit pro Farbe erfolgt sehr häufig als Hexadezimal. Dabei können die 256 Farben mit zwei Stellen im Hexadezimal abgebildet werden. Dabei wird häufig das #-Zeichen vorangestellt.  

    - Dezimal: 244|155|0 entspricht in HEX #f49b00
    - Dezimal: 0|73|131 entpsricht im HEX #004983

---

### Text
Nachdem wir uns die Speicherung von Bildern angesehen haben, wollen wir nun einen Blick auf Texte werfen. Auch hier - wie bereits erwähnt - werden die Inhalte in Binärer Darstellung als Abfolge von Bytes gespeichert. Das Vorgehen kann dabei in folgenden Schritte beschrieben werden: 

1. **Zeichen**: Als Zeichen werden in weiterer Folge sowohl diverse Schriftzeichen (lateinisch, kyrillisch,...) als auch Symbole und Emojis verstanden. Diese wollen wir nun mit einem Computer speichern und verarbeiten können
2. **Codepoint**: Damit wir mit Zeichen umgehen können, wird jedem Zeichen eine eindeutige Nummer zugeordnet. Dabei gibt es für die Zuordnung verschiedenste Systeme wobei sich heute  *Unicode* durchgesetzt hat. Darin enthalten sind 161 Schriften sowie Symbole und Emojis. 
3. **Encoding**: Nun müssen wir noch die zuvor bestimmten Nummern als Bytes speichern. Dabei gibt es wieder verschiedenste Systeme, wobei sich UTF-8 in den meisten Fällen durchgesetzt hat. UTF-8 vergibt variabel zwischen 1 und 4 Bytes pro Zeichen, je nachdem wieviel benötigt wird. 

???+ example "Unicode & UTF-8 Encoding"

    - `A` $\xrightarrow{\text{Codepoint}}$ `U+0041` $\xrightarrow{\text{Encoding}}$ `41`
    - `€` $\xrightarrow{\text{Codepoint}}$ `U+20AC` $\xrightarrow{\text{Encoding}}$ `E2` `82` `AC`
    - `🙂` $\xrightarrow{\text{Codepoint}}$ `U+1F642` $\xrightarrow{\text{Encoding}}$ `F0` `9F` `99` `82`

    ??? code "Python Code"
        ```python
        s = "€" # Mix aus ASCII, Latin-1, Symbol und Emoji

        # Codepoints (Unicode)
        for ch in s:
            print(f"{ch} -> U+{ord(ch):04X}")

        # Gleiche Zeichen in verschiedenen Encodings
        encodings = ["ascii", "latin-1", "utf-8", "utf-16-le", "utf-32-le"]
        for enc in encodings:
            try:
                b = s.encode(enc)
                print(f"{enc:10s} -> {len(b):2d} Bytes ->", b.hex(" "))
            except UnicodeEncodeError as e:
                print(f"{enc:10s} -> NICHT darstellbar:", e)
            
        ```


## Speicherung von Daten

Nachdem wir nun wissen, dass jeglichen Daten am Computer in Abfolgen von Nullen und Einsen gespeichert werden, können wir uns nun anschauen, wie diese Daten gespeichert werden. 
Typischerweise werden zur längerfristigen Speicherung sogenannte Massenspeicher verwendet. Dabei unterscheidet man grob in die zwei Kategorien HDD un SSD. Wie diese zwei Typen Daten speichern wird am besten in diesem Video erklärt: 

<div style="text-align: center;">
        <iframe 
            width="840" height="473" 
            src="https://www.youtube.com/embed/JTNWaFbJPw0?si=J-_Vf2QYhR4tg9tF&amp;start=10"
            title="YouTube video player" frameborder="5" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
            gyroscope; picture-in-picture;" 
            referrerpolicy="strict-origin-when-cross-origin"
        >
        </iframe>
    </div>

### Vergleich HDD vs. SSD
Als Abschluss für dieses Kapitel gibt es noch einen kleinen Vergleich von HDD zu SSD. Dieser bildet die allgemeinen Eigenschaften ab - die genaue Charakteristik variiert natürlich von Marke, Qualität, genauem Aufbau,... ab. 


| Merkmal         | HDD                           | SSD                          |
|-----------------|-------------------------------|------------------------------|
| Technik         | Magnetische Scheiben, Köpfe   | Elektronische Flash-Zellen   |
| Geschwindigkeit | Mittel, v.a. bei Random-IO    | Sehr hoch                    |
| Haltbarkeit     | Mechanisch anfällig (stoßempfindlich)           | Begrenzte Schreibzyklen      |
| Kosten          | Günstiger pro TB              | Teurer pro TB                |
| Einsatz         | Archivierung, große Datenmengen | Betriebssystem, Programme, Datenbanken |
| Typische Schnittstellen | SATA, SAS                    | SATA, **NVMe/PCIe**                        |

---

## Recap

- **Zahlensysteme:**  
    - Computer speichern alles in Binär (0 und 1).  
    - Dezimal und Hexadezimal dienen uns als praktische Darstellungsformen.  

- **Speicherung:**  
    - HDD: Magnetisch, langsamer, aber günstig und mit großer Kapazität  
    - SSD: Elektronisch, schnell, aber teurer und begrenzte Lebensdauer  


<div style="text-align: center;">
    <img src="https://i.programmerhumor.io/2023/03/programmerhumor-io-programming-memes-3f12ffe4bfb84dc.jpg" alt="Programmerhumor" style="width:50%; margin-bottom: 1em;">
    <figcaption>Quelle: <a href="https://i.programmerhumor.io/2023/03/programmerhumor-io-programming-memes-3f12ffe4bfb84dc.jpg">Programmerhumor.io</a></figcaption>
</div>