# Daten manipulieren

Bisher haben wir gelernt, wie man Daten **einfügt** und **abfragt**. Aber was passiert, wenn sich Daten ändern müssen? Wenn eine Maschine in die Wartung geht, der Standort wechselt oder ausgemustert wird?

In diesem Kapitel lernen wir die drei **Manipulationsbefehle** von SQL kennen: **INSERT**, **UPDATE** und **DELETE**. Zusammen mit **SELECT** bilden sie die vier Grundoperationen der Datenverwaltung – oft als **CRUD** bezeichnet:

- **C**reate → `INSERT` - Neue Datensätze erstellen
- **R**ead → `SELECT` - Datensätze abfragen
- **U**pdate → `UPDATE` - Bestehende Datensätze ändern
- **D**elete → `DELETE` - Datensätze löschen

---

## Daten einfügen mit `INSERT`

Wir kennen **INSERT** bereits aus dem vorherigen Kapitel, doch wollen wir hier nochmal die wichtigsten Varianten wiederholen und erweitern.

Mit `INSERT` fügen wir neue Datensätze in eine Tabelle ein. Es gibt verschiedene Varianten, je nachdem wie viele Datensätze wir einfügen möchten und welche Spalten wir befüllen wollen.

### Grundlegende Syntax

```sql { .yaml .no-copy }
INSERT INTO tabellenname (spalte1, spalte2, spalte3)
VALUES (wert1, wert2, wert3);
```

<div class="grid cards" markdown>

-   __Einzelnen Datensatz einfügen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Eine neue Maschine hinzufügen
        INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
        VALUES (9, 'Pressmaschine Iota', 'Pressmaschine', 'Halle C', 2023, 'Aktiv');
        ```

        **Erklärung:** Es wird genau ein Datensatz mit allen angegebenen Spaltenwerten eingefügt.

-   __Mehrere Datensätze auf einmal__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Mehrere Maschinen gleichzeitig einfügen
        INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
        VALUES
            (10, 'Bohrmaschine Kappa', 'Bohrmaschine', 'Halle A', 2022, 'Aktiv'),
            (11, 'Fräse Lambda', 'CNC-Fräse', 'Halle B', 2021, 'Aktiv'),
            (12, 'Poliermaschine Mu', 'Poliermaschine', 'Halle C', 2020, 'Wartung');
        ```

        **Erklärung:** Mehrere Datensätze werden mit einem einzigen INSERT-Befehl eingefügt - effizienter als einzelne INSERT-Befehle.

-   __Nur bestimmte Spalten befüllen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Status wird nicht angegeben (erhält NULL oder Standardwert)
        INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr)
        VALUES (13, 'Testanlage Nu', 'Testanlage', 'Halle D', 2024);
        ```

        **Erklärung:** Nicht angegebene Spalten erhalten entweder `NULL` oder einen Standardwert (falls definiert).

-   __Mit expliziten NULL-Werten__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Explizit NULL für Status setzen
        INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
        VALUES (14, 'Prototyp Omega', 'Prototyp', 'Halle D', 2024, NULL);
        ```

        **Erklärung:** Mit `NULL` können wir explizit einen fehlenden Wert angeben (sofern die Spalte NULL-Werte erlaubt).

</div>

???+ info "Was passiert mit fehlenden Werten?"
    Spalten, die im `INSERT`-Befehl nicht angegeben werden, erhalten:

    - Den **Standardwert** (falls mit `DEFAULT` definiert)
    - `NULL` (falls die Spalte NULL-Werte erlaubt)
    - Einen **Fehler**, wenn die Spalte `NOT NULL` ist und keinen Standardwert hat

    ```sql
    -- Beispiel: Spalte 'status' hat DEFAULT 'Aktiv'
    INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr)
    VALUES (15, 'Test', 'Test', 'Halle A', 2024);
    -- status wird automatisch auf 'Aktiv' gesetzt
    ```

---

## Daten aktualisieren mit `UPDATE`

Mit **UPDATE** ändern wir bestehende Datensätze in einer Tabelle. Das ist besonders wichtig, wenn sich Daten ändern - z.B. wenn eine Maschine in die Wartung geht oder der Standort wechselt.

### Grundlegende Syntax

```sql { .yaml .no-copy }
UPDATE tabellenname
SET spalte1 = neuer_wert1,
    spalte2 = neuer_wert2
WHERE bedingung;
```

