# Storefront Redesign Pipeline

> Complete implementation guide for CartHouse GH customer storefront.
> **Layout Source:** `layout-system.md` (Rarible-inspired)
> **Design System:** Meta (from DESIGN.md)

---

## Color Token Mapping

Map tokens from layout-system to Meta design system:

| Layout Token | Meta Token | Usage |
|---|---|---|
| `--color-bg` | `{colors.canvas}` | Page background |
| `--color-card-bg` | `{colors.canvas}` | Card surfaces |
| `--color-border` | `{colors.hairline}` | Input/button borders |
| `--color-border-light` | `{colors.hairline-soft}` | Subtle separators |
| `--color-input-bg` | `{colors.surface-soft}` | Search/input background |
| `--color-text-primary` | `{colors.ink-deep}` | Headings, active nav |
| `--color-text-secondary` | `{colors.charcoal}` | Prices, descriptions |
| `--color-text-muted` | `{colors.steel}` | Placeholders, inactive |
| `--color-icon` | `{colors.ink}` | Default icon color |
| `--color-accent` | `{colors.primary}` | Primary accent (cobalt) |
| `--color-on-accent` | `{colors.on-primary}` | Text on accent |
| `--color-active-pill` | `{colors.ink-deep}` | Active toggle pill |
| `--color-active-pill-text` | `{colors.canvas}` | Text on active pill |
| `--color-toggle-active-bg` | `{colors.surface-soft}` | Active view button |
| `--color-badge-bg` | `{colors.surface-soft}` | Search shortcut badge |
| `--color-logo-accent` | `{colors.primary}` | Logo accent |
| `--color-rewards-gradient` | `{colors.ink-deep}` | Rewards button |
| `--color-avatar-gradient` | N/A | Not needed |
| `--color-overlay-bg` | `rgba(10, 19, 23, 0.12)` | Card overlay |
| `--color-image-placeholder` | `{colors.surface-soft}` | Image fallback |
| `--color-card-hover-shadow` | `rgba(20, 22, 26, 0.15)` | Card hover |

---

## Typography Mapping

| Layout Token | Meta Token |
|---|---|
| Hero/Display | `{typography.hero-display}` or `{typography.display-lg}` |
| Headings | `{typography.heading-lg}`, `{typography.heading-md}`, `{typography.heading-sm}` |
| Body | `{typography.body-md}`, `{typography.body-sm}` |
| Labels | `{typography.body-sm-bold}`, `{typography.caption}` |
| Buttons | `{typography.button-md}` |

> Use `Optimistic VF` font family with `ss01, ss02` stylistic sets for headings.

---

## Spacing & Sizing

| Element | Value |
|---|---|
| Navbar height | 64px |
| Tab bar height | 44px |
| Toolbar height | 48px |
| Sidebar width | 240px |
| Sidebar right padding | 24px |
| Grid gap | 16px |
| Card border radius | 32px (`{rounded.xxxl}`) |
| Filter button radius | 8px (`{rounded.lg}`) |
| Status toggle radius | 100px (`{rounded.full}`) |
| Page horizontal padding | 24px |

---

## Component Mapping

### Buttons
- **Primary CTA** (marketing): `button-primary` → `{colors.ink-button}`
- **Buy CTA** (commerce): `button-buy-cta` → `{colors.primary}`
- **Secondary**: `button-secondary` → outlined
- **Filter toggle**: `button-pill-tab` + `button-pill-tab-active`

### Cards
- **Product Card**: `card-product-feature` → white, 32px radius, 1px hairline-soft border
- **Feature Card**: `card-feature-photo` → edge-to-edge photography
- **Promo Strip**: `card-promo-strip` → dark background
- **Icon Feature**: `card-icon-feature` → 16px radius

