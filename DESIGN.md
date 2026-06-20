# Zenyte Technologies — Design System

A portable design specification for institutional fintech marketing sites and quantitative performance reports. The aesthetic is **restrained, data-forward, and credibility-first**. Dark mode is the default experience; light mode is a supported alternate.

This document is self-contained. It defines colors, typography, spacing, and interaction patterns without reference to any particular codebase or framework.

---

## Brand Identity

**Tone:** Precision investment intelligence. Institutional, not retail. Confident, not loud.

**Visual character:** Near-monochrome surfaces with warm gold accents and muted performance greens. Large light-weight numerals, uppercase micro-labels, hairline borders, and subtle grid overlays evoke terminal-grade financial tooling without feeling cold or generic.

**Audience context:** Practitioners evaluating verified backtest data, benchmark comparisons, and fund-level transparency.

---

## Design Principles

1. **Trust through restraint** — Numbers and charts carry visual weight. Structure and spacing replace decoration.
2. **Gold signals priority** — The brand accent marks primary actions, featured content, and headline metrics. Use sparingly.
3. **Green signals performance** — Positive returns, win rates, and success states use a muted sage green, never neon.
4. **Data is the hero** — Metric grids, equity curves, and benchmark tables are first-class UI, not afterthoughts.
5. **Layered depth** — Cards sit on tinted section backgrounds. Borders are hairline. Atmosphere comes from subtle overlays, not heavy shadows.

---

## Color Palette

### Brand Accents

These colors are **theme-independent** — they do not change between light and dark mode.

| Name | Hex | Usage |
|------|-----|-------|
| Gold | `#d7b36e` | Eyebrows, primary CTAs, featured cards, accent icons, featured table columns, hover borders |
| Gold hover | `#e6c47f` | Primary button hover state |
| Gold tint | `#d7b36e` at 8% opacity | Featured card backgrounds, highlighted stat cells |
| Gold border | `#d7b36e` at 60–70% opacity | Featured card borders, interactive hover states |
| Performance green | `#75c99a` | Positive metrics, win rates, success states, chart legend markers |
| Loss red | `#d96b6b` | Loss trades, negative outcomes in charts |
| Profit blue | `#5b9cf6` | Profit bars, favorable trend lines |
| Loss coral | `#e07070` | Loss bars, adverse trend lines |
| Chart green | `#4caf50` | Volume/entry bars, scatter plots |
| CTA text | `#09090b` | Text on gold buttons (near-black for maximum contrast) |

### Surface & Text Tokens

Values use **OKLCH** for perceptual uniformity. Light mode carries a subtle warm hue (~85°). Dark mode is neutral (chroma 0).

#### Light Mode

| Token | OKLCH | Approx. role |
|-------|-------|--------------|
| Background | `oklch(0.985 0.004 85)` | Page background — warm off-white |
| Foreground | `oklch(0.18 0.012 85)` | Primary text |
| Card | `oklch(0.995 0.003 85)` | Elevated surfaces |
| Secondary | `oklch(0.94 0.01 85)` | Section tints, nav active state, tags |
| Muted | `oklch(0.94 0.01 85)` | Chart frames, footer, subdued areas |
| Muted foreground | `oklch(0.48 0.018 85)` | Secondary text, labels, captions |
| Border | `oklch(0.88 0.014 85)` | Borders, grid dividers |
| Input | `oklch(0.88 0.014 85)` | Form field borders |
| Primary | `oklch(0.72 0.105 78)` | System primary — gold-aligned |
| Primary foreground | `oklch(0.16 0 0)` | Text on primary surfaces |
| Destructive | `oklch(0.577 0.245 27.325)` | Errors, destructive actions |
| Ring / focus | `oklch(0.72 0.105 78)` | Focus rings — matches primary |

#### Dark Mode (Default)

