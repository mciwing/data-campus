# Daten manipulieren

In den vorangigen Kapiteln haben wir gelernt, wie man eine Datenbank erstellt, Daten **einfügt** und **abfragt**. 
Dabei haben wir speziell den Fokus auf die [Abfrage von Daten](abfragen.md) gelegt und uns diese im Detail betrachtet. 
Doch was passiert, wenn sich Daten ändern müssen? Wenn eine Maschine in die Wartung geht, der Standort wechselt oder ausgemustert wird?

In der Welt der Datenbanken begegnet uns oft der Begriff **CRUD**. 

![CRUD](../assets/database/manipulieren/crud.png)


CRUD ist ein Akronym und steht für die Grundoperationen der Datenverwaltung.

- **C**reate → `CREATE` & `INSERT` - Neue Tabellen und Datensätze erstellen
- **R**ead → `SELECT` - Datensätze abfragen
- **U**pdate → `UPDATE` - Bestehende Datensätze ändern
- **D**elete → `DELETE` - Datensätze löschen

Wie bereits erwähnt, haben wir die Abfrage von Daten - und damit die **R**ead-Operation - im vorherigen Kapitel bereits detailreichkennengelernt. Nun wollen wir uns den restlichen drei Operationen widmen. 


---

## Daten einfügen mit `INSERT`

