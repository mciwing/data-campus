# Datenmodellierung & Beziehungen

Bisher haben wir mit **einzelnen Tabellen** gearbeitet. Aber die wahre Stärke relationaler Datenbanken liegt darin, **Beziehungen zwischen Tabellen** zu modellieren!

Stell dir vor:

- Eine **Maschine** hat mehrere **Wartungen**
- Ein **Ersatzteil** wird in mehreren **Maschinen** verwendet
- Ein **Techniker** führt viele **Wartungen** durch

Wie modellieren wir solche komplexen Zusammenhänge? Genau darum geht es in diesem Kapitel!

---

## Warum mehrere Tabellen?

Beginnen wir mit einem Problem: Was passiert, wenn wir versuchen, alle Informationen in einer einzigen Tabelle zu speichern?

### Das Problem: Alles in einer Tabelle

Versuchen wir, Maschinen **und** ihre Wartungen in einer einzigen Tabelle zu speichern:

```title="Tabelle: maschinen_mit_wartungen"
 maschinen_id │ name            │ typ      │ wartungsdatum │ techniker    │ kosten
──────────────┼─────────────────┼──────────┼───────────────┼──────────────┼────────
            1 │ CNC-Fräse Alpha │ CNC-Fräse│ 2024-01-15    │ M. Schneider │ 450.00
            1 │ CNC-Fräse Alpha │ CNC-Fräse│ 2024-06-20    │ M. Schneider │ 320.00
            2 │ Drehbank Beta   │ Drehbank │ 2024-01-15    │ M. Schneider │ 280.00
            2 │ Drehbank Beta   │ Drehbank │ 2024-03-10    │ L. Weber     │ 150.00
```

**Was sind die Probleme hier?**

???+ danger "Probleme mit einer einzigen Tabelle"
    **1. Redundanz** - Daten werden unnötig wiederholt

    Der Name "CNC-Fräse Alpha" und "CNC-Fräse" stehen mehrfach in der Tabelle - bei jeder Wartung wird die gesamte Maschineninformation wiederholt!

    **2. Update-Anomalie** - Änderungen müssen mehrfach durchgeführt werden

    Ändert sich der Maschinenname, müssen wir **mehrere Zeilen** ändern. Das ist fehleranfällig und langsam.

    **3. Inkonsistenz** - Widersprüchliche Daten möglich

    Was, wenn wir den Namen nur in einer Zeile ändern? Dann haben wir widersprüchliche Daten:
    ```
    1 │ CNC-Fräse Alpha    │ ...
    1 │ CNC-Fräse Alpha V2 │ ...  ← Welcher Name stimmt jetzt?
    ```

    **4. Speicherverschwendung** - Unnötiger Speicherverbrauch

    Maschineninformationen werden bei jeder Wartung neu gespeichert.

### Die Lösung: Aufteilen in mehrere Tabellen

Stattdessen teilen wir die Daten in **zwei Tabellen** auf:

```title="Tabelle: maschinen"
 maschinen_id │ name            │ typ
──────────────┼─────────────────┼──────────
            1 │ CNC-Fräse Alpha │ CNC-Fräse
            2 │ Drehbank Beta   │ Drehbank
```

```title="Tabelle: wartungsprotokolle"
 wartungs_id │ maschinen_id │ wartungsdatum │ techniker    │ kosten
─────────────┼──────────────┼───────────────┼──────────────┼────────
         101 │            1 │ 2024-01-15    │ M. Schneider │ 450.00
         102 │            1 │ 2024-06-20    │ M. Schneider │ 320.00
         103 │            2 │ 2024-01-15    │ M. Schneider │ 280.00
         104 │            2 │ 2024-03-10    │ L. Weber     │ 150.00
```

**Die Vorteile:**

- ✅ Jede Information nur **einmal** gespeichert
- ✅ Änderungen nur an **einer Stelle** nötig
- ✅ **Keine Inkonsistenzen** möglich
- ✅ Geringerer Speicherverbrauch

---

## Das Entity-Relationship-Modell (ERM)

Bevor wir Tabellen in SQL erstellen, **modellieren** wir die Datenstruktur visuell mit einem **Entity-Relationship-Diagramm** (ER-Diagramm). Das hilft uns, die Struktur zu verstehen und Fehler zu vermeiden.

### Die drei Grundkonzepte

<div class="grid cards" markdown>

-   __Entität (Entity)__

    ---

    Eine **konkrete Instanz** eines Objekts der realen Welt:

    **Beispiele:**
    - Eine konkrete Maschine: "CNC-Fräse Alpha"
    - Ein konkretes Ersatzteil: "Fräskopf Standard"
    - Eine konkrete Wartung: "Wartung Nr. 101"

    ➜ Das sind die **Zeilen** in unseren Tabellen