???+ warning "WHERE ist KRITISCH!"
    Ohne `WHERE`-Klausel werden **ALLE** Datensätze in der Tabelle geändert!

    ```sql
    -- ❌ GEFAHR! Ändert ALLE Maschinen!
    UPDATE maschinen
    SET status = 'Defekt';
    ```

    ```sql
    -- ✅ Sicher: Nur eine spezifische Maschine
    UPDATE maschinen
    SET status = 'Defekt'
    WHERE maschinen_id = 1;
    ```

<div class="grid cards" markdown>

-   __Einen Datensatz ändern__

    ---

    ???+ example "Beispiel"
        ```sql
        -- CNC-Fräse Alpha geht in Wartung
        UPDATE maschinen
        SET status = 'Wartung'
        WHERE maschinen_id = 1;
        ```

        **Erklärung:** Die `WHERE`-Klausel sorgt dafür, dass nur die Maschine mit ID 1 geändert wird.

-   __Mehrere Spalten gleichzeitig__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Drehbank Beta wechselt Standort und geht in Wartung
        UPDATE maschinen
        SET standort = 'Halle C',
            status = 'Wartung'
        WHERE maschinen_id = 2;
        ```

        **Erklärung:** Mit Kommas getrennt können mehrere Spalten gleichzeitig geändert werden.

-   __Mehrere Datensätze ändern__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Alle Maschinen in Halle A werden auf Aktiv gesetzt
        UPDATE maschinen
        SET status = 'Aktiv'
        WHERE standort = 'Halle A';
        ```

        **Erklärung:** Alle Datensätze, die die WHERE-Bedingung erfüllen, werden geändert - in diesem Fall alle Maschinen in Halle A.

-   __Mit Berechnungen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Anschaffungsjahr um 1 erhöhen (z.B. Fehlerkorrektur)
        UPDATE maschinen
        SET anschaffungsjahr = anschaffungsjahr + 1
        WHERE maschinen_id = 3;
        ```

        **Erklärung:** Der neue Wert kann aus dem alten Wert berechnet werden.

</div>

???+ tip "Mit SELECT testen"
    **Goldene Regel:** Teste **immer erst mit SELECT**, ob deine WHERE-Bedingung die richtigen Zeilen findet!

    ```sql
    -- 1. Erst prüfen: Welche Zeilen würden betroffen sein?
    SELECT * FROM maschinen WHERE standort = 'Halle A';

    -- 2. Wenn richtig: UPDATE ausführen
    UPDATE maschinen
    SET status = 'Wartung'
    WHERE standort = 'Halle A';

    -- 3. Kontrolle: Hat es funktioniert?
    SELECT * FROM maschinen WHERE standort = 'Halle A';
    ```

---

## Die Gefahr von `UPDATE` ohne `WHERE`

Was passiert, wenn wir die `WHERE`-Klausel vergessen? Sehen wir uns ein Beispiel an:

```sql
-- ❌ FEHLER: Keine WHERE-Klausel!
UPDATE maschinen
SET status = 'Defekt';
```

**Ergebnis:** Alle Maschinen werden jetzt auf Status 'Defekt' gesetzt – egal welchen Status sie vorher hatten!

**Visualisierung:**

```title="Vorher"
 maschinen_id │ status
──────────────┼────────
            1 │ Aktiv
            2 │ Aktiv
            3 │ Wartung
            4 │ Aktiv
```

```title="Nach UPDATE ohne WHERE"
 maschinen_id │ status
──────────────┼────────
            1 │ Defekt  ← geändert!
            2 │ Defekt  ← geändert!
            3 │ Defekt  ← geändert!
            4 │ Defekt  ← geändert!
```

???+ danger "Verlorene Daten!"
    Ohne eine Sicherungskopie (Backup) sind die ursprünglichen Status-Werte **unwiderruflich verloren**! Es gibt kein "Rückgängig" in SQL!

---

## Daten löschen mit `DELETE`

Mit **DELETE** entfernen wir Datensätze **dauerhaft** aus einer Tabelle. Dies ist besonders nützlich, wenn Maschinen ausgemustert oder verschrottet werden.

### Grundlegende Syntax

```sql { .yaml .no-copy }
DELETE FROM tabellenname
WHERE bedingung;
```

???+ warning "WHERE ist noch KRITISCHER!"
    Ohne `WHERE`-Klausel werden **ALLE** Datensätze gelöscht - und es gibt **KEIN Rückgängig**!

    ```sql
    -- ❌ GEFAHR! Löscht ALLE Maschinen!
    DELETE FROM maschinen;
    ```

    ```sql
    -- ✅ Sicher: Nur eine spezifische Maschine
    DELETE FROM maschinen
    WHERE maschinen_id = 8;
    ```

<div class="grid cards" markdown>

-   __Einzelnen Datensatz löschen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Maschine mit ID 8 löschen (z.B. weil ausgemustert)
        DELETE FROM maschinen
        WHERE maschinen_id = 8;
        ```

        **Erklärung:** Die `WHERE`-Klausel sorgt dafür, dass nur die Maschine mit ID 8 gelöscht wird.

