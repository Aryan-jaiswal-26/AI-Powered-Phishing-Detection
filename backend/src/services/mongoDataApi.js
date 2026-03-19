const DEFAULT_API_URL = 'https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1/action';

function ensureConfig() {
  const apiUrl = process.env.MONGODB_DATA_API_URL || DEFAULT_API_URL;
  const apiKey = process.env.MONGODB_DATA_API_KEY;
  const dataSource = process.env.MONGODB_DATA_SOURCE || 'Cluster0';
  const database = process.env.MONGODB_DATABASE || 'ics';

  if (!apiKey) {
    throw new Error('MONGODB_DATA_API_KEY is required for Atlas Data API mode');
  }

  if (apiUrl.includes('<app-id>')) {
    throw new Error('Set a valid MONGODB_DATA_API_URL for Atlas Data API mode');
  }

  return { apiUrl, apiKey, dataSource, database };
}

function objectIdFilter(id) {
  return { $oid: String(id) };
}

function getId(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.$oid) return value.$oid;
  return String(value);
}

async function callDataApi(action, body) {
  const { apiUrl, apiKey } = ensureConfig();

  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Atlas Data API request failed: ${response.status}`);
  }

  return response.json();
}

function withCollection(collection, payload = {}) {
  const { dataSource, database } = ensureConfig();
  return {
    dataSource,
    database,
    collection,
    ...payload
  };
}

export async function insertHistoryEntry(result) {
  const createdAt = new Date().toISOString();
  const response = await callDataApi(
    'insertOne',
    withCollection('history', {
      document: { result, createdAt }
    })
  );

  return {
    id: getId(response.insertedId),
    createdAt,
    result
  };
}

export async function listHistory({ query = '', status = 'ALL', dateRange = 'ALL', page = 1, limit = 50 }) {
  const now = new Date();
  const filter = {};

  if (status !== 'ALL') {
    filter['result.status'] = status;
  }

  const cleanedQuery = String(query || '').trim();
  if (cleanedQuery) {
    filter.$or = [
      { 'result.riskLabel': { $regex: cleanedQuery, $options: 'i' } },
      { 'result.vector': { $regex: cleanedQuery, $options: 'i' } },
      { 'result.sourceText': { $regex: cleanedQuery, $options: 'i' } }
    ];
  }

  if (dateRange !== 'ALL') {
    const start = new Date(now);
    if (dateRange === 'TODAY') {
      start.setHours(0, 0, 0, 0);
    } else {
      const maxDays = dateRange === '7D' ? 7 : 30;
      start.setDate(now.getDate() - maxDays);
    }
    filter.createdAt = { $gte: start.toISOString() };
  }

  const skip = (page - 1) * limit;

  const [findResult, countResult] = await Promise.all([
    callDataApi(
      'find',
      withCollection('history', {
        filter,
        sort: { createdAt: -1 },
        limit,
        skip
      })
    ),
    callDataApi(
      'countDocuments',
      withCollection('history', {
        filter
      })
    )
  ]);

  const items = (findResult.documents || []).map((doc) => ({
    id: getId(doc._id),
    createdAt: doc.createdAt,
    result: doc.result
  }));

  return {
    items,
    total: countResult.count || 0,
    page,
    limit
  };
}

export async function deleteHistoryEntries(ids = []) {
  const response = await callDataApi(
    'deleteMany',
    withCollection('history', {
      filter: {
        _id: {
          $in: ids.map(objectIdFilter)
        }
      }
    })
  );

  return response.deletedCount || 0;
}

export async function countHistoryEntries() {
  const response = await callDataApi('countDocuments', withCollection('history', { filter: {} }));
  return response.count || 0;
}

export async function listVaultItems() {
  const response = await callDataApi(
    'find',
    withCollection('vault', {
      filter: {},
      sort: { storedAt: -1 }
    })
  );

  return (response.documents || []).map((doc) => ({
    id: getId(doc._id),
    name: doc.name,
    tag: doc.tag,
    storedAt: doc.storedAt
  }));
}

export async function insertVaultItem({ name, tag }) {
  const storedAt = new Date().toISOString();
  const response = await callDataApi(
    'insertOne',
    withCollection('vault', {
      document: { name, tag, storedAt }
    })
  );

  return {
    id: getId(response.insertedId),
    name,
    tag,
    storedAt
  };
}

export async function clearVaultItems() {
  await callDataApi('deleteMany', withCollection('vault', { filter: {} }));
}
