# Layout System — Rarible-Inspired NFT Storefront

> A pixel-accurate breakdown of every element, position, spacing, and interaction pattern for the storefront browse page. Designed so an AI agent with no image access can reconstruct it exactly.

---

> ⚠️ **COLOR INSTRUCTION FOR AI AGENT**
> Do **not** invent or hardcode any color values. This layout document intentionally omits all hex/rgb values. You must map every color token listed below (e.g. `--color-bg`, `--color-text-primary`) to the **user's pre-approved design system**. Carefully read the existing design system / token file and match each token to the closest semantic equivalent. The visual hierarchy described (primary text, muted text, borders, active states, accents) must be faithfully preserved — only the exact values come from the user's system.

---

## 1. Overall Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVBAR (top, full width)             │
├──────────────────────┬──────────────────────────────────────┤
│   LEFT SIDEBAR       │        MAIN CONTENT AREA             │
│   (fixed width)      │   ┌──────────────────────────────┐   │
│                      │   │  TAB BAR (NFTs / Collections/ │   │
│  ┌──────────────┐    │   │  Users)                       │   │
│  │ FILTER PANEL │    │   ├──────────────────────────────┤   │
│  │              │    │   │  TOOLBAR (filters toggle,    │   │
│  │  - Blockchain│    │   │  search, sort, view toggle)  │   │
│  │  - Status    │    │   ├──────────────────────────────┤   │
│  │  - Price     │    │   │  NFT CARD GRID               │   │
│  │  - Marketplace│   │   │  (5 columns, infinite scroll)│   │
│  └──────────────┘    │   └──────────────────────────────┘   │
└──────────────────────┴──────────────────────────────────────┘
```

- **Page background**: `--color-bg`
- **Max content width**: ~1400px, centered
- **Font family**: System sans-serif (similar to `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)

---

## 2. Navbar

### Layout
- Full-width, horizontally laid out
- Height: ~60px
- Background: `--color-bg`
- Bottom border: `1px solid` using `--color-border`
- Padding: `0 24px`
- `display: flex`, `align-items: center`, `justify-content: space-between`

### Left Section
- **Logo**: Square icon (~28×28px) using `--color-logo-accent` background, bold contrasting character "R" inside. Positioned leftmost. Font size ~16px bold.
- **Search bar**: Immediately to the right of the logo
  - Width: ~320px
  - Height: ~38px
  - Placeholder text: `"Search Web3"`
  - Border: `1px solid` using `--color-border`
  - Border radius: `8px`
  - Background: `--color-input-bg`
  - Left padding: `12px`
  - Has a small keyboard shortcut badge on the right side showing `/` — pill shape, ~20px wide, ~18px tall, background `--color-badge-bg`, border-radius `4px`, font-size `11px`, color `--color-text-muted`

### Center Section
- Two text nav links: **"Explore"** and **"Create"**
- Font size: `15px`
- Font weight: `500`
- Color: `--color-text-primary`
- Gap between links: `24px`

### Right Section (icon cluster, left to right)
1. **Rewards button**: Gradient pill — text `"Rewards"`, small diamond icon left. Background: `--color-rewards-gradient`. Text: `--color-on-accent`. Border-radius: `20px`. Padding: `6px 12px`. Font-size: `13px`
2. **Chat icon**: Speech bubble outline, ~22px, color `--color-icon`
3. **Lightning/Activity icon**: Lightning bolt outline, ~22px, color `--color-icon`
4. **Avatar**: Circular, ~32px diameter, uses `--color-avatar-gradient`
5. **Cart/Bag icon**: Shopping bag outline, ~22px, color `--color-icon`
- Gap between icons: `16px`

---

## 3. Tab Bar (Page-Level Navigation)

- Positioned directly below the navbar
- Left-aligned, starting at the same x-position as the sidebar
- Tabs: **NFTs** | **Collections** | **Users**
- Font size: `15px`, font weight: `600`
- Active tab ("NFTs"): Color `--color-text-primary`, underline `2px solid` using `--color-text-primary`
- Inactive tabs: Color `--color-text-muted`, no underline
- Tab height: ~44px
- Gap between tabs: `24px`
- Bottom border on whole tab bar: `1px solid` using `--color-border`

---

## 4. Toolbar (Filter Toggle Row)

Sits below the tab bar, full content width.

### Layout
- `display: flex`, `align-items: center`, `gap: 12px`
- Height: ~48px
- Padding: `8px 0`

### Elements (left to right)