Wir kennen **INSERT** bereits aus dem [vorherigen Kapitel](relational.md#daten-einfugen-insert), doch nun wollen wir hier nochmal die wichtigsten Grundlagen wiederholen und erweitern.

Mit `INSERT` fügen wir neue Datensätze in eine Tabelle ein. Es gibt verschiedene Varianten, je nachdem wie viele Datensätze wir einfügen möchten und welche Spalten wir befüllen wollen.

```sql { .yaml .no-copy }
INSERT INTO tabellenname (spalte1, spalte2, spalte3)
VALUES (wert1, wert2, wert3);
```

???+ example "Beispiel"

    ```sql
    -- Mehrere Maschinen gleichzeitig einfügen
    INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
    VALUES
        (10, 'Bohrmaschine Kappa', 'Bohrmaschine', 'Halle A', 2022, 'Aktiv'),
        (11, 'Fräse Lambda', 'CNC-Fräse', 'Halle B', 2021, 'Aktiv'),
        (12, 'Poliermaschine Mu', 'Poliermaschine', 'Halle C', 2020, 'Wartung');
    ```

    **Erklärung:** Mehrere Datensätze werden mit einem einzigen INSERT-Befehl eingefügt - effizienter als einzelne INSERT-Befehle.

???+ question "Fehlende Werte"

    Was passiert eigentlich, wenn man nicht alle Spalten befüllt? Probieren wir es aus und sehen, was passiert:

    1. Wir fügen eine neue Maschine hinzu, aber **lassen die Spalte `status` weg**:
       ```sql
       INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr)
       VALUES (13, 'Testanlage Nu', 'Testanlage', 'Halle D', 2024);
       ```

    2. Wir fügen eine weitere Maschine hinzu und setzen `status` **explizit auf NULL**:
       ```sql
       INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
       VALUES (14, 'Prototyp Omega', 'Prototyp', 'Halle D', 2024, NULL);
       ```

    3. Wir prüfen mit `SELECT`, welche Werte die beiden Maschinen für `status` haben:
       ```sql
       SELECT * FROM maschinen WHERE maschinen_id IN (13, 14);
       ```

    **Fragen zum Nachdenken:**

    - Was steht in der `status`-Spalte bei Maschine 13?
    - Was steht in der `status`-Spalte bei Maschine 14?
    - Gibt es einen Unterschied? Warum (nicht)?



??? info "Lösung"

    **Beobachtung:** Beide Maschinen haben wahrscheinlich `NULL` als Status (oder einen Standardwert, falls definiert).

    **Erklärung:**

    - **Maschine 13:** Die Spalte `status` wurde **weggelassen** → Sie enthält den Wert `NULL`
    - **Maschine 14:** Die Spalte `status` wurde **explizit auf NULL gesetzt** → Sie enthält den Wert `NULL`

Wir haben gesehen, dass in unserem Fall beide Vorgehen zum gleichen Ergebnis führen. Doch gibt es auch einen Unterschied? Ja, den kann es geben. Doch dafür müssen wir uns nochmals genauer ansehen, wie wir die Tabelle erstellt haben.

### `DEFAULT`-Werte

Beim Erstellen einer Tabelle können wir für Spalten **Standardwerte** definieren. Diese werden automatisch verwendet, wenn beim `INSERT` kein Wert angegeben wird.

```sql
CREATE TABLE maschinen (
    maschinen_id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    typ VARCHAR(50),
    standort VARCHAR(50),
    anschaffungsjahr INTEGER,
    status VARCHAR(20) DEFAULT 'Aktiv'  -- Standardwert definiert!
);
```

???+ tip "DEFAULT-Werte sind praktisch"
    Standardwerte sind besonders nützlich für:

    - Status-Felder (z.B. Standard: 'Aktiv')
    - Zeitstempel (z.B. Standard: aktuelles Datum)
    - Zähler (z.B. Standard: 0)
    - Flags (z.B. Standard: FALSE)

    ```sql { .yaml .no-copy }
    CREATE TABLE bestellungen (
        bestell_id INTEGER PRIMARY KEY,
        kunde VARCHAR(100),
        status VARCHAR(20) DEFAULT 'Offen',
        erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        anzahl_positionen INTEGER DEFAULT 0
    );
    ```

### Pflichtfeld mit `NOT NULL`

Mit der Einschränkung `NOT NULL` können wir festlegen, dass eine Spalte **niemals leer** sein darf. Jede Zeile **muss** einen Wert in dieser Spalte haben.
Man kann `NOT NULL` und `DEFAULT` auch kombinieren. 

```sql
CREATE TABLE maschinen (
    maschinen_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    typ VARCHAR(50) NOT NULL,
    standort VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Aktiv'  -- Pflicht + Standard!
);
```

**Vorteile:**

- Die Spalte darf nie `NULL` sein (Vorteil bei Datenqualität!)
- Wenn man die Spalte beim `INSERT` weglässt, wird der `DEFAULT`-Wert verwendet
- Man muss die Spalte beim `INSERT` nicht angeben

  


<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Constraint</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Weggelassen beim INSERT</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Explizit NULL beim INSERT</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Keine</td>
        <td style="padding:10px 14px;"><code>NULL</code></td>
        <td style="padding:10px 14px;"><code>NULL</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>DEFAULT 'Wert'</code></td>
        <td style="padding:10px 14px;"><code>'Wert'</code> (Standard)</td>
        <td style="padding:10px 14px;"><code>NULL</code> (überschreibt Standard)</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>NOT NULL</code></td>
        <td style="padding:10px 14px;">❌ <strong>Fehler</strong></td>
        <td style="padding:10px 14px;">❌ <strong>Fehler</strong></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>NOT NULL DEFAULT 'Wert'</code></td>
        <td style="padding:10px 14px;"><code>'Wert'</code> (Standard)</td>
        <td style="padding:10px 14px;">❌ <strong>Fehler</strong></td>
    </tr>
    </tbody>
</table>
</div>

---


## Daten aktualisieren mit `UPDATE`

Nachdem wir die ersten zwei Buchstaben von CRUD geklärt haben, wollen wir uns nun dem dritten Buchstaben widmen.
Mit **U**pdate ändern wir bereits bestehende Datensätze in einer Tabelle. Beispielsweise können wir den Status einer Maschine ändern, wenn sie in die Wartung geht oder der Standort wechselt.

```sql { .yaml .no-copy }
UPDATE tabellenname
SET spalte1 = neuer_wert1,
    spalte2 = neuer_wert2
WHERE bedingung;
```

Wichtig ist hier, dass wir die `WHERE`-Klausel verwenden. Ohne diese, werden alle Datensätze in der Tabelle geändert.

???+ danger "Verlorene Daten!"
    Ohne eine Sicherungskopie (Backup) wären die ursprünglichen Werte **unwiderruflich verloren**! Es gibt kein "Rückgängig" in SQL!

**Goldene Regel** lautet demnach: Teste immer erst mit `SELECT`, ob deine WHERE-Bedingung die richtigen Zeilen findet und verwende anschließend das `UPDATE` in Kombination mit der `WHERE`-Klausel.

???+ example "Beispiel"
    ```sql
    -- Drehbank Beta wechselt Standort und geht in Wartung
    UPDATE maschinen
    SET standort = 'Halle C',
        status = 'Wartung'
    WHERE maschinen_id = 2;
    ```

    **Erklärung:** Mit Kommas getrennt können mehrere Spalten gleichzeitig geändert werden.

    ??? code "weitere Beispiele"

        <div class="grid cards" markdown>

        -   __Einen Datensatz ändern__

            ---

            ???+ example "Beispiel"
                ```sql
                -- CNC-Fräse Alpha geht in Wartung
                UPDATE maschinen
                SET status = 'Wartung'
                WHERE maschinen_id = 1;
                ```

                **Erklärung:** Die `WHERE`-Klausel sorgt dafür, dass nur die Maschine mit ID 1 geändert wird.


        -   __Mehrere Datensätze ändern__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Alle Maschinen in Halle A werden auf Aktiv gesetzt
                UPDATE maschinen
                SET status = 'Aktiv'
                WHERE standort = 'Halle A';
                ```

                **Erklärung:** Alle Datensätze, die die WHERE-Bedingung erfüllen, werden geändert - in diesem Fall alle Maschinen in Halle A.

        -   __Mit Berechnungen__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Anschaffungsjahr um 1 erhöhen (z.B. Fehlerkorrektur)
                UPDATE maschinen
                SET anschaffungsjahr = anschaffungsjahr + 1
                WHERE maschinen_id = 3;
                ```

                **Erklärung:** Der neue Wert kann aus dem alten Wert berechnet werden.

        </div>


---


### Erweiterte `UPDATE`-Techniken

Neben einfachen Wertzuweisungen können wir in `UPDATE` auch Berechnungen durchführen und String-Operationen anwenden.

**Numerische Berechnungen**

Wir können mit dem aktuellen Wert rechnen und daraus den neuen Wert berechnen:

???+ example "Beispiel"

    ```sql
    -- Alle Anschaffungsjahre um 1 erhöhen (z.B. Fehlerkorrektur)
    UPDATE maschinen
    SET anschaffungsjahr = anschaffungsjahr + 1
    WHERE standort = 'Halle A';
    ```

    **Erklärung:** Der neue Wert wird aus dem alten Wert + 1 berechnet.


**String-Operationen**

SQL bietet verschiedene Funktionen zur Bearbeitung von Textwerten. Eine gute Übersicht findet man [hier](fortgeschritten.md#string-funktionen).

???+ example "Beispiel"

    ```sql
    -- 'Halle' durch 'Produktionshalle' ersetzen
    UPDATE maschinen
    SET standort = REPLACE(standort, 'Halle', 'Produktionshalle');
    ```

    ```title="Vorher → Nachher"
    'Halle A' → 'Produktionshalle A'
    'Halle B' → 'Produktionshalle B'
    ```

    ??? code "weitere Beispiele"

            
        <div class="grid cards" markdown>

        -   __CONCAT - Verketten__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Prefix zum Namen hinzufügen
                UPDATE maschinen
                SET name = CONCAT('Maschine: ', name)
                WHERE typ = 'CNC-Fräse';
                ```

                ```title="Vorher → Nachher"
                'CNC-Fräse Alpha' → 'Maschine: CNC-Fräse Alpha'
                ```

        -   __UPPER / LOWER - Groß-/Kleinschreibung__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Status in Großbuchstaben umwandeln
                UPDATE maschinen
                SET status = UPPER(status);
                ```

                ```title="Vorher → Nachher"
                'Aktiv' → 'AKTIV'
                'Wartung' → 'WARTUNG'
                ```

        -   __TRIM - Leerzeichen entfernen__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Führende/abschließende Leerzeichen entfernen
                UPDATE maschinen
                SET name = TRIM(name);
                ```

                ```title="Vorher → Nachher"
                '  CNC-Fräse  ' → 'CNC-Fräse'
                ```

        </div>


---

## Daten löschen mit `DELETE`

Nun sind wir am Ende unserer CRUD-Reihe angelangt. Mit **D**elete entfernen wir Datensätze **dauerhaft** aus einer Tabelle. 


```sql { .yaml .no-copy }
DELETE FROM tabellenname
WHERE bedingung;
```

Wie auch bei `UPDATE` zuvor ist es extrem wichtig, dass wir `DELETE` in Kombination mit der `WHERE`-Klausel verwenden. Ohne diese, werden alle Datensätze in der Tabelle gelöscht. Auch hier gibt es **kein Zurück**.

???+ example "Beispiel"

    ```sql
    -- Maschine mit ID 8 löschen (z.B. weil ausgemustert)
    DELETE FROM maschinen
    WHERE maschinen_id = 8;
    ```

    **Erklärung:** Die `WHERE`-Klausel sorgt dafür, dass nur die Maschine mit ID 8 gelöscht wird.

    ??? code "weitere Beispiele"
        
        <div class="grid cards" markdown>

        -   __Mehrere Datensätze löschen__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Alle defekten Maschinen löschen (z.B. weil verschrottet)
                DELETE FROM maschinen
                WHERE status = 'Defekt';
                ```

                **Erklärung:** Alle Datensätze, die die WHERE-Bedingung erfüllen, werden gelöscht.

        -   __Nach mehreren Kriterien__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Maschinen in Halle C mit Status Defekt löschen
                DELETE FROM maschinen
                WHERE standort = 'Halle C' AND status = 'Defekt';
                ```

                **Erklärung:** Beide Bedingungen müssen erfüllt sein (`AND`), damit ein Datensatz gelöscht wird.

        -   __Mit Primärschlüssel (am sichersten)__

            ---

            ???+ example "Beispiel"
                ```sql
                -- Am sichersten: Löschen nach eindeutigem Primärschlüssel
                DELETE FROM maschinen
                WHERE maschinen_id = 5;
                ```

                **Erklärung:** Der Primärschlüssel ist eindeutig - so kann man sicher sein, dass nur genau ein Datensatz gelöscht wird.

        </div>

???+ warning "DELETE vs. DROP"
    Wichtiger Unterschied zwischen zwei ähnlich klingenden Befehlen:

    - `DELETE FROM tabelle;` - Löscht alle **Zeilen**, die Tabellenstruktur bleibt bestehen
    - `DROP TABLE tabelle;` - Löscht die **gesamte Tabelle** inklusive Struktur und allen Daten

    ```sql
    -- DELETE: Tabelle bleibt, aber ist leer
    DELETE FROM maschinen;
    SELECT * FROM maschinen;  -- Funktioniert, gibt 0 Zeilen zurück

    -- DROP: Tabelle existiert nicht mehr
    DROP TABLE maschinen;
    SELECT * FROM maschinen;  -- FEHLER: Tabelle existiert nicht
    ```

---

Teste dein Wissen mit den folgenden Übungen. Verwende die `maschinen`-Tabelle aus den vorherigen Kapiteln.

???+ info "Vorbereitung"
    Stelle sicher, dass du folgende Testdaten in deiner Datenbank hast:

    ```sql
    -- Falls nötig, Tabelle neu erstellen
    DROP TABLE IF EXISTS maschinen;

    CREATE TABLE maschinen (
        maschinen_id INTEGER PRIMARY KEY,
        name VARCHAR(100),
        typ VARCHAR(50),
        standort VARCHAR(50),
        anschaffungsjahr INTEGER,
        status VARCHAR(20)
    );

    INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
    VALUES
        (1, 'CNC-Fräse Alpha', 'CNC-Fräse', 'Halle A', 2019, 'Aktiv'),
        (2, 'Drehbank Beta', 'Drehbank', 'Halle A', 2021, 'Aktiv'),
        (3, 'Schweißroboter Gamma', 'Schweißroboter', 'Halle B', 2020, 'Wartung'),
        (4, 'Lackieranlage Delta', 'Lackieranlage', 'Halle C', 2018, 'Aktiv'),
        (5, 'CNC-Fräse Epsilon', 'CNC-Fräse', 'Halle A', 2022, 'Aktiv');
    ```

???+ question "Aufgabe 1: UPDATE üben"

    1. CNC-Fräse Alpha (ID 1) geht in Wartung
    2. Drehbank Beta (ID 2) wechselt nach "Halle C"
    3. Alle CNC-Fräsen in Halle A bekommen Status "Aktiv"

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1. CNC-Fräse Alpha in Wartung setzen
        UPDATE maschinen
        SET status = 'Wartung'
        WHERE maschinen_id = 1;

        -- 2. Drehbank Beta nach Halle C verschieben
        UPDATE maschinen
        SET standort = 'Halle C'
        WHERE maschinen_id = 2;

        -- 3. Alle CNC-Fräsen in Halle A auf Aktiv setzen
        UPDATE maschinen
        SET status = 'Aktiv'
        WHERE typ = 'CNC-Fräse' AND standort = 'Halle A';
        ```

???+ question "Aufgabe 2: DELETE üben"

    1. Lösche die Lackieranlage Delta (Maschinen-ID 4)
    2. Lösche alle Maschinen mit Status "Wartung"
    3. **Prüfe vorher mit SELECT**, welche Maschinen betroffen wären!

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1. Lackieranlage Delta löschen
        -- Erst prüfen:
        SELECT * FROM maschinen WHERE maschinen_id = 4;
        -- Dann löschen:
        DELETE FROM maschinen WHERE maschinen_id = 4;

        -- 2. Alle Maschinen in Wartung löschen
        -- Erst prüfen:
        SELECT * FROM maschinen WHERE status = 'Wartung';
        -- Dann löschen:
        DELETE FROM maschinen WHERE status = 'Wartung';
        ```

???+ question "Aufgabe 3: Fehler finden"

    Was ist an folgenden Befehlen falsch oder gefährlich?

    ```sql
    -- A)
    UPDATE maschinen
    SET status = 'Defekt';

    -- B)
    DELETE FROM maschinen;

    -- C)
    UPDATE maschinen
    SET typ = 'CNC-Fräse'
    WHERE maschine = 'Alpha';
    ```

    ??? tip "Lösungen anzeigen"

        **A)** Keine `WHERE`-Klausel → **ALLE** Maschinen werden auf Status 'Defekt' gesetzt!

        ```sql
        -- Richtig wäre:
        UPDATE maschinen
        SET status = 'Defekt'
        WHERE maschinen_id = 1;  -- oder eine andere passende Bedingung
        ```

        **B)** Keine `WHERE`-Klausel → **ALLE** Maschinen werden gelöscht!

        ```sql
        -- Richtig wäre:
        DELETE FROM maschinen
        WHERE maschinen_id = 4;  -- oder eine andere passende Bedingung
        ```

        **C)** Die Spalte heißt `name`, nicht `maschine` → Fehler oder keine Zeilen betroffen!

        ```sql
        -- Richtig wäre:
        UPDATE maschinen
        SET typ = 'CNC-Fräse'
        WHERE name LIKE '%Alpha%';
        ```

???+ question "Aufgabe 4: Berechnungen"

    1. Erhöhe das Anschaffungsjahr aller Maschinen in Halle B um 1
    2. Ändere alle Standort-Namen: Ersetze "Halle" durch "Produktionshalle"

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1. Anschaffungsjahr um 1 erhöhen
        UPDATE maschinen
        SET anschaffungsjahr = anschaffungsjahr + 1
        WHERE standort = 'Halle B';

        -- 2. Standort-Namen ändern
        UPDATE maschinen
        SET standort = REPLACE(standort, 'Halle', 'Produktionshalle');
        ```

