/**
 * BugFlow - Bug Dependency Tracker Main Application Entry
 * Powered by CognoDB Cloud (Neo4j-Compatible Graph Engine)
 * Immersive UI Theme
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, PageView } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BugExplorerView } from './components/BugExplorerView';
import { CypherPlaygroundView } from './components/CypherPlaygroundView';
import { ModulesView } from './components/ModulesView';
import { DevelopersView } from './components/DevelopersView';
import { ReleasesView } from './components/ReleasesView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ReadmeDocsView } from './components/ReadmeDocsView';
import { GraphVisualization } from './components/GraphVisualization';

import { graphEngine } from './data/graphEngine';
import {
  GraphDataset,
  BugNode,
  DeveloperNode,
  ReleaseNode,
  ModuleNode,
  CognoDBConfig,
  ImpactAnalysisResult,
} from './types';

import {
  X,
  Zap,
  Bug,
  Terminal,
  Play,
  ArrowRight,
  GitBranch,
  Box,
  User,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modals state
  const [showCypherModal, setShowCypherModal] = useState(false);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [impactModalBugId, setImpactModalBugId] = useState<string | null>(null);

  // Quick Cypher Modal input
  const [cypherModalInput, setCypherModalInput] = useState('MATCH (b:Bug) WHERE b.priority = "CRITICAL" RETURN b');
  const [cypherModalResult, setCypherModalResult] = useState<any>(null);

  // CognoDB Config
  const [dbConfig, setDbConfig] = useState<CognoDBConfig>(graphEngine.getConfig());

  // Dataset State trigger for re-renders
  const [refreshKey, setRefreshKey] = useState(0);

  const dataset: GraphDataset = useMemo(() => {
    return graphEngine.getDataset();
  }, [refreshKey]);

  const stats = useMemo(() => {
    return graphEngine.getGraphStats();
  }, [refreshKey]);

  const prebuiltQueries = useMemo(() => {
    return graphEngine.getPrebuiltQueries();
  }, []);

  const bugsList: BugNode[] = useMemo(() => {
    return dataset.nodes
      .filter((n) => n.type === 'Bug')
      .map((n) => ({
        id: n.id,
        title: n.label,
        description: n.properties.description || '',
        status: n.properties.status || 'OPEN',
        priority: n.properties.priority || 'MEDIUM',
        severity: n.properties.severity || 'MAJOR',
        estimatedFixTime: n.properties.estimatedFixTime || '4h',
      }));
  }, [dataset]);

  const developersList: DeveloperNode[] = useMemo(() => {
    return dataset.nodes
      .filter((n) => n.type === 'Developer')
      .map((n) => ({
        id: n.id,
        name: n.label,
        email: n.properties.email || '',
        team: n.properties.team || 'Core',
        experience: n.properties.experience || 'Senior',
      }));
  }, [dataset]);

  const releasesList: ReleaseNode[] = useMemo(() => {
    return dataset.nodes
      .filter((n) => n.type === 'Release')
      .map((n) => ({
        id: n.id,
        version: n.label.replace('Release ', ''),
        status: n.properties.status || 'PLANNED',
        releaseDate: n.properties.releaseDate || '2026-09-01',
      }));
  }, [dataset]);

  const modulesList: ModuleNode[] = useMemo(() => {
    return dataset.nodes
      .filter((n) => n.type === 'Module')
      .map((n) => ({
        id: n.id,
        name: n.label,
        description: n.properties.description || '',
        owner: n.properties.owner || 'Lead Arch',
        criticality: n.properties.criticality || 'HIGH',
      }));
  }, [dataset]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return dataset.nodes.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId, dataset]);

  // Connected edges to selected node
  const selectedNodeEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return dataset.edges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId);
  }, [selectedNodeId, dataset]);

  // Handlers
  const handleCreateBug = (newBug: any) => {
    graphEngine.addBugNode(newBug);
    setRefreshKey((k) => k + 1);
  };

  const handleResetSeedData = () => {
    graphEngine.resetSeedData();
    setRefreshKey((k) => k + 1);
  };

  const handleRunImpactModal = (bugId: string) => {
    setImpactModalBugId(bugId);
    setShowImpactModal(true);
  };

  const impactResult: ImpactAnalysisResult | null = useMemo(() => {
    if (!impactModalBugId) return null;
    return graphEngine.calculate3HopImpact(impactModalBugId);
  }, [impactModalBugId, refreshKey]);

  return (
    <div className="flex h-screen bg-[#05060f] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onSelectPage={(p) => setActivePage(p)}
        openBugsCount={stats.openBugsCount}
        criticalBugsCount={stats.criticalBugsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Glass Navbar */}
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          dbConfig={dbConfig}
          onOpenCypher={() => setShowCypherModal(true)}
          onOpenReadme={() => setActivePage('readme')}
          onResetSeedData={handleResetSeedData}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#05060f] to-[#05060f]">
          {activePage === 'dashboard' && (
            <DashboardView
              stats={stats}
              dataset={dataset}
              prebuiltQueries={prebuiltQueries}
              onNavigatePage={(p) => setActivePage(p as PageView)}
              onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
              onRunImpactAnalysis={handleRunImpactModal}
            />
          )}

          {activePage === 'bugs' && (
            <BugExplorerView
              bugs={bugsList}
              developers={developersList}
              releases={releasesList}
              onSelectBug={(bugId) => setSelectedNodeId(bugId)}
              onRunImpactAnalysis={handleRunImpactModal}
              onCreateBug={handleCreateBug}
            />
          )}

          {activePage === 'graph' && (
            <div className="p-8 space-y-4 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Full Interactive Dependency Graph</h1>
                <p className="text-xs text-slate-400">
                  D3 force simulation canvas. Drag nodes, zoom/pan, click nodes to highlight adjacent connections.
                </p>
              </div>
              <GraphVisualization
                dataset={dataset}
                selectedNodeId={selectedNodeId}
                onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
                height={700}
              />
            </div>
          )}

          {activePage === 'cypher' && (
            <CypherPlaygroundView
              prebuiltQueries={prebuiltQueries}
              onExecuteQuery={(q) => graphEngine.runCypherQuery(q)}
              dataset={dataset}
            />
          )}

          {activePage === 'modules' && (
            <ModulesView
              modules={modulesList}
              dataset={dataset}
              onSelectModuleBugs={(modId) => setSelectedNodeId(modId)}
            />
          )}

          {activePage === 'developers' && (
            <DevelopersView
              developers={developersList}
              dataset={dataset}
              onSelectDeveloperBugs={(devId) => setSelectedNodeId(devId)}
            />
          )}

          {activePage === 'releases' && (
            <ReleasesView releases={releasesList} dataset={dataset} />
          )}

          {activePage === 'analytics' && (
            <AnalyticsView
              dataset={dataset}
              bugs={bugsList}
              onRunImpact={(bugId) => graphEngine.calculate3HopImpact(bugId)}
              onRunShortestPath={(start, end) => graphEngine.findShortestPath(start, end)}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              dbConfig={dbConfig}
              onUpdateConfig={(cfg) => {
                graphEngine.updateConfig(cfg);
                setDbConfig(graphEngine.getConfig());
              }}
              onResetSeedData={handleResetSeedData}
            />
          )}

          {activePage === 'readme' && <ReadmeDocsView />}
        </main>
      </div>

      {/* Side Detail Drawer for Selected Node */}
      {selectedNode && (
        <div className="fixed top-0 right-0 h-screen w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedNode.type}
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">{selectedNode.id}</span>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-white">{selectedNode.label}</h2>

            {/* Properties List */}
            <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
              <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Properties</h4>
              {Object.entries(selectedNode.properties).map(([key, val]) => (
                <div key={key} className="flex items-start justify-between py-1 border-b border-white/5 font-mono text-[11px]">
                  <span className="text-slate-500 capitalize">{key}:</span>
                  <span className="text-slate-200 text-right font-medium max-w-[180px] truncate">{String(val)}</span>
                </div>
              ))}
            </div>

            {/* Adjacent Graph Connections */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Adjacent Graph Edges ({selectedNodeEdges.length})
              </h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {selectedNodeEdges.map((e) => {
                  const isSource = e.source === selectedNode.id;
                  const targetId = isSource ? e.target : e.source;
                  return (
                    <div
                      key={e.id}
                      onClick={() => setSelectedNodeId(targetId)}
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs cursor-pointer transition"
                    >
                      <span className="font-mono text-indigo-300 text-[11px] font-bold">{e.type}</span>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                        <span>{targetId}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          {selectedNode.type === 'Bug' && (
            <button
              onClick={() => handleRunImpactModal(selectedNode.id)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Calculate 3-Hop Blast Radius</span>
            </button>
          )}
        </div>
      )}

      {/* Quick Cypher Console Modal */}
      {showCypherModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCypherModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Quick Cypher Console</h2>
            </div>

            <textarea
              rows={3}
              value={cypherModalInput}
              onChange={(e) => setCypherModalInput(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />

            <div className="flex justify-end">
              <button
                onClick={() => setCypherModalResult(graphEngine.runCypherQuery(cypherModalInput))}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Execute
              </button>
            </div>

            {cypherModalResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2 text-xs max-h-60 overflow-y-auto">
                <div className="text-emerald-400 font-mono font-bold">
                  Matched {cypherModalResult.nodes.length} Nodes in {cypherModalResult.executionTimeMs} ms
                </div>
                <pre className="text-[10px] text-slate-300 font-mono">
                  {JSON.stringify(cypherModalResult.records, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-Hop Impact Radius Modal */}
      {showImpactModal && impactResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowImpactModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">3-Hop Blast Radius Analysis: {impactResult.rootBugId}</h2>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/20">
                <div className="text-slate-500 text-[10px]">Direct (Hop 1)</div>
                <div className="text-lg font-bold text-rose-400">{impactResult.hop1.length}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/20">
                <div className="text-slate-500 text-[10px]">Indirect (Hop 2)</div>
                <div className="text-lg font-bold text-amber-400">{impactResult.hop2.length}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/20">
                <div className="text-slate-500 text-[10px]">Cascading (Hop 3)</div>
                <div className="text-lg font-bold text-indigo-400">{impactResult.hop3.length}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
              <div className="font-bold text-slate-200">Affected Node IDs:</div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {[...impactResult.hop1, ...impactResult.hop2, ...impactResult.hop3].map((id) => (
                  <span key={id} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    {id}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowImpactModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
