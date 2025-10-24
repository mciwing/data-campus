# Ausblick & Weiterführende Themen

In den vorherigen Kapiteln haben wir die **Grundlagen relationaler Datenbanken** mit PostgreSQL kennengelernt. Wir können jetzt:

✅ Datenbanken modellieren und entwerfen  
✅ Tabellen erstellen und Beziehungen definieren  
✅ Daten einfügen, ändern und löschen  
✅ Komplexe Abfragen mit Joins und Aggregationen schreiben  
✅ Transaktionen für sichere Datenoperationen nutzen  

Doch die Welt der Datenbanken ist **viel größer** als das, was wir bisher gesehen haben. In diesem Kapitel werfen wir einen **Blick über den Tellerrand** und schauen uns weiterführende Themen an, die in professionellen Umgebungen wichtig sind.

Dieses Kapitel gibt **keinen vollständigen Überblick**, sondern dient als **Orientierung**, welche Themen es noch gibt und wo ihr ansetzen könnt, um euer Wissen zu vertiefen.

---

## Views (Sichten)

### Was sind Views?

Eine **View** ist eine **virtuelle Tabelle**, die auf einer oder mehreren echten Tabellen basiert. Views speichern keine eigenen Daten, sondern definieren eine **gespeicherte Abfrage**, die bei jedem Aufruf ausgeführt wird.

### Syntax

```sql
CREATE VIEW view_name AS
SELECT spalte1, spalte2, ...
FROM tabelle
WHERE bedingung;
```

### Beispiel: View für verfügbare Maschinen

Wir können eine View erstellen, die nur **betriebsbereite Maschinen** zeigt:

```sql
CREATE VIEW betriebsbereite_maschinen AS
SELECT m.maschinen_id, m.name, m.typ, m.standort
FROM maschinen m
WHERE m.status = 'Aktiv'
  AND m.maschinen_id NOT IN (
    SELECT maschinen_id
    FROM wartungsauftraege
    WHERE status = 'in_arbeit'
);
```

**Verwendung:**

```sql
-- View verwenden wie eine normale Tabelle
SELECT * FROM betriebsbereite_maschinen;

-- Mit zusätzlichen Filtern
SELECT * FROM betriebsbereite_maschinen
WHERE typ = 'CNC-Fräse';
```

### Warum Views verwenden?

**Vorteile:**

* **Vereinfachung** – Komplexe Joins müssen nicht jedes Mal neu geschrieben werden
* **Sicherheit** – Benutzer sehen nur ausgewählte Daten (z.B. ohne sensible Spalten)
* **Konsistenz** – Alle nutzen dieselbe Abfragelogik
* **Abstraktion** – Die zugrundeliegende Tabellenstruktur kann sich ändern, ohne dass Anwendungen angepasst werden müssen

**Nachteile:**

* Bei sehr komplexen Views kann die **Performance** leiden
* **Keine Datenänderung** – UPDATE/INSERT über Views ist nur eingeschränkt möglich

### View löschen

```sql
DROP VIEW IF EXISTS betriebsbereite_maschinen;
```

---

## Stored Procedures & Functions

### Was sind Stored Procedures?

**Stored Procedures** (gespeicherte Prozeduren) und **Functions** sind **vordefinierte SQL-Programme**, die in der Datenbank gespeichert werden. Sie können:

* Mehrere SQL-Befehle ausführen
* Parameter entgegennehmen
* Kontrollstrukturen verwenden (IF, LOOP, WHILE)
* Wiederverwendet werden

### Unterschied: Function vs. Procedure

| Function | Procedure |
|----------|-----------|
| Gibt **einen Wert** zurück | Gibt **keinen** oder **mehrere Werte** zurück |
| Kann in SELECT-Statements verwendet werden | Wird mit CALL aufgerufen |
| Sollte keine Daten ändern | Darf Daten ändern |

### Beispiel: Function für Maschinenstatus

```sql
CREATE OR REPLACE FUNCTION ist_betriebsbereit(p_maschinen_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1
        FROM wartungsauftraege
        WHERE maschinen_id = p_maschinen_id
          AND status = 'in_arbeit'
    );
END;
$$ LANGUAGE plpgsql;
```

**Verwendung:**

```sql
SELECT name, ist_betriebsbereit(maschinen_id) AS betriebsbereit
FROM maschinen;
```

### Beispiel: Procedure für überfällige Wartungen

