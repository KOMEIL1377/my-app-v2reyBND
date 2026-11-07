import React from 'react';
import { Shield, ShieldCheck, Power } from 'lucide-react';
import { ConnectionState } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface ConnectOrbProps {
  state: ConnectionState;
  onToggle: () => void;
  t: TranslationKeys;
}

export const ConnectOrb: React.FC<ConnectOrbProps> = ({ state, onToggle, t }) => {
  const isConnected = state === 'connected';
  const isConnecting = state === 'connecting' || state === 'disconnecting';

  return (
    <div className="relative flex flex-col items-center justify-center py-6 select-none">
      {/* Outer ambient radiant glow matching BNDTeam logo (cyan to magenta) */}
      <div
        className={`absolute w-80 h-80 rounded-full pointer-events-none transition-all duration-700 blur-[90px] opacity-35 ${
          isConnected
            ? 'bg-gradient-to-tr from-[#00F0FF] via-[#A855F7] to-[#EC4899]'
            : isConnecting
            ? 'bg-gradient-to-r from-[#A855F7] to-[#EC4899] animate-pulse'
            : 'bg-gradient-to-r from-[#00F0FF]/30 to-[#A855F7]/30'
        }`}
      />

      {/* Outer concentric glass ring 2 with soft rounded geometry */}
      <div
        className={`relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 rounded-full transition-all duration-700 ${
          isConnected
            ? 'border border-[#00F0FF]/40 shadow-[0_0_50px_rgba(0,240,255,0.25)]'
            : isConnecting
            ? 'border border-[#A855F7]/40 shadow-[0_0_40px_rgba(168,85,247,0.3)]'
            : 'border border-white/[0.08]'
        }`}
      >
        {/* Outer concentric glass ring 1 */}
        <div
          className={`flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-full transition-all duration-700 ${
            isConnected
              ? 'border border-[#EC4899]/50 bg-gradient-to-br from-[#00F0FF]/10 via-[#A855F7]/10 to-[#EC4899]/15 shadow-[inset_0_0_30px_rgba(0,240,255,0.2)]'
              : isConnecting
              ? 'border border-[#A855F7]/50 bg-[#A855F7]/10'
              : 'border border-white/[0.06] bg-[#0C0718]/60 backdrop-blur-md'
          }`}
        >
          {/* Rotating gradient ring when connecting (conic neon blue-purple-magenta) */}
          {isConnecting && (
            <div
              className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full animate-spin-slow pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, #00F0FF, #A855F7 120deg, #EC4899 240deg, #00F0FF 360deg)',
                padding: '3px',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2px))',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
              }}
            />
          )}

          {/* Master Controller Orb (Button) */}
          <button
            type="button"
            onClick={onToggle}
            disabled={isConnecting}
            aria-label={isConnected ? t.tapToDisconnect : t.tapToConnect}
            className={`group relative flex flex-col items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer disabled:cursor-wait ${
              isConnected
                ? 'bg-gradient-to-br from-[#060412] via-[#120826] to-[#0A1224] border-2 border-[#00F0FF] glow-orb-connected'
                : isConnecting
                ? 'bg-gradient-to-br from-[#0A0518] to-[#1A0B2E] border-2 border-[#EC4899] shadow-[0_0_35px_rgba(236,72,153,0.5)]'
                : 'bg-gradient-to-br from-[#0A0618] via-[#100924] to-[#080514] border-2 border-[#A855F7]/50 hover:border-[#00F0FF] glow-orb-idle animate-pulse-subtle'
            }`}
          >
            {/* Center icon with Neon glow */}
            <div className="flex items-center justify-center mb-1">
              {isConnected ? (
                <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 text-[#00F0FF] transition-transform group-hover:scale-110 drop-shadow-[0_0_16px_rgba(0,240,255,0.95)]" />
              ) : isConnecting ? (
                <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-[#EC4899] animate-pulse drop-shadow-[0_0_16px_rgba(236,72,153,0.9)]" />
              ) : (
                <Power className="w-12 h-12 sm:w-14 sm:h-14 text-[#A855F7] group-hover:text-[#00F0FF] transition-all group-hover:scale-110 drop-shadow-[0_0_14px_rgba(168,85,247,0.7)]" />
              )}
            </div>

            {/* Micro button caption */}
            <span
              className={`text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-colors ${
                isConnected
                  ? 'text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                  : isConnecting
                  ? 'text-[#EC4899]'
                  : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
              }`}
            >
              {isConnected ? t.tapToDisconnect : isConnecting ? t.securingHandshake : t.tapToConnect}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
