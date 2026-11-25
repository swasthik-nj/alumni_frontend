# AlumniSphere 2.0 — Frontend Client Portal

> Next-Generation Alumni Engagement, Smart Mentorship Matchmaking & Institutional Intelligence Platform.

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.1.16-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.1-88CE02?style=flat&logo=greensock&logoColor=white)](https://greensock.com/)

---

## 🌟 Overview

The **AlumniSphere 2.0 Frontend** is a modern, high-performance web application designed to connect university students with industry-experienced alumni. Built with **React 19**, **Vite**, and **Tailwind CSS v4**, it provides an intuitive, accessible, and responsive user experience featuring real-time messaging, gamified career progression, interactive 3D hero parallax motion, and comprehensive institutional administrative dashboards.

---

## 🚀 Key Features

### 1. 💫 3D Hero Parallax Motion
* **Tilted 3D Viewport:** Perspective viewport (`[perspective:1000px]`) with smooth 3D angles (`rotateX(14deg) rotateZ(-6deg) skewX(4deg)`).
* **Multi-Row Alternating Motion:**
  * **Row 1:** Glides **Right to Left** as the user scrolls down.
  * **Row 2:** Glides **Left to Right** (opposite direction).
  * **Row 3:** Glides **Right to Left**.
* **Live Showcase Cards:** Highlights verified alumni mentors from Amazon, Google, Microsoft, Figma, Stripe, and Netflix with soft edge-fade masks.

### 2. 🎯 Smart Mentorship Discovery & Compatibility Matching
* **Explainable Matching Score:** Ranks mentors based on technical domains (35%), skills overlap (30%), interest alignment (20%), and industry seniority (15%).
* **Capacity Governance:** Displays real-time availability badges (`Available` vs `Temporarily At Capacity`) to prevent alumni overload.
* **Filter & Search:** Live multi-filtering across tech domain pills (MERN, Cloud & AWS, AI/ML, DevOps, System Design) and employer names.

### 3. 💬 Real-Time 1-on-1 Workspace & WhatsApp-Style Chat
* **Dynamic Bubble Alignment:** Outgoing user messages render on the **Right** (primary card, formatted timestamps, double read-checkmarks); incoming peer messages render on the **Left** (with avatar and delivery status).
* **Live Typing Indicators:**
  * Header subtitle pulses with green `typing...` in real time.
  * Message feed renders an animated 3-dot bouncing bubble when the other party is typing.
* **Instant Responsiveness:** High-frequency 1.2-second polling with zero websocket dropouts or serverless disconnections.
* **Session Scheduling:** Integrated **"Book Session"** modal to schedule 1-on-1 calls with Google Meet links, automatically broadcasting alert cards to the chat feed.

### 4. 🏆 Gamification Engine (XP, Levels, Badges & Leaderboard)
* **Experience Points (XP):** Earn XP through profile completion (+50), connecting with mentors (+50), attending calls (+75), and completing guidance roadmaps (+150).
* **6 Professional Tiers:** *Beginner* (0 XP) $\rightarrow$ *Explorer* $\rightarrow$ *Achiever* $\rightarrow$ *Professional* $\rightarrow$ *Champion* $\rightarrow$ *Elite Alumni-Ready* (3,501+ XP).
* **Campus Leaderboard:** Public student leaderboard ranked by verified XP points and unlocked badges.

### 5. 🛡️ Institutional Admin Console
* **Mentorship Intelligence:** Ecosystem saturation tracking, mentor capacity metrics, student satisfaction ratings (5.0/5.0), and in-demand domain analytics.
* **Master Alumni Roster:** Filterable, searchable directory of all registered graduates with department, graduation year, degree qualification (MCA), and current corporate roles.
* **Student Management:** Full student roster with pagination, search, and CSV/JSON bulk import capabilities.

### 6. 🌓 Accessibility & Theme Management
* **Dual Theme Engine:** Smooth transitions between light and dark themes using OKLCH color variables.
* **Conflict-Free Keyboard Shortcuts:**
  * `Shift + D` — Quick one-hand toggle.
  * `\` (Backslash) — Single-key instant toggle.
  * `Alt + Shift + T` — Alternative toggle.

---

## 🛠️ Technology Stack

| Category | Tools & Libraries |
|---|---|
| **Framework & Build** | React 19.1.1, Vite 7.1.7 |
| **Styling & Design** | Tailwind CSS v4.1.16, Radix UI Primitives, Lucide React Icons |
| **Animation & Motion** | GSAP 3.15.1, ScrollTrigger, Lenis Smooth Scroll |
| **Charts & Visuals** | Recharts 3.11.0 (Analytics, Trends, XP Progress) |
| **State & Routing** | React Context API (`AuthContext`), React Router DOM v7 |
| **HTTP & Networking** | Axios with automated JWT Bearer interceptor |
| **Notifications** | React Hot Toast, Sonner |

---

## 📂 Project Directory Structure

```text
frontend/
├── public/                 # Static assets and favicon
├── src/
│   ├── assets/             # Images, logos, and illustrations
│   ├── components/         # Reusable feature components
│   │   ├── ui/             # Radix UI primitives (Button, Card, Badge, Dialog, etc.)
│   │   ├── Admin.jsx               # Master administrative intelligence console
│   │   ├── AdminAlumniManagement.jsx # Filterable alumni roster and detail dialogs
│   │   ├── AdminStudentManagement.jsx# Student management and bulk CSV import
│   │   ├── AdminMentorshipAnalytics.jsx # Saturation and domain metrics
│   │   ├── AlumniMentorshipDashboard.jsx # Mentor request pipeline and mentee capacity
│   │   ├── StudentMentorshipDashboard.jsx# Student mentorship hub and active mentors
│   │   ├── MentorshipExplore.jsx   # Smart compatibility matching discovery catalog
│   │   ├── MentorshipChat.jsx      # Real-time chat, typing indicator, and bubble alignment
│   │   ├── MentorshipSessionModal.jsx # 1-on-1 meeting calendar and Google Meet booking
│   │   ├── SharedResourcesModal.jsx   # Curated GitHub repositories and documentation
│   │   ├── HeroParallax.jsx        # 3D tilted multi-row parallax showcase
│   │   ├── Gamification.jsx        # XP progression bar, badges, and leaderboard
│   │   ├── ThemeToggle.jsx         # Dark/light switcher with conflict-free shortcuts
│   │   ├── Nav.jsx                 # Global responsive navigation header
│   │   └── Footer.jsx              # Footer links, social proofs, and copyright
│   ├── contexts/
│   │   └── AuthContext.jsx         # Centralized authentication & session state
│   ├── utils/
│   │   └── api.js                  # Axios instance with base URL and JWT interceptors
│   ├── App.jsx                     # Route definitions and application layout
│   ├── Home.jsx                    # Landing page with HeroParallax and countdown
│   ├── Directory.jsx               # Public graduate directory
│   ├── Events.jsx                  # Campus workshops, hackathons, and gatherings
│   ├── Donate.jsx                  # Endowment and scholarship campaign donation portal
│   ├── index.css                   # Tailwind CSS v4 theme variables (@theme inline)
│   └── main.jsx                    # React entrypoint mounting DOM
├── .env                            # Environment variables (API base URL)
├── package.json                    # Project dependencies and npm scripts
├── vite.config.js                  # Vite bundler configuration with React plugin
└── README.md                       # Frontend documentation
```

---

## 🚦 Getting Started

### 1. Prerequisites
* **Node.js:** v18.x or higher (Node v20+ recommended)
* **npm:** v9.x or higher

### 2. Installation
Navigate into the `frontend` directory and install project dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Configuration
Create or inspect the `.env` file in the `frontend` root:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Running Development Server
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will launch at: **`http://localhost:5173`**

### 5. Building for Production
To generate an optimized production bundle:
```bash
npm run build
```
Production assets are compiled into the `dist/` directory.

### 6. Previewing Production Build
To preview the compiled build locally:
```bash
npm run preview
```

---

## 🗺️ Key Application Routes

| Path | Description | Access |
|---|---|---|
| `/` | Landing page featuring 3D Hero Parallax & flagship countdown | Public |
| `/directory` | Searchable directory of verified alumni | Public |
| `/events` | Campus sessions, tech workshops & reunions | Public |
| `/donate` | Student scholarship & endowment campaigns | Public |
| `/login` / `/register` | Student & Alumni authentication | Public |
| `/mentorship/explore` | Smart rule-based mentorship matchmaking engine | Student / Authenticated |
| `/mentorship/chat/:requestId` | Real-time 1-on-1 workspace with live typing & sessions | Active Participants |
| `/student/mentorship-dashboard` | Student mentorship pipeline, requests & XP stats | Student |
| `/personal` | Alumni dashboard, mentee capacity & request intake | Alumni Mentor |
| `/gamification` | Campus leaderboard, achievement badges & quests | Authenticated |
| `/admin` | Administrative console (Intel, Alumni Roster, Students) | Administrator |

---

## 📄 License & Attribution
Developed for the **MCA Alumni & Mentorship Management System (AlumniSphere 2.0)**.  
All rights reserved © 2026.
