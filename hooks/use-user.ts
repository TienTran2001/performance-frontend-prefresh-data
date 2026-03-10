import { useQuery, useQueryClient } from '@tanstack/react-query';

// ==========================================
// TYPES
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  joinedDate: string;
}

// ==========================================
// QUERY KEYS
// ==========================================
export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

// ==========================================
// API FUNCTIONS
// ==========================================
async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}`);
  }

  return response.json();
}

// ==========================================
// HOOKS
// ==========================================

/**
 * Hook để fetch user data
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
  });
}

/**
 * Hook để prefetch user data
 * Dùng cho hover/viewport prefetch
 */
export function usePrefetchUser() {
  const queryClient = useQueryClient();

  return async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => fetchUserById(id),
    });
  };
}
