import type { CommandHandler } from './index';
import type { Locale } from '@ptypes/profile';

/**
 * Four ATT&CK techniques/tactics the user has actually touched —
 * each anchored to a real CV line, NOT invented. Per spec:
 *   • T1566 Phishing          — Doğuş SOAR playbooks
 *   • TA0007 Discovery        — Active Directory monitoring
 *   • TA0005 Defense Evasion  — EDR alert tuning
 *   • TA0011 C2               — firewall log review
 *
 * Mixing techniques (T*) and tactics (TA*) is intentional —
 * those are exactly what the spec specifies, mirroring the
 * coarser level at which an intern actually operates.
 */
interface MitreEntry {
  id: string;
  name: string;
  context: Record<Locale, string>;
  url: string;
}

const ENTRIES: MitreEntry[] = [
  {
    id: 'T1566',
    name: 'Phishing',
    context: {
      en: 'SOAR playbooks for recurring phishing alerts at Doğuş Teknoloji.',
      tr: 'Doğuş Teknoloji\'de tekrarlayan phishing alert\'leri için SOAR playbook\'ları.',
    },
    url: 'https://attack.mitre.org/techniques/T1566/',
  },
  {
    id: 'TA0007',
    name: 'Discovery',
    context: {
      en: 'Active Directory monitoring and Windows/Linux log review.',
      tr: 'Active Directory izleme ve Windows/Linux log incelemesi.',
    },
    url: 'https://attack.mitre.org/tactics/TA0007/',
  },
  {
    id: 'TA0005',
    name: 'Defense Evasion',
    context: {
      en: 'EDR alert tuning to reduce noise without missing evasion attempts.',
      tr: 'Evasion girişimlerini kaçırmadan gürültüyü azaltmak için EDR alert tuning.',
    },
    url: 'https://attack.mitre.org/tactics/TA0005/',
  },
  {
    id: 'TA0011',
    name: 'Command and Control',
    context: {
      en: 'Firewall log review in a BDDK-regulated banking environment.',
      tr: 'BDDK düzenlemesi altındaki bankacılık ortamında firewall log incelemesi.',
    },
    url: 'https://attack.mitre.org/tactics/TA0011/',
  },
];

const renderer: CommandHandler = ({ locale }) => {
  const cards = ENTRIES.map(
    (e) => `
    <article class="mitre-card">
      <div class="mitre-id">${e.id}</div>
      <div class="mitre-name">${e.name}</div>
      <p class="mitre-context">${e.context[locale]}</p>
      <a class="mitre-link" href="${e.url}" target="_blank" rel="noopener noreferrer">attack.mitre.org →</a>
    </article>`
  ).join('');

  const subtitle =
    locale === 'tr'
      ? 'Gerçek deneyime dayanan, uydurulmamış teknikler.'
      : 'Real techniques touched on the job — not theoretical.';

  return `
<div class="cmd-block">
  <div class="cmd-title">🎯 Defended ATT&CK</div>
  <div class="cmd-help-hint" style="margin-bottom:10px">${subtitle}</div>
  <div class="mitre-grid">${cards}</div>
</div>`;
};

export const mitreCommands: Record<string, CommandHandler> = {
  mitre: renderer,
  'mitre attack': renderer,
};
