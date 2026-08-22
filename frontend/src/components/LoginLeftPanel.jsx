import React from 'react';

const LoginLeftPanel = () => (
  <div className="hidden md:flex md:w-1/2 lg:w-7/12 relative border-r border-outline-variant flex-col justify-between overflow-hidden bg-background">
    <div className="absolute inset-0 z-0 opacity-40">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkrLRyvPZ4VU1uI1MRTamGLY-ksYPVU0pHbothP7-viWfHS1SC66dQizI0sVWV9Yrr9_Rlwt3MlQpAWu_IedK7oc6PsOKLwFp1n4edIYybcWykO_c5rdkFboW1ypmQM08i_k4sWzH6xbQy0n9jvGXLikZJQjVnwSQcZhyqMt4kq5rkQeQssbcO61wZTNkAVFIheqxzRsHuNHf6wueRSV98S6eTqufmqegR0MSaGmIN_XGF5KGwxtyqzw')",
        }}
      ></div>
    </div>
    <div className="absolute inset-0 z-10 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
    <div className="relative z-20 p-12 flex flex-col h-full justify-between">
      <div className="flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}
        >
          shield_person
        </span>
        <span className="font-headline-md text-headline-md tracking-tight text-primary">
          ProcureGuard AI
        </span>
      </div>
      <div className="max-w-md">
        <h1 className="font-display-lg text-display-lg text-primary mb-4 tracking-tight">
          Oversight Terminal
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-8">
          Access to this system is restricted to authorized investigative agents.
          All forensic activities, neural scans, and registry queries are logged
          and heavily encrypted to maintain absolute operational integrity.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 border border-outline-variant bg-surface-container-low px-3 py-2 w-fit">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              verified_user
            </span>
            <span className="font-data-mono text-data-mono text-on-surface uppercase">
              EACC Baseline 2026 Compliant
            </span>
          </div>
          <div className="flex items-center gap-2 border border-outline-variant bg-surface-container-low px-3 py-2 w-fit">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              enhanced_encryption
            </span>
            <span className="font-data-mono text-data-mono text-on-surface uppercase">
              Military-Grade Encryption Active
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoginLeftPanel;
