# Fortgeschrittene Abfragen

Wir haben bereits viel gelernt: Tabellen erstellen, Daten einfügen, filtern, sortieren, JOINs – die Grundlagen sind gelegt! Jetzt wird es Zeit für **fortgeschrittene SQL-Techniken**, die deine Abfragen noch mächtiger machen.

In diesem Kapitel lernst du:

- **Unterabfragen (Subqueries)** – Abfragen in Abfragen
- **String-Funktionen** – Texte manipulieren
- **Datumsfunktionen** – Mit Datum und Zeit arbeiten
- **CASE-WHEN** – Bedingte Logik in SQL
- **COALESCE** – NULL-Werte elegant behandeln

---

## Unterabfragen (Subqueries)

Eine **Unterabfrage** (Subquery) ist eine SELECT-Abfrage **innerhalb** einer anderen Abfrage.

### Beispiel: Studierende über dem Durchschnittsgehalt

**Frage:** Welche Angestellten verdienen mehr als das Durchschnittsgehalt?

**Ohne Unterabfrage:**

```sql
-- 1. Durchschnitt berechnen
SELECT AVG(gehalt) FROM angestellte;  -- Ergebnis: 4000

-- 2. Dann manuell verwenden
SELECT name FROM angestellte WHERE gehalt > 4000;
```

**Mit Unterabfrage (in einer Abfrage!):**

```sql
SELECT name, gehalt
FROM angestellte
WHERE gehalt > (SELECT AVG(gehalt) FROM angestellte);
```

Die innere Abfrage `(SELECT AVG(gehalt) FROM angestellte)` wird **zuerst** ausgeführt und liefert einen Wert (z.B. 4000), der dann in der äußeren Abfrage verwendet wird.

---

## Unterabfragen mit IN

Mit **IN** können wir prüfen, ob ein Wert in einer Menge von Werten (aus einer Unterabfrage) enthalten ist.

### Beispiel: Studierende, die Informatik-Kurse belegen

```sql
-- Welche Studierenden belegen Kurse aus der IT-Fakultät?
SELECT vorname, nachname
FROM studierende
WHERE matrikel_nr IN (
    SELECT matrikel_nr 
    FROM kurs_belegungen kb
    INNER JOIN kurse k ON kb.kurs_id = k.kurs_id
    WHERE k.dozent LIKE '%Dr. Weber%'
);
```

**Ablauf:**

1. Innere Abfrage findet alle `matrikel_nr` von Studierenden bei Dr. Weber
2. Äußere Abfrage filtert Studierende, deren `matrikel_nr` in dieser Liste ist

### NOT IN

```sql
-- Studierende, die KEINE Kurse belegen
SELECT vorname, nachname
FROM studierende
WHERE matrikel_nr NOT IN (
    SELECT DISTINCT matrikel_nr 
    FROM kurs_belegungen
);
```

<div style="background:#FFB48211; border-left:4px solid #FFB482; padding:12px 16px; margin:16px 0;">
<strong>⚠️ Achtung bei NULL!</strong><br>
<code>NOT IN</code> kann bei NULL-Werten unerwartete Ergebnisse liefern. Verwende in solchen Fällen besser <code>NOT EXISTS</code> (siehe unten).
</div>

---

## EXISTS und NOT EXISTS

**EXISTS** prüft, ob eine Unterabfrage **mindestens ein Ergebnis** liefert.

### Beispiel: Abteilungen mit Angestellten

```sql
-- Welche Abteilungen haben mindestens einen Angestellten?
SELECT name
FROM abteilungen ab
WHERE EXISTS (
    SELECT 1 
    FROM angestellte a 
    WHERE a.abteilung_id = ab.abteilung_id
);
```

**Erklärung:** Für jede Abteilung prüft die Unterabfrage, ob es Angestellte gibt. `EXISTS` ist wahr, sobald **mindestens eine Zeile** gefunden wird.

### NOT EXISTS

```sql
-- Abteilungen OHNE Angestellte
SELECT name
FROM abteilungen ab
WHERE NOT EXISTS (
    SELECT 1 
    FROM angestellte a 
    WHERE a.abteilung_id = ab.abteilung_id
);
```

<div style="background:#00948511; border-left:4px solid #009485; padding:12px 16px; margin:16px 0;">
<strong>💡 EXISTS vs. IN:</strong><br>
<ul style="margin:8px 0 0 0;">
<li><code>EXISTS</code> ist oft <strong>schneller</strong>, besonders bei großen Datenmengen</li>
<li><code>EXISTS</code> stoppt, sobald ein Treffer gefunden wird</li>
<li><code>EXISTS</code> hat keine Probleme mit NULL-Werten</li>
</ul>
</div>

---

## Unterabfragen in FROM (Derived Tables)

Man kann eine Unterabfrage auch in der **FROM-Klausel** verwenden – als wäre sie eine Tabelle!

