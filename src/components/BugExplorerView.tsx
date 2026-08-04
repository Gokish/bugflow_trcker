/**
 * Bug Explorer View Component - Immersive UI Theme
 */

import React, { useState } from 'react';
import {
  Bug,
  Filter,
  Search,
  Plus,
  Zap,
  User,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  GitBranch,
  ShieldAlert,
} from 'lucide-react';
import { BugNode, GraphNode, GraphEdge, DeveloperNode, ReleaseNode } from '../types';

interface BugExplorerViewProps {
  bugs: BugNode[];
  developers: DeveloperNode[];
  releases: ReleaseNode[];
  onSelectBug: (bugId: string) => void;
  onRunImpactAnalysis: (bugId: string) => void;
  onCreateBug: (newBug: any) => void;
}

export const BugExplorerView: React.FC<BugExplorerViewProps> = ({
  bugs,
  developers,
  releases,
  onSelectBug,
  onRunImpactAnalysis,
  onCreateBug,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newSeverity, setNewSeverity] = useState('MAJOR');
  const [newDevId, setNewDevId] = useState('DEV-2');
  const [newRelId, setNewRelId] = useState('REL-200');

  // Filter logic
  const filteredBugs = bugs.filter((b) => {
    if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
    if (selectedPriority !== 'ALL' && b.priority !== selectedPriority) return false;
    if (selectedSeverity !== 'ALL' && b.severity !== selectedSeverity) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateBug({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      severity: newSeverity,
      status: 'OPEN',
      developerId: newDevId,
      releaseId: newRelId,
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono">
              DEFECT TRAVERSAL
            </span>
            <span className="text-xs text-slate-400">{filteredBugs.length} Bugs Found</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Bug Explorer</h1>
          <p className="text-xs text-slate-400">
            Browse defects, inspect relationships, and run instant graph impact analysis.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Bug</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bugs by ID or title..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Severity */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="ALL">All Severities</option>
            <option value="BLOCKER">BLOCKER</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="MAJOR">MAJOR</option>
            <option value="MINOR">MINOR</option>
          </select>
        </div>
      </div>

      {/* Bugs List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBugs.map((bug) => {
          const isCritical = bug.priority === 'CRITICAL' || bug.severity === 'BLOCKER';
          return (
            <div
              key={bug.id}
              onClick={() => onSelectBug(bug.id)}
              className={`group bg-slate-900/60 backdrop-blur-md border rounded-2xl p-5 space-y-3 transition-all cursor-pointer hover:-translate-y-1 ${
                isCritical
                  ? 'border-rose-500/30 hover:border-rose-500/60 shadow-lg shadow-rose-950/20'
                  : 'border-white/10 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10'
              }`}
            >
              {/* Card Header Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-lg">
                    {bug.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      bug.status === 'OPEN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : bug.status === 'IN_PROGRESS'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {bug.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {bug.priority}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition line-clamp-1">
                  {bug.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {bug.description}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Est: {bug.estimatedFixTime}</span>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunImpactAnalysis(bug.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-[10px] font-medium transition cursor-pointer flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-indigo-400" />
                  <span>3-Hop Impact</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Bug Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Report New Defect Node</h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Bug Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Memory Leak in Inventory Lock Cache"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detailed reproduction steps and stack trace..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-slate-300"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-slate-300"
                  >
                    <option value="BLOCKER">BLOCKER</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="MAJOR">MAJOR</option>
                    <option value="MINOR">MINOR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Assign Developer</label>
                  <select
                    value={newDevId}
                    onChange={(e) => setNewDevId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-slate-300"
                  >
                    {developers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.team})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Release</label>
                  <select
                    value={newRelId}
                    onChange={(e) => setNewRelId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-slate-300"
                  >
                    {releases.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.version}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
                >
                  Create Bug Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
