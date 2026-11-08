# Auftragsverarbeitungsvertrag (Art. 28 DSGVO) – Vorlage

> **Vorlage, keine Rechtsberatung.** Vor der Verwendung anwaltlich prüfen und die Platzhalter in `[eckigen Klammern]` ausfüllen.
> Zu schließen zwischen dem Verein (Verantwortlicher) und dem Betreiber von Pitchside (Auftragsverarbeiter), bevor der Verein Daten von Spielerinnen und Spielern einträgt.

**Verantwortlicher:** [Vereinsname, e. V., Anschrift, vertretungsberechtigte Person, E-Mail] – im Folgenden „Verein“
**Auftragsverarbeiter:** [Name/Firma des Betreibers, Anschrift, E-Mail] – im Folgenden „Auftragnehmer“

## 1. Gegenstand und Dauer
1.1 Der Auftragnehmer stellt dem Verein die Software „Pitchside“ (Spielerverwaltung, Fähigkeitsbewertung, Taktikpläne, Team-Einladungen, Plan-Freigabelinks) bereit und verarbeitet dabei personenbezogene Daten im Auftrag des Vereins.
1.2 Der Vertrag gilt für die Dauer der Nutzung des Vereinskontos und endet mit dessen Beendigung (siehe Ziffer 9).

## 2. Art, Zweck, Daten und Betroffene
| | |
|---|---|
| Art der Verarbeitung | Speichern, Anzeigen, Ändern, Löschen, Exportieren, Sichern |
| Zweck | Organisation des Spielbetriebs, Training und Spielvorbereitung des Vereins |
| Datenarten | Name, Anschrift, Geburtsdatum, Telefon, E-Mail, Vereinszugehörigkeit, Foto, Fähigkeitsbewertungen, Notizen/Kommentare, Taktikpläne; Konto- und Nutzungsdaten der Vereinsnutzer |
| Betroffene | Spielerinnen und Spieler (auch **Minderjährige**), Trainerinnen/Trainer und weitere Vereinsnutzer |
| Besondere Kategorien (Art. 9) | Nicht vorgesehen. Der Verein trägt keine Gesundheitsdaten ein. |

## 3. Weisungen
3.1 Der Auftragnehmer verarbeitet Daten nur auf dokumentierte Weisung des Vereins (diese Vereinbarung, Nutzung der Software, schriftliche Einzelweisungen), außer bei gesetzlicher Pflicht.
3.2 Hält der Auftragnehmer eine Weisung für rechtswidrig, weist er den Verein unverzüglich darauf hin.

## 4. Pflichten des Vereins
Der Verein ist für die Rechtmäßigkeit der Verarbeitung verantwortlich: Rechtsgrundlage, Informationspflichten, **Einwilligung der Erziehungsberechtigten bei Minderjährigen (insbesondere für Fotos)**, Datenminimierung und Löschkonzept. Der Verein beantwortet Anfragen Betroffener.

## 5. Pflichten des Auftragnehmers
5.1 **Vertraulichkeit:** Alle zur Verarbeitung befugten Personen sind zur Vertraulichkeit verpflichtet.
5.2 **Sicherheit (Art. 32):** Der Auftragnehmer setzt die in Anlage 1 beschriebenen technischen und organisatorischen Maßnahmen um und entwickelt sie fort.
5.3 **Unterstützung:** Der Auftragnehmer unterstützt den Verein bei Betroffenenrechten (Art. 12–22), bei der Sicherheit, bei Meldungen von Verletzungen und bei Datenschutz-Folgenabschätzungen, soweit dies nach Art der Verarbeitung erforderlich ist.
5.4 **Verletzungen:** Der Auftragnehmer meldet Verletzungen des Schutzes personenbezogener Daten dem Verein **unverzüglich**, damit dieser die 72-Stunden-Frist des Art. 33 einhalten kann, und liefert die verfügbaren Informationen.
5.5 **Verzeichnis:** Der Auftragnehmer führt ein Verzeichnis der Verarbeitungstätigkeiten für Auftragsverarbeiter (Art. 30 Abs. 2).

