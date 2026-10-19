import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plane, 
  ShieldAlert, 
  ArrowRight,
  Filter,
  BarChart3,
  Layers
} from 'lucide-react';
import { BASES } from '../data/fleetData';

export default function FleetOverview({ 
  aircraftList, 
  onSelectTail, 
  onNavigateToAlert,
  onNavigateToScenario 
}) {
  const [filterBase, setFilterBase] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Compute metrics
  const total = aircraftList.length;
  const ready = aircraftList.filter(a => a.status === 'AVAILABLE' || a.status === 'IN_MISSION').length;
  const inMission = aircraftList.filter(a => a.status === 'IN_MISSION').length;
  const degraded = aircraftList.filter(a => a.status === 'ALERT_DEGRADED' || a.status === 'GROUNDED').length;
  const maintenance = aircraftList.filter(a => a.status === 'SCHEDULED_MAINT').length;
  const availabilityRate = ((ready / total) * 100).toFixed(1);

  // Filtered list
  const filteredAircraft = aircraftList.filter(a => {
    if (filterBase !== 'ALL' && a.base !== filterBase) return false;
    if (filterStatus === 'READY' && a.status !== 'AVAILABLE' && a.status !== 'IN_MISSION') return false;
    if (filterStatus === 'ALERT' && a.status !== 'ALERT_DEGRADED' && a.status !== 'GROUNDED') return false;
    if (filterStatus === 'MAINT' && a.status !== 'SCHEDULED_MAINT') return false;
    return true;
  });

  // 7-day availability projection data points
  const sevenDayProjection = [
    { day: 'Day 1', date: 'Oct 19', rate: 80, available: 8, total: 10, note: 'AP-104 alert flag' },
    { day: 'Day 2', date: 'Oct 20', rate: 70, available: 7, total: 10, note: 'AP-104 inspection' },
    { day: 'Day 3', date: 'Oct 21', rate: 70, available: 7, total: 10, note: 'AP-108 bay work' },
    { day: 'Day 4', date: 'Oct 22', rate: 80, available: 8, total: 10, note: 'AP-108 release' },
    { day: 'Day 5', date: 'Oct 23', rate: 80, available: 8, total: 10, note: 'AP-104 post-swap test' },
    { day: 'Day 6', date: 'Oct 24', rate: 90, available: 9, total: 10, note: 'Fleet full return' },
    { day: 'Day 7', date: 'Oct 25', rate: 90, available: 9, total: 10, note: 'Nominal operational state' }
  ];

  const getBaseName = (baseId) => {
    const found = BASES.find(b => b.id === baseId);
    return found ? found.name : baseId;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono-code bg-emerald-950/70 border border-emerald-800 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            AVAILABLE
          </span>
        );
      case 'IN_MISSION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono-code bg-sky-950/70 border border-sky-800 text-sky-300">
            <Plane className="w-3 h-3 text-sky-400" />
            IN MISSION
          </span>
        );
      case 'ALERT_DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono-code bg-rose-950/80 border border-rose-700 text-rose-300 font-semibold animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            CRITICAL ALERT
          </span>
        );
      case 'GROUNDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono-code bg-red-950 border border-red-800 text-red-300 font-semibold">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            GROUNDED (AOG)
          </span>
        );
      case 'SCHEDULED_MAINT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono-code bg-amber-950/70 border border-amber-800 text-amber-300">
            <Clock className="w-3 h-3 text-amber-400" />
            IN MAINTENANCE
          </span>
        );
      default:
        return <span className="text-slate-400 text-xs font-mono-code">{status}</span>;
    }
  };

  const getSubsystemIndicator = (subsystemStatus) => {
    if (subsystemStatus === 'CRITICAL_ANOMALY') {
      return <span className="text-rose-400 font-bold text-xs font-mono-code">FAIL RISK</span>;
    }
    if (subsystemStatus === 'WATCHLIST' || subsystemStatus === 'SCHEDULED_SERVICE') {
      return <span className="text-amber-400 text-xs font-mono-code">ADVISORY</span>;
    }
    return <span className="text-emerald-500 text-xs font-mono-code">OK</span>;
  };

  return (
    <div className="space-y-5">
      {/* Scope Disclaimer Banner */}
      <div className="bg-[#0e1524] border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-sky-400"></div>
          <span className="text-slate-200 font-semibold">Prototype Scope Boundary:</span>
          <span className="text-slate-400">
            Synthetic multirole fleet data (10 airframes) with C-MAPSS FD001 statistical baseline model. 
            Not connected to classified defense networks.
          </span>
        </div>
        <div className="text-slate-400 font-mono-code text-[11px]">
          Ingestion Schema: <span className="text-slate-200">AeroPulse-Canonical-v1</span>
        </div>
      </div>

      {/* Fleet Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[#0d1322] border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-1">
            Total Airframes
          </div>
          <div className="text-2xl font-bold font-mono-code text-white">
            {total} <span className="text-xs font-normal text-slate-400">Tails</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">3 Forward Operating Bases</div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-1">
            Current Availability
          </div>
          <div className="text-2xl font-bold font-mono-code text-emerald-400">
            {availabilityRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{ready} of {total} Airframes Mission Ready</div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-1">
            Active Sorties
          </div>
          <div className="text-2xl font-bold font-mono-code text-sky-400">
            {inMission} <span className="text-xs font-normal text-slate-400">Sorties</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">AP-102 Combat Air Patrol</div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-3.5 border-l-2 border-l-rose-500">
          <div className="text-[11px] font-mono-code text-rose-300 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Critical Alerts</span>
            <span className="w-1.5 h-1.5 bg-rose-500"></span>
          </div>
          <div className="text-2xl font-bold font-mono-code text-rose-400">
            {degraded} <span className="text-xs font-normal text-rose-300/80">Tail (AP-104)</span>
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">HPT Stage 2 RUL: 28 cycles</div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-1">
            In Scheduled Maint
          </div>
          <div className="text-2xl font-bold font-mono-code text-amber-400">
            {maintenance} <span className="text-xs font-normal text-slate-400">Tail (AP-108)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Bay 1 Actuator Overhaul</div>
        </div>
      </div>

      {/* 7-Day & 30-Day Fleet Availability Trajectory */}
      <div className="bg-[#0d1322] border border-slate-800 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold font-mono-code uppercase text-white m-0 tracking-wide flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Projected Fleet Readiness Trajectory (Next 7 to 30 Days)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated availability based on scheduled overhaul windows, component RUL thresholds, and spare parts transit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-code text-slate-400">
              30-Day Mean Readiness: <span className="text-slate-200 font-bold">76.4%</span>
            </span>
            <button
              onClick={onNavigateToScenario}
              className="text-xs px-2.5 py-1.5 bg-sky-950/80 border border-sky-700 text-sky-200 hover:bg-sky-900 transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
            >
              <span>Run "What If Tail Grounded" Scenario</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>
        </div>

        {/* Visual Forecast Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
          {sevenDayProjection.map((item, idx) => {
            const isDip = item.rate < 80;
            return (
              <div 
                key={idx} 
                className={`p-2.5 border transition-all ${
                  isDip 
                    ? 'bg-amber-950/20 border-amber-800/60' 
                    : 'bg-[#0f172a]/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-[11px] font-mono-code text-slate-400 mb-1">
                  <span className="font-semibold text-slate-200">{item.day}</span>
                  <span className="text-slate-500">{item.date}</span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className={`text-xl font-bold font-mono-code ${isDip ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {item.rate}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-code">
                    ({item.available}/{item.total})
                  </span>
                </div>
                {/* Visual meter */}
                <div className="w-full bg-slate-900 h-1.5 my-1.5 overflow-hidden">
                  <div 
                    className={`h-full ${isDip ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 truncate" title={item.note}>
                  {item.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fleet Airframe Roster */}
      <div className="bg-[#0d1322] border border-slate-800">
        <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0">
              Fleet Aircraft Directory & Subsystem Health Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono-code">({filteredAircraft.length} tails)</span>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono-code text-[11px]">
              <Filter className="w-3 h-3 text-slate-500" />
              <span>Base:</span>
            </div>
            <select
              value={filterBase}
              onChange={(e) => setFilterBase(e.target.value)}
              className="bg-[#0b0f19] border border-slate-700 text-slate-200 px-2 py-1 text-xs font-mono-code focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="ALL">All Bases (10 Tails)</option>
              <option value="BASE-ALPHA">Base Alpha (Ambala)</option>
              <option value="BASE-BRAVO">Base Bravo (Jodhpur)</option>
              <option value="BASE-CHARLIE">Base Charlie (Hasimara)</option>
            </select>

            <div className="flex items-center gap-1.5 text-slate-400 font-mono-code text-[11px] ml-2">
              <span>Status:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0b0f19] border border-slate-700 text-slate-200 px-2 py-1 text-xs font-mono-code focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="READY">Ready / Mission</option>
              <option value="ALERT">Critical Alerts</option>
              <option value="MAINT">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Airframes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b101c] border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-3.5">Tail ID</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Station Base</th>
                <th className="py-2.5 px-3">Total Hours / Cycles</th>
                <th className="py-2.5 px-3">Subsystems (ENG / HYD / AVN / FUEL)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAircraft.map((tail) => {
                const isCritical = tail.status === 'ALERT_DEGRADED';
                return (
                  <tr 
                    key={tail.tailId} 
                    className={`transition-colors ${
                      isCritical ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-mono-code font-bold text-white flex items-center gap-2">
                      <span className="text-sky-300">{tail.tailId}</span>
                      {isCritical && (
                        <span className="text-[10px] bg-rose-900/80 text-rose-200 px-1.5 py-0.2 border border-rose-700">
                          RISK
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{tail.platform}</td>
                    <td className="py-2.5 px-3 font-mono-code text-slate-400">
                      {getBaseName(tail.base)}
                    </td>
                    <td className="py-2.5 px-3 font-mono-code text-slate-400">
                      {tail.airframeHours}h / {tail.totalCycles} cycles
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 font-mono-code text-[11px]">
                        <span>E: {getSubsystemIndicator(tail.subsystems.engine)}</span>
                        <span className="text-slate-600">|</span>
                        <span>H: {getSubsystemIndicator(tail.subsystems.hydraulics)}</span>
                        <span className="text-slate-600">|</span>
                        <span>A: {getSubsystemIndicator(tail.subsystems.avionics)}</span>
                        <span className="text-slate-600">|</span>
                        <span>F: {getSubsystemIndicator(tail.subsystems.fuel)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {getStatusBadge(tail.status)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isCritical ? (
                        <button
                          onClick={() => onNavigateToAlert('ALT-2026-0881')}
                          className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-100 border border-rose-700 font-mono-code text-xs font-semibold cursor-pointer"
                        >
                          Inspect Alert
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectTail(tail)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono-code text-xs cursor-pointer"
                        >
                          View Logs
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
