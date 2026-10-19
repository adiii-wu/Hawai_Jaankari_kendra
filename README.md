# AeroPulse (Hawai Jaankari Kendra)

> **Aircraft Fleet Health, Prognostics & Maintenance Decision-Support System**  
> An offline-capable, air-gapped decision prototype built according to the AeroPulse Prototype Build Plan specification.

---

## 1. Executive Summary

**AeroPulse** (Hawai Jaankari Kendra) is an operational decision-support prototype designed to close the loop between raw aircraft component sensor observations and real-world maintenance actions. It turns aircraft sensor streams and historical maintenance logs into:
1. Explainable prognostic health alerts with calibrated uncertainty bounds.
2. Short-term fleet availability forecasts (7-day and 30-day outlooks).
3. Deterministic "What If" scenario simulations for airframe grounding and tempo surges.
4. Feasible, resource-constrained maintenance schedules respecting bay capacities and technician skill tiers.
5. Automated supply-chain shortfall detection and least-lead-time spares transfer recommendations.
6. A tamper-evident, append-only audit trail capturing every operator disposition and system trigger.

---

## 2. End-to-End Decision Loop

The prototype demonstrates a closed operational decision workflow across four user roles:

```
+-----------------------------------------------------------------------------------+
| 1. INGESTION & DATA QUALITY LAYER                                                 |
|    - Batch ingestion of sensor telemetry, sorties, and depot inventory            |
|    - Schema validation rejects malformed rows to quarantine (Zero silent imputation)|
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 2. PROGNOSTIC ANOMALY DETECTION (C-MAPSS FD001 BENCHMARK)                         |
|    - Evaluates EGT margin (+39.3 deg C), Core Vibration (4.82 mm/s), and Ps30     |
|    - Triggers Critical Warning ALT-2026-0881 on AP-104 (Estimated RUL: 28 cycles) |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 3. MAINTAINER DISPOSITION & EVIDENCE INSPECTION                                   |
|    - Maintainer inspects multi-signal evidence and degradation trend curves       |
|    - Inputs justification and flags Work Order TSK-502 for Stage 2 blade swap     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 4. DIGITAL TWIN "WHAT IF" SIMULATION (FLEET PLANNER)                              |
|    - Evaluates impact of grounding AP-104 for 72 hours under normal/surge tempo   |
|    - Calculates availability delta (-10.0%) and projected stranded sorties (9)    |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 5. RESOURCE-CONSTRAINED SCHEDULING (OR-TOOLS HEURISTIC)                           |
|    - Identifies blocking constraint: 0 on-hand units of Part HPT-8842-B at Base   |
|    - Fallback heuristic re-stages bay work to Day 2 post-spares arrival           |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 6. SPARES LOGISTICS & TACTICAL TRANSFER ROUTING                                   |
|    - Detects 4 available units at Delta Central Depot                             |
|    - Recommends and dispatches expedited 14-hour tactical air shuttle to Base      |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 7. APPEND-ONLY AUDIT TRAIL                                                        |
|    - Automatically commits SHA-verified records of all actions, roles & reasons  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Modules & Operational Workflows

### Module 1: Fleet Overview & Readiness (Commander View)
- **Fleet Matrix:** Live tracking of 10 multirole airframes (`AP-101` through `AP-110`) across three forward operating bases:
  - Base Alpha (Northern Sector - Ambala)
  - Base Bravo (Western Sector - Jodhpur)
  - Base Charlie (Eastern Sector - Hasimara)
- **7-Day and 30-Day Availability Outlook:** Visual step-trajectory identifying planned maintenance dips, recovery days, and mission-capable rates.
- **Subsystem Diagnostic State:** Real-time health tags across four critical aircraft systems: Propulsion (ENG), Flight Controls (HYD), Avionics Radar (AVN), and Fuel Distribution (FUEL).
- **Airframe Detail Inspector:** Slide-out technical drawer detailing platform specifications, total airframe hours, flight cycles, and recent sortie logs.

### Module 2: Health Warnings & Explainable Prognostics (Maintainer View)
- **Prognostic Inbox:** Priority-ranked alerts with calibrated severity bands (Critical, High, Medium, Low).
- **Model Calibration Notice:** Clearly identifies use of the NASA C-MAPSS FD001 benchmark model (v0.4.1) with 95% confidence intervals (`21 - 34 flight cycles`), highlighting that algorithmic outputs guide decisions rather than acting as autonomous flight releases.
- **Explainable Evidence Breakdown:** Quantifies exact parameter deviations against nominal operating bands:
  - Exhaust Gas Temperature: `724.3 deg C` (+39.3 deg C above nominal threshold)
  - Core Shaft Vibration (N2): `4.82 mm/s` (Alert limit: 3.20 mm/s)
  - High-Pressure Compressor Outlet Pressure (Ps30): `512.4 psia` (-22.6 psia loss)
- **Telemetry Trend Curves:** Interactive vector visualization showing degradation divergence across flight cycles 1 to 15.
- **Maintainer Disposition Console:** Four actionable options:
  - *Accept Warning & Schedule Bay Swap*
  - *Defer +24h (Restrict to Subsonic Transit)*
  - *Flag Sensor False Positive / Recalibrate*
  - Maintainer feedback input logging directly to the immutable audit trail.

### Module 3: Digital Twin "What If" Scenario Simulator (Planner View)
- **Interactive Grounding Evaluator:** Allows commanders and planners to select any airframe, modify unscheduled downtime (24h to 168h), introduce spares supply delays (0 to 7 days), and toggle operational tempo (Normal Peacetime vs High-Tempo Surge).
- **Comparative Metrics Matrix:** Instant deterministic calculation of:
  - 7-Day Availability: Baseline 80.0% -> Scenario 70.0% (-10.0% delta)
  - 30-Day Mean Availability: Baseline 76.5% -> Scenario 72.8% (-3.7% delta)
  - Sortie Fulfillment Risk: Quantifies exact number of cancelled/stranded operational sorties.
  - Forward Base Risk: Highlights localized degradation (e.g. Base Bravo operational depth dropped to 33.3%).

### Module 4: Maintenance Scheduling & Resource Constraints (OR-Tools Heuristic)
- **Constraint Solver Modeling:** Balances task duration, due windows, hangar bay availability, and technician certification tiers (Level 1 Airframe, Level 2 Flight Controls, Level 3 Propulsion Specialist).
- **Transparent Conflict Explanation:** Highlights work orders blocked by physical dependencies (e.g. Work Order `TSK-502` cannot start without Part `HPT-8842-B`).
- **Safe Fallback Scheduling:** Re-sequences task commencement to Day 2 post-spares arrival, preventing idle hangar bay gridlock.

### Module 5: Spares Inventory & Logistics Routing (Logistics View)
- **Multi-Base Stock Ledger:** Inventory counts (On-Hand, Reserved, Minimum Buffer) across Base Alpha, Base Bravo, Base Charlie, and Delta Central Depot.
- **Stockout Deficit Detection:** Flags critical shortage of High-Pressure Turbine Stage 2 Blade sets at Base Bravo.
- **Automated Transfer Recommendation:** Selects least-lead-time transfer route:
  - Origin: Delta Central Depot (4 units available)
  - Destination: Base Bravo (0 units available)
  - Transport: Priority military air shuttle
  - Transit Time: 14 flight hours
- **One-Click Authorization:** Dispatches transfer, locks depot reservation, and updates work order status in real time.

### Module 6: Data Quality & Schema Ingestion (Admin View)
- **Batch Processing Validator:** Ingests synthetic RF telemetry and QAR offloads with strict schema checks.
- **Quarantined Records Ledger:** Preserves and explains malformed rows without corrupting valid states:
  - `REC-90812`: Out-of-range sensor reading (-99.00 mm/s)
  - `REC-90813`: Duplicate transmission frame timestamp
  - `REC-90814`: Missing mandatory telemetry payload field
- **Zero Silent Imputation Policy:** Preserves raw data provenance for safety-critical inspection.
- **Interactive Anomaly Injector:** Tooling to test pipeline resilience against deliberate synthetic sensor spikes.

### Module 7: Append-Only Audit Trail (Compliance View)
- **Immutable Log:** Chronological ledger of all system and user events with UTC timestamps, actor role, airframe ID, action category, and justification.
- **Integrity Seal:** Structured records validated against tamper-evident schemas.
- **Export Functionality:** One-click JSON export for external compliance review.

---

## 4. Strict Design System & Non-Vibe-Coded Architecture

To maintain the operational rigor expected of aerospace and defense tooling, the user interface adheres to strict design guardrails:

| Design Rule | Implementation Standard |
| :--- | :--- |
| **No Purple Gradients** | Palette restricted to deep tactical slate (`#090d14`), aerospace navy (`#0f1422`), sky blue (`#0284c7`), emerald (`#10b981`), amber (`#f59e0b`), and rose (`#ef4444`). |
| **No Pill-Shaped Buttons** | Strictly rectangular geometry with sharp edges or subtle 2px radii (`rounded-none`, `rounded-sm`). |
| **No Fake Reviews or Metrics** | Zero marketing testimonials, customer quotes, or fabricated ratings. Only genuine engineering data. |
| **No Vague Hero Text** | Replaced marketing copy with precise technical designations and telemetry headers. |
| **No Emoji Icons** | High-precision vector SVG iconography powered by Lucide icons across every screen. |
| **No Em Dashes** | Zero instances of em dashes (Unicode em dash or double dashes). Standard hyphens, colons, or parentheses utilized. |
| **No Scroll Animations** | Instant, high-contrast layouts without parallax, 3D tilt, or scroll-triggered fade traps. |
| **No AI Slop Photos or Copy** | Zero synthetic stock photos or generated marketing fluff. Dense, informative data grids. |
| **No Cursor Animations** | Default system browser pointer with zero trailing dots, glow rings, or magnetic pull. |
| **No 'Made with AI' Labels** | Completely removed. Clear technical notices identify air-gapped prototype boundaries and C-MAPSS benchmark usage. |

