# Indizes & Performance-Grundlagen

Du hast eine Datenbank mit 1 Million Studierenden. Wie lange dauert es, einen bestimmten Studierenden zu finden?

**Ohne Index:** Die Datenbank muss **alle** 1 Million Zeilen durchsuchen – das kann Sekunden dauern!  
**Mit Index:** Die Datenbank findet den Eintrag in **Millisekunden**!

Indizes sind wie das **Inhaltsverzeichnis** in einem Buch – sie beschleunigen die Suche dramatisch.

---

## Was ist ein Index?

Ein **Index** ist eine **Datenstruktur**, die es der Datenbank ermöglicht, Daten **schnell zu finden**, ohne die gesamte Tabelle durchsuchen zu müssen.

### Analogie: Telefonbuch

```
Ohne Index (unsortiert):          Mit Index (alphabetisch sortiert):
─────────────────────────         ───────────────────────────────────
Max Schmidt                       Anna Müller      ← Schnell gefunden!
Lisa Weber                        Lisa Weber
Tom Bauer                         Max Schmidt
Anna Müller   ← Wo ist sie?      Tom Bauer
```

Im Telefonbuch sind die Namen **alphabetisch sortiert** – das ist ein Index! Du musst nicht alle Einträge durchsuchen, sondern kannst direkt zu "M" springen.

---

## Wie funktioniert ein Index?

Ein Index erstellt eine **sortierte Datenstruktur** (meist ein **B-Tree**), die auf eine oder mehrere Spalten zeigt.

```mermaid
graph TD
    A[SELECT * FROM studierende<br>WHERE nachname = 'Müller']:::peach
    B{Index auf<br>nachname?}:::teal
    C[Ohne Index:<br>Scan aller 1M Zeilen<br>⏱️ langsam]:::peach
    D[Mit Index:<br>Direkt zu 'Müller'<br>⚡ schnell]:::teal
    
    A --> B
    B -->|Nein| C
    B -->|Ja| D

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:2px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:2px;
```

### Technisch: B-Tree Struktur

Indizes verwenden meist **B-Trees** (balancierte Bäume), die Suchen in **O(log n)** Zeit ermöglichen:

- 1.000 Zeilen → ~10 Vergleiche
- 1.000.000 Zeilen → ~20 Vergleiche
- 1.000.000.000 Zeilen → ~30 Vergleiche

---

## Index erstellen

### Syntax

```sql
CREATE INDEX indexname ON tabellenname (spalte);
```

### Beispiel: Index auf Nachname

```sql
CREATE INDEX idx_nachname ON studierende (nachname);
```

Jetzt sind Abfragen nach `nachname` **viel schneller**:

```sql
-- Diese Abfrage ist jetzt blitzschnell!
SELECT * FROM studierende WHERE nachname = 'Müller';
```

### Index auf mehrere Spalten

```sql
CREATE INDEX idx_name ON studierende (nachname, vorname);
```

Dieser Index hilft bei:

```sql
-- Nutzt den Index
SELECT * FROM studierende WHERE nachname = 'Müller';

-- Nutzt den Index vollständig
SELECT * FROM studierende WHERE nachname = 'Müller' AND vorname = 'Anna';

-- Nutzt den Index NICHT (vorname ist nicht am Anfang)
SELECT * FROM studierende WHERE vorname = 'Anna';
```

<div style="background:#FFB48211; border-left:4px solid #FFB482; padding:12px 16px; margin:16px 0;">
<strong>📘 Regel bei Multi-Column-Indizes:</strong><br>
Der Index funktioniert nur, wenn die <strong>erste Spalte</strong> in der WHERE-Klausel vorkommt. Ein Index auf <code>(nachname, vorname)</code> hilft nicht bei <code>WHERE vorname = 'Anna'</code>.
</div>

---

## Wann sind Indizes sinnvoll?

### ✅ Indizes sind hilfreich für:

- **WHERE-Klauseln** – Häufig gefilterte Spalten
- **JOIN-Bedingungen** – Fremdschlüssel sollten IMMER einen Index haben
- **ORDER BY** – Sortierte Abfragen
- **Große Tabellen** – Ab ~1000 Zeilen macht ein Index Sinn

### ❌ Indizes sind NICHT hilfreich für:

- **Kleine Tabellen** (< 100 Zeilen) – Der Overhead lohnt sich nicht
- **Spalten mit wenigen unterschiedlichen Werten** – z.B. `geschlecht` (nur 2-3 Werte)
- **Häufig geänderte Spalten** – Der Index muss ständig aktualisiert werden
- **Selten abgefragte Spalten** – Kein Nutzen bei seltener Verwendung

---

## Primärschlüssel und Indizes

**Wichtig:** Primärschlüssel haben **automatisch einen Index**!

