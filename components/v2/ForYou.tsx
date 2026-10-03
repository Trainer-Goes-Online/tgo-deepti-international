import { Flame } from './Brand';

const ITEMS = [
  'Your scan said ‘fatty liver’, and you’d like that to be the last plot twist.',
  'The scale used to respond to effort. Now it just stares back.',
  'Your cholesterol, triglycerides or liver enzymes have started a slow uphill hike.',
  'Weight, digestion, energy and reports all seem to be moving together, in the wrong direction.',
  'You’ve done the diets, the gym, the detox teas and the supplement cupboard. You’ve earned a plan, not another trend.',
  'You want one plan for the whole you, not five experts who’ve never met each other.',
];

export function ForYou() {
  return (
    <section className="dv2-section dv2-foryou">
      <div className="dv2-wrap dv2-narrow">
        <h2 className="dv2-h2" data-sdp-reveal>
          This is for you if…
        </h2>
        <ul className="dv2-ticks">
          {ITEMS.map((t) => (
            <li key={t} data-sdp-reveal>
              <Flame />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="dv2-honest" data-sdp-reveal>
          <b>The honest bit.</b> Fatty liver is common and usually quiet. Quiet is good news: it
          means there&apos;s time to work on it. It&apos;s also exactly why it&apos;s worth not
          waiting.
        </p>
      </div>
    </section>
  );
}
