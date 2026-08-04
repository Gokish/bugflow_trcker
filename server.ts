import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { graphEngine } from './src/data/graphEngine.js';

const __dirname = process.cwd();


async function startServer() {
  const app = express();
  // const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'BugFlow Graph Engine', database: 'CognoDB / Neo4j Compatible' });
  });

  // Dashboard Stats
  app.get('/api/graph/stats', (req: Request, res: Response) => {
    try {
      const stats = graphEngine.getDashboardStats();
      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reset Seed Data
  app.post('/api/graph/seed', (req: Request, res: Response) => {
    try {
      const dataset = graphEngine.resetSeedData();
      res.json({ success: true, message: 'Graph dataset re-seeded successfully', nodeCount: dataset.nodes.length, edgeCount: dataset.edges.length });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get Graph Dataset
  app.get('/api/graph/nodes', (req: Request, res: Response) => {
    try {
      const { type, limit } = req.query;
      let dataset = graphEngine.getDataset();

      if (type && typeof type === 'string') {
        const filteredNodes = dataset.nodes.filter((n) => n.type.toLowerCase() === type.toLowerCase());
        const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
        const filteredEdges = dataset.edges.filter((e) => filteredNodeIds.has(e.source) || filteredNodeIds.has(e.target));
        res.json({ success: true, nodes: filteredNodes, edges: filteredEdges });
        return;
      }

      if (limit && !isNaN(Number(limit))) {
        const slicedNodes = dataset.nodes.slice(0, Number(limit));
        const slicedNodeIds = new Set(slicedNodes.map((n) => n.id));
        const slicedEdges = dataset.edges.filter((e) => slicedNodeIds.has(e.source) && slicedNodeIds.has(e.target));
        res.json({ success: true, nodes: slicedNodes, edges: slicedEdges });
        return;
      }

      res.json({ success: true, nodes: dataset.nodes, edges: dataset.edges });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get Bugs List & Filter
  app.get('/api/bugs', (req: Request, res: Response) => {
    try {
      const { status, priority, severity, developerId, releaseId, search } = req.query;
      let bugs = graphEngine.getNodesByType('Bug');

      if (status && typeof status === 'string') {
        bugs = bugs.filter((b) => b.properties.status === status);
      }
      if (priority && typeof priority === 'string') {
        bugs = bugs.filter((b) => b.properties.priority === priority);
      }
      if (severity && typeof severity === 'string') {
        bugs = bugs.filter((b) => b.properties.severity === severity);
      }
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        bugs = bugs.filter(
          (b) =>
            b.id.toLowerCase().includes(q) ||
            b.properties.title?.toLowerCase().includes(q) ||
            b.properties.description?.toLowerCase().includes(q)
        );
      }

      res.json({ success: true, count: bugs.length, bugs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create Bug
  app.post('/api/bugs', (req: Request, res: Response) => {
    try {
      const bugData = req.body;
      const newBug = graphEngine.addBug(bugData);

      if (bugData.developerId) {
        graphEngine.addRelationship(newBug.id, bugData.developerId, 'ASSIGNED_TO');
      }
      if (bugData.releaseId) {
        graphEngine.addRelationship(newBug.id, bugData.releaseId, 'FIXED_IN');
      }
      if (bugData.blockedByBugId) {
        graphEngine.addRelationship(newBug.id, bugData.blockedByBugId, 'BLOCKED_BY');
      }

      res.status(201).json({ success: true, bug: newBug });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Execute Cypher Query
  app.post('/api/cypher', (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ success: false, error: 'Query string is required' });
        return;
      }

      const result = graphEngine.runCypherQuery(query);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Prebuilt Cypher Queries List
  app.get('/api/cypher/prebuilt', (req: Request, res: Response) => {
    try {
      const queries = graphEngine.getPrebuiltQueries();
      res.json({ success: true, queries });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3-Hop Impact Analysis
  app.get('/api/graph/impact/:bugId', (req: Request, res: Response) => {
    try {
      const { bugId } = req.params;
      const impact = graphEngine.get3HopImpactAnalysis(bugId);
      if (!impact) {
        res.status(404).json({ success: false, error: `Bug ${bugId} not found` });
        return;
      }
      res.json({ success: true, impact });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Shortest Path Finder
  app.get('/api/graph/shortest-path', (req: Request, res: Response) => {
    try {
      const { startId, endId } = req.query;
      if (!startId || !endId || typeof startId !== 'string' || typeof endId !== 'string') {
        res.status(400).json({ success: false, error: 'startId and endId query parameters required' });
        return;
      }

      const result = graphEngine.findShortestPath(startId, endId);
      if (!result) {
        res.status(404).json({ success: false, error: `No path found between ${startId} and ${endId}` });
        return;
      }
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Modules List
  app.get('/api/modules', (req: Request, res: Response) => {
    try {
      const modules = graphEngine.getNodesByType('Module');
      res.json({ success: true, count: modules.length, modules });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Developers List
  app.get('/api/developers', (req: Request, res: Response) => {
    try {
      const developers = graphEngine.getNodesByType('Developer');
      res.json({ success: true, count: developers.length, developers });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Releases List
  app.get('/api/releases', (req: Request, res: Response) => {
    try {
      const releases = graphEngine.getNodesByType('Release');
      res.json({ success: true, count: releases.length, releases });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // VITE DEVELOPMENT & PRODUCTION SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;

  app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
  });
}

startServer();
