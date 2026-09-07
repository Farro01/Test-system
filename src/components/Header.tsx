import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, CheckCircle2, AlertTriangle, Key, Home } from 'lucide-react';
import { Language, NotificationItem } from '../types';

interface HeaderProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMobileMenu: () => void;
  notifications: NotificationItem[];
  t: Record<string, string>;
  onSelectKeyQuick?: (keyNumber: string) => void;
  onSelectAptQuick?: (aptNumber: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  setLanguage,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
  notifications,
  t,
  onSelectKeyQuick,
  onSelectAptQuick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          id="btn-mobile-sidebar-toggle"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 pointer-events-none" />
            <input
              id="input-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t.globalSearchPlaceholder}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl ps-10 pe-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 text-slate-400 hover:text-slate-600 text-xs px-1 font-semibold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick autocomplete dropdown if user types */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div
              id="search-quick-results"
              className="absolute top-full start-0 end-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase">
                Quick Matches for "{searchQuery}"
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => {
                    if (onSelectKeyQuick) onSelectKeyQuick('K-1001');
                    setIsSearchFocused(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 text-start text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold">Key K-1001</span>
                    <span className="text-slate-500">• Apt A-101 (Dream City)</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                    With Holder
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (onSelectAptQuick) onSelectAptQuick('A-101');
                    setIsSearchFocused(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 text-start text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold">Apartment A-101</span>
                    <span className="text-slate-500">• Ahmed Omar Al-Kurdi</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                    Rented
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Language Selector, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Multi-language Selector Pill */}
        <div
          id="language-switcher-group"
          className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold"
        >
          <button
            id="btn-lang-en"
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentLanguage === 'en'
                ? 'bg-[#123971] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
          <button
            id="btn-lang-ku"
            onClick={() => setLanguage('ku')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              currentLanguage === 'ku'
                ? 'bg-[#123971] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            کوردی
          </button>
          <button
            id="btn-lang-ar"
            onClick={() => setLanguage('ar')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              currentLanguage === 'ar'
                ? 'bg-[#123971] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            العربية
          </button>
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                id="header-notification-badge"
                className="absolute top-1 end-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              id="notifications-dropdown-menu"
              className="absolute end-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                  {t.notifications} ({unreadCount})
                </span>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 text-xs flex gap-2.5">
                    {item.type === 'alert' || item.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5 flex-1">
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-normal text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div className="relative" ref={userRef}>
          <button
            id="btn-user-profile-toggle"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#123971] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              FA
            </div>
            <div className="hidden md:flex flex-col text-start">
              <span className="text-xs font-bold text-slate-900 leading-tight">Farro IT</span>
              <span className="text-[10px] font-medium text-slate-500">{t.userRole}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Profile Menu */}
          {showUserMenu && (
            <div
              id="user-profile-menu"
              className="absolute end-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 text-xs text-slate-700"
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="font-bold text-slate-900">Farro IT</p>
                <p className="text-[10px] text-slate-500">farhangking26@gmail.com</p>
              </div>
              <button className="w-full text-start px-3 py-1.5 rounded-lg hover:bg-slate-100">
                Profile & Security
              </button>
              <button className="w-full text-start px-3 py-1.5 rounded-lg hover:bg-slate-100">
                System Preferences
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button className="w-full text-start px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-600 font-medium">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
