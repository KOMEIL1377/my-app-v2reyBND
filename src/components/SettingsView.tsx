import React, { useState } from 'react';
import { Sliders, Shield, Layers, Check } from 'lucide-react';
import { ProtocolType } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface SettingsViewProps {
  currentProtocol: ProtocolType;
  onSelectProtocol: (protocol: ProtocolType) => void;
  killswitchArmed: boolean;
  onToggleKillswitch: () => void;
  splitTunnelingActive: boolean;
  onToggleSplitTunneling: () => void;
  stealthActive: boolean;
  onToggleStealth: () => void;
  t: TranslationKeys;
}

const PROTOCOL_DESCRIPTIONS: Record<
  ProtocolType,
  { desc: string; badge: string; color: string }
> = {
  WireGuard: {
    desc: 'Kernel-level high performance with ChaCha20-Poly1305 and instant roaming.',
    badge: 'Standard',
    color: '#00F0FF',
  },
  'VLESS Reality': {
    desc: 'XTLS-Reality masquerading as legitimate websites with zero client fingerprint to bypass DPI.',
    badge: 'Reality Anti-DPI',
    color: '#EC4899',
  },
  'VLESS TLS': {
    desc: 'Lightweight VLESS proxy wrapped in modern TLS 1.3 encryption with uTLS ClientHello emulation.',
    badge: 'VLESS TLS',
    color: '#00F0FF',
  },
  'VLESS TCP (No TLS)': {
    desc: 'Direct cleartext TCP transport with zero TLS handshaking overhead for local forwarders and CDNs.',
    badge: 'VLESS TCP (Clear)',
    color: '#38BDF8',
  },
  'VLESS WS (No TLS)': {
    desc: 'VLESS WebSocket over HTTP port 80/8080 without TLS, ideal for free CDN reverse-proxies.',
    badge: 'VLESS WS (Clear)',
    color: '#06B6D4',
  },
  'VLESS gRPC (No TLS)': {
    desc: 'Multiplexed gRPC H2C (HTTP/2 Cleartext) streaming without TLS encapsulation.',
    badge: 'gRPC H2C (Clear)',
    color: '#0EA5E9',
  },
  'VMess TLS': {
    desc: 'Authenticated VMess protocol secured with TLS 1.3 and AEAD packet validation.',
    badge: 'VMess TLS',
    color: '#818CF8',
  },
  'VMess WS': {
    desc: 'VMess transport over WebSocket for CDN and Cloudflare reverse proxy routing with TLS.',
    badge: 'VMess WebSocket',
    color: '#A78BFA',
  },
  'VMess WS (No TLS)': {
    desc: 'VMess over plain WebSocket (HTTP port 80/8080) for CDN proxies without SSL/TLS certificates.',
    badge: 'VMess WS (Clear)',
    color: '#C084FC',
  },
  'VMess TCP (No TLS)': {
    desc: 'Direct raw VMess TCP connection with AEAD authentication and no TLS wrapper layer.',
    badge: 'VMess TCP (Clear)',
    color: '#9333EA',
  },
  'Shadowsocks AEAD': {
    desc: 'High-entropy symmetric cipher with TCP and UDP proxy support.',
    badge: 'Stealth',
    color: '#A855F7',
  },
  'Hysteria 2': {
    desc: 'Custom UDP congestion control maximizing bandwidth over high packet loss networks.',
    badge: 'High Throughput',
    color: '#EC4899',
  },
  'TUIC v5': {
    desc: 'Pure QUIC protocol with 0-RTT connection handshake and multiplexing.',
    badge: 'Ultra Low RTT',
    color: '#00F0FF',
  },
  OpenVPN: {
    desc: 'Enterprise SSL/TLS tunnel with AES-256-GCM encryption and .ovpn profile support.',
    badge: 'Enterprise SSL',
    color: '#38BDF8',
  },
  AmneziaWG: {
    desc: 'WireGuard with randomized packet headers and junk padding defeating deep packet inspection (DPI).',
    badge: 'Anti-DPI AWG',
    color: '#F43F5E',
  },
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentProtocol,
  onSelectProtocol,
  killswitchArmed,
  onToggleKillswitch,
  splitTunnelingActive,
  onToggleSplitTunneling,
  stealthActive,
  onToggleStealth,
  t,
}) => {
  const [mtu, setMtu] = useState(1420);
  const [dnsProvider, setDnsProvider] = useState<'quad9' | 'cloudflare' | 'adguard'>('quad9');
  const [allowLan, setAllowLan] = useState(true);
  const [blockIpv6, setBlockIpv6] = useState(true);

  // Split Tunneling apps mock state
  const [splitApps, setSplitApps] = useState([
    { name: 'Online Banking & Payments', package: 'com.bank.secure', bypassed: true },
    { name: 'Local Network File Shares (SMB/NFS)', package: 'lan.smb.direct', bypassed: true },
    { name: 'Web Browsers (Chrome / Firefox)', package: 'org.browser.traffic', bypassed: false },
    { name: 'Terminal & Git Clones', package: 'sh.terminal.dev', bypassed: false },
  ]);

  const toggleAppBypass = (pkg: string) => {
    setSplitApps((prev) =>
      prev.map((app) => (app.package === pkg ? { ...app, bypassed: !app.bypassed } : app))
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. Protocol Architecture Selector */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
          <Layers className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="text-sm font-semibold text-[#F8FAFC]">
            {t.protocolSettings}
          </h3>
        </div>

        <div className="space-y-2.5">
          {(Object.keys(PROTOCOL_DESCRIPTIONS) as ProtocolType[]).map((proto) => {
            const isSelected = currentProtocol === proto;
            const meta = PROTOCOL_DESCRIPTIONS[proto];
            return (
              <div
                key={proto}
                onClick={() => onSelectProtocol(proto)}
                className={`flex items-start justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#120826] border border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    : 'bg-[#05020C]/70 hover:bg-[#100722]/80 border border-white/[0.06]'
                }`}
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-[#F8FAFC]">
                      {proto}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold"
                      style={{
                        backgroundColor: `${meta.color}18`,
                        color: meta.color,
                        borderColor: `${meta.color}40`,
                        borderWidth: '1px',
                      }}
                    >
                      {meta.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'bg-[#00F0FF] text-[#020106] shadow-[0_0_10px_#00F0FF]'
                      : 'border border-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Security Policies & Hardware Killswitch */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
          <Shield className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="text-sm font-semibold text-[#F8FAFC]">
            {t.securityPolicies}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Heavy-duty Killswitch toggle with Neon Cyan Glow */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#04020A] border border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  {t.killswitch}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                  KERNEL-LEVEL
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5 max-w-sm">
                {t.killswitchDesc}
              </p>
            </div>

            {/* Slide Switch */}
            <button
              type="button"
              onClick={onToggleKillswitch}
              aria-label="Toggle Killswitch"
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full transition-colors duration-300 p-1 shadow-inner border border-white/10 ${
                killswitchArmed ? 'bg-[#020106]' : 'bg-[#100722]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full transform transition duration-300 ${
                  killswitchArmed
                    ? 'translate-x-6 bg-[#00F0FF] shadow-[0_0_14px_rgba(0,240,255,0.95)]'
                    : 'translate-x-0 bg-[#475569]'
                }`}
              />
            </button>
          </div>

          {/* Stealth Obfuscation toggle with Neon Magenta Glow */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#04020A] border border-white/[0.06]">
            <div>
              <span className="text-sm font-semibold text-[#F8FAFC]">
                {t.stealthMode}
              </span>
              <p className="text-xs text-[#94A3B8] mt-0.5 max-w-sm">
                {t.stealthModeDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleStealth}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full transition-colors duration-300 p-1 shadow-inner border border-white/10 ${
                stealthActive ? 'bg-[#020106]' : 'bg-[#100722]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full transform transition duration-300 ${
                  stealthActive
                    ? 'translate-x-6 bg-[#EC4899] shadow-[0_0_14px_rgba(236,72,153,0.95)]'
                    : 'translate-x-0 bg-[#475569]'
                }`}
              />
            </button>
          </div>

          {/* Sub-toggles: LAN & IPv6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#04020A] border border-white/[0.05] cursor-pointer hover:border-[#A855F7]/30 transition-colors">
              <input
                type="checkbox"
                checked={allowLan}
                onChange={(e) => setAllowLan(e.target.checked)}
                className="w-4 h-4 rounded text-[#00F0FF] bg-[#020106] border-white/20 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[#dfe2f1]">Allow Local Network (LAN)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#04020A] border border-white/[0.05] cursor-pointer hover:border-[#A855F7]/30 transition-colors">
              <input
                type="checkbox"
                checked={blockIpv6}
                onChange={(e) => setBlockIpv6(e.target.checked)}
                className="w-4 h-4 rounded text-[#00F0FF] bg-[#020106] border-white/20 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[#dfe2f1]">Block IPv6 Leaks Outside Tunnel</span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Split Tunneling App Rules */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              {t.splitTunneling}
            </h3>
          </div>
          <button
            type="button"
            onClick={onToggleSplitTunneling}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
              splitTunnelingActive
                ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                : 'bg-white/5 text-[#94A3B8] border border-white/10'
            }`}
          >
            {splitTunnelingActive ? 'ACTIVE' : 'BYPASS ALL OFF'}
          </button>
        </div>

        <p className="text-xs text-[#94A3B8] mb-3">
          {t.splitTunnelingDesc}
        </p>

        <div className="space-y-2">
          {splitApps.map((app) => (
            <div
              key={app.package}
              onClick={() => toggleAppBypass(app.package)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#04020A] hover:bg-[#100722] border border-white/[0.05] cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-medium text-[#F8FAFC] block">
                  {app.name}
                </span>
                <span className="telemetry-mono text-[10px] text-[#94A3B8]">
                  {app.package}
                </span>
              </div>
              <span
                className={`telemetry-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  app.bypassed
                    ? 'bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30'
                    : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                }`}
              >
                {app.bypassed ? 'Direct (Bypass)' : 'Encrypted Tunnel'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MTU and DNS Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MTU Slider */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#F8FAFC]">{t.mtuSize}</span>
            <span className="telemetry-mono text-xs font-bold text-[#00F0FF]">{mtu} bytes</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mb-3">
            Calibrate Maximum Transmission Unit to prevent packet fragmentation.
          </p>
          <input
            type="range"
            min="1280"
            max="1500"
            step="10"
            value={mtu}
            onChange={(e) => setMtu(Number(e.target.value))}
            className="w-full h-1.5 bg-[#03010A] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mt-1">
            <span>1280 (Min)</span>
            <span>1420 (Optimal)</span>
            <span>1500 (Max)</span>
          </div>
        </div>

        {/* DNS Provider Selector */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <span className="text-xs font-semibold text-[#F8FAFC] block mb-2">{t.customDns}</span>
          <div className="space-y-2">
            {[
              { id: 'quad9', name: 'Quad9 DNS over HTTPS', ip: '9.9.9.9' },
              { id: 'cloudflare', name: 'Cloudflare 1.1.1.1', ip: '1.1.1.1' },
              { id: 'adguard', name: 'AdGuard Ad-Blocking DNS', ip: '94.140.14.14' },
            ].map((dns) => (
              <label
                key={dns.id}
                onClick={() => setDnsProvider(dns.id as any)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                  dnsProvider === dns.id
                    ? 'bg-[#100722] border border-[#00F0FF]/40 text-[#00F0FF]'
                    : 'bg-[#04020A] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dns"
                    checked={dnsProvider === dns.id}
                    onChange={() => {}}
                    className="text-[#00F0FF] bg-[#020106] focus:ring-0"
                  />
                  <span className="text-xs">{dns.name}</span>
                </div>
                <span className="telemetry-mono text-[10px] text-[#A855F7]">{dns.ip}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
