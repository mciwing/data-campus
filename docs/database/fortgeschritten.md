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

### Beispiel: Maschinen über dem Durchschnittsanschaffungsjahr

**Frage:** Welche Maschinen wurden später angeschafft als im Durchschnitt?

**Ohne Unterabfrage:**

```sql
-- 1. Durchschnitt berechnen
SELECT AVG(anschaffungsjahr) FROM maschinen;  -- Ergebnis: 2019

-- 2. Dann manuell verwenden
SELECT name FROM maschinen WHERE anschaffungsjahr > 2019;
```

**Mit Unterabfrage (in einer Abfrage!):**

```sql
SELECT name, anschaffungsjahr
FROM maschinen
WHERE anschaffungsjahr > (SELECT AVG(anschaffungsjahr) FROM maschinen);
```

Die innere Abfrage `(SELECT AVG(anschaffungsjahr) FROM maschinen)` wird **zuerst** ausgeführt und liefert einen Wert (z.B. 2019), der dann in der äußeren Abfrage verwendet wird.

---

## Unterabfragen mit IN

Mit **IN** können wir prüfen, ob ein Wert in einer Menge von Werten (aus einer Unterabfrage) enthalten ist.

### Beispiel: Maschinen, die Spindelmotoren verwenden

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

**Ablauf:**

1. Innere Abfrage findet alle `maschinen_id` von Maschinen mit Spindelmotoren
2. Äußere Abfrage filtert Maschinen, deren `maschinen_id` in dieser Liste ist

### NOT IN

```sql
-- Maschinen, die KEINE Ersatzteile zugeordnet haben
SELECT name
FROM maschinen
WHERE maschinen_id NOT IN (
    SELECT DISTINCT maschinen_id
    FROM maschinen_ersatzteile
);
```

<div style="background:#FFB48211; border-left:4px solid #FFB482; padding:12px 16px; margin:16px 0;">
<strong>⚠️ Achtung bei NULL!</strong><br>
<code>NOT IN</code> kann bei NULL-Werten unerwartete Ergebnisse liefern. Verwende in solchen Fällen besser <code>NOT EXISTS</code> (siehe unten).
</div>

---

## EXISTS und NOT EXISTS

**EXISTS** prüft, ob eine Unterabfrage **mindestens ein Ergebnis** liefert.

### Beispiel: Techniker mit zugeordneten Maschinen

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

### NOT EXISTS

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

**Wichtig:** Die Unterabfrage **muss einen Alias** haben (hier: `AS maschinen_kosten`)!

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

Mit **CASE WHEN** können wir bedingte Logik direkt in SQL einbauen – ähnlich wie `if-else` in Programmiersprachen.

### Syntax

```sql
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

**COALESCE** gibt den ersten **nicht-NULL-Wert** aus einer Liste zurück.

### Syntax

```sql
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

### Aufgabe 1: Unterabfragen

Finde alle Ersatzteile, die teurer sind als der Durchschnittspreis.

<details>
<summary>💡 Lösung anzeigen</summary>

```sql
SELECT teilname, preis
FROM ersatzteile
WHERE preis > (SELECT AVG(preis) FROM ersatzteile);
```
</details>

### Aufgabe 2: String-Funktionen

Erstelle für alle Maschinen eine Seriennummer im Format: `TYP-ID-JAHR` (z.B. `CNC-1-2019`)

<details>
<summary>💡 Lösung anzeigen</summary>

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
</details>

### Aufgabe 3: CASE WHEN

Kategorisiere Maschinen nach Anschaffungsjahr:
- ab 2022: "Neu"
- 2018-2021: "Mittel"
- vor 2018: "Alt"

<details>
<summary>💡 Lösung anzeigen</summary>

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
</details>

### Aufgabe 4: Kombiniert

Finde Maschinen, die überdurchschnittlich hohe Ersatzteilkosten haben.

<details>
<summary>💡 Lösung anzeigen</summary>

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