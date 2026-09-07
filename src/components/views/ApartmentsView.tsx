import React, { useState } from 'react';
import { Building2, Search, Filter, Plus, Home, MapPin, Eye, Key } from 'lucide-react';
import { Apartment, City, ApartmentStatus } from '../../types';

interface ApartmentsViewProps {
  apartments: Apartment[];
  onOpenRegisterModal: () => void;
  onSelectApartment: (apt: Apartment) => void;
  t: Record<string, string>;
}

export const ApartmentsView: React.FC<ApartmentsViewProps> = ({
  apartments,
  onOpenRegisterModal,
  onSelectApartment,
  t,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filtered = apartments.filter((apt) => {
    const matchesSearch =
      apt.aptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.tenantName && apt.tenantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      apt.keyNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'all' || apt.city === selectedCity;
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;

    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div id="view-apartments-root" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.apartments}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete inventory of apartments across Erbil and Mosul complexes
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0e2d5c] hover:bg-[#091f42] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.registerNewApartment}</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
          <input
            type="text"
            placeholder="Search apartment, building, tenant, key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-xl ps-9 pe-3 py-2 border border-slate-200 focus:bg-white focus:border-blue-500 outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* City filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium outline-hidden"
            >
              <option value="all">All Cities (Erbil & Mosul)</option>
              <option value="Erbil">Erbil</option>
              <option value="Mosul">Mosul</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="rented">Rented</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Apartments Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Apartment</th>
                <th className="px-5 py-3.5">Building & City</th>
                <th className="px-5 py-3.5">Floor / Rooms</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Monthly Rent</th>
                <th className="px-5 py-3.5">Current Tenant</th>
                <th className="px-5 py-3.5">Key / Meter</th>
                <th className="px-5 py-3.5 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 text-sm">
                    {apt.aptNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">{apt.building}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {apt.city}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    Floor {apt.floor} • {apt.rooms} Rooms ({apt.areaSqM} m²)
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        apt.status === 'rented'
                          ? 'bg-blue-100 text-blue-800'
                          : apt.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'reserved'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apt.status === 'rented' && 'Rented'}
                      {apt.status === 'available' && 'Available'}
                      {apt.status === 'reserved' && 'Reserved'}
                      {apt.status === 'maintenance' && 'Maintenance'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">
                      {apt.monthlyRentIQD.toLocaleString()} IQD
                    </div>
                    <div className="text-[11px] text-slate-400">~ ${apt.monthlyRentUSD} USD</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {apt.tenantName ? (
                      <div>
                        <div className="font-medium text-slate-900">{apt.tenantName}</div>
                        <div className="text-[11px] text-slate-400">{apt.tenantPhone}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No tenant assigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    <div className="flex items-center gap-1 font-semibold text-blue-900">
                      <Key className="w-3 h-3 text-blue-600" />
                      {apt.keyNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">{apt.electricityMeterNo}</div>
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <button
                      onClick={() => onSelectApartment(apt)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
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
