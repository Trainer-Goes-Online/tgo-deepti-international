const ITEMS = [
  'Your scan or recent reports have shown fatty liver, and you want to start working on it before it progresses further.',
  'You’re also dealing with stubborn weight that isn’t responding the way it used to.',
  'Your cholesterol, triglycerides, liver enzymes or other metabolic markers have started moving in the wrong direction.',
  'Weight, digestion, energy and health markers all seem to be getting affected together.',
  'You’ve tried dieting, exercising, detoxes or supplements, but still don’t have a clear plan built around your body.',
  'You want a personalised approach that takes your digestion, lifestyle, food habits and health markers into account.',
  'You want to improve fatty liver, weight and metabolic health together, not chase each problem separately.',
];

export function ForYou() {
  return (
    <section className="v3-section v3-foryou">
      <div className="v3-wrap v3-narrow">
        <h2 className="v3-h2" data-sdp-reveal>
          This Is For You If...
        </h2>
        <ul className="v3-checks">
          {ITEMS.map((t) => (
            <li key={t} data-sdp-reveal>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="var(--v3-teal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
