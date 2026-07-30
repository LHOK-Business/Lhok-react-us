import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './Professionals.module.css';

const getInitials = (name) => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  return words.length === 1
    ? words[0][0].toUpperCase()
    : (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const copyToClipboard = (text, onSuccess) => {
  navigator.clipboard.writeText(text)
    .then(onSuccess)
    .catch(() => alert('Could not copy email'));
};

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const WebsiteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const exampleProfile = {
  id: 'example-vvsglow',
  displayName: 'VVS Glow',
  specialties: ['Lash Extensions', 'Permanent Jewelry', 'Facials'],
  bio: 'Lash extensions, permanent jewelry, and facials — serving Miami and Toronto.',
  location: 'Miami & Toronto',
  instagram: 'https://www.instagram.com/vvsglow/',
};

function ProfileCard({ user }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    copyToClipboard(user.email, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.card}>

      <div className={styles.avatarWrapper}>
        {user.profilePhotoURL ? (
          <img
            src={user.profilePhotoURL}
            alt={user.displayName}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.initials}>
            {getInitials(user.displayName)}
          </div>
        )}
      </div>

      <h3 className={styles.name}>{user.displayName || 'Anonymous'}</h3>

      {user.specialties && user.specialties.length > 0 && (
        <div className={styles.specialties}>
          {user.specialties.map(s => (
            <span key={s} className={styles.specialty}>{s}</span>
          ))}
        </div>
      )}

      {user.bio && (
        <p className={styles.bio}>"{user.bio}"</p>
      )}

      <div className={styles.infoSection}>
        {user.yearsInIndustry && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Experience:</span>
            <span className={styles.infoValue}>{user.yearsInIndustry} years</span>
          </div>
        )}
        {user.location && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>General Location:</span>
            <span className={styles.infoValue}>{user.location}</span>
          </div>
        )}
        {user.preferredContact && (
          <div className={styles.infoRow}>
            <span className={styles.infoValue}>Contact via {user.preferredContact}</span>
          </div>
        )}
      </div>

      <div className={styles.socialIcons}>
        {user.instagram && (
          <a
            href={user.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon + ' ' + styles.iconInstagram}
            title="Instagram"
          >
            <InstagramIcon />
          </a>
        )}
        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon + ' ' + styles.iconWebsite}
            title="Website"
          >
            <WebsiteIcon />
          </a>
        )}
        {user.email && (
          <button
            onClick={handleCopyEmail}
            className={styles.socialIcon + ' ' + styles.iconEmail}
            title={copied ? 'Copied!' : 'Copy email'}
          >
            <EmailIcon />
            {copied && <span className={styles.copiedTooltip}>Copied!</span>}
          </button>
        )}
      </div>

    </div>
  );
}

function Professionals() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('approved', '==', true),
      orderBy('approvedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        setProfiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError('Error loading profiles: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Start Lhoking</h1>
        <p className={styles.subtitle}>Available professionals</p>
      </div>

      <div className={styles.exampleSection}>
        <p className={styles.exampleCaption}>
          ✨ See what your profile could look like when you join Lhok
        </p>
        <div className={styles.exampleWrapper}>
          <ProfileCard user={exampleProfile} />
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading profiles...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {!loading && !error && profiles.length === 0 && (
        <div className={styles.empty}>
          No profiles available yet. Check back soon!
        </div>
      )}

      {!loading && profiles.length > 0 && (
        <div className={styles.grid}>
          {profiles.map(user => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Professionals;