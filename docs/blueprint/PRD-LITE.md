# GiftShop — PRD-Lite (Portfolio Demo)

**Mode:** Portfolio Demo  
**Brand Name:** GiftShop (literal, unbranded demo identity)  
**Approved Visual Direction:** Direction B — Editorial Gallery (Warm Parchment, Espresso & Sienna)  
**Currency & Locale:** INR (`₹`, `en-IN` number formatting)  
**Hosting Readiness:** Local dev/preview verified in Brave + static bundle ready for 1-command Cloudflare Workers deploy

---

## 1. Product Goal & Audience
Showcase a high-craft luxury gift boutique storefront paired with an operational Admin Panel in a single zero-friction demo. Portfolio reviewers and prospective e-commerce clients can shop like a customer (filter, personalize/engrave, gift-wrap with a stationery note, place an order) and immediately switch to the Admin Panel to inspect updated sales charts, revenue KPIs, inventory levels, and order records.

---

## 2. Core Functional Scope

### A. Global Shell & Mode Switching
* Sticky top navigation (`64px`) with `GiftShop` wordmark, one-click **`Storefront / Admin`** segmented switcher, and context action (`Bag (N)` on Storefront, `Reset demo` on Admin).
* **Zero AI-slop UI copy:** Never display pulsing status dots or phrases like *"Live stock sync"* / *"Live database sync"*.

### B. Storefront (`Storefront`)
1. **Asymmetric Editorial Hero (`55 / 45` split):** Oversized serif headline, one concise value sentence, primary/secondary CTAs, quick 4-department index on the left; full-bleed studio photography on the right.
2. **Curated 2-Up Editorial Spread:** Two photography-led feature highlights (Botanical Hampers & Studio Stoneware) that open product detail drawers directly.
3. **4-Department Filterable Catalog:**
   * Departments: **Luxury Gift Boxes**, **Personalized & Engraved**, **Flowers, Plants & Hampers**, **Home & Lifestyle**.
   * Filters: Department tabs, Occasion select (`Birthday`, `Anniversary`, `Wedding`, `Housewarming`, `Thank You`), Price Range filter, and Search input.
   * Borderless `4:5` real editorial product photography grid (`1 / 2 / 4` columns across `320px → 1920px`).
4. **Product Detail Drawer:** Full photo, description, INR price, current stock count, optional **Custom Brass Engraving** input (`max 28 chars`) for personalizable items, and Add to Bag action.
5. **Slide-Over Gift Bag & Simulated Checkout:**
   * Quantity controls constrained to available stock.
   * **Signature Linen Gift Wrap** toggle (`+₹199`).
   * **Handwritten Gift Note** textarea with real-time **Stationery Card Preview** (linen-textured serif card).
   * **Place Demo Order**: decrements product stock, appends a new order (`#GS-1048+`) to state, clears bag, and displays a grounded toast (`Order #GS-1048 placed (₹...) — Open Admin`).

### C. Admin Workspace (`Admin`)
Left sidebar rail (`220px` desktop, collapsible/stacked on mobile) with 3 tabs:
1. **Analytics:**
   * `7D / 30D / 90D` date-range toggle.
   * 4 KPI cards in a hairline-divided editorial strip: **Gross Revenue**, **Orders**, **Avg Order Value**, **Low-Stock SKUs (≤5)**.
   * **Revenue Over Time** (Recharts Area Chart), **Sales by Department** (Recharts Donut/Pie Chart), and **Top-Selling Gifts** (Recharts Horizontal Bar Chart) — all computed dynamically from the live orders array.
2. **Inventory Manager:**
   * Search/filter table with product thumbnail, SKU, department, inline editable INR price, inline `-` / `+` stock stepper, stock status (`In stock`, `Low stock`, `Out of stock`), **Add Product** modal, Edit/Delete product. Every change reflects immediately on the Storefront.
3. **Orders Log:**
   * Seeded 90-day order history plus any newly placed storefront orders (showing engraving text, gift wrap flag, and handwritten gift note).
   * Inline order status switcher (`Pending`, `Packed`, `Shipped`, `Delivered`).

---

## 3. Data & Persistence
* **Client-Side Demo Engine:** React Context + `localStorage` persistence (`giftshop_demo_v1`) seeded with 12 editorial products across all 4 departments and realistic 90-day INR order history.
* **1-Click Reset Demo:** Restores initial seeded products, orders, and starter bag item cleanly.

---

## 4. Tech Stack (Locked)
* **Frontend:** React 19 + TypeScript + Vite 6
* **Styling:** Tailwind CSS v4 (`@import "tailwindcss";` + `@tailwindcss/vite`)
* **Charts:** Recharts (`ResponsiveContainer`, `AreaChart`, `PieChart`, `BarChart`)
* **Icons:** `@phosphor-icons/react` (`light` weight on Storefront, `regular` on Admin — single consistent SVG set)
* **Deploy Target:** Static `dist/` bundle configured for Cloudflare Workers (`wrangler.jsonc` / static assets) ready for 1-command deployment.

---

## 5. Out of Scope
* Payment gateway integration, user authentication backend, email/SMS notifications, multi-warehouse shipping calculators, and server-side database.
