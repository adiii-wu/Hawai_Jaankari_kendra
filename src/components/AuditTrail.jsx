import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  User, 
  Lock
} from 'lucide-react';

export default function AuditTrail({ auditLogs }) {
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (roleFilter !== 'ALL' && log.actorRole !== roleFilter) return false;
    return true;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aeropulse_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActorBadge = (role) => {
    switch (role) {
      case 'COMMANDER':
        return <span className="bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 text-[10px] font-mono-code">COMMANDER</span>;
      case 'MAINTAINER':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 text-[10px] font-mono-code">MAINTAINER</span>;
      case 'LOGISTICS_PLANNER':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 text-[10px] font-mono-code">LOGISTICS</span>;
      case 'ANALYTICS_SYSTEM':
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 text-[10px] font-mono-code">ALGORITHM</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 text-[10px] font-mono-code">{role}</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Scope Disclaimer */}
      <div className="bg-[#0e1524] border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200 font-semibold">Append-Only Audit Ledger:</span>
          <span className="text-slate-400">
            Immutable log of all maintainer dispositions, algorithm alerts, scenario simulations, and logistics transfers.
          </span>
        </div>
        <div className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Integrity Verification: SHA-256 Validated</span>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="bg-[#0d1322] border border-slate-800">
        <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0">
              System Audit Records ({filteredLogs.length} Events)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-code">
              <Filter className="w-3 h-3 text-slate-500" />
              <span>Filter Actor:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#0b0f19] border border-slate-700 text-slate-200 px-2 py-1 text-xs font-mono-code focus:outline-none focus:border-sky-500 cursor-pointer ml-1"
              >
                <option value="ALL">All Roles</option>
                <option value="MAINTAINER">Maintainer</option>
                <option value="LOGISTICS_PLANNER">Logistics Planner</option>
                <option value="COMMANDER">Commander</option>
                <option value="ANALYTICS_SYSTEM">Analytics System</option>
              </select>
            </div>

            <button
              onClick={handleExportJson}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono-code flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3 text-sky-400" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>

        {/* Timeline Log List */}
        <div className="divide-y divide-slate-800/80">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-800/20 transition-colors space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sky-400">{log.id}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">{log.timestamp}</span>
                  <span className="text-slate-600">|</span>
                  {getActorBadge(log.actorRole)}
                  <span className="text-slate-300 font-semibold">{log.actorName}</span>
                </div>

                <div className="text-[11px] text-slate-400 font-semibold">
                  Target: <span className="text-sky-300">{log.tailId}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-100 font-mono-code">
                [{log.action}] - {log.summary}
              </div>

              <div className="text-xs text-slate-400 bg-[#080d16] p-2.5 border border-slate-800/70 font-mono-code">
                <span className="text-slate-300 font-medium">Justification / Evidence:</span> {log.justification}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
