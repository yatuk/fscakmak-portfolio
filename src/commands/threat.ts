import type { CommandHandler } from './index';
import { SEV_CLS } from '@config/index';

interface ThreatActor {
  group:    string;
  alias:    string;
  origin:   string;
  targets:  string;
  campaign: string;
  ttps:     string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  region:   string;
}

/* Static CTI brief — actors relevant to banking/finance/OT sector.
   Anchored to real, publicly documented threat groups. */
const ACTORS: ThreatActor[] = [
  {
    group:    'APT29',
    alias:    'Cozy Bear / Midnight Blizzard',
    origin:   'Russia (SVR)',
    targets:  'Finance · Government · Cloud',
    campaign: 'OAuth token theft via spearphishing → persistent access to M365',
    ttps:     ['T1566', 'T1528', 'T1550.001'],
    severity: 'CRITICAL',
    region:   'EU / US',
  },
  {
    group:    'LockBit 3.0',
    alias:    'RaaS',
    origin:   'Russia-linked',
    targets:  'Finance · Healthcare · SMB',
    campaign: 'RDP brute-force → hands-on-keyboard → ransomware deployment',
    ttps:     ['T1110', 'T1486', 'T1490'],
    severity: 'CRITICAL',
    region:   'Global',
  },
  {
    group:    'APT41',
    alias:    'Double Dragon',
    origin:   'China (MSS)',
    targets:  'Telecoms · Tech · OT/ICS',
    campaign: 'Supply chain compromise via software update mechanism',
    ttps:     ['T1195.002', 'T1059', 'T1027'],
    severity: 'HIGH',
    region:   'APAC / EU',
  },
  {
    group:    'Sandworm',
    alias:    'Voodoo Bear',
    origin:   'Russia (GRU)',
    targets:  'Energy · OT Infrastructure',
    campaign: 'ICS/SCADA targeting — destructive wiper deployment',
    ttps:     ['T0828', 'T0816', 'T1561'],
    severity: 'HIGH',
    region:   'EU (especially TR-adjacent)',
  },
];

function actorCard(a: ThreatActor): string {
  const ttpBadges = a.ttps
    .map((t) => `<span class="threat-ttp-badge">${t}</span>`)
    .join('');
  return `<article class="threat-card">
    <div class="threat-head">
      <span class="threat-group">${a.group}</span>
      <span class="threat-alias">${a.alias}</span>
      <span class="threat-sev ${SEV_CLS[a.severity]}">${a.severity}</span>
    </div>
    <div class="threat-meta">
      <span class="threat-origin">${a.origin}</span>
      <span class="threat-dot">·</span>
      <span class="threat-region">${a.region}</span>
      <span class="threat-dot">·</span>
      <span class="threat-targets">${a.targets}</span>
    </div>
    <div class="threat-campaign">${a.campaign}</div>
    <div class="threat-ttps">${ttpBadges}</div>
  </article>`;
}

export const threat: CommandHandler = () => `
<div class="cmd-block">
  <div class="cmd-title">🌐 Threat Intelligence Brief</div>
  <div class="cmd-help-hint" style="margin-bottom:10px">Active threat actors relevant to banking / financial sector — Q2 2026.</div>
  <div class="threat-grid">${ACTORS.map(actorCard).join('')}</div>
  <div class="cmd-help-hint">Sources: CISA · MITRE ATT&CK · Recorded Future · ENISA ETL 2025.</div>
</div>`;
