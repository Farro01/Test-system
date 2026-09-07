import React from 'react';

interface KeyStatusBarChartProps {
  available: number;
  taken: number;
  returned30d: number;
  lost: number;
  totalTracked: number;
  buildingFilter: string;
  setBuildingFilter: (val: string) => void;
  buildings: { name: string }[];
  labels: {
    title: string;
    allBuildings: string;
    totalKeysTracked: string;
    available: string;
    taken: string;
    returned30d: string;
    lost: string;
  };
}

export const KeyStatusBarChart: React.FC<KeyStatusBarChartProps> = ({
  available,
  taken,
  returned30d,
  lost,
  totalTracked,
  buildingFilter,
  setBuildingFilter,
  buildings,
  labels,
}) => {
  const maxScale = 500;

  const rows = [
    { label: labels.available, value: available, color: '#0e3875', bg: 'bg-[#0e3875]' },
    { label: labels.taken, value: taken, color: '#2563eb', bg: 'bg-[#2563eb]' },
    { label: labels.returned30d, value: returned30d, color: '#06b6d4', bg: 'bg-[#06b6d4]' },
    { label: labels.lost, value: lost, color: '#ef4444', bg: 'bg-[#ef4444]' },
  ];

  return (
    <div id="card-key-status" className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base">{labels.title}</h3>
        <select
          id="select-key-status-building"
          aria-label={labels.title}
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-hidden cursor-pointer transition-colors max-w-[170px] truncate"
        >
          <option value="all">{labels.allBuildings}</option>
          {buildings.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4 my-auto">
        {rows.map((row) => {
          const widthPct = Math.min(100, Math.max(2, (row.value / maxScale) * 100));
          return (
            <div key={row.label} className="flex items-center text-xs">
              <span className="w-28 shrink-0 text-slate-600 font-medium text-right rtl:text-left pr-3 rtl:pl-3 truncate">
                {row.label}
              </span>
              <div className="flex-1 bg-slate-100 rounded-md h-6 relative overflow-hidden flex items-center">
                <div
                  className={`h-full rounded-md transition-all duration-500 ${row.bg}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span className="w-12 text-left rtl:text-right font-bold text-slate-900 pl-3 rtl:pr-3 shrink-0">
                {row.value}
              </span>
            </div>
          );
        })}

        {/* X Axis scale */}
        <div className="flex items-center text-[10px] text-slate-400 font-medium pt-2">
          <span className="w-28 shrink-0" />
          <div className="flex-1 flex justify-between px-1">
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
            <span>500</span>
          </div>
          <span className="w-12 shrink-0" />
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500 font-medium">
        <span>{labels.totalKeysTracked}: <strong className="text-slate-900">{totalTracked}</strong></span>
      </div>
    </div>
  );
};