| Token | OKLCH | Approx. role |
|-------|-------|--------------|
| Background | `oklch(0.145 0 0)` | Page background — near-black |
| Foreground | `oklch(0.94 0 0)` | Primary text |
| Card | `oklch(0.185 0 0)` | Elevated surfaces |
| Secondary | `oklch(0.225 0 0)` | Section tints, nav active state |
| Muted | `oklch(0.225 0 0)` | Chart frames, subdued areas |
| Muted foreground | `oklch(0.66 0 0)` | Secondary text, labels |
| Border | `oklch(0.27 0 0)` | Borders, grid dividers |
| Input | `oklch(0.29 0 0)` | Form field borders |
| Primary | `oklch(0.76 0.096 83.4)` | System primary — gold-aligned |
| Primary foreground | `oklch(0.16 0 0)` | Text on primary surfaces |
| Destructive | `oklch(0.577 0.245 27.325)` | Errors, destructive actions |
| Ring / focus | `oklch(0.76 0.096 83.4)` | Focus rings — matches primary |

#### Section Background Alternation

- **Default sections:** Background token
- **Tinted sections:** Secondary token at 30% opacity over background
- **Footer:** Muted token at 30% opacity

#### Page Background Treatment (Light Mode)

Apply a subtle top gradient for depth:

```css
background:
  linear-gradient(
    180deg,
    color-mix(in oklch, var(--background), var(--foreground) 4%),
    var(--background) 44rem
  ),
  var(--background);
```

Dark mode uses a flat background token with no gradient.

### Chart Series Colors

Series colors map to the primary token scale and adapt slightly per theme.

| Series | Light (OKLCH) | Dark (OKLCH) | Typical assignment |
|--------|---------------|--------------|-------------------|
| Series 1 | `oklch(0.72 0.105 78)` | `oklch(0.76 0.096 83.4)` | Primary product / balance line |
| Series 2 | `oklch(0.62 0.12 151.5)` | `oklch(0.74 0.11 151.5)` | Secondary metric / equity line |
| Series 3 | `oklch(0.54 0.11 232)` | `oklch(0.66 0.1 232)` | Benchmark A (e.g. index fund) |
| Series 4 | `oklch(0.58 0.14 25)` | `oklch(0.63 0.14 25)` | Reserved / alert series |
| Series 5 | `oklch(0.58 0.09 310)` | `oklch(0.7 0.08 310)` | Benchmark B |

### Trading Session Colors

For time-of-day or regional breakdown charts:

| Session | Hex |
|---------|-----|
| Asia | `#d4a017` |
| Europe | `#4caf50` |
| USA | `#e07050` |

### Metric Color Semantics

Apply color to numbers by meaning, not decoration:

| Meaning | Color |
|---------|-------|
| Headline return, Sharpe ratio, recovery factor | Gold `#d7b36e` |
| CAGR, win rate, positive outcomes | Performance green `#75c99a` |
| Neutral stats (drawdown, trade count, profit factor) | Foreground token |

One accent color per metric cell. Do not combine gold and green in the same value.

---

## Typography

### Font Stack

