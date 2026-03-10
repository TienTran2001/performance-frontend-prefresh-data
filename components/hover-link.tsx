'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

type HoverLinkProps = React.ComponentProps<typeof NextLink> & {
  hoverDelay?: number;
  /**
   * Optional callback để prefetch data
   * Được gọi sau khi delay và trước khi đánh dấu prefetched
   */
  onPrefetch?: () => void | Promise<void>;
  /**
   * Disable route prefetch (chỉ chạy onPrefetch callback)
   */
  disableRoutePrefetch?: boolean;
};

export default function HoverLink({
  hoverDelay = 200,
  onPrefetch,
  disableRoutePrefetch = false,
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

      // 1. Prefetch Next.js route (nếu không disable)
      if (!disableRoutePrefetch) {
        console.log('🖱️ Hover Prefetch (Route):', hrefString);
        router.prefetch(hrefString);
      }

      // 2. Gọi custom prefetch callback (nếu có)
      if (onPrefetch) {
        try {
          await onPrefetch();
        } catch (error) {
          console.error('❌ Prefetch callback error:', error);
        }
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
