'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) {
          throw orderError;
        }

        setOrder(orderData);

        // Fetch order items with product details
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            product_id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          `)
          .eq('order_id', orderId);

        if (itemsError) {
          throw itemsError;
        }

        setOrderItems(itemsData);

      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Order Confirmation</h1>
        <p className="mt-4">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Order Confirmation</h1>
        <div className="mt-8 text-center">
          <p className="text-lg text-red-600">{error || 'Order not found'}</p>
          <Link href="/products" className="btn btn-primary mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your order. We've received your purchase and we'll prepare it for shipping right away.
          </p>
        </div>

        <div className="mt-12">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-medium">Order Details</h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">Order Number</dt>
                <dd className="text-gray-900">{order.id}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">Date</dt>
                <dd className="text-gray-900">
                  {new Date(order.created_at).toLocaleDateString()}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">Status</dt>
                <dd className="text-gray-900">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    {order.status}
                  </span>
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">Total</dt>
                <dd className="text-gray-900">${order.total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-medium">Shipping Information</h2>

            <address className="mt-4 not-italic text-gray-600">
              <p>
                {order.shipping_address.firstName} {order.shipping_address.lastName}
              </p>
              <p className="mt-1">{order.shipping_address.address}</p>
              <p className="mt-1">
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
              </p>
              <p className="mt-1">{order.shipping_address.country}</p>
            </address>
          </div>

          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-medium">Items</h2>

            <ul className="mt-4 divide-y divide-gray-200">
              {orderItems.map((item) => (
                <li key={item.id} className="flex py-4">
                  <div className="flex flex-1 items-center">
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900">
                        {item.products.name}
                      </h4>
                      <div className="mt-1 flex text-sm text-gray-500">
                        <p>Qty: {item.quantity}</p>
                        <p className="ml-4">Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
