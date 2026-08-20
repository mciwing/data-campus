# Excel

<div style="text-align: center; position: relative; margin-bottom: 2rem;">
    <video id="db-video" autoplay muted loop playsinline style="width: 100%; border-radius: 12px;">
        <source src="../assets/header/excel/excel.mp4" type="video/mp4">
        Ihr Browser unterstützt das Video-Tag nicht.
    </video>
    <div style="position: absolute; bottom: 8px; left: 16px; color: white; font-size: 0.45rem; opacity: 0.7;">
        Video erstellt mit Nano Banana 3 Pro, Grok & ElevenLabs
    </div>
    <button id="mute-btn" style="position: absolute; bottom: 16px; right: 16px; background: rgba(0,0,0,0.6); border: none; color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 18px; backdrop-filter: blur(4px);">
        🔇
    </button>
</div>

<script>
    const video = document.getElementById('db-video');
    const muteBtn = document.getElementById('mute-btn');

    muteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });
</script>

<div class="welcome-section" markdown="1">

## Willkommen im Modul `Excel`! 👋

In diesem Kurs lernst du den **professionellen Umgang mit Microsoft Excel** - von den ersten Tastenkombinationen über Funktionen, Visualisierungen und Pivot-Tabellen bis hin zu Power Query, Power Pivot, Power BI und Makros. Du verstehst, wie du Daten effizient aufbereitest, auswertest und für andere zugänglich machst.

</div>

---

## Kursübersicht

Der Kurs ist in zwei Teile gegliedert: <span class="excel-tag excel-tag--basics">Grundwissen</span> und <span class="excel-tag excel-tag--advanced">Fortgeschritten</span>.

<div class="grid cards excel-overview" markdown>

- :material-book-open-page-variant: **Grundlagen**

    ---

    - Tastenbelegung & Shortcuts
    - Aufbau einer Arbeitsmappe
    - Benutzeroberfläche
    - Zellbezüge und erste Formeln

- :material-broom: **Datenaufbereitung**

    ---

    - Daten verknüpfen und kopieren
    - Arbeitsblätter verwalten
    - Zellen-Formatierung & Wildcards
    - Zahlenformate

- :material-function-variant: **Funktionen**

    ---

    - SUMME, ANZAHL, MITTELWERT, MIN/MAX, RANG
    - SVERWEIS, XVERWEIS, INDEX, VERGLEICH
    - WENN, SUMMEWENN, ZÄHLENWENN
    - WENNFEHLER und WENNNV

- :material-chart-bar: **Visualisierung**

    ---

    - Bedingte Formatierung
    - Eigene Regeln & Formeln
    - Datenüberprüfung & Dropdowns
    - Diagramme

- :material-check-decagram: **Finalisieren**

    ---

    - Design & Druckansichten
    - Kommentare und Notizen
    - Schutz von Blättern und Mappen
    - Übergabe an andere Office-Programme

- :material-table-pivot: **Tabellen & Pivot**

    ---

    - Definierte Tabellen
    - AutoFilter & strukturierte Bezüge
    - Pivot-Tabellen
    - Pivot-Charts

- :material-flash: **Power: Query, Pivot, BI**

    ---

    - ETL mit Power Query
    - Datenmodelle mit Power Pivot
    - Measures, KPIs & DAX
    - Dashboards mit Power BI

- :material-cog-play: **Makros**

    ---

    - Aufzeichnung von Arbeitsschritten
    - Makros bearbeiten und ausführen
    - Verknüpfung mit Buttons & Shapes
    - Einstieg in VBA

</div>

---

## Lernziele

Nach Abschluss dieses Moduls kannst du:

- [x] Excel mit Tastenkombinationen effizient bedienen
- [x] Daten aus mehreren Quellen zusammenführen und sauber aufbereiten
- [x] Mit den wichtigsten Funktionen arbeiten
- [x] Daten ansprechend visualisieren - mit Diagrammen und bedingter Formatierung
- [x] Pivot-Tabellen und Pivot-Charts aufbauen und auswerten
- [x] ETL-Prozesse mit Power Query realisieren
- [x] Datenmodelle mit Power Pivot und Dashboards mit Power BI erstellen
- [x] Wiederkehrende Arbeitsschritte mit Makros automatisieren

Bereit, in die Welt von Excel einzutauchen? Starte mit den [Grundlagen](grundlagen.md) und arbeite dich durch die Kapitel!

---

<div style="text-align: center">
    <h3>Los geht's! 🚀</h3>
</div>

---

!!! info "Ressourcen"

    Dieser Kurs basiert auf den Lehrunterlagen zu *Datenverarbeitung & Betriebsinformatik* (BA Wirtschaftsingenieurwesen, MCI) und greift zusätzlich auf folgende Quellen zurück:

    - Microsoft-Dokumentation zu Excel
    - Lehrunterlagen Montanuniversität Leoben (Pivot, Diagramme, Datenüberprüfung)
    - Udemy-Kursmaterialien (Power Query, Power Pivot)

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

/* Inline-Wörter in Akzentfarbe (voll gesättigt) */
.excel-tag {
  font-weight: 700;
}
.excel-tag--basics {
  color: #FFB482;
}
.excel-tag--advanced {
  color: #009485;
}

/* === Excel-Index: dezente Farbtönung pro Bereich === */
/* Karten 1-5 = Grundwissen (Peach, wie Daten-Box auf der Landingpage) */
.excel-overview > ul > li:nth-child(-n+5) {
  background: color-mix(in oklab, #FFB482 7%, transparent);
}

/* Karten 6-8 = Fortgeschritten (Teal, wie Datenbanken-Box) */
.excel-overview > ul > li:nth-child(n+6):nth-child(-n+8) {
  background: color-mix(in oklab, #009485 7%, transparent);
}
</style>
