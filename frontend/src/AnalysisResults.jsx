import React, { useEffect, useMemo, useState } from 'react';

function getSeverityStyles(level) {
  if (level === 'HIGH') {
    return {
      chip: 'text-error border-error/20 bg-error/10',
      icon: 'text-error border-error/20 bg-error/10',
      text: 'text-error'
    };
  }

  if (level === 'MED') {
    return {
      chip: 'text-tertiary border-tertiary/20 bg-tertiary/10',
      icon: 'text-tertiary border-tertiary/20 bg-tertiary/10',
      text: 'text-tertiary'
    };
  }

  return {
    chip: 'text-primary border-primary/20 bg-primary/10',
    icon: 'text-primary border-primary/20 bg-primary/10',
    text: 'text-primary'
  };
}

export default function AnalysisResults({ onNavigate, analysisResult }) {
  const result = analysisResult || {
    score: 5,
    status: 'SAFE',
    riskLabel: 'Low Risk',
    vector: 'Email Text',
    latencyMs: 60,
    sourceText: 'No scan data found. Run a scan from Detection Workspace.',
    flags: [],
    explainability: []
  };

  const [status, setStatus] = useState(result.status || 'SAFE');

  useEffect(() => {
    setStatus(result.status || 'SAFE');
  }, [result.status]);

  const riskPercent = Math.max(0, Math.min(100, result.score || 0));
  const gaugeCircumference = 552.92;
  const gaugeOffset = useMemo(
    () => gaugeCircumference - (gaugeCircumference * riskPercent) / 100,
    [riskPercent]
  );

  const topFlags = (result.flags || []).slice(0, 3);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.sourceText || '');
      alert('Source data copied to clipboard.');
    } catch {
      alert('Clipboard copy failed in this browser context.');
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary">
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-[#3c494e]/15 shadow-[0_0_15px_rgba(0,209,255,0.1)] flex items-center justify-between px-6 h-16 w-full">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-[#00D1FF] font-headline cursor-pointer" onClick={() => onNavigate('home')}>
            PHISH_SHIELD
          </span>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="text-[#bbc9cf] hover:text-[#00D1FF] transition-colors font-headline tracking-tight text-sm cursor-pointer">Dashboard</button>
            <a onClick={() => onNavigate('threat-intel')} className="text-[#00D1FF] border-b-2 border-[#00D1FF] pb-1 font-headline tracking-tight text-sm cursor-pointer" href="#">Threat Intelligence</a>
            <a onClick={() => onNavigate('policy')} className="text-[#bbc9cf] hover:text-[#00D1FF] transition-colors font-headline tracking-tight text-sm cursor-pointer" href="#">Policy</a>
            <a onClick={() => onNavigate('logs')} className="text-[#bbc9cf] hover:text-[#00D1FF] transition-colors font-headline tracking-tight text-sm cursor-pointer" href="#">Logs</a>
            <button onClick={() => onNavigate('history')} className="text-[#bbc9cf] hover:text-[#00D1FF] transition-colors font-headline tracking-tight text-sm cursor-pointer">History</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 transition-all rounded-lg">
            <span className="material-symbols-outlined">notifications_active</span>
          </button>
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 transition-all rounded-lg">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20 overflow-hidden" />
        </div>
      </nav>

      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#1c1b1d] bg-gradient-to-b from-[#1c1b1d] to-[#131315] flex-col py-8 px-4 space-y-2 hidden md:flex">
        <div className="mb-6 px-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#ffd59c]" />
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest text-[#bbc9cf]">CYBER_OS</span>
          </div>
          <span className="text-[10px] text-on-surface-variant/40 font-mono">v4.2.0-STABLE</span>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => onNavigate('workspace')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#353437] text-[#00D1FF] border-r-4 border-[#00D1FF] cursor-pointer duration-200 group">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest group-hover:translate-x-1 transition-transform">Quick Scan</span>
          </button>
          <button onClick={() => onNavigate('mail-guard')} className="w-full flex items-center gap-3 px-4 py-3 text-[#bbc9cf] hover:bg-[#2a2a2c] cursor-pointer duration-200 group">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest group-hover:translate-x-1 transition-transform">Mail Guard</span>
          </button>
          <button onClick={() => onNavigate('link-analyzer')} className="w-full flex items-center gap-3 px-4 py-3 text-[#bbc9cf] hover:bg-[#2a2a2c] cursor-pointer duration-200 group">
            <span className="material-symbols-outlined text-sm">link_off</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest group-hover:translate-x-1 transition-transform">Link Analyzer</span>
          </button>
          <button onClick={() => onNavigate('vault')} className="w-full flex items-center gap-3 px-4 py-3 text-[#bbc9cf] hover:bg-[#2a2a2c] cursor-pointer duration-200 group">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest group-hover:translate-x-1 transition-transform">Vault</span>
          </button>
          <button onClick={() => onNavigate('system-health')} className="w-full flex items-center gap-3 px-4 py-3 text-[#bbc9cf] hover:bg-[#2a2a2c] cursor-pointer duration-200 group">
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span className="font-['Inter'] text-xs font-medium uppercase tracking-widest group-hover:translate-x-1 transition-transform">System Health</span>
          </button>
        </nav>
      </aside>

      <main className="md:ml-64 mt-16 p-8 min-h-screen">
        <section className="mb-12">
          <div
            className={`relative overflow-hidden rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-500 ${
              status === 'DANGER'
                ? 'bg-error-container/20 border-error/20 border'
                : status === 'QUARANTINED'
                  ? 'bg-primary-container/20 border-primary/20 border'
                  : 'bg-tertiary-container/20 border-tertiary/20 border'
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`material-symbols-outlined ${
                    status === 'DANGER' ? 'text-error' : status === 'QUARANTINED' ? 'text-primary' : 'text-tertiary'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {status === 'DANGER' ? 'gpp_maybe' : status === 'QUARANTINED' ? 'gpp_good' : 'task_alt'}
                </span>
                <span className="font-label text-xs uppercase tracking-[0.3em] font-bold">
                  {status === 'DANGER' ? 'Security Incident Detected' : status === 'QUARANTINED' ? 'Threat Contained' : 'Low Risk Classification'}
                </span>
              </div>
              <h1 className="font-headline text-5xl font-black tracking-tighter">
                {status === 'DANGER' ? 'THREAT DETECTED' : status === 'QUARANTINED' ? 'SOURCE QUARANTINED' : 'MARKED AS SAFE'}
              </h1>
              <p className="mt-2 text-on-surface-variant max-w-lg font-body text-sm leading-relaxed">
                Real-time score: {riskPercent}% ({result.riskLabel}). Vector: {result.vector}. Processing latency: {result.latencyMs}ms.
              </p>
            </div>
            <div className="flex gap-4 relative z-10">
              {status === 'DANGER' ? (
                <>
                  <button onClick={() => setStatus('QUARANTINED')} className="px-6 py-3 bg-error text-on-error font-bold text-xs tracking-widest rounded-md hover:shadow-[0_0_20px_rgba(255,180,171,0.4)] transition-all">QUARANTINE SOURCE</button>
                  <button onClick={() => setStatus('SAFE')} className="px-6 py-3 bg-surface-container-highest border border-outline-variant/30 text-on-surface font-bold text-xs tracking-widest rounded-md hover:bg-surface-variant transition-colors">FALSE POSITIVE</button>
                </>
              ) : (
                <button onClick={() => setStatus('DANGER')} className="px-6 py-3 bg-surface-container-highest border border-outline-variant/30 text-on-surface font-bold text-xs tracking-widest rounded-md hover:bg-surface-variant transition-colors">REVERT STATUS</button>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center border border-outline-variant/10">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mb-6">Risk Confidence</span>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="4" />
                <circle className="text-error shadow-[0_0_15px_#ffb4ab]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray={gaugeCircumference} strokeDashoffset={gaugeOffset} strokeLinecap="round" strokeWidth="8" />
              </svg>
              <div className="text-center">
                <span className="font-headline text-5xl font-bold text-on-surface tracking-tighter">{riskPercent}<span className="text-2xl opacity-50">%</span></span>
                <p className="text-[10px] font-label uppercase tracking-widest text-error font-bold mt-1">{result.riskLabel}</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
              <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/5">
                <p className="text-[10px] text-on-surface-variant/50 uppercase mb-1">Vector</p>
                <p className="text-xs font-bold text-primary">{result.vector}</p>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/5">
                <p className="text-[10px] text-on-surface-variant/50 uppercase mb-1">Latency</p>
                <p className="text-xs font-bold text-primary">{result.latencyMs}ms</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">Key Insights</h2>
              <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-error/20">{topFlags.length} Signal(s)</span>
            </div>
            <div className="space-y-4">
              {topFlags.length === 0 && (
                <div className="text-sm text-on-surface-variant">No analysis signals found. Submit content from Detection Workspace.</div>
              )}
              {topFlags.map((flag) => {
                const styles = getSeverityStyles(flag.severity);
                return (
                  <div key={`${flag.title}-${flag.detail}`} className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-high/50 hover:bg-surface-container-high transition-colors">
                    <div className={`mt-1 p-2 rounded border ${styles.icon}`}>
                      <span className="material-symbols-outlined text-sm">{flag.icon || 'info'}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface mb-1">{flag.title}</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{flag.detail}</p>
                    </div>
                    <span className={`ml-auto text-[10px] font-mono font-bold ${styles.text}`}>{flag.severity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-lowest flex items-center justify-between">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Source Data Transcription</span>
              <button onClick={handleCopy} title="Copy to clipboard" className="p-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
            </div>
            <div className="p-8 font-mono text-xs leading-relaxed text-on-surface-variant/80 overflow-y-auto whitespace-pre-wrap">
              {result.sourceText}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-8 border border-outline-variant/10 flex flex-col">
            <div className="mb-8">
              <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface mb-2">Explainability Engine</h2>
              <p className="text-xs text-on-surface-variant">Model reasons generated from actual scan output.</p>
            </div>
            <div className="flex-1 space-y-8">
              {(result.explainability || []).map((item, index) => (
                <div key={`${item.title}-${index}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-primary text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface">{item.title}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 px-8 bg-[#0e0e10] border-t border-[#3c494e]/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:ml-64 md:w-[calc(100%-16rem)]">
        <div>
          <span className="text-[#00D1FF] font-black font-headline tracking-tighter mb-4 block">PHISH_SHIELD</span>
          <p className="text-[#bbc9cf] font-['Inter'] text-[10px] uppercase tracking-widest">© 2024 PHISH_SHIELD TACTICAL EDITORIAL</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4 justify-start md:justify-end">
          <a onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] transition-opacity underline underline-offset-4 font-['Inter'] text-[10px] uppercase tracking-widest" href="#">Privacy Protocol</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] transition-opacity underline underline-offset-4 font-['Inter'] text-[10px] uppercase tracking-widest" href="#">Terms of Engagement</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('trust'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] transition-opacity underline underline-offset-4 font-['Inter'] text-[10px] uppercase tracking-widest" href="#">Trust Center</a>
          <a onClick={(e) => { e.preventDefault(); onNavigate('status'); }} className="text-[#bbc9cf]/60 hover:text-[#00D1FF] transition-opacity underline underline-offset-4 font-['Inter'] text-[10px] uppercase tracking-widest" href="#">Status</a>
        </div>
      </footer>
    </div>
  );
}
