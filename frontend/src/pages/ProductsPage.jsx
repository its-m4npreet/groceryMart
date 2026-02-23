import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { Button, Pagination } from '../components/ui';

const ProductsPage = () => {
  const { products, loading, error, meta, updateParams } = useProducts();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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


            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} error={error} />

            {/* Pagination */}
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(page) => updateParams({ page })}
              isLoading={loading}
            />
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
