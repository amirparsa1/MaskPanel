# 🎭 MaskPanel by RunoFlux - Brand & Design System

## Brand Identity

### Name Origin
- **MaskPanel**: From the concept of masked identities - each user wears multiple ephemeral masks, veiling their true fingerprint. Inspired by Venetian masks, anonymous culture, and privacy-first design.
- **RunoFlux**: Parent brand. "Runo" from Nordic runes (ᚱᚢᚾᛟ) - ancient symbols of mystery and knowledge. "Flux" from continuous flow, adaptive balancing, ever-changing routing. Together: mystical tech that flows like water, protects like a rune.

### Tagline
**Veiled Connectivity, Flux Intelligence**

Every connection is veiled, every route is flux-balanced. Your traffic flows like water through masked nodes, impossible to fingerprint.

### Codename
**Veiled Flux** - v1.0.0-flux

---

## Visual Identity

### Logo
The MaskPanel logo combines:

1. **Mask Shape**: Stylized Venetian mask, representing privacy, anonymity, multiple identities. The mask is the core - you never see the true face, only the mask.

2. **Rune Mannaz ᛗ**: Inside the mask, the Mannaz rune (ᛗ) - symbolizes humanity, connection, community. It represents that behind every mask is a human seeking freedom.

3. **Flux Ring**: Outer dashed circle, spinning slowly (20s rotation). Represents the flux - continuous movement, adaptive balancing, nodes in orbit.

4. **Network Dots**: Small cyan/violet dots at cardinal points - represent nodes in the flux network, pulsing.

5. **Masked Eyes**: The eyes are veiled, not open - representing obfuscation, not exposure.

**Construction**:
- SVG, 100x100 viewBox
- Mask path: rounded mask shape, violet→cyan gradient
- Rune: white lines, 2.5px stroke, round caps
- Flux ring: violet→cyan gradient, 1.5px, dashed 8 4, 60% opacity
- Glow: radial blur behind, violet/cyan 20%

**Variants**:
- `icon`: Just mask+rune (32px, sidebar collapsed)
- `full`: Mask + wordmark "MaskPanel by RunoFlux" + "Veiled Flux" subtitle
- `rune`: Just ᛗ symbol in gradient square

### Color System - Obsidian Flux

**Philosophy**: Deep space, neon runes, veiled shadows. Obsidian is the void, violet is the magic, cyan is the flux.

#### Light Mode - Veiled Dawn
- Background: `250 20% 98%` - soft lavender white
- Foreground: `260 15% 12%` - deep violet-black
- Card: pure white
- Primary: `262 83% 58%` - RunoFlux violet #8B5CF6
- Secondary: `190 94% 43%` - Flux cyan #06B6D4
- Border: `250 12% 86%` - soft lavender border
- Shadow: `0 1px 3px black/5%, 0 4px 12px -2px black/8%`

#### Dark Mode - Veiled Obsidian Flux (Default)
- Background: `240 15% 6%` - obsidian #0A0A0F
- Foreground: `250 20% 96%` - soft white
- Card: `240 12% 8%` - slightly lighter obsidian #0F1123
- Primary: `262 83% 64%` - brighter violet for dark
- Secondary: `190 94% 48%` - brighter cyan
- Border: `240 10% 16%` - subtle dark border
- Shadow: `0 1px 3px black/30%, 0 8px 24px -4px violet/15%` - violet glow
- Background image: radial gradients at top-left (violet 8%) and bottom-right (cyan 6%)

**Semantic Colors**:
- Success: emerald 142 76% 36%
- Destructive: red 0 72% 51%
- Flux Violet: 262 83% 58%
- Flux Cyan: 190 94% 43%
- Flux Obsidian: 240 15% 6%
- Mask Glow: violet 262 83% 58%

