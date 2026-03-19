const KEYWORD_WEIGHTS = [
  { term: 'urgent', weight: 10 },
  { term: 'immediately', weight: 10 },
  { term: 'verify', weight: 8 },
  { term: 'suspend', weight: 12 },
  { term: 'unauthorized', weight: 12 },
  { term: 'password', weight: 10 },
  { term: 'confirm', weight: 8 },
  { term: 'bank', weight: 7 },
  { term: 'invoice', weight: 6 },
  { term: 'click here', weight: 10 }
];

function detectUrls(text) {
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi) || [];
  return Array.from(new Set(urlMatches));
}

function analyzeUrlRisk(url) {
  let risk = 0;
  let detail = [];

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (/\d+\.\d+\.\d+\.\d+/.test(host)) {
      risk += 25;
      detail.push('IP-based host used');
    }

    if (host.includes('xn--')) {
      risk += 20;
      detail.push('Punycode domain detected');
    }

    if (host.split('.').length > 3) {
      risk += 12;
      detail.push('Deep subdomain chain');
    }

    if (/(?:login|secure|verify|account|auth|update)/.test(host)) {
      risk += 12;
      detail.push('Credential lure keywords in host');
    }

    if (/(?:\.zip|\.click|\.top|\.xyz)$/.test(host)) {
      risk += 18;
      detail.push('High-risk TLD');
    }
  } catch {
    risk += 10;
    detail.push('Malformed URL structure');
  }

  return { risk, detail };
}

function severityFromWeight(weight) {
  if (weight >= 25) return 'HIGH';
  if (weight >= 12) return 'MED';
  return 'LOW';
}

function statusFromScore(score) {
  if (score >= 70) return 'DANGER';
  if (score >= 40) return 'QUARANTINED';
  return 'SAFE';
}

export function analyzePhishingContent({ input = '', inputType = 'email', fileName = '' }) {
  const normalized = (input || '').toLowerCase();
  const flags = [];
  let total = 0;

  KEYWORD_WEIGHTS.forEach(({ term, weight }) => {
    if (normalized.includes(term)) {
      flags.push({
        title: `Suspicious keyword: "${term}"`,
        detail: `Detected social-engineering term likely used for urgency or credential harvesting.`,
        severity: severityFromWeight(weight),
        icon: 'campaign',
        weight
      });
      total += weight;
    }
  });

  const urls = detectUrls(input);
  urls.forEach((url) => {
    const { risk, detail } = analyzeUrlRisk(url);
    if (risk > 0) {
      flags.push({
        title: 'Suspicious link structure',
        detail: `${url} - ${detail.join(', ') || 'Potentially deceptive URL behavior'}`,
        severity: severityFromWeight(risk),
        icon: 'link',
        weight: risk
      });
      total += risk;
    }
  });

  const senderMatch = input.match(/from:\s*([^\n]+)/i);
  if (senderMatch && /(?:support|security|admin)/i.test(senderMatch[1]) && /(?:gmail|outlook|yahoo)\./i.test(senderMatch[1])) {
    flags.push({
      title: 'Sender identity mismatch',
      detail: 'High-authority sender naming combined with generic mailbox provider.',
      severity: 'MED',
      icon: 'alternate_email',
      weight: 16
    });
    total += 16;
  }

  if (inputType === 'file' && fileName) {
    const lowered = fileName.toLowerCase();
    if (/(?:\.exe|\.js|\.bat|\.scr|\.vbs)$/.test(lowered)) {
      flags.push({
        title: 'Executable attachment uploaded',
        detail: `File ${fileName} is executable content and requires strict sandboxing.`,
        severity: 'HIGH',
        icon: 'inventory_2',
        weight: 22
      });
      total += 22;
    }
  }

  const score = Math.min(99, Math.max(5, total));
  const status = statusFromScore(score);
  const riskLabel = score >= 70 ? 'Critical Risk' : score >= 40 ? 'Suspicious' : 'Low Risk';
  const latencyMs = Math.max(48, Math.min(600, 70 + Math.floor((input.length || 10) / 6)));

  const fallbackSafe = {
    title: 'No strong phishing indicators detected',
    detail: 'The submitted content does not contain high-confidence phishing patterns in current heuristics.',
    severity: 'LOW',
    icon: 'check_circle',
    weight: 4
  };

  const topFlags = (flags.length ? flags : [fallbackSafe])
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return {
    inputType,
    fileName,
    sourceText: input || 'No input provided.',
    score,
    riskLabel,
    status,
    vector: inputType === 'url' ? 'URL/Link' : inputType === 'file' ? 'File Artifact' : 'Email Text',
    latencyMs,
    urls,
    flags: topFlags,
    explainability: [
      {
        title: 'Linguistic Pressure Analysis',
        detail: `Detected ${flags.filter((f) => f.icon === 'campaign').length} suspicious urgency/social-engineering token(s).`
      },
      {
        title: 'Link And Origin Validation',
        detail: urls.length ? `Parsed ${urls.length} URL(s) and scored host-based deception indicators.` : 'No explicit URL found in this submission.'
      },
      {
        title: 'Structural Risk Profile',
        detail: `Aggregate risk score computed as ${score}/100 from weighted heuristic signals.`
      }
    ]
  };
}
