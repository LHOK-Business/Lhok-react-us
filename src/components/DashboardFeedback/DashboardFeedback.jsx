// ============================================
// DASHBOARD FEEDBACK WIDGET
// Lightweight in-app poll shown to signed-in users on /dashboard.
// Submits to the 'dashboardFeedback' Firestore collection (rules already
// exist for it: signed-in create, admin-only read).
// ============================================

import React, { useState } from 'react';
import FormTextarea from '../FormTextarea/FormTextarea';
import Button        from '../Button/Button';
import styles         from './DashboardFeedback.module.css';

import { auth, db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { getCountryOfOrigin } from '../../utils/countryOfOrigin';

// ── OPTIONS ───────────────────────────────────────────────────
const SATISFACTION_OPTIONS = [
  'Very satisfied',
  'Satisfied',
  'Neutral',
  'Unsatisfied',
  'Very unsatisfied',
];

const WORKING_WELL_OPTIONS = [
  'Finding professionals',
  'Booking / scheduling',
  'Profile & messaging',
  'Overall design',
  'Other',
];

const IMPROVEMENT_OPTIONS = [
  'Finding professionals',
  'Booking / scheduling',
  'Profile & messaging',
  'Missing features',
  'Slow / buggy',
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
      {mode === 'multi' && <p className={styles.hint}>Select all that apply</p>}
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

function DashboardFeedback() {
  const [form, setForm] = useState({
    satisfaction:       '',
    workingWell:        [],
    workingWellOther:   '',
    improvements:       [],
    improvementsOther:  '',
    otherFeedback:      '',
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
      await addDoc(collection(db, 'dashboardFeedback'), {
        uid: auth.currentUser?.uid,
        ...form,
        region:    getCountryOfOrigin(),
        createdAt: serverTimestamp(),
      });

      setForm({
        satisfaction: '',
        workingWell: [], workingWellOther: '',
        improvements: [], improvementsOther: '',
        otherFeedback: '',
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
    <div className={styles.section}>
      <h2 className={styles.title}>Quick Feedback</h2>
      <p className={styles.subtitle}>Help us improve your experience on Lhok.</p>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <PillQuestion
          label="How satisfied are you with your experience on Lhok so far?"
          options={SATISFACTION_OPTIONS}
          mode="single"
          selected={form.satisfaction}
          onToggle={handleSingleSelect('satisfaction')}
        />

        <PillQuestion
          label="What's working well for you?"
          options={WORKING_WELL_OPTIONS}
          mode="multi"
          selected={form.workingWell}
          onToggle={handleMultiToggle('workingWell')}
          otherValue={form.workingWellOther}
          onOtherChange={handleTextChange('workingWellOther')}
        />

        <PillQuestion
          label="What's frustrating or could be improved?"
          options={IMPROVEMENT_OPTIONS}
          mode="multi"
          selected={form.improvements}
          onToggle={handleMultiToggle('improvements')}
          otherValue={form.improvementsOther}
          onOtherChange={handleTextChange('improvementsOther')}
        />

        <FormTextarea
          label="Anything else you'd like to share? (Optional)"
          id="otherFeedback"
          value={form.otherFeedback}
          onChange={handleTextChange('otherFeedback')}
          placeholder="Tell us more"
          maxLength={500}
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
  );
}

export default DashboardFeedback;
