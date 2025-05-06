import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import ProductCard from '@/components/products/ProductCard';

export default async function Home() {
  const supabase = createServerClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(4);

  // Fetch product categories
  const { data: categoriesData } = await supabase
    .from('products')
    .select('category');

  // Get unique categories
  const categories = categoriesData
    ? [...new Set(categoriesData.map(item => item.category))]
    : [];

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero section */}
      <div className="relative mb-16 h-96 w-full overflow-hidden rounded-xl bg-gray-900">
        <Image
          src="/api/placeholder/1200/600"
          alt="Stylish Threads - Latest fashion collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-6 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Discover Your Style</h1>
          <p className="mb-6 max-w-lg text-lg">
            Shop the latest trends in fashion, delivered to your door with free shipping on orders over $50.
          </p>
          <Link href="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-primary hover:text-primary-dark">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-16">
        <h2 className="mb-8 text-2xl font-bold">Shop by Category</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products/${category.toLowerCase()}`}
              className="group relative h-64 overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={`/api/placeholder/800/400?text=${category}`}
                alt={category}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <h3 className="text-2xl font-bold text-white">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="rounded-xl bg-gray-100 p-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Join Our Newsletter</h2>
        <p className="mb-6 text-gray-600">
          Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
        </p>
        <form className="mx-auto flex max-w-md">
          <input
            type="email"
            placeholder="Your email address"
            className="input flex-1 rounded-r-none"
            required
          />
          <button type="submit" className="btn btn-primary rounded-l-none">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
