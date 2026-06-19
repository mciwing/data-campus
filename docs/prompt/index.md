# Prompt Engineering

<div class="welcome-section" markdown="1">

## Willkommen im Modul `Prompt Engineering`! 👋

In diesem Kurs lernst du, **generative KI gezielt einzusetzen**. Anhand eines durchgängigen Praxisbeispiels – der **Entwicklung und Bewertung einer eigenen Geschäftsidee** – arbeitest du dich von den Grundlagen großer Sprachmodelle bis zu wiederverwendbaren Prompt-Bibliotheken vor. Jedes Kapitel schließt mit einem **Lab** ab, in dem du das Gelernte direkt anwendest.

</div>

---

## Kursübersicht

Der Kurs ist in aufeinander aufbauende Kapitel strukturiert:

<div class="grid cards" markdown>

- :material-robot-outline: **Einführung in Generative KI**

    ---

    - Funktionsweise von LLMs
    - Stärken und Grenzen
    - Halluzinationen & Kontextfenster
    - Prompt Engineering als Kompetenz

- :material-file-document-outline: **Anatomie eines guten Prompts**

    ---

    - Rolle, Kontext, Aufgabe
    - Einschränkungen
    - Ausgabeformat

- :material-cards-outline: **Zero-Shot & Few-Shot**

    ---

    - Unterschiede der Ansätze
    - Vor- und Nachteile
    - Wann welche Methode?

- :material-refresh: **Iteratives Prompt Engineering**

    ---

    - Prompts verbessern
    - Output analysieren
    - Verfeinerungsstrategien

- :material-code-json: **Strukturierte Ausgaben**

    ---

    - Tabellen, JSON, Markdown
    - Vorlagen

- :material-account-group-outline: **Rollenbasiertes Prompting**

    ---

    - Experte, Investor
    - Kunde, Konkurrent

- :material-link-variant: **Prompt Chaining**

    ---

    - Mehrstufige Prozesse
    - Workflow-Denken
    - Verkettung von Aufgaben

- :material-comment-question-outline: **Kritisches Prompting**

    ---

    - Gegenargumente erzeugen
    - Schwächen finden
    - Annahmen hinterfragen

- :material-image-multiple-outline: **Multimodales Prompting**

    ---

    - Bilder, PDFs, Diagramme
    - Präsentationen
    - Agenten

- :material-check-decagram-outline: **Evaluation von KI-Ergebnissen**

    ---

    - Qualitätskriterien
    - Bias & Halluzinationen
    - Verifikation

- :material-bookshelf: **Prompt Libraries**

    ---

    - Modularisierung
    - Templates
    - Skills

</div>

---

## Roter Faden: Deine Geschäftsidee 💡

Durch den gesamten Kurs begleitet dich **ein durchgängiges Projekt**: Du wählst eine Geschäftsidee, beschreibst sie, entwickelst ein Business Model Canvas, bewertest es aus verschiedenen Perspektiven und prüfst die Ergebnisse kritisch. So wird jede Prompting-Technik unmittelbar greifbar.

---

## Lernziele

Nach Abschluss dieses Moduls kannst du:

- [x] Erklären, wie LLMs funktionieren und wo ihre Grenzen liegen
- [x] Strukturierte, wirkungsvolle Prompts aufbauen
- [x] Zero-Shot-, Few-Shot- und rollenbasierte Ansätze gezielt einsetzen
- [x] Mehrstufige Workflows über Prompt Chaining gestalten
- [x] KI-Ergebnisse kritisch evaluieren und verifizieren
- [x] Eine wiederverwendbare Prompt-Bibliothek aufbauen

Bereit? Starte mit der [Einführung in Generative KI](einfuehrung.md)!

---

<div style="text-align: center">
    <h3>Los geht's! 🚀</h3>
</div>

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

@media (max-width: 768px) {
  .welcome-section {
    padding: 1.5rem;
  }
}
</style>
