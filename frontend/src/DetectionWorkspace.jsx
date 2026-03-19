import React, { useRef, useState } from 'react';

function relativeTime(timestamp) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DetectionWorkspace({ onNavigate, onAnalyze, analysisHistory = [], onSelectHistoryItem }) {
  const [activeTab, setActiveTab] = useState('email');
  const [inputData, setInputData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileRead = (file) => {
    if (!file) return;
    setSelectedFileName(file.name);
    const reader = new FileReader();

    reader.onload = () => {
      setInputData(typeof reader.result === 'string' ? reader.result : '');
      setAnalysisError('');
    };

    reader.onerror = () => {
      setInputData('');
      setAnalysisError('Unable to read this file. Please try another file format.');
    };

    reader.readAsText(file);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFileRead(file);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFileRead(file);
  };

  const handleAnalyze = async () => {
    const normalizedInput = inputData.trim();
    if (activeTab !== 'file' && !normalizedInput) return;

    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      if (onAnalyze) {
        await onAnalyze({
          inputType: activeTab,
          input: inputData,
          fileName: selectedFileName
        });
      }
      setTimeout(() => {
        setIsAnalyzing(false);
        onNavigate('analysis');
      }, 500);
    } catch {
      setIsAnalyzing(false);
      setAnalysisError('Scan failed. Verify backend is running and try again.');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-[#3c494e]/15 shadow-[0_0_15px_rgba(0,209,255,0.1)] flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-8">
          <span 
            className="text-xl font-bold tracking-tighter text-[#00D1FF] font-headline cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            PHISH_SHIELD
          </span>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#00D1FF] border-b-2 border-[#00D1FF] pb-1 transition-colors duration-300 ease-in-out cursor-pointer">Dashboard</button>
            <a onClick={() => onNavigate('threat-intel')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300 ease-in-out cursor-pointer" href="#">Threat Intelligence</a>
            <a onClick={() => onNavigate('policy')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300 ease-in-out cursor-pointer" href="#">Policy</a>
            <a onClick={() => onNavigate('logs')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300 ease-in-out cursor-pointer" href="#">Logs</a>
            <button onClick={() => onNavigate('history')} className="font-['Space_Grotesk'] tracking-tight text-sm text-[#bbc9cf] hover:text-[#00D1FF] transition-colors duration-300 ease-in-out cursor-pointer">History</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 rounded-lg transition-all duration-300">
            <span className="material-symbols-outlined">notifications_active</span>
          </button>
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 rounded-lg transition-all duration-300">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden">
            <img alt="Operator Profile" className="w-full h-full object-cover" data-alt="Close up professional portrait of a tech operator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiIlglElfltSrT-sMLmXaiZ0Gf7oV-mzPEUmLPTXh7Cj-tXjsWCojJz1Dn28koRjpLcnoeR4IB0Xob4U1tLjXANr5iR9Yq6e24LUwxUF6w1utysQMQv-fq-FcZAyOK-Mo3f5EBENFcJcF4AJXHM-awhYkBHsY8f10KUkqMT4-KDUSzdtzqPcezWjJB4f1XfBMniG2jJMwZCVNtm64mtUvdwFgFQyL_ubMnRPKmUJTXlqkNsVRuS010guvvjNqZX-_oXUJutUKPeJcm" />
          </div>
        </div>
      </nav>

      {/* SideNavBar (History/Tools) */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#1c1b1d] bg-gradient-to-b from-[#1c1b1d] to-[#131315] flex-col py-8 px-4 space-y-2 hidden lg:flex">
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_#ffd59c]"></div>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest text-[#bbc9cf]">CYBER_OS v4.2.0-STABLE</span>
          </div>
        </div>
        <div className="space-y-1">
          <button onClick={() => onNavigate('workspace')} className="w-full bg-[#353437] text-[#00D1FF] border-r-4 border-[#00D1FF] flex items-center gap-3 px-4 py-3 cursor-pointer duration-200 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">radar</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">Quick Scan</span>
          </button>
          <button onClick={() => onNavigate('mail-guard')} className="w-full text-[#bbc9cf] hover:bg-[#2a2a2c] flex items-center gap-3 px-4 py-3 cursor-pointer duration-200 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">Mail Guard</span>
          </button>
          <button onClick={() => onNavigate('link-analyzer')} className="w-full text-[#bbc9cf] hover:bg-[#2a2a2c] flex items-center gap-3 px-4 py-3 cursor-pointer duration-200 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">link_off</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">Link Analyzer</span>
          </button>
          <button onClick={() => onNavigate('vault')} className="w-full text-[#bbc9cf] hover:bg-[#2a2a2c] flex items-center gap-3 px-4 py-3 cursor-pointer duration-200 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">Vault</span>
          </button>
          <button onClick={() => onNavigate('system-health')} className="w-full text-[#bbc9cf] hover:bg-[#2a2a2c] flex items-center gap-3 px-4 py-3 cursor-pointer duration-200 transition-transform hover:translate-x-1">
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest">System Health</span>
          </button>
        </div>
        <div className="mt-auto pt-8 border-t border-outline-variant/10 space-y-1">
          <button onClick={handleAnalyze} className="w-full py-3 px-4 bg-primary-container text-on-primary font-headline font-bold text-xs tracking-widest rounded hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all">
            INITIATE SCAN
          </button>
          <div className="pt-4 space-y-2">
            <div className="text-[#bbc9cf]/60 hover:text-[#00D1FF] flex items-center gap-3 px-4 py-2 cursor-pointer duration-200 text-[10px] uppercase tracking-widest font-['Inter']">
              <span className="material-symbols-outlined text-xs">contact_support</span>
              <span>Support</span>
            </div>
            <div className="text-[#bbc9cf]/60 hover:text-[#00D1FF] flex items-center gap-3 px-4 py-2 cursor-pointer duration-200 text-[10px] uppercase tracking-widest font-['Inter']">
              <span className="material-symbols-outlined text-xs">integration_instructions</span>
              <span>API Docs</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-0 lg:ml-64 pt-16 min-h-screen grid-bg relative">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-label uppercase tracking-[0.2em] text-primary">Security Workspace</span>
              <div className="h-[1px] w-12 bg-outline-variant/30"></div>
            </div>
            <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tighter">Detection <span className="text-primary-fixed-dim">Analyzer</span></h1>
          </header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Analyzer Component (Main Focus) */}
            <div className="col-span-12 lg:col-span-8">
              <div className="glass-panel rounded-xl p-1 shadow-2xl border border-outline-variant/20 overflow-hidden">
                {/* Tabs */}
                <div className="flex bg-surface-container-lowest/50 p-1 rounded-t-lg">
                  <button onClick={() => setActiveTab('email')} className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all ${activeTab === 'email' ? 'bg-surface-container-high text-primary border-t-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high/50'}`}>
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span className="font-headline text-xs font-bold tracking-widest uppercase">Email Text</span>
                  </button>
                  <button onClick={() => setActiveTab('url')} className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all ${activeTab === 'url' ? 'bg-surface-container-high text-primary border-t-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high/50'}`}>
                    <span className="material-symbols-outlined text-sm">link</span>
                    <span className="font-headline text-xs font-bold tracking-widest uppercase">URL/Link</span>
                  </button>
                  <button onClick={() => setActiveTab('file')} className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all ${activeTab === 'file' ? 'bg-surface-container-high text-primary border-t-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high/50'}`}>
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    <span className="font-headline text-xs font-bold tracking-widest uppercase">File Upload</span>
                  </button>
                </div>

                {/* Workspace Area */}
                <div className="p-8 space-y-6">
                  <div className="relative group">
                    <label className="absolute -top-3 left-4 px-2 bg-surface-container-low text-[10px] font-label uppercase tracking-widest text-outline">Input Buffer</label>
                    
                    {activeTab === 'email' && (
                      <textarea 
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full h-80 bg-surface-container-lowest/30 border border-outline-variant/20 rounded-lg p-6 font-body text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-all resize-none text-sm leading-relaxed" 
                        placeholder="Paste the content of a suspicious email to begin..."
                      ></textarea>
                    )}

                    {activeTab === 'url' && (
                      <div className="w-full h-80 bg-surface-container-lowest/30 border border-outline-variant/20 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
                         <span className="material-symbols-outlined text-4xl text-outline mb-2">link</span>
                         <input 
                           type="text" 
                           value={inputData}
                           onChange={(e) => setInputData(e.target.value)}
                           className="w-full max-w-lg bg-surface-container-low border border-outline-variant/30 rounded p-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-all"
                           placeholder="https://suspicious-link.com"
                         />
                      </div>
                    )}

                    {activeTab === 'file' && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleFileDrop}
                        className="w-full h-80 bg-surface-container-lowest/30 border border-outline-variant/20 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container-high/20 hover:border-primary/50 transition-all group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileInputChange}
                          accept=".txt,.eml,.msg,.csv,.json,.md,.html"
                        />
                        <span className="material-symbols-outlined text-4xl mb-4 text-outline group-hover:text-primary transition-colors">upload</span>
                        <p className="text-sm font-bold mb-1">Drag and drop file here</p>
                        <p className="text-xs opacity-60">Supports .eml, .msg, .pdf, .docx (Max 50MB)</p>
                        {selectedFileName && <p className="text-xs mt-4 text-primary">Loaded: {selectedFileName}</p>}
                        {analysisError && <p className="text-xs mt-2 text-error">{analysisError}</p>}
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-40">
                      <span className="text-[10px] font-label uppercase tracking-widest">{activeTab === 'file' ? 'Awaiting file...' : 'Auto-detecting encoding...'}</span>
                      <div className="w-1 h-1 rounded-full bg-tertiary animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20">
                        <span className="material-symbols-outlined text-xs text-primary">verified_user</span>
                        <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Deep Analysis Active</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20">
                        <span className="material-symbols-outlined text-xs text-primary">history</span>
                        <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Auto-Save On</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing || (!inputData && activeTab !== 'file') || (activeTab === 'file' && !selectedFileName)}
                      className="group relative px-10 py-4 bg-primary-container text-on-primary font-headline font-bold text-sm tracking-[0.2em] rounded overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {isAnalyzing ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>progress_activity</span>
                            ANALYZING...
                          </>
                        ) : (
                          'ANALYZE CONTENT'
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panels */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Recent Activity Panel */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-headline font-bold tracking-widest uppercase">Session History</h3>
                  <span className="material-symbols-outlined text-primary text-sm">filter_list</span>
                </div>
                <div className="space-y-4">
                  {analysisHistory.slice(0, 3).map((entry) => {
                    const status = entry.result?.status || 'SAFE';
                    const statusColor =
                      status === 'DANGER'
                        ? 'hover:border-error bg-error/10 text-error'
                        : status === 'QUARANTINED'
                          ? 'hover:border-primary bg-primary/10 text-primary'
                          : 'hover:border-tertiary bg-tertiary/10 text-tertiary';

                    return (
                      <button
                        key={entry.id}
                        onClick={() => onSelectHistoryItem && onSelectHistoryItem(entry.id)}
                        className="group w-full flex items-start gap-4 p-3 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer border-l-2 border-transparent text-left"
                      >
                        <div className={`h-10 w-10 shrink-0 rounded flex items-center justify-center ${statusColor}`}>
                          <span className="material-symbols-outlined">{status === 'DANGER' ? 'warning' : status === 'QUARANTINED' ? 'shield' : 'check_circle'}</span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-on-surface truncate">{entry.result?.riskLabel || 'Scan Result'}</p>
                          <p className="text-[10px] text-on-surface-variant/60 font-label uppercase tracking-tighter mt-1">
                            {relativeTime(entry.createdAt)} • {status}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => onNavigate('history')} className="w-full mt-6 py-2 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors text-center">
                  View Full Archive
                </button>
              </div>

              {/* System Status Info */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <h3 className="text-sm font-headline font-bold tracking-widest uppercase mb-4">Neural Engine</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-label uppercase tracking-widest mb-2">
                      <span>Model Confidence</span>
                      <span className="text-primary">99.2%</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[92%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-label uppercase tracking-widest mb-2">
                      <span>Database Latency</span>
                      <span className="text-tertiary">14ms</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary w-[15%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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