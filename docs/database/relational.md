# Grundlagen des Relationalen Modells

Im vorherigen Kapitel haben wir Datenbanken als Lösung für strukturierte Datenhaltung kennengelernt und PostgreSQL installiert. Jetzt wird es konkret: Wie werden Daten in einer relationalen Datenbank organisiert?

Die Antwort: In **Tabellen**!

---

## Das relationale Modell

Eine **relationale Datenbank** organisiert Daten in **Tabellen** (auch Relationen genannt). Jede Tabelle besitzt einen Namen (**Relationennamen**) und besteht aus:

<div style="text-align: center;">
    <img src="/assets/database/relationen/wording.png" alt="" style="margin-bottom: 1em;">
</div>

???+ defi "Relationale Datenbank"
    Eine Relationale Datenbank wird wiefolgt beschrieben:

    - **Tupel** (auch Zeilen oder Datensätze genannt) – repräsentieren einzelne Objekte oder Einträge
    - **Attribute** (auch Spalten oder Felder genannt) – beschreiben Eigenschaften dieser Objekte
    - **Relationenschema** - Menge von Attributen. 
    - **Relationenname** - Name der Tabelle


---

## Datentypen in PostgreSQL

Jede Spalte einer Tabelle hat einen **Datentyp**, der festlegt, welche Art von Daten gespeichert werden kann. PostgreSQL bietet eine Vielzahl von Datentypen (siehe [Dokumentation](https://www.postgresql.org/docs/current/datatype.html))- wir konzentrieren uns zunächst auf die wichtigsten:

### Textdaten

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Datentyp</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>VARCHAR(n)</code></td>
        <td style="padding:10px 14px;">Zeichenkette mit max. <code>n</code> Zeichen</td>
        <td style="padding:10px 14px;"><code>'CNC-Fräse Alpha'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>TEXT</code></td>
        <td style="padding:10px 14px;">Zeichenkette unbegrenzter Länge</td>
        <td style="padding:10px 14px;"><code>'Ein langer Text...'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>CHAR(n)</code></td>
        <td style="padding:10px 14px;">Zeichenkette mit fixer Länge <code>n</code></td>
        <td style="padding:10px 14px;"><code>'AT'</code> (Länderkürzel)</td>
    </tr>
    </tbody>
</table>
</div>

### Zahlen

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Datentyp</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>INTEGER</code></td>
        <td style="padding:10px 14px;">Ganze Zahl (-2.147.483.648 bis 2.147.483.647)</td>
        <td style="padding:10px 14px;"><code>42</code>, <code>-17</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>SMALLINT</code></td>
        <td style="padding:10px 14px;">Kleine ganze Zahl (-32.768 bis 32.767)</td>
        <td style="padding:10px 14px;"><code>5</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>BIGINT</code></td>
        <td style="padding:10px 14px;">Große ganze Zahl (-9.223.372.036.854.775.808 bis 9.223.372.036.854.775.807)</td>
        <td style="padding:10px 14px;"><code>9876543210</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>NUMERIC(p,d)</code></td>
        <td style="padding:10px 14px;">Festkommazahl (<code>p</code> Gesamtstellen, <code>d</code> Nachkommastellen)</td>
        <td style="padding:10px 14px;"><code>123.45</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>REAL</code></td>
        <td style="padding:10px 14px;">Gleitkommazahl (einfache Genauigkeit)</td>
        <td style="padding:10px 14px;"><code>3.14159</code></td>
    </tr>
    </tbody>
</table>
</div>

???+ defi "Signed / Unsigned"
    Generell unterschiedet man bei ganzzahligen Datentypen zwischen **signed** (vorzeichenbehaftet) und **unsigned** (vorzeichenlos):

    **Signed (vorzeichenbehaftet)**:

    - Kann **positive und negative** Zahlen speichern
    - Beispiel `INTEGER`: -2.147.483.648 bis +2.147.483.647
    - Das erste Bit (Vorzeichenbit) bestimmt, ob die Zahl positiv oder negativ ist

    **Unsigned (vorzeichenlos)**:

    - Kann **nur positive** Zahlen speichern (inkl. 0)
    - Würde bei `INTEGER` theoretisch 0 bis 4.294.967.295 ermöglichen
    
    **Wichtig:** PostgreSQL unterstützt standardmäßig **keine unsigned-Typen**!


### Datum & Zeit

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Datentyp</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>DATE</code></td>
        <td style="padding:10px 14px;">Datum (ohne Uhrzeit)</td>
        <td style="padding:10px 14px;"><code>'2024-03-15'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>TIME</code></td>
        <td style="padding:10px 14px;">Uhrzeit (ohne Datum)</td>
        <td style="padding:10px 14px;"><code>'14:30:00'</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>TIMESTAMP</code></td>
        <td style="padding:10px 14px;">Datum und Uhrzeit</td>
        <td style="padding:10px 14px;"><code>'2024-03-15 14:30:00'</code></td>
    </tr>
    </tbody>
</table>
</div>

### Sonstige

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Datentyp</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beispiel</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>BOOLEAN</code></td>
        <td style="padding:10px 14px;">Wahrheitswert (wahr/falsch)</td>
        <td style="padding:10px 14px;"><code>TRUE</code>, <code>FALSE</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>SERIAL</code></td>
        <td style="padding:10px 14px;">Auto-inkrementierende Ganzzahl</td>
        <td style="padding:10px 14px;"><code>1, 2, 3, ...</code></td>
    </tr>
    </tbody>
</table>
</div>


---

## Der Primärschlüssel

Stellen wir uns vor, unser Produktionsbetrieb hat zwei CNC-Fräsen mit dem Namen "CNC-Fräse Alpha". Beide stehen in Halle A, beide wurden im Jahr 2019 angeschafft. Wie können wir diese beiden Maschinen in unserer Datenbank eindeutig voneinander unterscheiden? Was passiert, wenn wir eine Wartung für die erste Fräse dokumentieren wollen - wie weiß die Datenbank, welche der beiden gemeint ist?

Genau hier kommt der **Primärschlüssel** (engl. Primary Key) ins Spiel!

Ein **Primärschlüssel** ist eine Spalte (oder eine Kombination mehrerer Spalten), die jeden Datensatz in einer Tabelle **eindeutig identifiziert**. Er funktioniert wie eine Seriennummer oder Personalausweisnummer: Jede Maschine, jeder Auftrag, jedes Ersatzteil erhält einen einzigartigen Wert, über den es jederzeit zweifelsfrei identifiziert werden kann.

In unserem Beispiel würden wir den beiden CNC-Fräsen unterschiedliche Maschinen-IDs zuweisen - etwa `maschinen_id = 1` für die erste und `maschinen_id = 5` für die zweite Fräse. Selbst wenn beide denselben Namen, Typ und Standort haben, sind sie durch ihre ID eindeutig unterscheidbar.

???+ defi "Primärschlüssel (Primary Key)"
    Ein **Primärschlüssel** ist ein Attribut (oder eine Kombination von Attributen), das jeden Datensatz in einer Tabelle eindeutig identifiziert.

    **Eigenschaften eines Primärschlüssels:**

    - **Eindeutig** – Kein Wert darf in der Tabelle doppelt vorkommen
    - **Nicht NULL** – Jeder Datensatz muss einen Wert haben (leere Einträge sind nicht erlaubt)
    - **Unveränderlich** – Sollte sich idealerweise nie ändern, um Konsistenz zu gewährleisten

    **Beispiele aus der Praxis:**

    - **Maschinen-ID** für Produktionsmaschinen (z.B. `M001`, `M002`, ...)
    - **Auftragsnummer** für Produktionsaufträge (z.B. `AUF-2024-00123`)
    - **Artikel-Nr.** für Ersatzteile (z.B. `201`, `202`, ...)
    - **Mitarbeiter-ID** für Techniker (z.B. `T42`)

### Warum sind Primärschlüssel wichtig?

Ohne Primärschlüssel würde es in der Datenbank schnell zu Chaos kommen. Ohne eindeutige Identifikation wäre eine verlässliche Datenverwaltung unmöglich. Der Primärschlüssel sorgt dafür, dass:

- **Datensätze eindeutig identifiziert** werden können
- **Verknüpfungen zwischen Tabellen** funktionieren (mehr dazu später bei Fremdschlüsseln)
- **Keine Duplikate** entstehen können
- **Daten konsistent** bleiben, selbst wenn andere Werte geändert werden

In der Praxis verwendet man häufig eine **fortlaufende Nummer** (1, 2, 3, ...) als Primärschlüssel, da diese automatisch eindeutig ist und sich nie ändert – selbst wenn der Maschinenname oder Standort später angepasst wird.

<div style="text-align: center;">
    <img src="https://i.imgflip.com/aadzku.jpg" alt="" style="margin-bottom: 0em;">
    <figcaption>Quelle: <a href="https://i.imgflip.com/aadzku.jpg">Imgflip</a></figcaption>
</div>

---

## Erstellen einer Tabelle

Nun wollen wir wieder in den praktischen Teil zurückkehren und eine Tabelle erstellen. Diese soll die Maschinen unseres Produktionsbetriebs speichern. 

### Verbindung zur Datenbank

Wir wechseln daher wieder zu pgAdmin in the *PSQL Tool Workspace* und wählen unsere bereits zuvor erzeugte Datenbank `produktions_db` aus.

<div style="text-align: center;">
    <img src="/assets/database/relationen/connect.png" alt="" style="width: 70%; margin-bottom: 0em;">
</div>

???+ info "Dankenbank nicht gefunden?"
    Wenn die Datenbank nicht gefunden wird, kann es daran liegen, dass die Darstellung noch nicht aktualisiert wurde. Enfernen Sie die Auswahl des Servers im *PSQL Tool Workspace* und wählen anschließend erneut 'PostgreSQL 18' aus. Nun sollte unter 'Database' unsere Datenbank `produktions_db` zu sehen sein.

Alternativ können wir auch über den Windows Terminal (cmd) die Verbindung zur Datenbank herstellen und dort direkt die SQL-Befehle ausführen:
```cmd
psql -h localhost -p 5432 -U postgres -d produktions_db
```

### Erstellen (CREATE TABLE)

Beim **erstellen der Tabelle** verwenden wir - wie beim erstellen einer Datenbank - den Befehl `CREATE`. Dieses mal müssen wir aber noch den Befehl `TABLE` anstelle von `DATABASE` hinzufügen.

Nach dem Befehl `CREATE TABLE` folgt der Name der Tabelle und anschließend die **Attribute** der Tabelle in einer Klammern. Jedes Attribut hat einen Namen und einen Datentyp und wird durch ein Komma getrennt. Wenn wir bei unserem Beispiel von zuvor beleiben, müssen wir die Tabelle `maschinen` wiefolgt erstellen:

<div class="grid cards" markdown>

-   __Syntax__

    ---

    ```sql { .yaml .no-copy }
    CREATE TABLE tabellenname (
        attribut1 typ,
        attribut2 typ,
        ...
    );
    ```


-   __Beispiel__

    ---

    ???+ example "Beispiel"

        ```sql { .annotate }
        CREATE TABLE maschinen ( --(1)!
            maschinen_id INTEGER PRIMARY KEY, --(2)!
            name VARCHAR(100), --(3)!
            typ VARCHAR(50), --(4)!
            standort VARCHAR(50), --(5)!
            anschaffungsjahr INTEGER, --(6)!
            status VARCHAR(20) --(7)!
        );
        ```

        1. Erstelle eine Tabelle mit dem Namen "maschinen"
        2. Spalte für die Maschinen-ID (Primärschlüssel = eindeutig!)
        3. Maschinenname (max. 100 Zeichen)
        4. Maschinentyp (z.B. "CNC-Fräse", "Drehbank", max 50 Zeichen)
        5. Standort (z.B. "Halle A", max 50 Zeichen)
        6. Jahr der Anschaffung (ganze Zahl)
        7. Status (z.B. "Aktiv", "Wartung", "Defekt", max 20 Zeichen)

</div>








Den **Primärschlüssel** haben wir dabei mit Hilfe des Befehls `PRIMARY KEY` auf das Attribut `maschinen_id` gesetzt.

Wenn der Befehl erfolgreich ausgeführt wurde, sollte die Tabelle in der Datenbank angezeigt werden (*Default Workspace* > ... > *produktions_db* > *Schemas* > *public* > *Tables*).

### Daten einfügen (INSERT)

Eine leere Tabelle ist meist nicht das Ziel. Daher müssen wir uns nun ansehen, wie wir Daten (Zeilen / Tuple) in unsere nun bestehende Tabelle einfügen können. Dazu gibt es in SQL den `INSERT` Befehl. 


<div class="grid cards" markdown>

-   __Syntax__

    ---

    ```sql
    INSERT INTO tabellenname (attribut1, attribut2, ...)
    VALUES (wert1, wert2, ...);
    ```


-   __Beispiel__

    ---


    ???+ example "Beispiel"

        ```sql
        INSERT INTO maschinen (
            maschinen_id, name, typ, standort, anschaffungsjahr, status
        )
        VALUES
        (1, 'CNC-Fräse Alpha', 'CNC-Fräse', 'Halle A', 2019, 'Aktiv'),
        (2, 'Drehbank Beta', 'Drehbank', 'Halle A', 2021, 'Aktiv'),
        (3, 'Schweißroboter Gamma', 'Schweißroboter', 'Halle B', 2020, 'Wartung'),
        (4, 'Lackieranlage Delta', 'Lackieranlage', 'Halle C', 2018, 'Aktiv');
        ```

</div>

???+ info "Datentyp"
    - Textwerte müssen in einfachen Anführungszeichen stehen: `'Text'`
    - Zahlen stehen ohne Anführungszeichen: `42`

### Daten abfragen (SELECT)

Nachdem wir nun eine befüllte Tabelle vor uns haben, ist die nächste Aufgabe klar: wir wollen die Daten aus der Datenbank auslesen/abrufen. Dazu verwenden wir den `SELECT` Befehl:

<div class="grid cards" markdown>

-   __Syntax__

    ---

    ```sql
    SELECT * FROM tabellenname;
    ```


-   __Output__

    ---


    ???+ example "Beispiel"
        ```sql
        SELECT * FROM maschinen;
        ```

        ```
         maschinen_id |         name         |      typ       | standort | anschaffungsjahr | status
        --------------+----------------------+----------------+----------+------------------+---------
                    1 | CNC-Fräse Alpha      | CNC-Fräse      | Halle A  |             2019 | Aktiv
                    2 | Drehbank Beta        | Drehbank       | Halle A  |             2021 | Aktiv
                    3 | Schweißroboter Gamma | Schweißroboter | Halle B  |             2020 | Wartung
                    4 | Lackieranlage Delta  | Lackieranlage  | Halle C  |             2018 | Aktiv
        (4 rows)
        ```

</div>

???+ info "Der * Operator"
    Das * (Sternchen) ist ein Platzhalter für "alle Spalten". Es ist praktisch für schnelle Abfragen, aber in der Praxis sollte man die benötigten Spalten explizit angeben da sonnst unötig Daten übertragen werden müssen. 

<div class="grid cards" markdown>

-   __Syntax__

    ---

    ```sql
    SELECT attribut1, attribut2 FROM tabellenname;
    ```


-   __Output__

    ---


    ???+ example "Beispiel"
        ```sql
        SELECT name, typ, standort FROM maschinen;
        ```


        ```
                name         |      typ       | standort
        ---------------------+----------------+----------
        CNC-Fräse Alpha      | CNC-Fräse      | Halle A
        Drehbank Beta        | Drehbank       | Halle A
        Schweißroboter Gamma | Schweißroboter | Halle B
        Lackieranlage Delta  | Lackieranlage  | Halle C
        (4 rows)
        ```

</div>

---

Jetzt geht es darum, das erlernte zu probieren. 

???+ question "Ersatzteiltabelle"

    Erstelle eine Tabelle für **Ersatzteile** des Produktionsbetriebs.

    ---

    **Aufgabe 1: Tabelle erstellen**

    Erstelle eine Tabelle `ersatzteile` mit folgenden Spalten:

    - `teil_id` (INTEGER, Primärschlüssel)
    - `bezeichnung` (VARCHAR(100))
    - `bestand` (INTEGER)
    - `mindestbestand` (INTEGER)
    - `preis` (NUMERIC(10,2))

    ---

    **Aufgabe 2: Daten einfügen**

    Füge folgende Ersatzteile ein:

    - Teil 201: "Fräskopf Standard", Bestand 15, Mindestbestand 5, Preis 450.00
    - Teil 202: "Kühlmittelfilter", Bestand 8, Mindestbestand 10, Preis 25.50
    - Teil 203: "Spannbacken-Set", Bestand 12, Mindestbestand 3, Preis 180.00

    ---

    **Aufgabe 3: Abfragen**

    Zeige alle Ersatzteile mit ihrem Bestand und Preis an.

---

## Zusammenfassung 📌

- Das **relationale Modell** organisiert Daten in **Tabellen** mit Zeilen und Spalten
- Jede Spalte hat einen **Datentyp** (TEXT, INTEGER, DATE, BOOLEAN, ...)
- Ein **Primärschlüssel** identifiziert jeden Datensatz eindeutig und darf nicht NULL sein
- **CREATE TABLE** erstellt eine neue Tabelle mit definierter Struktur
- **INSERT INTO** fügt neue Datensätze in eine Tabelle ein
- **SELECT** fragt Daten aus einer Tabelle ab
- `SELECT *` zeigt alle Spalten, während `SELECT spalte1, spalte2` nur bestimmte Spalten zeigt

---

Im nächsten Kapitel lernen wir, wie wir Daten **gezielt filtern, sortieren und aggregieren** können – die wahre Macht von SQL!
