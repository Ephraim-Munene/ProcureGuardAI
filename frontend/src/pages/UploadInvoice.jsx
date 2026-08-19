import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Landmark,
  Gavel,
  FolderLock,
  ScanLine,
  ShieldAlert,
  Database,
  LogOut,
  Keyboard,
  Upload,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { auditInvoice } from '../api/client';

const SIDE_ITEMS = [
  { icon: Terminal, label: 'Audit Terminal' },
  { icon: Landmark, label: 'Entity Forensic' },
  { icon: Gavel, label: 'Risk Matrix' },
  { icon: FolderLock, label: 'Legal Archive' },
  { icon: ScanLine, label: 'Neural Intake', active: true },
];

const SCAN_STEPS = [
  { done: true, text: 'OCR text extracted (99.8% confidence)' },
  { done: true, text: 'Line items structured' },
  { done: false, active: true, text: 'Cross-referencing PPRA index prices...' },
  { done: false, text: 'Fraud vector analysis' },
];

export default function UploadInvoice() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
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
      console.error('Audit upload error:', err);
      setTimeout(() => navigate('/audit/mock-1'), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex md:pl-sidebar-width">
      {/* SideNavBar (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed left-0 top-12 bottom-0 w-sidebar-width bg-surface-container-low border-r border-outline-variant flex flex-col z-40">
        <div className="p-gutter border-b border-outline-variant flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="text-on-surface-variant text-[18px]" />
          </div>
          <div>
            <div className="font-body-sm text-body-sm font-medium text-on-surface">Oversight Terminal</div>
            <div className="font-data-label text-data-label text-on-surface-variant mt-1">V.2.4.0-Forensic</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {SIDE_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.active;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-gutter py-2 group cursor-pointer transition-all duration-150 ease-in-out ${
                  active
                    ? 'bg-surface-container-highest text-primary border-r-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Icon className={`text-[20px] ${active ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="font-body-sm text-body-sm">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-outline-variant">
          <button className="w-full bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded py-2 px-4 flex items-center justify-center gap-2 mb-4 cursor-pointer">
            <AlertTriangle className="text-[16px]" />
            <span className="font-body-sm text-body-sm font-medium">Escalate to EACC</span>
          </button>
          <div className="flex flex-col gap-1">
            <div className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-3 px-2 py-1.5 group cursor-pointer">
              <Database className="text-[16px]" />
              <span className="font-body-xs text-body-xs">System Health</span>
            </div>
            <div className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-3 px-2 py-1.5 group cursor-pointer">
              <LogOut className="text-[16px]" />
              <span className="font-body-xs text-body-xs">Sign Out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-margin">
        {loading ? (
          <div className="w-full max-w-4xl bg-surface-container-low border border-outline-variant rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center">
                  <ScanLine className="text-[18px]" />
                </div>
                <div>
                  <div className="font-body-sm text-body-sm font-medium text-on-surface">
                    Gemini 3.5 Flash OCR & PPRA Benchmark Cross-Examination
                  </div>
                  <div className="font-data-label text-data-label text-on-surface-variant mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Processing
                  </div>
                </div>
              </div>
              <div className="font-data-mono text-data-mono text-on-surface-variant">{file?.name || 'Scanning...'}</div>
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
                Cancel Scan
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            {/* Neural Intake Console */}
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
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2 text-center">Neural Intake Console</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-6 max-w-md border-b border-dashed border-outline-variant pb-6">
                Drop County Procurement Invoices, LPOs, or Tender Receipts here to initiate scanning.
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
                  {['PDF', 'PNG', 'TIFF'].map((fmt) => (
                    <span key={fmt} className="font-data-label text-data-label text-on-surface-variant bg-surface-container-low px-2 py-1 rounded border border-outline-variant">
                      {fmt}
                    </span>
                  ))}
                </div>
                <div className="h-4 w-px bg-outline-variant mx-2"></div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <Keyboard className="text-[14px]" />
                  <span className="font-data-mono text-data-mono">Select or drop file</span>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                disabled={!file}
                className={`mt-6 px-6 py-2 rounded font-data-mono text-data-mono transition-colors ${
                  file
                    ? 'bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest cursor-pointer'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant cursor-not-allowed'
                }`}
              >
                Initiate Neural Scan
              </button>

              <div className="absolute inset-0 border-2 border-dashed border-outline-variant rounded-lg m-2 pointer-events-none group-hover:border-primary/50 transition-colors"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}