### Typography
- **Headings**: Bold, tight tracking, flux-text gradient for "Mask"
- **Body**: Comfortable density (16px), elevated surface, subtle radius 0.75rem
- **Mono**: JetBrains Mono or similar for rune labels, fingerprints, scores - `a3f9::c1d2::e4b5` style
- **Rune Labels**: `ᛗ MASKED • ᚠ FLUX ACTIVE • ᛉ VEILED` - always uppercase, tracking widest

### Unique CSS Utilities
```css
.mask-glow {
  box-shadow: 0 0 20px violet/30%, 0 0 40px violet/10%;
}
.flux-border {
  border: 1px solid transparent;
  background: linear-gradient(card, card) padding-box,
              linear-gradient(135deg, violet, cyan) border-box;
}
.flux-text {
  background: linear-gradient(135deg, violet, cyan);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.flux-bg {
  background: linear-gradient(135deg, violet/10%, cyan/10%);
}
.rune-pattern {
  background-image: radial-gradient(circle at 1px 1px, violet/15% 1px, transparent 0);
  background-size: 24px 24px;
}
.animate-flux-pulse {
  animation: flux-pulse 3s ease-in-out infinite;
}
```

---

## Unique Features - RunoFlux Edition

### 1. Mask Identities System (ᛗ)

**Concept**: In real world you have one face. In MaskPanel you have many masks - ephemeral, rotating, disposable.

**Implementation**:
- Each mask: `Veil-Alpha ᛗ`, `Flux-Beta ᚱ`, `Rune-Gamma ᚠ`, etc.
- Fingerprint: `a3f9::c1d2::e4b5` - IPv6-like, masked, copyable
- Status: Active (green), Ghost (violet), Rotating (cyan), Expired (red)
- Metrics: obfuscation %, connections, last rotated
- Actions: Rotate (shuffle), Copy fingerprint, More

**UI**: Card list, each mask has gradient border on hover, rune badge, flux line decoration at bottom (violet→transparent→cyan) on hover.

**Backend**: `/api/flux/masks` - list, `/api/flux/masks/{id}/rotate` - rotate

### 2. Flux Intelligence (ᚱ)

**Concept**: Not static load balancing, but flux - like water finding path, adaptive, intelligent.

**Metrics (6D)**:
1. **Flux Balance** ᛗ: How balanced traffic is across nodes (0-100)
2. **Veil Integrity** ᛉ: Masking layer health
3. **Ghost Routing** ᛚ: Stealth routing effectiveness
4. **Node Flux** ᚱ: Node distribution flux
5. **Obfuscation** ᚠ: Traffic obfuscation score
6. **Mask Health** ᚢ: Ephemeral mask integrity

**Visualization**:
- 12 animated bars, height based on sin wave + randomness, violet→cyan gradient, pulse animation with stagger
- Bottom labels: `ᛗ MASKED | ᚠ FLUX ACTIVE | ᛉ VEILED`
- Overall flux: average of 6 metrics, displayed as flux-text gradient

**Backend**: `/api/flux/meter`

### 3. Obfuscation Score (ᛉ)

**Concept**: How ghosted you are? 0 = exposed, 100 = ghost.

**Levels**:
- 90-100: Ghost (emerald) - ᛉ VEILED, invisible
- 75-89: Veiled (cyan) - masked, hard to fingerprint
- 60-74: Masked (amber) - some masking, but detectable
- 0-59: Exposed (red) - no masking

**UI**: Circular progress, 44x44 SVG, 18 radius, 3 stroke, gradient violet→cyan, dasharray `score*1.13 113`, shield icon in center with level color.

**Backend**: `/api/flux/obfuscation/{username}` - per-user score with factors (protocol diversity, transport randomization, header obfuscation, fingerprint rotation, ghost routing) + recommendations.

### 4. Ghost Mode (ᛉ)

**Concept**: One toggle to become ghost - stealth routing, fingerprint randomization, traffic laundering.

**UI**:
- Sidebar widget: gradient border violet→cyan, ghost status, 94% obfuscated, pulse dot
- Toggle card: full gradient violet→cyan, white text, badges, 3 stats (Obfuscation, Rotation, Flux Nodes)
- Topbar banner: flux status, ghost %, masks active, runes

