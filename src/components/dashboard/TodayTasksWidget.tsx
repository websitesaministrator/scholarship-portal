'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const TodayTasksWidget = () => {
  const { todayTasks, toggleTaskComplete, openQuickAdd, setActiveTab, setSelectedScholarshipId } = useApp();

  const sortedTasks = [...todayTasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const completedCount = todayTasks.filter(t => t.completed).length;

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">Today&apos;s Focus</h3>
          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            {completedCount}/{todayTasks.length} done
          </span>
        </div>

        <button
          onClick={() => openQuickAdd('task')}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {todayTasks.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs font-semibold text-slate-800">You&apos;re clear for today!</div>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            No pending tasks due today. Enjoy your progress or get ahead on upcoming deadlines.
          </p>
          <button
            onClick={() => openQuickAdd('task')}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task for Today</span>
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 group ${
                task.completed
                  ? 'bg-slate-50/60 border-slate-100 opacity-60'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  )}
                </button>

                <div className="min-w-0">
                  <div
                    className={`text-xs font-medium truncate ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    {task.dueTime && <span>{task.dueTime}</span>}
                    {task.scholarshipName && (
                      <span
                        onClick={() => {
                          if (task.scholarshipId) {
                            setSelectedScholarshipId(task.scholarshipId);
                            setActiveTab('scholarships');
                          }
                        }}
                        className="text-blue-600 hover:underline cursor-pointer truncate max-w-[160px]"
                      >
                        {task.scholarshipName}
                      </span>
                    )}
                    {task.documentName && (
                      <span className="text-amber-700 truncate max-w-[140px]">
                        Doc: {task.documentName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                    task.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : task.priority === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-2 text-right">
            <button
              onClick={() => setActiveTab('todos')}
              className="text-[11px] text-slate-500 hover:text-blue-600 inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
