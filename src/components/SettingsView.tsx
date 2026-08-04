/**
 * CognoDB Cloud Configuration & Settings View Component - Immersive UI Theme
 */

import React, { useState } from 'react';
import { Database, Shield, Server, CheckCircle2, RotateCcw, Key, Globe, Terminal } from 'lucide-react';
import { CognoDBConfig } from '../types';

interface SettingsViewProps {
  dbConfig: CognoDBConfig;
  onUpdateConfig: (cfg: Partial<CognoDBConfig>) => void;
  onResetSeedData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  dbConfig,
  onUpdateConfig,
  onResetSeedData,
}) => {
  const [uri, setUri] = useState(dbConfig.uri);
  const [database, setDatabase] = useState(dbConfig.database);
  const [username, setUsername] = useState(dbConfig.username);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({ uri, database, username, status: 'CONNECTED' });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
            DATABASE ENGINE CONFIG
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">CognoDB Cloud Connection</h1>
        <p className="text-xs text-slate-400">
          Configure Neo4j Bolt protocol endpoints, authentication credentials, and seed data persistence.
        </p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Connection Details</h2>
              <p className="text-[11px] text-slate-400">CognoDB Cloud Instance Status</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONNECTED (BOLT v5)</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Bolt URI</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Database Name</label>
              <input
                type="text"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 font-mono text-slate-200"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 font-mono text-slate-200"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onResetSeedData}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Reset Graph Seed Data</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : null}
              <span>{savedSuccess ? 'Configuration Saved' : 'Save Connection Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
