# Datenintegrität & Constraints

Stell dir vor, jemand gibt in deine Datenbank ein: `anschaffungsjahr = 1800` oder `preis = -500`. Dies wären offensichtlich unsinnige Daten! Wie können wir solche **Datenfehler verhindern**?

Die Antwort: **Constraints** (Integritätsbedingungen)!

<div style="text-align: center;">
    <img src="https://despair.com/cdn/shop/products/integrity.jpg" alt="Integrity" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://despair.com/cdn/shop/products/integrity.jpg">Despair</a></figcaption>
</div>


Constraints sind **Regeln**, die sicherstellen, dass nur **gültige Daten** in die Datenbank gelangen. Sie sind die erste Verteidigungslinie gegen fehlerhafte Daten.

---

## Warum ist Datenintegrität wichtig

**Garbage In, Garbage Out** – Diesen Spruch hört man sehr häufig im Zusammenhang mit Daten. Und auch wenn er unscheinbar klingen mag, so steckt doch viel Wahrheit in ihm. Schlechte Daten führen immer zu schlechten Ergebnissen. Und schlechte Ergebnisse führen zu schlechten Entscheidungen. Beispiele für schlechte Daten sind

- ❌ Ein negatives Alter
- ❌ Ein leerer Name bei einem Pflichtfeld
- ❌ Eine ungültige E-Mail-Adresse
- ❌ Ein Fremdschlüssel, der auf nichts verweist

**Constraints** verhindern diese Probleme **automatisch auf Datenbankebene** – unabhängig davon, welche Anwendung auf die Datenbank zugreift.


---

## Die wichtigsten Constraints

Nachfolgende Tabelle gibt einen Überblick über die wichtigsten und gängisten Constraints.

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Constraint</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>NOT NULL</code></td>
        <td style="padding:10px 14px;">Darf nicht leer sein</td>
        <td style="padding:10px 14px;">Name, E-Mail</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>UNIQUE</code></td>
        <td style="padding:10px 14px;">Muss eindeutig sein</td>
        <td style="padding:10px 14px;">Seriennummer, Teilnummer</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>PRIMARY KEY</code></td>
        <td style="padding:10px 14px;">NOT NULL + UNIQUE</td>
        <td style="padding:10px 14px;">ID-Spalten</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>FOREIGN KEY</code></td>
        <td style="padding:10px 14px;">Verweist auf andere Tabelle</td>
        <td style="padding:10px 14px;">techniker_id</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>CHECK</code></td>
        <td style="padding:10px 14px;">Eigene Bedingung</td>
        <td style="padding:10px 14px;">alter >= 0</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>DEFAULT</code></td>
        <td style="padding:10px 14px;">Standardwert</td>
        <td style="padding:10px 14px;">'Aktiv', 'Unbekannt'</td>
    </tr>
    </tbody>
</table>
</div>

Wollen uns nun einige der Constraints genauer ansehen.

Prinzipiell ist es so, dass Constraints beim Erstellen einer Tabelle definiert werden. Damit wird sichergestellt, dass von Anfang an alle Daten die gewünschten Eigenschaften haben. Es gibt aber auch die Möglichkeit, Constraints nachträglich zu einer bestehenden Tabelle hinzuzufügen. Wir werden uns dies später noch genauer ansehen.

---

### Pflichtfelder (`NOT NULL`)

Die `NOT NULL` Bedingung stellt sicher, dass eine Spalte **niemals leer** sein darf. Der allgemeine Syntax ist wiefolgt: 

```sql { .yaml .no-copy }
CREATE TABLE tabellenname (
    spalte DATENTYP NOT NULL
);
```

