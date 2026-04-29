# Joins - Daten aus mehreren Tabellen kombinieren

Im vorherigen Kapitel über [Datenmodellierung](modellierung.md) haben wir gelernt, wie man **Beziehungen zwischen Tabellen** modelliert. Jetzt kommt der spannende Teil: Wie fragen wir Daten aus **mehreren verknüpften Tabellen** ab?

Die Antwort lautet: **JOINs**!

<div style="text-align: center;">
    <img src="https://i.imgflip.com/abzryz.jpg" alt="Join" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://i.imgflip.com/abzryz.jpg">imgflip</a></figcaption>
</div>


JOINs sind ein wichtiger Bestandteil relationaler Datenbanken. Sie erlauben es uns, Daten aus verschiedenen Tabellen zu kombinieren und als eine zusammenhängende Ergebnistabelle anzuzeigen. Ohne JOINs würden wir die Vorteile der Aufteilung in mehrere Tabellen nicht nutzen können - wir hätten zwar sauber strukturierte Daten ohne Redundanz, könnten diese aber nicht sinnvoll miteinander verknüpfen und auswerten.

In diesem Kapitel lernen wir die verschiedenen JOIN-Typen kennen und verstehen, wann welcher JOIN-Typ die richtige Wahl ist. Dabei werden wir sehen, wie mächtig relationale Datenbanken wirklich sind!

---

???+ example "Beschaffungsmanagement Ausgangssituation"

    Um zu verstehen, warum JOINs so wichtig sind, betrachten wir ein konkretes Problem aus dem Beschaffungsmanagement:

    ```{ .cmd .no-copy title="Ausgangssituation: zwei getrennte Tabellen"}
    -- Tabelle: lieferanten
     lieferant_id | firmenname        | land        | bewertung
    --------------+-------------------+-------------+-----------
                1 | Stahl GmbH        | Deutschland |       4.5
                2 | MetalCorp         | Frankreich  |       4.2
                3 | SteelWorld Inc    | USA         |       3.8

    -- Tabelle: bestellungen
     bestell_id | bestelldatum | lieferant_id | gesamtwert | status
    ------------+--------------+--------------+------------+-----------
            101 | 2024-01-15   |            1 |   12500.00 | Geliefert
            102 | 2024-01-20   |            2 |    8300.00 | In Transit
            103 | 2024-01-22   |            1 |   15600.00 | Geliefert
    ``` 
    

    **Problem:** Wir wissen aus der Bestelltabelle nur die `lieferant_id`, aber nicht den **Firmennamen**. Wie zeigen wir Bestellungen **mit** den Lieferantennamen an?

    ```{ .cmd .no-copy title="Gewünschtes Ergebnis: Gemeinsame Darstellung"}
     bestell_id | bestelldatum | firmenname   | gesamtwert | status
    ------------+--------------+--------------+------------+-----------
            101 | 2024-01-15   | Stahl GmbH   |   12500.00 | Geliefert
            102 | 2024-01-20   | MetalCorp    |    8300.00 | In Transit
            103 | 2024-01-22   | Stahl GmbH   |   15600.00 | Geliefert
    ```

    Dafür brauchen wir einen **`JOIN`**! Ein `JOIN` ermöglicht es uns, die verstreuten Informationen aus beiden Tabellen wieder zusammenzuführen und in einer einzigen Ergebniszeile darzustellen. Die Verknüpfung erfolgt dabei über den Fremdschlüssel `lieferant_id` in der Bestellungen-Tabelle, der auf den Primärschlüssel `lieferant_id` in der Lieferanten-Tabelle verweist.

---

## Grundlagen

Bevor wir uns die verschiedenen JOIN-Typen im Detail ansehen, schauen wir uns die grundlegende Syntax an. Ein JOIN besteht immer aus mehreren Komponenten: der Auswahl der Tabellen (`FROM` und `JOIN`), der Verknüpfungsbedingung (`ON`) und optional weiteren Filterbedingungen (`WHERE`).

```{ .sql .no-copy hl_lines="3 4" }
SELECT spalten
FROM haupttabelle
[INNER|LEFT|RIGHT] JOIN andere_tabelle
    ON haupttabelle.fk = andere_tabelle.pk
WHERE filter_bedingung;
```

Bei der Spaltenauswahl im `SELECT` können wir auf **alle Spalten aus beiden Tabellen** zugreifen. Um eindeutig zu machen, von welcher Tabelle eine Spalte stammt, verwenden wir die Notation `tabellenname.spaltenname`. Das ist besonders wichtig, wenn beide Tabellen Spalten mit dem gleichen Namen haben (wie z.B. `lieferant_id` in beiden Tabellen).

Ohne die explizite Angabe der Tabelle würde die Datenbank bei gleichnamigen Spalten (wie `lieferant_id`) einen Fehler werfen, da sie nicht weiß, welche Spalte gemeint ist. Daher ist die Notation `tabellenname.spaltenname` bei JOINs nicht nur guter Stil, sondern oft auch notwendig. Später werden wir sehen, wie **Aliasse** diese Schreibweise deutlich verkürzen.

