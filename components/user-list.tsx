'use client';

import HoverLink from './hover-link';
import { usePrefetchUser } from '@/hooks/use-user';

export default function UserList() {
  const prefetchUser = usePrefetchUser();

  return (
    <div className="grid gap-4">
      {['john', 'jane', 'alice', 'bob'].map((username) => (
        <HoverLink
          key={username}
          href={`/user/${username}`}
          onPrefetch={() => prefetchUser(username)}
        >
          <div className="bg-gray-50 p-6 rounded-lg hover:bg-purple-50 transition border border-gray-200 hover:border-purple-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  @{username}
                </h3>
                <p className="text-sm text-gray-500">
                  Hover để prefetch user data
                </p>
              </div>

              <span className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                View Profile →
              </span>
            </div>
          </div>
        </HoverLink>
      ))}
    </div>
  );
}
