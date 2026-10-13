# STRIDE — Sports Talent Assessment & Biomechanical AI Platform (India)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework](https://img.shields.io/badge/Framework-React%2019%20%7C%20TypeScript-blue.svg)](https://react.dev/)
[![Build Tool](https://img.shields.io/badge/Build%20Tool-Vite%208-green.svg)](https://vitejs.dev/)
[![Computer Vision](https://img.shields.io/badge/AI%20Vision-MediaPipe%20Pose%2033--Landmarks-brightgreen.svg)](https://developers.google.com/mediapipe)
[![Benchmarks](https://img.shields.io/badge/Standards-Sports%20Authority%20of%20India%20(SAI)-orange.svg)](https://sportsauthorityofindia.nic.in/)

> **"Your Potential. Measured."**  
> *Every grassroots athlete deserves a chance.*

**STRIDE** is an AI-powered sports talent assessment platform designed to democratize athletic discovery across all 28 Indian States and 8 Union Territories. By turning any standard smartphone into a computer-vision biomechanical lab, STRIDE enables grassroots athletes from rural akhadas, district sports complexes, and school tracks to measure their physical capabilities against official **Sports Authority of India (SAI)** national junior benchmark norms.

---

## 🌟 Key Highlights & Innovations

### 1. 🤖 Smartphone Computer Vision AI (MediaPipe Pose 33-Landmarks)
- **Zero Expensive Hardware**: Uses standard phone cameras or video uploads at 60 FPS via WebAssembly (WASM) and WebGL-accelerated MediaPipe Pose Landmarker.
- **Dedicated Push-Up Biomechanics Engine (`pushupCounter.ts`)**:
  - 3-point kinematic chain: **Shoulder (11/12) $\to$ Elbow Vertex (13/14) $\to$ Wrist (15/16)**.
  - State machine with real-time inflection detection: `PLANK LOCKOUT` ($\ge 135^\circ$) $\to$ `DESCENDING` $\to$ `90° BOTTOM DEPTH` ($\le 98^\circ$) $\to$ `ASCENDING` $\to$ Lockout Rep increment.
  - Anti-jitter debounce verification and neutral spine monitoring to catch hip sagging or piking.
- **Dedicated Sit-Up Biomechanics Engine (`situpCounter.ts`)**:
  - Hip flexion angle tracking (Shoulder $\to$ Hip $\to$ Knee) with curl threshold ($\le 65^\circ$) and floor reset ($\ge 130^\circ$).
- **Live Canvas HUD Overlay**: Renders real-time skeleton joints, angular degree arcs directly over the active joint, tracking confidence, and FPS telemetry.

### 2. 🏛️ Calibrated Sports Authority of India (SAI) Norms
- Benchmarked against standardized SAI junior physical fitness battery tests:
  - **60-Second Push-Up Endurance** (Strength Endurance)
  - **Countermovement Vertical Jump** (Explosive Leg Power)
  - **30-Meter Sprint** (Sprint Velocity & Acceleration)
  - **Beep Test / Multi-Stage Fitness Test** (Cardiorespiratory Endurance)
  - **Sit and Reach** (Hamstring & Lower Back Flexibility)
  - **Standing Broad Jump** (Horizontal Force Production)
- Automatic tier grading: **Elite / Top 5% SAI**, **National Contender**, **State Level**, and **Developmental**.

### 3. 🛡️ Dual-Role Portal Architecture & Strict RBAC
- **Dedicated Starting Login Page at `/`**:
  - **Athlete Portal** (Lime accent `#a3e635`): For grassroots & competitive athletes to take assessments, track biometric passports, and apply to national schemes.
  - **Scout / Coach Portal** (Cyan accent `#38bdf8`): For SAI NCOE scouts, academies, and national federation coaches to recruit verified talent.
  - **1-Click Instant Demo Logins**:
    - **Aarav Sharma** (Elite Sprinter • Haryana • 92 SAI Score • Top 3.6% Nationally)
    - **Coach Vikram Singh** (Senior Talent Scout • SAI NCOE Patiala)
- **Role-Based Access Control (`RoleProtectedRoute`)**:
  - Gated route security: Opportunities catalog and application submissions are exclusively accessible to athletes.
  - Scouts are barred from athlete-exclusive views and automatically redirected to Scout HQ.
  - Unauthenticated visitors attempting to view protected portals are safely redirected to the Starting Login Page.

### 4. 🏅 Anti-Age Fraud & Biometric Passport
- Tier-1 verified status linking Aadhaar UIDAI and State/National Sports Federation licenses.
- Audit ledger eliminating age fraud in junior categories.
- Exportable athletic biometric passport recognised by scouts.

---

## ⚡ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Build & Dev Tool** | Vite 8 |
| **Styling** | Vanilla CSS + Tailwind CSS v4 (Charcoal `#070a0e`, `#0e141d`, Athletic Lime `#a3e635`, Scout Cyan `#38bdf8`) |
| **Routing** | React Router v7 (`react-router-dom`) with centralized RBAC guards |
| **Computer Vision** | Google MediaPipe Vision (`@mediapipe/tasks-vision`) + WebAssembly + HTML5 Canvas |
| **Data Visualizations** | Recharts (longitudinal trends, radar charts, and benchmark bar comparisons) |
| **Icons** | Lucide React |

---

## 📱 Page & Routing Sitemap

| Route | Page | Access Level | Description |
|---|---|---|---|
| `/` | **Starting Login Page** | Public | Dedicated dual-portal login for Athlete & Scout with 1-click demo access and registration. |
| `/landing` | **Platform Overview** | Public | Promotional showcase, SAI testing norms, 4-step testing protocol, and trust metrics. |
| `/login`, `/register` | **Auth Gateway** | Public | Aliases to the Starting Login Portal. |
| `/dashboard` | **Athlete Dashboard** | Athlete Only | Verified status, STRIDE score (92/100, Top 3.6% National), test battery meters, and scholarship matches. |
| `/assessments` | **Assessments Catalog** | Athlete Only | Catalog of all 6 SAI standardized battery tests. |
| `/assessments/:id/instructions` | **Live Biomechanical Test** | Athlete Only | Real-time computer vision camera/video test with skeleton overlay and live rep counting. |
| `/assessments/:id/results` | **Assessment Results** | Athlete Only | Rep count, measured metric, percentile score, joint angle curves, and SAI benchmark tier. |
| `/results` | **My Results & Trends** | Athlete Only | Longitudinal 6-month progress charts, 6-pillar athletic radar, and test history. |
| `/verification` | **Identity Verification** | Athlete Only | Aadhaar & sports federation verification ledger and document upload. |
| `/opportunities` | **Opportunities & Schemes** | Athlete Only | Directory of Khelo India Scholarships, SAI NCOE residential schemes, and trials. |
| `/opportunities/:id` | **Scheme Application** | Athlete Only | 4-phase selection timeline, eligibility checklist, and application dispatch. |
| `/profile` | **Biometric Passport** | Authenticated | Complete athlete/coach profile, physical measurements, and honors shelf. |
| `/scout/dashboard` | **Scout HQ** | Scout Only | Command center for Coach Vikram Singh, national database statistics, and talent watchlists. |
| `/scout/athletes` | **Athlete Directory** | Scout Only | Searchable talent directory with state/sport/score filters, grid/table view toggle. |
| `/scout/saved` | **Shortlisted Roster** | Scout Only | Shortlisted athlete roster with head-to-head comparison and custom scout notes. |
| `/notifications` | **Notifications Hub** | Authenticated | Notification center with category filtering and mark-as-read. |
| `/settings` | **Settings & Help** | Authenticated | Portal preferences, regional language options, FAQ accordion, and support desk. |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm**: v9.0.0 or later

### 1. Clone the Repository
```bash
git clone https://github.com/prajan-01/Stride.git
cd Stride
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/` (or the port specified by Vite in terminal).

### 4. Build for Production
To typecheck and create an optimized production bundle:
```bash
npm run build
```

---

## 📂 Project Structure

```
├── public/
│   ├── models/                # MediaPipe Pose Landmarker task models
│   ├── samples/               # Athlete test videos (pushups, situps, no-person edge cases)
│   ├── wasm/                  # MediaPipe WASM runtime binaries
│   ├── favicon.svg            # STRIDE brand favicon
│   └── icons.svg              # SVG asset sprite
├── src/
│   ├── components/
│   │   ├── assessment/        # RealPoseAnalyzer, Skeleton visualizer & Telemetry HUD
│   │   ├── auth/              # RoleProtectedRoute (RBAC route guard)
│   │   └── common/            # Navbar, MobileNav, Footer, Button, Card, Toast, Modal
│   ├── context/
│   │   └── AppContext.tsx     # Global application state, authentication, and demo store
│   ├── lib/
│   │   ├── auth.ts            # Centralized permissions, role validation, and route descriptors
│   │   ├── mediapipe/         # pushupCounter.ts, situpCounter.ts, poseLandmarker loader
│   │   └── mockData.ts        # SAI norms, demo athletes, assessments catalog, opportunities
│   ├── pages/                 # All 16 application pages
│   ├── types/                 # TypeScript interfaces and domain types
│   ├── App.tsx                # Route definitions and layout wrapper
│   ├── index.css              # Design system tokens and styling
│   └── main.tsx               # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Security & Privacy Notice

- **No Secrets or Private Keys**: This repository contains zero private API keys, backend secrets, or sensitive personal data.
- **Protected Environment Variables**: `.gitignore` is configured to prevent accidental commits of `.env`, `.env.local`, or any private credential files.
- **Biomechanical AI Integrity**: In adherence to sports science ethics, STRIDE clearly flags prototype and simulation benchmarks. Official selection scores must be calibrated against verified camera distances according to SAI guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
