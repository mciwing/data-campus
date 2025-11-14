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

Um uns dies etwas besser vorstellen zu können, betrachten wir folgendes Beispiel. Stellen wir uns vor, wir haben folgende Frage: 

*Welche Maschinen wurden später angeschafft als im Durchschnitt?*

Die Frage an sich ist relativ einfach zu benatworten. Wir können den Durchschnitt der Anschaffungsjahre berechnen und dann die Maschinen filtern, die nach dem Durchschnitt angeschafft wurden. In einem **zweistufigen Vorgehen** könnte dies so aussehen: 

```sql
-- 1. Durchschnitt berechnen
SELECT AVG(anschaffungsjahr) FROM maschinen;  -- Ergebnis: 2019

-- 2. Dann das Ergebnis manuell verwenden
SELECT name FROM maschinen WHERE anschaffungsjahr > 2019;
```
Sow würden wir in der ersten Abfrage das Durchschnittsanschaffungsjahr berechnen und in einer zweiten Abfrage schlussendlich das eigentliche Ergebnis erhalten - die Maschinen, die nach dem Durchschnitt angeschafft wurden. 

Da Programmierer von Haus aus faul sind, wollen wir diese Aufgabe natürlich in einem Schritt lösen. Dazu verwenden wir eine **Unterabfrage**.


```sql
SELECT name, anschaffungsjahr
FROM maschinen
WHERE anschaffungsjahr > (SELECT AVG(anschaffungsjahr) FROM maschinen);
```

Die innere Abfrage `(SELECT AVG(anschaffungsjahr) FROM maschinen)` wird **zuerst** ausgeführt und liefert einen Wert (z.B. 2019), der dann in der äußeren Abfrage verwendet wird. Das ist der große Vorteil von Unterabfragen: Wir müssen nicht erst manuell den Durchschnitt berechnen und dann in eine zweite Abfrage einsetzen - SQL erledigt dies automatisch für uns in einem einzigen Schritt.

---

### `IN` und `NOT IN`

<div style="text-align: center;">
    <img src="https://i.imgflip.com/ac45wn.jpg" alt="IN und NOT IN" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://i.imgflip.com/ac45wn.jpg">imgflip</a></figcaption>
</div>

Eine besondere Art von Unterabfrage sind die **`IN`- und `NOT IN`-Operatoren**. Diese Operatoren erlauben es uns, prüfen zu können, ob ein Wert in einer Menge von Werten (aus einer Unterabfrage) enthalten ist. Dies ist besonders nützlich, wenn die Unterabfrage mehrere Ergebniszeilen liefert und wir prüfen wollen, ob unser Wert in dieser Liste vorkommt. Statt eines einzelnen Wertes wie beim einfachen Vergleich, gibt die Unterabfrage hier unter Umständen eine ganze Liste von Werten zurück.

Schauen wir uns das ganze wieder anhand eines Beispiels an. Wir möchten gerne wissen, welche Maschinen Spindelmotoren verwenden.


```sql
-- Welche Maschinen benötigen Spindelmotoren?
SELECT name
FROM maschinen
WHERE maschinen_id IN (
    SELECT maschinen_id
    FROM maschinen_ersatzteile me
    INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
    WHERE e.teilname LIKE '%Spindelmotor%'
);
```
Der Ablauf dieser Abfrage kann man wie folgt beschreiben:

1. Innere Abfrage 
    - verknüpft die Tabellen `maschinen_ersatzteile` und `ersatzteile` über die `teil_id`
    - filtert die Ergebnisse nach `teilname` mit `LIKE '%Spindelmotor%'`
    - liefert eine Liste von `maschinen_id` zurück
2. Äußere Abfrage 
    - filtert die Maschinen, deren `maschinen_id` in der Liste der der inneren Abfrage ist
    - liefert die Namen der Maschinen zurück


