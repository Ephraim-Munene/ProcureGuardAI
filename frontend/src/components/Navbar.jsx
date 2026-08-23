import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Settings, ShieldCheck, User, LogOut, ChevronRight, Menu } from 'lucide-react';
import { fetchInvoices, fetchSettings } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/upload', label: 'Scan Invoice', end: false },
];

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [baseline, setBaseline] = useState('Standard Price List 2026');
  const bellRef = useRef(null);
  const profileRef = useRef(null);

  const planLabels = {
    FREE: 'Basic',
    PRO: 'Professional',
    ENTERPRISE: 'Enterprise',
  };
  const planIcons = {
    FREE: 'sell',
    PRO: 'workspace_premium',
    ENTERPRISE: 'shield',
  };

  useEffect(() => {
    let active = true;
    fetchInvoices()
      .then((invoices) => {
        if (!active) return;
        const flagged = invoices
          .filter((inv) => inv.status === 'FLAGGED' || (inv.overallRiskScore || 0) > 30)
          .sort((a, b) => (b.overallRiskScore || 0) - (a.overallRiskScore || 0))
          .slice(0, 5);
        setNotifications(flagged);
      })
      .catch(() => {});
    fetchSettings()
      .then((settings) => {
        if (!active) return;
        if (settings?.baseline) setBaseline(settings.baseline);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-gutter h-12 shrink-0">
      <div className="flex items-center gap-3 md:gap-6 h-full min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors rounded-DEFAULT cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="text-[22px]" />
        </button>
        <NavLink to="/" className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface flex items-center h-full truncate">
          ProcureGuard AI
        </NavLink>
        <nav className="hidden md:flex items-center h-full gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center h-full px-4 font-body-sm text-body-sm transition-colors duration-200 cursor-pointer active:opacity-80 border-b-2 ${
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant hover:text-on-surface border-transparent hover:bg-surface-container-high'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden lg:flex items-center gap-2 border border-outline-variant px-3 py-1 bg-surface-container-low rounded-DEFAULT text-on-surface font-data-mono text-data-mono">
          <ShieldCheck className="text-[16px] text-primary" />
          {baseline} Active
        </span>

        {user && (
          <span className="hidden lg:flex items-center gap-2 border border-outline-variant px-3 py-1 bg-surface-container-low rounded-DEFAULT text-on-surface-variant font-data-mono text-data-mono">
            <span
              className="material-symbols-outlined text-[14px] text-primary"
              style={{ fontSize: 14 }}
            >
              {planIcons[user.subscriptionPlan] || 'sell'}
            </span>
            <span className="uppercase text-xs">{user.subscriptionPlan}</span>
            <span className="text-xs text-on-surface-variant">
              ({user.dailyScanCount}/{user.maxDailyScans || 3})
            </span>
          </span>
        )}

        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200 rounded-DEFAULT cursor-pointer active:opacity-80 flex items-center justify-center relative"
            aria-label="Notifications"
          >
            <Bell className="text-[20px]" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-error"></span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-1.5rem))] bg-surface-container border border-outline-variant shadow-xl z-50">
              <div className="px-4 py-2 border-b border-outline-variant flex justify-between items-center">
                <span className="font-data-label text-data-label text-on-surface-variant uppercase">Flagged Alerts</span>
                <span className="font-data-mono text-data-mono text-on-surface-variant">{notifications.length}</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
                    No flagged audits
                  </div>
                ) : (
                  notifications.map((inv) => (
                    <button
                      key={inv.id}
                      onClick={() => { setNotifOpen(false); navigate(`/audit/${inv.id}`); }}
                      className="w-full text-left px-4 py-3 border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-body-sm text-body-sm text-on-surface truncate">{inv.vendorName}</div>
                        <div className="font-data-label text-data-label text-on-surface-variant mt-0.5">{inv.invoiceNumber}</div>
                      </div>
                      <span className={`font-data-mono text-data-mono ${(inv.overallRiskScore || 0) > 80 ? 'text-error' : 'text-surface-tint'}`}>
                        {(inv.overallRiskScore || 0).toFixed(1)}
                      </span>
                      <ChevronRight className="text-[14px] text-on-surface-variant" />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200 rounded-DEFAULT cursor-pointer active:opacity-80 flex items-center justify-center ${
              isActive ? 'text-on-surface bg-surface-container-high' : ''
            }`
          }
        >
          <Settings className="text-[20px]" />
        </NavLink>

        <div className="h-6 w-px bg-outline-variant mx-2"></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 bg-surface-container-high border border-outline-variant rounded-full flex items-center justify-center overflow-hidden">
              <User className="text-sm text-on-surface-variant" />
            </div>
          </div>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container border border-outline-variant shadow-xl z-50">
              <div className="px-4 py-3 border-b border-outline-variant">
                <div className="font-body-sm text-body-sm font-medium text-on-surface">
                  {user?.name || 'Lead Procurement Auditor'}
                </div>
                <div className="font-data-label text-data-label text-on-surface-variant mt-0.5">
                  {user?.email || 'auditor@procureguard.go.ke'}
                </div>
                <div className="font-data-mono text-data-mono text-on-surface-variant mt-1 uppercase text-[10px]">
                  Tier: {user?.subscriptionPlan || 'FREE'}
                </div>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/pricing'); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-body-sm text-body-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                Upgrade Plan
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-body-sm text-body-sm cursor-pointer"
              >
                <Settings className="text-[16px]" /> System Settings
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-error hover:bg-error/10 transition-colors font-body-sm text-body-sm cursor-pointer border-t border-outline-variant"
              >
                <LogOut className="text-[16px]" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}