/**
 * BugFlow - Graph Database Bug Dependency Tracker
 * Type definitions for Nodes, Relationships, Cypher Queries, and Graph Traversal
 */

export type NodeType =
  | 'Project'
  | 'Module'
  | 'Feature'
  | 'Requirement'
  | 'TestCase'
  | 'Bug'
  | 'Developer'
  | 'Sprint'
  | 'Release';

export type RelationshipType =
  | 'HAS_MODULE'
  | 'HAS_FEATURE'
  | 'IMPLEMENTS'
  | 'HAS_TESTCASE'
  | 'FOUND_BUG'
  | 'ASSIGNED_TO'
  | 'BLOCKED_BY'
  | 'RELATED_TO'
  | 'DUPLICATE_OF'
  | 'FIXED_IN'
  | 'CONTAINS'
  | 'WORKS_ON';

export type BugPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type BugSeverity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'TRIVIAL';
export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'VERIFIED';

export type TestAutomationStatus = 'AUTOMATED' | 'MANUAL' | 'FLAKY';
export type TestExecutionStatus = 'PASSED' | 'FAILED' | 'BLOCKED' | 'SKIPPED';
export type ModuleCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ReleaseStatus = 'PLANNED' | 'IN_PROGRESS' | 'STAGING' | 'RELEASED';

export interface ProjectNode {
  id: string; // e.g., 'PROJ-1'
  type: 'Project';
  name: string;
  description: string;
  key: string;
  repoUrl: string;
}

export interface ModuleNode {
  id: string; // e.g., 'MOD-1'
  type: 'Module';
  name: string;
  owner: string;
  criticality: ModuleCriticality;
  description: string;
}

export interface FeatureNode {
  id: string; // e.g., 'FEAT-1'
  type: 'Feature';
  name: string;
  description: string;
  priority: BugPriority;
}

export interface RequirementNode {
  id: string; // e.g., 'REQ-1'
  type: 'Requirement';
  title: string;
  specification: string;
}

export interface TestCaseNode {
  id: string; // e.g., 'TC-101'
  type: 'TestCase';
  title: string;
  automationStatus: TestAutomationStatus;
  executionStatus: TestExecutionStatus;
  platform: string; // e.g. 'Web', 'API', 'Mobile'
  environment: string; // e.g. 'Staging', 'QA', 'Production'
}

export interface BugNode {
  id: string; // e.g., 'BUG-101'
  type: 'Bug';
  title: string;
  description: string;
  priority: BugPriority;
  severity: BugSeverity;
  status: BugStatus;
  createdDate: string;
  updatedDate: string;
  estimatedFixTime: string; // e.g., '12h'
  actualFixTime: string; // e.g., '16h'
  stepsToReproduce?: string;
  environment?: string;
}

export interface DeveloperNode {
  id: string; // e.g., 'DEV-1'
  type: 'Developer';
  name: string;
  email: string;
  experience: string; // e.g., '5 years', 'Senior'
  team: string; // e.g., 'Core Backend', 'Frontend', 'Security'
  avatarUrl?: string;
}

export interface SprintNode {
  id: string; // e.g., 'SPRINT-24'
  type: 'Sprint';
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
}

export interface ReleaseNode {
  id: string; // e.g., 'REL-1'
  type: 'Release';
  version: string;
  releaseDate: string;
  status: ReleaseStatus;
}

export type GraphNodeData =
  | ProjectNode
  | ModuleNode
  | FeatureNode
  | RequirementNode
  | TestCaseNode
  | BugNode
  | DeveloperNode
  | SprintNode
  | ReleaseNode;

export interface GraphNode {
  id: string;
  label: string; // Title / Name
  type: NodeType;
  properties: Record<string, any>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  id: string;
  source: string; // Source Node ID
  target: string; // Target Node ID
  type: RelationshipType;
  properties?: Record<string, any>;
}

export interface GraphDataset {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CypherQueryResult {
  query: string;
  executionTimeMs: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  records: Record<string, any>[];
  sqlComparison: {
    sqlQuery: string;
    sqlExecutionTimeMs: number;
    joinCount: number;
    explanation: string;
  };
}

export interface PrebuiltQuery {
  id: string;
  title: string;
  category: 'Bug Analysis' | 'Impact Analysis' | 'Relationships' | 'Multi-hop';
  description: string;
  cypher: string;
  explanation: string;
  sqlEquivalent: string;
}

export interface ImpactAnalysisResult {
  rootBugId: string;
  rootBug?: BugNode;
  affectedBugs?: BugNode[];
  affectedTestCases?: TestCaseNode[];
  affectedFeatures?: FeatureNode[];
  affectedModules?: ModuleNode[];
  affectedReleases?: ReleaseNode[];
  hop1: string[];
  hop2: string[];
  hop3: string[];
  totalAffectedNodes: number;
  executionTimeMs: number;
  dependencyDepth: number;
  traversalPath: {
    source: string;
    target: string;
    rel: RelationshipType;
    step: number;
  }[];
}

export interface ShortestPathResult {
  startNode: GraphNode;
  endNode: GraphNode;
  pathNodes: GraphNode[];
  pathEdges: GraphEdge[];
  path: string[];
  distance: number;
  executionTimeMs: number;
}

export interface DashboardStats {
  totalBugs: number;
  openBugs: number;
  closedBugs: number;
  criticalBugs: number;
  openBugsCount: number;
  criticalBugsCount: number;
  totalDevelopers: number;
  totalModules: number;
  totalReleases: number;
  blockedBugsCount: number;
  highRiskModulesCount: number;
}

export interface CognoDBConfig {
  uri: string;
  username: string;
  database: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'SIMULATED';
  version: string;
}
