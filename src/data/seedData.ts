/**
 * BugFlow Seed Data Generator
 * Generates Projects, Modules, Features, Requirements, Test Cases, Bugs, Developers, Releases, Sprints
 * and all graph relationships.
 */

import { GraphDataset, GraphNode, GraphEdge, RelationshipType } from '../types';

export function generateSeedData(): GraphDataset {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  let edgeIdCounter = 1;
  const addEdge = (source: string, target: string, type: RelationshipType, props = {}) => {
    edges.push({
      id: `e-${edgeIdCounter++}`,
      source,
      target,
      type,
      properties: props,
    });
  };

  // 1. Projects (3)
  const projectsData = [
    { id: 'PROJ-1', name: 'FinTech Core Banking', key: 'FCB', description: 'Enterprise core payment and ledger backend services', repoUrl: 'https://github.com/wexa-ai/fintech-core' },
    { id: 'PROJ-2', name: 'CloudOps Orchestrator', key: 'COO', description: 'Infrastructure deployment & Kubernetes auto-scaler', repoUrl: 'https://github.com/wexa-ai/cloudops-core' },
    { id: 'PROJ-3', name: 'E-Commerce Marketplace', key: 'ECM', description: 'High-throughput inventory, cart & vendor management', repoUrl: 'https://github.com/wexa-ai/ecommerce-suite' },
  ];

  projectsData.forEach((p) => {
    nodes.push({ id: p.id, label: p.name, type: 'Project', properties: p });
  });

  // 2. Developers (10)
  const developersData = [
    { id: 'DEV-1', name: 'Alex Rivera', email: 'alex.rivera@wexa.ai', experience: '8 Years (Lead)', team: 'Core Infrastructure' },
    { id: 'DEV-2', name: 'Sarah Chen', email: 'sarah.chen@wexa.ai', experience: '6 Years (Senior)', team: 'Security & Auth' },
    { id: 'DEV-3', name: 'David Kim', email: 'david.kim@wexa.ai', experience: '5 Years (Senior)', team: 'Payments & Billing' },
    { id: 'DEV-4', name: 'Elena Rostova', email: 'elena.rostova@wexa.ai', experience: '7 Years (QA Lead)', team: 'Quality Assurance' },
    { id: 'DEV-5', name: 'Marcus Vance', email: 'marcus.vance@wexa.ai', experience: '4 Years (Mid)', team: 'CloudOps & SRE' },
    { id: 'DEV-6', name: 'Aisha Patel', email: 'aisha.patel@wexa.ai', experience: '5 Years (Senior)', team: 'Frontend Engineering' },
    { id: 'DEV-7', name: 'Carlos Gomez', email: 'carlos.gomez@wexa.ai', experience: '3 Years (Mid)', team: 'Microservices & API' },
    { id: 'DEV-8', name: 'Maya Lin', email: 'maya.lin@wexa.ai', experience: '2 Years (Junior)', team: 'Inventory Engine' },
    { id: 'DEV-9', name: 'Liam O\'Connor', email: 'liam.oconnor@wexa.ai', experience: '6 Years (Senior)', team: 'Data Pipeline' },
    { id: 'DEV-10', name: 'Yuki Tanaka', email: 'yuki.tanaka@wexa.ai', experience: '9 Years (Principal)', team: 'Database Architecture' },
  ];

  developersData.forEach((d) => {
    nodes.push({ id: d.id, label: d.name, type: 'Developer', properties: d });
  });

  // 3. Releases (5)
  const releasesData = [
    { id: 'REL-100', version: 'v1.0.0-GA', releaseDate: '2026-05-15', status: 'RELEASED' },
    { id: 'REL-110', version: 'v1.1.0-Patch', releaseDate: '2026-06-30', status: 'RELEASED' },
    { id: 'REL-200', version: 'v2.0.0-RC1', releaseDate: '2026-08-15', status: 'STAGING' },
    { id: 'REL-201', version: 'v2.0.0-GA', releaseDate: '2026-09-01', status: 'IN_PROGRESS' },
    { id: 'REL-210', version: 'v2.1.0-Beta', releaseDate: '2026-10-15', status: 'PLANNED' },
  ];

  releasesData.forEach((r) => {
    nodes.push({ id: r.id, label: r.version, type: 'Release', properties: r });
  });

  // 4. Sprints (3)
  const sprintsData = [
    { id: 'SPRINT-24', name: 'Sprint 24: Hardening', startDate: '2026-07-01', endDate: '2026-07-14', goal: 'Fix auth vulnerability' },
    { id: 'SPRINT-25', name: 'Sprint 25: Gateways', startDate: '2026-07-15', endDate: '2026-07-28', goal: 'Stripe v3 webhook idempotency' },
    { id: 'SPRINT-26', name: 'Sprint 26: Performance', startDate: '2026-07-29', endDate: '2026-08-12', goal: 'Optimize inventory locks' },
  ];

  sprintsData.forEach((s) => {
    nodes.push({ id: s.id, label: s.name, type: 'Sprint', properties: s });
  });

  // 5. Modules (12)
  const modulesData = [
    { id: 'MOD-1', name: 'Authentication & Identity', owner: 'Sarah Chen', criticality: 'CRITICAL', description: 'OAuth2, JWT, session store, MFA' },
    { id: 'MOD-2', name: 'Payment Gateway Integrations', owner: 'David Kim', criticality: 'CRITICAL', description: 'Stripe, PayPal, Ledger double-entry' },
    { id: 'MOD-3', name: 'User Permissions & RBAC', owner: 'Sarah Chen', criticality: 'HIGH', description: 'Role matrix, tenant boundary' },
    { id: 'MOD-4', name: 'Billing & Subscriptions', owner: 'David Kim', criticality: 'HIGH', description: 'Recurring invoices, plan upgrades' },
    { id: 'MOD-5', name: 'Notification Service', owner: 'Aisha Patel', criticality: 'MEDIUM', description: 'WebPush, SendGrid email, SMS' },
    { id: 'MOD-6', name: 'Inventory Sync Engine', owner: 'Maya Lin', criticality: 'CRITICAL', description: 'Real-time stock locks, warehouse sync' },
    { id: 'MOD-7', name: 'Order Fulfillment Engine', owner: 'Carlos Gomez', criticality: 'HIGH', description: 'Shipping label, order status pipeline' },
    { id: 'MOD-8', name: 'Analytics & Event Pipeline', owner: 'Liam O\'Connor', criticality: 'MEDIUM', description: 'Kafka streams, clickhouse event lake' },
    { id: 'MOD-9', name: 'Audit & Compliance Logger', owner: 'Yuki Tanaka', criticality: 'HIGH', description: 'SOC2 audit trail, tamper-proof logs' },
    { id: 'MOD-10', name: 'API Gateway & Router', owner: 'Alex Rivera', criticality: 'CRITICAL', description: 'Rate limiting, SSL, dynamic routing' },
    { id: 'MOD-11', name: 'K8s Cluster Auto-Scaler', owner: 'Marcus Vance', criticality: 'CRITICAL', description: 'Node provisioner, spot fallback' },
    { id: 'MOD-12', name: 'Reporting Engine', owner: 'Elena Rostova', criticality: 'LOW', description: 'PDF export, scheduled CSV reports' },
  ];

  modulesData.forEach((m) => {
    nodes.push({ id: m.id, label: m.name, type: 'Module', properties: m });
  });

  // Project -> HAS_MODULE
  addEdge('PROJ-1', 'MOD-1', 'HAS_MODULE');
  addEdge('PROJ-1', 'MOD-2', 'HAS_MODULE');
  addEdge('PROJ-1', 'MOD-3', 'HAS_MODULE');
  addEdge('PROJ-1', 'MOD-4', 'HAS_MODULE');
  addEdge('PROJ-2', 'MOD-10', 'HAS_MODULE');
  addEdge('PROJ-2', 'MOD-11', 'HAS_MODULE');
  addEdge('PROJ-2', 'MOD-9', 'HAS_MODULE');
  addEdge('PROJ-2', 'MOD-12', 'HAS_MODULE');
  addEdge('PROJ-3', 'MOD-5', 'HAS_MODULE');
  addEdge('PROJ-3', 'MOD-6', 'HAS_MODULE');
  addEdge('PROJ-3', 'MOD-7', 'HAS_MODULE');
  addEdge('PROJ-3', 'MOD-8', 'HAS_MODULE');

  // Developer -> WORKS_ON -> Module
  addEdge('DEV-2', 'MOD-1', 'WORKS_ON');
  addEdge('DEV-2', 'MOD-3', 'WORKS_ON');
  addEdge('DEV-3', 'MOD-2', 'WORKS_ON');
  addEdge('DEV-3', 'MOD-4', 'WORKS_ON');
  addEdge('DEV-1', 'MOD-10', 'WORKS_ON');
  addEdge('DEV-5', 'MOD-11', 'WORKS_ON');
  addEdge('DEV-6', 'MOD-5', 'WORKS_ON');
  addEdge('DEV-8', 'MOD-6', 'WORKS_ON');
  addEdge('DEV-7', 'MOD-7', 'WORKS_ON');
  addEdge('DEV-9', 'MOD-8', 'WORKS_ON');
  addEdge('DEV-10', 'MOD-9', 'WORKS_ON');
  addEdge('DEV-4', 'MOD-12', 'WORKS_ON');

  // 6. Features (40)
  const featureList: { id: string; name: string; modId: string }[] = [];
  let featCounter = 1;

  modulesData.forEach((m) => {
    const fTitles = [
      `${m.name} Primary API`,
      `${m.name} Event Listener`,
      `${m.name} Cache Layer`,
      `${m.name} Dashboard Control`,
    ];
    // 3 to 4 features per module (total 40)
    const count = featCounter > 32 ? 3 : 4;
    for (let i = 0; i < count; i++) {
      const fId = `FEAT-${featCounter++}`;
      const fTitle = fTitles[i] || `${m.name} Extension ${i}`;
      featureList.push({ id: fId, name: fTitle, modId: m.id });
      nodes.push({ id: fId, label: fTitle, type: 'Feature', properties: { id: fId, name: fTitle, priority: m.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH' } });
      addEdge(m.id, fId, 'HAS_FEATURE');
    }
  });

  // 7. Requirements (15)
  for (let r = 1; r <= 15; r++) {
    const rId = `REQ-${r}`;
    nodes.push({
      id: rId,
      label: `REQ-${r}: Security Clause`,
      type: 'Requirement',
      properties: { id: rId, title: `SOC2 Requirement ${r}`, specification: `Enforce audit requirement section ${r}.1` },
    });
    if (featureList[r]) {
      addEdge(featureList[r].id, rId, 'IMPLEMENTS');
    }
  }

  // 8. Test Cases (120)
  const testCaseList: { id: string; title: string; featureId: string }[] = [];
  let tcCounter = 100;

  featureList.forEach((feat, fIdx) => {
    // 3 test cases per feature (40 * 3 = 120 test cases)
    for (let i = 0; i < 3; i++) {
      tcCounter++;
      const tcId = `TC-${tcCounter}`;
      const isFail = tcCounter % 3 === 0 || tcCounter % 7 === 0;
      const isBlocked = tcCounter % 11 === 0;
      const execStatus = isFail ? 'FAILED' : isBlocked ? 'BLOCKED' : 'PASSED';
      const autoStatus = i === 0 ? 'AUTOMATED' : i === 1 ? 'MANUAL' : 'FLAKY';
      const tcTitle = `Verify ${feat.name} - Test Scenario #${i + 1}`;

      testCaseList.push({ id: tcId, title: tcTitle, featureId: feat.id });

      nodes.push({
        id: tcId,
        label: `${tcId}: ${tcTitle.slice(0, 24)}...`,
        type: 'TestCase',
        properties: {
          id: tcId,
          title: tcTitle,
          automationStatus: autoStatus,
          executionStatus: execStatus,
          platform: i === 0 ? 'API' : i === 1 ? 'Web' : 'Mobile',
          environment: 'Staging',
        },
      });

      addEdge(feat.id, tcId, 'HAS_TESTCASE');
    }
  });

  // 9. Bugs (60 Bugs: BUG-101 to BUG-160)
  const bugTopics = [
    'JWT Secret Token Expiration Leak in Auth Service',
    'SQL Injection via Unsanitized Filter Parameter in Search',
    'Race Condition in Double-Entry Stripe Webhook Ledger',
    'RBAC Role Matrix Bypass when Tenant Header is Malformed',
    'Database Deadlock during Subscription Proration Batch',
    'WebPush Socket Reconnection Storm Crashes Gateway',
    'Multi-Region Inventory Lock Timeout leaves Stock Reserved',
    'Fulfillment Address Validation Silent Drop on Special Characters',
    'Kafka Consumer Group Rebalance Loop in Event Sink',
    'Audit Trail Signature Verification Failure on High Concurrency',
    'Rate Limiter Token Bucket overflow allows DDoS Amplification',
    'K8s Spot Node Termination causes 30s Downtime on Ingress',
  ];

  for (let b = 1; b <= 60; b++) {
    const bugId = `BUG-${100 + b}`;
    const baseTopic = bugTopics[(b - 1) % bugTopics.length];
    const isCritical = b <= 10 || b % 5 === 0;
    const priority = isCritical ? 'CRITICAL' : b % 3 === 0 ? 'HIGH' : b % 2 === 0 ? 'MEDIUM' : 'LOW';
    const severity = isCritical ? 'BLOCKER' : b % 4 === 0 ? 'CRITICAL' : b % 3 === 0 ? 'MAJOR' : 'MINOR';

    let status = 'OPEN';
    if (b > 45) status = 'CLOSED';
    else if (b > 35) status = 'RESOLVED';
    else if (b > 20) status = 'IN_PROGRESS';

    const assignedDev = developersData[(b - 1) % developersData.length].id;
    const releaseId = releasesData[(b - 1) % releasesData.length].id;
    const sprintId = sprintsData[b % sprintsData.length].id;
    const fullTitle = b <= 12 ? baseTopic : `${baseTopic} [Sub-case #${b}]`;

    nodes.push({
      id: bugId,
      label: `${bugId}: ${fullTitle.slice(0, 28)}...`,
      type: 'Bug',
      properties: {
        id: bugId,
        title: fullTitle,
        description: `High severity issue in ${modulesData[(b - 1) % 12].name}. Stack trace shows null pointer / deadlock exception during high concurrency load testing.`,
        priority,
        severity,
        status,
        createdDate: `2026-07-${String((b % 25) + 1).padStart(2, '0')}`,
        updatedDate: '2026-08-01',
        estimatedFixTime: `${((b % 6) + 1) * 4}h`,
        actualFixTime: status === 'CLOSED' ? `${((b % 6) + 1) * 3}h` : '0h',
        stepsToReproduce: '1. Send concurrent API payload\n2. Trigger edge condition\n3. Observe deadlock / memory leak in service logs.',
        environment: 'Staging / K8s',
      },
    });

    // Relationships
    addEdge(bugId, assignedDev, 'ASSIGNED_TO');
    addEdge(bugId, releaseId, 'FIXED_IN');
    addEdge(sprintId, bugId, 'CONTAINS');

    // Link failed testcases -> FOUND_BUG -> bug
    const tcMatch = testCaseList[(b * 2) % testCaseList.length];
    if (tcMatch) {
      addEdge(tcMatch.id, bugId, 'FOUND_BUG');
    }
  }

  // 10. Inter-bug dependency graph (BLOCKED_BY, RELATED_TO, DUPLICATE_OF)
  // Deep 5-hop blocker dependency chain
  addEdge('BUG-102', 'BUG-101', 'BLOCKED_BY');
  addEdge('BUG-103', 'BUG-101', 'BLOCKED_BY');
  addEdge('BUG-105', 'BUG-102', 'BLOCKED_BY');
  addEdge('BUG-110', 'BUG-105', 'BLOCKED_BY');
  addEdge('BUG-112', 'BUG-110', 'BLOCKED_BY'); // BUG-112 -> BUG-110 -> BUG-105 -> BUG-102 -> BUG-101 (5 hops!)

  addEdge('BUG-104', 'BUG-103', 'BLOCKED_BY');
  addEdge('BUG-106', 'BUG-104', 'BLOCKED_BY');
  addEdge('BUG-107', 'BUG-101', 'BLOCKED_BY');
  addEdge('BUG-108', 'BUG-107', 'BLOCKED_BY');
  addEdge('BUG-109', 'BUG-108', 'BLOCKED_BY');

  addEdge('BUG-115', 'BUG-111', 'BLOCKED_BY');
  addEdge('BUG-116', 'BUG-115', 'BLOCKED_BY');
  addEdge('BUG-120', 'BUG-111', 'BLOCKED_BY');

  // RELATED_TO
  addEdge('BUG-101', 'BUG-109', 'RELATED_TO');
  addEdge('BUG-102', 'BUG-104', 'RELATED_TO');
  addEdge('BUG-103', 'BUG-107', 'RELATED_TO');
  addEdge('BUG-110', 'BUG-115', 'RELATED_TO');
  addEdge('BUG-121', 'BUG-101', 'RELATED_TO');

  // DUPLICATE_OF
  addEdge('BUG-140', 'BUG-101', 'DUPLICATE_OF');
  addEdge('BUG-141', 'BUG-102', 'DUPLICATE_OF');

  return { nodes, edges };
}