Neben dem `IN`-Operator gibt es auch den `NOT IN`-Operator. Dieser Operator überprüft, ob ein Wert ==NICHT== in einer Menge von Werten (aus einer Unterabfrage) enthalten ist. Das Vorgehen und deren Verwendung ist analog. 

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
        -- Welche Techniker haben mindestens eine zugeordnete Maschine?
        SELECT name
        FROM techniker t
        WHERE EXISTS (
        SELECT 1
            FROM maschinen m
            WHERE m.techniker_id = t.techniker_id
        );
        ```
        
        **Erklärung:** Für jeden Techniker prüft die Unterabfrage, ob es zugeordnete Maschinen gibt. `EXISTS` ist wahr, sobald **mindestens eine Zeile** gefunden wird.

-   __NOT EXISTS__

    ---

    ???+ example "Beispiel"

        ```sql
        -- Techniker OHNE zugeordnete Maschinen
        SELECT name
        FROM techniker t
        WHERE NOT EXISTS (
            SELECT 1
            FROM maschinen m
            WHERE m.techniker_id = t.techniker_id
        );
        ```

        **Erklärung:** Für jeden Techniker prüft die Unterabfrage, ob es keine zugeordnete Maschinen gibt. `NOT EXISTS` ist wahr, sobald **keine Zeile** gefunden wird.


</div>


---

### Unterabfragen in FROM

Man kann eine Unterabfrage auch in der **`FROM`-Klausel** verwenden – als wäre sie eine Tabelle! Diese sogenannten "Derived Tables" oder "Inline Views" sind besonders nützlich, wenn wir mit aggregierten Daten weiterarbeiten möchten. Da wir in der `WHERE`-Klausel keine Aggregatfunktionen direkt verwenden können, erstellen wir eine Unterabfrage, die die Aggregation durchführt, und können dann auf deren Ergebnis filtern.

```sql
-- Durchschnittliche Ersatzteilkosten pro Maschine, aber nur für Maschinen mit Kosten > 1000
SELECT maschine, avg_kosten
FROM (
    SELECT
        m.name AS maschine,
        AVG(e.preis * me.menge) AS avg_kosten
    FROM maschinen m
    INNER JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
    INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
    GROUP BY m.name
) AS maschinen_kosten
WHERE avg_kosten > 1000;
```

???+ warning "Wichtig"
    Die Unterabfrage **muss einen Alias** haben (hier: `AS maschinen_kosten`)!

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

### Praktische Beispiele

Schauen wir uns an, wie wir diese String-Funktionen in der Praxis einsetzen können. Die folgenden Beispiele zeigen typische Anwendungsfälle aus dem Alltag:

```sql
-- Vollständige Maschinenbezeichnung mit Standort
SELECT
    CONCAT(name, ' (', typ, ')') AS vollstaendige_bezeichnung
FROM maschinen;
```

```sql
-- Alle Maschinennamen in Großbuchstaben
SELECT
    UPPER(name) AS name_gross,
    typ
FROM maschinen
ORDER BY name_gross;
```

```sql
-- Erste 3 Buchstaben des Maschinentyps als Kurzform
SELECT
    name,
    SUBSTRING(typ, 1, 3) AS typ_kurz
FROM maschinen;
```

```sql
-- Seriennummern generieren
SELECT
    CONCAT(
        UPPER(SUBSTRING(typ, 1, 3)),
        '-',
        maschinen_id,
        '-',
        anschaffungsjahr
    ) AS seriennummer
FROM maschinen;
```

**Ergebnis:**

```
 seriennummer
──────────────
 CNC-1-2019
 DRE-2-2021
 ROB-3-2020
```

---

## Datumsfunktionen

PostgreSQL bietet umfangreiche Funktionen für Datum und Zeit. Die Arbeit mit Datums- und Zeitwerten ist in vielen Anwendungen zentral - sei es für Protokolle, Zeitstempel, Berechnungen von Zeiträumen oder für zeitbasierte Analysen. Mit den Datumsfunktionen können wir das aktuelle Datum abrufen, Teile eines Datums extrahieren oder Zeitdifferenzen berechnen.

### Die wichtigsten Datumsfunktionen

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

### Beispiele

Schauen wir uns praktische Anwendungsfälle an. Zunächst erweitern wir unsere Tabelle um ein Installationsdatum, damit wir mit echten Datumswerten arbeiten können:

```sql
-- Tabelle mit Installationsdatum erweitern
ALTER TABLE maschinen ADD COLUMN installationsdatum DATE;