-   __Entitätstyp (Entity Type)__

    ---

    Eine **Kategorie** gleichartiger Entitäten:

    **Beispiele:**
    - Maschinen (alle Maschinen)
    - Ersatzteile (alle Ersatzteile)
    - Wartungsprotokolle (alle Wartungen)

    Im ER-Diagramm als **Rechteck** dargestellt:

    ```mermaid
    erDiagram
        MASCHINEN {
        }
    ```

    ➜ Das sind unsere **Tabellen**

-   __Attribut__

    ---

    Eine **Eigenschaft** einer Entität:

    **Beispiele für Maschinen:**
    - name: "CNC-Fräse Alpha"
    - typ: "CNC-Fräse"
    - standort: "Halle A"

    Im ER-Diagramm als **Attribute in der Entität** dargestellt:

    ```mermaid
    erDiagram
        MASCHINEN {
            int maschinen_id PK
            string name
            string typ
            string standort
        }
    ```

    ➜ Das sind unsere **Spalten**

-   __Beziehung (Relationship)__

    ---

    Eine **Verbindung** zwischen Entitätstypen:

    **Beispiele:**
    - Maschinen **haben** Wartungen
    - Maschinen **benötigen** Ersatzteile
    - Techniker **führen durch** Wartungen

    Im ER-Diagramm als **Verbindungslinie mit Beschriftung** dargestellt:

    ```mermaid
    erDiagram
        MASCHINEN ||--o{ WARTUNGSPROTOKOLLE : haben
    ```

    ➜ Das werden unsere **Fremdschlüssel**

</div>

???+ tip "Von ER-Diagramm zu Datenbank"
    **Grundprinzip:** Jeder Entitätstyp wird zu einer Tabelle!

    | ER-Konzept | SQL-Umsetzung |
    |------------|---------------|
    | Entitätstyp | Tabelle |
    | Attribut | Spalte |
    | Entität | Zeile |
    | Beziehung | Fremdschlüssel |

---

## Kardinalitäten - Wie viele?

Kardinalitäten beschreiben, **wie viele** Entitäten an einer Beziehung beteiligt sein können. Das ist entscheidend für die Datenmodellierung, denn die Kardinalität bestimmt, wie wir die Beziehung in SQL umsetzen!

### Die drei wichtigsten Beziehungstypen

<div class="grid cards" markdown>

-   __1:n (Eins-zu-Viele)__

    ---

    **Eine** Entität auf der einen Seite steht in Beziehung zu **vielen** Entitäten auf der anderen Seite.

    **Beispiel:** Eine Maschine hat **viele** Wartungen, aber jede Wartung gehört zu **einer** Maschine.

    ```mermaid
    erDiagram
        MASCHINEN ||--o{ WARTUNGSPROTOKOLLE : "haben"
        MASCHINEN {
            int maschinen_id PK
            string name
        }
        WARTUNGSPROTOKOLLE {
            int wartungs_id PK
            date wartungsdatum
            int maschinen_id FK
        }
    ```

    **Weitere Beispiele:**
    - Ein Standort hat viele Maschinen (1:n)
    - Ein Techniker führt viele Wartungen durch (1:n)
    - Eine Abteilung hat viele Mitarbeiter (1:n)

    **Umsetzung in SQL:** Fremdschlüssel auf der "n"-Seite

-   __n:m (Viele-zu-Viele)__

    ---

    **Viele** Entitäten auf der einen Seite stehen in Beziehung zu **vielen** Entitäten auf der anderen Seite.

    **Beispiel:** Eine Maschine benötigt **viele** Ersatzteile, und ein Ersatzteil kann in **vielen** Maschinen verwendet werden.

    ```mermaid
    erDiagram
        MASCHINEN }o--o{ ERSATZTEILE : "benötigen"
        MASCHINEN {
            int maschinen_id PK
            string name
        }
        ERSATZTEILE {
            int teil_id PK
            string teilname
        }
    ```

    **Weitere Beispiele:**
    - Studenten belegen viele Kurse, Kurse haben viele Studenten (n:m)
    - Autoren schreiben viele Bücher, Bücher haben viele Autoren (n:m)
    - Wartungen verwenden viele Ersatzteile, Ersatzteile werden in vielen Wartungen verwendet (n:m)

    **Umsetzung in SQL:** Zwischentabelle mit zwei Fremdschlüsseln