---

## 5. Technology Stack

- **Frontend Core:** React 19, Vite 8
- **Styling Architecture:** Tailwind CSS v4 (Industrial Dark Theme)
- **Vector Iconography:** Lucide React
- **Visual Analytics:** Lightweight, high-precision inline SVG sparklines and telemetry trend curves
- **Data Architecture:** In-memory canonical synthetic state with immutable audit event reducer
- **Deployment Capability:** Fully offline-capable, air-gapped, zero external network calls required at runtime

---

## 6. Project Structure

```
Hawai_Jaankari_kendra/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                 # Top status ribbon, role switcher, cycle step, reset
│   │   ├── FleetOverview.jsx          # Readiness metrics, 7-day trajectory, airframe directory
│   │   ├── HealthAlerts.jsx           # Alert inbox, explainable evidence, SVG degradation trend
│   │   ├── DigitalTwinScenario.jsx    # Deterministic what-if grounding simulator & deltas
│   │   ├── MaintenanceScheduler.jsx   # Constraint solver, bay capacity, technician skills
│   │   ├── SparesLogistics.jsx        # Multi-base stock matrix, shortfall detector, air transfer
│   │   ├── DataQuality.jsx            # Ingestion batch validator, quarantine inspector
│   │   ├── AuditTrail.jsx             # Append-only immutable ledger with JSON export
│   │   └── AircraftDetailModal.jsx    # Airframe inspection drawer with sortie history
│   ├── data/
│   │   └── fleetData.js               # Canonical synthetic fleet, telemetry, spares, audit seed
│   ├── App.jsx                        # State orchestration, audit logging, role dispatch
│   ├── index.css                      # Minimalist industrial CSS layer
│   └── main.jsx                       # React application entry point
├── public/
├── index.html                         # Document shell with technical metadata
├── vite.config.js                     # Vite and Tailwind configuration
├── package.json                       # Project dependencies and metadata
└── README.md                          # Complete system architectural documentation
```

