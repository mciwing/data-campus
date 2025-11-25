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

???+ example "Beispiel: Mehrere Artikel gleichzeitig einfügen"

    ```sql
    -- Mehrere Artikel gleichzeitig einfügen
    INSERT INTO artikel (artikel_id, artikelname, kategorie, bestand, mindestbestand, preis, lagerort)
    VALUES
        (9, 'Keilriemen A-13', 'Maschinenteile', 80, 20, 8.50, 'Regal B2'),
        (10, 'Gewindestange M10', 'Befestigungsmaterial', 300, 100, 2.40, 'Regal A3'),
        (11, 'O-Ring 30mm', 'Dichtungen', 500, 150, 0.80, 'Regal C1');
    ```

    ```title="Output"
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

???+ example "Beispiel: Einzelner Datensatz ändern"

    ```sql
    -- Safety Check
    SELECT artikel_id, artikelname, lagerort FROM artikel WHERE artikel_id = 3;
    ```
    ```title="Output"
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

    ```title="Output"
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

???+ example "Beispiel: Numerische Berechnungen im `UPDATE`"

    ```sql
    -- Safety Check
    SELECT * FROM artikel WHERE kategorie = 'Maschinenteile';
    ```	

    ```title="Output"
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

???+ example "Beispiel: String-Operationen im `UPDATE`"

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

    ```title="Output"
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

???+ example "Beispiel"

    Wir möchten nun den Artikel mit der ID 8 löschen. Dazu überprüfen wir zuerst, ob wir wirklich den richtigen Artikel finden.

    ```sql
    -- Safety Check
    SELECT artikel_id, artikelname, lagerort FROM artikel WHERE artikel_id = 8;
    ```

    ```title="Output"
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

    ```title="Output"
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

        ```title="Output"
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
        ```title="Output"
        FEHLER:  Relation »artikel« existiert nicht
        LINE 1: SELECT * FROM artikel;
                            ^
        ```

---

## Übung ✍️

Nun üben wir wieder an unserem bestehenden Projekt. Die **TecGuy GmbH** baut ihr Produktionsplanungssystem weiter aus und benötigt eine Verwaltung für ihre Produktionsmaschinen.

???+ info "Übungsvorbereitung"

    Stelle sicher, dass du zur TecGuy GmbH Datenbank verbunden bist:

    ```sql
    -- Zur Datenbank wechseln
    \c produktionsplanung_db
    ```

???+ question "Aufgabe 1: Tabelle erstellen"

    Erstelle die Tabelle `maschinen` mit folgenden Eigenschaften:

    - `maschinen_id` (INTEGER, PRIMARY KEY)
    - `maschinenname` (VARCHAR(100), Pflichtfeld)
    - `maschinentyp` (VARCHAR(50), Pflichtfeld)
    - `produktionshalle` (VARCHAR(50), Pflichtfeld, DEFAULT `'Halle Zentral'`)
    - `anschaffungsjahr` (INTEGER, Pflichtfeld, DEFAULT `2024`)
    - `maschinenstatus` (VARCHAR(20), Pflichtfeld, DEFAULT `'Aktiv'`)
    - `wartungsintervall_tage` (INTEGER, DEFAULT `90`)

    ??? info "💡 Lösung anzeigen"

        ```sql
        CREATE TABLE maschinen (
            maschinen_id INTEGER PRIMARY KEY,
            maschinenname VARCHAR(100) NOT NULL,
            maschinentyp VARCHAR(50) NOT NULL,
            produktionshalle VARCHAR(50) NOT NULL DEFAULT 'Halle Zentral',
            anschaffungsjahr INTEGER NOT NULL DEFAULT 2024,
            maschinenstatus VARCHAR(20) NOT NULL DEFAULT 'Aktiv',
            wartungsintervall_tage INTEGER DEFAULT 90
        );
        ```

        **Wichtige Konzepte:**

        - **NOT NULL ohne DEFAULT** (`maschinenname`, `maschinentyp`) → **muss** beim INSERT angegeben werden
        - **NOT NULL mit DEFAULT** (`produktionshalle`, `anschaffungsjahr`, `maschinenstatus`) → kann weggelassen werden (bekommt DEFAULT), aber **nicht** explizit NULL
        - **Nur DEFAULT ohne NOT NULL** (`wartungsintervall_tage`) → kann weggelassen werden (bekommt DEFAULT) **oder** explizit NULL

