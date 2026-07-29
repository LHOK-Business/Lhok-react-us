import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import SocialButton from '../SocialButton/SocialButton';
import styles from './Footer.module.css';

// ─────────────────────────────────────────────
// LINK DATA
// Kept as arrays (not hardcoded JSX) so you edit
// this list once and both desktop columns AND
// mobile condensed footer stay in sync automatically.
// ─────────────────────────────────────────────
const EXPLORE_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'About Us',   to: '/about' },
  { label: 'Find a Pro', to: '/professionals' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Feedback',   to: '/feedback' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',     to: '/privacy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

// ─────────────────────────────────────────────
// MOBILE TAB BAR DATA
// This is the fixed bottom nav. Only 4-5 items —
// mobile screens are narrow, so this list is
// intentionally shorter than EXPLORE_LINKS.
// Each item needs: a label, a route (`to`), and
// an icon. Using plain inline SVGs here so you
// don't need to install an icon library — swap
// these for lucide-react/react-icons any time.
// ─────────────────────────────────────────────
const TAB_ITEMS = [
  {
    label: 'Home',
    to: '/',
    end: true, // NavLink "end" prop — only exact "/" matches, so it doesn't
               // stay highlighted on every route (NavLink matches by prefix otherwise)
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: 'Find a Pro',
    to: '/professionals',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: 'Feedback',
    to: '/feedback',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
];

function Footer() {
  // Computed once per render — used in the copyright line
  const currentYear = new Date().getFullYear();

  return (
    // React Fragment (<>) lets us return TWO sibling elements
    // (the <footer> and the tab bar <nav>) without wrapping
    // them in an extra unnecessary <div>.
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>

          {/* ══════════════════════════════════════════
              DESKTOP: 4-COLUMN LAYOUT
              Hidden entirely on mobile via CSS
              (.columnsRow { display: none } in the media query).
              We don't conditionally render this in JS —
              it's cheaper/simpler to let CSS hide it, and it
              avoids any layout flash when resizing.
              ══════════════════════════════════════════ */}
          <div className={styles.columnsRow}>

            {/* Column 1 — Explore */}
            <div className={styles.column}>
              <h3 className={styles.columnHeading}>Explore</h3>
              <nav className={styles.linkList}>
                {EXPLORE_LINKS.map((link) => (
                  <Link key={link.label} to={link.to} className={styles.navLink}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 2 — Legal */}
            <div className={styles.column}>
              <h3 className={styles.columnHeading}>Legal</h3>
              <nav className={styles.linkList}>
                {LEGAL_LINKS.map((link) => (
                  <Link key={link.label} to={link.to} className={styles.navLink}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3 — Get Started */}
            <div className={styles.column}>
              <h3 className={styles.columnHeading}>Get Started</h3>
              <Link to="/login" className={styles.ctaButton}>
                Join Lhok
              </Link>
            </div>

            {/* Column 4 — Follow Us */}
            <div className={styles.column}>
              <h3 className={styles.columnHeading}>Follow Us</h3>
              <div className={styles.socialRow}>
                <SocialButton
                  platform="instagram"
                  href="https://www.instagram.com/lhok.ca/"
                />
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════
              MOBILE: CONDENSED LINK ROW
              Only visible on mobile (CSS shows it there).
              Just the legal links — the "Explore" links
              (Home/About/etc.) are covered by the tab bar
              instead, so we don't repeat them here.
              ══════════════════════════════════════════ */}
          <nav className={styles.mobileLinks}>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className={styles.mobileNavLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── DIVIDER ── (shared by both layouts) */}
          <div className={styles.divider} />

          {/* ── COPYRIGHT ── (shared by both layouts) */}
          <p className={styles.copyright}>
            © {currentYear} LHOK Inc. All rights reserved.
          </p>

        </div>
      </footer>

      {/* ══════════════════════════════════════════
          MOBILE: FIXED BOTTOM TAB BAR
          Rendered as a sibling to <footer>, NOT inside it.
          This is intentional — it needs `position: fixed`
          relative to the viewport, not the footer's container,
          so it always sticks to the bottom of the screen
          regardless of scroll position.
          Hidden on desktop via CSS (display: none by default,
          only shown inside the mobile media query).
          ══════════════════════════════════════════ */}
      <nav className={styles.tabBar} aria-label="Primary mobile navigation">
        {TAB_ITEMS.map(({ label, to, icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            // NavLink gives us `isActive` for free — no manual
            // "is this the current page" logic needed.
            className={({ isActive }) =>
              isActive ? `${styles.tabItem} ${styles.tabItemActive}` : styles.tabItem
            }
          >
            {icon}
            <span className={styles.tabLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default Footer;