```sql
CREATE OR REPLACE PROCEDURE markiere_ueberfaellige_wartungen()
LANGUAGE plpgsql AS $$
DECLARE
    ueberfaellig RECORD;
BEGIN
    FOR ueberfaellig IN
        SELECT maschinen_id, name,
               CURRENT_DATE - installationsdatum AS tage_seit_installation
        FROM maschinen
        WHERE status = 'Aktiv'
          AND installationsdatum < CURRENT_DATE - INTERVAL '365 days'
          AND maschinen_id NOT IN (
              SELECT maschinen_id FROM wartungsprotokolle
              WHERE wartungsdatum > CURRENT_DATE - INTERVAL '365 days'
          )
    LOOP
        -- Hier würde ein Wartungsauftrag erstellt
        RAISE NOTICE 'Wartung überfällig für Maschine %: % Tage seit letzter Wartung',
                     ueberfaellig.name,
                     ueberfaellig.tage_seit_installation;
    END LOOP;
END;
$$;
```

**Verwendung:**

```sql
CALL markiere_ueberfaellige_wartungen();
```

---

## Trigger

### Was sind Trigger?

Ein **Trigger** ist ein **automatisch ausgeführtes SQL-Programm**, das bei bestimmten Ereignissen (INSERT, UPDATE, DELETE) aktiviert wird.

### Wann sind Trigger nützlich?

* **Automatische Protokollierung** – Alle Änderungen aufzeichnen
* **Datenkonsistenz** – Automatisch abhängige Daten aktualisieren
* **Geschäftslogik** – Regeln automatisch durchsetzen

### Beispiel: Automatische Aktualisierung eines Zeitstempels

```sql
-- Tabelle erweitern
ALTER TABLE maschinen
ADD COLUMN letzte_aenderung TIMESTAMP;

-- Trigger-Function erstellen
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.letzte_aenderung = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger erstellen
CREATE TRIGGER maschine_update_timestamp
BEFORE UPDATE ON maschinen
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

**Wirkung:** Jedes Mal, wenn eine Maschine geändert wird, wird automatisch `letzte_aenderung` aktualisiert.

### Trigger-Arten

* **BEFORE** – Vor der Operation (kann Daten noch ändern)
* **AFTER** – Nach der Operation (für Logging)
* **FOR EACH ROW** – Für jede betroffene Zeile
* **FOR EACH STATEMENT** – Einmal pro Statement

---

## JSON-Support in PostgreSQL

PostgreSQL bietet **native Unterstützung für JSON-Daten**, was flexible, semi-strukturierte Datenspeicherung ermöglicht.

### JSON-Datentypen

* `JSON` – Speichert JSON als Text (langsamer)
* `JSONB` – Speichert JSON binär (schneller, empfohlen)

### Beispiel: Maschine mit Metadaten

```sql
CREATE TABLE maschinen_extended (
    maschinen_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    typ VARCHAR(100) NOT NULL,
    metadaten JSONB  -- Flexible zusätzliche Daten
);

INSERT INTO maschinen_extended (name, typ, metadaten) VALUES
('CNC-Fräse Alpha', 'CNC-Fräse',
 '{"leistung_kw": 15.5, "hersteller": "DMG MORI", "gewicht_kg": 3200, "tags": ["Präzision", "5-Achsen"]}'::jsonb);
```

### JSON-Abfragen

```sql
-- Zugriff auf JSON-Felder
SELECT name, metadaten->>'hersteller' AS hersteller
FROM maschinen_extended;

-- Nach JSON-Werten filtern
SELECT name
FROM maschinen_extended
WHERE metadaten->>'hersteller' = 'DMG MORI';

-- In JSON-Arrays suchen
SELECT name
FROM maschinen_extended
WHERE metadaten->'tags' ? 'Präzision';
```

### Wann JSON verwenden?

**Vorteile:**

* Flexibel für unterschiedliche Datenstrukturen
* Keine Schema-Änderungen nötig
* Gut für externe APIs und Logs

**Nachteile:**

* Weniger performant als normale Spalten
* Schwieriger zu normalisieren
* Integritätsprüfungen komplizierter

---

## PostgreSQL Arrays

PostgreSQL unterstützt **Array-Datentypen** für Listen von Werten.

### Beispiel: Mehrere Techniker pro Maschine

```sql
CREATE TABLE maschinen_array (
    maschinen_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    verantwortliche_techniker TEXT[]  -- Array von Text-Werten
);

INSERT INTO maschinen_array (name, verantwortliche_techniker) VALUES
('CNC-Fräse Alpha', ARRAY['Thomas Müller', 'Sandra Schmidt']),
('Drehbank Beta', ARRAY['Klaus Weber']);
```

### Array-Operationen

```sql
-- Alle Techniker anzeigen
SELECT name, verantwortliche_techniker FROM maschinen_array;

