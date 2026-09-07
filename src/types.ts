export type Language = 'en' | 'ku' | 'ar';

export type ApartmentStatus = 'rented' | 'available' | 'reserved' | 'maintenance';

export type KeyStatus = 'available' | 'taken' | 'lost' | 'returned';

export type City = 'Erbil' | 'Mosul';

export type NavigationTab =
  | 'dashboard'
  | 'apartments'
  | 'keys'
  | 'key-handover'
  | 'tenants'
  | 'rentals'
  | 'electricity-meters'
  | 'key-search'
  | 'apartment-search'
  | 'activity-log'
  | 'notifications'
  | 'reports-export'
  | 'users'
  | 'settings'
  | 'backup';

export interface Apartment {
  id: string;
  aptNumber: string; // e.g. A-101
  building: string;
  city: City;
  floor: number;
  rooms: number;
  areaSqM: number;
  status: ApartmentStatus;
  monthlyRentIQD: number;
  monthlyRentUSD: number;
  tenantName?: string;
  tenantPhone?: string;
  keyNumber: string; // e.g. K-1001
  electricityMeterNo: string;
  notes?: string;
}

export interface KeyItem {
  id: string;
  keyNumber: string; // e.g. K-1001
  aptNumber: string;
  building: string;
  city: City;
  status: KeyStatus;
  copiesTotal: number;
  copiesInStorage: number;
  holderName?: string;
  holderRole?: 'Tenant' | 'Maintenance' | 'Broker' | 'Cleaning' | 'Inspector';
  holderPhone?: string;
  handoverDate?: string;
  expectedReturnDate?: string;
  notes?: string;
  lastUpdated?: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  aptNumber: string;
  building: string;
  city: City;
  leaseStart: string;
  leaseEnd: string;
  monthlyRentIQD: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  depositIQD: number;
}

export interface HandoverRecord {
  id: string;
  keyNumber: string;
  aptNumber: string;
  action: 'checkout' | 'return' | 'report_lost' | 'duplicate_created';
  personName: string;
  personRole: string;
  personPhone: string;
  date: string;
  staffName: string;
  note: string;
}

export interface ElectricityMeter {
  id: string;
  meterNumber: string;
  aptNumber: string;
  building: string;
  city: City;
  currentReadingKWh: number;
  previousReadingKWh: number;
  lastReadingDate: string;
  status: 'normal' | 'inspection_needed' | 'high_usage';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  timestamp: string;
  read: boolean;
  relatedKey?: string;
  relatedApt?: string;
}
