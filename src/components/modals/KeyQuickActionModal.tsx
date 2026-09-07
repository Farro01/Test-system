import React, { useState } from 'react';
import { X, Key, Building2, User, Phone, Calendar, History, CheckCircle, ShieldAlert } from 'lucide-react';
import { KeyItem, Apartment, HandoverRecord } from '../../types';

interface KeyQuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'return' | 'edit' | 'apartment' | 'history' | null;
  keyItem?: KeyItem;
  apartment?: Apartment;
  historyLogs: HandoverRecord[];
  onReturnKey: (keyNumber: string, notes: string) => void;
  onUpdateKey: (updated: KeyItem) => void;
  t: Record<string, string>;
}

export const KeyQuickActionModal: React.FC<KeyQuickActionModalProps> = ({
  isOpen,
  onClose,
  actionType,
  keyItem,
  apartment,
  historyLogs,
  onReturnKey,
  onUpdateKey,
  t,
}) => {
  const [returnNote, setReturnNote] = useState('All keys inspected and safely returned to storage cabinet.');
  const [editHolderName, setEditHolderName] = useState(keyItem?.holderName || '');
  const [editHolderPhone, setEditHolderPhone] = useState(keyItem?.holderPhone || '');
  const [editNotes, setEditNotes] = useState(keyItem?.notes || '');
  const [editStatus, setEditStatus] = useState(keyItem?.status || 'available');

  if (!isOpen || !keyItem) return null;

  const filteredHistory = historyLogs.filter(
    (log) => log.keyNumber === keyItem.keyNumber || log.aptNumber === keyItem.aptNumber
  );

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReturnKey(keyItem.keyNumber, returnNote);
    onClose();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateKey({
      ...keyItem,
      holderName: editHolderName,
      holderPhone: editHolderPhone,
      notes: editNotes,
      status: editStatus,
      copiesInStorage: editStatus === 'available' ? keyItem.copiesTotal : keyItem.copiesInStorage,
    });
    onClose();
  };

  return (
    <div
      id="modal-key-quick-action"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="bg-[#0c234a] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/40 flex items-center justify-center">
              <Key className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {actionType === 'return' && `${t.returnKey} — ${keyItem.keyNumber}`}
                {actionType === 'edit' && `${t.editInformation} — ${keyItem.keyNumber}`}
                {actionType === 'apartment' && `${t.viewApartment} — ${apartment?.aptNumber || keyItem.aptNumber}`}
                {actionType === 'history' && `${t.viewFullHistory} — ${keyItem.keyNumber}`}
              </h3>
              <p className="text-[11px] text-blue-200">{keyItem.building} • Erbil/Mosul Branch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body depending on Action */}
        <div className="p-6 text-xs text-slate-700">
          {/* RETURN KEY FORM */}
          {actionType === 'return' && (
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2">
                <div className="font-bold text-blue-950 text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  Key {keyItem.keyNumber} Handover Status
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Current Holder: <strong className="text-slate-900">{keyItem.holderName || 'None'}</strong></div>
                  <div>Role: <strong className="text-slate-900">{keyItem.holderRole || 'N/A'}</strong></div>
                  <div>Phone: <strong className="text-slate-900">{keyItem.holderPhone || 'N/A'}</strong></div>
                  <div>Apartment: <strong className="text-slate-900">{keyItem.aptNumber}</strong></div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Return Condition & Notes</label>
                <textarea
                  rows={3}
                  required
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Confirming return will restore key custody to "Available in storage" and stamp the activity log.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#123971] hover:bg-[#0c264d] text-white rounded-lg font-bold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Return to Safe</span>
                </button>
              </div>
            </form>
          )}

          {/* EDIT INFORMATION FORM */}
          {actionType === 'edit' && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Key Number</label>
                  <input
                    type="text"
                    disabled
                    value={keyItem.keyNumber}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Key Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                  >
                    <option value="available">Available (In Storage)</option>
                    <option value="taken">Taken (With Holder)</option>
                    <option value="lost">Lost / Missing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Holder Name</label>
                  <input
                    type="text"
                    value={editHolderName}
                    onChange={(e) => setEditHolderName(e.target.value)}
                    placeholder="Full name or company"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Holder Phone</label>
                  <input
                    type="text"
                    value={editHolderPhone}
                    onChange={(e) => setEditHolderPhone(e.target.value)}
                    placeholder="+964 750 ..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Storage / Cabinet Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#123971] hover:bg-[#0c264d] text-white rounded-lg font-bold"
                >
                  {t.save} Changes
                </button>
              </div>
            </form>
          )}

          {/* VIEW APARTMENT DETAILS */}
          {actionType === 'apartment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">UNIT NUMBER</span>
                  <h4 className="text-xl font-black text-slate-900">{apartment?.aptNumber || keyItem.aptNumber}</h4>
                  <p className="text-xs text-slate-600 font-medium">{apartment?.building || keyItem.building}</p>
                </div>
                <div className="text-end">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      apartment?.status === 'rented'
                        ? 'bg-blue-100 text-blue-800'
                        : apartment?.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apartment?.status?.toUpperCase() || 'RENTED'}
                  </span>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {apartment ? `${(apartment.monthlyRentIQD).toLocaleString()} IQD/mo` : '1,450,000 IQD/mo'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 border border-slate-100 rounded-xl">
                <div>Floor: <strong>{apartment?.floor || 1}</strong></div>
                <div>Rooms: <strong>{apartment?.rooms || 3} Bedrooms</strong></div>
                <div>Area: <strong>{apartment?.areaSqM || 165} m²</strong></div>
                <div>City: <strong>{apartment?.city || keyItem.city}</strong></div>
                <div>Key Assigned: <strong>{keyItem.keyNumber}</strong></div>
                <div>Electricity Meter: <strong>{apartment?.electricityMeterNo || 'MTR-77291'}</strong></div>
              </div>

              {apartment?.tenantName && (
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <div className="text-[11px] font-bold text-blue-900 uppercase">Current Registered Tenant</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-slate-900">{apartment.tenantName}</span>
                    <span className="text-blue-700 font-medium">{apartment.tenantPhone}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium"
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}

          {/* VIEW FULL HISTORY */}
          {actionType === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800">
                  Custody Audit Trail ({filteredHistory.length} events)
                </span>
                <span className="text-[11px] text-slate-400">Key {keyItem.keyNumber}</span>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No previous checkout events logged for this key.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pe-1">
                  {filteredHistory.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-blue-700 capitalize flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          {item.action.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">{item.date}</span>
                      </div>
                      <div className="text-slate-800 font-medium">
                        Holder: {item.personName} ({item.personRole})
                      </div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        {item.note}
                      </div>
                      <div className="text-[10px] text-slate-400 pt-0.5">
                        Logged by: {item.staffName}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium"
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
