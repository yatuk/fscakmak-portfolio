import type { CommandHandler } from './index';
import { matrix } from './matrix';

/**
 * Easter eggs — not listed in `help`, but tab-autocomplete reveals
 * them and they're worth points. Ported verbatim (in spirit) from
 * v1. Free of any user-data exposure (no real shell, all jokes).
 *
 * The set is a small declaration; each handler is intentionally
 * compact since output is hand-crafted ASCII art / mock terminal
 * chatter.
 */

const nmapOutput = (): string => `
<div class="cmd-block egg-mono">
  Starting Nmap 7.94 ( https://nmap.org )<br>
  Scanning fscakmak.com (127.0.0.1)...<br><br>
  PORT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATE&nbsp;&nbsp;&nbsp;&nbsp;SERVICE<br>
  <span class="t-grn">22/tcp&nbsp;&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;ssh</span><br>
  <span class="t-grn">80/tcp&nbsp;&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;http</span><br>
  <span class="t-grn">443/tcp&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;https</span><br>
  <span class="t-err">1337/tcp&nbsp;filtered&nbsp;leet-soc</span><br>
  <span class="t-ylw">8080/tcp&nbsp;open&nbsp;&nbsp;&nbsp;&nbsp;caffeine-api</span><br><br>
  <span class="t-dim">Nmap done: 1 IP address (1 host up) scanned in 0.42s</span><br>
  <span class="t-dim">⚠ Port 1337: SOC monitoring active. Proceed with caution.</span>
</div>`;

export const eggs: Record<string, CommandHandler> = {
  matrix,

  'sudo rm -rf /': () => `
<div class="cmd-block t-err">
  [sudo] password for fscakmak: ********<br>
  rm: cannot remove '/': Operation not permitted<br>
  <span class="t-dim">Nice try. This incident has been logged. 🛡️😏</span>
</div>`,

  'rm -rf /': () => `
<div class="cmd-block t-err">
  rm: missing --no-preserve-root<br>
  <span class="t-dim">Filesystem integrity preserved. Your SOC training is paying off. 👍</span>
</div>`,

  hack: () => `
<div class="cmd-block">
  <span class="t-err">⚠ ACCESS DENIED</span><br>
  <span class="t-dim">Unauthorized access attempt detected.<br>
  Your IP has been forwarded to the SOC team.<br>
  ... oh wait, that's me. 😎</span>
</div>`,

  'cat /etc/passwd': () => `
<div class="cmd-block">
  <span class="t-err">cat: /etc/passwd: Permission denied</span><br>
  <span class="t-dim">Did you really think that would work here? 🤨<br>
  Try <span class="t-link">whoami</span> instead.</span>
</div>`,

  nmap: nmapOutput,
  'nmap localhost': nmapOutput,
  'nmap fscakmak.com': nmapOutput,

  ping: () => `
<div class="cmd-block egg-mono">
  PING fscakmak.com (127.0.0.1): 56 data bytes<br>
  64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=<span class="t-grn">0.042</span> ms<br>
  64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=<span class="t-grn">0.038</span> ms<br>
  <span class="t-dim">--- fscakmak.com ping statistics ---</span><br>
  <span class="t-dim">2 packets transmitted, 2 received, 0% packet loss</span><br>
  <span class="t-grn">All systems operational. ✓</span>
</div>`,

  pwd: () => `<div class="cmd-block t-link">/home/fscakmak/portfolio</div>`,

  'whoami --root': () => `
<div class="cmd-block">
  <span class="t-err">Error: You are not root.</span><br>
  <span class="t-dim">But you are: a cybersecurity enthusiast with great taste in terminals. 😄</span>
</div>`,

  exit: () => `
<div class="cmd-block">
  <span class="t-dim">Logout?</span><br>
  <span class="t-grn">There is no escape from this terminal. You're here forever now. 🙂</span>
</div>`,

  '42': () => `
<div class="cmd-block">
  <span class="t-ylw">The Answer to the Ultimate Question of Life, the Universe, and Everything.</span><br>
  <span class="t-dim">But the real question is: did you check your SIEM alerts today?</span>
</div>`,

  coffee: () => `
<div class="cmd-block">
  <pre class="egg-coffee">
    ( (
     ) )
  ._______.
  |       |]
  \\       /
   \`-----'
  </pre>
  <span class="t-dim">Brewing... ☕ SOC analysts run on caffeine.</span>
</div>`,

  sl: () => `
<div class="cmd-block">
  <pre class="egg-train">
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__
|/-=|___|=    ||    ||    ||    |_____/~\\___/
 \\_/      \\O=====O=====O=====O_/      \\_/
  </pre>
  <span class="t-dim">You typed 'sl' instead of 'ls'. Classic. 🚂</span>
</div>`,

  'cat .secret/flag.txt': () => `
<div class="cmd-block">
  <span class="t-grn">🚩 CTF{y0u_f0und_th3_s3cr3t_fl4g}</span><br>
  <span class="t-dim">Congratulations! You found the hidden flag.<br>
  You clearly have what it takes for CTF challenges. 🏆</span>
</div>`,

  history: ({ getHistory }) => {
    const h = getHistory();
    if (h.length === 0) {
      return `<div class="cmd-block t-dim">  No commands yet.</div>`;
    }
    const rows = h
      .map((c, i) => ` ${String(i + 1).padStart(4, ' ')}  ${escape(c)}`)
      .join('<br>');
    return `<div class="cmd-block egg-mono t-dim">${rows}</div>`;
  },

  date: () => `<div class="cmd-block t-tx">${escape(new Date().toString())}</div>`,

  sudo: () => `
<div class="cmd-block">
  <span class="t-dim">[sudo] password for fscakmak: </span><span class="t-grn">**************</span><br><br>
  <span class="t-grn">root access granted.</span><br>
  <span class="t-dim">just kidding — there's no root here.</span><br><br>
  <span class="t-tx">but since you made it to 100: thanks for actually reading everything.</span><br>
  <span class="t-dim">most people just tab through. you didn't. that means something.</span>
</div>`,
};

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}
