import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Button from '../components/ui/Button';

const ProductsPage = () => {
  // const [searchParams] = useSearchParams();
  const { products, loading, error, meta, updateParams } = useProducts();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // const sortBy = searchParams.get('sortBy') || 'createdAt';
  // const sortOrder = searchParams.get('sortOrder') || 'desc';
  // const inStock = searchParams.get('inStock') === 'true';

  // const handleSortChange = (e) => {
  //   const [sortByValue, sortOrderValue] = e.target.value.split('-');
  //   updateParams({ sortBy: sortByValue, sortOrder: sortOrderValue, page: null });
  // };

  // const handleInStockChange = (e) => {
  //   updateParams({ inStock: e.target.checked || null, page: null });
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <ProductFilters onFilterChange={updateParams} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Controls */}
            {/* <div className="lg:hidden mb-6 -mx-4 px-4 pb-2 overflow-x-auto">
              <div className="flex items-center gap-3 whitespace-nowrap overflow-x-auto">
                <select
                  className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={handleSortChange}
                >
                  <option value="createdAt-desc">Sort: Newest</option>
                  <option value="price-asc">Sort: Price Low</option>
                  <option value="price-desc">Sort: Price High</option>
                </select>

                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                    checked={inStock}
                    onChange={handleInStockChange}
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>
                
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(true)}
                  leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                  className="rounded-full"
                >
                  All Filters
                </Button>
              </div>
            </div> */}

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} error={error} />

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasPrevPage}
                  onClick={() => updateParams({ page: meta.page - 1 })}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                    let pageNum;
                    if (meta.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (meta.page <= 3) {
                      pageNum = i + 1;
                    } else if (meta.page >= meta.totalPages - 2) {
                      pageNum = meta.totalPages - 4 + i;
                    } else {
                      pageNum = meta.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateParams({ page: pageNum })}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${meta.page === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasNextPage}
                  onClick={() => updateParams({ page: meta.page + 1 })}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
          >
            <ProductFilters
              onFilterChange={updateParams}
              showMobile
              onClose={() => setShowMobileFilters(false)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