-   __Mehrere Datensätze löschen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Alle defekten Maschinen löschen (z.B. weil verschrottet)
        DELETE FROM maschinen
        WHERE status = 'Defekt';
        ```

        **Erklärung:** Alle Datensätze, die die WHERE-Bedingung erfüllen, werden gelöscht.

-   __Nach mehreren Kriterien__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Maschinen in Halle C mit Status Defekt löschen
        DELETE FROM maschinen
        WHERE standort = 'Halle C' AND status = 'Defekt';
        ```

        **Erklärung:** Beide Bedingungen müssen erfüllt sein (`AND`), damit ein Datensatz gelöscht wird.

-   __Mit Primärschlüssel (am sichersten)__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Am sichersten: Löschen nach eindeutigem Primärschlüssel
        DELETE FROM maschinen
        WHERE maschinen_id = 5;
        ```

        **Erklärung:** Der Primärschlüssel ist eindeutig - so kann man sicher sein, dass nur genau ein Datensatz gelöscht wird.

</div>

???+ info "DELETE vs. DROP"
    Wichtiger Unterschied zwischen zwei ähnlich klingenden Befehlen:

    - `DELETE FROM tabelle;` - Löscht alle **Zeilen**, die Tabellenstruktur bleibt bestehen
    - `DROP TABLE tabelle;` - Löscht die **gesamte Tabelle** inklusive Struktur und allen Daten

    ```sql
    -- DELETE: Tabelle bleibt, aber ist leer
    DELETE FROM maschinen;
    SELECT * FROM maschinen;  -- Funktioniert, gibt 0 Zeilen zurück

    -- DROP: Tabelle existiert nicht mehr
    DROP TABLE maschinen;
    SELECT * FROM maschinen;  -- FEHLER: Tabelle existiert nicht
    ```

???+ tip "Sicheres Vorgehen bei DELETE"
    **Goldene Regel:** Teste **immer erst mit SELECT**, welche Zeilen gelöscht würden!

    ```sql
    -- 1. Erst prüfen: Welche Zeilen würden gelöscht?
    SELECT * FROM maschinen WHERE status = 'Defekt';

    -- 2. Sicher? Dann löschen
    DELETE FROM maschinen WHERE status = 'Defekt';

    -- 3. Kontrolle: Sind sie weg?
    SELECT * FROM maschinen WHERE status = 'Defekt';  -- Sollte leer sein
    ```

---

## Erweiterte `UPDATE`-Techniken

Neben einfachen Wertzuweisungen können wir in `UPDATE` auch Berechnungen durchführen und String-Operationen anwenden.

### Numerische Berechnungen

Wir können mit dem aktuellen Wert rechnen und daraus den neuen Wert berechnen:

<div class="grid cards" markdown>

-   __Addition / Subtraktion__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Alle Anschaffungsjahre um 1 erhöhen (z.B. Fehlerkorrektur)
        UPDATE maschinen
        SET anschaffungsjahr = anschaffungsjahr + 1
        WHERE standort = 'Halle A';
        ```

        **Erklärung:** Der neue Wert wird aus dem alten Wert + 1 berechnet.

-   __Multiplikation / Division__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Wartungskosten verdoppeln
        UPDATE wartungsprotokolle
        SET kosten = kosten * 2
        WHERE wartungs_id = 101;
        ```

        **Erklärung:** Nützlich für Preisanpassungen oder Korrekturen.

</div>

### String-Operationen

SQL bietet verschiedene Funktionen zur Bearbeitung von Textwerten:

<div class="grid cards" markdown>

-   __REPLACE - Ersetzen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- 'Halle' durch 'Produktionshalle' ersetzen
        UPDATE maschinen
        SET standort = REPLACE(standort, 'Halle', 'Produktionshalle');
        ```

        ```title="Vorher → Nachher"
        'Halle A' → 'Produktionshalle A'
        'Halle B' → 'Produktionshalle B'
        ```