**Backend**: `/api/flux/ghost/status` and `/api/flux/ghost/toggle`

### 5. Rune System (ᚱᚢᚾᛟ)

**Concept**: Nordic runes as visual language - ancient, mystic, minimal.

**Runes Used**:
- ᛗ Mannaz: humanity, connection → Mask Identities, Users
- ᚱ Raidho: journey, movement → Flux Routing, Nodes
- ᚠ Fehu: wealth, flow → Traffic, Obfuscation
- ᛚ Laguz: water, flow → Ghost Routing, Streams
- ᚢ Uruz: strength, life → Health, Mask Integrity
- ᛉ Algiz: protection → Veil, Ghost Mode, Security

**Usage**:
- Badges: `ᛗ`, `ᚱ`, `ᛉ` next to feature names
- Divider: `ᛗ ᚱ ᚠ ᛚ ᚢ ᛉ` with gradient lines
- Signatures: `ᛗᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ` (MaskPanel • RunoFlux in runes)
- Footer: rune row with tagline
- Login: `ᚱᚢᚾᛟ ᚠᛚᚢᛉ` subtitle

**Backend**: `/api/flux/runes` - documentation

### 6. Enhanced Dashboard

**Hero Card**: Full-width gradient violet→cyan, MaskPanel wordmark, live stats (Masks 12, Flux 94%, Ghost Nodes 8), flux engine status.

**Grid**:
- Left 2/3: FluxMeter
- Right 1/3: ObfuscationScore + GhostModeToggle (stacked)
- RuneDivider
- DashboardStatistics (classic CPU, RAM, etc.)
- MaskIdentities (full list)
- WorkersHealth
- Admin analytics

**Footer**: Dashed card with logo, feature list, rune signature.

---

## Design Principles

1. **Veiled, not exposed**: Always show masked data, not raw. Fingerprints are `a3f9::c1d2` not full IP.
2. **Flux, not static**: Everything animates subtly - bars pulse, logo spins slowly, dots pulse.
3. **Rune, not emoji**: Use Nordic runes for status, not generic icons. ᛗ is more mysterious than 👤.
4. **Obsidian, not white**: Default dark, obsidian base, violet glow. Light mode is secondary.
5. **Ghost, not online**: Status is Ghost/Veiled/Masked/Exposed, not just Online/Offline.

---

## File Structure - Unique Additions

```
dashboard/src/
  components/icons/maskpanel-logo.tsx - MaskPanelLogo, Wordmark, RuneDivider
  features/flux/components/flux-meter.tsx - FluxMeter, ObfuscationScore
  features/masks/components/mask-identities.tsx - MaskIdentities, GhostModeToggle
  constants/Project.ts - BRAND_NAME, PARENT_BRAND, FULL_BRAND, TAGLINE
  constants/ThemeGradients.ts - flux, mask, ghost variants + getFluxGradient

app/routers/flux.py - Flux Intelligence API (meter, obfuscation, masks, ghost, runes)

assets/maskpanel-hero.png - Hero banner
dashboard/public/statics/favicon/logo.png - New logo (generated)
```

---

## Installation & Development

Same as PasarGuard, but with MaskPanel branding. See README.md for quick start.

**Key Differences**:
- NATS subjects: `maskpanel.*` instead of `pasarguard.*`
- CLI: `maskpanel-cli` (and `pasarguard-cli` for compat)
- Env: `maskpanel.log`, `/var/lib/maskpanel/`
- Dashboard: `maskpanel-dashboard` package, v1.0.0
- API title: `MaskPanel API - RunoFlux`

---

<p align="center">
<strong>MaskPanel by RunoFlux</strong><br/>
<code>ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ • ᛉ ᚡᛖᛁᛚᛖᛞ ᚠᛚᚢᛉ</code><br/>
Veiled Connectivity, Flux Intelligence
</p>
