'use client';

import HoverLink from './hover-link';
import { usePrefetchProduct } from '@/hooks/use-product';

export default function ProductList() {
  const prefetchProduct = usePrefetchProduct();

  return (
    <div className="grid gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
        <HoverLink
          key={id}
          href={`/product/${id}`}
          onPrefetch={() => prefetchProduct(String(id))}
          prefetch={true}
        >
          <div className="bg-gray-50 p-6 rounded-lg hover:bg-blue-50 transition border border-gray-200 hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Product {id}
                </h3>
                <p className="text-sm text-gray-500">
                  Hover để prefetch, click để xem chi tiết
                </p>
              </div>

              <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                Xem chi tiết →
              </span>
            </div>
          </div>
        </HoverLink>
      ))}
    </div>
  );
}