---

## 7. Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v25)
- npm (v9 or higher; verified on npm v11)

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/adiii-wu/Hawai_Jaankari_kendra.git
cd Hawai_Jaankari_kendra

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be accessible at:
```
http://localhost:5173/
```

### Production Build

```bash
# Build optimized static distribution
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Definition of Done & Acceptance Criteria

- [x] Ingest synthetic sensor, maintenance, inventory, and depot data into one consistent schema.
- [x] Flag and explain invalid, missing, stale, or duplicate input without silent imputation.
- [x] Show aircraft/component health with at least one explainable critical warning (`ALT-2026-0881`).
- [x] Display supporting sensor/history evidence and model uncertainty bounds (95% CI).
- [x] Show 7-day and 30-day fleet availability with an interactive "What If Tail Grounded" scenario.
- [x] Generate a maintenance plan respecting configured bay capacity, technician skills, and part availability.
- [x] Identify spares shortages and suggest feasible transfer routing with lead times.
- [x] Record maintainer feedback and audit key operational decisions in an append-only log.
- [x] Operate completely locally and offline without requiring active external internet connectivity.
- [x] Adhere strictly to the requested non-vibe-coded minimalist aesthetic.

---

## 9. License & Operational Notice

This software is an engineering decision-support prototype operating exclusively on synthetic data and public NASA C-MAPSS benchmarks. It is not certified for direct flight release without manual physical inspection and authorized sign-off.