```sql
-- Durchschnittsgehalt pro Abteilung, aber nur für Abteilungen mit Durchschnitt > 4000
SELECT abt_name, avg_gehalt
FROM (
    SELECT 
        ab.name AS abt_name,
        AVG(a.gehalt) AS avg_gehalt
    FROM angestellte a
    INNER JOIN abteilungen ab ON a.abteilung_id = ab.abteilung_id
    GROUP BY ab.name
) AS abt_durchschnitt
WHERE avg_gehalt > 4000;
```

**Wichtig:** Die Unterabfrage **muss einen Alias** haben (hier: `AS abt_durchschnitt`)!

---

## String-Funktionen

SQL bietet viele Funktionen zur Textverarbeitung.

### Die wichtigsten String-Funktionen

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

```sql
-- Vollständiger Name aus Vor- und Nachname
SELECT 
    CONCAT(vorname, ' ', nachname) AS vollstaendiger_name
FROM studierende;
```

```sql
-- Alle Namen in Großbuchstaben
SELECT 
    UPPER(nachname) AS nachname_gross,
    vorname
FROM studierende
ORDER BY nachname_gross;
```

```sql
-- Erste 3 Buchstaben des Nachnamens
SELECT 
    vorname,
    SUBSTRING(nachname, 1, 3) AS name_kurz
FROM studierende;
```

```sql
-- E-Mail-Adressen generieren
SELECT 
    CONCAT(
        LOWER(vorname), 
        '.', 
        LOWER(nachname), 
        '@uni.at'
    ) AS email
FROM studierende;
```

**Ergebnis:**

```
 email 
──────────────────────
 anna.mueller@uni.at
 max.schmidt@uni.at
 lisa.weber@uni.at
```

---

## Datumsfunktionen

PostgreSQL bietet umfangreiche Funktionen für Datum und Zeit.

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

```sql
-- Tabelle mit Geburtsdatum erweitern
ALTER TABLE studierende ADD COLUMN geburtsdatum DATE;

UPDATE studierende SET geburtsdatum = '2002-05-15' WHERE matrikel_nr = 12345;
UPDATE studierende SET geburtsdatum = '2001-08-20' WHERE matrikel_nr = 12346;
UPDATE studierende SET geburtsdatum = '2000-12-03' WHERE matrikel_nr = 12347;
```

```sql
-- Alter berechnen
SELECT 
    vorname,
    nachname,
    geburtsdatum,
    EXTRACT(YEAR FROM AGE(geburtsdatum)) AS alter
FROM studierende;
```

```sql
-- Studierende, die diesen Monat Geburtstag haben
SELECT vorname, nachname, geburtsdatum
FROM studierende
WHERE EXTRACT(MONTH FROM geburtsdatum) = EXTRACT(MONTH FROM CURRENT_DATE);
```

```sql
-- Studierende nach Geburtsjahr gruppieren
SELECT 
    EXTRACT(YEAR FROM geburtsdatum) AS geburtsjahr,
    COUNT(*) AS anzahl
FROM studierende
GROUP BY EXTRACT(YEAR FROM geburtsdatum)
ORDER BY geburtsjahr;
```

---

## CASE WHEN - Bedingte Logik

Mit **CASE WHEN** können wir bedingte Logik direkt in SQL einbauen – ähnlich wie `if-else` in Programmiersprachen.

### Syntax

```sql
CASE
    WHEN bedingung1 THEN ergebnis1
    WHEN bedingung2 THEN ergebnis2
    ELSE standard_ergebnis
END
```

### Beispiel: Noten-Kategorien

```sql
SELECT 
    vorname,
    nachname,
    note,
    CASE
        WHEN note <= 1.5 THEN 'Sehr gut'
        WHEN note <= 2.5 THEN 'Gut'
        WHEN note <= 3.5 THEN 'Befriedigend'
        WHEN note <= 4.0 THEN 'Ausreichend'
        ELSE 'Nicht bestanden'
    END AS note_text
FROM kurs_belegungen kb
INNER JOIN studierende s ON kb.matrikel_nr = s.matrikel_nr;
```

**Ergebnis:**

```
 vorname │ nachname │ note │ note_text      
─────────┼──────────┼──────┼────────────────
 Anna    │ Müller   │  1.3 │ Sehr gut
 Anna    │ Müller   │  2.0 │ Gut
 Max     │ Schmidt  │  3.2 │ Befriedigend
```

### Beispiel: Gehaltskategorien

```sql
SELECT 
    name,
    gehalt,
    CASE
        WHEN gehalt < 3000 THEN 'Niedrig'
        WHEN gehalt < 4500 THEN 'Mittel'
        ELSE 'Hoch'
    END AS gehaltskategorie
FROM angestellte
ORDER BY gehalt;
```

### CASE in Aggregationen

