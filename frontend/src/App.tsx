import React, { useState, useMemo } from 'react';
import rawData from './data/tickets.json';
import { DashboardData, FilterState, Ticket } from './types';
import { filterTickets, computeFilteredKPIs } from './utils/filterEngine';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { BacklogIntelligence } from './components/BacklogIntelligence';
import { EscalationAnalysis } from './components/EscalationAnalysis';
import { AgentClientAnalysis } from './components/AgentClientAnalysis';
import { PrioritizationQueue } from './components/PrioritizationQueue';
import { TicketExplorer } from './components/TicketExplorer';
import { TicketDetailModal } from './components/TicketDetailModal';
import { MethodologyModal } from './components/MethodologyModal';

const data = rawData as unknown as DashboardData;

const initialFilters: FilterState = {
  search: '',
  priority: 'ALL',
  category: 'ALL',
  status: 'ALL',
  agent: 'ALL',
  client: 'ALL',
  clientTier: 'ALL',
  escalated: 'ALL',
  agingBucket: 'ALL',
  recommendedAction: 'ALL',
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // Extract unique categories and agents
  const categories = useMemo(() => {
    return Array.from(new Set(data.tickets.map((t) => t.category))).sort();
  }, []);

  const agents = useMemo(() => {
    return Array.from(new Set(data.tickets.map((t) => t.assigned_agent))).sort();
  }, []);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return filterTickets(data.tickets, filters);
  }, [filters]);

  // Compute live KPIs for filtered subset
  const filteredKPIs = useMemo(() => {
    return computeFilteredKPIs(filteredTickets);
  }, [filteredTickets]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const allOpenTickets = useMemo(() => {
    return data.tickets.filter((t) => t.is_open);
  }, []);

  const openCount = allOpenTickets.length;
  const awaitingEngCount = allOpenTickets.filter((t) => t.status === 'Open - with Engineering').length;
  const criticalBacklogCount = allOpenTickets.filter((t) => t.priority === 'P1' || t.priority === 'P2').length;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priority !== 'ALL') count++;
    if (filters.category !== 'ALL') count++;
    if (filters.status !== 'ALL') count++;
    if (filters.agent !== 'ALL') count++;
    if (filters.client !== 'ALL') count++;
    if (filters.clientTier !== 'ALL') count++;
    if (filters.escalated !== 'ALL') count++;
    if (filters.agingBucket !== 'ALL') count++;
    if (filters.recommendedAction !== 'ALL') count++;
    return count;
  }, [filters]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCount={openCount}
        awaitingEngCount={awaitingEngCount}
        criticalBacklogCount={criticalBacklogCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Global Header */}
        <Header
          currentTab={currentTab}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          activeFilterCount={activeFilterCount}
          totalFiltered={filteredTickets.length}
          totalAll={data.tickets.length}
          openCount={openCount}
          awaitingEngCount={awaitingEngCount}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Global Filter Bar */}
        {showFilters && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            categories={categories}
            agents={agents}
          />
        )}

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentTab === 'overview' && (
            <ExecutiveOverview
              kpis={filteredKPIs}
              weeklyTrends={data.weekly_trends}
              tickets={filteredTickets}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'backlog' && (
            <BacklogIntelligence
              tickets={filteredTickets}
              allOpenTickets={allOpenTickets}
              filters={filters}
              setFilters={setFilters}
              onSelectTicket={(t) => setSelectedTicket(t)}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'prioritization' && (
            <PrioritizationQueue
              tickets={filteredTickets}
              onSelectTicket={(t) => setSelectedTicket(t)}
            />
          )}

          {currentTab === 'escalations' && (
            <EscalationAnalysis
              escalations={data.escalations}
              tickets={filteredTickets}
              onSelectTicket={(t) => setSelectedTicket(t)}
              onFilterByCategory={(cat) => {
                setFilters((prev) => ({ ...prev, category: cat }));
                setCurrentTab('tickets');
              }}
            />
          )}

          {currentTab === 'agents-clients' && (
            <AgentClientAnalysis
              agents={data.agents}
              clients={data.clients}
              tickets={filteredTickets}
              onSelectTicket={(t) => setSelectedTicket(t)}
              onFilterByAgent={(agent) => {
                setFilters((prev) => ({ ...prev, agent }));
                setCurrentTab('tickets');
              }}
              onFilterByClient={(clientName) => {
                setFilters((prev) => ({ ...prev, client: clientName }));
                setCurrentTab('tickets');
              }}
            />
          )}

          {currentTab === 'tickets' && (
            <TicketExplorer
              tickets={filteredTickets}
              onSelectTicket={(t) => setSelectedTicket(t)}
            />
          )}

          {currentTab === 'methodology' && (
            <div className="max-w-4xl mx-auto">
              <MethodologyModal isOpen={true} onClose={() => setCurrentTab('overview')} />
            </div>
          )}
        </main>
      </div>

      {/* Ticket Details Slide-Over / Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
};

export default App;
