# Daten abfragen mit SQL

Im vorherigen Kapitel haben wir gelernt, wie man Tabellen erstellt, Daten einfügt und Daten auch einfach ausliest. Jetzt gehen wir einen Schritt weiter: Wir lernen, wie man **gezielt nach Daten sucht, sie filtert, sortiert und analysiert** - die Herzstück jeder Datenbank!

SQL ist eine **deklarative Sprache**: Wir beschreiben, **was** wir haben möchten, nicht **wie** die Datenbank es finden soll. Das macht SQL mächtig und gleichzeitig einfach zu lernen.

---

## Die Grundstruktur von `SELECT`

Im vorigen Kapitel haben wir bereits den `SELECT` Befehl kennengelernt. Doch neben dieser einfachen gezeigten Abfrage können wir auch noch mehr damit machen. Eine SELECT-Abfrage hat folgende Grundstruktur:

```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle
WHERE bedingung
ORDER BY sortierung;
```

**Übersetzt bedeutet das:**

> "Wähle diese **Spalten** aus dieser **Tabelle**, aber nur die Zeilen, die diese **Bedingung** erfüllen, und sortiere das Ergebnis nach dieser **Sortierung**."

Wir werden uns dies nun Schritt für Schritt ansehen. 

---

???+ info "Beispieldaten"

    Für die nachfolgenden Beispiele verwenden wir unsere `maschinen` Tabelle und erweitern sie:

    ```sql
    INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
    VALUES
        (1, 'CNC-Fräse Alpha', 'CNC-Fräse', 'Halle A', 2019, 'Aktiv'),
        (2, 'Drehbank Beta', 'Drehbank', 'Halle A', 2021, 'Aktiv'),
        (3, 'Schweißroboter Gamma', 'Schweißroboter', 'Halle B', 2020, 'Wartung'),
        (4, 'Lackieranlage Delta', 'Lackieranlage', 'Halle C', 2018, 'Aktiv'),
        (5, 'CNC-Fräse Epsilon', 'CNC-Fräse', 'Halle A', 2022, 'Aktiv'),
        (6, 'Drehbank Zeta', 'Drehbank', 'Halle B', 2017, 'Defekt'),
        (7, 'Schweißroboter Eta', 'Schweißroboter', 'Halle B', 2020, 'Aktiv'),
        (8, 'Stanzmaschine Theta', 'Stanzmaschine', 'Halle A', 2023, 'Aktiv');
    ```

    **Achtung**: Sollten sie bereits Daten in 'maschinen' enthalten haben mit dem gleichen Primärschlüssel, wird es ihnen eine Fehlermeldung zurückgeben. Wenn die ersten vier Zeilen also bereits enthalten sind, lassen sie diese hier einfach weg. 

---

## Filtern mit `WHERE`

Bislang haben wir bei der Abfrage von Daten entweder alles abgefragt (`*`) oder gewisse Spalten ausgewählt. Welche Zeilen / Tuples aber geladen werden sollen, haben wir bisher nicht eingrenzt. Daher wurden zuvor alle Zeilen geladen. 

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
        <td style="padding:10px 14px;"><code>status = 'Aktiv'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>!=</code> oder <code>&lt;&gt;</code></td>
        <td style="padding:10px 14px;">Ungleich</td>
        <td style="padding:10px 14px;"><code>status != 'Defekt'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&gt;</code></td>
        <td style="padding:10px 14px;">Größer als</td>
        <td style="padding:10px 14px;"><code>anschaffungsjahr &gt; 2020</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&lt;</code></td>
        <td style="padding:10px 14px;">Kleiner als</td>
        <td style="padding:10px 14px;"><code>anschaffungsjahr &lt; 2019</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&gt;=</code></td>
        <td style="padding:10px 14px;">Größer oder gleich</td>
        <td style="padding:10px 14px;"><code>anschaffungsjahr &gt;= 2020</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>&lt;=</code></td>
        <td style="padding:10px 14px;">Kleiner oder gleich</td>
        <td style="padding:10px 14px;"><code>anschaffungsjahr &lt;= 2019</code></td>
    </tr>
    </tbody>
</table>
</div>

Mit diesen Vergleichsoperatoren können wir nun Filter-Bedingungen für die Abfrage der Daten festlegen.


