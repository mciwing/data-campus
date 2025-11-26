# Datenintegrität & Constraints

Stell dir vor, jemand gibt in deine Datenbank ein: `pruefergebnis = 150` (bei einer Skala von 0-100) oder `temperatur = -500`. Dies wären offensichtlich unsinnige Daten! Wie können wir solche **Datenfehler verhindern**?

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

Prinzipiell ist es so, dass Constraints beim Erstellen einer Tabelle definiert werden. Damit wird sichergestellt, dass von Anfang an alle Daten die gewünschten Eigenschaften haben. Es gibt aber auch die Möglichkeit, Constraints nachträglich zu einer bestehenden Tabelle hinzuzufügen. Wir werden uns dies später noch genauer ansehen. Die zwei Constraints `NOT NULL` und `DEFAULT` haben wir bereits im Kapitel [Daten Manipulieren](manipulieren.md) kennengelernt. Daher werden wir uns in diesem Kapitel auf die anderen Constraints konzentrieren.

---

???+ info "Datenbank-Setup"

    Für die folgenden Beispiele erstellen wir eine **Qualitätskontroll-Datenbank**. In dieser Datenbank werden Produkte und ihre Prüfungen verwaltet.

    ```sql
    -- Datenbank erstellen
    CREATE DATABASE qualitaetskontrolle_db;

    -- Zur Datenbank wechseln
    \c qualitaetskontrolle_db

    -- Tabelle: Produkte
    CREATE TABLE produkte (
        produkt_id SERIAL PRIMARY KEY,
        produktname VARCHAR(100) NOT NULL,
        produktcode VARCHAR(20) UNIQUE NOT NULL,
        kategorie VARCHAR(50) NOT NULL,
        mindestqualitaet INTEGER CHECK (mindestqualitaet >= 0 AND mindestqualitaet <= 100)
    );

    -- Tabelle: Prüfungen
    CREATE TABLE pruefungen (
        pruefung_id SERIAL PRIMARY KEY,
        produkt_id INTEGER NOT NULL,
        pruefdatum DATE NOT NULL,
        pruefergebnis INTEGER CHECK (pruefergebnis >= 0 AND pruefergebnis <= 100),
        status VARCHAR(20) DEFAULT 'ausstehend',
        temperatur NUMERIC(4,1) CHECK (temperatur >= -20 AND temperatur <= 50),
        luftfeuchtigkeit INTEGER CHECK (luftfeuchtigkeit >= 0 AND luftfeuchtigkeit <= 100),
        pruefername VARCHAR(100),
        FOREIGN KEY (produkt_id) REFERENCES produkte(produkt_id) ON DELETE CASCADE
    );

    -- Testdaten: Produkte
    INSERT INTO produkte (produktname, produktcode, kategorie, mindestqualitaet) VALUES
    ('Smartphone X500', 'SP-X500', 'Elektronik', 95),
    ('Laptop Pro 15', 'LP-PRO15', 'Elektronik', 90),
    ('Tablet Ultra', 'TB-ULTRA', 'Elektronik', 92),
    ('Gaming Monitor', 'GM-4K', 'Elektronik', 88),
    ('Mechanische Tastatur', 'KB-MECH', 'Peripherie', 85);

    -- Testdaten: Prüfungen
    INSERT INTO pruefungen (produkt_id, pruefdatum, pruefergebnis, status, temperatur, luftfeuchtigkeit, pruefername) VALUES
    (1, '2025-11-01', 98, 'bestanden', 22.5, 45, 'Anna Schmidt'),
    (1, '2025-11-15', 96, 'bestanden', 23.0, 48, 'Thomas Weber'),
    (2, '2025-11-02', 92, 'bestanden', 21.8, 50, 'Anna Schmidt'),
    (3, '2025-11-03', 85, 'nachpruefung', 22.0, 52, 'Thomas Weber'),
    (4, '2025-11-05', 91, 'bestanden', 22.3, 47, 'Anna Schmidt'),
    (5, '2025-11-10', NULL, 'ausstehend', NULL, NULL, 'Thomas Weber');
    ```

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

    ```sql hl_lines="4"
    CREATE TABLE produkte_test (
        produkt_id SERIAL PRIMARY KEY,
        produktname VARCHAR(100) NOT NULL,
        produktcode VARCHAR(20) UNIQUE,      -- Jeder Produktcode nur einmal!
        kategorie VARCHAR(50)
    );
    ```

    Was passiert nun, wenn wir versuchen, ein Produkt mit demselben Produktcode zu erstellen, wie ein bereits existierendes Produkt?


    ```sql
    -- Erste Einfügung: OK
    INSERT INTO produkte_test (produktname, produktcode, kategorie)
    VALUES ('Smartphone Alpha', 'SP-2025-001', 'Elektronik');

    -- Zweite Einfügung mit gleichem Produktcode: FEHLER!
    INSERT INTO produkte_test (produktname, produktcode, kategorie)
    VALUES ('Smartphone Beta', 'SP-2025-001', 'Elektronik');
    ```

    ```{.cmd .no-copy title="Output"}
    FEHLER:  doppelter Schlüsselwert verletzt Unique-Constraint »produkte_test_produktcode_key«
    DETAIL:  Schlüssel »(produktcode)=(SP-2025-001)« existiert bereits.
    ```

    Wir sehen also, dass die Einfügung fehlschlägt und wir eine Fehlermeldung erhalten. Dem User ist es also nicht möglich, ein Produkt mit demselben Produktcode zu erstellen, wie ein bereits existierendes Produkt.

