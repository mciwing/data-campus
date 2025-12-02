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

???+ info "Datenbank-Setup"

    Für die Beispiele in diesem Kapitel verwenden wir eine **Lagerverwaltungs-Datenbank** (`lager_db`), die typische Artikel in einem Warenlager verwaltet. Diese Datenbank hilft uns, die verschiedenen Manipulationsoperationen praxisnah zu üben.

    ```sql
    -- Datenbank erstellen
    CREATE DATABASE lager_db;

    -- Zur Datenbank wechseln
    \c lager_db

    -- Tabelle für Artikel erstellen
    CREATE TABLE artikel (
        artikel_id INTEGER PRIMARY KEY,
        artikelname VARCHAR(100),
        kategorie VARCHAR(50),
        bestand INTEGER,
        mindestbestand INTEGER,
        preis NUMERIC(10,2),
        lagerort VARCHAR(50)
    );

    -- Beispieldaten einfügen
    INSERT INTO artikel (artikel_id, artikelname, kategorie, bestand, mindestbestand, preis, lagerort)
    VALUES
        (1, 'Schrauben M6x20', 'Befestigungsmaterial', 5000, 1000, 0.05, 'Regal A1'),
        (2, 'Muttern M6', 'Befestigungsmaterial', 4500, 1000, 0.03, 'Regal A1'),
        (3, 'Kugellager 6201', 'Maschinenteile', 150, 50, 12.50, 'Regal B3'),
        (4, 'Dichtungsring 50mm', 'Dichtungen', 800, 200, 1.20, 'Regal C2'),
        (5, 'Hydraulikoel 5L', 'Betriebsstoffe', 45, 20, 25.00, 'Gefahrstofflager'),
        (6, 'Schmierfett 1kg', 'Betriebsstoffe', 60, 15, 18.50, 'Regal D1'),
        (7, 'Zahnriemen HTD-5M', 'Maschinenteile', 25, 10, 35.00, 'Regal B2'),
        (8, 'Sicherungsring 25mm', 'Befestigungsmaterial', 1200, 300, 0.15, 'Regal A2');
    ```

    **Hinweis:** Diese Lagerverwaltung wird für alle Beispiele in diesem Kapitel verwendet.

---

## Daten einfügen mit `INSERT`