```css
font-family: "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

Avenir Next provides a clean institutional feel. Helvetica Neue and system sans-serifs serve as fallbacks.

### Type Scale

| Role | Size | Weight | Letter-spacing | Line-height | Color |
|------|------|--------|----------------|-------------|-------|
| Hero headline | 3rem → 4.5rem (responsive) | 300 (Light) | 0 | 1.04 | Foreground; subtitle in muted foreground |
| Section title | 2.25rem → 3rem | 300 | 0 | 1.1–1.2 | Foreground |
| Report title | 3rem → 3.75rem | 300 | 0 | 1.1 | Foreground; subtitle in muted foreground |
| Hero metric | 1.875rem (30px) | 300 | 0 | — | Semantic (gold / green / foreground) |
| Card metric | 1.5rem (24px) | 300 | 0 | — | Semantic |
| Benchmark return | 2.25rem (36px) | 300 | 0 | — | Gold when featured, else foreground |
| Body | 1rem (16px) | 400 | 0 | 2 (32px) for hero copy; 1.5–1.625 elsewhere | Muted foreground |
| Eyebrow | 0.75rem (12px) | 500 | 0.18em | — | Gold, uppercase |
| Metric label | 0.75rem (12px) | 400 | 0.14em–0.18em | — | Muted foreground, uppercase |
| Nav wordmark | 0.875rem (14px) | 600 | 0.18em | — | Foreground, uppercase |
| Nav sublabel | 0.625rem (10px) | 400 | 0.34em | — | Muted foreground, uppercase |
| Table header | 0.75rem (12px) | 400 | 0.16em | — | Muted foreground, uppercase |
| Button / nav link | 0.875rem (14px) | 500 | 0 | — | Context-dependent |

### Hierarchy Pattern

Every major content block follows this vertical rhythm:

```
Eyebrow     — 12px, uppercase, gold, wide tracking
Title       — 36–72px, light weight
Body        — 16px, muted foreground, generous line-height
```

Headlines use **light weight (300)** at large sizes. Reserve semibold (600) for nav wordmarks and small labels only.

---

## Spacing & Layout

### Container

| Property | Value |
|----------|-------|
| Max width | 80rem (1280px) |
| Horizontal padding (mobile) | 1.25rem (20px) |
| Horizontal padding (tablet+) | 2rem (32px) |
| Minimum page width | 320px |

### Section Rhythm

| Property | Value |
|----------|-------|
| Vertical padding (mobile) | 5rem (80px) |
| Vertical padding (tablet+) | 6rem (96px) |
| Section separator | 1px bottom border using border token |
| Content gap (within sections) | 2.5rem (40px) typical |

### Grid Proportions

| Layout | Column ratio | Use |
|--------|-------------|-----|
| Hero | 1.05 : 0.95 | Copy left, stat grid right |
| Content split (narrow : wide) | 0.75–0.9 : 1.1–1.25 | About, contact, feature sections |
| Metric grid | 2 columns (hero), 2–4 columns (cards) | Performance stats |
| Card grid | 3 or 4 equal columns | Benchmark cards, principle cards |

### Metric Grid Technique

Create hairline dividers between stat cells without double borders:

1. Outer container: 1px gap between cells, background set to border color
2. Inner cells: background set to card or background token
3. Outer wrapper: 1px border + 8px border-radius

This produces crisp 1px separators that scale cleanly.

### Border Radius

| Element | Radius |
|---------|--------|
| Base radius token | 0.5rem (8px) |
| Cards, chart frames, dropdowns | 8px |
| Buttons, inputs, tags, tabs | 6–8px |
| Legend dots | 50% (full circle, 8px diameter) |

### Elevation & Shadows

Use shadows sparingly:

| Element | Shadow |
|---------|--------|
| Hero stat grid | Large diffuse shadow (`0 25px 50px -12px rgba(0,0,0,0.25)`) |
| Dropdown menus | Same large shadow |
| Cards, buttons | None or minimal — rely on borders instead |

---

## Components

### Navigation Bar

| Property | Value |
|----------|-------|
| Position | Sticky, top 0 |
| Height | 4rem (64px) |
| Background | Background token at 88% opacity + backdrop blur (~20px) |
| Bottom border | Border token at 70% opacity |
| Z-index | Above page content (e.g. 50) |

**Links:** 14px. Inactive = muted foreground. Hover and active = secondary background fill + foreground text. Active state uses a filled pill (6–8px radius, 12px horizontal / 8px vertical padding).

**Dropdown:** 8px radius, 1px border, card background, large shadow. Menu items full-width with bottom dividers; hover fills secondary background.

**Primary nav action:** Gold CTA button (see Buttons).

### Buttons

#### Primary (CTA)

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `#d7b36e` | `#09090b` | none |
| Hover | `#e6c47f` | `#09090b` | none |
| Height (hero/contact) | 2.75rem (44px) | | |
| Horizontal padding | 1.5rem (24px) | | |
| Font | 14px, medium weight | | |
| Radius | 6–8px | | |

