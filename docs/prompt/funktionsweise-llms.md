# Funktionsweise von LLMs

Die meisten, die ChatGPT zum ersten Mal benutzen, sind **beeindruckt**. Da sitzt scheinbar jemand am anderen Ende, der mühelos auf fast jede Frage antwortet – in fließendem Deutsch, Englisch oder Klingonisch, mal als Shakespeare, mal als SQL-Profi. Doch hinter dem freundlichen Chatfenster steckt kein kleiner Mensch, sondern **viel Mathematik, noch mehr Daten und ein bisschen Magie** (die wir gleich entzaubern).

Bevor wir lernen, wie man diese Werkzeuge mit guten **Prompts** zur Höchstform bringt, sollten wir verstehen, **was unter der Haube passiert**. Denn wer weiß, wie ein Motor funktioniert, fährt am Ende auch besser.

!!! info "Grundlage dieses Kapitels"

    Dieses Kapitel orientiert sich inhaltlich an **Kapitel 3** des Buchs:

    > Zuckarelli, J. (2025): *Programmieren mit ChatGPT*. Kapitel 3 – „Funktionsweise des (Chat)GPT-Modells und anderer Large Language Models (LLMs)". Springer Nature. [https://doi.org/10.1007/978-3-662-69433-6_3](https://doi.org/10.1007/978-3-662-69433-6_3)

    Wir betrachten die Technik aus der **Vogelperspektive** – ohne Vorkenntnisse in linearer Algebra. Wer tiefer einsteigen will, findet die mathematischen Details in der Originalquelle.

---

## Drei Fähigkeiten, die beeindrucken

Wenn man ChatGPT & Co. genauer betrachtet, machen vor allem **drei Fähigkeiten** den beeindruckenden Eindruck aus[^zuckarelli]:

1. natürliche Sprache **zu produzieren** – und das in vielen verschiedenen Sprachen,
2. den Input des Nutzers sprachlich und inhaltlich **zu verstehen**,
3. scheinbar **kreativ** tätig zu werden und Dinge zu erschaffen, die es so vorher nicht gab.

Während Maschinen Sprache schon länger übersetzen können (Google Translate, DeepL), ist besonders das *Verstehen* und das *kreative Erzeugen* neu. Schauen wir uns an, wie das gelingt.

## Das Zauberwort: Transformer

Das Herzstück moderner Sprachmodelle heißt **Transformer**. Und nein – damit ist **nicht** das Auto gemeint, das sich in einen Roboter verwandelt. Gemeint ist eine Architektur, die einen Input (Text, mittlerweile auch Bilder oder Audio) in einen Output **transformiert**.

<div style="text-align: center;">
    <img src="https://preview.redd.it/transformers-v0-as7u39shhiig1.png?auto=webp&s=e209b3f9f93c7272efb4047b3eb160f64b13ec3d"
         alt="Meme: Zwei Personen sagen „I love Transformers“ – die eine denkt an den Roboter Optimus Prime, die andere an die Transformer-Architektur mit Query-, Key- und Value-Matrizen."
         style="max-width: 330px; margin-bottom: 1em;">
    <figcaption>Dasselbe Wort, zwei sehr verschiedene Vorstellungen. (Quelle: <a href="https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Ftransformers-v0-as7u39shhiig1.png%3Fauto%3Dwebp%26s%3De209b3f9f93c7272efb4047b3eb160f64b13ec3d" target="_blank" rel="noopener">Reddit</a>)</figcaption>
</div>

Populär wurde der Transformer durch ein Paper mit dem wohl coolsten Titel der KI-Geschichte: **„Attention Is All You Need"**[^vaswani]. Acht Google-Forscher legten damit den Grundstein für so ziemlich jeden Chatbot, den du heute kennst.

Grob besteht ein Transformer aus zwei Teilen:

```mermaid

flowchart LR
    A[Input<br/>z. B. dein Prompt]:::peach --> B(Encoder<br/> versteht den Input):::teal
    B --> C(Decoder<br/>erzeugt den Output):::teal
    C --> D[Output<br/>z. B. die Antwort]:::peach

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;

```

- Der **Encoder** analysiert den Input und versteht ihn im Kontext.
- Der **Decoder** erzeugt daraus Wort für Wort den Output.

Wie kommt das Modell aber von „deinem Prompt" zu „dem Verständnis"? Dafür durchläuft der Text mehrere Stationen. Gehen wir sie der Reihe nach durch.

---

### 1) Tokenization

