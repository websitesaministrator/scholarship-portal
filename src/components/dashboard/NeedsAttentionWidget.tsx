'use client';

import React from 'react';
import { AlertCircle, Clock, FileWarning, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const NeedsAttentionWidget = () => {
  const { needsAttentionItems, setActiveTab, setSelectedScholarshipId } = useApp();

  if (needsAttentionItems.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center gap-3 text-emerald-800 shadow-xs">
        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
        <div>
          <div className="text-xs font-semibold text-emerald-900">All clear! No urgent bottlenecks</div>
          <div className="text-[11px] text-emerald-700">All deadlines, document expiries, and tasks are under control.</div>
        </div>
      </div>
    );
  }

  const handleAction = (tab: any, entityId?: string) => {
    if (entityId && tab === 'scholarships') {
      setSelectedScholarshipId(entityId);
    }
    setActiveTab(tab);
  };

  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
            Needs Attention ({needsAttentionItems.length})
          </h3>
        </div>
        <span className="text-[10px] text-amber-700 font-medium">Proactive Alerts</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {needsAttentionItems.map((item) => {
          const isUrgent = item.priority === 'urgent';
          return (
            <div
              key={item.id}
              onClick={() => handleAction(item.actionTab, item.entityId)}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-3 group shadow-xs ${
                isUrgent
                  ? 'bg-white border-rose-200 hover:border-rose-400 hover:shadow-sm'
                  : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {item.type === 'deadline' && (
                  <Clock className={`w-4 h-4 mt-0.5 shrink-0 ${isUrgent ? 'text-rose-600' : 'text-amber-600'}`} />
                )}
                {item.type === 'document' && (
                  <FileWarning className={`w-4 h-4 mt-0.5 shrink-0 ${isUrgent ? 'text-rose-600' : 'text-amber-600'}`} />
                )}
                {(item.type === 'task' || item.type === 'requirement') && (
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isUrgent ? 'text-rose-600' : 'text-amber-600'}`} />
                )}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isUrgent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.subtitle}</p>
                </div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 self-center" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
