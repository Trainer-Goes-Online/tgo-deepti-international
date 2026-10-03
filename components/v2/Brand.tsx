import { asset } from '@/components/shared/asset-version';
import { CHAKRA_FULL, PRAKARA_ON_TEAL } from './brand-art';

/* Logo artwork from the brand guidelines. Below 48px the simplified symbol is required. */
export function Symbol({
  size,
  variant = 'teal',
  className,
}: {
  size: number;
  variant?: 'teal' | 'reversed';
  className?: string;
}) {
  const file =
    size < 48 ? 'symbol-simple' : variant === 'reversed' ? 'symbol-reversed' : 'symbol';
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={asset(`/brand/${file}.svg`)}
      alt=""
      width={size}
      height={size}
      aria-hidden
    />
  );
}

/** The Deepa Chakra, full form: the master ornament, used large in the hero. */
export function ChakraFull() {
  return <div className="dv2-chakra-wrap" aria-hidden dangerouslySetInnerHTML={{ __html: CHAKRA_FULL }} />;
}

/* The border is drawn 1040 wide; stretching its bands to 100% lets the patterns tile edge to edge. */
const PRAKARA_FLUID = PRAKARA_ON_TEAL.replace(
  'width="1040" height="112" viewBox="0 0 1040 112"',
  'width="100%" height="112"',
).replace(/width="1040"/g, 'width="100%"');

/** Prakara, the temple-wall border: the gate into the results band. */
export function Prakara() {
  return <div className="dv2-prakara" aria-hidden dangerouslySetInnerHTML={{ __html: PRAKARA_FLUID }} />;
}

/** The lotus-and-dot frieze from the brand sheets, 1px turmeric. */
export function Frieze() {
  return <div className="dv2-frieze" aria-hidden />;
}

export function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h15M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* The logo's flame (agni) as the list marker. No kumkum core: kumkum is one accent per screen. */
export function Flame({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="88 72 24 40" aria-hidden>
      <path d="M100 74 C110 86 111 99 100 109 C89 99 90 86 100 74 Z" fill="var(--dv2-turmeric)" />
    </svg>
  );
}

export function Star({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
        fill="var(--dv2-turmeric)"
      />
    </svg>
  );
}