-   __1:1 (Eins-zu-Eins)__

    ---

    **Eine** Entität auf der einen Seite steht in Beziehung zu **genau einer** Entität auf der anderen Seite.

    **Beispiel:** Jede Maschine hat **ein** Wartungshandbuch-PDF, und jedes Wartungshandbuch-PDF gehört zu **einer** Maschine.

    ```mermaid
    erDiagram
        MASCHINEN ||--|| WARTUNGSHANDBUCH_PDF : "hat"
        MASCHINEN {
            int maschinen_id PK
            string name
        }
        WARTUNGSHANDBUCH_PDF {
            int handbuch_id PK
            int maschinen_id FK
            string dateipfad
        }
    ```

    **Weitere Beispiele:**
    - Eine Person hat einen Personalausweis, ein Personalausweis gehört zu einer Person (1:1)
    - Ein Mitarbeiter hat einen Schreibtisch, ein Schreibtisch gehört zu einem Mitarbeiter (1:1)

    **Umsetzung in SQL:** Fremdschlüssel auf einer Seite (oder beide Tabellen zusammenführen)

</div>

???+ info "1:1-Beziehungen sind selten"
    1:1-Beziehungen kommen in der Praxis selten vor. Oft kann man die Informationen auch in einer einzigen Tabelle speichern.

    **Wann macht 1:1 Sinn?**

    - **Große optionale Daten:** z.B. ein Wartungshandbuch-PDF ist sehr groß und wird selten abgefragt
    - **Zugriffsrechte:** Sensible Daten (z.B. Gehälter) in separater Tabelle mit anderen Zugriffsrechten
    - **Historische Gründe:** Altsysteme, die nicht geändert werden können

---

## Fremdschlüssel (Foreign Key)

Ein **Fremdschlüssel** (Foreign Key, FK) ist eine Spalte, die auf den Primärschlüssel einer anderen Tabelle verweist. Damit stellen wir **Beziehungen zwischen Tabellen** her!

```mermaid
erDiagram
    MASCHINEN ||--o{ WARTUNGSPROTOKOLLE : "hat"
    MASCHINEN {
        int maschinen_id PK
        string name
        string typ
    }
    WARTUNGSPROTOKOLLE {
        int wartungs_id PK
        date wartungsdatum
        int maschinen_id FK "verweist auf maschinen"
    }
```

**Erklärung:** Der Fremdschlüssel `maschinen_id` in der Tabelle `wartungsprotokolle` verweist auf den Primärschlüssel `maschinen_id` in der Tabelle `maschinen`.

???+ tip "Primär- vs. Fremdschlüssel"
    | Schlüsseltyp | Beschreibung | Beispiel |
    |--------------|--------------|----------|
    | **Primärschlüssel (PK)** | Identifiziert **eindeutig** eine Zeile in der eigenen Tabelle | `maschinen_id` in `maschinen` |
    | **Fremdschlüssel (FK)** | Verweist auf einen Primärschlüssel in einer **anderen** Tabelle | `maschinen_id` in `wartungsprotokolle` |

---

## 1:n Beziehungen implementieren

Die 1:n-Beziehung ist die häufigste Beziehungsart in relationalen Datenbanken. Schauen wir uns an, wie wir sie umsetzen.

**Goldene Regel:** Der Fremdschlüssel kommt auf die **n-Seite** (die "viele"-Seite)!

### Beispiel: Maschinen und Wartungsprotokolle

**Szenario:** Eine Maschine hat viele Wartungen, jede Wartung gehört zu einer Maschine (1:n)

**ER-Modell:**

```mermaid
erDiagram
    MASCHINEN ||--o{ WARTUNGSPROTOKOLLE : "haben"
```

### Schritt 1: Tabellen erstellen

???+ example "SQL-Code"
    ```sql
    -- Zuerst die "1"-Seite (Maschinen)
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        typ VARCHAR(50) NOT NULL,
        standort VARCHAR(50)
    );

    -- Dann die "n"-Seite (Wartungsprotokolle) mit Fremdschlüssel
    CREATE TABLE wartungsprotokolle (
        wartungs_id SERIAL PRIMARY KEY,
        wartungsdatum DATE NOT NULL,
        beschreibung TEXT,
        kosten NUMERIC(10, 2),
        maschinen_id INTEGER NOT NULL,
        FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
    );
    ```

    **Wichtig:**

    - `FOREIGN KEY (maschinen_id)` - Definiert die Spalte als Fremdschlüssel
    - `REFERENCES maschinen(maschinen_id)` - Verweist auf den Primärschlüssel der `maschinen`-Tabelle

???+ warning "Reihenfolge beachten!"
    Die referenzierte Tabelle (`maschinen`) muss **vor** der referenzierenden Tabelle (`wartungsprotokolle`) erstellt werden!

    ```sql
    -- ✅ Richtig:
    CREATE TABLE maschinen (...);
    CREATE TABLE wartungsprotokolle (...);

    -- ❌ Falsch:
    CREATE TABLE wartungsprotokolle (...);  -- Fehler! maschinen existiert noch nicht
    CREATE TABLE maschinen (...);
    ```

### Schritt 2: Daten einfügen

