import React, { useState } from 'react';
import {
  Building2,
  DoorOpen,
  Users,
  Wallet,
  Calendar,
  Wrench,
  Key,
  Download,
  Plus,
  Search,
  RotateCcw,
  Edit3,
  Home,
  History,
  TrendingUp,
} from 'lucide-react';
import { Apartment, KeyItem, HandoverRecord } from '../types';
import { ApartmentStatusDonut } from './charts/ApartmentStatusDonut';
import { KeyStatusBarChart } from './charts/KeyStatusBarChart';

interface DashboardViewProps {
  apartments: Apartment[];
  keys: KeyItem[];
  handoverLogs: HandoverRecord[];
  buildings: { name: string; city: string; units: number }[];
  onOpenRegisterModal: () => void;
  onOpenExportModal: () => void;
  onKeyAction: (action: 'return' | 'edit' | 'apartment' | 'history', keyNumber: string) => void;
  t: Record<string, string>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  apartments,
  keys,
  handoverLogs,
  buildings,
  onOpenRegisterModal,
  onOpenExportModal,
  onKeyAction,
  t,
}) => {
  const [quickSearchKey, setQuickSearchKey] = useState('K-1001');
  const [apartmentTimeFilter, setApartmentTimeFilter] = useState('this_month');
  const [keyBuildingFilter, setKeyBuildingFilter] = useState('all');

  // Stats calculation
  const totalApartments = 324; // Standardized baseline reflecting the screenshot
  const rentedApartments = 196;
  const availableApartments = 84;
  const reservedApartments = 22;
  const maintenanceApartments = 22;

  const totalKeys = 512;
  const availableKeys = 438;
  const takenKeys = 68;
  const returned30dKeys = 54;
  const lostKeys = 6;

  const monthlyIncomeIQD = '284,500,000';
  const monthlyIncomeUSD = '$214,000';
  const collectedIQD = '241,200,000';
  const pendingIQD = '43,300,000';

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchKey.trim()) {
      onKeyAction('apartment', quickSearchKey.trim().toUpperCase());
    }
  };

  return (
    <div id="dashboard-view-root" className="space-y-6">
      {/* 1. Dashboard Header Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.dashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-export-excel"
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t.exportToExcel}</span>
          </button>

          <button
            id="btn-register-apartment"
            onClick={onOpenRegisterModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0e2d5c] hover:bg-[#091f42] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.registerNewApartment}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Total Apartments */}
        <div
          id="kpi-total-apartments"
          className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              4.2%
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t.totalApartments}</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {totalApartments}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {t.acrossBuildings}
          </div>
        </div>

        {/* Available Apartments */}
        <div
          id="kpi-available-apartments"
          className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <DoorOpen className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white tracking-wide">
              {t.live}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t.availableApartments}</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {availableApartments}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {t.readyForRent}
          </div>
        </div>

        {/* Rented Apartments */}
        <div
          id="kpi-rented-apartments"
          className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t.rentedApartments}</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {rentedApartments}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {t.activeContracts}
          </div>
        </div>

        {/* Monthly Rental Income */}
        <div
          id="kpi-monthly-income"
          className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
              <TrendingUp className="w-3 h-3" />
              6.1%
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">{t.monthlyRentalIncome}</div>
            <div className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-0.5">
              {monthlyIncomeIQD} <span className="text-sm font-bold text-slate-600">IQD</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              ~ {monthlyIncomeUSD} USD
            </div>
          </div>

          {/* Progress / Status Indicators */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>{t.collectedThisMonth}: <strong className="text-slate-800">{collectedIQD} IQD</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">•</span>
              <span>{t.pending}: <strong className="text-slate-800">{pendingIQD} IQD</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Second Row Compact Metrics (6 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Reserved */}
        <div id="stat-reserved" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">{t.reserved}</span>
            <div className="text-cyan-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{reservedApartments}</div>
          <div className="text-[11px] text-slate-400">{t.apartmentsCount}</div>
        </div>

        {/* Under Maintenance */}
        <div id="stat-maintenance" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">{t.underMaintenance}</span>
            <div className="text-amber-500">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{maintenanceApartments}</div>
          <div className="text-[11px] text-slate-400">{t.apartmentsCount}</div>
        </div>

        {/* Total Keys */}
        <div id="stat-total-keys" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">{t.totalKeys}</span>
            <div className="text-slate-400">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalKeys}</div>
          <div className="text-[11px] text-slate-400">{t.registeredKeys}</div>
        </div>

        {/* Available Keys */}
        <div id="stat-available-keys" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">{t.availableKeys}</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{availableKeys}</div>
          <div className="text-[11px] text-slate-400">{t.inStorage}</div>
        </div>

        {/* Taken Keys */}
        <div id="stat-taken-keys" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">{t.takenKeys}</span>
            <span className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{takenKeys}</div>
          <div className="text-[11px] text-slate-400">{t.withHolders}</div>
        </div>

        {/* Lost Keys */}
        <div id="stat-lost-keys" className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">{t.lostKeys}</span>
            <span className="w-3 h-3 rounded-full bg-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{lostKeys}</div>
          <div className="text-[11px] text-slate-400">{t.reportedLost}</div>
        </div>
      </div>

      {/* 4. Row 3: Apartment Status Donut & Key Status Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Apartment Status Donut Chart */}
        <ApartmentStatusDonut
          rented={rentedApartments}
          available={availableApartments}
          reserved={reservedApartments}
          maintenance={maintenanceApartments}
          timeFilter={apartmentTimeFilter}
          setTimeFilter={setApartmentTimeFilter}
          labels={{
            title: t.apartmentStatus,
            thisMonth: t.thisMonth,
            lastMonth: t.lastMonth,
            thisYear: t.thisYear,
            totalApartments: t.totalApartments,
            rented: t.rented,
            available: t.available,
            reserved: t.reserved,
            underMaintenance: t.underMaintenance,
          }}
        />

        {/* Key Status Horizontal Bar Chart */}
        <KeyStatusBarChart
          available={availableKeys}
          taken={takenKeys}
          returned30d={returned30dKeys}
          lost={lostKeys}
          totalTracked={totalKeys}
          buildingFilter={keyBuildingFilter}
          setBuildingFilter={setKeyBuildingFilter}
          buildings={buildings}
          labels={{
            title: t.keyStatus,
            allBuildings: t.allBuildings,
            totalKeysTracked: t.totalKeysTracked,
            available: t.available,
            taken: t.taken,
            returned30d: t.returned30d,
            lost: t.lost,
          }}
        />
      </div>

      {/* 5. Row 4: Key Search — Quick Lookup Panel (Bottom) */}
      <div
        id="card-key-quick-lookup"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4"
      >
        {/* Header with Key Icon */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#123971]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.keySearchQuickLookup}
            </h3>
            <p className="text-xs text-slate-500">
              {t.keySearchDesc}
            </p>
          </div>
        </div>

        {/* Input & Action Buttons Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 pt-1">
          {/* Search Input Box */}
          <form onSubmit={handleQuickSearchSubmit} className="flex-1 max-w-xl">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.enterKeyNumber}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
                <input
                  id="input-quick-key-number"
                  type="text"
                  value={quickSearchKey}
                  onChange={(e) => setQuickSearchKey(e.target.value)}
                  placeholder="e.g. K-1001"
                  className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 rounded-xl ps-10 pe-4 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                />
              </div>
              <button
                type="submit"
                id="btn-quick-key-search"
                className="px-5 py-2.5 bg-[#0e2752] hover:bg-[#081833] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{t.search}</span>
              </button>
            </div>
          </form>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            <button
              id="btn-action-return-key"
              onClick={() => onKeyAction('return', quickSearchKey)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0e2752] hover:bg-[#081833] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.returnKey}</span>
            </button>

            <button
              id="btn-action-edit-key"
              onClick={() => onKeyAction('edit', quickSearchKey)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.editInformation}</span>
            </button>

            <button
              id="btn-action-view-apartment"
              onClick={() => onKeyAction('apartment', quickSearchKey)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.viewApartment}</span>
            </button>

            <button
              id="btn-action-view-history"
              onClick={() => onKeyAction('history', quickSearchKey)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.viewFullHistory}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
