import type { CommandHandler } from './index';

interface Skill {
  name:  string;
  pct:   number;   /* 0–100 */
  group: string;
}

const SKILLS: Skill[] = [
  { name: 'MITRE ATT&CK',          pct: 85, group: 'Threat Intel' },
  { name: 'SIEM / Log Correlation', pct: 80, group: 'SOC Core'     },
  { name: 'SOAR Playbook Dev',      pct: 75, group: 'SOC Core'     },
  { name: 'EDR Alert Tuning',       pct: 75, group: 'SOC Core'     },
  { name: 'Incident Response',      pct: 65, group: 'IR'           },
  { name: 'Network Forensics',      pct: 60, group: 'IR'           },
  { name: 'Python / Automation',    pct: 70, group: 'Dev'          },
  { name: 'Firewall / NDR',         pct: 65, group: 'Infra'        },
];

const BAR_WIDTH = 20; /* characters */

function bar(pct: number): string {
  const filled = Math.round((pct / 100) * BAR_WIDTH);
  const empty  = BAR_WIDTH - filled;
  const fill   = '█'.repeat(filled);
  const pad    = '░'.repeat(empty);
  return `<span class="smat-fill">${fill}</span><span class="smat-empty">${pad}</span>`;
}

function row(s: Skill): string {
  return `<div class="smat-row">
    <span class="smat-name">${s.name}</span>
    <span class="smat-bar">${bar(s.pct)}</span>
    <span class="smat-pct">${s.pct}%</span>
    <span class="smat-group">${s.group}</span>
  </div>`;
}

export const skillmatrix: CommandHandler = () => `
<div class="cmd-block">
  <div class="cmd-title">📊 Skill Matrix</div>
  <div class="smat-wrap">
    <div class="smat-head">
      <span class="smat-name">SKILL</span>
      <span class="smat-bar">PROFICIENCY</span>
      <span class="smat-pct">%</span>
      <span class="smat-group">AREA</span>
    </div>
    ${SKILLS.map(row).join('')}
  </div>
  <div class="cmd-help-hint">Self-assessed relative to SOC L1–L2 role. Not absolute mastery scores.</div>
</div>`;