Ein Computer kann mit Buchstaben nichts anfangen. Deshalb wird dein Text zuerst in kleine Bausteine zerlegt, sogenannte **Tokens**. Ein Token kann ein ganzes Wort sein – oft aber auch nur ein **Wortteil**.

???+ defi "Token & Vocabulary"

    Ein **Token** ist die kleinste Verarbeitungseinheit eines LLM. Jedes Token besitzt eine eindeutige ID im **Vocabulary** (dem „Wortschatz" des Modells).

    Faustregel: Im Englischen entspricht **1 Token ≈ 4 Zeichen ≈ ¾ Wort**. „Tokens" und „Wörter" sind also **nicht** dasselbe – auch wenn wir der Einfachheit halber manchmal von „Wörtern" sprechen.

Ein Beispiel mit dem Tokenizer, den OpenAI nutzt (Python-Bibliothek `tiktoken`):

```python title="Python"
import tiktoken as tt

# "cl100k_base" ist das Tokenizer-Modell, das ChatGPT-4 verwendet
enc = tt.get_encoding("cl100k_base")

encoded = enc.encode('He said: "Let me explain tokenization to you. It is comparably easy."')

print(encoded)
```

```{.text .no-copy title="Ausgabe"}
[1548, 1071, 25, 330, 10267, 757, 10552, 4037, 2065, 311, 499, 13, 1102, 374, 7809, 2915, 4228, 1210]
```


Der Satz oben hat **69 Zeichen**, wird aber zu **18 Tokens** zerlegt. Wörter wie `tokenization` zerfallen dabei in mehrere Häppchen (`token` + `ization`).

???+ tip "Warum das für Prompt Engineering wichtig ist"

    LLMs rechnen **pro Token** ab und haben ein **Token-Limit** (das Kontextfenster). Wer das versteht, formuliert effizienter:

    - Lange, umständliche Prompts kosten mehr Tokens – und damit Geld und Platz im Kontextfenster.
    - Seltene Begriffe, Tippfehler und Sonderzeichen erzeugen oft **überraschend viele** Tokens.

    Du kannst auf [platform.openai.com/tokenizer](https://platform.openai.com/tokenizer) live ausprobieren, wie dein Text zerlegt wird.

---

### 2) Word Embeddings

Tokens sind erstmal nur IDs – nackte Zahlen ohne Bedeutung. Damit das Modell mit *Bedeutung* arbeiten kann, wird jedes Token in einen **Vektor** aus vielen Zahlen übersetzt: das **Embedding**.

Man kann sich jedes Element des Vektors als einen **Aspekt** des Wortes vorstellen. Je höher der Wert, desto stärker ist dieser Aspekt ausgeprägt:

<div style="text-align:center; max-width:640px; margin:16px auto;">
<table role="table"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Wort</th>
        <th style="text-align:center; padding:12px 14px; font-weight:700;">🖥️ Technik</th>
        <th style="text-align:center; padding:12px 14px; font-weight:700;">👑 Macht</th>
        <th style="text-align:center; padding:12px 14px; font-weight:700;">🌿 Natur</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Programmierer</td>
        <td style="padding:10px 14px; text-align:center;">0.9</td>
        <td style="padding:10px 14px; text-align:center;">0.1</td>
        <td style="padding:10px 14px; text-align:center;">0.0</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Entwickler</td>
        <td style="padding:10px 14px; text-align:center;">0.88</td>
        <td style="padding:10px 14px; text-align:center;">0.12</td>
        <td style="padding:10px 14px; text-align:center;">0.0</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px; font-weight:600;">Wald</td>
        <td style="padding:10px 14px; text-align:center;">0.0</td>
        <td style="padding:10px 14px; text-align:center;">0.05</td>
        <td style="padding:10px 14px; text-align:center;">0.95</td>
    </tr>
    </tbody>
</table>
<figcaption>Stark vereinfachtes Beispiel. Echte Embeddings haben hunderte bis tausende Dimensionen – und sind <em>nicht</em> menschlich interpretierbar.</figcaption>
</div>

„Programmierer" und „Entwickler" haben **ähnliche** Vektoren – kein Wunder, sie bedeuten fast dasselbe. „Wald" zeigt in eine ganz andere Richtung.

Das Faszinierende: Mit Embeddings kann man sogar **rechnen**. Das berühmteste Beispiel:



???+ example "Embedding-Mathematik zum Schmunzeln"

    $$\text{Vektor}(\text{König}) - \text{Vektor}(\text{Mann}) + \text{Vektor}(\text{Frau}) \approx \text{Vektor}(\text{Königin})$$

    Wenn du dem Modell „König" gibst, die „Männlichkeit" abziehst und „Weiblichkeit" addierst, landest du ungefähr bei „Königin". Sprache wird hier buchstäblich zur Vektor-Geometrie. 🤯

    Solche „Bedeutungsvektoren" wurden u. a. durch das Modell **Word2Vec**[^mikolov] bekannt.

    ```python title="Python"
    import gensim.downloader as api

    # Wir laden fertige Wortvektoren – **GloVe**, trainiert auf englischen Wikipedia-Texten
    modell = api.load("glove-wiki-gigaword-50") 

    # König - Mann + Frau = ?
    ergebnis = modell.most_similar(positive=["king", "woman"], negative=["man"], topn=3)

    for wort, aehnlichkeit in ergebnis:
        print(f"{wort:<12} {aehnlichkeit:.3f}")
    ```

    ```{.text .no-copy title="Ausgabe"}
    queen        0.852
    throne       0.766
    prince       0.759
    ```

    **`queen` steht an erster Stelle** – herausgerechnet aus purer Vektor-Arithmetik, ohne dass dem Modell jemals jemand erklärt hätte, was ein König ist.

    Das geladene Modell wurde auf **englischen** Wikipedia-Texten trainiert und kennt nur englische Wörter. Für deutsche Wörter bräuchtest du ein deutsches Modell – die sind allerdings deutlich größer (mehrere GB).


---

### 3) Positional Encoding

Bedeutung allein reicht nicht. Vergleiche:

> „Hans fütterte das Eichhörnchen." 🧑➡️🐿️

> „Das Eichhörnchen fütterte Hans." 🐿️➡️🧑

Gleiche Wörter, **völlig andere Bedeutung** – nur die Reihenfolge ist anders (und in einem Fall ist Hans in Schwierigkeiten). Anders als ältere Ansätze (RNNs) verarbeitet der Transformer **alle Wörter gleichzeitig**. Das ist schnell, hat aber einen Haken: Ohne Zusatzinfo wüsste das Modell gar nicht mehr, **welches Wort wo stand**.

Die Lösung heißt **Positional Encoding**: Die Position eines Wortes wird über (Sinus-/Kosinus-)Werte direkt in seinen Embedding-Vektor **hineingerechnet**. So tragen die Vektoren ab jetzt zwei Informationen: *Was* bedeutet das Wort **und** *wo* steht es im Satz.

```mermaid
flowchart LR
    E[Embedding<br/>Bedeutung]:::teal --> P((+)):::peach
    POS[Positional Encoding<br/>Position im Satz]:::teal --> P
    P --> R[Vektor mit<br/>Bedeutung + Position]:::peach

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;
```

??? info "Für alle NERDS"

    Für alle, die es gerne etwas genauer wissen wollen gibt es hier eine kleine Demonstration.
    Anders als die Wortvektoren muss hier **nichts** heruntergeladen werden – Positional Encoding ist eine reine Formel. Diese hier, aus dem „Attention Is All You Need"-Paper[^vaswani]:

    ???+ defi "Die drei Symbole in der Formel"

        $$PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d}}\right) \qquad PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d}}\right)$$

        | Symbol | Bedeutung |
        |---|---|
        | $pos$ | **Position** des Wortes im Satz: 0, 1, 2, 3 … |
        | $d$ | **Länge des Vektors** – wie viele Zahlen ein Token beschreiben. Im Paper heißt sie `d_model`, im Code unten genauso. |
        | $i$ | **Stelle innerhalb** des Vektors: 0, 1, 2 … bis $d$ |

        **Warum $d$ entscheidend ist:** Der Positionsvektor wird auf das Wort-Embedding **addiert** (siehe Diagramm oben). Beide müssen deshalb **exakt gleich lang** sein. Ein 8-stelliger Positionsvektor passt nur zu einem 8-stelligen Wortvektor.

        Typische Werte für $d$:

        - **8** und **64** in unseren Beispielen unten – klein genug zum Anschauen
        - **50** beim GloVe-Modell aus dem vorigen Abschnitt (`glove-wiki-gigaword-50`)
        - **512** im ursprünglichen Transformer-Paper[^vaswani] (Basismodell; die größere Variante nutzt 1.024)
        - **12.288** bei GPT-3[^brown]

        **Und wozu $i$?** Es steuert, wie schnell die Sinuskurve schwingt: vorne im Vektor schnell, nach hinten immer langsamer. Genau deshalb stehen in der Ausgabe gleich unten hinten fast überall `0.` und `1.` – dort hat sich die Kurve bei so kleinen Positionen noch kaum bewegt.

    In Python sind das fünf Zeilen:

    ```python
    import numpy as np

    def positional_encoding(position, d_model):
        """Sinus-/Kosinus-Positionscodierung nach Vaswani et al. (2017)."""
        i = np.arange(d_model) // 2 * 2          # 0,0,2,2,4,4,...
        winkel = position / np.power(10000, i / d_model)
        return np.where(np.arange(d_model) % 2 == 0, np.sin(winkel), np.cos(winkel))

    np.set_printoptions(precision=2, suppress=True)

    for pos in range(4):
        print(f"Position {pos}: {positional_encoding(pos, d_model=8)}")
    ```

    ```title="Ausgabe"
    Position 0: [0. 1. 0. 1. 0. 1. 0. 1.]
    Position 1: [0.84 0.54 0.1  1.   0.01 1.   0.   1.  ]
    Position 2: [ 0.91 -0.42  0.2   0.98  0.02  1.    0.    1.  ]
    Position 3: [ 0.14 -0.99  0.3   0.96  0.03  1.    0.    1.  ]
    ```

    Jede Position bekommt einen **eigenen Zahlen-Fingerabdruck**. Position 0 ist dabei besonders einfach zu lesen: `sin(0) = 0` und `cos(0) = 1`, daher das Muster `0, 1, 0, 1, …`

    ???+ example "Der eigentliche Punkt: dasselbe Wort, zwei Positionen"

        Jetzt der Hans-Test. Wir nehmen **einen** Wortvektor und addieren einmal die Position 0 und einmal die Position 3 dazu:

        ```python title="hans_test.py"
        hans = np.array([0.9, 0.1, 0.5, 0.2, 0.7, 0.3, 0.4, 0.6])

        print(f"'Hans' roh          : {hans}")
        print(f"'Hans' an Position 0: {np.round(hans + positional_encoding(0, 8), 2)}")
        print(f"'Hans' an Position 3: {np.round(hans + positional_encoding(3, 8), 2)}")
        ```

        ```title="Ausgabe"
        'Hans' roh          : [0.9 0.1 0.5 0.2 0.7 0.3 0.4 0.6]
        'Hans' an Position 0: [0.9 1.1 0.5 1.2 0.7 1.3 0.4 1.6]
        'Hans' an Position 3: [ 1.04 -0.89  0.8   1.16  0.73  1.3   0.4   1.6 ]
        ```

        **Zwei verschiedene Vektoren für dasselbe Wort.** Genau daran erkennt das Modell, ob Hans am Satzanfang steht (und füttert) oder am Ende (und gefüttert wird).