???+ example "Beispiel"

    Zuerst erstellen wir eine neue Tabelle mit gewissen Pflichtspalten.

    ```sql hl_lines="3 4 6"
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,        -- Muss ausgefuellt sein!
        typ VARCHAR(50) NOT NULL,          -- Muss ausgefuellt sein!
        seriennummer VARCHAR(50),          -- Darf leer sein
        anschaffungsjahr INTEGER NOT NULL  -- Muss ausgefuellt sein!
    );
    ```

    Was passiert nun, wenn wir versuchen, eine Maschine ohne Name und Typ zu erstellen?

    ```sql
    -- Fehler: name ist NOT NULL!
    INSERT INTO maschinen (typ, anschaffungsjahr)
    VALUES ('CNC-Fräse', 2020);
    ```

    ```title="Output"
    FEHLER:  NULL-Wert in Spalte »name« von Relation »maschinen« verletzt Not-Null-Constraint
    DETAIL:  Fehlgeschlagene Zeile enthält (1, null, CNC-Fräse, null, 2020).
    ```

    Wir sehen also, dass die Einfügung fehlschlägt und wir eine Fehlermeldung erhalten. Dem User ist es also nicht möglich, eine Maschine ohne Name und Typ zu erstellen.

???+ tip "Best Practice"
    Verwende NOT NULL für alle Spalten, die **immer** einen Wert haben müssen. Das verhindert unvollständige Daten.

---

### Eindeutigkeit erzwingen (`UNIQUE`)

Die `UNIQUE` Bedingung stellt sicher, dass ein Wert in einer Spalte **nur einmal vorkommt**. Generell liest sich der Syntax: 

```sql { .yaml .no-copy }
CREATE TABLE tabellenname (
    spalte DATENTYP UNIQUE
);
```

???+ example "Beispiel"

    Zuerst erstellen wir eine neue Tabelle mit einer Spalte, die eindeutig sein muss.

    ```sql hl_lines="5"
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        typ VARCHAR(50) NOT NULL,
        seriennummer VARCHAR(50) UNIQUE,   -- Jede Seriennummer nur einmal!
        anschaffungsjahr INTEGER
    );
    ```

    Was passiert nun, wenn wir versuchen, eine Maschine mit derselben Seriennummer zu erstellen, wie eine bereits existierende Maschine?


    ```sql
    -- Erste Einfügung: OK
    INSERT INTO maschinen (name, typ, seriennummer, anschaffungsjahr)
    VALUES ('CNC-Fräse Alpha', 'CNC-Fräse', 'CNC-2019-001', 2019);

    -- Zweite Einfügung mit gleicher Seriennummer: FEHLER!
    INSERT INTO maschinen (name, typ, seriennummer, anschaffungsjahr)
    VALUES ('CNC-Fräse Beta', 'CNC-Fräse', 'CNC-2019-001', 2020);
    ```

    ```title="Output"
    FEHLER:  doppelter Schlüsselwert verletzt Unique-Constraint »maschinen_seriennummer_key«
    DETAIL:  Schlüssel »(seriennummer)=(CNC-2019-001)« existiert bereits.
    ```

    Wir sehen also, dass die Einfügung fehlschlägt und wir eine Fehlermeldung erhalten. Dem User ist es also nicht möglich, eine Maschine mit derselben Seriennummer zu erstellen, wie eine bereits existierende Maschine.

`UNIQUE` kann auch mit mehreren Spalten definiert werden. Dies ist beispielsweise dann sinnvoll, wenn wir eine Kombination aus zwei Spalten als eindeutig erkennen möchten.


???+ example "UNIQUE mit mehreren Spalten"

    ```sql hl_lines="6"
    CREATE TABLE wartungsprotokolle (
        wartungs_id SERIAL PRIMARY KEY,
        maschinen_id INTEGER,
        wartungsdatum DATE,
        beschreibung TEXT,
        UNIQUE (maschinen_id, wartungsdatum)  -- Diese Kombination muss eindeutig sein
    );
    ```

    Das erlaubt mehrere Wartungen für eine Maschine, aber nicht zweimal am selben Tag.

---

### Eigene Regeln definieren (`CHECK`)

Die `CHECK` Bedingung erlaubt es uns, **beliebige Bedingungen** zu definieren, die erfüllt sein müssen. Auch hier beginnen wir wieder mit dem generellen Aufbau der Befehle.