-   __CONCAT - Verketten__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Prefix zum Namen hinzufügen
        UPDATE maschinen
        SET name = CONCAT('Maschine: ', name)
        WHERE typ = 'CNC-Fräse';
        ```

        ```title="Vorher → Nachher"
        'CNC-Fräse Alpha' → 'Maschine: CNC-Fräse Alpha'
        ```

-   __UPPER / LOWER - Groß-/Kleinschreibung__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Status in Großbuchstaben umwandeln
        UPDATE maschinen
        SET status = UPPER(status);
        ```

        ```title="Vorher → Nachher"
        'Aktiv' → 'AKTIV'
        'Wartung' → 'WARTUNG'
        ```

-   __TRIM - Leerzeichen entfernen__

    ---

    ???+ example "Beispiel"
        ```sql
        -- Führende/abschließende Leerzeichen entfernen
        UPDATE maschinen
        SET name = TRIM(name);
        ```

        ```title="Vorher → Nachher"
        '  CNC-Fräse  ' → 'CNC-Fräse'
        ```

</div>

---

## `UPDATE` mit Unterabfragen

Fortgeschrittene Technik: Wir können Werte aus anderen Tabellen in ein UPDATE einbeziehen. Dies wird in späteren Kapiteln (JOIN, Subqueries) detailliert behandelt.

???+ example "Beispiel (Vorschau)"
    ```sql
    -- Maschinen bekommen den Namen des zuständigen Technikers
    UPDATE maschinen
    SET zustaendiger_techniker = (
        SELECT CONCAT(vorname, ' ', nachname)
        FROM techniker
        WHERE techniker.techniker_id = maschinen.techniker_id
    );
    ```

    **Hinweis:** Das ist eine **Unterabfrage (Subquery)** - diese behandeln wir später im Detail.

---

## Praktische Übungen

Teste dein Wissen mit den folgenden Übungen. Verwende die `maschinen`-Tabelle aus den vorherigen Kapiteln.

???+ info "Vorbereitung"
    Stelle sicher, dass du folgende Testdaten in deiner Datenbank hast:

    ```sql
    -- Falls nötig, Tabelle neu erstellen
    DROP TABLE IF EXISTS maschinen;

    CREATE TABLE maschinen (
        maschinen_id INTEGER PRIMARY KEY,
        name VARCHAR(100),
        typ VARCHAR(50),
        standort VARCHAR(50),
        anschaffungsjahr INTEGER,
        status VARCHAR(20)
    );

    INSERT INTO maschinen (maschinen_id, name, typ, standort, anschaffungsjahr, status)
    VALUES
        (1, 'CNC-Fräse Alpha', 'CNC-Fräse', 'Halle A', 2019, 'Aktiv'),
        (2, 'Drehbank Beta', 'Drehbank', 'Halle A', 2021, 'Aktiv'),
        (3, 'Schweißroboter Gamma', 'Schweißroboter', 'Halle B', 2020, 'Wartung'),
        (4, 'Lackieranlage Delta', 'Lackieranlage', 'Halle C', 2018, 'Aktiv'),
        (5, 'CNC-Fräse Epsilon', 'CNC-Fräse', 'Halle A', 2022, 'Aktiv');
    ```

???+ question "Aufgabe 1: UPDATE üben"

    1. CNC-Fräse Alpha (ID 1) geht in Wartung
    2. Drehbank Beta (ID 2) wechselt nach "Halle C"
    3. Alle CNC-Fräsen in Halle A bekommen Status "Aktiv"

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1. CNC-Fräse Alpha in Wartung setzen
        UPDATE maschinen
        SET status = 'Wartung'
        WHERE maschinen_id = 1;

        -- 2. Drehbank Beta nach Halle C verschieben
        UPDATE maschinen
        SET standort = 'Halle C'
        WHERE maschinen_id = 2;

        -- 3. Alle CNC-Fräsen in Halle A auf Aktiv setzen
        UPDATE maschinen
        SET status = 'Aktiv'
        WHERE typ = 'CNC-Fräse' AND standort = 'Halle A';
        ```

???+ question "Aufgabe 2: DELETE üben"

    1. Lösche die Lackieranlage Delta (Maschinen-ID 4)
    2. Lösche alle Maschinen mit Status "Wartung"
    3. **Prüfe vorher mit SELECT**, welche Maschinen betroffen wären!

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1. Lackieranlage Delta löschen
        -- Erst prüfen:
        SELECT * FROM maschinen WHERE maschinen_id = 4;
        -- Dann löschen:
        DELETE FROM maschinen WHERE maschinen_id = 4;

        -- 2. Alle Maschinen in Wartung löschen
        -- Erst prüfen:
        SELECT * FROM maschinen WHERE status = 'Wartung';
        -- Dann löschen:
        DELETE FROM maschinen WHERE status = 'Wartung';
        ```