---

### 4) Attention

Jetzt kommt der Teil, der dem Paper seinen Namen gab. Bisher hat jedes Wort einen Vektor, der seine Bedeutung und Position kennt. Aber die wahre Stärke von LLMs liegt darin, Wörter **im Kontext der anderen Wörter** zu verstehen.

Das Lieblingsbeispiel dafür ist das Wort **„Bank"**:

<div class="grid cards" markdown>

- :material-cash: **„Ich gehe zur Bank und hebe Geld ab."**

    ---

    Kontext: *Geld, abheben* → gemeint ist das **Finanzinstitut** 🏦

- :material-tree: **„Ich setze mich auf die Bank im Park."**

    ---

    Kontext: *Park, sitzen* → gemeint ist das **Sitzmöbel** 🪑

</div>

Aus dem Wort „Bank" allein lässt sich das nicht erkennen – nur aus dem **Kontext**. Genau das leistet die **(Self-)Attention**: Sie passt den Embedding-Vektor jedes Wortes ein wenig an, indem sie ihn in Richtung der **relevanten Nachbarwörter** verschiebt.

???+ defi "Self-Attention (vereinfacht)"

    Jedes Wort „schaut" auf alle anderen Wörter im Satz und fragt: *Wie wichtig bist du für meine Bedeutung?* Anschließend wird die eigene Bedeutung als **gewichteter Mittelwert** der anderen Wörter angepasst.

    Technisch geschieht das über drei Matrizen – **Query (Q)**, **Key (K)** und **Value (V)** – und eine **Softmax**-Funktion, die die Gewichte normiert (sodass sie sich zu 1 addieren). In der Praxis passiert das mehrfach parallel und wird zur **Multihead Attention** zusammengesetzt.

