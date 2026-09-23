'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CheckCircle,
  Download,
  Upload,
  ExternalLink,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  getActiveFirebaseConfig,
  saveFirebaseConfig,
  FirebaseConfig,
} from '@/lib/firebase';
import { exportAllData, importAllData, FullBackupData } from '@/lib/storage';

export const FirebaseConfigModal = () => {
  const {
    isFirebaseSettingsOpen,
    setIsFirebaseSettingsOpen,
    firebaseActive,
    refreshAllData,
    showToast,
  } = useApp();

  const [config, setConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isFirebaseSettingsOpen) {
      setConfig(getActiveFirebaseConfig());
    }
  }, [isFirebaseSettingsOpen]);

  if (!isFirebaseSettingsOpen) return null;

  const handleSaveFirebase = async (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(config);
    showToast('Firebase configuration saved! Reconnecting...');
    await refreshAllData();
    setIsFirebaseSettingsOpen(false);
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scholarship_os_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Full backup downloaded!');
    } catch {
      showToast('Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as FullBackupData;
        await importAllData(parsed);
        showToast('Backup restored successfully!');
        await refreshAllData();
        setIsFirebaseSettingsOpen(false);
      } catch {
        showToast('Invalid backup file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const envSnippet = `# Add these to .env.local or Vercel Environment Variables
NEXT_PUBLIC_FIREBASE_API_KEY="${config.apiKey || 'your-api-key'}"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${config.authDomain || 'your-project.firebaseapp.com'}"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="${config.projectId || 'your-project-id'}"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${config.storageBucket || 'your-project.appspot.com'}"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${config.messagingSenderId || '123456789'}"
NEXT_PUBLIC_FIREBASE_APP_ID="${config.appId || '1:123456789:web:abcdef'}"`;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(envSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast('Copied .env.local snippet');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={() => setIsFirebaseSettingsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Cloud Sync & Data Settings
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage Firebase Cloud Firestore & Storage integration
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFirebaseSettingsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700">
          {/* Status banner */}
          <div
            className={`p-3.5 rounded-lg border flex items-start gap-3 ${
              firebaseActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {firebaseActive ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <HardDrive className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            )}
            <div>
              <div className="font-semibold text-slate-900">
                {firebaseActive
                  ? 'Connected to Firebase Cloud'
                  : 'Currently Running in Local Storage Mode'}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {firebaseActive
                  ? 'Your scholarships, deadlines, tasks, and document scans sync in real time across all your logged-in browsers and phones.'
                  : 'Your data is being safely saved to this browser\'s persistent local storage. Connect Firebase below for instant multi-device syncing.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveFirebase} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Firebase Project Keys</span>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700 text-[11px] flex items-center gap-1 font-medium"
              >
                <span>Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                  API Key (apiKey)
                </label>
                <input
                  type="text"
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                  Project ID (projectId)
                </label>
                <input
                  type="text"
                  value={config.projectId || ''}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                  placeholder="scholarship-os-1234"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                  Storage Bucket (storageBucket)
                </label>
                <input
                  type="text"
                  value={config.storageBucket || ''}
                  onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                  placeholder="scholarship-os.appspot.com"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                  Auth Domain (authDomain)
                </label>
                <input
                  type="text"
                  value={config.authDomain || ''}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                  placeholder="scholarship-os.firebaseapp.com"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-sm flex items-center gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Save & Connect Firebase</span>
              </button>
            </div>
          </form>

          {/* Vercel .env.local Helper */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">Vercel & .env.local Configuration</span>
              <button
                onClick={copyEnvSnippet}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 border border-slate-200 font-medium"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>{isCopied ? 'Copied!' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-200 font-mono overflow-x-auto leading-relaxed">
              {envSnippet}
            </pre>
          </div>

          {/* Backup & Portability */}
          <div className="pt-2 border-t border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Data Portability & Backups</div>
            <p className="text-[11px] text-slate-500 mb-3">
              Export your complete scholarship portfolio, task history, and essay drafts as a single JSON file anytime, or restore from a previous backup.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportBackup}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Full Backup (JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Import Backup (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
