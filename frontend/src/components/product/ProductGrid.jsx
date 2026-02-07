import ProductCard from './ProductCard';
import { ProductListSkeleton } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { Package } from 'lucide-react';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <ProductListSkeleton count={8} />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="Error loading products"
        description={error}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="No products found"
        description="Try adjusting your filters or search terms"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
