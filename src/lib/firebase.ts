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

// A function to initialize Firebase and throw a clear error if config is missing.
function initializeFirebase() {
    if (!firebaseConfig.projectId) {
        // This error will be caught by Next.js and displayed in the console,
        // making it clear if environment variables are the issue.
        throw new Error("Firebase projectId is not set. Please check your .env.local file and restart the development server.");
    }
    
    // This pattern prevents re-initializing the app on hot reloads.
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    } else {
        return getApp();
    }
}

let app: FirebaseApp;
let db: Firestore;

try {
    app = initializeFirebase();
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization failed:", error);
    // Re-throw the error to make it visible during development and prevent silent failures.
    throw error;
}


export { app as firebaseApp, db };