### Inputs
- **Search**: `search-pill` → surface-soft bg, pill shape
- **Text Input**: `text-input` → canvas bg, hairline border
- **Filter inputs**: `text-input` styled

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER / NAVBAR                          │
│  Logo  |  Search Pill  |  Nav Links  |  Cart Icon           │
├──────────────────────┬──────────────────────────────────────┤
│   LEFT SIDEBAR       │        MAIN CONTENT AREA            │
│   (240px fixed)      │                                      │
│                      │   ┌──────────────────────────────┐   │
│   ┌──────────────┐    │   │  TOOLBAR                    │   │
│   │ FILTER PANEL│    │   │  Filters | Search | Sort     │   │
│   │              │    │   ├──────────────────────────────┤   │
│   │ - Category   │    │   │  PRODUCT GRID                │   │
│   │ - Price      │    │   │  (5 columns desktop)         │   │
│   │ - Status     │    │   │  (3 columns tablet)          │   │
│   │ - Brand      │    │   │  (2 columns mobile)          │   │
│   └──────────────┘    │   └──────────────────────────────┘   │
└──────────────────────┴──────────────────────────────────────┘
```

---

## Implementation Order

1. **Navbar** — logo, search-pill, nav links, cart icon with count
2. **Sidebar Filters** — category pills, price range inputs, status toggle
3. **Toolbar** — filters button, inline search, sort dropdown, view toggle
4. **ProductCard** — image, name, brand, price, rating, add-to-cart button
5. **ProductGrid** — responsive CSS grid
6. **PageLayout** — sidebar + grid assembly
7. **Footer** — contact info, social links

---

## Responsive Breakpoints

| Viewport | Columns | Sidebar |
|---|---|---|
| Desktop (≥1280px) | 5 | Always visible |
| Tablet (768–1279px) | 3 | Collapsible via button |
| Mobile (<768px) | 2 | Hidden, as modal |

---

## Product Card Fields (for CartHouse)

Replace NFT fields with car store fields:

| Field | Description |
|---|---|
| **Image** | Square product photo, `object-fit: contain` |
| **Brand** | "CarHouse" or category — 11px, uppercase |
| **Product Name** | Truncated at 2 lines, 13px, weight 600 |
| **Rating** | Star + score + review count |
| **Price** | GH₵ format, 15px, weight 700 |
| **Add to Cart** | Full width, `{colors.primary}` background |

---

## Category Adaptations (for CartHouse)

Replace "Marketplace" filter with categories from database:
- All
- Phones & Tablets
- Laptops & Computers
- Audio
- Gaming
- Cameras
- Wearables
- Smart Home
- Accessories
- TVs
- Drones
- Storage
- Networking
- VR / AR
- Car Electronics
- Parts & Accessories

---

## State Variables

```typescript
type FilterState = {
  status: "all" | "in_stock" | "on_sale";
  priceMin: number;
  priceMax: number;
  categories: string[];
  brands: string[];
  searchQuery: string;
  sortBy: "trending" | "price_asc" | "price_desc" | "newest" | "top_rated";
  viewMode: "grid_2" | "grid_3";
  sidebarOpen: boolean;
};
```

---

## Key Meta Design Principles

1. **Pill-shaped buttons** — Always use `{rounded.full}` (100px radius)
2. **Photography-first** — Large product images, white canvas
3. **Dual CTA pattern** — Black primary (marketing) + outlined secondary
4. **Cobalt for commerce** — `{colors.primary}` only for "Add to Cart"
5. **32px card radius** — Minimum for any photographic surface
6. **Negative letter-spacing** — `-0.14px` to `-0.16px` on body text

---

## Build Commands

From `apps/storefront`:
- Dev: `npm run dev` (port 7777)
- Build: `npm run build`
- Lint: `npm run lint`

---

## Files to Create/Update

### New Files
- `src/components/storefront/Navbar.tsx`
- `src/components/storefront/Sidebar.tsx`
- `src/components/storefront/FilterPanel.tsx`
- `src/components/storefront/Toolbar.tsx`
- `src/components/storefront/ProductCard.tsx`
- `src/components/storefront/ProductGrid.tsx`
- `src/components/storefront/Footer.tsx`
- `src/app/(storefront)/page.tsx` — Main storefront page

### Update Existing
- `src/app/page.tsx` — Redirect to storefront or keep as landing
- Add CSS variables for color mapping

---

## Next Steps

1. Merge issue #5 PR first
2. Create issue for customer homepage implementation
3. Build components in order specified above
4. Connect to database for products/categories
5. Add responsive behavior