1. **Filters button**
   - Text: `"Filters"`
   - Badge showing count `"2"`: circle ~16px, background `--color-accent`, color `--color-on-accent`, font-size `10px`
   - Border: `1px solid` using `--color-border`
   - Border radius: `8px`
   - Padding: `8px 14px`
   - Background: `--color-bg`
   - Font size: `14px`
   - Left-pointing chevron `<` icon before the text

2. **Clear all button**
   - Text: `"Clear all"`
   - No border, plain text link style
   - Color: `--color-text-primary`
   - Font size: `14px`, font weight: `500`

3. **Refresh icon button**
   - Circular arrows icon (↻)
   - ~34×34px
   - Border: `1px solid` using `--color-border`
   - Border radius: `8px`
   - Background: `--color-bg`

4. **Search bar** (inline, center)
   - Placeholder: `"Search by NFTs"`
   - Flex-grow: 1
   - Height: ~38px
   - Border: `1px solid` using `--color-border`
   - Border radius: `8px`
   - Background: `--color-bg`
   - Left magnifier icon inside input, color `--color-text-muted`

5. **Sort dropdown** (right side)
   - Label: `"Trending"` with dropdown chevron `˅`
   - Border: `1px solid` using `--color-border`
   - Border radius: `8px`
   - Padding: `8px 14px`
   - Background: `--color-bg`
   - Font size: `14px`
   - Min-width: ~130px

6. **View toggle buttons** (rightmost)
   - Two icon buttons: grid-2 and grid-3 layout icons
   - Each ~34×34px, border `1px solid` using `--color-border`, border-radius `8px`
   - Active toggle: background `--color-toggle-active-bg`
   - Inactive toggle: background `--color-bg`

---

## 5. Left Sidebar (Filter Panel)

### Container
- Width: `240px` (fixed)
- Sits to the left of the NFT grid
- Top-aligned with the toolbar row
- Background: `--color-bg`
- Padding right: `24px`

### Section 1 — Blockchain Selector
- Small icon (~24px, Ethereum logo style) + label `"Explore"` in `--color-text-muted` at `12px` above `"Ethereum Blockchain"` in `--color-text-primary` at `14px` weight `600`
- Dropdown chevron `˅` on far right
- Bottom: `1px solid` using `--color-border-light` separator

### Section 2 — Status
- Header: `"Status"` — `14px`, weight `700`, color `--color-text-primary`
- Collapse chevron `˄` on right (section expanded)
- Three pill toggle buttons laid out horizontally:
  1. **All** — inactive: border `1px solid` using `--color-border`, border-radius `20px`, padding `6px 16px`, background `--color-bg`, font-size `13px`, color `--color-text-secondary`
  2. **In Stock** — **active**: background `--color-active-pill`, color `--color-active-pill-text`, border-radius `20px`, padding `6px 16px`, font-size `13px`
  3. **On Sale** — inactive: same as "All" style
- Gap between buttons: `8px`

### Section 3 — Price
- Header: `"Price"` — same style as Status header
- Collapse chevron `˄` (expanded)
- Two number inputs side by side:
  - Left input: value `"0.1"` — width ~80px, border `1px solid` using `--color-border`, border-radius `8px`, padding `8px`, font-size `14px`, background `--color-input-bg`
  - Separator: text `"to"` — color `--color-text-muted`, font-size `13px`, padding `0 8px`
  - Right input: value `"1"` — same style as left
- Currency dropdown right of right input:
  - Shows `"ETH"` with chevron
  - Border `1px solid` using `--color-border`, border-radius `8px`, padding `8px 10px`
  - Background `--color-bg`
- **Apply button** below inputs:
  - Full sidebar width
  - Background: `--color-bg`
  - Border: `1px solid` using `--color-border`
  - Border radius: `8px`
  - Text: `"Apply"`, font-size `14px`, weight `500`, color `--color-text-primary`
  - Height: ~38px
  - Margin top: `8px`

### Section 4 — Marketplace
- Header: `"Marketplace"` — same header style
- Collapse chevron `˄` (expanded)
- List of marketplace options with checkboxes:

| Checkbox state | Logo | Name |
|----------------|------|------|
| ✅ checked | Yellow R square | Rarible |
| ✅ checked | Blue X circle | OpenSea |
| ☐ unchecked | Grey icon | x2y2 |
| ☐ unchecked | Green dot | LooksRare |
| ☐ unchecked | Purple M circle | SudoSwap |

