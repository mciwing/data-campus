# Joins - Daten aus mehreren Tabellen kombinieren

Im vorherigen Kapitel über [Datenmodellierung](modellierung.md) haben wir gelernt, wie man **Beziehungen zwischen Tabellen** modelliert. Jetzt kommt der spannende Teil: Wie fragen wir Daten aus **mehreren verknüpften Tabellen** ab?

Die Antwort lautet: **JOINs**!

<div style="text-align: center;">
    <img src="https://i.imgflip.com/abzryz.jpg" alt="Join" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://i.imgflip.com/abzryz.jpg">imgflip</a></figcaption>
</div>


JOINs sind ein wichtiger Bestandteil relationaler Datenbanken. Sie erlauben es uns, Daten aus verschiedenen Tabellen zu kombinieren und als eine zusammenhängende Ergebnistabelle anzuzeigen. Ohne JOINs würden wir die Vorteile der Aufteilung in mehrere Tabellen nicht nutzen können - wir hätten zwar sauber strukturierte Daten ohne Redundanz, könnten diese aber nicht sinnvoll miteinander verknüpfen und auswerten.

In diesem Kapitel lernen wir die verschiedenen JOIN-Typen kennen und verstehen, wann welcher JOIN-Typ die richtige Wahl ist. Dabei werden wir sehen, wie mächtig relationale Datenbanken wirklich sind!

---

Um zu verstehen, warum JOINs so wichtig sind, betrachten wir ein konkretes Problem. Erinnern wir uns an unser Beispiel aus dem [Kapitel Datenmodellierung](modellierung.md):

```sql title="Ausgangssituation: zwei Tabellen"
-- Tabelle: maschinen
 maschinen_id |    name    | tech_id 
--------------+------------+---------
            1 | CNC Alpha  |       1
            2 | Drehbank   |       2
            3 | Roboter    |       1

-- Tabelle: techniker
 techniker_id |     name       |  abteilung   
--------------+----------------+-------------
            1 | Thomas Müller  | Wartung
            2 | Sandra Schmidt | Fertigung
            3 | Klaus Weber    | Instandh.
```


Doch wie zeigen wir die Maschinen **mit** ihren zuständigen Technikern an?

```sql title="Gewünschtes Ergebnis: Gemeinsame Darstellung"
 maschine  | techniker      | abteilung
-----------+----------------+-------------
 CNC Alpha | Thomas Müller  | Wartung
 Drehbank  | Sandra Schmidt | Fertigung
 Roboter   | Thomas Müller  | Wartung
```

Dafür brauchen wir einen **`JOIN`**! Ein `JOIN` ermöglicht es uns, die verstreuten Informationen aus beiden Tabellen wieder zusammenzuführen und in einer einzigen Ergebniszeile darzustellen. Die Verknüpfung erfolgt dabei über den Fremdschlüssel `tech_id` in der Maschinen-Tabelle, der auf den Primärschlüssel `techniker_id` in der Techniker-Tabelle verweist.

---

## Grundlagen

Bevor wir uns die verschiedenen JOIN-Typen im Detail ansehen, schauen wir uns die grundlegende Syntax an. Ein JOIN besteht immer aus mehreren Komponenten: der Auswahl der Tabellen (`FROM` und `JOIN`), der Verknüpfungsbedingung (`ON`) und optional weiteren Filterbedingungen (`WHERE`).

```sql { .yaml .no-copy }
SELECT spalten
FROM haupttabelle
[INNER|LEFT|RIGHT] JOIN andere_tabelle
    ON haupttabelle.fk = andere_tabelle.pk
WHERE filter_bedingung;
```

Bei der Spaltenauswahl im `SELECT` können wir auf **alle Spalten aus beiden Tabellen** zugreifen. Um eindeutig zu machen, von welcher Tabelle eine Spalte stammt, verwenden wir die Notation `tabellenname.spaltenname`. Das ist besonders wichtig, wenn beide Tabellen Spalten mit dem gleichen Namen haben (wie z.B. `name` in unseren Tabellen `maschinen` und `techniker`).

