/**
 * Releases Roadmap View Component - Immersive UI Theme
 */

import React from 'react';
import { Layers, Calendar, CheckCircle2, AlertCircle, Clock, Rocket } from 'lucide-react';
import { ReleaseNode, GraphDataset } from '../types';

interface ReleasesViewProps {
  releases: ReleaseNode[];
  dataset: GraphDataset;
}

export const ReleasesView: React.FC<ReleasesViewProps> = ({ releases, dataset }) => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
              RELEASE PIPELINE
            </span>
            <span className="text-xs text-slate-400">{releases.length} Target Releases</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Releases & Target Fixes</h1>
          <p className="text-xs text-slate-400">
            Release nodes linked to bugs via TARGETED_FOR and FIXED_IN relationships.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {releases.map((rel) => {
          // Bugs targeted for this release
          const targetedBugs = dataset.edges.filter(
            (e) => e.target === rel.id && (e.type === 'TARGETED_FOR' || e.type === 'FIXED_IN')
          );

          const isUpcoming = rel.status === 'PLANNED';

          return (
            <div
              key={rel.id}
              className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 space-y-5 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-400 font-bold">{rel.id}</span>
                    <h3 className="text-base font-bold text-white">Version {rel.version}</h3>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                    rel.status === 'RELEASED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {rel.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target Date: <strong className="text-slate-200">{rel.releaseDate}</strong></span>
                </span>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Associated Defects in Pipeline</span>
                  <span className="font-mono text-amber-300">{targetedBugs.length} Linked Bugs</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${Math.min(targetedBugs.length * 15, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