```sql { .yaml .no-copy }
CREATE TABLE tabellenname (
    spalte DATENTYP CHECK (bedingung)
);
```

???+ example "Beispiel: Wertebereich prüfen"

    Wir erstellen eine neue Tabelle mit einer oder mehreren Spalten, die einen Wertebereich prüfen müssen.

    ```sql hl_lines="5 6"
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        typ VARCHAR(50) NOT NULL,
        anschaffungsjahr INTEGER CHECK (anschaffungsjahr >= 1950 AND anschaffungsjahr <= 2030),
        installationsdatum DATE CHECK (installationsdatum <= CURRENT_DATE)  -- In der Vergangenheit
    );
    ```

    Nun erstellen wir eine Maschine mit einem Anschaffungsjahr von 1800.

    ```sql
    -- Fehler: Anschaffungsjahr 1800 ist ungültig!
    INSERT INTO maschinen (name, typ, anschaffungsjahr)
    VALUES ('Alte Maschine', 'Presse', 1800);
    ```

    ```title="Output"
    FEHLER:  neue Zeile für Relation »maschinen« verletzt Check-Constraint »maschinen_anschaffungsjahr_check«
    DETAIL:  Fehlgeschlagene Zeile enthält (1, Alte Maschine, Presse, 1800, null)
    ```

    Wir sehen also, dass die Einfügung fehlschlägt und wir eine Fehlermeldung erhalten. Dem User ist es also nicht möglich, eine Maschine mit einem Anschaffungsjahr von 1800 zu erstellen.

---

### Standardwerte (`DEFAULT`)

Die `DEFAULT` Bedingung setzt einen **Standardwert**, wenn beim Einfügen kein Wert angegeben wird. Der Syntax ist wiefolgt aufgebaut:

```sql { .yaml .no-copy }
CREATE TABLE tabellenname (
    spalte DATENTYP DEFAULT wert
);
```

???+ example "Beispiel"

    Zuerst erstellen wir eine neue Tabelle mit einer oder mehreren Spalten, die einen Standardwert haben müssen.

    ```sql hl_lines="5 6 7"
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        typ VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'Aktiv',            -- Standard: Aktiv
        installationsdatum DATE DEFAULT CURRENT_DATE,  -- Standard: Heute
        betriebsbereit BOOLEAN DEFAULT TRUE            -- Standard: betriebsbereit
    );
    ```

    Nun fügen wir neue Maschinen ein, ohne einen Status anzugeben.

    ```sql
    -- Ohne status: wird automatisch 'Aktiv'
    INSERT INTO maschinen (name, typ)
    VALUES ('CNC-Fräse Alpha', 'CNC-Fräse');
    ```

    Lasst uns überprüfen, ob der Status automatisch auf 'Aktiv' gesetzt wurde.

    ```sql
    SELECT * FROM maschinen;
    ```

    ```title="Output"
     maschinen_id |      name       |    typ    | status | installationsdatum | betriebsbereit
    --------------+-----------------+-----------+--------+--------------------+----------------
                1 | CNC-Fräse Alpha | CNC-Fräse | Aktiv  | 2025-11-19         | true
    ```

    Wir sehen also folgendes: 

    - `maschinen_id`: 1 (automatisch durch SERIAL)
    - `status`: 'Aktiv' (DEFAULT)
    - `installationsdatum`: 2025-11-19 (CURRENT_DATE)
    - `betriebsbereit`: TRUE (DEFAULT)

---

## Praktisches Arbeiten mit Constraints

Abschließend wollen wir uns noch einmal anschauen, wie wir mit Constraints in der Praxis arbeiten können.

### Position von Constraints

Generell hat man bei `CHECK`-Constraints (und auch anderen) **zwei Möglichkeiten**, wo man sie platzieren kann:

