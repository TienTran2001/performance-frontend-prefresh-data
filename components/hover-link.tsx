'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { prefetchProduct } from '@/lib/api';

type HoverLinkProps = React.ComponentProps<typeof NextLink> & {
  hoverDelay?: number;
};

export default function HoverLink({
  hoverDelay = 200,
  children,
  ...props
}: HoverLinkProps) {
  const router = useRouter();
  const [prefetched, setPrefetched] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (prefetched) return;

    // Delay trước khi prefetch
    hoverTimeoutRef.current = setTimeout(async () => {
      const hrefString =
        typeof props.href === 'string' ? props.href : props.href.pathname || '';
      console.log('🖱️ Hover Prefetch:', hrefString);
      router.prefetch(hrefString);

      // Extract product ID và prefetch data
      const productId = hrefString.match(/\/product\/(\d+)/)?.[1];
      if (productId) {
        await prefetchProduct(productId);
        console.log('🖱️ Data prefetched for product:', productId);
      }

      setPrefetched(true);
    }, hoverDelay);
  };

  const handleMouseLeave = () => {
    // Cancel prefetch nếu mouse leave trước khi hết delay
    if (hoverTimeoutRef.current && !prefetched) {
      const hrefString =
        typeof props.href === 'string' ? props.href : props.href.pathname || '';
      console.log('❌ Hover cancelled:', hrefString);
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NextLink
        prefetch={false}
        className="text-blue-600 hover:text-blue-800"
        {...props}
      >
        {children}
      </NextLink>
      {prefetched && (
        <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1 rounded">
          🖱️
        </span>
      )}
    </div>
  );
}
