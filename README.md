# Next Faster ⚡

Demo **Hover Prefetch** với API caching trong Next.js.

## 🎯 Concept

Khi user hover vào link **đủ lâu (>200ms)**, app sẽ:
1. Prefetch Next.js route 
2. **Call API và cache data trong background**
3. Khi user click, data đã sẵn trong cache → Load instant! ⚡

**Smart delay:** Nếu user chỉ chạm qua nhanh (<200ms), prefetch sẽ bị cancel để tiết kiệm bandwidth!

## 🚀 Cách chạy

```bash
npm install
npm run dev
```

Mở: http://localhost:3000

## 💡 Cách test

1. **Mở DevTools Console** (F12)
2. **Test hover đủ lâu:**
   - Hover vào Product 1 button (giữ >200ms)
   - Xem console log:
     - `🖱️ Hover Prefetch: /product/1`
     - `🌐 Fetching product 1 from API...`
     - `✅ Product 1 fetched in ~1500ms`
     - `🖱️ Data prefetched for product: 1`
   - Click vào link → Thấy badge "⚡ INSTANT LOAD" với load time < 100ms

3. **Test hover nhanh (cancel):**
   - Hover vào Product 2 rồi rời ra ngay (<200ms)
   - Xem console: `❌ Hover cancelled: /product/2`
   - Không có API call = tiết kiệm bandwidth!

4. **Test không hover:**
   - Click trực tiếp vào Product 3 (không hover)
   - Thấy "🐌 Slow Load" với ~1500ms

## 📦 Cấu trúc

```
app/
  ├── api/products/[id]/route.ts  # Fake API với delay 1.5s
  ├── product/[id]/page.tsx       # Product page (client component)
  └── page.tsx                    # Home page
components/
  └── hover-link.tsx              # Hover prefetch component
lib/
  └── api.ts                      # API client với cache + pending request tracking
```

## 🔄 Xử lý Duplicate API Calls

**Vấn đề:** User hover → API call bắt đầu → User click ngay → 2 API calls!

**Giải pháp:** Track pending requests trong `lib/api.ts`:
- Nếu đã có API call đang chạy cho cùng product → **Đợi nó xong**
- Console log: `⏳ Waiting for pending request for product X`
- Cả 2 requests (hover + click) sẽ **share cùng 1 API call**
- Chỉ 1 request thực sự đến server!

## ⚡ Performance

- **Không prefetch**: Click → API call 1500ms → Render → Total: ~1500ms
- **Hover nhanh (<200ms)**: Hover → Cancel → Không API call → Tiết kiệm bandwidth
- **Hover đủ lâu (>200ms)**: Hover → API in background → Click → Cache < 10ms → Total: Instant!

## 🔧 Tech Stack

- Next.js 16 (App Router + Turbopack)
- TypeScript
- Tailwind CSS 4
- React 19

---

Made for learning Next.js optimization ❤️
