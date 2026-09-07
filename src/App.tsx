import React, { useState, useEffect } from 'react';
import {
  Language,
  NavigationTab,
  Apartment,
  KeyItem,
  Tenant,
  HandoverRecord,
  ElectricityMeter,
  NotificationItem,
} from './types';
import {
  INITIAL_APARTMENTS,
  INITIAL_KEYS,
  INITIAL_BUILDINGS,
  INITIAL_HANDOVERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TENANTS,
  INITIAL_METERS,
} from './data/mockData';
import { translations } from './utils/translations';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ApartmentsView } from './components/views/ApartmentsView';
import { KeysView } from './components/views/KeysView';
import { KeyHandoverView } from './components/views/KeyHandoverView';
import { TenantsView } from './components/views/TenantsView';
import { RentalsView } from './components/views/RentalsView';
import { ElectricityMetersView } from './components/views/ElectricityMetersView';
import { ActivityLogView } from './components/views/ActivityLogView';
import { SettingsView } from './components/views/SettingsView';
import { RegisterApartmentModal } from './components/modals/RegisterApartmentModal';
import { KeyQuickActionModal } from './components/modals/KeyQuickActionModal';
import { ExportExcelModal } from './components/modals/ExportExcelModal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State collections
  const [apartments, setApartments] = useState<Apartment[]>(INITIAL_APARTMENTS);
  const [keys, setKeys] = useState<KeyItem[]>(INITIAL_KEYS);
  const [handoverLogs, setHandoverLogs] = useState<HandoverRecord[]>(INITIAL_HANDOVERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [tenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [meters] = useState<ElectricityMeter[]>(INITIAL_METERS);

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [keyActionState, setKeyActionState] = useState<{
    isOpen: boolean;
    actionType: 'return' | 'edit' | 'apartment' | 'history' | null;
    keyNumber: string;
  }>({
    isOpen: false,
    actionType: null,
    keyNumber: 'K-1001',
  });

  const t = translations[language];

  // Sync RTL/LTR with selected language
  useEffect(() => {
    const dir = language === 'ku' || language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  // Handler to register apartment
  const handleAddApartment = (newApt: Apartment) => {
    setApartments((prev) => [newApt, ...prev]);

    // Also register the corresponding key in keys inventory if not already present
    setKeys((prev) => {
      const existing = prev.find((k) => k.keyNumber === newApt.keyNumber);
      if (existing) return prev;
      const newKey: KeyItem = {
        id: `key-${Date.now()}`,
        keyNumber: newApt.keyNumber,
        aptNumber: newApt.aptNumber,
        building: newApt.building,
        city: newApt.city,
        status: newApt.status === 'rented' ? 'taken' : 'available',
        copiesTotal: 3,
        copiesInStorage: newApt.status === 'rented' ? 2 : 3,
        holderName: newApt.tenantName,
        holderPhone: newApt.tenantPhone,
        notes: `Registered with ${newApt.aptNumber}`,
        lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      return [newKey, ...prev];
    });

    // Notify user
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Apartment Registered',
        message: `Apartment ${newApt.aptNumber} (${newApt.building}) was successfully registered into inventory.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
        relatedApt: newApt.aptNumber,
      },
      ...prev,
    ]);
  };

  // Handler to trigger quick action on key
  const handleKeyAction = (action: 'return' | 'edit' | 'apartment' | 'history', keyNumber: string) => {
    setKeyActionState({
      isOpen: true,
      actionType: action,
      keyNumber: keyNumber || 'K-1001',
    });
  };

  // Handler to return key
  const handleReturnKey = (keyNumber: string, notes: string) => {
    setKeys((prev) =>
      prev.map((k) => {
        if (k.keyNumber === keyNumber) {
          return {
            ...k,
            status: 'available',
            copiesInStorage: k.copiesTotal,
            holderName: undefined,
            holderRole: undefined,
            holderPhone: undefined,
            notes: notes || k.notes,
            lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return k;
      })
    );

    const targetKey = keys.find((k) => k.keyNumber === keyNumber);
    const newLog: HandoverRecord = {
      id: `ho-${Date.now()}`,
      keyNumber,
      aptNumber: targetKey?.aptNumber || 'A-101',
      action: 'return',
      personName: targetKey?.holderName || 'Previous Holder',
      personRole: targetKey?.holderRole || 'Tenant',
      personPhone: targetKey?.holderPhone || '',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      staffName: 'Farro IT (Super Admin)',
      note: notes || 'Key returned to storage safe.',
    };
    setHandoverLogs((prev) => [newLog, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Key ${keyNumber} Returned`,
        message: `Key ${keyNumber} for Apt ${targetKey?.aptNumber || 'A-101'} has been secured in the storage safe.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
        relatedKey: keyNumber,
      },
      ...prev,
    ]);
  };

  // Handler to update key info
  const handleUpdateKey = (updated: KeyItem) => {
    setKeys((prev) => prev.map((k) => (k.id === updated.id ? updated : k)));
  };

  // Handler to log new handover from handover terminal
  const handleLogHandover = (record: HandoverRecord) => {
    setHandoverLogs((prev) => [record, ...prev]);

    setKeys((prev) =>
      prev.map((k) => {
        if (k.keyNumber === record.keyNumber) {
          if (record.action === 'checkout') {
            return {
              ...k,
              status: 'taken',
              holderName: record.personName,
              holderRole: record.personRole as any,
              holderPhone: record.personPhone,
              handoverDate: record.date.slice(0, 10),
              notes: record.note,
              copiesInStorage: Math.max(0, k.copiesInStorage - 1),
            };
          } else if (record.action === 'return') {
            return {
              ...k,
              status: 'available',
              holderName: undefined,
              holderRole: undefined,
              holderPhone: undefined,
              notes: record.note,
              copiesInStorage: k.copiesTotal,
            };
          }
        }
        return k;
      })
    );
  };

  // Lookup current target key & apartment for modals
  const activeModalKey =
    keys.find((k) => k.keyNumber.toUpperCase() === keyActionState.keyNumber.toUpperCase()) ||
    keys[0];
  const activeModalApt =
    apartments.find((a) => a.keyNumber === activeModalKey?.keyNumber || a.aptNumber === activeModalKey?.aptNumber) ||
    apartments[0];

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col text-slate-800">
      {/* 1. Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotificationsCount={3}
        t={t}
        isMobileOpen={mobileSidebarOpen}
        setIsMobileOpen={setMobileSidebarOpen}
      />

      {/* 2. Main Wrapper with margin matching Sidebar width */}
      <div className="lg:ms-64 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          currentLanguage={language}
          setLanguage={setLanguage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          notifications={notifications}
          t={t}
          onSelectKeyQuick={(keyNo) => {
            handleKeyAction('apartment', keyNo);
          }}
          onSelectAptQuick={() => {
            setActiveTab('apartments');
          }}
        />

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <DashboardView
              apartments={apartments}
              keys={keys}
              handoverLogs={handoverLogs}
              buildings={INITIAL_BUILDINGS}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onKeyAction={handleKeyAction}
              t={t}
            />
          )}

          {/* Apartments Tab */}
          {activeTab === 'apartments' && (
            <ApartmentsView
              apartments={apartments}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onSelectApartment={(apt) => {
                handleKeyAction('apartment', apt.keyNumber);
              }}
              t={t}
            />
          )}

          {/* Keys Tab */}
          {activeTab === 'keys' && (
            <KeysView keys={keys} onKeyAction={handleKeyAction} t={t} />
          )}

          {/* Key Handover Tab */}
          {activeTab === 'key-handover' && (
            <KeyHandoverView
              keys={keys}
              handoverLogs={handoverLogs}
              onLogHandover={handleLogHandover}
              t={t}
            />
          )}

          {/* Tenants Tab */}
          {activeTab === 'tenants' && <TenantsView tenants={tenants} t={t} />}

          {/* Rentals Tab */}
          {activeTab === 'rentals' && (
            <RentalsView apartments={apartments} tenants={tenants} t={t} />
          )}

          {/* Electricity Meters Tab */}
          {activeTab === 'electricity-meters' && (
            <ElectricityMetersView meters={meters} t={t} />
          )}

          {/* Key Search Quick Tab */}
          {activeTab === 'key-search' && (
            <KeysView keys={keys} onKeyAction={handleKeyAction} t={t} />
          )}

          {/* Apartment Search Quick Tab */}
          {activeTab === 'apartment-search' && (
            <ApartmentsView
              apartments={apartments}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onSelectApartment={(apt) => {
                handleKeyAction('apartment', apt.keyNumber);
              }}
              t={t}
            />
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity-log' && (
            <ActivityLogView handoverLogs={handoverLogs} t={t} />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <ActivityLogView handoverLogs={handoverLogs} t={t} />
          )}

          {/* Reports & Export Tab */}
          {activeTab === 'reports-export' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {t.reportsExport}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Download spreadsheets and analytical audit reports
                  </p>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2.5 bg-[#0e2d5c] text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  {t.exportToExcel}
                </button>
              </div>
              <RentalsView apartments={apartments} tenants={tenants} t={t} />
            </div>
          )}

          {/* System Settings, Users & Backup Tabs */}
          {(activeTab === 'settings' || activeTab === 'users' || activeTab === 'backup') && (
            <SettingsView t={t} />
          )}
        </main>
      </div>

      {/* 3. Global Modals */}
      <RegisterApartmentModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAddApartment={handleAddApartment}
        buildings={INITIAL_BUILDINGS}
        t={t}
      />

      <KeyQuickActionModal
        isOpen={keyActionState.isOpen}
        onClose={() => setKeyActionState({ ...keyActionState, isOpen: false })}
        actionType={keyActionState.actionType}
        keyItem={activeModalKey}
        apartment={activeModalApt}
        historyLogs={handoverLogs}
        onReturnKey={handleReturnKey}
        onUpdateKey={handleUpdateKey}
        t={t}
      />

      <ExportExcelModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        apartments={apartments}
        keys={keys}
        tenants={tenants}
        t={t}
      />
    </div>
  );
}
