'use client';

/**
 * /register  ·  the free assessment.
 *
 * The India build's /checkout, with the payment taken out. It keeps that
 * page's anatomy exactly: a centred masthead, then a two-column body with the
 * form on the left and a STICKY summary on the right that collapses into a
 * tap-to-open accordion on a phone. Skinned in this project's own Garnet and
 * Gold tokens, and it declares no colour of its own: everything comes from
 * :root via app/register.css.
 *
 * WHAT IS BEING REGISTERED FOR HERE IS THE ASSESSMENT, NOT THE PROGRAMME. It
 * is free, it buys nothing, it is a consultation in which reports are reviewed
 * and the person is told honestly whether the programme suits them, and it
 * enrols nobody in anything. Every string on the page that describes it comes
 * from FAQ 1 of the copy source via ./included.ts.
 *
 * THE FLOW:
 *   mount   -> trackBeginCheckout() + trackAddToCart()
 *   submit  -> POST /api/register   (signals travel with the form)
 *           -> /book-a-call?r=<leadId>
 *
 * NO CONVERSION EVENT IS FIRED FROM THIS PAGE. Meta's `Lead` and GA4's
 * `generate_lead` are sent by /api/register, on the same request that writes
 * the record to Pabbly, so the conversion is counted when the registration
 * actually lands rather than when a button is clicked. See lib/track.ts.
 *
 * THE FORM IS THE WHOLE FUNNEL NOW. On the India build a failed submit still
 * left a paid order in Razorpay to recover from. Here, a submit that does not
 * reach /api/register is a person who is simply gone, which is why the failure
 * state below says what happened and leaves everything they typed on screen.
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { business } from '@/lib/site';
import { collectSignals } from '@/lib/client-signals';
import { trackAddToCart, trackBeginCheckout } from '@/lib/track';
import { SiteFooter } from '@/components/shared/SiteFooter';
import {
  AlertIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CheckIcon,
  LockIcon,
  ShieldCheckIcon,
} from '@/components/shared/icons';

import {
  ASSESSMENT_COVERS,
  ASSESSMENT_PROMISE,
  ASSESSMENT_TITLE,
  NOT_A_SALES_CALL,
  SCOPE_NOTE,
} from './included';

/* Dial codes carry the ISO-2 alongside them, because Meta's CAPI wants the
   COUNTRY as a hashed ISO 3166-1 alpha-2 code and not a dial code.

   ORDER AND DEFAULT ARE THE ONE REAL DIFFERENCE FROM THE INDIA BUILD'S LIST.
   There it opened on India, because that was true of nearly everyone who saw
   it. This funnel is pointed at the countries the client's own copy names,
   "700+ clients across India, USA, Canada, UK, Australia & The Middle East",
   so the list runs in that order and opens on the USA. India stays on it: an
   Indian passport holder abroad is the likeliest single visitor to this page.

   The Gulf states are listed individually because "Middle East" is not a dial
   code. No country outside the client's own sentence has been added. */
const COUNTRIES: { iso: string; dial: string; label: string }[] = [
  { iso: 'us', dial: '+1', label: 'USA (+1)' },
  { iso: 'ca', dial: '+1', label: 'Canada (+1)' },
  { iso: 'gb', dial: '+44', label: 'UK (+44)' },
  { iso: 'au', dial: '+61', label: 'Australia (+61)' },
  { iso: 'nz', dial: '+64', label: 'New Zealand (+64)' },
  { iso: 'ae', dial: '+971', label: 'UAE (+971)' },
  { iso: 'sa', dial: '+966', label: 'Saudi Arabia (+966)' },
  { iso: 'qa', dial: '+974', label: 'Qatar (+974)' },
  { iso: 'om', dial: '+968', label: 'Oman (+968)' },
  { iso: 'kw', dial: '+965', label: 'Kuwait (+965)' },
  { iso: 'bh', dial: '+973', label: 'Bahrain (+973)' },
  { iso: 'sg', dial: '+65', label: 'Singapore (+65)' },
  { iso: 'my', dial: '+60', label: 'Malaysia (+60)' },
  { iso: 'za', dial: '+27', label: 'South Africa (+27)' },
  { iso: 'in', dial: '+91', label: 'India (+91)' },
];

/* One message, two call sites, and it names an address on purpose. A submit
   that does not reach the server is a person who is simply gone on this build:
   there is no order in a gateway to recover them from. Telling them where to
   write is the only recovery route there is. */
const FAILED_MESSAGE =
  `We could not save your details. Please try again, and if it happens twice, write to ${business.email} and we will book you in by hand.`;

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string; // ISO-2
  phone: string;
};