```sql
CREATE TABLE studierende (
    matrikel_nr INTEGER PRIMARY KEY,  -- Hat automatisch einen Index!
    vorname VARCHAR(50),
    nachname VARCHAR(50)
);
```

Abfragen nach `matrikel_nr` sind daher immer schnell:

```sql
-- Automatisch optimiert durch PRIMARY KEY Index
SELECT * FROM studierende WHERE matrikel_nr = 12345;
```

---

## Unique-Constraint und Indizes

Auch **UNIQUE** Constraints erstellen automatisch einen Index:

```sql
CREATE TABLE studierende (
    matrikel_nr INTEGER PRIMARY KEY,
    email VARCHAR(100) UNIQUE  -- Hat automatisch einen Index!
);
```

---

## Foreign Keys und Indizes

**Wichtig:** Fremdschlüssel haben in PostgreSQL **NICHT automatisch** einen Index!

```sql
CREATE TABLE angestellte (
    angestellte_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    abteilung_id INTEGER,
    FOREIGN KEY (abteilung_id) REFERENCES abteilungen(abteilung_id)
);
```

**Problem:** JOINs über `abteilung_id` sind langsam!

**Lösung:** Manuell einen Index erstellen:

```sql
CREATE INDEX idx_abteilung ON angestellte (abteilung_id);
```

<div style="background:#dc262611; border-left:4px solid #dc2626; padding:12px 16px; margin:16px 0;">
<strong>⚠️ Best Practice:</strong><br>
Erstelle <strong>IMMER</strong> einen Index auf Fremdschlüssel-Spalten! Das beschleunigt JOINs enorm.
</div>

---

## EXPLAIN - Abfrage-Analyse

Mit **EXPLAIN** kannst du sehen, wie PostgreSQL eine Abfrage ausführt und ob Indizes verwendet werden.

### Syntax

```sql
EXPLAIN SELECT * FROM studierende WHERE nachname = 'Müller';
```

### Beispiel ohne Index

```sql
EXPLAIN SELECT * FROM studierende WHERE nachname = 'Müller';
```

**Ergebnis:**

```
Seq Scan on studierende  (cost=0.00..18.50 rows=1 width=...)
  Filter: ((nachname)::text = 'Müller'::text)
```

- **Seq Scan** = Sequential Scan = **Vollständiger Tabellenscan** (langsam!)
- Die Datenbank durchsucht alle Zeilen

### Beispiel mit Index

```sql
CREATE INDEX idx_nachname ON studierende (nachname);

EXPLAIN SELECT * FROM studierende WHERE nachname = 'Müller';
```

**Ergebnis:**

```
Index Scan using idx_nachname on studierende  (cost=0.15..8.17 rows=1 width=...)
  Index Cond: ((nachname)::text = 'Müller'::text)
```

- **Index Scan** = Die Datenbank benutzt den Index! (schnell! ⚡)

---

## EXPLAIN ANALYZE - Echte Ausführungszeit

**EXPLAIN ANALYZE** führt die Abfrage tatsächlich aus und zeigt die echte Zeit:

```sql
EXPLAIN ANALYZE SELECT * FROM studierende WHERE nachname = 'Müller';
```

**Ergebnis:**

```
Index Scan using idx_nachname on studierende  
  (cost=0.15..8.17 rows=1 width=...)
  (actual time=0.025..0.027 rows=1 loops=1)
Planning Time: 0.123 ms
Execution Time: 0.052 ms
```

- **Execution Time** = Tatsächliche Ausführungszeit
- **rows** = Anzahl der gefundenen Zeilen

---

## Index löschen

```sql
DROP INDEX indexname;
```

Beispiel:

```sql
DROP INDEX idx_nachname;
```

---

## Kosten von Indizes

Indizes sind nicht "kostenlos" – sie haben Nachteile:

### Speicherplatz

Jeder Index benötigt **zusätzlichen Speicherplatz**:

- Eine Tabelle mit 1 Million Zeilen: ~100 MB
- Index darauf: ~20-50 MB zusätzlich

### Langsamere Schreiboperationen

Bei **INSERT**, **UPDATE**, **DELETE** muss der Index **aktualisiert** werden:

```sql
-- Ohne Index: Schnell
INSERT INTO studierende VALUES (...);

-- Mit 5 Indizes: 5x langsamer!
INSERT INTO studierende VALUES (...);
```

<div style="background:#FFB48211; border-left:4px solid #FFB482; padding:12px 16px; margin:16px 0;">
<strong>⚖️ Trade-off:</strong><br>
Indizes beschleunigen <strong>Lesevorgänge</strong> (SELECT), verlangsamen aber <strong>Schreibvorgänge</strong> (INSERT/UPDATE/DELETE). Finde die Balance!
</div>

---

## Praktische Beispiele

