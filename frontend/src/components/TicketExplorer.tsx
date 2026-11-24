import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  Clock,
  GitPullRequest,
  RotateCcw,
  Star,
  FileSpreadsheet,
} from 'lucide-react';
import { Ticket } from '../types';

interface TicketExplorerProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

type SortField = 'ticket_id' | 'created_at' | 'priority' | 'age_days' | 'resolution_hours' | 'priority_score';

const PRIORITY_ORDER: Record<string, number> = {
  P1: 4,
  P2: 3,
  P3: 2,
  P4: 1,
};

export const TicketExplorer: React.FC<TicketExplorerProps> = ({
  tickets,
  onSelectTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('age_days');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Local text filtering for explorer table
  const filteredTickets = useMemo(() => {
    let list = tickets;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.ticket_id.toLowerCase().includes(q) ||
          t.client_name.toLowerCase().includes(q) ||
          t.client_id.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assigned_agent.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.eng_ticket_id && t.eng_ticket_id.toLowerCase().includes(q))
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'priority') {
        comparison = (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0);
      } else if (sortField === 'age_days') {
        comparison = a.age_days - b.age_days;
      } else if (sortField === 'priority_score') {
        comparison = a.priority_score - b.priority_score;
      } else if (sortField === 'resolution_hours') {
        const aVal = a.resolution_hours ?? -1;
        const bVal = b.resolution_hours ?? -1;
        comparison = aVal - bVal;
      } else if (sortField === 'created_at') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'ticket_id') {
        comparison = a.ticket_id.localeCompare(b.ticket_id);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [tickets, searchQuery, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const headers = [
      'Ticket ID',
      'Client Name',
      'Tier',
      'Category',
      'Priority',
      'Agent',
      'Status',
      'Escalated',
      'Created At',
      'Resolution Hours',
      'Age Days',
      'Priority Score',
      'Recommended Action',
    ];
    const rows = filteredTickets.map((t) => [
      t.ticket_id,
      `"${t.client_name}"`,
      t.client_tier,
      `"${t.category}"`,
      t.priority,
      `"${t.assigned_agent}"`,
      `"${t.status}"`,
      t.escalated_to_eng,
      t.created_at,
      t.resolution_hours ?? '',
      t.age_days.toFixed(1),
      t.priority_score.toFixed(1),
      `"${t.recommended_action}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rideops_tickets_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by ID, client, agent, keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredTickets.length}</strong> records
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('ticket_id')}
                >
                  <div className="flex items-center gap-1">
                    <span>Ticket ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Category</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Escalated</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1">
                    <span>Created Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('resolution_hours')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Resolution Time</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('age_days')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Age</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('priority_score')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 text-sm">
                    No tickets found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((t) => (
                  <tr
                    key={t.ticket_id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer text-xs"
                    onClick={() => onSelectTicket(t)}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-blue-600">
                      {t.ticket_id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block truncate max-w-[140px]">
                        {t.client_name}
                      </span>
                      <span className="text-[10px] text-slate-500">{t.client_tier}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 truncate max-w-[150px]">
                      {t.category}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-semibold text-[11px] ${
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
                    <td className="py-3 px-4 text-slate-700">
                      {t.assigned_agent}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          t.status === 'Closed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : t.status === 'Open - with Engineering'
                            ? 'bg-purple-100 text-purple-800 font-semibold'
                            : 'bg-amber-100 text-amber-800 font-semibold'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {t.escalated_to_eng === 'Yes' ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium text-[11px]">
                          <GitPullRequest className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {t.created_at.slice(0, 10)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {t.resolution_hours !== null ? (
                        <span className="text-slate-700 font-medium">{t.resolution_hours.toFixed(1)}h</span>
                      ) : (
                        <span className="text-amber-600 font-medium italic">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={`font-semibold ${
                          t.is_open && t.age_days >= 7
                            ? 'text-rose-600 font-bold'
                            : t.is_open
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {t.age_days.toFixed(1)}d
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                          t.priority_score >= 70
                            ? 'bg-red-100 text-red-800 font-bold'
                            : t.priority_score >= 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.priority_score.toFixed(0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectTicket(t)}
                        className="px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