--- 

Es gibt verschiedene Arten von JOINs, die sich darin unterscheiden, welche Datensätze sie zurückgeben. Die Wahl des richtigen JOIN-Typs hängt davon ab, ob wir nur die Datensätze wollen, die in beiden Tabellen vorhanden sind, oder ob wir auch Datensätze ohne Übereinstimmung behalten möchten. Die folgende Tabelle gibt einen Überblick über die wichtigsten JOIN-Typen:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Join-Typ</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Was wird zurückgegeben?</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Wann verwenden?</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>INNER JOIN</code></td>
        <td style="padding:10px 14px;">Nur Datensätze mit Übereinstimmung in <strong>beiden</strong> Tabellen</td>
        <td style="padding:10px 14px;">Standard für die meisten Abfragen</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LEFT JOIN</code></td>
        <td style="padding:10px 14px;">Alle aus <strong>linker</strong> Tabelle + Übereinstimmungen rechts</td>
        <td style="padding:10px 14px;">Wenn du alle aus Tabelle A willst, auch ohne Match</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>RIGHT JOIN</code></td>
        <td style="padding:10px 14px;">Alle aus <strong>rechter</strong> Tabelle + Übereinstimmungen links</td>
        <td style="padding:10px 14px;">Selten – meist als LEFT JOIN umformuliert</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>FULL OUTER JOIN</code></td>
        <td style="padding:10px 14px;">Alle aus <strong>beiden</strong> Tabellen</td>
        <td style="padding:10px 14px;">Sehr selten – PostgreSQL unterstützt es</td>
    </tr>
    </tbody>
</table>
</div>

In der Praxis ist der **INNER JOIN** der am häufigsten verwendete JOIN-Typ, da wir meist nur die Datensätze sehen möchten, die tatsächlich miteinander verknüpft sind. LEFT und RIGHT JOINs kommen zum Einsatz, wenn wir auch "verwaiste" Datensätze behalten möchten - also solche, die keine Entsprechung in der anderen Tabelle haben.

<div style="text-align: center;">
    <img src="https://media.licdn.com/dms/image/v2/D4D22AQHeU4OzQVrH1g/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1685862307812?e=1779321600&v=beta&t=YUaQeRYDNyXzZSnHcNu5nTeunQbC_c27dxqK6ScXPIs" alt="Join" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://www.linkedin.com/posts/chandanagrawal23_meme-sql-leetcode-share-7071019023173337088-k7BS/">LinkedIn</a></figcaption>
</div>


---


???+ info "Datenbank-Setup"

    Für die Beispiele in diesem Kapitel verwenden wir eine **Beschaffungs-Datenbank** (`beschaffung_db`), die typische Einkaufsprozesse eines produzierenden Unternehmens abbildet. Diese Datenbank hilft uns, JOINs praxisnah zu üben.

    ```sql
    -- Datenbank erstellen
    CREATE DATABASE beschaffung_db;

    -- Zur Datenbank wechseln
    \c beschaffung_db

    -- Tabelle 1: Lieferanten
    CREATE TABLE lieferanten (
        lieferant_id SERIAL PRIMARY KEY,
        firmenname VARCHAR(100) NOT NULL,
        land VARCHAR(50),
        bewertung NUMERIC(2,1)
    );

    -- Tabelle 2: Artikel
    CREATE TABLE artikel (
        artikel_id SERIAL PRIMARY KEY,
        artikelname VARCHAR(100) NOT NULL,
        kategorie VARCHAR(50),
        einkaufspreis NUMERIC(10,2)
    );

    -- Tabelle 3: Bestellungen
    CREATE TABLE bestellungen (
        bestell_id SERIAL PRIMARY KEY,
        bestelldatum DATE NOT NULL,
        lieferant_id INTEGER,
        status VARCHAR(20),
        FOREIGN KEY (lieferant_id) REFERENCES lieferanten(lieferant_id)
    );

    -- Tabelle 4: Bestellpositionen (Zwischentabelle für Bestellungen und Artikel)
    CREATE TABLE bestellpositionen (
        position_id SERIAL PRIMARY KEY,
        bestell_id INTEGER NOT NULL,
        artikel_id INTEGER NOT NULL,
        menge INTEGER NOT NULL,
        einzelpreis NUMERIC(10,2),
        FOREIGN KEY (bestell_id) REFERENCES bestellungen(bestell_id),
        FOREIGN KEY (artikel_id) REFERENCES artikel(artikel_id)
    );

    -- Testdaten einfügen
    INSERT INTO lieferanten (firmenname, land, bewertung)
    VALUES
        ('Stahl GmbH', 'Deutschland', 4.5),
        ('MetalCorp', 'Frankreich', 4.2),
        ('SteelWorld Inc', 'USA', 3.8),
        ('IronWorks AG', 'Deutschland', NULL);  -- Neuer Lieferant, noch keine Bewertung

    INSERT INTO artikel (artikelname, kategorie, einkaufspreis)
    VALUES
        ('Stahlblech 2mm', 'Rohmaterial', 12.50),
        ('Aluminiumprofile', 'Rohmaterial', 25.00),
        ('Schrauben M8', 'Befestigung', 0.15),
        ('Muttern M8', 'Befestigung', 0.08),
        ('Dichtungsringe', 'Zubehoer', 1.20);

    INSERT INTO bestellungen (bestelldatum, lieferant_id, status)
    VALUES
        ('2024-01-15', 1, 'Geliefert'),
        ('2024-01-20', 2, 'In Transit'),
        ('2024-01-22', 1, 'Geliefert'),
        ('2024-01-25', 3, 'Bestellt'),
        ('2024-01-28', NULL, 'Entwurf');  -- Bestellung ohne Lieferant (noch in Planung)

    INSERT INTO bestellpositionen (bestell_id, artikel_id, menge, einzelpreis)
    VALUES
        (1, 1, 500, 12.50),   -- Bestell. 1: 500x Stahlblech
        (1, 3, 5000, 0.15),   -- Bestell. 1: 5000x Schrauben
        (2, 2, 200, 25.00),   -- Bestell. 2: 200x Aluminiumprofile
        (3, 1, 300, 12.50),   -- Bestell. 3: 300x Stahlblech
        (3, 4, 5000, 0.08),   -- Bestell. 3: 5000x Muttern
        (4, 5, 800, 1.20);    -- Bestell. 4: 800x Dichtungsringe
    ```

    **Hinweis:** Beachte, dass die Bestellung mit ID 5 bewusst keinen Lieferanten hat (`lieferant_id = NULL`) und der Lieferant "IronWorks AG" noch keine Bestellungen hat. Dies wird uns helfen, die Unterschiede zwischen INNER JOIN und LEFT JOIN zu verstehen.

