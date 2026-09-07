import React, { useState } from 'react';
import { X, Building2, Key, Zap, Check } from 'lucide-react';
import { Apartment, City, ApartmentStatus } from '../../types';

interface RegisterApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApartment: (apt: Apartment) => void;
  buildings: { name: string; city: string }[];
  t: Record<string, string>;
}

export const RegisterApartmentModal: React.FC<RegisterApartmentModalProps> = ({
  isOpen,
  onClose,
  onAddApartment,
  buildings,
  t,
}) => {
  const [aptNumber, setAptNumber] = useState('');
  const [building, setBuilding] = useState(buildings[0]?.name || 'Dream City Complex');
  const [city, setCity] = useState<City>('Erbil');
  const [floor, setFloor] = useState(1);
  const [rooms, setRooms] = useState(3);
  const [areaSqM, setAreaSqM] = useState(150);
  const [status, setStatus] = useState<ApartmentStatus>('available');
  const [monthlyRentIQD, setMonthlyRentIQD] = useState(1250000);
  const [monthlyRentUSD, setMonthlyRentUSD] = useState(950);
  const [keyNumber, setKeyNumber] = useState('K-');
  const [electricityMeterNo, setElectricityMeterNo] = useState('MTR-');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptNumber.trim()) return;

    const newApt: Apartment = {
      id: `apt-${Date.now()}`,
      aptNumber: aptNumber.trim().toUpperCase(),
      building,
      city,
      floor: Number(floor),
      rooms: Number(rooms),
      areaSqM: Number(areaSqM),
      status,
      monthlyRentIQD: Number(monthlyRentIQD),
      monthlyRentUSD: Number(monthlyRentUSD),
      keyNumber: keyNumber.trim().toUpperCase(),
      electricityMeterNo: electricityMeterNo.trim().toUpperCase(),
      notes: notes.trim(),
    };

    onAddApartment(newApt);
    onClose();
  };

  return (
    <div
      id="modal-register-apartment"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#0e2752] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/50 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">{t.registerNewApartment}</h3>
              <p className="text-xs text-blue-200">Emmar al shimal — Property Registration Form</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Apartment No. *</label>
              <input
                type="text"
                required
                placeholder="e.g. A-105"
                value={aptNumber}
                onChange={(e) => {
                  setAptNumber(e.target.value);
                  if (keyNumber === 'K-') setKeyNumber(`K-${e.target.value.replace(/[^0-9]/g, '') || '105'}`);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.building} *</label>
              <select
                value={building}
                onChange={(e) => {
                  setBuilding(e.target.value);
                  const found = buildings.find((b) => b.name === e.target.value);
                  if (found) setCity(found.city as City);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                {buildings.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.city}</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as City)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                <option value="Erbil">Erbil</option>
                <option value="Mosul">Mosul</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.floor}</label>
              <input
                type="number"
                min="0"
                max="50"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.rooms}</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area (m²)</label>
              <input
                type="number"
                min="30"
                value={areaSqM}
                onChange={(e) => setAreaSqM(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.status}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApartmentStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                <option value="available">Available (Ready)</option>
                <option value="rented">Rented (Active)</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Rent (IQD) *</label>
              <input
                type="number"
                step="50000"
                value={monthlyRentIQD}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyRentIQD(val);
                  setMonthlyRentUSD(Math.round(val / 1320));
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Approx. USD ($)</label>
              <input
                type="number"
                value={monthlyRentUSD}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyRentUSD(val);
                  setMonthlyRentIQD(val * 1320);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Associated Key Number *</label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="K-1005"
                  value={keyNumber}
                  onChange={(e) => setKeyNumber(e.target.value)}
                  className="w-full ps-9 pe-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Electricity Meter Number *</label>
              <div className="relative">
                <Zap className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="MTR-88201"
                  value={electricityMeterNo}
                  onChange={(e) => setElectricityMeterNo(e.target.value)}
                  className="w-full ps-9 pe-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.notes}</label>
            <textarea
              rows={2}
              placeholder="Unit notes, condition, balconies, finishes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#123971] hover:bg-[#0c264d] text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
