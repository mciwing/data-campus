<div style="text-align: center;">
    <img src="/assets/header/database/header_fortgeschritten.jpeg" alt="" style="width:100%; margin-bottom: 1em;">
</div>

# Fortgeschrittene Abfragen

In den vorangegangenen Kapiteln haben wir die Grundlagen von SQL kennengelernt: Vom [Erstellen von Tabellen](relational.md), über das [Abfragen](abfragen.md) und [Manipulieren von Daten](manipulieren.md), bis hin zur [Modellierung von Beziehungen](modellierung.md) und dem [Verknüpfen mehrerer Tabellen mit JOINs](join.md). Die Grundlagen sind gelegt!

Jetzt wird es Zeit für **fortgeschrittene SQL-Techniken**, die unsere Abfragen noch mächtiger machen. Diese Techniken werden uns helfen, komplexe Anfragen elegant zu lösen und unsere Daten auf neue Art und Weise zu analysieren.

In diesem Kapitel lernen wir:

- **Unterabfragen (Subqueries)** – Abfragen in Abfragen
- **String-Funktionen** – Texte manipulieren
- **Datumsfunktionen** – Mit Datum und Zeit arbeiten
- **CASE-WHEN** – Bedingte Logik in SQL
- **COALESCE** – NULL-Werte elegant behandeln

---

## Unterabfragen

Eine **Unterabfrage** (Subquery) ist eine SELECT-Abfrage **innerhalb** einer anderen Abfrage. Diese Technik erlaubt es uns, komplexe Fragestellungen in einem einzigen SQL-Statement zu lösen, ohne temporäre Ergebnisse manuell weiterverarbeiten zu müssen. Unterabfragen sind besonders nützlich, wenn wir das Ergebnis einer Berechnung direkt in einer anderen Abfrage verwenden möchten.

???+ info "Datenbank-Setup"

    Für die Beispiele in diesem Kapitel verwenden wir eine **Personal-Datenbank** (`personal_db`), die ein typisches HR-System eines Unternehmens abbildet. Diese Datenbank hilft uns, fortgeschrittene SQL-Techniken praxisnah zu üben.

    ```sql
    -- Datenbank erstellen
    CREATE DATABASE personal_db;

    -- Zur Datenbank wechseln
    \c personal_db

    -- Tabelle: Abteilungen
    CREATE TABLE abteilungen (
        abteilung_id SERIAL PRIMARY KEY,
        abteilungsname VARCHAR(100) NOT NULL,
        standort VARCHAR(100),
        budget NUMERIC(12, 2)
    );

    -- Tabelle: Mitarbeiter
    CREATE TABLE mitarbeiter (
        mitarbeiter_id SERIAL PRIMARY KEY,
        vorname VARCHAR(50) NOT NULL,
        nachname VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        eintrittsdatum DATE NOT NULL,
        gehalt NUMERIC(10, 2) NOT NULL,
        bonus NUMERIC(10, 2),
        abteilung_id INTEGER,
        geburtstag DATE,
        FOREIGN KEY (abteilung_id) REFERENCES abteilungen(abteilung_id)
    );

    -- Testdaten: Abteilungen
    INSERT INTO abteilungen (abteilungsname, standort, budget)
    VALUES
        ('Produktion', 'Halle A', 500000.00),
        ('Entwicklung', 'Gebaeude Nord', 800000.00),
        ('Vertrieb', 'Gebaeude Sued', 600000.00),
        ('Verwaltung', 'Hauptgebaeude', 400000.00),
        ('Qualitaetssicherung', 'Halle B', 350000.00);

    -- Testdaten: Mitarbeiter
    INSERT INTO mitarbeiter (vorname, nachname, email, eintrittsdatum, gehalt, bonus, abteilung_id, geburtstag)
    VALUES
        ('Thomas', 'Mueller', 'thomas.mueller@firma.de', '2018-03-15', 65000.00, 5000.00, 1, '1985-06-20'),
        ('Sandra', 'Schmidt', 'sandra.schmidt@firma.de', '2019-07-01', 72000.00, 6000.00, 2, '1987-11-12'),
        ('Klaus', 'Weber', 'klaus.weber@firma.de', '2015-01-10', 58000.00, NULL, 1, '1980-04-08'),
        ('Anna', 'Fischer', 'anna.fischer@firma.de', '2020-09-01', 68000.00, 4500.00, 2, '1990-09-25'),
        ('Michael', 'Becker', 'michael.becker@firma.de', '2021-02-15', 55000.00, 3000.00, 3, '1992-02-14'),
        ('Julia', 'Wagner', 'julia.wagner@firma.de', '2017-11-20', 62000.00, NULL, 4, '1988-07-30'),
        ('Peter', 'Hoffmann', 'peter.hoffmann@firma.de', '2022-05-01', 51000.00, 2000.00, 3, '1995-03-18'),
        ('Lisa', 'Schulz', 'lisa.schulz@firma.de', '2016-08-12', 70000.00, 7000.00, 5, '1984-12-05'),
        ('Martin', 'Koch', 'martin.koch@firma.de', '2023-01-15', 48000.00, NULL, 1, '1998-05-22'),
        ('Sarah', 'Zimmermann', 'sarah.zimmermann@firma.de', '2019-04-20', 66000.00, 5500.00, 2, '1989-10-11');
    ```

    Diese Tabellen enthalten typische HR-Daten: Mitarbeiterinformationen, Gehälter, Bonuszahlungen und Abteilungszuordnungen.

---

Um uns Unterabfragen besser vorstellen zu können, betrachten wir folgendes Beispiel. Stellen wir uns vor, wir haben folgende Frage:

*Welche Mitarbeiter verdienen mehr als das durchschnittliche Gehalt?*

Die Frage an sich ist relativ einfach zu beantworten. Wir können den Durchschnitt der Gehälter berechnen und dann die Mitarbeiter filtern, die mehr verdienen. In einem **zweistufigen Vorgehen** könnte dies so aussehen:

```sql
-- 1. Durchschnitt berechnen
SELECT AVG(gehalt) FROM mitarbeiter;  -- Ergebnis: 61500.00

-- 2. Dann das Ergebnis manuell verwenden
SELECT vorname, nachname, gehalt
FROM mitarbeiter
WHERE gehalt > 61500.00;
```

So würden wir in der ersten Abfrage das Durchschnittsgehalt berechnen und in einer zweiten Abfrage schlussendlich das eigentliche Ergebnis erhalten - die Mitarbeiter, die überdurchschnittlich verdienen.

