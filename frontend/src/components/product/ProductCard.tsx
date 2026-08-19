import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart.store';
import { useWishlistStore } from '../../store/wishlist.store';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { optimizeImage } from '../../utils/image';

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
  const secondaryImage = product.images && product.images.length > 1 
    ? (product.images.find(img => !img.isThumbnail)?.url || product.images[1].url)
    : null;

  return (
    <Link to={`/products/${product.slug}`} className={`product-card ${isWishlistPage ? 'product-card--wishlist' : ''}`} style={{ display: 'block' }}>
      <div className="product-card__image-wrap">
        <img
          src={optimizeImage(thumbnail) || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400'}
          alt={product.name}
          className="product-card__image product-card__image--primary"
          loading="lazy"
        />
        {secondaryImage && (
          <img
            src={optimizeImage(secondaryImage)}
            alt={`${product.name} lifestyle`}
            className="product-card__image product-card__image--secondary"
            loading="lazy"
          />
        )}

        {/* Badges */}
        {!isWishlistPage && (
          <div className="product-card__badges">
            {product.isBestseller && <span className="product-card__badge-bestseller">Bestseller</span>}
            {product.isNewArrival && <span className="product-card__badge-new">New Arrival</span>}
            {discount > 0 && <span className="product-card__badge-sale">-{discount}%</span>}
          </div>
        )}

        {/* Wishlist Icon */}
        <button className={`product-card__wishlist ${isWishlistPage ? 'wishlist-page-icon' : ''}`} onClick={handleWishlist} aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}>
          {isWished ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#C9A227" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          )}
        </button>
        
        {/* Hover Add to Cart Button */}
        <div className="product-card__hover-action">
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

      <div className="product-card__body">
        <div className="product-card__category">{product.category?.name || 'Category'}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <span className="product-card__stars">★★★★☆</span>
          <span className="product-card__rating-val">(4.8)</span>
        </div>
        <div className="product-card__price">
          <span className="product-card__price-current">₹{Number(product.price).toLocaleString('en-IN')}</span>
          {!isWishlistPage && product.comparePrice && (
            <span className="product-card__price-original">₹{Number(product.comparePrice).toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
      <style>{`
        .product-card {
          display: flex; flex-direction: column; height: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--color-black, #000);
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
        }
        .product-card:hover { 
          border-color: rgba(255,255,255,0.2); 
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .product-card__image-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #111; display: flex; align-items: center; justify-content: center; }
        .product-card__image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; transition: opacity 0.4s ease, transform 0.4s ease; }
        .product-card__image--primary { opacity: 1; transform: scale(1); }
        .product-card__image--secondary { opacity: 0; transform: scale(1.05); }
        
        .product-card:hover .product-card__image--primary { opacity: 0; transform: scale(1.05); }
        .product-card:hover .product-card__image--secondary { opacity: 1; transform: scale(1); }
        .product-card:hover .product-card__image--primary:only-of-type { opacity: 1; transform: scale(1.05); }

        .product-card__badges { position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 2; }
        .product-card__badge-bestseller, .product-card__badge-sale { font-size: 0.65rem; font-weight: 700; color: #000; background: #C9A227; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        .product-card__badge-new { font-size: 0.65rem; font-weight: 700; color: #000; background: #9E9E9E; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .product-card__wishlist {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-card__wishlist:hover { transform: scale(1.1); }
        
        .product-card__hover-action {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 0;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index: 3;
        }
        .product-card:hover .product-card__hover-action {
          transform: translateY(0);
        }
        .product-card__add-btn { width: 100%; background: #C9A227; color: #000; border: none; padding: 12px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
        .product-card__add-btn:hover { background: #D4AF37; }
        .product-card__add-btn--disabled { background: #333; color: #888; cursor: not-allowed; }
        
        .product-card__body { padding: 16px; display: flex; flex-direction: column; flex: 1; background: #000; }
        .product-card__category { font-size: 0.65rem; color: #C9A227; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; }
        .product-card__name { font-family: var(--font-serif); font-size: 1.25rem; color: #C9A227; margin-bottom: 6px; font-weight: 400; }
        .product-card__rating { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
        .product-card__stars { color: #C9A227; font-size: 0.8rem; letter-spacing: 2px; }
        .product-card__rating-val { color: #888; font-size: 0.75rem; }
        .product-card__price { display: flex; align-items: center; gap: 8px; margin-top: auto; }
        .product-card__price-current { font-size: 1.1rem; font-weight: 600; color: #fff; }
        .product-card__price-original { font-size: 0.85rem; color: #888; text-decoration: line-through; }

        .product-card--wishlist {
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </Link>
  );
};

export default ProductCard;
