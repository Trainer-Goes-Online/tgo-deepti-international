import type { Metadata } from 'next';
import '../legal.css';
import { LegalPage, type Clause } from '@/components/legal/LegalPage';
import { business } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: `Refunds, cancellations and the results guarantee for ${business.legalName}.`,
  robots: { index: false, follow: false },
};

const UPDATED = '15 September 2026';

/* THE DISTINCTION THIS PAGE EXISTS TO MAKE.
   The landing copy's "100% Results Guarantee" is NOT a money-back guarantee.
   It promises continued support at no additional cost until you see
   measurable progress. A reader who meets the words "100% guarantee" on the
   landing page and assumes "100% refund" is the single most likely source of
   a complaint here, so clause 01 separates the two in plain words before
   anything else is said.

   ── WHY THIS PAGE STILL EXISTS ON A BUILD THAT CHARGES NOTHING ──────
   Because the guarantee does. The India build's version has two jobs: it
   states the assessment fee's refund terms for a payment gateway, and it keeps
   the results guarantee apart from a money-back promise. The first job is
   gone, there is no fee and no gateway, and the clause that carried it now
   says so in one sentence instead. The second job is why the page is still
   linked from every footer: the guarantee is on the landing page of this build
   too, and a reader who has understood it as "my money back" needs somewhere
   that says otherwise.

   The programme's own refund terms are commercial terms nobody has confirmed,
   so they render as a PENDING callout rather than as invented prose. The
   programme is still sold, off this site, so this remains a real open item and
   not a leftover. */
const CLAUSES: Clause[] = [
  {
    id: 'not-money-back',
    heading: 'The results guarantee is not a money-back guarantee',
    nav: 'Not a money-back guarantee',
    body: (
      <>
        <p>
          Our 100% Results Guarantee promises our continued work, not your money
          back. If you do not see measurable progress in your weight and health
          by the end of your programme, despite consistently following your
          personalised plan, we continue supporting you at no additional cost
          until you do.
        </p>
        <p>
          That is a promise to keep working with you. It is a different thing
          from a refund, and the rest of this page sets out when a refund is
          available instead.
        </p>
      </>
    ),
  },
  {
    id: 'guarantee-conditions',
    heading: 'What the guarantee asks of you',
    nav: 'What the guarantee asks',
    body: (
      <>
        <p>The guarantee applies where you have:</p>
        <ul>
          <li>
            completed the full programme and followed your personalised nutrition
            and lifestyle plan consistently;
          </li>
          <li>attended your scheduled check-ins and submitted progress updates on time;</li>
          <li>
            communicated with {business.legalName} and her nutritionists when
            work, travel, health or life got in the way, so your plan could be
            adjusted.
          </li>
        </ul>
        <p>
          We ask for these because a plan that was not followed cannot tell us
          anything about whether it works. We will look at your check-in history
          and progress updates when a claim is made.
        </p>
      </>
    ),
  },
  {
    id: 'the-assessment-is-free',
    heading: 'The assessment is free',
    nav: 'The assessment is free',
    body: (
      <>
        <p>
          There is nothing to refund on the assessment, because there is nothing
          to pay for it. This website takes no payments at all: it asks for your
          details, it books you a time, and no card is requested at any point.
        </p>
        <p>
          If a page, an email or an advertisement ever asks you to pay for the
          assessment itself, it did not come from us. Tell us at{' '}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'programme-fee',
    heading: 'The programme fee',
    body: (
      <p>
        The programme is the only thing that is ever paid for, it is arranged
        directly with us after your assessment and not through this website, and
        where a refund is due under this policy it is issued to the original
        payment method.
      </p>
    ),
    pending: (
      <>
        The programme refund terms are not confirmed. We need: (a) is there a
        cooling-off window after joining, and how long; (b) what happens if a
        client stops part-way through; (c) is any part of the fee non-refundable
        once the personalised plan has been built and delivered. The programme
        length is also unresolved, since the landing copy says 12 weeks and the
        registered trading name says 90 days, and a refund window is measured
        against it. On THIS build there is one more: a client in the UK, the EEA
        or Australia has statutory cancellation rights that an Indian policy
        does not grant by default, and those rights are measured from the day
        they join.
      </>
    ),
  },
  {
    id: 'if-we-cancel',
    heading: 'If we cancel',
    body: (
      <p>
        If we cancel your assessment we will offer you another time, and you
        have paid nothing either way. If we cannot deliver your programme, you
        get a full refund of what you paid for the part we did not deliver. If
        we end a programme part-way through for a reason that is not your fault,
        we refund the unused portion of your fee.
      </p>
    ),
  },
  {
    id: 'medical-reasons',
    heading: 'Medical reasons',
    body: (
      <p>
        If your doctor advises you not to continue for a medical reason, tell us
        as soon as you can. We will pause your programme so you can resume when
        you are able, or discuss a refund of the unused portion with you. We would
        rather hold your place than have you continue against medical advice.
      </p>
    ),
  },
  {
    id: 'how-to-ask',
    heading: 'How to ask for a refund',
    body: (
      <>
        <p>
          Email <a href={`mailto:${business.email}`}>{business.email}</a> from
          the address you registered with, telling us your name, the date you
          paid for your programme and what you are asking for. You can also
          reach us on <a href={`tel:${business.phoneE164}`}>{business.phone}</a>,
          which is an Indian number: if you are calling from abroad, an email is
          usually faster.
        </p>
        <p>
          We will acknowledge your request within 3 working days and tell you our
          decision, with reasons, within 7 working days.
        </p>
      </>
    ),
  },
  {
    id: 'when-it-reaches-you',
    heading: 'When an approved refund reaches you',
    nav: 'When it reaches you',
    body: (
      <p>
        Once approved, we issue the refund to your original payment method within
        7 working days. How long it then takes to appear depends on your bank or
        card issuer, and on an international payment it is usually a further 5 to
        10 working days. We will send you the refund reference when it is issued.
        Any currency conversion or transfer charge your own bank applies is
        outside our control and is not part of the refund.
      </p>
    ),
  },
  {
    id: 'questions-and-complaints',
    heading: 'Questions and complaints',
    body: (
      <p>
        If you are unhappy with a decision, reply to us and say so. We would
        rather resolve it directly. Our full business details, including our
        registered address and jurisdiction, are below.
      </p>
    ),
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="Refund & Cancellation"
      title={
        <>
          Refunds, cancellations and the <em>guarantee</em>
        </>
      }
      updated={UPDATED}
      lede={
        <p>
          The assessment is free, so nothing on it is refundable because nothing
          is paid. Our 100% Results Guarantee promises that we keep working with
          you, not that we return your money. Those are two different things and
          this page keeps them apart, then sets out when a refund on the
          programme is available, how to ask for one and how long it takes to
          arrive.
        </p>
      }
      clauses={CLAUSES}
      close={{
        heading: (
          <>
            Asking for a <em>refund</em>
          </>
        ),
        body: 'Write from the address you registered with and tell us your name, the date you paid for your programme and what you are asking for. We acknowledge within 3 working days and decide within 7.',
      }}
    />
  );
}
