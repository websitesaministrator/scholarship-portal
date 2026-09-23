'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  CheckSquare,
  GraduationCap,
  FolderArchive,
  Award,
  BookOpen,
  Plus,
  ArrowRight,
  X,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    scholarships,
    tasks,
    documents,
    activities,
    storySections,
    setActiveTab,
    openQuickAdd,
    setSelectedScholarshipId,
    setIsFirebaseSettingsOpen,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        actions: [
          { id: 'act-new-task', label: 'Create New Task', icon: Plus, handler: () => openQuickAdd('task') },
          { id: 'act-new-sch', label: 'Add New Scholarship', icon: Plus, handler: () => openQuickAdd('scholarship') },
          { id: 'act-new-doc', label: 'Add New Document', icon: Plus, handler: () => openQuickAdd('document') },
          { id: 'act-new-activity', label: 'Add New Activity', icon: Plus, handler: () => openQuickAdd('activity') },
          { id: 'act-fb-settings', label: 'Firebase Sync & Cloud Settings', icon: BookOpen, handler: () => setIsFirebaseSettingsOpen(true) },
        ],
        scholarships: scholarships.slice(0, 3),
        tasks: tasks.filter(t => !t.completed).slice(0, 3),
        documents: documents.slice(0, 3),
        activities: activities.slice(0, 2),
        stories: storySections.slice(0, 2),
      };
    }

    return {
      actions: [
        { id: 'act-new-task', label: `Create task "${query}"`, icon: Plus, handler: () => openQuickAdd('task') },
      ],
      scholarships: scholarships.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.university?.toLowerCase().includes(q) ||
          s.fieldOfStudy.toLowerCase().includes(q)
      ),
      tasks: tasks.filter(
        t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      ),
      documents: documents.filter(
        d => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
      ),
      activities: activities.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q)
      ),
      stories: storySections.filter(
        st => st.title.toLowerCase().includes(q) || st.content.toLowerCase().includes(q)
      ),
    };
  }, [query, scholarships, tasks, documents, activities, storySections, openQuickAdd, setIsFirebaseSettingsOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 modal-backdrop"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search scholarships, tasks, docs..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 divide-y divide-slate-100 text-xs">
          {/* Quick Actions */}
          {searchResults.actions.length > 0 && (
            <div className="pt-1">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </div>
              <div className="space-y-0.5">
                {searchResults.actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.handler();
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2">
                      <action.icon className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scholarships */}
          {searchResults.scholarships.length > 0 && (
            <div className="pt-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Scholarships ({searchResults.scholarships.length})
              </div>
              <div className="space-y-0.5">
                {searchResults.scholarships.map(sch => (
                  <button
                    key={sch.id}
                    onClick={() => {
                      setSelectedScholarshipId(sch.id);
                      setActiveTab('scholarships');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-slate-900">{sch.name}</div>
                        <div className="text-[10px] text-slate-500">{sch.country} • {sch.fundingType}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {sch.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {searchResults.tasks.length > 0 && (
            <div className="pt-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Tasks ({searchResults.tasks.length})
              </div>
              <div className="space-y-0.5">
                {searchResults.tasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setActiveTab('todos');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-800 font-medium">{task.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {searchResults.documents.length > 0 && (
            <div className="pt-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Documents ({searchResults.documents.length})
              </div>
              <div className="space-y-0.5">
                {searchResults.documents.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveTab('documents');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FolderArchive className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-slate-800 font-medium">{doc.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{doc.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {searchResults.activities.length > 0 && (
            <div className="pt-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Activities ({searchResults.activities.length})
              </div>
              <div className="space-y-0.5">
                {searchResults.activities.map(act => (
                  <button
                    key={act.id}
                    onClick={() => {
                      setActiveTab('activities');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-slate-800 font-medium">{act.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{act.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Story Sections */}
          {searchResults.stories.length > 0 && (
            <div className="pt-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Personal Story Blocks ({searchResults.stories.length})
              </div>
              <div className="space-y-0.5">
                {searchResults.stories.map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setActiveTab('profile');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-slate-800 font-medium">{st.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press ⌘K anywhere to open</span>
          <span>Single-User Scholarship OS</span>
        </div>
      </div>
    </div>
  );
};
