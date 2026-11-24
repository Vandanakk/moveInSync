import React from 'react';
import {
  ClockAlert,
  AlertOctagon,
  Server,
  Layers,
  ArrowUpRight,
  Filter,
  Flame,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  CartesianGrid,
} from 'recharts';
import { Ticket, FilterState } from '../types';

interface BacklogIntelligenceProps {
  tickets: Ticket[];
  allOpenTickets: Ticket[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectTicket: (ticket: Ticket) => void;
  onNavigateToTab: (tab: string) => void;
}

export const BacklogIntelligence: React.FC<BacklogIntelligenceProps> = ({
  tickets,
  allOpenTickets,
  filters,
  setFilters,
  onSelectTicket,
  onNavigateToTab,
}) => {
  // Use open tickets from current filtered subset
  const filteredOpen = tickets.filter((t) => t.is_open);

  // Aging buckets
  const buckets = [
    {
      label: '0–1 days',
      bucketKey: '0-1 days',
      desc: 'Fresh inflow',
      count: filteredOpen.filter((t) => t.aging_bucket === '0-1 days').length,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeColor: 'bg-emerald-600',
      barColor: '#10b981',
      slaStatus: 'Within SLA',
    },
    {
      label: '2–3 days',
      bucketKey: '2-3 days',
      desc: 'Approaching SLA breach',
      count: filteredOpen.filter((t) => t.aging_bucket === '2-3 days').length,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      badgeColor: 'bg-blue-600',
      barColor: '#3b82f6',
      slaStatus: 'Under review',
    },
    {
      label: '4–7 days',
      bucketKey: '4-7 days',
      desc: 'Stalled / Engineering delay',
      count: filteredOpen.filter((t) => t.aging_bucket === '4-7 days').length,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeColor: 'bg-amber-600',
      barColor: '#f59e0b',
      slaStatus: 'Delayed',
    },
    {
      label: '8+ days',
      bucketKey: '8+ days',
      desc: 'Critical chronic bottleneck',
      count: filteredOpen.filter((t) => t.aging_bucket === '8+ days').length,
      color: 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200',
      badgeColor: 'bg-rose-600',
      barColor: '#ef4444',
      slaStatus: 'Critical SLA Breach',
      isCritical: true,
    },
  ];

  // Engineering waiting tickets
  const awaitingEng = filteredOpen.filter((t) => t.status === 'Open - with Engineering');
  const awaitingL1 = filteredOpen.filter((t) => t.status === 'Open - with L1');

  // Priority breakdown
  const priorityOrder = ['P1', 'P2', 'P3', 'P4'];
  const priorityColors: Record<string, string> = {
    P1: '#ef4444',
    P2: '#f97316',
    P3: '#3b82f6',
    P4: '#64748b',
  };
  const prioData = priorityOrder.map((p) => ({
    priority: p,
    count: filteredOpen.filter((t) => t.priority === p).length,
    color: priorityColors[p],
  }));

  // Category breakdown
  const categoryMap = filteredOpen.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Longest pending tickets
  const longestPending = [...filteredOpen].sort((a, b) => b.age_days - a.age_days).slice(0, 10);

  const handleBucketClick = (bucketKey: string) => {
    if (filters.agingBucket === bucketKey) {
      setFilters((prev) => ({ ...prev, agingBucket: 'ALL' }));
    } else {
      setFilters((prev) => ({ ...prev, agingBucket: bucketKey }));
    }
  };

  const handlePriorityClick = (p: string) => {
    if (filters.priority === p) {
      setFilters((prev) => ({ ...prev, priority: 'ALL' }));
    } else {
      setFilters((prev) => ({ ...prev, priority: p }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Backlog Banner Alert */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ClockAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-amber-950">
                Active Backlog Queue Diagnostic
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/70 text-amber-900">
                Snapshot: 30 Sep 2026
              </span>
            </div>
            <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
              <strong className="font-semibold text-amber-950">{filteredOpen.length} open tickets</strong> currently pending. 
              <span className="font-semibold text-rose-700 ml-1">
                {awaitingEng.length} tickets ({((awaitingEng.length / (filteredOpen.length || 1)) * 100).toFixed(0)}%)
              </span> are stuck in engineering handoffs.
              5 tickets have been unresolved for <strong>over 8 days</strong> (longest: 9.3 days).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigateToTab('prioritization')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1 transition-colors"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Prioritize Backlog</span>
          </button>
        </div>
      </div>

      {/* 4 Aging Buckets Interactive Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Open Tickets by Aging Buckets (Click card to filter)
          </h4>
          {filters.agingBucket && filters.agingBucket !== 'ALL' && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, agingBucket: 'ALL' }))}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset aging filter ({filters.agingBucket})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {buckets.map((b) => {
            const isSelected = filters.agingBucket === b.bucketKey;
            return (
              <div
                key={b.label}
                onClick={() => handleBucketClick(b.bucketKey)}
                className={`rounded-xl border p-4.5 cursor-pointer transition-all relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-blue-600 bg-blue-50/50 border-blue-400 shadow-sm'
                    : `${b.color} hover:shadow-sm`
                }`}
              >
                {b.isCritical && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-bl"></span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-tight">{b.label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70 text-slate-700 border border-slate-200/60">
                    {b.slaStatus}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold tracking-tight">{b.count}</span>
                  <span className="text-xs text-slate-600 font-medium">tickets</span>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 truncate">{b.desc}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {filteredOpen.length > 0
                      ? `${((b.count / filteredOpen.length) * 100).toFixed(0)}% of backlog`
                      : '0%'}
                  </span>
                  <span className="font-semibold text-blue-600 flex items-center space-x-0.5">
                    <span>{isSelected ? 'Active Filter' : 'Filter'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Awaiting vs L1 Split and Priority Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
            Backlog Responsibility Split
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Where open tickets currently sit waiting for action
          </p>

          <div className="space-y-3">
            {/* Engineering Queue */}
            <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-rose-950">
                    Open - with Engineering
                  </span>
                </div>
                <span className="text-base font-extrabold text-rose-700">
                  {awaitingEng.length}
                </span>
              </div>
              <p className="text-[11px] text-rose-900/80 leading-normal">
                Tickets assigned to engineering. Average time pending is{' '}
                <strong>
                  {(awaitingEng.reduce((acc, t) => acc + t.age_days, 0) / (awaitingEng.length || 1)).toFixed(1)} days
                </strong>.
              </p>
            </div>

            {/* L1 Queue */}
            <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-950">
                    Open - with L1 Support
                  </span>
                </div>
                <span className="text-base font-extrabold text-amber-700">
                  {awaitingL1.length}
                </span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-normal">
                Awaiting agent triage, customer feedback, or configuration fix returned from engineering.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Ping-Pong Tickets (handoffs &gt;= 2):</span>
            <span className="font-bold text-rose-700">
              {filteredOpen.filter((t) => t.eng_handoffs >= 2).length} tickets
            </span>
          </div>
        </div>

        {/* Backlog by Priority */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Backlog by Priority
            </h4>
            <span className="text-xs text-slate-400 font-medium">Click to filter</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Critical P1/P2 tickets represent 21% of the open backlog
          </p>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prioData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {prioData.map((entry) => (
                    <Cell
                      key={entry.priority}
                      fill={entry.color}
                      cursor="pointer"
                      onClick={() => handlePriorityClick(entry.priority)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100 text-center">
            {prioData.map((p) => (
              <button
                key={p.priority}
                onClick={() => handlePriorityClick(p.priority)}
                className={`p-1.5 rounded text-xs transition-colors ${
                  filters.priority === p.priority ? 'bg-blue-100 ring-1 ring-blue-500' : 'hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-slate-900 block">{p.count}</span>
                <span className="text-[10px] text-slate-500 font-medium">{p.priority}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Backlog by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
            Backlog by Category
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Top categories driving the current pending backlog
          </p>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {categoryData.map((c) => {
              const maxCount = categoryData[0]?.count || 1;
              const pct = (c.count / maxCount) * 100;
              return (
                <div
                  key={c.category}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === c.category ? 'ALL' : c.category,
                    }))
                  }
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    filters.category === c.category
                      ? 'border-blue-400 bg-blue-50/70'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">
                      {c.category}
                    </span>
                    <span className="font-bold text-slate-900">{c.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Longest-Pending Tickets Table (Audit Focus) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Longest-Pending Tickets in Backlog (Urgent SLA Action)
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                Top 10 Aging
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tickets sorted descending by age in days as of Sep 30, 2026. Click any row to view full details.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('prioritization')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
          >
            <span>View Full Prioritized Backlog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Eng Ticket</th>
                <th className="px-4 py-3">Handoffs</th>
                <th className="px-4 py-3">Priority Score</th>
                <th className="px-4 py-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {longestPending.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                    No open tickets matching current filters.
                  </td>
                </tr>
              ) : (
                longestPending.map((t) => {
                  const prioBadges: Record<string, string> = {
                    P1: 'bg-rose-100 text-rose-800 border-rose-200',
                    P2: 'bg-orange-100 text-orange-800 border-orange-200',
                    P3: 'bg-blue-100 text-blue-800 border-blue-200',
                    P4: 'bg-slate-100 text-slate-800 border-slate-200',
                  };

                  return (
                    <tr
                      key={t.ticket_id}
                      onClick={() => onSelectTicket(t)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-blue-600">
                        {t.ticket_id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{t.client_name}</div>
                        <div className="text-[10px] text-slate-400">{t.client_tier}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            prioBadges[t.priority]
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[180px] truncate text-slate-700 font-medium">
                        {t.category}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        <span
                          className={
                            t.age_days >= 7
                              ? 'text-rose-600 font-bold'
                              : t.age_days >= 4
                              ? 'text-amber-600 font-bold'
                              : 'text-slate-700'
                          }
                        >
                          {t.age_days}d
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            t.status === 'Open - with Engineering'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {t.eng_ticket_id || '—'}
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            t.eng_handoffs >= 2
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.eng_handoffs}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              t.priority_score >= 80
                                ? 'bg-rose-500'
                                : t.priority_score >= 60
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                          ></span>
                          <span>{t.priority_score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[170px] inline-block">
                          {t.recommended_action}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
