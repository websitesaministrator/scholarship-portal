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

// 1. Check environment variables
const envConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
