'use client';

import React from 'react';
import { Calendar, CheckSquare, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const WorkloadSummaryWidget = () => {
  const { todayTasks, thisWeekTasks, thisMonthTasks, overdueTasks, setActiveTab } = useApp();

  const incompleteToday = todayTasks.filter(t => !t.completed).length;
  const completedToday = todayTasks.filter(t => t.completed).length;

  const incompleteWeek = thisWeekTasks.filter(t => !t.completed).length;
  const completedWeek = thisWeekTasks.filter(t => t.completed).length;

  const incompleteMonth = thisMonthTasks.filter(t => !t.completed).length;

  const cards = [
    {
      label: 'Today',
      count: incompleteToday,
      subtext: `${completedToday} completed`,
      icon: Clock,
      color: 'blue',
      badge: incompleteToday === 0 ? 'Clear' : `${incompleteToday} pending`,
    },
    {
      label: 'This Week',
      count: incompleteWeek,
      subtext: `${completedWeek} completed / ${thisWeekTasks.length} total`,
      icon: Calendar,
      color: 'indigo',
      badge: `${incompleteWeek} remaining`,
    },
    {
      label: 'This Month',
      count: incompleteMonth,
      subtext: `${thisMonthTasks.length} scheduled total`,
      icon: CheckSquare,
      color: 'emerald',
      badge: 'Active Workload',
    },
    {
      label: 'Overdue',
      count: overdueTasks.length,
      subtext: overdueTasks.length > 0 ? 'Needs attention' : 'Zero backlog',
      icon: AlertTriangle,
      color: overdueTasks.length > 0 ? 'rose' : 'zinc',
      badge: overdueTasks.length > 0 ? 'Action Required' : 'On Track',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isRose = card.color === 'rose';

        return (
          <div
            key={card.label}
            onClick={() => setActiveTab('todos')}
            className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
              isRose && card.count > 0
                ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                : 'bg-white border-[#E2E8F0] hover:border-blue-400 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold text-slate-700">{card.label}</span>
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isRose && card.count > 0 ? 'text-rose-600' : 'text-slate-400 group-hover:text-blue-600'
                }`}
              />
            </div>

            <div className="my-2.5">
              <div
                className={`text-2xl font-bold tracking-tight ${
                  isRose && card.count > 0 ? 'text-rose-700' : 'text-slate-900'
                }`}
              >
                {card.count}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{card.subtext}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
              <span
                className={`font-semibold ${
                  isRose && card.count > 0 ? 'text-rose-600' : 'text-slate-500 group-hover:text-blue-600'
                }`}
              >
                {card.badge}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