???+ example "Beispiel"
    ```sql
    -- Alle CNC-Fräsen
    SELECT * FROM maschinen
    WHERE typ = 'CNC-Fräse';
    ```

    ```title="Output"
        maschinen_id |       name        |    typ    | standort | anschaffungsjahr | status
    --------------+-------------------+-----------+----------+------------------+--------
                1 | CNC-Fräse Alpha   | CNC-Fräse | Halle A  |             2019 | Aktiv
                5 | CNC-Fräse Epsilon | CNC-Fräse | Halle A  |             2022 | Aktiv
    (2 rows)
    ```

    ??? code "weitere Beispiele"
        ```sql
        -- Maschinen ab Anschaffungsjahr 2020
        SELECT name, typ, anschaffungsjahr
        FROM maschinen
        WHERE anschaffungsjahr >= 2020;
        ```

        ```sql
        -- Alle außer Maschinen in Halle A
        SELECT name, typ, standort
        FROM maschinen
        WHERE standort != 'Halle A';
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
        <td style="padding:10px 14px;"><code>typ = 'CNC-Fräse' AND standort = 'Halle A'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>OR</code></td>
        <td style="padding:10px 14px;">Mindestens eine Bedingung muss erfüllt sein</td>
        <td style="padding:10px 14px;"><code>status = 'Wartung' OR status = 'Defekt'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>NOT</code></td>
        <td style="padding:10px 14px;">Negiert eine Bedingung</td>
        <td style="padding:10px 14px;"><code>NOT status = 'Aktiv'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>IN</code></td>
        <td style="padding:10px 14px;">Prüft, ob Wert in einer Liste enthalten ist</td>
        <td style="padding:10px 14px;"><code>typ IN ('CNC-Fräse', 'Drehbank')</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>BETWEEN</code></td>
        <td style="padding:10px 14px;">Prüft, ob Wert in einem Bereich liegt (inklusiv)</td>
        <td style="padding:10px 14px;"><code>anschaffungsjahr BETWEEN 2018 AND 2020</code></td>
    </tr>
    </tbody>
</table>
</div>


???+ info "Inklusive"
    `BETWEEN` ist inklusive - beide Grenzen sind mit eingeschlossen 


<div class="grid cards" markdown>

-   __AND__

    ---


    ???+ example "Beispiel"
        ```sql
        -- CNC-Fräsen in Halle A
        SELECT name, typ, standort
        FROM maschinen
        WHERE typ = 'CNC-Fräse' AND standort = 'Halle A';
        ```

        ```title="Output"
              name        |    typ    | standort
        ------------------+-----------+----------
        CNC-Fräse Alpha   | CNC-Fräse | Halle A
        CNC-Fräse Epsilon | CNC-Fräse | Halle A
        (2 rows)
        ```


-   __OR__

    ---
    
    ???+ example "Beispiel"
        ```sql
        -- Maschinen die in Wartung oder Defekt sind
        SELECT name, typ, status
        FROM maschinen
        WHERE status = 'Wartung' OR status = 'Defekt';
        ```

        ```title="Output"
                name         |      typ       | status
        ---------------------+----------------+---------
        Schweißroboter Gamma | Schweißroboter | Wartung
        Drehbank Zeta        | Drehbank       | Defekt
        (2 rows)
        ```

-   __NOT__

    ---


    ???+ example "Beispiel"
        ```sql
        -- Alle außer aktive Maschinen
        SELECT name, typ, status
        FROM maschinen
        WHERE NOT status = 'Aktiv';
        ```

        ```title="Output"
                name         |      typ       | status
        ---------------------+----------------+---------
        Schweißroboter Gamma | Schweißroboter | Wartung
        Drehbank Zeta        | Drehbank       | Defekt
        (2 rows)
        ```


-   __BETWEEN__

    ---
    
    ???+ example "Beispiel"
        ```sql
        -- Maschinen aus den Jahren 2018 bis 2020
        SELECT name, typ, anschaffungsjahr
        FROM maschinen
        WHERE anschaffungsjahr BETWEEN 2018 AND 2020;
        ```

        ```title="Output"
                name         |      typ       | anschaffungsjahr
        ---------------------+----------------+------------------
        CNC-Fräse Alpha      | CNC-Fräse      |             2019
        Schweißroboter Gamma | Schweißroboter |             2020
        Lackieranlage Delta  | Lackieranlage  |             2018
        Schweißroboter Eta   | Schweißroboter |             2020
        (4 rows)
        ```

    

-   __IN__

    ---
    
    ???+ example "Beispiel"
        ```sql
        -- Maschinen bestimmter Typen
        SELECT name, typ, standort
        FROM maschinen
        WHERE typ IN ('CNC-Fräse', 'Drehbank');
        ```

        Das ist äquivalent zu:

        ```sql
        WHERE typ = 'CNC-Fräse' OR typ = 'Drehbank'
        ```

        ```title="Output"
              name        |    typ    | standort
        ------------------+-----------+----------
        CNC-Fräse Alpha   | CNC-Fräse | Halle A
        Drehbank Beta     | Drehbank  | Halle A
        CNC-Fräse Epsilon | CNC-Fräse | Halle A
        Drehbank Zeta     | Drehbank  | Halle B
        (4 rows)
        ```
</div>


---

### Muster mit `LIKE`

Oft wissen wir nicht genau, nach welchem exakten Wert wir suchen. Zum Beispiel:

- "Alle Maschinen, deren Name mit 'CNC' beginnt"
- "Alle Maschinen, die 'roboter' im Namen haben"
- "Alle Maschinen mit einem Namen der Länge 5"

Für solche **Mustersuchen** verwenden wir den **LIKE-Operator** zusammen mit **Platzhaltern**.

**Platzhalter**

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
        <td style="padding:10px 14px;"><code>'CNC%'</code> findet "CNC-Fräse", "CNC123", "CNC"</td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>_</code></td>
        <td style="padding:10px 14px;">Steht für genau ein beliebiges Zeichen</td>
        <td style="padding:10px 14px;"><code>'M__1'</code> findet "M001", "MA01", "MX21"</td>
    </tr>
    </tbody>
</table>
</div>

**Häufige LIKE-Muster**

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
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE 'CNC%'</code></td>
        <td style="padding:10px 14px;">Beginnt mit "CNC"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '%roboter%'</code></td>
        <td style="padding:10px 14px;">Enthält "roboter" irgendwo im Text</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '%Beta'</code></td>
        <td style="padding:10px 14px;">Endet mit "Beta"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '_a%'</code></td>
        <td style="padding:10px 14px;">Das zweite Zeichen ist "a"</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE '____'</code></td>
        <td style="padding:10px 14px;">Genau 4 Zeichen lang</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LIKE 'M___%'</code></td>
        <td style="padding:10px 14px;">Beginnt mit "M" und hat mindestens 4 Zeichen</td>
    </tr>
    </tbody>
</table>
</div>


<div class="grid cards" markdown>

-   __Beginnt mit...__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Alle Maschinen deren Name mit 'CNC' beginnt
        SELECT name, typ
        FROM maschinen
        WHERE name LIKE 'CNC%';
        ```

        ```title="Output"
              name        |    typ
        ------------------+-----------
        CNC-Fräse Alpha   | CNC-Fräse
        CNC-Fräse Epsilon | CNC-Fräse
        (2 rows)
        ```