-- Nach bestimmtem Techniker suchen
SELECT name
FROM maschinen_array
WHERE 'Thomas Müller' = ANY(verantwortliche_techniker);

-- Anzahl der Techniker
SELECT name, array_length(verantwortliche_techniker, 1) AS anzahl_techniker
FROM maschinen_array;
```

---

## Backup & Recovery

### Warum Backups?

Datenbanken speichern oft **geschäftskritische Daten**. Bei Hardware-Ausfällen, Software-Fehlern oder menschlichen Fehlern ist ein **Backup essentiell**.

### PostgreSQL Backup-Methoden

#### 1. pg_dump – Logisches Backup

Exportiert die Datenbank als **SQL-Skript**.

```bash
# Gesamte Datenbank sichern
pg_dump produktionsdb > produktionsdb_backup.sql

# Nur Struktur (ohne Daten)
pg_dump --schema-only produktionsdb > struktur.sql

# Nur Daten (ohne Struktur)
pg_dump --data-only produktionsdb > daten.sql
```

**Wiederherstellen:**

```bash
psql produktionsdb < produktionsdb_backup.sql
```

#### 2. pg_dumpall – Alle Datenbanken

```bash
pg_dumpall > alle_datenbanken.sql
```

#### 3. Physisches Backup – Dateisystem-Level

Kopiert die **gesamten Datenbankdateien** (schneller, aber komplexer).

### Best Practices

* **Regelmäßige Backups** – Automatisiert (z.B. täglich)
* **Offsite-Speicherung** – Backups an anderem Ort aufbewahren
* **Backup-Tests** – Regelmäßig testen, ob Wiederherstellung funktioniert

---

## NoSQL vs. SQL: Ein kurzer Vergleich

### Was ist NoSQL?

**NoSQL** steht für "Not Only SQL" und bezeichnet Datenbanksysteme, die **nicht das relationale Modell** verwenden.

### NoSQL-Datenbanktypen

| Typ | Beispiele | Anwendungsfall |
|-----|-----------|----------------|
| **Key-Value** | Redis, DynamoDB | Caching, Session-Speicher |
| **Document** | MongoDB, CouchDB | Flexible, verschachtelte Daten |
| **Column-Family** | Cassandra, HBase | Big Data, Analytics |
| **Graph** | Neo4j, ArangoDB | Soziale Netzwerke, Empfehlungssysteme |

### SQL vs. NoSQL

| Merkmal | SQL (Relational) | NoSQL |
|---------|-----------------|-------|
| **Schema** | Fest definiert | Flexibel / schema-less |
| **Datenmodell** | Tabellen mit Beziehungen | Dokumente, Key-Value, Graphen |
| **ACID** | Volle Unterstützung | Oft eingeschränkt (BASE) |
| **Skalierung** | Vertikal (stärkerer Server) | Horizontal (mehr Server) |
| **Anwendungsfall** | Strukturierte Daten, Transaktionen | Unstrukturierte Daten, hohe Skalierung |

### Wann welche Datenbank?

**Wähle SQL (PostgreSQL, MySQL), wenn:**

* Daten **strukturiert** und **normalisiert** sind
* **ACID-Garantien** wichtig sind (z.B. Finanztransaktionen)
* Komplexe **Abfragen und Joins** benötigt werden

**Wähle NoSQL (MongoDB, Redis), wenn:**

* Daten **unstrukturiert** oder **sehr unterschiedlich** sind
* **Extreme Skalierung** nötig ist
* **Geschwindigkeit** wichtiger als Konsistenz ist

---

## PostgreSQL-spezifische Features

PostgreSQL bietet viele **fortgeschrittene Features**, die über Standard-SQL hinausgehen:

### 1. Full-Text Search

Leistungsstarke **Volltextsuche** direkt in der Datenbank.

```sql
-- Suchindex erstellen
ALTER TABLE maschinen ADD COLUMN textsearch tsvector;
UPDATE maschinen SET textsearch = to_tsvector('german', name || ' ' || typ);

-- Suchen
SELECT name, typ
FROM maschinen
WHERE textsearch @@ to_tsquery('german', 'Fräse');
```

### 2. Geospatial-Daten mit PostGIS

Erweiterung für **geografische Daten** (Koordinaten, Karten).

```sql
-- PostGIS aktivieren
CREATE EXTENSION postgis;

-- Produktionsstandorte speichern
CREATE TABLE produktionsstandorte (
    name VARCHAR(100),
    standort GEOGRAPHY(POINT)
);

-- Entfernung berechnen
SELECT name,
       ST_Distance(standort, ST_MakePoint(13.04, 47.79)::geography) AS entfernung_meter
