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
        apiKey: "AIzaSyB2DccAwpNnzfNPhhP6KQJ58xVOEFsLB8Y",
        authDomain: "lhok-e77ba.firebaseapp.com",
        projectId: "lhok-e77ba",
        storageBucket: "lhok-e77ba.firebasestorage.app",
        messagingSenderId: "228980882242",
        appId: "1:228980882242:web:6c5a9f0c36544aba03e6db"
};

// Initialize Firebase — this runs once when the file is first imported
const app = initializeApp(firebaseConfig);

// Export Firestore database instance — import this in any component that needs the DB
export const db             = getFirestore(app);
export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage        = getStorage(app);