-   __Enthält...__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Alle Maschinen mit 'roboter' im Namen (Groß-/Kleinschreibung beachten!)
        SELECT name, typ
        FROM maschinen
        WHERE name LIKE '%roboter%';
        ```

        ```title="Output"
                name         |      typ
        ---------------------+----------------
        Schweißroboter Gamma | Schweißroboter
        Schweißroboter Eta   | Schweißroboter
        (2 rows)
        ```

-   __Endet mit...__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Alle Maschinen deren Name mit 'Beta' endet
        SELECT name, typ
        FROM maschinen
        WHERE name LIKE '%Beta';
        ```

        ```title="Output"
            name      |   typ
        --------------+----------
        Drehbank Beta | Drehbank
        (1 row)
        ```

-   __Genaue Länge__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Maschinennamen mit genau 5 Zeichen
        SELECT name, status
        FROM maschinen
        WHERE status LIKE '_____';  -- 5 Unterstriche
        ```

        ```title="Output"
               name         | status
        --------------------+--------
        CNC-Fräse Alpha     | Aktiv
        Drehbank Beta       | Aktiv
        Lackieranlage Delta | Aktiv
        CNC-Fräse Epsilon   | Aktiv
        Schweißroboter Eta  | Aktiv
        Stanzmaschine Theta | Aktiv
        (6 rows)
        ```

</div>

???+ warning "Groß-/Kleinschreibung"
    **LIKE** ist in PostgreSQL standardmäßig **case-sensitive** (unterscheidet Groß-/Kleinschreibung)!

    - `LIKE 'cnc%'` findet NICHT "CNC-Fräse"
    - `LIKE 'CNC%'` findet "CNC-Fräse"

    Für **case-insensitive** Suche verwende **ILIKE**:
    ```sql
    SELECT name FROM maschinen WHERE name ILIKE 'cnc%';  -- findet "CNC-Fräse"
    ```

---

## Sortieren mit `ORDER BY`

Standardmäßig werden Abfrageergebnisse in **keiner bestimmten Reihenfolge** zurückgegeben - die Datenbank entscheidet selbst, wie sie die Daten ausgibt. Wenn wir eine **definierte Sortierung** benötigen (z.B. alphabetisch, nach Datum, nach Zahlen), verwenden wir **ORDER BY**.

Mit **ORDER BY** können wir Ergebnisse nach einer oder mehreren Spalten sortieren - sowohl **aufsteigend** (A→Z, 0→9, alt→neu) als auch **absteigend** (Z→A, 9→0, neu→alt). Der grundlegende Syntax lautet wiefolgt: 

```sql { .yaml .no-copy }
SELECT * 
FROM tabellenname
ORDER BY attribut ASC; -- oder DESC
```


**Sortierrichtungen**

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
        <td style="padding:10px 14px;">A→Z, 0→9, 2018→2024</td>
    </tr>
    <tr>
        <td style="background:#00948511; text-align:center; padding:10px 14px;"><code>DESC</code></td>
        <td style="padding:10px 14px;">Absteigend (descending)</td>
        <td style="padding:10px 14px;">Z→A, 9→0, 2024→2018</td>
    </tr>
    </tbody>
</table>
</div>


<div class="grid cards" markdown>

-   __Aufsteigend (A-Z)__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Nach Name sortiert (A-Z)
        SELECT name, typ
        FROM maschinen
        ORDER BY name;  -- ASC ist Standard und kann weggelassen werden
        ```

        ```title="Output"
                 name         |      typ
        ----------------------+----------------
         CNC-Fräse Alpha      | CNC-Fräse
         CNC-Fräse Epsilon    | CNC-Fräse
         Drehbank Beta        | Drehbank
         Drehbank Zeta        | Drehbank
         Lackieranlage Delta  | Lackieranlage
         Schweißroboter Eta   | Schweißroboter
         Schweißroboter Gamma | Schweißroboter
         Stanzmaschine Theta  | Stanzmaschine
        (8 rows)
        ```

        Oder explizit mit `ASC`:
        ```sql
        ORDER BY name ASC;
        ```

