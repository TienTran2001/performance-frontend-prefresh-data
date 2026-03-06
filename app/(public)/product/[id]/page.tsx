'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { fetchProduct, type Product } from '@/lib/api';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadTime, setLoadTime] = useState<number>(0);

  useEffect(() => {
    const startTime = performance.now();

    fetchProduct(id)
      .then((data) => {
        const endTime = performance.now();
        setLoadTime(Math.round(endTime - startTime));
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-700">
            Loading Product...
          </h2>
          <p className="text-gray-500 mt-2">Đang fetch từ API...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-700">
            Product Not Found
          </h2>
          <Link
            href="/"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const productId = product.id;
  const prevId = productId > 1 ? productId - 1 : null;
  const nextId = productId < 20 ? productId + 1 : null;

  const isCached = loadTime < 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            ← Về trang chủ
          </Link>
        </div>

        {/* Performance Badge */}
        {isCached ? (
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg mb-6 text-center font-bold animate-fadeIn">
            ⚡ INSTANT LOAD - Data đã được cache! ({loadTime}ms)
          </div>
        ) : (
          <div className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg mb-6 text-center font-bold animate-fadeIn">
            🐌 Slow Load - API call mới (~1500ms)
          </div>
        )}

        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-xl p-12">
          {/* Product Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg">{product.description}</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price}
              </span>
              <span className="text-yellow-500">
                {'⭐'.repeat(Math.floor(product.rating))}
              </span>
              <span className="text-gray-600">({product.rating})</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Chi tiết sản phẩm
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-semibold">Product ID:</span> {product.id}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span className="text-green-600">
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : 'Out of Stock'}
                </span>
              </div>
              <div>
                <span className="font-semibold">Category:</span>{' '}
                {product.category}
              </div>
              <div>
                <span className="font-semibold">Rating:</span> {product.rating}
                /5.0
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-gray-800">Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {prevId ? (
              <Link
                href={`/product/${prevId}`}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                ← Product {prevId}
              </Link>
            ) : (
              <div className="w-32"></div>
            )}

            <Link
              href="/"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              🏠 Home
            </Link>

            {nextId ? (
              <Link
                href={`/product/${nextId}`}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Product {nextId} →
              </Link>
            ) : (
              <div className="w-32"></div>
            )}
          </div>
        </div>

        {/* Performance Note */}
        <div
          className={`mt-8 border-l-4 p-6 rounded-r-lg ${
            isCached
              ? 'bg-green-50 border-green-400'
              : 'bg-orange-50 border-orange-400'
          }`}
        >
          <h3
            className={`font-semibold mb-2 ${
              isCached ? 'text-green-800' : 'text-orange-800'
            }`}
          >
            {isCached ? '⚡ Cached Response' : '🐌 Fresh API Call'}
          </h3>
          <p
            className={`text-sm ${
              isCached ? 'text-green-700' : 'text-orange-700'
            }`}
          >
            {isCached
              ? `Data đã được prefetch và cache! Navigation instant trong ${loadTime}ms.`
              : `API call mới, phải đợi ~1500ms. Hãy prefetch trước để có trải nghiệm tốt hơn!`}
          </p>
          <div className="mt-3 text-xs font-mono bg-white/50 p-2 rounded">
            Load time: {loadTime}ms | Fetched at:{' '}
            {new Date(product.fetchedAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
