/*
  Header.jsx — Mobile-first layout structure
  ─────────────────────────────────────────────
  MOBILE:   [logo] ············· [hamburger]
              ↑ flex row, margin-left:auto on hamburger pushes it right
              nav + login/avatar are display:none in CSS

  DESKTOP (≥768px via CSS):
            [logo] [── nav ──] [login or avatar]
              ↑ hamburger becomes display:none in CSS

  The mobile menu is rendered in the React fragment OUTSIDE <header>
  so it can be position:fixed in CSS without a stacking-context conflict.
*/

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import styles from './Header.module.css';
import logo from '../../assets/lhoklogo.png';

/* Add new top-level pages here — both desktop nav and mobile menu
   pick them up automatically. */
const NAV_ITEMS = [
  { label: 'Contact Us',    to: '/contact' },
  { label: 'Professionals', to: '/professionals' },
  { label: 'Feedback',      to: '/feedback' },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  /* Listen to Firebase auth state — runs once on mount, cleans up on unmount */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  /* Pull initials from displayName (e.g. "Jane Doe" → "JD"), fall back to email[0] */
  const getInitials = (user) => {
    if (user.displayName) {
      const parts = user.displayName.trim().split(' ');
      return parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  /* NavLink className helpers — React Router passes { isActive } to the function */
  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const getMobileNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.mobileNavLink} ${styles.navLinkActive}` : styles.mobileNavLink;

  return (
    <>
      {/* ── FIXED HEADER BAR ─────────────────────────────────────────────
          position:fixed is set in CSS (.header). The bar always stays
          at the top of the viewport during scroll. */}
      <header className={styles.header}>

        {/* ── CONTAINER — flex row ──────────────────────────────────────
            On mobile:  [logo] + margin-left:auto on hamburger → logo left, hamburger right
            On desktop: [logo] [nav flex:1] [login/avatar] — hamburger hidden by CSS */}
        <div className={styles.container}>

          {/* ── LOGO ──────────────────────────────────────────────────── */}
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="LHOK" className={styles.logoImage} />
          </Link>

          {/* ── DESKTOP NAV ───────────────────────────────────────────────
              CSS: display:none on mobile, display:flex on desktop (≥768px).
              To add a page: add an entry to NAV_ITEMS at the top of this file. */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} to={item.to} className={getNavLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── LOGIN or AVATAR (desktop only) ────────────────────────────
              CSS: display:none on mobile — these appear in the mobile menu instead.
              Logged in  → circular initials badge → /Dashboard
              Logged out → outlined Login button  → /login */}
          {currentUser ? (
            <Link to="/Dashboard" className={styles.avatarButton}>
              {getInitials(currentUser)}
            </Link>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
          )}

          {/* ── HAMBURGER (mobile only) ────────────────────────────────────
              CSS: display:flex on mobile, display:none on desktop (≥768px).
              margin-left:auto in CSS pushes it to the right edge.
              aria-expanded tells screen readers whether the menu is open. */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

        </div>
      </header>

      {/* ── MOBILE MENU ───────────────────────────────────────────────────
          Rendered outside <header> to avoid stacking-context issues.
          CSS (.mobileMenu) uses position:fixed + top:var(--header-height)
          to pin it flush against the bottom of the header bar — no inline
          style needed here. JSX controls visibility via conditional render. */}
      {isMobileMenuOpen && (
        <nav className={styles.mobileMenu}>

          {/* Nav links — close the menu on tap so the page change is smooth */}
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={getMobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {/* Login / My Profile at the bottom of the mobile menu */}
          {currentUser ? (
            <Link
              to="/profile"
              className={styles.mobileLoginButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {getInitials(currentUser)} — My Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className={styles.mobileLoginButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}

        </nav>
      )}
    </>
  );
}

export default Header;
