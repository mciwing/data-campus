<div style="text-align: center;">
    <img src="/assets/header/database/header_ausblick.jpeg" alt="" style="width:100%; margin-bottom: 1em;">
</div>

# Ausblick & Weiterführende Themen

<div style="text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem;">
<div class="tenor-gif-embed" data-postid="19870242" data-share-method="host" data-aspect-ratio="1.78771" data-width="50%"><a href="https://tenor.com/view/the-journey-is-not-over-yet-declan-donnelly-anthony-mcpartlin-britains-got-talent-you-still-have-a-long-way-to-go-gif-19870242">The Journey Is Not Over Yet Declan Donnelly GIF</a>from <a href="https://tenor.com/search/the+journey+is+not+over+yet-gifs">The Journey Is Not Over Yet GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
    <figcaption style="margin-top: 0.5rem;"><i>"Die Reise geht weiter..."</i></figcaption>
</div>



## Fast geschafft...

In den vorherigen Kapiteln hast du die **Grundlagen relationaler Datenbanken** mit PostgreSQL kennengelernt. Du kannst jetzt:

- ✅ Datenbanken modellieren und entwerfen
- ✅ Tabellen erstellen und Beziehungen definieren
- ✅ Daten einfügen, ändern und löschen
- ✅ Komplexe Abfragen mit Joins und Aggregationen schreiben
- ✅ Datenintegrität mit Constraints sicherstellen
- ✅ Transaktionen für sichere Datenoperationen nutzen

Doch die Welt der Datenbanken ist **viel größer** als das, was wir bisher gesehen haben. In diesem abschließenden Kapitel werfen wir einen **Blick über den Tellerrand** und schauen uns weiterführende Themen an, die in professionellen Umgebungen wichtig sind.

---

???+ info "Datenbank-Setup"

    Für die folgenden Beispiele erstellen wir eine **E-Commerce/Online-Shop-Datenbank**. In dieser Datenbank werden Produkte, Bestellungen und Lagerbestände verwaltet.

    **Datenbank erstellen und verbinden:**

    ```sql
    CREATE DATABASE shop_db;
    \c shop_db
    ```

    **Tabellen erstellen:**

    ```sql
    -- Tabelle: Produkte
    CREATE TABLE produkte (
        produkt_id SERIAL PRIMARY KEY,
        produktname VARCHAR(200) NOT NULL,
        kategorie VARCHAR(100),
        preis NUMERIC(10, 2) NOT NULL CHECK (preis >= 0),
        lagerbestand INTEGER NOT NULL DEFAULT 0 CHECK (lagerbestand >= 0),
        aktiv BOOLEAN DEFAULT TRUE,
        erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        letzte_aenderung TIMESTAMP
    );

    -- Tabelle: Bestellungen
    CREATE TABLE bestellungen (
        bestell_id SERIAL PRIMARY KEY,
        kunde VARCHAR(200) NOT NULL,
        bestelldatum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'offen',
        gesamtbetrag NUMERIC(12, 2)
    );

    -- Tabelle: Bestellpositionen
    CREATE TABLE bestellpositionen (
        position_id SERIAL PRIMARY KEY,
        bestell_id INTEGER REFERENCES bestellungen(bestell_id) ON DELETE CASCADE,
        produkt_id INTEGER REFERENCES produkte(produkt_id),
        menge INTEGER NOT NULL CHECK (menge > 0),
        einzelpreis NUMERIC(10, 2) NOT NULL
    );
    ```

    **Testdaten einfügen:**

    ```sql
    -- Produkte einfügen
    INSERT INTO produkte (produktname, kategorie, preis, lagerbestand) VALUES
    ('Laptop ThinkPad X1', 'Elektronik', 1299.99, 15),
    ('Wireless Mouse MX3', 'Zubehör', 79.99, 50),
    ('USB-C Hub 7-Port', 'Zubehör', 49.99, 30),
    ('Monitor 27" 4K', 'Elektronik', 449.99, 8),
    ('Mechanische Tastatur', 'Zubehör', 129.99, 20),
    ('Webcam HD Pro', 'Elektronik', 89.99, 0),
    ('Laptop-Tasche Premium', 'Zubehör', 59.99, 25);

    -- Bestellungen einfügen
    INSERT INTO bestellungen (kunde, status, gesamtbetrag) VALUES
    ('Anna Schmidt', 'abgeschlossen', 1429.98),
    ('Thomas Weber', 'in_bearbeitung', 179.98),
    ('Lisa Müller', 'offen', 449.99);

    -- Bestellpositionen einfügen
    INSERT INTO bestellpositionen (bestell_id, produkt_id, menge, einzelpreis) VALUES
    (1, 1, 1, 1299.99),  -- Anna: Laptop
    (1, 2, 1, 79.99),     -- Anna: Mouse
    (1, 3, 1, 49.99),     -- Anna: Hub
    (2, 2, 1, 79.99),     -- Thomas: Mouse
    (2, 5, 1, 129.99),    -- Thomas: Tastatur
    (3, 4, 1, 449.99);    -- Lisa: Monitor
    ```

