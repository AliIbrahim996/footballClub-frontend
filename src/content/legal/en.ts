import { LEGAL } from "@/lib/legal";
import { contactEmail, operatorLines, TBD, val, type LegalLang } from "./types";

// Convenience translation. The German version is the legally binding one.
export function en(): LegalLang {
  const email = contactEmail();
  const operator = operatorLines().join(", ");
  const hosting = LEGAL.hosting || TBD;

  return {
    updated: "Last updated: 9 November 2026",
    note: "This is a convenience translation. The German version is legally binding.",
    privacy: {
      title: "Privacy Policy",
      intro: ["Protecting your data matters to us. This policy tells you, as required by Articles 13 and 14 GDPR, which personal data we process, when and why."],
      sections: [
        { h: "1. Controller", p: [operator, `Email: ${email}${LEGAL.phone ? `, phone: ${LEGAL.phone}` : ""}`, ...(LEGAL.euRepresentative ? [`Representative in the EU (Art. 27 GDPR): ${LEGAL.euRepresentative}`] : []), "For data that clubs manage about their players through Pitchside, section 7 applies: the club is the controller and we act as processor."] },
        { h: "2. Overview", ul: [
          "Visiting the website (server logs) and language setting",
          "The free tactics designer (data stays in your browser)",
          "Contacting us by form or email",
          "A club account, if you use one (sign-in, team management, billing)",
          "Optional: advertising (only with your consent)",
        ] },
        { h: "3. Visiting the website", p: [
          `When you open the site, our hosting provider processes technically necessary data (IP address, date and time, page requested, browser and system information) in server logs to deliver the site, prevent abuse and keep it running. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in secure and stable operation). Hosting: ${hosting}. Logs are deleted after the short period customary at the provider.`,
        ] },
        { h: "4. Free tactics designer", p: [
          "The designer runs entirely in your browser. Your boards are kept in your browser's local storage and are not sent to us. Exported images are created on your device. You can delete the data at any time by clearing this site's data in your browser. Please do not enter children's names or other personal data in the designer that you may not store on your own device.",
        ] },
        { h: "5. Contacting us", p: [
          "If you write to us through the contact form or by email, we process your name, email address, optionally your club, your message and the selected language to answer your request. The message is stored in our database and forwarded to our mailbox. Legal basis: Art. 6(1)(b) GDPR (pre-contractual steps) or (f) (answering enquiries). We delete the data once the enquiry is settled and no legal retention duty applies, and at your request at any time.",
          "The form protects itself with a per-IP rate limit and a hidden field; your IP address is briefly kept in the server's memory for this.",
        ] },
        { h: "6. Club account", p: [
          "If you use a club account we process username, email address, club name, role (owner, coach, viewer), a hashed password, usage times and, once you pay, billing data. Legal basis: Art. 6(1)(b) GDPR (performance of a contract). For sign-in we set a strictly necessary session cookie (see section 10).",
          "Payments (once enabled) are handled by our payment provider Stripe. Card data never reaches us. Stripe processes data under its own terms as controller or processor.",
        ] },
        { h: "7. Players' data (club data)", p: [
          "Clubs can record data about their players in Pitchside (name, address, date of birth, contact details, photo, skill ratings, tactical plans). For this data the club is the controller under the GDPR. We process it only on the club's behalf and instructions as processor under Art. 28 GDPR. We provide the data processing agreement on request and conclude it with the club before use begins.",
          "The club is responsible for having a legal basis, informing the people concerned or their parents or guardians, obtaining the required consents for minors (especially for photos) and entering only data needed for the club's purposes (data minimisation). People concerned should first contact their club for access, correction or deletion.",
        ] },
        { h: "8. Children and young people", p: [
          "Pitchside is aimed at clubs, coaches and other responsible persons, not at children. Accounts may only be created by adults or by persons authorised by the club. We process minors' data only as a processor for clubs; we do not use it for advertising, profiling or our own purposes. No player data is shown on the free, ad-supported pages.",
        ] },
        { h: "9. Advertising (optional)", p: [
          "If we use advertising (Google AdSense), the ad service is only loaded after you consent in the notice banner (Section 25(1) TDDDG, Art. 6(1)(a) GDPR). Data may be transferred to Google, including to third countries. You can withdraw your consent at any time via the \"Cookie settings\" link in the footer. There is no advertising in the signed-in area.",
        ] },
        { h: "10. Cookies and local storage", ul: [
          "fc_token (cookie, up to 14 days): sign-in; strictly necessary (Section 25(2) no. 2 TDDDG).",
          "NEXT_LOCALE (cookie): remembers your language; strictly necessary.",
          "pitchside.designer.v1 (localStorage): your board in the free designer; only created at your request and never sent to us.",
          "pitchside.ads-consent (localStorage): your choice on the ad banner, if advertising is enabled.",
          "Fonts are bundled at build time; your browser does not load them from Google servers.",
        ] },
        { h: "11. Recipients and processors", p: [
          `We use service providers that process data on our behalf: hosting (${hosting}), database and file storage, email delivery, Stripe if payments are enabled and Google if advertising is enabled. Processors are bound by contracts under Art. 28 GDPR. Transfers to third countries only take place with appropriate safeguards (for example EU standard contractual clauses or an adequacy decision).`,
        ] },
        { h: "12. Retention", p: [
          "We store data only as long as needed for its purpose. Account data is deleted after the contract ends once no statutory retention duty remains (for example up to ten years for billing records under commercial and tax law). Club data is deleted by the club itself or by us on its instruction within a reasonable time after the contract ends.",
        ] },
        { h: "13. Your rights", ul: [
          "Access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), data portability (Art. 20)",
          "Objection to processing based on legitimate interests (Art. 21)",
          "Withdrawal of consent with effect for the future (Art. 7(3))",
          `Complaint to a data protection supervisory authority, for example the one for your place of residence or our seat. For any request write to ${email}.`,
        ] },
        { h: "14. Security", p: ["We encrypt transmission (HTTPS), store passwords only as hashes, technically separate the data of different clubs, limit access by role and keep the software up to date."] },
        { h: "15. Changes", p: ["We update this policy when our services or the law change. The version published here applies."] },
      ],
    },
    terms: {
      title: "Terms of Use",
      intro: ["These terms apply to the use of Pitchside. The service is aimed at clubs, coaches and other organisations."],
      sections: [
        { h: "1. Provider and scope", p: [`The provider is ${operator}. These terms govern use of the website, the free tactics designer and the club management system (club account).`] },
        { h: "2. Free tactics designer", p: ["The designer can be used without an account. We provide it free of charge as is; there is no entitlement to availability or specific features. Your boards are stored only in your browser: back up important plans by exporting them."] },
        { h: "3. Club account and trial", p: [
          "The club management system is in early access and is set up on request. Once self-registration is enabled: each club receives a single free 14-day trial, which is not granted again. After that a paid subscription is required; price and term are shown before you commit. Subscriptions can be cancelled at the end of the paid period.",
          "By registering you confirm that you are entitled to represent the club and that your information is correct.",
        ] },
        { h: "4. User obligations", ul: [
          "Keep credentials secret and invite members only if they are authorised.",
          "Enter only lawfully collected data. The club is responsible for players' data (information, legal basis, consent of parents or guardians for minors, especially for photos).",
          "Do not upload unlawful content, attack the service or bypass technical limits.",
        ] },
        { h: "5. Data protection and processing", p: ["For club data we act as processor. The data processing agreement under Art. 28 GDPR is concluded with the club before use begins and forms part of these terms. See the privacy policy for details."] },
        { h: "6. Availability and changes", p: ["We aim for trouble-free operation but do not owe any particular availability. Maintenance and development may cause interruptions or changes. We announce material changes to paid services in good time."] },
        { h: "7. Liability", p: [
          "We are fully liable for intent and gross negligence, for injury to life, body or health and under the Product Liability Act. For slight negligence we are liable only for breach of essential contractual duties (duties whose fulfilment makes proper performance of the contract possible in the first place), limited to the foreseeable damage typical for this type of contract. Liability for the free designer follows the rules for gratuitous services. Any further liability is excluded.",
        ] },
        { h: "8. Term and termination", p: ["Accounts can be ended at any time effective at the end of the paid period. We may suspend access for serious violations. After termination clubs can have their data exported; we then delete it in line with the privacy policy and the data processing agreement."] },
        { h: "9. Final provisions", p: ["German law applies, excluding the UN Convention on Contracts for the International Sale of Goods. If the user is a merchant, a public-law legal entity or a public-law special fund, the place of jurisdiction is our seat. If a provision is invalid, the rest remains effective."] },
      ],
    },
    imprint: {
      title: "Imprint (Legal Notice)",
      sections: [
        { h: "Information pursuant to Section 5 DDG", p: operatorLines().concat(LEGAL.representative ? [`Represented by: ${LEGAL.representative}`] : []) },
        { h: "Contact", p: [`Email: ${email}`, `Phone: ${val(LEGAL.phone)}`] },
        ...(LEGAL.register || LEGAL.vatId ? [{ h: "Register and tax", p: [LEGAL.register ? `Register entry: ${LEGAL.register}` : "", LEGAL.vatId ? `VAT identification number: ${LEGAL.vatId}` : ""].filter(Boolean) }] : []),
        { h: "Responsible for content (Section 18(2) MStV)", p: [`${val(LEGAL.name)}, ${val(LEGAL.street)}, ${val(LEGAL.city)}`] },
        { h: "Consumer dispute resolution", p: ["We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board."] },
        { h: "Liability for links", p: ["The operators of external sites we link to are solely responsible for their content. If we learn of legal violations we remove such links promptly."] },
      ],
    },
  };
}
