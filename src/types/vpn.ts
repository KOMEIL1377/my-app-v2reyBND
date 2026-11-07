export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export type ProtocolType =
  | 'VLESS Reality'
  | 'VLESS TLS'
  | 'VLESS TCP (No TLS)'
  | 'VLESS WS (No TLS)'
  | 'VLESS gRPC (No TLS)'
  | 'VMess TLS'
  | 'VMess WS'
  | 'VMess WS (No TLS)'
  | 'VMess TCP (No TLS)'
  | 'WireGuard'
  | 'Shadowsocks AEAD'
  | 'Hysteria 2'
  | 'TUIC v5'
  | 'OpenVPN'
  | 'AmneziaWG';

export interface V2RayParams {
  uuid?: string;
  security?: 'reality' | 'tls' | 'none';
  transport?: 'tcp' | 'ws' | 'grpc' | 'h2';
  sni?: string;
  fingerprint?: string;
  publicKey?: string;
  shortId?: string;
  path?: string;
  flow?: string;
  alterId?: number;
  serviceName?: string;
  hostHeader?: string;
}

export interface AmneziaParams {
  Jc?: number;
  Jmin?: number;
  Jmax?: number;
  S1?: number;
  S2?: number;
  H1?: number;
  H2?: number;
  H3?: number;
  H4?: number;
}

export interface ServerNode {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  ip: string;
  latency: number; // in ms
  load: number; // 0-100%
  protocol: ProtocolType;
  isFavorite: boolean;
  category: 'europe' | 'americas' | 'asia' | 'multihop';
  isMultiHop?: boolean;
  entryNode?: string;
  exitNode?: string;
  ovpnConfig?: string;
  ovpnProto?: 'udp' | 'tcp';
  ovpnCipher?: string;
  amneziaParams?: AmneziaParams;
  v2rayParams?: V2RayParams;
  rawConfig?: string;
}

export interface TelemetryData {
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  totalDownloaded: number; // in MB
  totalUploaded: number; // in MB
  currentLatency: number; // in ms
  packetLoss: number; // percentage
  virtualIp: string;
  publicIp: string;
  dnsServer: string;
  cipher: string;
  handshakeTime: string;
  uptimeSeconds: number;
}

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  level: 'info' | 'secure' | 'warn' | 'crypto';
  message: string;
}

export type ActiveTab = 'tunnel' | 'servers' | 'diagnostics' | 'settings';

export type LanguageMode = 'en' | 'fa';
