import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsApi } from '../services/api';
import { useCartStore } from '../store/cart.store';
import { useWishlistStore } from '../store/wishlist.store';
import { useAuthStore } from '../store/auth.store';
import ProductCard from '../components/product/ProductCard';
import ProductReviews from '../components/product/ProductReviews';
import SEO from '../components/SEO';
import { optimizeImage } from '../utils/image';
import { ProductVariant } from '../types';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [adding, setAdding] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const product = data?.data?.data;

  const { data: bestsellersData } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: productsApi.getBestsellers,
    enabled: !!product && (!product.related || product.related.length === 0),
  });

  const relatedProducts = (product?.related && product.related.length > 0) 
    ? product.related 
    : (bestsellersData?.data?.data || []).slice(0, 4);

  if (isLoading) {
    return (
      <div style={{ paddingTop: 'var(--nav-height)' }}>
        <div className="container" style={{ paddingTop: '48px' }}>
          <div className="pdp-grid">
            <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '8px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: i === 0 ? '40px' : i === 1 ? '60px' : '20px', width: i % 2 === 0 ? '80%' : '60%' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div style={{ paddingTop: 'var(--nav-height)', textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-ivory)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '16px' }}>This product may have been removed or is temporarily unavailable.</p>
        <Link to="/shop" className="btn btn-outline-gold" style={{ marginTop: '24px', display: 'inline-flex' }}>Back to Shop</Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentComparePrice = selectedVariant?.comparePrice ?? product.comparePrice;
  const discount = currentComparePrice
    ? Math.round(((Number(currentComparePrice) - Number(currentPrice)) / Number(currentComparePrice)) * 100)
    : 0;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : (product.inventory?.quantity ?? 0) > 0;
  const stock = selectedVariant ? selectedVariant.stock : product.inventory?.quantity ?? 0;
  const thumbnail = product.images?.find((img: any) => img.isThumbnail) || product.images?.[0];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast('Please login to add items to your cart', { icon: '🛒' });
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addItem(product.id, selectedVariant?.id, quantity);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    await toggle(product.id);
  };

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'benefits', label: 'Benefits' },
    { key: 'how-to-use', label: 'How to Use' }
  ];

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? 'var(--color-gold)' : 'var(--color-border)', fontSize: '1.1rem' }}>★</span>
    ));

  // JSON-LD Schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map((img: any) => img.url) || [],
    "description": product.shortDescription || product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "BJ'S Natural Care"
    },
    "offers": {
      "@type": "Offer",
      "url": `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": currentPrice,
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    ...(product.avgRating > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.avgRating,
        "reviewCount": product.reviewCount || 1
      }
    })
  };

  return (
    <>
      <SEO 
        title={product.metaTitle || product.name}
        description={product.metaDesc || product.shortDescription || product.description?.substring(0, 160)}
        type="product"
        url={`/products/${product.slug}`}
        image={thumbnail?.url}
        schema={productSchema}
      />

      <div style={{ paddingTop: 'var(--nav-height)' }}>
        <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
          {/* Breadcrumb */}
          <div className="breadcrumb" style={{ marginBottom: '32px' }}>
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/shop" className="breadcrumb-link">Shop</Link>
            <span className="breadcrumb-sep">/</span>
            {product.category && <Link to={`/shop?category=${product.category.slug}`} className="breadcrumb-link">{product.category.name}</Link>}
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>

          {/* Main Grid */}
          <div className="pdp-grid">
            {/* Image Gallery */}
            <div className="pdp-gallery">
              <div className="pdp-main-image">
                <motion.img
                  key={selectedImage}
                  src={optimizeImage(product.images[selectedImage]?.url) || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800'}
                  alt={product.images[selectedImage]?.altText || product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="pdp-main-image__img"
                />
                {discount > 0 && <span className="product-card__badge badge-sale">{discount}% OFF</span>}
              </div>
              {product.images.length > 1 && (
                <div className="pdp-thumbnails">
                  {product.images.map((img: any, index: number) => (
                    <button
                      key={img.id}
                      className={`pdp-thumb ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={optimizeImage(img.url)} alt={img.altText || `Thumbnail ${index + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="pdp-info">
              {product.brand && <p className="pdp-brand">{product.brand}</p>}
              <h1 className="pdp-name">{product.name}</h1>

              {/* Rating */}
              <div className="pdp-rating">
                <div>{renderStars(product.avgRating)}</div>
                <span className="pdp-rating-text">{Number(product.avgRating).toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="pdp-price">
                <span className="price-current">₹{Number(currentPrice).toLocaleString('en-IN')}</span>
                {currentComparePrice && (
                  <span className="price-original">₹{Number(currentComparePrice).toLocaleString('en-IN')}</span>
                )}
                {discount > 0 && <span className="price-discount">Save {discount}%</span>}
              </div>

              {/* Short description */}
              {product.shortDescription && <p className="pdp-short-desc">{product.shortDescription}</p>}

              <hr className="divider" />

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="pdp-variants">
                  <p className="form-label">Select Size / Variant</p>
                  <div className="pdp-variant-grid">
                    {product.variants.map((variant: ProductVariant) => (
                      <button
                        key={variant.id}
                        className={`pdp-variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''} ${variant.stock === 0 ? 'out-of-stock' : ''}`}
                        onClick={() => setSelectedVariant(variant.id === selectedVariant?.id ? null : variant)}
                        disabled={variant.stock === 0}
                      >
                        {variant.name}
                        {variant.price !== product.price && (
                          <span className="pdp-variant-price"> (₹{Number(variant.price).toLocaleString('en-IN')})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="pdp-stock">
                {inStock ? (
                  <span className="pdp-stock-in">
                    <span className="pdp-stock-dot pdp-stock-dot--in" />
                    In Stock {stock <= 5 && stock > 0 ? `(Only ${stock} left!)` : ''}
                  </span>
                ) : (
                  <span className="pdp-stock-out">
                    <span className="pdp-stock-dot pdp-stock-dot--out" />
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Actions Row */}
              <div className="pdp-actions-row">
                {inStock && (
                  <div className="qty-selector">
                    <button className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                    <span className="qty-value">{quantity}</span>
                    <button className="qty-btn" onClick={() => setQuantity((q) => Math.min(stock, q + 1))}>+</button>
                  </div>
                )}
                <button
                  className={`btn btn-primary btn-lg ${adding ? 'btn-loading' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!inStock || adding}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  {!adding && (inStock ? 'Add to Cart' : 'Out of Stock')}
                </button>
                <button
                  className={`btn btn-icon ${isWishlisted(product.id) ? 'btn-outline-gold' : 'btn-outline'}`}
                  onClick={handleWishlist}
                  aria-label="Wishlist"
                  style={{ width: '48px', height: '48px', flexShrink: 0 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              {/* Trust badges */}
              <hr className="divider" style={{ margin: '32px 0 24px' }} />
              <div className="pdp-trust-grid">
                <div className="pdp-trust-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                    <path d="M11 20A7 7 0 0 1 14 6a7 7 0 0 1 7 7c0 3.866-3.134 7-7 7h-3v-7"></path>
                  </svg>
                  <span>100% Natural</span>
                </div>
                <div className="pdp-trust-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path>
                  </svg>
                  <span>Cruelty Free</span>
                </div>
                <div className="pdp-trust-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                  <span>Free Shipping</span>
                </div>
                <div className="pdp-trust-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="pdp-tabs">
            <div className="pdp-tab-list">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`pdp-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="pdp-tab-content">
              {activeTab === 'description' && <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{product.description}</div>}
              {activeTab === 'ingredients' && (
                product.ingredients ? <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{product.ingredients}</div>
                : <p style={{ color: 'var(--color-text-muted)' }}>Ingredient information not available.</p>
              )}
              {activeTab === 'how-to-use' && (
                product.howToUse ? <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{product.howToUse}</div>
                : <p style={{ color: 'var(--color-text-muted)' }}>Usage instructions not available.</p>
              )}
              {activeTab === 'benefits' && (
                product.benefits ? <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{product.benefits}</div>
                : <p style={{ color: 'var(--color-text-muted)' }}>Benefits information not available.</p>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div style={{ marginTop: '80px', borderTop: '1px solid var(--color-border)', paddingTop: '60px' }}>
             <ProductReviews productId={product.id} reviews={product.reviews || []} />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-ivory)', marginBottom: '32px' }}>You May Also Like</h3>
              <div className="products-grid">
                {relatedProducts.slice(0, 4).map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .pdp-grid { display: grid; grid-template-columns: 4.5fr 7fr; gap: var(--space-12); margin-bottom: var(--space-10); align-items: start; }
        .pdp-gallery { display: flex; flex-direction: column; gap: var(--space-4); }
        .pdp-main-image { 
          position: relative; aspect-ratio: 1 / 1; overflow: hidden; border-radius: var(--radius-md); 
          background: #0a0a0a; border: 1px solid var(--color-border);
        }
        .pdp-main-image__img { width: 100%; height: 100%; object-fit: contain; padding: 20px; transition: opacity 0.3s; }
        
        .pdp-thumbnails { display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center; }
        .pdp-thumb { 
          width: 80px; height: 100px; border-radius: var(--radius-sm); border: 2px solid transparent; 
          overflow: hidden; transition: all var(--transition-fast); background: #111; padding: 4px; 
        }
        .pdp-thumb img { width: 100%; height: 100%; object-fit: contain; }
        .pdp-thumb.active, .pdp-thumb:hover { border-color: var(--color-gold); }
        
        .pdp-brand { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-gold); margin-bottom: var(--space-2); }
        .pdp-name { font-family: var(--font-serif); font-size: 2.2rem; color: var(--color-ivory); margin-bottom: var(--space-4); line-height: 1.2; }
        .pdp-rating { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-5); }
        .pdp-rating-text { font-size: 0.875rem; color: var(--color-text-muted); }
        .pdp-price { display: flex; align-items: baseline; gap: var(--space-3); margin-bottom: var(--space-4); }
        .pdp-short-desc { font-size: 0.9375rem; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-5); }
        .pdp-variants { margin-bottom: var(--space-5); }
        .pdp-variant-grid { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-2); }
        .pdp-variant-btn {
          padding: 8px 16px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .pdp-variant-btn:hover { border-color: var(--color-gold); color: var(--color-ivory); }
        .pdp-variant-btn.active { border-color: var(--color-gold); color: var(--color-gold); background: rgba(201,162,39,0.1); }
        .pdp-variant-btn.out-of-stock { opacity: 0.4; text-decoration: line-through; cursor: not-allowed; }
        .pdp-variant-price { font-size: 0.75rem; color: var(--color-text-muted); }
        .pdp-stock { margin-bottom: var(--space-5); font-size: 0.875rem; }
        .pdp-stock-in { color: var(--color-success); display: flex; align-items: center; gap: 6px; }
        .pdp-stock-out { color: var(--color-error); display: flex; align-items: center; gap: 6px; }
        .pdp-stock-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .pdp-stock-dot--in { background: var(--color-success); }
        .pdp-stock-dot--out { background: var(--color-error); }
        .pdp-actions-row { display: flex; gap: var(--space-4); margin-bottom: var(--space-5); align-items: center; }
        .price-discount { font-size: 0.75rem; background: #e53935; color: white; padding: 2px 8px; border-radius: 12px; font-weight: 500; }
        .price-original { text-decoration: line-through; opacity: 0.6; }
        .pdp-trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        .pdp-trust-item { display: flex; align-items: center; gap: var(--space-3); font-size: 0.85rem; color: var(--color-text-secondary); }
        .pdp-trust-item svg { flex-shrink: 0; }
        .pdp-tabs { margin-top: var(--space-10); border-top: 1px solid var(--color-border); }
        .pdp-tab-list { display: flex; border-bottom: 1px solid var(--color-border); margin-bottom: var(--space-8); }
        .pdp-tab {
          padding: var(--space-4) var(--space-6);
          font-size: 0.875rem;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
          border-bottom: 2px solid transparent;
          transition: all var(--transition-fast);
          margin-bottom: -1px;
        }
        .pdp-tab:hover { color: var(--color-ivory); }
        .pdp-tab.active { color: var(--color-gold); border-bottom-color: var(--color-gold); }
        .pdp-tab-content { min-height: 200px; }
        .review-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5); }
        .review-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3); }
        .review-card__name { font-size: 0.9rem; color: var(--color-ivory); font-weight: 500; }
        .review-card__verified { font-size: 0.7rem; color: var(--color-gold); }
        .review-card__title { font-size: 0.9375rem; color: var(--color-ivory); font-weight: 500; margin-bottom: var(--space-2); }
        .review-card__comment { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-3); }
        .review-card__date { font-size: 0.75rem; color: var(--color-text-muted); }
        .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); }
        @media (max-width: 1024px) {
          .pdp-grid { grid-template-columns: 1fr; gap: var(--space-8); }
          .pdp-name { font-size: 1.8rem; }
          .products-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .pdp-actions { flex-direction: column; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
};

export default ProductDetailPage;