???+ example "SQL-Code"
    ```sql
    -- Erst Maschinen einfügen
    INSERT INTO maschinen (name, typ, standort)
    VALUES
        ('CNC-Fräse Alpha', 'CNC-Fräse', 'Halle A'),
        ('Drehbank Beta', 'Drehbank', 'Halle A'),
        ('Schweißroboter Gamma', 'Schweißroboter', 'Halle B');

    -- Dann Wartungsprotokolle mit Verweis auf Maschinen
    INSERT INTO wartungsprotokolle (wartungsdatum, beschreibung, kosten, maschinen_id)
    VALUES
        ('2024-01-15', 'Routinewartung', 450.00, 1),        -- für CNC-Fräse Alpha
        ('2024-06-20', 'Fräskopf getauscht', 320.00, 1),    -- für CNC-Fräse Alpha
        ('2024-03-10', 'Ölwechsel', 150.00, 2),             -- für Drehbank Beta
        ('2024-02-05', 'Schweißkopf kalibriert', 280.00, 3); -- für Schweißroboter
    ```

    **Ergebnis:**

    ```title="Tabelle: maschinen"
     maschinen_id │ name                 │ typ            │ standort
    ──────────────┼──────────────────────┼────────────────┼──────────
                1 │ CNC-Fräse Alpha      │ CNC-Fräse      │ Halle A
                2 │ Drehbank Beta        │ Drehbank       │ Halle A
                3 │ Schweißroboter Gamma │ Schweißroboter │ Halle B
    ```

    ```title="Tabelle: wartungsprotokolle"
     wartungs_id │ wartungsdatum │ beschreibung           │ kosten  │ maschinen_id
    ─────────────┼───────────────┼────────────────────────┼─────────┼──────────────
               1 │ 2024-01-15    │ Routinewartung         │  450.00 │            1
               2 │ 2024-06-20    │ Fräskopf getauscht     │  320.00 │            1
               3 │ 2024-03-10    │ Ölwechsel              │  150.00 │            2
               4 │ 2024-02-05    │ Schweißkopf kalibriert │  280.00 │            3
    ```

???+ info "Die Beziehung"
    Die Spalte `maschinen_id` in `wartungsprotokolle` verweist auf `maschinen_id` in `maschinen`:

    - Wartung 1 und 2 gehören zu Maschine 1 (CNC-Fräse Alpha)
    - Wartung 3 gehört zu Maschine 2 (Drehbank Beta)
    - Wartung 4 gehört zu Maschine 3 (Schweißroboter Gamma)

---

## Referenzielle Integrität

**Referenzielle Integrität** bedeutet: Jeder Fremdschlüssel muss auf einen **existierenden** Primärschlüssel verweisen. Die Datenbank stellt sicher, dass keine "verwaisten" Datensätze entstehen.

### Das Problem: Was passiert beim Löschen?

Versuchen wir, eine Maschine zu löschen, die Wartungen hat:

```sql
-- Versuch, Maschine 1 (CNC-Fräse Alpha) zu löschen
DELETE FROM maschinen WHERE maschinen_id = 1;
```

❌ **Fehler!**

```
ERROR: update or delete on table "maschinen" violates foreign key constraint
DETAIL: Key (maschinen_id)=(1) is still referenced from table "wartungsprotokolle".
```

**Was ist das Problem?** Es gibt Wartungsprotokolle, die auf Maschine 1 verweisen. Würden wir die Maschine löschen, würden diese Wartungsprotokolle auf eine nicht existierende Maschine zeigen - sie wären "verwaist"!

### Die Lösung: `ON DELETE` Optionen

Mit `ON DELETE` legen wir fest, was beim Löschen der referenzierten Zeile passieren soll:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Option</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anwendungsfall</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>ON DELETE RESTRICT</code></td>
        <td style="padding:10px 14px;">Löschen wird <strong>verhindert</strong> (Standard)</td>
        <td style="padding:10px 14px;">Sicherheit: Keine Daten verlieren</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>ON DELETE CASCADE</code></td>
        <td style="padding:10px 14px;">Löscht <strong>automatisch alle abhängigen Datensätze</strong></td>
        <td style="padding:10px 14px;">Wenn abhängige Daten ohne Hauptdaten sinnlos sind</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>ON DELETE SET NULL</code></td>
        <td style="padding:10px 14px;">Setzt Fremdschlüssel auf <code>NULL</code></td>
        <td style="padding:10px 14px;">Wenn Beziehung optional ist</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>ON DELETE SET DEFAULT</code></td>
        <td style="padding:10px 14px;">Setzt Fremdschlüssel auf Standardwert</td>
        <td style="padding:10px 14px;">Selten verwendet</td>
    </tr>
    </tbody>
</table>
</div>

### Beispiele für `ON DELETE` Optionen

<div class="grid cards" markdown>

