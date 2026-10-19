import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Plane, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  RotateCcw,
  SendHorizontal,
  Clock
} from 'lucide-react';
import { SPARES_INVENTORY, BASES } from '../data/fleetData';

export default function SparesLogistics({ onLogAuditAction }) {
  const [inventory, setInventory] = useState(SPARES_INVENTORY);
  const [isTransferDispatched, setIsTransferDispatched] = useState(false);
  const [dispatchTime, setDispatchTime] = useState(null);

  const handleDispatchTransfer = () => {
    setIsTransferDispatched(true);
    setDispatchTime('2026-10-19 06:15 UTC');

    // Update inventory stock for HPT-8842-B
    setInventory(prev => prev.map(item => {
      if (item.partNumber === 'HPT-8842-B') {
        return {
          ...item,
          baseStock: {
            ...item.baseStock,
            'BASE-BRAVO': { ...item.baseStock['BASE-BRAVO'], reserved: 1 },
            'DEPOT-DELTA': { ...item.baseStock['DEPOT-DELTA'], reserved: 2 }
          }
        };
      }
      return item;
    }));

    onLogAuditAction({
      action: 'SPARES_EXPEDITED_TRANSFER_DISPATCHED',
      tailId: 'AP-104',
      summary: 'Authorized tactical air transfer of 1x HPT-8842-B (Turbine Blade Set) from Delta Central Depot to Base Bravo.',
      justification: 'Expedited air courier ETA T+14 hours. Resolves blocking constraint for TSK-502 engine maintenance.'
    });
  };

  return (
    <div className="space-y-5">
      {/* Scope Disclaimer */}
      <div className="bg-[#0e1524] border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Package className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200 font-semibold">Logistics & Spares Optimization:</span>
          <span className="text-slate-400">
            Multi-base inventory visibility, stockout prediction, and automated transfer route calculation.
          </span>
        </div>
        <div className="text-[11px] font-mono-code text-slate-400">
          Routing Logic: <span className="text-slate-200">Least-Lead-Time Air Freight Heuristic</span>
        </div>
      </div>

      {/* Critical Shortfall & Recommended Route Card */}
      <div className="bg-[#0d1322] border border-slate-800 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0">
              Active Stockout Shortfall & Proposed Routing
            </h2>
          </div>
          <span className="text-xs font-mono-code px-2 py-0.5 bg-rose-950 border border-rose-800 text-rose-300">
            AOG BLOCKING SHORTFALL
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-[#0a0f19] border border-slate-800 p-3.5 space-y-3">
            <div className="flex justify-between items-start text-xs font-mono-code">
              <div>
                <span className="text-slate-400">Target Airframe:</span> <strong className="text-white">AP-104 (Base Bravo)</strong>
                <span className="mx-2 text-slate-600">|</span>
                <span className="text-slate-400">Required Part:</span> <strong className="text-sky-300">HPT-8842-B</strong>
              </div>
              <span className="text-rose-400 font-bold">Deficit: 1 Unit Needed</span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              Base Bravo currently holds <strong className="text-rose-400">0 on-hand units</strong> of High-Pressure Turbine Stage 2 Blade sets. 
              Standard supplier lead time is 28 days. Central Depot at Delta has 4 units on hand, enabling an expedited tactical air shuttle transfer.
            </div>

            {/* Transfer Route Diagram */}
            <div className="bg-[#080d16] border border-slate-800/80 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500"></span>
                <div>
                  <div className="text-slate-400 text-[10px]">ORIGIN</div>
                  <div className="text-white font-bold">Delta Central Depot (DCD)</div>
                  <div className="text-[11px] text-emerald-400">4 Units Available</div>
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                  <Plane className="w-3 h-3 text-sky-400" />
                  <span>Tactical Air Transport (14h)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <span>- - - -</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                  <span>- - - -</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500"></span>
                <div>
                  <div className="text-slate-400 text-[10px]">DESTINATION</div>
                  <div className="text-white font-bold">Base Bravo (BRV)</div>
                  <div className="text-[11px] text-rose-400">0 Units Available</div>
                </div>
              </div>
            </div>

            {/* Transfer State */}
            {isTransferDispatched ? (
              <div className="bg-emerald-950/40 border border-emerald-800 p-2.5 flex items-center justify-between text-xs font-mono-code text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Air Transport Dispatched at {dispatchTime}. Transit in progress (ETA T+14 Hours).</span>
                </div>
                <span className="bg-emerald-900/80 text-emerald-200 px-2 py-0.5 text-[10px]">IN TRANSIT</span>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono-code text-slate-400">
                  Estimated Air Freight Cost: $2,400 | Transit: 14h
                </span>
                <button
                  onClick={handleDispatchTransfer}
                  className="px-3.5 py-1.5 bg-sky-900 hover:bg-sky-800 text-white border border-sky-600 text-xs font-mono-code font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <SendHorizontal className="w-3.5 h-3.5 text-sky-300" />
                  <span>Authorize Expedited Air Transfer</span>
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-[#0a0f19] border border-slate-800 p-3.5 space-y-2 text-xs">
            <div className="text-slate-300 font-bold font-mono-code uppercase">
              Supply Lead Time Summary
            </div>
            <div className="space-y-1.5 font-mono-code text-[11px] text-slate-400 pt-1">
              <div className="flex justify-between">
                <span>Standard Vendor Replenish:</span>
                <span className="text-slate-300">28 Days</span>
              </div>
              <div className="flex justify-between">
                <span>Central Depot Air Shuttle:</span>
                <span className="text-emerald-400 font-bold">14 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Surface Ground Transport:</span>
                <span className="text-slate-300">72 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Part Unit Value:</span>
                <span className="text-slate-300">$142,000</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              Transfer recommendation verified against depot safety stock buffer requirements.
            </div>
          </div>
        </div>
      </div>

      {/* Complete Spares Inventory Matrix */}
      <div className="bg-[#0d1322] border border-slate-800">
        <div className="p-3.5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold font-mono-code uppercase tracking-wider text-white m-0">
              Multi-Base Line Replaceable Unit (LRU) Inventory Matrix
            </h3>
          </div>
          <span className="text-xs font-mono-code text-slate-400">
            Across 3 Forward Airbases + Central Depot
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b101c] border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-3.5">Part Number</th>
                <th className="py-2.5 px-3">Description / Subsystem</th>
                <th className="py-2.5 px-3 text-center">Base Alpha (Ambala)</th>
                <th className="py-2.5 px-3 text-center">Base Bravo (Jodhpur)</th>
                <th className="py-2.5 px-3 text-center">Base Charlie (Hasimara)</th>
                <th className="py-2.5 px-3 text-center">Delta Central Depot</th>
                <th className="py-2.5 px-3 text-right">Lead Time (Air)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono-code">
              {inventory.map((item) => {
                const bravoStock = item.baseStock['BASE-BRAVO'];
                const isShortage = bravoStock.onHand === 0;

                return (
                  <tr key={item.partNumber} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3.5 font-bold text-sky-300">
                      {item.partNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.subsystem}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-slate-300">
                        {item.baseStock['BASE-ALPHA'].onHand} on hand
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isShortage ? (
                        <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-800 px-2 py-0.5">
                          0 on hand (Shortfall)
                        </span>
                      ) : (
                        <span className="text-slate-300">
                          {bravoStock.onHand} on hand
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-slate-300">
                        {item.baseStock['BASE-CHARLIE'].onHand} on hand
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-emerald-400 font-bold">
                        {item.baseStock['DEPOT-DELTA'].onHand} units
                      </span>
                      <span className="text-slate-500 text-[10px] ml-1">
                        ({item.baseStock['DEPOT-DELTA'].reserved} reserved)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {item.expeditedAirHours} Hours
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
