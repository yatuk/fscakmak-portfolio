import type { CommandHandler } from './index';

/* Realistic nmap output for fscakmak.com.
   Format mirrors nmap 7.94 service-version scan output exactly. */
const SCAN_OUTPUT = `<div class="cmd-block scan-output">
  <div class="cmd-title">🔎 nmap — Port Scan</div>
  <pre class="scan-pre"><span class="scan-dim">Starting Nmap 7.94 ( https://nmap.org )</span>
<span class="scan-dim">Nmap scan report for</span> <span class="scan-host">fscakmak.com</span> <span class="scan-dim">(188.114.96.x)</span>
<span class="scan-dim">Host is up (0.038s latency).</span>
<span class="scan-dim">Not shown: 997 filtered tcp ports (no-response)</span>

<span class="scan-head">PORT     STATE  SERVICE  VERSION</span>
<span class="scan-open">80/tcp   open   http     Cloudflare CDN</span>
<span class="scan-open">443/tcp  open   https    Cloudflare CDN</span>
<span class="scan-closed">22/tcp   closed ssh</span>

<span class="scan-dim">Service detection performed.</span>
<span class="scan-dim">Nmap done: 1 IP address (1 host up) scanned in 6.71 seconds</span></pre>
  <div class="cmd-help-hint">Simulated output — no live scan. Anatomy: CDN-only exposure, port 22 closed. ✓</div>
</div>`;

export const scanHandler: CommandHandler = () => SCAN_OUTPUT;

export const scanCommands: Record<string, CommandHandler> = {
  scan:               scanHandler,
  nmap:               scanHandler,
  'nmap localhost':   scanHandler,
  'nmap fscakmak.com': scanHandler,
  'scan fscakmak.com': scanHandler,
};