-   __RESTRICT - Löschen verhindern__

    ---

    ???+ example "Beispiel"
        ```sql
        CREATE TABLE wartungsprotokolle (
            wartungs_id SERIAL PRIMARY KEY,
            wartungsdatum DATE,
            maschinen_id INTEGER,
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE RESTRICT  -- Standard, kann auch weggelassen werden
        );
        ```

        **Verhalten:**
        ```sql
        DELETE FROM maschinen WHERE maschinen_id = 1;
        -- ❌ Fehler! Wartungsprotokolle existieren noch
        ```

        **Wann verwenden?**

        - Wenn Daten **nicht versehentlich** gelöscht werden sollen
        - Wenn man **bewusst zuerst** abhängige Daten löschen möchte

-   __CASCADE - Kaskadierende Löschung__

    ---

    ???+ example "Beispiel"
        ```sql
        CREATE TABLE wartungsprotokolle (
            wartungs_id SERIAL PRIMARY KEY,
            wartungsdatum DATE,
            maschinen_id INTEGER,
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE CASCADE  -- Löscht Wartungen automatisch mit
        );
        ```

        **Verhalten:**
        ```sql
        DELETE FROM maschinen WHERE maschinen_id = 1;
        -- ✅ Maschine UND alle ihre Wartungen werden gelöscht
        ```

        **Wann verwenden?**

        - Wenn abhängige Daten **ohne Hauptdaten sinnlos** sind
        - Beispiel: Wartungen ohne Maschine haben keine Bedeutung

    ???+ danger "Vorsicht mit CASCADE!"
        Kaskadierende Löschungen können **viele Daten auf einmal** löschen!

        ```sql
        DELETE FROM abteilungen WHERE abteilung_id = 1;
        -- Löscht die Abteilung UND alle Mitarbeiter UND alle deren Projekte...
        ```

-   __SET NULL - Beziehung auflösen__

    ---

    ???+ example "Beispiel"
        ```sql
        CREATE TABLE wartungsprotokolle (
            wartungs_id SERIAL PRIMARY KEY,
            wartungsdatum DATE,
            maschinen_id INTEGER,  -- Muss NULL erlauben!
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE SET NULL
        );
        ```

        **Verhalten:**
        ```sql
        DELETE FROM maschinen WHERE maschinen_id = 1;
        -- ✅ Maschine gelöscht, Wartungen bleiben mit maschinen_id = NULL
        ```

        **Wann verwenden?**

        - Wenn die Beziehung **optional** ist
        - Beispiel: Mitarbeiter ohne Abteilung (z.B. ausgeschieden, aber Daten bleiben)

    ???+ warning "NULL muss erlaubt sein!"
        Die Fremdschlüssel-Spalte darf **nicht** `NOT NULL` sein, sonst funktioniert `SET NULL` nicht!

-   __SET DEFAULT - Auf Standardwert setzen__

    ---

    ???+ example "Beispiel"
        ```sql
        CREATE TABLE wartungsprotokolle (
            wartungs_id SERIAL PRIMARY KEY,
            wartungsdatum DATE,
            maschinen_id INTEGER DEFAULT 999,  -- Standard: "Unbekannt"
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE SET DEFAULT
        );
        ```

        **Verhalten:**
        ```sql
        DELETE FROM maschinen WHERE maschinen_id = 1;
        -- ✅ maschinen_id wird auf 999 gesetzt ("Unbekannte Maschine")
        ```

        **Wann verwenden?**

        - Selten verwendet
        - Wenn ein "Fallback"-Wert sinnvoll ist

</div>

---

## n:m Beziehungen implementieren

n:m-Beziehungen (Viele-zu-Viele) sind komplexer als 1:n-Beziehungen.

**Das Problem:** Wir können eine n:m-Beziehung **nicht direkt** mit einem einzigen Fremdschlüssel umsetzen!

**Die Lösung:** Eine **Zwischentabelle** (auch **Verbindungstabelle**, **Junction Table** oder **Assoziationstabelle** genannt).

### Warum brauchen wir eine Zwischentabelle?

Betrachten wir ein Beispiel:

**Szenario:** Eine Maschine benötigt viele Ersatzteile, und ein Ersatzteil kann in vielen Maschinen verwendet werden (n:m)

???+ question "Gedankenexperiment"
    **Versuch 1:** Fremdschlüssel in `maschinen`?

    ```
    maschinen:
    maschinen_id │ name            │ ersatzteil_id
    ─────────────┼─────────────────┼──────────────
               1 │ CNC-Fräse Alpha │ ???  -- Mehrere Ersatzteile?
    ```

    ❌ Problem: Eine Maschine braucht **mehrere** Ersatzteile, aber wir können nur **einen** Fremdschlüssel speichern!

    **Versuch 2:** Fremdschlüssel in `ersatzteile`?

    ```
    ersatzteile:
    teil_id │ teilname        │ maschinen_id
    ────────┼─────────────────┼──────────────
          1 │ Spindelmotor    │ ???  -- In mehreren Maschinen?
    ```

    ❌ Problem: Ein Ersatzteil wird in **mehreren** Maschinen verwendet, aber wir können nur **eine** Maschine speichern!

    **Lösung:** Eine Zwischentabelle!