Da Programmierer von Haus aus faul sind, wollen wir diese Aufgabe natürlich in einem Schritt lösen. Dazu verwenden wir eine **Unterabfrage**.

```sql
SELECT vorname, nachname, gehalt
FROM mitarbeiter
WHERE gehalt > (SELECT AVG(gehalt) FROM mitarbeiter)
ORDER BY gehalt DESC;
```

```sql title="Output"
 vorname |  nachname  | gehalt
---------+------------+---------
 Sandra  | Schmidt    | 72000.00
 Lisa    | Schulz     | 70000.00
 Anna    | Fischer    | 68000.00
 Sarah   | Zimmermann | 66000.00
 Thomas  | Mueller    | 65000.00
 Julia   | Wagner     | 62000.00
(6 rows)
```

Die innere Abfrage `(SELECT AVG(gehalt) FROM mitarbeiter)` wird **zuerst** ausgeführt und liefert einen Wert (61500.00), der dann in der äußeren Abfrage verwendet wird. Das ist der große Vorteil von Unterabfragen: Wir müssen nicht erst manuell den Durchschnitt berechnen und dann in eine zweite Abfrage einsetzen - SQL erledigt dies automatisch für uns in einem einzigen Schritt.

---

### `IN` und `NOT IN`

<div style="text-align: center;">
    <img src="https://i.imgflip.com/ac45wn.jpg" alt="IN und NOT IN" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://i.imgflip.com/ac45wn.jpg">imgflip</a></figcaption>
</div>

Eine besondere Art von Unterabfrage sind die **`IN`- und `NOT IN`-Operatoren**. Diese Operatoren erlauben es uns, zu prüfen, ob ein Wert in einer Menge von Werten (aus einer Unterabfrage) enthalten ist. Dies ist besonders nützlich, wenn die Unterabfrage mehrere Ergebniszeilen liefert und wir prüfen wollen, ob unser Wert in dieser Liste vorkommt. Statt eines einzelnen Wertes wie beim einfachen Vergleich, gibt die Unterabfrage hier unter Umständen eine ganze Liste von Werten zurück.

Schauen wir uns das Ganze wieder anhand eines Beispiels an. Wir möchten gerne wissen, welche Mitarbeiter in den technischen Abteilungen (Produktion, Entwicklung, Qualitätssicherung) arbeiten.

```sql
-- Mitarbeiter in technischen Abteilungen
SELECT vorname, nachname
FROM mitarbeiter
WHERE abteilung_id IN (
    SELECT abteilung_id
    FROM abteilungen
    WHERE abteilungsname IN ('Produktion', 'Entwicklung', 'Qualitaetssicherung')
);
```

```sql title="Output"
 vorname |  nachname
---------+------------
 Thomas  | Mueller
 Sandra  | Schmidt
 Klaus   | Weber
 Anna    | Fischer
 Lisa    | Schulz
 Martin  | Koch
 Sarah   | Zimmermann
(7 rows)
```

Der Ablauf dieser Abfrage kann man wie folgt beschreiben:

1. **Innere Abfrage:**
    - filtert die Abteilungen nach Namen (Produktion, Entwicklung, Qualitätssicherung)
    - liefert eine Liste von `abteilung_id` zurück (z.B. 1, 2, 5)
2. **Äußere Abfrage:**
    - filtert die Mitarbeiter, deren `abteilung_id` in der Liste der inneren Abfrage ist
    - liefert Vor- und Nachnamen der Mitarbeiter zurück

Neben dem `IN`-Operator gibt es auch den `NOT IN`-Operator. Dieser Operator überprüft, ob ein Wert **NICHT** in einer Menge von Werten (aus einer Unterabfrage) enthalten ist. Das Vorgehen und deren Verwendung ist analog.

???+ example "NOT IN Beispiel"

    ```sql
    -- Mitarbeiter NICHT in technischen Abteilungen
    SELECT vorname, nachname
    FROM mitarbeiter
    WHERE abteilung_id NOT IN (
        SELECT abteilung_id
        FROM abteilungen
        WHERE abteilungsname IN ('Produktion', 'Entwicklung', 'Qualitaetssicherung')
    );
    ```

    ```sql title="Output"
     vorname |  nachname
    ---------+------------
     Michael | Becker
     Julia   | Wagner
     Peter   | Hoffmann
    (3 rows)
    ``` 

---

### EXISTS und NOT EXISTS

**EXISTS** prüft, ob eine Unterabfrage **mindestens ein Ergebnis** liefert. Im Gegensatz zu `IN`, das die gesamte Ergebnisliste der Unterabfrage durchgeht, stoppt `EXISTS` bereits, sobald das erste passende Ergebnis gefunden wurde. Das macht `EXISTS` oft performanter, besonders bei großen Datenmengen. 

???+ tip "`EXISTS` vs `NOT IN`"
    Ein weiterer Vorteil: `EXISTS` hat keine Probleme mit `NULL`-Werten, die bei `NOT IN` zu unerwartetem Verhalten führen können.

Betrachten wir die Operatoren wieder anhand von Beispielen: 

<div class="grid cards" markdown>