-   __Absteigend (Z-A)__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Nach Anschaffungsjahr sortiert (neueste zuerst)
        SELECT name, anschaffungsjahr
        FROM maschinen
        ORDER BY anschaffungsjahr DESC;
        ```

        ```title="Output"
                 name         | anschaffungsjahr
        ----------------------+------------------
         Stanzmaschine Theta  |             2023
         CNC-Fräse Epsilon    |             2022
         Drehbank Beta        |             2021
         Schweißroboter Gamma |             2020
         Schweißroboter Eta   |             2020
         CNC-Fräse Alpha      |             2019
         Lackieranlage Delta  |             2018
         Drehbank Zeta        |             2017
        (8 rows)
        ```

-   __Nach mehreren Spalten__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Erst nach Standort (A-Z), dann nach Anschaffungsjahr (neueste zuerst)
        SELECT name, standort, anschaffungsjahr
        FROM maschinen
        ORDER BY standort ASC, anschaffungsjahr DESC;
        ```

        ```title="Output"
                 name         | standort | anschaffungsjahr
        ----------------------+----------+------------------
         Stanzmaschine Theta  | Halle A  |             2023
         CNC-Fräse Epsilon    | Halle A  |             2022
         Drehbank Beta        | Halle A  |             2021
         CNC-Fräse Alpha      | Halle A  |             2019
         Schweißroboter Gamma | Halle B  |             2020
         Schweißroboter Eta   | Halle B  |             2020
         Drehbank Zeta        | Halle B  |             2017
         Lackieranlage Delta  | Halle C  |             2018
        (8 rows)
        ```

        **Erklärung:** Die Daten werden zuerst nach `standort` alphabetisch sortiert (Halle A, dann B, dann C). Innerhalb jeder Halle werden die Maschinen nach `anschaffungsjahr` absteigend sortiert (neueste zuerst).

-   __Nach Spaltenposition__

    ---

    ???+ example "Beispiel"
        Alternativ kann man auch die **Position der Spalte** im SELECT angeben:

        ```sql
        SELECT name, typ, anschaffungsjahr
        FROM maschinen
        ORDER BY 3 DESC;  -- Sortiere nach der 3. Spalte (anschaffungsjahr)
        ```

        ???+ warning "Nicht empfohlen!"
            Diese Schreibweise ist **weniger lesbar** und sollte nur in Ausnahmefällen verwendet werden. Besser ist es, den Spaltennamen explizit anzugeben: `ORDER BY anschaffungsjahr DESC`

</div>

**Sortierung und NULL-Werte**

Was passiert eigentlich, wenn eine Spalte **NULL-Werte** enthält (leere Einträge)? Das Standardverhalten in PostgreSQL ist:

- Bei `ASC` (aufsteigend): NULL-Werte kommen **am Ende**
- Bei `DESC` (absteigend): NULL-Werte kommen **am Anfang**

Doch wir können dies auch gezielt steuern

