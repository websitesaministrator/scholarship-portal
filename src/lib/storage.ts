import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
} from 'firebase/storage';
import { initFirebase } from './firebase';
import {
  Scholarship,
  Task,
  DocumentItem,
  ActivityItem,
  ProfileData,
  GapYearData,
  StorySection,
} from '@/types';
import {
  INITIAL_SCHOLARSHIPS,
  INITIAL_TASKS,
  INITIAL_DOCUMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_PROFILE,
  INITIAL_GAP_YEAR,
  INITIAL_STORY_SECTIONS,
} from './seedData';

// Local Storage Keys
const LS_KEYS = {
  SCHOLARSHIPS: 'scholarship_os_scholarships',
  TASKS: 'scholarship_os_tasks',
  DOCUMENTS: 'scholarship_os_documents',
  ACTIVITIES: 'scholarship_os_activities',
  PROFILE: 'scholarship_os_profile',
  GAP_YEAR: 'scholarship_os_gap_year',
  STORY: 'scholarship_os_story',
  INITIALIZED: 'scholarship_os_is_initialized',
};

// Helper to safely read from localStorage
const getLocal = <T>(key: string, defaultVal: T): T => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
};

// Helper to safely write to localStorage
const setLocal = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to save to local storage key: ${key}`, e);
  }
};

export const initializeLocalSeedData = () => {
  if (typeof window === 'undefined') return;
  const isInit = localStorage.getItem(LS_KEYS.INITIALIZED);
  if (!isInit) {
    localStorage.setItem(LS_KEYS.SCHOLARSHIPS, JSON.stringify(INITIAL_SCHOLARSHIPS));
    localStorage.setItem(LS_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(LS_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(LS_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    localStorage.setItem(LS_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(LS_KEYS.GAP_YEAR, JSON.stringify(INITIAL_GAP_YEAR));
    localStorage.setItem(LS_KEYS.STORY, JSON.stringify(INITIAL_STORY_SECTIONS));
    localStorage.setItem(LS_KEYS.INITIALIZED, 'true');
  }
};

// ================= SCHOLARSHIPS =================

export const getScholarships = async (): Promise<Scholarship[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'scholarships'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Scholarship));
      }
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local:', e);
    }
  }
  return getLocal<Scholarship[]>(LS_KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
};

export const saveScholarship = async (scholarship: Scholarship): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  // Always update local cache
  const localList = getLocal<Scholarship[]>(LS_KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
  const idx = localList.findIndex(s => s.id === scholarship.id);
  let updatedList: Scholarship[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = scholarship;
  } else {
    updatedList = [scholarship, ...localList];
  }
  setLocal(LS_KEYS.SCHOLARSHIPS, updatedList);

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'scholarships', scholarship.id), scholarship);
    } catch (e) {
      console.error('Failed to save scholarship to Firestore:', e);
    }
  }
};

export const deleteScholarship = async (id: string): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<Scholarship[]>(LS_KEYS.SCHOLARSHIPS, []);
  setLocal(LS_KEYS.SCHOLARSHIPS, localList.filter(s => s.id !== id));

  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, 'scholarships', id));
    } catch (e) {
      console.error('Failed to delete scholarship from Firestore:', e);
    }
  }
};

// ================= TASKS =================

export const getTasks = async (): Promise<Task[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'tasks'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Task));
      }
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local:', e);
    }
  }
  return getLocal<Task[]>(LS_KEYS.TASKS, INITIAL_TASKS);
};

export const saveTask = async (task: Task): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<Task[]>(LS_KEYS.TASKS, INITIAL_TASKS);
  const idx = localList.findIndex(t => t.id === task.id);
  let updatedList: Task[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = task;
  } else {
    updatedList = [task, ...localList];
  }
  setLocal(LS_KEYS.TASKS, updatedList);

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'tasks', task.id), task);
    } catch (e) {
      console.error('Failed to save task to Firestore:', e);
    }
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<Task[]>(LS_KEYS.TASKS, []);
  setLocal(LS_KEYS.TASKS, localList.filter(t => t.id !== id));

  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e) {
      console.error('Failed to delete task from Firestore:', e);
    }
  }
};

// ================= DOCUMENTS =================

export const getDocuments = async (): Promise<DocumentItem[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'documents'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as DocumentItem));
      }
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local:', e);
    }
  }
  return getLocal<DocumentItem[]>(LS_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
};

export const saveDocument = async (docItem: DocumentItem): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<DocumentItem[]>(LS_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  const idx = localList.findIndex(d => d.id === docItem.id);
  let updatedList: DocumentItem[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = docItem;
  } else {
    updatedList = [docItem, ...localList];
  }
  setLocal(LS_KEYS.DOCUMENTS, updatedList);

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'documents', docItem.id), docItem);
    } catch (e) {
      console.error('Failed to save document to Firestore:', e);
    }
  }
};

export const deleteDocument = async (id: string, filePath?: string): Promise<void> => {
  const { db, storage, isConfigured } = initFirebase();
  const localList = getLocal<DocumentItem[]>(LS_KEYS.DOCUMENTS, []);
  setLocal(LS_KEYS.DOCUMENTS, localList.filter(d => d.id !== id));

  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, 'documents', id));
      if (storage && filePath) {
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to delete document:', e);
    }
  }
};

// Upload file to Firebase Cloud Storage with progress callback
export const uploadDocumentFile = async (
  file: File,
  docId: string,
  onProgress?: (percent: number) => void
): Promise<{ fileUrl: string; filePath: string }> => {
  const { storage, isConfigured } = initFirebase();

  if (!isConfigured || !storage) {
    // Mock upload using local Object URL or FileReader for instant demo offline use
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        onProgress?.(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            resolve({
              fileUrl: dataUrl || URL.createObjectURL(file),
              filePath: `offline/${docId}_${file.name}`,
            });
          };
          reader.readAsDataURL(file);
        }
      }, 100);
    });
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `scholarship_documents/${docId}/${Date.now()}_${cleanName}`;
  const fileRef = ref(storage, path);

  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(percent);
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ fileUrl: downloadUrl, filePath: path });
      }
    );
  });
};

// ================= ACTIVITIES =================

export const getActivities = async (): Promise<ActivityItem[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'activities'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as ActivityItem));
      }
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local:', e);
    }
  }
  return getLocal<ActivityItem[]>(LS_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
};

export const saveActivity = async (activity: ActivityItem): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<ActivityItem[]>(LS_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  const idx = localList.findIndex(a => a.id === activity.id);
  let updatedList: ActivityItem[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = activity;
  } else {
    updatedList = [activity, ...localList];
  }
  setLocal(LS_KEYS.ACTIVITIES, updatedList);

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'activities', activity.id), activity);
    } catch (e) {
      console.error('Failed to save activity to Firestore:', e);
    }
  }
};

export const deleteActivity = async (id: string): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<ActivityItem[]>(LS_KEYS.ACTIVITIES, []);
  setLocal(LS_KEYS.ACTIVITIES, localList.filter(a => a.id !== id));

  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, 'activities', id));
    } catch (e) {
      console.error('Failed to delete activity from Firestore:', e);
    }
  }
};

// ================= PROFILE & GAP YEAR & STORY =================

export const getProfile = async (): Promise<ProfileData> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'meta'));
      const profileDoc = snap.docs.find(d => d.id === 'profile');
      if (profileDoc) {
        return profileDoc.data() as ProfileData;
      }
    } catch (e) {
      console.warn('Firestore fetch failed for profile:', e);
    }
  }
  return getLocal<ProfileData>(LS_KEYS.PROFILE, INITIAL_PROFILE);
};

export const saveProfile = async (profile: ProfileData): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  setLocal(LS_KEYS.PROFILE, profile);
  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'meta', 'profile'), profile);
    } catch (e) {
      console.error('Failed to save profile to Firestore:', e);
    }
  }
};

export const getGapYear = async (): Promise<GapYearData> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'meta'));
      const gapDoc = snap.docs.find(d => d.id === 'gapYear');
      if (gapDoc) {
        return gapDoc.data() as GapYearData;
      }
    } catch (e) {
      console.warn('Firestore fetch failed for gapYear:', e);
    }
  }
  return getLocal<GapYearData>(LS_KEYS.GAP_YEAR, INITIAL_GAP_YEAR);
};

export const saveGapYear = async (gapYear: GapYearData): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  setLocal(LS_KEYS.GAP_YEAR, gapYear);
  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'meta', 'gapYear'), gapYear);
    } catch (e) {
      console.error('Failed to save gapYear to Firestore:', e);
    }
  }
};

export const getStorySections = async (): Promise<StorySection[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'storySections'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as StorySection));
      }
    } catch (e) {
      console.warn('Firestore fetch failed for storySections:', e);
    }
  }
  return getLocal<StorySection[]>(LS_KEYS.STORY, INITIAL_STORY_SECTIONS);
};

export const saveStorySection = async (story: StorySection): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<StorySection[]>(LS_KEYS.STORY, INITIAL_STORY_SECTIONS);
  const idx = localList.findIndex(s => s.id === story.id);
  let updatedList: StorySection[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = story;
  } else {
    updatedList = [story, ...localList];
  }
  setLocal(LS_KEYS.STORY, updatedList);

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'storySections', story.id), story);
    } catch (e) {
      console.error('Failed to save storySection to Firestore:', e);
    }
  }
};

export const deleteStorySection = async (id: string): Promise<void> => {
  const { db, isConfigured } = initFirebase();
  const localList = getLocal<StorySection[]>(LS_KEYS.STORY, []);
  setLocal(LS_KEYS.STORY, localList.filter(s => s.id !== id));

  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, 'storySections', id));
    } catch (e) {
      console.error('Failed to delete story section from Firestore:', e);
    }
  }
};

// ================= EXPORT & IMPORT =================

export interface FullBackupData {
  version: string;
  exportedAt: string;
  scholarships: Scholarship[];
  tasks: Task[];
  documents: DocumentItem[];
  activities: ActivityItem[];
  profile: ProfileData;
  gapYear: GapYearData;
  storySections: StorySection[];
}

export const exportAllData = async (): Promise<FullBackupData> => {
  const [scholarships, tasks, documents, activities, profile, gapYear, storySections] = await Promise.all([
    getScholarships(),
    getTasks(),
    getDocuments(),
    getActivities(),
    getProfile(),
    getGapYear(),
    getStorySections(),
  ]);

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    scholarships,
    tasks,
    documents,
    activities,
    profile,
    gapYear,
    storySections,
  };
};

export const importAllData = async (data: FullBackupData): Promise<void> => {
  if (!data || !Array.isArray(data.scholarships)) {
    throw new Error('Invalid backup format');
  }

  // Update localStorage
  setLocal(LS_KEYS.SCHOLARSHIPS, data.scholarships);
  setLocal(LS_KEYS.TASKS, data.tasks || []);
  setLocal(LS_KEYS.DOCUMENTS, data.documents || []);
  setLocal(LS_KEYS.ACTIVITIES, data.activities || []);
  if (data.profile) setLocal(LS_KEYS.PROFILE, data.profile);
  if (data.gapYear) setLocal(LS_KEYS.GAP_YEAR, data.gapYear);
  if (data.storySections) setLocal(LS_KEYS.STORY, data.storySections);

  // If Firebase is configured, batch sync
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    for (const s of data.scholarships) await setDoc(doc(db, 'scholarships', s.id), s);
    for (const t of (data.tasks || [])) await setDoc(doc(db, 'tasks', t.id), t);
    for (const d of (data.documents || [])) await setDoc(doc(db, 'documents', d.id), d);
    for (const a of (data.activities || [])) await setDoc(doc(db, 'activities', a.id), a);
    if (data.profile) await setDoc(doc(db, 'meta', 'profile'), data.profile);
    if (data.gapYear) await setDoc(doc(db, 'meta', 'gapYear'), data.gapYear);
    for (const st of (data.storySections || [])) await setDoc(doc(db, 'storySections', st.id), st);
  }
};
