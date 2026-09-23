'use client';

import React, { useState, useMemo } from 'react';
import {
  Award,
  Plus,
  Search,
  Calendar,
  ExternalLink,
  Trash2,
  Edit,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ActivityItem, ActivityType } from '@/types';

export const ActivitiesView = () => {
  const { activities, addOrUpdateActivity, removeActivity } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAct, setEditingAct] = useState<ActivityItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('Leadership');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(true);
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('8');
  const [location, setLocation] = useState('Lahore, Pakistan');
  const [url, setUrl] = useState('');
  const [linkedSchId, setLinkedSchId] = useState('');

  const openEditModal = (act?: ActivityItem) => {
    if (act) {
      setEditingAct(act);
      setTitle(act.title);
      setType(act.type);
      setOrganization(act.organization);
      setRole(act.role);
      setStartDate(act.startDate);
      setEndDate(act.endDate || '');
      setIsCurrent(act.isCurrent);
      setDescription(act.description);
      setImpact(act.impact || '');
      setHoursPerWeek(String(act.hoursPerWeek || '8'));
      setLocation(act.location || '');
      setUrl(act.url || '');
      setLinkedSchId(act.linkedScholarshipIds?.[0] || '');
    } else {
      setEditingAct(null);
      setTitle('');
      setType('Leadership');
      setOrganization('');
      setRole('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setIsCurrent(true);
      setDescription('');
      setImpact('');
      setHoursPerWeek('8');
      setLocation('Lahore, Pakistan');
      setUrl('');
      setLinkedSchId('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const act: ActivityItem = {
      id: editingAct?.id || `act-${Date.now()}`,
      title: title.trim(),
      type,
      organization: organization.trim(),
      role: role.trim(),
      startDate,
      endDate: isCurrent ? undefined : endDate,
      isCurrent,
      description: description.trim(),
      impact: impact.trim() || undefined,
      hoursPerWeek: Number(hoursPerWeek) || 0,
      location: location.trim() || undefined,
      url: url.trim() || undefined,
      linkedScholarshipIds: linkedSchId ? [linkedSchId] : editingAct?.linkedScholarshipIds || [],
      createdAt: editingAct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateActivity(act);
    setIsModalOpen(false);
  };

  const filtered = useMemo(() => {
    return activities.filter(a => {
      if (selectedType !== 'all' && a.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchOrg = a.organization.toLowerCase().includes(q);
        const matchRole = a.role.toLowerCase().includes(q);
        if (!matchTitle && !matchOrg && !matchRole) return false;
      }
      return true;
    });
  }, [activities, selectedType, searchQuery]);

  const activityTypes: ActivityType[] = [
    'Leadership',
    'Volunteering',
    'Competition',
    'Project',
    'Research',
    'Academic',
    'Work Experience',
    'Extracurricular',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <Award className="w-3.5 h-3.5" />
            <span>Achievements & Extracurriculars</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Activities & Evidence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured leadership, competitions, community initiatives, and research projects
          </p>
        </div>

        <button
          onClick={() => openEditModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({activities.length})
          </button>
          {activityTypes.map(t => {
            const count = activities.filter(a => a.type === t).length;
            return (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedType === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search activities & impact..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <Award className="w-6 h-6 text-slate-400 mx-auto" />
          <div className="text-xs font-semibold text-slate-800">No activities found</div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Record your gap year initiatives, leadership roles, and olympiad achievements.
          </p>
          <button
            onClick={() => openEditModal()}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Activity</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(act => (
            <div
              key={act.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 shadow-xs group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {act.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {act.hoursPerWeek} hrs/week
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-1">
                  {act.title}
                </h3>

                <div className="text-[11px] text-slate-700 font-medium mt-0.5">
                  {act.role} • <span className="text-slate-500">{act.organization}</span>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {act.description}
                </p>

                {/* Impact Highlight */}
                {act.impact && (
                  <div className="mt-2.5 p-2 rounded-lg bg-blue-50/60 border border-blue-200 text-[11px] text-blue-900">
                    <span className="font-semibold text-blue-700">Impact: </span>
                    {act.impact}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{act.startDate} {act.isCurrent ? '(Ongoing)' : `to ${act.endDate}`}</span>
                  </span>
                  {act.url && (
                    <a
                      href={act.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(act)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete activity ${act.title}?`)) {
                        removeActivity(act.id);
                      }
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/70">
              <h3 className="text-sm font-semibold text-slate-900">
                {editingAct ? 'Edit Activity Record' : 'Add Activity & Achievement'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Founder - Youth STEM Workshop Lahore"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Lead Instructor"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="e.g. The Citizens Foundation"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ActivityType)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    {activityTypes.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Hours / Week</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={hoursPerWeek}
                    onChange={e => setHoursPerWeek(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Summarize your key responsibilities, curriculum, or technical stack..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Quantifiable Impact</label>
                <input
                  type="text"
                  value={impact}
                  onChange={e => setImpact(e.target.value)}
                  placeholder="e.g. Trained 60 students, raised PKR 250,000 for kit sponsorships"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
