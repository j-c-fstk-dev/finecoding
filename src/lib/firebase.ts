
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A function to safely initialize and get the Firebase app instance.
function initializeFirebase() {
    if (!firebaseConfig.projectId) {
        // This error is a safeguard, but in some build environments, it might be expected.
        // The check in AuthProvider will handle client-side initialization errors more gracefully.
        console.warn("Firebase projectId is not set. This may cause issues if not running on the client.");
    }
    // Check if any apps are already initialized; if not, initialize one.
    // If apps exist, get the default app.
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeFirebase();
const db: Firestore = getFirestore(app);

export { app as firebaseApp, db };
