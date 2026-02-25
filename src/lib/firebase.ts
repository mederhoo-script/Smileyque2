/**
 * Firebase initialisation
 *
 * Firebase web API keys are intentionally public — security is enforced via
 * Firestore Security Rules, not by keeping the client config secret.
 * See: https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_n8A9lNoaPgdEHxokqY-A0OAryHEsR4g",
  authDomain: "vtu-platform.firebaseapp.com",
  projectId: "vtu-platform",
  storageBucket: "vtu-platform.firebasestorage.app",
  messagingSenderId: "730960900503",
  appId: "1:730960900503:web:7daabad4f38ae213b414d2",
  measurementId: "G-7V34R30WW1",
};

// Prevent duplicate app initialisation during HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
