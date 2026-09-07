import React from 'react';
import {
  LayoutGrid,
  Building2,
  Key,
  ClipboardCheck,
  Users,
  Receipt,
  Zap,
  KeyRound,
  Search,
  History,
  Bell,
  BarChart3,
  UserCog,
  Settings,
  DatabaseBackup,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  unreadNotificationsCount?: number;
  t: Record<string, string>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadNotificationsCount = 3,
  t,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as NavigationTab, label: t.dashboard, icon: LayoutGrid },
    { id: 'apartments' as NavigationTab, label: t.apartments, icon: Building2 },
    { id: 'keys' as NavigationTab, label: t.keys, icon: Key },
    { id: 'key-handover' as NavigationTab, label: t.keyHandover, icon: ClipboardCheck },
    { id: 'tenants' as NavigationTab, label: t.tenants, icon: Users },
    { id: 'rentals' as NavigationTab, label: t.rentals, icon: Receipt },
    { id: 'electricity-meters' as NavigationTab, label: t.electricityMeters, icon: Zap },
  ];

  const managementNavItems = [
    { id: 'key-search' as NavigationTab, label: t.keySearch, icon: KeyRound },
    { id: 'apartment-search' as NavigationTab, label: t.apartmentSearch, icon: Search },
    { id: 'activity-log' as NavigationTab, label: t.activityLog, icon: History },
    {
      id: 'notifications' as NavigationTab,
      label: t.notifications,
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    { id: 'reports-export' as NavigationTab, label: t.reportsExport, icon: BarChart3 },
  ];

  const systemNavItems = [
    { id: 'users' as NavigationTab, label: t.usersRoles, icon: UserCog },
    { id: 'settings' as NavigationTab, label: t.settings, icon: Settings },
    { id: 'backup' as NavigationTab, label: t.backupRestore, icon: DatabaseBackup },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 start-0 z-50 w-64 bg-[#0a1e3f] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#143260]/80 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#1d4ed8] to-[#0f2d59] border border-blue-400/30 flex items-center justify-center text-white shadow-inner">
            <svg
              className="w-6 h-6 text-blue-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              <circle cx="17" cy="12" r="2" strokeWidth="2" stroke="currentColor" fill="none" />
              <path d="M17 14v3l2 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight leading-tight">
              {t.brandName || 'Emmar al shimal'}
            </span>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* MAIN */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 tracking-wider">
              {t.main}
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1b4e9b] text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:bg-[#112d59] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* MANAGEMENT */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 tracking-wider">
              {t.management}
            </div>
            <nav className="space-y-1">
              {managementNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1b4e9b] text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:bg-[#112d59] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-[#f59e0b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SYSTEM */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 tracking-wider">
              {t.system}
            </div>
            <nav className="space-y-1">
              {systemNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1b4e9b] text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:bg-[#112d59] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Secure Session Card */}
        <div className="p-3 border-t border-[#143260]/80">
          <div
            id="sidebar-secure-session-card"
            className="bg-[#0f2952] border border-[#1d437e]/80 rounded-xl p-3 text-xs space-y-1.5 shadow-inner"
          >
            <div className="flex items-center gap-2 text-blue-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t.secureSession}</span>
            </div>
            <div className="text-[11px] text-slate-300">
              {t.lastBackup}: 2026-09-06 22:15
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.encryptedRbac}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
