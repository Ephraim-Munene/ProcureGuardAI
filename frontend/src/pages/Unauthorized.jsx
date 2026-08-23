import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  const handleSignOut = () => {
    localStorage.removeItem('procureguard_token');
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen w-full flex flex-col items-center justify-center p-6 antialiased selection:bg-surface-variant selection:text-primary">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-error/10 blur-2xl rounded-full"></div>
          <div className="relative w-20 h-20 border border-outline-variant bg-surface-container-low flex items-center justify-center">
            <span
              className="material-symbols-outlined text-error"
              style={{ fontSize: 36 }}
            >
              lock_person
            </span>
          </div>
        </div>

        {/* Code */}
        <span className="font-data-mono text-data-mono text-on-surface-variant tracking-[0.3em] uppercase mb-2">
          Error 401
        </span>

        {/* Heading */}
        <h1 className="font-display-lg text-display-lg text-primary tracking-tight mb-3">
          Your session has ended
        </h1>

        {/* Body */}
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-8 max-w-sm">
          For your security, we sign you out after a period of inactivity.
          Please sign in again to continue reviewing your invoices.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/login"
            onClick={handleSignOut}
            className="flex-1 sm:flex-none bg-primary text-background font-headline-md text-sm py-3 px-8 border border-outline-variant hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              login
            </span>
            Sign In Again
          </Link>
          <Link
            to="/"
            onClick={handleSignOut}
            className="flex-1 sm:flex-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-3 px-8 border border-outline-variant hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <div className="mt-12 flex items-center gap-2 text-on-surface-variant opacity-70">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span className="font-data-mono text-data-mono text-[11px] uppercase">
            Your data stays private and protected
          </span>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