???+ info "Explizite Kontrolle"
    ```sql
    -- NULL-Werte zuerst, dann aufsteigend sortieren
    ORDER BY spalte ASC NULLS FIRST;

    -- NULL-Werte am Ende, dann aufsteigend sortieren
    ORDER BY spalte ASC NULLS LAST;
    ```

---

## Ergebnismenge begrenzen mit `LIMIT`

Manchmal möchten wir **nicht alle Datensätze** abrufen, sondern nur eine bestimmte Anzahl - zum Beispiel:

- Die **Top 5** der neuesten Maschinen
- Die **ersten 10 Einträge** für eine Vorschau
- **Seitenweise** Ergebnisse anzeigen (Paginierung)

Dafür verwenden wir `LIMIT` (und optional `OFFSET`).

### Grundlegende Verwendung

Wir starten mit der einfachen Verwendung von `LIMIT` zur Limitierung der Rückgabeergebnisse. Der grundlegende Syntax kann wiefolgt beschrieben werden: 

```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle
ORDER BY sortierung
LIMIT anzahl;
```

Wenn wir diesem Syntax folgen können wir beispielsweise die ersten 3 Ergebnisse zurückgeben lassen.



???+ example "Beispiel"
    ```sql
    -- Die 3 ältesten Maschinen
    SELECT name, anschaffungsjahr
    FROM maschinen
    ORDER BY anschaffungsjahr ASC
    LIMIT 3;
    ```

    ```title="Output"
            name        | anschaffungsjahr
    --------------------+------------------
        Drehbank Zeta      |             2017
        Lackieranlage Delta|             2018
        CNC-Fräse Alpha    |             2019
    (3 rows)
    ```



???+ warning "LIMIT ohne ORDER BY"
    Wenn du `LIMIT` ohne `ORDER BY` verwendest, ist das Ergebnis **nicht vorhersehbar** - die Datenbank gibt irgendwelche Zeilen zurück! Verwende daher **immer ORDER BY zusammen mit LIMIT**.

### Zeilen überspringen mit `OFFSET`

Nun kann es vorkommen, dass wir nicht die ersten N Ergebnisse auslesen möchten, sondern erst bei einem gewissen Wert beginnend. Mit `OFFSET` können wir die ersten N Zeilen **überspringen** und erst ab einer bestimmten Position Ergebnisse zurückgeben.


```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle
ORDER BY sortierung
LIMIT anzahl OFFSET überspringen;
```


???+ example "Beispiel"
    ```sql
    -- Überspringe die ersten 3, zeige die nächsten 3 Maschinen
    SELECT name, anschaffungsjahr
    FROM maschinen
    ORDER BY anschaffungsjahr ASC
    LIMIT 3 OFFSET 3;
    ```

    ```title="Output"
                name         | anschaffungsjahr
    ----------------------+------------------
        Schweißroboter Gamma |             2020
        Schweißroboter Eta   |             2020
        Drehbank Beta        |             2021
    (3 rows)
    ```

    **Erklärung:** Die ersten 3 Maschinen (2017, 2018, 2019) werden übersprungen, dann werden die nächsten 3 zurückgegeben.



???+ info "Paginierung"

    `LIMIT` und `OFFSET` werden häufig für **Paginierung** verwendet - z.B. wenn eine Webseite Ergebnisse seitenweise anzeigt.

    Bei sehr großen **OFFSET-Werten** (z.B. `OFFSET 10000`) kann die Performance leiden, da die Datenbank alle übersprungenen Zeilen dennoch laden und durchlaufen muss. Für große Datensätze gibt es bessere Ansätze (z.B. Cursor-basierte Paginierung).

---

## Aggregatfunktionen - Daten zusammenfassen

Bisher haben wir einzelne Datensätze abgefragt - jede Zeile wurde einzeln zurückgegeben. Manchmal interessieren uns aber **zusammengefasste Informationen** über viele Datensätze:

- **Wie viele** Maschinen haben wir insgesamt?
- Was ist das **durchschnittliche** Anschaffungsjahr?
- Was ist der **höchste** oder **niedrigste** Wert in einer Spalte?
- Was ist die **Summe** aller Kosten?

Für solche **statistischen Auswertungen** verwenden wir **Aggregatfunktionen**. Sie **fassen mehrere Zeilen zu einem einzigen Ergebniswert zusammen**. 

```sql { .yaml .no-copy }
SELECT funktion AS ergebnisname
FROM tabelle;
```