`UNIQUE` kann auch mit mehreren Spalten definiert werden. Dies ist beispielsweise dann sinnvoll, wenn wir eine Kombination aus zwei Spalten als eindeutig erkennen möchten.


???+ example "UNIQUE mit mehreren Spalten"

    ```sql hl_lines="6"
    CREATE TABLE pruefungen_test (
        pruefung_id SERIAL PRIMARY KEY,
        produkt_id INTEGER,
        pruefdatum DATE,
        pruefername VARCHAR(100),
        UNIQUE (produkt_id, pruefdatum, pruefername)  -- Diese Kombination muss eindeutig sein
    );
    ```

    Das erlaubt mehrere Prüfungen für ein Produkt, aber nicht zweimal am selben Tag vom selben Prüfer.

---

### Eigene Regeln definieren (`CHECK`)

Die `CHECK` Bedingung erlaubt es uns, **beliebige Bedingungen** zu definieren, die erfüllt sein müssen. Auch hier beginnen wir wieder mit dem generellen Aufbau der Befehle.

```sql { .yaml .no-copy }
CREATE TABLE tabellenname (
    spalte DATENTYP CHECK (bedingung)
);
```

Wie man erkennt, wird lediglich eine Bedingung nach dem `CHECK` Schlüsselwort definiert. Schauen wir uns wieder ein Beispiel an. 

???+ example "Beispiel: Wertebereich prüfen"

    Wir erstellen eine neue Tabelle mit einer oder mehreren Spalten, die einen Wertebereich prüfen müssen.

    ```sql hl_lines="5 6 7"
    CREATE TABLE qualitaetsmessungen (
        messung_id SERIAL PRIMARY KEY,
        produkt_id INTEGER NOT NULL,
        messdatum DATE NOT NULL,
        pruefergebnis INTEGER CHECK (pruefergebnis >= 0 AND pruefergebnis <= 100),
        temperatur NUMERIC(4,1) CHECK (temperatur >= -20 AND temperatur <= 50),
        luftfeuchtigkeit INTEGER CHECK (luftfeuchtigkeit >= 0 AND luftfeuchtigkeit <= 100)
    );
    ```

    Nun erstellen wir eine Messung mit einem Prüfergebnis von 150 (ungültig).

    ```sql
    -- Fehler: Prüfergebnis 150 ist ungültig!
    INSERT INTO qualitaetsmessungen (produkt_id, messdatum, pruefergebnis, temperatur, luftfeuchtigkeit)
    VALUES (1, '2025-11-25', 150, 22.0, 50);
    ```

    ```{.cmd .no-copy title="Output"}
    FEHLER:  neue Zeile für Relation »qualitaetsmessungen« verletzt Check-Constraint »qualitaetsmessungen_pruefergebnis_check«
    DETAIL:  Fehlgeschlagene Zeile enthält (1, 1, 2025-11-25, 150, 22.0, 50).
    ```

    Wir sehen also, dass die Einfügung fehlschlägt und wir eine Fehlermeldung erhalten. Dem User ist es also nicht möglich, eine Messung mit einem Prüfergebnis von 150 zu erstellen.

    ??? code "Weitere Beispiele"

        ???+ example "CHECK mit Status-Werten"

            CHECK kann auch verwendet werden, um nur bestimmte Werte zuzulassen:

            ```sql hl_lines="6"
            CREATE TABLE pruefungen_mit_status (
                pruefung_id SERIAL PRIMARY KEY,
                produkt_id INTEGER NOT NULL,
                pruefdatum DATE NOT NULL,
                pruefergebnis INTEGER,
                status VARCHAR(20) CHECK (status IN ('ausstehend', 'bestanden', 'durchgefallen', 'nachpruefung'))
            );
            ```

            Versuchen wir nun einen ungültigen Status einzufügen:

            ```sql
            -- Fehler: 'pending' ist kein gültiger Status
            INSERT INTO pruefungen_mit_status (produkt_id, pruefdatum, status)
            VALUES (1, '2025-11-25', 'pending');
            ```

            ```{.cmd .no-copy title="Output"}
            FEHLER:  neue Zeile für Relation »pruefungen_mit_status« verletzt Check-Constraint »pruefungen_mit_status_status_check«
            DETAIL:  Fehlgeschlagene Zeile enthält (1, 1, 2025-11-25, null, pending).
            ```

