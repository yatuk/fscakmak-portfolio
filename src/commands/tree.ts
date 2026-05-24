import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

/**
 * ASCII site map. Re-built each call so it reflects the profile
 * dynamically — when projects/certs change in the JSON, the tree
 * updates automatically.
 */
const renderer: CommandHandler = ({ profile, t }) => {
  const projects = profile.projects.map((p) => p.slug);
  const certs = profile.certifications.map((c) => c.name);

  const lines: Array<{ depth: number; glyph: string; label: string; cls: string }> = [
    { depth: 0, glyph: '',     label: escapeHtml(profile.identity.domain), cls: 'tr-root' },
    { depth: 1, glyph: '├──',  label: 'about',                 cls: 'tr-file' },
    { depth: 1, glyph: '├──',  label: 'skills/',               cls: 'tr-dir' },
    { depth: 2, glyph: '│   ├──', label: t('skill_groups.cybersecurity'),   cls: 'tr-file' },
    { depth: 2, glyph: '│   ├──', label: t('skill_groups.infrastructure'),  cls: 'tr-file' },
    { depth: 2, glyph: '│   ├──', label: t('skill_groups.compliance'),      cls: 'tr-file' },
    { depth: 2, glyph: '│   └──', label: t('skill_groups.tools'),           cls: 'tr-file' },
    { depth: 1, glyph: '├──',  label: 'experience/', cls: 'tr-dir' },
    ...profile.experience.map((e, i, arr) => ({
      depth: 2,
      glyph: i === arr.length - 1 ? '│   └──' : '│   ├──',
      label: escapeHtml(e.company),
      cls: 'tr-file',
    })),
    { depth: 1, glyph: '├──',  label: 'education/', cls: 'tr-dir' },
    ...profile.education.map((e, i, arr) => ({
      depth: 2,
      glyph: i === arr.length - 1 ? '│   └──' : '│   ├──',
      label: escapeHtml(e.school),
      cls: 'tr-file',
    })),
    { depth: 1, glyph: '├──', label: 'projects/', cls: 'tr-dir' },
    ...projects.map((slug, i, arr) => ({
      depth: 2,
      glyph: i === arr.length - 1 ? '│   └──' : '│   ├──',
      label: escapeHtml(slug),
      cls: 'tr-file',
    })),
    { depth: 1, glyph: '├──', label: 'certifications/', cls: 'tr-dir' },
    ...certs.map((name, i, arr) => ({
      depth: 2,
      glyph: i === arr.length - 1 ? '│   └──' : '│   ├──',
      label: escapeHtml(name),
      cls: 'tr-file',
    })),
    { depth: 1, glyph: '└──', label: 'languages.txt', cls: 'tr-file' },
  ];

  const body = lines
    .map((l) => {
      if (l.depth === 0) {
        return `<span class="${l.cls}">${l.label}</span>`;
      }
      return `<span class="tr-glyph">${l.glyph} </span><span class="${l.cls}">${l.label}</span>`;
    })
    .join('\n');

  return `
<div class="cmd-block tree">
  <div class="cmd-title">🌲 tree</div>
  <pre>${body}</pre>
</div>`;
};

export const treeCommands: Record<string, CommandHandler> = {
  tree: renderer,
  'tree -l 2': renderer,
};
