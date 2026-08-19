import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart.store';

const CartPage: React.FC = () => {
  const { cart, removeItem, updateItem, applyCoupon, removeCoupon, isLoading } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try { await applyCoupon(couponCode); setCouponCode(''); }
    finally { setCouponLoading(false); }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Helmet><title>Your Cart - BJ'S Natural Care</title></Helmet>
        <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '60vh' }}>
          <div className="container">
            <div className="empty-state">
              <div className="empty-state__icon">🛒</div>
              <h1 className="empty-state__title">Your cart is empty</h1>
              <p className="empty-state__text">Looks like you haven't added any luxury items to your cart yet.</p>
              <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>{`Your Cart (${cart.items.length}) - BJ'S Natural Care`}</title></Helmet>
      <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh' }}>
        <div className="container">
          <h1 className="section-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px', color: 'var(--color-ivory)' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>{cart.items.length} items in your cart</p>

          <div className="cart-page-grid">
            {/* Items */}
            <div className="cart-page-items">
              <div className="cart-cards-container">
                {cart.items.map((item) => {
                  const price = item.variant?.price ?? item.product.price;
                  const img = item.variant?.image || item.product.images?.[0]?.url;
                  return (
                    <div className="cart-card" key={item.id}>
                      <Link to={`/products/${item.product.slug}`} className="cart-card__img-link">
                        <img src={img} alt={item.product.name} className="cart-card__img" />
                      </Link>
                      
                      <div className="cart-card__info">
                        <div className="cart-card__top">
                          <div>
                            <Link to={`/products/${item.product.slug}`} className="cart-card__title">
                              {item.product.name}
                            </Link>
                            {item.variant && <div className="cart-card__variant">{item.variant.name}</div>}
                          </div>
                          <button className="cart-card__remove" onClick={() => removeItem(item.id)} disabled={isLoading} aria-label="Remove item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="cart-card__bottom">
                          <div className="qty-selector">
                            <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity - 1)} disabled={isLoading || item.quantity <= 1}>-</button>
                            <span className="qty-value">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity + 1)} disabled={isLoading}>+</button>
                          </div>
                          <div className="cart-card__price">
                            {formatPrice(Number(price) * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="cart-actions-row">
                <Link to="/shop" className="cart-action-link">
                  &larr; Continue Shopping
                </Link>
                <button className="cart-action-link" onClick={() => { /* Implement clear cart if needed, or omit. */ }} style={{ border: 'none', background: 'transparent' }}>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="cart-page-summary">
              <div className="cart-summary-card">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '24px', color: 'var(--color-ivory)', fontWeight: 500 }}>Order Summary</h2>

                <div className="summary-row">
                  <span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (18% GST)</span>
                  <span>{formatPrice(cart.tax)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{cart.shipping === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : formatPrice(cart.shipping)}</span>
                </div>

                {cart.coupon ? (
                  <div className="summary-row" style={{ color: 'var(--color-success)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Discount ({cart.coupon.code})</span>
                      <button onClick={removeCoupon} style={{ fontSize: '0.7rem', color: 'var(--color-error)' }}>Remove</button>
                    </div>
                    <span>-{formatPrice(cart.discount)}</span>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
                    <input type="text" className="form-input" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} style={{ padding: '8px 12px', fontSize: '0.875rem' }} />
                    <button type="submit" className="btn btn-outline-gold btn-sm" disabled={couponLoading}>{couponLoading ? '...' : 'Apply'}</button>
                  </form>
                )}

                <div className="divider" style={{ margin: '20px 0', borderColor: 'rgba(255,255,255,0.2)' }} />

                <div className="summary-row summary-total">
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Grand Total</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>{formatPrice(cart.total)}</span>
                </div>

                {cart.shipping > 0 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textAlign: 'center', margin: '16px 0' }}>
                    Add {formatPrice(999 - cart.subtotal)} more to your cart for free shipping!
                  </p>
                )}

                <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')} style={{ marginTop: '24px', fontWeight: 600, borderRadius: '4px' }}>
                  Proceed to Checkout
                </button>
                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page-grid { display: grid; grid-template-columns: 1fr 400px; gap: 64px; }
        .cart-page-items { display: flex; flex-direction: column; gap: 24px; }
        .cart-cards-container { display: flex; flex-direction: column; gap: 16px; }
        
        .cart-card {
          display: flex;
          gap: 20px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          background: transparent;
        }
        .cart-card__img-link { flex-shrink: 0; }
        .cart-card__img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 6px;
          background: #111;
        }
        .cart-card__info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .cart-card__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .cart-card__title {
          font-family: 'Inter', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--color-gold);
          text-decoration: none;
          display: block;
          margin-bottom: 4px;
        }
        .cart-card__variant {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .cart-card__remove {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }
        .cart-card__remove:hover { color: var(--color-error); }
        
        .cart-card__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .qty-selector {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }
        .qty-btn {
          background: transparent;
          border: none;
          color: var(--color-ivory);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .qty-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
        .qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .qty-value {
          width: 32px;
          text-align: center;
          font-size: 0.9rem;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-card__price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-ivory);
        }
        
        .cart-actions-row {
          display: flex;
          justify-content: space-between;
          padding: 0 4px;
        }
        .cart-action-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
          cursor: pointer;
        }
        .cart-action-link:hover {
          color: var(--color-gold);
        }

        .cart-summary-card { 
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px; 
          padding: 24px; 
          position: sticky; 
          top: calc(var(--nav-height) + 24px); 
        }
        .summary-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          font-size: 0.9rem; 
          color: var(--color-text-muted); 
          margin-bottom: 12px; 
        }
        .summary-row span:last-child {
          color: var(--color-ivory);
        }
        .summary-total { 
          color: var(--color-ivory); 
          margin-bottom: 0; 
          align-items: center;
        }
        .summary-total span:last-child {
          color: var(--color-ivory);
        }
        @media (max-width: 1024px) { 
          .cart-page-grid { grid-template-columns: 1fr; } 
          .cart-summary-card { position: static; } 
        }
        @media (max-width: 768px) {
          .cart-page-grid { gap: 32px; }
        }
        @media (max-width: 480px) {
          .cart-card { flex-direction: column; padding: 12px; }
          .cart-card__img { width: 100%; height: auto; aspect-ratio: 1; }
          .cart-card__bottom { margin-top: 16px; }
          .summary-row { font-size: 0.85rem; }
        }
      `}</style>
    </>
  );
};

export default CartPage;
