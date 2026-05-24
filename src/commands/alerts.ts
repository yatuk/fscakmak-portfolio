import type { CommandHandler } from './index';
import { SEV_CLS, STATUS_CLS } from '@config/index';

type Sev    = 'CRITICAL' | 'HIGH' | 'MEDIUM';
type Status = 'OPEN' | 'IN-REVIEW' | 'CLOSED';

interface Alert {
  id:     string;
  sev:    Sev;
  status: Status;
  title:  string;
  src:    string;
  ttp:    string;
  age:    string;
}

const QUEUE: Alert[] = [
  { id: '#2241', sev: 'CRITICAL', status: 'OPEN',      title: 'Ransomware precursor — rapid file renames',  src: '10.0.5.200',     ttp: 'T1486',     age: '2m ago'  },
  { id: '#2240', sev: 'CRITICAL', status: 'IN-REVIEW', title: 'C2 beacon over TLS/443 — external IP',       src: '91.92.251.103',  ttp: 'TA0011',    age: '7m ago'  },
  { id: '#2239', sev: 'HIGH',     status: 'IN-REVIEW', title: 'LSASS dump attempt — EDR isolated host',     src: '172.16.5.30',    ttp: 'T1003',     age: '11m ago' },
  { id: '#2238', sev: 'HIGH',     status: 'OPEN',      title: 'AD brute force ×14 on CORP-DC01',            src: '10.0.1.45',      ttp: 'T1078',     age: '18m ago' },
  { id: '#2237', sev: 'HIGH',     status: 'IN-REVIEW', title: 'PowerShell -enc execution on endpoint',      src: '192.168.5.201',  ttp: 'T1059.001', age: '23m ago' },
  { id: '#2236', sev: 'MEDIUM',   status: 'CLOSED',    title: 'Phishing attachment — quarantined by GW',    src: '185.220.101.47', ttp: 'T1566.001', age: '34m ago' },
  { id: '#2235', sev: 'MEDIUM',   status: 'CLOSED',    title: 'SMB lateral movement — blocked at firewall', src: '172.16.0.44',    ttp: 'T1021.002', age: '49m ago' },
];

function alertRow(a: Alert): string {
  const sevBadge    = `<span class="alert-sev-badge ${SEV_CLS[a.sev]}">${a.sev}</span>`;
  const statusBadge = `<span class="alert-status-badge ${STATUS_CLS[a.status]}">${a.status}</span>`;
  return `<div class="alert-row">
    <span class="alert-id">${a.id}</span>
    ${sevBadge}
    ${statusBadge}
    <span class="alert-title">${a.title}</span>
    <span class="alert-ttp">${a.ttp}</span>
    <span class="alert-age">${a.age}</span>
  </div>`;
}

const open   = QUEUE.filter((a) => a.status === 'OPEN').length;
const review = QUEUE.filter((a) => a.status === 'IN-REVIEW').length;
const closed = QUEUE.filter((a) => a.status === 'CLOSED').length;

export const alerts: CommandHandler = () => `
<div class="cmd-block">
  <div class="cmd-title">🚨 Alert Queue — SOAR Triage</div>
  <div class="alert-summary">
    <span class="alert-sum-item soc-crit">${open} OPEN</span>
    <span class="alert-sum-sep">·</span>
    <span class="alert-sum-item soc-high">${review} IN-REVIEW</span>
    <span class="alert-sum-sep">·</span>
    <span class="alert-sum-item soc-low">${closed} CLOSED</span>
  </div>
  <div class="alert-head">
    <span class="alert-id">ID</span>
    <span class="alert-sev-badge">SEV</span>
    <span class="alert-status-badge">STATUS</span>
    <span class="alert-title">TITLE</span>
    <span class="alert-ttp">TTP</span>
    <span class="alert-age">AGE</span>
  </div>
  <div class="alert-list">${QUEUE.map(alertRow).join('')}</div>
  <div class="cmd-help-hint">Simulated queue — based on Doğuş Teknoloji &amp; Fibabanka triage patterns.</div>
</div>`;