---

## Praktisches Arbeiten mit Constraints

Abschließend wollen wir uns noch einmal anschauen, wie wir mit Constraints in der Praxis arbeiten können.

### Position von Constraints

Generell hat man bei `CHECK`-Constraints (und auch anderen) **zwei Möglichkeiten**, wo man sie platzieren kann:

???+ example "Variante 1: Spalten-Constraint (inline)"

    Die Bedingung wird **direkt bei der Spalte** definiert:

    ```sql hl_lines="4"
    CREATE TABLE messungen (
        messung_id SERIAL PRIMARY KEY,
        produkt_id INTEGER NOT NULL,
        pruefergebnis INTEGER CHECK (pruefergebnis >= 0 AND pruefergebnis <= 100)
    );
    ```

    **Vorteil:** Übersichtlich bei einfachen Regeln, die nur eine Spalte betreffen.

???+ example "Variante 2: Tabellen-Constraint (separate Zeile)"

    Der Constraint wird **am Ende der Tabelle** als eigene Zeile definiert. Der Vorteil ist, dass man mehrere Spalten gleichzeitig prüfen kann.

    ```sql hl_lines="7"
    CREATE TABLE pruefperioden (
        periode_id SERIAL PRIMARY KEY,
        produkt_id INTEGER,
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
    - Beispiel: `pruefergebnis INTEGER CHECK (pruefergebnis >= 0 AND pruefergebnis <= 100)`

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
    CREATE TABLE produkte_benannt (
        produkt_id INTEGER,
        produktcode VARCHAR(20),
        mindestqualitaet INTEGER,

        CONSTRAINT pk_produkte PRIMARY KEY (produkt_id),
        CONSTRAINT uq_produktcode UNIQUE (produktcode),
        CONSTRAINT ck_mindestqualitaet CHECK (mindestqualitaet >= 0 AND mindestqualitaet <= 100)
    );
    ```

    Nun versuchen wir absichtlich einen Fehler bei der Bedingung `ck_mindestqualitaet` hervorzurufen indem wir einen Wert von `150` einfügen.

    ```sql
    INSERT INTO produkte_benannt (produkt_id, produktcode, mindestqualitaet)
    VALUES (1, 'SP-2025-001', 150);
    ```

    ```{.cmd .no-copy title="Output"}
    FEHLER:  neue Zeile für Relation »produkte_benannt« verletzt Check-Constraint »ck_mindestqualitaet«
    DETAIL:  Fehlgeschlagene Zeile enthält (1, SP-2025-001, 150).
    ```

    Wir sehen also, dass die Einfügung fehlschlägt und wir erhalten bei der Fehlermeldung den Namen des Constraints `ck_mindestqualitaet`.

---

### Nachträglichs hinzufügen

Wie bereits erwähnt, sollten wir Constraints bereits bei der Erstellung der Tabelle definieren. Doch was passiert, wenn wir später feststellen, dass wir ein Constraint benötigen?

