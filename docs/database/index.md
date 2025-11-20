# Datenbanken

<div style="text-align: center">
    <img src="../assets/header/header_database2.png" style="width: 100%; border-radius: 12px; margin-bottom: 2rem;">
</div>

<div class="welcome-section" markdown="1">

## Willkommen im Modul `Datenbanken`! 👋

In diesem Kurs lernst du die **Grundlagen relationaler Datenbanken** mit PostgreSQL. Du verstehst, wie Datenbanken funktionieren, wie du Daten strukturierst, abfragst und manipulierst, und wie du professionelle Datenbankprojekte umsetzt.

</div>

---

## Kursübersicht

Der Kurs ist in mehrere aufeinander aufbauende Kapitel strukturiert:

<div class="grid cards" markdown>

- :material-book-open-page-variant: **Einführung**

    ---

    - Was sind Datenbanken?
    - Relationale Datenbanken
    - PostgreSQL Setup
    - Erste Schritte

- :material-table: **Relationale Datenbanken**

    ---

    - Tabellen und Attribute
    - Primär- und Fremdschlüssel
    - Beziehungen zwischen Tabellen
    - Integritätsbedingungen

- :material-database-search: **Abfragen von Daten**

    ---

    - SELECT-Statement
    - WHERE, ORDER BY, LIMIT
    - Aggregatfunktionen
    - GROUP BY und HAVING

- :material-database-edit: **Daten Manipulieren**

    ---

    - INSERT: Daten einfügen
    - UPDATE: Daten ändern
    - DELETE: Daten löschen
    - Best Practices

- :material-draw: **Datenmodellierung**

    ---

    - Entity-Relationship-Modell
    - Normalisierung
    - 1:1, 1:n, n:m Beziehungen
    - Von ER zu SQL

- :material-link-variant: **Daten Zusammenführen**

    ---

    - INNER JOIN
    - LEFT, RIGHT, FULL JOIN
    - CROSS JOIN
    - Self-Joins

- :material-rocket-launch: **Fortgeschrittene Techniken**

    ---

    - Subqueries
    - WITH (CTEs)
    - CASE WHEN
    - Fortgeschrittene Aggregationen

- :material-shield-check: **Datenintegrität**

    ---

    - NOT NULL, UNIQUE
    - CHECK Constraints
    - DEFAULT Werte
    - Constraints verwalten

- :material-swap-horizontal: **Transaktionen**

    ---

    - BEGIN, COMMIT, ROLLBACK
    - ACID-Prinzipien
    - Fehlerbehandlung
    - Transaktionssicherheit

- :material-telescope: **Ausblick**

    ---

    - Views 
    - Stored Procedures
    - Trigger und JSON-Support
    - Backup & Recovery

</div>

---

## Lernziele

Nach Abschluss dieses Moduls kannst du:

- [x] Datenbanken entwerfen und modellieren
- [x] Tabellen mit Beziehungen erstellen
- [x] Komplexe SQL-Abfragen schreiben
- [x] Daten sicher manipulieren
- [x] Datenintegrität mit Constraints sicherstellen
- [x] Transaktionen für sichere Operationen nutzen
- [x] Professionelle Datenbankprojekte umsetzen

Bereit, in die Welt der Datenbanken einzutauchen? Starte mit der [Einführung](einfuehrung.md) und arbeite dich durch die Kapitel!

---

<div style="text-align: center">
    <h3>Los geht's! 🚀</h3>
</div>

---

!!! info "Ressourcen"

    Dieser Kurs basiert auf folgenden Quellen:

    - [Datenbanken - Andreas de Vries; FH Südwestfalen](https://www.fh-swf.de/media/neu_np/fb_tbw_1/dozentinnen_2/professorinnen_5/devries_1/Datenbanken.pdf)
    - [Datenbanken 1 - Nikolaus Augsten; Universität Salzburg](https://dbresearch.uni-salzburg.at/teaching/)

    Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

<style>
/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg,
    color-mix(in oklab, var(--md-primary-fg-color) 8%, transparent),
    color-mix(in oklab, var(--md-accent-fg-color) 8%, transparent)
  );
  border: 1px solid color-mix(in oklab, var(--md-default-fg-color) 10%, transparent);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.welcome-section h2 {
  text-align: center;
  margin-top: 0;
}

.course-blocks {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
  font-size: 0.75rem;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-section {
    padding: 1.5rem;
  }
}
</style>
