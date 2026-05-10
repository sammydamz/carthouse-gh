# CartHouse GH — E-Commerce Platform Design

**Date:** 2026-05-09
**Status:** Draft
**Purpose:** Complete refactor from car dealership to general e-commerce store

---

## 1. Overview

CartHouse GH is a general e-commerce platform selling electronics, home appliances, and clothing/fabrics. Key differentiator: suppliers handle delivery directly to customers. Platform supports both authenticated and guest checkout, with Paystack and Cash on Delivery (COD) as payment options.

---

## 2. Product Model

### 2.1 Core Fields

| Field | Type | Description |
|---|---|---|
| id | cuid | Primary key |
| name | String | Product name |
| slug | String | URL-friendly identifier (unique) |
| description | Text | Product description |
| price | Float | Selling price (includes margin) |
| condition | String | Optional: "New", "Used", "Refurbished" |
| stock | Int | Available quantity (managed manually) |
| isAvailable | Boolean | Visible on site |
| isDeleted | Boolean | Soft delete |
| media | String[] | Array of image/video URLs |
| videoUrl | String? | Optional product video |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### 2.2 Product Variants (Clothing)

| Field | Type | Description |
|---|---|---|
| variantId | String | SKU-style identifier |
| size | Enum | S, M, L, XL, XXL |
| color | String | Color name |
| stock | Int | Stock per variant |

**Note:** Gadgets/electronics use single variant (no size/color).

### 2.3 Product-Supplier Link

| Field | Type | Description |
|---|---|---|
| supplierId | String | FK to Supplier |
| supplierCost | Float? | Cost price from supplier (internal) |

---

## 3. Category Structure

Top-level categories with optional sub-categories (brands):

```
Phone Accessories
├── Airpods
├── Chargers
├── Cables
├── Cases
└── Power Banks

Computing
├── Mifi Devices
├── Keyboard & Mouse
├── Laptop Chargers
└── Laptop Stands

Kitchen Appliances
├── Blenders
├── Rice Cookers
├── Electric Cookers
└── Microwaves

Home Appliances
├── Air Conditioners (AC)
├── Televisions (TV)
├── Fans
├── Irons
└── Extension Boards

Clothing & Fabrics
├── Men's Wear
├── Women's Wear
├── Children's Wear
└── Fabrics
```

---

## 4. Supplier Model

Admin-only. Never exposed to customers.

| Field | Type | Description |
|---|---|---|
| id | cuid | Primary key |
| name | String | Supplier name |
| phone | String | WhatsApp number |
| email | String? | Contact email |
| address | String? | Business address |
| deliveryZones | String[] | Areas they deliver to |
| deliveryFee | Float? | Default delivery fee |
| notes | String? | Internal notes |
| products | Product[] | Linked products |

### 4.1 Supplier-Order Flow

1. Order created in admin
2. Admin clicks "Send to Supplier" button
3. WhatsApp opens with pre-filled message:
   ```
   New Order #ORD-XXXX

   Customer: [Name]
   Phone: [Phone]
   Address: [Address]

   Product: [Product Name]
   Quantity: [Qty]
   Size: [Size if applicable]
   Color: [Color if applicable]

   Payment: [Paystack / COD]
   Amount Paid: [GH₵ Amount]

   Please deliver to customer. Thank you!
   ```

---

## 5. Payment Methods

### 5.1 Paystack (Full Prepayment)

- Customer enters card details
- Payment captured immediately
- Order marked as "Paid"
- Admin notified via dashboard/email

### 5.2 Cash on Delivery (COD)

- Order created with "COD Pending" status
- Supplier notified with COD flag
- Payment collected on delivery
- Status updated to "Delivered + Paid"

---

## 6. Checkout Flow

### 6.1 Guest Checkout (Primary)

**Step 1: Cart Review**
- View items, quantities, subtotal
- Update or remove items

**Step 2: Delivery Information**
- Full name (required)
- Phone number (required)
- Region/Area (dropdown)
- Detailed address (required)
- Delivery instructions (optional)

**Step 3: Payment Method**
- Paystack (default first)
- Cash on Delivery

**Step 4: Order Confirmation**
- Order number generated
- Summary displayed
- WhatsApp tracking link provided
- Email confirmation (optional)

### 6.2 Account Checkout (Optional)

- Customer can create account to save:
  - Delivery addresses
  - Order history
  - Wishlist
- Account is **never required** for checkout

---

## 7. Order Model

| Field | Type | Description |
|---|---|---|
| id | cuid | Primary key |
| orderNumber | String | Human-readable: ORD-XXXX |
| customerName | String | From checkout |
| customerPhone | String | From checkout |
| customerAddress | String | From checkout |
| paymentMethod | Enum | PAYSTACK, COD |
| paymentStatus | Enum | PENDING, PAID, DELIVERED_PAID |
| orderStatus | Enum | PENDING, CONFIRMED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED |
| totalAmount | Float | Order total |
| deliveryFee | Float | Included in total |
| items | OrderItem[] | Array of products ordered |
| notes | String? | Internal notes |
| createdAt | DateTime | Auto |

### 7.1 OrderItem

| Field | Type | Description |
|---|---|---|
| productId | String | FK to Product |
| productName | String | Snapshot at order time |
| quantity | Int | Ordered quantity |
| price | Float | Price at order time |
| size | String? | For clothing |
| color | String? | For clothing |
| supplierId | String | FK to Supplier |

