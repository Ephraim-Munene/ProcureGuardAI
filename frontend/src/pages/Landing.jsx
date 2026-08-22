import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  FileText,
  Search,
  Gavel,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Send,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Database,
  Lock,
} from 'lucide-react';
import { TIERS } from '../data/tiers';
import { useAuth } from '../contexts/AuthContext';
import { submitContactMessage } from '../api/client';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState({ sending: false, success: '', error: '' });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ sending: true, success: '', error: '' });
    try {
      const res = await submitContactMessage(contactForm);
      setContactStatus({
        sending: false,
        success: res.message || 'Message sent successfully. Our oversight desk will review it.',
        error: '',
      });
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setContactStatus({
        sending: false,
        success: '',
        error: err.response?.data?.error || 'Failed to submit message. Please try again.',
      });
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-sm antialiased overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-4 md:px-gutter h-16 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center">
            <ShieldCheck className="text-primary text-[18px]" />
          </div>
          <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
            ProcureGuard AI
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection('features')}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-sm font-body-sm"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-sm font-body-sm"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-sm font-body-sm"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-sm font-body-sm"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-sm font-body-sm"
          >
            Contact
          </button>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-on-surface hover:text-primary transition-colors font-data-mono text-data-mono text-xs cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            to="/login?tab=signup"
            className="px-4 py-2 bg-primary text-background font-data-mono text-data-mono text-xs hover:bg-primary-container transition-colors rounded-DEFAULT flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <span>Get Started</span>
            <ArrowRight className="text-[14px]" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          {mobileMenuOpen ? <X className="text-[24px]" /> : <Menu className="text-[24px]" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-surface-container border-b border-outline-variant p-4 flex flex-col gap-4 z-40 shadow-2xl">
          <button
            onClick={() => scrollToSection('features')}
            className="text-left py-2 text-on-surface hover:text-primary font-body-sm"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-left py-2 text-on-surface hover:text-primary font-body-sm"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-left py-2 text-on-surface hover:text-primary font-body-sm"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-left py-2 text-on-surface hover:text-primary font-body-sm"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-left py-2 text-on-surface hover:text-primary font-body-sm"
          >
            Contact
          </button>
          <div className="pt-2 border-t border-outline-variant flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full text-center py-2.5 border border-outline-variant text-on-surface rounded-DEFAULT font-data-mono text-data-mono"
            >
              Sign In
            </Link>
            <Link
              to="/login?tab=signup"
              className="w-full text-center py-2.5 bg-primary text-background rounded-DEFAULT font-data-mono text-data-mono font-bold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 lg:px-16 py-20 lg:py-32 flex flex-col items-center text-center bg-surface-container-lowest border-b border-outline-variant overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-outline-variant rounded-full text-primary font-data-mono text-data-mono text-xs uppercase tracking-wider">
            <ShieldCheck className="text-[14px]" />
            PPRA Baseline 2026 · Neural Audit Surveillance
          </div>
          <h1 className="font-display-lg text-3xl sm:text-5xl lg:text-6xl text-on-surface font-extrabold tracking-tight leading-tight">
            Autonomous Oversight & Fraud Detection for Public Procurement
          </h1>
          <p className="font-body-sm text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            ProcureGuard AI leverages advanced Neural OCR and automated benchmark verification to expose price gouging, flag inflated vendor invoices, and safeguard public funds across government departments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link
              to="/login?tab=signup"
              className="px-6 py-3.5 bg-primary text-background font-data-mono text-data-mono hover:bg-primary-container transition-colors rounded-DEFAULT flex items-center gap-2 font-bold cursor-pointer text-sm shadow-lg"
            >
              <span>Provision Agent Account</span>
              <ArrowRight className="text-[16px]" />
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="px-6 py-3.5 border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors rounded-DEFAULT font-data-mono text-data-mono text-sm cursor-pointer"
            >
              Explore Capabilities
            </button>
          </div>

          {/* Terminal Mockup Card */}
          <div className="mt-12 w-full max-w-3xl bg-surface border border-outline-variant p-4 sm:p-6 rounded-DEFAULT text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-surface-tint inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                <span className="font-data-label text-data-label text-on-surface-variant ml-2 uppercase">
                  Live Audit Terminal · GOV-KE-2026
                </span>
              </div>
              <span className="font-data-mono text-[10px] text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded">
                SECURE
              </span>
            </div>
            <div className="font-data-mono text-xs space-y-2 text-on-surface-variant">
              <div className="flex justify-between items-center bg-surface-container-low p-2 border border-outline-variant/50">
                <span>INVOICE: #GOV-KE-2026-9812</span>
                <span className="text-error font-bold">CRITICAL · 88.4 RISK</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-2 border border-outline-variant/50">
                <span>VENDOR: Apex Global Supplies Ltd</span>
                <span>EXCESS MARKUP: +166%</span>
              </div>
              <div className="text-[11px] text-outline pt-1">
                ✓ Neural OCR verified line items against PPRA 2026 baseline registry.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-data-label text-data-label text-primary uppercase tracking-widest block mb-2">
            FORENSIC CAPABILITIES
          </span>
          <h2 className="font-display-lg text-2xl sm:text-4xl text-on-surface font-bold">
            Built for Rigorous Public Oversight
          </h2>
          <p className="font-body-sm text-on-surface-variant mt-3">
            Designed with GovTech precision to automate invoice auditing without losing granular investigative control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container border border-outline-variant p-6 rounded-DEFAULT flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
              <div className="w-10 h-10 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-primary mb-4">
                <FileText className="text-[20px]" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Neural OCR Intake</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Upload scanned PDFs, physical invoices, or tabular tenders. Neural models parse line items instantly.
              </p>
            </div>
            <span className="font-data-label text-[10px] text-primary uppercase mt-6 tracking-wider">
              Multi-format Parser
            </span>
          </div>

          <div className="bg-surface-container border border-outline-variant p-6 rounded-DEFAULT flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
              <div className="w-10 h-10 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-error mb-4">
                <AlertTriangle className="text-[20px]" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Automated Anomaly Detection</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Compares invoiced unit prices against official PPRA benchmark ceilings to calculate excess markups.
              </p>
            </div>
            <span className="font-data-label text-[10px] text-error uppercase mt-6 tracking-wider">
              Real-time Risk Scoring
            </span>
          </div>

          <div className="bg-surface-container border border-outline-variant p-6 rounded-DEFAULT flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
              <div className="w-10 h-10 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-primary mb-4">
                <Landmark className="text-[20px]" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Vendor Registry Cross-Check</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Inspect vendor compliance history, KRA PIN validity, and multi-department tender frequency.
              </p>
            </div>
            <span className="font-data-label text-[10px] text-primary uppercase mt-6 tracking-wider">
              Public Ledger Sync
            </span>
          </div>

          <div className="bg-surface-container border border-outline-variant p-6 rounded-DEFAULT flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
              <div className="w-10 h-10 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-primary mb-4">
                <Gavel className="text-[20px]" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">EACC Escalation Pathways</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Generate audit briefs and flag fraudulent transactions directly for statutory investigation and recovery.
              </p>
            </div>
            <span className="font-data-label text-[10px] text-primary uppercase mt-6 tracking-wider">
              Legal Brief Export
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 lg:px-16 bg-surface-container-lowest border-y border-outline-variant">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-data-label text-data-label text-primary uppercase tracking-widest block mb-2">
              OPERATIONAL WORKFLOW
            </span>
            <h2 className="font-display-lg text-2xl sm:text-4xl text-on-surface font-bold">
              Four Steps to Absolute Accountability
            </h2>
            <p className="font-body-sm text-on-surface-variant mt-3">
              Streamlined forensic pipeline from document upload to legal escalation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-background font-data-mono text-base font-bold flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Upload Submission</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Import procurement invoices, delivery notes, or tender proposals securely.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant text-on-surface font-data-mono text-base font-bold flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Neural Scan & OCR</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                AI extracts quantities, unit prices, vendor names, and calculates variances automatically.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant text-on-surface font-data-mono text-base font-bold flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Forensic Review</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Analyze price inflation heatmaps, vendor risk scores, and department anomaly trends.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant text-on-surface font-data-mono text-base font-bold flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Justify or Escalate</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Mark items as justified or flag critical discrepancies for official anti-corruption investigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Matching tier/code.html design) */}
      <section id="pricing" className="py-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-data-label text-data-label text-primary uppercase tracking-widest block mb-2">
            LICENSE CONFIGURATION
          </span>
          <h2 className="font-display-lg text-2xl sm:text-4xl text-on-surface font-bold">
            Select Your Oversight Tier
          </h2>
          <p className="font-body-sm text-on-surface-variant mt-3">
            Provision Neural Scan capacity and forensic analysis capabilities. Billing is calculated per daily operational cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-surface-container border p-6 flex flex-col justify-between h-full relative rounded-DEFAULT ${
                tier.badge ? 'border-primary shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'border-outline-variant'
              }`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-0 bg-primary text-background font-data-label text-data-label px-2 py-1 rounded-bl-DEFAULT font-bold">
                  {tier.badge}
                </div>
              )}
              <div>
                <div className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mb-2">
                  TIER {tier.num}
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{tier.name}</h3>
                <div className="flex items-baseline space-x-1 mb-4">
                  <span className="font-data-mono text-display-lg text-on-surface">{tier.price}</span>
                  <span className="font-data-mono text-data-mono text-on-surface-variant">{tier.priceLabel}</span>
                </div>
                <p className="font-body-xs text-body-xs text-on-surface-variant mb-6">
                  {tier.description}
                </p>
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="text-primary text-[16px] mt-0.5 shrink-0" />
                      <span className="text-on-surface-variant text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to={`/login?tab=signup`}
                className={`w-full py-2.5 px-4 rounded-DEFAULT transition-colors flex items-center justify-center gap-2 font-data-mono text-data-mono text-center ${
                  tier.badge
                    ? 'bg-primary text-background hover:bg-primary-container font-bold'
                    : 'border border-outline-variant text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {tier.id === 'FREE' ? 'Activate Free License' : `Activate License (${tier.price} KES)`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-8 lg:px-16 bg-surface-container-lowest border-y border-outline-variant">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-data-label text-data-label text-primary uppercase tracking-widest block mb-2">
              KNOWLEDGE BASE
            </span>
            <h2 className="font-display-lg text-2xl sm:text-4xl text-on-surface font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is ProcureGuard AI?',
                a: 'ProcureGuard AI is an autonomous GovTech platform built to audit public procurement invoices, detect price inflation against PPRA baseline benchmarks, and assist oversight bodies in recovering public funds.',
              },
              {
                q: 'How does the Neural Scan OCR work?',
                a: 'Our document intake engine parses uploaded PDF invoices or tender documents, extracts line items, quantities, and unit prices, and instantly correlates them against official market benchmarks.',
              },
              {
                q: 'How do daily scan quotas work?',
                a: 'Each account tier includes a set number of daily neural scans (e.g. 3 for Free, 50 for Professional, 500 for Enterprise). Quotas reset at midnight East Africa Time (EAT).',
              },
              {
                q: 'How is M-Pesa billing handled?',
                a: 'Paid tiers (Professional at 10 KES/day and Enterprise at 20 KES/day) are provisioned via M-Pesa STK push. You receive a payment prompt on your mobile phone upon activation or upgrade.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface-container border border-outline-variant rounded-DEFAULT overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    <span className="font-headline-md text-headline-md text-on-surface text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`text-on-surface-variant text-[20px] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-on-surface-variant font-body-sm text-sm border-t border-outline-variant/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="font-data-label text-data-label text-primary uppercase tracking-widest block mb-2">
              SECURE DESK
            </span>
            <h2 className="font-display-lg text-2xl sm:text-4xl text-on-surface font-bold mb-4">
              Get in Touch with Our Oversight Team
            </h2>
            <p className="font-body-sm text-on-surface-variant mb-8 leading-relaxed">
              Have questions about agency onboarding, custom benchmark integrations, or enterprise surveillance? Send a secure dispatch to our technical desk.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-primary shrink-0">
                  <Mail className="text-[18px]" />
                </div>
                <div>
                  <div className="font-data-label text-data-label text-on-surface-variant uppercase">Secure Email</div>
                  <div className="font-data-mono text-data-mono text-on-surface mt-0.5">desk@procureguard.go.ke</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-primary shrink-0">
                  <Phone className="text-[18px]" />
                </div>
                <div>
                  <div className="font-data-label text-data-label text-on-surface-variant uppercase">Oversight Hotline</div>
                  <div className="font-data-mono text-data-mono text-on-surface mt-0.5">+254 (020) 2800 000</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center text-primary shrink-0">
                  <MapPin className="text-[18px]" />
                </div>
                <div>
                  <div className="font-data-label text-data-label text-on-surface-variant uppercase">Headquarters</div>
                  <div className="font-body-sm text-on-surface mt-0.5">Taifa Road, Nairobi City County, Kenya</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant p-6 sm:p-8 rounded-DEFAULT">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Send Secure Dispatch</h3>

            {contactStatus.success && (
              <div className="mb-6 p-4 rounded-DEFAULT bg-primary/10 border border-primary text-primary flex items-center gap-3">
                <CheckCircle2 className="text-[20px] shrink-0" />
                <span className="font-body-sm text-sm">{contactStatus.success}</span>
              </div>
            )}

            {contactStatus.error && (
              <div className="mb-6 p-4 rounded-DEFAULT bg-error-container border border-error text-on-error-container flex items-center gap-3">
                <AlertTriangle className="text-[20px] shrink-0" />
                <span className="font-body-sm text-sm">{contactStatus.error}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1.5">
                  Agent / Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface font-body-sm px-3 py-2.5 rounded-DEFAULT focus:border-primary focus:outline-none"
                  placeholder="E. Munene"
                />
              </div>

              <div>
                <label className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1.5">
                  Agency Email
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface font-body-sm px-3 py-2.5 rounded-DEFAULT focus:border-primary focus:outline-none"
                  placeholder="auditor@eacc.go.ke"
                />
              </div>

              <div>
                <label className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface font-body-sm px-3 py-2.5 rounded-DEFAULT focus:border-primary focus:outline-none"
                  placeholder="Enterprise Onboarding Inquiry"
                />
              </div>

              <div>
                <label className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1.5">
                  Message (Min 10 chars)
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-surface border border-outline-variant text-on-surface font-body-sm p-3 rounded-DEFAULT focus:border-primary focus:outline-none resize-none"
                  placeholder="Describe your agency oversight requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={contactStatus.sending}
                className="w-full bg-primary text-background py-3 font-data-mono text-data-mono font-bold hover:bg-primary-container transition-colors rounded-DEFAULT flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {contactStatus.sending ? (
                  <>
                    <Loader2 className="animate-spin text-[16px]" />
                    <span>Transmitting Dispatch...</span>
                  </>
                ) : (
                  <>
                    <Send className="text-[16px]" />
                    <span>Transmit Dispatch</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant bg-surface py-12 px-4 sm:px-8 lg:px-16 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-surface-container-high border border-outline-variant rounded flex items-center justify-center">
              <ShieldCheck className="text-primary text-[16px]" />
            </div>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              ProcureGuard AI
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-body-xs text-on-surface-variant">
            <button onClick={() => scrollToSection('features')} className="hover:text-on-surface cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-on-surface cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-on-surface cursor-pointer">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-on-surface cursor-pointer">
              FAQ
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-on-surface cursor-pointer">
              Contact
            </button>
            <Link to="/login" className="hover:text-on-surface cursor-pointer">
              Sign In
            </Link>
          </div>

          <div className="font-data-label text-data-label text-on-surface-variant text-center md:text-right">
            © 2026 ProcureGuard AI • Public Procurement Oversight
            <div className="text-[10px] text-outline mt-1">Encrypted GovTech Surveillance Protocol v2.4</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