Neben der Funktion benötigen wir auch das `AS` zum vergeben eines Alias Namens für das Ergebnis der Berechnung. 



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
        <td style="padding:10px 14px;">Wie viele Maschinen gibt es?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>COUNT(spalte)</code></td>
        <td style="padding:10px 14px;">Zählt Nicht-NULL-Werte</td>
        <td style="padding:10px 14px;">Wie viele Maschinen haben ein Status-Eintrag?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>SUM(spalte)</code></td>
        <td style="padding:10px 14px;">Summe aller Werte</td>
        <td style="padding:10px 14px;">Gesamtkosten aller Maschinen?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>AVG(spalte)</code></td>
        <td style="padding:10px 14px;">Durchschnittswert</td>
        <td style="padding:10px 14px;">Durchschnittliches Anschaffungsjahr?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MIN(spalte)</code></td>
        <td style="padding:10px 14px;">Kleinster Wert</td>
        <td style="padding:10px 14px;">Älteste Maschine (frühestes Jahr)?</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MAX(spalte)</code></td>
        <td style="padding:10px 14px;">Größter Wert</td>
        <td style="padding:10px 14px;">Neueste Maschine (spätestes Jahr)?</td>
    </tr>
    </tbody>
</table>
</div>

Nachfolgend sind einige Beispiele angeführt. 

<div class="grid cards" markdown>

-   __COUNT - Zählen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Wie viele Maschinen gibt es insgesamt?
        SELECT COUNT(*) AS anzahl_maschinen
        FROM maschinen;
        ```

        ```title="Output"
         anzahl_maschinen
        ------------------
                        8
        (1 row)
        ```

        **Erklärung:** `COUNT(*)` zählt alle Zeilen in der Tabelle - unabhängig vom Inhalt.

        ??? code "COUNT mit Bedingung"
            ```sql
            -- Wie viele Maschinen sind aktiv?
            SELECT COUNT(*) AS anzahl_aktiv
            FROM maschinen
            WHERE status = 'Aktiv';
            ```

            ```title="Output"
             anzahl_aktiv
            --------------
                        6
            (1 row)
            ```

-   __AVG - Durchschnitt__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Durchschnittliches Anschaffungsjahr
        SELECT AVG(anschaffungsjahr) AS durchschnitt
        FROM maschinen;
        ```

        ```title="Output"
                   durchschnitt
        ---------------------
         2020.0000000000000000
        (1 row)
        ```

        **Erklärung:** `AVG()` berechnet den arithmetischen Mittelwert aller Anschaffungsjahre.

-   __MIN & MAX - Extremwerte__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Älteste und neueste Maschine
        SELECT
            MIN(anschaffungsjahr) AS aelteste,
            MAX(anschaffungsjahr) AS neueste
        FROM maschinen;
        ```

        ```title="Output"
         aelteste | neueste
        ----------+---------
             2017 |    2023
        (1 row)
        ```

        **Erklärung:** Wir können mehrere Aggregatfunktionen in einer Abfrage kombinieren.

-   __SUM - Summe__

    ---

    ???+ example "Beispiel"
        Angenommen, unsere `maschinen`-Tabelle hätte eine Spalte `wartungskosten`:

        ```sql
        -- Gesamte Wartungskosten aller Maschinen
        SELECT SUM(wartungskosten) AS gesamtkosten
        FROM maschinen;
        ```

        **Hinweis:** `SUM()` funktioniert nur mit numerischen Spalten (INTEGER, NUMERIC, etc.)

</div>

???+ warning "NULL-Werte werden ignoriert"
    Aggregatfunktionen (außer `COUNT(*)`) **ignorieren NULL-Werte**!

    - `COUNT(spalte)` zählt nur Nicht-NULL-Werte
    - `AVG(spalte)` berechnet den Durchschnitt nur aus vorhandenen Werten
    - `SUM(spalte)` summiert nur vorhandene Werte


---

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx

## Gruppieren mit `GROUP BY`

Mit den Aggregatfunktionen können wir bereits einfache Analysen unseres Datensatzes durchführen.  Doch oft möchten wir **Auswertungen pro Kategorie**:

- Wie viele Maschinen gibt es **pro Typ**?
- Was ist das durchschnittliche Anschaffungsjahr **pro Standort**?
- Wie viele Maschinen gibt es **pro Status**?

Dafür verwenden wir **GROUP BY** - es fasst Zeilen mit gleichen Werten zusammen und erlaubt **Aggregationen pro Gruppe**.

```sql { .yaml .no-copy }
SELECT gruppenspalte, aggregatfunktion(spalte)
FROM tabelle
GROUP BY gruppenspalte;
```

<div class="grid cards" markdown>

-   __Zählen pro Gruppe__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Wie viele Maschinen gibt es pro Typ?
        SELECT typ, COUNT(*) AS anzahl
        FROM maschinen
        GROUP BY typ;
        ```

        ```title="Output"
              typ       | anzahl
        ----------------+--------
         CNC-Fräse      |      2
         Drehbank       |      2
         Schweißroboter |      2
         Lackieranlage  |      1
         Stanzmaschine  |      1
        (5 rows)
        ```

        **Erklärung:** Die Datenbank gruppiert alle Maschinen nach `typ` und zählt, wie viele Maschinen in jeder Gruppe sind.

