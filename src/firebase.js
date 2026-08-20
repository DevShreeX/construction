// ==================== Firebase & Storage Configuration ====================
// Supports live Firebase Firestore database + automatic local persistence fallback.

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';

let auth = null;
let db = null;

// Read config from Vite environment variables or fallback values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Check if valid credentials are present
const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_');

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase Backend Storage initialized successfully');
  } catch (err) {
    console.warn('⚠️ Firebase init warning:', err.message);
  }
} else {
  console.warn('⚠️ Firebase running in demo storage mode. Local persistent storage activated.');
}

// ==================== Firebase Helper Functions ====================

async function signInWithEmailAndPassword(authInstance, email, password) {
  if (authInstance && fbSignIn) return fbSignIn(authInstance, email, password);
  console.log('[Firebase Demo] Sign in:', email);
  return { user: { email, uid: 'demo-' + Date.now() } };
}

async function createUserWithEmailAndPassword(authInstance, email, password) {
  if (authInstance && fbCreateUser) return fbCreateUser(authInstance, email, password);
  console.log('[Firebase Demo] Create user:', email);
  return { user: { email, uid: 'demo-' + Date.now() } };
}

async function signOut(authInstance) {
  if (authInstance && fbSignOut) return fbSignOut(authInstance);
  console.log('[Firebase Demo] Sign out');
}

function onAuthStateChanged(authInstance, callback) {
  if (authInstance && fbOnAuthChanged) return fbOnAuthChanged(authInstance, callback);
  setTimeout(() => callback(null), 0);
  return () => {};
}

// ==================== GIS Satellite Location Storage API ====================
const LOCAL_STORAGE_GIS_KEY = 'forzex_gis_satellite_sites';
const LOCAL_STORAGE_INTERIOR_KEY = 'forzex_ai_interior_designs';

export async function saveGisSiteToFirebase(siteData) {
  const payload = {
    name: siteData.name || 'Construction Site Geotag',
    lat: Number(siteData.lat),
    lon: Number(siteData.lon),
    locationName: siteData.locationName || 'Geotagged Site',
    satelliteBasemap: siteData.satelliteBasemap || 'Google Satellite Hybrid',
    notes: siteData.notes || 'Site inspection completed via Google Satellite GIS.',
    timestamp: new Date().toISOString()
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'gis_sites'), {
        ...payload,
        createdAt: serverTimestamp()
      });
      console.log('✅ Site saved to Firebase Firestore:', docRef.id);
      return { success: true, id: docRef.id, ...payload };
    } catch (err) {
      console.error('Firestore save failed, falling back to local storage:', err);
    }
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GIS_KEY) || '[]');
  const newSite = { id: 'gis-' + Date.now(), ...payload };
  existing.unshift(newSite);
  localStorage.setItem(LOCAL_STORAGE_GIS_KEY, JSON.stringify(existing));
  return { success: true, ...newSite };
}

export async function getGisSitesFromFirebase() {
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'gis_sites'));
      const sites = [];
      querySnapshot.forEach((doc) => {
        sites.push({ id: doc.id, ...doc.data() });
      });
      if (sites.length > 0) return sites;
    } catch (err) {
      console.warn('Firestore fetch failed, serving local storage:', err);
    }
  }

  const localItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GIS_KEY) || '[]');
  if (localItems.length === 0) {
    const defaultSites = [
      { id: 'gis-1', name: 'Skyline Tower Site', lat: 25.1972, lon: 55.2744, locationName: 'Dubai Downtown, UAE', satelliteBasemap: 'Google Satellite Hybrid', notes: 'Foundations inspected via aerial satellite imagery.', timestamp: new Date().toISOString() },
      { id: 'gis-2', name: 'Harbor Village Phase 2', lat: -1.286389, lon: 36.817223, locationName: 'Nairobi Central, Kenya', satelliteBasemap: 'Google Satellite High-Res', notes: 'Topographic GIS elevation verified.', timestamp: new Date().toISOString() }
    ];
    localStorage.setItem(LOCAL_STORAGE_GIS_KEY, JSON.stringify(defaultSites));
    return defaultSites;
  }
  return localItems;
}

export async function deleteGisSiteFromFirebase(siteId) {
  if (db && !siteId.startsWith('gis-')) {
    try {
      await deleteDoc(doc(db, 'gis_sites', siteId));
      return { success: true };
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
  }
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GIS_KEY) || '[]');
  const filtered = existing.filter(item => item.id !== siteId);
  localStorage.setItem(LOCAL_STORAGE_GIS_KEY, JSON.stringify(filtered));
  return { success: true };
}

// ==================== AI Interior & 2D-to-Video Storage API ====================

export async function saveInteriorDesignToFirebase(designData) {
  const payload = {
    title: designData.title || 'AI Interior & Construction Concept',
    style: designData.style || 'Modern Minimalist',
    roomType: designData.roomType || 'Living Room',
    wallCount: designData.wallCount || 3,
    renderUrl: designData.renderUrl || '/images/interior_1.png',
    hasVideoSimulation: Boolean(designData.hasVideoSimulation),
    costEstimate: designData.costEstimate || '$35,400',
    timestamp: new Date().toISOString()
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'interior_designs'), {
        ...payload,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id, ...payload };
    } catch (err) {
      console.error('Firestore interior save failed, using local storage:', err);
    }
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INTERIOR_KEY) || '[]');
  const newItem = { id: 'interior-' + Date.now(), ...payload };
  existing.unshift(newItem);
  localStorage.setItem(LOCAL_STORAGE_INTERIOR_KEY, JSON.stringify(existing));
  return { success: true, ...newItem };
}

export async function getInteriorDesignsFromFirebase() {
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'interior_designs'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('Firestore interior fetch failed:', err);
    }
  }

  const localItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INTERIOR_KEY) || '[]');
  if (localItems.length === 0) {
    const defaultDesigns = [
      { id: 'interior-1', title: 'Luxury Master Executive Suite', style: 'Contemporary Luxury', roomType: 'Executive Suite', wallCount: 3, renderUrl: '/images/interior_1.png', hasVideoSimulation: true, costEstimate: '$42,500', timestamp: new Date().toISOString() },
      { id: 'interior-2', title: 'Nordic Scandinavian Living Room', style: 'Scandinavian Warm Oak', roomType: 'Living Lounge', wallCount: 3, renderUrl: '/images/interior_2.png', hasVideoSimulation: true, costEstimate: '$28,900', timestamp: new Date().toISOString() }
    ];
    localStorage.setItem(LOCAL_STORAGE_INTERIOR_KEY, JSON.stringify(defaultDesigns));
    return defaultDesigns;
  }
  return localItems;
}

export async function deleteInteriorDesignFromFirebase(id) {
  if (db && !id.startsWith('interior-')) {
    try {
      await deleteDoc(doc(db, 'interior_designs', id));
      return { success: true };
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
  }
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INTERIOR_KEY) || '[]');
  const filtered = existing.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_INTERIOR_KEY, JSON.stringify(filtered));
  return { success: true };
}

export { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};