Es gibt auch die Möglichkeit, Constraints zu bestehenden Tabellen nachträglich hinzuzufügen. Dies passiert allemein mit dem `ALTER TABLE` Befehl welchen wir bereits im Kapitel [Datenbanken manipulieren](./manipulieren.md#exkurs-alter-tabellen-nachtraglich-andern) kennengelernt haben.

???+ example "Constraints mit ALTER TABLE"

    **NOT NULL hinzufügen:**
    ```sql
    ALTER TABLE pruefungen
    ALTER COLUMN pruefername SET NOT NULL;
    ```

    **UNIQUE hinzufügen:**
    ```sql
    ALTER TABLE produkte
    ADD CONSTRAINT produktcode_unique UNIQUE (produktcode);
    ```

    **CHECK hinzufügen:**
    ```sql
    ALTER TABLE pruefungen
    ADD CONSTRAINT pruefergebnis_check CHECK (pruefergebnis >= 0 AND pruefergebnis <= 100);
    ```

    **DEFAULT hinzufügen:**
    ```sql
    ALTER TABLE pruefungen
    ALTER COLUMN status SET DEFAULT 'ausstehend';
    ```

    **Constraint entfernen:**
    ```sql
    ALTER TABLE produkte
    DROP CONSTRAINT produktcode_unique;
    ```

---

## Übung ✍️

Nun wenden wir Constraints auf unser **TecGuy GmbH Produktionsplanungssystem** an! Die Übungen decken alle wichtigen Constraint-Typen ab und helfen dir, Datenintegrität in der Praxis durchzusetzen.

???+ info "Übungsvorbereitung – Datenbank zurücksetzen"

    Falls du die vorherigen Kapitel nicht abgeschlossen hast oder von vorne beginnen möchtest, kannst du mit folgendem Code-Block die Datenbank komplett neu aufsetzen:

    ```sql
    -- Datenbank löschen und neu erstellen
    DROP DATABASE IF EXISTS produktionsplanung_db;
    CREATE DATABASE produktionsplanung_db;

    -- Zur Datenbank wechseln
    \c produktionsplanung_db

    -- Tabelle: Maschinen
    CREATE TABLE maschinen (
        maschinen_id INTEGER PRIMARY KEY,
        maschinenname VARCHAR(100) NOT NULL,
        maschinentyp VARCHAR(50),
        maschinencode VARCHAR(20),  -- NEU in Kapitel 7: Eindeutige Maschinencodes
        produktionshalle VARCHAR(50),
        anschaffungsjahr INTEGER,
        maschinenstatus VARCHAR(20),
        wartungsintervall_tage INTEGER
    );

    -- Tabelle: Produktionsaufträge
    CREATE TABLE produktionsauftraege (
        auftrag_id INTEGER PRIMARY KEY,
        auftragsnummer VARCHAR(20),
        kunde VARCHAR(100),
        produkt VARCHAR(100),
        menge INTEGER,
        startdatum DATE,
        lieferdatum DATE,
        enddatum DATE,  -- NEU in Kapitel 7: Tatsächliches Produktionsende
        status VARCHAR(20),
        maschinen_id INTEGER,
        FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
            ON DELETE RESTRICT
    );

    -- Tabelle: Wartungsprotokolle (1:n Beziehung zu Maschinen)
    CREATE TABLE wartungsprotokolle (
        wartungs_id SERIAL PRIMARY KEY,
        wartungsdatum DATE NOT NULL,
        beschreibung TEXT,
        techniker VARCHAR(100),
        kosten NUMERIC(10, 2),
        maschinen_id INTEGER NOT NULL,
        FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
            ON DELETE CASCADE
    );

    -- Tabelle: Ersatzteile
    CREATE TABLE ersatzteile (
        ersatzteil_id INTEGER PRIMARY KEY,
        teilenummer VARCHAR(20) NOT NULL UNIQUE,
        bezeichnung VARCHAR(100) NOT NULL,
        lagerbestand INTEGER DEFAULT 0,
        mindestbestand INTEGER DEFAULT 10
    );

    -- Tabelle: Maschinen-Ersatzteile (n:m Beziehung)
    CREATE TABLE maschinen_ersatzteile (
        maschinen_id INTEGER,
        ersatzteil_id INTEGER,
        menge_pro_wartung INTEGER,
        PRIMARY KEY (maschinen_id, ersatzteil_id),
        FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
            ON DELETE CASCADE,
        FOREIGN KEY (ersatzteil_id) REFERENCES ersatzteile(ersatzteil_id)
            ON DELETE CASCADE
    );

    -- Testdaten: Maschinen
    INSERT INTO maschinen VALUES
    (1, 'Spritzgussmaschine Alpha', 'Spritzgussmaschine', 'M-001', 'Halle A', 2018, 'In Betrieb', 90),
    (2, 'CNC-Fräse Beta', 'CNC-Fräse', 'M-002', 'Halle B', 2020, 'In Betrieb', 60),
    (3, 'Drehmaschine Gamma', 'Drehmaschine', 'M-003', 'Halle A', 2019, 'Wartung', 120),
    (4, 'Presse Delta', 'Hydraulikpresse', 'M-004', 'Halle C', 2021, 'In Betrieb', 180);

    -- Testdaten: Produktionsaufträge
    INSERT INTO produktionsauftraege VALUES
    (1, 'PA-2024-001', 'Bosch GmbH', 'Kunststoffgehäuse', 500, '2024-03-01', '2024-03-15', NULL, 'In Produktion', 1),
    (2, 'PA-2024-002', 'Siemens AG', 'Metallrahmen', 200, '2024-03-05', '2024-03-20', NULL, 'Geplant', 2),
    (3, 'PA-2024-003', 'Daimler AG', 'Präzisionsteile', 150, '2024-03-10', '2024-03-25', NULL, 'Geplant', 3),
    (4, 'PA-2024-004', 'ZF Friedrichshafen AG', 'Zahnräder', 300, '2024-03-12', '2024-03-28', NULL, 'In Produktion', 2),
    (5, 'PA-2024-005', 'BMW AG', 'Kurbelwelle', 300, '2024-04-15', '2024-04-22', '2024-04-20', 'Abgeschlossen', 2),
    (6, 'PA-2024-006', 'Volkswagen AG', 'Kolben', 400, '2024-04-20', '2024-04-28', NULL, 'Geplant', 4),
    (7, 'PA-2024-007', 'Audi AG', 'Pleuel', 250, '2024-04-25', '2024-05-05', NULL, 'Geplant', 2),
    (8, 'PA-2024-008', 'Porsche AG', 'Kurbelgehäuse', 100, '2024-05-01', '2024-05-10', NULL, 'In Produktion', 1);

    -- Testdaten: Wartungsprotokolle
    INSERT INTO wartungsprotokolle (wartungsdatum, beschreibung, techniker, kosten, maschinen_id) VALUES
    ('2024-01-15', 'Routinewartung - Ölwechsel und Filter', 'Thomas Weber', 450.00, 1),
    ('2024-02-20', 'Austausch Hydraulikschläuche', 'Anna Schmidt', 320.00, 4),
    ('2024-03-10', 'Software-Update CNC-Steuerung', 'Thomas Weber', 180.00, 2),
    ('2024-03-22', 'Inspektion nach 5000 Betriebsstunden', 'Michael Klein', 520.00, 3),
    ('2024-04-05', 'Reparatur Kühlsystem', 'Anna Schmidt', 890.00, 1);

    -- Testdaten: Ersatzteile
    INSERT INTO ersatzteile VALUES
    (1, 'ET-001', 'Hydrauliköl 10L', 50, 20),
    (2, 'ET-002', 'Ölfilter', 30, 15),
    (3, 'ET-003', 'Hydraulikschlauch 2m', 25, 10),
    (4, 'ET-004', 'Dichtungssatz', 40, 12),
    (5, 'ET-005', 'Sicherungsring Set', 100, 30);

    -- Testdaten: Maschinen-Ersatzteile (Zuordnung)
    INSERT INTO maschinen_ersatzteile VALUES
    (1, 1, 2),  -- Spritzgussmaschine braucht Hydrauliköl
    (1, 2, 1),  -- Spritzgussmaschine braucht Ölfilter
    (2, 4, 1),  -- CNC-Fräse braucht Dichtungssatz
    (3, 1, 1),  -- Drehmaschine braucht Hydrauliköl
    (4, 3, 2),  -- Presse braucht Hydraulikschläuche
    (4, 4, 1);  -- Presse braucht Dichtungssatz
    ```

???+ question "Aufgabe 1: NOT NULL Constraints hinzufügen"

    Die Tabelle `produktionsauftraege` hat aktuell einige Spalten, die leer sein dürfen, obwohl sie kritische Informationen enthalten. Füge folgende NOT NULL Constraints hinzu:

    - `auftragsnummer` soll nicht leer sein (jeder Auftrag braucht eine Nummer)
    - `startdatum` soll nicht leer sein (jeder Auftrag braucht ein Startdatum)

    ??? tip "Lösung anzeigen"

        ```sql
        -- Zuerst mit Produktionsplanung DB verbinden
        \c produktionsplanung_db

        -- NOT NULL für auftragsnummer hinzufügen
        ALTER TABLE produktionsauftraege
        ALTER COLUMN auftragsnummer SET NOT NULL;

        -- NOT NULL für startdatum hinzufügen
        ALTER TABLE produktionsauftraege
        ALTER COLUMN startdatum SET NOT NULL;

        -- Überprüfen
        \d produktionsauftraege
        ```

???+ question "Aufgabe 2: UNIQUE Constraint für Maschinencodes"

    Jede Maschine in der Tabelle `maschinen` sollte einen **eindeutigen Maschinencode** haben. Füge einen UNIQUE Constraint für die Spalte `maschinencode` hinzu.

    **Tipp:** Verwende einen aussagekräftigen Namen für den Constraint (z.B. `uq_maschinencode`).

    ??? tip "Lösung anzeigen"

        ```sql
        -- UNIQUE Constraint hinzufügen
        ALTER TABLE maschinen
        ADD CONSTRAINT uq_maschinencode UNIQUE (maschinencode);

        -- Test: Versuche eine doppelte Seriennummer einzufügen (sollte fehlschlagen)
        INSERT INTO maschinen (maschinenname, maschinentyp, maschinencode, anschaffungsjahr)
        VALUES ('Test Maschine', 'CNC-Fräse', 'M-001', 2025);
        ```

        ```title="Output"
        FEHLER:  doppelter Schlüsselwert verletzt Unique-Constraint »uq_maschinencode«
        DETAIL:  Schlüssel »(maschinencode)=(M-001)« existiert bereits.
        ```

???+ question "Aufgabe 3: CHECK Constraint für Wartungsintervalle"

    In der Tabelle `maschinen` gibt es eine Spalte `wartungsintervall_tage`, die angibt, nach wie vielen Tagen eine Wartung fällig ist.

    Füge einen CHECK Constraint hinzu, der sicherstellt, dass das Wartungsintervall **mindestens 30 Tage und maximal 365 Tage** beträgt.

    **Tipp:** Verwende einen aussagekräftigen Namen für den Constraint (z.B. `ck_wartungsintervall_gueltig`).

    ??? tip "Lösung anzeigen"

        ```sql
        -- CHECK Constraint hinzufügen
        ALTER TABLE maschinen
        ADD CONSTRAINT ck_wartungsintervall_gueltig
        CHECK (wartungsintervall_tage >= 30 AND wartungsintervall_tage <= 365);

        -- Test: Versuche einen ungültigen Wert einzufügen (sollte fehlschlagen)
        UPDATE maschinen
        SET wartungsintervall_tage = 10
        WHERE maschinen_id = 1;
        ```

        ```title="Output"
        FEHLER:  neue Zeile für Relation »maschinen« verletzt Check-Constraint »ck_wartungsintervall_gueltig«
        DETAIL:  Fehlgeschlagene Zeile enthält (...)
        ```

???+ question "Aufgabe 4: CHECK Constraint für Kosten"

    In der Tabelle `wartungsprotokolle` werden die Wartungskosten gespeichert. Manchmal werden jedoch versehentlich negative Werte eingetragen.

    Füge einen CHECK Constraint hinzu, der sicherstellt, dass `kosten` **größer oder gleich 0** sind.

    ??? tip "Lösung anzeigen"

        ```sql
        -- CHECK Constraint für positive Kosten hinzufügen
        ALTER TABLE wartungsprotokolle
        ADD CONSTRAINT ck_kosten_positiv CHECK (kosten >= 0);

        -- Test: Versuche negative Kosten einzufügen (sollte fehlschlagen)
        INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
        VALUES (1, '2025-11-25', 'Test Wartung', -500);
        ```

        ```title="Output"
        FEHLER:  neue Zeile für Relation »wartungsprotokolle« verletzt Check-Constraint »ck_kosten_positiv«
        ```

???+ question "Aufgabe 5: DEFAULT Werte für Status"

    In der Tabelle `produktionsauftraege` sollte jeder neue Auftrag standardmäßig den Status `'geplant'` erhalten, wenn kein Status angegeben wird.

    Füge einen DEFAULT Constraint für die Spalte `status` hinzu.

    ??? tip "Lösung anzeigen"

        ```sql
        -- DEFAULT Wert für status hinzufügen
        ALTER TABLE produktionsauftraege
        ALTER COLUMN status SET DEFAULT 'geplant';

        -- Test: Füge einen Auftrag ohne Status ein
        INSERT INTO produktionsauftraege (auftragsnummer, kunde, produkt, menge, startdatum, maschinen_id)
        VALUES ('PA-TEST-001', 'Test AG', 'Test Produkt', 100, '2025-12-01', 1);

        -- Überprüfen
        SELECT auftragsnummer, status FROM produktionsauftraege WHERE auftragsnummer = 'PA-TEST-001';
        ```

        ```title="Output"
         auftragsnummer | status
        ----------------+--------
         PA-TEST-001    | geplant
        ```

???+ question "Aufgabe 6: CHECK Constraint für Stückzahlen"

    In der Tabelle `produktionsauftraege` sollte die `stueckzahl` niemals **kleiner als 1** sein.

    Füge einen CHECK Constraint hinzu, der dies sicherstellt.

    ??? tip "Lösung anzeigen"

        ```sql
        -- CHECK Constraint für mindestens 1 Stück hinzufügen
        ALTER TABLE produktionsauftraege
        ADD CONSTRAINT ck_menge_mindestens_eins CHECK (menge >= 1);

        -- Test: Versuche 0 Stück einzufügen (sollte fehlschlagen)
        INSERT INTO produktionsauftraege (auftragsnummer, kunde, produkt, menge, startdatum, maschinen_id)
        VALUES ('PA-TEST-002', 'Test AG', 'Test Produkt 2', 0, '2025-12-01', 1);
        ```

        ```title="Output"
        FEHLER:  neue Zeile für Relation »produktionsauftraege« verletzt Check-Constraint »ck_menge_mindestens_eins«
        ```

???+ question "Aufgabe 7: Multi-Column UNIQUE Constraint"

    In der Tabelle `wartungsprotokolle` möchtest du verhindern, dass **dieselbe Maschine zweimal am selben Tag** gewartet wird.

    Füge einen UNIQUE Constraint hinzu, der die Kombination aus `maschinen_id` und `wartungsdatum` eindeutig macht.

    ??? tip "Lösung anzeigen"

        ```sql
        -- UNIQUE Constraint für Kombination hinzufügen
        ALTER TABLE wartungsprotokolle
        ADD CONSTRAINT uq_maschine_wartungsdatum UNIQUE (maschinen_id, wartungsdatum);

        -- Test: Versuche zweimal die gleiche Maschine am gleichen Tag zu warten
        -- Erste Wartung: OK
        INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
        VALUES (1, '2025-12-01', 'Routinewartung 1', 250);

        -- Zweite Wartung am gleichen Tag: FEHLER!
        INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
        VALUES (1, '2025-12-01', 'Routinewartung 2', 300);
        ```

        ```title="Output"
        FEHLER:  doppelter Schlüsselwert verletzt Unique-Constraint »uq_maschine_wartungsdatum«
        DETAIL:  Schlüssel »(maschinen_id, wartungsdatum)=(1, 2025-12-01)« existiert bereits.
        ```

???+ question "Aufgabe 8: CHECK Constraint mit Datumsvergleich"

    In der Tabelle `produktionsauftraege` gibt es die Spalten `startdatum` und `enddatum`. Das Enddatum sollte immer **nach dem Startdatum** liegen.

    Füge einen CHECK Constraint hinzu, der dies sicherstellt.

    **Tipp:** Der Constraint sollte auch NULL-Werte für `enddatum` erlauben (da Aufträge noch laufen können).

    ??? tip "Lösung anzeigen"

        ```sql
        -- CHECK Constraint für Datumsvergleich hinzufügen
        ALTER TABLE produktionsauftraege
        ADD CONSTRAINT ck_enddatum_nach_startdatum
        CHECK (enddatum IS NULL OR enddatum > startdatum);

        -- Test 1: Enddatum vor Startdatum (sollte fehlschlagen)
        INSERT INTO produktionsauftraege (auftragsnummer, kunde, produkt, menge, startdatum, enddatum, maschinen_id)
        VALUES ('PA-TEST-003', 'Test AG', 'Test Produkt 3', 50, '2025-12-10', '2025-12-05', 1);
        ```

        ```title="Output"
        FEHLER:  neue Zeile für Relation »produktionsauftraege« verletzt Check-Constraint »ck_enddatum_nach_startdatum«
        ```

        ```sql
        -- Test 2: Enddatum nach Startdatum (sollte funktionieren)
        INSERT INTO produktionsauftraege (auftragsnummer, kunde, produkt, menge, startdatum, enddatum, maschinen_id)
        VALUES ('PA-TEST-003', 'Test AG', 'Test Produkt 3', 50, '2025-12-05', '2025-12-10', 1);

        -- Test 3: Kein Enddatum (sollte funktionieren)
        INSERT INTO produktionsauftraege (auftragsnummer, kunde, produkt, menge, startdatum, maschinen_id)
        VALUES ('PA-TEST-004', 'Test AG', 'Test Produkt 4', 75, '2025-12-05', 1);
        ```

???+ question "Aufgabe 9: Constraint testen und verstehen"

    Teste die Constraints, die du in den vorherigen Aufgaben hinzugefügt hast:

    1. Versuche eine Maschine mit `wartungsintervall_tage = 500` einzufügen
    2. Versuche einen Produktionsauftrag mit `menge = -10` einzufügen
    3. Versuche eine Wartung mit `kosten = -1000` einzufügen

    Analysiere die Fehlermeldungen und erkläre, warum die Constraints die Einfügung verhindern.

    ??? tip "Lösung anzeigen"

        ```sql
        -- Test 1: Wartungsintervall zu groß
        INSERT INTO maschinen (maschinenname, maschinentyp, maschinencode, wartungsintervall_tage, anschaffungsjahr)
        VALUES ('Test Maschine 1', 'Presse', 'M-TEST-001', 500, 2025);
        ```

        ```title="Output"
        FEHLER:  neue Zeile für Relation »maschinen« verletzt Check-Constraint »ck_wartungsintervall_gueltig«
        DETAIL:  Fehlgeschlagene Zeile enthält (..., 500, ...)
        ```

        **Erklärung:** Der CHECK Constraint `ck_wartungsintervall_gueltig` erlaubt nur Werte zwischen 30 und 365.

        ```sql
        -- Test 2: Negative Menge
        INSERT INTO produktionsauftraege (auftragsnummer, kunde, produkt, menge, startdatum, maschinen_id)
        VALUES ('PA-TEST-005', 'Test AG', 'Test Produkt 5', -10, '2025-12-01', 1);
        ```

        ```title="Output"
        FEHLER:  neue Zeile für Relation »produktionsauftraege« verletzt Check-Constraint »ck_menge_mindestens_eins«
        ```

        **Erklärung:** Der CHECK Constraint `ck_menge_mindestens_eins` stellt sicher, dass mindestens 1 Stück produziert wird.

        ```sql
        -- Test 3: Negative Kosten
        INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
        VALUES (1, '2025-12-02', 'Test Wartung', -1000);
        ```

        ```title="Output"
        FEHLER:  neue Zeile für Relation »wartungsprotokolle« verletzt Check-Constraint »ck_kosten_positiv«
        ```

        **Erklärung:** Der CHECK Constraint `ck_kosten_positiv` verhindert negative Wartungskosten.

???+ question "Aufgabe 10: Constraint-Übersicht anzeigen"

    Verschaffe dir einen Überblick über alle Constraints, die in der Datenbank definiert sind.

    Verwende den Befehl `\d tabellenname`, um die Constraints für die Tabellen `maschinen`, `produktionsauftraege` und `wartungsprotokolle` anzuzeigen.

    ??? tip "Lösung anzeigen"

        ```sql
        -- Constraints für Maschinen anzeigen
        \d maschinen
        ```

        ```title="Output (Auszug)"
        Tabelle »public.maschinen«
             Spalte          |          Typ           | Constraints
        ---------------------+------------------------+-------------
         maschinen_id        | integer                | not null
         maschinenname       | varchar(100)           | not null
         maschinencode       | varchar(20)            |
         wartungsintervall   | integer                |
        Indexe:
            "maschinen_pkey" PRIMARY KEY, btree (maschinen_id)
            "uq_maschinencode" UNIQUE CONSTRAINT, btree (maschinencode)
        Check-Constraints:
            "ck_wartungsintervall_gueltig" CHECK (wartungsintervall_tage >= 30 AND wartungsintervall_tage <= 365)
        ```

        ```sql
        -- Constraints für Produktionsaufträge anzeigen
        \d produktionsauftraege
        ```

        ```title="Output (Auszug)"
        Check-Constraints:
            "ck_stueckzahl_mindestens_eins" CHECK (stueckzahl >= 1)
            "ck_enddatum_nach_startdatum" CHECK (enddatum IS NULL OR enddatum > startdatum)
        ```

        ```sql
        -- Constraints für Wartungsprotokolle anzeigen
        \d wartungsprotokolle
        ```

        ```title="Output (Auszug)"
        Indexe:
            "wartungsprotokolle_pkey" PRIMARY KEY, btree (wartungs_id)
            "uq_maschine_wartungsdatum" UNIQUE CONSTRAINT, btree (maschinen_id, wartungsdatum)
        Check-Constraints:
            "ck_kosten_positiv" CHECK (kosten >= 0)
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
