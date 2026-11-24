import React, { useState } from 'react';
import {
  Flame,
  AlertOctagon,
  Clock,
  GitPullRequest,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  Filter,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Ticket } from '../types';

interface PrioritizationQueueProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const PrioritizationQueue: React.FC<PrioritizationQueueProps> = ({
  tickets,
  onSelectTicket,
}) => {
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [priorityTierFilter, setPriorityTierFilter] = useState<string>('ALL');

  // Filter only active open tickets
  const openTickets = tickets.filter((t) => t.is_open);

  // Filter based on selected action and tier
  const filteredQueue = openTickets.filter((t) => {
    if (actionFilter !== 'ALL' && t.recommended_action !== actionFilter) {
      return false;
    }
    if (priorityTierFilter === 'CRITICAL' && t.priority_score < 75) return false;
    if (priorityTierFilter === 'HIGH' && (t.priority_score < 50 || t.priority_score >= 75)) return false;
    if (priorityTierFilter === 'MEDIUM' && (t.priority_score < 30 || t.priority_score >= 50)) return false;
    if (priorityTierFilter === 'LOW' && t.priority_score >= 30) return false;
    return true;
  }).sort((a, b) => b.priority_score - a.priority_score);

  // Action counts
  const actionCounts: Record<string, number> = {};
  openTickets.forEach((t) => {
    actionCounts[t.recommended_action] = (actionCounts[t.recommended_action] || 0) + 1;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 75) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
          {score.toFixed(1)} / 100
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
          <AlertOctagon className="w-3.5 h-3.5 text-orange-600" />
          {score.toFixed(1)} / 100
        </span>
      );
    }
    if (score >= 30) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          {score.toFixed(1)} / 100
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
        {score.toFixed(1)} / 100
      </span>
    );
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Escalate overdue engineering ticket':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            {action}
          </span>
        );
      case 'Investigate repeated reopen':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-300">
            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
            {action}
          </span>
        );
      case 'Follow up with engineering':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300">
            <GitPullRequest className="w-3.5 h-3.5 text-blue-600" />
            {action}
          </span>
        );
      case 'Resolve high-priority aging ticket':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {action}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-300">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Transparency & Operational Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Operational Backlog Prioritization Dispatcher
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic triage queue ranking all {openTickets.length} active tickets by operational urgency and business impact
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-600">
              <strong>Transparent Scoring (0–100):</strong> Base SLA Priority (max 40) + Aging Velocity (3 pts/day, max 30) + Engineering Stall (+20) + Reopen Penalty (10 pts/reopen, max 20).
            </span>
          </div>
        </div>

        {/* Formula Pillars Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              1. Base SLA Weight
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              P1 = 40 | P2 = 25 | P3 = 15 | P4 = 5
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Anchored to ticket business severity</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              2. Aging Penalty
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              +3.0 pts / day (Max 30)
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Prevents tickets from rotting silently</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              3. Engineering Stall
            </div>
            <div className="text-sm font-bold text-purple-700 mt-1">
              +20 pts if stuck with Eng
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Accounts for 5.0x resolution latency</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              4. Reopen Friction
            </div>
            <div className="text-sm font-bold text-rose-700 mt-1">
              +10 pts / reopen (Max 20)
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Prioritizes customer churn risk</p>
          </div>
        </div>
      </div>

      {/* Action Filters Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActionFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            actionFilter === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Recommended Actions ({openTickets.length})
        </button>
        {Object.entries(actionCounts).map(([action, count]) => (
          <button
            key={action}
            onClick={() => setActionFilter(action)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              actionFilter === action
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{action}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                actionFilter === action ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Priority Tier Buttons */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span>Filter by Urgency Tier:</span>
        <button
          onClick={() => setPriorityTierFilter('ALL')}
          className={`px-2 py-1 rounded text-xs ${
            priorityTierFilter === 'ALL' ? 'bg-slate-200 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setPriorityTierFilter('CRITICAL')}
          className={`px-2 py-1 rounded text-xs ${
            priorityTierFilter === 'CRITICAL' ? 'bg-red-100 font-bold text-red-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Critical (Score &ge; 75)
        </button>
        <button
          onClick={() => setPriorityTierFilter('HIGH')}
          className={`px-2 py-1 rounded text-xs ${
            priorityTierFilter === 'HIGH' ? 'bg-orange-100 font-bold text-orange-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          High (Score 50–74)
        </button>
        <button
          onClick={() => setPriorityTierFilter('MEDIUM')}
          className={`px-2 py-1 rounded text-xs ${
            priorityTierFilter === 'MEDIUM' ? 'bg-amber-100 font-bold text-amber-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Medium (Score 30–49)
        </button>
        <button
          onClick={() => setPriorityTierFilter('LOW')}
          className={`px-2 py-1 rounded text-xs ${
            priorityTierFilter === 'LOW' ? 'bg-blue-100 font-bold text-blue-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Low (&lt; 30)
        </button>
      </div>

      {/* Prioritized Backlog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900">
              Active Prioritization Dispatch Queue
            </h4>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-mono font-medium">
              Showing {filteredQueue.length} of {openTickets.length} open tickets
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Sorted by Priority Score (Highest Urgency First)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Recommended Action</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Age</th>
                <th className="py-3 px-4 text-center">Reopens</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                    No open tickets match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((t, idx) => (
                  <tr
                    key={t.ticket_id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    onClick={() => onSelectTicket(t)}
                  >
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 w-4">
                          #{idx + 1}
                        </span>
                        {getScoreBadge(t.priority_score)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                      {t.ticket_id}
                    </td>
                    <td className="py-3 px-4">
                      {getActionBadge(t.recommended_action)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block truncate max-w-[140px]">
                        {t.client_name}
                      </span>
                      <span className="text-[11px] text-slate-500">{t.client_tier}</span>
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
                    <td className="py-3 px-4 text-xs">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-medium ${
                          t.status === 'Open - with Engineering'
                            ? 'bg-purple-100 text-purple-800 font-semibold'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-rose-600">
                      {t.age_days.toFixed(1)}d
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs">
                      {t.reopen_count > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                          {t.reopen_count}x
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-700">
                      {t.assigned_agent}
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectTicket(t)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
