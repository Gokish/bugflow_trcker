/**
 * Cypher Query Playground & SQL Benchmark View - Immersive UI Theme
 */

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Sparkles,
  Zap,
  Clock,
  Code2,
  Database,
  GitBranch,
  Layers,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { CypherQueryResult, PrebuiltQuery, GraphDataset } from '../types';
import { GraphVisualization } from './GraphVisualization';

interface CypherPlaygroundViewProps {
  prebuiltQueries: PrebuiltQuery[];
  onExecuteQuery: (query: string) => CypherQueryResult;
  dataset: GraphDataset;
}

export const CypherPlaygroundView: React.FC<CypherPlaygroundViewProps> = ({
  prebuiltQueries,
  onExecuteQuery,
  dataset,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('q1');
  const [cypherInput, setCypherInput] = useState<string>(prebuiltQueries[0]?.cypher || '');
  const [queryResult, setQueryResult] = useState<CypherQueryResult | null>(() => onExecuteQuery(prebuiltQueries[0]?.cypher || ''));
  const [activeTab, setActiveTab] = useState<'graph' | 'table' | 'sql'>('graph');

  const handleSelectPreset = (pq: PrebuiltQuery) => {
    setSelectedPresetId(pq.id);
    setCypherInput(pq.cypher);
    const res = onExecuteQuery(pq.cypher);
    setQueryResult(res);
  };

  const handleRunQuery = () => {
    const res = onExecuteQuery(cypherInput);
    setQueryResult(res);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
              CYPHER QUERY ENGINE
            </span>
            <span className="text-xs text-slate-400">Neo4j v5.18 Compatible</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Cypher Playground & SQL Benchmark</h1>
          <p className="text-xs text-slate-400">
            Write and execute graph pattern matches. Observe live index-free traversal speed vs SQL JOIN complexity.
          </p>
        </div>

        <button
          onClick={handleRunQuery}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Execute Cypher Query</span>
        </button>
      </div>

      {/* Main Grid: Left Presets, Right Code Editor + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prebuilt Cypher Queries */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Prebuilt Cypher Queries</h2>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {prebuiltQueries.map((pq) => {
              const isSelected = selectedPresetId === pq.id;
              return (
                <div
                  key={pq.id}
                  onClick={() => handleSelectPreset(pq)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/40 text-white shadow-md'
                      : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-indigo-300">{pq.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">
                      {pq.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{pq.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 Cols): Code Editor & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cypher Code Editor */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">Cypher Terminal</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">MATCH, RETURN, WHERE, shortestPath()</span>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                value={cypherInput}
                onChange={(e) => setCypherInput(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Index-free adjacency mode</span>
              </span>
              <button
                onClick={handleRunQuery}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition cursor-pointer"
              >
                Run Query
              </button>
            </div>
          </div>

          {/* Benchmark Comparison Card */}
          {queryResult && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Performance & SQL Benchmark</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Graph Execution:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {queryResult.executionTimeMs} ms
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Graph Result Box */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>CognoDB Graph Engine</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      0 JOINs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Direct memory pointer traversal. Time complexity remains constant regardless of total node volume.
                  </p>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Matched Nodes: {queryResult.nodes.length} | Relationships: {queryResult.edges.length}
                  </div>
                </div>

                {/* Relational SQL Comparison Box */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between text-rose-300 font-bold">
                    <span>Relational SQL Equivalent</span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">
                      {queryResult.sqlComparison.joinCount} Table JOINs
                    </span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-400 bg-black/40 p-2 rounded overflow-x-auto leading-tight">
                    {queryResult.sqlComparison.sqlQuery}
                  </pre>
                  <p className="text-[10px] text-slate-400 italic">
                    {queryResult.sqlComparison.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display Tabs */}
          {queryResult && (
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('graph')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'graph'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Graph Result Map
                  </button>
                  <button
                    onClick={() => setActiveTab('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'table'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Tabular Records ({queryResult.records.length})
                  </button>
                </div>
              </div>

              {activeTab === 'graph' ? (
                <GraphVisualization
                  dataset={{ nodes: queryResult.nodes, edges: queryResult.edges }}
                  height={400}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                        {queryResult.records[0] &&
                          Object.keys(queryResult.records[0]).map((key) => (
                            <th key={key} className="p-2.5 font-semibold">
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {queryResult.records.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-white/5 font-mono text-[11px]">
                          {Object.values(rec).map((val: any, vIdx) => (
                            <td key={vIdx} className="p-2.5 max-w-xs truncate">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
