import React, { useState } from 'react';
import { Users, Search, Phone, Mail, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Tenant } from '../../types';

interface TenantsViewProps {
  tenants: Tenant[];
  t: Record<string, string>;
}

export const TenantsView: React.FC<TenantsViewProps> = ({ tenants, t }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tenants.filter(
    (ten) =>
      ten.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ten.aptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ten.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ten.phone.includes(searchTerm)
  );

  return (
    <div id="view-tenants-root" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.tenants}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered active leaseholders and contract contacts
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
          <input
            type="text"
            placeholder="Search tenant by name, phone, apartment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-xl ps-9 pe-3 py-2 border border-slate-200 focus:bg-white focus:border-blue-500 outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tenant) => (
          <div
            key={tenant.id}
            className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">
                    {tenant.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{tenant.name}</h3>
                    <p className="text-[11px] text-slate-400">{tenant.nationalId}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    tenant.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-700'
                      : tenant.paymentStatus === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {tenant.paymentStatus.toUpperCase()}
                </span>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Unit:</span>
                  <strong className="text-slate-900 font-semibold">{tenant.aptNumber} ({tenant.building})</strong>
                </div>
                <div className="flex justify-between">
                  <span>City:</span>
                  <span className="text-slate-800">{tenant.city}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rent:</span>
                  <strong className="text-slate-900">{tenant.monthlyRentIQD.toLocaleString()} IQD</strong>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span className="text-slate-800">{tenant.depositIQD.toLocaleString()} IQD</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{tenant.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Lease: {tenant.leaseStart} to {tenant.leaseEnd}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
