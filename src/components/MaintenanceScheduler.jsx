import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { MAINTENANCE_SCHEDULE_TASKS, BASES } from '../data/fleetData';

export default function MaintenanceScheduler({ onNavigateToSpares, onLogAuditAction }) {
  const [tasks, setTasks] = useState(MAINTENANCE_SCHEDULE_TASKS);
  const [selectedPlanMode, setSelectedPlanMode] = useState('RECOMMENDED'); // 'CURRENT' or 'RECOMMENDED'
  const [acceptedOptimization, setAcceptedOptimization] = useState(false);

  const handleAcceptPlan = () => {
    setAcceptedOptimization(true);
    onLogAuditAction({
      action: 'OPTIMIZED_MAINTENANCE_SCHEDULE_ACCEPTED',
      tailId: 'FLEET',
      summary: 'Accepted OR-Tools constraint-optimized schedule. Re-staged TSK-502 to Day 2 pending expedited air spares arrival.',
      justification: 'Avoids premature hangar bay deadlock at Base Bravo while Part HPT-8842-B is in transit.'
    });
  };

  return (
    <div className="space-y-5">
      {/* Scope and Solvers Disclaimer */}
      <div className="bg-[#0e1524] border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200 font-semibold">Constraint Optimizer:</span>
          <span className="text-slate-400">
            Resource-constrained maintenance scheduling accounting for bay capacity, technician qualification levels, and part availability.
          </span>
        </div>
        <div className="text-[11px] font-mono-code text-slate-400">
          Optimization Engine: <span className="text-slate-200">OR-Tools Constraint Heuristic v1.1</span>
        </div>
      </div>

      {/* Scheduling Comparison & Actions */}
      <div className="bg-[#0d1322] border border-slate-800 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              Multi-Base Hangar Bay & Work Order Schedule
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review active and queued maintenance operations across all 3 forward airbases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#0a0f19] border border-slate-700 p-1 flex gap-1 font-mono-code text-xs">
              <button
                onClick={() => setSelectedPlanMode('CURRENT')}
                className={`px-3 py-1 cursor-pointer transition-colors ${
                  selectedPlanMode === 'CURRENT'
                    ? 'bg-slate-800 text-slate-200 border border-slate-600 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Current Unconstrained Plan
              </button>
              <button
                onClick={() => setSelectedPlanMode('RECOMMENDED')}
                className={`px-3 py-1 cursor-pointer transition-colors ${
                  selectedPlanMode === 'RECOMMENDED'
                    ? 'bg-sky-950 text-sky-200 border border-sky-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Recommended Feasible Plan
              </button>
            </div>

            <button
              onClick={handleAcceptPlan}
              disabled={acceptedOptimization}
              className={`px-3 py-1.5 text-xs font-mono-code font-semibold flex items-center gap-1.5 border cursor-pointer transition-colors ${
                acceptedOptimization
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300 cursor-default'
                  : 'bg-emerald-900 hover:bg-emerald-800 border-emerald-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{acceptedOptimization ? 'Optimization Plan Enacted' : 'Accept Feasible Schedule'}</span>
            </button>
          </div>
        </div>

        {/* Blocking Constraint Alert (if unconstrained or conflict exists) */}
        <div className="my-3 p-3 bg-amber-950/30 border border-amber-800/80 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-300 font-mono-code">
                Constraint Conflict Detected: Work Order TSK-502 (Airframe AP-104)
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <strong>Blocking Resource:</strong> Part # HPT-8842-B has zero on-hand units at Base Bravo. 
                Attempting to commence disassembly on Day 1 will idle Hangar Bay 2 for 14 hours waiting for parts delivery.
              </p>
              <div className="pt-1 flex items-center gap-3 font-mono-code text-[11px]">
                <span className="text-emerald-400">
                  <strong>Solver Fallback:</strong> Re-sequence start time to Day 2, 06:00 UTC (Post-transfer arrival).
                </span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={onNavigateToSpares}
                  className="text-sky-400 hover:text-sky-300 underline font-semibold cursor-pointer"
                >
                  Verify Spares Dispatch Route
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Cards and Gantt Visual Breakdown */}
        <div className="space-y-3 mt-4">
          {tasks.map((tsk) => {
            const isBlocked = !tsk.constraintsSatisfied;
            return (
              <div
                key={tsk.id}
                className={`p-3.5 border transition-all ${
                  isBlocked
                    ? 'bg-[#121118] border-amber-800/80'
                    : 'bg-[#0a0f19] border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5 font-mono-code text-xs">
                    <span className="font-bold text-sky-400">{tsk.id}</span>
                    <span className="text-slate-600">/</span>
                    <span className="font-semibold text-white">{tsk.tailId}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">{tsk.base}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-300">{tsk.bay}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Duration: {tsk.durationHours} Hours
                    </span>
                    <span className={`text-[10px] font-mono-code px-2 py-0.5 uppercase font-semibold ${
                      isBlocked
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {tsk.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-100 mb-2">
                  {tsk.title}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono-code text-slate-400 pt-1">
                  <div className="bg-[#090d16] p-2 border border-slate-800/80 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>Skill: <strong className="text-slate-300">{tsk.technicianSkill}</strong></span>
                  </div>
                  <div className="bg-[#090d16] p-2 border border-slate-800/80 flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Parts: <strong className="text-slate-300">{tsk.partAssigned}</strong></span>
                  </div>
                  <div className="bg-[#090d16] p-2 border border-slate-800/80 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Schedule Window: <strong className="text-slate-300">Day {tsk.startDay} - Day {tsk.startDay + Math.ceil(tsk.durationHours/24)}</strong></span>
                  </div>
                </div>

                {tsk.bottleneckNotes && (
                  <div className="mt-2 text-[11px] font-mono-code text-slate-400 bg-[#080d15] p-2 border border-slate-800">
                    <span className="text-slate-300 font-semibold">Constraint Audit Note:</span> {tsk.bottleneckNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Base Bay & Technician Capacity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {BASES.filter(b => b.id !== 'DEPOT-DELTA').map((base) => (
          <div key={base.id} className="bg-[#0d1322] border border-slate-800 p-3.5 text-xs">
            <div className="text-xs font-bold font-mono-code text-white mb-2 pb-1.5 border-b border-slate-800">
              {base.name}
            </div>
            <div className="space-y-1.5 font-mono-code text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>Hangar Bays:</span>
                <span className="text-slate-200 font-bold">{base.hangarBays} Total</span>
              </div>
              <div className="flex justify-between">
                <span>Active Bay Utilization:</span>
                <span className={base.id === 'BASE-BRAVO' ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                  {base.id === 'BASE-BRAVO' ? '1 of 3 (Reserved)' : '1 of 3 (In Use)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Technicians on Duty:</span>
                <span className="text-slate-200">{base.techsAvailable} Personnel</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