export default function RegisterPage() {
  const [f, setF] = useState<Fields>({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: 'us',
    phone: '',
  });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  /* The handoff acknowledgement, ported from the India checkout.
     THE REASON IS STRONGER HERE, not weaker, even though nothing is paid.
     On the India build a buyer who closes the tab has at least parted with
     ₹97 and has a reason to come back. Here they have parted with nothing,
     so a registration that never becomes a booking is the leak this whole
     funnel is built to avoid (see the note at the top of /book-a-call).
     Asking for the tick is what makes "you are not finished yet" land
     before they submit rather than after. */
  const [ack, setAck] = useState(false);

  /* ARRIVAL. GA4 gets begin_checkout, Meta gets AddToCart.
     The conversion deliberately does NOT fire here: it waits for the
     submission to actually reach the server, which is a far stronger signal
     than a page load and is what the ads optimise on.

     This is also the ONLY Meta event a DIRECT arrival ever gets. Someone who
     opens /register from an email, a retargeting ad or a bookmark never
     touches the landing page, so without this they are invisible to Meta until
     they submit. Ref-guarded so StrictMode's double effect and a remount
     cannot inflate the count. */
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current) return;
    arrived.current = true;
    trackBeginCheckout();
    trackAddToCart();
  }, []);

  const v = useMemo(() => {
    const digits = f.phone.replace(/\D/g, '');
    return {
      firstName: f.firstName.trim().length > 1,
      lastName: f.lastName.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()),
      city: f.city.trim().length > 1,
      /* The dial code comes from the picker, so this validates the SUBSCRIBER
         number only: 7 to 12 digits covers every country in the list without
         pulling in libphonenumber-js. India is the strict case at exactly 10. */
      phone: f.country === 'in' ? digits.length === 10 : digits.length >= 7 && digits.length <= 12,
    };
  }, [f]);
  const valid = v.firstName && v.lastName && v.email && v.city && v.phone;

  const dial = COUNTRIES.find((c) => c.iso === f.country)?.dial ?? '+1';
  /* E.164 without the plus, which is what Meta expects. */
  const e164 = `${dial}${f.phone}`.replace(/\D/g, '');

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFailed('');
    if (!valid || !ack || busy) return;
    setBusy(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim(),
          phone: e164,
          city: f.city.trim(),
          country: f.country,
          ...collectSignals(),
        }),
      });
      const out = await res.json();

      if (!res.ok || !out?.ok) {
        setBusy(false);
        setFailed(FAILED_MESSAGE);
        return;
      }

      /* The registration id rides to the calendar exactly as the payment id
         used to, so the booking can be keyed back to this person. */
      window.location.href = `/book-a-call?r=${encodeURIComponent(out.leadId)}`;
    } catch {
      setBusy(false);
      setFailed(FAILED_MESSAGE);
    }
  };

  return (
    <div className="dp-reg">
      <section className="pay-body">
        <div className="wrap">
          <div className="pay-mast">
            <span className="pay-pill">
              <ShieldCheckIcon size={13} />
              {NOT_A_SALES_CALL}
            </span>
            <h1>
              Your <em>{ASSESSMENT_TITLE}</em>
            </h1>
            <p className="pay-deck">{ASSESSMENT_PROMISE}</p>
          </div>

          <div className="pay-grid">
            <form id="reg-form" className="pay-card" onSubmit={register} noValidate>
              <p className="pay-eyebrow">YOUR DETAILS</p>
              <h2>Where should we reach you?</h2>
              <p className="pay-hint">
                Deepti&rsquo;s team uses these to arrange your assessment and to
                send you your booking details.
              </p>

              {/* THE ONE INSTRUCTION THAT HAS TO LAND BEFORE SUBMITTING.

                  THE INDIA WORDING DOES NOT TRANSFER. There the note says
                  "don't close this page after paying, wait up to 10 seconds",
                  because Razorpay's handler is what navigates and the payment
                  sheet takes that long to settle. Neither fact is true here:
                  nothing is paid, and the gap is one call to /api/register.
                  Reusing that sentence would describe a wait that does not
                  happen and a payment that does not exist.

                  What IS true, and is the whole point of this page, is that
                  registering is not finishing. The slot is. */}
              <div className="pay-note" role="note">
                <span className="pay-note-chip" aria-hidden>
                  <AlertIcon size={13} />
                </span>
                <p>
                  <strong>
                    Registering does not book your assessment.
                  </strong>{' '}
                  The moment you submit this form you will be taken to a
                  calendar to pick your date and time. Your assessment is only
                  confirmed once you have a slot, so please don&rsquo;t close
                  this page before you choose one.
                </p>
              </div>

              <div className="pay-fields">
                {/* First and last are SEPARATE fields, not one "Full name"
                    split on a space. Splitting guesses: it hands a two-word
                    surname to the first name, and gives a single-word entry no
                    last name at all. Meta hashes fn and ln independently, so a
                    bad guess is a permanently worse match, not a cosmetic one. */}
                <div className="pay-two">
                  <Field
                    label="First name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={f.firstName}
                    onChange={(x) => setF((s) => ({ ...s, firstName: x }))}
                    bad={touched && !v.firstName}
                  />
                  <Field
                    label="Last name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={f.lastName}
                    onChange={(x) => setF((s) => ({ ...s, lastName: x }))}
                    bad={touched && !v.lastName}
                  />
                </div>

                <Field
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={f.email}
                  onChange={(x) => setF((s) => ({ ...s, email: x }))}
                  bad={touched && !v.email}
                  note="Your booking confirmation and assessment details go here."
                />

                {/* City and country are on this form because they are Meta
                    match keys (ct and country), and city hashing strips spaces
                    and punctuation, so "New Jersey" and "newjersey" hash the
                    same. Every field on this form is here to be SENT, not to
                    be collected: a field that raises no match quality and
                    drives no segment does not belong on a free form either.
                    Country does one more job here than it did on the India
                    build: it is what stops an overseas visitor being reported
                    to Meta as Indian, and it sets the time zone conversation
                    the assessment call has to have. */}
                <Field
                  label="Town / City"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Your town or city"
                  value={f.city}
                  onChange={(x) => setF((s) => ({ ...s, city: x }))}
                  bad={touched && !v.city}
                />

                <label>
                  <span className="f-label">WhatsApp number</span>
                  <div className="pay-phone">
                    <select
                      autoComplete="tel-country-code"
                      aria-label="Country dialling code"
                      value={f.country}
                      onChange={(e) => setF((s) => ({ ...s, country: e.target.value }))}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="Your number"
                      value={f.phone}
                      onChange={(e) => setF((s) => ({ ...s, phone: e.target.value }))}
                      aria-invalid={(touched && !v.phone) || undefined}
                    />
                  </div>
                  <span className="f-note">
                    Deepti&rsquo;s team will contact you on this number.
                  </span>
                </label>
              </div>

              {/* The same promise as the note above, asked for rather than
                  told, at the moment of submitting. Its own line of error text
                  and not the fields' one: "add your name and a valid number"
                  is useless feedback to someone whose only miss is the tick. */}
              <label className="pay-ack">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  aria-invalid={(touched && !ack) || undefined}
                />
                <span>
                  I understand that I need to{' '}
                  <strong>pick a date and time on the next page</strong> to
                  confirm my assessment.
                </span>
              </label>

              {touched && !valid && (
                <p className="pay-error">
                  Please add your name, a working email, your city and a valid
                  number.
                </p>
              )}
              {touched && valid && !ack && (
                <p className="pay-error">
                  Please tick the box above so we know to expect you on the
                  booking page.
                </p>
              )}
              {failed && <p className="pay-error">{failed}</p>}

              <button type="submit" className="pay-cta" disabled={busy}>
                <span>
                  {busy ? 'Saving your details' : 'Claim My Free Assessment'}
                </span>
                <span className="arrow" aria-hidden>
                  <ArrowRightIcon size={13} />
                </span>
              </button>

              {/* THE THREE POINTERS. House standard under every form CTA. On
                  the India build these were the payment reassurances: gateway,
                  encryption, and a link to the refund policy. There is no
                  payment here, so the first two become the two things a reader
                  of a free form actually wants to know, and the third stays a
                  LINK rather than a claim, because what happens to a health
                  record is a policy question and not a badge. */}
              <div className="pay-points">
                <span>
                  <LockIcon />
                  No card needed
                </span>
                <span className="sep" aria-hidden>
                  &middot;
                </span>
                <span>Takes under a minute</span>
                <span className="sep" aria-hidden>
                  &middot;
                </span>
                <span>
                  <Link href="/privacy">How we handle your details</Link>
                </span>
              </div>

              <p className="pay-privacy">
                Your personal data is used to arrange your assessment and for the
                purposes described in our{' '}
                <Link href="/privacy">privacy policy</Link>. Your health
                information is handled under the same policy.
              </p>
            </form>

            <div className="pay-sum-col">
              <OrderSummary />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE MOBILE DOCKED BAR (2026-09-19, Atul) ──────────────────────
          Below 1000px the layout is one column and the summary column stops
          being sticky, so the action scrolls away while the fields are being
          filled. This puts it back.

          IT SUBMITS, IT DOES NOT LINK. The landing page's sticky bar sends
          someone to /register, which is where this reader already is. This
          one is a real submit button for the form via `form="reg-form"`, so
          it routes through the same handler, the same validation and the same
          busy guard: one path, not two to keep in step. It has to live
          OUTSIDE the form to be position:fixed without inheriting its
          stacking context, which is exactly what the `form` attribute is for.

          NO PRICE ON THIS BAR, unlike the India build's. There the bar's
          left-hand figure is the ₹97 total, because once the summary has
          scrolled off it is the only place the price appears. Nothing is
          charged here, so a figure would have to be invented to fill the
          space. The label carries the offer instead. */}
      <div className="pay-stuck">
        <div className="pay-stuck-inner">
          <span className="pay-stuck-fig">
            <span className="pay-stuck-cap">Your assessment</span>
            <strong>Free</strong>
          </span>
          <button
            type="submit"
            form="reg-form"
            className="pay-stuck-go"
            disabled={busy}
          >
            <span>{busy ? 'Saving your details' : 'Claim my free assessment'}</span>
            <span className="arrow" aria-hidden>
              <ArrowRightIcon size={12} />
            </span>
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

