import ProductList from '@/components/product-list';
import UserList from '@/components/user-list';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Next Faster ⚡
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Generic Hover Prefetch Component
          </p>
          <p className="text-gray-500">
            Một component tái sử dụng được cho mọi loại data!
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">💡 Cách test:</h2>
          <ol className="space-y-2">
            <li>
              <strong>1.</strong> Mở DevTools Console (F12)
            </li>
            <li>
              <strong>2.</strong> Hover vào một product link (giữ &gt;200ms)
            </li>
            <li>
              <strong>3.</strong> Xem console: &quot;🖱️ Hover Prefetch&quot; +
              &quot;🖱️ Data prefetched&quot;
            </li>
            <li>
              <strong>4.</strong> Click vào link → Load instant ⚡ (&lt;100ms)
            </li>
            <li>
              <strong>5.</strong> Thử hover nhanh rồi rời ra → Xem &quot;❌
              Hover cancelled&quot;
            </li>
            <li>
              <strong>6.</strong> Thử click link không hover → Load chậm 🐌
              (~1500ms)
            </li>
          </ol>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            📦 Products (Custom Prefetch)
          </h2>
          <p className="text-gray-600 mb-6">
            Hover vào product card → Prefetch với{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              usePrefetchProduct()
            </code>
          </p>

          <ProductList />
        </div>

        {/* User List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            👥 Users (Same Component, Different Hook)
          </h2>
          <p className="text-gray-600 mb-6">
            Hover vào user card → Prefetch với{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              usePrefetchUser()
            </code>
          </p>

          <UserList />
        </div>

        {/* Generic Component Example */}
        <div className="mt-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🔧 Tính tái sử dụng (Reusability)
          </h2>
          <div className="space-y-4 text-gray-700">
            <p className="font-semibold">
              ✅ Cùng 1 component{' '}
              <code className="bg-white px-2 py-1 rounded">
                &lt;HoverLink&gt;
              </code>{' '}
              nhưng dùng cho:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                📦 Products → Prefetch với{' '}
                <code className="bg-white px-2 py-1 rounded">
                  usePrefetchProduct()
                </code>
              </li>
              <li>
                👥 Users → Prefetch với{' '}
                <code className="bg-white px-2 py-1 rounded">
                  usePrefetchUser()
                </code>
              </li>
              <li>
                📝 Posts → Có thể dùng{' '}
                <code className="bg-white px-2 py-1 rounded">
                  usePrefetchPost()
                </code>
              </li>
              <li>
                🏷️ Categories → Có thể dùng{' '}
                <code className="bg-white px-2 py-1 rounded">
                  usePrefetchCategory()
                </code>
              </li>
            </ul>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200 mt-4">
              <p className="text-sm font-mono text-green-800">
                {`<HoverLink href="/product/1" onPrefetch={() => prefetchProduct('1')} />`}
              </p>
              <p className="text-sm font-mono text-green-800 mt-2">
                {`<HoverLink href="/user/john" onPrefetch={() => prefetchUser('john')} />`}
              </p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            ⚡ Tại sao lại nhanh?
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
              <p className="font-semibold text-orange-800 mb-2">
                🐌 Không Prefetch:
              </p>
              <p className="text-sm">
                User click → API call (~1500ms) → Render page → Tổng: ~1500ms
              </p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="font-semibold text-yellow-800 mb-2">
                ❌ Hover nhanh (&lt;100ms):
              </p>
              <p className="text-sm">
                User hover → Rời ra ngay → Prefetch bị cancel → Không tốn
                bandwidth
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="font-semibold text-blue-800 mb-2">
                ⏳ Hover rồi click ngay (trước khi API xong):
              </p>
              <p className="text-sm">
                User hover → API bắt đầu → User click → Page đợi API call đó
                xong → Chỉ 1 API call duy nhất! (không duplicate)
              </p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <p className="font-semibold text-green-800 mb-2">
                ⚡ Hover đủ lâu (API đã xong):
              </p>
              <p className="text-sm">
                User hover → API call + cache → User click → Load từ cache
                (&lt;10ms) → Instant!
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-full shadow-md px-6 py-3">
            <p className="text-sm text-gray-600">
              Built with <strong className="text-blue-600">Next.js 16</strong> +
              <strong className="text-blue-400"> TypeScript</strong> +
              <strong className="text-cyan-400"> Tailwind CSS</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
