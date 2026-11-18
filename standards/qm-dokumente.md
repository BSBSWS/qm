# Standard: QM-Dokumente

Stand: 18.11.2026 · Version 0.2 (Entwurf) · Verantwortlich: Geschäftsführung

## 1 Geltung

Der Standard gilt für alle QM-Dokumente des Trägers: Texte des QM-Handbuchs, Arbeitsdokumente und Formulare, Workflows.

## 2 Festgelegt

1. **Zugeordnete Prozesse.** Jedes Dokument des QM-Handbuchs enthält die Zeile „Zugeordnete Prozesse“ (Festlegungen des Trägers vom 17.11. und 18.11.2026).
2. **Reflexion und Weiterentwicklung.** Jedes QM-Dokument enthält den Teil „Reflexion und Weiterentwicklung“. Er dient der Reflexion des Handelns: Er leitet die Fachkräfte an, ihr Vorgehen im beschriebenen Prozess zu überdenken (Festlegungen des Trägers vom 17.11. und 18.11.2026).
3. **Überführung.** Die vorhandenen QM-Dokumente werden nach und nach überführt. Die Ausgabe erfolgt im Word-Format; Quelle ist die Markdown-Datei.
4. **Ordnung.** Der Träger hat ein Kennungsschema und eine Prozesslandkarte. Sie bestimmen Kennungen und Ordnerstruktur.
5. **Lenkung.** Das Repository bildet die gelenkte Fassung nach (Versionen, Prüfung, Freigabevermerk, Verteiler). Die Freigabe selbst erfolgt außerhalb des Repositorys.
6. Workflow-Diagramme werden vorerst als Mermaid-Text geführt.
7. Es gelten die Schreibregeln des Trägers: präzise, sachliche Texte ohne Doppelungen und Ausschmückungen; keine Ich- und keine Wir-Form.

## 3 Vorschläge, noch nicht bestätigt

### 3.1 Zugeordnete Prozesse

- Ort: im Dokumentenkopf, als eigene Zeile unter Kennung, Version, Stand und Verantwortung.
- Inhalt: Kennung und Name jedes Prozesses nach der Prozesslandkarte, mehrere durch Semikolon getrennt.
- Kopfangabe der Markdown-Quelle: `prozesse`. Fehlt sie, meldet der Export das und setzt „Zugeordnete Prozesse: OFFEN“.
- Prüfpunkt: Die zugeordneten Prozesse sind genannt und stimmen mit der Prozesslandkarte überein.

### 3.2 Reflexion und Weiterentwicklung

- Ort: am Ende des Dokuments, immer gleich aufgebaut, höchstens eine halbe Seite.
- Leitfragen zur Reflexion des Handelns, auf den Prozess des Dokuments bezogen, z. B.: Wie wurde das Vorgehen im Einzelfall umgesetzt? Was hat getragen, was nicht? Wo wurde vom beschriebenen Vorgehen abgewichen, und mit welcher Begründung? Wie haben die Beteiligten, vor allem die jungen Menschen, das Vorgehen erlebt?
- Ort der Reflexion: wo sie stattfindet, z. B. Teamsitzung, Fallberatung, Supervision.
- Weiterentwicklung: wohin Erkenntnisse gehen, die das Dokument betreffen (Rückmeldung an die für das Dokument verantwortliche Stelle).

### 3.3 Nachbildung der Lenkung

- Kopfangaben der Markdown-Quelle: `kennung`, `titel`, `textart`, `prozesse`, `version`, `stand`, `status` (Entwurf, geprüft, freigegeben), `erstellt`, `geprueft`, `freigegeben` (jeweils Stelle und Datum), `verteiler`, `naechste_ueberpruefung`, `ersetzt`.
- Der Freigabevermerk wird eingetragen, nachdem die Freigabe außerhalb des Repositorys erteilt ist. Vorher steht `status: Entwurf` oder `geprüft`.
- Jedes Dokument endet mit einer Änderungstabelle: Version, Datum, Änderung, Grund.
- Jede Änderung an einem freigegebenen Dokument erzeugt eine neue Version; die freigegebene Word-Fassung bleibt im Ordner `export/` erhalten.
- Eine Dokumentenliste (`dokumentenliste.md`) führt alle Dokumente mit Kennung, Titel, Prozess, Version, Stand und Status.

## 4 Offen

1. Kennungsschema und Prozesslandkarte liegen im Repository noch nicht vor.
2. Zugeordnete Prozesse: Schreibweise (Nummer und Name oder nur Name); Angabe bei Dokumenten, die keinem einzelnen Prozess zugeordnet sind. Gilt die Zeile auch für Arbeitsdokumente, Formulare und Workflows?
3. Bestand: Zahl der vorhandenen QM-Dokumente und Reihenfolge der Überführung.
4. Lenkung: Welche Stellen erstellen, prüfen und geben frei? Wer steht im Verteiler? In welchem Rhythmus werden Dokumente überprüft?
5. Aufbau und Prüfliste je Textart.

## Änderungen

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 18.11.2026 | Erste Fassung: zwei Pflichtbestandteile nach den Festlegungen des Trägers vom 17.11.2026; Vorschläge und offene Punkte |
| 0.2 | 18.11.2026 | Festlegungen des Trägers vom 18.11.2026: Geltung der Prozesszeile, Reflexion des Handelns, Überführung nach und nach mit Ausgabe in Word, Kennungsschema und Prozesslandkarte, Nachbildung der Lenkung |