???+ question "Aufgabe 2: Maschinen einfügen"

    Füge Maschinen ein und **teste das Verhalten** von DEFAULT und NOT NULL:

    1. Füge **CNC-Fraese Alpha** (ID: 1) ein:
        - Name: `'CNC-Fraese Alpha'`
        - Typ: `'CNC-Fraese'`
        - **Nur diese beiden Spalten angeben** → Rest soll DEFAULT-Werte bekommen

    2. Füge **Drehbank Beta** (ID: 2) ein:
        - Name: `'Drehbank Beta'`
        - Typ: `'Drehbank'`
        - Halle: `'Halle Nord'` (DEFAULT überschreiben)

    3. Füge **Schweissroboter Gamma** (ID: 3) ein:
        - Name: `'Schweissroboter Gamma'`
        - Typ: `'Schweissroboter'`
        - Halle: `'Halle Sued'`
        - Anschaffungsjahr: `2020`
        - Status: `'Wartung'`
        - Wartungsintervall: `60` Tage

    4. Füge **Lackieranlage Delta** (ID: 4) ein:
        - Name: `'Lackieranlage Delta'`
        - Typ: `'Lackieranlage'`
        - Wartungsintervall: **NULL** (explizit)

    5. **Teste**, was passiert, wenn du versuchst eine Maschine **ohne** `maschinentyp` einzufügen (sollte fehlschlagen!):
        ```sql
        INSERT INTO maschinen (maschinen_id, maschinenname)
        VALUES (99, 'Fehlertest');
        ```

    6. Zeige alle Maschinen an.

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. CNC-Fraese Alpha - nur Pflichtfelder, Rest DEFAULT
        INSERT INTO maschinen (maschinen_id, maschinenname, maschinentyp)
        VALUES (1, 'CNC-Fraese Alpha', 'CNC-Fraese');
        -- Ergebnis: produktionshalle='Halle Zentral', anschaffungsjahr=2024,
        --           maschinenstatus='Aktiv', wartungsintervall_tage=90

        -- 2. Drehbank Beta - DEFAULT teilweise überschreiben
        INSERT INTO maschinen (maschinen_id, maschinenname, maschinentyp, produktionshalle)
        VALUES (2, 'Drehbank Beta', 'Drehbank', 'Halle Nord');

        -- 3. Schweissroboter Gamma - alle Werte explizit
        INSERT INTO maschinen (maschinen_id, maschinenname, maschinentyp, produktionshalle, anschaffungsjahr, maschinenstatus, wartungsintervall_tage)
        VALUES (3, 'Schweissroboter Gamma', 'Schweissroboter', 'Halle Sued', 2020, 'Wartung', 60);

        -- 4. Lackieranlage Delta - wartungsintervall_tage auf NULL
        INSERT INTO maschinen (maschinen_id, maschinenname, maschinentyp, wartungsintervall_tage)
        VALUES (4, 'Lackieranlage Delta', 'Lackieranlage', NULL);
        -- wartungsintervall_tage=NULL (funktioniert, da kein NOT NULL!)

        -- 5. Fehlertest - sollte fehlschlagen
        INSERT INTO maschinen (maschinen_id, maschinenname)
        VALUES (99, 'Fehlertest');
        -- ❌ FEHLER: NULL value in column "maschinentyp" violates not-null constraint

        -- 6. Alle Maschinen anzeigen
        SELECT * FROM maschinen ORDER BY maschinen_id;
        ```

???+ question "Aufgabe 3: UPDATE - Daten aktualisieren"

    In der TecGuy GmbH haben sich Änderungen ergeben:

    1. **CNC-Fraese Alpha** (ID 1) geht in Wartung. Ändere den Status auf `'Wartung'`.

    2. **Drehbank Beta** (ID 2) wird verlegt. Ändere die Halle auf `'Halle West'` **und** das Wartungsintervall auf `120` Tage (beide in einem UPDATE).

    3. **Schweissroboter Gamma** (ID 3) ist fertig gewartet. Setze den Status zurück auf `'Aktiv'`.

    4. Alle Maschinen **ohne** Wartungsintervall (`wartungsintervall_tage IS NULL`) sollen das Standard-Wartungsintervall von `90` Tagen bekommen.

    **Wichtig:** Prüfe immer erst mit `SELECT`, bevor du `UPDATE` ausführst!

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. CNC-Fraese Alpha in Wartung setzen
        SELECT * FROM maschinen WHERE maschinen_id = 1;  -- Safety check
        UPDATE maschinen
        SET maschinenstatus = 'Wartung'
        WHERE maschinen_id = 1;

        -- 2. Drehbank Beta: Halle und Wartungsintervall ändern
        SELECT * FROM maschinen WHERE maschinen_id = 2;  -- Safety check
        UPDATE maschinen
        SET produktionshalle = 'Halle West',
            wartungsintervall_tage = 120
        WHERE maschinen_id = 2;

        -- 3. Schweissroboter Gamma auf Aktiv setzen
        SELECT * FROM maschinen WHERE maschinen_id = 3;  -- Safety check
        UPDATE maschinen
        SET maschinenstatus = 'Aktiv'
        WHERE maschinen_id = 3;

        -- 4. Allen Maschinen ohne Wartungsintervall 90 Tage geben
        SELECT * FROM maschinen WHERE wartungsintervall_tage IS NULL;  -- Safety check
        UPDATE maschinen
        SET wartungsintervall_tage = 90
        WHERE wartungsintervall_tage IS NULL;

        -- Ergebnis prüfen
        SELECT * FROM maschinen ORDER BY maschinen_id;
        ```

