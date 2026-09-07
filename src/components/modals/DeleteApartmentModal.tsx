import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Building2, MapPin, Key, User, ShieldAlert, Check } from 'lucide-react';
import { Apartment } from '../../types';

interface DeleteApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentsToDelete: Apartment[];
  onConfirmDelete: (apartmentIds: string[], reason?: string) => void;
  t: Record<string, string>;
}

export const DeleteApartmentModal: React.FC<DeleteApartmentModalProps> = ({
  isOpen,
  onClose,
  apartmentsToDelete,
  onConfirmDelete,
  t,
}) => {
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || apartmentsToDelete.length === 0) return null;

  const isMultiple = apartmentsToDelete.length > 1;
  const singleApt = apartmentsToDelete[0];
  const hasActiveTenants = apartmentsToDelete.some((a) => a.status === 'rented' && a.tenantName);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onConfirmDelete(
        apartmentsToDelete.map((a) => a.id),
        deleteReason.trim() || undefined
      );
      setIsDeleting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      id="modal-delete-apartment"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isMultiple
                  ? `${t.deleteSelected} (${apartmentsToDelete.length} ${t.apartmentsCount})`
                  : `${t.deleteApartment} — ${singleApt.aptNumber}`}
              </h3>
              <p className="text-xs text-red-600 font-medium">
                {t.deleteWarning}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          {/* Active Tenant Warning */}
          {hasActiveTenants && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Active Tenant Warning</div>
                <p className="text-[11px] leading-relaxed text-amber-800 mt-0.5">
                  One or more selected units have active lease agreements registered. Proceeding will remove the property record and unlink assigned keys.
                </p>
              </div>
            </div>
          )}

          {/* Apartment preview */}
          {!isMultiple ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900 text-sm">{singleApt.aptNumber}</span>
                  <span className="text-slate-500 font-medium">({singleApt.building})</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    singleApt.status === 'rented'
                      ? 'bg-blue-100 text-blue-800'
                      : singleApt.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {singleApt.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400">City:</span> <strong className="text-slate-800">{singleApt.city}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Floor & Size:</span> <strong className="text-slate-800">Floor {singleApt.floor} ({singleApt.areaSqM} m²)</strong>
                </div>
                <div>
                  <span className="text-slate-400">Key Assigned:</span>{' '}
                  <strong className="text-blue-900 font-semibold">{singleApt.keyNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Rent:</span>{' '}
                  <strong className="text-slate-900">{singleApt.monthlyRentIQD.toLocaleString()} IQD</strong>
                </div>
              </div>

              {singleApt.tenantName && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Current Tenant:
                  </span>
                  <strong className="text-slate-900">{singleApt.tenantName} ({singleApt.tenantPhone})</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="font-semibold text-slate-700">
                You are deleting the following {apartmentsToDelete.length} apartments:
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pe-1">
                {apartmentsToDelete.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{apt.aptNumber}</span>{' '}
                      <span className="text-slate-500">• {apt.building} ({apt.city})</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {apt.monthlyRentIQD.toLocaleString()} IQD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional reason */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason for Deletion (Optional for audit log)
            </label>
            <input
              type="text"
              placeholder="e.g. Sold to private investor, Demolished for renovation, Duplicate entry..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-400 outline-hidden"
            />
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-slate-500 text-[11px] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400" />
            <span>
              This operation creates an audit entry in the immutable activity log with timestamp and authorized staff ID.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : t.confirmDelete}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
