import React, { useState, useMemo } from 'react';
import { Search, Star, RefreshCw, Plus, Check } from 'lucide-react';
import { ServerNode } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface ServerListProps {
  servers: ServerNode[];
  selectedServerId: string;
  onSelectServer: (server: ServerNode) => void;
  onToggleFavorite: (serverId: string) => void;
  onOpenCustomModal: () => void;
  onPingServer: (serverId: string) => void;
  onPingAll: () => void;
  isPinging: boolean;
  t: TranslationKeys;
}

export const ServerList: React.FC<ServerListProps> = ({
  servers,
  selectedServerId,
  onSelectServer,
  onToggleFavorite,
  onOpenCustomModal,
  onPingServer,
  onPingAll,
  isPinging,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter logic
  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      // Category filter
      if (activeCategory === 'fastest' && server.latency >= 50) return false;
      if (activeCategory === 'favorites' && !server.isFavorite) return false;
      if (activeCategory === 'europe' && server.category !== 'europe') return false;
      if (activeCategory === 'americas' && server.category !== 'americas') return false;
      if (activeCategory === 'asia' && server.category !== 'asia') return false;
      if (activeCategory === 'multihop' && !server.isMultiHop) return false;

      // Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = server.name.toLowerCase().includes(query);
        const matchesCity = server.city.toLowerCase().includes(query);
        const matchesCountry = server.country.toLowerCase().includes(query);
        const matchesProtocol = server.protocol.toLowerCase().includes(query);
        return matchesName || matchesCity || matchesCountry || matchesProtocol;
      }
      return true;
    });
  }, [servers, activeCategory, searchQuery]);

  return (
    <div className="w-full space-y-4">
      {/* Top Controls: Search & Primary Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#A855F7]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchServers}
            className="w-full h-12 ps-10 pe-4 bg-[#05020C]/90 border border-[#A855F7]/30 rounded-2xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/25 transition-all shadow-inner"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onPingAll}
            disabled={isPinging}
            className="h-12 px-4 bg-[#0A0518] hover:bg-[#150A2E] border border-[#A855F7]/30 rounded-2xl text-xs font-medium text-[#F8FAFC] flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 hover:border-[#00F0FF]/50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00F0FF] ${isPinging ? 'animate-spin' : ''}`} />
            <span>{t.pingAll}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCustomModal}
            className="h-12 px-4 bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:opacity-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">{t.addCustomNode}</span>
            <span className="sm:hidden">{t.importConfig}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: t.allServers },
          { id: 'fastest', label: t.fastest },
          { id: 'favorites', label: t.favorites },
          { id: 'europe', label: t.europe },
          { id: 'americas', label: t.americas },
          { id: 'asia', label: t.asia },
          { id: 'multihop', label: t.multihop },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all shrink-0 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#0A0518] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/[0.08] hover:border-[#A855F7]/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Server List Rows */}
      <div className="space-y-3">
        {servers.length === 0 ? (
          <div className="py-12 px-6 text-center glass-panel rounded-2xl border border-dashed border-[#A855F7]/30 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#070314] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <Plus className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="font-semibold text-base text-[#F8FAFC]">
                {t.allServers} خالی است
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                تمام سرورهای پیش‌فرض پاک شده‌اند. برای شروع اتصال، کانفیگ اختصاصی (VLESS، WireGuard یا Amnezia) را وارد کرده یا از ربات تلگرام تهیه کنید.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] text-xs font-extrabold rounded-xl transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,240,255,0.35)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.addCustomNode}</span>
            </button>
          </div>
        ) : filteredServers.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl text-[#94A3B8] text-sm border border-white/5">
            No routing nodes match your filter criteria.
          </div>
        ) : (
          filteredServers.map((server) => {
            const isSelected = server.id === selectedServerId;
            return (
              <div
                key={server.id}
                onClick={() => onSelectServer(server)}
                className={`group relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#100726]/90 border border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.35),inset_0_0_15px_rgba(168,85,247,0.15)]'
                    : 'glass-panel hover:bg-[#120826]/85 hover:border-[#00F0FF]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                }`}
              >
                {/* Left zone: Flag, Name, Protocol, City */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Flag / Icon in Glass Frame */}
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#03010A] border border-[#A855F7]/30 text-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    {server.flag}
                  </div>

                  {/* Server Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm sm:text-base text-[#F8FAFC] truncate">
                        {server.name}
                      </span>
                      {server.isMultiHop && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#A855F7]/25 text-[#A855F7] border border-[#A855F7]/40 shrink-0">
                          2-HOP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-0.5">
                      <span className="truncate">{server.city}, {server.country}</span>
                      <span aria-hidden="true" className="text-white/20">·</span>
                      <span className="text-[11px] font-mono text-[#00F0FF] font-semibold shrink-0">
                        {server.protocol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right zone: Latency Tag, Load Gauge, Favorite, Check */}
                <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                  {/* Load indicator bar */}
                  <div className="hidden md:flex flex-col items-end gap-1 w-16">
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      {server.load}% load
                    </span>
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899]"
                        style={{ width: `${server.load}%` }}
                      />
                    </div>
                  </div>

                  {/* Latency Tag with Neon Glow */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPingServer(server.id);
                    }}
                    title="Click to ping node"
                    className={`telemetry-mono px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-transform active:scale-90 ${
                      server.latency < 50
                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.25)] hover:bg-[#00F0FF]/25'
                        : server.latency < 120
                        ? 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 hover:bg-[#A855F7]/30'
                        : 'bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/40 hover:bg-[#EC4899]/30'
                    }`}
                  >
                    {server.latency} ms
                  </button>

                  {/* Favorite star toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(server.id);
                    }}
                    className="p-1 text-[#94A3B8] hover:text-[#EC4899] transition-colors"
                    aria-label="Toggle favorite"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        server.isFavorite
                          ? 'fill-[#EC4899] text-[#EC4899] drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]'
                          : 'text-[#94A3B8]'
                      }`}
                    />
                  </button>

                  {/* Active selection checkmark */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#00F0FF] text-[#020106] shadow-[0_0_10px_#00F0FF]'
                        : 'border border-white/20 group-hover:border-[#00F0FF]/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
