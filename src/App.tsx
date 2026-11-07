import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Server,
  Activity,
  Sliders,
  ArrowRight,
  Globe,
  Radio,
  Lock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';

import {
  ConnectionState,
  ServerNode,
  TelemetryData,
  DiagnosticLog,
  ActiveTab,
  LanguageMode,
  ProtocolType,
} from './types/vpn';
import { INITIAL_SERVERS } from './data/servers';
import { translations } from './data/translations';

import { Header } from './components/Header';
import { ConnectOrb } from './components/ConnectOrb';
import { SpeedTelemetry } from './components/SpeedTelemetry';
import { ServerList } from './components/ServerList';
import { DiagnosticsView } from './components/DiagnosticsView';
import { SettingsView } from './components/SettingsView';
import { BottomNavBar } from './components/BottomNavBar';
import { CustomServerModal } from './components/CustomServerModal';

export default function App() {
  const [language, setLanguage] = useState<LanguageMode>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('tunnel');
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Servers
  const [servers, setServers] = useState<ServerNode[]>(INITIAL_SERVERS);
  const [selectedServer, setSelectedServer] = useState<ServerNode | null>(INITIAL_SERVERS[0] || null);
  const [isPinging, setIsPinging] = useState(false);

  // Security Toggles
  const [killswitchArmed, setKillswitchArmed] = useState(true);
  const [splitTunnelingActive, setSplitTunnelingActive] = useState(false);
  const [stealthActive, setStealthActive] = useState(true);
  const [activeProtocol, setActiveProtocol] = useState<ProtocolType>('WireGuard');

  // Telemetry
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    totalDownloaded: 342.5,
    totalUploaded: 68.2,
    currentLatency: 24,
    packetLoss: 0.0,
    virtualIp: '194.38.20.14',
    publicIp: '185.220.101.5',
    dnsServer: '9.9.9.9 (Quad9 DoH)',
    cipher: 'ChaCha20-Poly1305',
    handshakeTime: '12ms',
    uptimeSeconds: 0,
  });

  const [speedHistory, setSpeedHistory] = useState<number[]>([15, 22, 18, 35, 42, 68, 55, 78, 92, 110]);

  // Terminal Logs
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    {
      id: 'log-0',
      timestamp: '00:00:01',
      level: 'info',
      message: 'V2reyBND cryptographic engine initialized (v4.2-core)',
    },
    {
      id: 'log-1',
      timestamp: '00:00:02',
      level: 'crypto',
      message: 'ChaCha20-Poly1305 assembly acceleration enabled (AVX-512)',
    },
    {
      id: 'log-2',
      timestamp: '00:00:03',
      level: 'secure',
      message: 'Hardware Killswitch armed: All non-tunneled outbound socket bindings blocked',
    },
  ]);

  const t = translations[language];

  // Sync HTML dir and lang attributes for bidirectional layout
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  // Append new diagnostic log helper
  const addLog = (level: DiagnosticLog['level'], message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        level,
        message,
      },
    ]);
  };

  // Toggle Connection Handler
  const handleToggleConnect = () => {
    if (connectionState === 'connected') {
      setConnectionState('disconnecting');
      addLog('warn', `Terminating secure tunnel to ${selectedServer?.name || 'relay'} [${selectedServer?.ip || '0.0.0.0'}]`);
      setTimeout(() => {
        setConnectionState('disconnected');
        setTelemetry((prev) => ({
          ...prev,
          downloadSpeed: 0,
          uploadSpeed: 0,
        }));
        addLog(
          'info',
          selectedServer?.protocol.startsWith('VLESS') || selectedServer?.protocol.startsWith('VMess')
            ? 'Xray/V2Ray Core proxy stream closed gracefully.'
            : selectedServer?.protocol === 'OpenVPN'
            ? 'OpenVPN daemon terminated. Interface tun0 closed.'
            : selectedServer?.protocol === 'AmneziaWG'
            ? 'AmneziaWG interface unmounted. Obfuscated socket closed.'
            : 'Tunnel unmounted. Interface wg0 released.'
        );
      }, 900);
    } else if (connectionState === 'disconnected') {
      if (!selectedServer) {
        addLog('warn', language === 'fa' ? 'لیست سرورها خالی است. لطفاً ابتدا یک کانفیگ سرور اضافه کنید یا از ربات تلگرام دریافت نمایید.' : 'Server list is empty. Please add or import a server configuration first.');
        setIsCustomModalOpen(true);
        return;
      }

      setConnectionState('connecting');

      if (selectedServer.protocol === 'VLESS Reality') {
        const sni = selectedServer.v2rayParams?.sni || 'speed.cloudflare.com';
        const fp = selectedServer.v2rayParams?.fingerprint || 'chrome';

        addLog('info', `Xray-core v1.8.8 initialized for VLESS-Reality node [${selectedServer.name}]...`);

        setTimeout(() => {
          addLog('crypto', `uTLS ClientHello: Emulating '${fp}' browser TLS fingerprint`);
        }, 400);

        setTimeout(() => {
          addLog('secure', `Reality Authentication: Server SNI '${sni}' verified with ECDH Public Key`);
        }, 900);

        setTimeout(() => {
          addLog('crypto', `XTLS-rprx-vision flow active: zero-padding heuristic applied to defeat DPI`);
        }, 1300);

        setTimeout(() => {
          setConnectionState('connected');
          setTelemetry((prev) => ({
            ...prev,
            cipher: 'XTLS Reality (Zero-Fingerprint TLS 1.3)',
          }));
          addLog('secure', `[VLESS-Reality] Tunnel established! Traffic camouflaged as standard HTTPS.`);
        }, 1700);
      } else if (selectedServer.protocol.includes('No TLS')) {
        const transport = selectedServer.v2rayParams?.transport?.toUpperCase() || (selectedServer.protocol.includes('WS') ? 'WS' : selectedServer.protocol.includes('gRPC') ? 'GRPC' : 'TCP');
        const hostHeader = selectedServer.v2rayParams?.hostHeader || 'Direct IP';

        addLog('info', `Core initialized for [${selectedServer.name}] (${selectedServer.protocol})...`);

        setTimeout(() => {
          if (transport === 'WS') {
            addLog('crypto', `WebSocket Handshake: Sending 'Upgrade: websocket' (Host: ${hostHeader}) on cleartext port ${selectedServer.ip.split(':')[1] || '80'}`);
          } else if (transport === 'GRPC') {
            addLog('crypto', `gRPC H2C: Initializing cleartext multiplexed channel (Service: ${selectedServer.v2rayParams?.serviceName || 'vless-grpc'})`);
          } else {
            addLog('crypto', `Raw TCP: Direct payload stream opened with endpoint [${selectedServer.ip}] (No TLS overhead)`);
          }
        }, 400);

        setTimeout(() => {
          addLog('secure', `Inbound stream verified: Client UUID authenticated for ${selectedServer.name}`);
        }, 900);

        setTimeout(() => {
          setConnectionState('connected');
          setTelemetry((prev) => ({
            ...prev,
            cipher: 'Direct Cleartext / AEAD (Zero-TLS Header)',
          }));
          addLog('secure', `[${selectedServer.protocol}] Connected! High-throughput cleartext proxy active.`);
        }, 1400);
      } else if (selectedServer.protocol.startsWith('VMess') || selectedServer.protocol === 'VLESS TLS') {
        const sni = selectedServer.v2rayParams?.sni || 'cdn.cloudflare.com';
        const transport = selectedServer.v2rayParams?.transport?.toUpperCase() || 'WS';

        addLog('info', `V2Ray Core initialized for [${selectedServer.name}] (${selectedServer.protocol})...`);

        setTimeout(() => {
          addLog('crypto', `VMess AEAD authentication handshake passed with UUID: ${selectedServer.v2rayParams?.uuid?.slice(0, 8) || '8f4c2e1b'}...`);
        }, 500);

        setTimeout(() => {
          addLog('info', `Transport: ${transport} pipe connected to host '${sni}' over TLS 1.3`);
        }, 1000);

        setTimeout(() => {
          setConnectionState('connected');
          setTelemetry((prev) => ({
            ...prev,
            cipher: 'AES-128-GCM / Chacha20 (TLS 1.3 Multiplexed)',
          }));
          addLog('secure', `[${selectedServer.protocol}] Tunnel verified! Traffic reverse-proxied successfully.`);
        }, 1600);
      } else if (selectedServer.protocol === 'AmneziaWG') {
        const jc = selectedServer.amneziaParams?.Jc || 4;
        const jmin = selectedServer.amneziaParams?.Jmin || 40;
        const jmax = selectedServer.amneziaParams?.Jmax || 70;
        const h1 = selectedServer.amneziaParams?.H1 || 1;
        const h2 = selectedServer.amneziaParams?.H2 || 2;

        addLog('info', `AmneziaWG Core initialized for profile [${selectedServer.name}]...`);

        setTimeout(() => {
          addLog('crypto', `Injecting ${jc} randomized junk packets (${jmin}-${jmax} bytes) for DPI camouflage`);
        }, 400);

        setTimeout(() => {
          addLog('crypto', `Applying custom Amnezia header magic (H1=0x${h1.toString(16)}, H2=0x${h2.toString(16)})`);
        }, 900);

        setTimeout(() => {
          addLog('secure', `DPI inspection bypassed: Handshake response verified with endpoint [${selectedServer.ip}]`);
        }, 1300);

        setTimeout(() => {
          setConnectionState('connected');
          setTelemetry((prev) => ({
            ...prev,
            cipher: 'ChaCha20-Poly1305 (Amnezia Obfuscated)',
          }));
          addLog('secure', `[AmneziaWG] Anti-DPI tunnel established! Virtual IP ${selectedServer.ip.split(':')[0]} assigned.`);
        }, 1700);
      } else if (selectedServer.protocol === 'OpenVPN') {
        addLog('info', `OpenVPN Core 2.6.9 initialized for profile [${selectedServer.name}]...`);

        setTimeout(() => {
          addLog('crypto', `TLS: Initial handshake packet from endpoint [${selectedServer.ip}]`);
        }, 500);

        setTimeout(() => {
          addLog('secure', `VERIFY OK: depth=1, CN=OpenVPN-CA (Certificate Chain Valid)`);
        }, 1000);

        setTimeout(() => {
          addLog('crypto', `Data Channel Encrypt: Cipher '${selectedServer.ovpnCipher || 'AES-256-GCM'}' initialized with 256-bit key`);
        }, 1400);

        setTimeout(() => {
          setConnectionState('connected');
          setTelemetry((prev) => ({
            ...prev,
            cipher: selectedServer.ovpnCipher || 'AES-256-GCM',
          }));
          addLog('secure', `[OpenVPN] Initialization Sequence Completed. Virtual IP ${selectedServer.ip.split(':')[0]} assigned.`);
        }, 1800);
      } else {
        addLog('crypto', `Generating ephemeral Curve25519 keypair for ${selectedServer.name}...`);

        setTimeout(() => {
          addLog('info', `Sending handshake initiation to endpoint ${selectedServer.ip}:51820`);
        }, 600);

        setTimeout(() => {
          addLog('crypto', 'Handshake response received: MAC verification passed in 14ms');
        }, 1200);

        setTimeout(() => {
          setConnectionState('connected');
          addLog('secure', `Tunnel established! Assigned virtual IP ${selectedServer.ip}. Zero DNS leaks verified.`);
        }, 1700);
      }
    }
  };

  // Uptime and Live Speed Simulator
  useEffect(() => {
    if (connectionState !== 'connected') return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const jitter = (Math.random() - 0.48) * 12;
        const newDown = Math.max(25, Math.min(280, prev.downloadSpeed + jitter || 95));
        const newUp = Math.max(8, Math.min(140, newDown * 0.45 + (Math.random() - 0.5) * 5));

        // Increment data transferred
        const addedDownMB = newDown / 8 / 2; // rough approximation per interval
        const addedUpMB = newUp / 8 / 2;

        return {
          ...prev,
          downloadSpeed: newDown,
          uploadSpeed: newUp,
          totalDownloaded: prev.totalDownloaded + addedDownMB,
          totalUploaded: prev.totalUploaded + addedUpMB,
          uptimeSeconds: prev.uptimeSeconds + 1,
        };
      });

      setSpeedHistory((prev) => {
        const nextVal = Math.floor(Math.random() * 80) + 60;
        const sliced = prev.length > 20 ? prev.slice(1) : prev;
        return [...sliced, nextVal];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [connectionState]);

  // Server selection
  const handleSelectServer = (server: ServerNode) => {
    setSelectedServer(server);
    addLog('info', `Routing destination configured to ${server.name} (${server.city}, ${server.country})`);
    if (connectionState === 'connected') {
      // Re-connect to new server
      addLog('warn', `Migrating live tunnel session to new endpoint ${server.ip}...`);
      setConnectionState('connecting');
      setTimeout(() => {
        setConnectionState('connected');
        addLog('secure', `Session migrated successfully to ${server.name} with latency ${server.latency}ms`);
      }, 1200);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (serverId: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  // Ping a single server
  const handlePingServer = (serverId: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id === serverId) {
          const delta = (Math.random() - 0.5) * 8;
          const newLatency = Math.max(12, Math.round(s.latency + delta));
          return { ...s, latency: newLatency };
        }
        return s;
      })
    );
  };

  // Ping all servers
  const handlePingAll = () => {
    setIsPinging(true);
    addLog('info', 'Triggering global ICMP ping probe across all 12 edge nodes...');
    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.5) * 12;
          return { ...s, latency: Math.max(14, Math.round(s.latency + delta)) };
        })
      );
      setIsPinging(false);
      addLog('secure', 'Ping telemetry updated across all routing relays.');
    }, 900);
  };

  // Add custom server
  const handleAddCustomServer = (newServer: ServerNode) => {
    setServers((prev) => [newServer, ...prev]);
    setSelectedServer(newServer);
    addLog('secure', `Custom node [${newServer.name}] loaded into relay pool (${newServer.protocol})`);
  };

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting' || connectionState === 'disconnecting';

  return (
    <div className="min-h-screen bg-[#020106] text-[#F1F5F9] flex flex-col justify-between selection:bg-[#A855F7]/30 selection:text-[#00F0FF]">
      {/* Background ambient radial gradients matching BNDTeam logo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[150px] transition-all duration-1000 ${
            isConnected
              ? 'bg-gradient-to-tr from-[#00F0FF]/15 via-[#A855F7]/15 to-[#EC4899]/15'
              : isConnecting
              ? 'bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20'
              : 'bg-gradient-to-r from-[#00F0FF]/8 via-[#A855F7]/10 to-[#EC4899]/8'
          }`}
        />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-[#EC4899]/8 blur-[130px]" />
        <div className="absolute top-20 left-10 w-[350px] h-[350px] rounded-full bg-[#00F0FF]/8 blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Bar Contract (1-line Brand, single-line links, 1 primary action) */}
        <Header
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          connectionState={connectionState}
          onToggleConnect={handleToggleConnect}
          language={language}
          onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'fa' : 'en'))}
          isMobilePreview={isMobilePreview}
          onToggleDeviceView={() => setIsMobilePreview((prev) => !prev)}
          t={t}
        />

        {/* Content Wrapper */}
        <main
          className={`flex-1 mx-auto w-full px-4 sm:px-6 py-6 pb-24 md:pb-10 transition-all ${
            isMobilePreview ? 'max-w-md' : 'max-w-5xl'
          }`}
        >
          {/* TAB 1: TUNNEL (Main Screen) */}
          {activeTab === 'tunnel' && (
            <div className="space-y-6">
              {/* Primary Status Banner */}
              <div className="text-center pt-2 pb-1">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isConnected
                        ? 'bg-[#00F0FF] shadow-[0_0_12px_#00F0FF]'
                        : isConnecting
                        ? 'bg-[#EC4899] shadow-[0_0_12px_#EC4899] animate-ping'
                        : 'bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]'
                    }`}
                  />
                  <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#F8FAFC]">
                    {connectionState === 'connected'
                      ? t.statusConnected
                      : connectionState === 'connecting'
                      ? t.statusConnecting
                      : connectionState === 'disconnecting'
                      ? t.statusDisconnecting
                      : t.statusDisconnected}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
                  {connectionState === 'connected'
                    ? t.statusSubConnected
                    : connectionState === 'connecting'
                    ? t.statusSubConnecting
                    : t.statusSubDisconnected}
                </p>
              </div>

              {/* Central Master Node Controller (Connect Orb) */}
              <ConnectOrb
                state={connectionState}
                onToggle={handleToggleConnect}
                t={t}
              />

              {/* BNDTeam Glowing Neon Buy Subscription & Free Trial Button */}
              <a
                href="https://t.me/bndteam_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl p-[1.5px] bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:shadow-[0_0_45px_rgba(0,240,255,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
              >
                <div className="flex items-center justify-between p-4 sm:p-4.5 rounded-[15px] bg-gradient-to-r from-[#070314]/95 via-[#0E0620]/95 to-[#160624]/95 backdrop-blur-xl">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 via-[#A855F7]/30 to-[#EC4899]/20 border border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5 text-[#00F0FF] fill-[#00F0FF]/30" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-sm sm:text-base neon-text-gradient tracking-tight truncate">
                          {t.buySubscription}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/40 shrink-0">
                          OFFICIAL BOT
                        </span>
                      </div>
                      <p className="text-xs text-[#CBD5E1] font-medium mt-0.5 truncate">
                        {t.buySubscriptionSub}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] text-xs font-extrabold shrink-0 ms-2 shadow-[0_0_15px_rgba(0,240,255,0.35)] group-hover:opacity-95 transition-opacity">
                    <span className="hidden sm:inline">t.me/bndteam_bot</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#020106]" />
                  </div>
                </div>
              </a>

              {/* Active Routing Node Card with Glowing Glassmorphism */}
              <div
                onClick={() => {
                  if (servers.length === 0) {
                    setIsCustomModalOpen(true);
                  } else {
                    setActiveTab('servers');
                  }
                }}
                className="group relative glass-panel rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-[#00F0FF]/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all"
              >
                {selectedServer ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#03010A] border border-[#A855F7]/30 text-2xl shadow-inner">
                        {selectedServer.flag}
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] block">
                          {t.activeNode}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-[#F8FAFC] flex items-center gap-2">
                          {selectedServer.name}
                          {selectedServer.isMultiHop && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#A855F7]/25 text-[#A855F7] border border-[#A855F7]/40">
                              2-HOP
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`telemetry-mono px-2.5 py-1 rounded-full text-xs font-semibold ${
                          selectedServer.latency < 50
                            ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                            : 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40'
                        }`}
                      >
                        {selectedServer.latency} ms
                      </span>
                      <div className="text-xs text-[#00F0FF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span className="hidden sm:inline">{t.changeNode}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#03010A] border border-dashed border-[#A855F7]/50 text-[#00F0FF] shadow-inner">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] block">
                          {t.activeNode}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-[#00F0FF]">
                          {language === 'fa' ? 'هیچ سروری افزوده نشده است' : 'No Server Configured'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-[#00F0FF] flex items-center gap-1 font-semibold">
                      <span>{language === 'fa' ? 'افزودن کانفیگ' : 'Import Config'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </div>
                  </div>
                )}
              </div>

              {/* Live Telemetry & Speed Gauges */}
              <SpeedTelemetry
                telemetry={telemetry}
                connectionState={connectionState}
                speedHistory={speedHistory}
                t={t}
              />

              {/* Hardware Security Quick Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Killswitch Card */}
                <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-[#A855F7]/25">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#00F0FF]" />
                      <span className="text-xs font-semibold text-[#F8FAFC]">
                        {t.killswitch}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {killswitchArmed ? 'Non-tunnel traffic blocked' : 'Unrestricted fallback'}
                    </p>
                  </div>

                  {/* Recessed switch with Neon Cyan Glow */}
                  <button
                    type="button"
                    onClick={() => {
                      setKillswitchArmed((prev) => !prev);
                      addLog(
                        !killswitchArmed ? 'secure' : 'warn',
                        `Killswitch ${!killswitchArmed ? 'ARMED' : 'DISARMED'} by operator`
                      );
                    }}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 bg-[#03010A] shadow-inner border border-white/10"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full transform transition duration-200 ${
                        killswitchArmed
                          ? 'translate-x-5 bg-[#00F0FF] shadow-[0_0_12px_#00F0FF]'
                          : 'translate-x-0 bg-[#475569]'
                      }`}
                    />
                  </button>
                </div>

                {/* Stealth Obfuscation Card */}
                <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-[#A855F7]/25">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#EC4899]" />
                      <span className="text-xs font-semibold text-[#F8FAFC]">
                        {t.stealthMode}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {stealthActive ? 'TLS 1.3 Camouflage active' : 'Raw UDP packets'}
                    </p>
                  </div>

                  {/* Recessed switch with Neon Magenta Glow */}
                  <button
                    type="button"
                    onClick={() => {
                      setStealthActive((prev) => !prev);
                      addLog(
                        'info',
                        `Stealth packet obfuscation ${!stealthActive ? 'enabled' : 'disabled'}`
                      );
                    }}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 bg-[#03010A] shadow-inner border border-white/10"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full transform transition duration-200 ${
                        stealthActive
                          ? 'translate-x-5 bg-[#EC4899] shadow-[0_0_12px_#EC4899]'
                          : 'translate-x-0 bg-[#475569]'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVERS (Relays & Nodes Screen) */}
          {activeTab === 'servers' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F8FAFC] tracking-tight">
                  {t.serversTitle}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Select an optimal low-latency node, double-hop cascade, or private endpoint
                </p>
              </div>

              <ServerList
                servers={servers}
                selectedServerId={selectedServer ? selectedServer.id : ''}
                onSelectServer={handleSelectServer}
                onToggleFavorite={handleToggleFavorite}
                onOpenCustomModal={() => setIsCustomModalOpen(true)}
                onPingServer={handlePingServer}
                onPingAll={handlePingAll}
                isPinging={isPinging}
                t={t}
              />
            </div>
          )}

          {/* TAB 3: DIAGNOSTICS & TELEMETRY */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F8FAFC] tracking-tight">
                  {t.diagnosticsTitle}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Real-time cryptographic verification, DNS leak auditing, and socket telemetry
                </p>
              </div>

              <DiagnosticsView
                logs={logs}
                telemetry={telemetry}
                connectionState={connectionState}
                activeServer={selectedServer}
                onClearLogs={() => setLogs([])}
                t={t}
              />
            </div>
          )}

          {/* TAB 4: PROTOCOLS & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F8FAFC] tracking-tight">
                  {t.protocolSettings}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Fine-tune tunnel transport layers, anti-DPI obfuscation, and split routing
                </p>
              </div>

              <SettingsView
                currentProtocol={activeProtocol}
                onSelectProtocol={(proto) => {
                  setActiveProtocol(proto);
                  addLog('crypto', `Active tunnel protocol set to ${proto}`);
                }}
                killswitchArmed={killswitchArmed}
                onToggleKillswitch={() => setKillswitchArmed((prev) => !prev)}
                splitTunnelingActive={splitTunnelingActive}
                onToggleSplitTunneling={() => setSplitTunnelingActive((prev) => !prev)}
                stealthActive={stealthActive}
                onToggleStealth={() => setStealthActive((prev) => !prev)}
                t={t}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Anchor (Thumb-zone) */}
      <BottomNavBar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        t={t}
      />

      {/* Custom Server Configuration Import Modal */}
      <CustomServerModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddServer={handleAddCustomServer}
        t={t}
      />
    </div>
  );
}
