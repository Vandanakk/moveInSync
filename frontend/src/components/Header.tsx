import React from 'react';
import {
  Calendar,
  Search,
  Filter,
  X,
  RefreshCw,
  AlertTriangle,
  Server,
  Layers,
} from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  currentTab: string;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  activeFilterCount: number;
  totalFiltered: number;
  totalAll: number;
  openCount: number;
  awaitingEngCount: number;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  filters,
  setFilters,
  resetFilters,
  activeFilterCount,
  totalFiltered,
  totalAll,
  openCount,
  awaitingEngCount,
  showFilters,
  setShowFilters,
}) => {
  const titles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Executive Overview',
      subtitle: 'High-level support health, volume trends, SLA turnaround, and CSAT benchmarks',
    },
    backlog: {
      title: 'Backlog Intelligence',
      subtitle: 'Unresolved ticket aging buckets, engineering dependencies, and pending bottlenecks',
    },
    prioritization: {
      title: 'Actionable Prioritization Queue',
      subtitle: 'Algorithmic urgency scoring & recommended next steps for support leads',
    },
    escalations: {
      title: 'Engineering Escalation Analysis',
      subtitle: 'Escalation volume, 5.0x resolution latency, and preventable L1 ping-pong breakdown',
    },
    'agents-clients': {
      title: 'Agent & Client Operations',
      subtitle: 'Fair agent performance accounting for workload complexity & top enterprise accounts',
    },
    tickets: {
      title: 'Actionable Ticket Explorer',
      subtitle: 'Comprehensive audit table with multi-dimensional filtering, sorting, and ticket drawers',
    },
    methodology: {
      title: 'Methodology & Data Dictionary',
      subtitle: 'Definitions, snapshot boundaries (30 Sep 2026), and transparent scoring formulas',
    },
  };

  const currentInfo = titles[currentTab] || {
    title: 'RideOps Support Intelligence',
    subtitle: 'Operational Dashboard',
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20">
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title area */}
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {currentInfo.title}
            </h2>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Calendar className="w-3 h-3 text-slate-500 mr-1" />
              <span>Snapshot: Sep 30, 2026</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{currentInfo.subtitle}</p>
        </div>

        {/* Right side operational controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick status pills */}
          <div className="hidden sm:flex items-center space-x-2 mr-2">
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
              {openCount} Open
            </span>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80">
              <Server className="w-3.5 h-3.5 mr-1 text-blue-600" />
              {awaitingEngCount} Eng Pending
            </span>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[200px] md:min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets, clients, IDs..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Reset Filters button */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter status indicator line if filtered */}
      {activeFilterCount > 0 && (
        <div className="px-6 py-1.5 bg-blue-50/70 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900 font-medium">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Showing <strong className="font-semibold text-blue-700">{totalFiltered}</strong> of{' '}
              {totalAll} tickets matching active filters.
            </span>
          </div>
          <button
            onClick={resetFilters}
            className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold"
          >
            Clear all filters
          </button>
        </div>
      )}
    </header>
  );
};
