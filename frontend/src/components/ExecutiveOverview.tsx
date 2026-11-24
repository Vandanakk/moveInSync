import React from 'react';
import {
  Ticket as TicketIcon,
  ClockAlert,
  GitPullRequest,
  Timer,
  RotateCcw,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { ExecutiveKPIs, WeeklyTrend, Ticket } from '../types';
import { MetricCard } from './MetricCard';

interface ExecutiveOverviewProps {
  kpis: ExecutiveKPIs;
  weeklyTrends: WeeklyTrend[];
  tickets: Ticket[];
  onNavigateToTab: (tab: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  kpis,
  weeklyTrends,
  tickets,
  onNavigateToTab,
}) => {
  // CSAT distribution
  const csatCounts = [1, 2, 3, 4, 5].map((rating) => {
    const count = tickets.filter((t) => t.csat_score === rating).length;
    return {
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      rawRating: rating,
      count,
    };
  });

  const csatColors = ['#f43f5e', '#fb923c', '#fbbf24', '#60a5fa', '#34d399'];

  // Status breakdown
  const statusData = [
    { name: 'Closed', value: kpis.closed_tickets, color: '#10b981' },
    { name: 'Open - with L1', value: kpis.awaiting_l1, color: '#f59e0b' },
    { name: 'Open - with Engineering', value: kpis.awaiting_engineering, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Critical Executive Alert */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[11px] font-semibold uppercase tracking-wider">
              Lead Diagnostic Summary
            </span>
            <span className="text-xs text-slate-400 font-mono">Q3 Snapshot: 30 Sep 2026</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Volume Surge in September & 56.6% Preventable Escalations Clog Engineering
          </h3>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Ticket creation surged to <strong className="text-white">164 tickets/week</strong> in mid-September (up 88% from July baseline). 
            While 96.7% of tickets close, escalations to engineering suffer from a <strong className="text-amber-300">5.0x resolution latency multiplier</strong> (99.8h vs 20.0h).
            Over 56% of escalated tickets are bounced back as configuration issues, duplicates, or missing information.
          </p>
        </div>
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => onNavigateToTab('backlog')}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <ClockAlert className="w-3.5 h-3.5" />
            <span>Audit Backlog ({kpis.open_tickets})</span>
          </button>
          <button
            onClick={() => onNavigateToTab('escalations')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Escalation Deep Dive</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        <MetricCard
          title="Total Tickets"
          value={kpis.total_tickets.toLocaleString()}
          subtitle="Jul 2 - Sep 30, 2026"
          icon={TicketIcon}
        />
        <MetricCard
          title="Open Tickets"
          value={kpis.open_tickets}
          subtitle={`${kpis.open_ticket_percentage}% of total`}
          icon={ClockAlert}
          badge={{ text: `${kpis.open_tickets} Active`, variant: 'amber' }}
          highlight={true}
        />
        <MetricCard
          title="Awaiting Eng"
          value={kpis.awaiting_engineering}
          subtitle={`${((kpis.awaiting_engineering / (kpis.open_tickets || 1)) * 100).toFixed(0)}% of open backlog`}
          icon={GitPullRequest}
          badge={{ text: 'Eng Queue', variant: 'rose' }}
        />
        <MetricCard
          title="Escalation Rate"
          value={`${kpis.escalation_rate}%`}
          subtitle={`${kpis.escalated_tickets} total to Eng`}
          icon={TrendingUp}
          trend={{ direction: 'up', label: '1 in 3 Escalated', isPositive: false }}
        />
        <MetricCard
          title="Avg Resolution"
          value={`${kpis.average_resolution_hours}h`}
          subtitle={`Median: ${kpis.median_resolution_hours}h`}
          icon={Timer}
          trend={{ direction: 'neutral', label: 'Closed Tickets' }}
        />
        <MetricCard
          title="Reopen Rate"
          value={`${kpis.reopen_rate}%`}
          subtitle={`${kpis.reopened_tickets_count} reopened tickets`}
          icon={RotateCcw}
          badge={{ text: 'Client Reopens', variant: 'slate' }}
        />
        <MetricCard
          title="Average CSAT"
          value={`${kpis.average_csat} / 5`}
          subtitle={`${kpis.csat_response_count} ratings (${kpis.csat_response_rate}%)`}
          icon={Star}
          badge={{ text: 'Benchmark 3.7', variant: 'emerald' }}
        />
      </div>

      {/* Primary Trend Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Ticket Creation & Status Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Weekly Ticket Inflow & Resolution Volume
              </h4>
              <p className="text-xs text-slate-500">
                Weekly ticket creation surge peaking at 164 tickets/week in September
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Created</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Closed</span>
              </span>
              <span className="flex items-center space-x-1.5 text-amber-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Still Open</span>
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [value, name === 'created' ? 'Created' : name === 'closed' ? 'Closed' : 'Still Open']}
                />
                <Bar dataKey="created" name="Created" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" name="Closed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="still_open" name="Still Open" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie & Reopen Trends */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
              Ticket Status Distribution
            </h4>
            <p className="text-xs text-slate-500 mb-3">Snapshot as of 30 Sep 2026</p>

            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
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
              <div className="absolute text-center">
                <span className="text-xl font-bold text-slate-900">{kpis.total_tickets}</span>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Total</span>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                    <span className="text-slate-700">{s.name}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-medium">
                    <span className="text-slate-900 font-semibold">{s.value}</span>
                    <span className="text-slate-400 text-[11px]">
                      ({((s.value / kpis.total_tickets) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Engineering backlog share:</span>
            <span className="font-semibold text-rose-600">
              {((kpis.awaiting_engineering / (kpis.open_tickets || 1)) * 100).toFixed(0)}% of open tickets
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Escalation vs Reopen Trends & CSAT Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Escalation & Reopen Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Weekly Escalation & Reopen Frequency
              </h4>
              <p className="text-xs text-slate-500">
                Notice the sharp rise in client reopens in late September (22 reopens in week 13)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Escalated to Eng</span>
              </span>
              <span className="flex items-center space-x-1.5 text-purple-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span>Reopened by Client</span>
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
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
                <Line
                  type="monotone"
                  dataKey="escalated"
                  name="Escalated"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563eb' }}
                />
                <Line
                  type="monotone"
                  dataKey="reopened"
                  name="Reopened"
                  stroke="#9333ea"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#9333ea' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CSAT Distribution Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                CSAT Rating Distribution (648 Responses)
              </h4>
              <p className="text-xs text-slate-500">
                Mean rating: 3.70 / 5.0 • 44.9% client response rate
              </p>
            </div>
            <div className="flex items-center space-x-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{kpis.average_csat}</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={csatCounts} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="rating" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} reviews (${((Number(val) / kpis.csat_response_count) * 100).toFixed(1)}%)`, 'Count']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {csatCounts.map((entry, index) => (
                    <Cell key={`csat-cell-${index}`} fill={csatColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-2 pt-3 border-t border-slate-100 text-center">
            {csatCounts.map((c, i) => (
              <div key={c.rating} className="text-xs">
                <span className="font-semibold block text-slate-900">{c.count}</span>
                <span className="text-[10px] text-slate-400">
                  {((c.count / kpis.csat_response_count) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
