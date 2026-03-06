// Client-side API utilities with caching

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  description: string;
  features: string[];
  fetchedAt: string;
}

// Simple in-memory cache
const cache = new Map<string, { data: Product; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Track pending requests để tránh duplicate API calls
const pendingRequests = new Map<string, Promise<Product>>();

export async function fetchProduct(id: string): Promise<Product> {
  const cacheKey = `product-${id}`;
  const now = Date.now();

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`💾 Cache HIT for product ${id}`);
    return cached.data;
  }

  // Check if there's already a pending request for this product
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    console.log(`⏳ Waiting for pending request for product ${id}`);
    return pending;
  }

  // Create new request
  console.log(`🌐 Fetching product ${id} from API...`);
  const startTime = performance.now();

  const requestPromise = fetch(`/api/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    })
    .then((data) => {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      console.log(`✅ Product ${id} fetched in ${duration}ms`);

      // Store in cache
      cache.set(cacheKey, { data, timestamp: now });

      // Remove from pending
      pendingRequests.delete(cacheKey);

      return data;
    })
    .catch((error) => {
      // Remove from pending on error
      pendingRequests.delete(cacheKey);
      throw error;
    });

  // Store pending request
  pendingRequests.set(cacheKey, requestPromise);

  return requestPromise;
}

// Prefetch product (chỉ gọi API để cache)
export async function prefetchProduct(id: string): Promise<void> {
  try {
    await fetchProduct(id);
  } catch (error) {
    console.error(`❌ Prefetch failed for product ${id}:`, error);
  }
}
