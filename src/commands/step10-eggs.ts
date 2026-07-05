import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

/** Prefix handlers — matched in terminal.ts before the registry. */
export const prefixHandlers: Array<{
  prefix: string;
  run: (arg: string) => string | Promise<string>;
}> = [
  {
    prefix: 'decode ',
    run: (arg) => {
      const payload = arg.trim();
      if (!payload) {
        return `<div class="cmd-block t-err">usage: decode &lt;base64&gt;</div>`;
      }
      try {
        const decoded = atob(payload.replace(/\s/g, ''));
        return `<div class="cmd-block egg-mono">
  <span class="t-dim">$ decode …</span><br>
  <span class="t-grn">${escapeHtml(decoded)}</span>
</div>`;
      } catch {
        return `<div class="cmd-block t-err">decode: invalid base64 input</div>`;
      }
    },
  },
  {
    prefix: 'hash ',
    run: async (arg) => {
      const text = arg.trim();
      if (!text) {
        return `<div class="cmd-block t-err">usage: hash &lt;text&gt;</div>`;
      }
      const data = new TextEncoder().encode(text);
      const buf = await crypto.subtle.digest('SHA-256', data);
      const hex = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return `<div class="cmd-block egg-mono">
  <span class="t-dim">SHA-256("${escapeHtml(text.slice(0, 40))}${text.length > 40 ? '…' : ''}")</span><br>
  <span class="t-grn">${hex}</span>
</div>`;
    },
  },
  {
    prefix: 'cowsay ',
    run: (arg) => cowsayHtml(arg.trim() || 'moo'),
  },
  {
    prefix: 'figlet ',
    run: (arg) => figletHtml(arg.trim() || 'SOC'),
  },
];

export function cowsayHtml(message: string): string {
  const msg = escapeHtml(message.slice(0, 60));
  const pad = Math.min(message.length + 2, 62);
  return `<div class="cmd-block">
  <pre class="egg-mono t-grn">
 ${'_'.repeat(pad)}
&lt; ${msg} &gt;
 ${'-'.repeat(pad)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
  </pre>
</div>`;
}

export function figletHtml(text: string): string {
  const t = escapeHtml(text.slice(0, 12).toUpperCase());
  return `<div class="cmd-block">
  <pre class="egg-mono t-link" aria-label="${t}">
 ███████╗ ██████╗  ██████╗
 ██╔════╝██╔════╝ ██╔════╝
 █████╗  ██║  ███╗██║
 ██╔══╝  ██║   ██║██║
 ██║     ╚██████╔╝╚██████╗
 ╚═╝      ╚═════╝  ╚═════╝
  </pre>
  <span class="t-dim">figlet: ${t} (portfolio edition)</span>
</div>`;
}

const tcpdumpOutput = (): string => `
<div class="cmd-block egg-mono">
  <span class="t-dim">tcpdump: listening on eth0, link-type EN10MB</span><br>
  <span class="t-grn">12:04:01.442 IP 10.0.0.42.443 &gt; 10.0.0.7.52431: Flags [P.], seq 1:89</span><br>
  <span class="t-ylw">12:04:01.448 IP 10.0.0.7.52431 &gt; 10.0.0.42.443: Flags [.], ack 89</span><br>
  <span class="t-mag">12:04:02.103 IP 10.0.0.99.22 &gt; 10.0.0.42.22: SSH handshake (suspicious?)</span><br>
  <span class="t-dim">^C — 3 packets captured. Forwarded to SIEM correlation. 🛡️</span>
</div>`;

const siemAlerts = (): string => `
<div class="cmd-block">
  <div class="cmd-title">SIEM — last 5 alerts (simulated)</div>
  <div class="egg-mono">
    <span class="t-err">[HIGH]</span> T1110 Brute Force — svc_backup @ 10.0.4.12 <span class="t-dim">· 2m ago</span><br>
    <span class="t-ylw">[MED]</span>  T1059 PowerShell — FIN-WS-042 <span class="t-dim">· 14m ago</span><br>
    <span class="t-ylw">[MED]</span>  T1078 Valid Accounts — VPN gateway <span class="t-dim">· 31m ago</span><br>
    <span class="t-grn">[LOW]</span>  T1048 Exfil attempt — blocked by DLP <span class="t-dim">· 1h ago</span><br>
    <span class="t-dim">[INFO] Daily CTI feed sync completed · 3h ago</span>
  </div>
  <span class="t-dim">All clear after triage? Run <span class="t-link">coffee</span> first. ☕</span>
</div>`;

