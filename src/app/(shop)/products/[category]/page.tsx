import { createServerClient } from '@/lib/supabase/server';
import ProductCard from '@/components/products/ProductCard';
import ProductFilter from '@/components/products/ProductFilter';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { sort?: string };
}) {
  const supabase = createServerClient();
  const categoryName = params.category;

  // Get all categories for filter
  const { data: categoriesData } = await supabase
    .from('products')
    .select('category');

  const categories = categoriesData
    ? [...new Set(categoriesData.map(item => item.category))]
    : [];

  // Build query with category filter
  let query = supabase
    .from('products')
    .select('*')
    .eq('category', categoryName);

  // Apply sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('name', { ascending: true });
    }
  } else {
    // Default sorting
    query = query.order('name', { ascending: true });
  }

  const { data: products } = await query;

  // Capitalize the category name for display
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">{formattedCategoryName}</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters */}
        <div className="w-full lg:w-1/4">
          <ProductFilter categories={categories} currentCategory={categoryName} />
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-gray-500">
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
