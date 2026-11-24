import React, { useState } from 'react';
import {
  GitPullRequest,
  AlertTriangle,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  ArrowRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Ticket, DashboardData, EscalationOutcomeItem, CategoryEscalationItem } from '../types';
import { MetricCard } from './MetricCard';

interface EscalationAnalysisProps {
  escalations: DashboardData['escalations'];
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onFilterByCategory?: (category: string) => void;
}

const OUTCOME_COLORS: Record<string, string> = {
  'Fixed': '#10b981', // green
  'Returned - config issue': '#f59e0b', // amber
  'Returned - insufficient info': '#ef4444', // red
  'Duplicate of known issue': '#8b5cf6', // purple
  'Not a bug - how-to': '#6b7280', // gray
  'Not reproducible': '#ec4899', // pink
};

export const EscalationAnalysis: React.FC<EscalationAnalysisProps> = ({
  escalations,
  tickets,
  onSelectTicket,
  onFilterByCategory,
}) => {
  const [outcomeFilter, setOutcomeFilter] = useState<string>('ALL');

  // Filter open tickets that are currently stuck with engineering
  const openWithEng = tickets
    .filter((t) => t.is_open && t.status === 'Open - with Engineering')
    .sort((a, b) => b.age_days - a.age_days);

  // Filter tickets that were escalated
  const escalatedTickets = tickets.filter((t) => t.escalated_to_eng === 'Yes');

  // Handoff distribution
  const handoffCounts: Record<number, number> = {};
  escalatedTickets.forEach((t) => {
    const h = t.eng_handoffs || 0;
    handoffCounts[h] = (handoffCounts[h] || 0) + 1;
  });
  const handoffData = Object.entries(handoffCounts)
    .map(([handoffs, count]) => ({
      handoffs: `${handoffs} Handoff${handoffs !== '1' ? 's' : ''}`,
      rawHandoff: Number(handoffs),
      count,
      pct: ((count / escalatedTickets.length) * 100).toFixed(1),
    }))
    .sort((a, b) => a.rawHandoff - b.rawHandoff);

  // Preventable vs Legitimate outcomes pie data
  const preventableCount = escalations.preventable_escalations_count;
  const legitimateCount = escalations.total_escalated - preventableCount;
  const breakdownPieData = [
    { name: 'Preventable (Config, Missing Info, Duplicates)', value: preventableCount, color: '#ef4444' },
    { name: 'Genuine Code / System Fixes', value: legitimateCount, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start justify-between shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900">
              Critical Bottleneck: 56.6% of Engineering Escalations are Preventable
            </h4>
            <p className="text-xs text-amber-750 text-slate-700 mt-1 leading-relaxed">
              Engineering resolution takes an average of <strong className="text-slate-900">99.8 hours (~4.2 days)</strong>, which is{' '}
              <strong className="text-slate-900">5.0x slower</strong> than L1 self-resolved tickets (20.0 hours). Out of 486 total escalations,{' '}
              <strong>275 were bounced back</strong> due to missing log data, misconfigured tenant settings, or existing duplicate defects.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Escalated to Engineering"
          value={escalations.total_escalated}
          subtitle={`${escalations.escalation_percentage}% of total ticket volume`}
          icon={GitPullRequest}
          badge={{ text: `${escalations.escalation_percentage}%`, variant: 'blue' }}
        />
        <MetricCard
          title="Engineering Turnaround"
          value={`${escalations.eng_avg_resolution_hours}h`}
          subtitle={`5.0x slower than L1 (${escalations.non_eng_avg_resolution_hours}h)`}
          icon={Clock}
          badge={{ text: '5.0x slower', variant: 'amber' }}
          highlight
        />
        <MetricCard
          title="Preventable Escalations"
          value={`${escalations.preventable_escalations_percentage}%`}
          subtitle={`${escalations.preventable_escalations_count} tickets returned to L1 / duplicates`}
          icon={AlertTriangle}
          badge={{ text: '56.6% avoidable', variant: 'rose' }}
        />
        <MetricCard
          title="Active Open with Eng"
          value={openWithEng.length}
          subtitle={`Oldest open for ${openWithEng[0]?.age_days.toFixed(1) || 0} days`}
          icon={Clock}
          badge={{ text: `${openWithEng.length} tickets`, variant: openWithEng.length > 10 ? 'rose' : 'amber' }}
        />
      </div>

      {/* Charts Row: Outcomes & Preventable Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outcome Breakdown Bar */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Engineering Escalation Resolution Outcomes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of all 486 engineering tickets by final engineering status
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-full">
              486 Escalations
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={escalations.outcomes}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="outcome"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  width={140}
                />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [
                    `${val} tickets (${item.payload.percentage}%)`,
                    item.payload.is_preventable ? 'Preventable' : 'Genuine Code Fix',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {escalations.outcomes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={OUTCOME_COLORS[entry.outcome] || (entry.is_preventable ? '#ef4444' : '#10b981')}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Outcome Legend badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Outcome Classification:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Genuine Code Fix (43.4%)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Missing Logs / Info (18.3%)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Config / Tenant Setting (17.3%)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Duplicate Issue (11.5%)
            </span>
          </div>
        </div>

        {/* Preventable Escalation Donut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Preventable Escalation Ratio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              56.6% could have been resolved at L1 with SOPs
            </p>
          </div>

          <div className="h-48 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {breakdownPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} tickets`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">56.6%</span>
              <span className="text-[11px] text-slate-500">Preventable</span>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Preventable Bounces</span>
              </div>
              <span className="font-semibold text-slate-900">275 tickets</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Fixed in Code</span>
              </div>
              <span className="font-semibold text-slate-900">211 tickets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Escalation Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Escalations & Preventable Rate by Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Categories causing the highest volume of unnecessary engineering round-trips
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket Category</th>
                <th className="py-3 px-4 text-right">Total Tickets</th>
                <th className="py-3 px-4 text-right">Escalated</th>
                <th className="py-3 px-4 text-right">Escalation %</th>
                <th className="py-3 px-4 text-right">Fixed</th>
                <th className="py-3 px-4 text-right">Returned (Config/Info)</th>
                <th className="py-3 px-4 text-right">Preventable %</th>
                <th className="py-3 px-4 text-right">Avg Resolution</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {escalations.category_escalations.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {cat.category}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 font-mono">
                    {cat.total}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-600 font-mono font-medium">
                    {cat.escalated}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${
                        cat.escalation_rate >= 40
                          ? 'bg-rose-100 text-rose-800'
                          : cat.escalation_rate >= 30
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cat.escalation_rate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-mono">
                    {cat.fixed}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-600 font-mono font-medium">
                    {cat.unnecessary_count}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${
                        cat.unnecessary_pct >= 55
                          ? 'bg-red-50 text-red-700 font-semibold border border-red-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cat.unnecessary_pct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 font-mono">
                    {cat.avg_res_hrs}h
                  </td>
                  <td className="py-3 px-4 text-center">
                    {onFilterByCategory && (
                      <button
                        onClick={() => onFilterByCategory(cat.category)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Long-Pending Engineering Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Active Long-Pending Engineering Tickets ({openWithEng.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unresolved tickets currently sitting in the Engineering queue as of Sep 30, 2026
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-800 font-semibold rounded-full">
            Priority Action Needed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Eng Ticket</th>
                <th className="py-3 px-4">Handoffs</th>
                <th className="py-3 px-4 text-right">Age</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Recommended Action</th>
                <th className="py-3 px-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {openWithEng.map((t) => (
                <tr key={t.ticket_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-blue-600">
                    {t.ticket_id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900">{t.client_name}</span>
                    <span className="block text-[11px] text-slate-500">{t.client_tier}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                        t.priority === 'P1'
                          ? 'bg-red-100 text-red-800'
                          : t.priority === 'P2'
                          ? 'bg-orange-100 text-orange-800'
                          : t.priority === 'P3'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-xs">
                    {t.category}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-purple-700 font-medium">
                    {t.eng_ticket_id || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-center text-slate-700">
                    {t.eng_handoffs}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-rose-600">
                    {t.age_days.toFixed(1)}d
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {t.assigned_agent}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      {t.recommended_action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectTicket(t)}
                      className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
