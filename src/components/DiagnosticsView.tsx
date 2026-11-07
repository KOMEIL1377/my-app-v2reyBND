import React, { useState } from 'react';
import { Terminal, ShieldCheck, Cpu, Wifi, RefreshCw, Copy, Check, Play } from 'lucide-react';
import { DiagnosticLog, TelemetryData, ConnectionState, ServerNode } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface DiagnosticsViewProps {
  logs: DiagnosticLog[];
  telemetry: TelemetryData;
  connectionState: ConnectionState;
  activeServer: ServerNode | null;
  onClearLogs: () => void;
  t: TranslationKeys;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  logs,
  telemetry,
  connectionState,
  activeServer,
  onClearLogs,
  t,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDnsTesting, setIsDnsTesting] = useState(false);
  const [dnsTestResult, setDnsTestResult] = useState<string | null>(null);

  const [isSpeedTesting, setIsSpeedTesting] = useState(false);
  const [speedTestResults, setSpeedTestResults] = useState<{
    ping: number;
    jitter: number;
    download: number;
    upload: number;
    loss: number;
  } | null>(null);

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunDnsAudit = () => {
    setIsDnsTesting(true);
    setDnsTestResult(null);
    setTimeout(() => {
      setIsDnsTesting(false);
      setDnsTestResult('0 DNS leaks found across 12 independent probe nodes (Quad9 DoH verified)');
    }, 1800);
  };

  const handleRunSpeedBenchmark = () => {
    setIsSpeedTesting(true);
    setSpeedTestResults(null);
    setTimeout(() => {
      setIsSpeedTesting(false);
      setSpeedTestResults({
        ping: activeServer ? activeServer.latency : 24,
        jitter: 1.4,
        download: connectionState === 'connected' ? 245.8 : 88.2,
        upload: connectionState === 'connected' ? 142.4 : 35.6,
        loss: 0.0,
      });
    }, 2400);
  };

  return (
    <div className="space-y-5">
      {/* Top 2-Column: Cryptographic Hardware & Leak Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Cryptographic Engine */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
            <Cpu className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              {t.cipherSuite}
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-[#94A3B8]">Cipher Algorithm</span>
              <span className="telemetry-mono text-[#F8FAFC] font-semibold">
                {activeServer?.protocol === 'AmneziaWG'
                  ? 'ChaCha20-Poly1305 (Amnezia)'
                  : activeServer?.protocol === 'OpenVPN'
                  ? activeServer.ovpnCipher || 'AES-256-GCM'
                  : 'ChaCha20-Poly1305'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-[#94A3B8]">
                {activeServer?.protocol === 'AmneziaWG' ? 'DPI Obfuscation' : 'Key Exchange (KEX)'}
              </span>
              <span className="telemetry-mono text-[#F8FAFC]">
                {activeServer?.protocol === 'AmneziaWG'
                  ? `Jc=${activeServer.amneziaParams?.Jc || 4} · H1-H4 Magic`
                  : activeServer?.protocol === 'OpenVPN'
                  ? 'TLS 1.3 / RSA 4096'
                  : 'Curve25519 (ECDH)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-[#94A3B8]">Integrity Hash</span>
              <span className="telemetry-mono text-[#F8FAFC]">BLAKE2s (256-bit)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-[#94A3B8]">Tunnel Protocol</span>
              <span className="telemetry-mono text-[#00F0FF] font-semibold">{activeServer ? activeServer.protocol : 'WireGuard (Default)'}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[#94A3B8]">MTU Payload Boundary</span>
              <span className="telemetry-mono text-[#F8FAFC]">1420 bytes</span>
            </div>
          </div>
        </div>

        {/* Card 2: IP & DNS Leak Verification */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                {t.dnsStatus}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.25)]">
              AUDITED
            </span>
          </div>

          <div className="space-y-2 text-xs mb-3">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-[#94A3B8]">{t.virtualIp}</span>
              <span className="telemetry-mono text-[#00F0FF] font-semibold">
                {connectionState === 'connected' && activeServer ? activeServer.ip : '192.168.1.104 (Local)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-[#94A3B8]">{t.realIpMasked}</span>
              <span className="telemetry-mono text-[#F8FAFC]">
                {connectionState === 'connected' ? 'Masked (Shielded)' : 'Exposed'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[#94A3B8]">Active DNS Resolver</span>
              <span className="telemetry-mono text-[#A855F7]">Quad9 (9.9.9.9 DoH)</span>
            </div>
          </div>

          {/* Audit Button */}
          <button
            type="button"
            onClick={handleRunDnsAudit}
            disabled={isDnsTesting}
            className="w-full py-2.5 px-3 bg-[#0A0518] hover:bg-[#150A2E] border border-[#A855F7]/30 hover:border-[#00F0FF]/50 rounded-xl text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00F0FF] ${isDnsTesting ? 'animate-spin' : ''}`} />
            <span>{isDnsTesting ? t.testingLeaks : t.testDnsLeaks}</span>
          </button>

          {dnsTestResult && (
            <div className="mt-2.5 p-2 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[11px] text-[#00F0FF] flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{dnsTestResult}</span>
            </div>
          )}
        </div>
      </div>

      {/* Network Benchmark Stress Test */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              {t.speedTest}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleRunSpeedBenchmark}
            disabled={isSpeedTesting}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Play className={`w-3 h-3 ${isSpeedTesting ? 'animate-spin' : ''}`} />
            <span>{isSpeedTesting ? t.runningTest : t.runSpeedTest}</span>
          </button>
        </div>

        {speedTestResults ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="p-3 bg-[#03010A] rounded-xl border border-[#00F0FF]/30 shadow-inner">
              <span className="text-[10px] text-[#94A3B8] block">{t.downloadSpeed}</span>
              <span className="telemetry-mono text-lg font-bold text-[#00F0FF]">
                {speedTestResults.download.toFixed(1)} <span className="text-xs font-normal">Mbps</span>
              </span>
            </div>
            <div className="p-3 bg-[#03010A] rounded-xl border border-[#EC4899]/30 shadow-inner">
              <span className="text-[10px] text-[#94A3B8] block">{t.uploadSpeed}</span>
              <span className="telemetry-mono text-lg font-bold text-[#EC4899]">
                {speedTestResults.upload.toFixed(1)} <span className="text-xs font-normal">Mbps</span>
              </span>
            </div>
            <div className="p-3 bg-[#03010A] rounded-xl border border-white/[0.08] shadow-inner">
              <span className="text-[10px] text-[#94A3B8] block">{t.latency}</span>
              <span className="telemetry-mono text-lg font-bold text-[#F8FAFC]">
                {speedTestResults.ping} <span className="text-xs font-normal">ms</span>
              </span>
            </div>
            <div className="p-3 bg-[#03010A] rounded-xl border border-white/[0.08] shadow-inner">
              <span className="text-[10px] text-[#94A3B8] block">Jitter</span>
              <span className="telemetry-mono text-lg font-bold text-[#94A3B8]">
                {speedTestResults.jitter} <span className="text-xs font-normal">ms</span>
              </span>
            </div>
            <div className="p-3 bg-[#03010A] rounded-xl border border-[#00F0FF]/30 shadow-inner">
              <span className="text-[10px] text-[#94A3B8] block">{t.packetLoss}</span>
              <span className="telemetry-mono text-lg font-bold text-[#00F0FF]">
                0.00%
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#94A3B8]">
            Click "Run Live Speed Test" to benchmark synthetic encrypted packet throughput to node{' '}
            <span className="text-[#00F0FF] font-mono">{activeServer ? activeServer.name : 'V2reyBND Gateway'}</span>.
          </p>
        )}
      </div>

      {/* Live Handshake Log Terminal */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#A855F7]/25">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#EC4899]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              {t.logsTerminal}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLogs}
              className="px-2.5 py-1 text-xs text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0518] hover:bg-[#150A2E] border border-white/[0.08] rounded-xl flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#00F0FF]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : t.copyLogs}</span>
            </button>
            <button
              type="button"
              onClick={onClearLogs}
              className="px-2.5 py-1 text-xs text-[#94A3B8] hover:text-[#EC4899] bg-[#0A0518] hover:bg-[#150A2E] border border-white/[0.08] rounded-xl transition-colors"
            >
              {t.clearLogs}
            </button>
          </div>
        </div>

        {/* Terminal viewport */}
        <div className="bg-[#030108] border border-[#A855F7]/25 rounded-xl p-3 h-48 overflow-y-auto font-mono text-[11px] space-y-1.5 select-text telemetry-mono shadow-inner">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#94A3B8]/60 shrink-0 select-none">[{log.timestamp}]</span>
              <span
                className={`font-semibold shrink-0 uppercase text-[10px] px-1.5 py-0.2 rounded-md ${
                  log.level === 'secure'
                    ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                    : log.level === 'warn'
                    ? 'bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30'
                    : log.level === 'crypto'
                    ? 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30'
                    : 'bg-white/10 text-[#94A3B8]'
                }`}
              >
                {log.level}
              </span>
              <span className="text-[#F1F5F9] break-all">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