-   __EXISTS__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Welche Abteilungen haben mindestens einen Mitarbeiter?
        SELECT abteilungsname, standort
        FROM abteilungen a
        WHERE EXISTS (
            SELECT 1
            FROM mitarbeiter m
            WHERE m.abteilung_id = a.abteilung_id
        );
        ```

        ```sql title="Output"
         abteilungsname      |     standort
        ---------------------+------------------
         Produktion          | Halle A
         Entwicklung         | Gebaeude Nord
         Vertrieb            | Gebaeude Sued
         Verwaltung          | Hauptgebaeude
         Qualitaetssicherung | Halle B
        (5 rows)
        ```

        **Erklärung:** Für jede Abteilung prüft die Unterabfrage, ob es zugeordnete Mitarbeiter gibt. `EXISTS` ist wahr, sobald **mindestens eine Zeile** gefunden wird.

-   __NOT EXISTS__

    ---

    ???+ example "Beispiel"

        ```sql
        -- Abteilungen OHNE Mitarbeiter finden
        -- (Beispiel: Wenn wir eine leere Abteilung einfügen)
        INSERT INTO abteilungen (abteilungsname, standort, budget)
        VALUES ('Forschung', 'Gebaeude West', 1000000.00);

        -- Jetzt suchen wir leere Abteilungen
        SELECT abteilungsname, standort
        FROM abteilungen a
        WHERE NOT EXISTS (
            SELECT 1
            FROM mitarbeiter m
            WHERE m.abteilung_id = a.abteilung_id
        );
        ```

        ```sql title="Output"
         abteilungsname | standort
        ----------------+--------------
         Forschung      | Gebaeude West
        (1 row)
        ```

        **Erklärung:** Für jede Abteilung prüft die Unterabfrage, ob es keine zugeordneten Mitarbeiter gibt. `NOT EXISTS` ist wahr, sobald **keine Zeile** gefunden wird.


</div>


---

### Unterabfragen in FROM

Man kann eine Unterabfrage auch in der **`FROM`-Klausel** verwenden – als wäre sie eine Tabelle! Diese sogenannten "Derived Tables" oder "Inline Views" sind besonders nützlich, wenn wir mit aggregierten Daten weiterarbeiten möchten. Da wir in der `WHERE`-Klausel keine Aggregatfunktionen direkt verwenden können, erstellen wir eine Unterabfrage, die die Aggregation durchführt, und können dann auf deren Ergebnis filtern.

```sql
-- Durchschnittliches Gehalt pro Abteilung, aber nur Abteilungen mit Durchschnitt > 60000
SELECT abteilung, avg_gehalt
FROM (
    SELECT
        a.abteilungsname AS abteilung,
        AVG(m.gehalt) AS avg_gehalt
    FROM mitarbeiter m
    INNER JOIN abteilungen a ON m.abteilung_id = a.abteilung_id
    GROUP BY a.abteilungsname
) AS abteilungs_gehaelter
WHERE avg_gehalt > 60000
ORDER BY avg_gehalt DESC;
```

```sql title="Output"
   abteilung    | avg_gehalt
----------------+------------
 Qualitaetssicherung | 70000.00
 Entwicklung         | 68666.67
 Produktion          | 63666.67
(3 rows)
```

???+ warning "Wichtig"
    Die Unterabfrage **muss einen Alias** haben (hier: `AS abteilungs_gehaelter`)!

---

## String-Funktionen

SQL bietet viele Funktionen zur Textverarbeitung. Diese sind besonders nützlich, um Daten zu bereinigen, zu formatieren oder für Reports aufzubereiten. Ob wir Texte zusammenfügen, Groß-/Kleinschreibung ändern oder Teile eines Strings extrahieren möchten - für fast jede Anforderung gibt es eine passende Funktion.

Die wichtigsten String-Funktionen sind nachfolgend aufgelistet:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Funktion</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>CONCAT(s1, s2, ...)</code></td>
        <td style="padding:10px 14px;">Strings zusammenfügen</td>
        <td style="padding:10px 14px;"><code>CONCAT('Max', ' ', 'Müller')</code> → 'Max Müller'</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>UPPER(s)</code></td>
        <td style="padding:10px 14px;">In Großbuchstaben</td>
        <td style="padding:10px 14px;"><code>UPPER('Anna')</code> → 'ANNA'</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LOWER(s)</code></td>
        <td style="padding:10px 14px;">In Kleinbuchstaben</td>
        <td style="padding:10px 14px;"><code>LOWER('LISA')</code> → 'lisa'</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>SUBSTRING(s, start, len)</code></td>
        <td style="padding:10px 14px;">Teil eines Strings</td>
        <td style="padding:10px 14px;"><code>SUBSTRING('Hallo', 1, 3)</code> → 'Hal'</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LENGTH(s)</code></td>
        <td style="padding:10px 14px;">Länge eines Strings</td>
        <td style="padding:10px 14px;"><code>LENGTH('Hallo')</code> → 5</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>TRIM(s)</code></td>
        <td style="padding:10px 14px;">Leerzeichen entfernen</td>
        <td style="padding:10px 14px;"><code>TRIM('  Hi  ')</code> → 'Hi'</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>REPLACE(s, von, zu)</code></td>
        <td style="padding:10px 14px;">Text ersetzen</td>
        <td style="padding:10px 14px;"><code>REPLACE('Hallo', 'a', 'e')</code> → 'Hello'</td>
    </tr>
    </tbody>
</table>
</div>

Nun schauen wir uns an, wie wir diese String-Funktionen in der Praxis einsetzen können. Die folgenden Beispiele zeigen typische Anwendungsfälle aus dem Alltag:

<div class="grid cards" markdown>

-   __CONCAT - Vollständiger Name__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Vollständiger Name aus Vor- und Nachname
        SELECT
            CONCAT(vorname, ' ', nachname) AS vollstaendiger_name,
            email
        FROM mitarbeiter;
        ```

        ```sql title="Output"
           vollstaendiger_name  |           email
        ------------------------+---------------------------
         Thomas Mueller          | thomas.mueller@firma.de
         Sandra Schmidt          | sandra.schmidt@firma.de
         Klaus Weber             | klaus.weber@firma.de
         Anna Fischer            | anna.fischer@firma.de
         Michael Becker          | michael.becker@firma.de
         Julia Wagner            | julia.wagner@firma.de
         Peter Hoffmann          | peter.hoffmann@firma.de
         Lisa Schulz             | lisa.schulz@firma.de
         Martin Koch             | martin.koch@firma.de
         Sarah Zimmermann        | sarah.zimmermann@firma.de
        (10 rows)
        ```

        **Erklärung:** Wir fügen Vor- und Nachname mit einem Leerzeichen zusammen zu einem vollständigen Namen.

-   __Kombination mehrerer Funktionen__

    ---

    ???+ example "Beispiel"

        ```sql
        -- Mitarbeiter-Codes generieren (Format: INITIALEN-JAHR-ID)
        SELECT
            vorname,
            nachname,
            CONCAT(
                UPPER(SUBSTRING(vorname, 1, 1)),
                UPPER(SUBSTRING(nachname, 1, 1)),
                '-',
                EXTRACT(YEAR FROM eintrittsdatum),
                '-',
                LPAD(mitarbeiter_id::TEXT, 3, '0')
            ) AS mitarbeitercode
        FROM mitarbeiter
        ORDER BY mitarbeiter_id;
        ```
        ```sql title="Output"
         vorname |  nachname  | mitarbeitercode
        ---------+------------+-----------------
         Thomas  | Mueller    | TM-2018-001
         Sandra  | Schmidt    | SS-2019-002
         Klaus   | Weber      | KW-2015-003
         Anna    | Fischer    | AF-2020-004
         Michael | Becker     | MB-2021-005
         Julia   | Wagner     | JW-2017-006
         Peter   | Hoffmann   | PH-2022-007
         Lisa    | Schulz     | LS-2016-008
         Martin  | Koch       | MK-2023-009
         Sarah   | Zimmermann | SZ-2019-010
        (10 rows)
        ```

        **Erklärung:** Wir generieren einen Mitarbeitercode. Die Initialen (erster Buchstabe von Vor- und Nachname) werden in Großbuchstaben umgewandelt, das Eintrittsjahr und die ID (mit Nullen aufgefüllt auf 3 Stellen) werden angehängt.