???+ question "Aufgabe 4: UPDATE mit Berechnungen und String-Operationen"

    Erweiterte UPDATE-Operationen:

    1. **Alle** Maschinen aus dem Jahr 2024 (DEFAULT-Wert!) wurden tatsächlich 2023 angeschafft. Korrigiere das Anschaffungsjahr indem du **1 Jahr abziehst**.

    2. Das Wartungsintervall für alle Maschinen vom Typ `'CNC-Fraese'` soll um **30 Tage verlängert** werden (aktueller Wert + 30).

    3. Alle Produktionshallen sollen umbenannt werden: Ersetze `"Halle"` durch `"Produktionshalle"`.

    4. Alle Maschinennamen in Hallen die "West" enthalten sollen das Präfix `"West-"` bekommen.

    **Tipp:** Nutze Berechnungen (`+`, `-`) und String-Funktionen (`REPLACE`, `CONCAT`).

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. Anschaffungsjahr korrigieren (2024 → 2023)
        SELECT * FROM maschinen WHERE anschaffungsjahr = 2024;  -- Safety check
        UPDATE maschinen
        SET anschaffungsjahr = anschaffungsjahr - 1
        WHERE anschaffungsjahr = 2024;

        -- 2. Wartungsintervall für CNC-Fraesen verlängern
        SELECT * FROM maschinen WHERE maschinentyp = 'CNC-Fraese';  -- Safety check
        UPDATE maschinen
        SET wartungsintervall_tage = wartungsintervall_tage + 30
        WHERE maschinentyp = 'CNC-Fraese';

        -- 3. Produktionshallen umbenennen
        UPDATE maschinen
        SET produktionshalle = REPLACE(produktionshalle, 'Halle', 'Produktionshalle');

        -- 4. Präfix für Maschinen in West-Hallen
        SELECT * FROM maschinen WHERE produktionshalle LIKE '%West%';  -- Safety check
        UPDATE maschinen
        SET maschinenname = CONCAT('West-', maschinenname)
        WHERE produktionshalle LIKE '%West%';

        -- Ergebnis prüfen
        SELECT * FROM maschinen ORDER BY maschinen_id;
        ```

???+ question "Aufgabe 5: DELETE - Maschinen löschen"

    Die TecGuy GmbH muss einige Maschinen ausmustern:

    1. Die **Lackieranlage Delta** (ID 4) wird verschrottet. Lösche sie aus der Datenbank.

    2. Lösche dann **alle** Maschinen aus dem Jahr 2023.

    **Goldene Regel:** Immer erst `SELECT` mit der gleichen WHERE-Bedingung, dann `DELETE`!

    ??? info "💡 Lösung anzeigen"

        ```sql
        -- 1. Lackieranlage Delta löschen
        SELECT * FROM maschinen WHERE maschinen_id = 4;  -- Safety check
        DELETE FROM maschinen WHERE maschinen_id = 4;

        -- 2. Testmaschinen einfügen
        INSERT INTO maschinen (maschinen_id, maschinenname, maschinentyp)
        VALUES (98, 'Testmaschine 1', 'Test');

        INSERT INTO maschinen (maschinen_id, maschinenname, maschinentyp)
        VALUES (99, 'Testmaschine 2', 'Test');

        -- Prüfen welche Maschinen aus 2023 sind
        SELECT * FROM maschinen WHERE anschaffungsjahr = 2023;  -- Safety check

        -- Alle Maschinen aus 2023 löschen
        DELETE FROM maschinen WHERE anschaffungsjahr = 2023;
        -- Löscht beide Testmaschinen (ID 98, 99) und andere aus 2023

        -- 3. Sicherheitscheck (NICHT AUSFÜHREN!)
        -- DELETE FROM maschinen; würde ALLE Maschinen löschen!
        -- NIEMALS ohne WHERE-Klausel verwenden!

        -- Verbleibende Maschinen anzeigen
        SELECT * FROM maschinen ORDER BY maschinen_id;
        ```

        **Wichtige Beobachtung:**

        Die Testmaschinen bekamen automatisch `anschaffungsjahr = 2024` (DEFAULT), welches in Aufgabe 4 auf 2023 korrigiert wurde. Daher werden sie mit dem DELETE erfasst!

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

<div style="text-align: center;">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXFxZ3V5dWxsZWwyOHJrOGdvZmtvZjR6dGZoZ2JoZmpoZmpoZmpoZmpoZGwmZXA9djFfZ2lmc19zZWFyY2gmY3Q9Zw/xT9IgzoKnwFNmISR8I/giphy.gif" alt="Success" style="width:220px; margin-bottom: 1em;">
</div>