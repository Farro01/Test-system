import React, { useState } from 'react';
import { Settings, Shield, Globe, Database, Save, Check } from 'lucide-react';

interface SettingsViewProps {
  t: Record<string, string>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ t }) => {
  const [exchangeRate, setExchangeRate] = useState(1320);
  const [companyName, setCompanyName] = useState('Emmar al shimal Real Estate Co.');
  const [branches, setBranches] = useState('Erbil (Dream City HQ), Mosul (Al-Zuhour Office)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="view-settings-root" className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.settings}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          System parameters, currency pegs, branches & access permissions
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              General Enterprise Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Active Branches</label>
                <input
                  type="text"
                  value={branches}
                  onChange={(e) => setBranches(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">USD to IQD Exchange Rate (1 USD = ? IQD)</label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Security & Access Control
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
              <div className="font-semibold text-slate-900">Multi-Factor Authentication & Role Guards</div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Active session protected with TLS 1.3 encryption. Key checkout authorizations require two-person supervisor signoff.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0e2752] hover:bg-[#081833] text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Settings Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
