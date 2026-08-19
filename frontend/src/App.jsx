import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UploadInvoice from './pages/UploadInvoice';
import AuditDetails from './pages/AuditDetails';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-sm antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadInvoice />} />
            <Route path="/audit/:id" element={<AuditDetails />} />
          </Routes>
        </main>
        <footer className="border-t border-outline-variant bg-background py-4 text-center shrink-0">
          <p className="font-data-label text-data-label text-on-surface-variant">
            © 2026 ProcureGuard AI • Ethics and Anti-Corruption Commission (EACC) Republic of Kenya
          </p>
        </footer>
      </div>
    </Router>
  );
}