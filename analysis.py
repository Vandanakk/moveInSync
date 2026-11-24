"""
RideOps Support Intelligence Analysis Module
---------------------------------------------
Reproducible analytical module for the RideOps Support Case Study.
Snapshot Date: September 30, 2026 23:59:59 IST.
"""

import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional
import math
import numpy as np
import pandas as pd

SNAPSHOT_DATE = pd.to_datetime("2026-09-30 23:59:59")


def load_data(filepath: str = "rideops_support_tickets.csv") -> pd.DataFrame:
    """Load and parse the RideOps support tickets CSV."""
    df = pd.read_csv(filepath)

    # Date parsing
    for col in ["created_at", "first_response_at", "first_closed_at", "final_closed_at"]:
        df[col] = pd.to_datetime(df[col])

    # Computed fields
    df["is_open"] = df["status"] != "Closed"
    df["is_escalated"] = df["escalated_to_eng"] == "Yes"
    df["has_reopened"] = df["reopen_count"] > 0

    # Age in days as of snapshot for open, or turnaround time for closed
    df["age_days"] = np.where(
        df["is_open"],
        (SNAPSHOT_DATE - df["created_at"]).dt.total_seconds() / 86400.0,
        (df["final_closed_at"] - df["created_at"]).dt.total_seconds() / 86400.0,
    )
    df["age_days"] = df["age_days"].round(2)

    # Resolution hours for closed tickets
    df["resolution_hours"] = np.where(
        ~df["is_open"],
        (df["final_closed_at"] - df["created_at"]).dt.total_seconds() / 3600.0,
        np.nan,
    )
    df["resolution_hours"] = df["resolution_hours"].round(1)

    # First response minutes
    df["first_response_minutes"] = (
        (df["first_response_at"] - df["created_at"]).dt.total_seconds() / 60.0
    ).round(1)

    # Add priority score and recommendation
    df["priority_score"] = df.apply(calculate_priority_score, axis=1)
    df["recommended_action"] = df.apply(get_recommended_action, axis=1)

    # Aging bucket for open tickets
    bins = [-0.01, 1, 3, 7, 9999]
    labels = ["0-1 days", "2-3 days", "4-7 days", "8+ days"]
    df["aging_bucket"] = pd.cut(df["age_days"], bins=bins, labels=labels).astype(str)

    return df


def calculate_priority_score(row: pd.Series) -> int:
    """Calculate transparent priority score (0-100) for backlog management.
    
    Weights:
    - Base Priority: P1=40, P2=28, P3=16, P4=8
    - Age of unresolved ticket:
        >= 7 days: +30
        >= 4 days: +20
        >= 2 days: +12
        >= 1 day:  +6
        < 1 day:   +2
    - Engineering state:
        Open with Engineering (>= 3 days): +18 (overdue eng bottleneck)
        Open with Engineering (< 3 days):  +10
        Returned to L1 from Engineering:   +12 (handoff risk)
    - Handoff ping-pong penalty:
        eng_handoffs >= 2: +6
    - Reopen History:
        reopen_count >= 2: +15 (chronic failure)
        reopen_count == 1: +8
    - Client Tier:
        Enterprise: +5, Mid-market: +2, SMB: 0
    """
    if row.get("status") == "Closed":
        return 0

    score = 0
    # 1. Base Priority
    prio_map = {"P1": 40, "P2": 28, "P3": 16, "P4": 8}
    score += prio_map.get(row.get("priority"), 10)

    # 2. Aging
    age = row.get("age_days", 0)
    if age >= 7:
        score += 30
    elif age >= 4:
        score += 20
    elif age >= 2:
        score += 12
    elif age >= 1:
        score += 6
    else:
        score += 2

    # 3. Engineering status & handoffs
    status = row.get("status")
    if status == "Open - with Engineering":
        if age >= 3:
            score += 18
        else:
            score += 10
    elif row.get("escalated_to_eng") == "Yes" and status == "Open - with L1":
        score += 12

    if row.get("eng_handoffs", 0) >= 2:
        score += 6

    # 4. Reopen History
    reopens = row.get("reopen_count", 0)
    if reopens >= 2:
        score += 15
    elif reopens == 1:
        score += 8

    # 5. Client Tier
    tier_map = {"Enterprise": 5, "Mid-market": 2, "SMB": 0}
    score += tier_map.get(row.get("client_tier"), 0)

    return min(100, max(0, int(score)))