```sql
-- Wie viele Studierende haben Note besser als 2.0?
SELECT 
    COUNT(CASE WHEN note <= 2.0 THEN 1 END) AS sehr_gut_bis_gut,
    COUNT(CASE WHEN note > 2.0 THEN 1 END) AS befriedigend_oder_schlechter,
    COUNT(*) AS gesamt
FROM kurs_belegungen;
```

---

## COALESCE - NULL-Werte behandeln

**COALESCE** gibt den ersten **nicht-NULL-Wert** aus einer Liste zurück.

### Syntax

```sql
COALESCE(wert1, wert2, wert3, ..., standard)
```

### Beispiel: Standardwerte für NULL

```sql
-- Wenn keine Abteilung: "Keine Abteilung"
SELECT 
    name,
    COALESCE(abteilung_id::TEXT, 'Keine Abteilung') AS abteilung
FROM angestellte;
```

### Beispiel: Notendurchschnitt mit Standardwert

```sql
SELECT 
    s.vorname,
    s.nachname,
    COALESCE(AVG(kb.note), 0) AS durchschnitt
FROM studierende s
LEFT JOIN kurs_belegungen kb ON s.matrikel_nr = kb.matrikel_nr
GROUP BY s.vorname, s.nachname;
```

Studierende ohne Noten bekommen `0` statt `NULL`.

---

## Mathematische Funktionen

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

```sql
-- Noten auf 1 Nachkommastelle runden
SELECT 
    vorname,
    nachname,
    ROUND(AVG(note), 1) AS durchschnittsnote
FROM kurs_belegungen kb
INNER JOIN studierende s ON kb.matrikel_nr = s.matrikel_nr
GROUP BY vorname, nachname;
```

---

## Praktische Übungen 🎯

### Aufgabe 1: Unterabfragen

Finde alle Kurse, die teurer sind als der Durchschnitt (gemessen an ECTS).

<details>
<summary>💡 Lösung anzeigen</summary>

```sql
SELECT kursname, ects
FROM kurse
WHERE ects > (SELECT AVG(ects) FROM kurse);
```
</details>

### Aufgabe 2: String-Funktionen

Erstelle für alle Studierenden eine E-Mail-Adresse im Format: `vorname.nachname@student.uni.at`

<details>
<summary>💡 Lösung anzeigen</summary>

```sql
SELECT 
    vorname,
    nachname,
    CONCAT(LOWER(vorname), '.', LOWER(nachname), '@student.uni.at') AS email
FROM studierende;
```
</details>

### Aufgabe 3: CASE WHEN

Kategorisiere Kurse nach ECTS: 
- 1-3 ECTS: "Klein"
- 4-5 ECTS: "Mittel"  
- 6+ ECTS: "Groß"

<details>
<summary>💡 Lösung anzeigen</summary>

```sql
SELECT 
    kursname,
    ects,
    CASE
        WHEN ects <= 3 THEN 'Klein'
        WHEN ects <= 5 THEN 'Mittel'
        ELSE 'Groß'
    END AS groesse
FROM kurse;
```
</details>

### Aufgabe 4: Kombiniert

Finde Studierende, die überdurchschnittlich gute Noten haben, und zeige ihre E-Mail-Adresse.

<details>
<summary>💡 Lösung anzeigen</summary>

```sql
SELECT 
    s.vorname,
    s.nachname,
    CONCAT(LOWER(s.vorname), '.', LOWER(s.nachname), '@student.uni.at') AS email,
    ROUND(AVG(kb.note), 2) AS durchschnitt
FROM studierende s
INNER JOIN kurs_belegungen kb ON s.matrikel_nr = kb.matrikel_nr
GROUP BY s.vorname, s.nachname
HAVING AVG(kb.note) < (SELECT AVG(note) FROM kurs_belegungen);
```
</details>

---

## Zusammenfassung 📌

- **Unterabfragen** erlauben Abfragen innerhalb von Abfragen
- **IN / NOT IN** prüft Mitgliedschaft in einer Menge
- **EXISTS / NOT EXISTS** prüft, ob eine Unterabfrage Ergebnisse liefert (oft schneller als IN)
- **String-Funktionen**: CONCAT, UPPER, LOWER, SUBSTRING, LENGTH, TRIM, REPLACE
- **Datumsfunktionen**: CURRENT_DATE, NOW, EXTRACT, AGE
- **CASE WHEN** bringt if-else-Logik nach SQL
- **COALESCE** behandelt NULL-Werte elegant
- **Mathematische Funktionen**: ROUND, CEIL, FLOOR, ABS, POWER, SQRT

**Best Practices:**

✅ EXISTS ist meist schneller als IN  
✅ String-Funktionen für konsistente Formatierung  
✅ CASE WHEN für lesbare kategorisierte Ausgaben  
✅ COALESCE statt komplizierter NULL-Behandlung

---

Im nächsten Kapitel lernen wir über **Datenintegrität & Constraints** – wie wir sicherstellen, dass nur gültige Daten in unsere Datenbank gelangen!