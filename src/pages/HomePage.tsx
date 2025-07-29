import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

import { productsAPI, categoriesAPI } from '@/services/api';
import { formatCurrency, getImageUrl } from '@/utils';
import { useCartStore } from '@/store/cartStore';

const HomePage = () => {
  const { addItem } = useCartStore();

  // Fetch featured products
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getFeaturedProducts(8),
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getCategories,
  });

  return (
    <>
      <Helmet>
        <title>Web Shop - Your Ultimate Shopping Destination</title>
        <meta 
          name="description" 
          content="Discover amazing products at unbeatable prices. Shop electronics, clothing, books, and more with fast shipping and excellent customer service." 
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to Web Shop
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Discover amazing products at unbeatable prices. Your ultimate shopping destination for electronics, clothing, books, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products?featured=true"
                  className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Featured Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our wide range of categories to find exactly what you're looking for.
              </p>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.slug}`}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {category.image_url ? (
                        <img
                          src={getImageUrl(category.image_url)}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl text-primary-600 font-bold">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.product_count} products
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Check out our hand-picked selection of the best products available right now.
              </p>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                    <Link to={`/products/${product.slug}`}>
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={getImageUrl(product.image_url)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      
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
                        
                        {product.review_count && product.review_count > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{product.average_rating?.toFixed(1)}</span>
                            <span className="ml-1">({product.review_count})</span>
                          </div>
                        )}
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
            )}

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="btn btn-lg btn-outline px-8 py-4"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Subscribe to our newsletter and be the first to know about new products, special offers, and exclusive deals.
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage; 