```sql
SELECT
    maschinen.name,           -- Spalte aus der Maschinen-Tabelle
    techniker.name,           -- Spalte aus der Techniker-Tabelle
    techniker.abteilung       -- Spalte aus der Techniker-Tabelle
FROM maschinen
JOIN techniker ON maschinen.techniker_id = techniker.techniker_id;
```

Ohne die explizite Angabe der Tabelle würde die Datenbank bei gleichnamigen Spalten einen Fehler werfen, da sie nicht weiß, welche `name`-Spalte gemeint ist. Daher ist die Notation `tabellenname.spaltenname` bei JOINs nicht nur guter Stil, sondern oft auch notwendig. Später werden wir sehen, wie **Aliasse** diese Schreibweise deutlich verkürzen.

--- 

Es gibt verschiedene Arten von JOINs, die sich darin unterscheiden, welche Datensätze sie zurückgeben. Die Wahl des richtigen JOIN-Typs hängt davon ab, ob wir nur die Datensätze wollen, die in beiden Tabellen vorhanden sind, oder ob wir auch Datensätze ohne Übereinstimmung behalten möchten. Die folgende Tabelle gibt einen Überblick über die wichtigsten JOIN-Typen:

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table" 
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Join-Typ</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Was wird zurückgegeben?</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Wann verwenden?</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>INNER JOIN</code></td>
        <td style="padding:10px 14px;">Nur Datensätze mit Übereinstimmung in <strong>beiden</strong> Tabellen</td>
        <td style="padding:10px 14px;">Standard für die meisten Abfragen</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>LEFT JOIN</code></td>
        <td style="padding:10px 14px;">Alle aus <strong>linker</strong> Tabelle + Übereinstimmungen rechts</td>
        <td style="padding:10px 14px;">Wenn du alle aus Tabelle A willst, auch ohne Match</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>RIGHT JOIN</code></td>
        <td style="padding:10px 14px;">Alle aus <strong>rechter</strong> Tabelle + Übereinstimmungen links</td>
        <td style="padding:10px 14px;">Selten – meist als LEFT JOIN umformuliert</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>FULL OUTER JOIN</code></td>
        <td style="padding:10px 14px;">Alle aus <strong>beiden</strong> Tabellen</td>
        <td style="padding:10px 14px;">Sehr selten – PostgreSQL unterstützt es</td>
    </tr>
    </tbody>
</table>
</div>

In der Praxis ist der **INNER JOIN** der am häufigsten verwendete JOIN-Typ, da wir meist nur die Datensätze sehen möchten, die tatsächlich miteinander verknüpft sind. LEFT und RIGHT JOINs kommen zum Einsatz, wenn wir auch "verwaiste" Datensätze behalten möchten - also solche, die keine Entsprechung in der anderen Tabelle haben.

<div style="text-align: center;">
    <img src="https://media.licdn.com/dms/image/v2/D4D22AQHeU4OzQVrH1g/feedshare-shrink_800/feedshare-shrink_800/0/1685862307804?e=1764806400&v=beta&t=VPS8sG7Z2gzgIZxcBXay1vTcepAXY4h6a4N_FgvVnq8" alt="Join" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://www.linkedin.com/posts/chandanagrawal23_meme-sql-leetcode-activity-7071019026377768960-PmQZ/">LinkedIn</a></figcaption>
</div>


---

## JOIN-Typen
### INNER JOIN

Der **INNER JOIN** ist der Standard-JOIN und bildet die Schnittmenge zweier Tabellen. Er gibt nur Datensätze zurück, die in **beiden** Tabellen eine Übereinstimmung haben. Stellen Sie sich zwei Kreise vor, die sich überschneiden - der INNER JOIN liefert genau den Bereich, in dem sich beide Kreise treffen.

