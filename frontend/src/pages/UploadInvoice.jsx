import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanLine,
  Keyboard,
  Upload,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { auditInvoice } from '../api/client';

const SCAN_STEPS = [
  { done: true, text: 'Invoice received' },
  { done: true, text: 'Reading invoice details' },
  { done: false, active: true, text: 'Checking prices against market rates...' },
  { done: false, text: 'Flagging anything unusual' },
];

const ACCEPT = '.pdf,.png,.jpg,.jpeg';

export default function UploadInvoice() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadError('');
    }
  };

  const openFilePicker = (e) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const res = await auditInvoice(file);
      if (res && res.invoice && res.invoice.id) {
        navigate(`/audit/${res.invoice.id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Invoice upload failed:', err);
      const msg =
        err.response?.data?.error ||
        'Something went wrong while scanning your invoice. Please try again.';
      setUploadError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-margin">
        {loading ? (
          <div className="w-full max-w-4xl bg-surface-container-low border border-outline-variant rounded-lg p-6">
            <div className="flex flex-wrap gap-y-2 items-center justify-between mb-4 border-b border-outline-variant pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center">
                  <ScanLine className="text-[18px]" />
                </div>
                <div>
                  <div className="font-body-sm text-body-sm font-medium text-on-surface">
                    Scanning your invoice
                  </div>
                  <div className="font-data-label text-data-label text-on-surface-variant mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Processing
                  </div>
                </div>
              </div>
              <div className="font-data-mono text-data-mono text-on-surface-variant max-w-full truncate">{file?.name || "Working..."}</div>
            </div>

            <div className="space-y-3 font-data-mono text-data-mono text-sm">
              {SCAN_STEPS.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 ${step.done ? 'text-on-surface' : step.active ? 'text-primary animate-pulse' : 'text-on-surface-variant opacity-50'}`}>
                  {step.done ? (
                    <CheckCircle2 className="text-[16px] text-on-surface-variant" />
                  ) : step.active ? (
                    <RefreshCw className="text-[16px] animate-spin" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-outline-variant"></span>
                  )}
                  <span>{step.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant flex justify-end">
              <button
                onClick={() => setLoading(false)}
                className="bg-transparent border border-outline-variant text-on-surface hover:border-on-surface transition-colors rounded px-4 py-1.5 font-body-sm text-body-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            {uploadError && (
              <div className="mb-4 p-3 bg-error-container border border-error text-on-error-container font-body-sm text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {uploadError}
              </div>
            )}
            {/* Upload Invoice */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`w-full bg-surface border rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-colors ${
                dragOver ? 'border-primary hover:bg-surface-container-low' : 'border-outline-variant hover:bg-surface-container-low'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center mb-6 group-hover:border-primary transition-colors">
                <Upload className="text-[32px] text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2 text-center">Upload an Invoice</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-6 max-w-md border-b border-dashed border-outline-variant pb-6">
                Drop your invoice, LPO, or receipt here and we'll check it for overpricing.
              </p>

              {file && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-surface-container-low border border-outline-variant rounded">
                  <CheckCircle2 className="text-[16px] text-on-surface" />
                  <span className="font-data-mono text-data-mono text-on-surface">{file.name}</span>
                  <span className="font-data-label text-data-label text-on-surface-variant">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {['PDF', 'PNG', 'JPG'].map((fmt) => (
                    <span key={fmt} className="font-data-label text-data-label text-on-surface-variant bg-surface-container-low px-2 py-1 rounded border border-outline-variant">
                      {fmt}
                    </span>
                  ))}
                </div>
                <div className="h-4 w-px bg-outline-variant mx-2"></div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <Keyboard className="text-[14px]" />
                  <span className="font-data-mono text-data-mono">Drop file here</span>
                </div>
              </div>

              <button
                onClick={openFilePicker}
                className="mt-6 flex items-center gap-2 text-primary underline underline-offset-4 hover:text-on-surface transition-colors font-body-sm text-body-sm cursor-pointer"
              >
                <FolderOpen className="text-[16px]" />
                or select file from your device
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                disabled={!file}
                className={`mt-4 px-6 py-2 rounded font-data-mono text-data-mono transition-colors ${
                  file
                    ? 'bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest cursor-pointer'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant cursor-not-allowed'
                }`}
              >
                Scan Invoice
              </button>

              <div className="absolute inset-0 border-2 border-dashed border-outline-variant rounded-lg m-2 pointer-events-none group-hover:border-primary/50 transition-colors"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}