UPDATE maschinen SET installationsdatum = '2019-03-15' WHERE maschinen_id = 1;
UPDATE maschinen SET installationsdatum = '2021-06-10' WHERE maschinen_id = 2;
UPDATE maschinen SET installationsdatum = '2020-09-20' WHERE maschinen_id = 3;
```

```sql
-- Betriebsdauer in Jahren berechnen
SELECT
    name,
    installationsdatum,
    EXTRACT(YEAR FROM AGE(installationsdatum)) AS betriebsjahre
FROM maschinen;
```

```sql
-- Maschinen, die diesen Monat installiert wurden (Jahrestag)
SELECT name, installationsdatum
FROM maschinen
WHERE EXTRACT(MONTH FROM installationsdatum) = EXTRACT(MONTH FROM CURRENT_DATE);
```

```sql
-- Maschinen nach Installationsjahr gruppieren
SELECT
    EXTRACT(YEAR FROM installationsdatum) AS installationsjahr,
    COUNT(*) AS anzahl
FROM maschinen
GROUP BY EXTRACT(YEAR FROM installationsdatum)
ORDER BY installationsjahr;
```

---

## CASE WHEN - Bedingte Logik

Mit **CASE WHEN** können wir bedingte Logik direkt in SQL einbauen – ähnlich wie `if-else` in Programmiersprachen. Dies ist besonders nützlich, um Daten zu kategorisieren, Berechnungen basierend auf Bedingungen durchzuführen oder benutzerdefinierte Ausgaben zu erzeugen. Statt die Logik in der Anwendungsschicht zu implementieren, können wir sie direkt in der Datenbankabfrage unterbringen, was oft effizienter und lesbarer ist.

### Syntax

```sql { .yaml .no-copy }
CASE
    WHEN bedingung1 THEN ergebnis1
    WHEN bedingung2 THEN ergebnis2
    ELSE standard_ergebnis
END
```

### Beispiel: Wartungs-Prioritätskategorien

```sql
SELECT
    name,
    anschaffungsjahr,
    CASE
        WHEN anschaffungsjahr >= 2022 THEN 'Neu - Niedrige Priorität'
        WHEN anschaffungsjahr >= 2020 THEN 'Mittel'
        WHEN anschaffungsjahr >= 2015 THEN 'Alt - Hohe Priorität'
        ELSE 'Sehr alt - Kritisch'
    END AS wartungspriorität
FROM maschinen;
```

**Ergebnis:**

```
 name                 │ anschaffungsjahr │ wartungspriorität
──────────────────────┼──────────────────┼───────────────────────
 CNC-Fräse Alpha      │             2019 │ Mittel
 Drehbank Beta        │             2021 │ Mittel
 Schweißroboter Gamma │             2020 │ Mittel
```

### Beispiel: Ersatzteil-Kostenkategorien

```sql
SELECT
    teilname,
    preis,
    CASE
        WHEN preis < 100 THEN 'Günstig'
        WHEN preis < 500 THEN 'Mittel'
        ELSE 'Teuer'
    END AS preiskategorie
FROM ersatzteile
ORDER BY preis;
```

### CASE in Aggregationen

CASE WHEN kann auch innerhalb von Aggregatfunktionen verwendet werden, um selektive Zählungen durchzuführen. Dies ist besonders nützlich für Auswertungen und Berichte:

```sql
-- Wie viele Ersatzteile sind teurer als 500 Euro?
SELECT
    COUNT(CASE WHEN preis <= 500 THEN 1 END) AS guenstig_bis_mittel,
    COUNT(CASE WHEN preis > 500 THEN 1 END) AS teuer,
    COUNT(*) AS gesamt
FROM ersatzteile;
```

---

## COALESCE - NULL-Werte behandeln

**COALESCE** gibt den ersten **nicht-NULL-Wert** aus einer Liste zurück. Diese Funktion ist extrem nützlich im Umgang mit NULL-Werten, die in Datenbanken häufig vorkommen. Statt komplizierte CASE-WHEN-Konstrukte zu schreiben oder NULL-Werte in der Anwendung zu behandeln, bietet COALESCE eine elegante und lesbare Lösung, um Standardwerte für fehlende Daten bereitzustellen.

### Syntax

```sql { .yaml .no-copy }
COALESCE(wert1, wert2, wert3, ..., standard)
```

### Beispiel: Standardwerte für NULL

```sql
-- Wenn kein Techniker zugeordnet: "Nicht zugeordnet"
SELECT
    name,
    COALESCE(techniker_id::TEXT, 'Nicht zugeordnet') AS techniker