???+ question "Aufgabe 3: Fehler finden"

    Was ist an folgenden Befehlen falsch oder gefährlich?

    ```sql
    -- A)
    UPDATE maschinen
    SET status = 'Defekt';

    -- B)
    DELETE FROM maschinen;

    -- C)
    UPDATE maschinen
    SET typ = 'CNC-Fräse'
    WHERE maschine = 'Alpha';
    ```

    ??? tip "Lösungen anzeigen"

        **A)** Keine `WHERE`-Klausel → **ALLE** Maschinen werden auf Status 'Defekt' gesetzt!

        ```sql
        -- Richtig wäre:
        UPDATE maschinen
        SET status = 'Defekt'
        WHERE maschinen_id = 1;  -- oder eine andere passende Bedingung
        ```

        **B)** Keine `WHERE`-Klausel → **ALLE** Maschinen werden gelöscht!

        ```sql
        -- Richtig wäre:
        DELETE FROM maschinen
        WHERE maschinen_id = 4;  -- oder eine andere passende Bedingung
        ```

        **C)** Die Spalte heißt `name`, nicht `maschine` → Fehler oder keine Zeilen betroffen!

        ```sql
        -- Richtig wäre:
        UPDATE maschinen
        SET typ = 'CNC-Fräse'
        WHERE name LIKE '%Alpha%';
        ```

???+ question "Aufgabe 4: Berechnungen"

    1. Erhöhe das Anschaffungsjahr aller Maschinen in Halle B um 1
    2. Ändere alle Standort-Namen: Ersetze "Halle" durch "Produktionshalle"

    ??? tip "Lösungen anzeigen"

        ```sql
        -- 1. Anschaffungsjahr um 1 erhöhen
        UPDATE maschinen
        SET anschaffungsjahr = anschaffungsjahr + 1
        WHERE standort = 'Halle B';

        -- 2. Standort-Namen ändern
        UPDATE maschinen
        SET standort = REPLACE(standort, 'Halle', 'Produktionshalle');
        ```

---

## Best Practices

Hier sind die wichtigsten Regeln für sicheres Arbeiten mit `UPDATE` und `DELETE`:

### 1. Immer mit SELECT testen

???+ tip "SELECT → UPDATE → SELECT"
    **Goldener Workflow** für UPDATE und DELETE:

    ```sql
    -- Schritt 1: Prüfen - Welche Zeilen sind betroffen?
    SELECT * FROM maschinen WHERE standort = 'Halle A';

    -- Schritt 2: Ändern/Löschen - Wenn die Zeilen stimmen
    UPDATE maschinen SET status = 'Wartung' WHERE standort = 'Halle A';

    -- Schritt 3: Kontrollieren - Hat es funktioniert?
    SELECT * FROM maschinen WHERE standort = 'Halle A';
    ```

    Dieser 3-Schritte-Prozess verhindert die meisten Fehler!

### 2. WHERE-Klausel nie vergessen

???+ danger "Alarmglocken bei fehlendem WHERE"
    Bei **UPDATE** und **DELETE** ohne WHERE-Klausel sollten bei dir **alle Alarmglocken läuten**!

    ```sql
    -- ❌ GEFAHR!
    UPDATE maschinen SET status = 'Defekt';     -- Ändert ALLE!
    DELETE FROM maschinen;                       -- Löscht ALLE!

    -- ✅ Sicher
    UPDATE maschinen SET status = 'Defekt' WHERE maschinen_id = 1;
    DELETE FROM maschinen WHERE maschinen_id = 1;
    ```

### 3. Primärschlüssel bevorzugen

???+ tip "Sicherheit durch Eindeutigkeit"
    Am sichersten ist es, mit dem **Primärschlüssel** zu arbeiten, da dieser eindeutig ist:

    ```sql
    -- ✅ Am sichersten: Nach Primärschlüssel (eindeutig!)
    DELETE FROM maschinen WHERE maschinen_id = 1;

    -- ⚠️ Vorsicht: Nach anderen Attributen (könnten mehrfach vorkommen)
    DELETE FROM maschinen WHERE typ = 'CNC-Fräse';  -- Wie viele gibt es davon?
    ```

