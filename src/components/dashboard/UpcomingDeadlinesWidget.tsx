'use client';

import React from 'react';
import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const UpcomingDeadlinesWidget = () => {
  const { scholarships, setSelectedScholarshipId, setActiveTab } = useApp();

  const now = new Date();

  const sortedUpcoming = [...scholarships]
    .filter(s => s.status !== 'Rejected' && s.status !== 'Withdrawn')
    .map(s => {
      const deadlineDate = new Date(s.deadline);
      const diffMs = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const totalReqs = s.requirements?.length || 0;
      const completedReqs = (s.requirements || []).filter(
        r => r.status === 'Ready' || r.status === 'Submitted' || r.status === 'Not Required'
      ).length;

      return {
        ...s,
        diffDays,
        totalReqs,
        completedReqs,
        percent: totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0,
      };
    })
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 4);

  const handleSelect = (id: string) => {
    setSelectedScholarshipId(id);
    setActiveTab('scholarships');
  };

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">Upcoming Deadlines</h3>
        </div>

        <button
          onClick={() => setActiveTab('scholarships')}
          className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2.5">
        {sortedUpcoming.map((item) => {
          const isUrgent = item.diffDays <= 5 && item.diffDays >= 0;
          const isPassed = item.diffDays < 0;

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.country} • {item.fundingType.split(' ')[0]}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
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
                      ? 'Due Today!'
                      : `${item.diffDays} days remaining`}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {item.deadline}
                  </div>
                </div>
              </div>

              {/* Requirements Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                    <span>Requirements</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {item.completedReqs}/{item.totalReqs} complete ({item.percent}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.percent === 100
                        ? 'bg-emerald-500'
                        : item.percent > 50
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
