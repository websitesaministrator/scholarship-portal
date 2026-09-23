'use client';

import React, { useState } from 'react';
import {
  X,
  Clock,
  ExternalLink,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Send,
  Sparkles,
  FileText,
  Award,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  Scholarship,
  ScholarshipStatus,
  ScholarshipRequirement,
  RequirementStatus,
  RequirementType,
} from '@/types';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship;
  onClose: () => void;
}

export const ScholarshipDetailModal = ({ scholarship, onClose }: ScholarshipDetailModalProps) => {
  const {
    addOrUpdateScholarship,
    removeScholarship,
    documents,
    activities,
    addOrUpdateTask,
    todayStr,
    triggerCelebration,
    showToast,
  } = useApp();

  const [currentStatus, setCurrentStatus] = useState<ScholarshipStatus>(scholarship.status);
  const [newReqName, setNewReqName] = useState('');
  const [newReqType, setNewReqType] = useState<RequirementType>('Document');
  const [isAddingReq, setIsAddingReq] = useState(false);

  // Compute deadline details
  const now = new Date();
  const deadlineDate = new Date(scholarship.deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isUrgent = diffDays <= 5 && diffDays >= 0;
  const isPassed = diffDays < 0;

  // Requirements metrics
  const requirements = scholarship.requirements || [];
  const completedReqs = requirements.filter(
    r => r.status === 'Ready' || r.status === 'Submitted' || r.status === 'Not Required'
  ).length;
  const percent = requirements.length > 0 ? Math.round((completedReqs / requirements.length) * 100) : 0;

  // Linked items
  const linkedDocs = documents.filter(d => scholarship.requirements?.some(r => r.linkedDocId === d.id));
  const linkedActs = activities.filter(a => scholarship.linkedActivityIds?.includes(a.id));

  // Change status
  const handleStatusChange = async (newStatus: ScholarshipStatus) => {
    setCurrentStatus(newStatus);
    const updated: Scholarship = {
      ...scholarship,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    if (newStatus === 'Applied' && !scholarship.submissionDate) {
      updated.submissionDate = todayStr;
      triggerCelebration();
      showToast(`Congratulations! Application marked as Submitted.`);
    }
    await addOrUpdateScholarship(updated);
  };

  // Toggle requirement status
  const handleToggleRequirement = async (reqId: string) => {
    const updatedReqs = requirements.map((r) => {
      if (r.id !== reqId) return r;
      const nextStatus: RequirementStatus =
        r.status === 'Ready'
          ? 'In Progress'
          : r.status === 'In Progress'
          ? 'Not Started'
          : 'Ready';
      return { ...r, status: nextStatus };
    });

    const updated: Scholarship = {
      ...scholarship,
      requirements: updatedReqs,
      updatedAt: new Date().toISOString(),
    };
    await addOrUpdateScholarship(updated);
  };

  // Add requirement
  const handleAddRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqName.trim()) return;

    const newReq: ScholarshipRequirement = {
      id: `req-${Date.now()}`,
      name: newReqName.trim(),
      type: newReqType,
      status: 'Not Started',
    };

    const updated: Scholarship = {
      ...scholarship,
      requirements: [...requirements, newReq],
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateScholarship(updated);
    setNewReqName('');
    setIsAddingReq(false);
  };

  // 1-click create task from a requirement
  const handleCreateTaskFromReq = async (req: ScholarshipRequirement) => {
    await addOrUpdateTask({
      id: `task-${Date.now()}`,
      title: `Complete: ${req.name}`,
      description: `Requirement for ${scholarship.name}`,
      dueDate: req.dueDate || todayStr,
      completed: false,
      priority: 'High',
      category: 'Scholarship',
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      requirementId: req.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    showToast(`Task created for requirement "${req.name}"!`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {scholarship.country}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {scholarship.degreeLevel}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {scholarship.fundingType}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {scholarship.name}
            </h2>

            <div className="text-xs text-slate-500">
              {scholarship.university || scholarship.organization}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currentStatus}
              onChange={e => handleStatusChange(e.target.value as ScholarshipStatus)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
            >
              <option value="Researching">Researching</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready to Apply">Ready to Apply</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Waiting">Waiting</option>
              <option value="Accepted">Accepted 🎉</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700">
          {/* Timeline & Deadline Milestone Banner */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <Clock className={`w-5 h-5 ${isUrgent ? 'text-rose-600' : 'text-blue-600'}`} />
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Application Deadline: {scholarship.deadline}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isPassed
                    ? `Deadline passed ${Math.abs(diffDays)} days ago`
                    : diffDays === 0
                    ? 'Submission deadline is TODAY!'
                    : `${diffDays} days remaining to submit`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {scholarship.websiteUrl && (
                <a
                  href={scholarship.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium shadow-xs"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {scholarship.portalUrl && (
                <a
                  href={scholarship.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] shadow-xs"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Workflow Stage Contextual Actions */}
          {currentStatus === 'Ready to Apply' && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-semibold">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Pre-flight Submission Readiness</span>
                </div>
                <button
                  onClick={() => handleStatusChange('Applied')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Mark Application as Submitted</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-600">
                All mandatory documents and statements should be double-checked before final submission on the official portal.
              </p>
            </div>
          )}

          {currentStatus === 'Applied' && (
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-emerald-800">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-emerald-900">Application Submitted!</div>
                  <div className="text-[11px] text-emerald-700">
                    Recorded submission date: {scholarship.submissionDate || todayStr}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('Interview')}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 font-medium"
              >
                Transition to Interview Stage
              </button>
            </div>
          )}

          {currentStatus === 'Interview' && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Interview Preparation Active</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Prepare research proposal talking points, mock interviews, and articulate your Pakistan gap-year story.
              </p>
            </div>
          )}

          {/* Requirements Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Application Requirements ({completedReqs}/{requirements.length})
                </h3>
                <div className="text-[11px] text-slate-500">{percent}% complete</div>
              </div>

              <button
                onClick={() => setIsAddingReq(true)}
                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Requirement</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Requirement Rows */}
            <div className="space-y-1.5 pt-1">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white flex items-center justify-between gap-3 group transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => handleToggleRequirement(req.id)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {req.status === 'Ready' || req.status === 'Submitted' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                      )}
                    </button>
                    <div>
                      <div
                        className={`font-medium ${
                          req.status === 'Ready' || req.status === 'Submitted'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {req.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <span>{req.type}</span>
                        {req.notes && <span>• {req.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCreateTaskFromReq(req)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] flex items-center gap-1 font-medium shadow-xs"
                      title="Create linked to-do task"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Task</span>
                    </button>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                        req.status === 'Ready' || req.status === 'Submitted'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : req.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}

              {isAddingReq && (
                <form
                  onSubmit={handleAddRequirement}
                  className="p-3 rounded-lg border border-blue-200 bg-blue-50/30 space-y-2.5 animate-fade-in"
                >
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newReqName}
                    onChange={e => setNewReqName(e.target.value)}
                    placeholder="Requirement name (e.g. Certified Matric Certificate)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newReqType}
                      onChange={e => setNewReqType(e.target.value as RequirementType)}
                      className="px-2 py-1 rounded bg-white border border-slate-300 text-xs text-slate-700"
                    >
                      <option value="Document">Document</option>
                      <option value="Essay">Essay</option>
                      <option value="Recommendation">Recommendation</option>
                      <option value="Test">Test Score</option>
                      <option value="Financial">Financial Statement</option>
                      <option value="Portfolio">Portfolio</option>
                    </select>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsAddingReq(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-xs"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {scholarship.notes && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-900">Application Strategy Notes</h3>
              <p className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-slate-700 text-xs leading-relaxed">
                {scholarship.notes}
              </p>
            </div>
          )}

          {/* Connected Documents & Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Connected Documents ({linkedDocs.length})</span>
              </h4>
              <div className="space-y-1">
                {linkedDocs.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic">None explicitly linked</div>
                ) : (
                  linkedDocs.map(d => (
                    <div
                      key={d.id}
                      className="p-2 rounded border border-slate-200 bg-white text-[11px] text-slate-800 flex items-center justify-between shadow-xs"
                    >
                      <span className="truncate">{d.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {d.category}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>Relevant Activities ({linkedActs.length})</span>
              </h4>
              <div className="space-y-1">
                {linkedActs.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic">None explicitly linked</div>
                ) : (
                  linkedActs.map(a => (
                    <div
                      key={a.id}
                      className="p-2 rounded border border-slate-200 bg-white text-[11px] text-slate-800 flex items-center justify-between shadow-xs"
                    >
                      <span className="truncate">{a.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {a.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${scholarship.name}?`)) {
                removeScholarship(scholarship.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Scholarship</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
