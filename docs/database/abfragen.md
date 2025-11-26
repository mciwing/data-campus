# Daten abfragen mit SQL

Im vorherigen Kapitel haben wir gelernt, wie man Tabellen erstellt, Daten einfügt und Daten auch einfach ausliest. Jetzt gehen wir einen Schritt weiter: Wir lernen, wie man **gezielt nach Daten sucht, sie filtert, sortiert und analysiert** - das Herzstück jeder Datenbank!

SQL ist eine **deklarative Sprache**: Wir beschreiben, **was** wir haben möchten, nicht **wie** die Datenbank es finden soll. Das macht SQL mächtig und gleichzeitig einfach zu lernen.

---

## Die Grundstruktur von `SELECT`

Im vorigen Kapitel haben wir bereits den `SELECT` Befehl kennengelernt. Doch neben dieser einfachen gezeigten Abfrage können wir auch noch mehr damit machen. Eine SELECT-Abfrage hat folgende Grundstruktur:

```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle
-- ↓↓ Weitere Klauseln ↓↓
WHERE bedingung
ORDER BY sortierung;
```

**Übersetzt bedeutet das:**

> "Wähle diese **Spalten** aus dieser **Tabelle**, aber nur die Zeilen, die diese **Bedingung** erfüllen, und sortiere das Ergebnis nach dieser **Sortierung**."

Wir werden uns nun in diesem Kapitel ansehen, welche weiteren Möglichkeiten wir haben, um Daten aus einer Datenbank abzufragen und schon einfache Analysen durchführen.

---

???+ info "Datenbank-Setup"
    Für die Beispiele in diesem Kapitel verwenden wir eine **Lieferketten-Datenbank**. Diese verwaltet Materiallieferungen für ein produzierendes Unternehmen - ein typisches Szenario im Wirtschaftsingenieurwesen.

    Führe folgenden Code aus, um die Beispieldatenbank zu erstellen:

    ```sql
    -- Datenbank erstellen
    CREATE DATABASE lieferkette_db;

    -- Zur Datenbank wechseln
    \c lieferkette_db

    -- Tabelle für Lieferungen erstellen
    CREATE TABLE lieferungen (
        lieferung_id INTEGER PRIMARY KEY,
        lieferant VARCHAR(100),
        material VARCHAR(100),
        menge INTEGER,
        preis_pro_einheit NUMERIC(10,2),
        lieferdatum DATE,
        status VARCHAR(20),
        zielstandort VARCHAR(50)
    );

    -- Beispieldaten einfuegen
    INSERT INTO lieferungen VALUES
    (1, 'Stahlwerk Salzgitter', 'Stahlblech 2mm', 500, 12.50, '2024-03-15', 'Geliefert', 'Lager Nord'),
    (2, 'Aluminium AG', 'Aluminiumprofile', 200, 25.00, '2024-03-18', 'Geliefert', 'Lager Sued'),
    (3, 'Kunststoff GmbH', 'PVC-Platten', 150, 8.75, '2024-03-20', 'In Transit', 'Lager Nord'),
    (4, 'Stahlwerk Salzgitter', 'Stahlprofil IPE200', 80, 45.00, '2024-03-22', 'Bestellt', 'Lager Ost'),
    (5, 'Schrauben Meyer', 'Sechskantschrauben M8', 5000, 0.15, '2024-03-16', 'Geliefert', 'Lager Nord'),
    (6, 'Aluminium AG', 'Aluminiumblech 3mm', 300, 18.50, '2024-03-25', 'Bestellt', 'Lager Sued'),
    (7, 'Elektronik Weber', 'Sensoren Typ A', 100, 12.90, '2024-03-19', 'Geliefert', 'Lager Ost'),
    (8, 'Kunststoff GmbH', 'Gummiband 10mm', 800, 2.30, '2024-03-21', 'In Transit', 'Lager Nord'),
    (9, 'Schrauben Meyer', 'Muttern M8', 5000, 0.08, '2024-03-17', 'Geliefert', 'Lager Nord'),
    (10, 'Elektronik Weber', 'Kabelbaum 5m', 50, 22.00, '2024-03-28', 'Bestellt', 'Lager Ost');
    ```

    Diese Tabelle enthält typische Lieferinformationen: Lieferant, Material, Menge, Preis, Lieferdatum, Status und Zielstandort.

---

## Filtern mit `WHERE`

Bislang haben wir bei der Abfrage von Daten entweder alles abgefragt (`*`) oder gewisse **Spalten** ausgewählt. Welche **Zeilen** / Tuples aber geladen werden sollen, haben wir bisher nicht eingrenzt. Daher wurden zuvor alle Zeilen geladen.

Mit der **WHERE-Klausel** können wir aber nun Datensätze nach bestimmten Kriterien filtern. Der grundlegende Syntax lautet wiefolgt:

```sql { .yaml .no-copy }
SELECT *
FROM tabellenname
WHERE bedingung;
```

### Einfache Vergleiche

Wie auch in der Mathematik stehen uns für die Bedingungen verschiedenste Vergleichsoperatoren zur Verfügung.

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:center; padding:12px 14px; font-weight:700;">Operator</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>=</code></td>
        <td style="padding:10px 14px;">Gleich</td>
        <td style="padding:10px 14px;"><code>status = 'Geliefert'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>!=</code> oder <code>&lt;&gt;</code></td>
        <td style="padding:10px 14px;">Ungleich</td>
        <td style="padding:10px 14px;"><code>status != 'Bestellt'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&gt;</code></td>
        <td style="padding:10px 14px;">Größer als</td>
        <td style="padding:10px 14px;"><code>menge &gt; 100</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&lt;</code></td>
        <td style="padding:10px 14px;">Kleiner als</td>
        <td style="padding:10px 14px;"><code>preis_pro_einheit &lt; 10</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&gt;=</code></td>
        <td style="padding:10px 14px;">Größer oder gleich</td>
        <td style="padding:10px 14px;"><code>menge &gt;= 500</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&lt;=</code></td>
        <td style="padding:10px 14px;">Kleiner oder gleich</td>
        <td style="padding:10px 14px;"><code>preis_pro_einheit &lt;= 5</code></td>
    </tr>
    </tbody>
</table>
</div>

Mit diesen Vergleichsoperatoren können wir nun Filter-Bedingungen für die Abfrage der Daten festlegen.


???+ example "Beispiel: Lieferungen von spezifischen Lieferanten"
    ```sql hl_lines="3"
    -- Alle Lieferungen von 'Stahlwerk Salzgitter'
    SELECT * FROM lieferungen
    WHERE lieferant = 'Stahlwerk Salzgitter';
    ```

    ```{.cmd .no-copy title="Output"}
     lieferung_id |      lieferant       |      material       | menge | preis_pro_einheit | lieferdatum |  status  | zielstandort
    --------------+----------------------+---------------------+-------+-------------------+-------------+----------+--------------
                1 | Stahlwerk Salzgitter | Stahlblech 2mm      |   500 |             12.50 | 2024-03-15  | Geliefert| Lager Nord
                4 | Stahlwerk Salzgitter | Stahlprofil IPE200  |    80 |             45.00 | 2024-03-22  | Bestellt | Lager Ost
    (2 rows)
    ```

    ??? code "weitere Beispiele"

        **Menge größer 200**

        ```sql
        -- Lieferungen mit Menge größer 200
        SELECT lieferant, material, menge
        FROM lieferungen
        WHERE menge > 200;
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       |       material        | menge
        ----------------------+-----------------------+-------
         Stahlwerk Salzgitter | Stahlblech 2mm        |   500
         Schrauben Meyer      | Sechskantschrauben M8 |  5000
         Aluminium AG         | Aluminiumblech 3mm    |   300
         Kunststoff GmbH      | Gummiband 10mm        |   800
         Schrauben Meyer      | Muttern M8            |  5000
        (5 rows)
        ```

        ---

        **Alle außer gelieferte Lieferungen**

        ```sql
        -- Alle außer gelieferte Lieferungen
        SELECT lieferant, material, status
        FROM lieferungen
        WHERE status != 'Geliefert';
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       |      material      |   status
        ----------------------+--------------------+------------
         Kunststoff GmbH      | PVC-Platten        | In Transit
         Stahlwerk Salzgitter | Stahlprofil IPE200 | Bestellt
         Aluminium AG         | Aluminiumblech 3mm | Bestellt
         Kunststoff GmbH      | Gummiband 10mm     | In Transit
         Elektronik Weber     | Kabelbaum 5m       | Bestellt
        (5 rows)
        ```

---

### Verknüpfte Vergleiche

