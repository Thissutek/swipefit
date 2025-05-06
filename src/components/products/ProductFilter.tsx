'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ProductFilterProps {
  categories: string[];
  currentCategory?: string;
}

export default function ProductFilter({ categories, currentCategory }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current sort parameter from URL
  const currentSort = searchParams.get('sort') || '';

  // Create URL with sort parameter
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const query = createQueryString('sort', value);

    // Navigate to the same URL but with updated sort parameter
    if (currentCategory) {
      router.push(`/products/${currentCategory}?${query}`);
    } else {
      router.push(`/products?${query}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="mb-4 text-lg font-medium">Categories</h3>
        <nav className="space-y-2">
          <Link
            href="/products"
            className={`block rounded-lg px-3 py-2 ${!currentCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            All Products
          </Link>

          {categories.map((category) => (
            <Link
              key={category}
              href={`/products/${category.toLowerCase()}`}
              className={`block rounded-lg px-3 py-2 ${currentCategory === category.toLowerCase() ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-4 text-lg font-medium">Sort By</h3>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
}
