import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { Product, Category, ProductFilters } from '../types';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1, limit: 12,
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'newest',
    featured: searchParams.get('featured') === 'true',
    bestseller: searchParams.get('bestseller') === 'true',
    newArrival: searchParams.get('newArrival') === 'true',
  });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    const newCategory = searchParams.get('category') || undefined;
    setFilters(prev => ({
      ...prev,
      category: newCategory,
      subcategory: prev.category !== newCategory ? undefined : prev.subcategory,
      search: searchParams.get('search') || undefined,
    }));
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll({
      ...filters,
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined,
    }),
  });

  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.getAll() });

  const products: Product[] = data?.data?.data || [];
  const pagination = data?.data?.pagination;
  const categories: Category[] = categoriesData?.data?.data || [];

  const getCategoryName = (slug: string) => {
    const found = categories.find(c => c.slug === slug);
    if (found) return found.name;
    // Fallback while loading
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Best Rated' },
  ];

  const Skeleton = () => (
    <div className="product-card">
      <div className="skeleton" style={{ aspectRatio: '3/4' }} />
      <div style={{ padding: '16px' }}>
        <div className="skeleton" style={{ height: '16px', marginBottom: '8px', width: '70%' }} />
        <div className="skeleton" style={{ height: '14px', width: '50%' }} />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Shop ??? BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'var(--nav-height)' }}>
        {/* Page Header */}
        <div 
          className={`shop-header ${filters.category ? 'shop-header--category' : ''}`}
          style={filters.category ? { 
            backgroundImage: `url(${
              filters.category === 'fragrance' ? 'https://public.readdy.ai/ai/img_res/f682c1ec4ecd0bd7dcec60e9b50b2d80.jpg' : 
              filters.category === 'hair-care' ? 'https://public.readdy.ai/ai/img_res/c63fa98daea1dca6f21cbc9f0d2b932a.jpg' :
              filters.category === 'skin-care' ? 'https://public.readdy.ai/ai/img_res/d4e5882dc5c5fda45cf81a161be1cb4a.jpg' :
              filters.category === 'natural-care' ? 'https://public.readdy.ai/ai/img_res/2c4b5da4455932bd864205f53302f109.jpg' :
              filters.category === 'body-care' ? 'https://public.readdy.ai/ai/img_res/19ec0adabc268a426b7f985d246acca9.jpg' :
              filters.category === 'gift-sets' ? 'https://public.readdy.ai/ai/img_res/bc4097a9a8a5871f93cb05a3f9fe0ca7.jpg' :
              'https://images.unsplash.com/photo-1608248593842-8d7d964268e0?w=1600'
            })` 
          } : {}}
        >
          <div className="shop-header__overlay"></div>
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="shop-header__title">
              {filters.category ? getCategoryName(filters.category) : 'Shop All Products'}
            </h1>
            <p className="shop-header__subtitle">
              {filters.category
                ? (filters.category === 'fragrance' ? 'Discover our curated collection of premium fragrances, from intoxicating oud perfumes to delicate floral scents.' : `Explore our luxurious collection of ${getCategoryName(filters.category).toLowerCase()} crafted with the finest natural ingredients.`)
                : (pagination ? `${pagination.total} products found` : 'Loading...')}
            </p>
          </div>
        </div>
        
        {/* Breadcrumb & Sub-categories for any Category */}
        {filters.category && (
          <div className="container">
            <div className="breadcrumb" style={{ margin: '20px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
              <span style={{ margin: '0 8px' }}>&gt;</span>
              <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Shop</Link>
              <span style={{ margin: '0 8px' }}>&gt;</span>
              <span style={{ color: 'var(--color-gold)' }}>{getCategoryName(filters.category)}</span>
            </div>
            
            <div className="shop-subcategories" style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleFilterChange('subcategory', undefined)}
                style={{ 
                  borderRadius: '20px', padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', 
                  fontWeight: !filters.subcategory ? 500 : 400, transition: 'all 0.2s',
                  border: `1px solid ${!filters.subcategory ? 'var(--color-gold)' : 'rgba(255,255,255,0.3)'}`,
                  background: !filters.subcategory ? 'var(--color-gold)' : 'transparent',
                  color: !filters.subcategory ? '#000' : 'var(--color-gold)'
                }}
              >
                All {getCategoryName(filters.category)}
              </button>
              
              {/* Hardcode subcategories for specific categories, fallback to dynamic for others */}
              {(filters.category === 'fragrance' 
                ? [{ id: 'perfumes', name: 'Perfumes' }, { id: 'edp', name: 'Eau de Parfum' }, { id: 'premium', name: 'Premium Fragrances' }, { id: 'gift', name: 'Gift Sets' }]
                : filters.category === 'hair-care'
                ? [{ id: 'shampoo', name: 'Shampoo' }, { id: 'conditioner', name: 'Conditioner' }, { id: 'hair-oil', name: 'Hair Oil' }, { id: 'hair-serum', name: 'Hair Serum' }]
                : filters.category === 'skin-care'
                ? [{ id: 'face-care', name: 'Face Care' }, { id: 'body-care', name: 'Body Care' }, { id: 'moisturizers', name: 'Moisturizers' }]
                : filters.category === 'natural-care'
                ? [{ id: 'herbal-products', name: 'Herbal Products' }, { id: 'natural-oils', name: 'Natural Oils' }, { id: 'wellness-products', name: 'Wellness Products' }]
                : categories.find(c => c.slug === filters.category)?.subcategories || []
              ).map((sub: any) => {
                const subValue = sub.slug || sub.id;
                const isActive = filters.subcategory === subValue;
                return (
                  <button 
                    key={subValue} 
                    onClick={() => handleFilterChange('subcategory', subValue)}
                    style={{ 
                      borderRadius: '20px', padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', 
                      fontWeight: isActive ? 500 : 400, transition: 'all 0.2s',
                      border: `1px solid ${isActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.3)'}`,
                      background: isActive ? 'var(--color-gold)' : 'transparent',
                      color: isActive ? '#000' : 'var(--color-gold)'
                    }}
                    onMouseOver={(e) => !isActive && (e.currentTarget.style.borderColor = 'var(--color-gold)')}
                    onMouseOut={(e) => !isActive && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="container">
          <div className={`shop-layout ${filters.category ? 'shop-layout--category' : ''}`}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="shop-sidebar-overlay" 
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar (Hide on category pages) */}
            {!filters.category && (
              <aside className={`shop-sidebar ${sidebarOpen ? 'shop-sidebar--open' : ''}`}>
                <div className="shop-sidebar-header">
                  <h2 className="shop-sidebar-header-title">Filters</h2>
                  <button className="shop-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                <div className="shop-sidebar__inner">
                  <div className="shop-filter-group">
                    <h3 className="shop-filter-title">CATEGORIES</h3>
                    {categories.map((cat) => (
                      <label key={cat.id} className="shop-checkbox-label">
                        <input
                          type="checkbox"
                          checked={filters.category === cat.slug}
                          onChange={(e) => handleFilterChange('category', e.target.checked ? cat.slug : undefined)}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>

                  <div className="shop-filter-group">
                    <h3 className="shop-filter-title">PRICE RANGE</h3>
                    {[
                      { label: 'Under ₹500', min: '0', max: '500' },
                      { label: '₹500 - ₹1,000', min: '500', max: '1000' },
                      { label: '₹1,000 - ₹2,000', min: '1000', max: '2000' },
                      { label: '₹2,000 - ₹3,000', min: '2000', max: '3000' },
                      { label: '₹3,000+', min: '3000', max: '' },
                    ].map((range, i) => (
                      <label key={i} className="shop-checkbox-label">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={priceRange.min === range.min && priceRange.max === range.max}
                          onChange={() => {
                            setPriceRange({ min: range.min, max: range.max });
                            setFilters((p) => ({ ...p, page: 1 }));
                          }}
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>

                  <div className="shop-filter-group">
                    <h3 className="shop-filter-title">FOR</h3>
                    {['Unisex', 'Men', 'Women'].map((gender) => (
                      <label key={gender} className="shop-checkbox-label">
                        <input type="radio" name="gender" />
                        {gender}
                      </label>
                    ))}
                  </div>

                  <div className="shop-filter-group">
                    <h3 className="shop-filter-title">TAGS</h3>
                    <div className="shop-tags-cloud">
                      {['aloe', 'anti-aging', 'argan', 'ayurvedic', 'bhringraj', 'biotin', 'body care', 'body lotion', 'body scrub', 'coconut', 'coffee', 'evening', 'exfoliation', 'face care', 'face cream', 'floral', 'fragrance', 'frizz control', 'gel', 'gift', 'gift set', 'gold', 'hair care', 'hair oil', 'hair repair', 'herbal'].map((tag) => (
                        <span key={tag} className="shop-tag-item">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-outline btn-full" onClick={() => { setFilters({ page: 1, limit: 12, sort: 'newest' }); setPriceRange({ min: '', max: '' }); }}>
                    Clear Filters
                  </button>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <main className="shop-main">
              {/* Category Page Simple Count */}
              {filters.category && (
                <div style={{ marginBottom: '24px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {pagination?.total || products.length} products
                </div>
              )}

              {/* Toolbar (Hide on category pages) */}
              {!filters.category && (
                <div className="shop-toolbar" style={{ justifyContent: 'flex-end' }}>
                  <div className="shop-mobile-filter-wrap">
                    <button className="shop-mobile-filter-btn btn btn-outline btn-sm" onClick={() => setSidebarOpen(true)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                      Filters
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="shop-sort-label" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Sort by:</span>
                    <select
                      className="form-select"
                      style={{ width: '160px', fontSize: '0.85rem', padding: '8px 12px', background: 'transparent', color: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                    >
                      <option value="newest" style={{ background: '#000' }}>Newest</option>
                      <option value="price-low" style={{ background: '#000' }}>Price: Low to High</option>
                      <option value="price-high" style={{ background: '#000' }}>Price: High to Low</option>
                      <option value="popular" style={{ background: '#000' }}>Most Popular</option>
                      <option value="rating" style={{ background: '#000' }}>Best Rated</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Products */}
              {isLoading ? (
                <div className="products-grid">
                  {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state__title">No products found</p>
                  <p className="empty-state__text">Try adjusting your filters or explore all products.</p>
                  <button className="btn btn-outline-gold" onClick={() => setFilters({ page: 1, limit: 12, sort: 'newest' })}>Clear Filters</button>
                </div>
              ) : (
                <>
                  <motion.div className="products-grid" variants={containerVariants} initial="hidden" animate="show">
                    {products.map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="pagination shop-pagination">
                      <button className="page-btn page-btn-arrow" disabled={filters.page === 1} onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map((page) => (
                        <button key={page} className={`page-btn ${filters.page === page ? 'active' : ''}`} onClick={() => handleFilterChange('page', page)}>
                          {page}
                        </button>
                      ))}
                      <button className="page-btn page-btn-arrow" disabled={filters.page === pagination.totalPages} onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      <style>{`
        .shop-header {
          position: relative;
          padding: var(--space-8) 0 var(--space-6);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-10);
          background-color: var(--color-black);
        }
        .shop-header--category {
          padding: 100px 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          text-align: center;
          border-bottom: none;
        }
        .shop-header__overlay {
          display: none;
        }
        .shop-header--category .shop-header__overlay {
          display: block;
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }
        .shop-header__title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: var(--color-ivory);
          font-weight: 400;
          margin-bottom: 8px;
        }
        .shop-header--category .shop-header__title {
          font-size: 3.5rem;
        }
        .shop-header__subtitle {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          max-width: 600px;
          line-height: 1.6;
        }
        .shop-header--category .shop-header__subtitle {
          color: var(--color-ivory);
          font-size: 1rem;
          margin: 0 auto;
        }
        .shop-layout { display: grid; grid-template-columns: 240px 1fr; gap: var(--space-10); padding-bottom: var(--space-16); }
        .shop-layout--category { grid-template-columns: 1fr; }
        .shop-sidebar { position: sticky; top: calc(var(--nav-height) + 20px); height: fit-content; max-height: calc(100vh - var(--nav-height) - 40px); overflow-y: auto; }
        .shop-sidebar__inner { display: flex; flex-direction: column; gap: var(--space-8); }
        .shop-filter-group { }
        .shop-filter-title { font-family: var(--font-serif); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--color-gold); margin-bottom: var(--space-4); }
        .shop-checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--color-text-secondary); cursor: pointer; padding: 4px 0; margin-bottom: 4px; transition: color 0.2s; }
        .shop-checkbox-label:hover { color: var(--color-ivory); }
        .shop-checkbox-label input { appearance: none; width: 14px; height: 14px; border: 1px solid var(--color-text-secondary); border-radius: 2px; outline: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .shop-checkbox-label input[type="radio"] { border-radius: 50%; }
        .shop-checkbox-label input:checked { background: var(--color-ivory); border-color: var(--color-ivory); }
        .shop-tags-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
        .shop-tag-item { font-size: 0.75rem; color: var(--color-text-muted); cursor: pointer; transition: color 0.2s; }
        .shop-tag-item:hover { color: var(--color-ivory); }
        .shop-main { min-width: 0; }
        .shop-mobile-filter-wrap { display: none; }
        .shop-toolbar { display: flex; justify-content: flex-end; align-items: center; margin-bottom: var(--space-6); gap: 16px; }
        .shop-sort-label { font-size: 0.8rem; color: var(--color-text-muted); margin-right: 12px; }
        .shop-mobile-filter-btn { display: none; }
        .shop-pagination { display: flex; justify-content: flex-end; margin-top: 40px; gap: 8px; }
        .shop-pagination .page-btn { background: transparent; border: 1px solid var(--color-border); color: var(--color-text-secondary); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
        .shop-pagination .page-btn:hover { border-color: var(--color-gold); color: var(--color-gold); }
        .shop-pagination .page-btn.active { background: var(--color-gold); color: var(--color-black); border-color: var(--color-gold); font-weight: 600; }
        .shop-pagination .page-btn-arrow { border-color: var(--color-border); }
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
        .shop-layout--category .products-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1024px) {
          .shop-layout { grid-template-columns: 200px 1fr; gap: var(--space-6); }
        }
        @media (max-width: 768px) {
          .shop-layout { grid-template-columns: 1fr; }
          .shop-sidebar { position: fixed; top: 0; left: 0; width: 300px; height: 100vh; background: var(--color-charcoal); z-index: var(--z-modal); transform: translateX(-100%); transition: transform 0.3s; padding: var(--space-6); border-right: 1px solid var(--color-border); }
          .shop-sidebar--open { transform: translateX(0); box-shadow: 10px 0 30px rgba(0,0,0,0.5); }
          .shop-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: calc(var(--z-modal) - 1); backdrop-filter: blur(4px); }
          .shop-sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid rgba(255,255,255,0.1); }
          .shop-sidebar-header-title { font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-gold); margin: 0; }
          .shop-sidebar-close { background: none; border: none; color: var(--color-ivory); font-size: 1.25rem; cursor: pointer; }
          .shop-mobile-filter-wrap { display: block; margin-right: auto; }
          .shop-mobile-filter-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .shop-layout--category .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .shop-toolbar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .shop-mobile-filter-wrap { margin-right: 0; width: 100%; }
          .shop-mobile-filter-btn { width: 100%; justify-content: center; }
          .products-grid { grid-template-columns: 1fr 1fr; gap: var(--space-2); }
        }
        @media (max-width: 360px) { .products-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default ShopPage;
