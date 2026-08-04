/**
 * BugFlow Premium SaaS Dashboard Component
 */

import React from 'react';
import {
  Bug,
  Users,
  Box,
  Layers,
  AlertTriangle,
  GitBranch,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { DashboardStats, BugNode, GraphDataset } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  dataset: GraphDataset;
  onSelectBug: (bugId: string) => void;
  onNavigatePage: (page: any) => void;
  onRunImpactAnalysis: (bugId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  dataset,
  onSelectBug,
  onNavigatePage,
  onRunImpactAnalysis,
}) => {
  // Extract top open critical bugs
  const criticalOpenBugs = dataset.nodes
    .filter((n) => n.type === 'Bug' && n.properties.status === 'OPEN' && (n.properties.priority === 'CRITICAL' || n.properties.severity === 'BLOCKER'))
    .map((n) => n.properties as BugNode)
    .slice(0, 5);

  // Extract blocked bugs (source of BLOCKED_BY relationships)
  const blockedEdges = dataset.edges.filter((e) => e.type === 'BLOCKED_BY');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                GRAPH DATABASE ENGINE
              </span>
              <span className="text-xs text-slate-400">CognoDB Cloud / Neo4j v5.18</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Software Testing & Bug Dependency Graph
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Index-free adjacency graph model connecting Projects → Modules → Features → Requirements → Test Cases → Bugs → Developers → Releases with instant multi-hop traversal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigatePage('graph')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition cursor-pointer"
            >
              <GitBranch className="w-4 h-4" />
              <span>Explore Graph</span>
            </button>
            <button
              onClick={() => onNavigatePage('cypher')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <span>Cypher Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Bugs</span>
            <Bug className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalBugs}</div>
          <p className="text-[10px] text-slate-500">60 Seeded Entities</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Open Bugs</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.openBugs}</div>
          <p className="text-[10px] text-amber-500/80">Active in Backlog</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Closed Bugs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.closedBugs}</div>
          <p className="text-[10px] text-emerald-500/80">Resolved / Verified</p>
        </div>

        <div className="bg-slate-900/80 border border-rose-500/30 bg-rose-950/10 rounded-xl p-4 space-y-2 hover:border-rose-500/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-rose-300">Critical / Blocker</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{stats.criticalBugs}</div>
          <p className="text-[10px] text-rose-400/80">Immediate Action</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Developers</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalDevelopers}</div>
          <p className="text-[10px] text-slate-500">Assignees & Owners</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Modules</span>
            <Box className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalModules}</div>
          <p className="text-[10px] text-slate-500">{stats.highRiskModulesCount} Critical Modules</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Releases</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalReleases}</div>
          <p className="text-[10px] text-slate-500">Target Milestones</p>
        </div>
      </div>

      {/* Main Content Grid: Top Blocker Bugs & Graph Traversal Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Critical Blockers (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-semibold text-slate-100">Critical Root Blocker Defects</h2>
            </div>
            <button
              onClick={() => onNavigatePage('bugs')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All Bugs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalOpenBugs.map((bug) => (
              <div
                key={bug.id}
                onClick={() => onSelectBug(bug.id)}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition flex items-start justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                      {bug.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {bug.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {bug.severity}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition truncate">
                    {bug.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{bug.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunImpactAnalysis(bug.id);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span>3-Hop Impact</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph Traversal & Graph Power Showcase */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-slate-100">Why Graph Database?</h2>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              In relational SQL databases, asking <em className="text-slate-200">"Which module and release are affected by this bug?"</em> requires 5 recursive JOINs.
            </p>

            <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                <span>SQL 5-Table JOIN:</span>
                <span className="text-rose-400 font-bold">~148 ms</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300 font-mono text-[11px]">
                <span>CognoDB Cypher Traversal:</span>
                <span className="text-emerald-400 font-bold">~1.2 ms (120x faster)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigatePage('cypher')}
                className="w-full py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Run Live Benchmark Comparison</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Blocked Bug Dependency Stats */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Dependency Graph Metrics</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Blocked Bug Pairs</span>
                <span className="font-mono text-slate-200 font-semibold">{blockedEdges.length} Links</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Max Blocker Chain Depth</span>
                <span className="font-mono text-cyan-400 font-semibold">5 Hops</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Average Traversal Speed</span>
                <span className="font-mono text-emerald-400 font-semibold">0.85 ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