</div>

Mit diesen String-Funktionen können wir also sehr einfach und effizient Texte verarbeiten und formatieren und müssen dies nicht in der Anwendungsschicht tun. 

---

## Datumsfunktionen

PostgreSQL bietet auch - neben den String-Funktionen - umfangreiche Funktionen für Datum und Zeit. Die Arbeit mit Datums- und Zeitwerten ist in vielen Anwendungen zentral - sei es für Protokolle, Zeitstempel, Berechnungen von Zeiträumen oder für zeitbasierte Analysen. Mit den Datumsfunktionen können wir das aktuelle Datum abrufen, Teile eines Datums extrahieren oder Zeitdifferenzen berechnen. Die wichtigsten Datumsfunktionen sind nachfolgend aufgelistet:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Funktion</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>CURRENT_DATE</code></td>
        <td style="padding:10px 14px;">Heutiges Datum</td>
        <td style="padding:10px 14px;"><code>2024-03-15</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>CURRENT_TIME</code></td>
        <td style="padding:10px 14px;">Aktuelle Uhrzeit</td>
        <td style="padding:10px 14px;"><code>14:30:00</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>NOW()</code></td>
        <td style="padding:10px 14px;">Datum und Zeit</td>
        <td style="padding:10px 14px;"><code>2024-03-15 14:30:00</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>EXTRACT(teil FROM datum)</code></td>
        <td style="padding:10px 14px;">Jahr, Monat, Tag extrahieren</td>
        <td style="padding:10px 14px;"><code>EXTRACT(YEAR FROM datum)</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>AGE(datum1, datum2)</code></td>
        <td style="padding:10px 14px;">Zeitunterschied</td>
        <td style="padding:10px 14px;"><code>AGE('2024-01-01', '2020-01-01')</code></td>
    </tr>
    </tbody>
</table>
</div>

Nun wollen wir uns praktische Anwendungsfälle ansehen. Unsere Mitarbeitertabelle enthält bereits die Felder `eintrittsdatum` und `geburtstag`, mit denen wir arbeiten können. 

<div class="grid cards" markdown>

-   __EXTRACT & AGE - Betriebszugehörigkeit__

    ---

    ???+ example "Beispiel"

        ```sql
        -- Betriebszugehörigkeit in Jahren berechnen
        SELECT
            vorname,
            nachname,
            eintrittsdatum,
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, eintrittsdatum)) AS jahre_im_unternehmen
        FROM mitarbeiter
        ORDER BY jahre_im_unternehmen DESC;
        ```

        ```sql title="Output"
         vorname |  nachname  | eintrittsdatum | jahre_im_unternehmen
        ---------+------------+----------------+----------------------
         Klaus   | Weber      | 2015-01-10     |                   10
         Lisa    | Schulz     | 2016-08-12     |                    9
         Julia   | Wagner     | 2017-11-20     |                    8
         Thomas  | Mueller    | 2018-03-15     |                    7
         Sandra  | Schmidt    | 2019-07-01     |                    6
         Sarah   | Zimmermann | 2019-04-20     |                    6
         Anna    | Fischer    | 2020-09-01     |                    5
         Michael | Becker     | 2021-02-15     |                    4
         Peter   | Hoffmann   | 2022-05-01     |                    3
         Martin  | Koch       | 2023-01-15     |                    2
        (10 rows)
        ```

        **Erklärung:** Wir berechnen die Betriebszugehörigkeit in Jahren, indem wir die Differenz zwischen dem aktuellen Datum und dem Eintrittsdatum berechnen. `AGE` gibt die Zeitdifferenz zurück, aus der wir mit `EXTRACT(YEAR ...)` die Jahre extrahieren.

-   __Kombination mehrerer Funktionen - Geburtstage__

    ---

    ???+ example "Beispiel"

        ```sql
        -- Mitarbeiter, die diesen Monat Geburtstag haben
        SELECT
            vorname,
            nachname,
            geburtstag,
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, geburtstag)) AS alter
        FROM mitarbeiter
        WHERE EXTRACT(MONTH FROM geburtstag) = EXTRACT(MONTH FROM CURRENT_DATE)
        ORDER BY EXTRACT(DAY FROM geburtstag);
        ```

        ```sql title="Output (Beispiel für Monat November)"
         vorname |  nachname  | geburtstag | alter
        ---------+------------+------------+-------
         Sandra  | Schmidt    | 1987-11-12 |    38
        (1 row)
        ```

        **Erklärung:** Wir filtern Mitarbeiter, deren Geburtsmonat mit dem aktuellen Monat übereinstimmt. Zusätzlich berechnen wir das Alter und sortieren nach dem Geburtstag im Monat.
</div>


---

## CASE WHEN - Bedingte Logik

Mit **CASE WHEN** können wir bedingte Logik direkt in SQL einbauen – ähnlich wie `if-else` in Programmiersprachen. Dies ist besonders nützlich, um Daten zu kategorisieren, Berechnungen basierend auf Bedingungen durchzuführen oder benutzerdefinierte Ausgaben zu erzeugen. Statt die Logik in der Anwendungsschicht zu implementieren, können wir sie direkt in der Datenbankabfrage unterbringen, was oft effizienter und lesbarer ist.
Der allgemeine Syntax ist wie folgt:

```sql { .yaml .no-copy }
CASE
    WHEN bedingung1 THEN ergebnis1
    WHEN bedingung2 THEN ergebnis2
    ELSE standard_ergebnis
END
```

Bei der Verwendung von `CASE` können wir beliebig viele Bedingungen angeben und ein Standardergebnis festlegen, das verwendet wird, wenn keine der Bedingungen erfüllt ist. Betrachten wir das wieder anhand eines praktischen Beispiels.

