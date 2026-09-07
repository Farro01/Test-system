import React from 'react';
import { Zap, AlertTriangle, CheckCircle, Gauge } from 'lucide-react';
import { ElectricityMeter } from '../../types';

interface ElectricityMetersViewProps {
  meters: ElectricityMeter[];
  t: Record<string, string>;
}

export const ElectricityMetersView: React.FC<ElectricityMetersViewProps> = ({ meters, t }) => {
  return (
    <div id="view-meters-root" className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.electricityMeters}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sub-meter power monitoring across residential complexes in Erbil & Mosul
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meters.map((m) => {
          const consumption = m.currentReadingKWh - m.previousReadingKWh;
          return (
            <div key={m.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.meterNumber}</h4>
                    <p className="text-[11px] text-slate-400">Unit {m.aptNumber} • {m.building}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    m.status === 'normal'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {m.status.toUpperCase()}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Current Reading</div>
                  <div className="text-lg font-black text-slate-900">{m.currentReadingKWh} kWh</div>
                </div>
                <div className="text-end">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Cycle Usage</div>
                  <div className="text-sm font-bold text-blue-700">+{consumption} kWh</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Last Verified: {m.lastReadingDate}</span>
                <span>{m.city}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
