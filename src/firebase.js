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

/**
 * Save a geotagged site location with Google Satellite & GIS details into Firebase Firestore / Persistent Storage
 */
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
      console.error('Firestore save failed, falling back to local persistent storage:', err);
    }
  }

  // Fallback to local storage persistence
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GIS_KEY) || '[]');
  const newSite = { id: 'gis-' + Date.now(), ...payload };
  existing.unshift(newSite);
  localStorage.setItem(LOCAL_STORAGE_GIS_KEY, JSON.stringify(existing));
  console.log('✅ Site saved to local persistent storage:', newSite.id);
  return { success: true, ...newSite };
}

/**
 * Retrieve all saved GIS Satellite Site locations from Firebase Firestore / Persistent Storage
 */
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
      console.warn('Firestore fetch failed, serving local persistent storage:', err);
    }
  }

  // Fallback default sites + localStorage items
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

/**
 * Delete a saved GIS site record from Firebase / Persistent Storage
 */
export async function deleteGisSiteFromFirebase(siteId) {
  if (db && !siteId.startsWith('gis-')) {
    try {
      await deleteDoc(doc(db, 'gis_sites', siteId));
      console.log('✅ Site deleted from Firebase Firestore');
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

// ==================== Land Plot Boundary Storage API ====================

const LOCAL_STORAGE_LAND_KEY = 'forzex_land_plots';

export async function saveLandPlotToFirebase(plotData) {
  const payload = {
    name: plotData.name || 'Land Boundary Plot',
    points: plotData.points || [],
    totalAreaSqFt: Number(plotData.totalAreaSqFt || 0),
    totalAcres: Number(plotData.totalAcres || 0),
    usableAreaSqFt: Number(plotData.usableAreaSqFt || 0),
    usableAcres: Number(plotData.usableAcres || 0),
    setbackFt: Number(plotData.setbackFt || 5),
    usablePercent: Number(plotData.usablePercent || 0),
    perimeterFt: Number(plotData.perimeterFt || 0),
    locationName: plotData.locationName || 'Mapped Property',
    timestamp: new Date().toISOString()
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'land_plots'), {
        ...payload,
        createdAt: serverTimestamp()
      });
      console.log('✅ Land plot saved to Firebase Firestore:', docRef.id);
      return { success: true, id: docRef.id, ...payload };
    } catch (err) {
      console.error('Firestore save failed, using local storage fallback:', err);
    }
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LAND_KEY) || '[]');
  const newPlot = { id: 'plot-' + Date.now(), ...payload };
  existing.unshift(newPlot);
  localStorage.setItem(LOCAL_STORAGE_LAND_KEY, JSON.stringify(existing));
  return { success: true, ...newPlot };
}

export async function getLandPlotsFromFirebase() {
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'land_plots'));
      const plots = [];
      querySnapshot.forEach((doc) => {
        plots.push({ id: doc.id, ...doc.data() });
      });
      if (plots.length > 0) return plots;
    } catch (err) {
      console.warn('Firestore fetch failed, serving local storage:', err);
    }
  }

  const localItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LAND_KEY) || '[]');
  if (localItems.length === 0) {
    const defaultPlots = [
      {
        id: 'plot-1',
        name: 'Irregular Residential Corner Lot',
        points: [{lat: 30.2672, lon: -97.7431}, {lat: 30.2678, lon: -97.7425}, {lat: 30.2675, lon: -97.7418}, {lat: 30.2668, lon: -97.7424}],
        totalAreaSqFt: 18450,
        totalAcres: 0.423,
        usableAreaSqFt: 14200,
        usableAcres: 0.326,
        setbackFt: 5,
        usablePercent: 76.9,
        perimeterFt: 540,
        locationName: 'Austin Site, TX',
        timestamp: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_LAND_KEY, JSON.stringify(defaultPlots));
    return defaultPlots;
  }
  return localItems;
}

export async function deleteLandPlotFromFirebase(plotId) {
  if (db && !plotId.startsWith('plot-')) {
    try {
      await deleteDoc(doc(db, 'land_plots', plotId));
      return { success: true };
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LAND_KEY) || '[]');
  const filtered = existing.filter(item => item.id !== plotId);
  localStorage.setItem(LOCAL_STORAGE_LAND_KEY, JSON.stringify(filtered));
  return { success: true };
}

// ==================== Generic Firebase Firestore CRUD Helpers ====================

const LOCAL_STORAGE_GENERIC_PREFIX = 'forzex_db_collection_';

/**
 * Save a document into any Firebase Firestore collection (or local storage fallback)
 */
export async function saveDocumentToFirebase(collectionName, documentData) {
  const payload = {
    ...documentData,
    timestamp: new Date().toISOString()
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...payload,
        createdAt: serverTimestamp()
      });
      console.log(`✅ Document saved to Firebase Firestore [${collectionName}]:`, docRef.id);
      return { success: true, id: docRef.id, collection: collectionName, ...payload };
    } catch (err) {
      console.error(`Firestore save failed for ${collectionName}, falling back to local persistent storage:`, err);
    }
  }

  // Fallback to local storage
  const storageKey = LOCAL_STORAGE_GENERIC_PREFIX + collectionName;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const newDoc = { id: `${collectionName.slice(0, 4)}-` + Date.now(), collection: collectionName, ...payload };
  existing.unshift(newDoc);
  localStorage.setItem(storageKey, JSON.stringify(existing));
  console.log(`✅ Document saved to local persistent storage [${collectionName}]:`, newDoc.id);
  return { success: true, ...newDoc };
}

/**
 * Get all documents from a Firebase Firestore collection (or local storage fallback)
 */
export async function getDocumentsFromFirebase(collectionName) {
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, collection: collectionName, ...doc.data() });
      });
      if (documents.length > 0) return documents;
    } catch (err) {
      console.warn(`Firestore fetch failed for ${collectionName}, serving local persistent storage:`, err);
    }
  }

  const storageKey = LOCAL_STORAGE_GENERIC_PREFIX + collectionName;
  const localItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
  return localItems;
}

/**
 * Delete a document from Firebase Firestore collection (or local storage fallback)
 */
export async function deleteDocumentFromFirebase(collectionName, docId) {
  if (db && !docId.includes('-')) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      console.log(`✅ Document deleted from Firebase Firestore [${collectionName}]`);
      return { success: true };
    } catch (err) {
      console.warn(`Firestore delete failed for ${collectionName}:`, err);
    }
  }

  const storageKey = LOCAL_STORAGE_GENERIC_PREFIX + collectionName;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const filtered = existing.filter(item => item.id !== docId);
  localStorage.setItem(storageKey, JSON.stringify(filtered));
  return { success: true };
}

/**
 * Returns summary info of the Firebase connection status
 */
export function getFirebaseBackendStatus() {
  return {
    isConfigured,
    isConnected: Boolean(db),
    authActive: Boolean(auth),
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket,
    mode: isConfigured ? 'Firebase Cloud Firestore' : 'Demo Mode (Persistent Local Storage)'
  };
}

export { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};

