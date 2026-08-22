import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Terminal,
  Landmark,
  Gavel,
  FolderLock,
  ScanLine,
  ShieldAlert,
  Database,
  LogOut,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const SIDE_ITEMS = [
  { to: '/audits', icon: Terminal, label: 'Audit Terminal', end: false },
  { to: '/vendors', icon: Landmark, label: 'Entity Forensic', end: false },
  { to: '/risk', icon: Gavel, label: 'Risk Matrix', end: false },
  { to: '/archive', icon: FolderLock, label: 'Legal Archive', end: false },
  { to: '/upload', icon: ScanLine, label: 'Neural Intake', end: false },
  { to: '/pricing', icon: CreditCard, label: 'License Config', end: false },
];

export default function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [healthOpen, setHealthOpen] = useState(false);
  const [healthState, setHealthState] = useState({ checking: false, ok: false, error: null });
  const [signOutOpen, setSignOutOpen] = useState(false);

  const checkHealth = async () => {
    setHealthState({ checking: true, ok: false, error: null });
    try {
      await apiClient.get('/invoices', { timeout: 5000 });
      setHealthState({ checking: false, ok: true, error: null });
    } catch (err) {
      setHealthState({ checking: false, ok: false, error: 'Backend API unreachable. Is the server running?' });
    }
  };

  const openHealth = () => {
    setHealthOpen(true);
    checkHealth();
  };

  const confirmSignOut = () => {
    setSignOutOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 top-12 z-40 transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <aside
        className={`md:hidden fixed left-0 top-12 bottom-0 w-64 bg-surface-container-low border-r border-outline-variant flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 overflow-y-auto py-2">
          <NavLink
            to="/"
            end
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-gutter py-2.5 transition-colors ${
                isActive
                  ? 'bg-surface-container-highest text-primary border-r-2 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`
            }
          >
            <ShieldAlert className="text-[20px]" />
            <span className="font-body-sm text-body-sm">Dashboard</span>
          </NavLink>
          {SIDE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-gutter py-2.5 transition-colors ${
                    isActive
                      ? 'bg-surface-container-highest text-primary border-r-2 border-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
              >
                <Icon className="text-[20px]" />
                <span className="font-body-sm text-body-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={() => { onCloseMobile(); setSignOutOpen(true); }}
            className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-3 px-2 py-1.5 cursor-pointer"
          >
            <LogOut className="text-[16px]" />
            <span className="font-body-xs text-body-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-12 bottom-0 w-sidebar-width bg-surface-container-low border-r border-outline-variant flex-col z-40">
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
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-gutter py-2 group transition-all duration-150 ease-in-out ${
                    isActive
                      ? 'bg-surface-container-highest text-primary border-r-2 border-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`text-[20px] ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                    <span className="font-body-sm text-body-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-outline-variant">
          <div className="flex flex-col gap-1">
            <button
              onClick={openHealth}
              className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-3 px-2 py-1.5 group cursor-pointer"
            >
              <Database className="text-[16px]" />
              <span className="font-body-xs text-body-xs">System Health</span>
            </button>
            <button
              onClick={() => setSignOutOpen(true)}
              className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-3 px-2 py-1.5 group cursor-pointer"
            >
              <LogOut className="text-[16px]" />
              <span className="font-body-xs text-body-xs">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* System Health Modal */}
      {healthOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant shadow-xl">
            <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
              <span className="font-data-label text-data-label text-on-surface uppercase">System Health</span>
              <button
                onClick={() => setHealthOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer font-body-sm text-body-sm"
              >
                Close
              </button>
            </div>
            <div className="p-5">
              {healthState.checking ? (
                <div className="flex items-center gap-3 text-on-surface-variant font-data-mono text-data-mono">
                  <RefreshCw className="text-[16px] animate-spin" /> Checking API status...
                </div>
              ) : healthState.ok ? (
                <div className="flex items-center gap-3 text-on-surface font-data-mono text-data-mono">
                  <CheckCircle2 className="text-[16px] text-primary" /> API & Database operational
                </div>
              ) : (
                <div className="flex items-center gap-3 text-error font-data-mono text-data-mono">
                  <AlertTriangle className="text-[16px]" /> {healthState.error}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-outline-variant font-data-label text-data-label text-on-surface-variant">
                Oversight Terminal V.2.4.0-Forensic · SQLite ledger
              </div>
            </div>
            <div className="px-5 py-3 border-t border-outline-variant flex justify-end">
              <button
                onClick={checkHealth}
                disabled={healthState.checking}
                className="bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded px-4 py-1.5 font-data-mono text-data-mono cursor-pointer disabled:opacity-60"
              >
                Re-check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {signOutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm bg-surface-container border border-outline-variant shadow-xl">
            <div className="px-5 py-4 border-b border-outline-variant">
              <span className="font-headline-md text-headline-md text-on-surface">Sign Out</span>
            </div>
            <div className="p-5 font-body-sm text-body-sm text-on-surface-variant">
              You will be returned to the dashboard. No active session will be terminated.
            </div>
            <div className="px-5 py-3 border-t border-outline-variant flex justify-end gap-2">
              <button
                onClick={() => setSignOutOpen(false)}
                className="bg-transparent border border-outline-variant text-on-surface hover:border-on-surface transition-colors rounded px-4 py-1.5 font-data-mono text-data-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="bg-error text-on-error font-data-mono text-data-mono hover:bg-error/90 transition-colors rounded px-4 py-1.5 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}