---

## Views (Sichten)

Eine **View** ist eine **virtuelle Tabelle**, die auf einer oder mehreren echten Tabellen basiert. Views speichern keine eigenen Daten, sondern definieren eine **gespeicherte Abfrage**, die bei jedem Aufruf ausgeführt wird. Allgemein lautet der Syntax

```sql { .yaml .no-copy }
CREATE VIEW view_name AS
SELECT spalte1, spalte2, ...
FROM tabelle
WHERE bedingung;
```

Betrachten wir das ganze anhand eines Beispiels.

???+ example "Beispiel: View für verfügbare Produkte"

    Wir erstellen eine View, die nur **verfügbare Produkte** zeigt (auf Lager und aktiv):

    ```sql
    CREATE VIEW verfuegbare_produkte AS
    SELECT
        produkt_id,
        produktname,
        kategorie,
        preis,
        lagerbestand
    FROM produkte
    WHERE aktiv = TRUE
      AND lagerbestand > 0
    ORDER BY produktname;
    ```

    Anschließend können wir die View verwenden:

    ```sql
    -- View verwenden wie eine normale Tabelle
    SELECT * FROM verfuegbare_produkte;
    ```

    ```title="Output"
     produkt_id |       produktname        | kategorie  |  preis  | lagerbestand
    ------------+--------------------------+------------+---------+--------------
              1 | Laptop ThinkPad X1       | Elektronik | 1299.99 |           15
              7 | Laptop-Tasche Premium    | Zubehör    |   59.99 |           25
              5 | Mechanische Tastatur     | Zubehör    |  129.99 |           20
              4 | Monitor 27" 4K           | Elektronik |  449.99 |            8
              3 | USB-C Hub 7-Port         | Zubehör    |   49.99 |           30
              2 | Wireless Mouse MX3       | Zubehör    |   79.99 |           50
    ```

???+ example "Beispiel: View für Bestellübersicht"

    Eine komplexere View kann mehrere Tabellen kombinieren:

    ```sql
    CREATE VIEW bestelluebersicht AS
    SELECT
        b.bestell_id,
        b.kunde,
        b.bestelldatum,
        b.status,
        COUNT(bp.position_id) AS anzahl_artikel,
        SUM(bp.menge * bp.einzelpreis) AS gesamtbetrag
    FROM bestellungen b
    LEFT JOIN bestellpositionen bp ON b.bestell_id = bp.bestell_id
    GROUP BY b.bestell_id, b.kunde, b.bestelldatum, b.status
    ORDER BY b.bestelldatum DESC;
    ```

    ```sql
    SELECT * FROM bestelluebersicht;
    ```

    ```title="Output"
     bestell_id |     kunde      |     bestelldatum     |     status      | anzahl_artikel | gesamtbetrag
    ------------+----------------+----------------------+-----------------+----------------+--------------
              3 | Lisa Müller    | 2025-11-25 14:30:00  | offen           |              1 |       449.99
              2 | Thomas Weber   | 2025-11-25 10:15:00  | in_bearbeitung  |              2 |       209.98
              1 | Anna Schmidt   | 2025-11-24 09:20:00  | abgeschlossen   |              3 |      1429.97
    ```


