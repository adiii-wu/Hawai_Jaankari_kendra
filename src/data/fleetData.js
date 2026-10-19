// AeroPulse Synthetic Canonical Fleet Data
// Strictly adhering to benchmark standards: C-MAPSS FD001 Turbofan Benchmark
// Note: All identifiers and operational telemetry are synthetic.

export const BASES = [
  { id: 'BASE-ALPHA', name: 'Base Alpha (Northern Sector)', code: 'ALP', hangarBays: 4, techsAvailable: 8 },
  { id: 'BASE-BRAVO', name: 'Base Bravo (Western Sector)', code: 'BRV', hangarBays: 3, techsAvailable: 5 },
  { id: 'BASE-CHARLIE', name: 'Base Charlie (Eastern Sector)', code: 'CHL', hangarBays: 3, techsAvailable: 6 },
  { id: 'DEPOT-DELTA', name: 'Delta Central Depot', code: 'DCD', hangarBays: 12, techsAvailable: 30 }
];

export const INITIAL_AIRCRAFT = [
  {
    tailId: 'AP-101',
    platform: 'AP-X Multirole Airframe',
    base: 'BASE-ALPHA',
    status: 'AVAILABLE',
    airframeHours: 1842.5,
    totalCycles: 1120,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-11-15',
    currentMission: 'QRA Standby'
  },
  {
    tailId: 'AP-102',
    platform: 'AP-X Multirole Airframe',
    base: 'BASE-ALPHA',
    status: 'IN_MISSION',
    airframeHours: 1980.2,
    totalCycles: 1240,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-11-04',
    currentMission: 'Combat Air Patrol (Sortie CAP-08)'
  },
  {
    tailId: 'AP-103',
    platform: 'AP-X Multirole Airframe',
    base: 'BASE-ALPHA',
    status: 'AVAILABLE',
    airframeHours: 1420.0,
    totalCycles: 890,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-11-28',
    currentMission: 'Readiness Pool'
  },
  {
    tailId: 'AP-104',
    platform: 'AP-X Multirole Airframe',
    base: 'BASE-BRAVO',
    status: 'ALERT_DEGRADED',
    airframeHours: 2410.8,
    totalCycles: 1530,
    subsystems: {
      engine: 'CRITICAL_ANOMALY',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'WATCHLIST'
    },
    nextScheduledMaint: '2026-10-21',
    currentMission: 'Grounded Pending Disposition'
  },
  {
    tailId: 'AP-105',
    platform: 'AP-X Multirole Airframe',
    base: 'BASE-BRAVO',
    status: 'AVAILABLE',
    airframeHours: 1640.4,
    totalCycles: 1010,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-11-12',
    currentMission: 'Readiness Pool'
  },
  {
    tailId: 'AP-106',
    platform: 'AP-T Advanced Trainer',
    base: 'BASE-BRAVO',
    status: 'AVAILABLE',
    airframeHours: 920.1,
    totalCycles: 740,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-12-01',
    currentMission: 'Tactical Syllabus'
  },
  {
    tailId: 'AP-107',
    platform: 'AP-T Advanced Trainer',
    base: 'BASE-CHARLIE',
    status: 'AVAILABLE',
    airframeHours: 1115.6,
    totalCycles: 830,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-11-19',
    currentMission: 'Night Formation'
  },
  {
    tailId: 'AP-108',
    platform: 'AP-R Heavy Recon',
    base: 'BASE-CHARLIE',
    status: 'SCHEDULED_MAINT',
    airframeHours: 2890.3,
    totalCycles: 1680,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'SCHEDULED_SERVICE',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-10-20',
    currentMission: 'Hangar Bay 1: Hydraulic Actuator 500h Overhaul'
  },
  {
    tailId: 'AP-109',
    platform: 'AP-R Heavy Recon',
    base: 'BASE-CHARLIE',
    status: 'AVAILABLE',
    airframeHours: 2150.7,
    totalCycles: 1310,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-11-08',
    currentMission: 'Border ISR Patrol'
  },
  {
    tailId: 'AP-110',
    platform: 'AP-X Multirole Airframe',
    base: 'BASE-ALPHA',
    status: 'AVAILABLE',
    airframeHours: 1310.2,
    totalCycles: 820,
    subsystems: {
      engine: 'NOMINAL',
      hydraulics: 'NOMINAL',
      avionics: 'NOMINAL',
      fuel: 'NOMINAL'
    },
    nextScheduledMaint: '2026-12-10',
    currentMission: 'Readiness Pool'
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-2026-0881',
    tailId: 'AP-104',
    componentId: 'CMP-ENG-01',
    componentName: 'Turbofan Propulsion Unit #1 (High-Pressure Turbine Stage 2)',
    partNumber: 'HPT-8842-B',
    severity: 'CRITICAL',
    status: 'ACTIVE_REVIEW', // ACTIVE_REVIEW, SCHEDULED, DEFERRED, FLAGGED_FALSE_POSITIVE
    modelInfo: 'C-MAPSS FD001 Baseline RUL Model v0.4.1 (Public turbofan degradation benchmark)',
    estimatedRulCycles: 28,
    rulConfidenceRange: '21 - 34 flight cycles (95% CI)',
    urgencyText: 'Action required before next 3-sortie flight window',
    detectedAt: '2026-10-19 04:12 UTC',
    summary: 'Exhaust Gas Temperature margin degradation coupled with elevated High-Pressure Turbine spool vibration harmonic (4.8 mm/s vs 3.2 mm/s threshold). Rapid trend divergence over the past 14 sorties.',
    evidenceSignals: [
      {
        signal: 'Exhaust Gas Temperature (EGT)',
        currentValue: '724.3 °C',
        baselineRange: '640.0 - 685.0 °C',
        deviation: '+39.3 °C above nominal',
        status: 'ALERT'
      },
      {
        signal: 'Core Shaft Vibration (N2)',
        currentValue: '4.82 mm/s',
        baselineRange: '1.20 - 3.20 mm/s',
        deviation: '+1.62 mm/s above safe threshold',
        status: 'ALERT'
      },
      {
        signal: 'High-Pressure Compressor Outlet Pressure (Ps30)',
        currentValue: '512.4 psia',
        baselineRange: '535.0 - 555.0 psia',
        deviation: '-22.6 psia loss of pressure ratio',
        status: 'WARNING'
      },
      {
        signal: 'Lubrication Sump Scavenge Temp',
        currentValue: '118.2 °C',
        baselineRange: '90.0 - 115.0 °C',
        deviation: '+3.2 °C upper limit warning',
        status: 'WATCH'
      }
    ],
    recommendedAction: 'Remove and replace High-Pressure Turbine Stage 2 blade assembly (Part # HPT-8842-B). Required maintenance downtime: 36 bay hours. Requires Level-3 Propulsion Technician.',
    sparesRequired: 'HPT-8842-B',
    maintainerNotes: []
  },
  {
    id: 'ALT-2026-0879',
    tailId: 'AP-108',
    componentId: 'CMP-HYD-04',
    componentName: 'Main Flight Control Hydraulic Actuator (Port Wing)',
    partNumber: 'HYD-ACT-401',
    severity: 'MEDIUM',
    status: 'SCHEDULED',
    modelInfo: 'Weibull Cycle-to-Wear Statistical Baseline v1.2',
    estimatedRulCycles: 94,
    rulConfidenceRange: '82 - 110 flight cycles (90% CI)',
    urgencyText: 'Routine scheduled replacement during upcoming 500h depot overhaul',
    detectedAt: '2026-10-18 19:40 UTC',
    summary: 'Micro-leak pressure decay during cold-start check. Rate of return pressure drop is within non-critical threshold but qualifies for depot overhaul swap.',
    evidenceSignals: [
      {
        signal: 'Hydraulic Return Pressure Delta',
        currentValue: '2840 psi',
        baselineRange: '2950 - 3050 psi',
        deviation: '-110 psi below optimal return',
        status: 'WARNING'
      },
      {
        signal: 'Fluid Reservoir Seal Temp',
        currentValue: '62.1 °C',
        baselineRange: '50.0 - 75.0 °C',
        deviation: 'Nominal operational range',
        status: 'NOMINAL'
      }
    ],
    recommendedAction: 'Replace primary seal kit and spool valve (Part # HYD-SEAL-902). Handled concurrently in scheduled overhaul window.',
    sparesRequired: 'HYD-SEAL-902',
    maintainerNotes: ['Approved by Lead Inspector Sgt. K. Rao during pre-flight checks. Part staged at Base Charlie.']
  }
];

