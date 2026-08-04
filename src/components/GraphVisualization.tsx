/**
 * Interactive D3 Graph Visualization Component - Immersive UI Theme
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3-force';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Layers,
  Sparkles,
  Info,
  GitBranch,
  Search,
} from 'lucide-react';
import { GraphDataset, GraphNode, GraphEdge, NodeType } from '../types';

interface GraphVisualizationProps {
  dataset: GraphDataset;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  height?: number;
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  dataset,
  selectedNodeId,
  onSelectNode,
  height = 650,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('ALL');
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoomTransform, setZoomTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);

  // Node Color Mapping
  const nodeColorMap: Record<NodeType, string> = {
    Bug: '#f43f5e', // Rose
    TestCase: '#38bdf8', // Sky
    Feature: '#a855f7', // Purple
    Module: '#6366f1', // Indigo
    Developer: '#10b981', // Emerald
    Release: '#f59e0b', // Amber
    Requirement: '#ec4899', // Pink
    Project: '#3b82f6', // Blue
    Sprint: '#14b8a6', // Teal
  };

  // Filter nodes and edges based on active filter
  const filteredData = useMemo(() => {
    if (activeTypeFilter === 'ALL') {
      return dataset;
    }
    const nodes = dataset.nodes.filter((n) => n.type === activeTypeFilter);
    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges = dataset.edges.filter((e) => nodeIds.has(e.source) || nodeIds.has(e.target));
    return { nodes, edges };
  }, [dataset, activeTypeFilter]);

  // Connected node highlight set
  const connectedNodeIds = useMemo(() => {
    const focusId = hoveredNode?.id || selectedNodeId;
    if (!focusId) return new Set<string>();

    const connected = new Set<string>([focusId]);
    dataset.edges.forEach((e) => {
      const sourceId = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const targetId = typeof e.target === 'object' ? (e.target as any).id : e.target;

      if (sourceId === focusId) connected.add(targetId);
      if (targetId === focusId) connected.add(sourceId);
    });
    return connected;
  }, [hoveredNode, selectedNodeId, dataset.edges]);

  // Setup D3 Force Simulation
  useEffect(() => {
    if (!filteredData.nodes.length) return;

    const width = containerRef.current?.clientWidth || 900;
    const h = height;

    // Clone data for D3 mutation
    const nodesCopy = filteredData.nodes.map((n) => ({ ...n }));
    const edgesCopy = filteredData.edges
      .filter((e) => nodesCopy.some((n) => n.id === e.source) && nodesCopy.some((n) => n.id === e.target))
      .map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation<any>(nodesCopy)
      .force(
        'link',
        d3
          .forceLink(edgesCopy)
          .id((d: any) => d.id)
          .distance(70)
      )
      .force('charge', d3.forceManyBody().strength(-140))
      .force('center', d3.forceCenter(width / 2, h / 2))
      .force('collision', d3.forceCollide().radius(25));

    simulation.on('tick', () => {
      setGraphNodes([...nodesCopy]);
      setGraphEdges([...edgesCopy as any]);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredData, height]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomTransform((prev) => ({ ...prev, k: Math.min(prev.k * 1.25, 3) }));
  };

  const handleZoomOut = () => {
    setZoomTransform((prev) => ({ ...prev, k: Math.max(prev.k / 1.25, 0.3) }));
  };

  const handleResetZoom = () => {
    setZoomTransform({ x: 0, y: 0, k: 1 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-[#05060f] to-[#05060f] overflow-hidden select-none shadow-2xl"
      style={{ height }}
    >
      {/* Top Filter & Legend Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter Node:</span>
          </span>
          {['ALL', 'Bug', 'TestCase', 'Feature', 'Module', 'Developer', 'Release'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTypeFilter(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 ${
                activeTypeFilter === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Bug
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Test
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Feature
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Module
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Dev
          </span>
        </div>
      </div>

      {/* SVG Canvas for D3 Rendering */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <g transform={`translate(${zoomTransform.x}, ${zoomTransform.y}) scale(${zoomTransform.k})`}>
          {/* Edge Lines */}
          {graphEdges.map((edge) => {
            const sourceNode = typeof edge.source === 'object' ? (edge.source as any) : graphNodes.find((n) => n.id === edge.source);
            const targetNode = typeof edge.target === 'object' ? (edge.target as any) : graphNodes.find((n) => n.id === edge.target);

            if (!sourceNode?.x || !targetNode?.x) return null;

            const isBlockedBy = edge.type === 'BLOCKED_BY';
            const isHighlighted =
              connectedNodeIds.has(sourceNode.id) && connectedNodeIds.has(targetNode.id);

            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isBlockedBy ? '#f43f5e' : isHighlighted ? '#6366f1' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isHighlighted ? 2.5 : isBlockedBy ? 1.8 : 1}
                  strokeDasharray={isBlockedBy ? '4 3' : undefined}
                />
                {/* Edge Label on Highlight */}
                {isHighlighted && (
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2}
                    fill="#a5b4fc"
                    fontSize={9}
                    textAnchor="middle"
                    className="font-mono bg-black"
                  >
                    {edge.type}
                  </text>
                )}
              </g>
            );
          })}

          {/* Graph Nodes */}
          {graphNodes.map((node) => {
            if (!node.x || !node.y) return null;

            const isSelected = selectedNodeId === node.id;
            const isConnected = connectedNodeIds.size > 0 && connectedNodeIds.has(node.id);
            const isDimmed = connectedNodeIds.size > 0 && !isConnected;

            const color = nodeColorMap[node.type] || '#818cf8';
            const radius = node.type === 'Bug' ? 18 : node.type === 'Module' ? 20 : 14;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode?.(node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: isDimmed ? 0.25 : 1 }}
              >
                {/* Outer Glow Halo for selected or connected */}
                {(isSelected || isConnected) && (
                  <circle
                    r={radius + 8}
                    fill={color}
                    opacity={0.3}
                    className="animate-ping"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={radius}
                  fill={color}
                  fillOpacity={0.85}
                  stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="shadow-lg transition-transform hover:scale-110"
                />

                {/* Node Label Text Inside Circle */}
                <text
                  textAnchor="middle"
                  dy="0.35em"
                  fill="#ffffff"
                  fontSize={node.type === 'Bug' ? 9 : 8}
                  fontWeight="bold"
                  className="font-mono pointer-events-none select-none"
                >
                  {node.id.split('-')[1] ? `${node.id.split('-')[0].slice(0, 1)}-${node.id.split('-')[1]}` : node.id.slice(0, 6)}
                </text>

                {/* Label Title below Node */}
                <text
                  y={radius + 12}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize={10}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="pointer-events-none select-none"
                >
                  {node.label.length > 20 ? `${node.label.slice(0, 18)}...` : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover Node Tooltip Card */}
      {hoveredNode && (
        <div className="absolute bottom-16 left-6 z-30 max-w-sm bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl space-y-2 pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase font-mono"
              style={{ backgroundColor: nodeColorMap[hoveredNode.type] || '#6366f1' }}
            >
              {hoveredNode.type}
            </span>
            <span className="font-mono text-xs font-bold text-slate-200">{hoveredNode.id}</span>
          </div>
          <h4 className="text-xs font-semibold text-white">{hoveredNode.label}</h4>
          {hoveredNode.properties.description && (
            <p className="text-[11px] text-slate-400 line-clamp-2">{hoveredNode.properties.description}</p>
          )}
          {hoveredNode.properties.status && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
              <span>Status: <strong className="text-slate-200">{hoveredNode.properties.status}</strong></span>
              <span>Priority: <strong className="text-rose-400">{hoveredNode.properties.priority}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* Floating Zoom & Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-white/10 rounded-full text-slate-300 transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-white/10 rounded-full text-slate-300 transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          onClick={handleResetZoom}
          className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/40 transition-all cursor-pointer"
        >
          Reset View
        </button>
      </div>
    </div>
  );
};
