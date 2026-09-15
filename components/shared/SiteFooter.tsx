import Link from 'next/link';
import { business, addressLine } from '@/lib/site';

/**
 * THE SITE FOOTER. One component, every surface.
 *
 * The VSL blueprint's fifth surface. It carries four facts ON THE SITE rather
 * than buried inside one policy page: the registered entity name, the full
 * postal address, a working phone number and a working email. Every one of
 * them is read from `business` in lib/site.ts, so there is exactly one place
 * they can be corrected and no page can drift from another.
 *
 * On the India build these are there because a payment gateway's merchant
 * review looks for them. Nothing is charged here and no gateway reviews this
 * site, so they stay for the other reason they were always worth having: a
 * visitor in another country is being asked to hand their blood reports to a
 * practitioner they have never met, and a real address and a real phone number
 * are what separate that from a form on the internet. The address is Indian,
 * and it is shown in full, country included, rather than softened.
 *
 * SCOPE (skin PART 3, law 3): styled `.dp-foot`, never `.dp-policy .foot`.
 * The same markup mounts under three different roots on this build (the
 * landing page's `.sdp-root`, the policy pages' `.dp-policy`, and the
 * registration page's `.dp-reg`), and a shared component that depends on
 * where it is mounted is not shared. Its CSS lives in globals.css for the
 * same reason: that is the only stylesheet loaded on every surface.
 *
 * Every rule in that CSS is written `.dp-foot .dp-foot-x` (0,2,x) on
 * purpose. Inside `.sdp-root` the landing skin's base rules `.sdp-root p`
 * and `.sdp-root a` are (0,1,1) and would otherwise paint this footer's
 * body copy `--ink-soft` on a garnet-black band, which is the invisible-text
 * failure the skin warns about. Class-scoped rules win outright.
 *
 * ── THE FOLDED VARIANT ─────────────────────────────────────────────
 * Atul's standing rule is that the finale is the premium peak of the page
 * with the colophon folded in, and that no standalone footer band follows
 * it. The other requirement is that the four facts appear on the site.
 * Both hold at once: on the landing page this renders `folded`, which drops
 * the band (no background, no border, no padding) and sits INSIDE the
 * finale's dark stage under a fading hairline, exactly where the colophon
 * was. Nothing appears after the peak; the facts are still on the page.
 *
 * Server component.
 */
const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/refund', label: 'Refund & Cancellation' },
] as const;

export function SiteFooter({ folded = false }: { folded?: boolean }) {
  return (
    <footer className={folded ? 'dp-foot dp-foot-folded' : 'dp-foot'}>
      <div className="dp-foot-wrap">
        <p className="dp-foot-lines">
          <span className="dp-foot-entity">{business.legalName}</span>
          <br />
          Trading as {business.tradingName}
          <br />
          {addressLine}, {business.address.country}
          <br />
          <a href={`tel:${business.phoneE164}`}>{business.phone}</a>
          <span className="dp-foot-sep" aria-hidden>
            ·
          </span>
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </p>

        <nav className="dp-foot-links" aria-label="Legal">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="dp-foot-copy">
          &copy; {new Date().getFullYear()} {business.legalName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
