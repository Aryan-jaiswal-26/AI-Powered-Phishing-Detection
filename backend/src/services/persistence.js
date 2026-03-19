import { HistoryEntry } from '../models/HistoryEntry.js';
import { VaultItem } from '../models/VaultItem.js';
import {
  clearVaultItems as clearVaultDataApi,
  countHistoryEntries as countHistoryDataApi,
  deleteHistoryEntries as deleteHistoryDataApi,
  insertHistoryEntry as insertHistoryDataApi,
  insertVaultItem as insertVaultDataApi,
  listHistory as listHistoryDataApi,
  listVaultItems as listVaultDataApi
} from './mongoDataApi.js';

export function useAtlasDataApi() {
  return String(process.env.USE_ATLAS_DATA_API || '').toLowerCase() === 'true';
}

function serializeHistory(entry) {
  return {
    id: String(entry._id),
    createdAt: entry.createdAt,
    result: entry.result
  };
}

function serializeVault(item) {
  return {
    id: String(item._id),
    name: item.name,
    tag: item.tag,
    storedAt: item.storedAt
  };
}

export async function addHistory(result) {
  if (useAtlasDataApi()) {
    return insertHistoryDataApi(result);
  }

  const entry = await HistoryEntry.create({ result });
  return serializeHistory(entry);
}

export async function fetchHistory({ query = '', status = 'ALL', dateRange = 'ALL', page = 1, limit = 50 }) {
  if (useAtlasDataApi()) {
    return listHistoryDataApi({ query, status, dateRange, page, limit });
  }

  const now = new Date();
  const filters = {};

  if (status !== 'ALL') {
    filters['result.status'] = status;
  }

  if (String(query).trim()) {
    const regex = new RegExp(String(query).trim(), 'i');
    filters.$or = [
      { 'result.riskLabel': regex },
      { 'result.vector': regex },
      { 'result.sourceText': regex }
    ];
  }

  if (dateRange !== 'ALL') {
    const startDate = new Date(now);
    if (dateRange === 'TODAY') {
      startDate.setHours(0, 0, 0, 0);
    } else {
      const maxDays = dateRange === '7D' ? 7 : 30;
      startDate.setDate(now.getDate() - maxDays);
    }
    filters.createdAt = { $gte: startDate };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    HistoryEntry.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    HistoryEntry.countDocuments(filters)
  ]);

  return {
    items: items.map(serializeHistory),
    total,
    page,
    limit
  };
}

export async function removeHistory(ids = []) {
  if (useAtlasDataApi()) {
    const deleted = await deleteHistoryDataApi(ids);
    const remaining = await countHistoryDataApi();
    return { deleted, remaining };
  }

  const deletion = await HistoryEntry.deleteMany({ _id: { $in: ids } });
  const remaining = await HistoryEntry.countDocuments();
  return { deleted: deletion.deletedCount || 0, remaining };
}

export async function fetchVault() {
  if (useAtlasDataApi()) {
    return listVaultDataApi();
  }

  const items = await VaultItem.find({}).sort({ storedAt: -1 });
  return items.map(serializeVault);
}

export async function addVault({ name, tag }) {
  if (useAtlasDataApi()) {
    return insertVaultDataApi({ name, tag });
  }

  const entry = await VaultItem.create({ name, tag });
  return serializeVault(entry);
}

export async function clearVault() {
  if (useAtlasDataApi()) {
    await clearVaultDataApi();
    return;
  }

  await VaultItem.deleteMany({});
}