---

## 8. Site Structure

### 8.1 Customer Pages

| Route | Description |
|---|---|
| `/` | Homepage — featured products, categories, banner carousel |
| `/products` | All products with filters (category, price range) |
| `/products/[slug]` | Product detail — images, video, sizes, add to cart |
| `/category/[slug]` | Category listing with brand filter |
| `/cart` | Shopping cart |
| `/checkout` | Guest checkout form |
| `/checkout/account` | Account checkout (logged in users) |
| `/order/[id]` | Order confirmation / tracking |
| `/account` | Customer account — orders, addresses (optional) |

### 8.2 Admin Pages

| Route | Description |
|---|---|
| `/admin` | Dashboard — orders overview, recent activity |
| `/admin/products` | Product list, add/edit/delete |
| `/admin/products/new` | Add product form |
| `/admin/products/[id]` | Edit product |
| `/admin/categories` | Manage categories and brands |
| `/admin/suppliers` | Manage suppliers |
| `/admin/orders` | Order list with status filters |
| `/admin/orders/[id]` | Order detail + supplier actions |
| `/admin/banners` | Homepage banner management |
| `/admin/settings` | Site config, business info |

---

## 9. Homepage Layout

### 9.1 Sections (Top to Bottom)

1. **Navigation Bar**
   - Logo (CartHouse GH)
   - Category links
   - Search bar
   - Cart icon with count

2. **Hero Banner Carousel**
   - Rotating promotional banners
   - Auto-play with manual navigation

3. **Category Grid**
   - Visual cards for each category
   - Icon/image + category name

4. **Featured Products**
   - 8-12 handpicked products
   - "Add to Cart" button

5. **Flash Sales / Deals** (optional)
   - Countdown timer
   - Discount badges

6. **New Arrivals**
   - Recently added products

7. **Footer**
   - Contact info
   - Social links
   - Payment icons

---

## 10. Product Detail Page

- Image gallery (main + thumbnails, video support)
- Product name, price, description
- **For clothing:** Size selector, color selector, stock per variant
- **For gadgets:** Add to cart directly
- Quantity selector
- Add to Cart button
- WhatsApp inquiry button (alternative to checkout)
- Related products section

---

## 11. Admin Dashboard

### 11.1 Product Management

Form fields:
- Name, Slug (auto-generated, editable)
- Category (dropdown)
- Brand (optional)
- Description (rich text)
- Price (selling price)
- Supplier (dropdown)
- Stock quantity
- Media upload (images + video)
- Size/Color variants (for clothing)
- Availability toggle

### 11.2 Supplier Management

Form fields:
- Name
- WhatsApp number
- Email
- Address
- Delivery zones
- Notes

### 11.3 Order Management

- List view with columns: Order #, Customer, Items, Total, Status, Date
- Filters: All, Pending, COD, Delivered
- Individual order view:
  - Customer info
  - Items ordered
  - Payment status
  - **"Send to Supplier"** button → WhatsApp
  - Status update dropdown

---

## 12. Data Migration

### 12.1 Remove (Car dealership content)

- `Car` model → Delete
- `Brand` model → Delete
- `WhatsappClick` model → Delete
- Homepage car listings → Remove
- Car-related components → Remove

### 12.2 Retain (Framework)

- User/Auth system (Admin accounts)
- UI components (button, card, input, etc.)
- Design tokens (colors, typography)
- Prisma schema structure
- Next.js app structure
- Email templates

### 12.3 Add (New models)

- Product (replaces Car)
- Category (replaces Brand)
- Supplier (new)
- Order (new)
- OrderItem (new)
- Banner (existing, keep)

---

## 13. Technical Stack

- **Frontend:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Admin auth (JWT), Customer accounts optional
- **Payments:** Paystack API
- **Media:** Cloudinary / UploadThing
- **Email:** React Email
- **State:** React Context / Zustand
- **Forms:** React Hook Form + Zod

---

## 14. Implementation Order

1. **Schema Refactor** — Drop Car/Brand, add Product/Category/Supplier/Order
2. **Admin Setup** — Auth, layout, navigation
3. **Category & Supplier Management** — CRUD in admin
4. **Product Management** — CRUD with media upload, variants
5. **Customer Homepage** — Categories, featured products, banners
6. **Product Listing & Detail** — Filters, image gallery, variants
7. **Cart System** — Add/remove, persist
8. **Checkout Flow** — Guest form, payment method selection
9. **Paystack Integration** — Payment capture
10. **Order Management** — Admin list, detail, WhatsApp action
11. **Order Confirmation** — Customer view, tracking link
12. **Email Notifications** — Order confirmations
13. **Polish** — Animations, loading states, error handling

---

### 5.3 Delivery Fee

- Delivery fee is **NOT calculated at checkout**
- Customer places order, payment is collected (Paystack or COD)
- After order, you **call customer** to inform delivery fee and arrange delivery
- This keeps things flexible for your operation

---

## 15. Open Questions

- [x] Paystack account setup — **Live mode**
- [x] Delivery fee structure — **Handled manually via phone call**
- [x] Product images source — **Admin uploads via UploadThing**
- [ ] Social media integration (auto-post new products)?
- [ ] Review/rating system for products?
- [ ] Newsletter signup?