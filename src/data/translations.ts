export interface TranslationKeys {
  appName: string;
  appSubtitle: string;
  tabTunnel: string;
  tabServers: string;
  tabDiagnostics: string;
  tabSettings: string;
  statusDisconnected: string;
  statusConnecting: string;
  statusConnected: string;
  statusDisconnecting: string;
  statusSubDisconnected: string;
  statusSubConnecting: string;
  statusSubConnected: string;
  activeNode: string;
  changeNode: string;
  killswitch: string;
  killswitchDesc: string;
  splitTunneling: string;
  splitTunnelingDesc: string;
  stealthMode: string;
  stealthModeDesc: string;
  downloadSpeed: string;
  uploadSpeed: string;
  latency: string;
  packetLoss: string;
  dataTransferred: string;
  uptime: string;
  tapToConnect: string;
  tapToDisconnect: string;
  securingHandshake: string;
  serversTitle: string;
  allServers: string;
  fastest: string;
  europe: string;
  americas: string;
  asia: string;
  multihop: string;
  favorites: string;
  searchServers: string;
  addCustomNode: string;
  importConfig: string;
  pingAll: string;
  diagnosticsTitle: string;
  cipherSuite: string;
  virtualIp: string;
  realIpMasked: string;
  dnsStatus: string;
  dnsZeroLeaks: string;
  testDnsLeaks: string;
  testingLeaks: string;
  logsTerminal: string;
  clearLogs: string;
  copyLogs: string;
  speedTest: string;
  runSpeedTest: string;
  runningTest: string;
  protocolSettings: string;
  activeProtocol: string;
  mtuSize: string;
  customDns: string;
  blockAllTraffic: string;
  securityPolicies: string;
  mobileView: string;
  desktopView: string;
  languageToggle: string;
  buySubscription: string;
  buySubscriptionSub: string;
  tabOvpn: string;
  uploadOvpnFile: string;
  orPasteOvpn: string;
  ovpnCredentials: string;
  tabAmnezia: string;
  uploadAmneziaFile: string;
  orPasteAmnezia: string;
}

