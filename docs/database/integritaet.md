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

???+ example "Eindeutigkeit mit `UNIQUE`"

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


???+ example "`UNIQUE` mit mehreren Spalten"

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

???+ example "Wertebereich prüfen"

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
???+ info "Übungsvorbereitung - Datenbank zurücksetzen"

    Falls du das vorherige Kapitel nicht abgeschlossen hast oder neu starten möchtest,
    führe dieses Setup aus. Es löscht alle bestehenden Daten und erstellt den
    korrekten Ausgangszustand für dieses Kapitel.

    ??? code "Setup"

        ```sql
        -- Zu anderer Datenbank wechseln
        \c postgres
        
        -- Zur Datenbank wechseln (oder neu erstellen)
        DROP DATABASE IF EXISTS produktionsplanung_db;
        CREATE DATABASE produktionsplanung_db;
        \c produktionsplanung_db

        -- 1. Tabelle für Maschinen erstellen
        CREATE TABLE maschinen (
            maschinen_id INTEGER PRIMARY KEY,
            maschinenname VARCHAR(100),
            maschinentyp VARCHAR(50),
            produktionshalle VARCHAR(50),
            anschaffungsjahr INTEGER,
            maschinenstatus VARCHAR(20),
            wartungsintervall_tage INTEGER
        );

        -- 2. Tabelle für Produktionsaufträge erstellen (MIT FK-Constraint)
        CREATE TABLE produktionsauftraege (
            auftrag_id INTEGER PRIMARY KEY,
            auftragsnummer VARCHAR(20),
            kunde VARCHAR(100),
            produkt VARCHAR(100),
            menge INTEGER,
            startdatum DATE,
            lieferdatum DATE,
            status VARCHAR(20),
            maschinen_id INTEGER,
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE RESTRICT
        );

        -- 3. Tabelle für Wartungsprotokolle erstellen (MIT FK-Constraint)
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

        -- 4. Tabelle für Ersatzteile erstellen
        CREATE TABLE ersatzteile (
            teil_id SERIAL PRIMARY KEY,
            teilename VARCHAR(100) NOT NULL,
            hersteller VARCHAR(100),
            preis NUMERIC(10, 2)
        );

        -- 5. Junction Table für n:m Beziehung (Maschinen ↔ Ersatzteile)
        CREATE TABLE maschinen_ersatzteile (
            zuordnung_id SERIAL PRIMARY KEY,
            maschinen_id INTEGER NOT NULL,
            teil_id INTEGER NOT NULL,
            benoetigte_anzahl INTEGER DEFAULT 1,
            FOREIGN KEY (maschinen_id) REFERENCES maschinen(maschinen_id)
                ON DELETE CASCADE,
            FOREIGN KEY (teil_id) REFERENCES ersatzteile(teil_id)
                ON DELETE CASCADE
        );

        -- Maschinen-Daten einfügen
        INSERT INTO maschinen VALUES
        (1, 'CNC-Fraese Alpha', 'CNC-Fraese', 'Halle A', 2020, 'Aktiv', 90),
        (2, 'Drehbank Delta', 'Drehbank', 'Halle A', 2018, 'Aktiv', 120),
        (3, 'Presse Gamma', 'Presse', 'Halle B', 2019, 'Aktiv', 60),
        (4, 'Schweissroboter Beta', 'Schweissroboter', 'Halle C', 2021, 'Aktiv', 90);

        -- Produktionsaufträge-Daten einfügen
        INSERT INTO produktionsauftraege VALUES
        (1, 'AUF-2024-001', 'BMW AG', 'Getriebegehäuse', 500, '2024-04-01', '2024-04-15', 'In Produktion', 1),
        (2, 'AUF-2024-002', 'Audi AG', 'Kurbelwelle', 200, '2024-04-10', '2024-04-20', 'In Produktion', 2),
        (3, 'AUF-2024-003', 'Mercedes-Benz', 'Pleuelstange', 350, '2024-04-05', '2024-04-18', 'In Produktion', 2),
        (4, 'AUF-2024-004', 'Porsche AG', 'Kolben', 150, '2024-04-12', '2024-04-25', 'In Vorbereitung', 4),
        (5, 'AUF-2024-005', 'BMW AG', 'Kurbelwelle', 300, '2024-04-15', '2024-04-22', 'In Produktion', 2),
        (6, 'AUF-2024-006', 'Volkswagen AG', 'Kolben', 400, '2024-04-20', '2024-04-28', 'In Vorbereitung', 1),
        (7, 'AUF-2024-009', 'Porsche AG', 'Kurbelwelle', 120, '2024-04-28', '2024-05-05', 'In Vorbereitung', 2),
        (8, 'AUF-2024-010', 'BMW AG', 'Kolben', 350, '2024-04-12', '2024-04-19', 'In Produktion', 4);

        -- Wartungsprotokolle-Daten einfügen
        INSERT INTO wartungsprotokolle (wartungsdatum, beschreibung, techniker, kosten, maschinen_id)
        VALUES
        ('2024-01-15', 'Routinewartung - Oelwechsel', 'M. Schneider', 250.00, 1),
        ('2024-02-10', 'Reparatur Spindelmotor', 'L. Weber', 850.00, 1),
        ('2024-01-20', 'Routinewartung - Kalibrierung', 'M. Schneider', 180.00, 2),
        ('2024-03-05', 'Austausch Keilriemen', 'L. Weber', 120.00, 2);

        -- Ersatzteile-Daten einfügen
        INSERT INTO ersatzteile (teilename, hersteller, preis)
        VALUES
        ('Spindelmotor 5kW', 'MotorTech GmbH', 1850.00),
        ('Kuehlmittelpumpe', 'PumpCo AG', 320.50),
        ('Linearfuehrung 500mm', 'Precision Parts', 680.00),
        ('Werkzeughalter ISO40', 'ToolSupply GmbH', 145.00),
        ('Drehfutter 250mm', 'ChuckMaster', 890.00);

        -- Maschinen-Ersatzteile Zuordnungen einfügen
        INSERT INTO maschinen_ersatzteile (maschinen_id, teil_id, benoetigte_anzahl)
        VALUES
        (1, 1, 1),  -- CNC-Fraese braucht 1x Spindelmotor
        (1, 2, 2),  -- CNC-Fraese braucht 2x Kuehlmittelpumpe
        (1, 3, 4),  -- CNC-Fraese braucht 4x Linearfuehrung
        (1, 4, 6),  -- CNC-Fraese braucht 6x Werkzeughalter
        (2, 2, 1),  -- Drehbank braucht 1x Kuehlmittelpumpe
        (2, 5, 1);  -- Drehbank braucht 1x Drehfutter
        ```

        **Hinweis:** Alle Foreign Key Constraints sind aktiv. Die Tabellen sind nun vollständig verknüpft!


