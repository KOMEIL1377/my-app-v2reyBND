import React, { useMemo } from 'react';
import { ArrowDown, ArrowUp, Activity, Clock } from 'lucide-react';
import { TelemetryData, ConnectionState } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface SpeedTelemetryProps {
  telemetry: TelemetryData;
  connectionState: ConnectionState;
  speedHistory: number[];
  t: TranslationKeys;
}

export const SpeedTelemetry: React.FC<SpeedTelemetryProps> = ({
  telemetry,
  connectionState,
  speedHistory,
  t,
}) => {
  const isConnected = connectionState === 'connected';

  // Format seconds into HH:MM:SS
  const formattedUptime = useMemo(() => {
    const total = telemetry.uptimeSeconds;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [telemetry.uptimeSeconds]);

  // Format transferred bytes
  const formatBytes = (mb: number) => {
    if (mb > 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  // Sparkline coordinates
  const sparklinePoints = useMemo(() => {
    if (!speedHistory.length) return '';
    const max = Math.max(...speedHistory, 50);
    const width = 280;
    const height = 48;
    const step = width / (speedHistory.length - 1 || 1);

    return speedHistory
      .map((val, idx) => {
        const x = idx * step;
        const y = height - (val / max) * (height - 8) - 4;
        return `${x},${y}`;
      })
      .join(' ');
  }, [speedHistory]);

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 transition-all border border-[#A855F7]/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00F0FF]" />
          <span className="text-xs uppercase tracking-wider font-semibold text-[#F8FAFC]">
            {isConnected ? 'Real-time Telemetry Stream' : 'Telemetry Standby'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="telemetry-mono text-[11px] text-[#CBD5E1]">
            {isConnected ? formattedUptime : '00:00:00'}
          </span>
        </div>
      </div>

      {/* Primary Speed Strip (Download & Upload in Neon Blue & Magenta) */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Download Speed (Neon Cyan) */}
        <div className="p-3.5 rounded-xl bg-[#04020A] border border-[#00F0FF]/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.08)]">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
            <span className="flex items-center gap-1 text-[#00F0FF] font-semibold">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>{t.downloadSpeed}</span>
            </span>
            <span className="telemetry-mono text-[10px] text-[#00F0FF] font-bold">Mbps</span>
          </div>
          <div className="telemetry-mono text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            {isConnected ? telemetry.downloadSpeed.toFixed(1) : '0.0'}
          </div>
        </div>

        {/* Upload Speed (Neon Magenta) */}
        <div className="p-3.5 rounded-xl bg-[#04020A] border border-[#EC4899]/30 shadow-[inset_0_0_20px_rgba(236,72,153,0.08)]">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
            <span className="flex items-center gap-1 text-[#EC4899] font-semibold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{t.uploadSpeed}</span>
            </span>
            <span className="telemetry-mono text-[10px] text-[#EC4899] font-bold">Mbps</span>
          </div>
          <div className="telemetry-mono text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            {isConnected ? telemetry.uploadSpeed.toFixed(1) : '0.0'}
          </div>
        </div>
      </div>

      {/* Live Sparkline Graph with Neon Blue to Magenta Gradient */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-1.5">
          <span>Bandwidth Activity</span>
          <span className="telemetry-mono text-[10px] text-[#00F0FF]">
            {isConnected ? `Peak: ${Math.max(...speedHistory, 0).toFixed(1)} Mbps` : 'Idle'}
          </span>
        </div>
        <div className="h-12 w-full bg-[#03010A] rounded-xl border border-white/[0.08] overflow-hidden flex items-end p-1 shadow-inner">
          {isConnected && sparklinePoints ? (
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 48" preserveAspectRatio="none">
              <defs>
                <linearGradient id="neonSpeedGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="50%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="url(#neonSpeedGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
            </svg>
          ) : (
            <div className="w-full h-[1px] bg-[#A855F7]/20 self-center" />
          )}
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/[0.06] text-xs">
        <div>
          <span className="text-[#94A3B8] text-[11px] block">{t.latency}</span>
          <span
            className={`telemetry-mono font-semibold text-xs ${
              !isConnected
                ? 'text-[#94A3B8]'
                : telemetry.currentLatency < 50
                ? 'text-[#00F0FF]'
                : telemetry.currentLatency < 120
                ? 'text-[#A855F7]'
                : 'text-[#EC4899]'
            }`}
          >
            {isConnected ? `${telemetry.currentLatency} ms` : '--'}
          </span>
        </div>

        <div>
          <span className="text-[#94A3B8] text-[11px] block">{t.packetLoss}</span>
          <span className="telemetry-mono font-semibold text-xs text-[#00F0FF]">
            {isConnected ? `${telemetry.packetLoss.toFixed(2)}%` : '--'}
          </span>
        </div>

        <div>
          <span className="text-[#94A3B8] text-[11px] block">{t.dataTransferred}</span>
          <span className="telemetry-mono font-semibold text-xs text-[#F8FAFC]">
            {isConnected ? formatBytes(telemetry.totalDownloaded + telemetry.totalUploaded) : '0 MB'}
          </span>
        </div>
      </div>
    </div>
  );
};
