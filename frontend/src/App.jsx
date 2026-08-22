import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UploadInvoice from './pages/UploadInvoice';
import AuditDetails from './pages/AuditDetails';
import AuditTerminal from './pages/AuditTerminal';
import Vendors from './pages/Vendors';
import RiskMatrix from './pages/RiskMatrix';
import LegalArchive from './pages/LegalArchive';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-sm antialiased">
        <Navbar />
        <div className="flex-1 flex flex-col md:pl-sidebar-width">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadInvoice />} />
              <Route path="/audit/:id" element={<AuditDetails />} />
              <Route path="/audits" element={<AuditTerminal />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/risk" element={<RiskMatrix />} />
              <Route path="/archive" element={<LegalArchive />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <footer className="border-t border-outline-variant bg-background py-4 text-center shrink-0 md:pl-sidebar-width">
          <p className="font-data-label text-data-label text-on-surface-variant">
            © 2026 ProcureGuard AI • Public Procurement Oversight
          </p>
        </footer>
      </div>
    </Router>
  );
}