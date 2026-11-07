import React from 'react';
import { Shield, Server, Activity, Sliders } from 'lucide-react';
import { ActiveTab } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface BottomNavBarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  t: TranslationKeys;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  t,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'tunnel', label: t.tabTunnel, icon: Shield },
    { id: 'servers', label: t.tabServers, icon: Server },
    { id: 'diagnostics', label: t.tabDiagnostics, icon: Activity },
    { id: 'settings', label: t.tabSettings, icon: Sliders },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#020106]/95 backdrop-blur-2xl border-t border-[#A855F7]/25 px-2 py-1 safe-area-pb shadow-[0_-4px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all active:scale-95 ${
                isActive ? 'text-[#00F0FF]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap ${isActive ? 'font-bold text-[#00F0FF]' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