Du musst die Matrizenrechnung nicht auswendig können. Wichtig ist die Intuition:

!!! quote "Merksatz"

    **Ein Wort bekommt seine endgültige Bedeutung erst durch seine Nachbarn.** Genau deshalb ist *Kontext* im Prompt so mächtig – mehr dazu im Kapitel [Anatomie eines guten Prompts](anatomie.md).

---

### 5) Das nächste Token

Jetzt versteht das Modell deinen Input. Aber wie entsteht die **Antwort**? Überraschend simpel: Das Modell sagt immer nur das **nächste Token** voraus – und zwar das mit der **höchsten Wahrscheinlichkeit**.

Dann hängt es dieses Token an den bisherigen Text an, schaut erneut, sagt das nächste Token voraus – und so weiter. Wie eine sehr, sehr gute Autovervollständigung. 📱

```mermaid
flowchart LR
    A["Die Katze sitzt auf der ___"]:::peach --> B(LLM berechnet<br/>Wahrscheinlichkeiten):::teal
    B --> C["Matte (72%)<br/>Couch (15%)<br/>Banane (0.1%)"]:::peach
    C --> D["wählt: Matte"]:::teal
    D -->|hängt an & wiederholt| A

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;
```

Das Spiel läuft so lange, bis ein spezielles **Stop-Token** erzeugt wird – das Signal: „Antwort fertig."