#### Secondary (Outline)

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | Background at 40% opacity | Foreground | 1px border token |
| Hover | Secondary token | Foreground | 1px border token |

#### Ghost / Icon

Transparent background. Hover = secondary or accent fill at reduced opacity.

### Cards

| Variant | Background | Border | Notes |
|---------|-----------|--------|-------|
| Standard | Card token | 1px border token | 8px radius |
| Semi-transparent | Card at 80% opacity | 1px border token | Over grid overlays |
| Featured | Gold tint (8%) | Gold at 60% opacity | For primary product/benchmark |
| Chart frame | Muted at 50% opacity | 1px border token | 12px inner padding |

Internal card padding: 1.5rem (24px) mobile, 2rem (32px) on larger screens.

### Tags / Pills

- Background: secondary token
- Border: 1px border token
- Text: 12px, muted foreground
- Padding: 8px vertical, 12px horizontal
- Radius: 6–8px

### Tab Switcher

- Container: secondary background, 1px border, 4px inner padding, 8px radius
- Active tab: card background, foreground text, subtle shadow
- Inactive tab: muted foreground; hover → foreground text
- Tab height: 2.5rem (40px), equal width distribution

### Form Fields

- Label: 14px, foreground
- Input / textarea: background token, 1px border token, 8px radius
- Focus: ring in primary/ring color, 3px spread at 50% opacity
- Textarea minimum height: ~5 rows

### Metric Row (Label / Value)

- Layout: flex, space-between
- Label: muted foreground
- Value: foreground, medium weight, right-aligned
- Separator: 1px bottom border at 80% border opacity; remove on last item

### Data Tables

- Header row: secondary background, 12px uppercase labels, 0.16em tracking, muted foreground
- Body cells: 16px padding
- Row dividers: 1px border token
- Featured column header and cells: gold text, medium weight on values
- Minimum table width before horizontal scroll: ~680px

### Interactive Link Cards

Full-width clickable cards for navigation between report sections:

- Default: card background, 1px border
- Hover: border shifts to gold at 70% opacity; trailing arrow icon shifts to gold
- Optional motion: 2px upward lift on hover
- Padding: 20px

### Footer

- Top border: 1px border token
- Background: muted at 30% opacity
- Padding: 2.5rem (40px) vertical
- Wordmark: 14px semibold, 0.18em tracking, uppercase
- Tagline and links: 14px muted foreground

---

## Decorative Elements

### Market Grid Overlay (Hero)

A non-interactive background layer behind hero content:

| Layer | Specification |
|-------|---------------|
| Grid lines | 64×64px orthogonal grid; line color = border token at 35% opacity |
| Gold glow | Radial gradient: `rgba(215, 179, 110, 0.14)` centered upper-right, fading over ~25rem |
| Green wash | Linear gradient 135°: `rgba(117, 201, 154, 0.09)` fading over ~28rem |
| Fade mask | Linear gradient to transparent at 92% from top — grid dissolves toward bottom |
| Position | Absolute, full bleed within hero section |
| Opacity on inner pages | 40% of full strength |

### Iconography

- Style: thin-stroke, geometric (Lucide-equivalent)
- Inline size: 16px
- Nav / card accent size: 20px
- Success form state: 40px
- Accent icons: gold
- Success icons: performance green
- Default / trailing icons: muted foreground

---

## Data Visualization

### General Chart Style

| Property | Value |
|----------|-------|
| Grid lines | Horizontal only; dashed (3px dash, 3px gap); border color at 50% |
| Axes | No tick lines, no axis lines; labels in muted foreground |
| Tooltip | Card-style panel; border token; muted background |
| Legend | Below or beside chart; small colored swatches |

### Line & Area Charts

