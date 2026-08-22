import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Landing from './pages/Landing';
import { useAuth } from './contexts/AuthContext';
import './index.css';

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (loading) return null;
  if (!user) return <Landing />;
  return (
    <>
      <Navbar onMenuClick={() => setMobileNavOpen(true)} />
      <div className="flex-1 flex flex-col md:pl-sidebar-width">
        <Sidebar
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />
        <main className="flex-1 flex flex-col min-w-0">
          <Dashboard />
        </main>
      </div>
      <footer className="border-t border-outline-variant bg-background py-4 text-center shrink-0 md:pl-sidebar-width">
        <p className="font-data-label text-data-label text-on-surface-variant">
          © 2026 ProcureGuard AI • Public Procurement Oversight
        </p>
      </footer>
    </>
  );
}

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-sm antialiased overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route
              path="/*"
              element={
                <>
                  <Navbar onMenuClick={() => setMobileNavOpen(true)} />
                  <div className="flex-1 flex flex-col md:pl-sidebar-width">
                    <Sidebar
                      mobileOpen={mobileNavOpen}
                      onCloseMobile={() => setMobileNavOpen(false)}
                    />
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
                        <Route path="/pricing" element={<Pricing />} />
                      </Routes>
                    </main>
                  </div>
                  <footer className="border-t border-outline-variant bg-background py-4 text-center shrink-0 md:pl-sidebar-width">
                    <p className="font-data-label text-data-label text-on-surface-variant">
                      © 2026 ProcureGuard AI • Public Procurement Oversight
                    </p>
                  </footer>
                </>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
