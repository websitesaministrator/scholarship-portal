import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

// Default Firebase project configuration
const envConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB2IMYCMxEshcFwKbTEOfGEh3dN0WMksrg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "scholarships-dashboard.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "scholarships-dashboard",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "scholarships-dashboard.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "916848323649",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:916848323649:web:8fc1b9655b4d9a4b2b6ac0",
};

export const getStoredFirebaseConfig = (): FirebaseConfig | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('scholarship_os_firebase_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore error
  }
  return null;
};

export const saveFirebaseConfig = (config: FirebaseConfig) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('scholarship_os_firebase_config', JSON.stringify(config));
};

export const getActiveFirebaseConfig = (): FirebaseConfig => {
  // First prefer env vars if they have apiKey
  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }
  // Otherwise check local storage
  const stored = getStoredFirebaseConfig();
  if (stored && stored.apiKey && stored.projectId) {
    return stored;
  }
  return envConfig;
};

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

export const initFirebase = () => {
  const config = getActiveFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    return { app: null, db: null, storage: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }
    firestoreInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
    return {
      app: appInstance,
      db: firestoreInstance,
      storage: storageInstance,
      isConfigured: true,
    };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, db: null, storage: null, isConfigured: false };
  }
};

export const isFirebaseConfigured = (): boolean => {
  const config = getActiveFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
};