???+ question "Quiz: Halluzinationen vorhergesagt 🔮"

    Wenn ein LLM einfach nur das **wahrscheinlichste nächste Token** wählt – warum „erfindet" es dann manchmal selbstbewusst falsche Fakten (sogenannte *Halluzinationen*)?

    ??? success "Antwort anzeigen"

        Weil das Modell auf **sprachliche Wahrscheinlichkeit** optimiert ist, nicht auf **Wahrheit**. Es erzeugt das, was *plausibel klingt* – nicht das, was *nachweislich stimmt*. Eine flüssig formulierte Falschaussage ist für das Modell „wahrscheinlich", auch wenn sie sachlich Unsinn ist.

        Genau deshalb ist **Verifikation** ein eigenes Thema – siehe Kapitel [Evaluation von KI-Ergebnissen](evaluation.md).

---

## Wie wird ein LLM eigentlich klug?

Die beeindruckenden Fähigkeiten stecken in **Milliarden von Parametern** (GPT-3.5 z. B. ~175 Milliarden). Diese Werte entstehen in drei Trainingsphasen[^zuckarelli]:

```mermaid
flowchart TB
    A["`**1 · Unsupervised Pre-Training**
    ────────────────────────────────
    liest riesige Textmengen aus dem Internet`"]:::teal
    B["`**2 · Supervised Fine-Tuning (SFT)**
    ────────────────────────────────
    lernt aus Beispiel-Antworten menschlicher Trainer`"]:::peach
    C["`**3 · RLHF**
    ────────────────────────────────
    lernt aus Bewertungen, welche Antworten gut sind`"]:::teal

    A --> B --> C

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;
```

=== "1. Unsupervised Pre-Training"

    Das Modell liest **enorme Mengen** an Text aus dem Internet (z. B. Wikipedia und den gefilterten *Common Crawl Corpus*) und lernt nur eine Aufgabe: **„Was ist das nächste Wort?"**

    Dabei „lernt" es sein Wissen – nicht explizit abgespeichert wie in einer Datenbank, sondern **implizit** in den Parametern. Genau diese Phase steckt im „P" von **GPT** (siehe Kasten unten). Sie dauert **Monate** und verschlingt gigantische Mengen an Rechenleistung und Energie.

