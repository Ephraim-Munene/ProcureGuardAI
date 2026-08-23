import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Tags,
  Scale,
  Building2,
  Info,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchBenchmarks,
  createBenchmark,
  updateBenchmark,
  deleteBenchmark,
  fetchSettings,
  updateSettings,
} from '../api/client';

const TABS = [
  { id: 'benchmarks', label: 'Benchmarks', icon: Tags },
  { id: 'thresholds', label: 'Risk Thresholds', icon: Scale },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'about', label: 'About / API', icon: Info },
];

const EMPTY_BENCHMARK = { itemName: '', category: 'Stationery', averageMarketPriceKes: '', maxAllowedPriceKes: '' };

export default function Settings() {
  const [tab, setTab] = useState('benchmarks');
  const [benchmarks, setBenchmarks] = useState([]);
  const [settings, setSettings] = useState({
    riskCriticalThreshold: '75',
    riskHighThreshold: '50',
    riskFlagThreshold: '30',
    departments: '[]',
    baseline: 'Standard Price List 2026',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ saving: false, ok: false, error: null });
  const [newBenchmark, setNewBenchmark] = useState(EMPTY_BENCHMARK);
  const [newDept, setNewDept] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [bench, s] = await Promise.all([fetchBenchmarks(), fetchSettings()]);
      setBenchmarks(bench || []);
      setSettings((prev) => ({ ...prev, ...(s || {}) }));
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const notify = (ok, error = null) => {
    setStatus({ saving: false, ok, error });
    setTimeout(() => setStatus({ saving: false, ok: false, error: null }), 3000);
  };

  const saveBenchmarks = async () => {
    setSaving(true);
    try {
      await Promise.all(
        benchmarks
          .filter((b) => b._dirty)
          .map((b) =>
            updateBenchmark(b.id, {
              itemName: b.itemName,
              category: b.category,
              averageMarketPriceKes: Number(b.averageMarketPriceKes),
              maxAllowedPriceKes: Number(b.maxAllowedPriceKes),
            })
          )
      );
      notify(true);
      await load();
    } catch (err) {
      console.error('Failed to save benchmarks:', err);
      notify(false, 'Failed to save benchmark changes.');
    } finally {
      setSaving(false);
    }
  };

  const patchBenchmark = (id, field, value) => {
    setBenchmarks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value, _dirty: true } : b)));
  };

  const addBenchmark = async () => {
    if (!newBenchmark.itemName) return;
    setSaving(true);
    try {
      await createBenchmark({
        itemName: newBenchmark.itemName,
        category: newBenchmark.category,
        averageMarketPriceKes: Number(newBenchmark.averageMarketPriceKes) || 0,
        maxAllowedPriceKes: Number(newBenchmark.maxAllowedPriceKes) || 0,
      });
      setNewBenchmark(EMPTY_BENCHMARK);
      notify(true);
      await load();
    } catch (err) {
      console.error('Failed to add benchmark:', err);
      notify(false, 'Failed to add benchmark.');
    } finally {
      setSaving(false);
    }
  };

  const removeBenchmark = async (id) => {
    setSaving(true);
    try {
      await deleteBenchmark(id);
      notify(true);
      await load();
    } catch (err) {
      console.error('Failed to delete benchmark:', err);
      notify(false, 'Failed to delete benchmark.');
    } finally {
      setSaving(false);
    }
  };

  const saveThresholds = async () => {
    setSaving(true);
    try {
      await updateSettings({
        riskCriticalThreshold: String(Number(settings.riskCriticalThreshold) || 0),
        riskHighThreshold: String(Number(settings.riskHighThreshold) || 0),
        riskFlagThreshold: String(Number(settings.riskFlagThreshold) || 0),
      });
      notify(true);
    } catch (err) {
      console.error('Failed to save thresholds:', err);
      notify(false, 'Failed to save thresholds.');
    } finally {
      setSaving(false);
    }
  };

  const departments = (() => {
    try {
      const parsed = JSON.parse(settings.departments || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const addDepartment = () => {
    const name = newDept.trim();
    if (!name || departments.includes(name)) return;
    setSettings((prev) => ({ ...prev, departments: JSON.stringify([...departments, name]) }));
    setNewDept('');
  };

  const removeDepartment = (name) => {
    setSettings((prev) => ({ ...prev, departments: JSON.stringify(departments.filter((d) => d !== name)) }));
  };

  const saveDepartments = async () => {
    setSaving(true);
    try {
      await updateSettings({ departments: JSON.stringify(departments) });
      notify(true);
    } catch (err) {
      console.error('Failed to save departments:', err);
      notify(false, 'Failed to save departments.');
    } finally {
      setSaving(false);
    }
  };

  const dirtyCount = benchmarks.filter((b) => b._dirty).length;

  return (
    <div className="flex-1 flex flex-col p-gutter gap-gutter overflow-hidden min-h-[500px]">
      <div className="flex items-center gap-3">
        <SettingsIcon className="text-[20px] text-primary" />
        <h1 className="font-headline-md text-headline-md text-on-surface">System Settings</h1>
        {status.saving && <RefreshCw className="text-[16px] text-on-surface-variant animate-spin" />}
        {status.ok && <span className="font-data-label text-data-label text-primary uppercase">Saved</span>}
        {status.error && <span className="font-data-label text-data-label text-error uppercase">{status.error}</span>}
      </div>

      <div className="flex border-b border-outline-variant gap-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 font-body-sm text-body-sm transition-colors border-b-2 cursor-pointer ${
                active
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              <Icon className="text-[16px]" />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-3 text-on-surface-variant">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-data-mono text-data-mono text-sm">Loading system configuration...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {tab === 'benchmarks' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
                  Market Price Reference List
                </span>
                <button
                  onClick={saveBenchmarks}
                  disabled={saving || dirtyCount === 0}
                  className="bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded px-3 py-1.5 font-data-mono text-data-mono flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save className="text-[14px]" />
                  Save Changes ({dirtyCount})
                </button>
              </div>

              <div className="bg-surface-container-low border border-outline-variant">
                <table className="w-full min-w-[640px] text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-low z-10 font-data-label text-data-label text-on-surface-variant uppercase border-b border-outline-variant">
                    <tr>
                      <th className="p-2 pl-4 w-40">Category</th>
                      <th className="p-2">Item Name</th>
                      <th className="p-2 w-36 text-right">Avg Market (KES)</th>
                      <th className="p-2 w-36 text-right">Max Allowed (KES)</th>
                      <th className="p-2 pr-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/50">
                    {benchmarks.map((b) => (
                      <tr key={b.id} className="hover:bg-surface-container-high transition-colors">
                        <td className="p-2 pl-4">
                          <select
                            value={b.category}
                            onChange={(e) => patchBenchmark(b.id, 'category', e.target.value)}
                            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-1 py-0.5 w-full cursor-pointer"
                          >
                            {['Stationery', 'Furniture', 'Electronics', 'Supplies'].map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={b.itemName}
                            onChange={(e) => patchBenchmark(b.id, 'itemName', e.target.value)}
                            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-1 py-0.5 w-full focus:border-primary focus:outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={b.averageMarketPriceKes}
                            onChange={(e) => patchBenchmark(b.id, 'averageMarketPriceKes', e.target.value)}
                            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-1 py-0.5 w-full text-right focus:border-primary focus:outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={b.maxAllowedPriceKes}
                            onChange={(e) => patchBenchmark(b.id, 'maxAllowedPriceKes', e.target.value)}
                            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-1 py-0.5 w-full text-right focus:border-primary focus:outline-none"
                          />
                        </td>
                        <td className="p-2 pr-4 text-right">
                          <button
                            onClick={() => removeBenchmark(b.id)}
                            disabled={saving}
                            className="text-error hover:bg-error/10 transition-colors rounded p-1 cursor-pointer disabled:opacity-60"
                            aria-label="Delete benchmark"
                          >
                            <Trash2 className="text-[14px]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-surface-container-low border border-outline-variant p-4 flex flex-wrap items-end gap-3">
                <div>
                  <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1">New Item Name</span>
                  <input
                    type="text"
                    value={newBenchmark.itemName}
                    onChange={(e) => setNewBenchmark((p) => ({ ...p, itemName: e.target.value }))}
                    placeholder="e.g. Office Desk Fan"
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 w-56 focus:border-primary focus:outline-none placeholder:text-on-surface-variant"
                  />
                </div>
                <div>
                  <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1">Category</span>
                  <select
                    value={newBenchmark.category}
                    onChange={(e) => setNewBenchmark((p) => ({ ...p, category: e.target.value }))}
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 cursor-pointer"
                  >
                    {['Stationery', 'Furniture', 'Electronics', 'Supplies'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1">Avg Market (KES)</span>
                  <input
                    type="number"
                    value={newBenchmark.averageMarketPriceKes}
                    onChange={(e) => setNewBenchmark((p) => ({ ...p, averageMarketPriceKes: e.target.value }))}
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 w-32 text-right focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1">Max Allowed (KES)</span>
                  <input
                    type="number"
                    value={newBenchmark.maxAllowedPriceKes}
                    onChange={(e) => setNewBenchmark((p) => ({ ...p, maxAllowedPriceKes: e.target.value }))}
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 w-32 text-right focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  onClick={addBenchmark}
                  disabled={saving || !newBenchmark.itemName}
                  className="bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded px-3 py-1.5 font-data-mono text-data-mono flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Plus className="text-[14px]" />
                  Add
                </button>
              </div>
            </div>
          )}

          {tab === 'thresholds' && (
            <div className="max-w-xl flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-unit">
                <div className="bg-surface-container-low border border-outline-variant p-4">
                  <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-2">Critical (Risk &gt;)</span>
                  <input
                    type="number"
                    value={settings.riskCriticalThreshold}
                    onChange={(e) => setSettings((p) => ({ ...p, riskCriticalThreshold: e.target.value }))}
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-data-mono text-data-mono text-lg px-2 py-1 w-full text-center focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="bg-surface-container-low border border-outline-variant p-4">
                  <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-2">Elevated (Risk &gt;)</span>
                  <input
                    type="number"
                    value={settings.riskHighThreshold}
                    onChange={(e) => setSettings((p) => ({ ...p, riskHighThreshold: e.target.value }))}
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-data-mono text-data-mono text-lg px-2 py-1 w-full text-center focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="bg-surface-container-low border border-outline-variant p-4">
                  <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-2">Auto-Flag (Risk &gt;)</span>
                  <input
                    type="number"
                    value={settings.riskFlagThreshold}
                    onChange={(e) => setSettings((p) => ({ ...p, riskFlagThreshold: e.target.value }))}
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-data-mono text-data-mono text-lg px-2 py-1 w-full text-center focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveThresholds}
                  disabled={saving}
                  className="bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded px-3 py-1.5 font-data-mono text-data-mono flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save className="text-[14px]" />
                  Save Thresholds
                </button>
              </div>
            </div>
          )}

          {tab === 'departments' && (
            <div className="max-w-xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addDepartment(); }}
                  placeholder="Add department, e.g. Transport"
                  className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 flex-1 focus:border-primary focus:outline-none placeholder:text-on-surface-variant"
                />
                <button
                  onClick={addDepartment}
                  disabled={!newDept.trim()}
                  className="bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded px-3 py-1.5 font-data-mono text-data-mono flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Plus className="text-[14px]" />
                  Add
                </button>
              </div>
              <div className="bg-surface-container-low border border-outline-variant divide-y divide-outline-variant/50">
                {departments.length === 0 ? (
                  <div className="p-6 text-center font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
                    No departments configured
                  </div>
                ) : (
                  departments.map((name) => (
                    <div key={name} className="flex items-center justify-between px-4 py-2.5">
                      <span className="font-body-sm text-body-sm text-on-surface">{name}</span>
                      <button
                        onClick={() => removeDepartment(name)}
                        className="text-error hover:bg-error/10 transition-colors rounded p-1 cursor-pointer"
                        aria-label={`Remove ${name}`}
                      >
                        <Trash2 className="text-[14px]" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveDepartments}
                  disabled={saving}
                  className="bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded px-3 py-1.5 font-data-mono text-data-mono flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save className="text-[14px]" />
                  Save Departments
                </button>
              </div>
            </div>
          )}

          {tab === 'about' && (
            <div className="max-w-xl flex flex-col gap-4">
              <div className="bg-surface-container-low border border-outline-variant p-4 flex items-center gap-3">
                <ShieldCheck className="text-[24px] text-primary" />
                <div>
                  <div className="font-body-sm text-body-sm font-medium text-on-surface">ProcureGuard AI</div>
                  <div className="font-data-label text-data-label text-on-surface-variant mt-0.5">Invoice auditing for public procurement teams</div>
                </div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-4">
                <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-1">Active Baseline</span>
                <input
                  type="text"
                  value={settings.baseline}
                  onChange={(e) => setSettings((p) => ({ ...p, baseline: e.target.value }))}
                  className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 w-full focus:border-primary focus:outline-none"
                />
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-4">
                <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-2">AI / API Configuration</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  AI analysis runs securely on our servers. The API key and settings are
                  managed through the <span className="font-data-mono text-data-mono text-on-surface">backend/.env</span> file and
                  cannot be changed at runtime.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await updateSettings({ baseline: settings.baseline });
                      notify(true);
                    } catch (err) {
                      notify(false, 'Failed to save baseline.');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest transition-colors rounded px-3 py-1.5 font-data-mono text-data-mono flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save className="text-[14px]" />
                  Save Baseline
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}