import type { CommandHandler } from './index';
import { SEV_CLS } from '@config/index';

type Sev = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface LogEntry {
  time: string;
  sev: Sev;
  src: string;
  ttp: string;
  msg: string;
}

/* Realistic SIEM entries drawn from actual SOC work experience.
   TTPs anchored to Doğuş Teknoloji / Fibabanka environment. */
const LOGS: LogEntry[] = [
  { time: '14:33:01', sev: 'CRITICAL', src: '185.220.101.47',  ttp: 'T1566.001', msg: 'Phishing attachment — auto-quarantined by gateway' },
  { time: '14:33:04', sev: 'HIGH',     src: '10.0.1.45',       ttp: 'T1078',     msg: 'Failed AD auth ×14 on CORP-DC01 — brute force suspected' },
  { time: '14:33:09', sev: 'MEDIUM',   src: '172.16.0.12',     ttp: 'T1190',     msg: 'Vuln scan probes on 443/8080/8443 — ext. scanner' },
  { time: '14:34:22', sev: 'HIGH',     src: '192.168.5.201',   ttp: 'T1059.001', msg: 'PowerShell -enc execution — ENDPOINT-042 (FIN dept.)' },
  { time: '14:35:11', sev: 'LOW',      src: '10.0.2.15',       ttp: 'TA0007',    msg: 'LDAP enumeration via svc_backup — review scheduled' },
  { time: '14:35:47', sev: 'CRITICAL', src: '91.92.251.103',   ttp: 'TA0011',    msg: 'C2 beacon detected — 60s interval, TLS over 443' },
  { time: '14:36:03', sev: 'HIGH',     src: '172.16.5.30',     ttp: 'T1003',     msg: 'LSASS memory read attempt — EDR blocked, isolated' },
  { time: '14:37:15', sev: 'MEDIUM',   src: '10.0.3.88',       ttp: 'T1071.004', msg: 'DNS query burst to DGA-pattern domain (entropy: 4.2)' },
  { time: '14:38:02', sev: 'LOW',      src: '10.0.1.100',      ttp: 'TA0005',    msg: 'Windows Defender exclusion added — non-standard path' },
  { time: '14:38:55', sev: 'HIGH',     src: '172.16.0.44',     ttp: 'T1021.002', msg: 'SMB lateral movement blocked at firewall — T0 zone' },
  { time: '14:39:30', sev: 'MEDIUM',   src: '10.0.4.7',        ttp: 'T1053.005', msg: 'Scheduled task created by non-admin — WORKSTATION-19' },
  { time: '14:40:11', sev: 'CRITICAL', src: '10.0.5.200',      ttp: 'T1486',     msg: 'Rapid file rename events — possible ransomware precursor' },
];

function row(e: LogEntry): string {
  return `<div class="log-row">
    <span class="log-ts">[2026-05-22 ${e.time}]</span>
    <span class="log-sev ${SEV_CLS[e.sev]}">${e.sev}</span>
    <span class="log-src">${e.src}</span>
    <span class="log-ttp">${e.ttp}</span>
    <span class="log-msg">${e.msg}</span>
  </div>`;
}

function build(entries: LogEntry[], title: string): string {
  const hint = entries.length < LOGS.length
    ? `logs --severity critical|high|medium|low · showing ${entries.length}/${LOGS.length}`
    : `logs --severity critical|high|medium|low to filter`;

  return `
<div class="cmd-block">
  <div class="cmd-title">📡 ${title}</div>
  <div class="log-head">
    <span class="log-ts">TIMESTAMP</span>
    <span class="log-sev">SEVERITY</span>
    <span class="log-src">SOURCE IP</span>
    <span class="log-ttp">TTP</span>
    <span class="log-msg">MESSAGE</span>
  </div>
  <div class="log-stream">${entries.map(row).join('')}</div>
  <div class="cmd-help-hint">${hint}</div>
</div>`;
}

const all: CommandHandler = () =>
  build(LOGS, 'SIEM Log Stream — Live Feed');

const bySev = (sev: Sev): CommandHandler => () =>
  build(LOGS.filter((e) => e.sev === sev), `SIEM Log Stream — ${sev}`);

export const logsCommands: Record<string, CommandHandler> = {
  'logs':                   all,
  'logs --severity critical': bySev('CRITICAL'),
  'logs --severity high':     bySev('HIGH'),
  'logs --severity medium':   bySev('MEDIUM'),
  'logs --severity low':      bySev('LOW'),
};
