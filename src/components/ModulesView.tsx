/**
 * Modules Management View - Immersive UI Theme
 */

import React from 'react';
import { Box, User, AlertTriangle, ShieldCheck, ChevronRight, Layers } from 'lucide-react';
import { ModuleNode, GraphDataset } from '../types';

interface ModulesViewProps {
  modules: ModuleNode[];
  dataset: GraphDataset;
  onSelectModuleBugs: (modId: string) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  modules,
  dataset,
  onSelectModuleBugs,
}) => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
              SYSTEM ARCHITECTURE
            </span>
            <span className="text-xs text-slate-400">{modules.length} Active Sub-modules</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Application Modules</h1>
          <p className="text-xs text-slate-400">
            System functional boundary nodes linked via HAS_FEATURE and HAS_TESTCASE relationships.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          // Count linked features
          const featuresCount = dataset.edges.filter(
            (e) => e.source === mod.id && e.type === 'HAS_FEATURE'
          ).length;

          const isCritical = mod.criticality === 'CRITICAL';

          return (
            <div
              key={mod.id}
              className={`bg-slate-900/60 backdrop-blur-md border rounded-2xl p-6 space-y-4 transition-all hover:-translate-y-1 ${
                isCritical
                  ? 'border-indigo-500/40 shadow-lg shadow-indigo-950/20'
                  : 'border-white/10 hover:border-indigo-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-400 font-bold">{mod.id}</span>
                    <h3 className="text-sm font-bold text-white leading-tight">{mod.name}</h3>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {mod.criticality}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {mod.description}
              </p>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Owner: <strong className="text-slate-200">{mod.owner}</strong></span>
                </span>
                <span className="font-mono text-indigo-300">{featuresCount} Features</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
