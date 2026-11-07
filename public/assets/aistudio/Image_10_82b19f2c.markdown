---
name: Obsidian Shield
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#d0c6ab'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#999077'
  outline-variant: '#4d4732'
  surface-tint: '#e9c400'
  primary: '#fff6df'
  on-primary: '#3a3000'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#705d00'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#f8f4ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#d7d6ff'
  on-tertiary-container: '#494bd7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses high-security infrastructure through a luxury utilitarian lens: dark obsidian surfaces, crystalline glass highlights, and vibrant golden amber telemetry. Built specifically for network proxy and VPN clients, it balances technical precision with high-assurance calm.

### Aesthetics & Design Movement
- **Atmospheric Glassmorphism & Cyber-Minimalism:** Translucent slate panes layered over deep cosmic blacks, defined by micro-fine luminous borders rather than flat divider lines.
- **Precision Telemetry:** Instrumental readability inspired by avionics and cryptographic hardware displays. Golden amber serves as the focal point for interaction and power states, while emerald green confirms uncompromised tunnels and encrypted states.
- **Bilingual Balance:** Engineered from the ground up for harmonious bidirectional (RTL/LTR) layouts, treating Persian and Latin glyphs with identical optical weight, geometric rhythm, and spatial dignity.

## Colors

The palette operates in strict hierarchy: absolute obsidian anchors the backplane, layered slate establishes interactive planes, and concentrated auric and emerald emissions provide contextual clarity.

### Palette Architecture
- **Primary (`#FFD700` - Radiant Amber):** Reserved for primary switches, active connection triggers, routing node selections, and telemetry peaks. Use with high deliberate contrast against obsidian tones.
- **Secondary (`#10B981` - Emerald Shield):** Denotes secure tunnel verified, zero packet loss, active killswitch, and latency under 40ms. Glow effects radiate at 15–20% opacity.
- **Tertiary (`#6366F1` - Quantum Indigo):** Used for cryptographic protocols, multi-hop routing badges, and diagnostic metrics.
- **Neutral Base (`#0B0F19` - Deep Obsidian):** Canvas-level ground plane that maximizes OLED power efficiency and delivers depth behind blurred glass plates.
- **Surface Elevation (`#131A2A` - Slate Void):** Intermediate foundation for cards, sheets, and bottom navigation modules.
- **Surface Highlight (`#1E293B` - Frosted Edge):** Used at 40–60% opacity for glass backdrops and 1px stroke boundaries.
- **Text & Status Tokens:**
  - High Emphasis: `#F8FAFC` (Slate 50)
  - Medium Emphasis: `#94A3B8` (Slate 400)
  - Disabled/Muted: `#475569` (Slate 600)
  - Danger/Disconnected: `#EF4444` (Crimson)
  - Caution/DNS Leak Warning: `#F59E0B` (Warm Amber)

## Typography

The type system blends technical precision with smooth readability across mixed script environments.

### Font System & Script Pairing
- **Latin Display:** `Space Grotesk` supplies an engineered, angular structure for big status readouts, server names, and protocol switches.
- **Latin Body:** `Plus Jakarta Sans` delivers crisp legibility at compact mobile scale with modern geometry.
- **Code & Diagnostics:** `JetBrains Mono` formats IP addresses, ping rates, cryptographic handshakes, and transfer totals.
- **RTL & Persian Strategy:** The system integrates `Vazirmatn` as the primary font family for Persian text nodes, cascading seamlessly to system sans-serif fallback chains. In Persian mode, headline weights scale down by one increment (from 700 to 600) to balance optical densities with the Latin display face. Baseline heights maintain uniform metric spacing to eliminate layout shifts when toggling language modes.

## Layout & Spacing

Layout geometry follows an 8pt architectural rhythm, calibrated for single-thumb mobile operation while preserving air around high-stakes controls.

### Grid & Ergonomics
- **Mobile Container:** Fluid 4-column column system with an edge safe zone margin of `16px` (`margin-mobile`), expanding to `20px` (`margin`) on larger tablets and folding screens.
- **Thumb Zone Layout:** Primary state toggles and connection dials occupy the lower two-thirds of the viewport. System health, speed graphs, and routing selections rest above.
- **Directional Mirroring (RTL):** Lateral gutters, server list iconography, back chevrons, and ping indicator pins mirror on horizontal axises automatically. Monospaced network figures (e.g., `192.168.1.1`, `54.2 ms`) remain strictly LTR to preserve data integrity.

