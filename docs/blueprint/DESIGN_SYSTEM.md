# GiftShop — Design System (`Direction B: Editorial Gallery`)

**Surface Modes:**
* **Storefront (`Persuade`):** Warm Editorial Boutique — photography-first, generous whitespace, calm serif authority, zero marketplace clutter.
* **Admin (`Operate`):** Editorial Operations — same warm parchment/espresso visual world, crisp hairline tables, right-aligned tabular INR figures, scannable charts.

---

## 1. Color Tokens (`:root`)

```css
:root {
  /* Surfaces */
  --gs-bg: #F4EFE6;            /* Warm parchment canvas */
  --gs-surface: #FBF8F3;       /* Elevated cream paper */
  --gs-surface-muted: #EFE8DC; /* Sidebar rail / table header / subtle tint */
  --gs-surface-chip: #E9E1D3;  /* Segmented control track */

  /* Borders */
  --gs-border: #D9CEBC;        /* Primary hairline divider */
  --gs-border-strong: #8A7B6A; /* Interactive input / ghost button border (>3.2:1 contrast) */

  /* Ink */
  --gs-ink: #1D1714;           /* Primary espresso ink (AAA on --gs-bg) */
  --gs-ink-secondary: #594D44; /* Body / metadata secondary ink (AA+) */
  --gs-ink-muted: #75685D;     /* Captions / SKU / axis ticks (AA on --gs-surface) */

  /* Brand & Semantic Accents */
  --gs-accent: #A84A2F;        /* Burnt sienna primary highlight & active chart */
  --gs-accent-hover: #8C3B24;  /* Sienna hover state */
  --gs-accent-soft: #F3E2DA;   /* Soft sienna tint */
  --gs-gold: #8E6E3F;          /* Antique brass (engraving / stationery / chart 2) */
  --gs-sage: #496350;          /* Botanical sage (in-stock / chart 3) */
  --gs-sage-soft: #E5ECE7;
  --gs-amber: #946221;         /* Low-stock warning */
  --gs-amber-soft: #F5E9D6;
  --gs-danger: #9B2C2C;        /* Out-of-stock / destructive */
  --gs-danger-soft: #F7E1E1;

  /* Chart Series (Ordered) */
  --gs-chart-1: #A84A2F;       /* Luxury Gift Boxes / Primary Revenue */
  --gs-chart-2: #8E6E3F;       /* Personalized & Engraved */
  --gs-chart-3: #496350;       /* Flowers, Plants & Hampers */
  --gs-chart-4: #3D332D;       /* Home & Lifestyle */

  /* Typography */
  --gs-font-display: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --gs-font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Layout & Radii */
  --gs-max-w: 1440px;
  --gs-radius-sm: 4px;
  --gs-radius-md: 6px;
}
```

---

## 2. Typography Rules
* **Display / Headings (`--gs-font-display`):** `Cormorant Garamond` (weights `500`, `600`, italic `500` ONLY for handwritten stationery card quote — never one italic word inside a roman heading).
* **UI / Body / Tables (`--gs-font-sans`):** `Plus Jakarta Sans` (weights `400`, `500`, `600`). Minimum `12px` (`text-xs`); body `15px–16px`.
* **Numbers & Prices:** Always apply `font-variant-numeric: tabular-nums` (`tabular-nums`) on INR prices, KPI values, stock counts, SKUs, and table columns. Right-align numeric columns in Admin tables.
* **Case & Tracking:** Strictly **sentence case, untracked** for all nav links, labels, table headers, badges, and buttons. **Zero** eyebrows, **zero** tracked uppercase kickers.

---

## 3. Iconography
* **Single Library:** `@phosphor-icons/react`
  * Storefront: `weight="light"` (`18px–20px`)
  * Admin & Controls: `weight="regular"` (`16px–18px`)
* **Hard Bans:** Zero emojis in UI, zero sparkle/shield/stack clichés, zero mixed icon packs.

---

## 4. Imagery & Photography Standard
* **Real Contextual Photography Only:** Every product card, hero split, editorial spread, and inventory thumbnail uses real studio editorial photography (`object-cover`, `aspect-[4/5]` for catalog cards, `aspect-[16/10]` for editorial feature spreads).
* **Assets Location:** `public/images/` (copied from our generated editorial studio set + additional product photography if needed so every department looks cohesive and authentic).
* **Borderless Photo Presentation:** Catalog product images sit flush with zero inner card nesting; subtle `scale(1.03)` on hover (`transform 300ms ease`, disabled under `prefers-reduced-motion: reduce`).

---

## 5. Motion, States & Hard Guardrails
* **Never `transition: all`** — only transition `background-color`, `border-color`, `color`, `opacity`, or `transform`.
* **Instant `:focus-visible`** (`2px solid var(--gs-accent)`, `outline-offset: 2px`) on every interactive control.
* **Zero Pulsing Dots / Zero AI Copy:** No `animate-pulse`, no glowing status dots, no *"Live sync"* / *"Live database"* badges.
* **Fluid Full-Viewport Architecture (`320px → 2560px`):**
  * `html, body { overflow-x: clip; }` (never `100vw`, zero centered `1440px` tube box).
  * Fluid viewport gutters `--gs-gutter: clamp(1rem, 3vw, 4rem)` and fluid display type `--gs-hero-title: clamp(2.5rem, 4.2vw, 4.75rem)`.
  * Catalog uses `.fluid-catalog-grid` (`repeat(auto-fill, minmax(min(100%, 270px), 1fr))`) for smooth column reflow across phones, tablets, laptops, 1080p, and ultrawide screens.
  * Admin uses a full-viewport desktop shell (`lg:grid-cols-[240px_minmax(0,1fr)]`).
  * **Lenis Smooth Scroll** (`src/lib/useLenis.ts`, `lerp: 0.09`) synced to `gsap.ticker` & `ScrollTrigger.update`, automatically paused inside open `<dialog>` overlays (`data-lenis-prevent`) and disabled under `prefers-reduced-motion: reduce`.
