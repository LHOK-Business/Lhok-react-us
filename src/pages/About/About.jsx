// About.jsx
// About / Brand story page
// Mobile-first responsive layout

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

function About() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>About Lhok</p>
          <h1>Why we're building this</h1>
        </section>

        {/* ── PROBLEM / STORY ── */}
        <section className={styles.story}>
          <p>
            Right now, finding a great beauty professional means scrolling through
            endless hashtags, hoping a name jumps out. Then it's DMing a handful of
            pros and waiting &mdash; sometimes days &mdash; for a reply that might
            not come. If one does, you're screenshotting availability back and
            forth, with no real way to book, no way to know if they're even still
            taking clients. And if you're the professional, getting seen usually
            means paying for ads or gaming a feed that has nothing to do with your
            skill.
          </p>

          <p>
            We built Lhok because we lived that frustration as clients, over and
            over, until it was clear the process itself was broken &mdash; not
            just for us, but for everyone stuck scrolling and DMing into the void.
            Lhok exists to fix that. We're building a place where clients can
            search by service and location, not luck &mdash; and where beauty
            professionals get found because of what they do and where they are,
            not what they can afford to spend on visibility.
          </p>

          <p className={styles.callout}>
            We're early. Lhok is in the building stage right now, and we're
            inviting beauty professionals to help shape it from the ground up.
          </p>
        </section>

        {/* ── MISSION / VISION ── */}
        <section className={styles.pillars}>
          <div className={styles.pillarCard}>
            <h2>Our Mission</h2>
            <p>
              To replace the scroll-and-DM grind with a simple, transparent,
              direct way to find real, trusted, local beauty professionals
              &mdash; and to make sure beauty professionals are found for their
              work, not for what they can pay for placement or how well they
              play an algorithm.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <h2>Our Vision</h2>
            <p>
              A future where every independent beauty professional has a fair,
              visible presence, searchable by service and location, and every
              client can find the right person nearby in minutes. Discovery
              should be based on what you do and where you are &mdash; never on
              what you can afford to spend or how much content you can output.
            </p>
          </div>
        </section>

        {/* ── DIFFERENTIATORS ── */}
        <section className={styles.difference}>
          <h2 className={styles.differenceHeading}>What Makes Lhok Different</h2>

          <div className={styles.differenceGrid}>
            <div className={styles.differenceCard}>
              <span className={styles.tag}>For Clients</span>
              <p>
                Search by service and location, and see real local professionals
                &mdash; not whoever paid the most to show up first or has the
                most views.
              </p>
            </div>

            <div className={styles.differenceCard}>
              <span className={styles.tag}>For Beauty Professionals</span>
              <p>
                Your visibility is free, always. No ad spend, no boosted posts,
                no algorithm deciding who gets seen this week. You show up
                because of what you offer and where you are, full stop.
              </p>
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA ── */}
        <section className={styles.cta}>
          <h2>Help Us Build It</h2>
          <p>
            We're building Lhok with the professionals who'll use it &mdash;
            join us early and help shape what fair discovery in the beauty
            industry should look like.
          </p>
          <Link to="/feedback" className={styles.ctaButton}>
            Educate Us
          </Link>
        </section>

      </div>
    </main>
  );
}

export default About;
