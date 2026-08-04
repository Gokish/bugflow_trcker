/**
 * Analytics & Graph Traversal View Component - Immersive UI Theme
 */

import React, { useState } from 'react';
import {
  Zap,
  GitBranch,
  Network,
  Search,
  ArrowRight,
  ShieldAlert,
  Layers,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { GraphDataset, ImpactAnalysisResult, ShortestPathResult, BugNode } from '../types';
import { GraphVisualization } from './GraphVisualization';

interface AnalyticsViewProps {
  dataset: GraphDataset;
  bugs: BugNode[];
  onRunImpact: (bugId: string) => ImpactAnalysisResult;
  onRunShortestPath: (startId: string, endId: string) => ShortestPathResult;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  dataset,
  bugs,
  onRunImpact,
  onRunShortestPath,
}) => {
  const [selectedBugId, setSelectedBugId] = useState<string>(bugs[0]?.id || 'BUG-101');
  const [impactResult, setImpactResult] = useState<ImpactAnalysisResult | null>(() =>
    bugs[0] ? onRunImpact(bugs[0].id) : null
  );

  const [startPathId, setStartPathId] = useState<string>('BUG-101');
  const [endPathId, setEndPathId] = useState<string>('BUG-103');
  const [pathResult, setPathResult] = useState<ShortestPathResult | null>(() =>
    onRunShortestPath('BUG-101', 'BUG-103')
  );

  const handleCalculateImpact = () => {
    if (!selectedBugId) return;
    const res = onRunImpact(selectedBugId);
    setImpactResult(res);
  };

  const handleCalculateShortestPath = () => {
    if (!startPathId || !endPathId) return;
    const res = onRunShortestPath(startPathId, endPathId);
    setPathResult(res);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
            GRAPH ALGORITHMS & TRAVERSAL
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Impact Analysis & Path Traversal</h1>
        <p className="text-xs text-slate-400">
          Demonstrates graph traversal algorithms: 3-Hop Impact Radius calculation & BFS Shortest Dependency Path.
        </p>
      </div>

      {/* Grid: 3-Hop Impact & Shortest Path */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3-Hop Impact Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">3-Hop Blast Radius Calculator</h2>
              <p className="text-[11px] text-slate-400">Calculates all downstream affected nodes up to 3 edges away.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedBugId}
              onChange={(e) => setSelectedBugId(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {bugs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id}: {b.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleCalculateImpact}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition cursor-pointer shrink-0"
            >
              Run 3-Hop Impact
            </button>
          </div>

          {impactResult && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <div className="text-slate-500 text-[10px]">HOP 1 (Direct)</div>
                  <div className="text-lg font-bold text-rose-400">{impactResult.hop1.length}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <div className="text-slate-500 text-[10px]">HOP 2 (Indirect)</div>
                  <div className="text-lg font-bold text-amber-400">{impactResult.hop2.length}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <div className="text-slate-500 text-[10px]">HOP 3 (Cascading)</div>
                  <div className="text-lg font-bold text-indigo-400">{impactResult.hop3.length}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Total Affected Subsystem Nodes</span>
                  <span className="font-mono text-rose-400 font-bold">{impactResult.totalAffectedNodes} Nodes</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Calculated in <strong className="text-emerald-400">{impactResult.executionTimeMs} ms</strong> via memory pointer traversal without relational SQL recursion.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Shortest Path Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">BFS Shortest Dependency Path</h2>
              <p className="text-[11px] text-slate-400">Finds the shortest blocking chain between any 2 nodes.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Start Node</label>
              <select
                value={startPathId}
                onChange={(e) => setStartPathId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200"
              >
                {dataset.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.id} ({n.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Node</label>
              <select
                value={endPathId}
                onChange={(e) => setEndPathId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200"
              >
                {dataset.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.id} ({n.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculateShortestPath}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            Find Shortest Path
          </button>

          {pathResult && (
            <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Path Hop Distance: {pathResult.distance}</span>
                <span className="font-mono text-emerald-400">{pathResult.executionTimeMs} ms</span>
              </div>

              {pathResult.path.length > 0 ? (
                <div className="flex items-center gap-1.5 overflow-x-auto py-2">
                  {pathResult.path.map((nodeId, idx) => (
                    <React.Fragment key={nodeId}>
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 font-bold">
                        {nodeId}
                      </span>
                      {idx < pathResult.path.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-rose-400">No direct or indirect dependency path exists between these nodes.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
