# 🔧 Refactoring: From Hardcoded to Generic

## 🎯 Vấn đề ban đầu

Component `HoverLink` được thiết kế **hardcoded** cho Products:

```tsx
// ❌ BAD: Tight coupling với Product logic
export default function HoverLink({ ... }: HoverLinkProps) {
  const prefetchProduct = usePrefetchProduct(); // ❌ Hardcoded import
  
  const handleMouseEnter = () => {
    // ❌ Hardcoded URL pattern
    const productId = hrefString.match(/\/product\/(\d+)/)?.[1];
    
    if (productId) {
      // ❌ Chỉ work với products
      await prefetchProduct(productId);
    }
  };
}
```

### Vấn đề:
1. ❌ Không tái sử dụng được cho Users, Posts, Categories
2. ❌ Phải tạo `UserLink`, `PostLink`, `CategoryLink`... (duplicate code!)
3. ❌ Tight coupling - component phụ thuộc vào `use-product.ts`
4. ❌ Khó test - không thể mock prefetch logic

---

## ✅ Giải pháp: Callback Pattern

```tsx
// ✅ GOOD: Generic với optional callback
type HoverLinkProps = React.ComponentProps<typeof NextLink> & {
  hoverDelay?: number;
  onPrefetch?: () => void | Promise<void>; // ✅ Callback từ parent
  disableRoutePrefetch?: boolean;
};

export default function HoverLink({ onPrefetch, ... }: HoverLinkProps) {
  const handleMouseEnter = () => {
    // 1. Prefetch route
    router.prefetch(hrefString);
    
    // 2. Gọi callback (nếu có)
    if (onPrefetch) {
      await onPrefetch(); // ✅ Parent quyết định prefetch gì
    }
  };
}
```

---

## 📊 So sánh: Before vs After

| Aspect | Before (Hardcoded) | After (Generic) |
|--------|-------------------|-----------------|
| **Reusability** | ❌ Chỉ work với Products | ✅ Work với mọi data type |
| **Coupling** | ❌ Tight coupling với `use-product` | ✅ Loose coupling qua callback |
| **Extensibility** | ❌ Phải modify component để thêm type mới | ✅ Chỉ tạo hook mới |
| **Testing** | ❌ Khó mock prefetch logic | ✅ Dễ inject mock callback |
| **Maintenance** | ❌ 1 component = 1 responsibility vi phạm | ✅ Single responsibility principle |

---

## 🎨 Usage Examples

### Product List (Blue cards)

```tsx
'use client';
import HoverLink from './hover-link';
import { usePrefetchProduct } from '@/hooks/use-product';

export default function ProductList() {
  const prefetchProduct = usePrefetchProduct(); // ✅ Hook ở component cha
  
  return (
    <HoverLink 
      href="/product/1"
      onPrefetch={() => prefetchProduct('1')} // ✅ Inject logic
    >
      View Product 1
    </HoverLink>
  );
}
```

### User List (Purple cards)

```tsx
'use client';
import HoverLink from './hover-link'; // ✅ SAME component!
import { usePrefetchUser } from '@/hooks/use-user';

export default function UserList() {
  const prefetchUser = usePrefetchUser(); // ✅ Hook khác
  
  return (
    <HoverLink 
      href="/user/john"
      onPrefetch={() => prefetchUser('john')} // ✅ Logic khác
    >
      View @john
    </HoverLink>
  );
}
```

### Post List (Hypothetical)

```tsx
'use client';
import HoverLink from './hover-link'; // ✅ SAME component again!
import { usePrefetchPost } from '@/hooks/use-post';

export default function PostList() {
  const prefetchPost = usePrefetchPost();
  
  return (
    <HoverLink 
      href="/post/hello-world"
      onPrefetch={() => prefetchPost('hello-world')} // ✅ Slug-based
    >
      Read Post
    </HoverLink>
  );
}
```

### Plain Link (No prefetch)

```tsx
<HoverLink href="/about">
  {/* ✅ No onPrefetch → Chỉ prefetch route, không fetch data */}
  About Us
</HoverLink>
```

---

