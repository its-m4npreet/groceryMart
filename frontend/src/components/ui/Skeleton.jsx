import { cn } from '../../utils/helpers';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      {...props}
    />
  );
};

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

const ProductListSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-4 w-16 mt-3" />
      <Skeleton className="h-3 w-12 mt-1" />
    </div>
  );
};

const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
};

export { Skeleton, ProductCardSkeleton, ProductListSkeleton, CategoryCardSkeleton, TableRowSkeleton };
export default Skeleton;