Views haben wir nahezu alles im Leben Vor- und Nachteile.  Diese wind nachfolgend aufgelistet. 

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Vorteile</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Nachteile</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="padding:10px 14px;">✅ Vereinfachung komplexer Joins</td>
        <td style="padding:10px 14px;">❌ Performance-Einbußen bei komplexen Views</td>
    </tr>
    <tr>
        <td style="padding:10px 14px;">✅ Sicherheit durch Datenbeschränkung</td>
        <td style="padding:10px 14px;">❌ Eingeschränkte Datenänderung (UPDATE/INSERT)</td>
    </tr>
    <tr>
        <td style="padding:10px 14px;">✅ Konsistente Abfragelogik</td>
        <td style="padding:10px 14px;">❌ Abhängigkeit von Basistabellen</td>
    </tr>
    <tr>
        <td style="padding:10px 14px;">✅ Abstraktion der Datenstruktur</td>
        <td style="padding:10px 14px;"></td>
    </tr>
    </tbody>
</table>
</div>

???+ tip "View löschen"

    Views können natürlich auch wieder gelöscht werden mit folgendem Syntax:

    ```sql
    DROP VIEW IF EXISTS verfuegbare_produkte;
    DROP VIEW IF EXISTS bestelluebersicht;
    ```

---

## Stored Procedures & Functions

**Stored Procedures** (gespeicherte Prozeduren) und **Functions** sind **vordefinierte SQL-Programme**, die in der Datenbank gespeichert werden.


Die Unterschiede zwischen Prozeduren und Funktionen sind:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Eigenschaft</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Function</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Procedure</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Rückgabewert</strong></td>
        <td style="padding:10px 14px;">Muss einen Wert zurückgeben</td>
        <td style="padding:10px 14px;">Kein oder mehrere Werte</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Verwendung</strong></td>
        <td style="padding:10px 14px;">In SELECT-Statements</td>
        <td style="padding:10px 14px;">Mit CALL aufgerufen</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Datenänderung</strong></td>
        <td style="padding:10px 14px;">Sollte keine Daten ändern</td>
        <td style="padding:10px 14px;">Darf Daten ändern</td>
    </tr>
    </tbody>
</table>
</div>

???+ example "Beispiel: Function für Produktverfügbarkeit"

    ```sql
    CREATE OR REPLACE FUNCTION ist_verfuegbar(p_produkt_id INTEGER, p_menge INTEGER)
    RETURNS BOOLEAN AS $$
    BEGIN
        RETURN EXISTS (
            SELECT 1
            FROM produkte
            WHERE produkt_id = p_produkt_id
              AND aktiv = TRUE
              AND lagerbestand >= p_menge
        );
    END;
    $$ LANGUAGE plpgsql;
    ```

    **Verwendung:**

    ```sql
    -- Prüfen, ob 10 Stück Laptop verfügbar sind
    SELECT produktname, ist_verfuegbar(produkt_id, 10) AS verfuegbar
    FROM produkte;
    ```

    ```title="Output"
           produktname        | verfuegbar
    --------------------------+------------
     Laptop ThinkPad X1       | t
     Wireless Mouse MX3       | t
     USB-C Hub 7-Port         | t
     Monitor 27" 4K           | f
     Mechanische Tastatur     | t
     Webcam HD Pro            | f
     Laptop-Tasche Premium    | t
    ```

???+ example "Beispiel: Procedure für Bestellung erstellen"

    ```sql
    CREATE OR REPLACE PROCEDURE erstelle_bestellung(
        p_kunde VARCHAR,
        p_produkt_id INTEGER,
        p_menge INTEGER
    )
    LANGUAGE plpgsql AS $$
    DECLARE
        v_bestell_id INTEGER;
        v_preis NUMERIC;
    BEGIN
        -- Preis holen
        SELECT preis INTO v_preis FROM produkte WHERE produkt_id = p_produkt_id;

        -- Bestellung erstellen
        INSERT INTO bestellungen (kunde, status, gesamtbetrag)
        VALUES (p_kunde, 'offen', v_preis * p_menge)
        RETURNING bestell_id INTO v_bestell_id;

        -- Bestellposition erstellen
        INSERT INTO bestellpositionen (bestell_id, produkt_id, menge, einzelpreis)
        VALUES (v_bestell_id, p_produkt_id, p_menge, v_preis);

        -- Lagerbestand reduzieren
        UPDATE produkte
        SET lagerbestand = lagerbestand - p_menge
        WHERE produkt_id = p_produkt_id;

        RAISE NOTICE 'Bestellung % für Kunde % erstellt', v_bestell_id, p_kunde;
    END;
    $$;
    ```

    **Verwendung:**

    ```sql
    CALL erstelle_bestellung('Max Mustermann', 1, 2);
    ```

    ```title="Output"
    NOTICE:  Bestellung 4 für Kunde Max Mustermann erstellt
    ```