Syntax

```sql { .yaml .no-copy }
SELECT spalten
FROM tabelle1
INNER JOIN tabelle2 ON tabelle1.fremdschlüssel = tabelle2.primärschlüssel
WHERE bedingung;
```

---

Um die verschiedenen JOIN-Typen praktisch auszuprobieren, erstellen wir zunächst zwei Beispieltabellen mit Testdaten. Wichtig ist dabei, dass wir auch einen Sonderfall berücksichtigen: eine Maschine ohne zuständigen Techniker. So können wir später sehen, wie sich verschiedene JOIN-Typen bei fehlenden Verknüpfungen verhalten.

Vorbereitung: Tabellen erstellen

```sql
CREATE TABLE techniker (
    techniker_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    abteilung VARCHAR(50)
);

CREATE TABLE maschinen (
    maschinen_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    techniker_id INTEGER,
    anschaffungsjahr INTEGER,
    FOREIGN KEY (techniker_id) REFERENCES techniker(techniker_id)
);

INSERT INTO techniker (name, abteilung)
VALUES
    ('Thomas Müller', 'Wartung'),
    ('Sandra Schmidt', 'Fertigung'),
    ('Klaus Weber', 'Instandhaltung');

INSERT INTO maschinen (name, techniker_id, anschaffungsjahr)
VALUES
    ('CNC-Fräse Alpha', 1, 2019),
    ('Drehbank Beta', 2, 2021),
    ('Schweißroboter Gamma', 1, 2020),
    ('Stanzmaschine Delta', NULL, 2018);  -- Kein zuständiger Techniker!
```

???+ info "Hinweis"
    Beachten Sie, dass die Stanzmaschine Delta bewusst keinen zuständigen Techniker hat (`techniker_id = NULL`) und der Techniker Klaus Weber keine Maschinen zugeordnet hat. Dies wird uns später helfen zu verstehen, wie sich INNER JOIN von LEFT JOIN unterscheidet.


Nun führen wir unseren ersten JOIN aus. Die `ON`-Klausel verbindet die beiden Tabellen über die Techniker-IDs. Die Datenbank sucht für jede Maschine den passenden Techniker und kombiniert die Zeilen zu einem gemeinsamen Ergebnis:

```sql
SELECT
    maschinen.name AS maschine,
    techniker.name AS techniker,
    techniker.abteilung
FROM maschinen
INNER JOIN techniker ON maschinen.techniker_id = techniker.techniker_id;
```

```sql title="Output"
 maschine             |   techniker    | abteilung
----------------------|----------------|------------
 CNC-Fräse Alpha      | Thomas Müller  | Wartung
 Drehbank Beta        | Sandra Schmidt | Fertigung
 Schweißroboter Gamma | Thomas Müller  | Wartung
```

Wir erkennen nun, dass **Stanzmaschine Delta** und der Techniker **Klaus Weber** **fehlen!** Warum? Beide haben in der jeweils anderen Tabelle keinen passenden Datensatz gefunden. Da der `INNER JOIN` nur Zeilen zurückgibt, bei denen in beiden Tabellen ein passender Datensatz existiert, werden die beiden Einträge einfach ignoriert. Dies ist ein wichtiges Verhalten, das man verstehen muss: `INNER JOIN` ist restriktiv und zeigt nur vollständige Verknüpfungen.

???+ defi "Definition: `INNER JOIN`"
    `INNER JOIN` zeigt nur Datensätze, die in **beiden** Tabellen verknüpft sind. Datensätze ohne Übereinstimmung werden weggelassen.


---

### Exkurs: Aliasse

