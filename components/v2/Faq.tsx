const FAQS = [
  {
    q: 'Is this only for fatty liver?',
    a: 'Fatty liver is the headline, but your whole metabolism gets a seat at the table: weight, cholesterol, blood sugar, digestion, energy. One plan, not five.',
  },
  {
    q: 'How is this different from a fatty liver diet?',
    a: 'Most diets start with what to eat less of. Deepti starts with how your body is working: your digestion, body type, routine and reports. Then she builds the plan. No generic meal charts, no ‘detox’ kits.',
  },
  {
    q: 'How do Ayurveda and functional nutrition actually work together?',
    a: 'Ayurveda helps Deepti understand you: how you digest, what suits your body, when you should eat. Functional nutrition measures what’s happening: nutrients, food quality, lab markers. She combines both into one food and lifestyle plan.',
  },
  {
    q: 'I live in the US. Will I have to eat Indian food every day?',
    a: 'No. Your plan is built around your kitchen, your grocery store and your routine, whether that’s dal, salads or a bit of both. Ayurveda is the thinking behind the plan, not a fixed menu.',
  },
  { q: 'Do I have to give up chai?', a: 'No. We negotiate.' },
  {
    q: 'Will it be a restrictive diet?',
    a: 'No crash diets, no hunger strikes. The goal is a way of eating you can keep long after the 12 weeks end.',
  },
  {
    q: 'Do I need reports or a scan before joining?',
    a: 'Not to book the call. If you have recent blood work, an ultrasound or a FibroScan, bring them. If not, we start with your story and the team will tell you what’s worth checking.',
  },
  {
    q: 'Will I have to take lots of supplements?',
    a: 'Unlikely. The approach is food-first. Supplements come in only where your reports show a real need.',
  },
  {
    q: 'Will this replace my doctor or my medication?',
    a: 'No. Deepti works alongside your doctor. Never change medication without speaking to them.',
  },
  {
    q: 'Will I work directly with Deepti?',
    a: 'Yes. Deepti shapes your plan and reviews your progress herself. Her qualified team handles day-to-day support, so you’re never left waiting.',
  },
];

export function Faq() {
  return (
    <section className="dv2-section dv2-faq">
      <div className="dv2-wrap dv2-narrow">
        <h2 className="dv2-h2" data-sdp-reveal>
          Questions, answered
        </h2>
        <dl className="dv2-qa">
          {FAQS.map((f) => (
            <div key={f.q} data-sdp-reveal>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