### Beispiel: Maschinen und Ersatzteile

**ER-Modell:**

```mermaid
erDiagram
    MASCHINEN }o--o{ ERSATZTEILE : "benötigen"
```

**SQL-Umsetzung:** Drei Tabellen!

```mermaid
erDiagram
    MASCHINEN ||--o{ MASCHINEN_ERSATZTEILE : "hat"
    ERSATZTEILE ||--o{ MASCHINEN_ERSATZTEILE : "wird_verwendet_in"

    MASCHINEN {
        int maschinen_id PK
        string name
        string typ
    }

    ERSATZTEILE {
        int teil_id PK
        string teilname
        string hersteller
    }

    MASCHINEN_ERSATZTEILE {
        int zuordnung_id PK
        int maschinen_id FK
        int teil_id FK
        int menge "Zusätzliches Attribut"
    }
```

### Schritt 1: Die drei Tabellen erstellen

???+ example "SQL-Code"
    ```sql
    -- Tabelle 1: Maschinen (die "n"-Seite)
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        typ VARCHAR(50),
        standort VARCHAR(50)
    );

    -- Tabelle 2: Ersatzteile (die "m"-Seite)
    CREATE TABLE ersatzteile (
        teil_id SERIAL PRIMARY KEY,
        teilname VARCHAR(100) NOT NULL,
        hersteller VARCHAR(50),
        preis NUMERIC(10, 2)
    );

    -- Tabelle 3: Zwischentabelle (verbindet beide!)
    CREATE TABLE maschinen_ersatzteile (
        zuordnung_id SERIAL PRIMARY KEY,
        maschinen_id INTEGER NOT NULL,
        teil_id INTEGER NOT NULL,
        menge INTEGER DEFAULT 1,  -- Zusätzliches Attribut der Beziehung!
        FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
            ON DELETE CASCADE,
        FOREIGN KEY (teil_id) REFERENCES ersatzteile(teil_id)
            ON DELETE CASCADE
    );
    ```

    **Wichtige Punkte:**

    - Die Zwischentabelle hat **zwei Fremdschlüssel**
    - Jede Zeile in der Zwischentabelle repräsentiert eine **Zuordnung**
    - Zusätzliche Attribute (wie `menge`) können in der Zwischentabelle gespeichert werden

???+ tip "Benennung der Zwischentabelle"
    Typische Namenskonventionen:

    - `tabelle1_tabelle2` (z.B. `maschinen_ersatzteile`)
    - Verb, das die Beziehung beschreibt (z.B. `benötigt`, `verwendet`)
    - Plural beider Tabellennamen (z.B. `maschinen_ersatzteile`)

### Schritt 2: Daten einfügen

???+ example "SQL-Code"
    ```sql
    -- 1. Erst die Maschinen
    INSERT INTO maschinen (name, typ, standort)
    VALUES
        ('CNC-Fräse Alpha', 'CNC-Fräse', 'Halle A'),
        ('Drehbank Beta', 'Drehbank', 'Halle A'),
        ('Schweißroboter Gamma', 'Roboter', 'Halle B');

    -- 2. Dann die Ersatzteile
    INSERT INTO ersatzteile (teilname, hersteller, preis)
    VALUES
        ('Spindelmotor', 'MotorTech GmbH', 1250.00),
        ('Kühlmittelpumpe', 'PumpCo', 380.50),
        ('Schweißdrahtspule', 'WeldSupply', 45.90);

    -- 3. Zuletzt die Zuordnungen
    INSERT INTO maschinen_ersatzteile (maschinen_id, teil_id, menge)
    VALUES
        (1, 1, 1),  -- CNC-Fräse benötigt 1x Spindelmotor
        (1, 2, 2),  -- CNC-Fräse benötigt 2x Kühlmittelpumpe
        (2, 1, 1),  -- Drehbank benötigt 1x Spindelmotor
        (2, 2, 1),  -- Drehbank benötigt 1x Kühlmittelpumpe
        (3, 2, 1),  -- Schweißroboter benötigt 1x Kühlmittelpumpe
        (3, 3, 5);  -- Schweißroboter benötigt 5x Schweißdrahtspule
    ```

    **Visualisierung der Beziehungen:**

    ```
    CNC-Fräse Alpha benötigt:
      ├─ Spindelmotor (1x)
      └─ Kühlmittelpumpe (2x)

    Drehbank Beta benötigt:
      ├─ Spindelmotor (1x)
      └─ Kühlmittelpumpe (1x)

    Schweißroboter Gamma benötigt:
      ├─ Kühlmittelpumpe (1x)
      └─ Schweißdrahtspule (5x)
    ```