Neben den einfachen Vergleichen können wir mehrere Bedingungen auch zu komplexeren verknüpften Vergleichen kombinieren. Dazu stehen uns `AND`, `OR`, `NOT`, `IN` und `BETWEEN` zur Verfügung.

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:center; padding:12px 14px; font-weight:700;">Operator</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>AND</code></td>
        <td style="padding:10px 14px;">Beide Bedingungen müssen erfüllt sein</td>
        <td style="padding:10px 14px;"><code>menge > 100 AND status = 'Geliefert'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>OR</code></td>
        <td style="padding:10px 14px;">Mindestens eine Bedingung muss erfüllt sein</td>
        <td style="padding:10px 14px;"><code>status = 'In Transit' OR status = 'Bestellt'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>NOT</code></td>
        <td style="padding:10px 14px;">Negiert eine Bedingung</td>
        <td style="padding:10px 14px;"><code>NOT status = 'Geliefert'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>IN</code></td>
        <td style="padding:10px 14px;">Prüft, ob Wert in einer Liste enthalten ist</td>
        <td style="padding:10px 14px;"><code>lieferant IN ('Aluminium AG', 'Elektronik Weber')</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>BETWEEN</code></td>
        <td style="padding:10px 14px;">Prüft, ob Wert in einem Bereich liegt (inklusiv)</td>
        <td style="padding:10px 14px;"><code>menge BETWEEN 100 AND 500</code></td>
    </tr>
    </tbody>
</table>
</div>


???+ info "Inklusive"
    `BETWEEN` ist inklusive - beide Grenzen sind mit eingeschlossen


???+ example "Beispiel: Große Lieferungen die bereits geliefert wurden"
    ```sql hl_lines="4"
    -- Große Lieferungen (> 200) die bereits geliefert wurden
    SELECT lieferant, material, menge, status
    FROM lieferungen
    WHERE menge > 200 AND status = 'Geliefert';
    ```

    ```{.cmd .no-copy title="Output"}
          lieferant       |       material        | menge |  status
    ----------------------+-----------------------+-------+-----------
     Stahlwerk Salzgitter | Stahlblech 2mm        |   500 | Geliefert
     Schrauben Meyer      | Sechskantschrauben M8 |  5000 | Geliefert
     Schrauben Meyer      | Muttern M8            |  5000 | Geliefert
    (3 rows)
    ```

    ??? code "weitere Beispiele"


        **Lieferungen die in Transit oder Bestellt sind**

        ```sql
        -- Lieferungen die in Transit oder Bestellt sind
        SELECT lieferant, material, status
        FROM lieferungen
        WHERE status = 'In Transit' OR status = 'Bestellt';
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       |      material      |   status
        ----------------------+--------------------+------------
         Kunststoff GmbH      | PVC-Platten        | In Transit
         Stahlwerk Salzgitter | Stahlprofil IPE200 | Bestellt
         Aluminium AG         | Aluminiumblech 3mm | Bestellt
         Kunststoff GmbH      | Gummiband 10mm     | In Transit
         Elektronik Weber     | Kabelbaum 5m       | Bestellt
        (5 rows)
        ```

        ---

        **Alle außer gelieferte Lieferungen**

        ```sql
        -- Alle außer gelieferte Lieferungen
        SELECT lieferant, material, status
        FROM lieferungen
        WHERE NOT status = 'Geliefert';
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       |      material      |   status
        ----------------------+--------------------+------------
         Kunststoff GmbH      | PVC-Platten        | In Transit
         Stahlwerk Salzgitter | Stahlprofil IPE200 | Bestellt
         Aluminium AG         | Aluminiumblech 3mm | Bestellt
         Kunststoff GmbH      | Gummiband 10mm     | In Transit
         Elektronik Weber     | Kabelbaum 5m       | Bestellt
        (5 rows)
        ```

        ---

        **Lieferungen zwischen 100 und 500 Einheiten**

        ```sql
        -- Lieferungen zwischen 100 und 500 Einheiten
        SELECT lieferant, material, menge
        FROM lieferungen
        WHERE menge BETWEEN 100 AND 500;
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       |      material      | menge
        ----------------------+--------------------+-------
         Stahlwerk Salzgitter | Stahlblech 2mm     |   500
         Aluminium AG         | Aluminiumprofile   |   200
         Kunststoff GmbH      | PVC-Platten        |   150
         Aluminium AG         | Aluminiumblech 3mm |   300
         Elektronik Weber     | Sensoren Typ A     |   100
        (5 rows)
        ```

        ---

        **Lieferungen von bestimmten Lieferanten**

        ```sql
        -- Lieferungen von bestimmten Lieferanten
        SELECT lieferant, material, menge
        FROM lieferungen
        WHERE lieferant IN ('Aluminium AG', 'Elektronik Weber');
        ```

        Das ist äquivalent zu:

        ```sql
        WHERE lieferant = 'Aluminium AG' OR lieferant = 'Elektronik Weber'
        ```

        ```{.cmd .no-copy title="Output"}
            lieferant     |      material      | menge
        ------------------+--------------------+-------
         Aluminium AG     | Aluminiumprofile   |   200
         Aluminium AG     | Aluminiumblech 3mm |   300
         Elektronik Weber | Sensoren Typ A     |   100
         Elektronik Weber | Kabelbaum 5m       |    50
        (4 rows)
        ```

---

### Muster mit `LIKE`

Oft wissen wir nicht genau, nach welchem exakten Wert wir suchen. Zum Beispiel:

- "Alle Materialien, die mit 'Stahl' beginnen"
- "Alle Lieferanten, die 'GmbH' im Namen haben"
- "Alle Materialien mit einem Namen der Länge 10"

Für solche **Mustersuchen** verwenden wir den **`LIKE`-Operator** zusammen mit **Platzhaltern**. Platzhalter sind spezielle Zeichen, welche für ein beliebiges oder mehrere beliebige Zeichen stehen. Die mag im ersten Moment etwas verwirrend klingen, ist aber in der Praxis durchaus praktisch. Im Grunde gibt es zwei verschiedene Platzhalter:


<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:center; padding:12px 14px; font-weight:700;">Platzhalter</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>%</code></td>
        <td style="padding:10px 14px;">Steht für beliebig viele Zeichen (auch 0)</td>
        <td style="padding:10px 14px;"><code>'Stahl%'</code> findet "Stahlblech", "Stahlprofil"</td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>_</code></td>
        <td style="padding:10px 14px;">Steht für genau ein beliebiges Zeichen</td>
        <td style="padding:10px 14px;"><code>'M_8'</code> findet "M08", "M18", "M88"</td>
    </tr>
    </tbody>
</table>
</div>

Mit diesen zwei Zeichen und deren Bedeutung können wir bereits komplexere Abfragen erstellen. Beispielhaft Muster für `LIKE` Abfragen sind

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">LIKE-Muster</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE 'Stahl%'</code></td>
        <td style="padding:10px 14px;">Beginnt mit "Stahl"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '%GmbH%'</code></td>
        <td style="padding:10px 14px;">Enthält "GmbH" irgendwo im Text</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '%Weber'</code></td>
        <td style="padding:10px 14px;">Endet mit "Weber"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '_l%'</code></td>
        <td style="padding:10px 14px;">Das zweite Zeichen ist "l"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '____'</code></td>
        <td style="padding:10px 14px;">Genau 4 Zeichen lang</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE 'A___%'</code></td>
        <td style="padding:10px 14px;">Beginnt mit "A" und hat mindestens 4 Zeichen</td>
    </tr>
    </tbody>
</table>
</div>


???+ example "Beispiel: Alle Lieferanten filtern"
    ```sql hl_lines="4"
    -- Alle Lieferanten mit 'GmbH' im Namen
    SELECT lieferant, material
    FROM lieferungen
    WHERE lieferant LIKE '%GmbH%';
    ```

    ```{.cmd .no-copy title="Output"}
        lieferant    |    material
    -----------------+----------------
     Kunststoff GmbH | PVC-Platten
     Kunststoff GmbH | Gummiband 10mm
    (2 rows)
    ```

    ??? code "weitere Beispiele"

        **Alle Materialien die mit 'Stahl' beginnen**

        ```sql
        -- Alle Materialien die mit 'Stahl' beginnen
        SELECT lieferant, material
        FROM lieferungen
        WHERE material LIKE 'Stahl%';
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       |      material
        ----------------------+--------------------
         Stahlwerk Salzgitter | Stahlblech 2mm
         Stahlwerk Salzgitter | Stahlprofil IPE200
        (2 rows)
        ```

        ---


        **Alle Lieferanten deren Name mit 'Weber' endet**


        ```sql
        -- Alle Lieferanten deren Name mit 'Weber' endet
        SELECT lieferant, material
        FROM lieferungen
        WHERE lieferant LIKE '%Weber';
        ```

        ```{.cmd .no-copy title="Output"}
            lieferant     |    material
        ------------------+----------------
         Elektronik Weber | Sensoren Typ A
         Elektronik Weber | Kabelbaum 5m
        (2 rows)
        ```

        ---

        **Alle Materialien die 'blech' im Namen enthalten**

        ```sql
        -- Alle Materialien die 'blech' enthalten
        SELECT lieferant, material
        FROM lieferungen
        WHERE material LIKE '%blech%';
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       |      material
        ----------------------+--------------------
         Stahlwerk Salzgitter | Stahlblech 2mm
         Aluminium AG         | Aluminiumblech 3mm
        (2 rows)
        ```