???+ example "Variante 1: Spalten-Constraint (inline)"

    Die Bedingung wird **direkt bei der Spalte** definiert:

    ```sql hl_lines="4"
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        leistung_kw NUMERIC(5,2) CHECK (leistung_kw >= 0)
    );
    ```

    **Vorteil:** Übersichtlich bei einfachen Regeln, die nur eine Spalte betreffen.

???+ example "Variante 2: Tabellen-Constraint (separate Zeile)"

    Der Constraint wird **am Ende der Tabelle** als eigene Zeile definiert:

    ```sql hl_lines="6"
    CREATE TABLE maschinen (
        maschinen_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        leistung_kw NUMERIC(5,2),
        anschaffungsjahr INTEGER,
        CHECK (leistung_kw >= 0)
    );
    ```

    **Vorteil:** Du kannst **mehrere Spalten gleichzeitig** prüfen:

    ```sql hl_lines="7"
    CREATE TABLE wartungen (
        wartung_id SERIAL PRIMARY KEY,
        maschinen_id INTEGER,
        startdatum DATE,
        enddatum DATE,
        kosten NUMERIC(10,2),
        CHECK (startdatum < enddatum)  -- Prüft 2 Spalten!
    );
    ```

???+ tip "Wann welche Variante?"

    **Inline (bei der Spalte):**

    - Für einfache Regeln, die nur **eine Spalte** betreffen
    - Wenn du die Regel direkt bei der Spaltendefinition sehen möchtest
    - Beispiel: `preis NUMERIC(10,2) CHECK (preis >= 0)`

    **Separate Zeile (Tabellen-Constraint):**

    - Wenn du **mehrere Spalten** gleichzeitig prüfen musst
    - Für komplexere Bedingungen, die mehrere Felder vergleichen
    - Beispiel: `CHECK (startdatum < enddatum)`

    **Fazit:** Beides ist erlaubt! Wähle die Variante, die für deine Situation am übersichtlichsten ist.

### Constraints benennen

Constraints können von uns auch einen eigenen **Namen bekommen**, um sie später leichter zu identifizieren:

???+ example "Benannte Constraints"

    Wir erstellen wieder eine neue Tabelle mit benannten Constraints. 

    ```sql hl_lines="6 7 8"
    CREATE TABLE maschinen (
        maschinen_id INTEGER,
        seriennummer VARCHAR(50),
        anschaffungsjahr INTEGER,

        CONSTRAINT pk_maschinen PRIMARY KEY (maschinen_id),
        CONSTRAINT uq_seriennummer UNIQUE (seriennummer),
        CONSTRAINT ck_anschaffungsjahr CHECK (anschaffungsjahr >= 1950 AND anschaffungsjahr <= 2030)
    );
    ```

    Nun versuchen wir absichtlich einen Fehler bei der Bedingung `ck_anschaffungsjahr` hervorzurufen indem wir das Jahr `1800` einfügen.

    ```sql hl_lines="6 7 8"
    INSERT INTO maschinen (maschinen_id, seriennummer, anschaffungsjahr)
    VALUES ('000', 'Presse', 1800);
    ```

    ```title="Output"
    FEHLER:  neue Zeile für Relation »maschinen« verletzt Check-Constraint »ck_anschaffungsjahr«
    DETAIL:  Fehlgeschlagene Zeile enthält (000, Presse, 1800).
    ```

    Wir sehen also, dass die Einfügung fehlschlägt und wir erhalten bei der Fehlermeldung den Namen des Constraints `ck_anschaffungsjahr`.

---

### Nachträglichs hinzufügen

Wie bereits erwähnt, sollten wir Constraints bereits bei der Erstellung der Tabelle definieren. Doch was passiert, wenn wir später feststellen, dass wir ein Constraint benötigen?

Es gibt auch die Möglichkeit, Constraints zu bestehenden Tabellen nachträglich hinzuzufügen. Dies passiert allemein mit dem `ALTER TABLE` Befehl.

