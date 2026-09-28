'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Scholarship,
  Task,
  DocumentItem,
  ActivityItem,
  ProfileData,
  GapYearData,
  StorySection,
  ActiveNavTab,
} from '@/types';
import {
  getLocalScholarships,
  getLocalTasks,
  getLocalDocuments,
  getLocalActivities,
  getLocalProfile,
  getLocalGapYear,
  getLocalStorySections,
  saveScholarship as saveSchStorage,
  deleteScholarship as deleteSchStorage,
  saveTask as saveTaskStorage,
  deleteTask as deleteTaskStorage,
  saveDocument as saveDocStorage,
  deleteDocument as deleteDocStorage,
  uploadDocumentFile as uploadDocFileStorage,
  saveActivity as saveActStorage,
  deleteActivity as deleteActStorage,
  saveProfile as saveProfStorage,
  saveGapYear as saveGapStorage,
  saveStorySection as saveStoryStorage,
  deleteStorySection as deleteStoryStorage,
  initializeLocalSeedData,
  probeFirestoreStatus,
  subscribeToRealtimeUpdates,
  SyncStatus,
  importAllData,
  exportAllData,
} from '@/lib/storage';
import { isFirebaseConfigured } from '@/lib/firebase';

export interface AttentionItem {
  id: string;
  type: 'deadline' | 'document' | 'task' | 'requirement';
  title: string;
  subtitle: string;
  badge: string;
  priority: 'urgent' | 'warning' | 'info';
  actionTab: ActiveNavTab;
  entityId?: string;
}

interface AppContextType {
  // Navigation & Modals
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  isQuickAddOpen: boolean;
  openQuickAdd: (defaultType?: 'task' | 'scholarship' | 'document' | 'activity') => void;
  closeQuickAdd: () => void;
  quickAddDefaultType: 'task' | 'scholarship' | 'document' | 'activity';
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isFirebaseSettingsOpen: boolean;
  setIsFirebaseSettingsOpen: (open: boolean) => void;
  
  // Detail selection
  selectedScholarshipId: string | null;
  setSelectedScholarshipId: (id: string | null) => void;
  
  // Data
  scholarships: Scholarship[];
  tasks: Task[];
  documents: DocumentItem[];
  activities: ActivityItem[];
  profile: ProfileData;
  gapYear: GapYearData;
  storySections: StorySection[];
  
