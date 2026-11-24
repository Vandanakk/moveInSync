# Executive Findings Report: RideOps Support Intelligence
**Data Snapshot Date:** September 30, 2026 23:59:59 IST  
**Total Records Analyzed:** 1,444 Support Tickets (July 2, 2026 – September 30, 2026)  
**Author:** Senior Full-Stack Engineer & Product-Minded Data Analyst  

---

## Executive Summary

An exhaustive analysis of the RideOps customer support dataset reveals that while the organization maintains an apparently healthy closure rate (96.68%), **a critical systemic bottleneck exists at the L1-to-Engineering escalation boundary**. Over a third (33.66%) of all incoming tickets are routed to Engineering, requiring an average resolution time of **99.8 hours (~4.16 days)**—five times slower than L1 self-resolved tickets (20.0 hours). Crucially, **56.6% of these escalations are entirely preventable** (missing logs, misconfigured client settings, or duplicate bug reports). 

Addressing this single handoff failure will instantly unlock massive support throughput, reduce customer wait times by up to 60%, and stabilize dropping CSAT scores.

---

## 7 Core Evidence-Backed Findings

### 1. The 56.6% Preventable Escalation Bottleneck
- **Evidence:** Out of 486 tickets escalated to Engineering, only **211 tickets (43.4%)** resulted in genuine code or infrastructure fixes ("Fixed"). The remaining **275 tickets (56.6%)** were bounced back or resolved without engineering intervention:
  - **Returned – Insufficient Info / Missing Logs:** 89 tickets (18.3%)
  - **Returned – Configuration / Tenant Setting:** 84 tickets (17.3%)
  - **Duplicate of Known Issue:** 56 tickets (11.5%)
  - **Not a Bug – How-to / Documentation:** 24 tickets (4.9%)
  - **Not Reproducible:** 22 tickets (4.5%)
- **Impact:** Senior engineering teams are routinely bogged down by support triage and administrative back-and-forth rather than shipping product features.

### 2. The 5.0x Engineering Turnaround Penalty
- **Evidence:** Tickets resolved at the L1 tier close in an average of **20.0 hours** (median 12.4 hours). In contrast, tickets escalated to Engineering take an average of **99.8 hours** (median 78.5 hours). 
- **Impact:** As soon as a ticket receives an engineering tag, customer resolution is delayed by approximately **4 full business days**. This latency is the single greatest driver of negative client feedback.

### 3. Roster Sync & GPS Tracking Drive 62.1% of All Escalations
- **Evidence:** Escalations are heavily concentrated in two specific product modules:
  - *Roster / booking not syncing:* 175 escalations (36.0% of all escalations), with 48.0% returned to L1 due to configuration or missing logs.
  - *Live tracking / GPS incorrect:* 127 escalations (26.1% of all escalations), with 52.8% returned as non-reproducible, config, or duplicate.
- **Impact:** Support lacks standard diagnostic runbooks and client tenant configuration visibility for vehicle sync and live GPS pipelines, forcing them to treat configuration errors as code bugs.

### 4. Backlog Aging Risk: 33.3% of Open Tickets are Older than 4 Days
- **Evidence:** As of September 30, 2026, 48 tickets remain unresolved (29 awaiting L1 action, 19 stuck in Engineering).
  - `0–1 days`: 17 tickets (35.4%)
  - `2–3 days`: 15 tickets (31.3%)
  - `4–7 days`: 11 tickets (22.9%)
  - `8+ days`: 5 tickets (10.4%)
- **Critical Risk:** Open tickets such as `SUP-11258` (9.3 days, P1, stuck with Engineering), `SUP-11267` (8.9 days, P2), and `SUP-11278` (8.2 days, P2, Engineering) represent severe SLA breaches on Enterprise client accounts.

### 5. Reopen Friction Causes Catastrophic CSAT Collapse
- **Evidence:** 151 tickets experienced at least one customer reopen (10.46% reopen rate), with 169 total reopen events.
  - Tickets resolved cleanly on first attempt achieved an average CSAT of **4.12 / 5.0**.
  - Tickets reopened once dropped to **2.94 / 5.0**.
  - Tickets reopened 2+ times plummeted to **1.82 / 5.0**.
- **Impact:** Premature closures by support agents to "stop the SLA clock" directly cause customer reopens and inflict permanent CSAT penalties.

### 6. Misleading Agent Performance: The Workload & Complexity Gap
- **Evidence:** A superficial inspection might suggest **Neha P** (CSAT 3.94) and **Vikram S** (CSAT 3.92) outperform **Karan B** (CSAT 3.13). However, normalizing for workload reveals:
  - **Karan B** handled **217 tickets (26% more volume)**, with a high concentration of high-severity (P1/P2) incidents and engineering handoffs (Complexity Index: 1.18x).
  - **Neha P** handled 171 tickets, dominated by straightforward how-to inquiries (Complexity Index: 0.86x).
- **Impact:** Without complexity-adjusted evaluation, high-capacity agents handling complex incidents are unfairly penalized, risking team burnout and turnover.

### 7. Key Account Risk: Concentration Among Enterprise Accounts
- **Evidence:** Out of 50 total corporate clients, the top 5 clients by ticket volume (**TechMahindra, Infosys, Wipro, TCS, Flipkart**) account for **21.3% of all ticket traffic** and **25.0% of the active open backlog**.
- **Impact:** Several of these marquee enterprise accounts currently have tickets pending in engineering for >5 days, jeopardizing upcoming contract renewals.

---

## Summary Scorecard

| Metric | Measured Value | Benchmark / Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Inflow** | 1,444 tickets | — | Analyzed |
| **Open Backlog Ratio** | 3.32% (48 tickets) | < 5.0% | 🟢 Healthy |
| **Escalation Rate** | 33.66% (486 tickets) | < 15.0% | 🔴 Severe |
| **Preventable Escalations** | 56.6% (275 tickets) | < 10.0% | 🔴 Critical |
| **Avg Resolution (L1 Only)** | 20.0 hours | < 24.0 hours | 🟢 Healthy |
| **Avg Resolution (Escalated)** | 99.8 hours | < 48.0 hours | 🔴 Severe |
| **Reopen Rate** | 10.46% (151 tickets) | < 5.0% | 🟡 Moderate |
| **Average CSAT** | 3.70 / 5.0 | > 4.2 / 5.0 | 🟡 Needs Improvement |
