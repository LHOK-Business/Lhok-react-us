import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MobileTabBar.module.css';

/* Simple inline SVG icons — no external package needed */
const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const UsersIcon = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FeedbackIcon = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const TABS = [
  { label: 'Home',        to: '/',            Icon: HomeIcon   },
  { label: 'Search',      to: '/search',       Icon: SearchIcon },
  { label: 'Communities', to: '/communities',  Icon: UsersIcon  },
  { label: 'Feedback',    to: '/feedback',     Icon: FeedbackIcon },
  { label: 'Contact',     to: '/contact',      Icon: MailIcon   },
];

function MobileTabBar() {
  return (
    <nav className={styles.tabBar} aria-label="Primary mobile navigation">
      {TABS.map(({ label, to, Icon }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            isActive ? `${styles.tabItem} ${styles.active}` : styles.tabItem
          }
          end={to === '/'}
        >
          <Icon />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileTabBar;