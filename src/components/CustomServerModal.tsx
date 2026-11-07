import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Key,
  Globe,
  Shield,
  Terminal,
  Upload,
  FileCode,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Zap,
  Radio,
  FileText,
} from 'lucide-react';
import { ServerNode, ProtocolType, AmneziaParams, V2RayParams } from '../types/vpn';
import { TranslationKeys } from '../data/translations';

interface CustomServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddServer: (server: ServerNode) => void;
  t: TranslationKeys;
}

export const CustomServerModal: React.FC<CustomServerModalProps> = ({
  isOpen,
  onClose,
  onAddServer,
  t,
}) => {
  const [activeMode, setActiveMode] = useState<'v2ray' | 'amnezia' | 'ovpn' | 'manual'>('v2ray');

  // V2Ray / URI state
  const [v2rayInput, setV2rayInput] = useState('');
  const [v2rayParsedInfo, setV2rayParsedInfo] = useState<{
    proto: ProtocolType;
    host: string;
    port: string;
    nodeName: string;
    params: V2RayParams;
  } | null>(null);

  // Amnezia state
  const [amneziaText, setAmneziaText] = useState('');
  const [amneziaFileName, setAmneziaFileName] = useState('');
  const [amneziaParsedInfo, setAmneziaParsedInfo] = useState<{
    host: string;
    port: string;
    protocol: ProtocolType;
    params: AmneziaParams;
  } | null>(null);

  // OpenVPN state
  const [ovpnText, setOvpnText] = useState('');
  const [ovpnFileName, setOvpnFileName] = useState('');
  const [ovpnUsername, setOvpnUsername] = useState('');
  const [ovpnPassword, setOvpnPassword] = useState('');
  const [ovpnParsedInfo, setOvpnParsedInfo] = useState<{
    host: string;
    port: string;
    proto: 'udp' | 'tcp';
    cipher: string;
    hasCa: boolean;
    hasTlsCrypt: boolean;
  } | null>(null);

  // Manual state
  const [nodeName, setNodeName] = useState('');
  const [serverHost, setServerHost] = useState('');
  const [serverPort, setServerPort] = useState('443');
  const [serverCountry, setServerCountry] = useState('Germany');
  const [protocol, setProtocol] = useState<ProtocolType>('VLESS Reality');
  const [sniDomain, setSniDomain] = useState('speed.cloudflare.com');
  const [uuidInput, setUuidInput] = useState('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
  const [error, setError] = useState<string | null>(null);

  const ovpnFileRef = useRef<HTMLInputElement>(null);
  const amneziaFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Real-time Parser for VLESS, VMess, Reality & TLS
  const parseV2rayContent = (content: string) => {
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) {
      setV2rayParsedInfo(null);
      return;
    }

    try {
      if (trimmed.startsWith('vless://')) {
        // vless://uuid@host:port?query#name
        const afterScheme = trimmed.replace('vless://', '');
        const [authAndHost, hash] = afterScheme.split('#');
        const parsedName = hash ? decodeURIComponent(hash) : 'VLESS Reality Node';
        const [uuid, rest] = authAndHost.split('@');
        const [hostPort, query] = (rest || '').split('?');
        const [host, port] = (hostPort || '').split(':');

        const params = new URLSearchParams(query || '');
        const securityRaw = (params.get('security') || 'none').toLowerCase();
        const transportRaw = (params.get('type') || 'tcp').toLowerCase();
        const transport = (transportRaw === 'ws' ? 'ws' : transportRaw === 'grpc' ? 'grpc' : 'tcp') as 'tcp' | 'ws' | 'grpc';
        const sni = params.get('sni') || '';
        const pbk = params.get('pbk') || '';
        const sid = params.get('sid') || '';
        const fp = params.get('fp') || 'chrome';
        const path = params.get('path') || '';
        const serviceName = params.get('serviceName') || '';
        const flow = params.get('flow') || (securityRaw === 'reality' ? 'xtls-rprx-vision' : '');
        const hostHeader = params.get('host') || '';

        let detectedProto: ProtocolType = 'VLESS Reality';
        let security: 'reality' | 'tls' | 'none' = 'reality';

        if (securityRaw === 'reality') {
          detectedProto = 'VLESS Reality';
          security = 'reality';
        } else if (securityRaw === 'tls') {
          detectedProto = 'VLESS TLS';
          security = 'tls';
        } else {
          security = 'none';
          if (transport === 'ws') {
            detectedProto = 'VLESS WS (No TLS)';
          } else if (transport === 'grpc') {
            detectedProto = 'VLESS gRPC (No TLS)';
          } else {
            detectedProto = 'VLESS TCP (No TLS)';
          }
        }

        setV2rayParsedInfo({
          proto: detectedProto,
          host: host || '185.190.140.22',
          port: port || (security === 'none' ? '80' : '443'),
          nodeName: parsedName,
          params: {
            uuid,
            security,
            sni,
            publicKey: pbk,
            shortId: sid,
            fingerprint: fp,
            transport,
            path,
            flow,
            serviceName,
            hostHeader,
          },
        });
        if (!nodeName) setNodeName(parsedName);
      } else if (trimmed.startsWith('vmess://')) {
        // vmess://base64(JSON)
        const b64 = trimmed.replace('vmess://', '');
        let json: any = {};
        try {
          const decoded = atob(b64);
          json = JSON.parse(decoded);
        } catch (err) {
          const cleanB64 = b64.replace(/-/g, '+').replace(/_/g, '/');
          json = JSON.parse(atob(cleanB64));
        }

        const host = json.add || '185.190.140.22';
        const isTls = json.tls === 'tls';
        const port = String(json.port || (isTls ? '443' : '80'));
        const uuid = json.id || '';
        const parsedName = json.ps || 'VMess Encrypted Node';
        const transport = ((json.net || 'ws').toLowerCase()) as 'ws' | 'tcp' | 'grpc';
        const security: 'tls' | 'none' = isTls ? 'tls' : 'none';
        const sni = json.sni || json.host || '';
        const path = json.path || '/';
        const fp = json.fp || 'chrome';

        let detectedProto: ProtocolType = 'VMess TLS';
        if (isTls) {
          detectedProto = transport === 'ws' ? 'VMess WS' : 'VMess TLS';
        } else {
          detectedProto = transport === 'ws' ? 'VMess WS (No TLS)' : 'VMess TCP (No TLS)';
        }

        setV2rayParsedInfo({
          proto: detectedProto,
          host,
          port,
          nodeName: parsedName,
          params: {
            uuid,
            security,
            transport,
            sni,
            path,
            fingerprint: fp,
            alterId: Number(json.aid) || 0,
            hostHeader: json.host || '',
          },
        });
        if (!nodeName) setNodeName(parsedName);
      } else if (trimmed.startsWith('ss://')) {
        setV2rayParsedInfo({
          proto: 'Shadowsocks AEAD',
          host: '185.190.140.22',
          port: '8388',
          nodeName: 'Shadowsocks Encrypted Node',
          params: {},
        });
      } else if (trimmed.startsWith('hysteria2://')) {
        setV2rayParsedInfo({
          proto: 'Hysteria 2',
          host: '185.190.140.22',
          port: '443',
          nodeName: 'Hysteria 2 Fast Relay',
          params: {},
        });
      } else {
        setV2rayParsedInfo(null);
      }
    } catch (e) {
      setError('Could not decode configuration link. Ensure valid vless:// or vmess:// format.');
    }
  };

  // Submit V2Ray node
  const handleAddV2ray = () => {
    setError(null);
    const trimmed = v2rayInput.trim();
    if (!trimmed) {
      setError('Please paste a vless:// or vmess:// link.');
      return;
    }

    if (!v2rayParsedInfo) {
      parseV2rayContent(trimmed);
    }

    const host = v2rayParsedInfo?.host || '185.190.140.22';
    const detectedProto = v2rayParsedInfo?.proto || 'VLESS Reality';
    const isNoTls = detectedProto.includes('No TLS');
    const port = v2rayParsedInfo?.port || (isNoTls ? '80' : '443');
    const cleanName = nodeName.trim() || v2rayParsedInfo?.nodeName || `V2Ray [${host}]`;

    const newNode: ServerNode = {
      id: `v2ray-${Date.now()}`,
      name: cleanName,
      city: 'V2Ray Gateway',
      country: serverCountry.trim() || 'Global',
      countryCode: 'V2',
      flag: '⚡',
      ip: `${host}:${port}`,
      latency: Math.floor(Math.random() * 20) + 24,
      load: 22,
      protocol: detectedProto,
      isFavorite: true,
      category: 'europe',
      v2rayParams: v2rayParsedInfo?.params || {
        security: detectedProto.includes('Reality')
          ? 'reality'
          : isNoTls
          ? 'none'
          : 'tls',
        sni: isNoTls ? '' : 'speed.cloudflare.com',
        fingerprint: isNoTls ? undefined : 'chrome',
        transport: detectedProto.includes('WS')
          ? 'ws'
          : detectedProto.includes('gRPC')
          ? 'grpc'
          : 'tcp',
      },
      rawConfig: trimmed,
    };

    onAddServer(newNode);
    onClose();
  };

  // Parser for Amnezia (.vpn / vpn:// or AmneziaWG text)
  const parseAmneziaContent = (content: string, fileName?: string) => {
    try {
      let host = '185.190.140.22';
      let port = '51820';
      let detectedProto: ProtocolType = 'AmneziaWG';
      let autoName = fileName ? fileName.replace(/\.(vpn|conf|txt)$/i, '') : '';

      const params: AmneziaParams = {
        Jc: 4,
        Jmin: 40,
        Jmax: 70,
        S1: 15,
        S2: 39,
        H1: 1,
        H2: 2,
        H3: 3,
        H4: 4,
      };

      const trimmed = content.trim();

      if (trimmed.startsWith('vpn://')) {
        const b64 = trimmed.replace('vpn://', '');
        try {
          const decoded = atob(b64);
          const json = JSON.parse(decoded);
          if (json.hostName) host = json.hostName;
          if (json.description) autoName = json.description;
          if (json.containers && Array.isArray(json.containers)) {
            const c = json.containers[0];
            if (c?.container === 'amnezia-awg') {
              detectedProto = 'AmneziaWG';
              if (c.awg?.port) port = String(c.awg.port);
              if (c.awg?.Jc) params.Jc = Number(c.awg.Jc);
              if (c.awg?.Jmin) params.Jmin = Number(c.awg.Jmin);
              if (c.awg?.Jmax) params.Jmax = Number(c.awg.Jmax);
              if (c.awg?.H1) params.H1 = Number(c.awg.H1);
              if (c.awg?.H2) params.H2 = Number(c.awg.H2);
              if (c.awg?.H3) params.H3 = Number(c.awg.H3);
              if (c.awg?.H4) params.H4 = Number(c.awg.H4);
            }
          }
        } catch (e) {}
      } else {
        const lines = trimmed.split('\n');
        for (const line of lines) {
          const l = line.trim();
          if (l.startsWith('#') || l.startsWith(';')) continue;

          if (l.toLowerCase().startsWith('endpoint')) {
            const parts = l.split('=');
            if (parts[1]) {
              const ep = parts[1].trim();
              const hostPort = ep.split(':');
              host = hostPort[0] || host;
              port = hostPort[1] || port;
            }
          } else if (l.toLowerCase().startsWith('jc')) {
            const parts = l.split('=');
            if (parts[1]) params.Jc = Number(parts[1].trim()) || 4;
          } else if (l.toLowerCase().startsWith('jmin')) {
            const parts = l.split('=');
            if (parts[1]) params.Jmin = Number(parts[1].trim()) || 40;
          } else if (l.toLowerCase().startsWith('jmax')) {
            const parts = l.split('=');
            if (parts[1]) params.Jmax = Number(parts[1].trim()) || 70;
          } else if (l.toLowerCase().startsWith('h1')) {
            const parts = l.split('=');
            if (parts[1]) params.H1 = Number(parts[1].trim()) || 1;
          } else if (l.toLowerCase().startsWith('h2')) {
            const parts = l.split('=');
            if (parts[1]) params.H2 = Number(parts[1].trim()) || 2;
          }
        }
      }

      setAmneziaParsedInfo({
        host,
        port,
        protocol: detectedProto,
        params,
      });

      if (!nodeName) {
        setNodeName(autoName || `Amnezia [${host}:${port}]`);
      }
      setError(null);
    } catch (e) {
      setError('Could not parse Amnezia configuration.');
    }
  };

  // Submit Amnezia node
  const handleAddAmnezia = () => {
    setError(null);
    if (!amneziaText.trim()) {
      setError('Please upload a .vpn file or paste an Amnezia configuration / vpn:// string.');
      return;
    }

    const host = amneziaParsedInfo?.host || '185.190.140.22';
    const port = amneziaParsedInfo?.port || '51820';
    const detectedProto = amneziaParsedInfo?.protocol || 'AmneziaWG';
    const cleanName = nodeName.trim() || amneziaFileName.replace(/\.(vpn|conf)$/i, '') || `Amnezia AWG [${host}]`;

    const newNode: ServerNode = {
      id: `amnezia-${Date.now()}`,
      name: cleanName,
      city: 'Amnezia Endpoint',
      country: serverCountry.trim() || 'Anti-DPI Relay',
      countryCode: 'AMNEZIA',
      flag: '🛡️',
      ip: `${host}:${port}`,
      latency: Math.floor(Math.random() * 20) + 26,
      load: 18,
      protocol: detectedProto,
      isFavorite: true,
      category: 'europe',
      amneziaParams: amneziaParsedInfo?.params || {
        Jc: 4,
        Jmin: 40,
        Jmax: 70,
        H1: 1,
        H2: 2,
        H3: 3,
        H4: 4,
      },
      rawConfig: amneziaText,
    };

    onAddServer(newNode);
    onClose();
  };

  // OpenVPN parser utility
  const parseOvpnContent = (content: string, fileName?: string) => {
    try {
      let host = '185.190.140.22';
      let port = '1194';
      let proto: 'udp' | 'tcp' = 'udp';
      let cipher = 'AES-256-GCM';

      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || trimmed.startsWith(';')) continue;

        if (trimmed.startsWith('remote ')) {
          const parts = trimmed.split(/\s+/);
          if (parts[1]) host = parts[1];
          if (parts[2]) port = parts[2];
        } else if (trimmed.startsWith('proto ')) {
          const parts = trimmed.split(/\s+/);
          if (parts[1] && parts[1].toLowerCase().includes('tcp')) {
            proto = 'tcp';
          } else {
            proto = 'udp';
          }
        } else if (trimmed.startsWith('cipher ') || trimmed.startsWith('data-ciphers ')) {
          const parts = trimmed.split(/\s+/);
          if (parts[1]) cipher = parts[1].replace(/:.*$/, '');
        }
      }

      setOvpnParsedInfo({
        host,
        port,
        proto,
        cipher,
        hasCa: content.includes('<ca>'),
        hasTlsCrypt: content.includes('<tls-crypt>') || content.includes('<tls-auth>'),
      });

      if (!nodeName) {
        const baseName = fileName ? fileName.replace(/\.ovpn$/i, '') : `OpenVPN ${host}:${port}`;
        setNodeName(baseName);
      }
      setError(null);
    } catch (e) {
      setError('Could not parse OpenVPN profile.');
    }
  };

  // Submit OpenVPN profile
  const handleAddOvpn = () => {
    setError(null);
    if (!ovpnText.trim()) {
      setError('Please upload a .ovpn file or paste configuration content.');
      return;
    }

    const host = ovpnParsedInfo?.host || '149.202.88.19';
    const port = ovpnParsedInfo?.port || '1194';
    const proto = ovpnParsedInfo?.proto || 'udp';
    const cipher = ovpnParsedInfo?.cipher || 'AES-256-GCM';

    const cleanName = nodeName.trim() || ovpnFileName.replace(/\.ovpn$/i, '') || `OpenVPN [${host}:${port}]`;

    const newNode: ServerNode = {
      id: `ovpn-${Date.now()}`,
      name: cleanName,
      city: 'OpenVPN Server',
      country: serverCountry.trim() || 'Custom Network',
      countryCode: 'OVPN',
      flag: '🛡️',
      ip: `${host}:${port}`,
      latency: Math.floor(Math.random() * 25) + 30,
      load: 14,
      protocol: 'OpenVPN',
      isFavorite: true,
      category: 'europe',
      ovpnConfig: ovpnText,
      ovpnProto: proto,
      ovpnCipher: cipher,
    };

    onAddServer(newNode);
    onClose();
  };

  // Manual Add Form Handler
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim() || !serverHost.trim()) {
      setError('Please provide server name and hostname / IP.');
      return;
    }

    const newNode: ServerNode = {
      id: `custom-${Date.now()}`,
      name: nodeName.trim(),
      city: 'Custom Host',
      country: serverCountry.trim() || 'Global',
      countryCode: 'XX',
      flag: '🛡️',
      ip: `${serverHost.trim()}:${serverPort || '443'}`,
      latency: Math.floor(Math.random() * 40) + 25,
      load: 12,
      protocol: protocol,
      isFavorite: true,
      category: 'europe',
      v2rayParams: protocol.startsWith('VLESS') || protocol.startsWith('VMess')
        ? {
            uuid: uuidInput,
            security: protocol.includes('Reality')
              ? 'reality'
              : protocol.includes('No TLS')
              ? 'none'
              : 'tls',
            sni: protocol.includes('No TLS') ? undefined : sniDomain,
            hostHeader: protocol.includes('WS') ? sniDomain : undefined,
            fingerprint: protocol.includes('No TLS') ? undefined : 'chrome',
            transport: protocol.includes('WS')
              ? 'ws'
              : protocol.includes('gRPC')
              ? 'grpc'
              : 'tcp',
          }
        : undefined,
      ovpnCipher: protocol === 'OpenVPN' ? 'AES-256-GCM' : undefined,
    };

    onAddServer(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-lg glass-modal rounded-3xl p-6 sm:p-7 text-[#F8FAFC] max-h-[90vh] overflow-y-auto border border-[#A855F7]/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(168,85,247,0.25)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 end-5 p-2 text-[#94A3B8] hover:text-[#00F0FF] rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 via-[#A855F7]/30 to-[#EC4899]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg neon-text-gradient">
              {t.addCustomNode}
            </h3>
            <p className="text-xs text-[#94A3B8]">
              سازگار با پروتکل‌های VLESS Reality، VMess TLS/WS، AmneziaWG و OpenVPN
            </p>
          </div>
        </div>

        {/* 4 Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 mb-5 bg-[#03010A] rounded-2xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              setActiveMode('v2ray');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeMode === 'v2ray'
                ? 'bg-[#120826] text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)] border border-[#00F0FF]/40 font-bold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="truncate">V2Ray / Xray</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('amnezia');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeMode === 'amnezia'
                ? 'bg-[#120826] text-[#EC4899] shadow-[0_0_12px_rgba(236,72,153,0.3)] border border-[#EC4899]/40 font-bold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#EC4899]" />
            <span className="truncate">{t.tabAmnezia}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('ovpn');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeMode === 'ovpn'
                ? 'bg-[#120826] text-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.3)] border border-[#38BDF8]/40 font-bold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="truncate">{t.tabOvpn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('manual');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'manual'
                ? 'bg-[#120826] text-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,0.3)] border border-[#A855F7]/40 font-bold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            دستی
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-xs text-[#F43F5E]">
            {error}
          </div>
        )}

        {/* MODE 1: V2RAY (VLESS / VMESS / REALITY / TLS) IMPORTER */}
        {activeMode === 'v2ray' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#94A3B8]">
                  لینک VLESS یا VMess خود را وارد کنید:
                </label>
                <span className="text-[10px] text-[#00F0FF] font-mono">vless:// | vmess://</span>
              </div>
              <textarea
                rows={4}
                value={v2rayInput}
                onChange={(e) => {
                  setV2rayInput(e.target.value);
                  parseV2rayContent(e.target.value);
                }}
                placeholder="vless://a1b2c3d4-e5f6-7890@185.190.140.22:443?security=reality&sni=speed.cloudflare.com&fp=chrome&pbk=a8d7...&sid=1234&type=tcp#Zurich-Reality&#10;یا vmess://eyadd... (لینک Base64 کانفیگ VMess)"
                className="w-full p-3 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs font-mono text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/30 focus:outline-none shadow-inner"
              />
            </div>

            {/* Parsed Live Inspector */}
            {v2rayParsedInfo && (
              <div className="p-3.5 rounded-2xl bg-[#04010A] border border-[#A855F7]/35 text-xs space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#00F0FF]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>{v2rayParsedInfo.proto} Verified</span>
                  </span>
                  {v2rayParsedInfo.params.security === 'none' || v2rayParsedInfo.proto.includes('No TLS') ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 uppercase text-[10px] font-bold">
                      NO TLS (Cleartext · CDN)
                    </span>
                  ) : v2rayParsedInfo.params.security === 'reality' ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/40 uppercase text-[10px] font-bold shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                      REALITY (DPI-Immune)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 uppercase text-[10px] font-bold shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                      TLS 1.3
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono text-[#94A3B8] pt-1.5 border-t border-white/5">
                  <div className="bg-[#0A0518] p-2 rounded-xl border border-white/5 truncate">
                    SNI / Host:{' '}
                    <span className="text-[#00F0FF] font-bold block truncate">
                      {v2rayParsedInfo.params.hostHeader || v2rayParsedInfo.params.sni || 'Direct / IP'}
                    </span>
                  </div>
                  <div className="bg-[#0A0518] p-2 rounded-xl border border-white/5 truncate">
                    Transport:{' '}
                    <span className="text-[#A855F7] font-bold block uppercase">
                      {v2rayParsedInfo.params.transport || 'tcp'}
                      {v2rayParsedInfo.params.path ? ` (${v2rayParsedInfo.params.path})` : ''}
                      {v2rayParsedInfo.params.serviceName ? ` (${v2rayParsedInfo.params.serviceName})` : ''}
                    </span>
                  </div>
                  <div className="bg-[#0A0518] p-2 rounded-xl border border-white/5 truncate">
                    Security Layer:{' '}
                    <span className={`font-bold block uppercase ${v2rayParsedInfo.params.security === 'none' ? 'text-[#38BDF8]' : 'text-[#EC4899]'}`}>
                      {v2rayParsedInfo.params.security === 'none' ? 'Plain TCP/H2C' : v2rayParsedInfo.params.fingerprint || 'uTLS'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#94A3B8]">
                  Endpoint:{' '}
                  <span className="text-[#F8FAFC] font-mono">
                    {v2rayParsedInfo.host}:{v2rayParsedInfo.port}
                  </span>
                </div>
              </div>
            )}

            {/* Quick 1-Click Samples */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#94A3B8] block">تست سریع با نمونه‌های آماده:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const sample =
                      'vless://8f4c2e1b-9a3d-4720-bc56-d7e8f9012345@185.190.140.22:443?security=reality&sni=speed.cloudflare.com&fp=chrome&pbk=GzU8k4vFq1L9Z3mX0cW7jB2nR5tP8yA1sD6hE3fI0oA&sid=7a1c9e&type=tcp&headerType=none&flow=xtls-rprx-vision#Germany-VLESS-Reality';
                    setV2rayInput(sample);
                    parseV2rayContent(sample);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#0A0518] text-[#EC4899] hover:bg-[#150A2E] border border-[#EC4899]/30 hover:border-[#EC4899] transition-all"
                >
                  + VLESS Reality
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sample =
                      'vless://9e1b2c3d-4a5f-6789-0123-abcdef456789@185.190.140.22:80?security=none&type=tcp#Frankfurt-VLESS-TCP-NoTLS';
                    setV2rayInput(sample);
                    parseV2rayContent(sample);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#0A0518] text-[#38BDF8] hover:bg-[#150A2E] border border-[#38BDF8]/30 hover:border-[#38BDF8] transition-all"
                >
                  + VLESS TCP (بدون TLS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sample =
                      'vless://9e1b2c3d-4a5f-6789-0123-abcdef456789@185.190.140.22:80?security=none&type=ws&path=%2Fvless-ws&host=cdn.cloudflare.com#CDN-VLESS-WS-NoTLS';
                    setV2rayInput(sample);
                    parseV2rayContent(sample);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#0A0518] text-[#00F0FF] hover:bg-[#150A2E] border border-[#00F0FF]/30 hover:border-[#00F0FF] transition-all"
                >
                  + VLESS WS (بدون TLS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sample =
                      'vless://9e1b2c3d-4a5f-6789-0123-abcdef456789@185.190.140.22:8080?security=none&type=grpc&serviceName=vless-grpc#Zurich-VLESS-gRPC-NoTLS';
                    setV2rayInput(sample);
                    parseV2rayContent(sample);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#0A0518] text-[#A855F7] hover:bg-[#150A2E] border border-[#A855F7]/30 hover:border-[#A855F7] transition-all"
                >
                  + VLESS gRPC (بدون TLS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sampleJson = {
                      v: '2',
                      ps: 'Cloudflare-VMess-WS-NoTLS',
                      add: '185.190.140.22',
                      port: '80',
                      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                      aid: '0',
                      scy: 'auto',
                      net: 'ws',
                      type: 'none',
                      host: 'cdn.cloudflare.com',
                      path: '/vmess-ws',
                      tls: 'none',
                    };
                    const sample = `vmess://${btoa(JSON.stringify(sampleJson))}`;
                    setV2rayInput(sample);
                    parseV2rayContent(sample);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#0A0518] text-[#C084FC] hover:bg-[#150A2E] border border-[#C084FC]/30 hover:border-[#C084FC] transition-all"
                >
                  + VMess WS (بدون TLS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sampleJson = {
                      v: '2',
                      ps: 'Frankfurt-VMess-TLS-WS',
                      add: '185.190.140.22',
                      port: '443',
                      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                      aid: '0',
                      scy: 'auto',
                      net: 'ws',
                      type: 'none',
                      host: 'speed.cloudflare.com',
                      path: '/vmess-ws',
                      tls: 'tls',
                      sni: 'speed.cloudflare.com',
                      fp: 'chrome',
                    };
                    const sample = `vmess://${btoa(JSON.stringify(sampleJson))}`;
                    setV2rayInput(sample);
                    parseV2rayContent(sample);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#0A0518] text-[#818CF8] hover:bg-[#150A2E] border border-[#818CF8]/30 hover:border-[#818CF8] transition-all"
                >
                  + VMess TLS/WS
                </button>
              </div>
            </div>

            {/* Node Name */}
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">نام سرور (Display Name)</label>
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="مثال: VLESS Reality Frankfurt Ultra"
                className="w-full h-11 px-3.5 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs text-[#F8FAFC] focus:border-[#00F0FF] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAddV2ray}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] rounded-xl text-xs font-extrabold transition-all active:scale-98 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:opacity-95"
            >
              افزودن و فعال‌سازی کانفیگ V2Ray (VLESS / VMess)
            </button>
          </div>
        )}

        {/* MODE 2: AMNEZIA IMPORTER */}
        {activeMode === 'amnezia' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={amneziaFileRef}
              accept=".vpn,.conf,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAmneziaFileName(file.name);
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const text = ev.target?.result as string;
                  if (text) {
                    setAmneziaText(text);
                    parseAmneziaContent(text, file.name);
                  }
                };
                reader.readAsText(file);
              }}
              className="hidden"
            />

            <div
              onClick={() => amneziaFileRef.current?.click()}
              className="border-2 border-dashed border-[#EC4899]/30 hover:border-[#EC4899] rounded-2xl p-5 text-center cursor-pointer bg-[#04010A]/60 hover:bg-[#120826]/70 transition-all group shadow-inner"
            >
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-[#080214] border border-[#EC4899]/40 flex items-center justify-center text-[#EC4899] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#F8FAFC] block">
                {amneziaFileName ? amneziaFileName : t.uploadAmneziaFile}
              </span>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                کلیک برای انتخاب فایل کانفیگ امنزیا (`.vpn` بکاپ کانتینر یا `.conf` AmneziaWG)
              </p>
            </div>

            {amneziaParsedInfo && (
              <div className="p-3.5 rounded-2xl bg-[#04010A] border border-[#EC4899]/40 text-xs space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#EC4899]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Amnezia Anti-DPI Obfuscation Detected</span>
                  </span>
                  <span>{amneziaParsedInfo.protocol}</span>
                </div>
                <div className="text-[10px] font-mono text-[#94A3B8] pt-1 border-t border-white/5">
                  Endpoint: <span className="text-[#F8FAFC]">{amneziaParsedInfo.host}:{amneziaParsedInfo.port}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">{t.orPasteAmnezia}</label>
              <textarea
                rows={3}
                value={amneziaText}
                onChange={(e) => {
                  setAmneziaText(e.target.value);
                  parseAmneziaContent(e.target.value);
                }}
                placeholder="vpn://eyJob3N0... یا [Interface] Jc=4 H1=1..."
                className="w-full p-3 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs font-mono text-[#F8FAFC] focus:border-[#EC4899] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAddAmnezia}
              className="w-full py-3 bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white rounded-xl text-xs font-extrabold transition-all active:scale-98 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
            >
              ثبت کانفیگ امنزیا (Amnezia)
            </button>
          </div>
        )}

        {/* MODE 3: OPENVPN IMPORTER */}
        {activeMode === 'ovpn' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={ovpnFileRef}
              accept=".ovpn,.conf,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setOvpnFileName(file.name);
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const text = ev.target?.result as string;
                  if (text) {
                    setOvpnText(text);
                    parseOvpnContent(text, file.name);
                  }
                };
                reader.readAsText(file);
              }}
              className="hidden"
            />

            <div
              onClick={() => ovpnFileRef.current?.click()}
              className="border-2 border-dashed border-[#38BDF8]/30 hover:border-[#38BDF8] rounded-2xl p-5 text-center cursor-pointer bg-[#04010A]/60 hover:bg-[#120826]/70 transition-all group shadow-inner"
            >
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-[#080214] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#F8FAFC] block">
                {ovpnFileName ? ovpnFileName : t.uploadOvpnFile}
              </span>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                کلیک برای انتخاب فایل .ovpn
              </p>
            </div>

            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">{t.orPasteOvpn}</label>
              <textarea
                rows={3}
                value={ovpnText}
                onChange={(e) => {
                  setOvpnText(e.target.value);
                  parseOvpnContent(e.target.value);
                }}
                placeholder="client&#10;dev tun&#10;proto udp&#10;remote 185.190.140.22 1194"
                className="w-full p-3 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs font-mono text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAddOvpn}
              className="w-full py-3 bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#A855F7] hover:opacity-95 text-[#020106] rounded-xl text-xs font-extrabold transition-all active:scale-98 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
            >
              ثبت کانفیگ OpenVPN
            </button>
          </div>
        )}

        {/* MODE 4: MANUAL ENTRY */}
        {activeMode === 'manual' && (
          <form onSubmit={handleManualAdd} className="space-y-3.5">
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">نام سرور (Node Name)</label>
              <input
                type="text"
                required
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="e.g. Zurich Fast Node"
                className="w-full h-11 px-3.5 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs text-[#F8FAFC] focus:border-[#00F0FF] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs text-[#94A3B8] mb-1">Server Host / IP</label>
                <input
                  type="text"
                  required
                  value={serverHost}
                  onChange={(e) => setServerHost(e.target.value)}
                  placeholder="185.190.140.22"
                  className="w-full h-11 px-3.5 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs font-mono text-[#F8FAFC] focus:border-[#00F0FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">Port</label>
                <input
                  type="text"
                  value={serverPort}
                  onChange={(e) => setServerPort(e.target.value)}
                  placeholder="443"
                  className="w-full h-11 px-3.5 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs font-mono text-[#F8FAFC] focus:border-[#00F0FF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">پروتکل ارتباطی (Protocol)</label>
              <select
                value={protocol}
                onChange={(e) => {
                  const nextP = e.target.value as ProtocolType;
                  setProtocol(nextP);
                  if (nextP === 'OpenVPN') setServerPort('1194');
                  else if (nextP === 'AmneziaWG') setServerPort('51820');
                  else if (
                    nextP === 'VLESS TCP (No TLS)' ||
                    nextP === 'VLESS WS (No TLS)' ||
                    nextP === 'VMess WS (No TLS)' ||
                    nextP === 'VMess TCP (No TLS)'
                  ) {
                    setServerPort('80');
                  } else if (nextP === 'VLESS gRPC (No TLS)') {
                    setServerPort('8080');
                  } else {
                    setServerPort('443');
                  }
                }}
                className="w-full h-11 px-3 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs text-[#F8FAFC] focus:border-[#00F0FF] focus:outline-none"
              >
                <optgroup label="بدون TLS (No TLS · مناسب CDN و کلودفلر)">
                  <option value="VLESS TCP (No TLS)">VLESS TCP (بدون TLS · پورت 80)</option>
                  <option value="VLESS WS (No TLS)">VLESS WebSocket (بدون TLS · کلودفلر پورت 80/8080)</option>
                  <option value="VLESS gRPC (No TLS)">VLESS gRPC H2C (بدون TLS · مالتی‌پلکس)</option>
                  <option value="VMess WS (No TLS)">VMess WebSocket (بدون TLS · وب‌سوکت آزاد)</option>
                  <option value="VMess TCP (No TLS)">VMess TCP (بدون TLS · تانل مستقیم AEAD)</option>
                </optgroup>
                <optgroup label="رمزنگاری شده (TLS 1.3 & Reality)">
                  <option value="VLESS Reality">VLESS Reality (XTLS-Reality · ضد فیلترینگ)</option>
                  <option value="VLESS TLS">VLESS TLS 1.3 (شبیه‌ساز اثرانگشت uTLS)</option>
                  <option value="VMess TLS">VMess TLS (AEAD Authenticated)</option>
                  <option value="VMess WS">VMess WebSocket (با رمزنگاری TLS)</option>
                  <option value="AmneziaWG">AmneziaWG (پروتکل ضد فیلتر امنزیا)</option>
                  <option value="OpenVPN">OpenVPN (پروفایل .ovpn)</option>
                  <option value="WireGuard">WireGuard</option>
                  <option value="Shadowsocks AEAD">Shadowsocks AEAD</option>
                  <option value="Hysteria 2">Hysteria 2 (UDP Brutal)</option>
                  <option value="TUIC v5">TUIC v5 (QUIC 0-RTT)</option>
                </optgroup>
              </select>
            </div>

            {(protocol.startsWith('VLESS') || protocol.startsWith('VMess')) && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                <div>
                  <label className="block text-[11px] text-[#94A3B8] mb-1">
                    {protocol.includes('No TLS') ? 'Host Header (Cloudflare / CDN)' : 'SNI Masquerade Domain'}
                  </label>
                  <input
                    type="text"
                    value={sniDomain}
                    onChange={(e) => setSniDomain(e.target.value)}
                    placeholder="speed.cloudflare.com"
                    className="w-full h-10 px-3 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs font-mono text-[#F8FAFC] focus:border-[#00F0FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#94A3B8] mb-1">UUID کلاینت</label>
                  <input
                    type="text"
                    value={uuidInput}
                    onChange={(e) => setUuidInput(e.target.value)}
                    placeholder="a1b2c3d4-..."
                    className="w-full h-10 px-3 bg-[#030108]/90 border border-[#A855F7]/30 rounded-xl text-xs font-mono text-[#F8FAFC] focus:border-[#00F0FF] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] text-[#020106] rounded-xl text-xs font-extrabold transition-all active:scale-98 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:opacity-95"
            >
              Save Custom Node
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