---

## Trigger

Ein **Trigger** ist ein **automatisch ausgeführtes SQL-Programm**, das bei bestimmten Ereignissen (INSERT, UPDATE, DELETE) aktiviert wird.

Typeische **Anwendungsfälle** sind:

- Automatische Protokollierung von Änderungen
- Datenkonsistenz durch automatische Updates
- Durchsetzung von Geschäftsregeln
- Audit-Trails und Logging

???+ example "Beispiel: Automatische Zeitstempel-Aktualisierung"

    ```sql
    -- Trigger-Function erstellen
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.letzte_aenderung = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Trigger erstellen
    CREATE TRIGGER produkt_update_timestamp
    BEFORE UPDATE ON produkte
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
    ```

    **Wirkung:** Jedes Mal, wenn ein Produkt geändert wird, wird automatisch `letzte_aenderung` aktualisiert.

    ```sql
    -- Produkt aktualisieren
    UPDATE produkte SET preis = 1199.99 WHERE produkt_id = 1;

    -- Zeitstempel wurde automatisch gesetzt
    SELECT produktname, preis, letzte_aenderung FROM produkte WHERE produkt_id = 1;
    ```

    ```title="Output"
       produktname      |  preis  |    letzte_aenderung
    --------------------+---------+------------------------
     Laptop ThinkPad X1 | 1199.99 | 2025-11-25 15:42:33.15
    ```

???+ example "Beispiel: Automatische Lagerbestandsaktualisierung"

    Ein praktischeres Beispiel: Lagerbestand automatisch reduzieren, wenn eine Bestellposition erstellt wird.

    ```sql
    -- Trigger-Function erstellen
    CREATE OR REPLACE FUNCTION reduziere_lagerbestand()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE produkte
        SET lagerbestand = lagerbestand - NEW.menge
        WHERE produkt_id = NEW.produkt_id;

        -- Warnung, wenn Lagerbestand niedrig wird
        IF (SELECT lagerbestand FROM produkte WHERE produkt_id = NEW.produkt_id) < 5 THEN
            RAISE NOTICE 'Warnung: Niedriger Lagerbestand für Produkt %', NEW.produkt_id;
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Trigger erstellen
    CREATE TRIGGER nach_bestellposition_einfuegen
    AFTER INSERT ON bestellpositionen
    FOR EACH ROW
    EXECUTE FUNCTION reduziere_lagerbestand();
    ```

    **Wirkung:** Bei jeder neuen Bestellposition wird automatisch der Lagerbestand reduziert.

    ```sql
    -- Vor der Bestellung
    SELECT produktname, lagerbestand FROM produkte WHERE produkt_id = 4;
    ```

    ```title="Output"
       produktname    | lagerbestand
    ------------------+--------------
     Monitor 27" 4K   |            8
    ```

    ```sql
    -- Neue Bestellung erstellen
    INSERT INTO bestellungen (kunde, status) VALUES ('Peter Klein', 'offen');
    INSERT INTO bestellpositionen (bestell_id, produkt_id, menge, einzelpreis)
    VALUES (4, 4, 3, 449.99);

    -- Nach der Bestellung
    SELECT produktname, lagerbestand FROM produkte WHERE produkt_id = 4;
    ```

    ```title="Output"
       produktname    | lagerbestand
    ------------------+--------------
     Monitor 27" 4K   |            5
    NOTICE:  Warnung: Niedriger Lagerbestand für Produkt 4
    ```