-   __Durchschnitt pro Gruppe__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Durchschnittliches Anschaffungsjahr pro Standort
        SELECT standort, AVG(anschaffungsjahr) AS durchschnitt
        FROM maschinen
        GROUP BY standort;
        ```

        ```title="Output"
         standort |     durchschnitt
        ----------+----------------------
         Halle A  | 2020.7500000000000000
         Halle B  | 2019.0000000000000000
         Halle C  | 2018.0000000000000000
        (3 rows)
        ```

-   __MIN/MAX pro Gruppe__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Älteste und neueste Maschine pro Standort
        SELECT
            standort,
            MIN(anschaffungsjahr) AS aelteste,
            MAX(anschaffungsjahr) AS neueste
        FROM maschinen
        GROUP BY standort;
        ```

        ```title="Output"
         standort | aelteste | neueste
        ----------+----------+---------
         Halle A  |     2019 |    2023
         Halle B  |     2017 |    2020
         Halle C  |     2018 |    2018
        (3 rows)
        ```

</div>

---

### Mehrere Aggregationen kombinieren

Wir können **mehrere Aggregatfunktionen** gleichzeitig auf dieselbe Gruppierung anwenden.

???+ example "Beispiel: Umfassende Statistik pro Standort"
    ```sql
    SELECT
        standort,
        COUNT(*) AS anzahl,
        AVG(anschaffungsjahr) AS durchschnitt_jahr,
        MIN(anschaffungsjahr) AS aelteste,
        MAX(anschaffungsjahr) AS neueste
    FROM maschinen
    GROUP BY standort
    ORDER BY anzahl DESC;
    ```

    ```title="Output"
     standort | anzahl |   durchschnitt_jahr   | aelteste | neueste
    ----------+--------+-----------------------+----------+---------
     Halle A  |      4 | 2020.7500000000000000 |     2019 |    2023
     Halle B  |      3 | 2019.0000000000000000 |     2017 |    2020
     Halle C  |      1 | 2018.0000000000000000 |     2018 |    2018
    (3 rows)
    ```

    **Erklärung:** Für jeden Standort sehen wir die Anzahl der Maschinen, das durchschnittliche Anschaffungsjahr sowie die älteste und neueste Maschine.

---

### Gruppierung nach mehreren Spalten

Wir können auch nach **mehreren Spalten gleichzeitig** gruppieren.

???+ example "Beispiel: Gruppierung nach Standort UND Status"
    ```sql
    SELECT
        standort,
        status,
        COUNT(*) AS anzahl
    FROM maschinen
    GROUP BY standort, status
    ORDER BY standort, status;
    ```

    ```title="Output"
     standort | status  | anzahl
    ----------+---------+--------
     Halle A  | Aktiv   |      4
     Halle B  | Aktiv   |      1
     Halle B  | Defekt  |      1
     Halle B  | Wartung |      1
     Halle C  | Aktiv   |      1
    (5 rows)
    ```

    **Erklärung:** Jede Kombination aus `standort` und `status` bildet eine eigene Gruppe.

---

### Wichtige Regeln für GROUP BY

???+ warning "SELECT-Regel für GROUP BY"
    Wenn du `GROUP BY` verwendest, dürfen im `SELECT` **nur** vorkommen:

    1. **Spalten, die in GROUP BY stehen**
    2. **Aggregatfunktionen**

    **Richtig:**
    ```sql
    SELECT typ, COUNT(*) AS anzahl
    FROM maschinen
    GROUP BY typ;  -- ✓ typ steht in GROUP BY
    ```

    **Falsch:**
    ```sql
    SELECT typ, name, COUNT(*) AS anzahl  -- ✗ name steht nicht in GROUP BY!
    FROM maschinen
    GROUP BY typ;
    ```

    **Warum?** Wenn wir nach `typ` gruppieren, gibt es in der Gruppe "CNC-Fräse" zwei verschiedene Namen ("CNC-Fräse Alpha" und "CNC-Fräse Epsilon"). Die Datenbank weiß nicht, welchen sie anzeigen soll!

