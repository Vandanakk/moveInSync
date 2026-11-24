import React, { useState } from 'react';
import {
  Users,
  Building2,
  Star,
  RotateCcw,
  Clock,
  GitPullRequest,
  ShieldAlert,
  ArrowUpDown,
  Info,
  CheckCircle2,
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
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
} from 'recharts';
import { AgentPerformance, ClientItem, Ticket } from '../types';
import { MetricCard } from './MetricCard';

interface AgentClientAnalysisProps {
  agents: AgentPerformance[];
  clients: {
    all_clients: ClientItem[];
    top_clients_by_volume: ClientItem[];
    top_clients_with_open_tickets: ClientItem[];
  };
  tickets: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
  onFilterByAgent?: (agent: string) => void;
  onFilterByClient?: (clientName: string) => void;
}

export const AgentClientAnalysis: React.FC<AgentClientAnalysisProps> = ({
  agents,
  clients,
  tickets,
  onFilterByAgent,
  onFilterByClient,
}) => {
  const [agentSortField, setAgentSortField] = useState<keyof AgentPerformance>('total_tickets');
  const [agentSortAsc, setAgentSortAsc] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'agents' | 'clients'>('agents');

  // Handle agent sorting
  const sortedAgents = [...agents].sort((a, b) => {
    let aVal = a[agentSortField] ?? 0;
    let bVal = b[agentSortField] ?? 0;
    if (typeof aVal === 'string') {
      return agentSortAsc
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }
    return agentSortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const handleSort = (field: keyof AgentPerformance) => {
    if (agentSortField === field) {
      setAgentSortAsc(!agentSortAsc);
    } else {
      setAgentSortField(field);
      setAgentSortAsc(false);
    }
  };

  // Top clients chart data
  const top10ClientsData = clients.top_clients_by_volume.slice(0, 10).map((c) => ({
    name: c.client_name.length > 14 ? c.client_name.slice(0, 12) + '…' : c.client_name,
    fullName: c.client_name,
    total: c.total_tickets,
    open: c.open_tickets,
    escalated: c.escalated_tickets,
    tier: c.client_tier,
  }));

  return (
    <div className="space-y-6">
      {/* Fair Workload Assessment Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">
              Product-Minded Analysis: Complexity-Adjusted Agent Performance
            </h4>
            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
              Evaluating agents solely on raw CSAT or resolution speed is misleading. <strong>Karan B</strong> handled{' '}
              <strong>217 tickets (26% higher volume)</strong> with a much higher density of P1/P2 issues and engineering handoffs,
              which inherently suppresses customer satisfaction ratings. When weighted by ticket difficulty (P1/P2 weight + engineering handoffs),
              workload disparity becomes evident.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('agents')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeSubTab === 'agents'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Support Agents Scorecard ({agents.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeSubTab === 'clients'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Client Volume & Open Backlog</span>
        </button>
      </div>

      {activeSubTab === 'agents' && (
        <div className="space-y-6">
          {/* Agent Volume & Complexity Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Agent Ticket Distribution & Complexity Index
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Total volume compared against High Priority (P1/P2) ticket load
                  </p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agents} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="agent" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="total_tickets" name="Total Tickets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="p1_p2_count" name="High Priority (P1/P2)" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="escalated_count" name="Escalated to Eng" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CSAT vs Workload Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Agent CSAT Benchmarking
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Average score from closed ticket client surveys
                </p>
              </div>

              <div className="space-y-3 my-3">
                {agents.map((ag) => {
                  const score = ag.avg_csat || 0;
                  const pct = (score / 5) * 100;
                  return (
                    <div key={ag.agent} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800">{ag.agent}</span>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{score.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({ag.csat_rated_count} ratings)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score >= 3.8 ? 'bg-emerald-500' : score >= 3.4 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                💡 <strong>Notice:</strong> Agents handling higher shares of system outages and GPS errors incur customer friction that reduces CSAT irrespective of response speed.
              </div>
            </div>
          </div>

          {/* Full Agent Comparison Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Detailed Support Agent Scorecard
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any column header to sort. Includes complexity-weighted metrics.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('agent')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Agent Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('total_tickets')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Total Volume</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('open_tickets')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Active Open</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('p1_p2_percentage')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>P1/P2 Share</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('escalation_rate')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Escalation %</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('reopen_rate')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Reopen %</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('avg_first_response_min')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>First Resp (min)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('avg_resolution_hours')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Avg Res (hrs)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('avg_csat')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Avg CSAT</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('complexity_score')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Complexity Index</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedAgents.map((ag) => (
                    <tr key={ag.agent} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {ag.agent}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-blue-600">
                        {ag.total_tickets}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            ag.open_tickets > 6
                              ? 'bg-amber-100 text-amber-800 font-semibold'
                              : 'text-slate-600'
                          }`}
                        >
                          {ag.open_tickets}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 text-xs">
                        {ag.p1_p2_percentage}% ({ag.p1_p2_count})
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 text-xs">
                        {ag.escalation_rate}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 text-xs">
                        {ag.reopen_rate}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 text-xs">
                        {ag.avg_first_response_min.toFixed(0)}m
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 text-xs">
                        {ag.avg_resolution_hours.toFixed(1)}h
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 font-semibold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{ag.avg_csat ? ag.avg_csat.toFixed(2) : '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            ag.complexity_score >= 1.1
                              ? 'bg-purple-100 text-purple-800'
                              : ag.complexity_score >= 0.95
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ag.complexity_score.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'clients' && (
        <div className="space-y-6">
          {/* Top 10 Clients by Volume Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Top 10 Clients by Total Ticket Inflow
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Workload contribution across Enterprise and Mid-Market accounts
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-full">
                50 Unique Clients
              </span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10ClientsData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} tickets`, name]}
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName || _label}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="total" name="Total Tickets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="escalated" name="Escalated" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="open" name="Open Backlog" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Highest Unresolved Backlog Accounts Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Clients with Unresolved Open Tickets
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accounts at immediate churn or dissatisfaction risk due to active pending tickets
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-rose-100 text-rose-800 font-semibold rounded-full">
                {clients.top_clients_with_open_tickets.length} Impacted Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Client ID</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4 text-right">Active Open Tickets</th>
                    <th className="py-3 px-4 text-right">Total Lifetime Tickets</th>
                    <th className="py-3 px-4 text-right">Escalation %</th>
                    <th className="py-3 px-4 text-right">Avg CSAT</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.top_clients_with_open_tickets.map((c) => (
                    <tr key={c.client_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {c.client_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">
                        {c.client_id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${
                            c.client_tier === 'Enterprise'
                              ? 'bg-purple-100 text-purple-800 font-semibold'
                              : c.client_tier === 'Mid-market'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.client_tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          {c.open_tickets} open
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {c.total_tickets}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600 text-xs">
                        {c.escalation_rate}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        {c.avg_csat ? (
                          <div className="flex items-center justify-end gap-1 font-semibold text-slate-900 text-xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{c.avg_csat.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {onFilterByClient && (
                          <button
                            onClick={() => onFilterByClient(c.client_name)}
                            className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                          >
                            Filter Tickets
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
