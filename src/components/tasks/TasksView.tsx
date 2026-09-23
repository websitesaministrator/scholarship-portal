'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Task, TaskPriority } from '@/types';

type TaskViewSegment = 'today' | 'upcoming' | 'week' | 'month' | 'overdue' | 'all';

export const TasksView = () => {
  const {
    tasks,
    todayStr,
    toggleTaskComplete,
    rescheduleTask,
    removeTask,
    openQuickAdd,
    setSelectedScholarshipId,
    setActiveTab,
  } = useApp();

  const [segment, setSegment] = useState<TaskViewSegment>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Date helper functions
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const nextWeekStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, []);

  // Filter tasks based on segment and filters
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      result = result.filter(t => t.priority === selectedPriority);
    }

    // Segment filter
    if (segment === 'today') {
      result = result.filter(t => t.dueDate === todayStr);
    } else if (segment === 'overdue') {
      result = result.filter(t => !t.completed && t.dueDate < todayStr);
    } else if (segment === 'upcoming') {
      result = result.filter(t => !t.completed && t.dueDate > todayStr);
    } else if (segment === 'month') {
      const [year, month] = todayStr.split('-');
      result = result.filter(t => t.dueDate.startsWith(`${year}-${month}`));
    } else if (segment === 'week') {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const distanceToMonday = (dayOfWeek + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - distanceToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const monStr = monday.toISOString().split('T')[0];
      const sunStr = sunday.toISOString().split('T')[0];
      result = result.filter(t => t.dueDate >= monStr && t.dueDate <= sunStr);
    }

    // Sort: incomplete first, then priority (High > Med > Low), then due date
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pMap: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
      if (pMap[a.priority] !== pMap[b.priority]) return pMap[b.priority] - pMap[a.priority];
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, segment, selectedCategory, selectedPriority, todayStr]);

  // Day breakdown for This Week view
  const weekDaysBreakdown = useMemo(() => {
    if (segment !== 'week') return null;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    return days.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      return {
        dayName,
        dateStr,
        isToday: dateStr === todayStr,
        tasks: dayTasks,
      };
    });
  }, [segment, tasks, todayStr]);

  const incompleteCount = filteredTasks.filter(t => !t.completed).length;
  const completedCount = filteredTasks.filter(t => t.completed).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Scholarship To-Do & Execution Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Tasks & Milestones
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {incompleteCount} pending • {completedCount} completed
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('task')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Segment Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setSegment('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              segment === 'today'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSegment('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              segment === 'week'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSegment('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              segment === 'month'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSegment('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              segment === 'upcoming'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSegment('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              segment === 'overdue'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Overdue</span>
            {tasks.filter(t => !t.completed && t.dueDate < todayStr).length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            )}
          </button>
          <button
            onClick={() => setSegment('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              segment === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Tasks
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-blue-400"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-blue-400"
          >
            <option value="all">All Categories</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Documents">Documents</option>
            <option value="Essay">Essay</option>
            <option value="Recommendation">Recommendation</option>
            <option value="Test">Test / Exam</option>
            <option value="Finance">Finance</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Week Day-by-Day View */}
      {segment === 'week' && weekDaysBreakdown ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between text-xs">
            <span className="text-slate-800 font-semibold">Weekly Execution Calendar</span>
            <span className="text-slate-500 font-medium">
              {filteredTasks.filter(t => t.completed).length} of {filteredTasks.length} tasks completed this week
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weekDaysBreakdown.map((day) => (
              <div
                key={day.dateStr}
                className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-[160px] shadow-xs transition-all ${
                  day.isToday
                    ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/30'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {day.dayName}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        day.isToday
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-500 bg-slate-100'
                      }`}
                    >
                      {day.dateStr.slice(5)}
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-2.5">
                    {day.tasks.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic py-2">No tasks scheduled</div>
                    ) : (
                      day.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-2 text-xs group"
                        >
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className="text-slate-400 hover:text-emerald-600 mt-0.5 shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                            )}
                          </button>
                          <span
                            className={`truncate ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openQuickAdd('task')}
                  className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add for {day.dayName}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard Tasks List View */
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
              <Sparkles className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-semibold text-slate-800">No tasks in this view</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                {segment === 'overdue'
                  ? 'No overdue tasks! You are completely on track.'
                  : 'Add a new task to organize your scholarship application deadlines.'}
              </p>
              <button
                onClick={() => openQuickAdd('task')}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isOverdue = !task.completed && task.dueDate < todayStr;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-xs ${
                    task.completed
                      ? 'bg-slate-50/50 border-slate-200/60 opacity-60'
                      : isOverdue
                      ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Left: Checkbox + Title + Description + Metadata */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors mt-0.5 shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>

                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${
                            task.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : task.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1.5 flex-wrap">
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Due: {task.dueDate}</span>
                          {isOverdue && <span>(Overdue!)</span>}
                        </span>

                        {task.scholarshipName && (
                          <span
                            onClick={() => {
                              if (task.scholarshipId) {
                                setSelectedScholarshipId(task.scholarshipId);
                                setActiveTab('scholarships');
                              }
                            }}
                            className="text-blue-600 hover:underline cursor-pointer truncate max-w-[200px]"
                          >
                            🔗 {task.scholarshipName}
                          </span>
                        )}

                        {task.documentName && (
                          <span className="text-amber-700 truncate max-w-[180px]">
                            📄 {task.documentName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Fast Rescheduling Controls & Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quick Rescheduling Pills */}
                    {!task.completed && (
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          onClick={() => rescheduleTask(task.id, todayStr)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium border border-slate-200"
                          title="Move to Today"
                        >
                          Today
                        </button>
                        <button
                          onClick={() => rescheduleTask(task.id, tomorrowStr)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium border border-slate-200"
                          title="Move to Tomorrow"
                        >
                          Tmrw
                        </button>
                        <button
                          onClick={() => rescheduleTask(task.id, nextWeekStr)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium border border-slate-200"
                          title="Move to Next Week"
                        >
                          +1W
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