???+ question "Aufgabe 1: `NOT NULL` Constraints hinzufügen"

    Die Tabelle `produktionsauftraege` hat aktuell einige Spalten, die leer sein dürfen, obwohl sie kritische Informationen enthalten. Füge folgende `NOT NULL` Constraints hinzu:

    - `auftragsnummer` soll nicht leer sein (jeder Auftrag braucht eine Nummer)
    - `startdatum` soll nicht leer sein (jeder Auftrag braucht ein Startdatum)

    **Hinweis**

    Mit dem Befehl `\d produktionsauftraege` können wir die Struktur der Tabelle `produktionsauftraege` anzeigen und Beschränkungen anzeigen.

    ??? info "💡 Tip anzeigen"
        Dazu benötigen wir die Befehle: `ALTER TABLE` & `SET NOT NULL`

        ??? info "⚡Lösung anzeigen"
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


???+ question "Aufgabe 2: CHECK Constraint für Wartungsintervalle"

    In der Tabelle `maschinen` gibt es eine Spalte `wartungsintervall_tage`, die angibt, nach wie vielen Tagen eine Wartung fällig ist.

    Füge einen CHECK Constraint hinzu, der sicherstellt, dass das Wartungsintervall **mindestens 30 Tage und maximal 365 Tage** beträgt.

    Teste ob die Beschränkung richtig funktioniert: 

    ```sql
    UPDATE maschinen
    SET wartungsintervall_tage = 10
    WHERE maschinen_id = 1;
    ```

    **Tipp:** Verwende einen aussagekräftigen Namen für den Constraint (z.B. `ck_wartungsintervall_gueltig`). Wieder können wir mit dem Befehl `\d maschinen` die Struktur der Tabelle `maschinen` anzeigen und Beschränkungen anzeigen.

    ??? info "💡 Tip anzeigen"
        Verwende zum Hinzufügen der Constraints `ALTER TABLE`, `ADD CONSTRAINT` & `CHECK`

        ??? info "⚡Lösung anzeigen"
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


???+ question "Aufgabe 3: Multi-Column UNIQUE Constraint"

    In der Tabelle `wartungsprotokolle` möchtest du verhindern, dass **dieselbe Maschine zweimal am selben Tag** gewartet wird.

    Füge einen UNIQUE Constraint hinzu, der die Kombination aus `maschinen_id` und `wartungsdatum` eindeutig macht.

    Teste, ob die Constraint richtig funktioniert: 
    ```sql
    -- Erste Wartung
    INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
    VALUES (1, '2025-12-01', 'Routinewartung 1', 250);

    -- Zweite Wartung am gleichen Tag
    INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
    VALUES (1, '2025-12-01', 'Routinewartung 2', 300);
    ```


    ??? info "💡 Tip anzeigen"
        Verwende zum Hinzufügen der Constraints `ALTER TABLE`, `ADD CONSTRAINT` & `UNIQUE`

        ??? info "⚡Lösung anzeigen"
            ```sql
            -- UNIQUE Constraint für Kombination hinzufügen
            ALTER TABLE wartungsprotokolle
            ADD CONSTRAINT uq_maschine_wartungsdatum UNIQUE (maschinen_id, wartungsdatum);

            -- Test: Versuche zweimal die gleiche Maschine am gleichen Tag zu warten
            -- Erste Wartung: OK
            INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
            VALUES (1, '2025-12-01', 'Routinewartung 1', 250);

            -- Zweite Wartung am gleichen Tag: Sollte Fehlschlagen!
            INSERT INTO wartungsprotokolle (maschinen_id, wartungsdatum, beschreibung, kosten)
            VALUES (1, '2025-12-01', 'Routinewartung 2', 300);
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