export const SENSOR_TELEMETRY_SERIES = [
  { cycle: 1, egt: 660, vibration: 1.8, pressure: 546, oilTemp: 96 },
  { cycle: 2, egt: 662, vibration: 1.9, pressure: 545, oilTemp: 97 },
  { cycle: 3, egt: 659, vibration: 1.8, pressure: 547, oilTemp: 95 },
  { cycle: 4, egt: 664, vibration: 2.0, pressure: 544, oilTemp: 98 },
  { cycle: 5, egt: 661, vibration: 1.9, pressure: 545, oilTemp: 96 },
  { cycle: 6, egt: 665, vibration: 2.1, pressure: 543, oilTemp: 99 },
  { cycle: 7, egt: 668, vibration: 2.2, pressure: 542, oilTemp: 99 },
  { cycle: 8, egt: 671, vibration: 2.4, pressure: 540, oilTemp: 101 },
  { cycle: 9, egt: 675, vibration: 2.6, pressure: 538, oilTemp: 102 },
  { cycle: 10, egt: 679, vibration: 2.8, pressure: 536, oilTemp: 104 },
  { cycle: 11, egt: 686, vibration: 3.1, pressure: 531, oilTemp: 106 },
  { cycle: 12, egt: 694, vibration: 3.4, pressure: 526, oilTemp: 109 },
  { cycle: 13, egt: 706, vibration: 3.9, pressure: 520, oilTemp: 113 },
  { cycle: 14, egt: 715, vibration: 4.4, pressure: 516, oilTemp: 116 },
  { cycle: 15, egt: 724, vibration: 4.8, pressure: 512, oilTemp: 118 }
];

