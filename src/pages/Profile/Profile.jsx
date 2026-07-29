// ============================================
// UPDATE PROFILE PAGE
// Loads existing profile from Firestore and lets user edit it.
// Supports two user types: Professional and Client.
//
// USER TYPE FLOW:
//   1. On first visit: show radio selection card (not locked yet)
//   2. After first save: show branded "I am a..." card (locked)
//
// The flag `userTypeConfirmed` in Firestore tracks whether the user
// has explicitly chosen their type. At signup it is false (system default).
// It becomes true the first time the user saves their profile.
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../firebase/config';
import FormInput    from '../../components/FormInput/FormInput';
import FormTextarea from '../../components/FormTextarea/FormTextarea';
import FormSelect   from '../../components/FormSelect/FormSelect';
import Button       from '../../components/Button/Button';
import styles       from './Profile.module.css';
import { useToast } from '../../context/ToastContext';

// ── DROPDOWN OPTIONS ──────────────────────────────────────────
const SPECIALTY_OPTIONS = [
  'Lashes', 'Haircuts', 'Hair Coloring', 'Nails', 'Facials',
  'Massage', 'Makeup', 'Waxing', 'Skincare', 'Brows',
];

const SERVICES_LOOKING_FOR_OPTIONS = [
  'Lashes', 'Haircuts', 'Hair Coloring', 'Nails', 'Facials',
  'Massage', 'Makeup', 'Waxing', 'Skincare', 'Brows',
];

const YEARS_OPTIONS = [
  { value: '0-1',   label: 'Less than 1 year' },
  { value: '1-2',   label: '1-2 years' },
  { value: '3-5',   label: '3-5 years' },
  { value: '6-10',  label: '6-10 years' },
  { value: '11-15', label: '11-15 years' },
  { value: '16-20', label: '16-20 years' },
  { value: '20+',   label: '20+ years' },
];