???+ warning "Groß-/Kleinschreibung"
    **`LIKE`** ist in PostgreSQL standardmäßig **case-sensitive**. Dies bedeutet, es wird sehr genau zwischen Groß- und Kleinschreibung unterschieden!

    - `LIKE 'stahl%'` findet NICHT "Stahlblech"
    - `LIKE 'Stahl%'` findet "Stahlblech"

    Für **case-insensitive** Suche verwende **ILIKE**:

    ```sql
    SELECT material FROM lieferungen WHERE material ILIKE 'stahl%';  -- findet "Stahlblech"
    ```

    ```{.cmd .no-copy title="Output"}
          material
    --------------------
     Stahlblech 2mm
     Stahlprofil IPE200
    (2 rows)
    ```

---

## Sortieren mit `ORDER BY`

Standardmäßig werden Abfrageergebnisse in **keiner bestimmten Reihenfolge** zurückgegeben - die Datenbank entscheidet selbst, wie sie die Daten ausgibt. Wenn wir eine **definierte Sortierung** benötigen (z.B. alphabetisch, nach Datum, nach Zahlen), verwenden wir `ORDER BY`.

Mit `ORDER BY` können wir Ergebnisse nach einer oder mehreren Spalten sortieren - sowohl **aufsteigend** (A→Z, 0→9, alt→neu) als auch **absteigend** (Z→A, 9→0, neu→alt). Der grundlegende Syntax lautet wiefolgt:

```sql { .yaml .no-copy }
SELECT *
FROM tabellenname
ORDER BY attribut ASC; -- oder DESC
```

Die zwei verschiedenen Sortierrichtungen können mit Hilfe zweier Schlüsselwörter ausgewählt werden:

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:center; padding:12px 14px; font-weight:700;">Schlüsselwort</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>ASC</code></td>
        <td style="padding:10px 14px;">Aufsteigend (ascending) - <strong>Standard!</strong></td>
        <td style="padding:10px 14px;">A→Z, 0→9, 2020→2024</td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>DESC</code></td>
        <td style="padding:10px 14px;">Absteigend (descending)</td>
        <td style="padding:10px 14px;">Z→A, 9→0, 2024→2020</td>
    </tr>
    </tbody>
</table>
</div>


???+ example "Beispiel: Lieferant und Menge sortieren"

    ```sql hl_lines="4"
    -- Erst nach Lieferant (A-Z), dann nach Menge (größte zuerst)
    SELECT lieferant, material, menge
    FROM lieferungen
    ORDER BY lieferant ASC, menge DESC;
    ```

    ```{.cmd .no-copy title="Output"}
          lieferant       |       material        | menge
    ----------------------+-----------------------+-------
     Aluminium AG         | Aluminiumblech 3mm    |   300
     Aluminium AG         | Aluminiumprofile      |   200
     Elektronik Weber     | Sensoren Typ A        |   100
     Elektronik Weber     | Kabelbaum 5m          |    50
     Kunststoff GmbH      | Gummiband 10mm        |   800
     Kunststoff GmbH      | PVC-Platten           |   150
     Schrauben Meyer      | Sechskantschrauben M8 |  5000
     Schrauben Meyer      | Muttern M8            |  5000
     Stahlwerk Salzgitter | Stahlblech 2mm        |   500
     Stahlwerk Salzgitter | Stahlprofil IPE200    |    80
    (10 rows)
    ```

    **Erklärung:** Die Daten werden zuerst nach `lieferant` alphabetisch sortiert. Innerhalb jedes Lieferanten werden die Materialien nach `menge` absteigend sortiert (größte zuerst).

    ??? code "weitere Beispiele"

        **Nach Material sortiert (A-Z)**

        
        ```sql
        -- Nach Material sortiert (A-Z)
        SELECT material, lieferant
        FROM lieferungen
        ORDER BY material;  -- ASC ist Standard und kann weggelassen werden
        ```

        ```{.cmd .no-copy title="Output"}
               material        |      lieferant
        -----------------------+----------------------
         Aluminiumblech 3mm    | Aluminium AG
         Aluminiumprofile      | Aluminium AG
         Gummiband 10mm        | Kunststoff GmbH
         Kabelbaum 5m          | Elektronik Weber
         Muttern M8            | Schrauben Meyer
         PVC-Platten           | Kunststoff GmbH
         Sechskantschrauben M8 | Schrauben Meyer
         Sensoren Typ A        | Elektronik Weber
         Stahlblech 2mm        | Stahlwerk Salzgitter
         Stahlprofil IPE200    | Stahlwerk Salzgitter
        (10 rows)
        ```

        ---

        **Nach Lieferdatum sortiert (neueste zuerst)**

        ```sql
        -- Nach Lieferdatum sortiert (neueste zuerst)
        SELECT material, lieferdatum
        FROM lieferungen
        ORDER BY lieferdatum DESC;
        ```

        ```{.cmd .no-copy title="Output"}
               material        | lieferdatum
        -----------------------+-------------
         Kabelbaum 5m          | 2024-03-28
         Aluminiumblech 3mm    | 2024-03-25
         Stahlprofil IPE200    | 2024-03-22
         Gummiband 10mm        | 2024-03-21
         PVC-Platten           | 2024-03-20
         Sensoren Typ A        | 2024-03-19
         Aluminiumprofile      | 2024-03-18
         Muttern M8            | 2024-03-17
         Sechskantschrauben M8 | 2024-03-16
         Stahlblech 2mm        | 2024-03-15
        (10 rows)
        ```

        Alternativ kann man auch die **Position der Spalte** im SELECT angeben:

        ```sql
        SELECT lieferant, material, lieferdatum
        FROM lieferungen
        ORDER BY 3 DESC;  -- Sortiere nach der 3. Spalte (lieferdatum)
        ```

        ???+ warning "Nicht empfohlen!"
            Diese Schreibweise ist **weniger lesbar** und sollte nur in Ausnahmefällen verwendet werden. Besser ist es, den Spaltennamen explizit anzugeben: `ORDER BY lieferdatum DESC`


**Sortierung und NULL-Werte**

Was passiert eigentlich, wenn eine Spalte **NULL-Werte** (leere Einträge) enthält?

<div style="text-align: center;">
    <img src="https://devhumor.com/content/uploads/images/December2019/null.jpg" alt="NULL" style="max-width: 70%;">
    <figcaption>Quelle: <a href="https://devhumor.com/content/uploads/images/December2019/null.jpg">devhumor</a></figcaption>
</div>

???+ info "Standardverhalten"
    Das Standardverhalten in PostgreSQL ist:

    - Bei `ASC` (aufsteigend): NULL-Werte kommen **am Ende**
    - Bei `DESC` (absteigend): NULL-Werte kommen **am Anfang**


Doch dieses Verhalten ist nicht in Stein gemeiselt. Wir können dies auch gezielt steuern und festlegen.


```sql { .yaml .no-copy }
-- NULL-Werte zuerst, dann aufsteigend sortieren
ORDER BY spalte ASC NULLS FIRST;

-- NULL-Werte am Ende, dann aufsteigend sortieren
ORDER BY spalte ASC NULLS LAST;
```

---

## Ergebnismenge begrenzen mit `LIMIT`

Alle bisher kennengelernten Befehle liefern uns als Rückgabe sämtliche Datensätze - sofern diese die geforderten Bedingungen erfüllen. Manchmal möchten wir aber nur eine bestimmte Anzahl - zum Beispiel: *Die Top 5 der teuersten Lieferungen*.


Dafür gibt es die Klausel `LIMIT` und optional dazugehörigt `OFFSET`.

???+ tip "Klausel"
    Eine Klausel ist ein Teil einer SQL-Anweisung, der eine bestimmte Aufgabe hat. Beispielsweise:

    - `SELECT`-Klausel
    - `FROM`-Klausel
    - `WHERE`-Klausel
    - `GROUP BY`-Klausel
    - `HAVING`-Klausel
    - `ORDER BY`-Klausel

### Grundlegende Verwendung

Wir starten mit der einfachen Verwendung von `LIMIT` zur Limitierung der Rückgabeergebnisse. Der grundlegende Syntax kann wiefolgt beschrieben werden:

```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle
ORDER BY sortierung
LIMIT anzahl;
```

Wenn wir diesem Syntax folgen können wir beispielsweise die ersten 3 Ergebnisse zurückgeben lassen.



