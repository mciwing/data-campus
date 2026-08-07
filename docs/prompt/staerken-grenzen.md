# Stärken und Grenzen von LLMs

Im [vorherigen Kapitel](funktionsweise-llms.md) haben wir den Motor zerlegt und gesehen, *wie* ein LLM Texte erzeugt. Jetzt die entscheidende Frage für die Praxis: **Was kann dieses Werkzeug richtig gut – und wo sollte man ihm besser nicht blind vertrauen?**

Denn so beeindruckend ChatGPT & Co. wirken: Es sind **Werkzeuge**, keine Allwissenden. Und wie bei jedem Werkzeug gilt – wer Stärken *und* Schwächen kennt, wählt für jede Aufgabe das richtige. 🧰

!!! info "Grundlage dieses Kapitels"

    Dieses Kapitel wägt zwei Perspektiven gegeneinander ab – eine **praxisnahe** und eine **wissenschaftlich-kritische**:

    > Kessel, T.; Brandt, A.; Offtermatt, J.; Augenstein, F.; Praeg, C. (2025): *ChatGPT und Large Language Models? Frag doch einfach! Klare Antworten aus erster Hand.* UVK Verlag (UTB), Kapitel „Stärken und Schwächen von LLMs", S. 130–141.

    > Lappin, S. (2024): *Assessing the Strengths and Weaknesses of Large Language Models.* Journal of Logic, Language and Information 33, S. 9–20. [https://doi.org/10.1007/s10849-023-09409-x](https://doi.org/10.1007/s10849-023-09409-x)

---

## „Stochastischer Papagei" oder doch mehr? 🦜

Bevor wir Stärken und Schwächen auflisten, ein Streit, der die Fachwelt spaltet:

<div class="grid cards" markdown>

- :material-bird: **Die Skeptiker**

    ---

    LLMs seien nur **„stochastische Papageien"**[^bender] – sie würden lediglich Trainingsdaten nachplappern, ohne irgendetwas zu „verstehen".

- :material-brain: **Die Optimisten**

    ---

    LLMs zeigen **echte induktive Lern- und Schlussfähigkeiten**, erkennen hierarchische Strukturen und übertragen Wissen auf neue Aufgaben[^lappin].

</div>

Lappin[^lappin] kommt zu einem **abgewogenen** Urteil: LLMs sind **deutlich mehr** als Papageien – sie erbringen bei vielen Aufgaben menschliche oder übermenschliche Leistung und übertreffen die regelbasierte KI früherer Jahrzehnte bei Weitem. **Aber** sie haben reale, ernste Grenzen. Genau diese Balance schauen wir uns jetzt an.

---

## ✅ Die Stärken

### Sprachgewandtheit & ein riesiges Wissensspektrum

Was beim ersten Kontakt am meisten beeindruckt: die **Eloquenz** der Antworten und die **enorme thematische Bandbreite** – von der mittelalterlichen Geschichte Europas bis zu aktuellen Trends in der Informatik[^kessel].

!!! quote "Achtung, Trugschluss!"

    Für uns Menschen korreliert sprachliche Ausdrucksfähigkeit mit Intelligenz – wer eloquent spricht, *wirkt* klug. Genau deshalb **täuschen** flüssige LLM-Antworten leicht ein tieferes Verständnis vor, das so gar nicht existiert. Merke dir das gut – es erklärt später die Halluzinationen. 😉

### Die Königsdisziplin: Textarbeit 📝

Hier liegt die **natürliche Stärke** von LLMs. Die häufigsten (und zuverlässigsten) Aufgaben[^kessel]:

<div class="grid cards" markdown>

- :material-text-box-outline: **Zusammenfassen**

    ---

    Lange Texte, Meeting-Protokolle oder wissenschaftliche Artikel auf das Wesentliche eindampfen.

- :material-rename-outline: **Paraphrasieren**

    ---

    Texte umformulieren – etwas, das Menschen erstaunlich schwerfällt, weil man sich von der alten Wortwahl lösen muss.

- :material-database-search-outline: **Wissen extrahieren**

    ---

    Gezielt Informationen herausziehen – in natürlicher Sprache statt per SQL-Abfrage.

- :material-comment-question-outline: **Fragen beantworten**

    ---

    Antworten auf Basis eines gelernten oder mitgelieferten Textes generieren.

</div>

### Mehr als nur Text: erstaunliche Spezialleistungen

Lappin[^lappin] betont, dass Transformer weit über klassisches NLP hinaus glänzen:

- **Medizinische Bildanalyse** und Diagnostik
- **Strukturvorhersage von Proteinen** (eine Revolution für die Computational Biology)
- **Multimodales Schlussfolgern** – das Modell kann sogar erklären, *warum* ein Bild witzig ist

???+ example "Beispiel: KI erklärt einen Witz 🤓"

    In einem berühmten Beispiel zeigt man GPT-4 das Foto eines Smartphones, in dessen Ladebuchse ein riesiger, veralteter **VGA-Stecker** steckt – verpackt als „Lightning Cable". Das Modell beschreibt nicht nur Panel für Panel, was zu sehen ist, sondern erkennt **die Pointe**: die Absurdität, einen klobigen Monitorstecker als modernes Handykabel auszugeben[^lappin].

    Einen Witz zu *verstehen* galt lange als zutiefst menschlich. 🃏

### Mehrsprachigkeit & einfache Bedienung

- **Übersetzung & Mehrsprachigkeit:** Für weit verbreitete Sprachen (Englisch, Spanisch, Chinesisch …) funktioniert das Übersetzen hervorragend, da viel Trainingsmaterial existiert[^kessel].
- **Niedrige Einstiegshürde:** Man tippt einfach in natürlicher Sprache – keine Programmierkenntnisse, kein kompliziertes Setup. Diese **schnelle, natürliche Interaktion** ist ein echter Produktivitätsbooster.

???+ adv "Stärken auf einen Blick"

    - Eloquente, flüssige Formulierungen
    - Riesige thematische Bandbreite
    - Stark bei Zusammenfassen, Paraphrasieren, Extrahieren, Q&A
    - Mehrsprachigkeit & Übersetzung
    - Sehr einfache Bedienung (natürliche Sprache)
    - Übertrifft regelbasierte KI bei Weitem; multimodales Schlussfolgern

---

## ⚠️ Die Grenzen

### Rechnen & Logik – der wunde Punkt 🧮

Einfache Formeln? Kein Problem. Aber **komplexere Berechnungen** (Integrale, Matrizen) oder **mehrstufige logische Schlussfolgerungen** sind eine echte Herausforderung – schließlich basiert das Modell auf **Mustern**, nicht auf echtem Rechnen oder formaler Logik[^kessel].

!!! tip "Praxis-Tipp"

    Für Mathe und Logik koppelt man LLMs heute mit **spezialisierten Werkzeugen** (Taschenrechner, Code-Ausführung, Beweissysteme). Das LLM formuliert die Aufgabe – das Werkzeug rechnet. 👉 Mehr dazu im Kapitel [Prompt Chaining](chaining.md).

### Kein echtes Verständnis

So eloquent die Texte auch klingen – das Modell verarbeitet Anweisungen **rein statistisch** und **völlig unabhängig von deren Inhalt**. Es kann die Konsequenzen oder Schlussfolgerungen aus einer Aussage weder *bewerten* noch *einordnen*[^kessel].

### Halluzinationen – wenn die KI überzeugend lügt 🤥

LLMs sind berüchtigt dafür, **plausibel klingende, aber frei erfundene** Inhalte zu produzieren. Und das nicht zaghaft, sondern mit voller Überzeugung.

???+ example "Wahre Geschichte: Der Anwalt und die erfundenen Urteile ⚖️"

    Ein New Yorker Anwalt nutzte ChatGPT für die Recherche zu einer Klage gegen die Fluglinie **Avianca**. ChatGPT lieferte prompt **sechs passende Präzedenzfälle** – juristisch perfekt formuliert.

    Kleines Problem: **Keiner davon existierte.** Alle sechs waren frei erfunden. Der Anwalt fragte sogar nach: *„Sind diese Fälle echt?"* – ChatGPT antwortete treuherzig: *„Ja."* 🙈

    Vor Gericht flog der Schwindel auf. (Lappin, 2024; Fall *Mata v. Avianca*, 2023)

    **Moral:** Ein LLM unterscheidet nicht zuverlässig zwischen *Fakt* und *Fiktion*. Es erzeugt, was *plausibel klingt* – nicht, was *stimmt*.

!!! danger "Wichtig"

    Halluzinationen machen LLMs zu **gefährlichen Quellen für (Fehl-)Informationen**. Jede faktische Aussage gehört **verifiziert** – siehe Kapitel [Evaluation von KI-Ergebnissen](evaluation.md).

### Blackbox – die fehlende Nachvollziehbarkeit

Warum kommt ein Modell zu *genau dieser* Antwort? Aufgrund der Komplexität der neuronalen Netze ist das **kaum nachvollziehbar**[^kessel]. Lappin[^lappin] nennt das die **Opazität** von LLMs: Sie sind nicht-kompositional und schwer erklärbar – ein ernstes Problem überall dort, wo Entscheidungen begründet werden müssen (Finanz, Medizin, Recht).

### Datenhunger & Machtkonzentration

Ein eher unsichtbares, aber gewichtiges Problem[^lappin]:

- LLMs brauchen **um Größenordnungen mehr Daten** als ein Mensch, um Sprache zu lernen.
- Die nötige **Rechenleistung, Infrastruktur und Finanzkraft** haben nur wenige große Tech-Konzerne – das **konzentriert** Entwicklung und Forschung auf eine Handvoll Akteure.

### Geschlossene Systeme & Text-Fokus

- Viele kommerzielle LLMs sind **„Black Boxes"** im wörtlichen Sinn: Code und Architektur sind nicht offengelegt – heikel, wenn sie in geschäftskritische Systeme eingebunden werden[^kessel].
- Die meisten LLMs konzentrieren sich (noch) stark auf **reinen Text**; Sprache, Bild und Video werden zwar zunehmend integriert, sind aber rechen- und ressourcenintensiver.

???+ disadv "Grenzen auf einen Blick"

    - Schwach bei komplexem Rechnen & formaler Logik
    - Kein echtes inhaltliches Verständnis (rein statistisch)
    - **Halluzinationen**: erfindet überzeugend Fakten
    - Blackbox: Antworten kaum nachvollziehbar/erklärbar
    - Enormer Datenhunger → Machtkonzentration bei Big Tech
    - Oft geschlossene Systeme; Fokus auf Text

---

## Stärken vs. Grenzen – die Gegenüberstellung

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Dimension</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">✅ Stärke</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">⚠️ Grenze</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Sprache</td>
        <td style="padding:10px 14px;">Eloquent, mehrsprachig, flüssig</td>
        <td style="padding:10px 14px;">Eloquenz ≠ Verständnis</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Textarbeit</td>
        <td style="padding:10px 14px;">Zusammenfassen, Paraphrasieren, Extrahieren</td>
        <td style="padding:10px 14px;">Faktentreue nicht garantiert</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Wissen</td>
        <td style="padding:10px 14px;">Riesige Bandbreite</td>
        <td style="padding:10px 14px;">Lücken & Halluzinationen</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Rechnen / Logik</td>
        <td style="padding:10px 14px;">Einfache Formeln ok</td>
        <td style="padding:10px 14px;">Schwach bei komplexer Mathe & Logik</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Transparenz</td>
        <td style="padding:10px 14px;">Schnelle, direkte Antworten</td>
        <td style="padding:10px 14px;">Blackbox, kaum erklärbar</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Kreativität</td>
        <td style="padding:10px 14px;">Kombiniert Bekanntes geschickt</td>
        <td style="padding:10px 14px;">Eher Wiedergabe als echte Innovation</td>
    </tr>
    </tbody>
</table>
</div>

!!! quote "Kreativität oder nur Wiedergabe?"

    LLMs lernen aus bestehenden Texten – und geben deshalb vor allem **Bekanntes** wieder, geschickt neu kombiniert. Für *echte* Innovation und neue Ideen braucht es (noch) den **Menschen**. Das LLM ist ein mächtiger Assistent, nicht der Erfinder[^kessel].

---

## Was heißt das für Prompt Engineering? 🎯

Genau **weil** LLMs diese Stärken und Schwächen haben, ist gutes Prompting so wertvoll:

- Spiele die **Stärken** aus → nutze sie für Textarbeit, Umformulierung, Brainstorming.
- Umgehe die **Schwächen** → gib **Kontext** mit (gegen Halluzinationen), **verifiziere** Fakten, und **zerlege** komplexe Aufgaben in Schritte (gegen Logik-/Rechenschwäche).

> Ein Werkzeug ist nur so gut wie die Hand, die es führt. Prompt Engineering ist diese Hand.

???+ question "Selbsttest: Werkzeug richtig eingeschätzt?"

    1. Warum *wirkt* ein LLM oft klüger, als es tatsächlich „versteht"?
    2. Nenne die **Königsdisziplin** von LLMs und zwei typische Aufgaben daraus.
    3. Was war das Problem im Fall *Mata v. Avianca* – und wie heißt das Phänomen?
    4. Warum ist die **Blackbox-Eigenschaft** gerade in Finanz, Medizin und Recht heikel?

    ??? success "Lösungsskizze"

        1. Weil **sprachliche Eloquenz** bei uns mit Intelligenz korreliert – flüssige Antworten täuschen Verständnis vor, das statistisch erzeugt ist.
        2. **Textarbeit** – z. B. Zusammenfassen und Paraphrasieren (auch: Wissensextraktion, Q&A).
        3. ChatGPT erfand sechs **nicht existierende** Gerichtsurteile und bestätigte sie sogar als echt → **Halluzination**.
        4. Weil Entscheidungen dort **begründet und nachvollziehbar** sein müssen – eine nicht erklärbare Blackbox erfüllt das nicht.

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^kessel]: **Kessel, T.; Brandt, A.; Offtermatt, J.; Augenstein, F.; Praeg, C. (2025):** *ChatGPT und Large Language Models? Frag doch einfach! Klare Antworten aus erster Hand.* UVK Verlag (UTB), Kapitel „Stärken und Schwächen von LLMs", S. 130–141. ISBN 978-3-8252-6276-1.
[^lappin]: **Lappin, S. (2024):** *Assessing the Strengths and Weaknesses of Large Language Models.* Journal of Logic, Language and Information 33, S. 9–20. [https://doi.org/10.1007/s10849-023-09409-x](https://doi.org/10.1007/s10849-023-09409-x) (CC BY 4.0)
[^bender]: **Bender, E. M.; Gebru, T.; McMillan-Major, A.; Shmitchell, S. (2021):** *On the Dangers of Stochastic Parrots.* FAccT '21, S. 610–623.
