import React, { useState } from 'react';
import { Receipt, Wallet, TrendingUp, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Apartment, Tenant } from '../../types';

interface RentalsViewProps {
  apartments: Apartment[];
  tenants: Tenant[];
  t: Record<string, string>;
}

export const RentalsView: React.FC<RentalsViewProps> = ({ apartments, tenants, t }) => {
  const [selectedMonth, setSelectedMonth] = useState('September 2026');

  return (
    <div id="view-rentals-root" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.rentals}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Revenue collection ledger in Iraqi Dinar (IQD) and US Dollar ($)
          </p>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 shadow-xs outline-hidden"
        >
          <option value="September 2026">September 2026 (Current)</option>
          <option value="August 2026">August 2026</option>
          <option value="July 2026">July 2026</option>
        </select>
      </div>

      {/* Income Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Contracted Rent</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            284,500,000 <span className="text-xs font-bold text-slate-500">IQD</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">~ $214,000 USD (196 active units)</div>
        </div>

        <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Collected to Date</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">
            241,200,000 <span className="text-xs font-bold text-emerald-700">IQD</span>
          </div>
          <div className="text-xs text-emerald-700/80 mt-1">84.8% Collection Rate</div>
        </div>

        <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>Pending & Outstanding</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            43,300,000 <span className="text-xs font-bold text-amber-700">IQD</span>
          </div>
          <div className="text-xs text-amber-700/80 mt-1">Due within current cycle</div>
        </div>
      </div>

      {/* Rented Units Billing Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Monthly Invoicing Schedule</h3>
          <span className="text-xs text-slate-400">Currency Rate: 1 USD = 1,320 IQD</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Unit</th>
                <th className="px-5 py-3.5">Building</th>
                <th className="px-5 py-3.5">Tenant Name</th>
                <th className="px-5 py-3.5">Monthly Rent (IQD)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Payment Method</th>
                <th className="px-5 py-3.5 text-end">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{t.aptNumber}</td>
                  <td className="px-5 py-3.5 text-slate-600">{t.building}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{t.name}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {t.monthlyRentIQD.toLocaleString()} IQD
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.paymentStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">FastPay / Direct Transfer</td>
                  <td className="px-5 py-3.5 text-end">
                    <button
                      onClick={() => alert(`Receipt downloaded for ${t.name} - Apt ${t.aptNumber}`)}
                      className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
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
