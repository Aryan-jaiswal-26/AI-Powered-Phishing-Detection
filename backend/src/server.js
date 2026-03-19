import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDatabase } from './config/db.js';
import {
  addHistory,
  addVault,
  clearVault,
  fetchHistory,
  fetchVault,
  removeHistory,
  useAtlasDataApi
} from './services/persistence.js';
import { analyzePhishingContent } from './services/phishingAnalyzer.js';

const app = express();
const port = process.env.PORT || 8787;

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'ics-backend', timestamp: new Date().toISOString() });
});

app.post('/api/analyze', async (req, res) => {
  const { input = '', inputType = 'email', fileName = '' } = req.body || {};
  const result = analyzePhishingContent({ input, inputType, fileName });
  const entry = await addHistory(result);
  res.json({ result, entry });
});

app.get('/api/history', async (req, res) => {
  const { query = '', status = 'ALL', dateRange = 'ALL', page = '1', limit = '50' } = req.query;
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
  const pageSize = Math.max(1, Number.parseInt(limit, 10) || 50);
  const data = await fetchHistory({
    query: String(query),
    status: String(status),
    dateRange: String(dateRange),
    page: pageNumber,
    limit: pageSize
  });

  res.json(data);
});

app.delete('/api/history', async (req, res) => {
  const { ids = [] } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ error: 'ids array is required' });
  }

  const data = await removeHistory(ids.map(String));
  return res.json(data);
});

app.get('/api/system-health', (_, res) => {
  res.json({
    cpu: Math.floor(22 + Math.random() * 62),
    queue: Math.floor(Math.random() * 55),
    latency: Math.floor(52 + Math.random() * 120),
    healthyNodes: Math.floor(15 + Math.random() * 6),
    updatedAt: new Date().toISOString()
  });
});

app.get('/api/vault', async (_, res) => {
  const items = await fetchVault();
  res.json({ items });
});

app.post('/api/vault', async (req, res) => {
  const { name = '', tag = 'Evidence' } = req.body || {};
  if (!String(name).trim()) {
    return res.status(400).json({ error: 'name is required' });
  }

  const entry = await addVault({ name: String(name).trim(), tag: String(tag).trim() || 'Evidence' });
  return res.status(201).json({ entry });
});

app.delete('/api/vault', async (_, res) => {
  await clearVault();
  res.json({ ok: true });
});

async function startServer() {
  try {
    let connectionLabel = 'Atlas Data API Mode';

    if (!useAtlasDataApi()) {
      const mongoUri = await connectDatabase();
      connectionLabel = mongoUri;
    }

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`ICS backend running at http://localhost:${port}`);
      // eslint-disable-next-line no-console
      console.log(`Persistence connected: ${connectionLabel}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

startServer();