Wir kennen **INSERT** bereits aus dem [vorherigen Kapitel](relational.md#daten-einfugen-insert), doch nun wollen wir hier nochmal die wichtigsten Grundlagen wiederholen und erweitern.

Mit `INSERT` fügen wir neue Datensätze in eine Tabelle ein. Es gibt verschiedene Varianten, je nachdem wie viele Datensätze wir einfügen möchten und welche Spalten wir befüllen wollen.

```sql { .yaml .no-copy }
INSERT INTO tabellenname (spalte1, spalte2, spalte3)
VALUES (wert1, wert2, wert3);
```

???+ example "Mehrere Artikel gleichzeitig einfügen"

    ```sql
    -- Mehrere Artikel gleichzeitig einfügen
    INSERT INTO artikel (artikel_id, artikelname, kategorie, bestand, mindestbestand, preis, lagerort)
    VALUES
        (9, 'Keilriemen A-13', 'Maschinenteile', 80, 20, 8.50, 'Regal B2'),
        (10, 'Gewindestange M10', 'Befestigungsmaterial', 300, 100, 2.40, 'Regal A3'),
        (11, 'O-Ring 30mm', 'Dichtungen', 500, 150, 0.80, 'Regal C1');
    ```

    ```{.cmd .no-copy title="Output"}
    INSERT 0 3
    ```

    **Erklärung:** Mehrere Datensätze werden mit einem einzigen INSERT-Befehl eingefügt - effizienter als einzelne INSERT-Befehle.

???+ question "Fehlende Werte"

    Was passiert eigentlich, wenn man nicht alle Spalten befüllt? Probieren wir es aus und sehen, was passiert:

    1. Wir fügen einen neuen Artikel hinzu, aber **lassen die Spalte `lagerort` weg**:
       ```sql
       INSERT INTO artikel (artikel_id, artikelname, kategorie, bestand, mindestbestand, preis)
       VALUES (12, 'Distanzhuelse 15mm', 'Maschinenteile', 200, 50, 1.50);
       ```

    2. Wir fügen einen weiteren Artikel hinzu und setzen `lagerort` **explizit auf NULL**:
       ```sql
       INSERT INTO artikel (artikel_id, artikelname, kategorie, bestand, mindestbestand, preis, lagerort)
       VALUES (13, 'Passfeder 8x7x28', 'Maschinenteile', 150, 40, 0.90, NULL);
       ```

    3. Wir prüfen mit `SELECT`, welche Werte die beiden Artikel für `lagerort` haben:
       ```sql
       SELECT * FROM artikel WHERE artikel_id IN (12, 13);
       ```

    **Fragen zum Nachdenken:**

    - Was steht in der `lagerort`-Spalte bei Artikel 12?
    - Was steht in der `lagerort`-Spalte bei Artikel 13?
    - Gibt es einen Unterschied? Warum (nicht)?


    ??? info "Lösung"

        **Beobachtung:** Beide Artikel haben wahrscheinlich `NULL` als Lagerort (es wird nichts angezeigt).

        **Erklärung:**

        - **Artikel 12:** Die Spalte `lagerort` wurde **weggelassen** → Sie enthält den Wert `NULL`
        - **Artikel 13:** Die Spalte `lagerort` wurde **explizit auf NULL gesetzt** → Sie enthält den Wert `NULL`

Wir haben gesehen, dass in unserem Fall beide Vorgehen zum gleichen Ergebnis führen. Doch gibt es auch einen Unterschied? Ja, den kann es geben. Doch dafür müssen wir uns nochmals genauer ansehen, wie wir die Tabelle erstellt haben.

### `DEFAULT`-Werte

Beim Erstellen einer Tabelle können wir für Spalten **Standardwerte** definieren. Diese werden automatisch verwendet, wenn beim `INSERT` kein Wert angegeben wird.

```sql hl_lines="6"
CREATE TABLE tabellenname (
    spalte1 typ PRIMARY KEY,
    spalte2 typ,
    spalte3 typ,
    ...
    spalteN typ DEFAULT 'Wert'  -- Standardwert definiert!
);
```

Standardwerte sind besonders nützlich für:

- Status-Felder (z.B. Standard: 'Aktiv')
- Zeitstempel (z.B. Standard: aktuelles Datum)
- Zähler (z.B. Standard: 0)
- Flags (z.B. Standard: FALSE)


???+ question "`DEFAULT`-Werte in Aktion"

    Probieren wir `DEFAULT`-Werte praktisch aus! Erstelle eine neue Tabelle `werkzeuge` mit `DEFAULT`-Werten:

    ```sql hl_lines="5 6 7 8"
    -- Neue Tabelle mit DEFAULT-Werten erstellen
    CREATE TABLE werkzeuge (
        werkzeug_id INTEGER PRIMARY KEY,
        werkzeugname VARCHAR(100),
        kategorie VARCHAR(50) DEFAULT 'Allgemein',
        anzahl INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'Verfuegbar',
        standort VARCHAR(50) DEFAULT 'Werkzeugausgabe'
    );
    ```

    Testen wir nun wieder die verschiedene INSERT-Szenarien von zuvor: 

    1. Wir fügen ein neues Werkzeug hinzu, aber lassen die Spalten `kategorie`, `anzahl`, `status` und `standort` weg.

        ```sql
        -- Test 1: Alle Spalten weglassen (außer Pflichtfelder)
        INSERT INTO werkzeuge (werkzeug_id, werkzeugname)
        VALUES (1, 'Akkuschrauber');
        ```
    
    2. Wir fügen ein weiteres Werkzeug hinzu und setzen die Spalte `anzahl` **explizitauf `NULL`**.

        ```sql
        -- Test 2: Nur manche Spalten angeben
        INSERT INTO werkzeuge (werkzeug_id, werkzeugname, anzahl)
        VALUES (2, 'Hammer', NULL);
        ```

    3. Wir prüfen mit `SELECT`, welche Werte die beiden Werkzeuge für `anzahl` haben.

        ```sql
        SELECT * FROM werkzeuge WHERE werkzeug_id IN (1, 2);
        ```
    
    **Fragen zum Nachdenken:**

    - Wie sieht das Ergebnis nun aus?
    - Wie unterscheidet es sich von dem, was wir zuvor gesehen haben?

    ??? info "Lösung"

        <div style="text-align:center; max-width:100%; margin:16px auto; overflow-x:auto;">
        <table role="table" style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
            <thead>
            <tr style="background:#009485; color:#fff;">
                <th style="text-align:left; padding:12px 14px;">ID</th>
                <th style="text-align:left; padding:12px 14px;">Werkzeugname</th>
                <th style="text-align:left; padding:12px 14px;">Kategorie</th>
                <th style="text-align:left; padding:12px 14px;">Anzahl</th>
                <th style="text-align:left; padding:12px 14px;">Status</th>
                <th style="text-align:left; padding:12px 14px;">Standort</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="padding:10px 14px;">1</td>
                <td style="padding:10px 14px;">Akkuschrauber</td>
                <td style="background:#00948511; padding:10px 14px;"><strong>Allgemein</strong> (DEFAULT)</td>
                <td style="background:#00948511; padding:10px 14px;"><strong>0</strong> (DEFAULT)</td>
                <td style="background:#00948511; padding:10px 14px;"><strong>Verfuegbar</strong> (DEFAULT)</td>
                <td style="background:#00948511; padding:10px 14px;"><strong>Werkzeugausgabe</strong> (DEFAULT)</td>
            </tr>
            <tr>
                <td style="padding:10px 14px;">2</td>
                <td style="padding:10px 14px;">Hammer</td>
                <td style="background:#00948511; padding:10px 14px;"><strong>Allgemein</strong> (DEFAULT)</td>
                <td style="padding:10px 14px;">NULL</td>
                <td style="background:#00948511; padding:10px 14px;"><strong>Verfuegbar</strong> (DEFAULT)</td>
                <td style="background:#00948511; padding:10px 14px;"><strong>Werkzeugausgabe</strong> (DEFAULT)</td>
            </tr>
            </tbody>
        </table>
        </div>

        **Beobachtungen:**

        - **Zeile 1:** Alle nicht angegebenen Spalten haben ihre DEFAULT-Werte bekommen
        - **Zeile 2:** `anzahl` wurde explizit mit `NULL` angegeben, die restlichen Spalten bekamen DEFAULT-Werte

Wir sehen also, dass es nun einen Unterschied macht, ob wir eine Spalte explizit mit `NULL` oder weglassen.

<div style="text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem;">
<div class="tenor-gif-embed" data-postid="139477105926016648" data-share-method="host" data-aspect-ratio="1.49306" data-width="50%"><a href="https://tenor.com/view/the-office-michael-scott-steve-carell-told-you-wink-gif-139477105926016648">The Office Michael Scott GIF</a>from <a href="https://tenor.com/search/the+office-gifs">The Office GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
</div>


Doch wenn wir uns ehrlich sind, dann haben wir uns mit der expliziten Angabe von `NULL` unsere schönen `DEFAULT`-Werte umgangen. Und da wir mit den `DEFAULT`-Werten ja vermeiden wollten, dass wir fehlende Werte in gewissen Spalten haben, sind wir noch nicht ganz zufrieden damit. 

### Pflichtfeld mit `NOT NULL`

Und genau an dieser Stelle kommt die Einschränkung `NOT NULL` ins Spiel. Mit `NOT NULL` können wir festlegen, dass eine Spalte **niemals leer** sein darf. Jede Zeile **muss** einen Wert in dieser Spalte haben.
Man kann `NOT NULL` und `DEFAULT` auch kombinieren und dies macht in den meisten Fällen auch Sinn.

```sql hl_lines="6 7" 
CREATE TABLE tabellenname (
    spalte1 typ PRIMARY KEY,
    spalte2 typ,
    spalte3 typ,
    ...
    spalteN-1 typ NOT NULL, -- Pflichtfeld
    spalteN typ NOT NULL DEFAULT 'Wert'  -- Pflicht + Standardwert
);
```

**Vorteile:**

- Die Spalte darf nie `NULL` sein (Vorteil bei Datenqualität!)
- Wenn man die Spalte beim `INSERT` weglässt, wird der `DEFAULT`-Wert verwendet
- Man muss die Spalte beim `INSERT` nicht angeben


???+ question "`NOT NULL` in Aktion"

    Probieren wir die `NOT NULL`-Einschränkung praktisch aus! Erstelle eine neue Tabelle `werkzeuge_clean` mit `DEFAULT`-Werten und `NOT NULL`-Einschränkungen:

    ```sql hl_lines="5 6 7 8"
    -- Neue Tabelle mit DEFAULT-Werten erstellen
    CREATE TABLE werkzeuge_clean (
        werkzeug_id INTEGER PRIMARY KEY,
        werkzeugname VARCHAR(100),
        kategorie VARCHAR(50) NOT NULL,
        anzahl INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'Verfuegbar',
        standort VARCHAR(50) DEFAULT 'Werkzeugausgabe'
    );
    ```

    Testen wir nun wieder verschiedene INSERT-Szenarien von zuvor: 

    1. Wir fügen ein neues Werkzeug hinzu, aber lassen die Spalten `kategorie`, `anzahl`, `status` und `standort` weg.

        ```sql
        INSERT INTO werkzeuge_clean (werkzeug_id, werkzeugname)
        VALUES (1, 'Akkuschrauber');
        ```
    
    2. Wir fügen ein neues Werkzeug hinzu, aber lassen die Spalten `anzahl`, `status` und `standort` weg.

        ```sql
        INSERT INTO werkzeuge_clean (werkzeug_id, werkzeugname, kategorie)
        VALUES (2, 'Schlagbohrmaschine', 'Elektrowerkzeug');
        ```
    
    3. Wir fügen ein weiteres Werkzeug hinzu und setzen die Spalte `anzahl` **explizitauf `NULL`**.

        ```sql
        INSERT INTO werkzeuge_clean (werkzeug_id, werkzeugname, kategorie, anzahl)
        VALUES (3, 'Hammer', 'Handwerkzeug', NULL);
        ```

    4. Wir prüfen mit `SELECT`, welche Werte die beiden Werkzeuge für `anzahl` haben.

        ```sql
        SELECT * FROM werkzeuge_clean;
        ```
    
    **Fragen zum Nachdenken:**

    - Wie sieht das Ergebnis nun aus?
    - Wie unterscheidet es sich von dem, was wir zuvor gesehen haben?

    ??? info "Lösung"
        **Beobachtungen:**

        - Bei Aufgabe 1 erhalten wir einen Fehler, da wir die Spalte `kategorie` nicht angegeben haben, diese aber mit `NOT NULL` eingeschränkt ist. Auch `anzahl` wurde nicht angegeben und ist mit `NOT NULL` eingeschränkt. Aber, da wir hier einen `DEFAULT`-Wert haben, würde hier der Wert `0` eingetragen werden.
        - Aufgabe 2 funktioniert, da wir auch die Spalte `kategorie` angegeben haben. Alle fehlenden Spalten besitzten einen `DEFAULT`-Wert und werden daher mit diesen Werten eingetragen.
        - Aufgabe 3 bringt auch wieder einen Fehler. Dieses mal bewirkt die Spalte `anzahl` einen Fehler, da sie mit `NOT NULL` eingeschränkt ist und explizit mit `NULL` gesetzt wurde.


Wir haben nun mit `DEFAULT` und `NOT NULL` zwei Werkzeuge kennengelernt, welche uns helfen unsere Datenbank konsistent und sauber zu halten. 


  


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

<div style="text-align: center;">
    <img src="https://www.blazesql.com/images/memes/wrong_db.jpeg" alt="Affected" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://www.blazesql.com/images/memes/wrong_db.jpeg">blazesql</a></figcaption>
</div>

???+ example "Einzelner Datensatz ändern"

    ```sql
    -- Safety Check
    SELECT artikel_id, artikelname, lagerort FROM artikel WHERE artikel_id = 3;
    ```
    ```{.cmd .no-copy title="Output"}
     artikel_id |   artikelname   | lagerort
    ------------+-----------------+----------
              3 | Kugellager 6201 | Regal B3
    (1 row)
    ```

    Wir überprüfen zuerst, ob wir wirklich den richtigen Artikel finden. Wenn ja, können wir mit dem `UPDATE` beginnen.


    ```sql
    -- Kugellager 6201 wurde umgelagert und Bestand korrigiert
    UPDATE artikel
    SET lagerort = 'Regal B5',
        bestand = 175
    WHERE artikel_id = 3;
    ```

    ```{.cmd .no-copy title="Output"}
    UPDATE 1
    ```

    **Erklärung:** Mit Kommas getrennt können mehrere Spalten gleichzeitig geändert werden.

    ??? code "weitere Beispiele"

        **Mehrere Datensätze ändern**

        ```sql
        -- Alle Befestigungsmaterialien in Regal A1 auf Mindestbestand 800 setzen
        UPDATE artikel
        SET mindestbestand = 800
        WHERE kategorie = 'Befestigungsmaterial' AND lagerort = 'Regal A1';
        ```

        **Erklärung:** Alle Datensätze, die die WHERE-Bedingung erfüllen, werden geändert - in diesem Fall alle Befestigungsmaterialien in Regal A1.




---


### Erweiterte `UPDATE`-Techniken

Neben einfachen Wertzuweisungen können wir in `UPDATE` auch Berechnungen durchführen und String-Operationen anwenden.

**Numerische Berechnungen**

Wir können mit dem aktuellen Wert rechnen und daraus den neuen Wert berechnen:

???+ example "Numerische Berechnungen im `UPDATE`"

    ```sql
    -- Safety Check
    SELECT * FROM artikel WHERE kategorie = 'Maschinenteile';
    ```	

    ```{.cmd .no-copy title="Output"}
     artikel_id |    artikelname     |   kategorie    | bestand | mindestbestand | preis | lagerort
    ------------+--------------------+----------------+---------+----------------+-------+----------
              7 | Zahnriemen HTD-5M  | Maschinenteile |      25 |             10 | 35.00 | Regal B2
              9 | Keilriemen A-13    | Maschinenteile |      80 |             20 |  8.50 | Regal B2
             12 | Distanzhuelse 15mm | Maschinenteile |     200 |             50 |  1.50 |
             13 | Passfeder 8x7x28   | Maschinenteile |     150 |             40 |  0.90 |
              3 | Kugellager 6201    | Maschinenteile |     175 |             50 | 12.50 | Regal B5
    (5 rows)
    ```

    Nun können wir beispielsweise den Preis für alle Maschinenteile um 10% erhöhen.
    
    ```sql
    -- Alle Preise um 10% erhöhen (z.B. Inflationsanpassung)
    UPDATE artikel
    SET preis = preis * 1.10
    WHERE kategorie = 'Maschinenteile';
    ```

    **Erklärung:** Der neue Wert wird aus dem alten Wert * 1.10 berechnet (Erhöhung um 10%).


**String-Operationen**

SQL bietet verschiedene Funktionen zur Bearbeitung von Textwerten. Eine gute Übersicht findet man [hier](fortgeschritten.md#string-funktionen).

???+ example "String-Operationen im `UPDATE`"

    Stellen wir uns vor, die Lagerorte haben neue Namen bekommen. Anstelle von "Regal A1" soll "Lagerplatz A1" stehen.

    ```sql
    -- 'Regal' durch 'Lagerplatz' ersetzen
    UPDATE artikel
    SET lagerort = REPLACE(lagerort, 'Regal', 'Lagerplatz');
    ```

    Mit einer kleinen Abfrage überprüfen wir, ob alle Änderungen richtig durchgeführt wurden.

    ```sql
    SELECT artikel_id, artikelname, lagerort FROM artikel;
    ```

    ```{.cmd .no-copy title="Output"}
     artikel_id |     artikelname     |     lagerort
    ------------+---------------------+------------------
              4 | Dichtungsring 50mm  | Lagerplatz C2
              5 | Hydraulikoel 5L     | Gefahrstofflager
              6 | Schmierfett 1kg     | Lagerplatz D1
              8 | Sicherungsring 25mm | Lagerplatz A2
             10 | Gewindestange M10   | Lagerplatz A3
             11 | O-Ring 30mm         | Lagerplatz C1
              1 | Schrauben M6x20     | Lagerplatz A1
              2 | Muttern M6          | Lagerplatz A1
              7 | Zahnriemen HTD-5M   | Lagerplatz B2
              9 | Keilriemen A-13     | Lagerplatz B2
             12 | Distanzhuelse 15mm  |
             13 | Passfeder 8x7x28    |
              3 | Kugellager 6201     | Lagerplatz B5
    (13 rows)
    ```

    ??? code "weitere Beispiele"

        **Kategorie-Prefix zum Artikelnamen hinzufügen**

        ```sql
        -- Kategorie-Prefix zum Artikelnamen hinzufügen
        UPDATE artikel
        SET artikelname = CONCAT(kategorie, ': ', artikelname)
        WHERE kategorie = 'Maschinenteile';
        ```

        **Erklärung:** Der neue Wert wird aus dem alten Wert und der Kategorie berechnet.

        ---

        **Kategorie in Großbuchstaben umwandeln**

        ```sql
        -- Kategorie in Großbuchstaben umwandeln
        UPDATE artikel
        SET kategorie = UPPER(kategorie);
        ```

        **Erklärung:** Der neue Wert besteht aus dem alten Wert in Großbuchstaben.

        ---

        **Führende/abschließende Leerzeichen entfernen**
        
        ```sql
        -- Führende/abschließende Leerzeichen entfernen
        UPDATE artikel
        SET artikelname = TRIM(artikelname);
        ```

        **Erklärung:** Der neue Wert besteht aus dem alten Wert ohne führende und abschließende Leerzeichen.


---

## Daten löschen mit `DELETE`

Nun sind wir am Ende unserer CRUD-Reihe angelangt. Mit **D**elete lernen wir nun kennen, wie wir Datensätze **dauerhaft** aus einer Tabelle löschen können. 


```sql { .yaml .no-copy }
DELETE FROM tabellenname
WHERE bedingung;
```

Wie auch bei `UPDATE` zuvor ist es extrem wichtig, dass wir `DELETE` in Kombination mit der `WHERE`-Klausel verwenden. Ohne diese, werden alle Datensätze in der Tabelle gelöscht. Auch hier gibt es **kein Zurück**.

???+ example "Artikel löschen"

    Wir möchten nun den Artikel mit der ID 8 löschen. Dazu überprüfen wir zuerst, ob wir wirklich den richtigen Artikel finden.

    ```sql
    -- Safety Check
    SELECT artikel_id, artikelname, lagerort FROM artikel WHERE artikel_id = 8;
    ```

    ```{.cmd .no-copy title="Output"}
     artikel_id |     artikelname     |   lagerort
    ------------+---------------------+---------------
              8 | Sicherungsring 25mm | Lagerplatz A2
    (1 row)
    ```

    Wenn wir wirklich den richtigen Artikel finden, können wir mit dem `DELETE` beginnen.

    ```sql
    -- Artikel mit ID 8 löschen (z.B. weil nicht mehr geführt)
    DELETE FROM artikel
    WHERE artikel_id = 8;
    ```

    ```{.cmd .no-copy title="Output"}
    DELETE 1
    ```

    **Erklärung:** Die `WHERE`-Klausel sorgt dafür, dass nur der Artikel mit ID 8 gelöscht wird. Da es sich bei der ID um den Primärschlüssel handelt, wird nur dieser Datensatz gelöscht. Dies ist der sicherste Weg, um einen Datensatz zu löschen.

    ??? code "weitere Beispiele"
        
        **Alle Artikel mit Bestand 0 löschen**

        ```sql
        -- Alle Artikel mit Bestand 0 löschen (z.B. ausgelaufene Artikel)
        DELETE FROM artikel
        WHERE bestand = 0;
        ```

        **Erklärung:** Alle Datensätze, die die WHERE-Bedingung erfüllen, werden gelöscht.

        ---

        **Artikel in Regal C2 mit Bestand unter Mindestbestand löschen**

        ```sql
        -- Artikel in Regal C2 mit Bestand unter Mindestbestand löschen
        DELETE FROM artikel
        WHERE lagerort = 'Regal C2' AND bestand < mindestbestand;
        ```

        **Erklärung:** Beide Bedingungen müssen erfüllt sein (`AND`), damit ein Datensatz gelöscht wird.

        

???+ warning "DELETE vs. DROP"
    Wichtiger Unterschied zwischen zwei ähnlich klingenden Befehlen:

    - `DELETE FROM tabelle;` - Löscht alle **Zeilen**, die Tabellenstruktur bleibt bestehen
    

        ```sql
        -- DELETE: Tabelle bleibt, aber ist leer
        DELETE FROM artikel;
        SELECT * FROM artikel;  -- Funktioniert, gibt 0 Zeilen zurück
        ```

        ```{.cmd .no-copy title="Output"}
         artikel_id | artikelname | kategorie | bestand | mindestbestand | preis | lagerort
        ------------+-------------+-----------+---------+----------------+-------+----------
        (0 rows)
        ```
    - `DROP TABLE tabelle;` - Löscht die **gesamte Tabelle** inklusive Struktur und allen Daten
        ```sql
        -- DROP: Tabelle existiert nicht mehr
        DROP TABLE artikel;
        SELECT * FROM artikel;  -- FEHLER: Tabelle existiert nicht
        ```

        ```{.cmd .no-copy title="Output"}
        FEHLER:  Relation »artikel« existiert nicht
        LINE 1: SELECT * FROM artikel;
                            ^
        ```

---

## Exkurs: `ALTER` - Tabellen nachträglich ändern

Bisher haben wir gelernt, wie man Daten manipuliert (**INSERT**, **UPDATE**, **DELETE**). Doch was passiert, wenn sich die **Anforderungen ändern** und wir die Tabellenstruktur selbst anpassen müssen?

Stell dir vor:

- Du möchtest eine **neue Spalte** hinzufügen (z.B. "email" für Kunden)
- Du musst eine **Spalte umbenennen** (z.B. "name" → "kundenname")
- Du willst eine **Spalte löschen** (z.B. nicht mehr benötigte Daten)
- Du musst den **Datentyp ändern** (z.B. VARCHAR(50) → VARCHAR(100))

Für all diese Änderungen verwenden wir den `ALTER TABLE` Befehl.

???+ danger "Wichtiger Hinweis"
    `ALTER TABLE` ändert die Tabellenstruktur **dauerhaft**! Bei Produktivdatenbanken solltest du vorher **Backups** anlegen und Änderungen zunächst in einer Testumgebung testen.

---

### Spalten bearbeiten

Mit `ALTER TABLE` können wir nachträglich Spalten zu einer bestehenden Tabelle hinzufügen, löschen oder umbenennen. Der Syntax ist wie folgt:

```sql { .yaml .no-copy }
ALTER TABLE tabellenname
ADD | RENAME | DROP COLUMN spaltenname [datentyp | constraints];
```

Die Anweisung startet mit `ALTER TABLE` und dem Tabellennamen. Es folgt die Aktion (`ADD`, `RENAME`, `DROP`) inklusive `COLUMN` und der Spaltenname. Bei bedarf können auch noch der Datentyp und die Constraints angegeben werden.

???+ example "Neue Spalte hinzufügen"

    Wir möchten zu unseren Artikeln eine **Email-Adresse des Lieferanten** hinzufügen. Da wir die gesamte Tabelle zuvor bereits gelöscht haben, müssen wir diese erneut erstellen (siehe Datenbank-Setup am Anfang des Kapitels).

    ```sql
    -- Neue Spalte für Lieferanten-Email hinzufügen
    ALTER TABLE artikel
    ADD COLUMN lieferant_email VARCHAR(100);
    ```

    ```{.cmd .no-copy title="Output"}
    ALTER TABLE
    ```

    Wir können die Tabellenstruktur mit folgendem psql Befehl überprüfen:

    ```sql
    \d artikel
    ```

    Die neue Spalte `lieferant_email` ist jetzt sichtbar. **Alle bestehenden Zeilen** haben für diese Spalte den Wert `NULL`.

    **Mit Constraints und DEFAULT:**

    ```sql
    -- Spalte mit DEFAULT-Wert hinzufügen
    ALTER TABLE artikel
    ADD COLUMN gepruefte_qualitaet BOOLEAN DEFAULT FALSE;

    -- Spalte mit NOT NULL und DEFAULT hinzufügen
    ALTER TABLE artikel
    ADD COLUMN hersteller VARCHAR(100) NOT NULL DEFAULT 'Unbekannt';
    ```

    ??? code "weitere Beispiele"
    
        ??? example "Spalte umbenennen"

            Der Name "artikelname" ist zu generisch. Wir möchten ihn in "produktbezeichnung" umbenennen:

            ```sql
            -- Spaltenname ändern
            ALTER TABLE artikel
            RENAME COLUMN artikelname TO produktbezeichnung;
            ```

            ```{.cmd .no-copy title="Output"}
            ALTER TABLE
            ```

            **Wichtig:** Alle Abfragen, die den alten Spaltennamen verwenden, funktionieren danach nicht mehr!

            ```sql
            -- Funktioniert nicht mehr:
            SELECT artikelname FROM artikel;  -- ❌ FEHLER

            -- Funktioniert:
            SELECT produktbezeichnung FROM artikel;  -- ✅
            ```

        ??? example "Spalte löschen"

            Die Spalte `lieferant_email` wird doch nicht benötigt:

            ```sql
            -- Spalte löschen
            ALTER TABLE artikel
            DROP COLUMN lieferant_email;
            ```

            ```{.cmd .no-copy title="Output"}
            ALTER TABLE
            ```

            **Achtung:** Alle Daten in dieser Spalte sind **unwiederbringlich verloren**!

            ???+ danger "CASCADE vs. RESTRICT"
                Wenn andere Tabellen auf diese Spalte verweisen (z.B. durch Foreign Keys), musst du entscheiden:

                ```sql
                -- Fehler, wenn Abhängigkeiten bestehen (sicherer!)
                ALTER TABLE artikel DROP COLUMN spalte RESTRICT;

                -- Löscht auch abhängige Objekte (gefährlich!)
                ALTER TABLE artikel DROP COLUMN spalte CASCADE;
                ```

---

### Datentyp ändern

Mit `ALTER TABLE ... ALTER COLUMN ... TYPE` können wir den Datentyp einer Spalte ändern.

```sql { .yaml .no-copy }
ALTER TABLE tabellenname
ALTER COLUMN spaltenname TYPE neuer_datentyp;
```

???+ example "Datentyp ändern"

    Die `kategorie`-Spalte ist aktuell `VARCHAR(50)`, aber wir brauchen mehr Platz:

    ```sql
    -- Datentyp von VARCHAR(50) auf VARCHAR(150) ändern
    ALTER TABLE artikel
    ALTER COLUMN kategorie TYPE VARCHAR(150);
    ```

    ```{.cmd .no-copy title="Output"}
    ALTER TABLE
    ```

???+ warning "Datenkonvertierung"
    Wenn bereits Daten in der Spalte vorhanden sind, versucht die Datenbank, diese in den neuen Datentyp zu konvertieren. Dies kann zu Fehlern führen, wenn die Daten nicht kompatibel sind (z.B. Text in eine Integer-Spalte umwandeln). Im Erfolgsfall werden die Daten entsprechend dem neuen Typ angepasst. Sei hier besonders vorsichtig und teste solche Änderungen immer zuerst in einer Testumgebung!

---

### Beschränkungen ändern

Neben dem Datentyp können wir auch Beschränkungen welche wir in diesem Kapitel kennengelernt haben (`DEFAULT`, `NOT NULL`) ändern.

```sql { .yaml .no-copy }
-- NOT NULL hinzufügen
ALTER TABLE tabellenname
ALTER COLUMN spaltenname SET NOT NULL;

-- NOT NULL entfernen
ALTER TABLE tabellenname
ALTER COLUMN spaltenname DROP NOT NULL;

-- DEFAULT hinzufügen/ändern
ALTER TABLE tabellenname
ALTER COLUMN spaltenname SET DEFAULT wert;

-- DEFAULT entfernen
ALTER TABLE tabellenname
ALTER COLUMN spaltenname DROP DEFAULT;
```

Hierbei ist zu beachten, dass wenn wir ein `DEFAULT` hinzufügen oder ändern, dieser nur für neue Zeilen gilt. Bestehende Zeilen werden nicht geändert. Bei Änderungen von `NOT NULL` müssen wir zuerst die NULL-Werte beheben. Ansonsten wird ein Fehler beim Hinzufügen der NOT NULL-Einschränkung auftreten.

???+ example "NOT NULL hinzufügen"

    Wir möchten sicherstellen, dass jeder Artikel eine Kategorie hat:

    ```sql
    -- Erst prüfen, ob NULL-Werte existieren
    SELECT COUNT(*) FROM artikel WHERE kategorie IS NULL;
    ```

    ```{.cmd .no-copy title="Output"}
     count
    -------
         0
    ```

    Wenn keine NULL-Werte vorhanden sind, können wir NOT NULL hinzufügen:

    ```sql
    -- NOT NULL-Einschränkung hinzufügen
    ALTER TABLE artikel
    ALTER COLUMN kategorie SET NOT NULL;
    ```

    ??? code "weitere Beispiele"

        ???+ example "DEFAULT hinzufügen"

            ```sql
            -- DEFAULT-Wert für mindestbestand setzen
            ALTER TABLE artikel
            ALTER COLUMN mindestbestand SET DEFAULT 100;
            ```

            **Wichtig:** Der DEFAULT gilt **nur für neue Zeilen**! Bestehende Zeilen werden **nicht** geändert.

            ```sql
            -- Bestehende Zeilen behalten ihre Werte
            SELECT artikel_id, mindestbestand FROM artikel LIMIT 3;
            ```

            ```{.cmd .no-copy title="Output"}
            artikel_id | mindestbestand
            ------------+----------------
                    1 |           1000
                    2 |           1000
                    3 |             50
            ```

            ```sql
            -- Neue Zeile bekommt DEFAULT-Wert
            INSERT INTO artikel (artikel_id, produktbezeichnung, kategorie, bestand, preis, lagerort)
            VALUES (20, 'Testprodukt', 'Test', 50, 10.00, 'Regal Z1');

            SELECT artikel_id, mindestbestand FROM artikel WHERE artikel_id = 20;
            ```

            ```{.cmd .no-copy title="Output"}
            artikel_id | mindestbestand
            ------------+----------------
                    20 |            100
            ```

---

### Tabelle umbenennen

Mit `ALTER TABLE ... RENAME TO` können wir eine gesamte Tabelle umbenennen.

```sql { .yaml .no-copy }
ALTER TABLE alter_tabellenname
RENAME TO neuer_tabellenname;
```

???+ example "Tabelle umbenennen"

    ```sql
    -- Tabelle "artikel" in "lagerartikel" umbenennen
    ALTER TABLE artikel
    RENAME TO lagerartikel;
    ```

    ```{.cmd .no-copy title="Output"}
    ALTER TABLE
    ```

    Ab jetzt müssen alle Abfragen den neuen Namen verwenden:

    ```sql
    SELECT * FROM lagerartikel;  
    SELECT * FROM artikel;       --  FEHLER: heißt jetzt lagerartikel
    ```

---

???+ info "Mehrere Änderungen kombinieren"

    Mehrere ALTER-Befehle können **nicht** in einem Statement kombiniert werden. Jede Änderung benötigt ein eigenes `ALTER TABLE`.

    ```sql
    -- FALSCH: Funktioniert nicht!
    ALTER TABLE artikel
        ADD COLUMN neue_spalte VARCHAR(50),
        DROP COLUMN alte_spalte;  -- ❌ Syntax-Fehler

    -- RICHTIG: Separate Befehle
    ALTER TABLE artikel ADD COLUMN neue_spalte VARCHAR(50);
    ALTER TABLE artikel DROP COLUMN alte_spalte;
    ```

---

In nachfolgender Tabelle findest du eine Übersicht gängiger ALTER-Befehle.

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Operation</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Befehl</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Spalte hinzufügen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t ADD COLUMN c typ;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Spalte löschen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t DROP COLUMN c;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Spalte umbenennen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t RENAME COLUMN alt TO neu;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Datentyp ändern</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t ALTER COLUMN c TYPE typ;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">NOT NULL setzen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t ALTER COLUMN c SET NOT NULL;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">NOT NULL entfernen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t ALTER COLUMN c DROP NOT NULL;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">DEFAULT setzen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t ALTER COLUMN c SET DEFAULT wert;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">DEFAULT entfernen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE t ALTER COLUMN c DROP DEFAULT;</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Tabelle umbenennen</td>
        <td style="padding:10px 14px;"><code>ALTER TABLE alt RENAME TO neu;</code></td>
    </tr>
    </tbody>
</table>
</div>

---

## Übung ✍️

Nun üben wir wieder an unserem bestehenden Projekt. Die **TecGuy GmbH** möchte ihr Produktionsplanungssystem weiter ausbauen und Daten pflegen.

Im vorherigen Kapitel haben wir Daten **abgefragt und analysiert**. Jetzt lernen wir, wie man Daten **ändert, löscht und Tabellenstrukturen anpasst**.

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

        -- Tabelle für Maschinen erstellen
        CREATE TABLE maschinen (
            maschinen_id INTEGER PRIMARY KEY,
            maschinenname VARCHAR(100),
            maschinentyp VARCHAR(50),
            produktionshalle VARCHAR(50),
            anschaffungsjahr INTEGER,
            maschinenstatus VARCHAR(20),
            wartungsintervall_tage INTEGER
        );

        -- Tabelle für Produktionsaufträge erstellen
        CREATE TABLE produktionsauftraege (
            auftrag_id INTEGER PRIMARY KEY,
            auftragsnummer VARCHAR(20),
            kunde VARCHAR(100),
            produkt VARCHAR(100),
            menge INTEGER,
            startdatum DATE,
            lieferdatum DATE,
            status VARCHAR(20),
            maschinen_id INTEGER
        );

        -- Maschinen-Daten einfügen (aus Kapitel 1 & 2)
        INSERT INTO maschinen VALUES
        (1, 'CNC-Fraese Alpha', 'CNC-Fraese', 'Halle A', 2020, 'Aktiv', 90),
        (2, 'Drehbank Delta', 'Drehbank', 'Halle A', 2018, 'Aktiv', 120),
        (3, 'Presse Gamma', 'Presse', 'Halle B', 2019, 'Wartung', 60),
        (4, 'Schweissroboter Beta', 'Schweissroboter', 'Halle C', 2021, 'Aktiv', 90);

        -- Produktionsaufträge-Daten einfügen (alle 10 aus Kapitel 2)
        INSERT INTO produktionsauftraege VALUES
        (1, 'AUF-2024-001', 'BMW AG', 'Getriebegehäuse', 500, '2024-04-01', '2024-04-15', 'In Produktion', 1),
        (2, 'AUF-2024-002', 'Audi AG', 'Kurbelwelle', 200, '2024-04-10', '2024-04-20', 'Geplant', 2),
        (3, 'AUF-2024-003', 'Mercedes-Benz', 'Pleuelstange', 350, '2024-04-05', '2024-04-18', 'In Produktion', 2),
        (4, 'AUF-2024-004', 'Porsche AG', 'Kolben', 150, '2024-04-12', '2024-04-25', 'Geplant', 4),
        (5, 'AUF-2024-005', 'BMW AG', 'Kurbelwelle', 300, '2024-04-15', '2024-04-22', 'In Produktion', 2),
        (6, 'AUF-2024-006', 'Volkswagen AG', 'Kolben', 400, '2024-04-20', '2024-04-28', 'Geplant', 4),
        (7, 'AUF-2024-007', 'Mercedes-Benz', 'Getriebegehäuse', 250, '2024-04-22', '2024-04-30', 'Abgeschlossen', 1),
        (8, 'AUF-2024-008', 'Audi AG', 'Pleuelstange', 180, '2024-04-08', '2024-04-16', 'Abgeschlossen', 2),
        (9, 'AUF-2024-009', 'Porsche AG', 'Kurbelwelle', 120, '2024-04-28', '2024-05-05', 'Geplant', 2),
        (10, 'AUF-2024-010', 'BMW AG', 'Kolben', 350, '2024-04-12', '2024-04-19', 'In Produktion', 4);
        ```

---

???+ question "Aufgabe 1: UPDATE - Produktionsaufträge aktualisieren"

    In der TecGuy GmbH haben sich Änderungen an Produktionsaufträgen ergeben:

    1. Auftrag **AUF-2024-002** (Audi AG, Kurbelwelle) ist jetzt **"In Produktion"**. Ändere den Status.

    2. Auftrag **AUF-2024-007** (Mercedes-Benz, Getriebegehäuse) wurde mit Verspätung geliefert. Ändere das Lieferdatum auf `'2024-05-02'`.

    3. Alle Aufträge mit Status **"Geplant"** sollen den Status **"In Vorbereitung"** bekommen.

    4. Der Auftrag **AUF-2024-006** (VW, Kolben) wurde auf eine andere Maschine verlegt. Ändere `maschinen_id` auf `1`.

    **Wichtig:** Prüfe immer erst mit `SELECT`, bevor du `UPDATE` ausführst!

    ??? info "💡 Tip anzeigen"
        Bei allen Aufgaben benötigen wir `UPDATE` , `SET` & `WHERE`

        ??? info "⚡Lösung anzeigen"

            1. AUF-2024-002 Status ändern
                ```sql
                SELECT * FROM produktionsauftraege WHERE auftragsnummer = 'AUF-2024-002';  -- Safety check
                UPDATE produktionsauftraege
                SET status = 'In Produktion'
                WHERE auftragsnummer = 'AUF-2024-002';
                ```
            2. AUF-2024-007 Lieferdatum ändern
                ```sql
                SELECT * FROM produktionsauftraege WHERE auftragsnummer = 'AUF-2024-007';  -- Safety check
                UPDATE produktionsauftraege
                SET lieferdatum = '2024-05-02'
                WHERE auftragsnummer = 'AUF-2024-007';
                ```
            3. Alle "Geplant" → "In Vorbereitung"
                ```sql
                SELECT * FROM produktionsauftraege WHERE status = 'Geplant';  -- Safety check
                UPDATE produktionsauftraege
                SET status = 'In Vorbereitung'
                WHERE status = 'Geplant';
                ```
            4. AUF-2024-006 Maschine wechseln
                ```sql
                SELECT * FROM produktionsauftraege WHERE auftragsnummer = 'AUF-2024-006';  -- Safety check
                UPDATE produktionsauftraege
                SET maschinen_id = 1
                WHERE auftragsnummer = 'AUF-2024-006';
                ```

            ```sql
            -- Ergebnis prüfen
            SELECT auftragsnummer, kunde, status, lieferdatum, maschinen_id
            FROM produktionsauftraege
            ORDER BY auftrag_id;
            ```


???+ question "Aufgabe 2: UPDATE - Maschinen aktualisieren"

    In der TecGuy GmbH haben sich Änderungen an Maschinen ergeben:

    1. **Presse Gamma** (ID 3) ist fertig gewartet. Setze den Status auf `'Aktiv'`.

    2. **CNC-Fraese Alpha** (ID 1) geht in Wartung. Ändere den Status auf `'Wartung'`.

    3. **Drehbank Delta** (ID 2) wird verlegt. Ändere die Halle auf `'Halle D'`.

    4. Alle Maschinen in **Halle C** sollen das Wartungsintervall auf `120` Tage verlängert bekommen.

    **Wichtig:** Prüfe immer erst mit `SELECT`, bevor du `UPDATE` ausführst!

    ??? info "💡 Tip anzeigen"
        Bei allen Aufgaben benötigen wir `UPDATE` , `SET` & `WHERE`

        ??? info "⚡Lösung anzeigen"
            1. Presse Gamma Wartung abgeschlossen
                ```sql
                SELECT * FROM maschinen WHERE maschinen_id = 3;  -- Safety check
                UPDATE maschinen
                SET maschinenstatus = 'Aktiv'
                WHERE maschinen_id = 3;
                ```

            2. CNC-Fraese Alpha in Wartung setzen
                ```sql
                SELECT * FROM maschinen WHERE maschinen_id = 1;  -- Safety check
                UPDATE maschinen
                SET maschinenstatus = 'Wartung'
                WHERE maschinen_id = 1;
                ```

            3. Drehbank Delta verlegen
                ```sql
                SELECT * FROM maschinen WHERE maschinen_id = 2;  -- Safety check
                UPDATE maschinen
                SET produktionshalle = 'Halle D'
                WHERE maschinen_id = 2;
                ```

            4. Alle Maschinen in Halle C: Wartungsintervall verlängern
                ```sql
                SELECT * FROM maschinen WHERE produktionshalle = 'Halle C';  -- Safety check
                UPDATE maschinen
                SET wartungsintervall_tage = 120
                WHERE produktionshalle = 'Halle C';
                ```

            ```sql
            -- Ergebnis prüfen
            SELECT * FROM maschinen ORDER BY maschinen_id;
            ```

???+ question "Aufgabe 3: UPDATE mit Berechnungen und String-Operationen"

    Erweiterte UPDATE-Operationen mit Berechnungen und String-Funktionen:

    1. Alle Aufträge mit einer **Menge kleiner als 200** sollen um **50 Stück erhöht** werden. (Berechnung: `menge = menge + 50`)

    2. Alle Produktionshallen in der `maschinen` Tabelle sollen umbenannt werden: Ersetze `'Halle'` durch `'Produktionshalle'`.

    3. Das Wartungsintervall für Maschinen vom Typ `'Drehbank'` soll um **20 Tage verkürzt** werden.

    4. Alle Auftragsnummern sollen das Präfix `'TEC-'` bekommen (z.B. `'AUF-2024-001'` → `'TEC-AUF-2024-001'`).

    **Tipp:** Nutze Berechnungen (`+`, `-`) und String-Funktionen (`REPLACE`, `CONCAT`).

    ??? info "💡 Tip anzeigen"
        1. `UPDATE`, `SET` & `WHERE`
        2. `UPDATE`, `SET` & `REPLACE`
        3. `UPDATE`, `SET` & `WHERE`
        4. `UPDATE`, `SET` & `CONCAT`

        ??? info "⚡Lösung anzeigen"
            1. Kleine Aufträge um 50 Stück erhöhen
                ```sql
                SELECT * FROM produktionsauftraege WHERE menge < 200;  -- Safety check
                UPDATE produktionsauftraege
                SET menge = menge + 50
                WHERE menge < 200;
                ```
            2. Produktionshallen umbenennen
                ```sql
                UPDATE maschinen
                SET produktionshalle = REPLACE(produktionshalle, 'Halle', 'Produktionshalle');
                ```

            3. Wartungsintervall für Drehbänke verkürzen
                ```sql
                SELECT * FROM maschinen WHERE maschinentyp = 'Drehbank';  -- Safety check
                UPDATE maschinen
                SET wartungsintervall_tage = wartungsintervall_tage - 20
                WHERE maschinentyp = 'Drehbank';
                ```
            4. Präfix für alle Auftragsnummern
                ```sql
                UPDATE produktionsauftraege
                SET auftragsnummer = CONCAT('TEC-', auftragsnummer);
                ```
            
            ```sql
            -- Ergebnisse prüfen
            SELECT auftragsnummer, produkt, menge FROM produktionsauftraege ORDER BY auftrag_id;
            SELECT maschinenname, maschinentyp, produktionshalle, wartungsintervall_tage FROM maschinen ORDER BY maschinen_id;
            ```

???+ question "Aufgabe 4: DELETE - Datensätze löschen"

    Die TecGuy GmbH muss Daten bereinigen:

    1. Alle **abgeschlossenen Aufträge** (`status = 'Abgeschlossen'`) sollen aus der Datenbank gelöscht werden.

    2. Lösche die Maschine **Presse Gamma** (ID 3).

    3. Lösche alle Aufträge mit einer **Menge kleiner als 100**.

    **Goldene Regel:** Immer erst `SELECT` mit der gleichen WHERE-Bedingung, dann `DELETE`!

    ??? info "💡 Tip anzeigen"
        Bei allen Aufgaben benötigen wir `DELETE` & `WHERE`

        ??? info "⚡Lösung anzeigen"
            1. Abgeschlossene Aufträge löschen
                ```sql
                SELECT * FROM produktionsauftraege WHERE status = 'Abgeschlossen';  -- Safety check
                DELETE FROM produktionsauftraege WHERE status = 'Abgeschlossen';
                ```

            2. Presse Gamma löschen
                ```sql
                SELECT * FROM maschinen WHERE maschinen_id = 3;  -- Safety check
                DELETE FROM maschinen WHERE maschinen_id = 3;
                ```
            3. Kleine Aufträge löschen (< 100 Stück)
                ```sql
                SELECT * FROM produktionsauftraege WHERE menge < 100;  -- Safety check
                DELETE FROM produktionsauftraege WHERE menge < 100;
                ```
            
            ```sql
            -- Verbleibende Daten anzeigen
            SELECT * FROM produktionsauftraege ORDER BY auftrag_id;
            SELECT * FROM maschinen ORDER BY maschinen_id;
            ```
---

## Zusammenfassung 📌

In diesem Kapitel haben wir das CRUD Konzept kennengelernt und dabei folgende Erkenntnisse gewonnen:

- `INSERT` fügt neue Datensätze hinzu - entweder einzeln oder mehrere gleichzeitig
- `UPDATE` ändert bestehende Datensätze - **IMMER mit WHERE** (außer du willst wirklich alle ändern)
- `DELETE` löscht Datensätze **dauerhaft** - **IMMER mit WHERE** (außer du willst wirklich alle löschen)
- `DEFAULT`-Werte helfen, Standardwerte automatisch zu setzen
- `NOT NULL` stellt sicher, dass wichtige Felder niemals leer sind
- **Es gibt kein "Rückgängig"** bei UPDATE und DELETE - einmal ausgeführt, sind die Daten verloren!
- WHERE-Klausel vergessen = potentielle Katastrophe!

---

Nun geht es weiter! Im nächsten Kapitel lernen wir **Datenmodellierung & Beziehungen** kennen - wie man Daten in einer Datenbank organisiert und Beziehungen zwischen Tabellen herstellt!
