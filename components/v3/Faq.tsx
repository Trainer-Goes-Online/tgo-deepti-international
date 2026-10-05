import { Cta } from './Cta';

const FAQS: { q: string; a: string[] }[] = [
  {
    q: '1. Is this programme only for people with fatty liver?',
    a: [
      'Fatty liver is a key focus, but the programme looks at the bigger metabolic picture around it too.',
      'Many clients may also be working on stubborn weight, cholesterol or triglycerides, digestion, energy, blood sugar or other health markers at the same time. The goal is not to treat each concern as a completely separate problem, but to build one personalised plan around the individual.',
    ],
  },
  {
    q: '2. What makes this different from a regular weight-loss or fatty liver diet?',
    a: [
      'Most generic plans start by telling you what to eat less of.',
      'Deepti’s approach starts by understanding how your body is functioning.',
      'She combines Ayurveda with functional nutrition to look at factors such as your digestion, body type, food compatibility, daily rhythm, lifestyle and relevant health markers before building your plan.',
      'So you are not simply handed another low-calorie meal chart or “liver detox” protocol.',
    ],
  },
  {
    q: '3. How exactly are Ayurveda and functional nutrition used together?',
    a: [
      'Ayurveda helps Deepti understand the individual more deeply, including digestion, body type, food compatibility and daily rhythm.',
      'Functional nutrition adds another layer by looking at nutrient needs, food quality, lifestyle habits and relevant lab markers.',
      'Both are then brought together into one personalised food and lifestyle strategy rather than using either approach in isolation.',
    ],
  },
  {
    q: '4. I live in the US/Canada. Will I have to eat traditional Indian or Ayurvedic foods every day?',
    a: [
      'No.',
      'The plan is built around your food availability, routine, preferences and lifestyle, whether you eat Indian food, Western food or a mix of both.',
      'Ayurveda is used as a framework for personalisation, not as a requirement to eat a fixed list of traditional foods.',
    ],
  },
  {
    q: '5. Will I have to follow a very restrictive diet?',
    a: [
      'The goal is not to put you on another extreme or one-size-fits-all diet.',
      'Your recommendations are personalised around your digestion, food habits, lifestyle, health goals and individual needs, while still keeping fatty liver, weight and metabolic health in focus.',
      'The idea is to build something you can realistically follow beyond the 12 weeks.',
    ],
  },
  {
    q: '6. Do I need lab reports or a scan before joining?',
    a: [
      'No, it’s not compulsory.',
      'If you already have recent blood work, an ultrasound, FibroScan or other relevant reports, Deepti can use them to better understand your starting point and personalise the conversation.',
      'But if you don’t have recent reports, you can still book the Clarity Call and discuss your current health concerns, history and goals.',
      'If needed, the team can guide you on what information may be useful going forward.',
    ],
  },
  {
    q: '7. Will I be asked to take lots of supplements?',
    a: [
      'Not necessarily.',
      'Deepti’s approach is food-first. Her framework focuses on rebuilding the nutritional foundation first and then using supplementation more selectively where relevant, rather than starting with a generic supplement stack.',
    ],
  },
  {
    q: '8. Will this replace my doctor or my medication?',
    a: [
      'No. This programme is designed to work alongside your existing medical care, not replace it.',
      'Deepti and her team focus on personalised nutrition, lifestyle and metabolic health support, while any diagnosis, treatment or medication changes should continue to be managed by your doctor or prescribing healthcare provider.',
    ],
  },
  {
    q: '9. Will I work directly with Deepti?',
    a: [
      'Yes. Deepti is directly involved in shaping your personalised plan and reviewing your progress throughout the programme. Her qualified team supports you with implementation, follow-ups and day-to-day guidance, so you get both Deepti’s expertise and consistent support across the 12 weeks.',
    ],
  },
];

export function Faq() {
  return (
    <section className="v3-section v3-faq">
      <div className="v3-wrap v3-narrow">
        <h2 className="v3-h2" data-sdp-reveal>
          Frequently Asked Questions
        </h2>
        <div className="v3-qa">
          {FAQS.map((f) => (
            <details key={f.q} data-sdp-reveal>
              <summary>{f.q}</summary>
              <div className="v3-qa-a">
                {f.a.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
        <Cta />
      </div>
    </section>
  );
}
