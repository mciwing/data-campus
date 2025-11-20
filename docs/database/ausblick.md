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

## Views (Sichten)

Eine **View** ist eine **virtuelle Tabelle**, die auf einer oder mehreren echten Tabellen basiert. Views speichern keine eigenen Daten, sondern definieren eine **gespeicherte Abfrage**, die bei jedem Aufruf ausgeführt wird. Allgemein lautet der Syntax

```sql { .yaml .no-copy }
CREATE VIEW view_name AS
SELECT spalte1, spalte2, ...
FROM tabelle
WHERE bedingung;
```

Betrachten wir das ganze anhand eines Beispiels. 

???+ example "Beispiel: View für betriebsbereite Maschinen"

    Wir erstellen eine View, die nur **betriebsbereite Maschinen** zeigt:

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

    Anschließend können wir den View verwenden:

    ```sql
    -- View verwenden wie eine normale Tabelle
    SELECT * FROM betriebsbereite_maschinen;
    ```

    ```title="Output"
     maschinen_id |      name      |     typ     |    standort
    --------------+----------------+-------------+-----------------
                1 | CNC-Fräse Alpha| CNC-Fräse   | Halle A
                3 | Drehbank Delta | Drehbank    | Halle B
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
    DROP VIEW IF EXISTS betriebsbereite_maschinen;
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

???+ example "Beispiel: Function für Maschinenstatus"

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

    ```title="Output"
          name       | betriebsbereit
    -----------------+----------------
     CNC-Fräse Alpha | t
     Drehbank Beta   | f
     Schweißer Gamma | t
    ```

???+ example "Beispiel: Procedure für Wartungsprotokoll"

    ```sql
    CREATE OR REPLACE PROCEDURE erstelle_wartungsprotokoll(
        p_maschinen_id INTEGER,
        p_beschreibung TEXT
    )
    LANGUAGE plpgsql AS $$
    BEGIN
        INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung)
        VALUES (p_maschinen_id, CURRENT_DATE, p_beschreibung);

        RAISE NOTICE 'Wartungsprotokoll für Maschine % erstellt', p_maschinen_id;
    END;
    $$;
    ```

    **Verwendung:**

    ```sql
    CALL erstelle_wartungsprotokoll(1, 'Routinewartung durchgeführt');
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
    -- Spalte hinzufügen
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

    ```sql
    -- Maschine aktualisieren
    UPDATE maschinen SET status = 'Wartung' WHERE maschinen_id = 1;

    -- Zeitstempel wurde automatisch gesetzt
    SELECT name, status, letzte_aenderung FROM maschinen WHERE maschinen_id = 1;
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

???+ example "Beispiel: Maschinen mit flexiblen Metadaten"

    ```sql
    CREATE TABLE maschinen_extended (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        typ VARCHAR(100) NOT NULL,
        metadaten JSONB  -- Flexible zusätzliche Daten
    );

    INSERT INTO maschinen_extended (name, typ, metadaten) VALUES
    ('CNC-Fräse Alpha', 'CNC-Fräse',
     '{"leistung_kw": 15.5, "hersteller": "DMG MORI", "gewicht_kg": 3200, "tags": ["Präzision", "5-Achsen"]}'::jsonb),
    ('Drehbank Beta', 'Drehbank',
     '{"leistung_kw": 8.0, "hersteller": "EMAG", "gewicht_kg": 2100, "tags": ["Hochpräzision"]}'::jsonb);
    ```

    **JSON-Abfragen:**

    ```sql
    -- Zugriff auf JSON-Felder
    SELECT name, metadaten->>'hersteller' AS hersteller
    FROM maschinen_extended;
    ```

    ```title="Output"
          name       | hersteller
    -----------------+------------
     CNC-Fräse Alpha | DMG MORI
     Drehbank Beta   | EMAG
    ```

    ```sql
    -- Nach JSON-Werten filtern
    SELECT name, metadaten->>'leistung_kw' AS leistung
    FROM maschinen_extended
    WHERE (metadaten->>'leistung_kw')::numeric > 10;
    ```

    ```title="Output"
          name       | leistung
    -----------------+----------
     CNC-Fräse Alpha | 15.5
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
    pg_dump produktionsdb > produktionsdb_backup.sql
    ```

    **Nur Struktur (ohne Daten):**

    ```bash
    pg_dump --schema-only produktionsdb > struktur.sql
    ```

    **Nur Daten (ohne Struktur):**

    ```bash
    pg_dump --data-only produktionsdb > daten.sql
    ```

    **Wiederherstellen:**

    ```bash
    psql produktionsdb < produktionsdb_backup.sql
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
