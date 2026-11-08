import { LEGAL } from "@/lib/legal";
import { contactEmail, operatorLines, TBD, val, type LegalLang } from "./types";

// Deutsche Fassung = rechtlich massgebliche Fassung. Vor dem Livegang anwaltlich pruefen lassen.
export function de(): LegalLang {
  const email = contactEmail();
  const operator = operatorLines().join(", ");
  const hosting = LEGAL.hosting || TBD;

  return {
    updated: "Stand: 9. November 2026",
    privacy: {
      title: "Datenschutzerklärung",
      intro: [
        "Der Schutz Ihrer Daten ist uns wichtig. Diese Erklärung informiert Sie nach Art. 13 und 14 DSGVO darüber, welche personenbezogenen Daten wir wann und wofür verarbeiten.",
      ],
      sections: [
        { h: "1. Verantwortlicher", p: [`${operator}`, `E-Mail: ${email}${LEGAL.phone ? `, Telefon: ${LEGAL.phone}` : ""}`, ...(LEGAL.euRepresentative ? [`Vertreter in der EU (Art. 27 DSGVO): ${LEGAL.euRepresentative}`] : []), "Für Daten, die Vereine über Pitchside über ihre Spielerinnen und Spieler verwalten, gilt Abschnitt 7: Dort ist der jeweilige Verein verantwortlich und wir sind Auftragsverarbeiter."] },
        { h: "2. Überblick", ul: [
          "Besuch der Website (Server-Logs) und Spracheinstellung",
          "Kostenloser Taktik-Designer (Daten bleiben in Ihrem Browser)",
          "Kontaktaufnahme per Formular oder E-Mail",
          "Vereinskonto, sobald Sie eines nutzen (Anmeldung, Teamverwaltung, Abrechnung)",
          "Optional: Werbung (nur nach Ihrer Einwilligung)",
        ] },
        { h: "3. Besuch der Website", p: [
          `Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser- und Systeminformationen) in Server-Logs, um die Seite auszuliefern, Missbrauch abzuwehren und den Betrieb sicherzustellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und stabilen Betrieb). Hosting: ${hosting}. Die Logs werden nach der beim Anbieter üblichen kurzen Frist gelöscht.`,
        ] },
        { h: "4. Kostenloser Taktik-Designer", p: [
          "Der Designer arbeitet vollständig in Ihrem Browser. Ihre Aufstellungen werden im lokalen Speicher Ihres Browsers (localStorage) abgelegt und nicht an uns übertragen. Exportierte Bilder entstehen lokal auf Ihrem Gerät. Sie können die Daten jederzeit löschen, indem Sie die Websitedaten Ihres Browsers entfernen. Bitte tragen Sie im Designer keine Namen von Kindern oder andere personenbezogene Daten ein, die Sie nicht auf Ihrem eigenen Gerät speichern dürfen.",
        ] },
        { h: "5. Kontaktaufnahme", p: [
          "Wenn Sie uns über das Kontaktformular oder per E-Mail schreiben, verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse, optional Ihren Verein, Ihre Nachricht und die gewählte Sprache, um Ihre Anfrage zu beantworten. Die Nachricht wird in unserer Datenbank gespeichert und an unser Postfach weitergeleitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. lit. f (Beantwortung von Anfragen). Wir löschen die Daten, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen, spätestens auf Ihren Wunsch.",
          "Das Formular schützt sich mit einem Zeitlimit pro IP-Adresse und einem unsichtbaren Feld gegen Missbrauch; dabei wird die IP-Adresse kurzzeitig im Arbeitsspeicher des Servers verarbeitet.",
        ] },
        { h: "6. Vereinskonto", p: [
          "Wenn Sie ein Vereinskonto nutzen, verarbeiten wir Benutzername, E-Mail-Adresse, Vereinsname, Rolle (Inhaber, Trainer, Betrachter), ein verschlüsselt gespeichertes Passwort (Hash), Zeitpunkte der Nutzung sowie bei Zahlung die Abrechnungsdaten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Für die Anmeldung setzen wir ein technisch notwendiges Sitzungs-Cookie (siehe Abschnitt 10).",
          "Zahlungen (sobald aktiviert) wickelt unser Zahlungsdienstleister Stripe ab. Kartendaten gelangen nicht zu uns. Stripe verarbeitet Daten in eigener Verantwortung bzw. als Auftragsverarbeiter nach dessen Bedingungen.",
        ] },
        { h: "7. Daten von Spielerinnen und Spielern (Vereinsdaten)", p: [
          "Vereine können in Pitchside Daten ihrer Spielerinnen und Spieler erfassen (Name, Anschrift, Geburtsdatum, Kontaktdaten, Foto, Fähigkeitsbewertungen, Taktikpläne). Für diese Daten ist der jeweilige Verein Verantwortlicher im Sinne der DSGVO. Wir verarbeiten sie ausschließlich in dessen Auftrag und nach dessen Weisungen als Auftragsverarbeiter nach Art. 28 DSGVO. Den Auftragsverarbeitungsvertrag stellen wir auf Anfrage zur Verfügung und schließen ihn vor Beginn der Nutzung mit dem Verein ab.",
          "Der Verein ist dafür verantwortlich, eine Rechtsgrundlage zu haben, die betroffenen Personen bzw. deren Erziehungsberechtigte zu informieren, bei Minderjährigen die erforderlichen Einwilligungen einzuholen (insbesondere für Fotos) und nur Daten einzugeben, die für den Vereinszweck erforderlich sind (Datenminimierung). Betroffene wenden sich für Auskunft, Berichtigung oder Löschung bitte zuerst an ihren Verein.",
        ] },
        { h: "8. Kinder und Jugendliche", p: [
          "Pitchside richtet sich an Vereine, Trainerinnen und Trainer sowie andere Verantwortliche, nicht an Kinder. Konten dürfen nur von Volljährigen bzw. im Auftrag des Vereins von dazu berechtigten Personen angelegt werden. Daten Minderjähriger verarbeiten wir nur als Auftragsverarbeiter für Vereine. Wir nutzen sie nicht für Werbung, Profiling oder eigene Zwecke. Auf den kostenlosen, werbefinanzierten Seiten werden keine Spielerdaten angezeigt.",
        ] },
        { h: "9. Werbung (optional)", p: [
          "Sofern wir Werbung (Google AdSense) einsetzen, laden wir den Werbe-Dienst erst, nachdem Sie im Hinweisbanner eingewilligt haben (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Dabei können Daten an Google übertragen werden, auch in Drittländer. Sie können Ihre Einwilligung jederzeit über den Link „Cookie-Einstellungen“ im Seitenfuß widerrufen. Im angemeldeten Bereich gibt es keine Werbung.",
        ] },
        { h: "10. Cookies und lokaler Speicher", ul: [
          "fc_token (Cookie, bis zu 14 Tage): Anmeldung; technisch notwendig (§ 25 Abs. 2 Nr. 2 TDDDG).",
          "NEXT_LOCALE (Cookie): merkt sich die gewählte Sprache; technisch notwendig.",
          "pitchside.designer.v1 (localStorage): Ihre Aufstellung im kostenlosen Designer; wird nur auf Ihren Wunsch erzeugt und nicht an uns gesendet.",
          "pitchside.ads-consent (localStorage): Ihre Entscheidung zum Werbe-Banner, falls Werbung aktiviert ist.",
          "Schriftarten werden beim Erstellen der Website lokal eingebunden; Ihr Browser lädt sie nicht von Google-Servern.",
        ] },
        { h: "11. Empfänger und Auftragsverarbeiter", p: [
          `Wir setzen Dienstleister ein, die in unserem Auftrag Daten verarbeiten: Hosting (${hosting}), Datenbank und Datei-Speicher, E-Mail-Versand, bei aktivierter Zahlung Stripe und bei aktivierter Werbung Google. Mit Auftragsverarbeitern bestehen Verträge nach Art. 28 DSGVO. Eine Übermittlung in Drittländer erfolgt nur mit geeigneten Garantien (z. B. EU-Standardvertragsklauseln oder Angemessenheitsbeschluss).`,
        ] },
        { h: "12. Speicherdauer", p: [
          "Wir speichern Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist. Kontodaten löschen wir nach Beendigung des Vertrags, sobald keine gesetzlichen Aufbewahrungspflichten (z. B. handels- und steuerrechtlich bis zu zehn Jahre für Abrechnungsdaten) mehr bestehen. Vereinsdaten löscht der Verein selbst oder wir auf dessen Weisung innerhalb angemessener Frist nach Vertragsende.",
        ] },
        { h: "13. Ihre Rechte", ul: [
          "Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20)",
          "Widerspruch gegen Verarbeitung auf Grundlage berechtigter Interessen (Art. 21)",
          "Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3)",
          `Beschwerde bei einer Datenschutz-Aufsichtsbehörde, z. B. der für Ihren Wohnort oder unseren Sitz zuständigen Landesbehörde. Schreiben Sie uns für alle Anliegen an ${email}.`,
        ] },
        { h: "14. Sicherheit", p: [
          "Wir verschlüsseln die Übertragung (HTTPS), speichern Passwörter nur als Hash, trennen die Daten verschiedener Vereine technisch voneinander, begrenzen Zugriffe nach Rollen und halten die Software aktuell.",
        ] },
        { h: "15. Änderungen", p: ["Wir passen diese Erklärung an, wenn sich unsere Leistungen oder die Rechtslage ändern. Es gilt die jeweils hier veröffentlichte Fassung."] },
      ],
    },
    terms: {
      title: "Nutzungsbedingungen",
      intro: ["Diese Bedingungen gelten für die Nutzung von Pitchside. Der Dienst richtet sich an Vereine, Trainerinnen und Trainer und andere Organisationen."],
      sections: [
        { h: "1. Anbieter und Geltungsbereich", p: [`Anbieter ist ${operator}. Diese Bedingungen regeln die Nutzung der Website, des kostenlosen Taktik-Designers und der Vereinsverwaltung (Vereinskonto).`] },
        { h: "2. Kostenloser Taktik-Designer", p: ["Der Designer kann ohne Konto genutzt werden. Wir stellen ihn unentgeltlich im Ist-Zustand zur Verfügung; ein Anspruch auf Verfügbarkeit oder auf bestimmte Funktionen besteht nicht. Ihre Aufstellungen liegen nur in Ihrem Browser: sichern Sie wichtige Pläne durch Export."] },
        { h: "3. Vereinskonto und Testphase", p: [
          "Die Vereinsverwaltung befindet sich im frühen Zugang und wird auf Anfrage eingerichtet. Sobald die Selbstregistrierung freigeschaltet ist, gilt: Jeder Verein erhält einmalig eine kostenlose Testphase von 14 Tagen, die nicht erneut gewährt wird. Danach ist ein kostenpflichtiges Abonnement erforderlich; Preis und Laufzeit werden vor Vertragsschluss angezeigt. Abonnements können zum Ende des bezahlten Zeitraums gekündigt werden.",
          "Mit der Registrierung bestätigen Sie, dass Sie berechtigt sind, den Verein zu vertreten, und dass Ihre Angaben richtig sind.",
        ] },
        { h: "4. Pflichten der Nutzer", ul: [
          "Zugangsdaten geheim halten und Mitglieder nur an berechtigte Personen einladen.",
          "Nur rechtmäßig erhobene Daten eingeben. Für Daten von Spielerinnen und Spielern ist der Verein verantwortlich (Information, Rechtsgrundlage, bei Minderjährigen Einwilligung der Erziehungsberechtigten, insbesondere für Fotos).",
          "Keine rechtswidrigen Inhalte hochladen, keine Angriffe auf den Dienst und keine Umgehung technischer Beschränkungen.",
        ] },
        { h: "5. Datenschutz und Auftragsverarbeitung", p: ["Für Vereinsdaten sind wir Auftragsverarbeiter. Der Auftragsverarbeitungsvertrag nach Art. 28 DSGVO wird vor Beginn der Nutzung mit dem Verein geschlossen und ist Bestandteil dieser Bedingungen. Näheres steht in der Datenschutzerklärung."] },
        { h: "6. Verfügbarkeit und Änderungen", p: ["Wir bemühen uns um einen störungsfreien Betrieb, schulden aber keine bestimmte Verfügbarkeit. Wartung und Weiterentwicklung können zu Unterbrechungen oder Änderungen führen. Wesentliche Änderungen bezahlter Leistungen kündigen wir rechtzeitig an."] },
        { h: "7. Haftung", p: [
          "Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit sowie nach dem Produkthaftungsgesetz. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten (Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags erst ermöglicht), beschränkt auf den vorhersehbaren, vertragstypischen Schaden. Die Haftung für den kostenlosen Designer richtet sich nach den Vorschriften über unentgeltliche Leistungen. Eine weitergehende Haftung ist ausgeschlossen.",
        ] },
        { h: "8. Laufzeit und Beendigung", p: ["Konten können jederzeit zum Ende des bezahlten Zeitraums beendet werden. Bei schwerwiegenden Verstößen dürfen wir den Zugang sperren. Nach Beendigung können Vereine ihre Daten exportieren lassen; anschließend löschen wir sie nach Datenschutzerklärung und Auftragsverarbeitungsvertrag."] },
        { h: "9. Schlussbestimmungen", p: ["Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Ist der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand unser Sitz. Sollte eine Bestimmung unwirksam sein, bleibt der Rest wirksam."] },
      ],
    },
    imprint: {
      title: "Impressum",
      sections: [
        { h: "Angaben gemäß § 5 DDG", p: operatorLines().concat(LEGAL.representative ? [`Vertreten durch: ${LEGAL.representative}`] : []) },
        { h: "Kontakt", p: [`E-Mail: ${email}`, `Telefon: ${val(LEGAL.phone)}`] },
        ...(LEGAL.register || LEGAL.vatId ? [{ h: "Register und Steuern", p: [LEGAL.register ? `Registereintrag: ${LEGAL.register}` : "", LEGAL.vatId ? `Umsatzsteuer-Identifikationsnummer: ${LEGAL.vatId}` : ""].filter(Boolean) }] : []),
        { h: "Verantwortlich für Inhalte (§ 18 Abs. 2 MStV)", p: [`${val(LEGAL.name)}, ${val(LEGAL.street)}, ${val(LEGAL.city)}`] },
        { h: "Verbraucherstreitbeilegung", p: ["Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."] },
        { h: "Haftung für Links", p: ["Für Inhalte externer Seiten, auf die wir verlinken, sind ausschließlich deren Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverstößen entfernen wir solche Links umgehend."] },
      ],
    },
  };
}
