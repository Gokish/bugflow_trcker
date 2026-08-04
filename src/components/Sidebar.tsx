/**
 * BugFlow Sidebar Navigation Component - Immersive UI Theme
 */

import React from 'react';
import {
  LayoutDashboard,
  Bug,
  GitGraph,
  Terminal,
  Box,
  Users,
  Layers,
  BarChart3,
  Settings,
  BookOpen,
  Network,
  Zap,
} from 'lucide-react';

export type PageView =
  | 'dashboard'
  | 'bugs'
  | 'graph'
  | 'cypher'
  | 'modules'
  | 'developers'
  | 'releases'
  | 'analytics'
  | 'settings'
  | 'readme';

interface SidebarProps {
  activePage: PageView;
  onSelectPage: (page: PageView) => void;
  openBugsCount: number;
  criticalBugsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  openBugsCount,
  criticalBugsCount,
}) => {
  const navItems: { id: PageView; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'bugs', label: 'Bug Explorer', icon: <Bug className="w-4 h-4" />, badge: openBugsCount, badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
    { id: 'graph', label: 'Dependency Graph', icon: <GitGraph className="w-4 h-4" /> },
    { id: 'cypher', label: 'Cypher Playground', icon: <Terminal className="w-4 h-4" /> },
    { id: 'modules', label: 'Modules', icon: <Box className="w-4 h-4" /> },
    { id: 'developers', label: 'Developers', icon: <Users className="w-4 h-4" /> },
    { id: 'releases', label: 'Releases', icon: <Layers className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Traversal', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'CognoDB / Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'readme', label: 'Architecture & Docs', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-md flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Network className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                BugFlow
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                GRAPH
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">CognoDB Cloud / Neo4j</p>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            Navigation
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 text-indigo-300 shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Status Widget */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/20 border border-indigo-500/20 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Graph Traversal Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Zero-JOIN index-free adjacency graph traversal enabled.
          </p>
        </div>
      </div>
    </aside>
  );
};
