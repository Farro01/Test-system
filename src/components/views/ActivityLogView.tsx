import React from 'react';
import { History, ShieldCheck, Key, User, FileText, CheckCircle2 } from 'lucide-react';
import { HandoverRecord } from '../../types';

interface ActivityLogViewProps {
  handoverLogs: HandoverRecord[];
  t: Record<string, string>;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ handoverLogs, t }) => {
  return (
    <div id="view-activity-log-root" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.activityLog}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System-wide immutable security audit log & transaction history
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {handoverLogs.map((log) => (
          <div key={log.id} className="p-4 sm:p-5 flex items-start gap-3.5 hover:bg-slate-50/70 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Key className="w-4 h-4" />
            </div>

            <div className="flex-1 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-900 font-bold text-sm">
                  Key {log.keyNumber} — Action: {log.action.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">{log.date}</span>
              </div>

              <div className="text-slate-600">
                Authorized for <strong className="text-slate-900">{log.personName}</strong> ({log.personRole}, {log.personPhone})
                for Apartment <span className="font-semibold text-blue-900">{log.aptNumber}</span>.
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-500">
                {log.note}
              </div>

              <div className="text-[10px] text-slate-400">
                Staff member: {log.staffName} • Session signature verified
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
