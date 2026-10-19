import React from 'react';
import { 
  X, 
  Plane, 
  Clock, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  FileText,
  Calendar
} from 'lucide-react';
import { BASES } from '../data/fleetData';

export default function AircraftDetailModal({ 
  aircraft, 
  onClose, 
  onNavigateToScenario,
  onNavigateToAlert 
}) {
  if (!aircraft) return null;

  const baseObj = BASES.find(b => b.id === aircraft.base);
  const isAlert = aircraft.status === 'ALERT_DEGRADED' || aircraft.status === 'GROUNDED';

  // Synthetic sortie log for this tail
  const recentSorties = [
    { id: 'SRT-882', mission: 'Border Intercept Patrol', duration: '2.4 hrs', cycles: 1, date: '2026-10-18', profile: 'High-G Tactical' },
    { id: 'SRT-879', mission: 'Combat Air Patrol (Northern Sector)', duration: '3.1 hrs', cycles: 1, date: '2026-10-17', profile: 'Medium-Altitude Transit' },
    { id: 'SRT-872', mission: 'Formation Air-to-Air Maneuvers', duration: '1.8 hrs', cycles: 1, date: '2026-10-15', profile: 'Acrobatic / Max Throttle' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#0d1322] border border-slate-700 w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-[#090e18] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0">
              Airframe Detail Inspector: <span className="text-sky-300">{aircraft.tailId}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-code text-xs">
            <div className="bg-[#090d16] p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PLATFORM</span>
              <span className="text-white font-bold">{aircraft.platform}</span>
            </div>
            <div className="bg-[#090d16] p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ASSIGNED BASE</span>
              <span className="text-white font-bold">{baseObj ? baseObj.name : aircraft.base}</span>
            </div>
            <div className="bg-[#090d16] p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">AIRFRAME HOURS</span>
              <span className="text-sky-400 font-bold">{aircraft.airframeHours} hrs</span>
            </div>
            <div className="bg-[#090d16] p-2.5 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">TOTAL CYCLES</span>
              <span className="text-white font-bold">{aircraft.totalCycles} cycles</span>
            </div>
          </div>

          {/* Subsystem Health Matrix */}
          <div className="bg-[#090d16] border border-slate-800 p-3">
            <div className="text-xs font-mono-code uppercase text-slate-300 font-bold mb-2">
              Subsystem Diagnostic State
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-code text-xs">
              <div className="p-2 border border-slate-800 bg-[#0a0f19]">
                <div className="text-slate-400 text-[10px]">PROPULSION (ENG)</div>
                <div className={aircraft.subsystems.engine === 'CRITICAL_ANOMALY' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {aircraft.subsystems.engine}
                </div>
              </div>
              <div className="p-2 border border-slate-800 bg-[#0a0f19]">
                <div className="text-slate-400 text-[10px]">FLIGHT HYDRAULICS</div>
                <div className={aircraft.subsystems.hydraulics === 'SCHEDULED_SERVICE' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {aircraft.subsystems.hydraulics}
                </div>
              </div>
              <div className="p-2 border border-slate-800 bg-[#0a0f19]">
                <div className="text-slate-400 text-[10px]">AVIONICS / RADAR</div>
                <div className="text-emerald-400 font-bold">
                  {aircraft.subsystems.avionics}
                </div>
              </div>
              <div className="p-2 border border-slate-800 bg-[#0a0f19]">
                <div className="text-slate-400 text-[10px]">FUEL SYSTEM</div>
                <div className={aircraft.subsystems.fuel === 'WATCHLIST' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {aircraft.subsystems.fuel}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sorties / Missions */}
          <div>
            <div className="text-xs font-mono-code uppercase text-slate-300 font-bold mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Recent Mission Sortie Log</span>
            </div>
            <div className="border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono-code text-slate-300">
                <thead className="bg-[#090d16] text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Sortie ID</th>
                    <th className="py-2 px-3">Mission Profile</th>
                    <th className="py-2 px-3">Duration</th>
                    <th className="py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-[11px]">
                  {recentSorties.map((srt) => (
                    <tr key={srt.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-sky-400 font-bold">{srt.id}</td>
                      <td className="py-2 px-3 text-white">{srt.mission} ({srt.profile})</td>
                      <td className="py-2 px-3 text-slate-300">{srt.duration}</td>
                      <td className="py-2 px-3 text-slate-400">{srt.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#090e18] px-4 py-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            {isAlert && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToAlert('ALT-2026-0881');
                }}
                className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white border border-rose-700 text-xs font-mono-code font-semibold cursor-pointer"
              >
                Inspect Prognostic Alert
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onNavigateToScenario();
              }}
              className="px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-700 text-xs font-mono-code font-semibold cursor-pointer"
            >
              Simulate Grounding in Digital Twin
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono-code cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
