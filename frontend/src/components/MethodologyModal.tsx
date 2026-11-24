import React, { useEffect } from 'react';
import { X, BookOpen, CheckCircle2, ShieldCheck, Database, Calendar, AlertTriangle } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold">Data Methodology & Calculation Rules</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Snapshot Anchor Date: September 30, 2026 23:59:59 IST</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All ticket aging, open backlog durations, and active state evaluations are strictly measured against the dataset cut-off date of <strong>September 30, 2026</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Accurate Handling of Open vs Closed Tickets</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unresolved tickets (48 tickets: 29 with L1, 19 with Engineering) are <strong>never</strong> treated as completed resolutions. Resolution time averages (overall 47.7 hrs, non-escalated 20.0 hrs, escalated 99.8 hrs) are computed strictly across closed tickets with recorded timestamps. Age for open tickets reflects ongoing customer waiting time up to the snapshot date.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Classification of Preventable Engineering Escalations (56.6%)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Out of 486 engineering escalations, only 211 (43.4%) resulted in genuine software code or infrastructure bug fixes ("Fixed"). The remaining 275 tickets (56.6%) were returned due to:
            </p>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-2">
              <li><strong>Returned - insufficient info:</strong> 89 tickets (18.3%)</li>
              <li><strong>Returned - config issue:</strong> 84 tickets (17.3%)</li>
              <li><strong>Duplicate of known issue:</strong> 56 tickets (11.5%)</li>
              <li><strong>Not a bug - how-to:</strong> 24 tickets (4.9%)</li>
              <li><strong>Not reproducible:</strong> 22 tickets (4.5%)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-600" />
              <span>Prioritization Score Formula (Transparent 0–100 Scale)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This score is a deterministic operational triage heuristic designed for Support Leads, not a black-box model:
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono space-y-1">
              <div>PriorityScore = BasePriority + AgingFactor + EngBottleneck + ReopenPenalty</div>
              <div className="text-slate-500 font-sans mt-2">
                • <strong>BasePriority:</strong> P1 = 40, P2 = 25, P3 = 15, P4 = 5 pts.<br />
                • <strong>AgingFactor:</strong> +3.0 pts per open day (capped at 30 pts).<br />
                • <strong>EngBottleneck:</strong> +20 pts if status is 'Open - with Engineering'.<br />
                • <strong>ReopenPenalty:</strong> +10 pts per reopen count (capped at 20 pts).
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