/**
 * THE SUMMARY.
 *
 * ── THERE IS NO PRICING ON THIS PAGE AT ALL (Atul, 2026-09-15) ────────
 * Not a fee, not a struck-through figure, not the word Free against the line
 * item, and not a Total band. A free offer does not need a total, and a total
 * reading "Free" is pricing furniture standing where a price used to be: it
 * makes the reader do the subtraction the page should have spared them.
 *
 * The one place it is still said is where a reader actually asks it, under the
 * button and in the "Nothing to pay" row below, as a fact about what happens
 * next rather than as a figure.
 *
 * It is KEPT on a free page, rather than dropped as the thing that only made
 * sense beside a charge. It was never an order summary: it is the answer to
 * "what am I actually signing up for", and that question is asked harder, not
 * less, when the answer costs nothing.
 *
 * Accordion below 1000px, always open above it. The toggle keeps its
 * aria-expanded on both, because the CSS hides the caret rather than removing
 * the button, and a screen reader on a wide viewport should not be told about
 * a control that does nothing (hence pointer-events: none on the desktop rule
 * and the details being unconditionally visible there).
 */
function OrderSummary() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sum">
      <button
        type="button"
        className="sum-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="sum-details"
      >
        <span>
          <span className="sum-kicker">YOUR ASSESSMENT</span>
          <span className="sum-title">What you are signing up for</span>
          <span className="sum-tap">
            {open ? 'Tap to hide the details' : 'Tap to see what is included'}
          </span>
        </span>
        <span className="sum-caret" aria-hidden>
          <CaretDownIcon />
        </span>
      </button>

      {/* The lead item, always visible on every viewport: it is the thing
          being signed up for, and it is the only line on the page.

          The tile used to read "1 of 1", which is order-summary language on a
          page that no longer has an order. A mark instead: the tile was always
          doing the visual job of anchoring the row, and the count was never
          telling anybody anything. */}
      <div className="sum-lead">
        <span className="sum-lead-chip" aria-hidden>
          <CheckIcon size={20} />
        </span>
        <span className="sum-lead-body">
          <b>{ASSESSMENT_TITLE}</b>
          <span>With Deepti and her team of qualified nutritionists</span>
        </span>
      </div>

      <div id="sum-details" className={open ? 'sum-details open' : 'sum-details'}>
        <p className="sum-sub">WHAT IS REVIEWED IN IT</p>
        <ul className="sum-covers">
          {ASSESSMENT_COVERS.map((c) => (
            <li key={c}>
              <span className="ck" aria-hidden>
                <CheckIcon size={10} />
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sum-method">
        <ShieldCheckIcon />
        <span>
          <b>Nothing to pay</b>
          <span>No card details are asked for on this page.</span>
        </span>
      </div>

      <div className="sum-scope">
        <b>WHAT THIS COVERS</b>
        <p>{SCOPE_NOTE}</p>
      </div>
    </div>
  );
}

/**
 * One field. Kept as a component so every input carries the same label
 * treatment, the same error state and the same focus ring, and so a new field
 * cannot be added with a different one.
 */
function Field({
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  bad,
  note,
}: {
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  note?: string;
}) {
  return (
    <label>
      <span className="f-label">{label}</span>
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={bad || undefined}
      />
      {note && <span className="f-note">{note}</span>}
    </label>
  );
}
