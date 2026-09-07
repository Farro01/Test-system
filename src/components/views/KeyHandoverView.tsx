import React, { useState } from 'react';
import { ClipboardCheck, Key, User, Phone, CheckCircle, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { KeyItem, HandoverRecord } from '../../types';

interface KeyHandoverViewProps {
  keys: KeyItem[];
  handoverLogs: HandoverRecord[];
  onLogHandover: (record: HandoverRecord) => void;
  t: Record<string, string>;
}

export const KeyHandoverView: React.FC<KeyHandoverViewProps> = ({
  keys,
  handoverLogs,
  onLogHandover,
  t,
}) => {
  const [selectedKeyNumber, setSelectedKeyNumber] = useState(keys[0]?.keyNumber || 'K-1001');
  const [actionType, setActionType] = useState<'checkout' | 'return'>('checkout');
  const [personName, setPersonName] = useState('');
  const [personRole, setPersonRole] = useState('Maintenance');
  const [personPhone, setPersonPhone] = useState('+964 750 ');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedKey = keys.find((k) => k.keyNumber === selectedKeyNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    const newRecord: HandoverRecord = {
      id: `ho-${Date.now()}`,
      keyNumber: selectedKeyNumber,
      aptNumber: selectedKey?.aptNumber || 'A-101',
      action: actionType,
      personName: personName.trim(),
      personRole,
      personPhone: personPhone.trim(),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      staffName: 'Farro IT (Super Admin)',
      note: note.trim() || `${actionType === 'checkout' ? 'Key issued for custody' : 'Key returned to storage safe'}`,
    };

    onLogHandover(newRecord);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPersonName('');
      setNote('');
    }, 2000);
  };

  return (
    <div id="view-key-handover-root" className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.keyHandover}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official custody issuance and return transaction terminal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Handover Form */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">New Handover Transaction</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Transaction Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('checkout')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all ${
                    actionType === 'checkout'
                      ? 'bg-[#123971] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Issue Key (Checkout)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('return')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all ${
                    actionType === 'return'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Return Key to Safe
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Key Number *</label>
              <select
                value={selectedKeyNumber}
                onChange={(e) => setSelectedKeyNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800 outline-hidden"
              >
                {keys.map((k) => (
                  <option key={k.id} value={k.keyNumber}>
                    {k.keyNumber} — Apt {k.aptNumber} ({k.building}) [{k.status.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient / Holder Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sardar Mohammed (Air-con team)"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role / Affiliation</label>
                <select
                  value={personRole}
                  onChange={(e) => setPersonRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  <option value="Maintenance">Maintenance / Contractor</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Broker">Real Estate Broker</option>
                  <option value="Cleaning">Cleaning Staff</option>
                  <option value="Inspector">Safety Inspector</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={personPhone}
                  onChange={(e) => setPersonPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Purpose / Notes</label>
              <textarea
                rows={2}
                placeholder="Reason for key release, scheduled return time..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0e2752] hover:bg-[#081833] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Transaction Recorded!</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Submit Custody Record</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Handover Logs Stream */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Custody Logs ({handoverLogs.length})</h3>
            <span className="text-[11px] text-slate-400">Live system audit</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pe-1">
            {handoverLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-extrabold ${
                        log.action === 'checkout'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'return'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-slate-900">{log.keyNumber} (Apt {log.aptNumber})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">{log.date}</span>
                </div>

                <div className="text-slate-700">
                  Recipient: <strong className="text-slate-900">{log.personName}</strong> • {log.personRole} ({log.personPhone})
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/60">
                  {log.note}
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>Authorizing Agent: {log.staffName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