export const SPARES_INVENTORY = [
  {
    partNumber: 'HPT-8842-B',
    name: 'High-Pressure Turbine Stage 2 Blade Set',
    subsystem: 'Propulsion',
    baseStock: {
      'BASE-ALPHA': { onHand: 1, reserved: 1, minRequired: 1 },
      'BASE-BRAVO': { onHand: 0, reserved: 0, minRequired: 1 }, // Deficit for AP-104!
      'BASE-CHARLIE': { onHand: 0, reserved: 0, minRequired: 1 },
      'DEPOT-DELTA': { onHand: 4, reserved: 1, minRequired: 2 }
    },
    unitCostUsd: 142000,
    leadTimeDaysStandard: 28,
    expeditedAirHours: 14
  },
  {
    partNumber: 'HYD-SEAL-902',
    name: 'Hydraulic Actuator Primary Seal & Spool Kit',
    subsystem: 'Flight Controls',
    baseStock: {
      'BASE-ALPHA': { onHand: 3, reserved: 0, minRequired: 2 },
      'BASE-BRAVO': { onHand: 2, reserved: 0, minRequired: 2 },
      'BASE-CHARLIE': { onHand: 2, reserved: 1, minRequired: 1 },
      'DEPOT-DELTA': { onHand: 18, reserved: 2, minRequired: 6 }
    },
    unitCostUsd: 8400,
    leadTimeDaysStandard: 10,
    expeditedAirHours: 8
  },
  {
    partNumber: 'FMU-620-REV3',
    name: 'Digital Fuel Metering & Distribution Unit',
    subsystem: 'Fuel System',
    baseStock: {
      'BASE-ALPHA': { onHand: 1, reserved: 0, minRequired: 1 },
      'BASE-BRAVO': { onHand: 1, reserved: 0, minRequired: 1 },
      'BASE-CHARLIE': { onHand: 1, reserved: 0, minRequired: 1 },
      'DEPOT-DELTA': { onHand: 5, reserved: 0, minRequired: 2 }
    },
    unitCostUsd: 96000,
    leadTimeDaysStandard: 45,
    expeditedAirHours: 18
  },
  {
    partNumber: 'RDR-TR-MOD-8',
    name: 'Active Phased Array T/R Quad-Module',
    subsystem: 'Avionics Radar',
    baseStock: {
      'BASE-ALPHA': { onHand: 4, reserved: 0, minRequired: 2 },
      'BASE-BRAVO': { onHand: 3, reserved: 0, minRequired: 2 },
      'BASE-CHARLIE': { onHand: 4, reserved: 0, minRequired: 2 },
      'DEPOT-DELTA': { onHand: 22, reserved: 1, minRequired: 8 }
    },
    unitCostUsd: 38500,
    leadTimeDaysStandard: 21,
    expeditedAirHours: 12
  }
];

