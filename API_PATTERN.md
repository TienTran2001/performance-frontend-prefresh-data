# 🔄 API Pattern: Consistent Structure

Demo này sử dụng **cùng 1 pattern** cho mọi loại data để dễ maintain và scale.

## 📊 Comparison: Product vs User APIs

### File Structure

```
app/api/
├── products/[id]/route.ts  ✅ Product API
└── users/[id]/route.ts     ✅ User API (cùng structure!)
```

### API Implementation

<table>
<tr>
<th width="50%">Product API</th>
<th width="50%">User API</th>
</tr>
<tr>
<td>

```typescript
// app/api/products/[id]/route.ts

const PRODUCTS_DB: Record<
  string, 
  Product
> = {
  '1': { id: '1', name: '...', ... },
  '2': { id: '2', name: '...', ... },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  console.log(`[API] 📦 Fetching product: ${id}`);
  
  // Simulate slow API (1.5s)
  await new Promise(resolve => 
    setTimeout(resolve, 1500)
  );
  
  const product = PRODUCTS_DB[id];
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  
  console.log(`[API] ✅ Product ${id} fetched`);
  
  return NextResponse.json(product);
}
```

</td>
<td>

```typescript
// app/api/users/[id]/route.ts

const USERS_DB: Record<
  string, 
  User
> = {
  'john': { id: 'john', name: '...', ... },
  'jane': { id: 'jane', name: '...', ... },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  console.log(`[API] 👥 Fetching user: ${id}`);
  
  // Simulate slow API (1.5s)
  await new Promise(resolve => 
    setTimeout(resolve, 1500)
  );
  
  const user = USERS_DB[id.toLowerCase()];
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  console.log(`[API] ✅ User ${id} fetched`);
  
  return NextResponse.json(user);
}
```

</td>
</tr>
</table>

### Hook Implementation

<table>
<tr>
<th width="50%">use-product.ts</th>
<th width="50%">use-user.ts</th>
</tr>
<tr>
<td>

```typescript
// hooks/use-product.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  // ...
}

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => 
    [...productKeys.all, 'detail', id] as const,
};

async function fetchProductById(id: string) {
  const response = await fetch(
    `/api/products/${id}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }
  
  return response.json();
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
  });
}

export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  
  return async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => fetchProductById(id),
    });
  };
}
```

</td>
<td>

```typescript
// hooks/use-user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  // ...
}

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => 
    [...userKeys.all, 'detail', id] as const,
};

async function fetchUserById(id: string) {
  const response = await fetch(
    `/api/users/${id}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}`);
  }
  
  return response.json();
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
  });
}

