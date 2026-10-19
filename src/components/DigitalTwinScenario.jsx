import React, { useState } from 'react';
import { 
  Activity, 
  Sliders, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  Save, 
  RotateCcw,
  ShieldCheck,
  PlaneTakeoff,
  Clock
} from 'lucide-react';

export default function DigitalTwinScenario({ 
  aircraftList, 
  onLogAuditAction 
}) {
  const [selectedTail, setSelectedTail] = useState('AP-104');
  const [groundingDurationHours, setGroundingDurationHours] = useState(72);
  const [spareDelayDays, setSpareDelayDays] = useState(2);
  const [operationalTempo, setOperationalTempo] = useState('NORMAL'); // 'NORMAL', 'SURGE'

  // Baseline figures
  const baseline7Day = 80.0;
  const baseline30Day = 76.5;
  const baselineSorties = 94.2;

  // Compute deterministic scenario deltas
  const isGrounded = true;
  const durationPenalty = (groundingDurationHours / 24) * 2.5;
  const delayPenalty = spareDelayDays * 1.8;
  const tempoMultiplier = operationalTempo === 'SURGE' ? 1.4 : 1.0;

  const scenario7Day = Math.max(50.0, +(baseline7Day - (10.0 + durationPenalty * 0.5) * tempoMultiplier).toFixed(1));
  const scenario30Day = Math.max(55.0, +(baseline30Day - (3.5 + delayPenalty * 0.8) * tempoMultiplier).toFixed(1));
  const scenarioSorties = Math.max(60.0, +(baselineSorties - (9.2 + durationPenalty * 0.8) * tempoMultiplier).toFixed(1));

  const delta7Day = +(scenario7Day - baseline7Day).toFixed(1);
  const delta30Day = +(scenario30Day - baseline30Day).toFixed(1);
  const deltaSorties = +(scenarioSorties - baselineSorties).toFixed(1);
  const strandedSortiesCount = Math.round(Math.abs(deltaSorties) * 0.9);

  const handleSaveScenarioAudit = () => {
    onLogAuditAction({
      action: 'SCENARIO_SIMULATION_EXECUTED',
      tailId: selectedTail,
      summary: `Ran What-If grounding scenario on ${selectedTail} for ${groundingDurationHours}h duration with ${spareDelayDays}d spares delay under ${operationalTempo} tempo.`,
      justification: `Availability impact calculated: 7-day availability reduced by ${Math.abs(delta7Day)}%, risking ${strandedSortiesCount} sorties.`
    });
  };

  const resetScenario = () => {
    setSelectedTail('AP-104');
    setGroundingDurationHours(72);
    setSpareDelayDays(2);
    setOperationalTempo('NORMAL');
  };

  return (
    <div className="space-y-5">
      {/* Scope and Disclaimer */}
      <div className="bg-[#0e1524] border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200 font-semibold">Deterministic Digital-Twin Forecast:</span>
          <span className="text-slate-400">
            Simulate the operational fleet impact of grounding an airframe or suffering logistical delays.
          </span>
        </div>
        <div className="text-[11px] font-mono-code text-slate-400">
          Simulation Engine: <span className="text-slate-200">AeroPulse-Availability-v0.6</span>
        </div>
      </div>

      {/* Control Panel and What-If Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 bg-[#0d1322] border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              Scenario Control Parameters
            </h2>
            <button
              onClick={resetScenario}
              className="text-[11px] font-mono-code text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Select Tail to Ground */}
          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1.5">
              Select Airframe to Ground:
            </label>
            <select
              value={selectedTail}
              onChange={(e) => setSelectedTail(e.target.value)}
              className="w-full bg-[#0a0f19] border border-slate-700 text-slate-200 px-3 py-2 text-xs font-mono-code focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {aircraftList.map((a) => (
                <option key={a.tailId} value={a.tailId}>
                  {a.tailId} ({a.platform} - {a.base})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Currently testing: <span className="text-sky-300 font-mono-code">{selectedTail}</span>
            </p>
          </div>

          {/* Grounding Duration Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono-code text-slate-300 mb-1.5">
              <span>Simulated Unscheduled Downtime:</span>
              <span className="text-sky-400 font-bold">{groundingDurationHours} Hours</span>
            </div>
            <input
              type="range"
              min="24"
              max="168"
              step="12"
              value={groundingDurationHours}
              onChange={(e) => setGroundingDurationHours(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-code text-slate-500 mt-1">
              <span>24h (Quick Swap)</span>
              <span>72h (Standard)</span>
              <span>168h (7 Days)</span>
            </div>
          </div>

          {/* Spares Lead Time Delay Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono-code text-slate-300 mb-1.5">
              <span>Depot Spares Transit Delay:</span>
              <span className="text-amber-400 font-bold">+{spareDelayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={spareDelayDays}
              onChange={(e) => setSpareDelayDays(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-code text-slate-500 mt-1">
              <span>0 Days (On Hand)</span>
              <span>2 Days (Air Transfer)</span>
              <span>7 Days (Stockout)</span>
            </div>
          </div>

          {/* Operational Tempo Selection */}
          <div>
            <label className="block text-xs font-mono-code text-slate-300 mb-1.5">
              Operational Fleet Tempo:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOperationalTempo('NORMAL')}
                className={`py-2 px-3 text-xs font-mono-code text-center cursor-pointer transition-colors ${
                  operationalTempo === 'NORMAL'
                    ? 'bg-sky-950 text-sky-200 border border-sky-700 font-semibold'
                    : 'bg-[#0a0f19] text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Normal Peacetime
              </button>
              <button
                type="button"
                onClick={() => setOperationalTempo('SURGE')}
                className={`py-2 px-3 text-xs font-mono-code text-center cursor-pointer transition-colors ${
                  operationalTempo === 'SURGE'
                    ? 'bg-rose-950 text-rose-200 border border-rose-700 font-semibold'
                    : 'bg-[#0a0f19] text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                High-Tempo Surge
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleSaveScenarioAudit}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono-code font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-sky-400" />
              <span>Record Scenario Evaluation in Audit Log</span>
            </button>
          </div>
        </div>

        {/* Delta Results Matrix (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Key Deltas Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#0d1322] border border-slate-800 p-4">
              <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-1">
                7-Day Availability
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-code text-white">
                  {scenario7Day}%
                </span>
                <span className="text-xs font-mono-code font-semibold text-rose-400">
                  {delta7Day}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Baseline was <span className="font-mono-code text-slate-300">{baseline7Day}%</span>
              </div>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 p-4">
              <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-1">
                30-Day Mean Availability
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-code text-white">
                  {scenario30Day}%
                </span>
                <span className="text-xs font-mono-code font-semibold text-rose-400">
                  {delta30Day}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Baseline was <span className="font-mono-code text-slate-300">{baseline30Day}%</span>
              </div>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 p-4 border-l-2 border-l-rose-500">
              <div className="text-[11px] font-mono-code text-rose-300 uppercase tracking-wider mb-1">
                Sortie Fulfillment Risk
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-code text-white">
                  {scenarioSorties}%
                </span>
                <span className="text-xs font-mono-code font-semibold text-rose-400">
                  {deltaSorties}%
                </span>
              </div>
              <div className="text-[11px] text-rose-400 font-mono-code mt-1">
                Risk of {strandedSortiesCount} stranded sorties
              </div>
            </div>
          </div>

          {/* Comparative Table: Baseline vs Simulated Scenario */}
          <div className="bg-[#0d1322] border border-slate-800">
            <div className="p-3.5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0">
                Baseline vs Simulated Scenario Comparison
              </h3>
              <span className="text-[11px] font-mono-code text-slate-400">
                Deterministic Constraint Model
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0b101c] border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-3.5">Operational Metric</th>
                    <th className="py-2.5 px-3">Baseline Plan</th>
                    <th className="py-2.5 px-3">Simulated Grounding</th>
                    <th className="py-2.5 px-3">Variance / Delta</th>
                    <th className="py-2.5 px-3">Operational Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono-code">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3.5 font-bold text-slate-200">
                      Forward Operating Readiness (Base Bravo)
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">2 of 3 Tails (66.7%)</td>
                    <td className="py-2.5 px-3 text-rose-300">1 of 3 Tails (33.3%)</td>
                    <td className="py-2.5 px-3 text-rose-400 font-bold">-33.4%</td>
                    <td className="py-2.5 px-3 text-slate-400">Loss of tactical rotation depth at Base Bravo</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3.5 font-bold text-slate-200">
                      Hangar Bay Capacity Load (Bravo Bay 2)
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">33.3% Utilization</td>
                    <td className="py-2.5 px-3 text-amber-300">100.0% Saturated</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">+66.7%</td>
                    <td className="py-2.5 px-3 text-slate-400">No secondary maintenance bay available for unscheduled aborts</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3.5 font-bold text-slate-200">
                      Propulsion Level 3 Specialist Load
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">40% Shift Time</td>
                    <td className="py-2.5 px-3 text-amber-300">95% Dedicated</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">+55.0%</td>
                    <td className="py-2.5 px-3 text-slate-400">Technician locked on AP-104 turbine overhaul</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3.5 font-bold text-slate-200">
                      Depot Spares Reservation (HPT-8842-B)
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">Unreserved (4 Available)</td>
                    <td className="py-2.5 px-3 text-sky-300">1 Unit Locked & In Transit</td>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">-1 Unit</td>
                    <td className="py-2.5 px-3 text-slate-400">Reduces Central Depot safety buffer from 4 to 3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Explicit Model Assumptions Box */}
          <div className="bg-[#0b101c] border border-slate-800 p-4 space-y-2 text-xs">
            <h4 className="text-slate-300 font-mono-code font-bold uppercase tracking-wider m-0">
              Deterministic Simulation Assumptions & Rules
            </h4>
            <ul className="text-slate-400 space-y-1 list-disc list-inside text-[11px] leading-relaxed">
              <li>Assumes fixed sortie generation rate of 2.4 sorties per mission-ready tail per week.</li>
              <li>Enforces strict non-cannibalization policy between operational airframes.</li>
              <li>Hangar bay work occurs in two 10-hour technician shifts per calendar day.</li>
              <li>Spares transit from Delta Central Depot via priority military transport takes 14 flight hours.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