- Each row: `display: flex`, `align-items: center`, `gap: 10px`, height ~36px
- Checkbox: `16px × 16px`, border-radius `4px`
  - Unchecked: background `--color-bg`, border `1px solid` using `--color-border`
  - Checked: background `--color-accent`, color `--color-on-accent`
- Logo icons: `20px × 20px`
- Name text: `14px`, color `--color-text-primary`, weight `400`
- Subtle divider `1px solid` using `--color-border-light` between rows

---

## 6. NFT Card Grid

### Grid Layout
- `display: grid`
- `grid-template-columns: repeat(5, 1fr)` — 5 equal columns
- `gap: 16px` (row and column)
- Width: fills remaining space after sidebar

### NFT Card — Anatomy

```
┌──────────────────────────┐
│                          │
│       IMAGE AREA         │  ← square aspect ratio (1:1)
│       (artwork)          │
│                    [↓]   │  ← download icon, bottom-right
└──────────────────────────┘
  Name / Collection Title  ···
  Price: X.XX ETH
```

#### Card Container
- Background: `--color-card-bg`
- Border: `1px solid` using `--color-border-light`
- Border radius: `12px`
- Overflow: hidden
- Cursor: pointer
- Hover: `box-shadow` using `--color-card-hover-shadow`
- Transition: `box-shadow 0.2s ease`

#### Image Area
- Aspect ratio: `1 / 1` (square)
- Width: 100% of card
- `object-fit: cover`
- Background fallback: `--color-image-placeholder`
- **Download icon overlay** — bottom-right corner:
  - Circular button, ~28px diameter
  - Background: `--color-overlay-bg` (semi-transparent)
  - Icon: downward arrow (↓), ~14px, color `--color-icon`
  - `position: absolute`, `bottom: 8px`, `right: 8px`
  - Border radius: `50%`
  - Box shadow: subtle using `--color-card-hover-shadow`

#### Card Body
- Padding: `10px 12px`

**Row 1 — Name row:**
- Left: Collection/NFT name — truncated with ellipsis
  - Font size: `13px`, weight `600`, color `--color-text-primary`
  - Max width: ~80% of card body
- Right: Three-dot menu (`···`)
  - Color: `--color-text-muted`
  - Font size: `16px`

**Row 2 — Price row:**
- Text: `"Price: X.XX ETH"`
- Font size: `12px`, color `--color-text-secondary`, weight `400`
- Margin top: `2px`

---

## 7. Product Card Sample Data

Use these as placeholder/seed data for the grid. All products are electronics. Each card shows: product image, product name (truncated if long), brand, price, and a short rating line.