### 4. Transaktionen verwenden

???+ info "Transaktionen (kommt später)"
    In Kapitel "Transaktionen" lernen wir, wie wir Änderungen **rückgängig machen** können:

    ```sql
    BEGIN;  -- Transaktion starten
    UPDATE maschinen SET status = 'Wartung' WHERE standort = 'Halle A';
    -- Prüfen ob richtig...
    COMMIT;     -- Änderungen übernehmen
    -- oder:
    ROLLBACK;   -- Änderungen verwerfen
    ```

---

## Häufige Fehler und Lösungen

Hier sind typische Fehler beim Arbeiten mit UPDATE und DELETE:

### Fehler 1: Spalte existiert nicht

???+ example "Fehlermeldung"
    ```sql
    UPDATE maschinen
    SET maschine = 'Neuer Name'
    WHERE maschinen_id = 1;
    ```

    **Fehler:** `column "maschine" does not exist`

    **Lösung:** Die Spalte heißt `name`, nicht `maschine`:

    ```sql
    UPDATE maschinen
    SET name = 'Neuer Name'
    WHERE maschinen_id = 1;
    ```

### Fehler 2: Primärschlüssel-Verletzung

???+ example "Fehlermeldung"
    ```sql
    UPDATE maschinen
    SET maschinen_id = 1
    WHERE maschinen_id = 2;
    ```

    **Fehler:** `duplicate key value violates unique constraint`

    **Grund:** Maschinen-ID 1 existiert bereits! Der Primärschlüssel muss eindeutig sein.

    **Lösung:** Wähle eine ID, die noch nicht existiert, oder überlege, ob das UPDATE wirklich nötig ist.

### Fehler 3: NULL in NOT NULL Spalte

???+ example "Fehlermeldung"
    ```sql
    UPDATE maschinen
    SET maschinen_id = NULL
    WHERE maschinen_id = 1;
    ```

    **Fehler:** `null value in column "maschinen_id" violates not-null constraint`

    **Grund:** Der Primärschlüssel darf nicht NULL sein!

    **Lösung:** Primärschlüssel niemals auf NULL setzen. Falls du einen Datensatz "deaktivieren" willst, nutze dafür eine Status-Spalte.

---

## Zusammenfassung

In diesem Kapitel haben wir die drei wichtigsten Manipulationsbefehle von SQL kennengelernt:

**CRUD-Operationen:**

- **C**reate → `INSERT` - Neue Datensätze erstellen
- **R**ead → `SELECT` - Datensätze abfragen (bereits bekannt)
- **U**pdate → `UPDATE` - Bestehende Datensätze ändern
- **D**elete → `DELETE` - Datensätze löschen

**Wichtigste Erkenntnisse:**

- `INSERT` fügt neue Datensätze hinzu - entweder einzeln oder mehrere gleichzeitig
- `UPDATE` ändert bestehende Datensätze - **IMMER mit WHERE** (außer du willst wirklich alle ändern)
- `DELETE` löscht Datensätze **dauerhaft** - **IMMER mit WHERE** (außer du willst wirklich alle löschen)
- **Es gibt kein "Rückgängig"** bei UPDATE und DELETE - einmal ausgeführt, sind die Daten verloren!
- WHERE-Klausel vergessen = Katastrophe!

**Goldene Regeln:**

1. **Teste immer mit SELECT** vor UPDATE/DELETE
2. **WHERE nie vergessen** bei UPDATE/DELETE
3. **Primärschlüssel verwenden** für maximale Sicherheit
4. **3-Schritte-Prozess:** SELECT → UPDATE/DELETE → SELECT

**Sicherheits-Checkliste:**

Vor jedem UPDATE oder DELETE:

- [ ] Habe ich die WHERE-Klausel?
- [ ] Habe ich mit SELECT getestet?
- [ ] Betrifft die Abfrage nur die gewünschten Zeilen?
- [ ] Ist bei produktiven Daten ein Backup vorhanden?

---

Im nächsten Kapitel lernen wir **JOINs** kennen - wie man Daten aus mehreren Tabellen miteinander verknüpft!

<div style="text-align: center;">
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXFxZ3V5dWxsZWwyOHJrOGdvZmtvZjR6dGZoZ2JoZmpoZmpoZmpoZmpoZGwmZXA9djFfZ2lmc19zZWFyY2gmY3Q9Zw/xT9IgzoKnwFNmISR8I/giphy.gif" alt="Success" style="width:220px; margin-bottom: 1em;">
</div>