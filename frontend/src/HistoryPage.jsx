import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 6;

function relativeTime(timestamp) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function severityStyles(status) {
  if (status === 'DANGER') {
    return {
      badge: 'text-error border-error/30 bg-error/10',
      border: 'border-error/40',
      icon: 'warning'
    };
  }

  if (status === 'QUARANTINED') {
    return {
      badge: 'text-primary border-primary/30 bg-primary/10',
      border: 'border-primary/40',
      icon: 'shield'
    };
  }

  return {
    badge: 'text-tertiary border-tertiary/30 bg-tertiary/10',
    border: 'border-tertiary/40',
    icon: 'check_circle'
  };
}

function inDateRange(timestamp, rangeKey) {
  if (rangeKey === 'ALL') return true;

  const now = new Date();
  const value = new Date(timestamp);

  if (rangeKey === 'TODAY') {
    return (
      value.getFullYear() === now.getFullYear() &&
      value.getMonth() === now.getMonth() &&
      value.getDate() === now.getDate()
    );
  }

  const maxDays = rangeKey === '7D' ? 7 : 30;
  const diffMs = now.getTime() - value.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= maxDays;
}

function exportBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function HistoryPage({
  onNavigate,
  analysisHistory = [],
  onSelectHistoryItem,
  onClearHistory,
  historyLoading = false
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');
  const [page, setPage] = useState(1);

  const filteredHistory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return analysisHistory.filter((entry) => {
      const byStatus = statusFilter === 'ALL' || entry.result.status === statusFilter;
      const byRange = inDateRange(entry.createdAt, dateRange);
      const haystack = `${entry.result.riskLabel} ${entry.result.vector} ${entry.result.sourceText}`.toLowerCase();
      const byQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return byStatus && byRange && byQuery;
    });
  }, [analysisHistory, query, statusFilter, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE));
  const pagedHistory = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredHistory.slice(start, start + PAGE_SIZE);
  }, [filteredHistory, page]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, dateRange]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const filteredIds = filteredHistory.map((entry) => entry.id);

  const handleExportJson = () => {
    const payload = JSON.stringify(filteredHistory, null, 2);
    exportBlob('phish-shield-history-filtered.json', payload, 'application/json');
  };

  const handleExportCsv = () => {
    const header = ['id', 'createdAt', 'status', 'score', 'riskLabel', 'vector', 'latencyMs'];
    const rows = filteredHistory.map((entry) => [
      entry.id,
      entry.createdAt,
      entry.result.status,
      entry.result.score,
      `"${String(entry.result.riskLabel || '').replaceAll('"', '""')}"`,
      `"${String(entry.result.vector || '').replaceAll('"', '""')}"`,
      entry.result.latencyMs
    ]);

    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    exportBlob('phish-shield-history-filtered.csv', csv, 'text/csv;charset=utf-8');
  };

  const handleClearFiltered = () => {
    if (!filteredIds.length || !onClearHistory) return;
    onClearHistory(filteredIds);
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary">
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-[#3c494e]/15 shadow-[0_0_15px_rgba(0,209,255,0.1)] flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-[#00D1FF] font-headline cursor-pointer" onClick={() => onNavigate('home')}>
            PHISH_SHIELD
          </span>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300">Dashboard</button>
            <button onClick={() => onNavigate('threat-intel')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300">Threat Intelligence</button>
            <button onClick={() => onNavigate('policy')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300">Policy</button>
            <button onClick={() => onNavigate('logs')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300">Logs</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 rounded-lg transition-all duration-300">
            <span className="material-symbols-outlined">notifications_active</span>
          </button>
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 rounded-lg transition-all duration-300">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden" />
        </div>
      </nav>

      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#1c1b1d] bg-gradient-to-b from-[#1c1b1d] to-[#131315] flex-col py-8 px-4 space-y-2 hidden lg:flex">
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_#ffd59c]" />
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest text-[#bbc9cf]">CYBER_OS v4.2.0-STABLE</span>
          </div>
        </div>
        <div className="space-y-1">
          <button onClick={() => onNavigate('workspace')} className="w-full text-[#bbc9cf] hover:bg-[#2a2a2c] flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">radar</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">Quick Scan</span>
          </button>
          <button onClick={() => onNavigate('history')} className="w-full bg-[#353437] text-[#00D1FF] border-r-4 border-[#00D1FF] flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">history</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">History</span>
          </button>
          <button onClick={() => onNavigate('mail-guard')} className="w-full text-[#bbc9cf] hover:bg-[#2a2a2c] flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">Mail Guard</span>
          </button>
          <button onClick={() => onNavigate('system-health')} className="w-full text-[#bbc9cf] hover:bg-[#2a2a2c] flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">System Health</span>
          </button>
        </div>
      </aside>

      <main className="ml-0 lg:ml-64 pt-16 min-h-screen grid-bg relative">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-label uppercase tracking-[0.2em] text-primary">Archive Workspace</span>
              <div className="h-[1px] w-12 bg-outline-variant/30" />
            </div>
            <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tighter">Threat History <span className="text-primary-fixed-dim">Archive</span></h1>
          </header>

          <section className="glass-panel rounded-xl p-6 border border-outline-variant/20 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search risk label, vector, source text..."
                className="lg:col-span-2 bg-surface-container-lowest/30 border border-outline-variant/20 rounded-lg p-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-lowest/30 border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="ALL">All Status</option>
                <option value="DANGER">Danger</option>
                <option value="QUARANTINED">Quarantined</option>
                <option value="SAFE">Safe</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-surface-container-lowest/30 border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button onClick={handleExportJson} className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border border-outline-variant/30 rounded hover:border-primary hover:text-primary transition-colors">Export JSON</button>
              <button onClick={handleExportCsv} className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border border-outline-variant/30 rounded hover:border-primary hover:text-primary transition-colors">Export CSV</button>
              <button
                onClick={handleClearFiltered}
                disabled={!filteredIds.length}
                className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border border-error/30 text-error rounded hover:bg-error/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear Filtered Results
              </button>
              <span className="ml-auto text-[10px] uppercase tracking-widest text-on-surface-variant">
                Showing {pagedHistory.length} of {filteredHistory.length} filtered entries
              </span>
            </div>
          </section>

          {historyLoading ? (
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 text-sm text-on-surface-variant">
              Syncing history from backend...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 text-sm text-on-surface-variant">
              No history items match your search/filter selection.
            </div>
          ) : (
            <section className="space-y-4">
              {pagedHistory.map((entry) => {
                const styles = severityStyles(entry.result.status);
                return (
                  <article
                    key={entry.id}
                    className={`rounded-xl border bg-surface-container-low p-5 transition-colors hover:bg-surface-container-high/60 ${styles.border}`}
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`px-2 py-1 text-[10px] uppercase tracking-widest border rounded ${styles.badge}`}>
                            {entry.result.status}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">{relativeTime(entry.createdAt)}</span>
                          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">{entry.result.vector}</span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight mb-1">{entry.result.riskLabel} - {entry.result.score}%</h3>
                        <p className="text-xs text-on-surface-variant">
                          Latency: {entry.result.latencyMs}ms • Signals: {(entry.result.flags || []).length}
                        </p>
                      </div>
                      <button
                        onClick={() => onSelectHistoryItem && onSelectHistoryItem(entry.id)}
                        className="px-4 py-2 bg-primary-container text-on-primary text-xs uppercase tracking-widest font-bold rounded hover:shadow-[0_0_14px_rgba(0,209,255,0.35)] transition-shadow"
                      >
                        Open Result
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-xs uppercase tracking-widest border border-outline-variant/30 rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs uppercase tracking-widest text-on-surface-variant">
              Page {page} of {pageCount}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              disabled={page === pageCount}
              className="px-4 py-2 text-xs uppercase tracking-widest border border-outline-variant/30 rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <footer className="ml-0 lg:ml-64 w-full py-12 px-8 bg-[#0e0e10] border-t border-[#3c494e]/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-[#00D1FF] font-black text-lg tracking-tighter font-headline">PHISH_SHIELD</span>
          <p className="text-[#bbc9cf]/60 font-['Inter'] text-[10px] uppercase tracking-widest mt-2">© 2024 PHISH_SHIELD TACTICAL EDITORIAL</p>
        </div>
        <div className="flex flex-wrap gap-6 md:justify-end">
          <a onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] font-['Inter'] text-[10px] uppercase tracking-widest underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Protocol</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] font-['Inter'] text-[10px] uppercase tracking-widest underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Terms of Engagement</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('trust'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] font-['Inter'] text-[10px] uppercase tracking-widest underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Trust Center</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('status'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] font-['Inter'] text-[10px] uppercase tracking-widest underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Status</a>
        </div>
      </footer>
    </div>
  );
}