## Elevation & Depth

Depth is articulated through optical translucency, layered lighting, and sub-pixel strokes rather than muddy drop shadows.

### Glass Architecture
- **Layer 0 (Canvas):** Base background `#0B0F19` with ambient radial color gradients (0.08 opacity amber or emerald depending on connection state) hovering at center viewport.
- **Layer 1 (Card & Module Deck):** `#131A2A` at 65% opacity, backdrop-filter blur of `16px`, bordered by a 1px border of `#FFFFFF` at 8% opacity.
- **Layer 2 (Floating Modals & Flyouts):** `#1E293B` at 80% opacity, backdrop-filter blur of `24px`, with top-edge specular highlight (1px gradient from `#FFFFFF` at 18% opacity to `#FFFFFF` at 2%).
- **Luminescent Highlights:** When secure connection engages, cards acquire an ambient outward ring: `0 0 24px -4px rgba(16, 185, 129, 0.15)`. During connection negotiation or standby, the aura shifts to golden amber: `0 0 24px -4px rgba(255, 215, 0, 0.12)`.

## Shapes

The physical perimeter language is unified at level `2` (Rounded). This brings modern hardware curvature that softens high-tech cyber surfaces without drifting into playful or cartoonish territory.

### Corner Token Rules
- Standard Buttons & Action Cards: `rounded` (`0.5rem` / `8px`).
- Glass Cards, Metrics Panels, Server Rows: `rounded-lg` (`1rem` / `16px`).
- Connect Orb & Floating Action Panels: `rounded-xl` (`1.5rem` / `24px`) or circular `rounded-full`.
- Metric Tags, Ping Badges, Status Chips: `rounded-full` for compact capsule contours.

## Components

### Connect Button (Master Node Controller)
- **Structure:** Central circular button (minimum 120px diameter on mobile) embedded inside concentric glass rings.
- **Idle State:** Deep slate core `#131A2A` with a 1.5px amber outline (`#FFD700`, 40% opacity) and a subtle breathing pulse.
- **Connecting State:** Animated radial gradient border in `#FFD700` rotating at 60rpm with blurred backdrop refraction.
- **Connected State:** Solid core with emerald halo glow `rgba(16, 185, 129, 0.35)`. Center icon updates with crisp haptic spring feedback.

### Glass Cards
- **Form:** `rounded-lg` containers with `#131A2A` at 70% opacity, `backdrop-filter: blur(12px)`.
- **Borders:** 1px stroke using a linear gradient: top-edge light catch `#FFFFFF` (12%), bottom-edge shadow boundary `#000000` (40%).
- **Interactive State:** Hover or tap-press elevates surface opacity to 85% with an amber rim accent (`rgba(255, 215, 0, 0.3)`).

### Server & Protocol List Nodes
- **Row Anatomy:** Flexible list row containing server flag/region glyph, server name, latency badge (ms), load gauge, and favorite icon.
- **RTL Alignment:** Flag and region name anchor to the right margin in Persian mode; ping readout in monospaced Latin anchors to the left margin.
- **Latency Tags:**
  - Fast (<50ms): `#10B981` (Emerald) surface at 10% opacity, solid text.
  - Medium (50–120ms): `#FFD700` (Amber) surface at 10% opacity, solid text.
  - High (>120ms): `#EF4444` (Crimson) surface at 10% opacity, solid text.

### Buttons & Interactive Controls
- **Primary Action:** Solid `#FFD700` surface, `#0B0F19` bold typography. On press: scaled to 98% with an intensified golden edge blur.
- **Secondary Action:** Translucent slate `#1E293B` (60% opacity) with 1px border of `#94A3B8` (20% opacity), text color `#F8FAFC`.
- **Killswitch Toggle:** Heavy-duty slide switch; track is `#0B0F19` with a recessed inner shadow; thumb turns `#10B981` with emerald emission when armed.

### Input Fields & Protocol Dropdowns
- **Input Field:** Height 48px, background `#0B0F19` at 80% opacity, inset 1px border `#334155`. Focused state transitions the border to `#FFD700` with an outer ring glow of `0 0 0 3px rgba(255, 215, 0, 0.15)`. Text inputs support dynamic RTL/LTR direction switching per input mode (e.g., config strings LTR, server aliases RTL).