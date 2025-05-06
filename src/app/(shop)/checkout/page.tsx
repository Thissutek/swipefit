'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function Checkout() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const { items, totalPrice, clearCart } = useCartStore((state) => state);

  // State for shipping information
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/checkout');
        return;
      }

      setUser(user);

      // Try to load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Pre-fill with profile data if available
        setShippingInfo({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phone: profile.phone || '',
        });
      }
    }

    checkAuth();
  }, [router, supabase]);

  // Handle cart hydration
  useEffect(() => {
    const unsubFinishHydration = useCartStore.persist.onFinishHydration(() => {
      setMounted(true);
    });

    setMounted(useCartStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  // Handle input change
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total: totalPrice(),
          shipping_address: shippingInfo,
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Clear cart and redirect to confirmation
      clearCart();
      router.push(`/checkout/confirmation?orderId=${order.id}`);

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to process your order. Please try again.');
    }
  }

  if (!mounted || !user) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Checkout</h1>
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
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Shipping Information Form */}
        <div>
          <h2 className="text-xl font-medium">Shipping Information</h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={shippingInfo.firstName}
                  onChange={handleInputChange}
                  className="input mt-1"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={shippingInfo.lastName}
                  onChange={handleInputChange}
                  className="input mt-1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="input mt-1"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="input mt-1"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State / Province
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  className="input mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP / Postal Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  required
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  className="input mt-1"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  className="input mt-1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="input mt-1"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-medium">Payment Method</h2>
              <p className="mt-2 text-sm text-gray-500">
                This is a demo store. No actual payment will be processed.
              </p>

              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    id="credit-card"
                    name="payment-method"
                    type="radio"
                    checked
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit Card (Demo)
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button type="submit" className="btn btn-primary w-full">
                Complete Order
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-medium">Order Summary</h2>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="sr-only">Items in your cart</h3>

            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-4">
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h4>{item.name}</h4>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">Subtotal</div>
                <div className="text-base font-medium text-gray-900">${totalPrice().toFixed(2)}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-base font-medium text-gray-900">Shipping</div>
                <div className="text-base font-medium text-gray-900">$0.00</div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-lg font-bold text-gray-900">Order Total</div>
                <div className="text-lg font-bold text-gray-900">${totalPrice().toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/cart" className="text-sm font-medium text-primary hover:text-primary-dark">
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
