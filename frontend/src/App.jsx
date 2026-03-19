import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { analyzePhishingContent } from './lib/phishingAnalyzer';
import { analyzeContent, deleteHistory, getHistory } from './lib/apiClient';

const Home = lazy(() => import('./Home'));
const AnalysisResults = lazy(() => import('./AnalysisResults'));
const DetectionWorkspace = lazy(() => import('./DetectionWorkspace'));
const InfoPage = lazy(() => import('./InfoPage'));
const OperationsPage = lazy(() => import('./OperationsPage'));
const SecurityToolPage = lazy(() => import('./SecurityToolPage'));
const HistoryPage = lazy(() => import('./HistoryPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
      <div className="flex items-center gap-3 text-sm tracking-wider uppercase text-gray-300">
        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
        Loading Secure Module
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [analysisResult, setAnalysisResult] = useState(() =>
    analyzePhishingContent({
      inputType: 'email',
      input:
        'From: Official Support <security@bit-vault-service.net>\nSubject: URGENT: Action Required on Your Account\n\nPlease verify your account immediately using https://auth.bit-vault-portal.com/identity/verify.'
    })
  );
  const [analysisHistory, setAnalysisHistory] = useState(() => [
    {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      result: analyzePhishingContent({
        inputType: 'email',
        input:
          'From: Official Support <security@bit-vault-service.net>\nSubject: URGENT: Action Required on Your Account\n\nPlease verify your account immediately using https://auth.bit-vault-portal.com/identity/verify.'
      })
    }
  ]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        const data = await getHistory({ limit: 200 });
        if (!isMounted) return;
        if (Array.isArray(data.items) && data.items.length) {
          setAnalysisHistory(data.items);
          setAnalysisResult(data.items[0].result);
        }
      } catch {
        // Keep local fallback state when backend is unavailable.
      } finally {
        if (isMounted) {
          setHistoryLoading(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAnalyze = async (payload) => {
    try {
      const data = await analyzeContent(payload);
      setAnalysisResult(data.result);
      setAnalysisHistory((prev) => [data.entry, ...prev]);
      return data.result;
    } catch {
      const fallback = analyzePhishingContent(payload);
      setAnalysisResult(fallback);
      setAnalysisHistory((prev) => [
        {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          result: fallback
        },
        ...prev
      ]);
      return fallback;
    }
  };

  const handleSelectHistoryItem = (entryId) => {
    const entry = analysisHistory.find((item) => item.id === entryId);
    if (!entry) return;
    setAnalysisResult(entry.result);
    setCurrentPage('analysis');
  };

  const handleClearHistory = async (entryIds = []) => {
    if (!entryIds.length) return;

    try {
      await deleteHistory(entryIds);
    } catch {
      // Continue with local update if backend request fails.
    }

    setAnalysisHistory((prev) => prev.filter((entry) => !entryIds.includes(entry.id)));
  };

  const CurrentPage = useMemo(() => {
    if (currentPage === 'workspace') {
      return DetectionWorkspace;
    }

    if (currentPage === 'analysis') {
      return AnalysisResults;
    }

    if (['privacy', 'terms', 'trust', 'status'].includes(currentPage)) {
      return InfoPage;
    }

    if (['threat-intel', 'policy', 'logs'].includes(currentPage)) {
      return OperationsPage;
    }

    if (['mail-guard', 'link-analyzer', 'vault', 'system-health'].includes(currentPage)) {
      return SecurityToolPage;
    }

    if (currentPage === 'history') {
      return HistoryPage;
    }

    return Home;
  }, [currentPage]);

  return (
    <Suspense fallback={<PageLoader />}>
      <CurrentPage
        onNavigate={setCurrentPage}
        pageKey={currentPage}
        analysisResult={analysisResult}
        analysisHistory={analysisHistory}
        onAnalyze={handleAnalyze}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        historyLoading={historyLoading}
      />
    </Suspense>
  );
}