const CONTACT_OPTIONS = [
  { value: 'Email',     label: 'Email' },
  { value: 'Phone',     label: 'Phone' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Website',   label: 'Website' },
];

// ── COMPONENT ─────────────────────────────────────────────────
function Profile() {
  const navigate = useNavigate();

  // The currently logged-in Firebase Auth user
  const [currentUser, setCurrentUser] = useState(null);

  // ── USER TYPE STATE ────────────────────────────────────────
  // 'professional' or 'client'
  const [userType, setUserType] = useState('professional');

  // userTypeConfirmed: true = user has explicitly saved their type before
  // false = system default from signup, user hasn't confirmed yet
  // This is what controls whether we show the selector or the locked card
  const [userTypeConfirmed, setUserTypeConfirmed] = useState(false);

  // ── SHARED FORM FIELDS ─────────────────────────────────────
  const [form, setForm] = useState({
    displayName: '',
    bio:         '',
    location:    '',
    instagram:   '',
  });

  // ── PROFESSIONAL-ONLY FIELDS ───────────────────────────────
  const [proForm, setProForm] = useState({
    website:          '',
    yearsInIndustry:  '',
    preferredContact: '',
    specialties:      [],
  });

  // ── CLIENT-ONLY FIELDS ─────────────────────────────────────
  const [clientForm, setClientForm] = useState({
    servicesLookingFor: [],
  });

  // ── PHOTO STATE ────────────────────────────────────────────
  const [photoURL,      setPhotoURL]      = useState(null);
  const [photoFile,     setPhotoFile]     = useState(null);
  const [photoPreview,  setPhotoPreview]  = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // ── UI STATE ───────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  // ── AUTH CHECK ─────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadProfileData(user.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ── LOAD PROFILE DATA ──────────────────────────────────────
  // Reads Firestore doc and populates all form state
  const loadProfileData = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc    = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        // ── User type loading ──
        // userTypeConfirmed === true means user has explicitly chosen before
        // Only lock the UI if they've confirmed it previously
        if (data.userType) setUserType(data.userType);
        setUserTypeConfirmed(data.userTypeConfirmed === true);

        // ── Shared fields ──
        setForm({
          displayName: data.displayName || '',
          bio:         data.bio         || '',
          location:    data.location    || '',
          instagram:   data.instagram   || '',
        });

        // ── Professional fields ──
        setProForm({
          website:          data.website          || '',
          yearsInIndustry:  data.yearsInIndustry  || '',
          preferredContact: data.preferredContact || '',
          specialties:      data.specialties      || [],
        });

        // ── Client fields ──
        setClientForm({
          servicesLookingFor: data.servicesLookingFor || [],
        });

        // ── Photo ──
        if (data.profilePhotoURL) {
          setPhotoURL(data.profilePhotoURL);
          setPhotoPreview(data.profilePhotoURL);
        }

      }
    } catch (error) {
      showToast('Error loading profile: ' + error.message, 'error');
    }
  };

  // ── FIELD HANDLERS ─────────────────────────────────────────
  const handleChange    = (field) => (e) => setForm(prev    => ({ ...prev, [field]: e.target.value }));
  const handleProChange = (field) => (e) => setProForm(prev => ({ ...prev, [field]: e.target.value }));

  // Toggles a value in/out of an array (used for pill selectors)
  const handleSpecialtyToggle = (val) => {
    setProForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(val)
        ? prev.specialties.filter(s => s !== val)
        : [...prev.specialties, val],
    }));
  };

  const handleServiceToggle = (val) => {
    setClientForm(prev => ({
      ...prev,
      servicesLookingFor: prev.servicesLookingFor.includes(val)
        ? prev.servicesLookingFor.filter(s => s !== val)
        : [...prev.servicesLookingFor, val],
    }));
  };

  // ── PHOTO HANDLERS ─────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be smaller than 5MB', 'warning'); return; }
    if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'warning'); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(photoURL || null);
  };

  // ── UPLOAD PHOTO ───────────────────────────────────────────
  const uploadPhoto = (file, userId) => new Promise((resolve, reject) => {
    const ext        = file.name.split('.').pop();
    const storageRef = ref(storage, `profile-pictures/${userId}/profile_${Date.now()}.${ext}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => { resolve(await getDownloadURL(uploadTask.snapshot.ref)); setUploadProgress(null); }
    );
  });

  // ── DELETE OLD PHOTO ───────────────────────────────────────
  const deleteOldPhoto = async (url) => {
    if (!url) return;
    try {
      await deleteObject(ref(storage, decodeURIComponent(url.split('/o/')[1].split('?')[0])));
    } catch (e) { console.error('Old photo delete failed (non-critical):', e); }
  };

  // ── SAVE PROFILE ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      // Upload new photo if selected
      let newPhotoURL = photoURL;
      if (photoFile) {
        newPhotoURL = await uploadPhoto(photoFile, currentUser.uid);
        await deleteOldPhoto(photoURL);
        setPhotoURL(newPhotoURL);
        setPhotoFile(null);
      }

      // Shared data saved for all user types
      const sharedData = {
        displayName:       form.displayName,
        bio:               form.bio,
        location:          form.location,
        instagram:         form.instagram,
        profilePhotoURL:   newPhotoURL || null,
        userType:          userType,
        // ── KEY FLAG ──
        // userTypeConfirmed: true means the user explicitly chose their type
        // We write this on every save so older accounts get upgraded too
        userTypeConfirmed: true,
        updatedAt:         serverTimestamp(),
      };

      // Type-specific data
      const typeData = userType === 'professional'
        ? {
            website:          proForm.website,
            yearsInIndustry:  proForm.yearsInIndustry,
            preferredContact: proForm.preferredContact,
            specialties:      proForm.specialties,
          }
        : {
            servicesLookingFor: clientForm.servicesLookingFor,
          };

      const profileData = { ...sharedData, ...typeData };

      // Check if doc exists to decide create vs update
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc    = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, profileData);
        showToast('Profile updated successfully!', 'success');
      } else {
        // Fallback: create doc if signup somehow didn't create it
        await setDoc(userDocRef, {
          ...profileData,
          email:      currentUser.email,
          approved:   userType === 'professional' ? false : undefined,
          approvedAt: userType === 'professional' ? null  : undefined,
          createdAt:  serverTimestamp(),
        });
        showToast(
          userType === 'professional'
            ? 'Profile created! Awaiting admin approval.'
            : 'Profile created successfully!',
          'success'
        );
      }

      // Lock the user type in local state after successful save
      setUserTypeConfirmed(true);

    } catch (error) {
      showToast('Error saving profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.title}>Update Your Profile</h1>

        {currentUser && (
          <p className={styles.loggedIn}>
            Logged in as: <strong>{currentUser.email}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {/* ── USER TYPE SELECTOR ── */}
          {/* 
            Two states:
            A) userTypeConfirmed === false → show radio selection card
            B) userTypeConfirmed === true  → show locked branded card
          */}
          {!userTypeConfirmed ? (

            // ── A: Not yet confirmed — show selection card ──
            // Matches the design in the screenshot exactly
            <div className={styles.userTypeCard}>
              <label className={styles.userTypeTitle}>
                I am a: <span className={styles.required}>*</span>
              </label>

              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="professional"
                    checked={userType === 'professional'}
                    onChange={() => setUserType('professional')}
                  />
                  Beauty Professional
                </label>

                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="client"
                    checked={userType === 'client'}
                    onChange={() => setUserType('client')}
                  />
                  Client looking for services
                </label>
              </div>

              <p className={styles.lockedNote}>
                Account type is locked and cannot be changed after saving.
              </p>
            </div>

          ) : (

            // ── B: Confirmed — show branded locked card ──
            // Clean card following your brand colors
            <div className={styles.userTypeLockedCard}>
              {userType === 'professional' ? (
                <>
                  <span className={styles.userTypeIcon}>💼</span>
                  <span className={styles.userTypeLockedText}>I am a Beauty Professional</span>
                </>
              ) : (
                <>
                  <span className={styles.userTypeIcon}>🙋</span>
                  <span className={styles.userTypeLockedText}>I am a Client looking for services</span>
                </>
              )}
            </div>

          )}

          {/* ── PROFILE PHOTO ── */}
          <div className={styles.photoSection}>
            <div className={styles.photoPreview}>
              <img
                src={photoPreview || 'https://via.placeholder.com/150/b54dbc/ffffff?text=No+Photo'}
                alt="Profile preview"
                className={styles.photoImg}
              />
            </div>

            <div className={styles.photoControls}>
              <label className={styles.photoLabel}>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className={styles.photoInput}
              />
              <p className={styles.hint}>Max 5MB. JPG, PNG, or GIF. Recommended: 400×400px square.</p>

              {uploadProgress !== null && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                  <span className={styles.progressText}>{uploadProgress}%</span>
                </div>
              )}

              {photoPreview && (
                <button type="button" onClick={handleRemovePhoto} className={styles.removeBtn}>
                  Remove Picture
                </button>
              )}
            </div>
          </div>

          {/* ── SHARED FIELDS ── */}
          <FormInput
            label="Display Name"
            id="displayName"
            value={form.displayName}
            onChange={handleChange('displayName')}
            placeholder="Enter your name"
            required={true}
          />

          {/* ── PROFESSIONAL-ONLY FIELDS ── */}
          {userType === 'professional' && (
            <>
              <div className={styles.fieldWrapper}>
                <label className={styles.fieldLabel}>
                  Specialties <span className={styles.required}>*</span>
                </label>
                <div className={styles.pillGrid}>
                  {SPECIALTY_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSpecialtyToggle(s)}
                      className={styles.pill + (proForm.specialties.includes(s) ? ' ' + styles.pillActive : '')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className={styles.hint}>Click to select/deselect</p>
              </div>

              <FormSelect
                label="Years in Industry"
                id="yearsInIndustry"
                value={proForm.yearsInIndustry}
                onChange={handleProChange('yearsInIndustry')}
                options={YEARS_OPTIONS}
                required={true}
              />

              <FormSelect
                label="Preferred Way to Connect"
                id="preferredContact"
                value={proForm.preferredContact}
                onChange={handleProChange('preferredContact')}
                options={CONTACT_OPTIONS}
                required={true}
              />
            </>
          )}

          {/* ── CLIENT-ONLY FIELDS ── */}
          {userType === 'client' && (
            <div className={styles.fieldWrapper}>
              <label className={styles.fieldLabel}>Services I'm Looking For</label>
              <div className={styles.pillGrid}>
                {SERVICES_LOOKING_FOR_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleServiceToggle(s)}
                    className={styles.pill + (clientForm.servicesLookingFor.includes(s) ? ' ' + styles.pillActive : '')}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className={styles.hint}>Click to select/deselect</p>
            </div>
          )}

          {/* ── SHARED FIELDS CONTINUED ── */}
          <FormTextarea
            label="Bio"
            id="bio"
            value={form.bio}
            onChange={handleChange('bio')}
            placeholder="Tell us about yourself"
            maxLength={500}
          />

          <FormInput
            label="Location"
            id="location"
            value={form.location}
            onChange={handleChange('location')}
            placeholder="First 3 digits of Postal Code (e.g. M5V)"
          />

          <FormInput
            label="Instagram"
            id="instagram"
            type="url"
            value={form.instagram}
            onChange={handleChange('instagram')}
            placeholder="https://instagram.com/yourusername"
          />

          {/* Website — professional only */}
          {userType === 'professional' && (
            <FormInput
              label="Website"
              id="website"
              type="url"
              value={proForm.website}
              onChange={handleProChange('website')}
              placeholder="https://yourwebsite.com"
            />
          )}

          <div className={styles.buttonRow}>
            <Button
              label={loading ? 'Saving...' : 'Save Profile'}
              type="submit"
              disabled={loading}
            />
          </div>

        </form>
      </div>
    </div>
  );
}

export default Profile;