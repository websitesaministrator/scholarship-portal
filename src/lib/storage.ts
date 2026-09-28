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
export const LS_KEYS = {
  SCHOLARSHIPS: 'scholarship_os_scholarships',
  TASKS: 'scholarship_os_tasks',
  DOCUMENTS: 'scholarship_os_documents',
  ACTIVITIES: 'scholarship_os_activities',
  PROFILE: 'scholarship_os_profile',
  GAP_YEAR: 'scholarship_os_gap_year',
  STORY: 'scholarship_os_story',
  INITIALIZED: 'scholarship_os_is_initialized',
};

// Helper: with strict timeout so Firebase NEVER hangs the app for 30-60 seconds
export const withTimeout = <T>(promise: Promise<T>, ms: number = 2500): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), ms)
    ),
  ]);
};

// Helper to safely read from localStorage
export const getLocal = <T>(key: string, defaultVal: T): T => {
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
export const setLocal = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to save to local storage key: ${key}`, e);
  }
};

// Helper to remove undefined properties which Firestore rejects
export const cleanData = <T extends object>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
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

// Synchronous local getters for instant 0ms initial render
export const getLocalScholarships = (): Scholarship[] => getLocal(LS_KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
export const getLocalTasks = (): Task[] => getLocal(LS_KEYS.TASKS, INITIAL_TASKS);
export const getLocalDocuments = (): DocumentItem[] => getLocal(LS_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
export const getLocalActivities = (): ActivityItem[] => getLocal(LS_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
export const getLocalProfile = (): ProfileData => getLocal(LS_KEYS.PROFILE, INITIAL_PROFILE);
export const getLocalGapYear = (): GapYearData => getLocal(LS_KEYS.GAP_YEAR, INITIAL_GAP_YEAR);
export const getLocalStorySections = (): StorySection[] => getLocal(LS_KEYS.STORY, INITIAL_STORY_SECTIONS);

// ================= FIRESTORE HEALTH CHECK =================
export type SyncStatus = 'connected' | 'not_created' | 'offline';

export const probeFirestoreStatus = async (): Promise<{ status: SyncStatus; message: string }> => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) {
    return { status: 'offline', message: 'Firebase not configured, using Local Storage' };
  }

  try {
    await withTimeout(getDocs(collection(db, 'scholarships')), 3000);
    return { status: 'connected', message: 'Cloud Synced (Live)' };
  } catch (err: any) {
    const msg = err?.message || '';
    if (msg.includes('Cloud Firestore API has not been used') || msg.includes('PERMISSION_DENIED') || err?.code === 'permission-denied') {
      return {
        status: 'not_created',
        message: 'Firestore Database not enabled yet in Firebase Console',
      };
    }
    return { status: 'offline', message: 'Cloud sync temporarily offline' };
  }
};

// ================= SCHOLARSHIPS =================

export const getScholarships = async (): Promise<Scholarship[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'scholarships')), 2500);
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as Scholarship));
        setLocal(LS_KEYS.SCHOLARSHIPS, remote);
        return remote;
      }
    } catch {
      // Silently fall back to instant local data
    }
  }
  return getLocalScholarships();
};

export const saveScholarship = async (scholarship: Scholarship): Promise<void> => {
  // Always update local cache immediately
  const localList = getLocalScholarships();
  const idx = localList.findIndex(s => s.id === scholarship.id);
  let updatedList: Scholarship[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = scholarship;
  } else {
    updatedList = [scholarship, ...localList];
  }
  setLocal(LS_KEYS.SCHOLARSHIPS, updatedList);

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(setDoc(doc(db, 'scholarships', scholarship.id), cleanData(scholarship)), 3000);
    } catch (e) {
      console.warn('Firestore write failed, saved locally:', e);
    }
  }
};

export const deleteScholarship = async (id: string): Promise<void> => {
  const localList = getLocal<Scholarship[]>(LS_KEYS.SCHOLARSHIPS, []);
  setLocal(LS_KEYS.SCHOLARSHIPS, localList.filter(s => s.id !== id));

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(deleteDoc(doc(db, 'scholarships', id)), 3000);
    } catch (e) {
      console.warn('Firestore delete failed, deleted locally:', e);
    }
  }
};

// ================= TASKS =================

export const getTasks = async (): Promise<Task[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'tasks')), 2500);
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as Task));
        setLocal(LS_KEYS.TASKS, remote);
        return remote;
      }
    } catch {
      // Silently fall back to instant local data
    }
  }
  return getLocalTasks();
};

export const saveTask = async (task: Task): Promise<void> => {
  const localList = getLocalTasks();
  const idx = localList.findIndex(t => t.id === task.id);
  let updatedList: Task[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = task;
  } else {
    updatedList = [task, ...localList];
  }
  setLocal(LS_KEYS.TASKS, updatedList);

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(setDoc(doc(db, 'tasks', task.id), cleanData(task)), 3000);
    } catch (e) {
      console.warn('Firestore task write failed, saved locally:', e);
    }
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  const localList = getLocal<Task[]>(LS_KEYS.TASKS, []);
  setLocal(LS_KEYS.TASKS, localList.filter(t => t.id !== id));

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(deleteDoc(doc(db, 'tasks', id)), 3000);
    } catch (e) {
      console.warn('Firestore task delete failed, deleted locally:', e);
    }
  }
};

// ================= DOCUMENTS =================

export const getDocuments = async (): Promise<DocumentItem[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'documents')), 2500);
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as DocumentItem));
        setLocal(LS_KEYS.DOCUMENTS, remote);
        return remote;
      }
    } catch {
      // Silently fall back to instant local data
    }
  }
  return getLocalDocuments();
};

export const saveDocument = async (docItem: DocumentItem): Promise<void> => {
  const localList = getLocalDocuments();
  const idx = localList.findIndex(d => d.id === docItem.id);
  let updatedList: DocumentItem[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = docItem;
  } else {
    updatedList = [docItem, ...localList];
  }
  setLocal(LS_KEYS.DOCUMENTS, updatedList);

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(setDoc(doc(db, 'documents', docItem.id), cleanData(docItem)), 3000);
    } catch (e) {
      console.warn('Firestore doc write failed, saved locally:', e);
    }
  }
};

export const deleteDocument = async (id: string, filePath?: string): Promise<void> => {
  const localList = getLocal<DocumentItem[]>(LS_KEYS.DOCUMENTS, []);
  setLocal(LS_KEYS.DOCUMENTS, localList.filter(d => d.id !== id));

  const { db, storage, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(deleteDoc(doc(db, 'documents', id)), 3000);
      if (storage && filePath) {
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef).catch(() => {});
      }
    } catch (e) {
      console.warn('Firestore doc delete failed, deleted locally:', e);
    }
  }
};

export const uploadDocumentFile = async (
  file: File,
  docId: string,
  onProgress?: (percent: number) => void
): Promise<{ fileUrl: string; filePath: string }> => {
  const { storage, isConfigured } = initFirebase();

  if (!isConfigured || !storage) {
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
      const snap = await withTimeout(getDocs(collection(db, 'activities')), 2500);
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as ActivityItem));
        setLocal(LS_KEYS.ACTIVITIES, remote);
        return remote;
      }
    } catch {
      // Silently fall back to instant local data
    }
  }
  return getLocalActivities();
};

export const saveActivity = async (activity: ActivityItem): Promise<void> => {
  const localList = getLocalActivities();
  const idx = localList.findIndex(a => a.id === activity.id);
  let updatedList: ActivityItem[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = activity;
  } else {
    updatedList = [activity, ...localList];
  }
  setLocal(LS_KEYS.ACTIVITIES, updatedList);

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(setDoc(doc(db, 'activities', activity.id), cleanData(activity)), 3000);
    } catch (e) {
      console.warn('Firestore activity write failed, saved locally:', e);
    }
  }
};

export const deleteActivity = async (id: string): Promise<void> => {
  const localList = getLocal<ActivityItem[]>(LS_KEYS.ACTIVITIES, []);
  setLocal(LS_KEYS.ACTIVITIES, localList.filter(a => a.id !== id));

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(deleteDoc(doc(db, 'activities', id)), 3000);
    } catch (e) {
      console.warn('Firestore activity delete failed, deleted locally:', e);
    }
  }
};

// ================= PROFILE & GAP YEAR & STORY =================

export const getProfile = async (): Promise<ProfileData> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'meta')), 2500);
      const profileDoc = snap.docs.find(d => d.id === 'profile');
      if (profileDoc) {
        const remote = profileDoc.data() as ProfileData;
        setLocal(LS_KEYS.PROFILE, remote);
        return remote;
      }
    } catch {
      // Silently fall back to instant local data
    }
  }
  return getLocalProfile();
};

export const saveProfile = async (profile: ProfileData): Promise<void> => {
  setLocal(LS_KEYS.PROFILE, profile);
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(setDoc(doc(db, 'meta', 'profile'), cleanData(profile)), 3000);
    } catch (e) {
      console.warn('Firestore profile write failed, saved locally:', e);
    }
  }
};

export const getGapYear = async (): Promise<GapYearData> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'meta')), 2500);
      const gapDoc = snap.docs.find(d => d.id === 'gapYear');
      if (gapDoc) {
        const remote = gapDoc.data() as GapYearData;
        setLocal(LS_KEYS.GAP_YEAR, remote);
        return remote;
      }
    } catch {
      // Silently fall back to instant local data
    }
  }
  return getLocalGapYear();
};

export const saveGapYear = async (gapYear: GapYearData): Promise<void> => {
  setLocal(LS_KEYS.GAP_YEAR, gapYear);
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(setDoc(doc(db, 'meta', 'gapYear'), cleanData(gapYear)), 3000);
    } catch (e) {
      console.warn('Firestore gapYear write failed, saved locally:', e);
    }
  }
};

export const getStorySections = async (): Promise<StorySection[]> => {
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'storySections')), 2500);
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as StorySection));
        setLocal(LS_KEYS.STORY, remote);
        return remote;
      }
    } catch {
      // Silently fall back to instant local data
    }
  }
  return getLocalStorySections();
};

export const saveStorySection = async (story: StorySection): Promise<void> => {
  const localList = getLocalStorySections();
  const idx = localList.findIndex(s => s.id === story.id);
  let updatedList: StorySection[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = story;
  } else {
    updatedList = [story, ...localList];
  }
  setLocal(LS_KEYS.STORY, updatedList);

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(setDoc(doc(db, 'storySections', story.id), cleanData(story)), 3000);
    } catch (e) {
      console.warn('Firestore story write failed, saved locally:', e);
    }
  }
};

export const deleteStorySection = async (id: string): Promise<void> => {
  const localList = getLocal<StorySection[]>(LS_KEYS.STORY, []);
  setLocal(LS_KEYS.STORY, localList.filter(s => s.id !== id));

  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      await withTimeout(deleteDoc(doc(db, 'storySections', id)), 3000);
    } catch (e) {
      console.warn('Firestore story delete failed, deleted locally:', e);
    }
  }
};

// ================= REAL-TIME FIRESTORE SUBSCRIPTIONS =================
export interface RealtimeHandlers {
  onScholarships?: (schs: Scholarship[]) => void;
  onTasks?: (tasks: Task[]) => void;
  onDocuments?: (docs: DocumentItem[]) => void;
  onActivities?: (acts: ActivityItem[]) => void;
  onProfile?: (prof: ProfileData) => void;
  onGapYear?: (gap: GapYearData) => void;
  onStorySections?: (stories: StorySection[]) => void;
  onError?: (err: any) => void;
}

export const subscribeToRealtimeUpdates = (handlers: RealtimeHandlers): (() => void) => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) {
    return () => {};
  }

  const unsubscribers: (() => void)[] = [];

  try {
    if (handlers.onScholarships) {
      const unsub = onSnapshot(
        collection(db, 'scholarships'),
        (snapshot) => {
          const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Scholarship));
          setLocal(LS_KEYS.SCHOLARSHIPS, data);
          handlers.onScholarships?.(data);
        },
        (error) => handlers.onError?.(error)
      );
      unsubscribers.push(unsub);
    }

    if (handlers.onTasks) {
      const unsub = onSnapshot(
        collection(db, 'tasks'),
        (snapshot) => {
          const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Task));
          setLocal(LS_KEYS.TASKS, data);
          handlers.onTasks?.(data);
        },
        (error) => handlers.onError?.(error)
      );
      unsubscribers.push(unsub);
    }

    if (handlers.onDocuments) {
      const unsub = onSnapshot(
        collection(db, 'documents'),
        (snapshot) => {
          const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as DocumentItem));
          setLocal(LS_KEYS.DOCUMENTS, data);
          handlers.onDocuments?.(data);
        },
        (error) => handlers.onError?.(error)
      );
      unsubscribers.push(unsub);
    }

    if (handlers.onActivities) {
      const unsub = onSnapshot(
        collection(db, 'activities'),
        (snapshot) => {
          const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ActivityItem));
          setLocal(LS_KEYS.ACTIVITIES, data);
          handlers.onActivities?.(data);
        },
        (error) => handlers.onError?.(error)
      );
      unsubscribers.push(unsub);
    }

    if (handlers.onStorySections) {
      const unsub = onSnapshot(
        collection(db, 'storySections'),
        (snapshot) => {
          const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as StorySection));
          setLocal(LS_KEYS.STORY, data);
          handlers.onStorySections?.(data);
        },
        (error) => handlers.onError?.(error)
      );
      unsubscribers.push(unsub);
    }

    if (handlers.onProfile || handlers.onGapYear) {
      const unsub = onSnapshot(
        collection(db, 'meta'),
        (snapshot) => {
          const profileDoc = snapshot.docs.find(d => d.id === 'profile');
          if (profileDoc && handlers.onProfile) {
            const profileData = profileDoc.data() as ProfileData;
            setLocal(LS_KEYS.PROFILE, profileData);
            handlers.onProfile(profileData);
          }
          
          const gapYearDoc = snapshot.docs.find(d => d.id === 'gapYear');
          if (gapYearDoc && handlers.onGapYear) {
            const gapYearData = gapYearDoc.data() as GapYearData;
            setLocal(LS_KEYS.GAP_YEAR, gapYearData);
            handlers.onGapYear(gapYearData);
          }
        },
        (error) => handlers.onError?.(error)
      );
      unsubscribers.push(unsub);
    }
  } catch (err) {
    handlers.onError?.(err);
  }

  return () => {
    unsubscribers.forEach(unsub => {
      try {
        unsub();
      } catch {}
    });
  };
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
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    scholarships: getLocalScholarships(),
    tasks: getLocalTasks(),
    documents: getLocalDocuments(),
    activities: getLocalActivities(),
    profile: getLocalProfile(),
    gapYear: getLocalGapYear(),
    storySections: getLocalStorySections(),
  };
};

export const importAllData = async (data: FullBackupData): Promise<void> => {
  if (!data || !Array.isArray(data.scholarships)) {
    throw new Error('Invalid backup format');
  }

  // Update localStorage immediately
  setLocal(LS_KEYS.SCHOLARSHIPS, data.scholarships);
  setLocal(LS_KEYS.TASKS, data.tasks || []);
  setLocal(LS_KEYS.DOCUMENTS, data.documents || []);
  setLocal(LS_KEYS.ACTIVITIES, data.activities || []);
  if (data.profile) setLocal(LS_KEYS.PROFILE, data.profile);
  if (data.gapYear) setLocal(LS_KEYS.GAP_YEAR, data.gapYear);
  if (data.storySections) setLocal(LS_KEYS.STORY, data.storySections);

  // If Firebase is configured and alive, sync to remote
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    for (const s of data.scholarships) await setDoc(doc(db, 'scholarships', s.id), s).catch(() => {});
    for (const t of (data.tasks || [])) await setDoc(doc(db, 'tasks', t.id), t).catch(() => {});
    for (const d of (data.documents || [])) await setDoc(doc(db, 'documents', d.id), d).catch(() => {});
    for (const a of (data.activities || [])) await setDoc(doc(db, 'activities', a.id), a).catch(() => {});
    if (data.profile) await setDoc(doc(db, 'meta', 'profile'), data.profile).catch(() => {});
    if (data.gapYear) await setDoc(doc(db, 'meta', 'gapYear'), data.gapYear).catch(() => {});
    for (const st of (data.storySections || [])) await setDoc(doc(db, 'storySections', st.id), st).catch(() => {});
  }
};
