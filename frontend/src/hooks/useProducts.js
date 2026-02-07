import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../api';

export function useProducts(initialParams = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Get params from URL or defaults
  const getParams = useCallback(() => {
    return {
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 12,
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      inStock: searchParams.get('inStock') === 'true',
      ...initialParams,
    };
  }, [searchParams, initialParams]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = getParams();
      // Remove empty params
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([ v]) => v !== '' && v !== false)
      );
      const response = await productApi.getProducts(cleanParams);
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [getParams]);

  // Update URL params
  const updateParams = useCallback((newParams) => {
    const current = getParams();
    const updated = { ...current, ...newParams };
    
    // Reset to page 1 when filters change
    if (!newParams.page) {
      updated.page = 1;
    }
    
    // Remove empty values
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== '' && value !== false && value !== 1 && key !== 'limit') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [getParams, setSearchParams]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  return {
    products,
    loading,
    error,
    meta,
    params: getParams(),
    updateParams,
    refetch: fetchProducts,
  };
}

export default useProducts;
