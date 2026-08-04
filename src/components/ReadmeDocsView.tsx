/**
 * Architecture & Documentation View Component - Immersive UI Theme
 */

import React from 'react';
import {
  BookOpen,
  GitBranch,
  Database,
  CheckCircle2,
  Zap,
  Layers,
  ShieldCheck,
  Code2,
  Terminal,
} from 'lucide-react';

export const ReadmeDocsView: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto text-slate-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
            TAKE-HOME ASSIGNMENT ARCHITECTURE
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-1">
          BugFlow Architecture & Graph Database Paradigm
        </h1>
        <p className="text-xs text-slate-400">
          Comprehensive technical documentation demonstrating why CognoDB Cloud (Neo4j Graph Database) outperforms Relational DBs for defect tracking.
        </p>
      </div>

      {/* 1. Why Graph DB vs Relational DB */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2>Why Graph Database (CognoDB/Neo4j) vs. Relational Database (SQL)?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/20 space-y-2">
            <h3 className="font-bold text-rose-300">Relational DB Limitations (SQL)</h3>
            <ul className="space-y-1.5 text-slate-400 list-disc pl-4 leading-relaxed">
              <li>Requires expensive recursive JOINs (CTE `WITH RECURSIVE`) to traverse multi-hop bug dependencies.</li>
              <li>Query execution time degrades exponentially ($O(N^k)$) as database table depth and row count grows.</li>
              <li>Brittle schema migrations when adding new entity relationships (e.g. linking test cases to multiple releases).</li>
              <li>Impedance mismatch between object graphs and relational foreign keys.</li>
            </ul>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/20 space-y-2">
            <h3 className="font-bold text-emerald-300">Graph Database Advantages (CognoDB)</h3>
            <ul className="space-y-1.5 text-slate-400 list-disc pl-4 leading-relaxed">
              <li><strong>Index-Free Adjacency:</strong> Each node directly references its adjacent neighbors via memory pointers ($O(1)$ lookup per hop).</li>
              <li>Constant time traversal regardless of overall graph scale.</li>
              <li>Intuitive Cypher pattern matching (<code>MATCH (b:Bug)-[:BLOCKED_BY*1..3]-&gt;(target)</code>).</li>
              <li>Flexible schema allows seamless addition of new node types (e.g., Sprint, Requirement) without breaking existing queries.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Graph Data Model (Nodes & Relationships) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
          <GitBranch className="w-5 h-5" />
          <h2>Graph Schema & Data Model</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <h3 className="font-bold text-white mb-2">Node Labels:</h3>
            <ul className="space-y-1 font-mono text-slate-300">
              <li><span className="text-rose-400 font-bold">• Bug</span> (id, title, status, priority, severity, estimatedFixTime)</li>
              <li><span className="text-sky-400 font-bold">• TestCase</span> (id, title, status, automated, executionTime)</li>
              <li><span className="text-purple-400 font-bold">• Feature</span> (id, title, status)</li>
              <li><span className="text-indigo-400 font-bold">• Module</span> (id, name, owner, criticality)</li>
              <li><span className="text-emerald-400 font-bold">• Developer</span> (id, name, email, team)</li>
              <li><span className="text-amber-400 font-bold">• Release</span> (id, version, status, releaseDate)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Relationship Types:</h3>
            <ul className="space-y-1 font-mono text-slate-300">
              <li><span className="text-rose-400 font-bold">BLOCKED_BY</span>: Bug -&gt; Bug</li>
              <li><span className="text-sky-400 font-bold">VERIFIES</span>: TestCase -&gt; Feature</li>
              <li><span className="text-amber-400 font-bold">FAILS_ON</span>: TestCase -&gt; Bug</li>
              <li><span className="text-indigo-400 font-bold">PART_OF</span>: Feature -&gt; Module</li>
              <li><span className="text-purple-400 font-bold">ASSIGNED_TO</span>: Bug -&gt; Developer</li>
              <li><span className="text-emerald-400 font-bold">TARGETED_FOR</span>: Bug -&gt; Release</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Sample Cypher Queries */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h2>Essential Cypher Pattern Matches</h2>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-1">
            <div className="text-indigo-300 font-bold">// 1. Find all bugs blocking Release 2.0</div>
            <div className="text-emerald-400">
              MATCH (b:Bug)-[:TARGETED_FOR]-&gt;(r:Release &#123;version: '2.0.0'&#125;) RETURN b, r
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-1">
            <div className="text-indigo-300 font-bold">// 2. Shortest Blocking Path Between Bug A and Bug B</div>
            <div className="text-emerald-400">
              MATCH p = shortestPath((b1:Bug &#123;id: 'BUG-101'&#125;)-[:BLOCKED_BY*]-&gt;(b2:Bug &#123;id: 'BUG-105'&#125;)) RETURN p
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