| Product Name | Brand | Price (USD) | Rating | Category |
|---|---|---|---|---|
| AirPods Pro (2nd Gen) | Apple | $249.00 | ⭐ 4.8 (3.2k) | Audio |
| Galaxy S24 Ultra | Samsung | $1,299.00 | ⭐ 4.7 (8.1k) | Phones |
| MacBook Air M3 13" | Apple | $1,099.00 | ⭐ 4.9 (5.4k) | Laptops |
| Pixel 8 Pro | Google | $899.00 | ⭐ 4.6 (2.9k) | Phones |
| Sony WH-1000XM5 | Sony | $348.00 | ⭐ 4.8 (11k) | Audio |
| iPad Pro 12.9" M4 | Apple | $1,299.00 | ⭐ 4.9 (1.8k) | Tablets |
| Xbox Series X | Microsoft | $499.00 | ⭐ 4.8 (22k) | Gaming |
| DJI Mini 4 Pro | DJI | $759.00 | ⭐ 4.7 (940) | Drones |
| Kindle Paperwhite | Amazon | $139.99 | ⭐ 4.7 (61k) | E-Readers |
| Dell XPS 15 | Dell | $1,799.00 | ⭐ 4.5 (3.3k) | Laptops |
| Samsung 65" QLED 4K | Samsung | $1,097.00 | ⭐ 4.6 (7.2k) | TVs |
| Logitech MX Master 3S | Logitech | $99.99 | ⭐ 4.8 (14k) | Accessories |
| GoPro Hero 12 Black | GoPro | $399.99 | ⭐ 4.6 (4.1k) | Cameras |
| Apple Watch Ultra 2 | Apple | $799.00 | ⭐ 4.8 (2.6k) | Wearables |
| PlayStation 5 Slim | Sony | $449.99 | ⭐ 4.8 (31k) | Gaming |
| Bose QuietComfort 45 | Bose | $279.00 | ⭐ 4.7 (9.8k) | Audio |
| Samsung Galaxy Tab S9 | Samsung | $799.99 | ⭐ 4.6 (3.0k) | Tablets |
| Razer DeathAdder V3 | Razer | $69.99 | ⭐ 4.7 (5.5k) | Accessories |
| Anker 65W GaN Charger | Anker | $35.99 | ⭐ 4.8 (28k) | Accessories |
| Canon EOS R50 | Canon | $679.99 | ⭐ 4.6 (1.2k) | Cameras |
| LG C3 55" OLED 4K | LG | $1,296.99 | ⭐ 4.9 (6.7k) | TVs |
| Nintendo Switch OLED | Nintendo | $349.99 | ⭐ 4.8 (45k) | Gaming |
| Jabra Evolve2 85 | Jabra | $379.00 | ⭐ 4.6 (2.1k) | Audio |
| Lenovo ThinkPad X1 | Lenovo | $1,549.00 | ⭐ 4.5 (1.9k) | Laptops |
| Ring Video Doorbell 4 | Ring | $219.99 | ⭐ 4.5 (18k) | Smart Home |
| Apple TV 4K (3rd Gen) | Apple | $129.00 | ⭐ 4.7 (8.3k) | Streaming |
| Samsung T7 SSD 1TB | Samsung | $84.99 | ⭐ 4.8 (32k) | Storage |
| Elgato Stream Deck MK.2 | Elgato | $149.99 | ⭐ 4.8 (7.6k) | Accessories |
| Wyze Cam v3 Pro | Wyze | $49.98 | ⭐ 4.4 (4.4k) | Smart Home |
| Sony Alpha ZV-E10 | Sony | $748.00 | ⭐ 4.6 (2.2k) | Cameras |
| Garmin Fenix 7 | Garmin | $599.99 | ⭐ 4.7 (3.8k) | Wearables |
| Corsair K70 RGB | Corsair | $159.99 | ⭐ 4.6 (9.1k) | Accessories |
| Eufy RoboVac X8 | Eufy | $299.99 | ⭐ 4.5 (6.0k) | Smart Home |
| Microsoft Surface Pro 9 | Microsoft | $1,599.99 | ⭐ 4.5 (2.4k) | Laptops |
| JBL Charge 5 | JBL | $179.95 | ⭐ 4.7 (13k) | Audio |
| Oculus Quest 3 | Meta | $499.99 | ⭐ 4.7 (5.9k) | VR |
| TP-Link Archer AXE75 | TP-Link | $149.99 | ⭐ 4.5 (3.3k) | Networking |
| Philips Hue Starter Kit | Philips | $179.99 | ⭐ 4.6 (11k) | Smart Home |
| Steam Deck 512GB | Valve | $449.00 | ⭐ 4.8 (17k) | Gaming |
| Rode NT-USB Mini | Rode | $99.00 | ⭐ 4.7 (4.8k) | Audio |

### Card Field Details

Each product card should render the following fields:

| Field | Description |
|---|---|
| **Image** | Square product photo, `object-fit: contain` (not cover, since electronics use white/light bg) |
| **Brand** | Small label above the product name — font-size `11px`, color `--color-text-muted`, uppercase, letter-spacing `0.05em` |
| **Product Name** | Truncated at 2 lines max (`-webkit-line-clamp: 2`), font-size `13px`, weight `600`, color `--color-text-primary` |
| **Rating** | Star icon + score + review count in parentheses, font-size `11px`, color `--color-text-secondary` |
| **Price** | Prominent, font-size `15px`, weight `700`, color `--color-text-primary` |
| **Add to Cart button** | Full card width, shown on hover or always visible — text `"Add to Cart"`, uses `--color-accent` background, `--color-on-accent` text |

### Product Categories (for Sidebar Filter)

Replace the "Marketplace" filter section with a **Category** filter using these options:

- All
- Phones
- Laptops
- Audio
- Tablets
- Gaming
- Cameras
- Wearables
- Smart Home
- Accessories
- TVs
- Drones
- Storage
- Streaming
- Networking
- VR / AR

---

## 8. Spacing & Sizing Reference

| Element | Value |
|---------|-------|
| Navbar height | 60px |
| Tab bar height | 44px |
| Toolbar height | 48px |
| Sidebar width | 240px |
| Sidebar right padding | 24px |
| Grid gap | 16px |
| Card border radius | 12px |
| Card image border radius | `12px 12px 0 0` (top corners only) |
| Card body padding | `10px 12px` |
| Section header font size | 14px |
| Section header font weight | 700 |
| Filter button border radius | 8px |
| Status toggle border radius | 20px |
| Page horizontal padding | 24px |
| Gap between sidebar and grid | 24px |

