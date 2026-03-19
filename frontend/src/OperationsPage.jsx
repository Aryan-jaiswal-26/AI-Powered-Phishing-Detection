import React from 'react';

const PAGE_DATA = {
  'threat-intel': {
    badge: 'THREAT INTELLIGENCE',
    title: 'Threat Intelligence Center',
    subtitle: 'Live signals, adversary patterns, and campaign-level context from your current detection stream.',
    metrics: [
      { label: 'Active Campaigns', value: '18' },
      { label: 'High Risk IOCs', value: '426' },
      { label: 'Feed Freshness', value: '2m ago' }
    ],
    highlights: [
      'Credential harvesting lures increased by 37% over the last 24h in financial-themed campaigns.',
      'Two new sender clusters are using lookalike domains with short-lived MX records.',
      'Link redirection chains now include delayed JavaScript payload triggers to evade static scanners.'
    ]
  },
  policy: {
    badge: 'POLICY CONTROL',
    title: 'Policy Enforcement',
    subtitle: 'Manage detection thresholds, quarantine actions, and escalation rules for organization-wide protection.',
    metrics: [
      { label: 'Policies Enabled', value: '12' },
      { label: 'Auto Quarantine', value: 'ON' },
      { label: 'Escalation SLA', value: '15 min' }
    ],
    highlights: [
      'Critical-risk messages are automatically isolated and tagged for SOC analyst review.',
      'Trusted domain allowlists are versioned and validated against spoofing heuristics.',
      'Role-based approval flow is required for policy changes affecting outbound comms.'
    ]
  },
  logs: {
    badge: 'SECURITY LOGS',
    title: 'Operational Logs',
    subtitle: 'Audit events, model decisions, and workflow actions with timestamped traceability.',
    metrics: [
      { label: 'Events Ingested', value: '92,184' },
      { label: 'Alerts Today', value: '214' },
      { label: 'Pipeline Health', value: 'Stable' }
    ],
    highlights: [
      'No ingestion drops detected in the past 7 days across message and URL pipelines.',
      'Model version v4.2.0 produced a 3.4% reduction in false positives this week.',
      'All analyst actions are immutably recorded with actor ID and workflow context.'
    ]
  }
};

export default function OperationsPage({ onNavigate, pageKey = 'threat-intel' }) {
  const page = PAGE_DATA[pageKey] || PAGE_DATA['threat-intel'];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-accent font-black tracking-wider text-lg">PHISH_SHIELD</button>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest">
            <button onClick={() => onNavigate('home')} className="px-3 py-1 rounded border border-transparent hover:border-outline-variant/40 hover:text-accent transition-colors">Dashboard</button>
            <button onClick={() => onNavigate('threat-intel')} className="px-3 py-1 rounded border border-transparent hover:border-outline-variant/40 hover:text-accent transition-colors">Threat Intelligence</button>
            <button onClick={() => onNavigate('policy')} className="px-3 py-1 rounded border border-transparent hover:border-outline-variant/40 hover:text-accent transition-colors">Policy</button>
            <button onClick={() => onNavigate('logs')} className="px-3 py-1 rounded border border-transparent hover:border-outline-variant/40 hover:text-accent transition-colors">Logs</button>
            <button onClick={() => onNavigate('history')} className="px-3 py-1 rounded border border-transparent hover:border-outline-variant/40 hover:text-accent transition-colors">History</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-accent font-bold mb-2">{page.badge}</p>
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight mb-3">{page.title}</h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-3xl">{page.subtitle}</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {page.metrics.map((metric) => (
            <article key={metric.label} className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-2">{metric.label}</p>
              <p className="text-3xl font-black tracking-tight text-accent">{metric.value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8">
          <h2 className="text-lg font-bold tracking-tight mb-5">Latest Highlights</h2>
          <div className="space-y-4">
            {page.highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-on-surface-variant leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('workspace')} className="px-5 py-2 bg-primary-container text-on-primary rounded text-xs uppercase tracking-widest font-bold hover:shadow-[0_0_14px_rgba(0,209,255,0.35)] transition-shadow">
            Open Detection Workspace
          </button>
          <button onClick={() => onNavigate('analysis')} className="px-5 py-2 border border-outline-variant/30 rounded text-xs uppercase tracking-widest font-bold hover:border-accent hover:text-accent transition-colors">
            View Analysis Results
          </button>
        </div>
      </main>
    </div>
  );
}
