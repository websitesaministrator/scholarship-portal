'use client';

import React, { useMemo } from 'react';
import { Calendar, Plus, Compass } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DeadlineTimeline } from './DeadlineTimeline';
import { NeedsAttentionWidget } from './NeedsAttentionWidget';
import { WorkloadSummaryWidget } from './WorkloadSummaryWidget';
import { TodayTasksWidget } from './TodayTasksWidget';
import { UpcomingDeadlinesWidget } from './UpcomingDeadlinesWidget';

export const DashboardView = () => {
  const { profile, scholarships, todayTasks, openQuickAdd } = useApp();

  const formattedDate = useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(now);
  }, []);

  const activeCount = scholarships.filter(
    s => s.status !== 'Rejected' && s.status !== 'Withdrawn'
  ).length;
  const todayPending = todayTasks.filter(t => !t.completed).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Greeting & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <Compass className="w-3.5 h-3.5" />
            <span>Gap Year Scholarship Command Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Good day, {profile.fullName ? profile.fullName.split(' ')[0] : 'Scholar'}
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
            <span>•</span>
            <span className="text-slate-700 font-medium">{activeCount} active opportunities</span>
            <span>•</span>
            <span className={todayPending > 0 ? 'text-amber-700 font-medium' : 'text-emerald-700 font-medium'}>
              {todayPending > 0 ? `${todayPending} tasks due today` : 'All tasks cleared today'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => openQuickAdd('scholarship')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Scholarship</span>
          </button>
          <button
            onClick={() => openQuickAdd('task')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 1. Proactive Needs Attention Section */}
      <NeedsAttentionWidget />

      {/* 2. Flagship Scholarship Deadline Timeline */}
      <DeadlineTimeline />

      {/* 3. Task Workload Summary Cards */}
      <WorkloadSummaryWidget />

      {/* 4. Two-Column Focus Area: Today's Tasks + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTasksWidget />
        <UpcomingDeadlinesWidget />
      </div>
    </div>
  );
};