export const translations: Record<'en' | 'fa', TranslationKeys> = {
  en: {
    appName: 'V2reyBND',
    appSubtitle: 'High-Assurance Secure Tunnel',
    tabTunnel: 'Tunnel',
    tabServers: 'Servers',
    tabDiagnostics: 'Telemetry',
    tabSettings: 'Protocols',
    statusDisconnected: 'DISCONNECTED',
    statusConnecting: 'SECURING TUNNEL...',
    statusConnected: 'PROTECTED',
    statusDisconnecting: 'TERMINATING...',
    statusSubDisconnected: 'Your network telemetry is unshielded',
    statusSubConnecting: 'Negotiating ChaCha20-Poly1305 handshake',
    statusSubConnected: 'Tunnel verified · Zero DNS leaks detected',
    activeNode: 'Routing Node',
    changeNode: 'Switch Server',
    killswitch: 'Hard Killswitch',
    killswitchDesc: 'Block non-tunnel traffic immediately if disconnected',
    splitTunneling: 'Split Tunneling',
    splitTunnelingDesc: 'Route selected high-trust applications directly',
    stealthMode: 'Stealth Obfuscation',
    stealthModeDesc: 'Camouflage VPN packets into standard TLS 1.3 streams',
    downloadSpeed: 'Download',
    uploadSpeed: 'Upload',
    latency: 'Ping',
    packetLoss: 'Loss',
    dataTransferred: 'Session Transfer',
    uptime: 'Uptime',
    tapToConnect: 'TAP TO ENGAGE',
    tapToDisconnect: 'DISCONNECT',
    securingHandshake: 'AUTHENTICATING',
    serversTitle: 'Nodes & Relays',
    allServers: 'All Nodes',
    fastest: 'Low Latency',
    europe: 'Europe',
    americas: 'Americas',
    asia: 'Asia-Pacific',
    multihop: 'Multi-Hop',
    favorites: 'Favorites',
    searchServers: 'Filter by city, country or protocol...',
    addCustomNode: 'Add Custom Server',
    importConfig: 'Import Config URI',
    pingAll: 'Ping All',
    diagnosticsTitle: 'Hardware & Telemetry',
    cipherSuite: 'Cryptographic Suite',
    virtualIp: 'Virtual Endpoint IP',
    realIpMasked: 'ISP Geolocation Masked',
    dnsStatus: 'DNS Leak Audit',
    dnsZeroLeaks: 'Clean · 0 Leaks Detected',
    testDnsLeaks: 'Run DNS Audit',
    testingLeaks: 'Probing 12 Global Resolvers...',
    logsTerminal: 'Live Handshake Log',
    clearLogs: 'Clear',
    copyLogs: 'Copy Log',
    speedTest: 'Network Stress Benchmark',
    runSpeedTest: 'Run Live Speed Test',
    runningTest: 'Measuring Bandwidth...',
    protocolSettings: 'Protocol Architecture',
    activeProtocol: 'Active Routing Protocol',
    mtuSize: 'MTU Payload Size',
    customDns: 'Secure DNS Provider',
    blockAllTraffic: 'Leak Prevention Invariants',
    securityPolicies: 'Routing Policies',
    mobileView: 'Mobile View',
    desktopView: 'Station View',
    languageToggle: 'فارسی (RTL)',
    buySubscription: 'Buy Subscription & Free Trial',
    buySubscriptionSub: 'Instant access & test config via @bndteam_bot',
    tabOvpn: 'OpenVPN (.ovpn)',
    uploadOvpnFile: 'Upload .ovpn profile',
    orPasteOvpn: 'Or paste raw .ovpn configuration here',
    ovpnCredentials: 'Auth Credentials (Optional)',
    tabAmnezia: 'Amnezia (AWG)',
    uploadAmneziaFile: 'Upload .vpn or AmneziaWG file',
    orPasteAmnezia: 'Or paste vpn:// link or Amnezia text config',
  },
  fa: {
    appName: 'V2reyBND',
    appSubtitle: 'تونل رمزگذاری با درجه اطمینان بالا',
    tabTunnel: 'تونل',
    tabServers: 'سرورها',
    tabDiagnostics: 'تله‌متری',
    tabSettings: 'پروتکل‌ها',
    statusDisconnected: 'غیر متصل',
    statusConnecting: 'در حال برقراری تونل امن...',
    statusConnected: 'محافظت شده',
    statusDisconnecting: 'قطع اتصال...',
    statusSubDisconnected: 'ارتباطات اینترنتی شما بدون رمزنگاری است',
    statusSubConnecting: 'در حال تبادل کلید ChaCha20-Poly1305',
    statusSubConnected: 'تونل تایید شد · هیچ نشت دی‌ان‌اس مشاهده نشد',
    activeNode: 'گره مسیریابی',
    changeNode: 'تغییر سرور',
    killswitch: 'کلید قطع اضطراری',
    killswitchDesc: 'مسدودسازی آنی تمام ترافیک در صورت قطع تونل',
    splitTunneling: 'تونل‌بندی تفکیکی',
    splitTunnelingDesc: 'هدایت برنامه‌های مطمئن از مسیر اینترنت محلی',
    stealthMode: 'استتار بسته‌ها (TLS 1.3)',
    stealthModeDesc: 'پنهان‌سازی ترافیک پروکسی به عنوان وب معمولی',
    downloadSpeed: 'دانلود',
    uploadSpeed: 'آپلود',
    latency: 'پینگ',
    packetLoss: 'افت بسته',
    dataTransferred: 'حجم تبادل یافته',
    uptime: 'مدت اتصال',
    tapToConnect: 'برای اتصال لمس کنید',
    tapToDisconnect: 'قطع اتصال',
    securingHandshake: 'احراز هویت رمزنگاری',
    serversTitle: 'گره‌ها و رله‌ها',
    allServers: 'همه سرورها',
    fastest: 'کمترین تاخیر',
    europe: 'اروپا',
    americas: 'آمریکا',
    asia: 'آسیا-اقیانوسیه',
    multihop: 'چند پرشی',
    favorites: 'نشان‌شده‌ها',
    searchServers: 'جستجو بر اساس شهر، کشور یا پروتکل...',
    addCustomNode: 'افزودن سرور سفارشی',
    importConfig: 'وارد کردن کانفیگ',
    pingAll: 'بررسی پینگ همه',
    diagnosticsTitle: 'تله‌متری و ابزار تشخیص',
    cipherSuite: 'مجموعه رمزنگاری',
    virtualIp: 'آدرس آی‌پی مجازی',
    realIpMasked: 'مکان واقعی اپراتور مخفی است',
    dnsStatus: 'بررسی نشت DNS',
    dnsZeroLeaks: 'ایمن · بدون هیچ‌گونه نشت',
    testDnsLeaks: 'آزمایش نشت دی‌ان‌اس',
    testingLeaks: 'در حال بررسی ۱۲ ریزالور جهانی...',
    logsTerminal: 'لاگ زنده نشست',
    clearLogs: 'پاکسازی',
    copyLogs: 'کپی لاگ',
    speedTest: 'آزمایش سرعت و ثبات',
    runSpeedTest: 'شروع تست سرعت زنده',
    runningTest: 'اندازه‌گیری پهنای باند...',
    protocolSettings: 'معماری پروتکل‌ها',
    activeProtocol: 'پروتکل فعال تونل',
    mtuSize: 'اندازه بسته‌های MTU',
    customDns: 'سرویس‌دهنده امن DNS',
    blockAllTraffic: 'سیاست‌های ضدنشت اطلاعات',
    securityPolicies: 'قوانین مسیریابی',
    mobileView: 'نمای همراه',
    desktopView: 'نمای میزکار',
    languageToggle: 'English (LTR)',
    buySubscription: 'خرید اشتراک و تست رایگان',
    buySubscriptionSub: 'دریافت آنی کانفیگ اختصاصی و تست رایگان از ربات تلگرام',
    tabOvpn: 'کانفیگ OpenVPN',
    uploadOvpnFile: 'آپلود فایل .ovpn',
    orPasteOvpn: 'یا چسباندن متن فایل .ovpn در این قسمت',
    ovpnCredentials: 'نام کاربری و رمز عبور (در صورت نیاز)',
    tabAmnezia: 'امنزیا (Amnezia)',
    uploadAmneziaFile: 'آپلود فایل .vpn یا کانفیگ AmneziaWG',
    orPasteAmnezia: 'یا چسباندن لینک vpn:// یا متن کانفیگ Amnezia',
  },
};