???+ info "Umgekehrte Sicht"
    Die Beziehung funktioniert in beide Richtungen:

    **Welche Maschinen verwenden den Spindelmotor?**
    - CNC-Fräse Alpha (1x)
    - Drehbank Beta (1x)

    **Welche Maschinen verwenden die Kühlmittelpumpe?**
    - CNC-Fräse Alpha (2x)
    - Drehbank Beta (1x)
    - Schweißroboter Gamma (1x)

---

## Praktische Übungen

Teste dein Wissen über Datenmodellierung und Beziehungen!

???+ question "Aufgabe 1: 1:n Beziehung"

    Erstelle Tabellen für **Lieferanten** und **Materialien** mit einer 1:n-Beziehung.

    **Anforderungen:**

    - Ein Lieferant liefert **viele** Materialien
    - Jedes Material kommt von **einem** Lieferanten
    - **Lieferanten:** ID, Name, Standort
    - **Materialien:** ID, Materialname, Einheit, Preis, Lieferant

    **Aufgaben:**

    1. Erstelle die beiden Tabellen mit geeigneten Datentypen
    2. Füge mindestens 2 Lieferanten und 4 Materialien ein
    3. Stelle sicher, dass die Fremdschlüssel-Beziehung korrekt definiert ist

    ??? tip "Lösung anzeigen"

        ```sql
        -- Tabelle 1: Lieferanten (die "1"-Seite)
        CREATE TABLE lieferanten (
            lieferant_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            standort VARCHAR(100)
        );

        -- Tabelle 2: Materialien (die "n"-Seite)
        CREATE TABLE materialien (
            material_id SERIAL PRIMARY KEY,
            materialname VARCHAR(100) NOT NULL,
            einheit VARCHAR(20),  -- z.B. kg, Liter, Stück
            preis NUMERIC(10, 2),
            lieferant_id INTEGER NOT NULL,
            FOREIGN KEY (lieferant_id) REFERENCES lieferanten(lieferant_id)
                ON DELETE RESTRICT  -- Lieferant kann nicht gelöscht werden, wenn noch Materialien existieren
        );

        -- Testdaten
        INSERT INTO lieferanten (name, standort)
        VALUES
            ('Stahl-Handel Nord', 'Hamburg'),
            ('ChemTech Solutions', 'Frankfurt');

        INSERT INTO materialien (materialname, einheit, preis, lieferant_id)
        VALUES
            ('Edelstahl 1.4301', 'kg', 8.50, 1),
            ('Aluminium 6061', 'kg', 12.30, 1),
            ('Kühlschmierstoff', 'Liter', 12.90, 2),
            ('Reinigungsmittel', 'Liter', 8.40, 2);
        ```

???+ question "Aufgabe 2: n:m Beziehung"

    Erstelle Tabellen für **Techniker** und **Zertifizierungen** mit einer n:m-Beziehung.

    **Anforderungen:**

    - Ein Techniker hat **viele** Zertifizierungen
    - Eine Zertifizierung wird von **vielen** Technikern gehalten
    - **Techniker:** ID, Name
    - **Zertifizierungen:** ID, Bezeichnung, Gültigkeit (Jahre)
    - **Zertifikatsvergaben** (Zwischentabelle): Welcher Techniker hat welche Zertifizierung + Erwerbs- und Ablaufdatum

    **Aufgaben:**

    1. Erstelle alle drei benötigten Tabellen
    2. Füge mindestens 2 Techniker und 2 Zertifizierungen ein
    3. Erstelle mindestens 3 Zuordnungen in der Zwischentabelle

    ??? tip "Lösung anzeigen"

        ```sql
        -- Tabelle 1: Techniker
        CREATE TABLE techniker (
            techniker_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );

        -- Tabelle 2: Zertifizierungen
        CREATE TABLE zertifizierungen (
            zertifizierung_id SERIAL PRIMARY KEY,
            bezeichnung VARCHAR(200) NOT NULL,
            gueltigkeit_jahre INTEGER
        );

        -- Tabelle 3: Zwischentabelle
        CREATE TABLE zertifikatsvergaben (
            vergabe_id SERIAL PRIMARY KEY,
            techniker_id INTEGER NOT NULL,
            zertifizierung_id INTEGER NOT NULL,
            erwerbsdatum DATE NOT NULL,
            ablaufdatum DATE,
            FOREIGN KEY (techniker_id) REFERENCES techniker(techniker_id)
                ON DELETE CASCADE,
            FOREIGN KEY (zertifizierung_id) REFERENCES zertifizierungen(zertifizierung_id)
                ON DELETE CASCADE
        );

        -- Testdaten
        INSERT INTO techniker (name)
        VALUES
            ('Thomas Müller'),
            ('Sandra Schmidt');

        INSERT INTO zertifizierungen (bezeichnung, gueltigkeit_jahre)
        VALUES
            ('CNC-Programmierung Stufe 2', 5),
            ('Schweißfachmann', 3);

        INSERT INTO zertifikatsvergaben (techniker_id, zertifizierung_id, erwerbsdatum, ablaufdatum)
        VALUES
            (1, 1, '2020-03-15', '2025-03-15'),  -- Thomas hat CNC-Zertifizierung
            (2, 1, '2022-06-10', '2027-06-10'),  -- Sandra hat CNC-Zertifizierung
            (1, 2, '2021-09-20', '2024-09-20');  -- Thomas hat Schweißfachmann-Zertifizierung
        ```

