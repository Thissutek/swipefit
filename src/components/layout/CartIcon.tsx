'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';

export default function CartIcon() {
  // Use useState to handle hydration mismatch
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);

  // Wait until after hydration to show the cart count
  useEffect(() => {
    const unsubHydrate = useCartStore.persist.onHydrate(() => {
      setMounted(false);
    });

    const unsubFinishHydration = useCartStore.persist.onFinishHydration(() => {
      setMounted(true);
    });

    setMounted(useCartStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return (
    <Link href="/cart" className="relative flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {mounted && totalItems() > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
          {totalItems()}
        </span>
      )}
    </Link>
  );
}
