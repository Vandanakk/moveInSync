import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  categories: string[];
  agents: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  resetFilters,
  categories,
  agents,
}) => {
  return (
    <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 transition-all">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Active Filter Controls</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
        >
          <X className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
        {/* Priority Filter */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN_ALL">All Open Backlog (48)</option>
            <option value="Open - with Engineering">Open - with Eng (19)</option>
            <option value="Open - with L1">Open - with L1 (29)</option>
            <option value="Closed">Closed (1,396)</option>
          </select>
        </div>

        {/* Agent Filter */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Agent
          </label>
          <select
            value={filters.agent}
            onChange={(e) => setFilters((prev) => ({ ...prev, agent: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Agents</option>
            {agents.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Client Tier Filter */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Client Tier
          </label>
          <select
            value={filters.clientTier}
            onChange={(e) => setFilters((prev) => ({ ...prev, clientTier: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Mid-market">Mid-market</option>
            <option value="SMB">SMB</option>
          </select>
        </div>

        {/* Escalated to Eng Filter */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Escalated to Eng
          </label>
          <select
            value={filters.escalated}
            onChange={(e) => setFilters((prev) => ({ ...prev, escalated: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Escalation</option>
            <option value="Yes">Escalated (Yes)</option>
            <option value="No">Not Escalated (No)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
