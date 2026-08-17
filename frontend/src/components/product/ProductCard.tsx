import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart.store';
import { useWishlistStore } from '../../store/wishlist.store';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isWishlistPage?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlistPage }) => {
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const discount = product.comparePrice
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0;

  const inStock = product.inventory ? product.inventory.quantity > 0 : true;
  const isWished = isWishlisted(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    await addItem(product.id);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    await toggle(product.id);
  };

  const thumbnail = product.images?.find((img) => img.isThumbnail)?.url || product.images?.[0]?.url;

  return (
    <Link to={`/products/${product.slug}`} className={`product-card ${isWishlistPage ? 'product-card--wishlist' : ''}`} style={{ display: 'block' }}>
      <div className="product-card__image-wrap">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400'}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />

        {/* Badges - Hidden on wishlist page for cleaner look */}
        {!isWishlistPage && (
          <>
            <div className="product-card__badges">
              {discount > 0 && <span className="product-card__badge-sale">{discount}% Off</span>}
              {product.isNewArrival && !discount && <span className="product-card__badge-new">New</span>}
            </div>
            {product.isBestseller && <div className="product-card__badge-bestseller">Bestseller</div>}
          </>
        )}

        {/* Wishlist Icon */}
        <button className={`product-card__wishlist ${isWishlistPage ? 'wishlist-page-icon' : ''}`} onClick={handleWishlist} aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}>
          {isWished ? (
            <svg width={isWishlistPage ? "12" : "16"} height={isWishlistPage ? "12" : "16"} viewBox="0 0 24 24" fill="#ff4d4f" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          )}
        </button>
      </div>

      <div className="product-card__body">
        <div className="product-card__category">{product.category?.name || 'Category'}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price">
          <span className="product-card__price-current">₹{Number(product.price).toLocaleString('en-IN')}</span>
          {!isWishlistPage && product.comparePrice && (
            <span className="product-card__price-original">₹{Number(product.comparePrice).toLocaleString('en-IN')}</span>
          )}
        </div>
        
        {/* Action Button at Bottom */}
        <div style={{ marginTop: '20px' }}>
          {inStock ? (
            <button className="product-card__add-btn" onClick={handleAddToCart}>
              {isWishlistPage ? 'Move to Cart' : 'Add to Cart'}
            </button>
          ) : (
            <button className="product-card__add-btn product-card__add-btn--disabled" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
      <style>{`
        .product-card {
          display: flex; flex-direction: column; height: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--color-rich-black, #0a0a0a);
          transition: border-color var(--transition-fast);
        }
        .product-card:hover { border-color: var(--color-border-gold); }
        .product-card__image-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #111; }
        .product-card__image { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-luxury); }
        .product-card:hover .product-card__image { transform: scale(1.05); }
        .product-card__badges { position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 8px; z-index: 2; }
        .product-card__badge-sale { font-size: 0.65rem; font-weight: 700; color: #fff; background: #e74c3c; padding: 4px 12px; border-radius: 20px; }
        .product-card__badge-new { font-size: 0.65rem; font-weight: 700; color: var(--color-black); background: var(--color-gold); padding: 4px 12px; border-radius: 20px; }
        .product-card__badge-bestseller { position: absolute; top: 12px; right: 12px; font-size: 0.7rem; font-weight: 600; color: #fff; z-index: 2; }
        
        .product-card__wishlist {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-card__wishlist.wishlist-page-icon {
          top: 16px;
          right: 16px;
        }
        .product-card__wishlist:hover { transform: scale(1.1); }
        
        .product-card__add-btn { width: 100%; background: var(--color-gold); color: var(--color-black); border: none; padding: 10px; font-weight: 600; font-size: 0.9rem; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.2s; }
        .product-card__add-btn:hover { background: var(--color-soft-gold); }
        .product-card__add-btn--disabled { background: var(--color-dark-gray); color: var(--color-text-muted); cursor: not-allowed; }
        
        .product-card__body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
        .product-card__category { font-size: 0.65rem; color: var(--color-gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; font-weight: 600; }
        .product-card__name { font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-gold); margin-bottom: 8px; font-weight: 500; }
        .product-card__price { display: flex; align-items: center; gap: 8px; margin-top: auto; }
        .product-card__price-current { font-size: 1.2rem; font-weight: 700; color: var(--color-ivory); }
        .product-card__price-original { font-size: 0.9rem; color: var(--color-text-muted); text-decoration: line-through; }

        /* Specific styles for Wishlist Page Cards */
        .product-card--wishlist {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
        }
        .product-card--wishlist .product-card__image-wrap {
          aspect-ratio: 3.5 / 4;
        }
        .product-card--wishlist .product-card__body {
          padding: 20px;
        }
      `}</style>
    </Link>
  );
};

export default ProductCard;