???+ example "Beispiel: Die 3 günstigsten Materialien"
    ```sql hl_lines="5"
    -- Die 3 günstigsten Materialien (nach Preis pro Einheit)
    SELECT material, preis_pro_einheit, lieferant
    FROM lieferungen
    ORDER BY preis_pro_einheit ASC
    LIMIT 3;
    ```

    ```{.cmd .no-copy title="Output"}
           material        | preis_pro_einheit |    lieferant
    -----------------------+-------------------+-----------------
     Muttern M8            |              0.08 | Schrauben Meyer
     Sechskantschrauben M8 |              0.15 | Schrauben Meyer
     Gummiband 10mm        |              2.30 | Kunststoff GmbH
    (3 rows)
    ```



???+ warning "LIMIT ohne ORDER BY"
    Wenn du `LIMIT` ohne `ORDER BY` verwendest, ist das Ergebnis **nicht vorhersehbar** - die Datenbank gibt irgendwelche Zeilen zurück! Verwende daher **immer ORDER BY zusammen mit LIMIT**.

### Zeilen überspringen mit `OFFSET`

Nun kann es vorkommen, dass wir nicht die ersten *N* Ergebnisse auslesen möchten, sondern erst bei einem gewissen Wert beginnend. Mit `OFFSET` können wir die ersten *N* Zeilen **überspringen** und erst ab einer bestimmten Position Ergebnisse zurückgeben.


```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle
ORDER BY sortierung
LIMIT anzahl OFFSET überspringen;
```


???+ example "Beispiel: Werte ab 3. Position auslesen"
    ```sql hl_lines="5"
    -- Überspringe die ersten 3, zeige die nächsten 3 Lieferungen (nach Datum)
    SELECT material, lieferdatum, lieferant
    FROM lieferungen
    ORDER BY lieferdatum ASC
    LIMIT 3 OFFSET 3;
    ```

    ```{.cmd .no-copy title="Output"}
         material     | lieferdatum |    lieferant
    ------------------+-------------+------------------
     Aluminiumprofile | 2024-03-18  | Aluminium AG
     Sensoren Typ A   | 2024-03-19  | Elektronik Weber
     PVC-Platten      | 2024-03-20  | Kunststoff GmbH
    (3 rows)
    ```

    **Erklärung:** Die ersten 3 Lieferungen (15., 16., 17. März) werden übersprungen, dann werden die nächsten 3 zurückgegeben.



???+ info "Paginierung"

    `LIMIT` und `OFFSET` werden häufig für **Paginierung** verwendet - z.B. wenn eine Webseite Ergebnisse seitenweise anzeigt.

    Bei sehr großen **OFFSET-Werten** (z.B. `OFFSET 10000`) kann die Performance leiden, da die Datenbank alle übersprungenen Zeilen dennoch laden und durchlaufen muss. Für große Datensätze gibt es bessere Ansätze (z.B. Cursor-basierte Paginierung).

---

## Aggregatfunktionen - Daten zusammenfassen

Bisher haben wir einzelne Datensätze abgefragt - jede Zeile wurde einzeln zurückgegeben. Manchmal interessieren uns aber **zusammengefasste Informationen** über viele Datensätze:

- **Wie viele** Lieferungen haben wir insgesamt?
- Was ist die **durchschnittliche** Menge?
- Was ist der **höchste** oder **niedrigste** Preis?
- Was ist die **Summe** aller Mengen?

Für solche **statistischen Auswertungen** verwenden wir **Aggregatfunktionen**. Sie **fassen mehrere Zeilen zu einem einzigen Ergebniswert zusammen**.

```sql { .yaml .no-copy }
SELECT funktion AS ergebnisname
FROM tabelle;
```

Neben der Funktion ist es sinnvoll einen Alias Namen für das Ergebnis der Berechnung mittels `AS` zum vergeben.



<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Funktion</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anwendungsfall</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>COUNT(*)</code></td>
        <td style="padding:10px 14px;">Zählt alle Zeilen</td>
        <td style="padding:10px 14px;">Wie viele Lieferungen gibt es?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>COUNT(spalte)</code></td>
        <td style="padding:10px 14px;">Zählt Nicht-NULL-Werte</td>
        <td style="padding:10px 14px;">Wie viele Lieferungen haben Status-Eintrag?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>SUM(spalte)</code></td>
        <td style="padding:10px 14px;">Summe aller Werte</td>
        <td style="padding:10px 14px;">Gesamtmenge aller Lieferungen?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>AVG(spalte)</code></td>
        <td style="padding:10px 14px;">Durchschnittswert</td>
        <td style="padding:10px 14px;">Durchschnittlicher Preis pro Einheit?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MIN(spalte)</code></td>
        <td style="padding:10px 14px;">Kleinster Wert</td>
        <td style="padding:10px 14px;">Günstigster Preis?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MAX(spalte)</code></td>
        <td style="padding:10px 14px;">Größter Wert</td>
        <td style="padding:10px 14px;">Teuerster Preis?</td>
    </tr>
    </tbody>
</table>
</div>

???+ example "Beispiel: Günstigster und teuerster Preis pro Einheit"

    ```sql hl_lines="3 4"
    -- Günstigster und teuerster Preis pro Einheit
    SELECT
        MIN(preis_pro_einheit) AS guenstigster_preis,
        MAX(preis_pro_einheit) AS teuerster_preis
    FROM lieferungen;
    ```

    ```{.cmd .no-copy title="Output"}
     guenstigster_preis | teuerster_preis
    --------------------+-----------------
                   0.08 |           45.00
    (1 row)
    ```

    **Erklärung:** Wir wir sehen, können wir mehrere Aggregatfunktionen in einer Abfrage kombinieren.

    ??? code "weitere Beispiele"

        **Wie viele Lieferungen gibt es insgesamt?**

        ```sql
        -- Wie viele Lieferungen gibt es insgesamt?
        SELECT COUNT(*) AS anzahl_lieferungen
        FROM lieferungen;
        ```

        ```{.cmd .no-copy title="Output"}
         anzahl_lieferungen
        --------------------
                         10
        (1 row)
        ```

        **Erklärung:** `COUNT(*)` zählt alle Zeilen in der Tabelle - unabhängig vom Inhalt.

        ---

        **Wie viele Lieferungen sind bereits geliefert?**

        ```sql
        -- Wie viele Lieferungen sind bereits geliefert?
        SELECT COUNT(*) AS anzahl_geliefert
        FROM lieferungen
        WHERE status = 'Geliefert';
        ```

        ```{.cmd .no-copy title="Output"}
         anzahl_geliefert
        ------------------
                        5
        (1 row)
        ```

        **Erklärung:** `COUNT(*)` zählt alle Zeilen in der Tabelle - unabhängig vom Inhalt. `WHERE status = 'Geliefert'` filtert die Zeilen, die den Status "Geliefert" haben.

        ---

        **Durchschnittlicher Preis pro Einheit**

        ```sql
        -- Durchschnittlicher Preis pro Einheit
        SELECT AVG(preis_pro_einheit) AS durchschnittspreis
        FROM lieferungen;
        ```

        ```{.cmd .no-copy title="Output"}
         durchschnittspreis
        ---------------------
         14.7180000000000000
        (1 row)
        ```

        **Erklärung:** `AVG()` berechnet den arithmetischen Mittelwert aller Preise pro Einheit.


        ---

        **Gesamtmenge aller Lieferungen**

        ```sql
        -- Gesamtmenge aller Lieferungen
        SELECT SUM(menge) AS gesamtmenge
        FROM lieferungen;
        ```

        ```{.cmd .no-copy title="Output"}
         gesamtmenge
        -------------
               12180
        (1 row)
        ```

        **Hinweis:** `SUM()` funktioniert nur mit numerischen Spalten (INTEGER, NUMERIC, etc.)


???+ warning "NULL-Werte werden ignoriert"
    Aggregatfunktionen (außer `COUNT(*)`) **ignorieren NULL-Werte**!

    - `COUNT(spalte)` zählt nur Nicht-NULL-Werte
    - `AVG(spalte)` berechnet den Durchschnitt nur aus vorhandenen Werten
    - `SUM(spalte)` summiert nur vorhandene Werte


---



## Gruppieren mit `GROUP BY`

Mit den Aggregatfunktionen können wir bereits einfache Analysen unseres Datensatzes durchführen. Wir können Summen bilden, Mittelwerte berechnen oder Werte zählen. Doch häufig kann es sein, dass wir diese Analysen nach gewissen Gruppen unterteilen wollen:

- Wie viele Lieferungen gibt es **pro Lieferant**?
- Was ist die durchschnittliche Menge **pro Zielstandort**?
- Wie viele Lieferungen gibt es **pro Status**?

Um diese Fragen zu beantworten, verwenden wir `GROUP BY` - es fasst Zeilen mit gleichen Werten zusammen und erlaubt **Aggregationen pro Gruppe**.

