'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  inventory_count: number;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart() {
    if (product.inventory_count < quantity) {
      toast.error(`Only ${product.inventory_count} items available`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image_url,
    });

    toast.success(`${product.name} added to cart!`);
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setQuantity(parseInt(e.target.value, 10));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
          Quantity
        </label>
        <select
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          className="rounded-md border border-gray-300 py-1.5 pl-3 pr-8 text-base"
          disabled={product.inventory_count < 1}
        >
          {[...Array(Math.min(10, product.inventory_count))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.inventory_count < 1}
        className="btn btn-primary w-full"
      >
        {product.inventory_count < 1 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