---

## 9. Color Token Map

> ⚠️ **AI Agent instruction**: Do NOT assign values to these tokens yourself. Map each token to the equivalent token in the user's approved design system. The descriptions tell you the *role* each color plays — use that to find the right match in the existing system.

| Token | Role / Usage |
|-------|-------------|
| `--color-bg` | Page and component background (lightest surface) |
| `--color-card-bg` | Card surface — same as or slightly elevated from `--color-bg` |
| `--color-border` | Standard border for inputs, buttons, dividers |
| `--color-border-light` | Subtle separator lines (lighter than `--color-border`) |
| `--color-input-bg` | Input and search field background (slightly off from page bg) |
| `--color-text-primary` | Primary text — headings, labels, active nav, card titles |
| `--color-text-secondary` | Secondary text — prices, descriptions |
| `--color-text-muted` | Muted text — placeholders, inactive tabs, icon hints |
| `--color-icon` | Default icon color |
| `--color-accent` | Primary accent — checkbox fill, filter count badge |
| `--color-on-accent` | Text/icon color used on top of `--color-accent` surfaces |
| `--color-active-pill` | Background of an active/selected toggle pill (status filter) |
| `--color-active-pill-text` | Text color on the active pill |
| `--color-toggle-active-bg` | Background of the currently active view mode button |
| `--color-badge-bg` | Background of the keyboard shortcut `/` badge in search |
| `--color-logo-accent` | Logo icon background color |
| `--color-rewards-gradient` | Gradient used for the Rewards CTA button |
| `--color-avatar-gradient` | Gradient used for the user avatar circle |
| `--color-overlay-bg` | Semi-transparent overlay background (download icon button on card image) |
| `--color-image-placeholder` | Fallback background when card image hasn't loaded |
| `--color-card-hover-shadow` | Box shadow color on card hover (use as rgba with low opacity) |

---

## 10. Responsive Behavior

- **Desktop (≥1280px)**: 5-column grid, sidebar always visible
- **Tablet (768px–1279px)**: 3-column grid, sidebar collapses — accessible via "Filters" button
- **Mobile (<768px)**: 2-column grid, sidebar fully hidden, filters open as bottom sheet or modal

---

## 11. Interactive States

### Cards
- **Default**: No shadow, border using `--color-border-light`
- **Hover**: Elevated `box-shadow` using `--color-card-hover-shadow`
- **Image hover**: Download icon opacity increases from `0.7` to `1`

### Filter Toggles (Status)
- **Inactive**: Background `--color-bg`, border `--color-border`, text `--color-text-secondary`
- **Active**: Background `--color-active-pill`, text `--color-active-pill-text`, no border

### Checkboxes (Marketplace)
- **Unchecked**: Background `--color-bg`, border `--color-border`
- **Checked**: Background `--color-accent`, checkmark in `--color-on-accent`

### Toolbar Search
- **Focus**: Border changes to `--color-text-primary`, subtle inset shadow

### Dropdowns (Sort, ETH currency)
- **Hover**: Background shifts slightly toward `--color-border-light`
- **Open**: Border highlight + box shadow

---

## 12. Component Build Order

Build in this order to minimise dependency conflicts:

1. `<Navbar />` — logo, search, nav links, right icons
2. `<TabBar />` — NFTs / Collections / Users
3. `<Toolbar />` — filters toggle, inline search, sort, view mode buttons
4. `<Sidebar />` — blockchain picker, status pills, price range, marketplace checkboxes
5. `<NFTCard />` — image, download icon overlay, name row, price row
6. `<NFTGrid />` — CSS grid wrapper around `<NFTCard />`
7. `<PageLayout />` — sidebar + grid side-by-side
8. `<App />` — assembles everything, owns filter state

---

## 13. State Variables to Track

```typescript
type FilterState = {
  status: "all" | "in_stock" | "on_sale";
  priceMin: number;           // default 0
  priceMax: number;           // default 2000
  currency: "USD";
  categories: string[];       // [] means all selected
  brands: string[];           // [] means all selected
  searchQuery: string;
  sortBy: "trending" | "price_asc" | "price_desc" | "newest" | "top_rated";
  viewMode: "grid_2" | "grid_3";   // grid_3 is default (5 columns)
  sidebarOpen: boolean;             // default true
};
```
