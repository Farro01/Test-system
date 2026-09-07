import React, { useState } from 'react';

interface ApartmentStatusDonutProps {
  rented: number;
  available: number;
  reserved: number;
  maintenance: number;
  timeFilter: string;
  setTimeFilter: (val: string) => void;
  labels: {
    title: string;
    thisMonth: string;
    lastMonth: string;
    thisYear: string;
    totalApartments: string;
    rented: string;
    available: string;
    reserved: string;
    underMaintenance: string;
  };
}

export const ApartmentStatusDonut: React.FC<ApartmentStatusDonutProps> = ({
  rented,
  available,
  reserved,
  maintenance,
  timeFilter,
  setTimeFilter,
  labels,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const total = rented + available + reserved + maintenance;
  const size = 220;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const data = [
    { key: 'rented', label: labels.rented, value: rented, color: '#133e7c', pct: Math.round((rented / total) * 100) },
    { key: 'available', label: labels.available, value: available, color: '#258be3', pct: Math.round((available / total) * 100) },
    { key: 'reserved', label: labels.reserved, value: reserved, color: '#14b8a6', pct: Math.round((reserved / total) * 100) },
    { key: 'maintenance', label: labels.underMaintenance, value: maintenance, color: '#f59e0b', pct: Math.round((maintenance / total) * 100) },
  ];

  let accumulatedOffset = 0;

  return (
    <div id="card-apartment-status" className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 text-base">{labels.title}</h3>
        <select
          id="select-apartment-status-period"
          aria-label={labels.title}
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-hidden cursor-pointer transition-colors"
        >
          <option value="this_month">{labels.thisMonth}</option>
          <option value="last_month">{labels.lastMonth}</option>
          <option value="this_year">{labels.thisYear}</option>
        </select>
      </div>

      {/* Donut Chart Canvas */}
      <div className="relative flex items-center justify-center py-3 my-auto">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((item) => {
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += (item.value / total) * circumference;
            const isHovered = hoveredSegment === item.key;

            return (
              <circle
                key={item.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSegment(item.key)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{total}</span>
          <span className="text-[11px] font-medium text-slate-500 max-w-[80px] leading-tight mt-0.5">
            {labels.totalApartments}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-100 mt-2 text-xs">
        {data.map((item) => (
          <div
            key={item.key}
            className={`flex items-center justify-between p-1 rounded-md transition-colors cursor-pointer ${
              hoveredSegment === item.key ? 'bg-slate-100 font-semibold' : ''
            }`}
            onMouseEnter={() => setHoveredSegment(item.key)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-700 truncate">{item.label}</span>
            </div>
            <span className="font-semibold text-slate-900 shrink-0 ml-1">
              {item.value} <span className="text-slate-400 font-normal text-[11px]">({item.pct}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
