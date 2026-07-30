// FIREBASE CONFIG — initialized once here, imported everywhere else.
// We never call initializeApp() more than once. Importing this file
// in any component gives access to the same Firebase instance.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// These values come from your .env file.
// REACT_APP_ prefix is required by CRA for env variables to work.
const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase — this runs once when the file is first imported
const app = initializeApp(firebaseConfig);

// Export Firestore database instance — import this in any component that needs the DB
export const db             = getFirestore(app);
export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage        = getStorage(app);