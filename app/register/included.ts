/**
 * What is actually being registered for on this page, and the one place it is
 * declared.
 *
 * ── THE ASSESSMENT IS FREE, SO THIS FILE DECLARES NO MONEY AT ALL ─────
 * The India build sells it for ninety-seven rupees and exports the label, the
 * number and the paise. There is nothing here: no price, no "Free" label, no
 * value. Atul, 2026-09-15: "its for free so no pricing would be needed."
 *
 * That is a stronger instruction than it first reads. Swapping ₹97 for the
 * word Free leaves every piece of pricing furniture standing (a price column,
 * a total, a figure in a tinted band) with a word in it instead of a number,
 * and a reader still has to work out what they are being charged in order to
 * learn that they are not. So the furniture goes, and the page says it once,
 * in words, where it is actually asked.
 *
 * ── AND STILL NO VALUE STACK ──────────────────────────────────────────
 * The house checkout carries a lead item plus a bonus list with a value
 * against each line, a struck-through total and a computed VALUE_TOTAL.
 * Nobody has priced anything inside this consultation, and a free offer is
 * exactly where the temptation to write "worth $500" is strongest. It would
 * be inventing a client fact on a live page. If Deepti ever wants a value
 * framing, she has to supply the number.
 *
 * ── EVERY STRING BELOW IS THE CLIENT'S OWN ────────────────────────────
 * All of it comes from FAQ 1 of funnel-copy/01-landing-vsl.md, which is the
 * only place in the source that describes what the assessment is. The list
 * is that answer's own comma-separated list, split at its own commas and in
 * its own order, with no word added and none removed. Nothing here was
 * written fresh, because a description of what a consultation includes is a
 * commercial promise, not copywriting.
 */

/** The client's phrase, from FAQ 1: "This is a personalised health assessment." */
export const ASSESSMENT_TITLE = 'Personalised Health Assessment';

/**
 * FAQ 1, sentence two, split at the source's own commas:
 * "Deepti and her team will understand your current weight, health reports,
 *  symptoms, eating habits, lifestyle, medical history and previous
 *  weight-loss efforts to identify what may be keeping you stuck."
 */
export const ASSESSMENT_COVERS: string[] = [
  'Your current weight',
  'Your health reports',
  'Your symptoms',
  'Your eating habits',
  'Your lifestyle',
  'Your medical history',
  'Your previous weight-loss efforts',
];

/** FAQ 1, sentence three, verbatim. */
export const ASSESSMENT_PROMISE =
  "The goal is to help you understand your current health picture and whether Deepti's programme is the right next step for you. If the programme genuinely isn't the right fit, we'll tell you honestly. No pressure. No unnecessary selling.";

/** FAQ 1, sentence one, verbatim. */
export const NOT_A_SALES_CALL = 'This is not a sales call.';

/**
 * THE SCOPE LINE, and the most load-bearing sentence on this page.
 *
 * On the India build this sentence prevents a chargeback: a buyer who pays the
 * fee and believes they have joined the 12-week programme. Nothing is charged
 * here, so there is no chargeback to prevent, and the sentence stays anyway
 * because the misunderstanding it prevents is the same one and it costs the
 * client the same call: somebody arriving at their assessment believing they
 * are already enrolled.
 *
 * It states only what the client stated: the assessment is a consultation, the
 * programme is a separate decision made afterwards. It deliberately does NOT
 * say what the programme costs or how long it runs, because neither is
 * confirmed on this build.
 */
export const SCOPE_NOTE =
  'The assessment is free, and it is only the assessment. It does not enrol you in the 12-week programme. If the programme turns out to be right for you, joining it is a separate decision you make afterwards.';
