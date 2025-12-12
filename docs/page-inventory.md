# Page Inventory & SEO Strategy

## Public Pages (SEO Critical - SSG/ISR)

### 1. Homepage `/`
- **File:** `src/app/page.tsx`
- **Rendering:** ISR (revalidate: 60s)
- **SEO Priority:** Critical
- **Meta Strategy:**
  - Title: "Dncell Marketplace - Jual Beli HP & Laptop Bekas Berkualitas"
  - Description: "Marketplace terpercaya untuk jual beli handphone dan laptop second berkualitas dengan harga terbaik. Transaksi aman dan mudah."
  - Keywords: "marketplace indonesia, hp bekas, laptop second, jual beli online"
  - OG Type: website
- **Components:** HomeBanner, ProductSection (featured products)
- **Structured Data:** Organization, BreadcrumbList

### 2. Products List `/products` *(Not implemented yet)*
- **Status:** TODO - Need to create page
- **Rendering:** ISR (revalidate: 60s)
- **SEO Priority:** High
- **Meta Strategy:**
  - Title: "Daftar Produk - Dncell Marketplace"
  - Description: "Jelajahi koleksi HP/Laptop second berkualitas dengan harga terbaik"
  - Keywords: "handphone bekas, laptop second, marketplace indonesia"

### 3. Product Detail `/products/[id]`
- **File:** `src/app/products/[id]/page.tsx`
- **Rendering:** ISR (revalidate: 120s) + generateStaticParams
- **SEO Priority:** Critical
- **Meta Strategy:**
  - Title: "{Product Name} - Dncell Marketplace"
  - Description: First 160 chars of product description
  - OG Type: product
  - OG Image: Product main image
- **Components:** ProductImageCarousel, ProductDetails, PriceSection
- **Structured Data:** Product schema (price, availability, condition, seller)

### 4. Categories List `/categories`
- **File:** `src/app/categories/page.tsx`
- **Rendering:** ISR (revalidate: 300s)
- **SEO Priority:** High
- **Meta Strategy:**
  - Title: "Kategori Produk - Dncell Marketplace"
  - Description: "Temukan produk berdasarkan kategori: Handphone, Laptop, Tablet, dan lainnya"
  - Keywords: "kategori hp, kategori laptop, marketplace kategori"

### 5. Category Detail `/categories/[id]`
- **File:** `src/app/categories/[id]/page.tsx`
- **Rendering:** ISR (revalidate: 120s) + generateStaticParams
- **SEO Priority:** High
- **Meta Strategy:**
  - Title: "{Category Name} - Dncell Marketplace"
  - Description: "Lihat semua produk {Category Name} berkualitas dengan harga terbaik"
  - OG Type: website
- **Structured Data:** BreadcrumbList, ItemList

---

## User-Only Pages (SSR with Auth)

### 6. Negotiations `/negotiations`
- **File:** `src/app/negotiations/page.tsx`
- **Rendering:** SSR (force-dynamic)
- **SEO Priority:** Low (requires auth)
- **Meta Strategy:**
  - Title: "Negosiasi Saya - Dncell Marketplace"
  - Description: "Kelola negosiasi harga produk Anda"
  - Robots: noindex, nofollow

### 7. Negotiation Detail `/negotiations/[id]` *(Not implemented yet)*
- **Status:** TODO
- **Rendering:** SSR
- **Robots:** noindex, nofollow

### 8. Orders `/profile/orders`
- **File:** `src/app/profile/orders/page.tsx`
- **Rendering:** SSR (force-dynamic)
- **SEO Priority:** None
- **Robots:** noindex, nofollow

### 9. Order Detail `/orders/[id]` *(Not implemented yet)*
- **Status:** TODO
- **Rendering:** SSR
- **Robots:** noindex, nofollow

### 10. Notifications `/notifications` *(Not implemented yet)*
- **Status:** TODO
- **Rendering:** SSR
- **Robots:** noindex, nofollow

### 11. Profile `/profile`
- **File:** `src/app/profile/page.tsx`
- **Rendering:** SSR (force-dynamic)
- **Robots:** noindex, nofollow

### 12. Profile Edit `/profile/edit`
- **File:** `src/app/profile/edit/page.tsx`
- **Rendering:** SSR
- **Robots:** noindex, nofollow

### 13. Profile Favorites `/profile/favorites`
- **File:** `src/app/profile/favorites/page.tsx`
- **Rendering:** SSR
- **Robots:** noindex, nofollow

### 14. Profile Negotiations `/profile/negotiations`
- **File:** `src/app/profile/negotiations/page.tsx`
- **Rendering:** SSR
- **Robots:** noindex, nofollow

---

## Auth Pages (SSR + noindex)

### 15. Login `/login`
- **File:** `src/app/login/page.tsx`
- **Rendering:** SSR
- **SEO Priority:** None
- **Meta Strategy:**
  - Title: "Masuk - Dncell Marketplace"
  - Robots: noindex, nofollow

### 16. Register `/register`
- **File:** `src/app/register/page.tsx`
- **Rendering:** SSR
- **Robots:** noindex, nofollow

### 17. Forgot Password `/forgot-password`
- **File:** `src/app/forgot-password/page.tsx`
- **Rendering:** SSR
- **Robots:** noindex, nofollow

---

## Utility Pages

### 18. Search `/search`
- **File:** `src/app/search/page.tsx`
- **Rendering:** SSR (query-based)
- **SEO Priority:** Medium
- **Meta Strategy:**
  - Title: "Pencarian: {query} - Dncell Marketplace"
  - Robots: noindex (dynamic content)

### 19. Offline `/offline`
- **File:** `src/app/offline/page.tsx`
- **Rendering:** Static
- **Robots:** noindex

---

## Static Legal Pages (TODO)

### 20. Terms of Service `/terms` *(Not implemented)*
- **Rendering:** SSG (full static)
- **SEO Priority:** Low
- **Content:** Static markdown/text

### 21. Privacy Policy `/privacy` *(Not implemented)*
- **Rendering:** SSG (full static)
- **SEO Priority:** Low

### 22. About Us `/about` *(Not implemented)*
- **Rendering:** SSG (full static)
- **SEO Priority:** Medium

### 23. FAQ `/faq` *(Not implemented)*
- **Rendering:** SSG (full static)
- **SEO Priority:** Medium

---

## Summary Statistics

**Total Pages:** 23
- **Implemented:** 15
- **TODO:** 8

**By Rendering Type:**
- **SSG/ISR (Public):** 5 pages
- **SSR (Auth Required):** 9 pages
- **SSR (Auth Pages):** 3 pages
- **Static:** 6 pages (4 TODO)

**SEO Priority Distribution:**
- **Critical:** 2 pages (Homepage, Product Detail)
- **High:** 3 pages (Products List, Categories, Category Detail)
- **Medium:** 2 pages (Search, About)
- **Low/None:** 16 pages (Auth & User pages)

---

## Next Steps

1. ✅ Create SEO utilities (`lib/seo.ts`)
2. ✅ Implement meta tags for all existing pages
3. ✅ Setup ISR for public pages
4. ✅ Add JSON-LD structured data
5. ✅ Generate sitemap.xml
6. ✅ Create robots.txt
7. TODO: Create missing pages (Products List, static pages)
8. TODO: Optimize images (alt text, sizes)
9. TODO: Lighthouse audit & fixes
