'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, ArrowUpCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DocumentItem, DocumentCategory, DocumentStatus } from '@/types';

interface DocumentUploadModalProps {
  onClose: () => void;
  existingDoc?: DocumentItem | null;
}

export const DocumentUploadModal = ({ onClose, existingDoc }: DocumentUploadModalProps) => {
  const {
    addOrUpdateDocument,
    uploadFileForDocument,
    scholarships,
    firebaseActive,
    showToast,
  } = useApp();

  const [name, setName] = useState(existingDoc?.name || '');
  const [category, setCategory] = useState<DocumentCategory>(existingDoc?.category || 'Academic');
  const [status, setStatus] = useState<DocumentStatus>(existingDoc?.status || 'Ready');
  const [description, setDescription] = useState(existingDoc?.description || '');
  const [issueDate, setIssueDate] = useState(existingDoc?.issueDate || '');
  const [expiryDate, setExpiryDate] = useState(existingDoc?.expiryDate || '');
  const [selectedSchId, setSelectedSchId] = useState(existingDoc?.linkedScholarshipIds?.[0] || '');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUploading(true);
    const docId = existingDoc?.id || `doc-${Date.now()}`;

    let fileUrl = existingDoc?.fileUrl;
    let filePath = existingDoc?.filePath;
    let fileName = existingDoc?.fileName;
    let fileSize = existingDoc?.fileSize;

    if (selectedFile) {
      try {
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        const result = await uploadFileForDocument(selectedFile, docId, percent => {
          setUploadProgress(percent);
        });
        fileUrl = result.fileUrl;
        filePath = result.filePath;
      } catch (error) {
        console.error('File upload failed:', error);
        showToast('File upload failed, saving document metadata only', 'error');
      }
    }

    const newDoc: DocumentItem = {
      id: docId,
      name: name.trim(),
      category,
      status: selectedFile || fileUrl ? 'Uploaded' : status,
      description: description.trim() || undefined,
      fileName,
      fileSize,
      fileUrl,
      filePath,
      issueDate: issueDate || undefined,
      expiryDate: expiryDate || undefined,
      linkedScholarshipIds: selectedSchId ? [selectedSchId] : existingDoc?.linkedScholarshipIds || [],
      createdAt: existingDoc?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateDocument(newDoc);
    setIsUploading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {existingDoc ? 'Edit Document' : 'Upload Document to Cloud'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {firebaseActive ? 'Storing securely in Firebase Cloud Storage' : 'Local storage offline mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* File Drag and Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 text-center cursor-pointer transition-colors space-y-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform border border-blue-200">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            {selectedFile ? (
              <div>
                <div className="font-semibold text-slate-900">{selectedFile.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                </div>
              </div>
            ) : existingDoc?.fileName ? (
              <div>
                <div className="font-semibold text-emerald-700">Current file: {existingDoc.fileName}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Click to replace file</div>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-slate-800">
                  Click to select file or drag & drop
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  PDF, DOCX, PNG, JPG (Transcripts, passport, recommendation letters)
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Uploading to Cloud Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-medium mb-1">Document Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. O/A Level Equivalence Certificate"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="Academic">Academic (Transcripts/Certificates)</option>
                <option value="Identity">Identity (Passport/ID)</option>
                <option value="Recommendation">Recommendation Letter</option>
                <option value="Test">Test Score (IELTS/SAT/GRE)</option>
                <option value="CV">Curriculum Vitae (CV)</option>
                <option value="Financial">Financial Statement</option>
                <option value="Certificate">Certificate / Award</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Current Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as DocumentStatus)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="Ready">Ready</option>
                <option value="Uploaded">Uploaded</option>
                <option value="In Progress">In Progress</option>
                <option value="Need to Collect">Need to Collect</option>
                <option value="Need to Create">Need to Create</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Alerts when &lt; 90 days</p>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Primary Scholarship Link</label>
            <select
              value={selectedSchId}
              onChange={e => setSelectedSchId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
            >
              <option value="">General (Reused across all applications)</option>
              {scholarships.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Description / Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Attested copy from IBCC and Ministry of Foreign Affairs"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Saving...' : 'Save Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