| Property | Primary series | Secondary series |
|----------|---------------|-----------------|
| Stroke width | 2.4–2.8px | 1.8–2.2px |
| Line style | Monotone (smooth) | Monotone; no dots |
| Area fill | Gradient: 35% opacity at top → 2% at bottom, matching stroke color | — |

### Bar Charts

| Property | Value |
|----------|-------|
| Corner radius | 2px top corners only |
| Profit bars | `#5b9cf6` or chart green `#4caf50` |
| Loss bars | `#e07070` |
| Win/loss breakdown | Wins `#75c99a`, losses `#d96b6b` |

### Chart Frame Heights

| Context | Height |
|---------|--------|
| Compact (inline preview) | 260px |
| Full-width equity curve | 420px |
| Multi-series benchmark | 390px |

---

## Motion & Interaction

Motion is purposeful and understated — never flashy. Always honor `prefers-reduced-motion: reduce`.

### Timing Tokens

| Token | Value |
|-------|-------|
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` — soft ease-out |
| Standard duration | 900ms |
| Fast duration | 550ms |
| Stagger interval | 120ms between sequential children |
| Stagger initial delay | 80ms before first child |
| Scroll trigger offset | Element animates ~48px before fully entering viewport |

### Interaction Patterns

| Pattern | Behavior |
|---------|----------|
| Page transition | Opacity 0→1; translate Y 10px→0 on enter; -6px on exit |
| Section reveal (scroll) | Opacity 0→1; translate Y 12px→0 |
| Eyebrow reveal | Opacity 0→1; translate X -8px→0 |
| Staggered grid | Children animate sequentially with stagger interval |
| Nav entrance | Opacity 0→1; translate Y -8px→0 over 700ms |
| Card hover lift | Translate Y 0→-2px over 400ms |
| Button press | Scale 0.98 briefly |
| Dropdown appear | Opacity 0→1; translate Y 4px→0 over 200ms |

### Focus States

- Visible focus ring: 3px spread, primary/ring color at 50% opacity
- Never remove focus indicators

---

## Theme Behavior

| Setting | Specification |
|---------|---------------|
| Default mode | Dark |
| Alternate mode | Light |
| Persistence | User preference stored client-side |
| Switch control | Moon / sun toggle in navigation |
| Flash prevention | Apply saved theme before first paint |

**Token usage rule:** Structural UI (backgrounds, borders, body text) should always use semantic surface/text tokens so both modes work automatically. Brand accents (gold, performance green, chart hex values) remain fixed across modes.

---

## Accessibility Notes

- Maintain WCAG AA contrast for all text on surface tokens
- Gold CTA buttons use near-black text (`#09090b`) specifically for contrast on `#d7b36e`
- Interactive elements require visible focus states
- Icon-only controls need accessible labels
- Charts should expose data tables or summaries for screen readers where possible
- Minimum touch target: 44×44px for primary actions on mobile

---

## Do's and Don'ts

### Do

- Use gold for one primary CTA per viewport and the single headline metric in each section
- Set large numbers and headlines to light weight (300)
- Uppercase metric labels with 0.14em–0.18em letter-spacing
- Alternate section backgrounds between default and secondary tint (30%)
- Keep borders subtle — often at reduced opacity (70–80%)
- Let data visualizations occupy generous horizontal space

### Don't

- Use saturated or neon greens and reds — the palette is deliberately muted
- Apply gold to body copy or large background fills (except the 8% tint)
- Place multiple accent colors on a single metric
- Rely on heavy shadows for depth — borders and background tints carry structure
- Use bold or extrabold weights on large display type
- Animate aggressively; motion should feel calm and institutional

---

## Quick Reference — Core Hex Values

```
Gold              #d7b36e
Gold hover        #e6c47f
Performance green #75c99a
Loss red          #d96b6b
Profit blue       #5b9cf6
Loss coral        #e07070
Chart green       #4caf50
CTA text          #09090b
Asia session      #d4a017
USA session       #e07050
```