### Beispiel 1: E-Commerce-Shop

```sql
CREATE TABLE produkte (
    produkt_id SERIAL PRIMARY KEY,           -- Auto-Index
    name VARCHAR(200),
    kategorie VARCHAR(50),
    preis NUMERIC(10, 2),
    erstellt_am TIMESTAMP
);

-- Häufige Abfrage: Nach Kategorie filtern
CREATE INDEX idx_kategorie ON produkte (kategorie);

-- Häufige Abfrage: Nach Preis sortieren
CREATE INDEX idx_preis ON produkte (preis);

-- Häufige Abfrage: Neue Produkte zuerst
CREATE INDEX idx_erstellt ON produkte (erstellt_am DESC);
```

### Beispiel 2: Social Media

```sql
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    benutzer_id INTEGER,
    inhalt TEXT,
    erstellt_am TIMESTAMP,
    FOREIGN KEY (benutzer_id) REFERENCES benutzer(benutzer_id)
);

-- Sehr wichtig: Fremdschlüssel-Index für JOINs
CREATE INDEX idx_benutzer ON posts (benutzer_id);

-- Oft genutzt: Neueste Posts zuerst
CREATE INDEX idx_zeitstempel ON posts (erstellt_am DESC);

-- Kombination: Posts eines Users, sortiert nach Zeit
CREATE INDEX idx_benutzer_zeit ON posts (benutzer_id, erstellt_am DESC);
```

---

## Praktische Übungen 🎯

### Aufgabe 1: Index-Analyse

Gegeben:

```sql
CREATE TABLE bestellungen (
    bestellung_id SERIAL PRIMARY KEY,
    kunde_id INTEGER,
    produkt_id INTEGER,
    datum DATE,
    betrag NUMERIC(10, 2)
);
```

Welche Indizes würdest du erstellen, wenn folgende Abfragen häufig ausgeführt werden?

1. `SELECT * FROM bestellungen WHERE kunde_id = 123;`
2. `SELECT * FROM bestellungen WHERE datum >= '2024-01-01';`
3. `SELECT * FROM bestellungen WHERE kunde_id = 123 AND datum >= '2024-01-01';`

<details>
<summary>💡 Lösung anzeigen</summary>

```sql
-- Für Abfrage 1 und 3
CREATE INDEX idx_kunde ON bestellungen (kunde_id);

-- Für Abfrage 2
CREATE INDEX idx_datum ON bestellungen (datum);

-- Optimal für Abfrage 3 (kombiniert)
CREATE INDEX idx_kunde_datum ON bestellungen (kunde_id, datum);
```

Der kombinierte Index `idx_kunde_datum` ist am effizientesten für Abfrage 3.
</details>

### Aufgabe 2: EXPLAIN interpretieren

Was bedeutet dieser EXPLAIN-Output?

```
Seq Scan on angestellte  (cost=0.00..1245.00 rows=50000 width=100)
  Filter: (gehalt > 50000)
```

<details>
<summary>💡 Lösung anzeigen</summary>

- **Seq Scan** = Sequentieller Scan = Die gesamte Tabelle wird durchsucht
- **rows=50000** = Es werden 50.000 Zeilen erwartet
- **Filter: (gehalt > 50000)** = Erst nach dem Scannen wird gefiltert

**Problem:** Kein Index! Die Abfrage wäre mit einem Index auf `gehalt` viel schneller.

**Lösung:**
```sql
CREATE INDEX idx_gehalt ON angestellte (gehalt);
```
</details>

---

## Zusammenfassung 📌

- **Indizes** beschleunigen Abfragen durch sortierte Datenstrukturen (B-Trees)
- **Primärschlüssel** und **UNIQUE** haben automatisch Indizes
- **Fremdschlüssel** brauchen **manuelle** Indizes für schnelle JOINs
- **CREATE INDEX** erstellt einen Index
- **EXPLAIN** zeigt, wie eine Abfrage ausgeführt wird
- **EXPLAIN ANALYZE** misst die tatsächliche Ausführungszeit
- **Trade-off:** Indizes beschleunigen SELECT, verlangsamen INSERT/UPDATE/DELETE
- **Best Practice:** Indizes auf häufig gefilterte Spalten und alle Fremdschlüssel

**Faustregel für Indizes:**

✅ Primärschlüssel (automatisch)  
✅ Fremdschlüssel (manuell!)  
✅ Häufig in WHERE/JOIN verwendete Spalten  
✅ Spalten für ORDER BY bei großen Tabellen  
❌ Spalten mit wenigen verschiedenen Werten  
❌ Selten abgefragte Spalten

---

Im nächsten Kapitel lernen wir über **Transaktionen & ACID** – wie wir Datenintegrität bei gleichzeitigen Zugriffen sicherstellen!