FROM maschinen;
```

### Beispiel: Durchschnittskosten mit Standardwert

```sql
SELECT
    m.name,
    COALESCE(AVG(e.preis * me.menge), 0) AS durchschnitt_kosten
FROM maschinen m
LEFT JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
LEFT JOIN ersatzteile e ON me.teil_id = e.teil_id
GROUP BY m.name;
```

Maschinen ohne Ersatzteile bekommen `0` statt `NULL`.

---

## Mathematische Funktionen

Neben String- und Datumsfunktionen bietet SQL auch eine Vielzahl mathematischer Funktionen. Diese sind besonders nützlich für Berechnungen, Rundungen und statistische Auswertungen direkt in der Datenbank.

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

```sql
-- Ersatzteilkosten auf 2 Nachkommastellen runden
SELECT
    m.name,
    ROUND(AVG(e.preis * me.menge), 2) AS durchschnitt_kosten
FROM maschinen m
INNER JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
GROUP BY m.name;
```

---

## Praktische Übungen 🎯

Nun ist es Zeit, die gelernten Techniken zu üben! Die folgenden Aufgaben helfen uns, Unterabfragen, Funktionen und bedingte Logik anzuwenden.

???+ question "Aufgabe 1: Unterabfragen"

    Finde alle Ersatzteile, die teurer sind als der Durchschnittspreis.

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT teilname, preis
        FROM ersatzteile
        WHERE preis > (SELECT AVG(preis) FROM ersatzteile);
        ```

???+ question "Aufgabe 2: String-Funktionen"

    Erstelle für alle Maschinen eine Seriennummer im Format: `TYP-ID-JAHR` (z.B. `CNC-1-2019`)

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            name,
            CONCAT(
                UPPER(SUBSTRING(typ, 1, 3)),
                '-',
                maschinen_id,
                '-',
                anschaffungsjahr
            ) AS seriennummer
        FROM maschinen;
        ```

???+ question "Aufgabe 3: CASE WHEN"

    Kategorisiere Maschinen nach Anschaffungsjahr:

    - ab 2022: "Neu"
    - 2018-2021: "Mittel"
    - vor 2018: "Alt"

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            name,
            anschaffungsjahr,
            CASE
                WHEN anschaffungsjahr >= 2022 THEN 'Neu'
                WHEN anschaffungsjahr >= 2018 THEN 'Mittel'
                ELSE 'Alt'
            END AS altersklasse
        FROM maschinen;
        ```

???+ question "Aufgabe 4: Kombiniert"

    Finde Maschinen, die überdurchschnittlich hohe Ersatzteilkosten haben.

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.name,
            ROUND(SUM(e.preis * me.menge), 2) AS gesamt_kosten
        FROM maschinen m
        INNER JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
        INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
        GROUP BY m.name
        HAVING SUM(e.preis * me.menge) > (
            SELECT AVG(kosten)
            FROM (
                SELECT SUM(e.preis * me.menge) AS kosten
                FROM maschinen m
                INNER JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
                INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
                GROUP BY m.maschinen_id
            ) AS durchschnitt
        );
        ```

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

**Best Practices:**

✅ EXISTS ist meist schneller als IN und hat keine NULL-Probleme
✅ String-Funktionen für konsistente Formatierung nutzen
✅ CASE WHEN für lesbare kategorisierte Ausgaben verwenden
✅ COALESCE statt komplizierter NULL-Behandlung einsetzen
✅ Unterabfragen sparsam einsetzen - manchmal ist ein JOIN übersichtlicher

---

Im nächsten Kapitel lernen wir über **Datenintegrität & Constraints** – wie wir sicherstellen, dass nur gültige Daten in unsere Datenbank gelangen! Mit den hier gelernten Techniken können wir nun auch komplexe Abfragen formulieren, doch die Qualität unserer Daten ist ebenso wichtig wie unsere Fähigkeit, sie abzufragen.