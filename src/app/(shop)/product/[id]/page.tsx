import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import AddToCartButton from '@/components/products/AddToCartButton';
import RelatedProducts from '@/components/products/RelatedProducts';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { id } = params;

  // Fetch product details
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Product image */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image_url || '/api/placeholder/600/600'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium">Description</h2>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium">Category</h2>
            <p className="mt-2 text-gray-600">{product.category}</p>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium">Availability</h2>
            <p className="mt-2 text-gray-600">
              {product.inventory_count > 0
                ? `In stock (${product.inventory_count} available)`
                : 'Out of stock'}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Related products */}
      <RelatedProducts currentProductId={id} category={product.category} />
    </div>
  );
}
