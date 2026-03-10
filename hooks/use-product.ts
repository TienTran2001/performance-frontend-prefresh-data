import { useQuery, useQueryClient } from '@tanstack/react-query';

/* ========================
   Types
======================== */

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

/* ========================
   Query Keys
======================== */

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};

/* ========================
   API Fetch Function
======================== */

async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
}

/* ========================
   Query Hook
======================== */

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/* ========================
   Prefetch Hook
======================== */

export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (id: string) =>
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => fetchProductById(id),
      staleTime: 5 * 60 * 1000,
    });
}
