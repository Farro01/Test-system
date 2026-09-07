import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, CheckCircle } from 'lucide-react';
import { Apartment, KeyItem, Tenant } from '../../types';

interface ExportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartments: Apartment[];
  keys: KeyItem[];
  tenants: Tenant[];
  t: Record<string, string>;
}

export const ExportExcelModal: React.FC<ExportExcelModalProps> = ({
  isOpen,
  onClose,
  apartments,
  keys,
  tenants,
  t,
}) => {
  const [selectedDataset, setSelectedDataset] = useState<'apartments' | 'keys' | 'tenants' | 'all'>('apartments');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const downloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `Emmar_Al_Shimal_${selectedDataset}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (selectedDataset === 'apartments' || selectedDataset === 'all') {
      csvContent += 'Apartment Number,Building,City,Floor,Rooms,Area (sqm),Status,Monthly Rent (IQD),Monthly Rent (USD),Tenant,Key No,Meter No\r\n';
      apartments.forEach((apt) => {
        csvContent += `"${apt.aptNumber}","${apt.building}","${apt.city}",${apt.floor},${apt.rooms},${apt.areaSqM},"${apt.status}",${apt.monthlyRentIQD},${apt.monthlyRentUSD},"${apt.tenantName || 'N/A'}","${apt.keyNumber}","${apt.electricityMeterNo}"\r\n`;
      });
    } else if (selectedDataset === 'keys') {
      csvContent += 'Key Number,Apartment,Building,City,Status,Total Copies,In Storage,Current Holder,Role,Holder Phone,Handover Date,Return Due\r\n';
      keys.forEach((k) => {
        csvContent += `"${k.keyNumber}","${k.aptNumber}","${k.building}","${k.city}","${k.status}",${k.copiesTotal},${k.copiesInStorage},"${k.holderName || 'None'}","${k.holderRole || 'N/A'}","${k.holderPhone || 'N/A'}","${k.handoverDate || 'N/A'}","${k.expectedReturnDate || 'N/A'}"\r\n`;
      });
    } else if (selectedDataset === 'tenants') {
      csvContent += 'Tenant Name,Phone,Email,National ID,Apartment,Building,City,Lease Start,Lease End,Monthly Rent (IQD),Payment Status,Deposit (IQD)\r\n';
      tenants.forEach((tn) => {
        csvContent += `"${tn.name}","${tn.phone}","${tn.email}","${tn.nationalId}","${tn.aptNumber}","${tn.building}","${tn.city}","${tn.leaseStart}","${tn.leaseEnd}",${tn.monthlyRentIQD},"${tn.paymentStatus}",${tn.depositIQD}\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="modal-export-excel"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0e2752] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">{t.exportToExcel}</h3>
              <p className="text-[11px] text-blue-200">CSV / Microsoft Excel Export Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs space-y-4">
          <p className="text-slate-600 leading-relaxed">
            Select the dataset you would like to export. The exported file will be fully formatted with columns, currency values, and keys for Excel reporting.
          </p>

          <div className="space-y-2">
            <label
              onClick={() => setSelectedDataset('apartments')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDataset === 'apartments'
                  ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-950'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="font-bold">Apartments Master Roster</div>
                <div className="text-[11px] text-slate-500">All 324 apartments, rent, meters & occupants</div>
              </div>
              <input
                type="radio"
                name="dataset"
                checked={selectedDataset === 'apartments'}
                onChange={() => setSelectedDataset('apartments')}
                className="text-blue-600"
              />
            </label>

            <label
              onClick={() => setSelectedDataset('keys')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDataset === 'keys'
                  ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-950'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="font-bold">Keys & Custody Register</div>
                <div className="text-[11px] text-slate-500">512 registered keys, holders & return due dates</div>
              </div>
              <input
                type="radio"
                name="dataset"
                checked={selectedDataset === 'keys'}
                onChange={() => setSelectedDataset('keys')}
                className="text-blue-600"
              />
            </label>

            <label
              onClick={() => setSelectedDataset('tenants')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDataset === 'tenants'
                  ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-950'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="font-bold">Tenants & Rental Income</div>
                <div className="text-[11px] text-slate-500">Contracts, monthly IQD/USD values & payment status</div>
              </div>
              <input
                type="radio"
                name="dataset"
                checked={selectedDataset === 'tenants'}
                onChange={() => setSelectedDataset('tenants')}
                className="text-blue-600"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={downloadCSV}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              {downloaded ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate .XLSX / .CSV</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
