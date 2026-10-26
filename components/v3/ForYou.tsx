import { Em } from './Em';

const ITEMS = [
  'Your scan or recent reports have shown **fatty liver**, and you want to start working on it before it progresses further.',
  'You’re also dealing with **stubborn weight** that isn’t responding the way it used to.',
  'Your **cholesterol, triglycerides, liver enzymes or other metabolic markers** have started moving in the wrong direction.',
  'You’ve tried **dieting, exercising, detoxes or supplements**, but still don’t have a clear plan built around your body and lifestyle.',
  'You want an approach that accounts for your **digestion, Indian eating patterns, life in the US & Canada and health markers**.',
  'You want to work on the **bigger metabolic picture**, not chase every concern separately.',
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
              <span>
                <Em text={t} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
