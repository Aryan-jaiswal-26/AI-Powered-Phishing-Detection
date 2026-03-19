import React from 'react';

const PAGE_CONTENT = {
  privacy: {
    badge: 'PRIVACY PROTOCOL',
    title: 'Privacy Protocol',
    subtitle: 'How PHISH_SHIELD handles telemetry, user data, and security events.',
    sections: [
      {
        heading: 'Data Collection',
        points: [
          'We collect scan payload metadata, model confidence metrics, and operational logs to improve detection quality.',
          'Uploaded samples are retained only for a limited analysis window unless explicitly archived by administrators.',
          'Personally identifiable information is minimized and redacted in diagnostic snapshots where possible.'
        ]
      },
      {
        heading: 'Data Protection',
        points: [
          'All data is encrypted in transit using TLS and encrypted at rest with managed key rotation.',
          'Role-based access controls restrict analyst visibility to approved workspaces and incidents.',
          'Access events are audited continuously and anomalies trigger incident response workflows.'
        ]
      }
    ]
  },
  terms: {
    badge: 'TERMS OF ENGAGEMENT',
    title: 'Terms of Engagement',
    subtitle: 'Operational terms for use of PHISH_SHIELD services and interfaces.',
    sections: [
      {
        heading: 'Acceptable Use',
        points: [
          'Users must only scan assets they are authorized to inspect and remediate.',
          'Automated abuse, reverse engineering, and disruption attempts are prohibited.',
          'Security findings should be handled according to internal compliance policy and legal requirements.'
        ]
      },
      {
        heading: 'Service Scope',
        points: [
          'Classification outcomes are decision-support signals and should be reviewed with human oversight.',
          'Service levels may vary during maintenance windows or emergency hardening updates.',
          'Organizations remain responsible for downstream remediation actions and account controls.'
        ]
      }
    ]
  },
  trust: {
    badge: 'TRUST CENTER',
    title: 'Trust Center',
    subtitle: 'Security architecture and operational assurances for enterprise teams.',
    sections: [
      {
        heading: 'Security Posture',
        points: [
          'Continuous vulnerability scanning and patch management on production infrastructure.',
          'Threat intelligence ingestion and model updates are staged and verified before rollout.',
          'Separation of duties is enforced for deployment, access management, and incident operations.'
        ]
      },
      {
        heading: 'Governance',
        points: [
          'Change reviews are logged with approval trails and rollback plans.',
          'Critical incidents follow documented response playbooks with postmortem review.',
          'Enterprise customers can request security documentation through support channels.'
        ]
      }
    ]
  },
  status: {
    badge: 'SYSTEM STATUS',
    title: 'Status',
    subtitle: 'Live operational health across key PHISH_SHIELD services.',
    sections: [
      {
        heading: 'Core Services',
        points: [
          'Inference API: Operational',
          'Threat Intelligence Feed: Operational',
          'Workspace Dashboard: Operational'
        ]
      },
      {
        heading: 'Recent Events',
        points: [
          'No active incidents in the last 24 hours.',
          'Scheduled model refresh completed successfully.',
          'Next planned maintenance window: Sunday 02:00 UTC.'
        ]
      }
    ]
  }
};

export default function InfoPage({ onNavigate, pageKey = 'privacy' }) {
  const page = PAGE_CONTENT[pageKey] || PAGE_CONTENT.privacy;

  return (
    <div className="min-h-screen bg-background text-on-surface px-6 md:px-10 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-accent font-bold mb-2">{page.badge}</p>
            <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight">{page.title}</h1>
            <p className="text-sm md:text-base text-on-surface-variant mt-3 max-w-2xl">{page.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 border border-outline-variant/30 rounded hover:border-accent hover:text-accent transition-colors text-xs uppercase tracking-widest font-bold"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2 border border-accent/40 text-accent rounded hover:bg-accent hover:text-[#080c13] transition-colors text-xs uppercase tracking-widest font-bold"
            >
              Back To Dashboard
            </button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {page.sections.map((section) => (
            <section key={section.heading} className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6">
              <h2 className="text-lg font-bold tracking-tight mb-4">{section.heading}</h2>
              <ul className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
                {section.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="mt-10 pt-6 border-t border-outline-variant/20 flex flex-wrap gap-4 text-[11px] uppercase tracking-widest text-on-surface-variant">
          <button onClick={() => onNavigate('privacy')} className="hover:text-accent transition-colors">Privacy Protocol</button>
          <button onClick={() => onNavigate('terms')} className="hover:text-accent transition-colors">Terms of Engagement</button>
          <button onClick={() => onNavigate('trust')} className="hover:text-accent transition-colors">Trust Center</button>
          <button onClick={() => onNavigate('status')} className="hover:text-accent transition-colors">Status</button>
        </footer>
      </div>
    </div>
  );
}
