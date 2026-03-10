# Next Faster ⚡

Demo **Generic Hover Prefetch Component** - Một component tái sử dụng được cho mọi loại data!

## 🎯 Key Features

### 1. **Generic & Reusable** 🔧
- Cùng 1 component `<HoverLink>` nhưng dùng cho:
  - 📦 Products → `usePrefetchProduct()`
  - 👥 Users → `usePrefetchUser()`
  - 📝 Posts, Categories, v.v. (dễ dàng extend!)

### 2. **Smart Prefetching** 🧠
Khi user hover vào link **đủ lâu (>200ms)**:
1. Prefetch Next.js route (instant navigation)
2. **Call API và cache data qua React Query**
3. Click → Data từ cache → Load instant! ⚡

### 3. **Bandwidth Optimization** 📊
- Hover nhanh (<200ms) → Cancel prefetch
- Click trong lúc prefetch → Share cùng 1 API call (không duplicate)

## 🚀 Cách chạy

```bash
npm install
npm run dev
```

Mở: http://localhost:3000

## 💡 Cách test

### Test Products (Blue cards)
1. **Mở DevTools Console** (F12)
2. **Test prefetch thành công:**
   - Hover vào Product 1 card (giữ >200ms)
   - Console: `🖱️ Hover Prefetch (Route): /product/1`
   - Click → Load time < 100ms (⚡ Instant)

3. **Test hover cancel:**
   - Hover vào Product 2 rồi rời ra ngay (<200ms)
   - Console: `❌ Hover cancelled: /product/2`

4. **Test không prefetch:**
   - Click trực tiếp Product 3 (không hover)
   - Load time ~1500ms (🐌 Slow)

### Test Users (Purple cards)
- **Same component**, different hook!
- Hover vào @john → Prefetch user data
- Click → Load instant từ React Query cache

## 📦 Cấu trúc

```
app/
  ├── (public)/
  │   ├── product/[id]/page.tsx   # Product detail page
  │   └── user/[id]/page.tsx      # User profile page
  ├── api/
  │   ├── products/[id]/route.ts  # 📦 Product API (1.5s delay)
  │   └── users/[id]/route.ts     # 👥 User API (1.5s delay, same pattern!)
  └── page.tsx                    # Home page
components/
  ├── hover-link.tsx              # 🌟 Generic hover prefetch component
  ├── product-list.tsx            # Product list using HoverLink
  └── user-list.tsx               # User list using HoverLink (same component!)
hooks/
  ├── use-product.ts              # Product data hooks (useProduct, usePrefetchProduct)
  └── use-user.ts                 # User data hooks (useUser, usePrefetchUser)
providers/
  └── query-provider.tsx          # React Query setup
```

## 🎨 Component API

### HoverLink Component

```tsx
<HoverLink
  href="/product/1"
  hoverDelay={200}                // Optional: delay before prefetch (default: 200ms)
  onPrefetch={async () => {       // Optional: custom prefetch logic
    await prefetchProduct('1');
  }}
  disableRoutePrefetch={false}    // Optional: disable route prefetch
>
  Your content
</HoverLink>
```

### Ví dụ sử dụng

```tsx
// Product List
function ProductList() {
  const prefetchProduct = usePrefetchProduct();
  
  return (
    <HoverLink 
      href="/product/1"
      onPrefetch={() => prefetchProduct('1')}
    >
      View Product 1
    </HoverLink>
  );
}

// User List - SAME component!
function UserList() {
  const prefetchUser = usePrefetchUser();
  
  return (
    <HoverLink 
      href="/user/john"
      onPrefetch={() => prefetchUser('john')}
    >
      View @john
    </HoverLink>
  );
}
```

## 🔄 React Query Auto-Deduplication

**Vấn đề:** User hover → API call bắt đầu → User click ngay → 2 API calls?

**Giải pháp:** React Query tự động xử lý!
- Nếu đã có query đang chạy → **Reuse promise đó**
- Cả hover và click share cùng 1 API call
- Không cần code thêm gì!

## ⚡ Performance

- **Không prefetch**: Click → API call 1500ms → Render → Total: ~1500ms
- **Hover nhanh (<200ms)**: Hover → Cancel → Không API call → Tiết kiệm bandwidth
- **Hover đủ lâu (>200ms)**: Hover → API in background → Click → Cache < 10ms → Total: Instant!

## 🔧 Tech Stack

- Next.js 16 (App Router + Turbopack)
- React 19
- TypeScript
- **React Query (@tanstack/react-query)** - Data fetching & caching
- Tailwind CSS 4

## 🎓 Learning Points

### 1. **Component Design Patterns**
- ❌ **Bad:** Hardcode logic trong component
  ```tsx
  // ❌ Chỉ work với products
  const productId = href.match(/\/product\/(\d+)/)?.[1];
  if (productId) await prefetchProduct(productId);
  ```

- ✅ **Good:** Generic với callback
  ```tsx
  // ✅ Work với bất kỳ data type nào
  if (onPrefetch) await onPrefetch();
  ```

### 2. **React Query Benefits**
- Auto deduplication (không duplicate requests)
- Background refetching
- Cache management với staleTime & gcTime
- Built-in loading/error states
- DevTools for debugging

### 3. **Performance Optimization**
- Hover delay → Reduce unnecessary prefetches
- Cancel mechanism → Save bandwidth
- Cache → Instant subsequent loads

---

Made for learning Next.js optimization & component design ❤️
