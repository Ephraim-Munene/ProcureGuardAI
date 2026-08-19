import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Settings, ShieldCheck, User } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/upload', label: 'Neural Scan', end: false },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-gutter h-12 shrink-0">
      <div className="flex items-center gap-6 h-full">
        <NavLink to="/" className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface flex items-center h-full">
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
          <span className="text-on-surface-variant hover:text-on-surface transition-colors h-full flex items-center font-body-sm text-body-sm px-4 cursor-pointer active:opacity-80 hover:bg-surface-container-high">
            Registries
          </span>
          <span className="text-on-surface-variant hover:text-on-surface transition-colors h-full flex items-center font-body-sm text-body-sm px-4 cursor-pointer active:opacity-80 hover:bg-surface-container-high">
            EACC Reports
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden lg:flex items-center gap-2 border border-outline-variant px-3 py-1 bg-surface-container-low rounded-DEFAULT text-on-surface font-data-mono text-data-mono">
          <ShieldCheck className="text-[16px] text-primary" />
          PPRA Baseline 2026 Active
        </span>
        <button className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200 rounded-DEFAULT cursor-pointer active:opacity-80 flex items-center justify-center">
          <Bell className="text-[20px]" />
        </button>
        <button className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200 rounded-DEFAULT cursor-pointer active:opacity-80 flex items-center justify-center">
          <Settings className="text-[20px]" />
        </button>
        <div className="h-6 w-px bg-outline-variant mx-2"></div>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 bg-surface-container-high border border-outline-variant rounded-full flex items-center justify-center overflow-hidden">
            <User className="text-sm text-on-surface-variant" />
          </div>
        </div>
      </div>
    </header>
  );
}