=== "2. Supervised Fine-Tuning (SFT)"

    Ein roh trainiertes Modell folgt Anweisungen oft schlecht (es antwortet auf „Was ist die Hauptstadt von Portugal?" gern mit einer Gegenfrage, weil so etwas in Quizzen häufig vorkommt 🙃).

    Deshalb wird es mit **tausenden Prompt-Antwort-Paaren** nachtrainiert, die menschliche Trainer erstellt haben. So entstand z. B. **InstructGPT** – ein Modell, das wirklich *tut, was man sagt*.

=== "3. RLHF"

    In der letzten Phase erzeugt das Modell mehrere Antworten, und Menschen **bewerten** sie. Aus diesen Bewertungen wird ein **Reward Model** trainiert, das dem LLM beibringt, welche Antworten gut ankommen.

    *Reinforced Learning with Human Feedback* (RLHF) macht Antworten nicht nur hilfreicher, sondern reduziert auch **faktisch falsche Aussagen** (Halluzinationen).[^ouyang]

???+ tip "Wofür „GPT" eigentlich steht"

    Der bekannteste Modellname der Welt ist eine schlichte Beschreibung der Technik – jeder Buchstabe steht für etwas, das du in diesem Kapitel bereits kennengelernt hast:

    | Buchstabe | Steht für | Bedeutet |
    |---|---|---|
    | **G** | *Generative* | Es **erzeugt** neuen Text, statt nur vorhandenen zu suchen oder zu sortieren – Token für Token, wie in Station 5 beschrieben. |
    | **P** | *Pre-trained* | Es wurde **vorab** trainiert (Phase 1 oben) und bringt sein Wissen schon mit. Du musst es nicht selbst anlernen. |
    | **T** | *Transformer* | Die **Architektur** aus diesem Kapitel – mit Tokenization, Embeddings, Positional Encoding und Attention. |

    Zusammengesetzt: ein **vortrainierter Transformer, der Text erzeugt**. Kein Zauberwort, sondern eine Inhaltsangabe. 🪄

---

## Zusammenfassung 📌

```mermaid
flowchart LR
    A[Dein Prompt]:::peach --> B[Tokenization]:::teal
    B --> C[Embeddings<br/>+ Position]:::teal
    C --> D[Attention<br/>Kontext]:::teal
    D --> E[nächstes Token<br/>vorhersagen]:::teal
    E --> F[Antwort]:::peach
    E -.wiederholen.-> E

    classDef peach fill:#FFB482aa,stroke:#333,stroke-width:1px;
    classDef teal fill:#009485aa,stroke:#333,stroke-width:1px;
```

???+ question "Selbsttest: Hast du den Motor verstanden?"

    1. Was ist der Unterschied zwischen einem **Token** und einem **Wort**?
    2. Warum brauchen Transformer ein **Positional Encoding**?
    3. Erkläre in einem Satz, was **Attention** am Beispiel „Bank" leistet.
    4. Warum ist ein LLM auf **Plausibilität** und nicht auf **Wahrheit** optimiert?

    ??? success "Lösungsskizze"

        1. Ein Token ist die kleinste Verarbeitungseinheit – oft nur ein **Wortteil**. Ein Wort kann aus mehreren Tokens bestehen.
        2. Weil der Transformer alle Wörter **gleichzeitig** verarbeitet und sonst die **Reihenfolge** verlieren würde.
        3. Attention passt die Bedeutung von „Bank" an die Nachbarwörter an – *Geld* → Finanzinstitut, *Park* → Sitzmöbel.
        4. Weil es darauf trainiert wurde, das **wahrscheinlichste nächste Token** zu erzeugen – sprachlich plausibel ≠ inhaltlich korrekt.

---

## Quellen

Zur Ausarbeitung wurden generative Tools unterstützend eingesetzt.

[^zuckarelli]: **Zuckarelli, J. (2025):** *Programmieren mit ChatGPT*, Kapitel 3 – „Funktionsweise des (Chat)GPT-Modells und anderer Large Language Models (LLMs)". Springer Nature. [https://doi.org/10.1007/978-3-662-69433-6_3](https://doi.org/10.1007/978-3-662-69433-6_3)
[^vaswani]: **Vaswani, A. et al. (2017):** *Attention Is All You Need.* arXiv:1706.03762. [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)
[^mikolov]: **Mikolov, T. et al. (2013):** *Efficient Estimation of Word Representations in Vector Space.* arXiv:1301.3781. [https://arxiv.org/abs/1301.3781](https://arxiv.org/abs/1301.3781)
[^ouyang]: **Ouyang, L. et al. (2022):** *Training language models to follow instructions with human feedback.* arXiv:2203.02155. [https://arxiv.org/abs/2203.02155](https://arxiv.org/abs/2203.02155)
[^brown]: **Brown, T. B. et al. (2020):** *Language Models are Few-Shot Learners.* arXiv:2005.14165. [https://arxiv.org/abs/2005.14165](https://arxiv.org/abs/2005.14165) — Tabelle 2.1 listet die Architekturdaten aller GPT-3-Varianten, u. a. `d_model` = 12.288 für das 175-Milliarden-Modell.
