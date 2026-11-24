import React, { useEffect } from 'react';
import {
  X,
  Clock,
  GitPullRequest,
  RotateCcw,
  Star,
  Flame,
  AlertTriangle,
  Building2,
  User,
  Tag,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Ticket } from '../types';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-bold tracking-tight text-blue-400">
              {ticket.ticket_id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                ticket.priority === 'P1'
                  ? 'bg-red-500 text-white'
                  : ticket.priority === 'P2'
                  ? 'bg-orange-500 text-white'
                  : ticket.priority === 'P3'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-600 text-white'
              }`}
            >
              {ticket.priority}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                ticket.status === 'Closed'
                  ? 'bg-emerald-600 text-white'
                  : ticket.status === 'Open - with Engineering'
                  ? 'bg-purple-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {ticket.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Priority Score Banner (if open or high priority) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Backlog Prioritization Dispatch
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
                <span>Recommended Action:</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                  {ticket.recommended_action}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500">Urgency Score</div>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {ticket.priority_score.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Issue Description
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal">
              {ticket.description}
            </div>
          </div>

          {/* Grid Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client & Routing */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Client & Channel Context</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Client Name:</span>
                  <span className="font-semibold text-slate-900">{ticket.client_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Client ID / Tier:</span>
                  <span className="font-medium text-slate-800">{ticket.client_id} ({ticket.client_tier})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-medium text-slate-800">{ticket.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Channel:</span>
                  <span className="font-medium text-slate-800">{ticket.channel}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Assigned Agent:</span>
                  <span className="font-semibold text-blue-700">{ticket.assigned_agent}</span>
                </div>
              </div>
            </div>

            {/* Lifecycle Timelines */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Lifecycle & SLA Metrics</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Created At:</span>
                  <span className="font-mono text-slate-800">{ticket.created_at}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">First Response:</span>
                  <span className="font-mono text-slate-800">
                    {ticket.first_response_at ? `${ticket.first_response_at} (${ticket.first_response_minutes?.toFixed(0)}m)` : 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Final Closed At:</span>
                  <span className="font-mono text-slate-800">{ticket.final_closed_at || 'Pending (Still Open)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Resolution Time:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {ticket.resolution_hours !== null ? `${ticket.resolution_hours.toFixed(1)} hours` : 'Not closed yet'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Current Age (as of Sep 30, 2026):</span>
                  <span className="font-mono font-bold text-rose-600">{ticket.age_days.toFixed(1)} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Engineering & Quality Friction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Engineering Escalation */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <GitPullRequest className="w-4 h-4 text-purple-600" />
                <span>Engineering Escalation</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Escalated to Eng:</span>
                  <span className="font-semibold text-slate-900">{ticket.escalated_to_eng}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Engineering Ticket ID:</span>
                  <span className="font-mono font-bold text-purple-700">{ticket.eng_ticket_id || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Handoff Count:</span>
                  <span className="font-mono text-slate-800">{ticket.eng_handoffs} handoffs</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Engineering Outcome:</span>
                  <span className="font-semibold text-slate-900">{ticket.eng_outcome || 'In Progress / None'}</span>
                </div>
              </div>
            </div>

            {/* Quality Friction & CSAT */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Customer Quality & Satisfaction</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Reopen Count:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {ticket.reopen_count > 0 ? (
                      <span className="text-rose-600 font-bold">{ticket.reopen_count} reopens</span>
                    ) : (
                      '0 reopens'
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">CSAT Score:</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    {ticket.csat_score ? (
                      <>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{ticket.csat_score} / 5</span>
                      </>
                    ) : (
                      <span className="text-slate-400 italic font-normal">No rating provided</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Aging Bucket:</span>
                  <span className="font-medium text-slate-800">{ticket.aging_bucket}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
