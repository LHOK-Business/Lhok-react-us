import React, { useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './BetaBanner.module.css';

const DISMISS_KEY = 'lhok_beta_banner_dismissed';

/* Fixed strip above the Header announcing beta status.
   --banner-height (index.css) drives the Header's top offset, the mobile
   menu's top offset, and the Toast stack's top offset — dismissing this
   zeroes that variable out so everything below reclaims the space. */
function BetaBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === 'true'
  );

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--banner-height',
      dismissed ? '0px' : '48px'
    );
  }, [dismissed]);

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className={styles.banner}>
      <p className={styles.message}>
        <span className={styles.fullText}>
          🚧 Lhok is in Beta — thanks for being an early user.
        </span>
        <span className={styles.shortText}>🚧 Lhok is in Beta.</span>
        {' '}
        <Link to="/feedback" className={styles.feedbackLink}>Share feedback</Link>
      </p>
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss beta banner"
      >
        ×
      </button>
    </div>
  );
}

export default BetaBanner;
