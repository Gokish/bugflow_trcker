/**
 * BugFlow Top Navbar Component - Immersive UI Theme
 */

import React from 'react';
import {
  Search,
  Terminal,
  RotateCcw,
  BookOpen,
  Activity,
  Network,
} from 'lucide-react';
import { CognoDBConfig } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dbConfig: CognoDBConfig;
  onOpenCypher: () => void;
  onOpenReadme: () => void;
  onResetSeedData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  dbConfig,
  onOpenCypher,
  onOpenReadme,
  onResetSeedData,
}) => {
  return (
    <header className="h-16 border-b border-white/5 bg-black/30 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Brand & Search Bar */}
      <div className="flex items-center gap-6">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search graph (Bugs, Modules, Devs, Releases)..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        {/* Database Sync Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-[11px]">{dbConfig.database} ({dbConfig.status})</span>
        </div>

        {/* Quick Cypher Console Button */}
        <button
          onClick={onOpenCypher}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all shadow-sm cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cypher Console</span>
        </button>

        {/* Reset Graph */}
        <button
          onClick={onResetSeedData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs transition-all cursor-pointer"
          title="Reset Graph Seed Data"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Reset Graph</span>
        </button>

        {/* Docs & Architecture */}
        <button
          onClick={onOpenReadme}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Architecture</span>
        </button>
      </div>
    </header>
  );
};