## 🏗️ Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────┐
│  HoverLink (Generic Component)              │
│  - Hover delay logic                        │
│  - Cancel mechanism                         │
│  - Route prefetch                           │
│  - Call onPrefetch() callback               │
└─────────────────────────────────────────────┘
                    ▲
                    │ Props: onPrefetch callback
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────────────┐       ┌──────────────┐
│ ProductList   │       │  UserList    │
│ (Client)      │       │  (Client)    │
│               │       │              │
│ - usePrefetch │       │ - usePrefetch│
│   Product()   │       │   User()     │
│               │       │              │
│ - Inject      │       │ - Inject     │
│   callback    │       │   callback   │
└───────────────┘       └──────────────┘
        │                       │
        ▼                       ▼
┌───────────────┐       ┌──────────────┐
│ use-product.ts│       │ use-user.ts  │
│ (Hook)        │       │ (Hook)       │
└───────────────┘       └──────────────┘
```

### Data Flow

```
1. User hover vào card
   ↓
2. HoverLink: setTimeout(hoverDelay)
   ↓
3. HoverLink: router.prefetch(href)  → Next.js prefetch route
   ↓
4. HoverLink: onPrefetch()           → Call parent callback
   ↓
5. ProductList: prefetchProduct(id)  → React Query prefetch
   ↓
6. React Query: Check cache
   ├─ Có cache → Skip
   └─ Chưa có  → Fetch API
   ↓
7. User click → Load instant từ cache!
```

---

## 🎓 Design Principles Applied

### 1. **Inversion of Control (IoC)**
- ❌ Before: Component quyết định prefetch gì
- ✅ After: Parent inject logic qua callback

### 2. **Single Responsibility Principle (SRP)**
- ✅ `HoverLink`: Chỉ lo hover logic, delay, cancel
- ✅ Parent component: Lo prefetch logic cụ thể

### 3. **Open/Closed Principle (OCP)**
- ✅ Open for extension: Thêm data type mới không cần sửa `HoverLink`
- ✅ Closed for modification: `HoverLink` không thay đổi

### 4. **Dependency Inversion Principle (DIP)**
- ✅ `HoverLink` depend on abstraction (`onPrefetch?: () => void`)
- ✅ Không depend on concrete implementation (`usePrefetchProduct`)

---

## 🧪 Testing Benefits

### Before (Hardcoded)

```tsx
// ❌ Khó test - phải mock toàn bộ use-product hook
jest.mock('@/hooks/use-product', () => ({
  usePrefetchProduct: jest.fn(),
}));

test('should prefetch on hover', () => {
  render(<HoverLink href="/product/1">Test</HoverLink>);
  // ...test code
});
```

### After (Generic)

```tsx
// ✅ Dễ test - chỉ cần inject mock callback
test('should call onPrefetch on hover', async () => {
  const mockPrefetch = jest.fn();
  
  render(
    <HoverLink href="/product/1" onPrefetch={mockPrefetch}>
      Test
    </HoverLink>
  );
  
  await userEvent.hover(screen.getByText('Test'));
  await waitFor(() => expect(mockPrefetch).toHaveBeenCalled());
});
```

---

## 📈 Scalability

### Adding New Data Types

**Before:** Phải tạo component mới hoặc modify `HoverLink`

```tsx
// ❌ Phải tạo CategoryLink.tsx
export function CategoryLink() {
  const prefetchCategory = usePrefetchCategory();
  // ... duplicate hover logic ...
}
```

**After:** Chỉ cần tạo hook mới

```tsx
// ✅ 1. Tạo hook mới
// hooks/use-category.ts
export function usePrefetchCategory() { ... }

// ✅ 2. Dùng ngay với HoverLink
function CategoryList() {
  const prefetchCategory = usePrefetchCategory();
  return (
    <HoverLink 
      href="/category/tech"
      onPrefetch={() => prefetchCategory('tech')}
    >
      Tech Category
    </HoverLink>
  );
}
```

---

## 🎯 Summary

### Key Takeaways

1. **Callback Pattern** → Generic & Reusable components
2. **Inversion of Control** → Parent controls behavior
3. **Single Responsibility** → Each component does one thing well
4. **Easy Testing** → Inject dependencies via props
5. **Scalability** → Add new features without modifying core component

### Metrics

- **Before:** 1 component = 1 data type
- **After:** 1 component = ∞ data types ♾️
- **Code reduction:** No need for `UserLink`, `PostLink`, etc.
- **Maintenance:** Single component to maintain

---

🎉 **Result:** From hardcoded to production-ready generic component!
