/**
 * Firebase initialisation
 *
 * Configuration is read from environment variables (see example.env).
 * Copy example.env to .env and fill in your Firebase project values.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);
if (missing.length > 0) {
  console.error(
    `[Firebase] Missing required environment variables: ${missing.join(", ")}.\n` +
      "Copy example.env to .env and fill in your Firebase project values."
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Prevent duplicate app initialisation during HMR.
// Using definite-assignment assertions (!) so TypeScript is satisfied.
// Wrapped in try-catch so a misconfigured environment logs a clear console
// error instead of throwing at module level and producing a blank screen.
// If init fails, exports remain undefined; any Firebase call will throw a
// TypeError that React's ErrorBoundary (in main.tsx) will catch and display
// as a helpful setup message rather than a blank page.
let db!: Firestore;
let auth!: Auth;

/** True when Firebase initialised successfully; false when env vars are missing or init failed. */
export let firebaseConfigured = false;

try {
  const app: FirebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  firebaseConfigured = true;
} catch (err) {
  console.error(
    "[Firebase] Initialisation failed. Verify that all VITE_FIREBASE_* variables in your .env file are correct.\n",
    err
  );
}

export { db, auth };