Typische Befehle im Zusammen hang mit Trigger sind:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Typ</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Zeitpunkt</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Verwendung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>BEFORE</code></td>
        <td style="padding:10px 14px;">Vor der Operation</td>
        <td style="padding:10px 14px;">Daten noch ändern/validieren</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>AFTER</code></td>
        <td style="padding:10px 14px;">Nach der Operation</td>
        <td style="padding:10px 14px;">Logging, Benachrichtigungen</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>FOR EACH ROW</code></td>
        <td style="padding:10px 14px;">Für jede Zeile</td>
        <td style="padding:10px 14px;">Zeilen-spezifische Logik</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>FOR EACH STATEMENT</code></td>
        <td style="padding:10px 14px;">Einmal pro Statement</td>
        <td style="padding:10px 14px;">Statement-Level Logging</td>
    </tr>
    </tbody>
</table>
</div>

---

## JSON-Support in PostgreSQL

PostgreSQL bietet **native Unterstützung für JSON-Daten**, was flexible, semi-strukturierte Datenspeicherung ermöglicht.

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Typ</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Speicherung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Performance</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>JSON</code></td>
        <td style="padding:10px 14px;">Als Text</td>
        <td style="padding:10px 14px;">Langsamer</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>JSONB</code></td>
        <td style="padding:10px 14px;">Binär (komprimiert)</td>
        <td style="padding:10px 14px;">Schneller (empfohlen ✅)</td>
    </tr>
    </tbody>
</table>
</div>

???+ example "Beispiel: Produkte mit flexiblen Attributen"

    ```sql
    CREATE TABLE produkte_extended (
        produkt_id SERIAL PRIMARY KEY,
        produktname VARCHAR(200) NOT NULL,
        kategorie VARCHAR(100),
        preis NUMERIC(10, 2) NOT NULL,
        attribute JSONB  -- Flexible zusätzliche Produkteigenschaften
    );

    INSERT INTO produkte_extended (produktname, kategorie, preis, attribute) VALUES
    ('Laptop ThinkPad X1', 'Elektronik', 1299.99,
     '{"bildschirm": "14 Zoll", "prozessor": "Intel i7", "ram_gb": 16, "ssd_gb": 512, "farben": ["Schwarz", "Silber"]}'::jsonb),
    ('Wireless Mouse MX3', 'Zubehör', 79.99,
     '{"dpi": 4000, "kabellos": true, "batterielaufzeit_tage": 70, "farben": ["Schwarz", "Weiß", "Grau"]}'::jsonb),
    ('Monitor 27" 4K', 'Elektronik', 449.99,
     '{"aufloesung": "3840x2160", "bildwiederholrate_hz": 60, "panel_typ": "IPS", "hdr": true}'::jsonb);
    ```

    **JSON-Abfragen:**

    ```sql
    -- Zugriff auf JSON-Felder
    SELECT produktname, attribute->>'bildschirm' AS bildschirm, attribute->>'prozessor' AS prozessor
    FROM produkte_extended
    WHERE attribute ? 'bildschirm';  -- Nur Produkte mit Bildschirm-Attribut
    ```

    ```title="Output"
       produktname      | bildschirm | prozessor
    --------------------+------------+-----------
     Laptop ThinkPad X1 | 14 Zoll    | Intel i7
    ```

    ```sql
    -- Nach JSON-Werten filtern
    SELECT produktname, attribute->>'ram_gb' AS ram
    FROM produkte_extended
    WHERE (attribute->>'ram_gb')::integer >= 16;
    ```

    ```title="Output"
       produktname      | ram
    --------------------+-----
     Laptop ThinkPad X1 | 16
    ```

    ```sql
    -- JSON-Array durchsuchen
    SELECT produktname, attribute->'farben' AS verfuegbare_farben
    FROM produkte_extended
    WHERE attribute->'farben' ? 'Schwarz';  -- Produkte in Schwarz
    ```

    ```title="Output"
       produktname      | verfuegbare_farben
    --------------------+---------------------
     Laptop ThinkPad X1 | ["Schwarz", "Silber"]
     Wireless Mouse MX3 | ["Schwarz", "Weiß", "Grau"]
    ```

???+ tip "Wann JSON verwenden?"

    **Vorteile:**

    - ✅ Flexibel für unterschiedliche Datenstrukturen
    - ✅ Keine Schema-Änderungen nötig
    - ✅ Ideal für externe APIs und Logs

    **Nachteile:**

    - ❌ Weniger performant als normale Spalten
    - ❌ Schwieriger zu normalisieren
    - ❌ Integritätsprüfungen komplizierter

    **Faustregel:** Verwende JSON für **optionale, flexible Daten**, aber **nicht für kritische Geschäftslogik**.

