import React from 'react';
import {
  LayoutDashboard,
  ClockAlert,
  GitPullRequest,
  Users,
  ListFilter,
  Flame,
  BookOpen,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCount: number;
  awaitingEngCount: number;
  criticalBacklogCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  openCount,
  awaitingEngCount,
  criticalBacklogCount,
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'backlog',
      label: 'Backlog Intelligence',
      icon: ClockAlert,
      badge: `${openCount} Open`,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      highlight: true,
    },
    {
      id: 'prioritization',
      label: 'Prioritization Queue',
      icon: Flame,
      badge: `${criticalBacklogCount} Urgent`,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'escalations',
      label: 'Engineering Escalations',
      icon: GitPullRequest,
      badge: `${awaitingEngCount} Eng`,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'agents-clients',
      label: 'Agent & Client Ops',
      icon: Users,
      badge: null,
    },
    {
      id: 'tickets',
      label: 'Ticket Explorer',
      icon: ListFilter,
      badge: '1,444',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'methodology',
      label: 'Methodology & Guide',
      icon: BookOpen,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            R
          </div>
          <div>
            <h1 className="font-semibold text-white text-base tracking-tight leading-snug">
              RideOps Support
            </h1>
            <p className="text-xs text-slate-400 font-medium">Intelligence Dashboard</p>
          </div>
        </div>
      </div>

      {/* SLA Alert Pill */}
      <div className="px-4 pt-4">
        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-rose-400 font-medium mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active Backlog Risk</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            <span className="text-white font-semibold">{openCount}</span> unresolved tickets as of{' '}
            <span className="text-slate-300">Sep 30, 2026</span>. {awaitingEngCount} awaiting engineering.
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 mt-2">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                      isActive ? 'bg-white/20 text-white border-transparent' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 bg-slate-950/40">
        <div className="flex justify-between items-center text-slate-300 font-medium">
          <span>Snapshot Date</span>
          <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            30 Sep 2026
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Dataset Total</span>
          <span className="text-slate-200 font-mono">1,444 Tickets</span>
        </div>
        <div className="pt-2 text-[10px] text-slate-500 leading-normal border-t border-slate-800/60">
          RideOps Support Case Study • Production MVP
        </div>
      </div>
    </aside>
  );
};
