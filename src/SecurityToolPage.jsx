import React from 'react';

const TOOL_CONTENT = {
  'mail-guard': {
    icon: 'enhanced_encryption',
    title: 'Mail Guard',
    subtitle: 'Advanced inbound email defense with sender validation and impersonation controls.',
    stats: [
      { label: 'Protected Mailboxes', value: '1,248' },
      { label: 'Blocked Attempts', value: '327' },
      { label: 'False Positive Rate', value: '0.8%' }
    ],
    actions: [
      'SPF, DKIM, and DMARC validation is enforced before trust scoring.',
      'Executive impersonation heuristics trigger automatic analyst escalation.',
      'Attachment sandboxing is enabled for unknown source categories.'
    ]
  },
  'link-analyzer': {
    icon: 'link_off',
    title: 'Link Analyzer',
    subtitle: 'Runtime URL detonation, redirect chain tracing, and domain risk scoring.',
    stats: [
      { label: 'URLs Scanned Today', value: '8,902' },
      { label: 'Malicious Redirects', value: '141' },
      { label: 'Average Scan Time', value: '118ms' }
    ],
    actions: [
      'Short-link expansion is performed before threat classification.',
      'JavaScript redirects and hidden iframe jumps are captured in trace logs.',
      'Known sinkhole and phishing infrastructure lists are refreshed continuously.'
    ]
  },
  vault: {
    icon: 'inventory_2',
    title: 'Vault',
    subtitle: 'Secure evidence storage for suspicious artifacts and investigation metadata.',
    stats: [
      { label: 'Artifacts Stored', value: '4,312' },
      { label: 'Retention Policy', value: '90 Days' },
      { label: 'Integrity Checks', value: 'Enabled' }
    ],
    actions: [
      'Artifacts are hashed and signed when moved into secure storage.',
      'Access to sealed evidence is role-gated and fully audited.',
      'Retention and purge workflows are managed per policy profile.'
    ]
  },
  'system-health': {
    icon: 'terminal',
    title: 'System Health',
    subtitle: 'Telemetry overview for detection services, queues, and model pipelines.',
    stats: [
      { label: 'Inference Uptime', value: '99.98%' },
      { label: 'Queue Backlog', value: 'Low' },
      { label: 'Model Version', value: 'v4.2.0' }
    ],
    actions: [
      'Node heartbeat and queue depth are monitored in real time.',
      'Latency anomalies trigger an automatic diagnostics snapshot.',
      'Pipeline degradations are routed to on-call responders immediately.'
    ]
  }
};

export default function SecurityToolPage({ onNavigate, pageKey = 'mail-guard' }) {
  const content = TOOL_CONTENT[pageKey] || TOOL_CONTENT['mail-guard'];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="h-16 border-b border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto h-full px-6 md:px-10 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-accent font-black text-lg tracking-wider">PHISH_SHIELD</button>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest">
            <button onClick={() => onNavigate('workspace')} className="px-3 py-1 rounded hover:text-accent transition-colors">Quick Scan</button>
            <button onClick={() => onNavigate('mail-guard')} className="px-3 py-1 rounded hover:text-accent transition-colors">Mail Guard</button>
            <button onClick={() => onNavigate('link-analyzer')} className="px-3 py-1 rounded hover:text-accent transition-colors">Link Analyzer</button>
            <button onClick={() => onNavigate('vault')} className="px-3 py-1 rounded hover:text-accent transition-colors">Vault</button>
            <button onClick={() => onNavigate('system-health')} className="px-3 py-1 rounded hover:text-accent transition-colors">System Health</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 mb-4">
            <span className="material-symbols-outlined text-sm text-primary">{content.icon}</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Security Module</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight mb-3">{content.title}</h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-3xl">{content.subtitle}</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {content.stats.map((item) => (
            <article key={item.label} className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{item.label}</p>
              <p className="text-3xl font-black text-accent tracking-tight">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8">
          <h2 className="text-lg font-bold tracking-tight mb-4">Operational Controls</h2>
          <div className="space-y-4">
            {content.actions.map((line) => (
              <div key={line} className="flex items-start gap-3 text-sm text-on-surface-variant leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
