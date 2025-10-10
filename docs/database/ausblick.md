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

### Beispiel: View für verfügbare Bücher

Aus unserem Bibliotheksprojekt (Kapitel 11) können wir eine View erstellen, die nur **verfügbare Bücher** zeigt:

```sql
CREATE VIEW verfuegbare_buecher AS
SELECT b.isbn, b.titel, b.autor, b.genre
FROM buecher b
WHERE b.isbn NOT IN (
    SELECT buch_isbn 
    FROM ausleihen 
    WHERE rueckgabedatum IS NULL
);
```

**Verwendung:**

```sql
-- View verwenden wie eine normale Tabelle
SELECT * FROM verfuegbare_buecher;

-- Mit zusätzlichen Filtern
SELECT * FROM verfuegbare_buecher 
WHERE genre = 'Fantasy';
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
DROP VIEW IF EXISTS verfuegbare_buecher;
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

### Beispiel: Function für Ausleihstatus

```sql
CREATE OR REPLACE FUNCTION ist_verfuegbar(p_isbn VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 
        FROM ausleihen 
        WHERE buch_isbn = p_isbn 
          AND rueckgabedatum IS NULL
    );
END;
$$ LANGUAGE plpgsql;
```

**Verwendung:**

```sql
SELECT titel, ist_verfuegbar(isbn) AS verfuegbar
FROM buecher;
```

### Beispiel: Procedure für automatische Mahngebühren

```sql
CREATE OR REPLACE PROCEDURE berechne_mahngebuehren()
LANGUAGE plpgsql AS $$
DECLARE
    ueberfaellige RECORD;
BEGIN
    FOR ueberfaellige IN 
        SELECT ausleihe_id, mitglied_id, 
               CURRENT_DATE - ausleihdatum AS tage
        FROM ausleihen
        WHERE rueckgabedatum IS NULL 
          AND ausleihdatum < CURRENT_DATE - INTERVAL '14 days'
    LOOP
        -- Hier würde die Mahngebühr berechnet und eingefügt
        RAISE NOTICE 'Mahngebühr für Mitglied %: % Euro', 
                     ueberfaellige.mitglied_id, 
                     (ueberfaellige.tage - 14) * 0.50;
    END LOOP;
END;
$$;
```

**Verwendung:**

```sql
CALL berechne_mahngebuehren();
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
ALTER TABLE buecher 
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
CREATE TRIGGER buch_update_timestamp
BEFORE UPDATE ON buecher
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

**Wirkung:** Jedes Mal, wenn ein Buch geändert wird, wird automatisch `letzte_aenderung` aktualisiert.

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

### Beispiel: Buch mit Metadaten

```sql
CREATE TABLE buecher_extended (
    isbn VARCHAR(13) PRIMARY KEY,
    titel VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    metadaten JSONB  -- Flexible zusätzliche Daten
);

INSERT INTO buecher_extended (isbn, titel, autor, metadaten) VALUES
('9783499267758', 'Der Medicus', 'Noah Gordon', 
 '{"seitenzahl": 896, "sprache": "Deutsch", "gewicht_g": 520, "tags": ["Medizin", "Mittelalter"]}'::jsonb);
```

### JSON-Abfragen

```sql
-- Zugriff auf JSON-Felder
SELECT titel, metadaten->>'sprache' AS sprache
FROM buecher_extended;

-- Nach JSON-Werten filtern
SELECT titel
FROM buecher_extended
WHERE metadaten->>'sprache' = 'Deutsch';

-- In JSON-Arrays suchen
SELECT titel
FROM buecher_extended
WHERE metadaten->'tags' ? 'Medizin';
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

### Beispiel: Mehrere Autoren

```sql
CREATE TABLE buecher_array (
    isbn VARCHAR(13) PRIMARY KEY,
    titel VARCHAR(200) NOT NULL,
    autoren TEXT[]  -- Array von Text-Werten
);

INSERT INTO buecher_array (isbn, titel, autoren) VALUES
('9783551551672', 'Harry Potter', ARRAY['J.K. Rowling']),
('9783499267758', 'Der Medicus', ARRAY['Noah Gordon']);
```

### Array-Operationen

```sql
-- Alle Autoren anzeigen
SELECT titel, autoren FROM buecher_array;

-- Nach bestimmtem Autor suchen
SELECT titel 
FROM buecher_array 
WHERE 'J.K. Rowling' = ANY(autoren);

-- Anzahl der Autoren
SELECT titel, array_length(autoren, 1) AS anzahl_autoren
FROM buecher_array;
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
pg_dump bibliothek > bibliothek_backup.sql

# Nur Struktur (ohne Daten)
pg_dump --schema-only bibliothek > struktur.sql

# Nur Daten (ohne Struktur)
pg_dump --data-only bibliothek > daten.sql
```

**Wiederherstellen:**

```bash
psql bibliothek < bibliothek_backup.sql
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
ALTER TABLE buecher ADD COLUMN textsearch tsvector;
UPDATE buecher SET textsearch = to_tsvector('german', titel || ' ' || autor);

-- Suchen
SELECT titel, autor 
FROM buecher 
WHERE textsearch @@ to_tsquery('german', 'Medizin');
```

### 2. Geospatial-Daten mit PostGIS

Erweiterung für **geografische Daten** (Koordinaten, Karten).

```sql
-- PostGIS aktivieren
CREATE EXTENSION postgis;

-- Bibliotheksstandorte speichern
CREATE TABLE bibliotheken (
    name VARCHAR(100),
    standort GEOGRAPHY(POINT)
);

-- Entfernung berechnen
SELECT name, 
       ST_Distance(standort, ST_MakePoint(13.04, 47.79)::geography) AS entfernung_meter
FROM bibliotheken;
```

### 3. Window Functions

Berechnungen über **Zeilen hinweg** ohne GROUP BY.

```sql
-- Ranking von Büchern nach Ausleihen
SELECT 
    b.titel,
    COUNT(a.ausleihe_id) AS ausleihen,
    RANK() OVER (ORDER BY COUNT(a.ausleihe_id) DESC) AS rang
FROM buecher b
LEFT JOIN ausleihen a ON b.isbn = a.buch_isbn
GROUP BY b.titel;
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