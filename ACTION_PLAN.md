# Four-Week Operational Action Plan: RideOps Support Transformation

**Objective:** Eliminate the 56.6% preventable engineering escalation bottleneck, clear the aging backlog (>4 days), and improve CSAT from 3.70 to >4.20 within 30 days.

---

## 🗓️ Overview Timeline

```
Week 1: Immediate Backlog Flush & Triage (Stop the Bleeding)
Week 2: Escalation Gateways & Diagnostic Runbooks (Fix the Intake)
Week 3: Quality Control & Fair Agent Workload Rebalancing (Protect the Team)
Week 4: Engineering SLAs, Automation & Sustained Governance (Institutionalize)
```

---

## Week 1: Immediate Backlog Flush & Urgent Triage

### Key Focus: Clear aging open tickets and unblock stuck engineering tickets

- **Task 1.1: Dispatch Oldest Backlog Tickets (>7 Days)**
  - Intervene directly on the 5 critical open tickets (`SUP-11258`, `SUP-11267`, `SUP-11278`, `SUP-11291`, `SUP-11296`).
  - Conduct a 30-minute sync between Support Lead and Engineering Lead to resolve or unblock all 19 tickets currently marked "Open - with Engineering".
- **Task 1.2: Activate the Priority Score Dispatch Queue**
  - Implement the **Operational Backlog Prioritization Dispatcher** daily at 9:00 AM and 2:00 PM standups.
  - Require agents to work tickets by descending Priority Score rather than simple FIFO.
- **Task 1.3: Client Outbound Care for High-Friction Accounts**
  - Reach out proactively to key Enterprise clients with open tickets older than 4 days (e.g., Cognizant, Infosys, Flipkart) to reset expectations and provide real-time updates.

**Week 1 Milestone:**  
✅ All tickets older than 7 days resolved.  
✅ Engineering queue reduced from 19 to <7 active tickets.

---

## Week 2: Escalation Gateways & Diagnostic Runbooks

### Key Focus: Eliminate the 275 preventable escalations (Config, Missing Info, Duplicates)

- **Task 2.1: Implement Mandatory Escalation Checklists**
  - Forbid raw escalations without mandatory diagnostic fields:
    - *Vehicle ID / Driver ID*
    - *Booking Timestamp & Trip ID*
    - *Device OS / App Version*
    - *Attached System / Telematics Log File*
  - This immediately eliminates the 89 "Insufficient info" returns (18.3% of escalations).
- **Task 2.2: Build Roster Sync & GPS Troubleshooting SOPs**
  - Author standardized runbooks for the two most escalated categories:
    - *Roster / booking not syncing* (175 escalations)
    - *Live tracking / GPS incorrect* (127 escalations)
  - Empower L1 agents with read/write access to tenant sync configuration tables to resolve configuration mismatches internally without developer intervention.
- **Task 2.3: Known Defect & Duplicate Tracker**
  - Publish an internal "Known Issues & Active Bugs" pinned dashboard to eliminate the 56 duplicate escalations.

**Week 2 Milestone:**  
✅ Weekly preventable escalation rate reduced from 56.6% to <25.0%.  
✅ Zero tickets bounced back due to "missing log information".

---

## Week 3: Quality Control & Fair Agent Workload Rebalancing

### Key Focus: Curb customer reopens and rebalance agent workload complexity

- **Task 3.1: Enforce Pre-Closure Verification Protocol**
  - Stop the practice of closing tickets before client validation. For high-severity issues, require confirmation from the client or driver before setting status to `Closed`.
  - Target: Drop reopen rate from 10.46% to <5.0%.
- **Task 3.2: Rebalance Workload by Complexity Score**
  - Transition from round-robin assignment to a complexity-weighted dispatcher.
  - Distribute incoming P1/P2 incidents evenly across agents so Karan B is not burdened with disproportionate critical ticket density.
- **Task 3.3: Agent Coaching & Recognition**
  - Review agent scorecards using the **Complexity Index** rather than raw CSAT alone.
  - Pair higher-performing diagnostic agents (Vikram S, Neha P) with agents handling high volume for peer shadowing.

**Week 3 Milestone:**  
✅ Reopen rate reduced below 6.0%.  
✅ Agent workload variance narrowed within ±15% of team median.

---

## Week 4: Engineering SLAs, Automation & Sustained Governance

### Key Focus: Lock in engineering turnaround agreements and continuous reporting

- **Task 4.1: Establish Internal Engineering SLA Service Contract**
  - Formally codify Engineering response times:
    - **P1 Incidents:** 4 hours initial assessment, 12 hours resolution.
    - **P2 Incidents:** 12 hours initial assessment, 36 hours resolution.
    - **P3/P4 Incidents:** 72 hours resolution.
  - Average engineering turnaround target: Drop from **99.8 hours** to **<36.0 hours**.
- **Task 4.2: Automated Stalled Ticket Alerts**
  - Set automated Slack/webhook notifications when any ticket sits in "Open - with Engineering" for >48 hours without an updated comment.
- **Task 4.3: Institutionalize Weekly Support Intelligence Reviews**
  - Adopt the **RideOps Support Intelligence Dashboard** as the standard weekly operational review tool for leadership (VP Product, VP Engineering, VP Operations).

**Week 4 Milestone:**  
✅ Average engineering turnaround dropped below 40 hours.  
✅ Overall support CSAT trending above 4.20 / 5.0.

---

## 🎯 Target KPI Matrix (30-Day Impact)

| KPI | Current Baseline | Week 2 Checkpoint | 30-Day Target |
| :--- | :--- | :--- | :--- |
| **Active Open Backlog** | 48 tickets | 25 tickets | < 20 tickets |
| **Tickets > 4 Days Old** | 16 tickets (33.3%) | 5 tickets | 0 tickets |
| **Escalation Rate** | 33.66% | 22.0% | < 15.0% |
| **Preventable Escalations** | 56.6% | 25.0% | < 10.0% |
| **Engineering Turnaround** | 99.8 hours | 60.0 hours | < 36.0 hours |
| **Reopen Rate** | 10.46% | 7.0% | < 5.0% |
| **Average CSAT** | 3.70 / 5.0 | 3.95 / 5.0 | > 4.20 / 5.0 |
