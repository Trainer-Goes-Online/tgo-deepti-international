const STEPS = [
  { lead: 'The Clarity Call (15 min):', text: 'your story, your reports, honest fit check.' },
  {
    lead: 'Week 1, the deep dive:',
    text: 'digestion, body type, routine, labs. Think of it as a very friendly investigation.',
  },
  {
    lead: 'Weeks 2–12, the plan:',
    text: 'warm, real food built around what you actually eat, in India, the US or anywhere in between. Adjusted as your body responds.',
  },
  { lead: 'Week 12, the proof:', text: 'we re-check your markers. Numbers, not vibes.' },
];

export function HowItWorks() {
  return (
    <section className="dv2-section dv2-how">
      <div className="dv2-wrap dv2-narrow">
        <h2 className="dv2-h2" data-sdp-reveal>
          How it works
        </h2>
        <ol className="dv2-steps">
          {STEPS.map((s, i) => (
            <li key={s.lead} data-sdp-reveal>
              <span className="dv2-step-n" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p>
                <b>{s.lead}</b> {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
