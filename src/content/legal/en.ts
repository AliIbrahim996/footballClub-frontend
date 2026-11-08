import { LEGAL } from "@/lib/legal";
import { addressLine, contactEmail, operatorLines, TBD, val, type LegalLang } from "./types";

// Draft texts for a small personal/demo project. They are not legal advice: have them reviewed before you rely on them.
export function en(): LegalLang {
  const email = contactEmail();
  const operator = operatorLines().join(", ");
  const hosting = LEGAL.hosting || TBD;

  return {
    updated: "Last updated: 9 November 2026",
    privacy: {
      title: "Privacy Policy",
      intro: ["Protecting your data matters to us. This policy explains which personal data we process, when and why."],
      sections: [
        { h: "1. Who is responsible", p: [operator, `Email: ${email}${LEGAL.phone ? `, phone: ${LEGAL.phone}` : ""}`, ...(LEGAL.euRepresentative ? [`Representative in the EU: ${LEGAL.euRepresentative}`] : []), "For data that clubs manage about their players through Pitchside, section 7 applies: the club decides what is stored and we process it on the club's behalf."] },
        { h: "2. Overview", ul: [
          "Visiting the website (server logs) and your language setting",
          "The free tactics designer (data stays in your browser)",
          "Contacting us by form or email",
          "A club account, if you use one (sign-in, team management, billing)",
          "Optional: advertising (only with your consent)",
        ] },
        { h: "3. Visiting the website", p: [
          `When you open the site, our hosting provider processes technically necessary data (IP address, date and time, page requested, browser and system information) in server logs to deliver the site, prevent abuse and keep it running. This rests on our legitimate interest in a secure and stable service. Hosting: ${hosting}. Logs are deleted after the short period customary at the provider.`,
        ] },
        { h: "4. Free tactics designer", p: [
          "The designer runs entirely in your browser. Your boards are kept in your browser's local storage and are not sent to us. Exported images are created on your device. You can delete the data at any time by clearing this site's data in your browser. Please do not enter children's names or other personal data in the designer that you may not store on your own device.",
        ] },
        { h: "5. Contacting us", p: [
          "If you write to us through the contact form or by email, we process your name, email address, optionally your club, your message and the selected language to answer your request. The message is stored in our database and forwarded to our mailbox. We do this to respond to you (steps before a possible contract, or our legitimate interest in answering enquiries). We delete the data once the enquiry is settled and no legal retention duty applies, and at your request at any time.",
          "The form protects itself with a per-IP rate limit and a hidden field; your IP address is briefly kept in the server's memory for this.",
        ] },
        { h: "6. Club account", p: [
          "If you use a club account we process username, email address, club name, role (owner, coach, viewer), a hashed password, usage times and, once you pay, billing data, to provide the service you asked for. For sign-in we set a strictly necessary session cookie (see section 10).",
          "Payments (once enabled) are handled by our payment provider Stripe. Card data never reaches us. Stripe processes data under its own terms.",
        ] },
        { h: "7. Players' data (club data)", p: [
          "Clubs can record data about their players in Pitchside (name, address, date of birth, contact details, photo, skill ratings, tactical plans). The club is responsible for this data. We process it only on the club's behalf and instructions, under a data processing agreement that we provide on request and conclude with the club before use begins.",
          "The club is responsible for having a legal basis, informing the people concerned or their parents or guardians, obtaining the required consents for minors (especially for photos) and entering only the data it needs. People concerned should first contact their club for access, correction or deletion.",
        ] },
        { h: "8. Children and young people", p: [
          "Pitchside is aimed at clubs, coaches and other responsible persons, not at children. Accounts may only be created by adults or by persons authorised by the club. We process minors' data only on behalf of clubs; we do not use it for advertising, profiling or our own purposes. No player data is shown on the free, ad-supported pages.",
        ] },
        { h: "9. Advertising (optional)", p: [
          "If we use advertising (Google AdSense), the ad service is only loaded after you consent in the notice banner. Data may be transferred to Google, including to other countries. You can withdraw your consent at any time via the \"Cookie settings\" link in the footer. There is no advertising in the signed-in area.",
        ] },
        { h: "10. Cookies and local storage", ul: [
          "fc_token (cookie, up to 14 days): sign-in; strictly necessary.",
          "NEXT_LOCALE (cookie): remembers your language; strictly necessary.",
          "pitchside.designer.v1 (localStorage): your board in the free designer; only created at your request and never sent to us.",
          "pitchside.ads-consent (localStorage): your choice on the ad banner, if advertising is enabled.",
          "Fonts are bundled at build time; your browser does not load them from Google servers.",
        ] },
        { h: "11. Recipients and processors", p: [
          `We use service providers that process data on our behalf: hosting (${hosting}), database and file storage, email delivery, Stripe if payments are enabled and Google if advertising is enabled. They are bound by contracts to protect the data. Transfers to other countries only take place with appropriate safeguards.`,
        ] },
        { h: "12. Retention", p: [
          "We store data only as long as needed for its purpose. Account data is deleted after the contract ends once no legal retention duty remains (for example for billing records). Club data is deleted by the club itself or by us on its instruction within a reasonable time after the contract ends.",
        ] },
        { h: "13. Your rights", ul: [
          "Depending on where you live, data protection law (for example the EU GDPR or the UAE Federal Decree-Law No. 45 of 2021) gives you rights such as access, correction, deletion, restriction, portability and objection, and the right to withdraw consent at any time with effect for the future.",
          `To use these rights, write to ${email}. You may also complain to the data protection authority responsible for you.`,
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
        { h: "5. Data protection and processing", p: ["For club data we act on the club's behalf. A data processing agreement is concluded with the club before use begins and forms part of these terms. See the privacy policy for details."] },
        { h: "6. Availability and changes", p: ["We aim for trouble-free operation but do not owe any particular availability. Maintenance and development may cause interruptions or changes. We announce material changes to paid services in good time."] },
        { h: "7. Liability", p: [
          "Nothing in these terms limits liability that cannot be limited by law, including for intent, gross negligence, or injury to life, body or health. Otherwise, and to the extent the law allows, our liability is limited to foreseeable direct damage. The free designer is provided without warranty.",
        ] },
        { h: "8. Term and termination", p: ["Accounts can be ended at any time effective at the end of the paid period. We may suspend access for serious violations. After termination clubs can have their data exported; we then delete it in line with the privacy policy and the data processing agreement."] },
        { h: "9. Governing law", p: ["These terms are governed by the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates applicable there, and the courts of Dubai are competent, unless mandatory law gives you other rights. If a provision is invalid, the rest remains effective."] },
      ],
    },
    imprint: {
      title: "Provider information",
      sections: [
        ...(LEGAL.demo ? [{ h: "Note", p: ["Pitchside is a non-commercial personal demo and portfolio project. No goods or paid services are offered and no revenue is generated."] }] : []),
        { h: "Provider", p: operatorLines().concat(LEGAL.representative ? [`Represented by: ${LEGAL.representative}`] : []) },
        { h: "Contact", p: [`Email: ${email}`, ...(LEGAL.phone || !LEGAL.demo ? [`Phone: ${val(LEGAL.phone)}`] : [])] },
        ...(LEGAL.register || LEGAL.vatId ? [{ h: "Registration and tax", p: [LEGAL.register ? `Registration: ${LEGAL.register}` : "", LEGAL.vatId ? `Tax registration number: ${LEGAL.vatId}` : ""].filter(Boolean) }] : []),
        { h: "Responsible for content", p: [addressLine()] },
        { h: "Liability for links", p: ["The operators of external sites we link to are solely responsible for their content. If we learn of legal violations we remove such links promptly."] },
      ],
    },
  };
}
