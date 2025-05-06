'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore, CartItem } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';

export default function Cart() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    items,
    removeItem,
    updateItemQuantity,
    clearCart,
    totalPrice
  } = useCartStore((state) => state);

  // Handle hydration mismatch
  useEffect(() => {
    const unsubFinishHydration = useCartStore.persist.onFinishHydration(() => {
      setMounted(true);
    });

    setMounted(useCartStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  async function handleCheckout() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    router.push('/checkout');
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="mt-4">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">Your cart is empty</p>
          <Link href="/products" className="btn btn-primary mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      <div className="mt-8">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onUpdateQuantity={(quantity) => updateItemQuantity(item.id, quantity)}
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${totalPrice().toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleCheckout}
            className="btn btn-primary flex-1"
          >
            Checkout
          </button>
          <button
            onClick={() => clearCart()}
            className="btn btn-outline"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/products" className="text-sm font-medium text-primary hover:text-primary-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