```sql { .yaml .no-copy }
SELECT gruppenspalte, aggregatfunktion(spalte)
FROM tabelle
GROUP BY gruppenspalte;
```



???+ example "Beispiel: Wie viele Lieferungen gibt es pro Lieferant?"

    ```sql hl_lines="4"
    -- Wie viele Lieferungen gibt es pro Lieferant?
    SELECT lieferant, COUNT(*) AS anzahl
    FROM lieferungen
    GROUP BY lieferant;
    ```

    ```{.cmd .no-copy title="Output"}
          lieferant       | anzahl
    ----------------------+--------
     Schrauben Meyer      |      2
     Stahlwerk Salzgitter |      2
     Elektronik Weber     |      2
     Aluminium AG         |      2
     Kunststoff GmbH      |      2
    (5 rows)
    ```

    **Erklärung:** Die Datenbank gruppiert alle Lieferungen nach `lieferant` und zählt, wie viele Lieferungen in jeder Gruppe sind.

    ??? code "weiteres Beispiel"

        **Günstigste und teuerste Lieferung pro Lieferant**

        ```sql
        -- Günstigste und teuerste Lieferung pro Lieferant
        SELECT
            lieferant,
            MIN(preis_pro_einheit) AS guenstigster,
            MAX(preis_pro_einheit) AS teuerster
        FROM lieferungen
        GROUP BY lieferant;
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       | guenstigster | teuerster
        ----------------------+--------------+-----------
         Schrauben Meyer      |         0.08 |      0.15
         Stahlwerk Salzgitter |        12.50 |     45.00
         Elektronik Weber     |        12.90 |     22.00
         Aluminium AG         |        18.50 |     25.00
         Kunststoff GmbH      |         2.30 |      8.75
        (5 rows)
        ```

