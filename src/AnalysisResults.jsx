import React, { useState } from 'react';

export default function AnalysisResults({ onNavigate }) {
  const [status, setStatus] = useState('DANGER'); // DANGER, QUARANTINED, SAFE

  const handleCopy = () => {
    navigator.clipboard.writeText("From: Official Support <security@bit-vault-service.net>\nSubject: URGENT: Action Required on Your Account\n\nDear Valued Client,\nWe have detected an unauthorized login attempt...");
    alert("Source data copied to clipboard!");
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary">
      {/* TopNavBar Shell */}
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
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 transition-all rounded-lg">
            <span className="material-symbols-outlined">notifications_active</span>
          </button>
          <button className="p-2 text-[#bbc9cf] hover:bg-[#353437]/50 transition-all rounded-lg">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20 overflow-hidden">
            <img alt="Operator Profile" className="w-full h-full object-cover" data-alt="Cybersecurity operator profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlGqtNebIEuSQD4LfUhwobn_BJfP6jrmUN6uhY9m0S1Qqsyc-MvOLoyLgqEafMKmIp9p6F0Alb_9D6a9AYZtoEgs3p-yrCuYJkmysQjD8HmXbMilW4DAW03K44N7F4b8DOxnl82Ce5zG1X_L-p_rtZxHfL-cBs616AAKmLq7fHwG_gsGHgwDNpTDJrFdD2fDboQt9SYm6SdZZ8qeNcfMhbq_sgmTmEpqdcAEvY831RLt1wBCtDNVboNttQ7llE_2Aw4M_3vMSHn2R1"/>
          </div>
        </div>
      </nav>

      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#1c1b1d] bg-gradient-to-b from-[#1c1b1d] to-[#131315] flex-col py-8 px-4 space-y-2 hidden md:flex">
        <div className="mb-6 px-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#ffd59c]"></div>
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
        <div className="pt-6 border-t border-outline-variant/10 space-y-1">
          <button onClick={() => onNavigate('workspace')} className="w-full py-3 px-4 bg-primary-container text-on-primary font-bold text-[10px] tracking-[0.2em] rounded-md hover:shadow-[0_0_15px_#00d1ff] transition-all mb-4">NEW SCAN</button>
          <div className="flex items-center gap-3 px-4 py-2 text-[#bbc9cf]/60 hover:text-[#00D1FF] cursor-pointer transition-colors group">
            <span className="material-symbols-outlined text-sm">contact_support</span>
            <span className="font-['Inter'] text-[10px] uppercase tracking-widest">Support</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-[#bbc9cf]/60 hover:text-[#00D1FF] cursor-pointer transition-colors group">
            <span className="material-symbols-outlined text-sm">integration_instructions</span>
            <span className="font-['Inter'] text-[10px] uppercase tracking-widest">API Docs</span>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 mt-16 p-8 min-h-screen">
        {/* Large Status Banner */}
        <section className="mb-12">
          <div className={`relative overflow-hidden rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-500
            ${status === 'DANGER' ? 'bg-error-container/20 border-error/20 border' : ''}
            ${status === 'QUARANTINED' ? 'bg-primary-container/20 border-primary/20 border' : ''}
            ${status === 'SAFE' ? 'bg-tertiary-container/20 border-tertiary/20 border' : ''}
          `}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className={`material-symbols-outlined text-9xl ${status === 'DANGER' ? 'text-error' : status === 'QUARANTINED' ? 'text-primary' : 'text-tertiary'}`}>
                {status === 'DANGER' ? 'warning' : status === 'QUARANTINED' ? 'shield' : 'check_circle'}
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className={`material-symbols-outlined ${status === 'DANGER' ? 'text-error' : status === 'QUARANTINED' ? 'text-primary' : 'text-tertiary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {status === 'DANGER' ? 'gpp_maybe' : status === 'QUARANTINED' ? 'gpp_good' : 'task_alt'}
                </span>
                <span className={`font-label text-xs uppercase tracking-[0.3em] font-bold ${status === 'DANGER' ? 'text-error' : status === 'QUARANTINED' ? 'text-primary' : 'text-tertiary'}`}>
                  {status === 'DANGER' ? 'Security Incident Detected' : status === 'QUARANTINED' ? 'Threat Contained' : 'False Positive Logged'}
                </span>
              </div>
              <h1 className={`font-headline text-5xl font-black tracking-tighter ${status === 'DANGER' ? 'text-on-error-container' : 'text-on-surface'}`}>
                {status === 'DANGER' ? 'THREAT DETECTED' : status === 'QUARANTINED' ? 'SOURCE QUARANTINED' : 'MARKED AS SAFE'}
              </h1>
              <p className="mt-2 text-on-surface-variant max-w-lg font-body text-sm leading-relaxed">
                {status === 'DANGER' 
                  ? 'Automated heuristics identified critical risk factors within the submitted mail packet. Immediate containment recommended.' 
                  : status === 'QUARANTINED' 
                  ? 'This asset has been isolated from the network. Remediation scripts have been executed successfully.' 
                  : 'This alert has been dismissed and recorded to improve future model accuracy.'}
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

        {/* Insights Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Confidence Score Gauge */}
          <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center border border-outline-variant/10">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mb-6">Risk Confidence</span>
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Gauge Background SVG */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="4"></circle>
                <circle className="text-error shadow-[0_0_15px_#ffb4ab]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="33.17" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="text-center">
                <span className="font-headline text-5xl font-bold text-on-surface tracking-tighter">94<span className="text-2xl opacity-50">%</span></span>
                <p className="text-[10px] font-label uppercase tracking-widest text-error font-bold mt-1">Critical Risk</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
              <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/5">
                <p className="text-[10px] text-on-surface-variant/50 uppercase mb-1">Vector</p>
                <p className="text-xs font-bold text-primary">Email/Link</p>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/5">
                <p className="text-[10px] text-on-surface-variant/50 uppercase mb-1">Latency</p>
                <p className="text-xs font-bold text-primary">124ms</p>
              </div>
            </div>
          </div>

          {/* Key Insights Panel */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">Key Insights</h2>
              <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-error/20">3 Critical Flags</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-high/50 hover:bg-surface-container-high transition-colors group">
                <div className="mt-1 p-2 bg-error/10 rounded border border-error/20 text-error">
                  <span className="material-symbols-outlined text-sm">campaign</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">Urgency Language Detected</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">System identified high-pressure keywords: <span className="text-error font-mono">"immediately"</span>, <span className="text-error font-mono">"unauthorized access"</span>, <span className="text-error font-mono">"account locked"</span>.</p>
                </div>
                <span className="ml-auto text-[10px] font-mono text-error font-bold">HIGH</span>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-high/50 hover:bg-surface-container-high transition-colors">
                <div className="mt-1 p-2 bg-tertiary/10 rounded border border-tertiary/20 text-tertiary">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">Suspicious Sender Domain</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Origin address <span className="text-tertiary font-mono">"security@bit-vault-service.net"</span> mimics official brand assets but fails DKIM validation.</p>
                </div>
                <span className="ml-auto text-[10px] font-mono text-tertiary font-bold">MED</span>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-high/50 hover:bg-surface-container-high transition-colors">
                <div className="mt-1 p-2 bg-error/10 rounded border border-error/20 text-error">
                  <span className="material-symbols-outlined text-sm">link</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">Malicious Link Pattern</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Embedded URL contains character obfuscation and redirects to a known data-harvesting node in <span className="text-error">unverified region</span>.</p>
                </div>
                <span className="ml-auto text-[10px] font-mono text-error font-bold">HIGH</span>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Details Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Content Breakdown View */}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-lowest flex items-center justify-between">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Source Data Transcription</span>
              <div className="flex gap-2">
                <button onClick={handleCopy} title="Copy to clipboard" className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                <button onClick={() => alert('Downloading artifact...')} title="Download raw artifact" className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">download</span></button>
              </div>
            </div>
            <div className="p-8 font-mono text-xs leading-relaxed text-on-surface-variant/80 overflow-y-auto">
              <p className="mb-4">From: <span className="text-on-surface">Official Support &lt;security@bit-vault-service.net&gt;</span></p>
              <p className="mb-4">Subject: <span className="bg-error/20 text-error-container px-1 font-bold">URGENT: Action Required on Your Account</span></p>
              <div className="space-y-4">
                <p>Dear Valued Client,</p>
                <p>We have detected an <span className="bg-error/20 text-error-container px-1 font-bold">unauthorized login attempt</span> to your account from an unrecognized IP address (45.22.11.08). To protect your assets, we have <span className="bg-error/20 text-error-container px-1 font-bold">temporarily restricted access</span> to all outbound transactions.</p>
                <p>To restore full account functionality, you must <span className="bg-tertiary/20 text-on-tertiary-container px-1">verify your identity immediately</span> by following the secure link below. Failure to do so within 24 hours will result in permanent account suspension.</p>
                <div className="p-4 bg-surface-container-high rounded border border-outline-variant/20 my-6">
                  <span className="text-primary hover:underline cursor-pointer">https://auth.bit-vault-portal.com/identity/verify?session=99283-xca</span>
                </div>
                <p>Thank you for your cooperation in keeping your assets secure.</p>
                <p>Sincerely,<br/>Global Security Team</p>
              </div>
            </div>
          </div>

          {/* Explainability Section */}
          <div className="glass-panel rounded-xl p-8 border border-outline-variant/10 flex flex-col">
            <div className="mb-8">
              <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface mb-2">Explainability Engine</h2>
              <p className="text-xs text-on-surface-variant">Neural reasoning behind the "THREAT DETECTED" classification.</p>
            </div>
            <div className="flex-1 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary text-sm font-bold">01</span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface">Psychological Profiling</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  The communication employs "Artificial Urgency" and "Negative Consequence" frames. These linguistic patterns are statistically correlated with 98.2% of credential harvesting attacks.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary text-sm font-bold">02</span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface">Domain Reputation</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  The domain <span className="font-mono text-tertiary">bit-vault-service.net</span> was registered exactly 14 hours ago via a privacy-protected registrar. It currently has zero legitimate traffic history or enterprise association.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary text-sm font-bold">03</span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface">Structural Entropy</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Analysis of the HTML structure reveals hidden 0px divs used for "pixel tracking" and font-obfuscation techniques commonly used to bypass legacy signature-based filters.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-on-primary">AI</div>
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-on-secondary">ML</div>
                <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-[10px] font-bold text-on-surface">+1</div>
              </div>
              <span className="text-[10px] text-on-surface-variant font-mono">MODEL_CONFIDENCE: HIGH_STABILITY</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Shell */}
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