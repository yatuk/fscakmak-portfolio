import type { CommandHandler } from './index';

interface IOC {
  type:       string;
  indicator:  string;
  ttp:        string;
  source:     string;
  confidence: 'HIGH' | 'MED' | 'LOW';
}

const IOCS: IOC[] = [
  { type: 'IPv4',   indicator: '185.220.101.47',                              ttp: 'TA0011',    source: 'Abuse.ch Feodo',  confidence: 'HIGH' },
  { type: 'IPv4',   indicator: '91.92.251.103',                               ttp: 'T1566',     source: 'CISA AA24-131A', confidence: 'HIGH' },
  { type: 'SHA256', indicator: '44d88612fea8a8f36de82e12...cfaf1c5e',         ttp: 'T1204.002', source: 'MalwareBazaar',  confidence: 'HIGH' },
  { type: 'SHA256', indicator: 'e3b0c44298fc1c149afbf4c8...b7fe3c08',         ttp: 'T1486',     source: 'VirusTotal',     confidence: 'MED'  },
  { type: 'Domain', indicator: 'update-service[.]net',                        ttp: 'T1071',     source: 'Recorded Future', confidence: 'HIGH' },
  { type: 'Domain', indicator: 'cdn-js[.]com',                                ttp: 'T1071.001', source: 'URLhaus',        confidence: 'MED'  },
  { type: 'URL',    indicator: 'hxxps://dl[.]evil-cdn[.]net/loader[.]exe',    ttp: 'T1204.002', source: 'PhishTank',      confidence: 'HIGH' },
  { type: 'URL',    indicator: 'hxxp://185.220.101.47/c2/beacon',             ttp: 'TA0011',    source: 'Abuse.ch',       confidence: 'HIGH' },
];

const CONF_CLS = { HIGH: 'soc-high', MED: 'soc-med', LOW: 'soc-low' } as const;

function iocRow(ioc: IOC): string {
  return `<div class="ioc-row">
    <span class="ioc-type">${ioc.type}</span>
    <span class="ioc-val">${ioc.indicator}</span>
    <span class="ioc-ttp">${ioc.ttp}</span>
    <span class="ioc-src">${ioc.source}</span>
    <span class="ioc-conf ${CONF_CLS[ioc.confidence]}">${ioc.confidence}</span>
  </div>`;
}

export const ioc: CommandHandler = () => `
<div class="cmd-block">
  <div class="cmd-title">🔍 IOC Feed — Threat Intelligence</div>
  <div class="ioc-head">
    <span class="ioc-type">TYPE</span>
    <span class="ioc-val">INDICATOR</span>
    <span class="ioc-ttp">TTP</span>
    <span class="ioc-src">SOURCE</span>
    <span class="ioc-conf">CONF</span>
  </div>
  <div class="ioc-table">${IOCS.map(iocRow).join('')}</div>
  <div class="cmd-help-hint">CTI feed review — part of daily SOC triage at Fibabanka. Indicators defanged.</div>
</div>`;
