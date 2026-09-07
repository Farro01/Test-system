import React, { useState } from 'react';
import { X, Printer, Building2, MapPin, Key, User, Phone, Zap, ShieldCheck, QrCode, CheckSquare, Calendar, FileText } from 'lucide-react';
import { Apartment } from '../../types';

interface PrintApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment?: Apartment | null;
  apartmentsList?: Apartment[];
  mode?: 'single' | 'inventory';
  t: Record<string, string>;
}

export const PrintApartmentModal: React.FC<PrintApartmentModalProps> = ({
  isOpen,
  onClose,
  apartment,
  apartmentsList = [],
  mode = 'single',
  t,
}) => {
  const [activeMode, setActiveMode] = useState<'single' | 'inventory'>(mode);
  const [includeChecklist, setIncludeChecklist] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [includeFinancials, setIncludeFinancials] = useState(true);

  if (!isOpen) return null;

  const currentApt = apartment || apartmentsList[0];
  const printItems = apartmentsList.length > 0 ? apartmentsList : currentApt ? [currentApt] : [];

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const totalRentIQD = printItems.reduce((sum, a) => sum + (a.monthlyRentIQD || 0), 0);
  const totalRentUSD = printItems.reduce((sum, a) => sum + (a.monthlyRentUSD || 0), 0);
  const rentedCount = printItems.filter((a) => a.status === 'rented').length;
  const availableCount = printItems.filter((a) => a.status === 'available').length;

  return (
    <div
      id="modal-print-apartment"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#0a2347] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center">
              <Printer className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {t.printPreview} — {activeMode === 'single' ? `Unit ${currentApt?.aptNumber || ''}` : t.printInventory}
              </h3>
              <p className="text-[11px] text-blue-200">
                Emmar al shimal Real Estate Co. • Erbil / Mosul Complexes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle mode if multiple apartments are available */}
            {apartmentsList.length > 1 && (
              <div className="bg-white/10 p-1 rounded-xl flex items-center text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMode('single')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeMode === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-blue-100'
                  }`}
                >
                  Unit Voucher
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('inventory')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeMode === 'inventory' ? 'bg-white text-slate-900 shadow-xs' : 'text-blue-100'
                  }`}
                >
                  Inventory List ({printItems.length})
                </button>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printDocument}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Toolbar (Hidden on print) */}
        <div className="no-print bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 shrink-0 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-slate-700">Print Options:</span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeFinancials}
                onChange={(e) => setIncludeFinancials(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Financial Values</span>
            </label>
            {activeMode === 'single' && (
              <>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeChecklist}
                    onChange={(e) => setIncludeChecklist(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Inspection Checklist</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSignatures}
                    onChange={(e) => setIncludeSignatures(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Signatures & Stamp Box</span>
                </label>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Formatted for standard A4 / Letter paper
          </span>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 flex justify-center">
          <div
            id="printable-voucher-document"
            className="bg-white border border-slate-300/80 shadow-md p-8 sm:p-10 max-w-3xl w-full text-slate-900 font-sans"
            style={{ minHeight: '1050px' }}
          >
            {/* DOCUMENT HEADER */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                    Emmar al shimal Real Estate Co.
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    شركەى ئیماری باکوور • شركة إعمار الشمال العقارية
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Erbil HQ: Dream City Commercial Center | Mosul Branch: Al-Zuhour District
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
                    OFFICIAL RECORD
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1">
                    Date: {currentDate}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    REF: EAS-{activeMode === 'single' ? currentApt?.aptNumber : 'INV'}-{new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </div>

            {/* MODE 1: SINGLE APARTMENT VOUCHER */}
            {activeMode === 'single' && currentApt && (
              <div className="space-y-6">
                <div className="text-center pb-2">
                  <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
                    Property Specification & Custody Voucher
                  </h2>
                  <p className="text-xs text-slate-500">
                    Unit Registration & Physical Custody Certification
                  </p>
                </div>

                {/* Main Specs Grid */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-800 uppercase tracking-wide border-b border-slate-300">
                    1. Unit Identification & Technical Specifications
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-200 text-xs">
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Apartment Unit</span>
                      <strong className="text-base font-black text-slate-900">{currentApt.aptNumber}</strong>
                    </div>
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Complex / Building</span>
                      <strong className="text-sm font-bold text-slate-800">{currentApt.building}</strong>
                    </div>
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">City Branch</span>
                      <strong className="text-sm font-bold text-slate-800">{currentApt.city}, Iraq</strong>
                    </div>
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Floor Level</span>
                      <span className="font-semibold text-slate-800">Floor {currentApt.floor}</span>
                    </div>
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Layout / Rooms</span>
                      <span className="font-semibold text-slate-800">{currentApt.rooms} Bedrooms + Living + Kitchen</span>
                    </div>
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Total Area</span>
                      <span className="font-semibold text-slate-800">{currentApt.areaSqM} m²</span>
                    </div>
                  </div>
                </div>

                {/* Key Custody & Utilities */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-800 uppercase tracking-wide border-b border-slate-300">
                    2. Custody & Utility Meter Information
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-200 text-xs">
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Physical Key No.</span>
                      <strong className="text-sm font-bold text-blue-900">{currentApt.keyNumber}</strong>
                    </div>
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Key Copies</span>
                      <span className="font-semibold text-slate-800">3 Sets (1 Master + 2 Tenant)</span>
                    </div>
                    <div className="p-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Electricity Meter No.</span>
                      <strong className="text-sm font-bold text-slate-800">{currentApt.electricityMeterNo}</strong>
                    </div>
                    <div className="p-3 col-span-2 sm:col-span-3">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Custody Safe Location</span>
                      <span className="text-slate-700">Storage Cabinet Central Vault A-04 • Verified with RFID tag</span>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                {includeFinancials && (
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-800 uppercase tracking-wide border-b border-slate-300">
                      3. Financial & Rental Ledger
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-200 text-xs">
                      <div className="p-3">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">Monthly Rent (IQD)</span>
                        <strong className="text-sm font-bold text-slate-900">
                          {currentApt.monthlyRentIQD.toLocaleString()} IQD
                        </strong>
                      </div>
                      <div className="p-3">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">USD Equivalent</span>
                        <strong className="text-sm font-bold text-slate-900">
                          ${currentApt.monthlyRentUSD.toLocaleString()} USD
                        </strong>
                      </div>
                      <div className="p-3">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">Current Status</span>
                        <span className="font-bold uppercase text-slate-900">{currentApt.status}</span>
                      </div>
                      {currentApt.tenantName && (
                        <>
                          <div className="p-3 col-span-2">
                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Leaseholder / Tenant</span>
                            <strong className="text-sm font-bold text-slate-900">{currentApt.tenantName}</strong>
                          </div>
                          <div className="p-3">
                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Contact Phone</span>
                            <span className="font-semibold text-slate-800">{currentApt.tenantPhone}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Handover / Inspection Checklist */}
                {includeChecklist && (
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-800 uppercase tracking-wide border-b border-slate-300">
                      4. Custody & Handover Inspection Checklist
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs flex items-center justify-center font-bold text-[10px]">✓</div>
                        <span>Door locks, cylinders & physical keys functioning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs flex items-center justify-center font-bold text-[10px]">✓</div>
                        <span>Main circuit breaker & sub-meter verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs flex items-center justify-center font-bold text-[10px]">✓</div>
                        <span>Sanitary water plumbing & valves inspected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs flex items-center justify-center font-bold text-[10px]">✓</div>
                        <span>Air conditioning split units in working order</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signatures and Stamps */}
                {includeSignatures && (
                  <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
                    <div className="space-y-12">
                      <div className="font-bold text-slate-800 uppercase text-[11px]">Property Officer</div>
                      <div className="border-b border-slate-400 pb-1 font-semibold text-slate-600">
                        Farro IT (Super Admin)
                      </div>
                      <div className="text-[10px] text-slate-400">Signature & Date</div>
                    </div>

                    <div className="space-y-12">
                      <div className="font-bold text-slate-800 uppercase text-[11px]">Authorized Tenant / Custodian</div>
                      <div className="border-b border-slate-400 pb-1 font-semibold text-slate-600">
                        {currentApt.tenantName || 'Pending Leaseholder'}
                      </div>
                      <div className="text-[10px] text-slate-400">Signature & Date</div>
                    </div>

                    <div className="space-y-3 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 border-2 border-dashed border-slate-400 rounded-full flex flex-col items-center justify-center p-1 text-slate-400">
                        <span className="text-[9px] font-bold uppercase">Official Stamp</span>
                        <span className="text-[8px]">EMMAR AL SHIMAL</span>
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                        Company Seal
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: INVENTORY AUDIT TABLE */}
            {activeMode === 'inventory' && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
                    Apartments Inventory Audit Report
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive property registry across Erbil and Mosul complexes
                  </p>
                </div>

                {/* KPI Summary Strip */}
                <div className="grid grid-cols-4 gap-3 p-3 bg-slate-100 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Listed Units</span>
                    <strong className="block text-base font-black text-slate-900">{printItems.length} Units</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Occupied / Rented</span>
                    <strong className="block text-base font-bold text-blue-900">{rentedCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Available / Vacant</span>
                    <strong className="block text-base font-bold text-emerald-700">{availableCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Monthly Rent</span>
                    <strong className="block text-sm font-bold text-slate-900">{totalRentIQD.toLocaleString()} IQD</strong>
                    <span className="text-[10px] text-slate-500">~ ${totalRentUSD.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold text-[11px] uppercase border-b border-slate-300">
                      <th className="border border-slate-300 p-2 text-start">Unit</th>
                      <th className="border border-slate-300 p-2 text-start">Building & City</th>
                      <th className="border border-slate-300 p-2 text-start">Specs</th>
                      <th className="border border-slate-300 p-2 text-start">Status</th>
                      <th className="border border-slate-300 p-2 text-start">Rent (IQD)</th>
                      <th className="border border-slate-300 p-2 text-start">Key / Meter</th>
                      <th className="border border-slate-300 p-2 text-start">Tenant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printItems.map((apt) => (
                      <tr key={apt.id} className="border-b border-slate-200">
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">{apt.aptNumber}</td>
                        <td className="border border-slate-300 p-2">
                          <div className="font-semibold text-slate-800">{apt.building}</div>
                          <div className="text-[10px] text-slate-500">{apt.city}</div>
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-600">
                          Fl. {apt.floor} • {apt.rooms}R ({apt.areaSqM} m²)
                        </td>
                        <td className="border border-slate-300 p-2">
                          <span className="font-bold text-[11px] uppercase text-slate-800">{apt.status}</span>
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">
                          {apt.monthlyRentIQD.toLocaleString()}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          <span className="font-semibold">{apt.keyNumber}</span>
                          <span className="block text-[10px] text-slate-400">{apt.electricityMeterNo}</span>
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {apt.tenantName ? (
                            <div>
                              <div className="font-semibold text-slate-900">{apt.tenantName}</div>
                              <div className="text-[10px] text-slate-500">{apt.tenantPhone}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Vacant</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer Signatures */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                  <div className="space-y-10">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">Prepared by Staff</div>
                    <div className="border-b border-slate-400 pb-1 font-semibold text-slate-600">Farro IT (Super Admin)</div>
                    <div className="text-[10px] text-slate-400">Signature & Date</div>
                  </div>
                  <div className="space-y-10">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">General Manager Authorization</div>
                    <div className="border-b border-slate-400 pb-1 font-semibold text-slate-600">Emmar al shimal Operations</div>
                    <div className="text-[10px] text-slate-400">Signature & Seal</div>
                  </div>
                </div>
              </div>
            )}

            {/* Document Bottom Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span>Emmar al shimal ERP System • Certified Property Registry</span>
              <span>Generated on {currentDate}</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
