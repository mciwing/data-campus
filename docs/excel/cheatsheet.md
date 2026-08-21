# Cheatsheet: Zahlenformate

Excel erlaubt es, eigene **Zahlenformate** zu definieren - über *Start* → *Zahl* → *Weitere Zahlenformate* → *Benutzerdefiniert*. In diesem Cheatsheet findest du die wichtigsten Platzhalter und Format-Codes auf einen Blick.

## Grundlegende Platzhalter

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table" aria-label="Code / Bedeutung"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Code</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>0</code></td>
        <td style="padding:10px 14px;">Zeigt <strong>nicht-signifikante Nullen</strong> an, wenn eine Zahl weniger Stellen hat als Nullen im Format.</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>#</code></td>
        <td style="padding:10px 14px;">Zeigt <strong>nur signifikante Ziffern</strong> an - nicht-signifikante Nullen werden ignoriert.</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>,</code> (Komma)</td>
        <td style="padding:10px 14px;">Dezimaltrennzeichen</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>.</code> (Punkt)</td>
        <td style="padding:10px 14px;">1.000er-Trennzeichen oder Anzeige in Tausendern</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>?</code></td>
        <td style="padding:10px 14px;">Reserviert Platz für nicht-signifikante Nullen, zeigt sie aber als Leerzeichen - nützlich, um Dezimalpunkte auszurichten</td>
    </tr>
    </tbody>
</table>
</div>

### Beispiele: Nullen und Ziffern

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" aria-label="Format / Eingabe / Anzeige"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Format</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Eingabe</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anzeige</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>0</code></td>
        <td style="padding:10px 14px;">31</td>
        <td style="padding:10px 14px;">31</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>0,00</code></td>
        <td style="padding:10px 14px;">31,123</td>
        <td style="padding:10px 14px;">31,12</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>00 000</code></td>
        <td style="padding:10px 14px;">3100</td>
        <td style="padding:10px 14px;">03 100</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>#.##0</code></td>
        <td style="padding:10px 14px;">4261</td>
        <td style="padding:10px 14px;">4.261</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>#.##0,00</code></td>
        <td style="padding:10px 14px;">45,786</td>
        <td style="padding:10px 14px;">45,79</td>
    </tr>
    </tbody>
</table>
</div>

### Beispiele: Tausender-Trennzeichen

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" aria-label="Format / Eingabe / Anzeige"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Format</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Eingabe</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anzeige</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>#.##0</code></td>
        <td style="padding:10px 14px;">2600</td>
        <td style="padding:10px 14px;">2.600</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>0.</code></td>
        <td style="padding:10px 14px;">12000</td>
        <td style="padding:10px 14px;">12</td>
    </tr>
    </tbody>
</table>
</div>

Ein nachgestellter Punkt teilt die Zahl durch 1.000 (Anzeige in Tausendern), ohne den Wert zu verändern.

## Text in Formaten

Um **Text gemeinsam mit Zahlen** in einer Zelle anzuzeigen, gibt es zwei Wege:

- Text in **Anführungszeichen** (`"…"`) setzen
- Vor ein einzelnes Zeichen einen **Backslash** (`\`) setzen

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" aria-label="Format / Eingabe / Anzeige"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Format</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Eingabe</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anzeige</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>0 "Stk."</code></td>
        <td style="padding:10px 14px;">71</td>
        <td style="padding:10px 14px;">71 Stk.</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>0 \g</code></td>
        <td style="padding:10px 14px;">5</td>
        <td style="padding:10px 14px;">5 g</td>
    </tr>
    </tbody>
</table>
</div>

## Auffüllen und Abstände

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table" aria-label="Code / Wirkung"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Code</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Wirkung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>&#42;&lt;Zeichen&gt;</code></td>
        <td style="padding:10px 14px;">Teilt die Anzeige in einen <strong>links- und rechtsbündigen Teil</strong>. Der Abstand dazwischen wird mit dem angegebenen Zeichen aufgefüllt.</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>&#95;&lt;Zeichen&gt;</code></td>
        <td style="padding:10px 14px;">Erzeugt einen <strong>Abstand in der Breite des angegebenen Zeichens</strong> (Alternative: Leerzeichen).</td>
    </tr>
    </tbody>
</table>
</div>

### Beispiele: Auffüllen

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" aria-label="Format / Eingabe / Anzeige"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Format</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Eingabe</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anzeige</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>"EUR"&#42; 0</code></td>
        <td style="padding:10px 14px;">25</td>
        <td style="padding:10px 14px;">EUR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>"EUR"&#42;.0</code></td>
        <td style="padding:10px 14px;">25</td>
        <td style="padding:10px 14px;">EUR..........25</td>
    </tr>
    </tbody>
</table>
</div>

### Beispiele: Abstände

<div style="text-align:center; max-width:820px; margin:16px auto;">
<table role="table" aria-label="Format / Eingabe / Anzeige"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Format</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Eingabe</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anzeige</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>"EUR"&#95;-0</code></td>
        <td style="padding:10px 14px;">8</td>
        <td style="padding:10px 14px;">EUR 8</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>"EUR"&#95;-0&#95;-</code></td>
        <td style="padding:10px 14px;">8</td>
        <td style="padding:10px 14px;">EUR 8</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>&#95;-"EUR"&#42; 0&#95;-</code></td>
        <td style="padding:10px 14px;">8</td>
        <td style="padding:10px 14px;">EUR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8</td>
    </tr>
    </tbody>
</table>
</div>

## Datums- und Uhrzeit-Codes

### Tage

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table" aria-label="Code / Bedeutung"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Code</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>T</code></td>
        <td style="padding:10px 14px;">Tage als 1-31</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>TT</code></td>
        <td style="padding:10px 14px;">Tage als 01-31 (immer zweistellig)</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>TTT</code></td>
        <td style="padding:10px 14px;">Tage als So-Sa</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>TTTT</code></td>
        <td style="padding:10px 14px;">Tage als Sonntag-Samstag</td>
    </tr>
    </tbody>
</table>
</div>

### Monate

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table" aria-label="Code / Bedeutung"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Code</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>M</code></td>
        <td style="padding:10px 14px;">Monate als 1-12</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MM</code></td>
        <td style="padding:10px 14px;">Monate als 01-12 (immer zweistellig)</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MMM</code></td>
        <td style="padding:10px 14px;">Monate als Jan-Dez</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MMMM</code></td>
        <td style="padding:10px 14px;">Monate als Januar-Dezember</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>MMMMM</code></td>
        <td style="padding:10px 14px;">Monate mit dem ersten Buchstaben des Monats</td>
    </tr>
    </tbody>
</table>
</div>

### Jahre

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table" aria-label="Code / Bedeutung"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Code</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>JJ</code></td>
        <td style="padding:10px 14px;">Jahre als 00-99</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>JJJJ</code></td>
        <td style="padding:10px 14px;">Jahre als 1900-9999</td>
    </tr>
    </tbody>
</table>
</div>

### Stunden, Minuten, Sekunden

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table" aria-label="Code / Bedeutung"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Code</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Bedeutung</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>h</code></td>
        <td style="padding:10px 14px;">Stunden als 0-23</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>hh</code></td>
        <td style="padding:10px 14px;">Stunden als 00-23</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>m</code></td>
        <td style="padding:10px 14px;">Minuten als 0-59</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>mm</code></td>
        <td style="padding:10px 14px;">Minuten als 00-59</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>s</code></td>
        <td style="padding:10px 14px;">Sekunden als 0-59</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;"><code>ss</code></td>
        <td style="padding:10px 14px;">Sekunden als 00-59</td>
    </tr>
    </tbody>
</table>
</div>

!!! warning "Hinweis"
    `m` und `mm` werden je nach Kontext als **Monat** oder **Minute** interpretiert. Direkt nach `h`/`hh` (Stunden) oder vor `s`/`ss` (Sekunden) erkennt Excel sie als Minuten.

## Bereiche und Bedingungen

Bereiche werden genutzt, um **unterschiedliche Formate** (positive/negative Zahlen, Nullwerte etc.) oder Bedingungen anzugeben. Sie werden mit einem **Semikolon** (`;`) voneinander getrennt. Die Reihenfolge ist:

```
<positiv>;<negativ>;<null>;<text>
```

### Beispiele: Vorzeichen und Nullwerte

<div style="text-align:center; max-width:900px; margin:16px auto;">
<table role="table" aria-label="Beschreibung / Format / Eingabe"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Beschreibung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Format</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Eingabe</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anzeige</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Nullwerte als <code>-</code> darstellen</td>
        <td style="padding:10px 14px;"><code>0;-0;-</code></td>
        <td style="padding:10px 14px;">0</td>
        <td style="padding:10px 14px;">-</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Negative Zahlen rot darstellen</td>
        <td style="padding:10px 14px;"><code>0;[Rot]-0</code></td>
        <td style="padding:10px 14px;">-7</td>
        <td style="padding:10px 14px;">-7 (in rot)</td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Nullwerte ausblenden</td>
        <td style="padding:10px 14px;"><code>Standard;-Standard</code></td>
        <td style="padding:10px 14px;">0</td>
        <td style="padding:10px 14px;"><em>(leer)</em></td>
    </tr>
    </tbody>
</table>
</div>

### Verfügbare Farb-Codes

Innerhalb eckiger Klammern können Farben angegeben werden:

`[Schwarz]` &nbsp;·&nbsp; `[Blau]` &nbsp;·&nbsp; `[Zyan]` &nbsp;·&nbsp; `[Grün]` &nbsp;·&nbsp; `[Magenta]` &nbsp;·&nbsp; `[Weiß]` &nbsp;·&nbsp; `[Gelb]` &nbsp;·&nbsp; `[Rot]`

### Bedingte Formate

Innerhalb eckiger Klammern können auch **Vergleichsoperatoren** verwendet werden, um abhängig vom Wert ein Format zuzuweisen:

```
[>=1000000] 0,00.. " Mio";
[>=1000] 0,00. " T";
0
```

Dieses Format zeigt Werte ab 1.000.000 in Millionen, ab 1.000 in Tausend und sonst als ganze Zahl an.

## Häufige praktische Beispiele

<div style="text-align:center; max-width:700px; margin:16px auto;">
<table role="table" aria-label="Anwendung / Format"
       style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #cfd8e3; border-radius:10px; overflow:hidden; font-family:system-ui,sans-serif;">
    <thead>
    <tr style="background:#009485; color:#fff;">
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Anwendung</th>
        <th style="text-align:left; padding:12px 14px; font-weight:700;">Format</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Prozent mit zwei Dezimalstellen</td>
        <td style="padding:10px 14px;"><code>0,00 %</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Währung in Euro</td>
        <td style="padding:10px 14px;"><code>#.##0,00 "€"</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Telefonnummer</td>
        <td style="padding:10px 14px;"><code>+## (0) ### ###-####</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">IBAN-Gruppen</td>
        <td style="padding:10px 14px;"><code>0000\ 0000\ 0000\ 0000\ 0000\ 00</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Datum lang</td>
        <td style="padding:10px 14px;"><code>TTTT, T. MMMM JJJJ</code></td>
    </tr>
    <tr>
        <td style="background:#00948511; padding:10px 14px;">Negative Zahl in Klammern</td>
        <td style="padding:10px 14px;"><code>#.##0,00;(#.##0,00)</code></td>
    </tr>
    </tbody>
</table>
</div>

!!! tip "Tipp"
    Wenn dir ein Excel-Standardformat fast passt, aber nicht ganz: Wähle es zuerst aus, gehe dann auf *Benutzerdefiniert* - Excel zeigt dort den dahinterliegenden Format-Code, den du als Vorlage anpassen kannst.