---


## Zusammenfassung 📌

In diesem Kapitel haben wir das CRUD Konzept kennengelernt und dabei folgende Erkenntnisse gewonnen: 

- `INSERT` fügt neue Datensätze hinzu - entweder einzeln oder mehrere gleichzeitig
- `UPDATE` ändert bestehende Datensätze - **IMMER mit WHERE** (außer du willst wirklich alle ändern)
- `DELETE` löscht Datensätze **dauerhaft** - **IMMER mit WHERE** (außer du willst wirklich alle löschen)
- **Es gibt kein "Rückgängig"** bei UPDATE und DELETE - einmal ausgeführt, sind die Daten verloren!
- WHERE-Klausel vergessen = potentielle Katastrophe!

---

Nun geht es weiter! Im nächsten Kapitel lernen wir **Datenmodellierung & Beziehungen** kennen - wie man Daten in einer Datenbank organisiert und Beziehungen zwischen Tabellen herstellt!

<div style="text-align: center;">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXFxZ3V5dWxsZWwyOHJrOGdvZmtvZjR6dGZoZ2JoZmpoZmpoZmpoZmpoZGwmZXA9djFfZ2lmc19zZWFyY2gmY3Q9Zw/xT9IgzoKnwFNmISR8I/giphy.gif" alt="Success" style="width:220px; margin-bottom: 1em;">
</div>