  // CRUD actions
  addOrUpdateScholarship: (scholarship: Scholarship) => Promise<void>;
  removeScholarship: (id: string) => Promise<void>;
  addOrUpdateTask: (task: Task) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  rescheduleTask: (taskId: string, newDueDate: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  addOrUpdateDocument: (docItem: DocumentItem) => Promise<void>;
  uploadFileForDocument: (file: File, docId: string, onProgress?: (percent: number) => void) => Promise<{ fileUrl: string; filePath: string }>;
  removeDocument: (id: string, filePath?: string) => Promise<void>;
  addOrUpdateActivity: (activity: ActivityItem) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  updateProfile: (profile: ProfileData) => Promise<void>;
  updateGapYear: (gap: GapYearData) => Promise<void>;
  addOrUpdateStorySection: (story: StorySection) => Promise<void>;
  removeStorySection: (id: string) => Promise<void>;
  
  // Computed helpers
  todayStr: string;
  todayTasks: Task[];
  thisWeekTasks: Task[];
  thisMonthTasks: Task[];
  overdueTasks: Task[];
  upcomingTasks: Task[];
  activeScholarships: Scholarship[];
  needsAttentionItems: AttentionItem[];
  
  // System state
  isLoading: boolean;
  firebaseActive: boolean;
  syncStatus: SyncStatus;
  syncStatusMessage: string;
  refreshAllData: () => Promise<void>;
  triggerCelebration: () => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDefaultType, setQuickAddDefaultType] = useState<'task' | 'scholarship' | 'document' | 'activity'>('task');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFirebaseSettingsOpen, setIsFirebaseSettingsOpen] = useState(false);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);

  // Instant 0ms local initial state
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseActive, setFirebaseActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [syncStatusMessage, setSyncStatusMessage] = useState('Local Storage Mode');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Core Data States - initialized immediately from local cache
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    if (typeof window !== 'undefined') {
      initializeLocalSeedData();
      return getLocalScholarships();
    }
    return [];
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') return getLocalTasks();
    return [];
  });
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') return getLocalDocuments();
    return [];
  });
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    if (typeof window !== 'undefined') return getLocalActivities();
    return [];
  });
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (typeof window !== 'undefined') return getLocalProfile();
    return {} as ProfileData;
  });
  const [gapYear, setGapYear] = useState<GapYearData>(() => {
    if (typeof window !== 'undefined') return getLocalGapYear();
    return {} as GapYearData;
  });
  const [storySections, setStorySections] = useState<StorySection[]>(() => {
    if (typeof window !== 'undefined') return getLocalStorySections();
    return [];
  });

  // Format today as YYYY-MM-DD
  const todayStr = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 3200);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'],
      });
    } catch {
      // safe fallback
    }
  };

  const openQuickAdd = (defaultType: 'task' | 'scholarship' | 'document' | 'activity' = 'task') => {
    setQuickAddDefaultType(defaultType);
    setIsQuickAddOpen(true);
  };

  const closeQuickAdd = () => {
    setIsQuickAddOpen(false);
  };

  // Sync and probe in background without blocking UI
  const refreshAllData = async () => {
    initializeLocalSeedData();
    // Load local immediately
    setScholarships(getLocalScholarships());
    setTasks(getLocalTasks());
    setDocuments(getLocalDocuments());
    setActivities(getLocalActivities());
    setProfile(getLocalProfile());
    setGapYear(getLocalGapYear());
    setStorySections(getLocalStorySections());

    const fbConfigured = isFirebaseConfigured();
    setFirebaseActive(fbConfigured);

    if (fbConfigured) {
      const probe = await probeFirestoreStatus();
      setSyncStatus(probe.status);
      setSyncStatusMessage(probe.message);
      if (probe.status === 'connected') {
        // Wait for onSnapshot to pull latest data.
        // We no longer blindly push local to remote on load to prevent data loss.
      }
    } else {
      setSyncStatus('offline');
      setSyncStatusMessage('Local Storage Mode');
    }
  };

  useEffect(() => {
    // 1. Initial hydration
    refreshAllData();

    // 2. Real-time Firestore sync listener
    const unsubscribe = subscribeToRealtimeUpdates({
      onScholarships: (schs) => setScholarships(schs),
      onTasks: (tsks) => setTasks(tsks),
      onDocuments: (docs) => setDocuments(docs),
      onActivities: (acts) => setActivities(acts),
      onStorySections: (stories) => setStorySections(stories),
      onProfile: (prof) => setProfile(prof),
      onGapYear: (gap) => setGapYear(gap),
      onError: (err) => {
        const msg = err?.message || '';
        if (msg.includes('Cloud Firestore API has not been used') || err?.code === 'permission-denied') {
          setSyncStatus('not_created');
          setSyncStatusMessage('Firestore Database not enabled yet in Firebase Console');
        }
      },
    });

    // 3. Keyboard Shortcuts: Ctrl+K or Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsQuickAddOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribe();
    };
  }, []);

  // CRUD Operations with Optimistic UI updates
  const addOrUpdateScholarship = async (sch: Scholarship) => {
    setScholarships(prev => {
      const idx = prev.findIndex(s => s.id === sch.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = sch;
        return next;
      }
      return [sch, ...prev];
    });
    await saveSchStorage(sch);
    showToast(`Scholarship "${sch.name}" saved!`);
  };

  const removeScholarship = async (id: string) => {
    const target = scholarships.find(s => s.id === id);
    setScholarships(prev => prev.filter(s => s.id !== id));
    await deleteSchStorage(id);
    showToast(`Deleted ${target?.name || 'scholarship'}`);
    if (selectedScholarshipId === id) setSelectedScholarshipId(null);
  };

  const addOrUpdateTask = async (task: Task) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === task.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = task;
        return next;
      }
      return [task, ...prev];
    });
    await saveTaskStorage(task);
    showToast(`Task saved`);
  };

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const isNowCompleted = !task.completed;
    const updated: Task = {
      ...task,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
    await saveTaskStorage(updated);

    if (isNowCompleted) {
      triggerCelebration();
      showToast('Task completed! Keep up the momentum.');
    }
  };

  const rescheduleTask = async (taskId: string, newDueDate: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updated: Task = {
      ...task,
      dueDate: newDueDate,
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
    await saveTaskStorage(updated);
    showToast(`Moved to ${newDueDate}`);
  };

  const removeTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await deleteTaskStorage(id);
    showToast('Task removed');
  };

  const addOrUpdateDocument = async (docItem: DocumentItem) => {
    setDocuments(prev => {
      const idx = prev.findIndex(d => d.id === docItem.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = docItem;
        return next;
      }
      return [docItem, ...prev];
    });
    await saveDocStorage(docItem);
    showToast(`Document "${docItem.name}" saved!`);
  };

  const uploadFileForDocument = async (
    file: File,
    docId: string,
    onProgress?: (percent: number) => void
  ) => {
    return await uploadDocFileStorage(file, docId, onProgress);
  };

  const removeDocument = async (id: string, filePath?: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    await deleteDocStorage(id, filePath);
    showToast('Document deleted');
  };

  const addOrUpdateActivity = async (activity: ActivityItem) => {
    setActivities(prev => {
      const idx = prev.findIndex(a => a.id === activity.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = activity;
        return next;
      }
      return [activity, ...prev];
    });
    await saveActStorage(activity);
    showToast(`Activity "${activity.title}" saved!`);
  };

  const removeActivity = async (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    await deleteActStorage(id);
    showToast('Activity removed');
  };

  const updateProfile = async (newProfile: ProfileData) => {
    setProfile(newProfile);
    await saveProfStorage(newProfile);
    showToast('Profile updated!');
  };

  const updateGapYear = async (newGap: GapYearData) => {
    setGapYear(newGap);
    await saveGapStorage(newGap);
    showToast('Gap Year details updated!');
  };

  const addOrUpdateStorySection = async (story: StorySection) => {
    setStorySections(prev => {
      const idx = prev.findIndex(s => s.id === story.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = story;
        return next;
      }
      return [story, ...prev];
    });
    await saveStoryStorage(story);
    showToast('Story section updated!');
  };

  const removeStorySection = async (id: string) => {
    setStorySections(prev => prev.filter(s => s.id !== id));
    await deleteStoryStorage(id);
    showToast('Story section removed');
  };

  // ================= DATE & TASK COMPUTATIONS =================
  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.dueDate === todayStr);
  }, [tasks, todayStr]);

  const overdueTasks = useMemo(() => {
    return tasks.filter(t => !t.completed && t.dueDate < todayStr);
  }, [tasks, todayStr]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter(t => !t.completed && t.dueDate > todayStr);
  }, [tasks, todayStr]);

  // Current calendar week (Monday to Sunday)
  const thisWeekTasks = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const monStr = monday.toISOString().split('T')[0];
    const sunStr = sunday.toISOString().split('T')[0];

    return tasks.filter(t => t.dueDate >= monStr && t.dueDate <= sunStr);
  }, [tasks]);

  // Current calendar month
  const thisMonthTasks = useMemo(() => {
    const [year, month] = todayStr.split('-');
    const prefix = `${year}-${month}`;
    return tasks.filter(t => t.dueDate.startsWith(prefix));
  }, [tasks, todayStr]);

  const activeScholarships = useMemo(() => {
    return scholarships.filter(s => s.status !== 'Rejected' && s.status !== 'Withdrawn');
  }, [scholarships]);

  // Proactive "Needs Attention" rule engine
  const needsAttentionItems = useMemo((): AttentionItem[] => {
    const items: AttentionItem[] = [];
    const now = new Date();

    // 1. Scholarships with deadlines <= 5 days
    scholarships.forEach(s => {
      if (s.status === 'Accepted' || s.status === 'Rejected' || s.status === 'Withdrawn') return;
      const deadlineDate = new Date(s.deadline);
      const diffMs = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 5 && diffDays >= 0) {
        items.push({
          id: `attn-sch-${s.id}`,
          type: 'deadline',
          title: `${s.name}`,
          subtitle: diffDays === 0 ? 'Deadline is TODAY!' : `Deadline in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
          badge: 'Imminent Deadline',
          priority: 'urgent',
          actionTab: 'scholarships',
          entityId: s.id,
        });
      } else if (diffDays < 0 && s.status !== 'Applied') {
        items.push({
          id: `attn-sch-past-${s.id}`,
          type: 'deadline',
          title: `${s.name}`,
          subtitle: `Deadline passed (${s.deadline}) - Update status`,
          badge: 'Past Deadline',
          priority: 'warning',
          actionTab: 'scholarships',
          entityId: s.id,
        });
      }
    });

    // 2. Expiring Documents within 90 days
    documents.forEach(d => {
      if (!d.expiryDate) return;
      const expDate = new Date(d.expiryDate);
      const diffMs = expDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 90 && diffDays > 0) {
        items.push({
          id: `attn-doc-${d.id}`,
          type: 'document',
          title: d.name,
          subtitle: `Expires in ${diffDays} days (${d.expiryDate})`,
          badge: 'Doc Expiring',
          priority: diffDays <= 30 ? 'urgent' : 'warning',
          actionTab: 'documents',
          entityId: d.id,
        });
      } else if (diffDays <= 0) {
        items.push({
          id: `attn-doc-exp-${d.id}`,
          type: 'document',
          title: d.name,
          subtitle: `EXPIRED on ${d.expiryDate}`,
          badge: 'Expired Document',
          priority: 'urgent',
          actionTab: 'documents',
          entityId: d.id,
        });
      }
    });

    // 3. Overdue Tasks
    overdueTasks.forEach(t => {
      items.push({
        id: `attn-task-${t.id}`,
        type: 'task',
        title: t.title,
        subtitle: `Overdue since ${t.dueDate}`,
        badge: 'Overdue Task',
        priority: 'urgent',
        actionTab: 'todos',
        entityId: t.id,
      });
    });

    return items;
  }, [scholarships, documents, overdueTasks]);

  const value = {
    activeTab,
    setActiveTab,
    isQuickAddOpen,
    openQuickAdd,
    closeQuickAdd,
    quickAddDefaultType,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isFirebaseSettingsOpen,
    setIsFirebaseSettingsOpen,
    selectedScholarshipId,
    setSelectedScholarshipId,
    scholarships,
    tasks,
    documents,
    activities,
    profile,
    gapYear,
    storySections,
    addOrUpdateScholarship,
    removeScholarship,
    addOrUpdateTask,
    toggleTaskComplete,
    rescheduleTask,
    removeTask,
    addOrUpdateDocument,
    uploadFileForDocument,
    removeDocument,
    addOrUpdateActivity,
    removeActivity,
    updateProfile,
    updateGapYear,
    addOrUpdateStorySection,
    removeStorySection,
    todayStr,
    todayTasks,
    thisWeekTasks,
    thisMonthTasks,
    overdueTasks,
    upcomingTasks,
    activeScholarships,
    needsAttentionItems,
    isLoading,
    firebaseActive,
    syncStatus,
    syncStatusMessage,
    refreshAllData,
    triggerCelebration,
    toastMessage,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
