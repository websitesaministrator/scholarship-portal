'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckSquare, GraduationCap, FolderArchive, Award, Plus, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  Task,
  Scholarship,
  DocumentItem,
  ActivityItem,
  TaskPriority,
  TaskCategory,
  ScholarshipStatus,
  DegreeLevel,
  FundingType,
  DocumentCategory,
  DocumentStatus,
  ActivityType,
} from '@/types';

export const QuickAddModal = () => {
  const {
    isQuickAddOpen,
    closeQuickAdd,
    quickAddDefaultType,
    scholarships,
    todayStr,
    addOrUpdateTask,
    addOrUpdateScholarship,
    addOrUpdateDocument,
    addOrUpdateActivity,
  } = useApp();

  const [tab, setTab] = useState<'task' | 'scholarship' | 'document' | 'activity'>('task');

  useEffect(() => {
    if (isQuickAddOpen) {
      setTab(quickAddDefaultType);
    }
  }, [isQuickAddOpen, quickAddDefaultType]);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(todayStr);
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('General');
  const [taskSchId, setTaskSchId] = useState('');

  // Scholarship form state
  const [schName, setSchName] = useState('');
  const [schCountry, setSchCountry] = useState('Turkey');
  const [schUniversity, setSchUniversity] = useState('');
  const [schDegree, setSchDegree] = useState<DegreeLevel>('Undergraduate');
  const [schFunding, setSchFunding] = useState<FundingType>('Full Ride (Tuition + Living + Travel)');
  const [schDeadline, setSchDeadline] = useState(todayStr);
  const [schStatus, setSchStatus] = useState<ScholarshipStatus>('Researching');
  const [schAutoTasks, setSchAutoTasks] = useState(true);

  // Document form state
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Academic');
  const [docStatus, setDocStatus] = useState<DocumentStatus>('Ready');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [docSchId, setDocSchId] = useState('');

  // Activity form state
  const [actTitle, setActTitle] = useState('');
  const [actOrg, setActOrg] = useState('');
  const [actRole, setActRole] = useState('');
  const [actType, setActType] = useState<ActivityType>('Leadership');
  const [actHours, setActHours] = useState('8');

  if (!isQuickAddOpen) return null;

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const linkedSch = scholarships.find(s => s.id === taskSchId);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      completed: false,
      priority: taskPriority,
      category: taskCategory,
      scholarshipId: taskSchId || undefined,
      scholarshipName: linkedSch?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateTask(newTask);
    setTaskTitle('');
    closeQuickAdd();
  };

  const handleCreateScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schName.trim()) return;

    const schId = `sch-${Date.now()}`;
    const newSch: Scholarship = {
      id: schId,
      name: schName.trim(),
      country: schCountry.trim(),
      university: schUniversity.trim() || undefined,
      degreeLevel: schDegree,
      fieldOfStudy: 'Engineering / Computing',
      fundingType: schFunding,
      deadline: schDeadline,
      status: schStatus,
      priority: 'High',
      tags: [schCountry.trim(), schDegree],
      requirements: [
        { id: `req-${Date.now()}-1`, name: 'Statement of Purpose / Motivation Essay', type: 'Essay', status: 'Not Started' },
        { id: `req-${Date.now()}-2`, name: 'Academic Transcripts & Certificates', type: 'Document', status: 'In Progress' },
        { id: `req-${Date.now()}-3`, name: 'Recommendation Letters (2x)', type: 'Recommendation', status: 'Not Started' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateScholarship(newSch);

    if (schAutoTasks) {
      const templateTasks: { title: string; category: TaskCategory; priority: TaskPriority; days: number }[] = [
        { title: `Read all eligibility guidelines for ${schName}`, category: 'Research', priority: 'High', days: 1 },
        { title: `Request recommendation letters for ${schName}`, category: 'Recommendation', priority: 'High', days: 3 },
        { title: `Draft Statement of Purpose for ${schName}`, category: 'Essay', priority: 'High', days: 7 },
        { title: `Final review and submit ${schName} portal application`, category: 'Scholarship', priority: 'High', days: 14 },
      ];

      for (const t of templateTasks) {
        const d = new Date();
        d.setDate(d.getDate() + t.days);
        const taskDateStr = d.toISOString().split('T')[0];

        await addOrUpdateTask({
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: t.title,
          dueDate: taskDateStr,
          completed: false,
          priority: t.priority,
          category: t.category,
          scholarshipId: schId,
          scholarshipName: schName.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    setSchName('');
    closeQuickAdd();
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: docName.trim(),
      category: docCategory,
      status: docStatus,
      expiryDate: docExpiryDate || undefined,
      linkedScholarshipIds: docSchId ? [docSchId] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateDocument(newDoc);
    setDocName('');
    closeQuickAdd();
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title: actTitle.trim(),
      organization: actOrg.trim() || 'Independent Initiative',
      role: actRole.trim() || 'Lead / Founder',
      type: actType,
      startDate: todayStr,
      isCurrent: true,
      description: 'Activity recorded for scholarship applications portfolio.',
      hoursPerWeek: Number(actHours) || 8,
      linkedScholarshipIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateActivity(newAct);
    setActTitle('');
    closeQuickAdd();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={closeQuickAdd}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Type Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === 'task'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Task</span>
            </button>
            <button
              onClick={() => setTab('scholarship')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === 'scholarship'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Scholarship</span>
            </button>
            <button
              onClick={() => setTab('document')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === 'document'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Document</span>
            </button>
            <button
              onClick={() => setTab('activity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === 'activity'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Activity</span>
            </button>
          </div>

          <button
            onClick={closeQuickAdd}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Forms */}
        <div className="p-5">
          {tab === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Email Professor for recommendation letter"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Scholarship">Scholarship</option>
                    <option value="Documents">Documents</option>
                    <option value="Essay">Essay</option>
                    <option value="Recommendation">Recommendation</option>
                    <option value="Test">Test / Exam</option>
                    <option value="Finance">Finance</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Link Scholarship
                  </label>
                  <select
                    value={taskSchId}
                    onChange={e => setTaskSchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="">None (Independent)</option>
                    {scholarships.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeQuickAdd}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          )}

          {tab === 'scholarship' && (
            <form onSubmit={handleCreateScholarship} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Scholarship Program Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={schName}
                  onChange={e => setSchName(e.target.value)}
                  placeholder="e.g. Chevening / Turkiye Burslari / MEXT"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={schCountry}
                    onChange={e => setSchCountry(e.target.value)}
                    placeholder="e.g. Turkey, Japan, UK"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Target University / Org
                  </label>
                  <input
                    type="text"
                    value={schUniversity}
                    onChange={e => setSchUniversity(e.target.value)}
                    placeholder="e.g. METU / Kyoto University"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={schDeadline}
                    onChange={e => setSchDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Pipeline Status
                  </label>
                  <select
                    value={schStatus}
                    onChange={e => setSchStatus(e.target.value as ScholarshipStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Researching">Researching</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready to Apply">Ready to Apply</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Waiting">Waiting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Degree Level
                  </label>
                  <select
                    value={schDegree}
                    onChange={e => setSchDegree(e.target.value as DegreeLevel)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Master's">Master&apos;s</option>
                    <option value="PhD / Research">PhD / Research</option>
                    <option value="Exchange">Exchange</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Funding Type
                  </label>
                  <select
                    value={schFunding}
                    onChange={e => setSchFunding(e.target.value as FundingType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Full Ride (Tuition + Living + Travel)">Full Ride</option>
                    <option value="Full Tuition">Full Tuition Waiver</option>
                    <option value="Partial Tuition">Partial Tuition</option>
                    <option value="Stipend Only">Stipend Only</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="autoTasks"
                  checked={schAutoTasks}
                  onChange={e => setSchAutoTasks(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <label htmlFor="autoTasks" className="text-xs text-blue-900 cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Automatically add standard application tasks (SOP, recommendation, review)</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeQuickAdd}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-sm"
                >
                  Save Scholarship
                </button>
              </div>
            </form>
          )}

          {tab === 'document' && (
            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Document Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Valid Passport Scan / Matric Equivalence"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Identity">Identity (Passport/CNIC)</option>
                    <option value="Academic">Academic (Transcripts)</option>
                    <option value="Recommendation">Recommendation Letter</option>
                    <option value="Test">Test Score (IELTS/SAT)</option>
                    <option value="CV">Curriculum Vitae (CV)</option>
                    <option value="Financial">Financial Statement</option>
                    <option value="Certificate">Certificate / Award</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={docStatus}
                    onChange={e => setDocStatus(e.target.value as DocumentStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Ready">Ready</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Need to Collect">Need to Collect</option>
                    <option value="Need to Create">Need to Create</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={docExpiryDate}
                    onChange={e => setDocExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Triggers alert when &lt; 90 days</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Link Scholarship
                  </label>
                  <select
                    value={docSchId}
                    onChange={e => setDocSchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="">General (All Applications)</option>
                    {scholarships.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeQuickAdd}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-sm"
                >
                  Save Document Record
                </button>
              </div>
            </form>
          )}

          {tab === 'activity' && (
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={actTitle}
                  onChange={e => setActTitle(e.target.value)}
                  placeholder="e.g. Youth STEM Mentorship Lahore"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Organization / Entity
                  </label>
                  <input
                    type="text"
                    value={actOrg}
                    onChange={e => setActOrg(e.target.value)}
                    placeholder="e.g. School STEM Club"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={actRole}
                    onChange={e => setActRole(e.target.value)}
                    placeholder="e.g. Lead Instructor / Founder"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Type
                  </label>
                  <select
                    value={actType}
                    onChange={e => setActType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Competition">Competition / Olympiad</option>
                    <option value="Project">Personal Project</option>
                    <option value="Research">Research</option>
                    <option value="Work Experience">Work Experience</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={actHours}
                    onChange={e => setActHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeQuickAdd}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-sm"
                >
                  Save Activity
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
