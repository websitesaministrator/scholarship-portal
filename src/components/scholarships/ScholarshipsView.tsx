'use client';

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Clock,
  MapPin,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ScholarshipDetailModal } from './ScholarshipDetailModal';

export const ScholarshipsView = () => {
  const {
    scholarships,
    selectedScholarshipId,
    setSelectedScholarshipId,
    openQuickAdd,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [degreeFilter, setDegreeFilter] = useState<string>('all');

  const now = new Date();

  // Status counts for pipeline tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: scholarships.length };
    scholarships.forEach(s => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  }, [scholarships]);

  // Filtered scholarships
  const filtered = useMemo(() => {
    return scholarships.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (degreeFilter !== 'all' && s.degreeLevel !== degreeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchCountry = s.country.toLowerCase().includes(q);
        const matchUniv = s.university?.toLowerCase().includes(q) || false;
        const matchField = s.fieldOfStudy.toLowerCase().includes(q);
        if (!matchName && !matchCountry && !matchUniv && !matchField) return false;
      }
      return true;
    });
  }, [scholarships, statusFilter, degreeFilter, searchQuery]);

  const selectedScholarship = useMemo(() => {
    return scholarships.find(s => s.id === selectedScholarshipId) || null;
  }, [scholarships, selectedScholarshipId]);

  const pipelineTabs: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Researching', label: 'Researching' },
    { id: 'Preparing', label: 'Preparing' },
    { id: 'Ready to Apply', label: 'Ready to Apply' },
    { id: 'Applied', label: 'Applied' },
    { id: 'Interview', label: 'Interview' },
    { id: 'Waiting', label: 'Waiting' },
    { id: 'Accepted', label: 'Accepted 🎉' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Scholarship Opportunities CRM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Scholarship Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {scholarships.length} opportunities tracked across global universities
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('scholarship')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Pipeline Stages Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none text-xs">
        {pipelineTabs.map(tab => {
          const count = statusCounts[tab.id] || 0;
          const isActive = statusFilter === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, country, or university..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <select
            value={degreeFilter}
            onChange={e => setDegreeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="all">All Degrees</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Master's">Master&apos;s</option>
            <option value="PhD / Research">PhD / Research</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <GraduationCap className="w-6 h-6 text-slate-400 mx-auto" />
          <div className="text-xs font-semibold text-slate-800">No scholarships found</div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new scholarship opportunity.
          </p>
          <button
            onClick={() => openQuickAdd('scholarship')}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scholarship</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const deadlineDate = new Date(item.deadline);
            const diffMs = deadlineDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const isUrgent = diffDays <= 5 && diffDays >= 0;
            const isPassed = diffDays < 0;

            const totalReqs = item.requirements?.length || 0;
            const completedReqs = (item.requirements || []).filter(
              r => r.status === 'Ready' || r.status === 'Submitted' || r.status === 'Not Required'
            ).length;
            const percent = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedScholarshipId(item.id)}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{item.country}</span>
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                        item.status === 'Ready to Apply'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : item.status === 'Applied'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'Preparing'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <div className="mt-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.university || item.organization || item.country}</span>
                    </div>
                  </div>

                  {/* Funding & Degree */}
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Degree:</span>
                      <span className="font-medium text-slate-800">{item.degreeLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Funding:</span>
                      <span className="font-semibold text-emerald-700 truncate max-w-[140px]">
                        {item.fundingType.split('(')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Progress */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Requirements Progress</span>
                      <span className="font-medium text-slate-700">
                        {completedReqs}/{totalReqs} ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent === 100
                            ? 'bg-emerald-500'
                            : percent > 50
                            ? 'bg-blue-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer: Deadline & Days remaining */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1 text-slate-500 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.deadline}</span>
                  </span>

                  <span
                    className={`font-semibold px-2 py-0.5 rounded border ${
                      isUrgent
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isPassed
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isPassed
                      ? 'Passed'
                      : diffDays === 0
                      ? 'Due Today!'
                      : `${diffDays}d left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarshipId(null)}
        />
      )}
    </div>
  );
};
