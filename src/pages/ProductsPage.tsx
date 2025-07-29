import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  StarIcon 
} from '@heroicons/react/24/outline';


import { productsAPI, categoriesAPI } from '@/services/api';
import { formatCurrency, getImageUrl } from '@/utils';
import { useCartStore } from '@/store/cartStore';
import { ProductFilters } from '@/types';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();

  // Get filters from URL params
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const filters: ProductFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    featured: searchParams.get('featured') === 'true' || undefined,
    sort: (searchParams.get('sort') as any) || 'created_at',
    order: (searchParams.get('order') as any) || 'desc',
    page: currentPage,
    limit: 12,
  };

  // Fetch products
  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsAPI.getProducts(filters),
  });

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getCategories,
  });

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change (except for page itself)
    if (!newFilters.page) {
      params.set('page', '1');
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) {
      params.set('search', filters.search);
    }
    setSearchParams(params);
  };

  const hasActiveFilters = filters.category || filters.min_price || filters.max_price || filters.featured;

  return (
    <>
      <Helmet>
        <title>Products - Web Shop</title>
        <meta name="description" content="Browse our wide selection of products across various categories." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {filters.search ? `Search results for "${filters.search}"` : 'All Products'}
            </h1>
            <p className="text-gray-600 mt-2">
              {pagination?.total ? `${pagination.total} products found` : 'Loading...'}
            </p>
          </div>

          {/* Sort & Filter Toggle */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={`${filters.sort}-${filters.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  updateFilters({ sort: sort as any, order: order as any });
                }}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low to High</option>
                <option value="price-desc">Price High to Low</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                  {[filters.category, filters.min_price, filters.max_price, filters.featured].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 shrink-0`}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!filters.category}
                      onChange={() => updateFilters({ category: '' })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category: any) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={filters.category === category.slug}
                        onChange={() => updateFilters({ category: category.slug })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name}
                        {category.product_count && (
                          <span className="text-gray-500 ml-1">({category.product_count})</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price || ''}
                    onChange={(e) => updateFilters({ min_price: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price || ''}
                    onChange={(e) => updateFilters({ max_price: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured || false}
                    onChange={(e) => updateFilters({ featured: e.target.checked || undefined })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Products Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-200 h-48 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-200 h-4 rounded animate-pulse"></div>
                      <div className="bg-gray-200 h-4 rounded w-3/4 animate-pulse"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products found</p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                      <Link to={`/products/${product.slug}`}>
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          <img
                            src={getImageUrl(product.image_url)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.is_featured && (
                            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                          {product.compare_price && product.compare_price > product.price && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              Sale
                            </span>
                          )}
                        </div>
                      </Link>
                      
                      <div className="p-4">
                        <Link to={`/products/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {product.category_name && (
                          <p className="text-sm text-gray-500 mb-2">{product.category_name}</p>
                        )}

                        {product.review_count && product.review_count > 0 && (
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.average_rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-1">
                              ({product.review_count})
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                            {product.compare_price && product.compare_price > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.compare_price)}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => addItem(product)}
                          disabled={product.stock_quantity === 0}
                          className={`w-full btn btn-md ${
                            product.stock_quantity === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'btn-primary'
                          }`}
                        >
                          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-2">
                      {/* Previous */}
                      <button
                        onClick={() => updateFilters({ page: currentPage - 1 })}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      {/* Page numbers */}
                      {[...Array(pagination.pages)].map((_, i) => {
                        const page = i + 1;
                        const isCurrentPage = page === filters.page;
                        
                        // Show first page, last page, current page, and 2 pages around current
                        const showPage = page === 1 || 
                                        page === pagination.pages || 
                                        Math.abs(page - currentPage) <= 2;
                        
                                                  if (!showPage) {
                            if (page === 2 && currentPage > 4) {
                              return <span key={page} className="px-2">...</span>;
                            }
                            if (page === pagination.pages - 1 && currentPage < pagination.pages - 3) {
                              return <span key={page} className="px-2">...</span>;
                            }
                            return null;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => updateFilters({ page })}
                              className={`px-3 py-2 border text-sm rounded-md ${
                                isCurrentPage
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                        {/* Next */}
                        <button
                          onClick={() => updateFilters({ page: currentPage + 1 })}
                        disabled={!pagination.hasNext}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile filter overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              {/* Same filter content as sidebar */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage; 