import { Ticket, ExecutiveKPIs, FilterState } from '../types';

export function filterTickets(tickets: Ticket[], filters: FilterState): Ticket[] {
  return tickets.filter((t) => {
    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchId = t.ticket_id.toLowerCase().includes(q);
      const matchClient = t.client_name.toLowerCase().includes(q) || t.client_id.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchAgent = t.assigned_agent.toLowerCase().includes(q);
      const matchEngId = t.eng_ticket_id ? t.eng_ticket_id.toLowerCase().includes(q) : false;
      const matchCategory = t.category.toLowerCase().includes(q);
      if (!matchId && !matchClient && !matchDesc && !matchAgent && !matchEngId && !matchCategory) {
        return false;
      }
    }

    // Priority
    if (filters.priority && filters.priority !== 'ALL') {
      if (t.priority !== filters.priority) return false;
    }

    // Category
    if (filters.category && filters.category !== 'ALL') {
      if (t.category !== filters.category) return false;
    }

    // Status
    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'OPEN_ALL') {
        if (!t.is_open) return false;
      } else if (t.status !== filters.status) {
        return false;
      }
    }

    // Agent
    if (filters.agent && filters.agent !== 'ALL') {
      if (t.assigned_agent !== filters.agent) return false;
    }

    // Client
    if (filters.client && filters.client !== 'ALL') {
      if (t.client_id !== filters.client && t.client_name !== filters.client) return false;
    }

    // Client Tier
    if (filters.clientTier && filters.clientTier !== 'ALL') {
      if (t.client_tier !== filters.clientTier) return false;
    }

    // Escalated
    if (filters.escalated && filters.escalated !== 'ALL') {
      if (t.escalated_to_eng !== filters.escalated) return false;
    }

    // Aging Bucket
    if (filters.agingBucket && filters.agingBucket !== 'ALL') {
      if (t.aging_bucket !== filters.agingBucket) return false;
    }

    // Recommended Action
    if (filters.recommendedAction && filters.recommendedAction !== 'ALL') {
      if (t.recommended_action !== filters.recommendedAction) return false;
    }

    return true;
  });
}

export function computeFilteredKPIs(tickets: Ticket[]): ExecutiveKPIs {
  const total = tickets.length;
  const open = tickets.filter((t) => t.is_open);
  const closed = tickets.filter((t) => !t.is_open);

  const openCount = open.length;
  const openPct = total > 0 ? Number(((openCount / total) * 100).toFixed(2)) : 0;

  const escalatedCount = tickets.filter((t) => t.escalated_to_eng === 'Yes').length;
  const escalationRate = total > 0 ? Number(((escalatedCount / total) * 100).toFixed(2)) : 0;

  const validResTimes = closed.map((t) => t.resolution_hours).filter((h): h is number => h !== null && !isNaN(h));
  const avgResTime = validResTimes.length > 0
    ? Number((validResTimes.reduce((acc, v) => acc + v, 0) / validResTimes.length).toFixed(1))
    : 0;

  let medianResTime = 0;
  if (validResTimes.length > 0) {
    const sorted = [...validResTimes].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    medianResTime = sorted.length % 2 !== 0 ? sorted[mid] : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1));
  }

  const reopenedCount = tickets.filter((t) => t.reopen_count > 0).length;
  const reopenRate = total > 0 ? Number(((reopenedCount / total) * 100).toFixed(2)) : 0;

  const csatScores = tickets.map((t) => t.csat_score).filter((s): s is number => s !== null && !isNaN(s));
  const avgCsat = csatScores.length > 0
    ? Number((csatScores.reduce((acc, v) => acc + v, 0) / csatScores.length).toFixed(2))
    : 0;
  const csatRespRate = total > 0 ? Number(((csatScores.length / total) * 100).toFixed(1)) : 0;

  const awaitingEng = tickets.filter((t) => t.status === 'Open - with Engineering').length;
  const awaitingL1 = tickets.filter((t) => t.status === 'Open - with L1').length;

  return {
    total_tickets: total,
    closed_tickets: closed.length,
    open_tickets: openCount,
    open_ticket_percentage: openPct,
    escalated_tickets: escalatedCount,
    escalation_rate: escalationRate,
    average_resolution_hours: avgResTime,
    median_resolution_hours: medianResTime,
    reopened_tickets_count: reopenedCount,
    reopen_rate: reopenRate,
    average_csat: avgCsat,
    csat_response_count: csatScores.length,
    csat_response_rate: csatRespRate,
    awaiting_engineering: awaitingEng,
    awaiting_l1: awaitingL1,
  };
}