---

## JOIN-Typen
### `INNER JOIN`

Der `INNER JOIN` ist der Standard-JOIN und bildet die Schnittmenge zweier Tabellen. Er gibt nur Datensätze zurück, die in **beiden** Tabellen eine Übereinstimmung haben. Stellen Sie sich zwei Kreise vor, die sich überschneiden - der `INNER JOIN` liefert genau den Bereich, in dem sich beide Kreise treffen. Der Syntax für einen `INNER JOIN` ist wie folgt:

```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle1
INNER JOIN tabelle2 ON tabelle1.fremdschlüssel = tabelle2.primärschlüssel
WHERE bedingung;
```

---

Nun führen wir unseren ersten JOIN aus. 

???+ example "`INNER JOIN` - Bestellungen mit Lieferantennamen"

    Wir wollen alle Bestellungen mit den zugehörigen Lieferantennamen anzeigen. Die `ON`-Klausel verbindet die beiden Tabellen über die Lieferanten-IDs:

    ```sql
    SELECT
        bestellungen.bestell_id,
        bestellungen.bestelldatum,
        lieferanten.firmenname,
        bestellungen.status
    FROM bestellungen
    INNER JOIN lieferanten ON bestellungen.lieferant_id = lieferanten.lieferant_id;
    ```

    ```{.cmd .no-copy title="Output"}
     bestell_id | bestelldatum |   firmenname   |   status
    ------------+--------------+----------------+------------
              1 | 2024-01-15   | Stahl GmbH     | Geliefert
              2 | 2024-01-20   | MetalCorp      | In Transit
              3 | 2024-01-22   | Stahl GmbH     | Geliefert
              4 | 2024-01-25   | SteelWorld Inc | Bestellt
    (4 rows)
    ```

    Wir erkennen nun, dass die **Bestellung Nr. 5** (Entwurf ohne Lieferant) und der Lieferant **IronWorks AG** (ohne Bestellungen) **fehlen!** Warum? Beide haben in der jeweils anderen Tabelle keinen passenden Datensatz gefunden. Da der `INNER JOIN` nur Zeilen zurückgibt, bei denen in beiden Tabellen ein passender Datensatz existiert, werden diese Einträge ignoriert. Dies ist ein wichtiges Verhalten: `INNER JOIN` ist restriktiv und zeigt nur vollständige Verknüpfungen.

???+ defi "Definition: `INNER JOIN`"
    `INNER JOIN` zeigt nur Datensätze, die in **beiden** Tabellen verknüpft sind. Datensätze ohne Übereinstimmung werden weggelassen.


---

### Exkurs: Aliasse

