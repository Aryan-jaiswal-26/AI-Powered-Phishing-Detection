import React, { Suspense, lazy, useMemo, useState } from 'react';

const Home = lazy(() => import('./Home'));
const AnalysisResults = lazy(() => import('./AnalysisResults'));
const DetectionWorkspace = lazy(() => import('./DetectionWorkspace'));
const InfoPage = lazy(() => import('./InfoPage'));
const OperationsPage = lazy(() => import('./OperationsPage'));
const SecurityToolPage = lazy(() => import('./SecurityToolPage'));

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

    return Home;
  }, [currentPage]);

  return (
    <Suspense fallback={<PageLoader />}>
      <CurrentPage onNavigate={setCurrentPage} pageKey={currentPage} />
    </Suspense>
  );
}