# Standard: QM-Dokumente

Stand: 19.11.2026 · Version 0.4 (Entwurf) · Verantwortlich: Geschäftsführung

## 1 Geltung

Der Standard gilt für alle QM-Dokumente des Trägers: Texte des QM-Handbuchs, Arbeitsdokumente und Formulare, Workflows.

## 2 Festgelegt

1. **Zugeordnete Prozesse.** Jedes Dokument des QM-Handbuchs enthält die Zeile „Zugeordnete Prozesse“ (Festlegungen des Trägers vom 17.11. und 18.11.2026).
2. **Reflexion und Weiterentwicklung.** Jedes QM-Dokument enthält den Teil „Reflexion und Weiterentwicklung“. Er dient der Reflexion des Handelns: Er leitet die Fachkräfte an, ihr Vorgehen im beschriebenen Prozess zu überdenken (Festlegungen des Trägers vom 17.11. und 18.11.2026).
3. **Überführung.** Die vorhandenen QM-Dokumente werden nach und nach überführt. Die Ausgabe erfolgt im Word-Format; Quelle ist die Markdown-Datei.
4. **Ordnung.** Der Träger hat ein Kennungsschema und eine Prozesslandkarte. Sie bestimmen Kennungen und Ordnerstruktur. Das Kennungsschema ist die Gliederung des QM-Handbuchs (`handbuch/gliederung.md`): zwölf Kapitel (0 bis 11), Dezimalnummern mit bis zu vier Ebenen. Die Kennung eines Dokuments ist seine Gliederungsnummer.
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

- Die Vorlagen führen in der Kopfzeile Kapitel, Nummer, Titel und Seitenzahl, in der Fußzeile „erstellt“, „freigegeben“ und „Revision“ (`handbuch/befunde-gliederung.md`, Abschnitt 4). Diese Angaben bleiben; die Zählung der Revisionen wird fortgeführt (Kopfangabe `revision` statt `version`).

- Kopfangaben der Markdown-Quelle: `kennung`, `titel`, `textart`, `prozesse`, `version`, `stand`, `status` (Entwurf, geprüft, freigegeben), `erstellt`, `geprueft`, `freigegeben` (jeweils Stelle und Datum), `verteiler`, `naechste_ueberpruefung`, `ersetzt`.
- Der Freigabevermerk wird eingetragen, nachdem die Freigabe außerhalb des Repositorys erteilt ist. Vorher steht `status: Entwurf` oder `geprüft`.
- Jedes Dokument endet mit einer Änderungstabelle: Version, Datum, Änderung, Grund.
- Jede Änderung an einem freigegebenen Dokument erzeugt eine neue Version; die freigegebene Word-Fassung bleibt im Ordner `export/` erhalten.
- Eine Dokumentenliste (`dokumentenliste.md`) führt alle Dokumente mit Kennung, Titel, Prozess, Version, Stand und Status.

### 3.4 Ordner und Dateinamen

- Je Kapitel ein Ordner: `handbuch/<Kapitelnummer zweistellig>-<kurzname>/`, z. B. `handbuch/09-betreuungsprozesse/`.
- Je Dokument eine Markdown-Datei: `<Kennung>_<kurztitel>.md`, z. B. `9.1.4_hilfeplanung-stationaer.md`. Unterordner der Vorlage (Art „Ordner“) werden nicht nachgebildet; die Kennung trägt die Ordnung.
- Die Word-Ausgabe liegt in `export/`, die überführte Vorlage in `handbuch/alt/`.
- `handbuch/gliederung.md` ist die Dokumentenliste und führt je Dokument den Stand der Überführung.

## 4 Offen

1. Prozesslandkarte (`handbuch/3.1.2_prozesslandkarte.md`): Die Prozesse tragen keine Nummern, und sechs Prozessnamen kommen in mehreren Bereichen vor. Zu entscheiden: Nummern einführen oder Bereich und Name nennen (z. B. „Stationäre Hilfen: Hilfeplanung“). Zu klären ist außerdem die Zuordnung der Handbuchdokumente, die keinen namensgleichen Prozess haben (`handbuch/befunde-gliederung.md`, Abschnitt 5).
2. Zugeordnete Prozesse: Angabe bei Dokumenten, die keinem einzelnen Prozess zugeordnet sind. Gilt die Zeile auch für Arbeitsdokumente, Formulare und Workflows?
3. Befunde zur Gliederung (`handbuch/befunde-gliederung.md`): doppelte Kennungen in 9.1, abweichende Titel, überholte Einträge.
4. Reihenfolge der Überführung.
5. Lenkung: Welche Stellen erstellen, prüfen und geben frei? Wer steht im Verteiler? In welchem Rhythmus werden Dokumente überprüft?
6. Kapitel 5 des Handbuchs: Verweis auf die Repositories der Konzeptionen und Leistungsbeschreibungen oder Kopie.
7. Aufbau und Prüfliste je Textart.

## Änderungen

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 18.11.2026 | Erste Fassung: zwei Pflichtbestandteile nach den Festlegungen des Trägers vom 17.11.2026; Vorschläge und offene Punkte |
| 0.2 | 18.11.2026 | Festlegungen des Trägers vom 18.11.2026: Geltung der Prozesszeile, Reflexion des Handelns, Überführung nach und nach mit Ausgabe in Word, Kennungsschema und Prozesslandkarte, Nachbildung der Lenkung |
| 0.3 | 19.11.2026 | Kennungsschema nach der Gliederung des Handbuchs; Vorschläge zu Ordnern, Dateinamen und Revisionszählung; offene Punkte fortgeschrieben |
| 0.4 | 19.11.2026 | Prozesslandkarte (3.1.2) liegt vor; offene Punkte 1 und 2 neu gefasst |
