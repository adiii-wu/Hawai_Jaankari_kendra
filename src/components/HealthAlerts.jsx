import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Check, 
  Clock, 
  FileCheck, 
  Send, 
  ChevronRight,
  HelpCircle,
  PackageCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { SENSOR_TELEMETRY_SERIES } from '../data/fleetData';

export default function HealthAlerts({ 
  alerts, 
  selectedAlertId, 
  onSelectAlertId, 
  onUpdateAlertDisposition,
  onNavigateToSpares,
  onNavigateToSchedule
}) {
  const [activeAlertId, setActiveAlertId] = useState(selectedAlertId || alerts[0]?.id || 'ALT-2026-0881');
  const [maintainerNoteInput, setMaintainerNoteInput] = useState('');
  const [selectedSensorChart, setSelectedSensorChart] = useState('egt'); // 'egt' or 'vibration' or 'pressure'

  const activeAlert = alerts.find(a => a.id === activeAlertId) || alerts[0];

  const handleAction = (status, actionLabel) => {
    const note = maintainerNoteInput.trim() 
      ? maintainerNoteInput.trim() 
      : `Maintainer triggered action: ${actionLabel}`;
    
    onUpdateAlertDisposition(activeAlert.id, status, note, actionLabel);
    setMaintainerNoteInput('');
  };

  // Telemetry chart helper for SVG visualization
  const maxCycles = 15;
  const chartHeight = 160;
  const chartWidth = 560;

  // Normalization for EGT (640 - 740 C)
  const getEgtY = (val) => {
    const min = 640;
    const max = 740;
    return chartHeight - ((val - min) / (max - min)) * (chartHeight - 30) - 15;
  };

  // Normalization for Vibration (1.0 - 5.5 mm/s)
  const getVibY = (val) => {
    const min = 1.0;
    const max = 5.5;
    return chartHeight - ((val - min) / (max - min)) * (chartHeight - 30) - 15;
  };

  const getX = (cycle) => {
    return 40 + ((cycle - 1) / (maxCycles - 1)) * (chartWidth - 60);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Alert Inbox Column (4 cols) */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-[#0d1322] border border-slate-800 p-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0">
                Prognostic Alert Inbox
              </h2>
            </div>
            <span className="text-xs font-mono-code bg-slate-800 text-slate-300 px-2 py-0.5">
              {alerts.length} Total Warnings
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Anomaly alerts detected by statistical thresholds and public benchmark RUL models.
          </p>

          <div className="space-y-2">
            {alerts.map((alt) => {
              const isSelected = alt.id === activeAlertId;
              const isCrit = alt.severity === 'CRITICAL';
              return (
                <div
                  key={alt.id}
                  onClick={() => {
                    setActiveAlertId(alt.id);
                    if (onSelectAlertId) onSelectAlertId(alt.id);
                  }}
                  className={`p-3 border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#141d30] border-sky-500 shadow-sm'
                      : 'bg-[#0a0f19] border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-sky-300">{alt.tailId}</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-slate-400 text-[11px]">{alt.id}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 uppercase font-semibold ${
                      isCrit 
                        ? 'bg-rose-950 border border-rose-800 text-rose-300' 
                        : 'bg-amber-950 border border-amber-800 text-amber-300'
                    }`}>
                      {alt.severity}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-200 line-clamp-1 mb-1">
                    {alt.componentName}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono-code pt-1 border-t border-slate-800/80">
                    <span>RUL: <strong className={isCrit ? 'text-rose-400' : 'text-amber-400'}>{alt.estimatedRulCycles} cycles</strong></span>
                    <span className="text-slate-500">{alt.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Boundary Notice Box */}
        <div className="bg-[#0b101c] border border-slate-800 p-3.5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold font-mono-code">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Prognostic Model Limitations</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Current estimates are derived from NASA C-MAPSS FD001 run-to-failure benchmarks. 
            Output calibrated to provide uncertainty intervals rather than false point-certainty.
          </p>
          <div className="text-[10px] font-mono-code text-slate-500 pt-1 border-t border-slate-800">
            Calibration Confidence: 95% CI bounds displayed for maintainer review.
          </div>
        </div>
      </div>

      {/* Alert Detail & Explainability Panel (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        {activeAlert ? (
          <div className="bg-[#0d1322] border border-slate-800 p-5 space-y-5">
            {/* Alert Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 font-mono-code text-xs mb-1">
                  <span className="text-sky-400 font-bold">{activeAlert.tailId}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300 font-semibold">{activeAlert.id}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500">{activeAlert.detectedAt}</span>
                </div>
                <h2 className="text-base font-bold text-white m-0">
                  {activeAlert.componentName}
                </h2>
                <div className="text-xs text-slate-400 font-mono-code mt-0.5">
                  Part Number: <span className="text-slate-200">{activeAlert.partNumber}</span>
                  <span className="mx-2 text-slate-600">|</span>
                  Subsystem ID: <span className="text-slate-200">{activeAlert.componentId}</span>
                </div>
              </div>

              {/* Status / Urgency Badge */}
              <div className="text-right">
                <div className="text-xs font-mono-code text-slate-400 uppercase">Estimated RUL</div>
                <div className="text-2xl font-bold font-mono-code text-rose-400">
                  {activeAlert.estimatedRulCycles} <span className="text-xs font-normal text-slate-400">Cycles</span>
                </div>
                <div className="text-[11px] font-mono-code text-slate-400">
                  {activeAlert.rulConfidenceRange}
                </div>
              </div>
            </div>

            {/* Benchmark Label */}
            <div className="bg-[#0b101c] border border-slate-800 p-3 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono-code">Inference Model:</span>
                <span className="text-sky-300 font-mono-code font-semibold">{activeAlert.modelInfo}</span>
              </div>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 text-slate-300 font-mono-code">
                BENCHMARK DATASET
              </span>
            </div>

            {/* Diagnostic Summary */}
            <div>
              <h3 className="text-xs font-bold font-mono-code text-slate-300 uppercase tracking-wider mb-1.5">
                Diagnostic Anomaly Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0b0f19] border border-slate-800/80 p-3">
                {activeAlert.summary}
              </p>
            </div>

            {/* Explainable Supporting Signals */}
            <div>
              <h3 className="text-xs font-bold font-mono-code text-slate-300 uppercase tracking-wider mb-2">
                Explainable Contributing Telemetry Signals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeAlert.evidenceSignals.map((sig, idx) => {
                  const isAlert = sig.status === 'ALERT';
                  const isWarn = sig.status === 'WARNING';
                  return (
                    <div 
                      key={idx} 
                      className={`p-3 border text-xs ${
                        isAlert 
                          ? 'bg-rose-950/20 border-rose-800/70' 
                          : isWarn 
                          ? 'bg-amber-950/20 border-amber-800/70' 
                          : 'bg-[#0a0f19] border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center text-slate-300 font-medium mb-1">
                        <span>{sig.signal}</span>
                        <span className={`text-[10px] font-mono-code px-1.5 py-0.2 uppercase font-semibold ${
                          isAlert 
                            ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                            : isWarn 
                            ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {sig.status}
                        </span>
                      </div>
                      <div className="text-lg font-bold font-mono-code text-white my-0.5">
                        {sig.currentValue}
                      </div>
                      <div className="text-[11px] font-mono-code text-slate-400">
                        Baseline: {sig.baselineRange}
                      </div>
                      <div className={`text-[11px] font-mono-code mt-1 ${isAlert ? 'text-rose-400 font-semibold' : 'text-amber-400'}`}>
                        Deviation: {sig.deviation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Sensor Trend Curve */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-xs font-bold font-mono-code text-slate-300 uppercase tracking-wider m-0 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>Degradation Trend Analysis (Flight Cycles 1 to 15)</span>
                </h3>
                <div className="flex gap-1 text-xs font-mono-code">
                  <button
                    onClick={() => setSelectedSensorChart('egt')}
                    className={`px-2 py-0.5 cursor-pointer ${
                      selectedSensorChart === 'egt'
                        ? 'bg-sky-950 text-sky-200 border border-sky-700 font-semibold'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    Exhaust Gas Temp (°C)
                  </button>
                  <button
                    onClick={() => setSelectedSensorChart('vibration')}
                    className={`px-2 py-0.5 cursor-pointer ${
                      selectedSensorChart === 'vibration'
                        ? 'bg-sky-950 text-sky-200 border border-sky-700 font-semibold'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    Core Vibration (mm/s)
                  </button>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="bg-[#080c14] border border-slate-800 p-3 overflow-x-auto">
                <svg width={chartWidth} height={chartHeight} className="w-full h-auto min-w-[500px]">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2={chartWidth - 20} y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="55" x2={chartWidth - 20} y2="55" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="90" x2={chartWidth - 20} y2="90" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="125" x2={chartWidth - 20} y2="125" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* Nominal Threshold Band */}
                  {selectedSensorChart === 'egt' ? (
                    <>
                      {/* Critical line at 685 C */}
                      <line 
                        x1="40" 
                        y1={getEgtY(685)} 
                        x2={chartWidth - 20} 
                        y2={getEgtY(685)} 
                        stroke="#ef4444" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4" 
                      />
                      <text x={chartWidth - 25} y={getEgtY(685) - 4} fill="#ef4444" fontSize="10" textAnchor="end" fontFamily="monospace">
                        Alert Limit: 685 °C
                      </text>
                      {/* Data path */}
                      <path
                        d={SENSOR_TELEMETRY_SERIES.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.cycle)} ${getEgtY(d.egt)}`).join(' ')}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                      />
                      {/* Data points */}
                      {SENSOR_TELEMETRY_SERIES.map((d, i) => (
                        <circle
                          key={i}
                          cx={getX(d.cycle)}
                          cy={getEgtY(d.egt)}
                          r="3"
                          fill={d.egt > 685 ? '#ef4444' : '#0284c7'}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      ))}
                      {/* Y-axis labels */}
                      <text x="35" y={getEgtY(730)} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">730°</text>
                      <text x="35" y={getEgtY(685)} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">685°</text>
                      <text x="35" y={getEgtY(650)} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">650°</text>
                    </>
                  ) : (
                    <>
                      {/* Vibration Limit 3.2 mm/s */}
                      <line 
                        x1="40" 
                        y1={getVibY(3.2)} 
                        x2={chartWidth - 20} 
                        y2={getVibY(3.2)} 
                        stroke="#ef4444" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4" 
                      />
                      <text x={chartWidth - 25} y={getVibY(3.2) - 4} fill="#ef4444" fontSize="10" textAnchor="end" fontFamily="monospace">
                        Alert Threshold: 3.20 mm/s
                      </text>
                      <path
                        d={SENSOR_TELEMETRY_SERIES.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.cycle)} ${getVibY(d.vibration)}`).join(' ')}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                      />
                      {SENSOR_TELEMETRY_SERIES.map((d, i) => (
                        <circle
                          key={i}
                          cx={getX(d.cycle)}
                          cy={getVibY(d.vibration)}
                          r="3"
                          fill={d.vibration > 3.2 ? '#ef4444' : '#10b981'}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      ))}
                      <text x="35" y={getVibY(5.0)} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">5.0</text>
                      <text x="35" y={getVibY(3.2)} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">3.2</text>
                      <text x="35" y={getVibY(1.5)} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">1.5</text>
                    </>
                  )}

                  {/* X-axis labels */}
                  <text x={getX(1)} y={chartHeight - 2} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">C1</text>
                  <text x={getX(5)} y={chartHeight - 2} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">C5</text>
                  <text x={getX(10)} y={chartHeight - 2} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">C10</text>
                  <text x={getX(15)} y={chartHeight - 2} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">C15 (Now)</text>
                </svg>
              </div>
            </div>

            {/* Recommended Feasible Action */}
            <div className="bg-[#101827] border border-sky-800/80 p-3.5 text-xs">
              <div className="text-sky-300 font-bold font-mono-code uppercase mb-1">
                Prescribed Resource-Constrained Maintenance Recommendation
              </div>
              <p className="text-slate-200 leading-relaxed mb-2">
                {activeAlert.recommendedAction}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 font-mono-code text-[11px] text-slate-400">
                <span>Spares Required: <strong className="text-amber-300">{activeAlert.sparesRequired}</strong></span>
                <span className="text-slate-600">|</span>
                <span>Base Bravo Stock: <strong className="text-rose-400">0 On Hand (Deficit)</strong></span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={onNavigateToSpares}
                  className="text-sky-400 hover:text-sky-300 underline font-semibold cursor-pointer"
                >
                  Inspect Spares Transfer Route
                </button>
              </div>
            </div>

            {/* Maintainer Disposition & Audit Console */}
            <div className="border border-slate-800 bg-[#0a0f18] p-4 space-y-3">
              <h3 className="text-xs font-bold font-mono-code text-slate-300 uppercase tracking-wider m-0">
                Maintainer Disposition & Feedback Logging
              </h3>
              <p className="text-[11px] text-slate-400">
                Action will be permanently recorded in the append-only system audit trail with user signature and timestamp.
              </p>

              <div>
                <label className="block text-[11px] font-mono-code text-slate-400 mb-1">
                  Maintainer Justification / Inspection Notes:
                </label>
                <input
                  type="text"
                  value={maintainerNoteInput}
                  onChange={(e) => setMaintainerNoteInput(e.target.value)}
                  placeholder="e.g., Confirmed Stage 2 blade tip discoloration via borescope port 3B."
                  className="w-full bg-[#070b12] border border-slate-700 px-3 py-2 text-xs text-slate-200 font-mono-code focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Action Buttons (Strictly rectangular, no pill shapes) */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleAction('SCHEDULED', 'Accept & Stage Bay Swap')}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 text-xs font-mono-code font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Accept Warning & Schedule Bay Swap</span>
                </button>

                <button
                  onClick={() => handleAction('DEFERRED', 'Defer 24h with Throttle Limit')}
                  className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700 text-xs font-mono-code font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Defer +24h (Restrict to Subsonic Transit)</span>
                </button>

                <button
                  onClick={() => handleAction('FLAGGED_FALSE_POSITIVE', 'Flag Transducer Calibration')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono-code font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Flag Sensor False Positive / Recalibrate</span>
                </button>
              </div>

              {/* Disposition History */}
              {activeAlert.maintainerNotes && activeAlert.maintainerNotes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono-code text-slate-400 font-semibold">
                    Recorded Maintainer Feedback:
                  </div>
                  {activeAlert.maintainerNotes.map((note, idx) => (
                    <div key={idx} className="text-xs text-slate-300 font-mono-code bg-[#080d16] p-2 border border-slate-800/80">
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#0d1322] border border-slate-800 p-8 text-center text-slate-400">
            No alert selected.
          </div>
        )}
      </div>
    </div>
  );
}
