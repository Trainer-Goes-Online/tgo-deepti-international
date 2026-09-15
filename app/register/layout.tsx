import type { Metadata } from 'next';

/* The route's own stylesheet, loaded from the LAYOUT rather than the page:
   the page is a client component, and every other route on this build loads
   its CSS from a server file. Scoped `.dp-reg`, token-only. */
import '../register.css';

/**
 * The registration page carries its own metadata because its page is a client
 * component and a client component cannot export `metadata`.
 *
 * noindex is permanent here, not a pre-launch setting. A form in a search
 * result is a page somebody lands on with no idea what they are signing up
 * for, and it splits the funnel's own analytics.
 */
export const metadata: Metadata = {
  title: 'Claim your free assessment',
  description: 'Register for your free personalised health assessment.',
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
