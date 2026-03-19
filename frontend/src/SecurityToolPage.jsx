import React, { useMemo, useState } from 'react';
import { addVaultItem, analyzeContent, clearVaultItems, getSystemHealth, getVaultItems } from './lib/apiClient';

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
  const [mailInput, setMailInput] = useState('');
  const [strictMode, setStrictMode] = useState(true);
  const [mailResult, setMailResult] = useState(null);

  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState(null);

  const [vaultItems, setVaultItems] = useState([]);
  const [vaultName, setVaultName] = useState('');
  const [vaultTag, setVaultTag] = useState('Evidence');
  const [toolError, setToolError] = useState('');

  const [systemSnapshot, setSystemSnapshot] = useState({
    cpu: 38,
    queue: 24,
    latency: 74,
    healthyNodes: 18
  });

  const statusChipClass = useMemo(() => {
    if (!mailResult) return 'text-on-surface-variant border-outline-variant/30';
    if (mailResult.status === 'DANGER') return 'text-error border-error/30 bg-error/10';
    if (mailResult.status === 'QUARANTINED') return 'text-primary border-primary/30 bg-primary/10';
    return 'text-tertiary border-tertiary/30 bg-tertiary/10';
  }, [mailResult]);

  const runMailGuard = async () => {
    setToolError('');
    const data = await analyzeContent({ inputType: 'email', input: mailInput });
    const result = data.result;
    if (strictMode && result.score < 35) {
      setMailResult({ ...result, score: 35, riskLabel: 'Suspicious (Strict Mode)', status: 'QUARANTINED' });
      return;
    }
    setMailResult(result);
  };

  const runLinkAnalyzer = async () => {
    setToolError('');
    const data = await analyzeContent({ inputType: 'url', input: urlInput });
    setUrlResult(data.result);
  };

  const addToVault = async () => {
    const name = vaultName.trim();
    if (!name) return;
    setToolError('');
    const data = await addVaultItem({ name, tag: vaultTag });
    setVaultItems((prev) => [data.entry, ...prev]);
    setVaultName('');
  };

  const refreshSystemHealth = async () => {
    setToolError('');
    const data = await getSystemHealth();
    setSystemSnapshot(data);
  };

  const loadVaultItems = async () => {
    setToolError('');
    const data = await getVaultItems();
    setVaultItems(Array.isArray(data.items) ? data.items : []);
  };

  const purgeVault = async () => {
    setToolError('');
    await clearVaultItems();
    setVaultItems([]);
  };

  const renderFeaturePanel = () => {
    if (pageKey === 'mail-guard') {
      return (
        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8 mt-8">
          <h2 className="text-lg font-bold tracking-tight mb-4">Mail Guard Scanner</h2>
          <textarea
            value={mailInput}
            onChange={(e) => setMailInput(e.target.value)}
            placeholder="Paste suspicious email content..."
            className="w-full min-h-40 bg-surface-container-lowest/40 border border-outline-variant/30 rounded-lg p-4 text-sm focus:outline-none focus:border-primary/60"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={() => runMailGuard().catch(() => setToolError('Mail Guard request failed. Start backend and retry.'))} className="px-4 py-2 bg-primary-container text-on-primary text-xs uppercase tracking-widest font-bold rounded">Run Mail Guard</button>
            <button onClick={() => setStrictMode((prev) => !prev)} className="px-4 py-2 border border-outline-variant/30 rounded text-xs uppercase tracking-widest">
              Strict Mode: {strictMode ? 'On' : 'Off'}
            </button>
            <span className={`px-3 py-1 border rounded text-[10px] uppercase tracking-widest ${statusChipClass}`}>
              {mailResult ? `${mailResult.status} - ${mailResult.score}%` : 'Awaiting Scan'}
            </span>
          </div>
        </section>
      );
    }

    if (pageKey === 'link-analyzer') {
      return (
        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8 mt-8">
          <h2 className="text-lg font-bold tracking-tight mb-4">URL Detonation Console</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://suspicious-domain.example/login"
              className="flex-1 bg-surface-container-lowest/40 border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
            />
            <button onClick={() => runLinkAnalyzer().catch(() => setToolError('Link Analyzer request failed. Start backend and retry.'))} className="px-4 py-3 bg-primary-container text-on-primary text-xs uppercase tracking-widest font-bold rounded">
              Analyze URL
            </button>
          </div>
          {urlResult && (
            <div className="mt-4 text-sm text-on-surface-variant">
              <p>Risk Score: <span className="text-on-surface font-bold">{urlResult.score}%</span></p>
              <p>Status: <span className="text-on-surface font-bold">{urlResult.status}</span></p>
              <p>Detected Signals: <span className="text-on-surface font-bold">{urlResult.flags.length}</span></p>
            </div>
          )}
        </section>
      );
    }

    if (pageKey === 'vault') {
      return (
        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8 mt-8">
          <h2 className="text-lg font-bold tracking-tight mb-4">Evidence Vault Manager</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
              placeholder="Artifact name (e.g. invoice-2026.eml)"
              className="md:col-span-2 bg-surface-container-lowest/40 border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
            />
            <select
              value={vaultTag}
              onChange={(e) => setVaultTag(e.target.value)}
              className="bg-surface-container-lowest/40 border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
            >
              <option>Evidence</option>
              <option>Attachment</option>
              <option>Indicator</option>
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => addToVault().catch(() => setToolError('Unable to store artifact right now.'))} className="px-4 py-2 bg-primary-container text-on-primary text-xs uppercase tracking-widest font-bold rounded">Store Artifact</button>
            <button onClick={() => loadVaultItems().catch(() => setToolError('Unable to refresh vault items.'))} className="px-4 py-2 border border-outline-variant/30 text-xs uppercase tracking-widest font-bold rounded">Refresh Vault</button>
            <button onClick={() => purgeVault().catch(() => setToolError('Unable to purge vault right now.'))} className="px-4 py-2 border border-error/30 text-error text-xs uppercase tracking-widest font-bold rounded">Purge Vault</button>
          </div>

          <div className="mt-5 space-y-2 max-h-56 overflow-y-auto">
            {vaultItems.length === 0 && <p className="text-sm text-on-surface-variant">No artifacts stored yet.</p>}
            {vaultItems.map((item) => (
              <div key={item.id} className="border border-outline-variant/20 rounded-lg p-3 text-sm flex justify-between gap-3">
                <div>
                  <p className="font-bold text-on-surface">{item.name}</p>
                  <p className="text-on-surface-variant text-xs">{item.tag} - {item.storedAt}</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-primary">SEALED</span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (pageKey === 'system-health') {
      return (
        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8 mt-8">
          <h2 className="text-lg font-bold tracking-tight mb-4">Live Health Telemetry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface-container-lowest/40 border border-outline-variant/20">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">CPU Utilization</p>
              <p className="text-3xl font-black text-primary mt-1">{systemSnapshot.cpu}%</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-lowest/40 border border-outline-variant/20">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Queue Depth</p>
              <p className="text-3xl font-black text-primary mt-1">{systemSnapshot.queue}</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-lowest/40 border border-outline-variant/20">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Latency</p>
              <p className="text-3xl font-black text-primary mt-1">{systemSnapshot.latency}ms</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-lowest/40 border border-outline-variant/20">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Healthy Nodes</p>
              <p className="text-3xl font-black text-primary mt-1">{systemSnapshot.healthyNodes}</p>
            </div>
          </div>
          <button onClick={() => refreshSystemHealth().catch(() => setToolError('Unable to fetch system telemetry.'))} className="mt-4 px-4 py-2 bg-primary-container text-on-primary text-xs uppercase tracking-widest font-bold rounded">
            Refresh Health Snapshot
          </button>
        </section>
      );
    }

    return null;
  };

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
            <button onClick={() => onNavigate('history')} className="px-3 py-1 rounded hover:text-accent transition-colors">History</button>
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

        {toolError && (
          <div className="mt-4 rounded border border-error/30 bg-error/10 text-error px-4 py-3 text-sm">
            {toolError}
          </div>
        )}

        {renderFeaturePanel()}
      </main>
    </div>
  );
}