???+ info "ORDER BY mit GROUP BY"
    Nach der Gruppierung können wir das Ergebnis mit `ORDER BY` sortieren:

    ```sql
    SELECT typ, COUNT(*) AS anzahl
    FROM maschinen
    GROUP BY typ
    ORDER BY anzahl DESC;  -- Sortiere nach Anzahl (absteigend)
    ```

    Wir können nach:
    - Der **Gruppenspalte** sortieren: `ORDER BY typ`
    - Einem **Aggregat-Ergebnis** sortieren: `ORDER BY anzahl DESC`

---

## HAVING - Gruppen filtern

**HAVING** filtert Gruppen **nach** der Aggregation - im Gegensatz zu **WHERE**, das **vor** der Aggregation filtert.

**Wann WHERE, wann HAVING?**

- **WHERE** - Filtert einzelne Zeilen (vor GROUP BY)
- **HAVING** - Filtert Gruppen (nach GROUP BY)

### Beispiel

```sql
-- Maschinentypen mit mehr als 1 Maschine
SELECT typ, COUNT(*) AS anzahl
FROM maschinen
GROUP BY typ
HAVING COUNT(*) > 1;
```

**Ergebnis:**

```
 typ             │ anzahl
─────────────────┼────────
 CNC-Fräse       │      2
 Drehbank        │      2
 Schweißroboter  │      2
```

### WHERE vs. HAVING kombiniert

```sql
-- Standorte mit mehr als 1 aktiver Maschine
SELECT standort, COUNT(*) AS anzahl
FROM maschinen
WHERE status = 'Aktiv'  -- Filtert ZEILEN
GROUP BY standort
HAVING COUNT(*) > 1;  -- Filtert GRUPPEN
```

**Ablauf:**

1. **WHERE**: Filtere alle Zeilen mit `status = 'Aktiv'`
2. **GROUP BY**: Gruppiere nach Standort
3. **HAVING**: Zeige nur Gruppen mit mehr als 1 Maschine

---

## DISTINCT - Duplikate entfernen

**DISTINCT** entfernt doppelte Zeilen aus dem Ergebnis.

```sql
-- Welche Maschinentypen gibt es? (ohne Duplikate)
SELECT DISTINCT typ
FROM maschinen;
```

**Ergebnis:**

```
 typ
─────────────────
 CNC-Fräse
 Drehbank
 Schweißroboter
 Lackieranlage
 Stanzmaschine
```

---

## Praktische Übungen 🎯

Verwende die `maschinen` und `ersatzteile` Tabellen für folgende Aufgaben:

???+ question "Aufgabe 1: Einfache Abfragen"

    1. Zeige alle Maschinen in Halle B
    2. Zeige Maschinen, die 2020 oder 2021 angeschafft wurden
    3. Zeige Maschinen, deren Name mit 'Schweißroboter' beginnt

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1
        SELECT * FROM maschinen WHERE standort = 'Halle B';

        -- 2
        SELECT * FROM maschinen WHERE anschaffungsjahr IN (2020, 2021);

        -- 3
        SELECT * FROM maschinen WHERE name LIKE 'Schweißroboter%';
        ```

???+ question "Aufgabe 2: Sortierung"

    1. Sortiere Maschinen nach Standort (aufsteigend), dann nach Anschaffungsjahr (absteigend)
    2. Zeige die 3 neuesten Maschinen

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1
        SELECT * FROM maschinen ORDER BY standort ASC, anschaffungsjahr DESC;

        -- 2
        SELECT * FROM maschinen ORDER BY anschaffungsjahr DESC LIMIT 3;
        ```

???+ question "Aufgabe 3: Aggregationen"

    1. Wie viele Maschinen gibt es pro Standort?
    2. Was ist das durchschnittliche Anschaffungsjahr aller Maschinen?
    3. Welche Maschinentypen haben mindestens 2 Maschinen?

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1
        SELECT standort, COUNT(*) AS anzahl
        FROM maschinen
        GROUP BY standort
        ORDER BY standort;

        -- 2
        SELECT AVG(anschaffungsjahr) AS durchschnitt FROM maschinen;

        -- 3
        SELECT typ, COUNT(*) AS anzahl
        FROM maschinen
        GROUP BY typ
        HAVING COUNT(*) >= 2;
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

Im nächsten Kapitel lernen wir, wie wir Daten **ändern, aktualisieren und löschen** können - und welche Fallstricke dabei lauern!

<div style="text-align: center;">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmR0aWN5OGxwZWt5dHl6cXh5dHl6cXh5dHl6cXh5dHl6cXh5dHl6cXh5ZHMmZXA9djFfZ2lmc19zZWFyY2gmY3Q9Zw/xT9IgzoKnwFNmISR8I/giphy.gif" alt="" style="width:220px; margin-bottom: 1em;">
</div>
