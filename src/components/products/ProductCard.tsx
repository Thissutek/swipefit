'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  inventory_count: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (product.inventory_count < 1) {
      toast.error('This product is out of stock');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url,
    });

    toast.success(`${product.name} added to cart!`);
  }

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image_url || '/api/placeholder/400/400'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {product.inventory_count < 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900">
              Out of Stock
            </p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={product.inventory_count < 1}
            className="rounded-full bg-primary p-2 text-white hover:bg-primary-dark disabled:bg-gray-300"
            aria-label="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