Bevor wir uns die weiteren JOIN-Typen ansehen, nehmen wir einen kleinen Exkurs und schauen uns an, wie wir Tabellennamen verkürzen können mit **Aliassen**.
Wir haben Aliasse bereits im Kapitel [Abfragen von Daten](abfragen.md#aggregatfunktionen-daten-zusammenfassen) kennengelernt.


Je komplexer unsere Abfragen werden, desto unübersichtlicher werden lange Tabellennamen wie `maschinen.name` und `techniker.name`. Hier kommen Aliasse ins Spiel. 
Bei JOINs schreiben wir oft lange Tabellennamen - **Aliasse** (Abkürzungen) machen das übersichtlicher und sind in der Praxis absolut üblich. 
Fast jede JOIN-Abfrage, die Sie in der Realität sehen werden, verwendet Aliasse:

```sql
SELECT
    m.name AS maschine,
    t.name AS techniker,
    t.abteilung,
    m.anschaffungsjahr
FROM maschinen AS m
INNER JOIN techniker AS t ON m.techniker_id = t.techniker_id;
```

oder noch kürzer (ohne `AS`):

```sql
SELECT
    m.name AS maschine,
    t.name AS techniker
FROM maschinen m
INNER JOIN techniker t ON m.techniker_id = t.techniker_id;
```

???+ tip "Best Practice"
    Verwende immer kurze, aussagekräftige Aliasse (z.B. `m`, `t`) bei JOINs – das macht die Abfrage viel lesbarer!


---

### LEFT JOIN

Was aber, wenn wir **alle** Maschinen sehen wollen, unabhängig davon, ob sie einen zuständigen Techniker haben oder nicht? Hier kommt der **LEFT JOIN** (auch **LEFT OUTER JOIN**) ins Spiel. Er gibt **alle Datensätze der linken Tabelle** zurück, auch wenn sie keine Übereinstimmung in der rechten Tabelle haben.

Der Unterschied zum INNER JOIN ist subtil aber wichtig: Beim LEFT JOIN ist die linke Tabelle (in unserem Fall `maschinen`) die "dominante" Tabelle - alle ihre Zeilen erscheinen im Ergebnis. Gibt es für eine Maschine keinen passenden Techniker, werden die Spalten aus der Techniker-Tabelle einfach mit `NULL` gefüllt.


```sql
SELECT
    m.name AS maschine,
    t.name AS techniker,
    t.abteilung
FROM maschinen m
LEFT JOIN techniker t ON m.techniker_id = t.techniker_id;
```


```sql title="Output"
 maschine             | techniker      | abteilung
----------------------|----------------|------------
 CNC-Fräse Alpha      | Thomas Müller  | Wartung
 Drehbank Beta        | Sandra Schmidt | Fertigung
 Schweißroboter Gamma | Thomas Müller  | Wartung
 Stanzmaschine Delta  | NULL           | NULL
```

Und nun sehen wir, dass **Stanzmaschine Delta dabei ist!** obwohl kein Techniker zuständig ist. An der Stelle, wo der Techniker und die Abteilung stehen sollte, steht `NULL`. Dies ist besonders nützlich, wenn wir beispielsweise alle Maschinen auflisten wollen, die noch keinen Techniker zugewiesen haben, oder wenn wir eine Übersicht aller Maschinen brauchen, unabhängig von ihrem Wartungsstatus.

`LEFT JOIN` wird in der Praxis auch oft verwendet, da es wichtig sein kann, auch "unvollständige" Datensätze zu sehen. Denken wir an Berichte oder Übersichten, wo wir nicht versehentlich Datensätze verschweigen wollen, nur weil eine Verknüpfung fehlt.

---

### RIGHT & FULL OUTER JOIN

Der **RIGHT JOIN** (auch **RIGHT OUTER JOIN**) ist das Spiegelbild des LEFT JOIN: Alle Datensätze der **rechten** Tabelle werden zurückgegeben. Anstatt dass die linke Tabelle dominant ist, ist nun die rechte Tabelle die führende - alle ihre Zeilen erscheinen im Ergebnis, auch wenn es keine Übereinstimmung in der linken Tabelle gibt.

In der Praxis wird `RIGHT JOIN` jedoch sehr selten verwendet, da man das gleiche Ergebnis durch Vertauschen der Tabellen und Verwendung eines `LEFT JOIN` erreichen kann. Die meisten Entwickler bevorzugen `LEFT JOIN`, weil es intuitiver ist: Man liest von links nach rechts und die "Haupttabelle" steht links. Aus diesem Grund werden Sie in professionellem Code kaum RIGHT JOINs finden - es ist einfach eine Konventionsfrage, und die Konvention hat sich klar für LEFT JOIN entschieden.

Der **FULL OUTER JOIN** vereint LEFT und RIGHT JOIN: Er gibt **alle** Datensätze aus **beiden** Tabellen zurück, unabhängig davon, ob eine Verknüpfung existiert oder nicht. Fehlende Werte werden mit `NULL` gefüllt. Dieser JOIN-Typ ist noch seltener als RIGHT JOIN und wird nur in sehr spezifischen Szenarien benötigt - beispielsweise wenn man alle Datensätze aus beiden Tabellen sehen möchte, um Inkonsistenzen oder fehlende Verknüpfungen zu identifizieren.

Für die allermeisten Anwendungsfälle reichen `INNER JOIN` und `LEFT JOIN` vollkommen aus. Diese beiden sollten wir gut beherrschen, während `RIGHT JOIN` und `FULL OUTER JOIN` eher Randerscheinungen sind, die wir kennen, aber selten verwenden werden.


---


## Verbinde mehrere Tabellen

Bisher haben wir in unseren Beispielen immer nur zwei Tabellen miteinander verknüpft. In der Realität sind Datenbanken jedoch oft komplexer strukturiert, und wir müssen Daten aus drei, vier oder sogar noch mehr Tabellen kombinieren. Die gute Nachricht: Man kann beliebig viele Tabellen in einer einzigen Abfrage joinen!

Dies ist besonders bei n:m-Beziehungen wichtig, wo eine Zwischentabelle (Junction Table) die Verbindung zwischen zwei Haupttabellen herstellt. Um alle relevanten Informationen zu erhalten, müssen wir dann alle drei Tabellen zusammenführen..

Erinnern wir uns an die n:m-Beziehung aus dem [Kapitel Datenmodellierung](modellierung.md). Wenn wir wissen wollen, welche Ersatzteile eine Maschine benötigt, müssen wir drei Tabellen miteinander verbinden:

```sql
-- Welche Maschinen benötigen welche Ersatzteile in welcher Menge?
SELECT
    m.name AS maschine,
    e.teilname,
    me.menge,
    e.preis
FROM maschinen m
INNER JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
ORDER BY m.name, e.teilname;
```

```sql title="Output"
 maschine             | teilname          | menge  | preis
----------------------|-------------------|--------|--------
 CNC-Fräse Alpha      | Kühlmittelpumpe   |     2  |  380.50
 CNC-Fräse Alpha      | Spindelmotor      |     1  | 1250.00
 Drehbank Beta        | Kühlmittelpumpe   |     1  |  380.50
 Drehbank Beta        | Spindelmotor      |     1  | 1250.00
 Schweißroboter Gamma | Kühlmittelpumpe   |     1  |  380.50
 Schweißroboter Gamma | Schweißdrahtsp.   |     5  |   45.90
```

Die Datenbank führt die JOINs sequenziell aus - erst wird das erste JOIN-Paar verarbeitet, dann das Ergebnis mit der nächsten Tabelle verknüpft:

1. `maschinen` mit `maschinen_ersatzteile` joinen (über `maschinen_id`)
2. Das Zwischenergebnis wird dann mit `ersatzteile` gejoint (über `teil_id`)

In diesem Beispiel nutzen wir ausschließlich `INNER JOINs`, weil wir nur die Maschinen sehen wollen, die tatsächlich Ersatzteile zugeordnet haben. Würden wir auch Maschinen ohne Ersatzteile sehen wollen, müssten wir `LEFT JOINs` verwenden.

---

Nun ist es wieder an der Zeit, das Gelernte zu üben! Die folgenden Aufgaben helfen uns, die verschiedenen JOIN-Typen zu verstehen und anzuwenden.

???+ info "Vorbereitung"

    Für die nachfolgenden Übungen verwenden wir die Tabellen aus dem [Kapitel Datenmodellierung](modellierung.md):

    - `maschinen` - Tabelle mit Maschineninformationen
    - `ersatzteile` - Tabelle mit Ersatzteilinformationen
    - `maschinen_ersatzteile` - Zuordnungstabelle für n:m-Beziehung

    Stelle sicher, dass diese Tabellen in deiner Datenbank vorhanden sind und Testdaten enthalten.

???+ question "Aufgabe 1: INNER JOIN"

    Zeige alle Ersatzteil-Zuordnungen mit Maschinennamen und Teilnamen.

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.name AS maschine,
            e.teilname,
            me.menge,
            e.preis
        FROM maschinen_ersatzteile me
        INNER JOIN maschinen m ON me.maschinen_id = m.maschinen_id
        INNER JOIN ersatzteile e ON me.teil_id = e.teil_id;
        ```

???+ question "Aufgabe 2: LEFT JOIN"

    Zeige alle Maschinen und ihre Ersatzteile. Auch Maschinen ohne Ersatzteile sollen angezeigt werden.

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.name AS maschine,
            e.teilname,
            me.menge
        FROM maschinen m
        LEFT JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
        LEFT JOIN ersatzteile e ON me.teil_id = e.teil_id;
        ```

???+ question "Aufgabe 3: Aggregation mit JOIN"

    Wie viele Maschinen benötigen jedes Ersatzteil?

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            e.teilname,
            COUNT(me.maschinen_id) AS anzahl_maschinen
        FROM ersatzteile e
        LEFT JOIN maschinen_ersatzteile me ON e.teil_id = me.teil_id
        GROUP BY e.teilname
        ORDER BY anzahl_maschinen DESC;
        ```

???+ question "Aufgabe 4: Durchschnittskosten pro Maschine"

    Berechne die durchschnittlichen Ersatzteilkosten für jede Maschine (gewichtet mit Menge).

    ??? tip "Lösung anzeigen"

        ```sql
        SELECT
            m.name AS maschine,
            AVG(e.preis * me.menge) AS durchschnitt_kosten,
            SUM(e.preis * me.menge) AS gesamt_kosten
        FROM maschinen m
        INNER JOIN maschinen_ersatzteile me ON m.maschinen_id = me.maschinen_id
        INNER JOIN ersatzteile e ON me.teil_id = e.teil_id
        GROUP BY m.name
        ORDER BY gesamt_kosten DESC;
        ```

---

## Zusammenfassung 📌

- **JOINs** kombinieren Daten aus mehreren Tabellen
- **INNER JOIN** zeigt nur verknüpfte Datensätze (Schnittmenge)
- **LEFT JOIN** zeigt alle aus der linken Tabelle + Matches rechts
- **RIGHT JOIN** zeigt alle aus der rechten Tabelle + Matches links
- **Aliasse** (z.B. `AS a`) machen JOINs übersichtlicher
- Man kann beliebig viele Tabellen joinen

---

Im nächsten Kapitel lernen wir **fortgeschrittene SQL-Techniken**: Unterabfragen, String-Funktionen und mehr! Mit den JOINs haben Sie nun das Fundament gelegt, um auch komplexe Datenbankstrukturen effizient abzufragen.

<div style="text-align: center;">
    <img src="https://www.blazesql.com/images/memes/can_i_join_you.webp" alt="Join" style="width:50%; margin-bottom: 1em;">
        <figcaption>Quelle: <a href="https://www.blazesql.com/images/memes/can_i_join_you.webp">blazesql</a></figcaption>
</div>