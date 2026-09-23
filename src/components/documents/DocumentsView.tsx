'use client';

import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Plus,
  Search,
  FileText,
  Clock,
  Download,
  Trash2,
  Edit,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DocumentItem, DocumentCategory } from '@/types';
import { DocumentUploadModal } from './DocumentUploadModal';

export const DocumentsView = () => {
  const { documents, removeDocument, scholarships, setSelectedScholarshipId, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  const now = new Date();

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q);
        const matchDesc = doc.description?.toLowerCase().includes(q) || false;
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [documents, selectedCategory, searchQuery]);

  const categories: DocumentCategory[] = [
    'Academic',
    'Identity',
    'Recommendation',
    'Test',
    'CV',
    'Financial',
    'Certificate',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Central Document Library</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Application Documents
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reusable document bank across all international scholarship submissions
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDoc(null);
            setIsUploadModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add / Upload Document</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({documents.length})
          </button>
          {categories.map(cat => {
            const count = documents.filter(d => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
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
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <FolderArchive className="w-6 h-6 text-slate-400 mx-auto" />
          <div className="text-xs font-semibold text-slate-800">No documents found</div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Upload or add your transcripts, passport, and certificates to link them to scholarships.
          </p>
          <button
            onClick={() => {
              setEditingDoc(null);
              setIsUploadModalOpen(true);
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => {
            let expiryDays: number | null = null;
            if (doc.expiryDate) {
              const exp = new Date(doc.expiryDate);
              expiryDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            }

            const isExpired = expiryDays !== null && expiryDays < 0;
            const isExpiringSoon = expiryDays !== null && expiryDays >= 0 && expiryDays <= 90;

            const linkedScholarships = scholarships.filter(
              s =>
                doc.linkedScholarshipIds?.includes(s.id) ||
                s.requirements?.some(r => r.linkedDocId === doc.id)
            );

            return (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group shadow-xs"
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.category}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        doc.status === 'Ready' || doc.status === 'Uploaded'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : doc.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                    {doc.name}
                  </h3>

                  {doc.description && (
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  {/* Expiry Alert Pill */}
                  {expiryDays !== null && (
                    <div className="mt-2.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-medium border ${
                          isExpired
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isExpiringSoon
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {isExpired
                          ? `Expired ${Math.abs(expiryDays)} days ago`
                          : isExpiringSoon
                          ? `Expires in ${expiryDays} days`
                          : `Valid until ${doc.expiryDate}`}
                      </span>
                    </div>
                  )}

                  {/* Linked Scholarships */}
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-500">Linked in: </span>
                    {linkedScholarships.length === 0 ? (
                      <span className="text-slate-400 italic">Universal document</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {linkedScholarships.map(s => (
                          <span
                            key={s.id}
                            onClick={() => {
                              setSelectedScholarshipId(s.id);
                              setActiveTab('scholarships');
                            }}
                            className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 hover:text-blue-900 cursor-pointer truncate max-w-[150px] font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-[11px] font-medium transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Preview / File</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingDoc(doc);
                          setIsUploadModalOpen(true);
                        }}
                        className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Attach File</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingDoc(doc);
                        setIsUploadModalOpen(true);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title="Edit document"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete document ${doc.name}?`)) {
                          removeDocument(doc.id, doc.filePath);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <DocumentUploadModal
          existingDoc={editingDoc}
          onClose={() => {
            setIsUploadModalOpen(false);
            setEditingDoc(null);
          }}
        />
      )}
    </div>
  );
};