def get_recommended_action(row: pd.Series) -> str:
    """Assign deterministic recommended action based on operational criteria."""
    if row.get("status") == "Closed":
        return "Ticket Resolved"

    status = row.get("status")
    age = row.get("age_days", 0)
    priority = row.get("priority")
    reopens = row.get("reopen_count", 0)
    eng_outcome = str(row.get("eng_outcome", ""))

    if status == "Open - with Engineering" and age >= 3:
        if priority in ["P1", "P2"]:
            return "Escalate overdue engineering ticket"
        return "Follow up with engineering"
    if reopens >= 1 and status == "Open - with L1":
        return "Investigate repeated reopen"
    if priority in ["P1", "P2"] and age >= 2:
        return "Resolve high-priority aging ticket"
    if status == "Open - with Engineering":
        return "Follow up with engineering"
    if row.get("escalated_to_eng") == "Yes" and ("returned to L1" in eng_outcome or row.get("eng_handoffs", 0) >= 2):
        return "Review engineering notes & fix configuration"
    return "Normal L1 follow-up"


def calculate_executive_kpis(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate executive level KPIs."""
    total_tickets = len(df)
    open_df = df[df["is_open"]]
    closed_df = df[~df["is_open"]]

    open_count = len(open_df)
    open_pct = round((open_count / total_tickets) * 100, 2) if total_tickets else 0

    escalated_count = int(df["is_escalated"].sum())
    escalation_rate = round((escalated_count / total_tickets) * 100, 2) if total_tickets else 0

    avg_res_time = round(closed_df["resolution_hours"].mean(), 1) if len(closed_df) else 0
    median_res_time = round(closed_df["resolution_hours"].median(), 1) if len(closed_df) else 0

    reopened_count = int((df["reopen_count"] > 0).sum())
    reopen_rate = round((reopened_count / total_tickets) * 100, 2) if total_tickets else 0

    csat_rated = df["csat_score"].dropna()
    avg_csat = round(csat_rated.mean(), 2) if len(csat_rated) else 0
    csat_response_rate = round((len(csat_rated) / total_tickets) * 100, 1) if total_tickets else 0

    return {
        "total_tickets": total_tickets,
        "closed_tickets": len(closed_df),
        "open_tickets": open_count,
        "open_ticket_percentage": open_pct,
        "escalated_tickets": escalated_count,
        "escalation_rate": escalation_rate,
        "average_resolution_hours": avg_res_time,
        "median_resolution_hours": median_res_time,
        "reopened_tickets_count": reopened_count,
        "reopen_rate": reopen_rate,
        "average_csat": avg_csat,
        "csat_response_count": len(csat_rated),
        "csat_response_rate": csat_response_rate,
        "awaiting_engineering": int((df["status"] == "Open - with Engineering").sum()),
        "awaiting_l1": int((df["status"] == "Open - with L1").sum()),
    }


def calculate_weekly_trends(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Calculate weekly creation, resolution, escalation, and open trends."""
    df_temp = df.copy()
    df_temp["week_created"] = df_temp["created_at"].dt.to_period("W-SUN").dt.start_time

    weeks = sorted(df_temp["week_created"].unique())
    trend_data = []

    for w in weeks:
        w_created = df_temp[df_temp["week_created"] == w]
        w_str = w.strftime("%b %d")

        # Closed count created in that week
        closed_in_week = int((w_created["status"] == "Closed").sum())
        open_in_week = int(w_created["is_open"].sum())
        escalated_in_week = int(w_created["is_escalated"].sum())
        reopened_in_week = int(w_created["has_reopened"].sum())

        avg_csat_w = w_created["csat_score"].dropna().mean()
        avg_res_w = w_created[~w_created["is_open"]]["resolution_hours"].mean()

        trend_data.append({
            "week": w_str,
            "week_start": w.strftime("%Y-%m-%d"),
            "created": len(w_created),
            "closed": closed_in_week,
            "still_open": open_in_week,
            "escalated": escalated_in_week,
            "reopened": reopened_in_week,
            "avg_csat": round(avg_csat_w, 2) if not np.isnan(avg_csat_w) else None,
            "avg_resolution_hours": round(avg_res_w, 1) if not np.isnan(avg_res_w) else None,
        })

    return trend_data


def calculate_backlog_metrics(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate comprehensive backlog analytics."""
    open_df = df[df["is_open"]].copy()

    # Aging buckets
    aging_order = ["0-1 days", "2-3 days", "4-7 days", "8+ days"]
    aging_counts = open_df["aging_bucket"].value_counts().to_dict()
    aging_breakdown = [{"bucket": b, "count": aging_counts.get(b, 0)} for b in aging_order]

    # By priority
    prio_counts = open_df["priority"].value_counts().to_dict()
    prio_breakdown = [{"priority": p, "count": prio_counts.get(p, 0)} for p in ["P1", "P2", "P3", "P4"]]

    # By category
    cat_counts = open_df["category"].value_counts().reset_index()
    cat_counts.columns = ["category", "count"]
    cat_breakdown = cat_counts.to_dict(orient="records")

    # Longest pending open tickets
    longest_pending = open_df.sort_values(by="age_days", ascending=False).head(15)
    longest_records = longest_pending[[
        "ticket_id", "client_name", "client_tier", "category", "priority",
        "assigned_agent", "status", "escalated_to_eng", "eng_handoffs",
        "eng_outcome", "reopen_count", "age_days", "priority_score", "recommended_action"
    ]].replace({np.nan: None}).to_dict(orient="records")

    return {
        "total_open": len(open_df),
        "awaiting_engineering": int((open_df["status"] == "Open - with Engineering").sum()),
        "awaiting_l1": int((open_df["status"] == "Open - with L1").sum()),
        "aging_breakdown": aging_breakdown,
        "priority_breakdown": prio_breakdown,
        "category_breakdown": cat_breakdown,
        "longest_pending": longest_records,
    }


def calculate_escalation_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Analyze engineering escalations, outcomes, turnaround time, and ping-pong."""
    esc_df = df[df["is_escalated"]].copy()
    total_esc = len(esc_df)

    # Outcome breakdown
    outcome_counts = esc_df["eng_outcome"].value_counts(dropna=False)
    outcomes = []
    for k, v in outcome_counts.items():
        name = "Pending / Open with Eng" if pd.isna(k) else str(k)
        is_preventable = name in [
            "Insufficient info - returned to L1",
            "Config issue - returned to L1",
            "Duplicate of known issue",
            "Not a bug - how-to",
            "Not reproducible",
        ]
        outcomes.append({
            "outcome": name,
            "count": int(v),
            "percentage": round((v / total_esc) * 100, 1),
            "is_preventable": is_preventable,
        })

    # Preventable escalations rate
    preventable_count = sum(o["count"] for o in outcomes if o["is_preventable"])
    preventable_pct = round((preventable_count / total_esc) * 100, 1)

    # Resolution turnaround: escalated closed vs non-escalated closed
    closed_esc = df[~df["is_open"] & df["is_escalated"]]
    closed_non_esc = df[~df["is_open"] & ~df["is_escalated"]]

    esc_avg_hrs = round(closed_esc["resolution_hours"].mean(), 1)
    non_esc_avg_hrs = round(closed_non_esc["resolution_hours"].mean(), 1)

    # Escalations by category
    cat_esc = df.groupby("category").agg(
        total=("ticket_id", "count"),
        escalated=("is_escalated", "sum"),
        fixed=("eng_outcome", lambda x: (x == "Fixed").sum()),
        returned_config=("eng_outcome", lambda x: (x == "Config issue - returned to L1").sum()),
        returned_missing_info=("eng_outcome", lambda x: (x == "Insufficient info - returned to L1").sum()),
        duplicate=("eng_outcome", lambda x: (x == "Duplicate of known issue").sum()),
        avg_res_hrs=("resolution_hours", lambda x: round(x.dropna().mean(), 1)),
    ).reset_index()

    cat_esc["escalation_rate"] = (cat_esc["escalated"] / cat_esc["total"] * 100).round(1)
    cat_esc["unnecessary_count"] = cat_esc["returned_config"] + cat_esc["returned_missing_info"] + cat_esc["duplicate"]
    cat_esc["unnecessary_pct"] = np.where(
        cat_esc["escalated"] > 0,
        (cat_esc["unnecessary_count"] / cat_esc["escalated"] * 100).round(1),
        0.0,
    )
    cat_esc = cat_esc.sort_values(by="escalated", ascending=False).to_dict(orient="records")

    return {
        "total_escalated": total_esc,
        "escalation_percentage": round((total_esc / len(df)) * 100, 1),
        "preventable_escalations_count": preventable_count,
        "preventable_escalations_percentage": preventable_pct,
        "eng_avg_resolution_hours": esc_avg_hrs,
        "non_eng_avg_resolution_hours": non_esc_avg_hrs,
        "turnaround_multiplier": round(esc_avg_hrs / non_esc_avg_hrs, 1) if non_esc_avg_hrs else 0,
        "outcomes": outcomes,
        "category_escalations": cat_esc,
    }


def calculate_agent_performance(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Calculate fair agent metrics accounting for volume, priority mix, and escalations."""
    agents = []
    for agent, group in df.groupby("assigned_agent"):
        total = len(group)
        open_cnt = int(group["is_open"].sum())
        closed = group[~group["is_open"]]
        p1_p2 = int(group["priority"].isin(["P1", "P2"]).sum())
        p1_p2_pct = round((p1_p2 / total) * 100, 1)

        esc = int(group["is_escalated"].sum())
        esc_rate = round((esc / total) * 100, 1)

        reopens = int(group["has_reopened"].sum())
        reopen_rate = round((reopens / total) * 100, 1)

        avg_res = round(closed["resolution_hours"].mean(), 1) if len(closed) else 0
        avg_resp = round(group["first_response_minutes"].dropna().mean(), 1)

        csat = group["csat_score"].dropna()
        avg_csat = round(csat.mean(), 2) if len(csat) else None
        csat_cnt = len(csat)

        # Workload complexity index: weighted score based on P1/P2 mix + escalated ticket handling
        complexity_score = round((p1_p2_pct * 0.5) + (esc_rate * 0.5), 1)

        agents.append({
            "agent": agent,
            "total_tickets": total,
            "open_tickets": open_cnt,
            "closed_tickets": len(closed),
            "p1_p2_count": p1_p2,
            "p1_p2_percentage": p1_p2_pct,
            "escalated_count": esc,
            "escalation_rate": esc_rate,
            "reopened_count": reopens,
            "reopen_rate": reopen_rate,
            "avg_resolution_hours": avg_res,
            "avg_first_response_min": avg_resp,
            "csat_rated_count": csat_cnt,
            "avg_csat": avg_csat,
            "complexity_score": complexity_score,
        })

    return sorted(agents, key=lambda x: x["total_tickets"], reverse=True)


def calculate_client_performance(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate client-wise ticket volume, unresolved counts, and CSAT."""
    clients = []
    for (cid, cname, tier), group in df.groupby(["client_id", "client_name", "client_tier"]):
        total = len(group)
        open_cnt = int(group["is_open"].sum())
        esc_cnt = int(group["is_escalated"].sum())
        reopen_cnt = int(group["has_reopened"].sum())
        csat = group["csat_score"].dropna()

        clients.append({
            "client_id": cid,
            "client_name": cname,
            "client_tier": tier,
            "total_tickets": total,
            "open_tickets": open_cnt,
            "escalated_tickets": esc_cnt,
            "reopened_tickets": reopen_cnt,
            "escalation_rate": round((esc_cnt / total) * 100, 1),
            "avg_csat": round(csat.mean(), 2) if len(csat) else None,
            "csat_count": len(csat),
        })

    clients_by_volume = sorted(clients, key=lambda x: x["total_tickets"], reverse=True)
    clients_by_unresolved = sorted(
        [c for c in clients if c["open_tickets"] > 0],
        key=lambda x: (x["open_tickets"], x["total_tickets"]),
        reverse=True,
    )

    return {
        "all_clients": clients,
        "top_clients_by_volume": clients_by_volume[:15],
        "top_clients_with_open_tickets": clients_by_unresolved[:15],
    }


def export_processed_json(df: pd.DataFrame, output_path: str = "tickets_data.json"):
    """Export complete dataset and aggregated slices to JSON for the dashboard."""
    # Serialize ticket list
    tickets_list = []
    for _, r in df.iterrows():
        tickets_list.append({
            "ticket_id": r["ticket_id"],
            "created_at": r["created_at"].strftime("%Y-%m-%d %H:%M"),
            "channel": r["channel"],
            "client_id": r["client_id"],
            "client_name": r["client_name"],
            "client_tier": r["client_tier"],
            "category": r["category"],
            "priority": r["priority"],
            "description": r["description"],
            "assigned_agent": r["assigned_agent"],
            "first_response_at": r["first_response_at"].strftime("%Y-%m-%d %H:%M") if pd.notna(r["first_response_at"]) else None,
            "escalated_to_eng": r["escalated_to_eng"],
            "eng_ticket_id": r["eng_ticket_id"] if pd.notna(r["eng_ticket_id"]) else None,
            "eng_handoffs": int(r["eng_handoffs"]),
            "eng_outcome": r["eng_outcome"] if pd.notna(r["eng_outcome"]) else None,
            "status": r["status"],
            "first_closed_at": r["first_closed_at"].strftime("%Y-%m-%d %H:%M") if pd.notna(r["first_closed_at"]) else None,
            "final_closed_at": r["final_closed_at"].strftime("%Y-%m-%d %H:%M") if pd.notna(r["final_closed_at"]) else None,
            "reopen_count": int(r["reopen_count"]),
            "csat_score": float(r["csat_score"]) if pd.notna(r["csat_score"]) else None,
            "is_open": bool(r["is_open"]),
            "age_days": float(r["age_days"]),
            "resolution_hours": float(r["resolution_hours"]) if pd.notna(r["resolution_hours"]) else None,
            "first_response_minutes": float(r["first_response_minutes"]) if pd.notna(r["first_response_minutes"]) else None,
            "priority_score": int(r["priority_score"]),
            "recommended_action": r["recommended_action"],
            "aging_bucket": str(r["aging_bucket"]),
        })

    payload = {
        "metadata": {
            "snapshot_date": "2026-09-30 23:59:59",
            "total_records": len(df),
            "generated_at": datetime.now().isoformat(),
        },
        "kpis": calculate_executive_kpis(df),
        "weekly_trends": calculate_weekly_trends(df),
        "backlog": calculate_backlog_metrics(df),
        "escalations": calculate_escalation_analysis(df),
        "agents": calculate_agent_performance(df),
        "clients": calculate_client_performance(df),
        "tickets": tickets_list,
    }

    def sanitize_val(obj):
        if isinstance(obj, float) and (np.isnan(obj) or math.isnan(obj)):
            return None
        elif isinstance(obj, dict):
            return {k: sanitize_val(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [sanitize_val(v) for v in obj]
        return obj

    clean_payload = sanitize_val(payload)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(clean_payload, f, indent=2)

    print(f"Exported processed data to {output_path} ({len(tickets_list)} tickets)")
    return payload


if __name__ == "__main__":
    print("Loading RideOps Support data...")
    df = load_data("rideops_support_tickets.csv")
    kpis = calculate_executive_kpis(df)
    print("\n=== EXECUTIVE KPIS ===")
    for k, v in kpis.items():
        print(f"  {k}: {v}")

    export_processed_json(df, "tickets_data.json")
    print("\nAnalysis module executed successfully.")