export const MAINTENANCE_SCHEDULE_TASKS = [
  {
    id: 'TSK-501',
    tailId: 'AP-108',
    title: 'Hydraulic Actuator 500h Overhaul & Seal Replacement',
    base: 'BASE-CHARLIE',
    bay: 'Bay 1',
    technicianSkill: 'Level 2 Flight Control Specialist',
    startDay: 1,
    durationHours: 24,
    status: 'IN_PROGRESS',
    partAssigned: 'HYD-SEAL-902',
    constraintsSatisfied: true,
    bottleneckNotes: 'None. Proceeding on schedule.'
  },
  {
    id: 'TSK-502',
    tailId: 'AP-104',
    title: 'High-Pressure Turbine Stage 2 Blade Swap & Borescope Verification',
    base: 'BASE-BRAVO',
    bay: 'Bay 2 (Pending Spares Delivery)',
    technicianSkill: 'Level 3 Propulsion Specialist',
    startDay: 2,
    durationHours: 36,
    status: 'PENDING_SPARES',
    partAssigned: 'HPT-8842-B (Awaiting Depot Transfer from DCD)',
    constraintsSatisfied: false,
    bottleneckNotes: 'Blocking constraint: Zero on-hand stock at Base Bravo. Awaiting air transfer dispatch from Delta Central Depot (ETA T+14h).'
  },
  {
    id: 'TSK-503',
    tailId: 'AP-102',
    title: 'Post-Mission Hot-Section Visual Borescope Inspection',
    base: 'BASE-ALPHA',
    bay: 'Bay 3',
    technicianSkill: 'Level 1 Airframe Inspector',
    startDay: 4,
    durationHours: 6,
    status: 'PLANNED',
    partAssigned: 'None (Inspection only)',
    constraintsSatisfied: true,
    bottleneckNotes: 'Scheduled between Sortie CAP-08 and CAP-09 turnaround.'
  }
];

export const INGESTION_QUALITY_RECORDS = [
  {
    batchId: 'BATCH-2026-1019-A',
    source: 'Base Bravo Flight Line Telemetry Uplink (RF-Direct)',
    recordsTotal: 1420,
    validRecords: 1412,
    quarantineCount: 8,
    timestamp: '2026-10-19 05:45 UTC',
    issues: [
      {
        recordId: 'REC-90812',
        tailId: 'AP-104',
        parameter: 'vibration_n2',
        rawVal: '-99.00',
        error: 'Out-of-range sensor reading (-99.00 mm/s). Hardware drop packet.',
        status: 'QUARANTINED'
      },
      {
        recordId: 'REC-90813',
        tailId: 'AP-104',
        parameter: 'timestamp_utc',
        rawVal: '2026-10-19 04:11:02',
        error: 'Duplicate transmission timestamp with identical frame sequence 0x48.',
        status: 'DE_DUPLICATED'
      },
      {
        recordId: 'REC-90814',
        tailId: 'AP-106',
        parameter: 'oil_press_psid',
        rawVal: 'NULL',
        error: 'Missing telemetry field. Preserved raw row; flagged for imputation review.',
        status: 'FLAGGED_MISSING'
      }
    ]
  },
  {
    batchId: 'BATCH-2026-1018-D',
    source: 'Base Charlie Ground Maintenance Console (Wired Offload)',
    recordsTotal: 2840,
    validRecords: 2840,
    quarantineCount: 0,
    timestamp: '2026-10-18 22:15 UTC',
    issues: []
  },
  {
    batchId: 'BATCH-2026-1018-C',
    source: 'Base Alpha Automated Quick-Access Recorder (QAR Batch)',
    recordsTotal: 3100,
    validRecords: 3097,
    quarantineCount: 3,
    timestamp: '2026-10-18 16:30 UTC',
    issues: [
      {
        recordId: 'REC-88410',
        tailId: 'AP-102',
        parameter: 'egt_margin',
        rawVal: '1480.0 C',
        error: 'Sensor calibration transient spike > max scale (1350 C max).',
        status: 'QUARANTINED'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOG = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-19 04:12:30 UTC',
    actorRole: 'ANALYTICS_SYSTEM',
    actorName: 'C-MAPSS Baseline RUL Pipeline v0.4.1',
    action: 'ALERT_TRIGGERED',
    tailId: 'AP-104',
    summary: 'Flagged High-Pressure Turbine Stage 2 Blade with 28 flight cycles RUL remaining (Critical Alert ALT-2026-0881).',
    justification: 'Automated statistical trigger: EGT delta > +35C and Core Vibration > 3.2 mm/s threshold across 3 consecutive flight cycles.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-19 04:45:10 UTC',
    actorRole: 'MAINTAINER',
    actorName: 'Master Sgt. R. Sharma (Propulsion Lead)',
    action: 'INSPECTION_COMMENCED',
    tailId: 'AP-104',
    summary: 'Acknowledged warning ALT-2026-0881. Initiated borescope visual inspection request on Turbine Stage 2.',
    justification: 'Physical bore-inspection required before flight release.'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-19 05:00:22 UTC',
    actorRole: 'LOGISTICS_PLANNER',
    actorName: 'Capt. A. Verghese (Supply Operations)',
    action: 'INVENTORY_SHORTFALL_FLAGGED',
    tailId: 'AP-104',
    summary: 'Zero stock of Part HPT-8842-B at Base Bravo. Flagged urgent air transfer candidate from Delta Central Depot.',
    justification: 'Base Bravo on-hand count is 0; aircraft cannot complete repair window without part.'
  }
];
