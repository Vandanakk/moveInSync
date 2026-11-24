export interface Ticket {
  ticket_id: string;
  created_at: string;
  channel: string;
  client_id: string;
  client_name: string;
  client_tier: 'Enterprise' | 'Mid-market' | 'SMB';
  category: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  description: string;
  assigned_agent: string;
  first_response_at: string | null;
  escalated_to_eng: 'Yes' | 'No';
  eng_ticket_id: string | null;
  eng_handoffs: number;
  eng_outcome: string | null;
  status: 'Closed' | 'Open - with L1' | 'Open - with Engineering';
  first_closed_at: string | null;
  final_closed_at: string | null;
  reopen_count: number;
  csat_score: number | null;
  is_open: boolean;
  age_days: number;
  resolution_hours: number | null;
  first_response_minutes: number | null;
  priority_score: number;
  recommended_action: string;
  aging_bucket: '0-1 days' | '2-3 days' | '4-7 days' | '8+ days';
}

export interface ExecutiveKPIs {
  total_tickets: number;
  closed_tickets: number;
  open_tickets: number;
  open_ticket_percentage: number;
  escalated_tickets: number;
  escalation_rate: number;
  average_resolution_hours: number;
  median_resolution_hours: number;
  reopened_tickets_count: number;
  reopen_rate: number;
  average_csat: number;
  csat_response_count: number;
  csat_response_rate: number;
  awaiting_engineering: number;
  awaiting_l1: number;
}

export interface WeeklyTrend {
  week: string;
  week_start: string;
  created: number;
  closed: number;
  still_open: number;
  escalated: number;
  reopened: number;
  avg_csat: number | null;
  avg_resolution_hours: number | null;
}

export interface AgingBucketItem {
  bucket: string;
  count: number;
}

export interface PriorityBreakdownItem {
  priority: string;
  count: number;
}

export interface CategoryBreakdownItem {
  category: string;
  count: number;
}

export interface EscalationOutcomeItem {
  outcome: string;
  count: number;
  percentage: number;
  is_preventable: boolean;
}

export interface CategoryEscalationItem {
  category: string;
  total: number;
  escalated: number;
  fixed: number;
  returned_config: number;
  returned_missing_info: number;
  duplicate: number;
  avg_res_hrs: number;
  escalation_rate: number;
  unnecessary_count: number;
  unnecessary_pct: number;
}

export interface AgentPerformance {
  agent: string;
  total_tickets: number;
  open_tickets: number;
  closed_tickets: number;
  p1_p2_count: number;
  p1_p2_percentage: number;
  escalated_count: number;
  escalation_rate: number;
  reopened_count: number;
  reopen_rate: number;
  avg_resolution_hours: number;
  avg_first_response_min: number;
  csat_rated_count: number;
  avg_csat: number | null;
  complexity_score: number;
}

export interface ClientItem {
  client_id: string;
  client_name: string;
  client_tier: string;
  total_tickets: number;
  open_tickets: number;
  escalated_tickets: number;
  reopened_tickets: number;
  escalation_rate: number;
  avg_csat: number | null;
  csat_count: number;
}

export interface DashboardData {
  metadata: {
    snapshot_date: string;
    total_records: number;
    generated_at: string;
  };
  kpis: ExecutiveKPIs;
  weekly_trends: WeeklyTrend[];
  backlog: {
    total_open: number;
    awaiting_engineering: number;
    awaiting_l1: number;
    aging_breakdown: AgingBucketItem[];
    priority_breakdown: PriorityBreakdownItem[];
    category_breakdown: CategoryBreakdownItem[];
    longest_pending: any[];
  };
  escalations: {
    total_escalated: number;
    escalation_percentage: number;
    preventable_escalations_count: number;
    preventable_escalations_percentage: number;
    eng_avg_resolution_hours: number;
    non_eng_avg_resolution_hours: number;
    turnaround_multiplier: number;
    outcomes: EscalationOutcomeItem[];
    category_escalations: CategoryEscalationItem[];
  };
  agents: AgentPerformance[];
  clients: {
    all_clients: ClientItem[];
    top_clients_by_volume: ClientItem[];
    top_clients_with_open_tickets: ClientItem[];
  };
  tickets: Ticket[];
}

export interface FilterState {
  search: string;
  priority: string;
  category: string;
  status: string;
  agent: string;
  client: string;
  clientTier: string;
  escalated: string;
  agingBucket: string;
  recommendedAction: string;
}
