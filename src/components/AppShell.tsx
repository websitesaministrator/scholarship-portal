'use client';

import React, { ReactNode } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  GraduationCap,
  FolderArchive,
  Award,
  UserCheck,
  Plus,
  Search,
  Cloud,
  Settings,
  Sparkles,
  Database,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ActiveNavTab } from '@/types';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const {
    activeTab,
    setActiveTab,
    openQuickAdd,
    setIsCommandPaletteOpen,
    setIsFirebaseSettingsOpen,
    firebaseActive,
    todayTasks,
    overdueTasks,
    needsAttentionItems,
    scholarships,
    documents,
    toastMessage,
  } = useApp();

  const incompleteToday = todayTasks.filter(t => !t.completed).length;
  const expiredDocsCount = documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date()).length;
  const attentionCount = needsAttentionItems.length;

  const navItems: { tab: ActiveNavTab; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: attentionCount > 0 ? attentionCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
    },
    {
      tab: 'todos',
      label: 'To-Do',
      icon: CheckSquare,
      badge: (incompleteToday + overdueTasks.length) > 0 ? (incompleteToday + overdueTasks.length) : undefined,
      badgeColor: overdueTasks.length > 0 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    {
      tab: 'scholarships',
      label: 'Scholarships',
      icon: GraduationCap,
      badge: scholarships.length > 0 ? scholarships.length : undefined,
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
    {
      tab: 'documents',
      label: 'Documents',
      icon: FolderArchive,
      badge: expiredDocsCount > 0 ? expiredDocsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 border border-rose-200',
    },
    {
      tab: 'activities',
      label: 'Activities',
      icon: Award,
    },
    {
      tab: 'profile',
      label: 'Profile & Story',
      icon: UserCheck,
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] text-[#0F172A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in flex items-center gap-2.5 px-4 py-2.5 rounded-lg border shadow-lg backdrop-blur-md bg-white/95 text-sm border-slate-200">
          {toastMessage.type === 'success' && <Sparkles className="w-4 h-4 text-emerald-600" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
          {toastMessage.type === 'info' && <Database className="w-4 h-4 text-blue-600" />}
          <span className="text-slate-800 font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E2E8F0] bg-white select-none shrink-0 shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
        {/* Workspace Brand */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              S
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-1.5">
                Scholarship OS
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <span>Personal Gap Year</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Action: Quick Add */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={() => openQuickAdd('task')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Create</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System & Sync Status Footer */}
        <div className="p-3 border-t border-[#E2E8F0] space-y-1.5 bg-slate-50/50">
          <button
            onClick={() => setIsFirebaseSettingsOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors text-xs text-slate-600 group"
          >
            <div className="flex items-center gap-2">
              {firebaseActive ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Database className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="text-[11px] font-medium text-slate-700 group-hover:text-slate-900">
                {firebaseActive ? 'Firebase Cloud Active' : 'Local Storage Mode'}
              </span>
            </div>
            <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
          </button>

          <div className="px-2.5 pt-1 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Single-User Mode</span>
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-[#E2E8F0] bg-white px-4 md:px-6 flex items-center justify-between shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            {/* Search Trigger (Ctrl + K) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-white transition-all cursor-pointer w-48 sm:w-64"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="flex-1 text-left">Search or jump to...</span>
              <kbd className="hidden sm:inline-flex text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct Quick Add on Mobile */}
            <button
              onClick={() => openQuickAdd('task')}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>

            {/* Cloud Status Indicator */}
            <button
              onClick={() => setIsFirebaseSettingsOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border font-medium transition-colors ${
                firebaseActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  firebaseActive ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              ></span>
              <span className="hidden sm:inline">
                {firebaseActive ? 'Cloud Synced' : 'Offline / Local'}
              </span>
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-[#F8F9FA]">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 border-t border-[#E2E8F0] bg-white flex items-center justify-around px-2 z-40 shadow-lg">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-center justify-center w-14 h-full relative ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-medium">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-blue-600"></span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center w-14 h-full ${
              activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-medium">Story</span>
          </button>
        </div>
      </div>
    </div>
  );
};
