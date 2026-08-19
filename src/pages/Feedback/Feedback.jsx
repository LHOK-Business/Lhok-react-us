// ============================================
// FEEDBACK SURVEY PAGE
// Low-barrier-to-entry page: no login required, quick to fill out.
// Collects feedback on how people find, trust, and choose beauty
// professionals. Submits straight to Firestore ('feedback' collection).
// ============================================

import React, { useState } from 'react';
import FormTextarea from '../../components/FormTextarea/FormTextarea';
import FormInput    from '../../components/FormInput/FormInput';
import Button       from '../../components/Button/Button';
import styles       from './Feedback.module.css';

import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { getCountryOfOrigin } from '../../utils/countryOfOrigin';

// ── OPTIONS ───────────────────────────────────────────────────
const FIND_METHOD_OPTIONS = [
  'Word of mouth (friends/family)',
  'Instagram',
  'TikTok',
  'Google Search / Reviews',
  'Facebook Groups',
  'Booking app (StyleSeat, Vagaro, Fresha, etc.)',
  'Saw them in person / walked by',
  'Other',
];

const TRUST_SIGNAL_OPTIONS = [
  'Online reviews & ratings',
  'Recommendation from someone I know',
  'Before/after photos or portfolio',
  'Listed experience/certifications',
  'Fast, clear communication',
  'Active social media presence',
  'Other',
];

const FRUSTRATION_OPTIONS = [
  'Scheduling / finding available times',
  'Finding professionals I can trust',
  'Finding the right location',
  'Finding the right services offered',
  'Finding the right price',
  "Not knowing if they're accepting new clients",
  'Slow or unclear communication',
  'Remembering details from my last appointment',
  'Cancellations / no-shows',
  'Other',
];

const PRIORITY_OPTIONS = [
  'Price',
  'Quality of service / results',
  'Reviews & ratings',
  'Personality / vibe',
  'Location / convenience',
  'Availability / scheduling flexibility',
  'Experience / qualifications',
  'Cleanliness & hygiene',
  'Portfolio (before/after photos)',
  'Other',
];

// ── PILL QUESTION ─────────────────────────────────────────────
// mode="single" → `selected` is a string, tapping a pill replaces it
// mode="multi"  → `selected` is an array, tapping toggles membership
// Selecting "Other" reveals a free-text input for that question.
function PillQuestion({ label, options, mode, selected, onToggle, otherValue, onOtherChange }) {
  const isSelected = (opt) => (mode === 'single' ? selected === opt : selected.includes(opt));
  const showOtherInput = mode === 'single' ? selected === 'Other' : selected.includes('Other');

  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.pillGrid}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={styles.pill + (isSelected(opt) ? ' ' + styles.pillActive : '')}
          >
            {opt}
          </button>
        ))}
      </div>
      <p className={styles.hint}>{mode === 'multi' ? 'Select all that apply' : 'Select one'}</p>
      {showOtherInput && (
        <input
          type="text"
          value={otherValue}
          onChange={onOtherChange}
          placeholder="Please specify..."
          className={styles.otherInput}
        />
      )}
    </div>
  );
}

function Feedback() {
  const [form, setForm] = useState({
    findMethod:         '',
    findMethodOther:    '',
    trustSignals:       [],
    trustSignalsOther:  '',
    frustrations:       [],
    frustrationsOther:  '',
    priorities:         [],
    prioritiesOther:    '',
    otherFeedback:      '',
    email:              '',
  });
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();

  const handleTextChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSingleSelect = (field) => (opt) =>
    setForm(prev => ({ ...prev, [field]: prev[field] === opt ? '' : opt }));

  const handleMultiToggle = (field) => (opt) =>
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(opt)
        ? prev[field].filter(v => v !== opt)
        : [...prev[field], opt],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        ...form,
        countryOfOrigin: getCountryOfOrigin(),
        createdAt: serverTimestamp(),
      });

      setForm({
        findMethod: '', findMethodOther: '',
        trustSignals: [], trustSignalsOther: '',
        frustrations: [], frustrationsOther: '',
        priorities: [], prioritiesOther: '',
        otherFeedback: '', email: '',
      });
      showToast('Thanks for your feedback!', 'success');
    } catch (error) {
      console.error('Firebase error:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Quick Feedback</h1>
        <p className={styles.subtitle}>
          No account needed — just a few quick questions about your experience
          finding beauty professionals.
        </p>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <PillQuestion
            label="How do you usually find beauty professionals right now?"
            options={FIND_METHOD_OPTIONS}
            mode="single"
            selected={form.findMethod}
            onToggle={handleSingleSelect('findMethod')}
            otherValue={form.findMethodOther}
            onOtherChange={handleTextChange('findMethodOther')}
          />

          <PillQuestion
            label="What makes you trust a new beauty professional you haven't used before?"
            options={TRUST_SIGNAL_OPTIONS}
            mode="multi"
            selected={form.trustSignals}
            onToggle={handleMultiToggle('trustSignals')}
            otherValue={form.trustSignalsOther}
            onOtherChange={handleTextChange('trustSignalsOther')}
          />

          <PillQuestion
            label="What's most frustrating about finding and booking an appointment?"
            options={FRUSTRATION_OPTIONS}
            mode="multi"
            selected={form.frustrations}
            onToggle={handleMultiToggle('frustrations')}
            otherValue={form.frustrationsOther}
            onOtherChange={handleTextChange('frustrationsOther')}
          />

          <PillQuestion
            label="What matters most when choosing a beauty professional?"
            options={PRIORITY_OPTIONS}
            mode="multi"
            selected={form.priorities}
            onToggle={handleMultiToggle('priorities')}
            otherValue={form.prioritiesOther}
            onOtherChange={handleTextChange('prioritiesOther')}
          />

          <FormTextarea
            label="Anything else you'd like to share? (Optional)"
            id="otherFeedback"
            value={form.otherFeedback}
            onChange={handleTextChange('otherFeedback')}
            placeholder="Tell us more about your experience"
            maxLength={500}
          />

          <FormInput
            label="Email (Optional — if you'd like us to follow up)"
            id="email"
            type="email"
            value={form.email}
            onChange={handleTextChange('email')}
            placeholder="your.email@example.com"
          />

          <div className={styles.buttonRow}>
            <Button
              label={submitting ? 'Submitting...' : 'Submit Feedback'}
              type="submit"
              disabled={submitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Feedback;