---

## Backup & Recovery

Datenbanken speichern oft **geschäftskritische Daten**. Bei Hardware-Ausfällen, Software-Fehlern oder menschlichen Fehlern ist ein **Backup essentiell**.

Typische PostgreSQL Backup-Methoden sind:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Methode</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anwendungsfall</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>pg_dump</code></td>
        <td style="padding:10px 14px;">Logisches Backup (SQL-Export)</td>
        <td style="padding:10px 14px;">Einzelne Datenbank, portabel</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>pg_dumpall</code></td>
        <td style="padding:10px 14px;">Alle Datenbanken</td>
        <td style="padding:10px 14px;">Kompletter Server-Export</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><strong>Physisches Backup</strong></td>
        <td style="padding:10px 14px;">Dateisystem-Level Kopie</td>
        <td style="padding:10px 14px;">Große Datenbanken, schnell</td>
    </tr>
    </tbody>
</table>
</div>

???+ example "Beispiel: pg_dump verwenden"

    **Gesamte Datenbank sichern:**

    ```bash
    pg_dump shop_db > shop_db_backup.sql
    ```

    **Nur Struktur (ohne Daten):**

    ```bash
    pg_dump --schema-only shop_db > struktur.sql
    ```

    **Nur Daten (ohne Struktur):**

    ```bash
    pg_dump --data-only shop_db > daten.sql
    ```

    **Bestimmte Tabelle sichern:**

    ```bash
    pg_dump -t produkte shop_db > produkte_backup.sql
    ```

    **Wiederherstellen:**

    ```bash
    psql shop_db < shop_db_backup.sql
    ```

---

## Zusammenfassung 📌

In diesem Kapitel haben wir einen **Ausblick** auf weiterführende Datenbankthemen erhalten:

- **Views** – Virtuelle Tabellen für vereinfachte Abfragen
- **Stored Procedures & Functions** – Wiederverwendbare SQL-Programme
- **Trigger** – Automatische Aktionen bei Datenänderungen
- **JSON-Support** – Flexible, semi-strukturierte Daten
- **Backup & Recovery** – Datensicherung und -wiederherstellung

---

## Abschließende Gedanken 🎉

Datenbanken sind das **Herzstück** fast jeder modernen Anwendung. Egal ob Web-App, Mobile-App, Desktop-Software oder Data Science – überall werden Daten gespeichert, verwaltet und analysiert.

Das **relationale Modell** mit SQL ist seit über 50 Jahren der Standard und wird auch in absehbarer Zukunft wichtig bleiben. Die Konzepte, die du gelernt hast – **Normalisierung, Beziehungen, Joins, Transaktionen** – sind **universell anwendbar** und werden dich in deiner gesamten IT-Karriere begleiten.

---

???+ success "Glückwunsch! 🎉"

    Du hast das Ende dieses Kurses erreicht und alle wichtigen Grundlagen zu Datenbanken und SQL gelernt!

    **Das hast du gemeistert:**

    - ✅ Datenmodellierung und ER-Diagramme
    - ✅ SQL-Grundlagen (SELECT, INSERT, UPDATE, DELETE)
    - ✅ Komplexe Abfragen mit Joins und Aggregationen
    - ✅ Datenintegrität mit Constraints
    - ✅ Transaktionen und ACID-Prinzipien
    - ✅ Fortgeschrittene Konzepte und Ausblick

    Nutze dieses Wissen als **Startpunkt für deine eigenen Datenbankprojekte**!

    **Viel Erfolg auf deiner Reise in die Welt der Datenbanken!** 🚀

---

<div style="text-align: center; margin-top: 3rem;">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDU3bGRwaWRmcW5jd3c5OW1lNWc2ZjBpOWR0MXh5dmYzcHJ5OWR6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRv0ThflsHCqDrG/giphy.gif" alt="The End" style="width:40%; border-radius: 8px;">
    <h3>Ende des Kurses – Aber nicht des Lernens!</h3>
</div>