## 6. Unterauftragsverarbeiter
6.1 Der Verein stimmt dem Einsatz der in Anlage 2 genannten Unterauftragsverarbeiter zu.
6.2 Änderungen kündigt der Auftragnehmer mindestens [30] Tage vorher in Textform an. Der Verein kann aus wichtigem datenschutzrechtlichem Grund widersprechen; andernfalls gilt die Änderung als genehmigt. Bei Widerspruch ohne Einigung kann jede Seite zum Ende des laufenden Zeitraums kündigen.
6.3 Unterauftragsverarbeitern werden dieselben Pflichten auferlegt wie in diesem Vertrag.

## 7. Drittlandübermittlung
Eine Verarbeitung außerhalb der EU/des EWR erfolgt nur, wenn die Voraussetzungen der Art. 44 ff. DSGVO erfüllt sind (z. B. Angemessenheitsbeschluss oder EU-Standardvertragsklauseln).

## 8. Kontrollrechte
Der Auftragnehmer stellt dem Verein die zum Nachweis der Pflichten erforderlichen Informationen bereit und ermöglicht Überprüfungen, auch durch von ihm beauftragte Prüfer, nach rechtzeitiger Anmeldung und ohne unverhältnismäßige Störung des Betriebs.

## 9. Rückgabe und Löschung
Nach Beendigung stellt der Auftragnehmer dem Verein auf Wunsch einen Export der Daten bereit und löscht anschließend alle Daten des Vereins einschließlich Kopien und Sicherungen innerhalb von [30/60] Tagen, soweit keine gesetzliche Aufbewahrungspflicht besteht. Auf Verlangen bestätigt er die Löschung in Textform.

## 10. Haftung, Schlussbestimmungen
Die Haftung richtet sich nach Art. 82 DSGVO und den Nutzungsbedingungen. Es gilt deutsches Recht. Änderungen bedürfen der Textform. Bei Widersprüchen geht diese Vereinbarung den Nutzungsbedingungen vor.

Ort, Datum: ______________  Verein: ______________  Auftragnehmer: ______________

---

## Anlage 1 – Technische und organisatorische Maßnahmen (Beispiel, an die Realität anpassen)
- **Vertraulichkeit:** Rollenbasierter Zugriff (Inhaber/Trainer/Betrachter); Daten verschiedener Vereine sind logisch getrennt (jeder Datensatz gehört genau einem Verein; jede Abfrage ist darauf beschränkt); Passwörter nur als Hash; Anmeldesitzung über httpOnly-Cookie; Begrenzung von Anmeldeversuchen.
- **Integrität:** Verschlüsselte Übertragung (HTTPS/TLS); Protokollierung, wer Bewertungen geändert hat; Eingabevalidierung.
- **Verfügbarkeit/Belastbarkeit:** Regelmäßige Datenbanksicherungen [Rhythmus, Aufbewahrung]; Wiederherstellungstest [Rhythmus].
- **Trennung:** Test- und Produktionsumgebung getrennt; automatisierte Tests laufen nie auf Produktivdaten.
- **Geheimnisse:** Keine Zugangsdaten im Quellcode; Verwaltung über den Secret Manager des Hosters.
- **Organisation:** [Verpflichtung auf Vertraulichkeit, Zugriffsberechtigungen, Vorgehen bei Datenpannen, Löschkonzept, Schulung].

## Anlage 2 – Unterauftragsverarbeiter (ausfüllen)
| Unternehmen / Sitz | Leistung | Verarbeitungsort | Garantien |
|---|---|---|---|
| [Hosting-Anbieter] | Anwendungs-Hosting | [Region] | [AVV / SCC] |
| [Datenbank-Anbieter] | PostgreSQL | [Region] | [AVV / SCC] |
| [Speicher-Anbieter] | Datei-Speicher (Fotos, Plan-Bilder) | [Region] | [AVV / SCC] |
| [E-Mail-Anbieter] | Versand von Einladungs-E-Mails | [Region] | [AVV / SCC] |
