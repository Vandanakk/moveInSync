# RideOps Support Intelligence Dashboard

An enterprise-grade Support Operations & Backlog Intelligence Dashboard built for the Support Lead at RideOps. The application delivers real-time visibility into support bottlenecks, engineering handoff friction, agent workloads, and client risk, backed by a deterministic, transparent prioritization engine.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.9+** (with `pandas` and `numpy`)
- **Node.js 18+** and `npm`

### 2. Run Data Analysis & Pipeline
The raw dataset contains 1,444 tickets spanning July 2, 2026 to September 30, 2026. To reproduce the analysis and generate the clean data payload:

```bash
# Run the Python analytical pipeline
python3 analysis.py
```

This generates `tickets_data.json` and copies it into `frontend/src/data/tickets.json`.

### 3. Launch Frontend Dashboard

```bash
cd frontend

# Install dependencies (already installed in workspace)
npm install

# Start local development server
npm run dev
# -> Opens on http://localhost:5173/

# Or run the verified production preview build
npm run build
npm run preview
# -> Opens on http://localhost:5173/
```

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Data Engine** | Python, Pandas, NumPy | Exact CSV ingestion, datetime parsing, SLA calculation, complexity indexing, aging bucket segregation. Zero metric fabrication. |
| **Frontend Framework** | React 18, Vite 6, TypeScript | Strict typing, fast Hot Module Replacement, modular component tree. |
| **Design System** | Tailwind CSS 3 | Professional enterprise aesthetic, navy/slate palette, high visual contrast, WCAG compliant. |
| **Data Visualization** | Recharts | Interactive SVG charts (inflow/outflow trends, CSAT distribution, backlog aging, escalation handoff distributions). |
| **Icons & UI** | Lucide React | Consistent enterprise icons and status indicators. |

---

## 📊 Core Dashboard Sections

### A. Executive Overview
- High-level KPIs: Total Tickets (1,444), Closed (1,396), Open Backlog (48, 3.32%), Escalation Rate (33.66%), Reopen Rate (10.46%), Avg CSAT (3.70/5.0).
- Weekly ticket creation vs closure trends.
- CSAT rating distribution across 648 verified customer ratings.
- Fast drill-down navigation buttons into Backlog, Escalations, and Queue.

### B. Backlog Intelligence
- Detailed breakdown of all 48 open tickets by aging bucket:
  - `0–1 days`: 17 tickets (35.4%)
  - `2–3 days`: 15 tickets (31.3%)
  - `4–7 days`: 11 tickets (22.9%)
  - `8+ days`: 5 tickets (10.4%) — *Critical aging tickets*
- Split between L1 queue (29 tickets) vs Engineering queue (19 tickets).
- Breakdown of open backlog by priority and category.
- Table of the 15 longest-pending tickets with direct inspection links.

### C. Engineering Escalation Analysis
- Escalation volume: 486 tickets (33.66%).
- **Turnaround comparison:** Escalated tickets require an average of **99.8 hours (~4.16 days)** to close versus **20.0 hours** for tickets resolved solely by L1 (**5.0x resolution latency**).
- **The 56.6% Preventable Bottleneck:** 275 out of 486 escalations were returned to L1 or closed without a code change:
  - Missing Info / Logs: 89 tickets (18.3%)
  - Configuration / Tenant Settings: 84 tickets (17.3%)
  - Duplicate Defects: 56 tickets (11.5%)
  - How-To / Documentation: 24 tickets (4.9%)
  - Not Reproducible: 22 tickets (4.5%)
  - Genuine Code Fixes: 211 tickets (43.4%)
- Root cause category analysis identifying *Roster / booking sync* and *GPS / Live tracking* as the primary drivers of false escalations.

### D. Agent & Client Analysis
- **Complexity-Adjusted Agent Scorecard:** Contextualizes raw CSAT and resolution speed against ticket complexity, P1/P2 distribution, and engineering escalation volume.
  - Explains why high-volume agents (e.g., Karan B: 217 tickets, high P1/P2 load) exhibit lower CSAT than lower-volume agents.
- **Client Risk Analysis:** Evaluates ticket volume across 50 accounts. Highlights accounts with high open ticket counts (e.g., Cognizant, Infosys, Flipkart) to prevent customer churn.

### E. Actionable Ticket Explorer
- Complete 1,444-ticket searchable and filterable database.
- Multi-dimensional filtering by Priority, Category, Status, Agent, Client, Tier, and Escalation.
- Dynamic sorting by Age, Priority, Priority Score, and Resolution Time.
- One-click CSV export of filtered views.
- Slide-over drawer detailing all 20 fields for any selected ticket.

### F. Operational Backlog Prioritization Queue (Section 4)
- Deterministic heuristic scoring engine ranking all 48 open tickets on a 0–100 scale:
  $$\text{Score} = \text{BasePriority (max 40)} + \text{AgingPenalty (3 pts/day, max 30)} + \text{EngStall (+20)} + \text{ReopenPenalty (10 pts/reopen, max 20)}$$
- Assigns actionable dispatch tags:
  - *Escalate overdue engineering ticket*
  - *Follow up with engineering*
  - *Investigate repeated reopen*
  - *Resolve high-priority aging ticket*
  - *Normal L1 follow-up*

---

## ⚙️ Data Assumptions & Calculations

1. **Snapshot Date:** September 30, 2026, 23:59:59 IST.
2. **Open vs Closed Tickets:** Unresolved tickets are **never** treated as completed resolutions. Resolution time averages strictly exclude unresolved tickets.
3. **Ticket Age:** For open tickets, age is computed from `created_at` up to September 30, 2026. For closed tickets, age is the total lifespan until final closure.
4. **First Response Time:** Computed as the delta in minutes between `created_at` and `first_response_at`.
5. **Reproducibility:** All metrics displayed in the frontend match the Python analysis outputs down to single decimals.
