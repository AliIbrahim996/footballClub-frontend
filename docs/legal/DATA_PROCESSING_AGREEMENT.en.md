# Data Processing Agreement – template

> **Template, not legal advice.** Have it reviewed by a lawyer and fill in the `[bracketed]` placeholders.
> To be concluded between the club (controller) and the operator of Pitchside (processor) **before** the club enters any player data.

**Controller:** [club name, legal form, address, authorised representative, email] – "the Club"
**Processor:** [operator name/company, address, email] – "the Processor"

## 1. Subject matter and duration
1.1 The Processor provides the Club with the "Pitchside" software (player management, skill ratings, tactical plans, team invitations, plan share links) and processes personal data on the Club's behalf.
1.2 This agreement applies for as long as the club account is used and ends with its termination (see section 9).

## 2. Nature, purpose, data and data subjects
| | |
|---|---|
| Nature of processing | storing, displaying, changing, deleting, exporting, backing up |
| Purpose | organising the Club's play, training and match preparation |
| Types of data | name, address, date of birth, phone, email, club membership, photo, skill ratings, notes/comments, tactical plans; account and usage data of club users |
| Data subjects | players (including **minors**), coaches and other club users |
| Special categories (Art. 9) | not intended. The Club does not enter health data. |

## 3. Instructions
3.1 The Processor processes data only on the Club's documented instructions (this agreement, use of the software, individual written instructions), unless required by law.
3.2 If the Processor considers an instruction unlawful it informs the Club without undue delay.

## 4. Controller's responsibilities
The Club is responsible for lawfulness: legal basis, information duties, **parental consent for minors (especially for photos)**, data minimisation and a deletion concept. The Club answers data subject requests.

## 5. Processor's obligations
5.1 **Confidentiality:** everyone authorised to process data is bound to confidentiality.
5.2 **Security (Art. 32):** the Processor implements and maintains the measures in Annex 1.
5.3 **Assistance:** the Processor assists with data subject rights (Arts. 12–22), security, breach notifications and impact assessments as required by the nature of the processing.
5.4 **Breaches:** the Processor notifies the Club of personal data breaches **without undue delay** so the Club can meet the 72-hour deadline of Art. 33, and provides the information available.
5.5 **Records:** the Processor keeps a record of processing activities as a processor (Art. 30(2)).

## 6. Sub-processors
6.1 The Club authorises the sub-processors listed in Annex 2.
6.2 The Processor announces changes in text form at least [30] days in advance. The Club may object on important data protection grounds; otherwise the change is deemed approved. If no agreement is reached either party may terminate at the end of the current period.
6.3 Sub-processors are bound by the same obligations as set out here.

## 7. Transfers to third countries
Processing outside the EU/EEA only takes place if Arts. 44 et seq. GDPR are met (for example an adequacy decision or EU standard contractual clauses).

## 8. Audit rights
The Processor provides the information needed to demonstrate compliance and allows audits, including by auditors appointed by the Club, on reasonable notice and without disproportionate disruption.

## 9. Return and deletion
After termination the Processor provides an export of the data on request and then deletes all of the Club's data, including copies and backups, within [30/60] days unless a legal retention duty applies. On request it confirms deletion in text form.

## 10. Liability and final provisions
Liability follows the applicable data protection law and the terms of use. The governing law is [governing law, e.g. the laws of the Emirate of Dubai and the UAE federal laws applicable there]. Amendments require text form. In case of conflict this agreement prevails over the terms of use.

Place, date: ______________  Club: ______________  Processor: ______________

---

## Annex 1 – Technical and organisational measures (example: adapt to reality)
- **Confidentiality:** role-based access (owner/coach/viewer); data of different clubs is logically separated (every record belongs to exactly one club and every query is restricted to it); passwords stored only as hashes; sign-in session in an httpOnly cookie; rate limiting of sign-in attempts.
- **Integrity:** encrypted transport (HTTPS/TLS); record of who changed ratings; input validation.
- **Availability/resilience:** regular database backups [frequency, retention]; restore tests [frequency].
- **Separation:** test and production environments are separate; automated tests never run against production data.
- **Secrets:** no credentials in source code; managed in the host's secret manager.
- **Organisation:** [confidentiality undertakings, access rights, data breach procedure, deletion concept, training].

## Annex 2 – Sub-processors (fill in)
| Company / seat | Service | Processing location | Safeguards |
|---|---|---|---|
| [Hosting provider] | application hosting | [region] | [DPA / SCC] |
| [Database provider] | PostgreSQL | [region] | [DPA / SCC] |
| [Storage provider] | file storage (photos, plan images) | [region] | [DPA / SCC] |
| [Email provider] | sending invitation emails | [region] | [DPA / SCC] |
