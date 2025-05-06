import { createServerClient } from '@/lib/supabase/server';
import ProductCard from '@/components/products/ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export default async function RelatedProducts({
  currentProductId,
  category
}: RelatedProductsProps) {
  const supabase = createServerClient();

  // Fetch related products (same category, excluding current product)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentProductId)
    .limit(4);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
