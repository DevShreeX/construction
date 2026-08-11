// ==================== Firebase Configuration ====================
// Gracefully handles missing/placeholder Firebase config so the app still runs.

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword as fbSignIn, createUserWithEmailAndPassword as fbCreateUser, signOut as fbSignOut, onAuthStateChanged as fbOnAuthChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let auth = null;
let db = null;

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Only initialize if real credentials are provided
const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_');

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized');
  } catch (err) {
    console.warn('⚠️ Firebase init failed:', err.message);
  }
} else {
  console.warn('⚠️ Firebase not configured — running in offline/demo mode. Auth features will use demo fallbacks.');
}

// Fallback functions that work without Firebase
async function signInWithEmailAndPassword(authInstance, email, password) {
  if (authInstance && fbSignIn) return fbSignIn(authInstance, email, password);
  // Demo mode: simulate login
  console.log('[Demo] Sign in:', email);
  return { user: { email, uid: 'demo-' + Date.now() } };
}

async function createUserWithEmailAndPassword(authInstance, email, password) {
  if (authInstance && fbCreateUser) return fbCreateUser(authInstance, email, password);
  console.log('[Demo] Create user:', email);
  return { user: { email, uid: 'demo-' + Date.now() } };
}

async function signOut(authInstance) {
  if (authInstance && fbSignOut) return fbSignOut(authInstance);
  console.log('[Demo] Sign out');
}

function onAuthStateChanged(authInstance, callback) {
  if (authInstance && fbOnAuthChanged) return fbOnAuthChanged(authInstance, callback);
  // Demo mode: call with null (not logged in)
  setTimeout(() => callback(null), 0);
  return () => {}; // unsubscribe function
}

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