???+ example "Gehaltsstufen kategorisieren"
    ```sql
    SELECT
        vorname,
        nachname,
        gehalt,
        CASE
            WHEN gehalt >= 70000 THEN 'Senior'
            WHEN gehalt >= 60000 THEN 'Mid-Level'
            WHEN gehalt >= 50000 THEN 'Junior'
            ELSE 'Einsteiger'
        END AS gehaltsstufe
    FROM mitarbeiter
    ORDER BY gehalt DESC;
    ```

    ```sql title="Output"
     vorname |  nachname  | gehalt   | gehaltsstufe
    ---------+------------+----------+--------------
     Sandra  | Schmidt    | 72000.00 | Senior
     Lisa    | Schulz     | 70000.00 | Senior
     Anna    | Fischer    | 68000.00 | Mid-Level
     Sarah   | Zimmermann | 66000.00 | Mid-Level
     Thomas  | Mueller    | 65000.00 | Mid-Level
     Julia   | Wagner     | 62000.00 | Mid-Level
     Klaus   | Weber      | 58000.00 | Junior
     Michael | Becker     | 55000.00 | Junior
     Peter   | Hoffmann   | 51000.00 | Junior
     Martin  | Koch       | 48000.00 | Einsteiger
    (10 rows)
    ```

    **Erklärung:** Wir kategorisieren Mitarbeiter nach ihrem Gehalt in Gehaltsstufen: Senior (≥70.000€), Mid-Level (≥60.000€), Junior (≥50.000€) oder Einsteiger (<50.000€).


### CASE in Aggregationen

