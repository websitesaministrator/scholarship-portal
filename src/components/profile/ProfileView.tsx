'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  BookOpen,
  Copy,
  Check,
  GraduationCap,
  Compass,
  Edit,
  Save,
  Plus,
  Trash2,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StorySection } from '@/types';

export const ProfileView = () => {
  const {
    profile,
    updateProfile,
    gapYear,
    updateGapYear,
    storySections,
    addOrUpdateStorySection,
    removeStorySection,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'story' | 'gapYear' | 'academic'>('story');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit states for Story
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyNotes, setStoryNotes] = useState('');
  const [isAddingStory, setIsAddingStory] = useState(false);

  // Edit states for Gap Year
  const [gapYearForm, setGapYearForm] = useState(gapYear);
  const [isEditingGapYear, setIsEditingGapYear] = useState(false);

  // Edit states for Profile
  const [profileForm, setProfileForm] = useState(profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied essay block to clipboard!');
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyContent.trim()) return;

    const newSection: StorySection = {
      id: editingStoryId || `story-${Date.now()}`,
      title: storyTitle.trim(),
      content: storyContent.trim(),
      promptNotes: storyNotes.trim() || 'Custom Story Block',
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateStorySection(newSection);
    setIsAddingStory(false);
    setEditingStoryId(null);
  };

  const startEditStory = (st: StorySection) => {
    setEditingStoryId(st.id);
    setStoryTitle(st.title);
    setStoryContent(st.content);
    setStoryNotes(st.promptNotes);
    setIsAddingStory(true);
  };

  const handleSaveGapYear = async () => {
    await updateGapYear(gapYearForm);
    setIsEditingGapYear(false);
  };

  const handleSaveProfile = async () => {
    await updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Personal Brand & Essay Foundation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Profile & Story Database
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Source-of-truth stories, gap-year justification, and modular essay blocks for copy-pasting
          </p>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs pb-1">
        <button
          onClick={() => setActiveSubTab('story')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeSubTab === 'story'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Personal Story Bank ({storySections.length})</span>
        </button>

        <button
          onClick={() => {
            setGapYearForm(gapYear);
            setActiveSubTab('gapYear');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeSubTab === 'gapYear'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Gap Year Narrative</span>
        </button>

        <button
          onClick={() => {
            setProfileForm(profile);
            setActiveSubTab('academic');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeSubTab === 'academic'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academics & Goals</span>
        </button>
      </div>

      {/* 1. PERSONAL STORY BANK */}
      {activeSubTab === 'story' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Use these verified story blocks when answering scholarship prompts (SOP, Personal Statement, Leadership).
              </span>
            </div>
            <button
              onClick={() => {
                setEditingStoryId(null);
                setStoryTitle('');
                setStoryContent('');
                setStoryNotes('');
                setIsAddingStory(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Story Block</span>
            </button>
          </div>

          {/* Add/Edit Story Block Form */}
          {isAddingStory && (
            <form
              onSubmit={handleSaveStory}
              className="p-5 rounded-xl border border-blue-200 bg-white space-y-3 animate-fade-in text-xs shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-900">
                  {editingStoryId ? 'Edit Story Block' : 'New Story Block'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingStory(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Block Title *</label>
                <input
                  type="text"
                  required
                  value={storyTitle}
                  onChange={e => setStoryTitle(e.target.value)}
                  placeholder="e.g. The Turning Point: Discovering Computer Science"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Prompt Relevance / Application Notes</label>
                <input
                  type="text"
                  value={storyNotes}
                  onChange={e => setStoryNotes(e.target.value)}
                  placeholder="e.g. Best for 'Why this field?' or 'Overcoming adversity' prompts"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Story Narrative *</label>
                <textarea
                  rows={5}
                  required
                  value={storyContent}
                  onChange={e => setStoryContent(e.target.value)}
                  placeholder="Write the reflective narrative in clear, authentic first-person..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 leading-relaxed font-sans shadow-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingStory(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  Save Block
                </button>
              </div>
            </form>
          )}

          {/* Story Cards */}
          <div className="space-y-4">
            {storySections.map(section => (
              <div
                key={section.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 shadow-xs group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      🎯 {section.promptNotes}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(section.id, section.content)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
                        copiedId === section.id
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {copiedId === section.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => startEditStory(section)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete story block "${section.title}"?`)) {
                          removeStorySection(section.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/80 font-sans whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GAP YEAR WORKSPACE */}
      {activeSubTab === 'gapYear' && (
        <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Gap Year Intentional Framework</h2>
              <p className="text-[11px] text-slate-500">
                Craft a bulletproof answer for scholarship committees explaining your gap year
              </p>
            </div>

            {isEditingGapYear ? (
              <button
                onClick={handleSaveGapYear}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingGapYear(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Narrative</span>
              </button>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-blue-700 block mb-1">
                1. Why did I take a gap year?
              </span>
              {isEditingGapYear ? (
                <textarea
                  rows={3}
                  value={gapYearForm.whyTookGapYear}
                  onChange={e => setGapYearForm({ ...gapYearForm, whyTookGapYear: e.target.value })}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              ) : (
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {gapYear.whyTookGapYear}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-blue-700 block mb-1">
                2. What am I doing during this gap year?
              </span>
              {isEditingGapYear ? (
                <textarea
                  rows={3}
                  value={gapYearForm.whatAmIDoing}
                  onChange={e => setGapYearForm({ ...gapYearForm, whatAmIDoing: e.target.value })}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              ) : (
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {gapYear.whatAmIDoing}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-blue-700 block mb-1">
                  3. Key Learnings & Mindset
                </span>
                {isEditingGapYear ? (
                  <textarea
                    rows={3}
                    value={gapYearForm.whatIHaveLearned}
                    onChange={e => setGapYearForm({ ...gapYearForm, whatIHaveLearned: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                ) : (
                  <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                    {gapYear.whatIHaveLearned}
                  </p>
                )}
              </div>

              <div>
                <span className="font-semibold text-blue-700 block mb-1">
                  4. Concrete Technical Skills Developed
                </span>
                {isEditingGapYear ? (
                  <textarea
                    rows={3}
                    value={gapYearForm.skillsDeveloped}
                    onChange={e => setGapYearForm({ ...gapYearForm, skillsDeveloped: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                ) : (
                  <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                    {gapYear.skillsDeveloped}
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="font-semibold text-blue-700 block mb-1">
                5. Definitive Goals for the Remainder of the Year
              </span>
              {isEditingGapYear ? (
                <textarea
                  rows={2}
                  value={gapYearForm.goalsForYear}
                  onChange={e => setGapYearForm({ ...gapYearForm, goalsForYear: e.target.value })}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              ) : (
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {gapYear.goalsForYear}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. ACADEMIC & GOALS */}
      {activeSubTab === 'academic' && (
        <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-6 text-xs shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Academic Credentials & Vision</h2>
              <p className="text-[11px] text-slate-500">
                Educational history, grades, and long-term research orientation
              </p>
            </div>

            {isEditingProfile ? (
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Full Legal Name</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileForm.fullName || ''}
                  onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold">
                  {profile.fullName}
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Intended Degree & Field</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileForm.intendedField || ''}
                  onChange={e => setProfileForm({ ...profileForm, intendedField: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold">
                  {profile.intendedDegree} in {profile.intendedField}
                </div>
              )}
            </div>
          </div>

          {/* Education Entries */}
          <div>
            <span className="font-semibold text-slate-900 block mb-2">Education History</span>
            <div className="space-y-2">
              {profile.education?.map(edu => (
                <div
                  key={edu.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between shadow-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{edu.institution}</div>
                    <div className="text-[11px] text-slate-500">
                      {edu.program} • {edu.startYear} - {edu.endYear}
                    </div>
                    {edu.achievements && (
                      <div className="text-[10px] text-slate-500 mt-1">{edu.achievements}</div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-emerald-700 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                    {edu.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Long term vision */}
          <div>
            <span className="font-semibold text-slate-900 block mb-1">Long-term Vision & Purpose</span>
            <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
              {profile.longTermVision}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
