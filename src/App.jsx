import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FleetOverview from './components/FleetOverview';
import HealthAlerts from './components/HealthAlerts';
import DigitalTwinScenario from './components/DigitalTwinScenario';
import MaintenanceScheduler from './components/MaintenanceScheduler';
import SparesLogistics from './components/SparesLogistics';
import DataQuality from './components/DataQuality';
import AuditTrail from './components/AuditTrail';
import AircraftDetailModal from './components/AircraftDetailModal';

import { 
  INITIAL_AIRCRAFT, 
  INITIAL_ALERTS, 
  INITIAL_AUDIT_LOG 
} from './data/fleetData';

export default function App() {
  const [currentRole, setCurrentRole] = useState('COMMANDER');
  const [activeTab, setActiveTab] = useState('fleet');
  
  // State for data
  const [aircraftList, setAircraftList] = useState(INITIAL_AIRCRAFT);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOG);
  const [simulatedCycle, setSimulatedCycle] = useState(15);
  
  // Modal & focus states
  const [selectedTailModal, setSelectedTailModal] = useState(null);
  const [selectedAlertId, setSelectedAlertId] = useState('ALT-2026-0881');

  // Log action to audit ledger
  const handleLogAuditAction = (entry) => {
    const newLog = {
      id: `AUD-00${auditLogs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actorRole: currentRole,
      actorName: getActorDisplayName(currentRole),
      action: entry.action || 'USER_ACTION',
      tailId: entry.tailId || 'SYSTEM',
      summary: entry.summary,
      justification: entry.justification || 'Operational protocol execution'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getActorDisplayName = (role) => {
    switch (role) {
      case 'COMMANDER': return 'Col. S. Deshmukh (Wing Commander)';
      case 'MAINTAINER': return 'Master Sgt. R. Sharma (Propulsion Lead)';
      case 'LOGISTICS': return 'Capt. A. Verghese (Supply Operations)';
      case 'ADMIN': return 'Flight Lt. P. Nair (System Admin)';
      default: return 'Authorized User';
    }
  };

  // Disposition update from Maintainer console
  const handleUpdateAlertDisposition = (alertId, newStatus, note, actionLabel) => {
    setAlerts(prev => prev.map(alt => {
      if (alt.id === alertId) {
        return {
          ...alt,
          status: newStatus,
          maintainerNotes: [
            `${new Date().toISOString().slice(0, 16)} [${currentRole}] ${note}`,
            ...(alt.maintainerNotes || [])
          ]
        };
      }
      return alt;
    }));

    handleLogAuditAction({
      action: `ALERT_DISPOSITION_${newStatus}`,
      tailId: alerts.find(a => a.id === alertId)?.tailId || 'UNKNOWN',
      summary: `Maintainer action recorded: ${actionLabel} on warning ${alertId}.`,
      justification: note
    });
  };

  // Reset to canonical seed
  const handleResetData = () => {
    setAircraftList(INITIAL_AIRCRAFT);
    setAlerts(INITIAL_ALERTS);
    setSimulatedCycle(15);
    handleLogAuditAction({
      action: 'DATASET_RESET_TO_SEED',
      tailId: 'ALL_FLEET',
      summary: 'Reset all airframes, telemetry feeds, and alert dispositions to initial canonical state.',
      justification: 'User initiated repeatable demo reset.'
    });
  };

  // Step cycle simulation
  const handleSimulateStep = () => {
    const nextCycle = simulatedCycle + 1;
    setSimulatedCycle(nextCycle);
    
    // Increment hours and cycles slightly
    setAircraftList(prev => prev.map(a => {
      if (a.status === 'IN_MISSION') {
        return {
          ...a,
          airframeHours: +(a.airframeHours + 1.5).toFixed(1),
          totalCycles: a.totalCycles + 1
        };
      }
      return a;
    }));

    handleLogAuditAction({
      action: 'SIMULATION_CYCLE_STEPPED',
      tailId: 'FLEET',
      summary: `Advanced operational simulation clock to Cycle ${nextCycle}. Ingested new telemetry frame.`,
      justification: 'Automated replay progression.'
    });
  };

  // Navigation callbacks
  const handleNavigateToAlert = (alertId) => {
    setSelectedAlertId(alertId);
    setActiveTab('alerts');
  };

  const handleNavigateToScenario = () => {
    setActiveTab('scenario');
  };

  const handleNavigateToSpares = () => {
    setActiveTab('spares');
  };

  const handleNavigateToSchedule = () => {
    setActiveTab('schedule');
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans">
      {/* Primary Top Bar & Nav */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        onSimulateStep={handleSimulateStep}
        auditCount={auditLogs.length}
        alertCount={alerts.filter(a => a.status === 'ACTIVE_REVIEW').length}
        simulatedCycle={simulatedCycle}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'fleet' && (
          <FleetOverview
            aircraftList={aircraftList}
            onSelectTail={(tail) => setSelectedTailModal(tail)}
            onNavigateToAlert={handleNavigateToAlert}
            onNavigateToScenario={handleNavigateToScenario}
          />
        )}

        {activeTab === 'alerts' && (
          <HealthAlerts
            alerts={alerts}
            selectedAlertId={selectedAlertId}
            onSelectAlertId={setSelectedAlertId}
            onUpdateAlertDisposition={handleUpdateAlertDisposition}
            onNavigateToSpares={handleNavigateToSpares}
            onNavigateToSchedule={handleNavigateToSchedule}
          />
        )}

        {activeTab === 'scenario' && (
          <DigitalTwinScenario
            aircraftList={aircraftList}
            onLogAuditAction={handleLogAuditAction}
          />
        )}

        {activeTab === 'schedule' && (
          <MaintenanceScheduler
            onNavigateToSpares={handleNavigateToSpares}
            onLogAuditAction={handleLogAuditAction}
          />
        )}

        {activeTab === 'spares' && (
          <SparesLogistics
            onLogAuditAction={handleLogAuditAction}
          />
        )}

        {activeTab === 'dataquality' && (
          <DataQuality
            onLogAuditAction={handleLogAuditAction}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrail
            auditLogs={auditLogs}
          />
        )}
      </main>

      {/* Airframe Detail Modal */}
      {selectedTailModal && (
        <AircraftDetailModal
          aircraft={selectedTailModal}
          onClose={() => setSelectedTailModal(null)}
          onNavigateToScenario={handleNavigateToScenario}
          onNavigateToAlert={handleNavigateToAlert}
        />
      )}

      {/* Technical Industrial Footer (Strictly without any 'Made with AI' tag) */}
      <footer className="border-t border-slate-800/80 bg-[#070a10] py-4 px-6 mt-12 text-xs text-slate-500 font-mono-code">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-300 font-bold">AEROPULSE</span>
            <span>/</span>
            <span>AIRCRAFT FLEET HEALTH & DECISION SUPPORT SYSTEM</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">OFFLINE-FIRST LOCAL DEPLOYMENT</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>BENCHMARK: C-MAPSS FD001</span>
            <span>•</span>
            <span>SCHEMA: CANONICAL V1</span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">DECISION-SUPPORT PROTOTYPE ONLY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
