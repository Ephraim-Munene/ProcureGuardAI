import React from 'react';

const LoginRightPanel = ({
  activeTab,
  setActiveTab,
  showPassword,
  setShowPassword,
  loading,
  error,
  loginForm,
  signupForm,
  handleLoginChange,
  handleSignupChange,
  handleLoginSubmit,
  handleSignupSubmit,
}) => {
  return (
    <div className="w-full md:w-1/2 lg:w-5/12 h-full flex flex-col justify-center items-center p-6 sm:p-12 bg-surface-container-lowest relative z-20">
      <div className="w-full max-w-[380px] flex flex-col">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center gap-3 mb-10 justify-center">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: 24 }}
          >
            shield_person
          </span>
          <span className="font-headline-md text-headline-md tracking-tight text-primary">
            ProcureGuard AI
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-outline-variant mb-8 w-full">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center border-b-2 font-headline-md text-sm transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Terminal Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 text-center border-b-2 font-headline-md text-sm transition-colors cursor-pointer ${
              activeTab === 'signup'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Agent Provisioning
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-DEFAULT bg-error-container border border-error text-on-error-container">
            <span className="material-symbols-outlined text-sm mr-2">error</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-1.5">
              <label
                className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider"
                htmlFor="login-email"
              >
                Investigative Agency Email
              </label>
              <div className="relative flat-input-focus border border-outline-variant bg-surface flex items-center transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3" style={{ fontSize: 18 }}>
                  mail
                </span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  className="w-full bg-transparent border-none focus:ring-0 font-body-sm text-body-sm text-on-surface py-2.5 pl-10 pr-3 placeholder:text-outline"
                  placeholder="agent.id@eacc.gov"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <label
                  className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider"
                  htmlFor="login-password"
                >
                  Passphrase
                </label>
              </div>
              <div className="relative flat-input-focus border border-outline-variant bg-surface flex items-center transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3" style={{ fontSize: 18 }}>
                  key
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  className="w-full bg-transparent border-none focus:ring-0 font-data-mono text-data-mono text-on-surface py-2.5 pl-10 pr-10 placeholder:text-outline"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-surface-variant text-primary font-headline-md text-headline-md text-sm py-3 border border-outline-variant hover:bg-surface-bright transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    login
                  </span>
                  Authenticate Session
                </>
              )}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-1.5">
              <label
                className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider"
                htmlFor="signup-name"
              >
                Username / Agent Name
              </label>
              <div className="relative flat-input-focus border border-outline-variant bg-surface flex items-center transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3" style={{ fontSize: 18 }}>
                  person
                </span>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  className="w-full bg-transparent border-none focus:ring-0 font-body-sm text-body-sm text-on-surface py-2.5 pl-10 pr-3 placeholder:text-outline"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider"
                htmlFor="signup-email"
              >
                Investigative Agency Email
              </label>
              <div className="relative flat-input-focus border border-outline-variant bg-surface flex items-center transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3" style={{ fontSize: 18 }}>
                  mail
                </span>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  className="w-full bg-transparent border-none focus:ring-0 font-body-sm text-body-sm text-on-surface py-2.5 pl-10 pr-3 placeholder:text-outline"
                  placeholder="agent.id@eacc.gov"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider"
                htmlFor="signup-password"
              >
                Passphrase
              </label>
              <div className="relative flat-input-focus border border-outline-variant bg-surface flex items-center transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3" style={{ fontSize: 18 }}>
                  key
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  className="w-full bg-transparent border-none focus:ring-0 font-data-mono text-data-mono text-on-surface py-2.5 pl-10 pr-10 placeholder:text-outline"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider"
                htmlFor="signup-plan"
              >
                Initial Scan Tier
              </label>
              <div className="relative flat-input-focus border border-outline-variant bg-surface flex items-center transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3" style={{ fontSize: 18 }}>
                  workspace_premium
                </span>
                <select
                  id="signup-plan"
                  name="plan"
                  value={signupForm.plan}
                  onChange={handleSignupChange}
                  className="w-full bg-transparent border-none focus:ring-0 font-body-sm text-body-sm text-on-surface py-2.5 pl-10 pr-3 appearance-none"
                  required
                >
                  <option value="FREE">FREE Tier (3 scans/day)</option>
                  <option value="PRO">PRO Tier (10 KES, 50 scans/day)</option>
                  <option value="ENTERPRISE">Enterprise Tier (20 KES, 500 scans/day)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-primary text-background font-data-mono text-data-mono hover:bg-primary-container transition-colors py-3 border border-outline-variant flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    workspace_premium
                  </span>
                  Provision Agent Account
                </>
              )}
            </button>

            <p className="font-body-xs text-body-xs text-on-surface-variant text-center mt-2">
              You can upgrade your scan tier anytime via the Pricing dashboard.
            </p>
          </form>
        )}

        {/* Footer */}
        <div className="mt-12 text-center flex flex-col items-center gap-1">
          <span className="font-data-mono text-data-mono text-on-surface-variant text-[11px] uppercase opacity-70">
            Secure Terminal v2.4.0-Forensic // Encrypted Session
          </span>
          <span className="font-body-xs text-body-xs text-outline text-[11px]">
            Unauthorized access attempts are logged and flagged for review.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginRightPanel;