???+ example "Constraints mit ALTER TABLE"

    **NOT NULL hinzufügen:**
    ```sql
    ALTER TABLE maschinen
    ALTER COLUMN seriennummer SET NOT NULL;
    ```

    **UNIQUE hinzufügen:**
    ```sql
    ALTER TABLE maschinen
    ADD CONSTRAINT seriennummer_unique UNIQUE (seriennummer);
    ```

    **CHECK hinzufügen:**
    ```sql
    ALTER TABLE maschinen
    ADD CONSTRAINT jahr_check CHECK (anschaffungsjahr >= 1950 AND anschaffungsjahr <= 2030);
    ```

    **Constraint entfernen:**
    ```sql
    ALTER TABLE maschinen
    DROP CONSTRAINT seriennummer_unique;
    ```

---

???+ question "Aufgabe 1: Techniker-Tabelle"

    Erstelle eine Tabelle `techniker` mit folgenden Anforderungen:

    - ID (Primärschlüssel, automatisch)
    - Name (Pflicht)
    - Abteilung (Pflicht)
    - Telefon (eindeutig, Pflicht)
    - Erfahrungsjahre (positiv, mindestens 0, maximal 50)
    - Einstellungsdatum (Standardwert: heute)

    ??? tip "Lösung anzeigen"

        ```sql
        CREATE TABLE techniker (
            techniker_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            abteilung VARCHAR(50) NOT NULL,
            telefon VARCHAR(20) UNIQUE NOT NULL,
            erfahrungsjahre INTEGER CHECK (erfahrungsjahre >= 0 AND erfahrungsjahre <= 50),
            einstellungsdatum DATE DEFAULT CURRENT_DATE
        );
        ```

???+ question "Aufgabe 2: Constraint hinzufügen"

    Füge zur bestehenden `ersatzteile`-Tabelle ein Constraint hinzu: Die Teilnummer muss mit 'ET-' beginnen.

    ??? tip "Lösung anzeigen"

        ```sql
        ALTER TABLE ersatzteile
        ADD CONSTRAINT teilnummer_format CHECK (teilnummer LIKE 'ET-%');
        ```

???+ question "Aufgabe 3: Fehler finden"

    Was ist an dieser Tabellendefinition problematisch?

    ```sql
    CREATE TABLE wartungsauftraege (
        auftrag_id SERIAL,
        maschinen_id INTEGER,
        kosten NUMERIC(10, 2),
        status VARCHAR(20)
    );
    ```

    ??? tip "Lösung anzeigen"

        **Probleme:**

        1. Kein PRIMARY KEY definiert (sollte bei `auftrag_id` sein)
        2. `maschinen_id` sollte NOT NULL sein (jeder Auftrag braucht eine Maschine)
        3. `kosten` sollte CHECK (kosten >= 0) haben
        4. `status` könnte auf bestimmte Werte eingeschränkt werden

        **Verbesserung:**

        ```sql
        CREATE TABLE wartungsauftraege (
            auftrag_id SERIAL PRIMARY KEY,
            maschinen_id INTEGER NOT NULL,
            kosten NUMERIC(10, 2) CHECK (kosten >= 0),
            status VARCHAR(20) CHECK (status IN ('geplant', 'in_arbeit', 'abgeschlossen', 'abgebrochen')),
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
        );
        ```

---


## Zusammenfassung 📌

- **Constraints** erzwingen Datenintegrität auf Datenbankebene
- **NOT NULL** – Verhindert leere Werte
- **UNIQUE** – Erzwingt Eindeutigkeit
- **PRIMARY KEY** – Kombination aus NOT NULL und UNIQUE
- **FOREIGN KEY** – Referenzielle Integrität
- **CHECK** – Eigene Validierungsregeln
- **DEFAULT** – Standardwerte bei fehlender Eingabe
- Constraints können mit `ALTER TABLE` nachträglich hinzugefügt/entfernt werden
- Constraints schützen vor ungültigen Daten, unabhängig von der Anwendung

---

Im nächsten Kapitel lernen wir über **Transaktionen & ACID** – wie wir Datenintegrität bei gleichzeitigen Zugriffen sicherstellen!