FROM produktionsstandorte;
```

### 3. Window Functions

Berechnungen über **Zeilen hinweg** ohne GROUP BY.

```sql
-- Ranking von Maschinen nach Wartungshäufigkeit
SELECT
    m.name,
    COUNT(w.wartungs_id) AS anzahl_wartungen,
    RANK() OVER (ORDER BY COUNT(w.wartungs_id) DESC) AS rang
FROM maschinen m
LEFT JOIN wartungsprotokolle w ON m.maschinen_id = w.maschinen_id
GROUP BY m.name;
```

---

## Weiterführende Ressourcen

Wenn ihr tiefer in Datenbanken einsteigen möchtet, sind hier einige Empfehlungen:

### Bücher

* **"PostgreSQL: Up and Running"** – O'Reilly (Praxisnah)
* **"Database System Concepts"** – Silberschatz et al. (Theoretisch fundiert)
* **"Designing Data-Intensive Applications"** – Martin Kleppmann (Modern, umfassend)

### Online-Kurse

* **PostgreSQL Tutorial** – [postgresqltutorial.com](https://www.postgresqltutorial.com)
* **SQL-Übungen** – [sqlzoo.net](https://sqlzoo.net)
* **Interaktives Lernen** – [Mode Analytics SQL Tutorial](https://mode.com/sql-tutorial/)

### Dokumentation

* **PostgreSQL Docs** – [postgresql.org/docs](https://www.postgresql.org/docs/)
* **SQL Standard** – [ISO/IEC 9075](https://www.iso.org/standard/63555.html)

### Tools

* **DBeaver** – Universeller Datenbank-Client
* **pgAdmin** – PostgreSQL-spezifisches Admin-Tool
* **DataGrip** – Kommerzielles Profi-Tool (JetBrains)

---

## Zusammenfassung 📌

In diesem Kapitel haben wir einen **Ausblick** auf weiterführende Datenbankthemen erhalten:

✅ **Views** – Virtuelle Tabellen für vereinfachte Abfragen  
✅ **Stored Procedures & Functions** – Wiederverwendbare SQL-Programme  
✅ **Trigger** – Automatische Aktionen bei Datenänderungen  
✅ **JSON-Support** – Flexible, semi-strukturierte Daten  
✅ **Arrays** – Listen direkt in Spalten speichern  
✅ **Backup & Recovery** – Datensicherung und -wiederherstellung  
✅ **NoSQL vs. SQL** – Unterschiede und Anwendungsfälle  
✅ **PostgreSQL-Features** – Full-Text Search, PostGIS, Window Functions  

**Wichtigste Erkenntnis:** Die Grundlagen, die ihr in diesem Skript gelernt habt, sind das **Fundament** für alle weiterführenden Themen. Mit diesem Wissen könnt ihr jetzt:

* Professionelle Datenbanken entwerfen und implementieren
* Komplexe Abfragen schreiben und optimieren
* Die richtige Datenbank für eure Projekte wählen
* Euch in fortgeschrittene Themen selbstständig einarbeiten

---

## Abschließende Gedanken

Datenbanken sind das **Herzstück** fast jeder modernen Anwendung. Egal ob Web-App, Mobile-App, Desktop-Software oder Data Science – überall werden Daten gespeichert, verwaltet und analysiert.

Das **relationale Modell** mit SQL ist seit über 50 Jahren der Standard und wird es auch in absehbarer Zukunft bleiben. Die Konzepte, die ihr gelernt habt – Normalisierung, Beziehungen, Joins, Transaktionen – sind **universell anwendbar** und werden euch in eurer gesamten IT-Karriere begleiten.

### Nächste Schritte

1. **Üben, üben, üben** – Erstellt eigene Projekte und Datenbanken
2. **Echte Datenbanken nutzen** – Probiert größere Datasets aus (z.B. von Kaggle)
3. **Performance optimieren** – Lernt über Indizes, Query-Planung und Tuning
4. **Andere Datenbanken erkunden** – MySQL, MongoDB, Redis ausprobieren
5. **In die Tiefe gehen** – Stored Procedures, Trigger, Advanced SQL

Viel Erfolg auf eurer Reise in die Welt der Datenbanken! 🚀

---

???+ quote "Zitat"
    *"Data is the new oil."* – Clive Humby
    
    Daten sind das wertvollste Gut des 21. Jahrhunderts. Wer sie versteht, strukturiert und nutzt, hat einen enormen Wettbewerbsvorteil.

???+ success "Glückwunsch! 🎉"
    Ihr habt das Ende dieses Skripts erreicht und alle wichtigen Grundlagen zu Datenbanken und SQL gelernt. Nutzt dieses Wissen als **Startpunkt für eure eigenen Datenbankprojekte**!