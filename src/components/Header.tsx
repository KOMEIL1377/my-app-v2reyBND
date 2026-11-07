import React from 'react';
import { Shield, Globe, Smartphone, Monitor } from 'lucide-react';
import { ActiveTab, ConnectionState, LanguageMode } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface HeaderProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  connectionState: ConnectionState;
  onToggleConnect: () => void;
  language: LanguageMode;
  onToggleLanguage: () => void;
  isMobilePreview: boolean;
  onToggleDeviceView: () => void;
  t: TranslationKeys;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  connectionState,
  onToggleConnect,
  language,
  onToggleLanguage,
  isMobilePreview,
  onToggleDeviceView,
  t,
}) => {
  const isConnected = connectionState === 'connected';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#020106]/92 backdrop-blur-xl border-b border-[#A855F7]/20 px-4 sm:px-8 py-3.5 transition-colors shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark with BNDTeam Logo in Glowing Neon Ring */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#00F0FF]/60 shadow-[0_0_16px_rgba(0,240,255,0.45)] shrink-0 bg-[#020106] ring-2 ring-[#EC4899]/30">
            <img
              src="/assets/aistudio/photo_2026-11-07_05-44-19_0aac1326.jpg"
              alt="V2reyBND Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display font-bold text-lg sm:text-xl text-[#F8FAFC] tracking-tight whitespace-nowrap">
            {t.appName === 'V2reyBND' ? (
              <>
                <span>V2rey</span>
                <span className="neon-text-gradient ms-0.5 font-extrabold tracking-wider">BND</span>
              </>
            ) : (
              t.appName
            )}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('tunnel')}
            className={`whitespace-nowrap transition-all pb-1 border-b-2 ${
              currentTab === 'tunnel'
                ? 'text-[#00F0FF] border-[#00F0FF] font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-[#94A3B8] border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            {t.tabTunnel}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('servers')}
            className={`whitespace-nowrap transition-all pb-1 border-b-2 ${
              currentTab === 'servers'
                ? 'text-[#00F0FF] border-[#00F0FF] font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-[#94A3B8] border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            {t.tabServers}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('diagnostics')}
            className={`whitespace-nowrap transition-all pb-1 border-b-2 ${
              currentTab === 'diagnostics'
                ? 'text-[#00F0FF] border-[#00F0FF] font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-[#94A3B8] border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            {t.tabDiagnostics}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`whitespace-nowrap transition-all pb-1 border-b-2 ${
              currentTab === 'settings'
                ? 'text-[#00F0FF] border-[#00F0FF] font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-[#94A3B8] border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            {t.tabSettings}
          </button>
        </nav>

        {/* Zone 3: Utility Controls & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Device viewport frame switcher */}
          <button
            type="button"
            onClick={onToggleDeviceView}
            title={isMobilePreview ? t.desktopView : t.mobileView}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0518] hover:bg-[#150A2E] border border-[#A855F7]/30 rounded-xl transition-all whitespace-nowrap shadow-sm hover:border-[#00F0FF]/40"
          >
            {isMobilePreview ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>{t.desktopView}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>{t.mobileView}</span>
              </>
            )}
          </button>

          {/* Bilingual Language Switcher (LTR / RTL) */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0518] hover:bg-[#150A2E] border border-[#A855F7]/30 rounded-xl transition-all whitespace-nowrap shadow-sm hover:border-[#00F0FF]/40"
            title="Toggle Language & Bidirectional Layout"
          >
            <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="font-mono text-[11px]">{language === 'en' ? 'FA (فا)' : 'EN (US)'}</span>
          </button>

          {/* Primary Quick Action Button with Neon Glow */}
          <button
            type="button"
            onClick={onToggleConnect}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm ${
              isConnected
                ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_15px_rgba(0,240,255,0.35)] hover:bg-[#00F0FF]/25'
                : 'bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] font-bold shadow-[0_0_16px_rgba(168,85,247,0.45)] hover:opacity-95'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]'
                  : 'bg-[#020106]'
              }`}
            />
            <span>{isConnected ? t.statusConnected : t.tapToConnect}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
