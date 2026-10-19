import React from 'react';
import { 
  Shield, 
  RotateCcw, 
  Play, 
  UserCheck, 
  Activity, 
  Database, 
  AlertTriangle,
  Layers,
  Wrench,
  Package,
  FileText
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  onResetData, 
  onSimulateStep,
  auditCount,
  alertCount,
  simulatedCycle
}) {
  const roles = [
    { id: 'COMMANDER', label: 'Commander / Fleet Planner' },
    { id: 'MAINTAINER', label: 'Maintainer (Line/Depot)' },
    { id: 'LOGISTICS', label: 'Logistics Planner' },
    { id: 'ADMIN', label: 'System Administrator' }
  ];

  const tabs = [
    { id: 'fleet', label: 'Fleet Readiness', icon: Layers, role: 'All' },
    { id: 'alerts', label: 'Health & Prognostics', icon: AlertTriangle, badge: alertCount, role: 'All' },
    { id: 'scenario', label: 'Digital Twin What-If', icon: Activity, role: 'Planner' },
    { id: 'schedule', label: 'Maintenance Schedule', icon: Wrench, role: 'All' },
    { id: 'spares', label: 'Spares & Logistics', icon: Package, role: 'Logistics' },
    { id: 'dataquality', label: 'Data Quality & Ingestion', icon: Database, role: 'Admin' },
    { id: 'audit', label: 'Audit Trail', icon: FileText, badge: auditCount, role: 'Admin' }
  ];

  return (
    <header className="border-b border-slate-800 bg-[#090d16] sticky top-0 z-50">
      {/* Top System Status Ribbon */}
      <div className="bg-[#0b111d] border-b border-slate-800/80 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono-code">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-none bg-emerald-500 animate-pulse"></span>
            SYSTEM OPERATIONAL
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-none font-semibold">
            SIMULATED BENCHMARK DATA: C-MAPSS FD001 / Fictional Fleet
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Offline Decision-Support Prototype v0.9.4 (Air-Gapped Mode)
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1 sm:mt-0">
          <span className="text-slate-400">
            Cycle Step: <span className="text-sky-400 font-bold">{simulatedCycle}</span>
          </span>
          <span className="text-slate-600">|</span>
          <button
            onClick={onSimulateStep}
            title="Step simulation forward by 1 cycle"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-none border border-slate-700 text-xs transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 text-sky-400" />
            <span>Step Cycle</span>
          </button>
          <button
            onClick={onResetData}
            title="Reset dataset to canonical seed values"
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-none border border-slate-700 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset Dataset</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400">
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white m-0 p-0 font-mono-code uppercase">
                AeroPulse
              </h1>
              <span className="text-[10px] tracking-wider uppercase px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-mono-code">
                DECISION PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">
              Aircraft Component Health, Short-Term Fleet Availability & Spares Optimizer
            </p>
          </div>
        </div>

        {/* User Role Selection */}
        <div className="flex items-center gap-2 bg-[#0c121e] border border-slate-800 p-1">
          <div className="flex items-center gap-1.5 px-2 text-xs text-slate-400">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono-code text-[11px] uppercase">Active Role:</span>
          </div>
          <div className="flex gap-1">
            {roles.map((r) => {
              const active = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`text-xs px-2.5 py-1 transition-all rounded-none font-medium cursor-pointer ${
                    active
                      ? 'bg-sky-950 text-sky-200 border border-sky-700 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="px-4 flex flex-wrap gap-1 border-t border-slate-800/80 bg-[#0a0f1a] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer rounded-none whitespace-nowrap ${
                isActive
                  ? 'border-sky-500 text-sky-300 bg-slate-900/90 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono-code ${
                  tab.id === 'alerts' 
                    ? 'bg-rose-950 border border-rose-800 text-rose-300' 
                    : 'bg-slate-800 border border-slate-700 text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