???+ question "Aufgabe 3: Modellierung verstehen"

    Beantworte folgende Fragen:

    1. Warum ist es sinnvoll, Daten in mehrere Tabellen aufzuteilen?
    2. Was ist der Unterschied zwischen einer 1:n und einer n:m Beziehung?
    3. Wann würde man `ON DELETE CASCADE` verwenden und wann `ON DELETE RESTRICT`?

    ??? tip "Lösungen anzeigen"

        **1. Warum mehrere Tabellen?**

        - **Redundanz vermeiden:** Daten werden nur einmal gespeichert
        - **Konsistenz:** Änderungen nur an einer Stelle nötig
        - **Datenintegrität:** Keine widersprüchlichen Daten
        - **Speichereffizienz:** Weniger Speicherplatz benötigt

        **2. Unterschied 1:n vs. n:m:**

        - **1:n:** Eine Entität auf der einen Seite, viele auf der anderen
          - Beispiel: Ein Kunde hat viele Bestellungen
          - Umsetzung: Fremdschlüssel auf der "n"-Seite

        - **n:m:** Viele Entitäten auf beiden Seiten
          - Beispiel: Studenten belegen viele Kurse, Kurse haben viele Studenten
          - Umsetzung: Zwischentabelle mit zwei Fremdschlüsseln

        **3. CASCADE vs. RESTRICT:**

        - **`ON DELETE CASCADE`** - Wenn abhängige Daten ohne Hauptdaten sinnlos sind
          - Beispiel: Bestellpositionen ohne Bestellung haben keine Bedeutung

        - **`ON DELETE RESTRICT`** - Wenn Daten geschützt werden sollen
          - Beispiel: Kunde kann nicht gelöscht werden, wenn noch Bestellungen existieren

---

## Zusammenfassung

In diesem Kapitel haben wir gelernt, wie man Beziehungen zwischen Tabellen modelliert:

**Wichtigste Konzepte:**

- **ER-Modell** beschreibt Entitäten, Attribute und Beziehungen visuell
- **Kardinalitäten** (1:1, 1:n, n:m) beschreiben, wie viele Entitäten miteinander in Beziehung stehen
- **Fremdschlüssel** (Foreign Key) stellen Beziehungen zwischen Tabellen her
- **Referenzielle Integrität** stellt sicher, dass Fremdschlüssel auf existierende Primärschlüssel verweisen

**Umsetzung in SQL:**

| Beziehungstyp | Umsetzung | Beispiel |
|---------------|-----------|----------|
| **1:n** | Fremdschlüssel auf der "n"-Seite | Maschine hat viele Wartungen |
| **n:m** | Zwischentabelle mit zwei Fremdschlüsseln | Maschine benötigt viele Ersatzteile |
| **1:1** | Fremdschlüssel auf einer Seite (selten) | Maschine hat ein Handbuch-PDF |

**ON DELETE Optionen:**

- `RESTRICT` - Löschen verhindern (Standard, sicher)
- `CASCADE` - Abhängige Datensätze automatisch mitlöschen (Vorsicht!)
- `SET NULL` - Fremdschlüssel auf NULL setzen
- `SET DEFAULT` - Fremdschlüssel auf Standardwert setzen

**Goldene Regel:**

> Modelliere erst mit ER-Diagrammen, dann implementiere in SQL!

---

Im nächsten Kapitel lernen wir **JOINs** kennen – wie man Daten aus mehreren verknüpften Tabellen abfragt!

<div style="text-align: center;">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXFxZ3V5dWxsZWwyOHJrOGdvZmtvZjR6dGZoZ2JoZmpoZmpoZmpoZmpoZGwmZXA9djFfZ2lmc19zZWFyY2gmY3Q9Zw/xT9IgzoKnwFNmISR8I/giphy.gif" alt="Success" style="width:220px; margin-bottom: 1em;">
</div>