Die `GROUP BY` Klausel wird fast ausschließlich in Kombination mit einer Aggregatfunktion verwendet. Prinzipiell ist es syntaktisch erlaubt ein `GROUP BY` ohne Aggregation zu verwenden - semantisch ist es aber meist sinnlos. Das Ergebnis wäre ident mit jenem von [`DISTINCT`](#eindeutige-werte-mit-distinct) - es liefert nur die einzigartigen Werte einer Spalte.

---

Spannend wird es, wenn wir **mehrere Aggregatfunktionen** gleichzeitig auf dieselbe Gruppierung anwenden. Damit können wir umfassendere Statistiken über unseren Datensatz erzeugen.

???+ example "Beispiel: Umfassende Statistik pro Zielstandort"
    ```sql hl_lines="7"
    SELECT
        zielstandort,
        COUNT(*) AS anzahl,
        SUM(menge) AS gesamtmenge,
        AVG(preis_pro_einheit) AS durchschnittspreis
    FROM lieferungen
    GROUP BY zielstandort
    ORDER BY anzahl DESC;
    ```

    ```{.cmd .no-copy title="Output"}
     zielstandort | anzahl | gesamtmenge | durchschnittspreis
    --------------+--------+-------------+---------------------
     Lager Nord   |      5 |       11450 |  4.7560000000000000
     Lager Ost    |      3 |         230 | 26.6333333333333333
     Lager Sued   |      2 |         500 | 21.7500000000000000
    (3 rows)
    ```

    **Erklärung:** Für jeden Zielstandort sehen wir die Anzahl der Lieferungen, die Gesamtmenge und den durchschnittlichen Preis pro Einheit.

---
Um unsere Analyse noch weiter zu verfeinern, können wir auch **mehreren Spalten gleichzeitig** gruppieren. Dabei wird jede einzigartige Kombination der Spaltenwerte separat aufgeführt und die entsprechenden Analysen durchgeführt.

???+ example "Beispiel: Gruppierung nach Zielstandort UND Status"
    ```sql hl_lines="6"
    SELECT
        zielstandort,
        status,
        COUNT(*) AS anzahl
    FROM lieferungen
    GROUP BY zielstandort, status
    ORDER BY anzahl DESC;
    ```

    ```{.cmd .no-copy title="Output"}
     zielstandort |   status   | anzahl
    --------------+------------+--------
     Lager Nord   | Geliefert  |      3
     Lager Nord   | In Transit |      2
     Lager Ost    | Bestellt   |      2
     Lager Ost    | Geliefert  |      1
     Lager Sued   | Bestellt   |      1
     Lager Sued   | Geliefert  |      1
    (6 rows)
    ```

    **Erklärung:** Jede Kombination aus `zielstandort` und `status` bildet eine eigene Gruppe.

---


???+ warning "SELECT-Regel für GROUP BY"
    Wenn du `GROUP BY` verwendest, dürfen **nur** 

    1. **Spalten, die in GROUP BY stehen**
    2. **Aggregatfunktionen**

    in der `SELECT` Klausel vorkommen. Dies bedeutet, dass nachfolgendes Beispiel zu einem Fehler führen würde:

    ```sql
    SELECT lieferant, material, COUNT(*) AS anzahl  -- ✗ material steht nicht in GROUP BY!
    FROM lieferungen
    GROUP BY lieferant;
    ```

    ```{.cmd .no-copy title="Output"}
    ERROR:  Spalte »lieferungen.material« muss in der GROUP-BY-Klausel erscheinen oder in einer Aggregatfunktion verwendet werden
    LINE 1: SELECT lieferant, material, COUNT(*) AS anzahl  -- ? materia...
                              ^
    ```

    **Warum?** Wenn wir nach `lieferant` gruppieren, gibt es in der Gruppe "Aluminium AG" zwei verschiedene Materialien ("Aluminiumprofile" und "Aluminiumblech 3mm"). Die Datenbank weiß nicht, welches sie anzeigen soll!

???+ info "ORDER BY mit GROUP BY"
    Nach der Gruppierung können wir das Ergebnis mit `ORDER BY` sortieren:

    ```sql
    SELECT lieferant, COUNT(*) AS anzahl
    FROM lieferungen
    GROUP BY lieferant
    ORDER BY anzahl DESC;  -- Sortiere nach Anzahl (absteigend)
    ```

    Wir können nach:

    - Der **Gruppenspalte** sortieren: `ORDER BY lieferant`
    - Einem **Aggregat-Ergebnis** sortieren: `ORDER BY anzahl DESC`

---

## Gruppen filtern mit `HAVING`

Mit `WHERE` haben wir bis jetzt **einzelne Zeilen** vor der Gruppierung filtern. Was aber, wenn wir **Gruppen nach ihrer Aggregation** filtern möchten?

Zum Beispiel:

- Welche Lieferanten haben **mehr als 100 Einheiten** geliefert?
- Welche Zielstandorte haben einen **durchschnittlichen Preis über 20 EUR**?

Hier kommt `HAVING` ins Spiel - es filtert **Gruppen nach Aggregationsergebnissen**.

```sql { .yaml .no-copy }
SELECT gruppenspalte, aggregatfunktion(spalte)
FROM tabelle
GROUP BY gruppenspalte
HAVING bedingung_für_aggregat;
```

Der Unterschied zwischen  `WHERE` und `HAVING` kann wiefolgt zusammengefasst werden

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Aspekt</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">WHERE</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">HAVING</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Filtert</strong></td>
        <td style="padding:10px 14px;">Einzelne Zeilen</td>
        <td style="padding:10px 14px;">Gruppen (nach Aggregation)</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Zeitpunkt</strong></td>
        <td style="padding:10px 14px;">Vor GROUP BY</td>
        <td style="padding:10px 14px;">Nach GROUP BY</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Kann verwenden</strong></td>
        <td style="padding:10px 14px;">Spalten, einfache Vergleiche</td>
        <td style="padding:10px 14px;">Aggregatfunktionen (COUNT, AVG, etc.)</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Beispiel</strong></td>
        <td style="padding:10px 14px;"><code>WHERE status = 'Geliefert'</code></td>
        <td style="padding:10px 14px;"><code>HAVING COUNT(*) > 2</code></td>
    </tr>
    </tbody>
</table>
</div>

???+ example "Beispiel: Zielstandorte mit durchschnittlichem Preis > 10 EUR"

    ```sql hl_lines="8"
    -- Zielstandorte mit durchschnittlichem Preis > 10 EUR
    SELECT
        zielstandort,
        AVG(preis_pro_einheit) AS durchschnittspreis,
        COUNT(*) AS anzahl
    FROM lieferungen
    GROUP BY zielstandort
    HAVING AVG(preis_pro_einheit) > 10;
    ```

    ```{.cmd .no-copy title="Output"}
     zielstandort | durchschnittspreis  | anzahl
    --------------+---------------------+--------
     Lager Ost    | 26.6333333333333333 |      3
     Lager Sued   | 21.7500000000000000 |      2
    (2 rows)
    ```

    **Erklärung:** Nur Zielstandorte, deren durchschnittlicher Preis über 10 EUR liegt, werden angezeigt.

    ??? code "weitere Beispiele"

        **Lieferanten mit mehr als 1 Lieferung**

        ```sql
        -- Lieferanten mit mehr als 1 Lieferung
        SELECT lieferant, COUNT(*) AS anzahl
        FROM lieferungen
        GROUP BY lieferant
        HAVING COUNT(*) > 1;
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant       | anzahl
        ----------------------+--------
         Schrauben Meyer      |      2
         Stahlwerk Salzgitter |      2
         Elektronik Weber     |      2
         Aluminium AG         |      2
         Kunststoff GmbH      |      2
        (5 rows)
        ```

        **Erklärung:** Erst werden die Lieferungen nach Lieferant gruppiert und gezählt. Dann werden nur die Gruppen angezeigt, die mehr als 1 Lieferung haben.

        ---

        **Zielstandorte mit mehr als 1 gelieferter Lieferung**

        ```sql
        -- Zielstandorte mit mehr als 1 gelieferter Lieferung
        SELECT zielstandort, COUNT(*) AS anzahl_geliefert
        FROM lieferungen
        WHERE status = 'Geliefert'      -- Filtert Zeilen VOR Gruppierung
        GROUP BY zielstandort
        HAVING COUNT(*) > 1;        -- Filtert Gruppen NACH Aggregation
        ```

        ```{.cmd .no-copy title="Output"}
         zielstandort | anzahl_geliefert
        --------------+------------------
         Lager Nord   |                3
        (1 row)
        ```

        **Ablauf:**

        1. `WHERE` filtert alle Zeilen → nur Lieferungen mit Status "Geliefert"
        2. `GROUP BY` gruppiert nach Zielstandort
        3. `COUNT(*)` zählt Lieferungen pro Zielstandort
        4. `HAVING` filtert Gruppen → nur Standorte mit mehr als 1 Lieferung


        ---

        **Lieferanten mit Gesamtmenge > 200 UND durchschnittlichem Preis < 20**

        ```sql
        -- Lieferanten mit Gesamtmenge > 200 UND durchschnittlichem Preis < 20
        SELECT
            lieferant,
            SUM(menge) AS gesamtmenge,
            AVG(preis_pro_einheit) AS durchschnittspreis
        FROM lieferungen
        GROUP BY lieferant
        HAVING SUM(menge) > 200 AND AVG(preis_pro_einheit) < 20;
        ```

        ```{.cmd .no-copy title="Output"}
            lieferant    | gesamtmenge |   durchschnittspreis
        -----------------+-------------+------------------------
         Schrauben Meyer |       10000 | 0.11500000000000000000
         Kunststoff GmbH |         950 |     5.5250000000000000
        (2 rows)
        ```
        
        **Erklärung:** Kombiniert mehrere HAVING-Bedingungen mit `AND` - nur Lieferanten mit Gesamtmenge > 200 UND durchschnittlichem Preis < 20.


???+ warning "HAVING ohne GROUP BY?"
    Technisch ist `HAVING` ohne `GROUP BY` erlaubt - die gesamte Tabelle wird dann als eine einzige Gruppe behandelt was in den allermeisten Fällen sinnlos ist:

    ```sql
    SELECT COUNT(*) AS anzahl
    FROM lieferungen
    HAVING COUNT(*) > 5;
    ```

---

## Eindeutige Werte mit `DISTINCT`

Manchmal möchten wir wissen, welche **verschiedenen Werte** in einer Spalte vorkommen - ohne Duplikate. Zum Beispiel: *Welche verschiedenen Lieferanten gibt es?*

Dafür verwenden wir **DISTINCT** - es entfernt Duplikate und zeigt jeden Wert nur **einmal**.

```sql { .yaml .no-copy }
SELECT DISTINCT spalte
FROM tabelle;
```

???+ example "Beispiel: Welche verschiedenen Lieferanten gibt es?"
    ```sql hl_lines="2"
    -- Welche verschiedenen Lieferanten gibt es?
    SELECT DISTINCT lieferant
    FROM lieferungen;
    ```

    ```{.cmd .no-copy title="Output"}
          lieferant
    ----------------------
     Schrauben Meyer
     Stahlwerk Salzgitter
     Elektronik Weber
     Aluminium AG
     Kunststoff GmbH
    (5 rows)
    ```

    **Erklärung:** Obwohl es 10 Lieferungen gibt, werden nur die 5 verschiedenen Lieferanten angezeigt (ohne Wiederholungen).

    ??? code "weitere Beispiele"

        **Welche einzigartigen Kombinationen von Zielstandort und Status gibt es?**

        ```sql
        -- Welche einzigartigen Kombinationen von Zielstandort und Status gibt es?
        SELECT DISTINCT zielstandort, status
        FROM lieferungen
        ORDER BY zielstandort, status;
        ```

        ```{.cmd .no-copy title="Output"}
         zielstandort |   status
        --------------+------------
         Lager Nord   | Geliefert
         Lager Nord   | In Transit
         Lager Ost    | Bestellt
         Lager Ost    | Geliefert
         Lager Sued   | Bestellt
         Lager Sued   | Geliefert
        (6 rows)
        ```

        **Erklärung:** `DISTINCT` arbeitet hier auf der **Kombination** beider Spalten - jede einzigartige Kombination wird nur einmal angezeigt.

        ---

        **Alle Zielstandorte alphabetisch sortiert**

        ```sql
        -- Alle Zielstandorte alphabetisch sortiert
        SELECT DISTINCT zielstandort
        FROM lieferungen
        ORDER BY zielstandort;
        ```

        ```{.cmd .no-copy title="Output"}
         zielstandort
        --------------
         Lager Nord
         Lager Ost
         Lager Sued
        (3 rows)
        ```

        **Erklärung:** `DISTINCT` kann mit `ORDER BY` kombiniert werden, um die eindeutigen Werte sortiert auszugeben.

        ---

        **Welche Lieferanten haben bereits geliefert?**

        ```sql
        -- Welche Lieferanten haben bereits geliefert?
        SELECT DISTINCT lieferant
        FROM lieferungen
        WHERE status = 'Geliefert';
        ```

        ```{.cmd .no-copy title="Output"}
              lieferant
        ----------------------
         Aluminium AG
         Elektronik Weber
         Schrauben Meyer
         Stahlwerk Salzgitter
        (4 rows)
        ```

        **Erklärung:** Erst werden die Zeilen mit `WHERE` gefiltert, dann werden die eindeutigen Lieferanten ermittelt.



???+ warning "Performance-Hinweis"
    `DISTINCT` kann bei großen Tabellen **langsam** sein, da die Datenbank alle Zeilen verarbeiten und Duplikate entfernen muss. Wenn möglich, kombiniere es mit `WHERE`, um die Datenmenge vorher zu reduzieren:

    ```sql
    -- Besser: Erst filtern, dann DISTINCT
    SELECT DISTINCT lieferant
    FROM lieferungen
    WHERE preis_pro_einheit > 10;  -- Reduziert Datenmenge
    ```

---

## Übung ✍️

Nun ist es an der Zeit, unser erlerntes Wissen auf unser Gesamtprojekt anzuwenden! In diesem Kapitel erweitern wir das **Produktionsplanungssystem für TecGuy GmbH**.

Im vorherigen Kapitel haben wir die Datenbank `produktionsplanung_db` und die Tabelle `produktionsauftraege` erstellt. 

??? info "Datenbankstand aus dem vorherigen Kapitel"

    Falls du die Datenbank noch nicht hast, führe folgenden Code aus:

    ```sql
    -- Datenbank erstellen
    CREATE DATABASE produktionsplanung_db;

    -- Zur Datenbank wechseln
    \c produktionsplanung_db

    -- Tabelle erstellen
    CREATE TABLE produktionsauftraege (
        auftrag_id INTEGER PRIMARY KEY,
        auftragsnummer VARCHAR(20),
        kunde VARCHAR(100),
        produkt VARCHAR(100),
        menge INTEGER,
        lieferdatum DATE,
        status VARCHAR(20)
    );

    -- Daten einfügen
    INSERT INTO produktionsauftraege VALUES
    (1, 'AUF-2024-001', 'BMW AG', 'Getriebegehäuse', 500, '2024-04-15', 'In Produktion'),
    (2, 'AUF-2024-002', 'Audi AG', 'Kurbelwelle', 200, '2024-04-20', 'Geplant'),
    (3, 'AUF-2024-003', 'Mercedes-Benz', 'Pleuelstange', 350, '2024-04-18', 'In Produktion'),
    (4, 'AUF-2024-004', 'Porsche AG', 'Kolben', 150, '2024-04-25', 'Geplant');
    ```


Wir erweitern nun unsere Tabelle mit zusätzlichen Produktionsaufträgen, um unsere Analysen aussagekräftiger zu machen:

```sql
-- Weitere Produktionsaufträge hinzufügen
INSERT INTO produktionsauftraege VALUES
(5, 'AUF-2024-005', 'BMW AG', 'Kurbelwelle', 300, '2024-04-22', 'In Produktion'),
(6, 'AUF-2024-006', 'Volkswagen AG', 'Kolben', 400, '2024-04-28', 'Geplant'),
(7, 'AUF-2024-007', 'Mercedes-Benz', 'Getriebegehäuse', 250, '2024-04-30', 'Abgeschlossen'),
(8, 'AUF-2024-008', 'Audi AG', 'Pleuelstange', 180, '2024-04-16', 'Abgeschlossen'),
(9, 'AUF-2024-009', 'Porsche AG', 'Kurbelwelle', 120, '2024-05-05', 'Geplant'),
(10, 'AUF-2024-010', 'BMW AG', 'Kolben', 350, '2024-04-19', 'In Produktion');
```

---

???+ question "Aufgabe 1: Einfache Abfragen mit WHERE"

    1. Zeige alle Aufträge von **BMW AG**
    2. Zeige alle Aufträge mit Status **"In Produktion"**
    3. Zeige alle Aufträge mit einer Menge **größer als 200**
    4. Zeige alle Aufträge für das Produkt **"Kolben"**

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. Alle Aufträge von BMW AG
        SELECT * FROM produktionsauftraege
        WHERE kunde = 'BMW AG';
        ```

        ```title="Output"
         auftrag_id | auftragsnummer |  kunde  |     produkt      | menge | lieferdatum |    status
        ------------+----------------+---------+------------------+-------+-------------+---------------
                  1 | AUF-2024-001   | BMW AG  | Getriebegehäuse  |   500 | 2024-04-15  | In Produktion
                  5 | AUF-2024-005   | BMW AG  | Kurbelwelle      |   300 | 2024-04-22  | In Produktion
                 10 | AUF-2024-010   | BMW AG  | Kolben           |   350 | 2024-04-19  | In Produktion
        (3 rows)
        ```

        ```sql
        -- 2. Alle Aufträge mit Status "In Produktion"
        SELECT auftragsnummer, kunde, produkt, status
        FROM produktionsauftraege
        WHERE status = 'In Produktion';
        ```

        ```sql
        -- 3. Alle Aufträge mit Menge > 200
        SELECT auftragsnummer, kunde, produkt, menge
        FROM produktionsauftraege
        WHERE menge > 200;
        ```

        ```sql
        -- 4. Alle Aufträge für "Kolben"
        SELECT auftragsnummer, kunde, menge, lieferdatum
        FROM produktionsauftraege
        WHERE produkt = 'Kolben';
        ```

---

???+ question "Aufgabe 2: Verknüpfte Bedingungen"

    1. Zeige alle Aufträge von **BMW AG**, die **in Produktion** sind
    2. Zeige alle Aufträge mit **Lieferdatum zwischen** dem **15. und 20. April**
    3. Zeige alle Aufträge von **BMW AG, Audi AG oder Mercedes-Benz**
    4. Zeige alle Aufträge, die **nicht** den Status **"Geplant"** haben

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. BMW AG Aufträge in Produktion
        SELECT auftragsnummer, produkt, status
        FROM produktionsauftraege
        WHERE kunde = 'BMW AG' AND status = 'In Produktion';
        ```

        ```title="Output"
         auftragsnummer |     produkt      |    status
        ----------------+------------------+---------------
         AUF-2024-001   | Getriebegehäuse  | In Produktion
         AUF-2024-005   | Kurbelwelle      | In Produktion
         AUF-2024-010   | Kolben           | In Produktion
        (3 rows)
        ```

        ```sql
        -- 2. Lieferdatum zwischen 15. und 20. April
        SELECT auftragsnummer, kunde, produkt, lieferdatum
        FROM produktionsauftraege
        WHERE lieferdatum BETWEEN '2024-04-15' AND '2024-04-20';
        ```

        ```sql
        -- 3. Aufträge von bestimmten Kunden (mit IN)
        SELECT kunde, produkt, menge
        FROM produktionsauftraege
        WHERE kunde IN ('BMW AG', 'Audi AG', 'Mercedes-Benz');
        ```

        ```sql
        -- 4. Alle außer "Geplant"
        SELECT auftragsnummer, kunde, produkt, status
        FROM produktionsauftraege
        WHERE NOT status = 'Geplant';
        -- Alternativ:
        WHERE status != 'Geplant';
        ```

---

???+ question "Aufgabe 3: Sortierung und Begrenzung"

    1. Sortiere alle Aufträge nach **Lieferdatum** (früheste zuerst)
    2. Zeige die **3 größten Aufträge** (nach Menge)
    3. Sortiere alle Aufträge erst nach **Kunde** (A-Z), dann nach **Menge** (größte zuerst)
    4. Zeige die Aufträge 4-6, wenn nach **Lieferdatum** sortiert (verwende OFFSET)

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. Nach Lieferdatum sortieren (früheste zuerst)
        SELECT auftragsnummer, kunde, produkt, lieferdatum
        FROM produktionsauftraege
        ORDER BY lieferdatum ASC;
        ```

        ```title="Output"
         auftragsnummer |     kunde      |     produkt      | lieferdatum
        ----------------+----------------+------------------+-------------
         AUF-2024-001   | BMW AG         | Getriebegehäuse  | 2024-04-15
         AUF-2024-008   | Audi AG        | Pleuelstange     | 2024-04-16
         AUF-2024-003   | Mercedes-Benz  | Pleuelstange     | 2024-04-18
         AUF-2024-010   | BMW AG         | Kolben           | 2024-04-19
         AUF-2024-002   | Audi AG        | Kurbelwelle      | 2024-04-20
         ...
        (10 rows)
        ```

        ```sql
        -- 2. Die 3 größten Aufträge
        SELECT auftragsnummer, kunde, produkt, menge
        FROM produktionsauftraege
        ORDER BY menge DESC
        LIMIT 3;
        ```

        ```title="Output"
         auftragsnummer |  kunde  |     produkt      | menge
        ----------------+---------+------------------+-------
         AUF-2024-001   | BMW AG  | Getriebegehäuse  |   500
         AUF-2024-006   | VW AG   | Kolben           |   400
         AUF-2024-010   | BMW AG  | Kolben           |   350
        (3 rows)
        ```

        ```sql
        -- 3. Nach Kunde, dann nach Menge
        SELECT kunde, produkt, menge
        FROM produktionsauftraege
        ORDER BY kunde ASC, menge DESC;
        ```

        ```sql
        -- 4. Aufträge 4-6 (nach Lieferdatum)
        SELECT auftragsnummer, kunde, produkt, lieferdatum
        FROM produktionsauftraege
        ORDER BY lieferdatum ASC
        LIMIT 3 OFFSET 3;
        ```

---

???+ question "Aufgabe 4: Aggregationen und Statistiken"

    1. **Wie viele** Produktionsaufträge gibt es insgesamt?
    2. Was ist die **Gesamtmenge** aller Aufträge?
    3. Was ist die **durchschnittliche Menge** pro Auftrag?
    4. Was ist die **kleinste** und **größte** Menge in einem Auftrag?

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. Anzahl aller Aufträge
        SELECT COUNT(*) AS anzahl_auftraege
        FROM produktionsauftraege;
        ```

        ```title="Output"
         anzahl_auftraege
        ------------------
                       10
        (1 row)
        ```

        ```sql
        -- 2. Gesamtmenge aller Aufträge
        SELECT SUM(menge) AS gesamtmenge
        FROM produktionsauftraege;
        ```

        ```title="Output"
         gesamtmenge
        -------------
                2800
        (1 row)
        ```

        ```sql
        -- 3. Durchschnittliche Menge
        SELECT AVG(menge) AS durchschnittliche_menge
        FROM produktionsauftraege;
        ```

        ```title="Output"
         durchschnittliche_menge
        -------------------------
         280.0000000000000000
        (1 row)
        ```

        ```sql
        -- 4. Kleinste und größte Menge
        SELECT
            MIN(menge) AS kleinste_menge,
            MAX(menge) AS groesste_menge
        FROM produktionsauftraege;
        ```

        ```title="Output"
         kleinste_menge | groesste_menge
        ----------------+----------------
                    120 |            500
        (1 row)
        ```

---

???+ question "Aufgabe 5: Gruppierungen und Analysen"

    1. Wie viele Aufträge gibt es **pro Kunde**?
    2. Was ist die **Gesamtmenge pro Produkt**?
    3. Wie viele Aufträge gibt es **pro Status**?
    4. Was ist die **durchschnittliche Menge pro Kunde**?

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. Anzahl Aufträge pro Kunde
        SELECT kunde, COUNT(*) AS anzahl_auftraege
        FROM produktionsauftraege
        GROUP BY kunde
        ORDER BY anzahl_auftraege DESC;
        ```

        ```title="Output"
             kunde      | anzahl_auftraege
        ----------------+------------------
         BMW AG         |                3
         Audi AG        |                2
         Mercedes-Benz  |                2
         Porsche AG     |                2
         Volkswagen AG  |                1
        (5 rows)
        ```

        ```sql
        -- 2. Gesamtmenge pro Produkt
        SELECT produkt, SUM(menge) AS gesamtmenge
        FROM produktionsauftraege
        GROUP BY produkt
        ORDER BY gesamtmenge DESC;
        ```

        ```title="Output"
             produkt      | gesamtmenge
        ------------------+-------------
         Kolben           |         900
         Getriebegehäuse  |         750
         Kurbelwelle      |         620
         Pleuelstange     |         530
        (4 rows)
        ```

        ```sql
        -- 3. Anzahl Aufträge pro Status
        SELECT status, COUNT(*) AS anzahl
        FROM produktionsauftraege
        GROUP BY status
        ORDER BY anzahl DESC;
        ```

        ```title="Output"
            status      | anzahl
        ----------------+--------
         In Produktion  |      4
         Geplant        |      4
         Abgeschlossen  |      2
        (3 rows)
        ```

        ```sql
        -- 4. Durchschnittliche Menge pro Kunde
        SELECT
            kunde,
            AVG(menge) AS durchschnittliche_menge,
            COUNT(*) AS anzahl_auftraege
        FROM produktionsauftraege
        GROUP BY kunde
        ORDER BY durchschnittliche_menge DESC;
        ```

        ```title="Output"
             kunde      | durchschnittliche_menge | anzahl_auftraege
        ----------------+-------------------------+------------------
         Volkswagen AG  |    400.0000000000000000 |                1
         BMW AG         |    383.3333333333333333 |                3
         Mercedes-Benz  |    300.0000000000000000 |                2
         Audi AG        |    190.0000000000000000 |                2
         Porsche AG     |    135.0000000000000000 |                2
        (5 rows)
        ```

---

???+ question "Aufgabe 6: Erweiterte Analysen mit HAVING"

    1. Welche **Kunden** haben mehr als **2 Aufträge**?
    2. Welche **Produkte** haben eine **Gesamtmenge über 600**?
    3. Welche **Kunden** haben eine **durchschnittliche Menge über 250**?
    4. Welche **Produkte** haben mehr als **1 Auftrag** UND eine **Gesamtmenge über 700**?

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. Kunden mit mehr als 2 Aufträgen
        SELECT kunde, COUNT(*) AS anzahl_auftraege
        FROM produktionsauftraege
        GROUP BY kunde
        HAVING COUNT(*) > 2;
        ```

        ```title="Output"
          kunde  | anzahl_auftraege
        ---------+------------------
         BMW AG  |                3
        (1 row)
        ```

        ```sql
        -- 2. Produkte mit Gesamtmenge > 600
        SELECT produkt, SUM(menge) AS gesamtmenge
        FROM produktionsauftraege
        GROUP BY produkt
        HAVING SUM(menge) > 600;
        ```

        ```title="Output"
             produkt      | gesamtmenge
        ------------------+-------------
         Kolben           |         900
         Getriebegehäuse  |         750
         Kurbelwelle      |         620
        (3 rows)
        ```

        ```sql
        -- 3. Kunden mit durchschnittlicher Menge > 250
        SELECT
            kunde,
            AVG(menge) AS durchschnittliche_menge,
            COUNT(*) AS anzahl_auftraege
        FROM produktionsauftraege
        GROUP BY kunde
        HAVING AVG(menge) > 250
        ORDER BY durchschnittliche_menge DESC;
        ```

        ```title="Output"
             kunde      | durchschnittliche_menge | anzahl_auftraege
        ----------------+-------------------------+------------------
         Volkswagen AG  |    400.0000000000000000 |                1
         BMW AG         |    383.3333333333333333 |                3
         Mercedes-Benz  |    300.0000000000000000 |                2
        (3 rows)
        ```

        ```sql
        -- 4. Produkte mit > 1 Auftrag UND Gesamtmenge > 700
        SELECT
            produkt,
            COUNT(*) AS anzahl_auftraege,
            SUM(menge) AS gesamtmenge
        FROM produktionsauftraege
        GROUP BY produkt
        HAVING COUNT(*) > 1 AND SUM(menge) > 700
        ORDER BY gesamtmenge DESC;
        ```

        ```title="Output"
          produkt  | anzahl_auftraege | gesamtmenge
        -----------+------------------+-------------
         Kolben    |                3 |         900
        (1 row)
        ```

---

???+ question "Aufgabe 7: Komplexe Abfragen (Kombinationen)"

    1. Zeige alle **BMW AG Aufträge**, die **in Produktion** sind, **sortiert nach Lieferdatum**
    2. Zeige die **Top 3 Kunden** nach **Gesamtmenge** (absteigend)
    3. Wie viele Aufträge haben **Status "In Produktion"** pro **Produkt**?
    4. Welche Kunden haben **nur geliefert** (Status "Abgeschlossen")?

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. BMW AG Aufträge in Produktion, nach Lieferdatum
        SELECT auftragsnummer, produkt, menge, lieferdatum
        FROM produktionsauftraege
        WHERE kunde = 'BMW AG' AND status = 'In Produktion'
        ORDER BY lieferdatum ASC;
        ```

        ```title="Output"
         auftragsnummer |     produkt      | menge | lieferdatum
        ----------------+------------------+-------+-------------
         AUF-2024-001   | Getriebegehäuse  |   500 | 2024-04-15
         AUF-2024-010   | Kolben           |   350 | 2024-04-19
         AUF-2024-005   | Kurbelwelle      |   300 | 2024-04-22
        (3 rows)
        ```

        ```sql
        -- 2. Top 3 Kunden nach Gesamtmenge
        SELECT kunde, SUM(menge) AS gesamtmenge
        FROM produktionsauftraege
        GROUP BY kunde
        ORDER BY gesamtmenge DESC
        LIMIT 3;
        ```

        ```title="Output"
           kunde    | gesamtmenge
        ------------+-------------
         BMW AG     |        1150
         Mercedes-Benz|       600
         Volkswagen AG|        400
        (3 rows)
        ```

        ```sql
        -- 3. Aufträge "In Produktion" pro Produkt
        SELECT produkt, COUNT(*) AS anzahl_in_produktion
        FROM produktionsauftraege
        WHERE status = 'In Produktion'
        GROUP BY produkt
        ORDER BY anzahl_in_produktion DESC;
        ```

        ```title="Output"
             produkt      | anzahl_in_produktion
        ------------------+----------------------
         BMW AG           |                    3
         Pleuelstange     |                    1
        (2 rows)
        ```

        ```sql
        -- 4. Kunden mit nur abgeschlossenen Aufträgen
        SELECT kunde, COUNT(*) AS anzahl_abgeschlossen
        FROM produktionsauftraege
        WHERE status = 'Abgeschlossen'
        GROUP BY kunde;
        ```

        ```title="Output"
             kunde      | anzahl_abgeschlossen
        ----------------+----------------------
         Mercedes-Benz  |                    1
         Audi AG        |                    1
        (2 rows)
        ```

---

## Zusammenfassung 📌

- **WHERE** filtert Zeilen nach Bedingungen (`=`, `!=`, `>`, `<`, `>=`, `<=`)
- **AND**, **OR**, **NOT** kombinieren Bedingungen
- **BETWEEN** prüft Wertebereiche, **IN** prüft gegen eine Liste
- **LIKE** ermöglicht Mustersuche (`%` und `_` als Platzhalter)
- **ORDER BY** sortiert Ergebnisse (ASC aufsteigend, DESC absteigend)
- **LIMIT** begrenzt die Anzahl der Ergebnisse, **OFFSET** überspringt Zeilen
- **Aggregatfunktionen** (COUNT, SUM, AVG, MIN, MAX) fassen Daten zusammen
- **GROUP BY** gruppiert Zeilen für Aggregationen
- **HAVING** filtert Gruppen (ähnlich wie WHERE, aber für Gruppen)
- **DISTINCT** entfernt Duplikate

---

Im nächsten Kapitel werden wir lernen, wie man Daten **verändert** (INSERT, UPDATE, DELETE) und unser Produktionsplanungssystem weiter ausbauen!


<div style="text-align: center;">
    <img src="https://i.imgflip.com/abrhqj.jpg" alt="SQL Queries" style="max-width: 70%;">
    <figcaption>Quelle: <a href="https://i.imgflip.com/abrhqj.jpg">imgflip</a></figcaption>
</div>
