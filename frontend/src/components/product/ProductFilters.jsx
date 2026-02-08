import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES } from '../../config/constants';
import Button from '../ui/Button';

const ProductFilters = ({ onFilterChange, showMobile = false, onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const INITIAL_CATEGORIES_COUNT = 5;

  const currentFilters = {
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    inStock: searchParams.get('inStock') === 'true',
  };

  const handleChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === '' || value === false) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Reset to page 1 when filters change
    params.delete('page');
    setSearchParams(params);
    onFilterChange?.({ [key]: value });
  };

  const clearFilters = () => {
    setSearchParams({});
    onFilterChange?.({});
  };

  const hasActiveFilters = 
    currentFilters.category || 
    currentFilters.minPrice || 
    currentFilters.maxPrice || 
    currentFilters.inStock;

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    handleChange('sortBy', sortBy);
    handleChange('sortOrder', sortOrder);
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 ${showMobile ? '' : 'sticky top-24'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {showMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
        <div className="space-y-2">
          <button
            onClick={() => handleChange('category', '')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              !currentFilters.category
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">🛍️</span>
            All Categories
          </button>
          {CATEGORIES.slice(0, showAllCategories ? CATEGORIES.length : INITIAL_CATEGORIES_COUNT).map((category) => (
            <button
              key={category.id}
              onClick={() => handleChange('category', category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                currentFilters.category === category.id
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
          {CATEGORIES.length > INITIAL_CATEGORIES_COUNT && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors font-medium text-sm"
            >
              {showAllCategories ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Show More ({CATEGORIES.length - INITIAL_CATEGORIES_COUNT})</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={currentFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={currentFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={currentFilters.inStock}
            onChange={(e) => handleChange('inStock', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
        <select
          value={`${currentFilters.sortBy}-${currentFilters.sortOrder}`}
          onChange={handleSortChange}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default ProductFilters;
