import React, { useState } from 'react';
import { Key, Search, Filter, RotateCcw, Edit3, History, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { KeyItem, KeyStatus } from '../../types';

interface KeysViewProps {
  keys: KeyItem[];
  onKeyAction: (action: 'return' | 'edit' | 'apartment' | 'history', keyNumber: string) => void;
  t: Record<string, string>;
}

export const KeysView: React.FC<KeysViewProps> = ({ keys, onKeyAction, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = keys.filter((k) => {
    const matchesSearch =
      k.keyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.aptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.holderName && k.holderName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="view-keys-root" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.keys}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Physical key custody register and storage safe inventory
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
          <input
            type="text"
            placeholder="Search key (e.g. K-1001), apartment, holder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-xl ps-9 pe-3 py-2 border border-slate-200 focus:bg-white focus:border-blue-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-xs outline-hidden"
          >
            <option value="all">All Key Statuses</option>
            <option value="available">Available (In Storage)</option>
            <option value="taken">Taken (With Holders)</option>
            <option value="lost">Reported Lost</option>
          </select>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Key Number</th>
                <th className="px-5 py-3.5">Apartment & Building</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Copies (Storage / Total)</th>
                <th className="px-5 py-3.5">Current Holder</th>
                <th className="px-5 py-3.5">Handover Date</th>
                <th className="px-5 py-3.5 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-blue-950 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <span>{k.keyNumber}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{k.aptNumber}</div>
                    <div className="text-[11px] text-slate-400">{k.building}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        k.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700'
                          : k.status === 'taken'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          k.status === 'available'
                            ? 'bg-emerald-500'
                            : k.status === 'taken'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                      {k.status === 'available' && t.available}
                      {k.status === 'taken' && t.taken}
                      {k.status === 'lost' && t.lost}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">
                    {k.copiesInStorage} / {k.copiesTotal} sets in safe
                  </td>
                  <td className="px-5 py-3.5">
                    {k.holderName ? (
                      <div>
                        <div className="font-semibold text-slate-900">{k.holderName}</div>
                        <div className="text-[11px] text-slate-400">
                          {k.holderRole} • {k.holderPhone}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">None (In Storage Safe)</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {k.handoverDate || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <div className="flex items-center justify-end gap-1">
                      {k.status === 'taken' && (
                        <button
                          onClick={() => onKeyAction('return', k.keyNumber)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-semibold transition-colors"
                          title="Return Key"
                        >
                          {t.returnKey}
                        </button>
                      )}
                      <button
                        onClick={() => onKeyAction('edit', k.keyNumber)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                        title="Edit Info"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onKeyAction('history', k.keyNumber)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                        title="View Full History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