export const step10Eggs: Record<string, CommandHandler> = {
  tcpdump: () => tcpdumpOutput(),
  siem: siemAlerts,
  'siem alerts': siemAlerts,

  attack: () => `
<div class="cmd-block">
  <span class="t-err">⚔ ATT&CK simulation blocked</span><br>
  <span class="t-dim">Tactic: Initial Access · Technique: T1566 Phishing<br>
  Status: contained by email gateway + user awareness training.</span><br>
  <span class="t-grn">Blue team wins this round. 🛡️</span>
</div>`,

  ports: () => `
<div class="cmd-block egg-mono">
  <span class="t-dim">Listening on fscakmak@portfolio:</span><br>
  <span class="t-grn">tcp  0.0.0.0:22</span>   <span class="t-dim">ssh</span><br>
  <span class="t-grn">tcp  0.0.0.0:443</span>  <span class="t-dim">https (this site)</span><br>
  <span class="t-grn">tcp  127.0.0.1:8080</span> <span class="t-dim">caffeine-api</span><br>
  <span class="t-err">tcp  0.0.0.0:1337</span> <span class="t-dim">leet-soc (filtered)</span>
</div>`,

  traceroute: () => `
<div class="cmd-block egg-mono">
  traceroute to fscakmak.com (127.0.0.1), 30 hops max<br>
  <span class="t-grn"> 1  gateway.fibabanka (10.0.0.1)</span>  2.102 ms<br>
  <span class="t-grn"> 2  soc-core-01 (10.0.1.50)</span>  4.331 ms<br>
  <span class="t-grn"> 3  fscakmak.com (127.0.0.1)</span>  0.042 ms<br>
  <span class="t-dim">Route looks healthy. No packet loss detected.</span>
</div>`,

  htop: () => `
<div class="cmd-block">
  <pre class="egg-mono t-tx">
PID  USER     CPU%  MEM%  COMMAND
  1  root      0.1   0.4  systemd
 42  fscakmak  2.3   1.8  siem-correlator
1337 fscakmak  7.1   4.2  alert-triage
 9001 fscakmak  0.0   0.1  coffee-daemon ☕
  </pre>
  <span class="t-dim">Press q to quit — just kidding, you're in a browser. 😄</span>
</div>`,

  vim: () => `
<div class="cmd-block">
  <span class="t-err">VIM — VISUAL BLOCK MODE</span><br>
  <span class="t-dim">Hint: to exit vim, close this tab. (Or type <span class="t-link">:q!</span> and accept your fate.)</span><br>
  <span class="t-grn">:wq — file saved to /dev/null</span>
</div>`,

  cowsay: () => cowsayHtml('Stay vigilant'),
  figlet: () => figletHtml('SOC'),

  weather: ({ locale }) => {
    const city = locale === 'tr' ? 'İstanbul' : 'Istanbul';
    return `
<div class="cmd-block">
  <div class="cmd-title">${city}</div>
  <div class="egg-mono">
    <span class="t-grn">18°C</span> · partly cloudy · humidity 62%<br>
    <span class="t-dim">Wind NE 12 km/h · visibility 10 km</span><br>
    <span class="t-ylw">SOC note:</span> <span class="t-dim">perfect weather for log review indoors. ☕</span>
  </div>
</div>`;
  },
};

/** Shown after Konami code — full hidden command reference. */
export const DEVELOPER_COMMANDS: ReadonlyArray<{ cmd: string; note: string }> = [
  { cmd: 'matrix', note: 'canvas rain' },
  { cmd: 'nmap', note: 'port scan (mock)' },
  { cmd: 'ping', note: 'latency check' },
  { cmd: 'tcpdump', note: 'packet capture (mock)' },
  { cmd: 'siem / siem alerts', note: 'alert queue' },
  { cmd: 'attack', note: 'ATT&CK simulation' },
  { cmd: 'ports', note: 'listening ports' },
  { cmd: 'traceroute', note: 'network path' },
  { cmd: 'htop', note: 'process monitor' },
  { cmd: 'decode <b64>', note: 'base64 decode' },
  { cmd: 'hash <text>', note: 'SHA-256' },
  { cmd: 'stats / github stats', note: 'GitHub profile' },
  { cmd: 'vim', note: '…' },
  { cmd: 'cowsay [msg]', note: 'ASCII cow' },
  { cmd: 'figlet [text]', note: 'ASCII banner' },
  { cmd: 'weather', note: 'Istanbul forecast (mock)' },
  { cmd: 'coffee · sl · hack · 42', note: 'classics' },
  { cmd: 'cat .secret/flag.txt', note: 'CTF flag' },
  { cmd: 'sudo rm -rf /', note: 'nice try' },
];

export function developerModeHtml(): string {
  const rows = DEVELOPER_COMMANDS.map(
    (r) => `
    <div class="cmd-help-row">
      <span class="cmd-help-cmd">${escapeHtml(r.cmd)}</span>
      <span class="cmd-help-desc">${escapeHtml(r.note)}</span>
    </div>`
  ).join('');

  return `
<div class="cmd-block">
  <div class="cmd-title t-ylw">🎮 Developer mode — hidden commands</div>
  <div class="cmd-help-rows">${rows}</div>
  <div class="cmd-help-hint">Tab autocomplete works. Type any command above.</div>
</div>`;
}