CASE WHEN kann auch innerhalb von [Aggregatfunktionen](abfragen.md#aggregatfunktionen-daten-zusammenfassen) verwendet werden, um selektive Zählungen durchzuführen. Dies ist besonders nützlich für Auswertungen und Berichte:

???+ example "Beispiel"

    ```sql
    -- Wie viele Mitarbeiter gibt es pro Gehaltsstufe?
    SELECT
        COUNT(CASE WHEN gehalt >= 70000 THEN 1 END) AS senior,
        COUNT(CASE WHEN gehalt >= 60000 AND gehalt < 70000 THEN 1 END) AS mid_level,
        COUNT(CASE WHEN gehalt >= 50000 AND gehalt < 60000 THEN 1 END) AS junior,
        COUNT(CASE WHEN gehalt < 50000 THEN 1 END) AS einsteiger,
        COUNT(*) AS gesamt
    FROM mitarbeiter;
    ```

    ```sql title="Output"
     senior | mid_level | junior | einsteiger | gesamt
    --------+-----------+--------+------------+--------
          2 |         4 |      3 |          1 |     10
    (1 row)
    ```

    **Erklärung:** Wir zählen die Mitarbeiter pro Gehaltsstufe. Dies ist besonders nützlich für HR-Berichte und Gehaltsanalysen.
---

## COALESCE - NULL-Werte behandeln

**COALESCE** gibt den ersten **nicht-NULL-Wert** aus einer Liste zurück. Diese Funktion ist extrem nützlich im Umgang mit NULL-Werten, die in Datenbanken häufig vorkommen. Statt komplizierte CASE-WHEN-Konstrukte zu schreiben oder NULL-Werte in der Anwendung zu behandeln, bietet COALESCE eine elegante und lesbare Lösung, um Standardwerte für fehlende Daten bereitzustellen. Der Allgemeine Syntax ist wie folgt:

```sql { .yaml .no-copy }
COALESCE(wert1, wert2, wert3, ..., standard)
```

Wir sehen, dass wir mehrere Werte (im Normalfall Funktionen oder andere Spaltenwerte) angeben können und der erste nicht-NULL-Wert wird zurückgegeben. Wenn alle Werte NULL sind, wird der Standardwert zurückgegeben. Betrachten wir wieder ein praktisches Beispiel. 

???+ example "Bonuszahlungen mit Standardwert"
    ```sql
    -- Gesamtvergütung inklusive Bonus (NULL-Bonuswerte als 0 behandeln)
    SELECT
        vorname,
        nachname,
        gehalt,
        bonus,
        COALESCE(bonus, 0) AS bonus_bereinigt,
        gehalt + COALESCE(bonus, 0) AS gesamtverguetung
    FROM mitarbeiter
    ORDER BY gesamtverguetung DESC;
    ```

    ```sql title="Output"
     vorname |  nachname  | gehalt   | bonus   | bonus_bereinigt | gesamtverguetung
    ---------+------------+----------+---------+-----------------+------------------
     Sandra  | Schmidt    | 72000.00 | 6000.00 |         6000.00 |          78000.00
     Lisa    | Schulz     | 70000.00 | 7000.00 |         7000.00 |          77000.00
     Anna    | Fischer    | 68000.00 | 4500.00 |         4500.00 |          72500.00
     Sarah   | Zimmermann | 66000.00 | 5500.00 |         5500.00 |          71500.00
     Thomas  | Mueller    | 65000.00 | 5000.00 |         5000.00 |          70000.00
     Julia   | Wagner     | 62000.00 |    NULL |            0.00 |          62000.00
     Klaus   | Weber      | 58000.00 |    NULL |            0.00 |          58000.00
     Michael | Becker     | 55000.00 | 3000.00 |         3000.00 |          58000.00
     Peter   | Hoffmann   | 51000.00 | 2000.00 |         2000.00 |          53000.00
     Martin  | Koch       | 48000.00 |    NULL |            0.00 |          48000.00
    (10 rows)
    ```

    **Erklärung:** `COALESCE(bonus, 0)` ersetzt NULL-Werte in der Bonus-Spalte durch 0. Dadurch können wir problemlos die Gesamtvergütung berechnen, ohne dass NULL-Werte die Berechnung stören. 

---

## Mathematische Funktionen

Neben String- und Datumsfunktionen bietet SQL auch eine Vielzahl mathematischer Funktionen für numerische Werte. Diese sind besonders nützlich für Berechnungen, Rundungen und statistische Auswertungen direkt in der Datenbank.

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Funktion</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>ROUND(x, n)</code></td>
        <td style="padding:10px 14px;">Runden auf n Nachkommastellen</td>
        <td style="padding:10px 14px;"><code>ROUND(3.14159, 2)</code> → 3.14</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>CEIL(x)</code></td>
        <td style="padding:10px 14px;">Aufrunden</td>
        <td style="padding:10px 14px;"><code>CEIL(3.2)</code> → 4</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>FLOOR(x)</code></td>
        <td style="padding:10px 14px;">Abrunden</td>
        <td style="padding:10px 14px;"><code>FLOOR(3.8)</code> → 3</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>ABS(x)</code></td>
        <td style="padding:10px 14px;">Absolutwert</td>
        <td style="padding:10px 14px;"><code>ABS(-5)</code> → 5</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>POWER(x, y)</code></td>
        <td style="padding:10px 14px;">x hoch y</td>
        <td style="padding:10px 14px;"><code>POWER(2, 3)</code> → 8</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>SQRT(x)</code></td>
        <td style="padding:10px 14px;">Quadratwurzel</td>
        <td style="padding:10px 14px;"><code>SQRT(16)</code> → 4</td>
    </tr>
    </tbody>
</table>
</div>

Ein häufiger Anwendungsfall für mathematische Funktionen ist das Runden von Berechnungsergebnissen für eine übersichtliche Darstellung:

???+ example "Gehaltsberechnungen runden"

    ```sql
    -- Durchschnittsgehalt pro Abteilung gerundet
    SELECT
        a.abteilungsname,
        COUNT(m.mitarbeiter_id) AS anzahl_mitarbeiter,
        ROUND(AVG(m.gehalt), 2) AS durchschnittsgehalt,
        ROUND(MIN(m.gehalt), 2) AS min_gehalt,
        ROUND(MAX(m.gehalt), 2) AS max_gehalt
    FROM abteilungen a
    LEFT JOIN mitarbeiter m ON a.abteilung_id = m.abteilung_id
    GROUP BY a.abteilungsname
    ORDER BY durchschnittsgehalt DESC;
    ```

    ```sql title="Output"
         abteilungsname      | anzahl_mitarbeiter | durchschnittsgehalt | min_gehalt | max_gehalt
    -------------------------+--------------------+---------------------+------------+------------
     Qualitaetssicherung     |                  1 |            70000.00 |   70000.00 |   70000.00
     Entwicklung             |                  3 |            68666.67 |   66000.00 |   72000.00
     Produktion              |                  3 |            57000.00 |   48000.00 |   65000.00
     Vertrieb                |                  2 |            53000.00 |   51000.00 |   55000.00
     Verwaltung              |                  1 |            62000.00 |   62000.00 |   62000.00
     Forschung               |                  0 |                NULL |       NULL |       NULL
    (6 rows)
    ```

    **Erklärung:** Mit `ROUND()` können wir Berechnungsergebnisse auf 2 Nachkommastellen runden für eine übersichtliche Darstellung in HR-Berichten. 

---

## Übung ✍️

Nun wenden wir die fortgeschrittenen SQL-Techniken auf unser **TecGuy GmbH Produktionsplanungssystem** an! Die Übungen decken Unterabfragen, String-/Datumsfunktionen, CASE WHEN, COALESCE und komplexe Analysen ab.

???+ info "Übungsvorbereitung"

    Stelle sicher, dass du zur TecGuy GmbH Datenbank verbunden bist:

    ```sql
    -- Zur Datenbank wechseln
    \c produktionsplanung_db
    ```

    **Benötigte Tabellen:**
    - `maschinen`
    - `produktionsauftraege`
    - `wartungsprotokolle`
    - `ersatzteile`
    - `maschinen_ersatzteile`

???+ question "Aufgabe 1: Unterabfragen - Überdurchschnittliche Wartungskosten"

    Finde alle Wartungen, die teurer waren als die durchschnittlichen Wartungskosten.

    **Anforderungen:**
    - Zeige: Maschinennamen (mit JOIN), Wartungsdatum, Beschreibung, Kosten
    - Nur Wartungen über dem Durchschnitt
    - Sortiere nach Kosten absteigend

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.maschinenname,
            w.wartungsdatum,
            w.beschreibung,
            w.kosten
        FROM wartungsprotokolle w
        INNER JOIN maschinen m ON w.maschinen_id = m.maschinen_id
        WHERE w.kosten > (SELECT AVG(kosten) FROM wartungsprotokolle)
        ORDER BY w.kosten DESC;
        ```

        ```sql title="Output"
         maschinenname    | wartungsdatum |      beschreibung       | kosten
        ------------------+---------------+-------------------------+--------
         CNC-Fraese Alpha | 2024-02-10    | Reparatur Spindelmotor  | 850.00
         CNC-Fraese Alpha | 2024-01-15    | Routinewartung-Oelwechsel | 250.00
        (2 rows)
        ```

        **Erklärung:** Die Unterabfrage berechnet die durchschnittlichen Kosten aller Wartungen. Die äußere Abfrage filtert dann nur Wartungen, die teurer sind.

???+ question "Aufgabe 2: IN - Maschinen mit bestimmten Ersatzteilen"

    Finde alle Maschinen, die entweder Spindelmotoren oder Kühlmittelpumpen benötigen.

    **Anforderungen:**
    - Verwende IN mit Unterabfrage
    - Zeige: Maschinenname, Maschinentyp
    - Keine Duplikate (DISTINCT)

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT DISTINCT
            m.maschinenname,
            m.maschinentyp
        FROM maschinen m
        WHERE m.maschinen_id IN (
            SELECT me.maschinen_id
            FROM maschinen_ersatzteile me
            INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
            WHERE e.teilename LIKE '%Spindelmotor%'
               OR e.teilename LIKE '%Kuehlmittelpumpe%'
        )
        ORDER BY m.maschinenname;
        ```

        ```sql title="Output"
         maschinenname    | maschinentyp
        ------------------+--------------
         CNC-Fraese Alpha | CNC-Fraese
         Drehbank Beta    | Drehbank
        (2 rows)
        ```

        **Erklärung:** Die Unterabfrage findet alle maschinen_id, die Spindelmotoren oder Kühlmittelpumpen benötigen. Die äußere Abfrage filtert dann die Maschinen mit diesen IDs.

???+ question "Aufgabe 3: EXISTS - Maschinen mit Wartungsprotokollen"

    Finde alle Maschinen, die mindestens eine Wartung haben.

    **Anforderungen:**
    - Verwende EXISTS
    - Zeige: Maschinenname, Maschinentyp, Anzahl Wartungen
    - Sortiere nach Anzahl Wartungen absteigend

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.maschinenname,
            m.maschinentyp,
            (SELECT COUNT(*) FROM wartungsprotokolle w WHERE w.maschinen_id = m.maschinen_id) AS anzahl_wartungen
        FROM maschinen m
        WHERE EXISTS (
            SELECT 1
            FROM wartungsprotokolle w
            WHERE w.maschinen_id = m.maschinen_id
        )
        ORDER BY anzahl_wartungen DESC;
        ```

        ```sql title="Output"
         maschinenname    | maschinentyp | anzahl_wartungen
        ------------------+--------------+------------------
         CNC-Fraese Alpha | CNC-Fraese   |                2
         Drehbank Beta    | Drehbank     |                2
        (2 rows)
        ```

        **Erklärung:** EXISTS prüft, ob mindestens eine Wartung existiert. Die Unterabfrage im SELECT zählt die Anzahl der Wartungen pro Maschine.

???+ question "Aufgabe 4: String-Funktionen - Maschinencodes generieren"

    Erstelle Maschinencodes im Format: `TYP-ID` (z.B. "CNC-001")

    **Anforderungen:**
    - Erste 3 Buchstaben des Maschinentyps in Großbuchstaben
    - Maschinen-ID mit führenden Nullen auf 3 Stellen
    - Verwende: UPPER, SUBSTRING, LPAD

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            maschinenname,
            maschinentyp,
            CONCAT(
                UPPER(SUBSTRING(maschinentyp, 1, 3)),
                '-',
                LPAD(maschinen_id::TEXT, 3, '0')
            ) AS maschinencode
        FROM maschinen
        ORDER BY maschinen_id;
        ```

        ```sql title="Output"
         maschinenname         | maschinentyp    | maschinencode
        -----------------------+-----------------+---------------
         CNC-Fraese Alpha      | CNC-Fraese      | CNC-001
         Drehbank Beta         | Drehbank        | DRE-002
         Schweissroboter Gamma | Schweissroboter | SCH-003
         Lackieranlage Delta   | Lackieranlage   | LAC-004
        (4 rows)
        ```

        **Erklärung:** SUBSTRING extrahiert die ersten 3 Zeichen, UPPER wandelt in Großbuchstaben um, LPAD füllt die ID mit Nullen auf.

???+ question "Aufgabe 5: Datumsfunktionen - Wartungsalter"

    Berechne, wie viele Tage seit der letzten Wartung jeder Maschine vergangen sind. Zeige nur Maschinen, die länger als 90 Tage keine Wartung hatten.

    **Anforderungen:**
    - Berechne Tage seit letzter Wartung mit CURRENT_DATE
    - Filtere: Nur Maschinen mit letzter Wartung > 90 Tage
    - Zeige auch Maschinen ohne Wartungen
    - Sortiere nach Tagen absteigend

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.maschinenname,
            MAX(w.wartungsdatum) AS letzte_wartung,
            COALESCE(
                CURRENT_DATE - MAX(w.wartungsdatum),
                999
            ) AS tage_seit_wartung
        FROM maschinen m
        LEFT JOIN wartungsprotokolle w ON m.maschinen_id = w.maschinen_id
        GROUP BY m.maschinenname
        HAVING COALESCE(CURRENT_DATE - MAX(w.wartungsdatum), 999) > 90
        ORDER BY tage_seit_wartung DESC;
        ```

        ```sql title="Output (abhängig vom aktuellen Datum)"
         maschinenname         | letzte_wartung | tage_seit_wartung
        -----------------------+----------------+-------------------
         Schweissroboter Gamma |           NULL |               999
         Lackieranlage Delta   |           NULL |               999
         CNC-Fraese Alpha      | 2024-02-10     |               289
         Drehbank Beta         | 2024-03-05     |               265
        (4 rows)
        ```

        **Erklärung:** Wir berechnen die Differenz in Tagen zwischen heute und der letzten Wartung. Maschinen ohne Wartung erhalten 999 Tage (Fallback-Wert).

???+ question "Aufgabe 6: CASE WHEN - Produktionsauftragskategorien"

    Kategorisiere Produktionsaufträge nach Menge: Klein (<200), Mittel (200-400), Groß (>400).

    **Anforderungen:**
    - Verwende CASE WHEN
    - Zeige: Auftragsnummer, Kunde, Produkt, Menge, Kategorie
    - Zähle Aufträge pro Kategorie (zweite Abfrage)

    ??? tip "Lösung anzeigen"

        ```sql
        -- Alle Aufträge mit Kategorien
        SELECT
            auftragsnummer,
            kunde,
            produkt,
            menge,
            CASE
                WHEN menge < 200 THEN 'Klein'
                WHEN menge BETWEEN 200 AND 400 THEN 'Mittel'
                ELSE 'Groß'
            END AS auftragskategorie
        FROM produktionsauftraege
        ORDER BY menge DESC;
        ```

        ```sql title="Output"
         auftragsnummer |     kunde     |     produkt     | menge | auftragskategorie
        ----------------+---------------+-----------------+-------+-------------------
         AUF-2024-001   | BMW AG        | Getriebegehäuse |   500 | Groß
         AUF-2024-006   | Volkswagen AG | Kolben          |   400 | Mittel
         AUF-2024-003   | Mercedes-Benz | Pleuelstange    |   350 | Mittel
         AUF-2024-010   | BMW AG        | Kolben          |   350 | Mittel
         AUF-2024-005   | BMW AG        | Kurbelwelle     |   300 | Mittel
         AUF-2024-007   | Mercedes-Benz | Getriebegehäuse |   250 | Mittel
         AUF-2024-002   | Audi AG       | Kurbelwelle     |   200 | Mittel
         AUF-2024-008   | Audi AG       | Pleuelstange    |   180 | Klein
         AUF-2024-004   | Porsche AG    | Kolben          |   150 | Klein
         AUF-2024-009   | Porsche AG    | Kurbelwelle     |   120 | Klein
        (10 rows)
        ```

        ```sql
        -- Anzahl Aufträge pro Kategorie
        SELECT
            COUNT(CASE WHEN menge < 200 THEN 1 END) AS klein,
            COUNT(CASE WHEN menge BETWEEN 200 AND 400 THEN 1 END) AS mittel,
            COUNT(CASE WHEN menge > 400 THEN 1 END) AS gross,
            COUNT(*) AS gesamt
        FROM produktionsauftraege;
        ```

        ```sql title="Output"
         klein | mittel | gross | gesamt
        -------+--------+-------+--------
             3 |      6 |     1 |     10
        (1 row)
        ```

???+ question "Aufgabe 7: COALESCE - Wartungsintervalle"

    Zeige alle Maschinen mit ihrem Wartungsintervall. Falls NULL, zeige "Nicht definiert".

    **Anforderungen:**
    - Verwende COALESCE für wartungsintervall_tage
    - Zeige: Maschinenname, Wartungsintervall (oder "Nicht definiert")
    - Berechne nächste Wartung basierend auf letzter Wartung + Intervall

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.maschinenname,
            COALESCE(m.wartungsintervall_tage::TEXT, 'Nicht definiert') AS wartungsintervall,
            MAX(w.wartungsdatum) AS letzte_wartung,
            CASE
                WHEN m.wartungsintervall_tage IS NOT NULL AND MAX(w.wartungsdatum) IS NOT NULL
                THEN MAX(w.wartungsdatum) + m.wartungsintervall_tage
                ELSE NULL
            END AS naechste_wartung_faellig
        FROM maschinen m
        LEFT JOIN wartungsprotokolle w ON m.maschinen_id = w.maschinen_id
        GROUP BY m.maschinenname, m.wartungsintervall_tage
        ORDER BY m.maschinenname;
        ```

        ```sql title="Output"
         maschinenname         | wartungsintervall | letzte_wartung | naechste_wartung_faellig
        -----------------------+-------------------+----------------+--------------------------
         CNC-Fraese Alpha      | 90                | 2024-02-10     | 2024-05-10
         Drehbank Beta         | 90                | 2024-03-05     | 2024-06-03
         Lackieranlage Delta   | Nicht definiert   |           NULL |                     NULL
         Schweissroboter Gamma | 60                |           NULL |                     NULL
        (4 rows)
        ```

        **Erklärung:** COALESCE ersetzt NULL-Werte im Wartungsintervall durch "Nicht definiert". Die nächste Wartung wird berechnet, falls Intervall und letzte Wartung bekannt sind.

???+ question "Aufgabe 8: Kombiniert - Umfassende Maschinenanalyse"

    Erstelle einen kompletten Bericht pro Maschine mit allen wichtigen Kennzahlen.

    **Anforderungen:**
    - Maschinenname, Typ, Status
    - Anzahl Produktionsaufträge
    - Anzahl Wartungen, durchschnittliche Wartungskosten (gerundet)
    - Gesamtersatzteilkosten (gerundet)
    - Kategorisierung der Ersatzteilkosten: Niedrig (<1500), Mittel (1500-3000), Hoch (>3000)
    - Nur Maschinen mit mindestens 1 Produktionsauftrag ODER 1 Wartung
    - Sortiere nach Gesamtersatzteilkosten absteigend

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.maschinenname,
            m.maschinentyp,
            m.maschinenstatus,
            COUNT(DISTINCT p.auftrag_id) AS anzahl_auftraege,
            COUNT(DISTINCT w.wartungs_id) AS anzahl_wartungen,
            COALESCE(ROUND(AVG(w.kosten), 2), 0) AS avg_wartungskosten,
            COALESCE(
                ROUND(
                    (SELECT SUM(e.preis * me.benoetigte_anzahl)
                     FROM maschinen_ersatzteile me
                     INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
                     WHERE me.maschinen_id = m.maschinen_id),
                    2
                ),
                0
            ) AS gesamtersatzteilkosten,
            CASE
                WHEN (SELECT SUM(e.preis * me.benoetigte_anzahl)
                      FROM maschinen_ersatzteile me
                      INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
                      WHERE me.maschinen_id = m.maschinen_id) > 3000 THEN 'Hoch'
                WHEN (SELECT SUM(e.preis * me.benoetigte_anzahl)
                      FROM maschinen_ersatzteile me
                      INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
                      WHERE me.maschinen_id = m.maschinen_id) >= 1500 THEN 'Mittel'
                WHEN (SELECT SUM(e.preis * me.benoetigte_anzahl)
                      FROM maschinen_ersatzteile me
                      INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
                      WHERE me.maschinen_id = m.maschinen_id) IS NOT NULL THEN 'Niedrig'
                ELSE 'Keine Daten'
            END AS kostenklasse
        FROM maschinen m
        LEFT JOIN produktionsauftraege p ON m.maschinen_id = p.maschinen_id
        LEFT JOIN wartungsprotokolle w ON m.maschinen_id = w.maschinen_id
        GROUP BY m.maschinen_id, m.maschinenname, m.maschinentyp, m.maschinenstatus
        HAVING COUNT(DISTINCT p.auftrag_id) > 0 OR COUNT(DISTINCT w.wartungs_id) > 0
        ORDER BY gesamtersatzteilkosten DESC;
        ```

        ```sql title="Output"
         maschinenname    | maschinentyp | maschinenstatus | anzahl_auftraege | anzahl_wartungen | avg_wartungskosten | gesamtersatzteilkosten | kostenklasse
        ------------------+--------------+-----------------+------------------+------------------+--------------------+------------------------+--------------
         CNC-Fraese Alpha | CNC-Fraese   | Aktiv           |                3 |                2 |             550.00 |                6081.00 | Hoch
         Drehbank Beta    | Drehbank     | Aktiv           |                2 |                2 |             150.00 |                1210.50 | Niedrig
        (2 rows)
        ```

        **Erklärung:** Diese komplexe Abfrage kombiniert mehrere fortgeschrittene Techniken: Unterabfragen, JOINs, Aggregationen, CASE WHEN, COALESCE und ROUND. Sie zeigt einen umfassenden Überblick über jede Maschine mit allen relevanten Kennzahlen.

---

## Zusammenfassung 📌

Mit den fortgeschrittenen SQL-Techniken aus diesem Kapitel haben wir unser Werkzeugkasten deutlich erweitert. Diese Techniken erlauben es uns, komplexe Abfragen elegant zu formulieren und Daten direkt in der Datenbank zu transformieren und zu analysieren, ohne auf Anwendungslogik zurückgreifen zu müssen.

Die wichtigsten Erkenntnisse:

- **Unterabfragen** erlauben Abfragen innerhalb von Abfragen und machen komplexe Fragestellungen in einem Statement lösbar
- **IN / NOT IN** prüft Mitgliedschaft in einer Menge, aber Achtung bei NULL-Werten
- **EXISTS / NOT EXISTS** prüft, ob eine Unterabfrage Ergebnisse liefert - oft schneller als IN und ohne NULL-Probleme
- **String-Funktionen** (CONCAT, UPPER, LOWER, SUBSTRING, LENGTH, TRIM, REPLACE) zur Textverarbeitung
- **Datumsfunktionen** (CURRENT_DATE, NOW, EXTRACT, AGE) für zeitbasierte Analysen
- **CASE WHEN** bringt if-else-Logik nach SQL und ermöglicht Kategorisierungen
- **COALESCE** behandelt NULL-Werte elegant ohne komplizierte Konstrukte
- **Mathematische Funktionen** (ROUND, CEIL, FLOOR, ABS, POWER, SQRT) für Berechnungen

---

Im nächsten Kapitel lernen wir über **Datenintegrität & Constraints** – wie wir sicherstellen, dass nur gültige Daten in unsere Datenbank gelangen! Mit den hier gelernten Techniken können wir nun auch komplexe Abfragen formulieren, doch die Qualität unserer Daten ist ebenso wichtig wie unsere Fähigkeit, sie abzufragen.