'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { CommandPalette } from '@/components/CommandPalette';
import { QuickAddModal } from '@/components/QuickAddModal';
import { FirebaseConfigModal } from '@/components/settings/FirebaseConfigModal';

import { DashboardView } from '@/components/dashboard/DashboardView';
import { TasksView } from '@/components/tasks/TasksView';
import { ScholarshipsView } from '@/components/scholarships/ScholarshipsView';
import { DocumentsView } from '@/components/documents/DocumentsView';
import { ActivitiesView } from '@/components/activities/ActivitiesView';
import { ProfileView } from '@/components/profile/ProfileView';

function MainContent() {
  const { activeTab, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#090A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <div className="text-xs text-zinc-400 font-medium">
            Loading Scholarship OS...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'todos' && <TasksView />}
      {activeTab === 'scholarships' && <ScholarshipsView />}
      {activeTab === 'documents' && <DocumentsView />}
      {activeTab === 'activities' && <ActivitiesView />}
      {activeTab === 'profile' && <ProfileView />}

      {/* Global Modals */}
      <CommandPalette />
      <QuickAddModal />
      <FirebaseConfigModal />
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppShell>
        <MainContent />
      </AppShell>
    </AppProvider>
  );
}
