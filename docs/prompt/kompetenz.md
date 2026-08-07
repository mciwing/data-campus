# Prompt Engineering als Kompetenz

Du weißt jetzt, **wie** ein LLM funktioniert, **was** es gut kann und wo seine **Grenzen** liegen, und warum es **halluziniert** und manchmal den Faden verliert. Bleibt eine letzte Frage: Wie bringt man dieses launische, geniale Werkzeug dazu, **genau das** zu tun, was man will?

Die Antwort ist eine eigene Fähigkeit – und das Thema des gesamten restlichen Kurses: **Prompt Engineering**.

!!! info "Grundlage dieses Kapitels"

    > Zuckarelli, J. (2025): *Programmieren mit ChatGPT.* Springer Nature, Kap. 6.1 „Prompt Engineering". [https://doi.org/10.1007/978-3-662-69433-6](https://doi.org/10.1007/978-3-662-69433-6)

    > Kessel, T. et al. (2025): *ChatGPT und Large Language Models? Frag doch einfach!* UVK Verlag (UTB).

---

## Was ist Prompt Engineering?

???+ defi "Prompt Engineering"

    **Prompt Engineering** ist das **geschickte Verfassen von Prompts** – also von Benutzeranfragen an KI-Tools –, optimiert auf die jeweilige **Fragestellung** und das verwendete **Tool**[^zuckarelli].

    Ein **„Prompt Engineer"** ist demnach jemand, der eine KI durch geschicktes Fragen dazu bringt, ihr **maximales Potenzial** auszuschöpfen.

Klingt simpel? Ist es im Kern auch. Und doch steckt der Teufel im Detail – sonst bräuchte es diesen Kurs nicht. 😉

---

## Der heißeste Job der Welt – oder nur Hype?

Eine Zeit lang galt „Prompt Engineer" als **Traumjob**: Schlagzeilen versprachen Gehälter von bis zu **335.000 US-Dollar** – und das ganz ohne Informatikstudium[^popli]. Unternehmen suchten händeringend nach Menschen, die der KI die besten Antworten entlocken.

Aber lohnt sich die Euphorie? Zuckarelli[^zuckarelli] betrachtet den Boom **skeptisch** – und liefert gleich zwei Gegenargumente:

<div class="grid cards" markdown>

- :material-account-multiple: **Angebot steigt**

    ---

    Das nötige Skillset ist überschaubar und **leicht reproduzierbar**. Sobald viele merken, dass man hier auch ohne technischen Hintergrund gut verdient, steigt das Angebot an „Prompt Engineers" – und die Gehälter sinken wieder.

- :material-robot-happy: **Tools werden besser**

    ---

    Die KIs verstehen zunehmend auch **schlampig formulierte** Anfragen. Je besser die Tools werden, desto weniger braucht es Profis, die perfekte Prompts basteln – die Zahl ausgeschriebener Jobs könnte zurückgehen.

</div>

???+ tip "Die ehrliche Einordnung"

    „Prompt Engineering" ist **keine Wunderwaffe** und kein Geheimwissen für Hochbezahlte. Aber – und das ist der Punkt – es gibt sehr wohl eine **Reihe von Tipps und Tricks**, deren man sich bewusst sein sollte, wenn man Prompts schreibt[^zuckarelli]. Genau die lernst du hier.

---

## Vom Geheimwissen zur Kulturtechnik

Vielleicht wird Prompt Engineering gar kein exklusiver Beruf, sondern etwas viel **Grundlegenderes**: eine **Kulturtechnik**, die praktisch jeder beherrscht – so wie heute Lesen und Schreiben[^zuckarelli]. Gut möglich, dass Kinder schon in der Schule lernen, effizient mit KI zu kommunizieren.[^kessel]

Ein Blick in die Geschichte macht nachdenklich:

!!! quote "Lektion aus der Geschichte"

    Der **babylonische Schreiber**, der Verträge in Keilschrift dokumentierte, und der **mittelalterliche Mönch**, der Bücher mühsam von Hand abschrieb – ihre Fähigkeiten waren am Arbeitsmarkt einst **hochbegehrt**. Heute differenziert man sich damit nicht mehr.[^zuckarelli]

    Die Moral: Eine Fähigkeit kann **gleichzeitig wertvoll und vergänglich** sein. Umso wichtiger ist es, das **Prinzip dahinter** zu verstehen – nicht nur Tricks auswendig zu lernen.

Ob exklusiver Beruf oder Alltagskompetenz – die gute Nachricht bleibt: Wer **klar mit KI kommunizieren** kann, ist klar im Vorteil. Und das ist eine Fähigkeit, die du lernen kannst.

---

## Warum es trotzdem echtes Können erfordert

Wenn LLMs schlichte Programme wären, gäbe es kein Prompt Engineering – man würde einfach den richtigen Befehl eintippen. Aber so funktioniert KI nicht:

???+ defi "Der Knackpunkt: Nicht-Determinismus"

    KI-Modelle sind **keine deterministischen Systeme**. Sie folgen Regeln **nicht strikt** und können auf denselben Prompt unterschiedlich reagieren. Deshalb ist es durchaus eine **Herausforderung**, bestimmte Nuancen und Feinheiten im Verhalten eines Modells gezielt zu erreichen[^zuckarelli].

Mit anderen Worten: Es gibt **kein** Patentrezept, das immer funktioniert. Genau das macht Prompt Engineering zu einer Fähigkeit, die man **übt** und **verfeinert**.

---

## Das richtige Mindset: Behandle die KI wie eine:n Junior 

Das vielleicht nützlichste mentale Modell aus Zuckarelli[^zuckarelli]:

!!! quote "Die Junior-Developer-Analogie"

    Stell dir vor, du delegierst eine Aufgabe an eine:n **Junior-Entwickler:in**, der/die heute bei dir anfängt und noch **keine Einarbeitung** hatte. Welche Informationen bräuchte diese Person, um deine Aufgabe erfolgreich zu erledigen?

    > *„Würde ein:e Junior-Entwickler:in die Anforderung verstehen und die Aufgabe mit den Informationen, die ich gegeben habe, bewältigen können?"*

Diese Frage ist Gold wert. Sie zwingt dich, **Kontext, Ziel und Format explizit** zu machen – statt anzunehmen, die KI „weiß schon, was ich meine". (Spoiler: Tut sie nicht.)

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^zuckarelli]: **Zuckarelli, J. (2025):** *Programmieren mit ChatGPT.* Springer Nature, Kap. 6.1 „Prompt Engineering". [https://doi.org/10.1007/978-3-662-69433-6](https://doi.org/10.1007/978-3-662-69433-6)
[^kessel]: **Kessel, T.; Brandt, A.; Offtermatt, J.; Augenstein, F.; Praeg, C. (2025):** *ChatGPT und Large Language Models? Frag doch einfach!* UVK Verlag (UTB). ISBN 978-3-8252-6276-1.
[^popli]: **Popli, N. (2023):** *The AI Job That Pays Up to \$335K—and You Don't Need a Computer Engineering Background.* Time. [https://time.com/6272103/ai-prompt-engineer-job/](https://time.com/6272103/ai-prompt-engineer-job/)