export function usePrefetchUser() {
  const queryClient = useQueryClient();
  
  return async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => fetchUserById(id),
    });
  };
}
```

</td>
</tr>
</table>

## 🎯 Pattern Benefits

### 1. **Consistency** 🔄
- Cùng structure → Dễ hiểu, dễ maintain
- New developer nhìn Product → Biết ngay User làm gì

### 2. **Scalability** 📈
- Muốn thêm Post? Copy pattern!
  ```
  app/api/posts/[slug]/route.ts
  hooks/use-post.ts
  ```
- Tất cả follow cùng 1 convention

### 3. **Predictability** 🎯
- API luôn:
  - Return JSON
  - 404 nếu không tìm thấy
  - Log console với emoji identifier
  - Delay 1.5s để demo prefetch

### 4. **React Query Integration** ⚛️
- Mọi hook đều có:
  - `useX(id)` - Fetch data
  - `usePrefetchX()` - Prefetch for hover
  - `xKeys` - Query key factory
  - `fetchXById()` - API client function

## 🏗️ Adding New Resource Type

Muốn thêm `Post`? Follow pattern:

### Step 1: Create API Route

```typescript
// app/api/posts/[slug]/route.ts
const POSTS_DB: Record<string, Post> = { ... };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  console.log(`[API] 📝 Fetching post: ${slug}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  const post = POSTS_DB[slug];
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  console.log(`[API] ✅ Post ${slug} fetched`);
  return NextResponse.json(post);
}
```

### Step 2: Create Hook

```typescript
// hooks/use-post.ts
export interface Post { slug: string; title: string; content: string; }
export const postKeys = {
  all: ['posts'] as const,
  detail: (slug: string) => [...postKeys.all, 'detail', slug] as const,
};

async function fetchPostBySlug(slug: string): Promise<Post> {
  const response = await fetch(`/api/posts/${slug}`);
  if (!response.ok) throw new Error(`Failed to fetch post ${slug}`);
  return response.json();
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: () => fetchPostBySlug(slug),
  });
}

export function usePrefetchPost() {
  const queryClient = useQueryClient();
  return async (slug: string) => {
    await queryClient.prefetchQuery({
      queryKey: postKeys.detail(slug),
      queryFn: () => fetchPostBySlug(slug),
    });
  };
}
```

### Step 3: Create List Component

```typescript
// components/post-list.tsx
'use client';
import HoverLink from './hover-link';
import { usePrefetchPost } from '@/hooks/use-post';

export default function PostList() {
  const prefetchPost = usePrefetchPost();
  
  return (
    <HoverLink 
      href="/post/hello-world"
      onPrefetch={() => prefetchPost('hello-world')}
    >
      Read Post
    </HoverLink>
  );
}
```

### Step 4: Create Detail Page

```typescript
// app/(public)/post/[slug]/page.tsx
'use client';
import { usePost } from '@/hooks/use-post';
import { use } from 'react';

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: post, isLoading } = usePost(slug);
  
  // ... render post
}
```

✅ **Done!** Chỉ cần follow pattern, không cần suy nghĩ!

## 📋 Checklist for New Resource

- [ ] Create `/app/api/{resource}/[id]/route.ts`
  - [ ] In-memory database object
  - [ ] GET handler with async params
  - [ ] 1.5s delay simulation
  - [ ] 404 error handling
  - [ ] Console logging with emoji
- [ ] Create `/hooks/use-{resource}.ts`
  - [ ] TypeScript interface
  - [ ] Query keys factory
  - [ ] Fetch function
  - [ ] `useX()` hook
  - [ ] `usePrefetchX()` hook
- [ ] Create `/components/{resource}-list.tsx`
  - [ ] Import `usePrefetchX()`
  - [ ] Use `<HoverLink>` with `onPrefetch`
- [ ] Create `/app/(public)/{resource}/[id]/page.tsx`
  - [ ] Import `useX()`
  - [ ] Handle `params` with `use()`
  - [ ] Show loading state
  - [ ] Display data

## 🎨 Visual Pattern

```
┌─────────────────┐      ┌─────────────────┐
│   Product API   │      │    User API     │
│   /api/products │      │   /api/users    │
└────────┬────────┘      └────────┬────────┘
         │                        │
         ├─ 1.5s delay           ├─ 1.5s delay
         ├─ JSON response        ├─ JSON response
         ├─ 404 handling         ├─ 404 handling
         └─ Console log          └─ Console log
         
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│ use-product.ts  │      │  use-user.ts    │
└────────┬────────┘      └────────┬────────┘
         │                        │
         ├─ Interface            ├─ Interface
         ├─ Query keys           ├─ Query keys
         ├─ Fetch function       ├─ Fetch function
         ├─ useX() hook          ├─ useX() hook
         └─ usePrefetchX()       └─ usePrefetchX()
         
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  ProductList    │      │   UserList      │
└────────┬────────┘      └────────┬────────┘
         │                        │
         └─────────┬──────────────┘
                   ▼
         ┌─────────────────┐
         │   HoverLink     │
         │  (Generic!)     │
         └─────────────────┘
```

## 🔍 Real-World Usage

Console output khi test:

```bash
# Hover vào Product 1
[API] 📦 Fetching product: 1
🖱️ Hover Prefetch (Route): /product/1
[API] ✅ Product 1 fetched at 2026-03-10T...

# Hover vào User john
[API] 👥 Fetching user: john
🖱️ Hover Prefetch (Route): /user/john
[API] ✅ User john fetched at 2026-03-10T...

# Click → Load instant từ React Query cache!
```

---

🎯 **Key Takeaway:** Một pattern tốt = Dễ replicate, dễ maintain, dễ scale!
