import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | undefined;
let db: Firestore | null = null;

// This is a more robust check. It ensures the projectId is a non-empty string.
// In CI/CD environments for static export, env vars can be undefined or empty strings.
const hasFirebaseConfig = firebaseConfig.projectId && typeof firebaseConfig.projectId === 'string' && firebaseConfig.projectId.length > 0;

if (hasFirebaseConfig) {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  db = getFirestore(firebaseApp);
} else {
  // This will be logged during the build process in GitHub Actions, confirming
  // that Firebase is intentionally not being initialized.
  console.warn("Firebase config is incomplete or missing. Firebase services will be unavailable. This is expected during static builds without full environment configuration.");
}

export { firebaseApp, db };