Bevor wir uns die weiteren JOIN-Typen ansehen, nehmen wir einen kleinen Exkurs und schauen uns an, wie wir Tabellennamen verkürzen können mit **Aliassen**.
Wir haben Aliasse bereits im Kapitel [Abfragen von Daten](abfragen.md#aggregatfunktionen-daten-zusammenfassen) kennengelernt.


Je komplexer unsere Abfragen werden, desto unübersichtlicher werden lange Tabellennamen wie `bestellungen.bestelldatum` und `lieferanten.firmenname`. Hier kommen Aliasse ins Spiel.
Bei JOINs schreiben wir oft lange Tabellennamen - **Aliasse** (Abkürzungen) machen das übersichtlicher und sind in der Praxis absolut üblich.
Fast jede JOIN-Abfrage, die Sie in der Realität sehen werden, verwendet Aliasse.

???+ example "Aliasse bei JOINs"

    ```sql
    SELECT
        b.bestell_id,
        b.bestelldatum,
        l.firmenname,
        l.land,
        b.status
    FROM bestellungen AS b
    INNER JOIN lieferanten AS l ON b.lieferant_id = l.lieferant_id;
    ```

    oder noch kürzer (ohne `AS`):

    ```sql
    SELECT
        b.bestell_id,
        b.bestelldatum,
        l.firmenname,
        b.status
    FROM bestellungen b
    INNER JOIN lieferanten l ON b.lieferant_id = l.lieferant_id;
    ```

???+ tip "Best Practice"
    Verwende immer kurze, aussagekräftige Aliasse (z.B. `m`, `t`) bei JOINs – das macht die Abfrage viel lesbarer!


---

### `LEFT JOIN`

Was aber, wenn wir **alle** Bestellungen sehen wollen, unabhängig davon, ob sie bereits einem Lieferanten zugeordnet sind oder nicht? Hier kommt der `LEFT JOIN` (auch `LEFT OUTER JOIN`) ins Spiel. Er gibt **alle Datensätze der linken Tabelle** zurück, auch wenn sie keine Übereinstimmung in der rechten Tabelle haben.

Der Unterschied zum `INNER JOIN` ist subtil aber wichtig: Beim LEFT JOIN ist die linke Tabelle (in unserem Fall `bestellungen`) die "dominante" Tabelle - alle ihre Zeilen erscheinen im Ergebnis. Gibt es für eine Bestellung keinen passenden Lieferanten, werden die Spalten aus der Lieferanten-Tabelle einfach mit `NULL` gefüllt.

???+ example "`LEFT JOIN` - Bestellungen mit Lieferantennamen"

    ```sql
    SELECT
        b.bestell_id,
        b.bestelldatum,
        l.firmenname,
        l.land,
        b.status
    FROM bestellungen b
    LEFT JOIN lieferanten l ON b.lieferant_id = l.lieferant_id;
    ```

    ```{.cmd .no-copy title="Output"}
     bestell_id | bestelldatum |   firmenname   |    land     |   status
    ------------+--------------+----------------+-------------+------------
              1 | 2024-01-15   | Stahl GmbH     | Deutschland | Geliefert
              2 | 2024-01-20   | MetalCorp      | Frankreich  | In Transit
              3 | 2024-01-22   | Stahl GmbH     | Deutschland | Geliefert
              4 | 2024-01-25   | SteelWorld Inc | USA         | Bestellt
              5 | 2024-01-28   |                |             | Entwurf
    (5 rows)
    ```

    Und nun sehen wir, dass **Bestellung Nr. 5** dabei ist, obwohl kein Lieferant zugeordnet ist! An der Stelle, wo der Lieferantenname und das Land stehen sollten, steht `NULL`. Dies ist besonders nützlich, wenn wir beispielsweise alle Bestellungen auflisten wollen, die noch keinen Lieferanten zugewiesen haben, oder wenn wir eine Übersicht aller Bestellungen brauchen, unabhängig von ihrem Bearbeitungsstatus.

`LEFT JOIN` wird in der Praxis oft verwendet, da es wichtig sein kann, auch "unvollständige" Datensätze zu sehen. Denken wir an Berichte oder Übersichten, wo wir nicht versehentlich Datensätze verschweigen wollen, nur weil eine Verknüpfung fehlt.

???+ example "`LEFT JOIN`: Lieferanten ohne Bestellungen finden"

    Ein weiterer häufiger Anwendungsfall: Welche Lieferanten haben noch **keine** Bestellungen erhalten?

    ```sql
    SELECT
        l.firmenname,
        l.land,
        COUNT(b.bestell_id) AS anzahl_bestellungen
    FROM lieferanten l
    LEFT JOIN bestellungen b ON l.lieferant_id = b.lieferant_id
    GROUP BY l.firmenname, l.land
    HAVING COUNT(b.bestell_id) = 0;
    ```

    ```{.cmd .no-copy title="Output"}
      firmenname  |    land     | anzahl_bestellungen
    --------------+-------------+---------------------
     IronWorks AG | Deutschland |                   0
    (1 row)
    ```

    Mit LEFT JOIN und Aggregation können wir leicht herausfinden, welche Lieferanten noch nie eine Bestellung erhalten haben.

---

### `RIGHT` & `FULL OUTER JOIN`

Der `RIGHT JOIN` (auch `RIGHT OUTER JOIN`) ist das Spiegelbild des `LEFT JOIN`: Alle Datensätze der **rechten** Tabelle werden zurückgegeben. Anstatt dass die linke Tabelle dominant ist, ist nun die rechte Tabelle die führende - alle ihre Zeilen erscheinen im Ergebnis, auch wenn es keine Übereinstimmung in der linken Tabelle gibt.

In der Praxis wird `RIGHT JOIN` jedoch sehr selten verwendet, da man das gleiche Ergebnis durch Vertauschen der Tabellen und Verwendung eines `LEFT JOIN` erreichen kann. Die meisten Entwickler bevorzugen `LEFT JOIN`, weil es intuitiver ist: Man liest von links nach rechts und die "Haupttabelle" steht links. Aus diesem Grund werden Sie in professionellem Code kaum RIGHT JOINs finden - es ist einfach eine Konventionsfrage, und die Konvention hat sich klar für LEFT JOIN entschieden.

Der `FULL OUTER JOIN` vereint `LEFT` und `RIGHT JOIN`: Er gibt **alle** Datensätze aus **beiden** Tabellen zurück, unabhängig davon, ob eine Verknüpfung existiert oder nicht. Fehlende Werte werden mit `NULL` gefüllt. Dieser JOIN-Typ ist noch seltener als `RIGHT JOIN` und wird nur in sehr spezifischen Szenarien benötigt - beispielsweise wenn man alle Datensätze aus beiden Tabellen sehen möchte, um Inkonsistenzen oder fehlende Verknüpfungen zu identifizieren.

Für die allermeisten Anwendungsfälle reichen `INNER JOIN` und `LEFT JOIN` vollkommen aus. Diese beiden sollten wir gut beherrschen, während `RIGHT JOIN` und `FULL OUTER JOIN` eher Randerscheinungen sind, die wir kennen, aber selten verwenden werden.


---


## Verbinde mehrere Tabellen

Bisher haben wir in unseren Beispielen immer nur zwei Tabellen miteinander verknüpft. In der Realität sind Datenbanken jedoch oft komplexer strukturiert, und wir müssen Daten aus drei, vier oder sogar noch mehr Tabellen kombinieren. Die gute Nachricht: Man kann beliebig viele Tabellen in einer einzigen Abfrage joinen!

Dies ist besonders bei komplexen Geschäftsprozessen wichtig. In unserem Beschaffungsszenario müssen wir beispielsweise Bestellungen, Lieferanten, Artikel und Bestellpositionen zusammenführen, um eine vollständige Übersicht zu erhalten.

???+ example "Verbinde mehrere Tabellen"
    Stellen wir uns vor, wir möchten eine vollständige Übersicht aller Bestellpositionen mit Lieferant, Artikel und Gesamtkosten:

    ```sql
    -- Welche Artikel wurden von welchem Lieferanten bestellt?
    SELECT
        l.firmenname AS lieferant,
        b.bestelldatum,
        a.artikelname,
        bp.menge,
        bp.einzelpreis,
        (bp.menge * bp.einzelpreis) AS positionswert
    FROM bestellpositionen bp
    INNER JOIN bestellungen b ON bp.bestell_id = b.bestell_id
    INNER JOIN lieferanten l ON b.lieferant_id = l.lieferant_id
    INNER JOIN artikel a ON bp.artikel_id = a.artikel_id
    ORDER BY b.bestelldatum, l.firmenname;
    ```

    ```{.cmd .no-copy title="Output"}
       lieferant    | bestelldatum |   artikelname    | menge | einzelpreis | positionswert
    ----------------+--------------+------------------+-------+-------------+---------------
     Stahl GmbH     | 2024-01-15   | Stahlblech 2mm   |   500 |       12.50 |       6250.00
     Stahl GmbH     | 2024-01-15   | Schrauben M8     |  5000 |        0.15 |        750.00
     MetalCorp      | 2024-01-20   | Aluminiumprofile |   200 |       25.00 |       5000.00
     Stahl GmbH     | 2024-01-22   | Stahlblech 2mm   |   300 |       12.50 |       3750.00
     Stahl GmbH     | 2024-01-22   | Muttern M8       |  5000 |        0.08 |        400.00
     SteelWorld Inc | 2024-01-25   | Dichtungsringe   |   800 |        1.20 |        960.00
    (6 rows)
    ```

    Die Datenbank führt die JOINs sequenziell aus - erst wird das erste JOIN-Paar verarbeitet, dann das Ergebnis mit der nächsten Tabelle verknüpft:

    1. `bestellpositionen` mit `bestellungen` joinen (über `bestell_id`)
    2. Das Zwischenergebnis mit `lieferanten` joinen (über `lieferant_id`)
    3. Das Zwischenergebnis mit `artikel` joinen (über `artikel_id`)

    In diesem Beispiel nutzen wir ausschließlich `INNER JOINs`, weil wir nur vollständige Datensätze sehen wollen. Würden wir auch Bestellungen ohne Lieferanten oder Positionen ohne Artikel sehen wollen, müssten wir `LEFT JOINs` verwenden.

---

???+ example "Kombination aus mehreren JOINs und Aggregationen"
    Besonders mächtig wird die Kombination aus mehreren JOINs und Aggregationen. Zum Beispiel: Welcher Lieferant hat das größte Bestellvolumen?

    ```sql
    SELECT
        l.firmenname,
        l.land,
        COUNT(DISTINCT b.bestell_id) AS anzahl_bestellungen,
        SUM(bp.menge * bp.einzelpreis) AS gesamtumsatz
    FROM lieferanten l
    LEFT JOIN bestellungen b ON l.lieferant_id = b.lieferant_id
    LEFT JOIN bestellpositionen bp ON b.bestell_id = bp.bestell_id
    GROUP BY l.firmenname, l.land
    ORDER BY gesamtumsatz DESC NULLS LAST;
    ```

    ```{.cmd .no-copy title="Output"}
       firmenname   |    land     | anzahl_bestellungen | gesamtumsatz
    ----------------+-------------+---------------------+--------------
     Stahl GmbH     | Deutschland |                   2 |     11150.00
     MetalCorp      | Frankreich  |                   1 |      5000.00
     SteelWorld Inc | USA         |                   1 |       960.00
     IronWorks AG   | Deutschland |                   0 |
    (4 rows)
    ```

    Hier verwenden wir `LEFT JOIN`, um auch Lieferanten ohne Bestellungen (wie IronWorks AG) anzuzeigen. Die Aggregation zeigt uns dann, welche Lieferanten am wichtigsten sind.

---

## Übung ✍️

Nun wenden wir das Erlernte auf unser **TecGuy GmbH Produktionsplanungssystem** an! Wir nutzen die in den vorherigen Kapiteln erstellten Tabellen und verknüpfen sie mit **JOINs**, um aussagekräftige Berichte und Analysen zu erstellen.

Im vorherigen Kapitel haben wir **Foreign Keys** und **Beziehungen** zwischen Tabellen erstellt. Jetzt lernen wir, wie man Daten aus **mehreren verknüpften Tabellen** abfragt.

---

???+ info "Übungsvorbereitung - Datenbank zurücksetzen"

    Falls du das vorherige Kapitel nicht abgeschlossen hast oder neu starten möchtest,
    führe dieses Setup aus. Es löscht alle bestehenden Daten und erstellt den
    korrekten Ausgangszustand für dieses Kapitel.

    ??? code "Setup"

        ```sql
        -- Zu anderer Datenbank wechseln
        \c postgres
        
        -- Zur Datenbank wechseln (oder neu erstellen)
        DROP DATABASE IF EXISTS produktionsplanung_db;
        CREATE DATABASE produktionsplanung_db;
        \c produktionsplanung_db

        -- 1. Tabelle für Maschinen erstellen
        CREATE TABLE maschinen (
            maschinen_id INTEGER PRIMARY KEY,
            maschinenname VARCHAR(100),
            maschinentyp VARCHAR(50),
            produktionshalle VARCHAR(50),
            anschaffungsjahr INTEGER,
            maschinenstatus VARCHAR(20),
            wartungsintervall_tage INTEGER
        );

        -- 2. Tabelle für Produktionsaufträge erstellen (MIT FK-Constraint)
        CREATE TABLE produktionsauftraege (
            auftrag_id INTEGER PRIMARY KEY,
            auftragsnummer VARCHAR(20),
            kunde VARCHAR(100),
            produkt VARCHAR(100),
            menge INTEGER,
            startdatum DATE,
            lieferdatum DATE,
            status VARCHAR(20),
            maschinen_id INTEGER,
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE RESTRICT
        );

        -- 3. Tabelle für Wartungsprotokolle erstellen (MIT FK-Constraint)
        CREATE TABLE wartungsprotokolle (
            wartungs_id SERIAL PRIMARY KEY,
            wartungsdatum DATE NOT NULL,
            beschreibung TEXT,
            techniker VARCHAR(100),
            kosten NUMERIC(10, 2),
            maschinen_id INTEGER NOT NULL,
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE CASCADE
        );

        -- 4. Tabelle für Ersatzteile erstellen
        CREATE TABLE ersatzteile (
            teil_id SERIAL PRIMARY KEY,
            teilename VARCHAR(100) NOT NULL,
            hersteller VARCHAR(100),
            preis NUMERIC(10, 2)
        );

        -- 5. Junction Table für n:m Beziehung (Maschinen ↔ Ersatzteile)
        CREATE TABLE maschinen_ersatzteile (
            zuordnung_id SERIAL PRIMARY KEY,
            maschinen_id INTEGER NOT NULL,
            teil_id INTEGER NOT NULL,
            benoetigte_anzahl INTEGER DEFAULT 1,
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE CASCADE,
            FOREIGN KEY (teil_id) REFERENCES ersatzteile(teil_id)
                ON DELETE CASCADE
        );

        -- Maschinen-Daten einfügen
        INSERT INTO maschinen VALUES
        (1, 'CNC-Fraese Alpha', 'CNC-Fraese', 'Halle A', 2020, 'Aktiv', 90),
        (2, 'Drehbank Delta', 'Drehbank', 'Halle A', 2018, 'Aktiv', 120),
        (3, 'Presse Gamma', 'Presse', 'Halle B', 2019, 'Aktiv', 60),
        (4, 'Schweissroboter Beta', 'Schweissroboter', 'Halle C', 2021, 'Aktiv', 90);

        -- Produktionsaufträge-Daten einfügen
        INSERT INTO produktionsauftraege VALUES
        (1, 'AUF-2024-001', 'BMW AG', 'Getriebegehäuse', 500, '2024-04-01', '2024-04-15', 'In Produktion', 1),
        (2, 'AUF-2024-002', 'Audi AG', 'Kurbelwelle', 200, '2024-04-10', '2024-04-20', 'In Produktion', 2),
        (3, 'AUF-2024-003', 'Mercedes-Benz', 'Pleuelstange', 350, '2024-04-05', '2024-04-18', 'In Produktion', 2),
        (4, 'AUF-2024-004', 'Porsche AG', 'Kolben', 150, '2024-04-12', '2024-04-25', 'In Vorbereitung', 4),
        (5, 'AUF-2024-005', 'BMW AG', 'Kurbelwelle', 300, '2024-04-15', '2024-04-22', 'In Produktion', 2),
        (6, 'AUF-2024-006', 'Volkswagen AG', 'Kolben', 400, '2024-04-20', '2024-04-28', 'In Vorbereitung', 1),
        (7, 'AUF-2024-009', 'Porsche AG', 'Kurbelwelle', 120, '2024-04-28', '2024-05-05', 'In Vorbereitung', 2),
        (8, 'AUF-2024-010', 'BMW AG', 'Kolben', 350, '2024-04-12', '2024-04-19', 'In Produktion', 4);

        -- Wartungsprotokolle-Daten einfügen
        INSERT INTO wartungsprotokolle (wartungsdatum, beschreibung, techniker, kosten, maschinen_id)
        VALUES
        ('2024-01-15', 'Routinewartung - Oelwechsel', 'M. Schneider', 250.00, 1),
        ('2024-02-10', 'Reparatur Spindelmotor', 'L. Weber', 850.00, 1),
        ('2024-01-20', 'Routinewartung - Kalibrierung', 'M. Schneider', 180.00, 2),
        ('2024-03-05', 'Austausch Keilriemen', 'L. Weber', 120.00, 2);

        -- Ersatzteile-Daten einfügen
        INSERT INTO ersatzteile (teilename, hersteller, preis)
        VALUES
        ('Spindelmotor 5kW', 'MotorTech GmbH', 1850.00),
        ('Kuehlmittelpumpe', 'PumpCo AG', 320.50),
        ('Linearfuehrung 500mm', 'Precision Parts', 680.00),
        ('Werkzeughalter ISO40', 'ToolSupply GmbH', 145.00),
        ('Drehfutter 250mm', 'ChuckMaster', 890.00);

        -- Maschinen-Ersatzteile Zuordnungen einfügen
        INSERT INTO maschinen_ersatzteile (maschinen_id, teil_id, benoetigte_anzahl)
        VALUES
        (1, 1, 1),  -- CNC-Fraese braucht 1x Spindelmotor
        (1, 2, 2),  -- CNC-Fraese braucht 2x Kuehlmittelpumpe
        (1, 3, 4),  -- CNC-Fraese braucht 4x Linearfuehrung
        (1, 4, 6),  -- CNC-Fraese braucht 6x Werkzeughalter
        (2, 2, 1),  -- Drehbank braucht 1x Kuehlmittelpumpe
        (2, 5, 1);  -- Drehbank braucht 1x Drehfutter
        ```

        **Hinweis:** Alle Foreign Key Constraints sind aktiv. Die Tabellen sind nun vollständig verknüpft!

---

???+ question "Aufgabe 1: INNER JOIN - Produktionsaufträge mit Maschinen"

    Erstelle eine Übersicht aller Produktionsaufträge mit dem Namen der zugeordneten Maschine.

    **Anforderungen:**

    - Zeige: Auftragsnummer, Kunde, Produkt, Maschinennamen, Status
    - Sortiere nach Auftragsnummer
    - Verwende Aliasse für bessere Lesbarkeit

    ??? info "💡 Tip anzeigen"
        Wir können folgende Befehle verwenden: `INNER JOIN ... ON` & `ORDER BY`
        

        ??? info "⚡Lösung anzeigen"
            ```sql
            SELECT
                p.auftragsnummer,
                p.kunde,
                p.produkt,
                m.maschinenname,
                p.status
            FROM produktionsauftraege p
            INNER JOIN maschinen m ON p.maschinen_id = m.maschinen_id
            ORDER BY p.auftragsnummer;
            ```


???+ question "Aufgabe 2: LEFT JOIN - Alle Maschinen und ihre Aufträge"

    Zeige alle Maschinen und die Anzahl ihrer zugeordneten Produktionsaufträge. Auch Maschinen ohne Aufträge sollen angezeigt werden.

    **Anforderungen:**

    - Zeige: Maschinenname, Maschinentyp, Anzahl Aufträge
    - Es sollen auch Maschinen ohne Aufträge erscheinen
    - Gruppiere nach Maschine
    - Sortiere nach Anzahl Aufträge (absteigend)

    ??? info "💡 Tip anzeigen"
        Wir können folgende Befehle verwenden: `INNER JOIN ... ON`, `GROUP BY` & `ORDER BY`

        ??? info "⚡Lösung anzeigen"
            ```sql
            SELECT
                m.maschinenname,
                m.maschinentyp,
                COUNT(p.auftrag_id) AS anzahl_auftraege
            FROM maschinen m
            LEFT JOIN produktionsauftraege p ON m.maschinen_id = p.maschinen_id
            GROUP BY m.maschinenname, m.maschinentyp
            ORDER BY anzahl_auftraege DESC;
            ```


???+ question "Aufgabe 3: INNER JOIN - Wartungsprotokolle mit Maschinen"

    Erstelle einen Wartungsbericht: Zeige alle Wartungen mit Maschinenname, sortiert nach Kosten (höchste zuerst).

    **Anforderungen:**

    - Zeige: Maschinenname, Wartungsdatum, Beschreibung, Techniker, Kosten
    - Nur Wartungen, die tatsächlich einer Maschine zugeordnet sind
    - Sortiere nach Kosten absteigend
    - Filtere nur Wartungen mit Kosten > 200 EUR

    ??? info "💡 Tip anzeigen"
        Wir können folgende Befehle verwenden: `INNER JOIN ... ON`, `WHERE` & `ORDER BY`
        

        ??? info "⚡Lösung anzeigen"
            ```sql
            SELECT
                m.maschinenname,
                w.wartungsdatum,
                w.beschreibung,
                w.techniker,
                w.kosten
            FROM wartungsprotokolle w
            INNER JOIN maschinen m ON w.maschinen_id = m.maschinen_id
            WHERE w.kosten > 200
            ORDER BY w.kosten DESC;
            ```

???+ question "Aufgabe 4: Mehrere Tabellen - Ersatzteile für Maschinen (n:m)"

    Zeige, welche Maschinen welche Ersatzteile benötigen. Berechne außerdem die Gesamtkosten pro Maschine.

    **Anforderungen:**

    - Verknüpfe 3 Tabellen: `maschinen`, `maschinen_ersatzteile`, `ersatzteile`
    - Zeige: Maschinenname, Teilename, benötigte Anzahl, Einzelpreis, Gesamtpreis (Anzahl * Preis)
    - Sortiere nach Maschine und Teilename

    ??? info "💡 Tip anzeigen"
        Wir können folgende Befehle verwenden: `INNER JOIN ... ON` & `ORDER BY`

        ??? info "⚡Lösung anzeigen"
            ```sql
            SELECT
                m.maschinenname,
                e.teilename,
                me.benoetigte_anzahl,
                e.preis,
                (me.benoetigte_anzahl * e.preis) AS gesamtpreis
            FROM maschinen m
            INNER JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
            INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
            ORDER BY m.maschinenname, e.teilename;
            ```



???+ question "Aufgabe 5: Komplexe Abfrage - Produktionsübersicht"

    Erstelle eine umfassende Übersicht pro Maschine: Anzahl Aufträge, Anzahl Wartungen und Gesamtwartungskosten.

    **Anforderungen:**

    - Zeige: Maschinenname, Anzahl Produktionsaufträge, Anzahl Wartungen, Gesamtwartungskosten
    - Verwende LEFT JOINs für beide Verknüpfungen
    - Gruppiere nach Maschine
    - Sortiere nach Maschinenname

    ??? info "💡 Tip anzeigen"
        Wir können folgende Befehle verwenden: `COUNT`, `SUM`, `LEFT JOIN ... ON`, `GROUP BY` & `ORDER BY`

        ??? info "⚡Lösung anzeigen"
            ```sql
            SELECT
                m.maschinenname,
                COUNT(DISTINCT p.auftrag_id) AS anzahl_auftraege,
                COUNT(DISTINCT w.wartungs_id) AS anzahl_wartungen,
                SUM(w.kosten) AS gesamtwartungskosten
            FROM maschinen m
            LEFT JOIN produktionsauftraege p ON m.maschinen_id = p.maschinen_id
            LEFT JOIN wartungsprotokolle w ON m.maschinen_id = w.maschinen_id
            GROUP BY m.maschinenname
            ORDER BY m.maschinenname;
            ```

---

## Zusammenfassung 📌

- **JOINs** kombinieren Daten aus mehreren Tabellen
- **INNER JOIN** zeigt nur verknüpfte Datensätze (Schnittmenge)
- **LEFT JOIN** zeigt alle aus der linken Tabelle + Matches rechts
- **RIGHT JOIN** zeigt alle aus der rechten Tabelle + Matches links
- **Aliasse** (z.B. `AS a`) machen JOINs übersichtlicher
- Man kann beliebig viele Tabellen joinen

---

Im nächsten Kapitel lernen wir **fortgeschrittene SQL-Techniken**: Unterabfragen, String-Funktionen und mehr! Mit den JOINs haben Sie nun das Fundament gelegt, um auch komplexe Datenbankstrukturen effizient abzufragen.

<div style="text-align: center;">
    <img src="https://www.blazesql.com/images/memes/can_i_join_you.webp" alt="Join" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://www.blazesql.com/images/memes/can_i_join_you.webp">blazesql</a></figcaption>
</div>