# Daten

<div style="text-align: center; position: relative; margin-bottom: 2rem;">
    <video id="db-video" autoplay muted loop playsinline style="width: 100%; border-radius: 12px;">
        <source src="../assets/header/daten/daten2.mp4" type="video/mp4">
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

## Willkommen im Modul `Daten`! 👋

In diesem Kurs lernst du die **Grundlagen von Daten** – von der Erfassung über die Verarbeitung bis zur Speicherung. Du verstehst, wie Daten entstehen, wie Computer sie verarbeiten und wie sie dauerhaft gespeichert werden.

</div>

---

## Kursübersicht

Der Kurs ist in vier aufeinander aufbauende Kapitel strukturiert:

<div class="grid cards" markdown>

- :material-book-open-page-variant: **Einführung**

    ---

    - Daten vs. Information vs. Wissen
    - Big Data vs. klassische Daten
    - Qualitative vs. quantitative Daten
    - Attribute und Skalenniveaus

- :material-target: **Datenerfassung**

    ---

    - Biologische vs. technische Datenerfassung
    - Messkette


- :material-laptop: **Datenverarbeitung**

    ---

    - Binärsystem und Bits
    - Zahlensysteme (Binär, Oktal, Hexadezimal)
    - Festkommaarithmetik
    - Negative Zahlen in Binärform


- :material-database: **Datenspeicherung**

    ---

    - Speichern von Bildern und Texten
    - Datentypen
    - Speichermedien (HDD, SSD, Cloud)

</div>

---

## Lernziele

Nach Abschluss dieses Moduls kannst du:

- [x] Den Unterschied zwischen Daten, Information und Wissen erklären
- [x] Verstehen, wie Daten erfasst und digitalisiert werden
- [x] Im Binär-, Oktal- und Hexadezimalsystem rechnen
- [x] Die wichtigsten Speichermedien und ihre Eigenschaften benennen
- [x] Den Lebenszyklus von Daten nachvollziehen

Bereit, in die Welt der Daten einzutauchen? Starte mit der [Einführung](einfuehrung.md) und arbeite dich durch die vier Kapitel!

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
