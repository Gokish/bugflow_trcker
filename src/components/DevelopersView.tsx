/**
 * Developers View Component - Immersive UI Theme
 */

import React from 'react';
import { Users, Mail, Shield, Bug, Award, CheckCircle2 } from 'lucide-react';
import { DeveloperNode, GraphDataset } from '../types';

interface DevelopersViewProps {
  developers: DeveloperNode[];
  dataset: GraphDataset;
  onSelectDeveloperBugs: (devId: string) => void;
}

export const DevelopersView: React.FC<DevelopersViewProps> = ({
  developers,
  dataset,
  onSelectDeveloperBugs,
}) => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
              ENGINEERING TEAM
            </span>
            <span className="text-xs text-slate-400">{developers.length} Engineers</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Developers & Workload</h1>
          <p className="text-xs text-slate-400">
            Developer nodes connected via ASSIGNED_TO and WORKS_ON relationships.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((dev) => {
          // Assigned bugs count
          const assignedBugsCount = dataset.edges.filter(
            (e) => e.target === dev.id && e.type === 'ASSIGNED_TO'
          ).length;

          return (
            <div
              key={dev.id}
              className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 space-y-4 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold font-mono text-sm shadow-md">
                  {dev.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-slate-400 font-bold">{dev.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{dev.name}</h3>
                  <p className="text-[11px] text-slate-400">{dev.team}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span>Experience:</span>
                  <span className="font-medium text-slate-200">{dev.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <span className="font-mono text-slate-400 text-[11px] truncate">{dev.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Bug className="w-3.5 h-3.5 text-rose-400" />
                  <span>Assigned Defects:</span>
                </span>
                <span className="font-mono text-xs font-bold text-rose-300 px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                  {assignedBugsCount} Bugs
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
