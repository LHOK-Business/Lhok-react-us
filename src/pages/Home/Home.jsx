// Landing.jsx
// Home / Landing page
// Mobile-first responsive layout

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

// Import images (adjust paths as needed)
import img1 from '../../assets/1.png';
import img2 from '../../assets/2.png';
import img3 from '../../assets/3.png';
import img4 from '../../assets/4.png';
import img5 from '../../assets/5.png';
import img6 from '../../assets/6.png';
import img7 from '../../assets/7.png';
import img8 from '../../assets/8.png';
import img9 from '../../assets/9.png';
import img10 from '../../assets/10.png';

function Landing() {
  const imageGridRef = useRef(null);

  // ── CAROUSEL EFFECT (React version of your vanilla JS) ──
  useEffect(() => {
    const imageGrid = imageGridRef.current;

    if (!imageGrid) return;

    const images = Array.from(imageGrid.querySelectorAll('img'));

    if (images.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = styles.scrollWrapper;

    // Add originals
    images.forEach(img => {
      wrapper.appendChild(img.cloneNode(true));
    });

    // Duplicate for seamless loop
    images.forEach(img => {
      const clone = img.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(clone);
    });

    imageGrid.innerHTML = '';
    imageGrid.appendChild(wrapper);

  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.container}>

        {/* ── LEFT SIDE (TEXT) ── */}
        <div className={styles.textSection}>
          <h1>Join Lhok Today</h1>

          <ul className={styles.textList}>
            <li>Tired of scrolling endless hashtags and DMing pros who never write back?</li>
            <li><strong>Lhok makes finding a real, local beauty professional as simple as a search by service, by location, no algorithm, no guesswork.</strong> </li>
            <li>We're building this because we felt that frustration ourselves, and we knew there had to be a better way.</li>
            <li><strong>Clients</strong>, join us and be first to search when we launch. </li>
            <li><strong>Beauty professionals</strong>, join us early your spot on Lhok is free and based on the services you offer, not content or views. </li>
          </ul>

          <Link to="/about" className={styles.ctaButton}>
            Who We Are
          </Link>
        </div>

        {/* ── RIGHT SIDE (CAROUSEL) ── */}
        <div className={styles.carouselSection}>
          <div className={styles.imageGrid} ref={imageGridRef}>
            <img src={img1} alt="Beauty service 1" />
            <img src={img2} alt="Beauty service 2" />
            <img src={img3} alt="Beauty service 3" />
            <img src={img4} alt="Beauty service 4" />
            <img src={img5} alt="Beauty service 5" />
            <img src={img6} alt="Beauty service 6" />
            <img src={img7} alt="Beauty service 7" />
            <img src={img8} alt="Beauty service 8" />
            <img src={img9} alt="Beauty service 9" />
            <img src={img10} alt="Beauty service 10" />
          </div>
        </div>

      </div>

    </div>
  );
}

export default Landing;