'use client';

import { useUser } from '@/hooks/use-user';
import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: user, isLoading, isFetching, dataUpdatedAt } = useUser(id);

  // Track start time và calculate load time
  const startTimeRef = useRef<number | null>(null);
  const [loadTime, setLoadTime] = useState<number | null>(null);

  // Initialize start time chỉ 1 lần khi component mount
  useEffect(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
  }, []);

  // Calculate load time khi data đã về
  useEffect(() => {
    if (dataUpdatedAt && startTimeRef.current !== null) {
      // Use queueMicrotask to avoid impure function call during render
      queueMicrotask(() => {
        setLoadTime(performance.now() - startTimeRef.current!);
      });
    }
  }, [dataUpdatedAt]);

  const cacheStatus = !isFetching && dataUpdatedAt ? '🟢 Cached' : '🔵 Fresh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8 font-semibold"
        >
          ← Back to Home
        </Link>

        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading user...</p>
            </div>
          ) : user ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{user.avatar}</div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                      {user.name}
                    </h1>
                    <p className="text-purple-600 font-medium">@{user.id}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    cacheStatus === '🟢 Cached'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {cacheStatus}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h2 className="font-semibold text-purple-900 mb-3 text-lg">Bio</h2>
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="font-semibold text-gray-900 mb-4 text-lg">
                    Contact Information
                  </h2>
                  <dl className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <dt className="text-gray-600 flex items-center gap-2">
                        <span>📧</span> Email
                      </dt>
                      <dd className="text-gray-800 font-medium">{user.email}</dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <dt className="text-gray-600 flex items-center gap-2">
                        <span>🆔</span> Username
                      </dt>
                      <dd className="font-mono text-gray-800">@{user.id}</dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-gray-600 flex items-center gap-2">
                        <span>📅</span> Member Since
                      </dt>
                      <dd className="text-gray-800">{user.joinedDate}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">User not found</p>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        {loadTime !== null && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ⚡ Performance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-semibold mb-1">
                  Load Time
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {loadTime.toFixed(0)}ms
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-semibold mb-1">
                  Status
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {loadTime < 100 ? '⚡ Instant' : '🐌 Slow'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {loadTime < 100
                ? '✅ Data was prefetched and served from cache!'
                : '⚠️ Data was fetched on demand (no prefetch)'}
            </p>
          </div>
        )}

        {/* Testing Instructions */}
        <div className="mt-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-3">💡 Testing Tips:</h2>
          <ul className="space-y-2 text-sm">
            <li>
              • Hover trước khi click → Load time &lt;100ms (from cache)
            </li>
            <li>
              • Click trực tiếp không hover → Load time ~1500ms (fresh fetch)
            </li>
            <li>• Mở DevTools Console để xem React Query activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
