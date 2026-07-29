// ============================================
// LOGIN PAGE
// Toggles between Sign In and Sign Up modes.
// Uses Firebase Auth for email/password and Google sign-in.
//
// KEY CHANGE FROM PREVIOUS VERSION:
// On Sign Up, we now immediately create a Firestore document
// for the new user using their first and last name.
// This means when they visit Profile.jsx, their name is already there.
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

// ── NEW: Import Firestore tools to create the initial user document
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { auth, googleProvider, db } from '../../firebase/config';
import FormInput from '../../components/FormInput/FormInput';
import Button    from '../../components/Button/Button';
import styles    from './Login.module.css';
import { useToast } from '../../context/ToastContext';

function Login() {
  // ── STATE ──────────────────────────────────────────────────
  // Controls whether we show Sign In or Sign Up form
  const [isSignUp, setIsSignUp] = useState(false);

  // All form fields in one object — easier to manage than separate useState calls
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
  });

  // Disables buttons while Firebase is working to prevent double-clicks
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const showToast = useToast();

  // ── AUTH REDIRECT ──────────────────────────────────────────
  // If user is already logged in when they visit /login, send them to dashboard
  // useEffect runs once on mount, onAuthStateChanged fires whenever auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard');
    });
    // Cleanup: stop listening when component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // ── FIELD HANDLER ──────────────────────────────────────────
  // One function handles all fields. (field) returns a function that handles (e)
  // Example: handleChange('email') returns (e) => setForm({...form, email: e.target.value})
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  // ── TOGGLE SIGN IN / SIGN UP ───────────────────────────────
  // Resets form when switching modes
  const handleToggle = () => {
    setIsSignUp(prev => !prev);
    setForm({ firstName: '', lastName: '', email: '', password: '' });
  };

  // ── VALIDATION ─────────────────────────────────────────────
  // Returns an error string if invalid, or null if all good
  const validate = () => {
    if (isSignUp && !form.firstName.trim()) return 'First name is required';
    if (isSignUp && !form.lastName.trim())  return 'Last name is required';
    if (!form.email.trim())                 return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email))  return 'Enter a valid email';
    if (!form.password)                     return 'Password is required';
    if (form.password.length < 8)           return 'Password must be at least 8 characters';
    return null;
  };

  // ── EMAIL/PASSWORD SUBMIT ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    const validationError = validate();
    if (validationError) { showToast(validationError, 'warning'); return; }

    setLoading(true);
    try {
      if (isSignUp) {
        // ── SIGN UP FLOW ──────────────────────────────────────

        // Step 1: Create the Firebase Auth account (email + password)
        // This gives us a userCredential object with a .user property
        const userCredential = await createUserWithEmailAndPassword(
          auth, form.email, form.password
        );

        // Step 2: Set the display name on the Auth profile
        // This is stored in Firebase Auth (not Firestore) — used for quick access
        const fullName = `${form.firstName} ${form.lastName}`;
        await updateProfile(userCredential.user, { displayName: fullName });

        // ── NEW: Step 3 — Create initial Firestore document ──
        // doc(db, 'collection', 'documentId') — we use the user's UID as the document ID
        // This links the Firestore profile to the Firebase Auth account
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          // Basic identity fields populated from signup form
          displayName: fullName,
          email:       form.email,

          // userType defaults to professional — user can change this in Profile.jsx
          // Once saved once, this gets locked so they can't accidentally switch
          userType: 'professional',

          // Approval fields — professionals need admin approval to appear on community page
          // Clients don't need approval but we set these for consistency
          approved:   false,
          approvedAt: null,

          // Empty fields — user fills these in on the Profile page
          bio:              '',
          location:         '',
          instagram:        '',
          website:          '',
          profilePhotoURL:  null,

          // Professional-specific empty fields
          specialties:      [],
          yearsInIndustry:  '',
          preferredContact: '',

          // Client-specific empty fields
          servicesLookingFor: [],

          // Timestamps — serverTimestamp() uses Firebase's server clock (not the user's device)
          // This is more reliable than new Date() which depends on the user's system time
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        // ── END NEW BLOCK ──────────────────────────────────────

        // onAuthStateChanged will detect the new login and redirect to /dashboard

      } else {
        // ── SIGN IN FLOW ──────────────────────────────────────
        // Just authenticate — no Firestore writes needed
        await signInWithEmailAndPassword(auth, form.email, form.password);
        // onAuthStateChanged handles the redirect to /dashboard
      }

    } catch (err) {
      // Convert Firebase error codes to friendly messages
      showToast(friendlyError(err.code), 'error');
    } finally {
      // Always re-enable the button, whether success or failure
      setLoading(false);
    }
  };

  // ── GOOGLE SIGN-IN ─────────────────────────────────────────
  // signInWithPopup opens a Google popup window
  // Note: Google sign-in does NOT create a Firestore doc here.
  // If you want Google sign-ups to also create a doc, that logic
  // would need to be added here similarly to the email sign-up above.
  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      showToast(friendlyError(err.code), 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── FRIENDLY ERROR MESSAGES ────────────────────────────────
  // Firebase returns error codes like 'auth/wrong-password'
  // We convert these to readable sentences for the user
  const friendlyError = (code) => {
    switch (code) {
      case 'auth/user-not-found':       return 'No account found with this email';
      case 'auth/wrong-password':       return 'Incorrect password';
      case 'auth/email-already-in-use': return 'An account with this email already exists';
      case 'auth/weak-password':        return 'Password must be at least 8 characters';
      case 'auth/invalid-email':        return 'Invalid email address';
      case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled';
      default:                          return 'Something went wrong. Please try again.';
    }
  };

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Title changes based on mode */}
        <h1 className={styles.title}>{isSignUp ? 'Create Account' : 'Sign In'}</h1>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {/* First + Last name — only shown in Sign Up mode */}
          {/* The && operator means: "if isSignUp is true, render what follows" */}
          {isSignUp && (
            <>
              <FormInput
                label="First Name"
                id="firstName"
                value={form.firstName}
                onChange={handleChange('firstName')}
                placeholder="First Name"
              />
              <FormInput
                label="Last Name"
                id="lastName"
                value={form.lastName}
                onChange={handleChange('lastName')}
                placeholder="Last Name"
              />
            </>
          )}

          <FormInput
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="Enter email address"
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Enter password"
          />

          {/* Toggle between Sign In and Sign Up */}
          <button
            type="button"
            onClick={handleToggle}
            className={styles.toggleButton}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>

          {/* Submit button — label changes based on mode and loading state */}
          <Button
            label={loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            type="submit"
            disabled={loading}
          />

          {/* OR divider between email and Google options */}
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* Google sign-in button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className={styles.googleButton}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className={styles.googleIcon}
            />
            Continue with Google
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;