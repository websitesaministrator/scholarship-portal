'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

type TimelineRange = 'month' | '3months' | '6months' | 'all';

export const DeadlineTimeline = () => {
  const { scholarships, todayStr, setSelectedScholarshipId, setActiveTab } = useApp();
  const [range, setRange] = useState<TimelineRange>('3months');

  const today = useMemo(() => new Date(), []);

  // Filter scholarships based on range
  const timelineItems = useMemo(() => {
    const active = scholarships
      .filter(s => s.status !== 'Rejected' && s.status !== 'Withdrawn')
      .map(s => {
        const deadlineDate = new Date(s.deadline);
        const diffMs = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          ...s,
          diffDays,
          deadlineDate,
        };
      })
      .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());

    if (range === 'month') {
      return active.filter(s => s.diffDays >= -1 && s.diffDays <= 31);
    }
    if (range === '3months') {
      return active.filter(s => s.diffDays >= -5 && s.diffDays <= 92);
    }
    if (range === '6months') {
      return active.filter(s => s.diffDays >= -10 && s.diffDays <= 185);
    }
    return active;
  }, [scholarships, today, range]);

  const handleItemClick = (id: string) => {
    setSelectedScholarshipId(id);
    setActiveTab('scholarships');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Researching':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Preparing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ready to Apply':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Applied':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Interview':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Waiting':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
      {/* Header with Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Scholarship Deadline Timeline
          </h2>
          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            {timelineItems.length} active
          </span>
        </div>

        {/* View Switches */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto text-xs">
          <button
            onClick={() => setRange('month')}
            className={`px-2.5 py-1 rounded-md transition-all text-[11px] font-medium ${
              range === 'month'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setRange('3months')}
            className={`px-2.5 py-1 rounded-md transition-all text-[11px] font-medium ${
              range === '3months'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setRange('6months')}
            className={`px-2.5 py-1 rounded-md transition-all text-[11px] font-medium ${
              range === '6months'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setRange('all')}
            className={`px-2.5 py-1 rounded-md transition-all text-[11px] font-medium ${
              range === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Active
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Milestone Track */}
      <div className="hidden lg:block relative py-6 px-4 bg-[#F8FAFC] rounded-lg border border-slate-200/80 overflow-x-auto">
        {/* Timeline Horizontal Line */}
        <div className="relative h-1 bg-slate-200 rounded-full my-6 w-full min-w-[700px]">
          {/* Today Indicator */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center z-20">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-500/20" />
            <span className="absolute -top-7 text-[10px] font-bold text-blue-700 tracking-wider uppercase whitespace-nowrap bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shadow-xs">
              TODAY
            </span>
          </div>

          {/* Timeline Nodes */}
          <div className="flex justify-between items-center h-full pl-20 pr-6 min-w-[650px]">
            {timelineItems.map((item, idx) => {
              const isUrgent = item.diffDays <= 5 && item.diffDays >= 0;
              const isPassed = item.diffDays < 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="relative group cursor-pointer flex flex-col items-center"
                >
                  {/* Pin Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-125 z-10 ${
                      isUrgent
                        ? 'bg-rose-500 ring-2 ring-rose-500/30'
                        : isPassed
                        ? 'bg-slate-400'
                        : 'bg-blue-600 group-hover:bg-blue-700'
                    }`}
                  />

                  {/* Card on milestone */}
                  <div
                    className={`absolute w-44 p-2.5 rounded-lg border shadow-sm transition-all z-10 ${
                      idx % 2 === 0 ? '-top-24' : 'top-6'
                    } ${
                      isUrgent
                        ? 'bg-rose-50/90 border-rose-300 hover:border-rose-400'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-slate-900 truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{item.deadline}</span>
                      <span
                        className={`font-semibold ${
                          isUrgent
                            ? 'text-rose-600'
                            : isPassed
                            ? 'text-slate-500'
                            : 'text-blue-600'
                        }`}
                      >
                        {isPassed
                          ? 'Passed'
                          : item.diffDays === 0
                          ? 'Today!'
                          : `${item.diffDays}d left`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Vertical Timeline List */}
      <div className="lg:hidden space-y-3">
        {timelineItems.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No deadlines found for this timeframe.
          </div>
        ) : (
          <div className="relative pl-6 space-y-3 border-l-2 border-slate-200 ml-2">
            {/* Today indicator */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-500/20" />
              <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Today ({todayStr})
              </div>
            </div>

            {timelineItems.map((item) => {
              const isUrgent = item.diffDays <= 5 && item.diffDays >= 0;
              const isPassed = item.diffDays < 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="relative group p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-all shadow-xs"
                >
                  {/* Pin Dot */}
                  <span
                    className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                      isUrgent
                        ? 'bg-rose-500 ring-2 ring-rose-500/30'
                        : isPassed
                        ? 'bg-slate-400'
                        : 'bg-blue-600'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.university || item.country} • {item.degreeLevel}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${
                        isUrgent
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isPassed
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {isPassed
                        ? 'Passed'
                        : item.diffDays === 0
                        ? 'Today!'
                        : `${item.diffDays} days left`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Deadline: {item.deadline}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded border text-[9px] ${getStatusBadgeColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
