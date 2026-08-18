import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';

const CartDrawer: React.FC = () => {
  const { cart, isOpen, closeCart, removeItem, updateItem, isLoading } = useCartStore();

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="cart-overlay"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="cart-drawer"
          >
            {/* Header */}
            <div className="cart-drawer__header">
              <h2 className="cart-drawer__title">Your Cart</h2>
              {cart && cart.items.length > 0 && (
                <span className="cart-drawer__count">{cart.items.reduce((a, i) => a + i.quantity, 0)} items</span>
              )}
              <button className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Items */}
            {!cart || cart.items.length === 0 ? (
              <div className="cart-drawer__empty">
                <div className="cart-drawer__empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
                <p className="cart-drawer__empty-text">Your cart is empty.</p>
                <p className="cart-drawer__empty-sub">Add some luxury products to get started.</p>
                <button className="btn btn-primary" onClick={closeCart} style={{ marginTop: '16px' }}>
                  <Link to="/shop" style={{ color: 'inherit' }} onClick={closeCart}>Explore Collection</Link>
                </button>
              </div>
            ) : (
              <>
                <div className="cart-drawer__items">
                  {cart.items.map((item) => {
                    const price = item.variant?.price ?? item.product.price;
                    const img = item.variant?.image || item.product.images?.[0]?.url;
                    return (
                      <div key={item.id} className="cart-item">
                        <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                          <img
                            src={img || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=100'}
                            alt={item.product.name}
                            className="cart-item__img"
                          />
                        </Link>
                        <div className="cart-item__info">
                          <Link to={`/products/${item.product.slug}`} onClick={closeCart} className="cart-item__name">
                            {item.product.name}
                          </Link>
                          {item.variant && <p className="cart-item__variant">{item.variant.name}</p>}
                          <p className="cart-item__price">{formatPrice(Number(price))}</p>
                          <div className="cart-item__qty">
                            <button
                              className="qty-btn"
                              onClick={() => updateItem(item.id, item.quantity - 1)}
                              disabled={isLoading}
                            >−</button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >+</button>
                          </div>
                        </div>
                        <div className="cart-item__right">
                          <p className="cart-item__total">{formatPrice(Number(price) * item.quantity)}</p>
                          <button className="cart-item__remove" onClick={() => removeItem(item.id)} disabled={isLoading} aria-label="Remove item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="cart-drawer__summary">
                  {cart.discount > 0 && (
                    <div className="cart-drawer__summary-row">
                      <span>Discount</span><span className="text-green">-{formatPrice(cart.discount)}</span>
                    </div>
                  )}
                  <div className="cart-drawer__summary-row">
                    <span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="cart-drawer__summary-row">
                    <span>Shipping</span>
                    <span>{cart.shipping === 0 ? <span className="text-green">FREE</span> : formatPrice(cart.shipping)}</span>
                  </div>
                  <div className="cart-drawer__summary-row cart-drawer__total">
                    <span>Total</span><span>{formatPrice(cart.total)}</span>
                  </div>
                  {cart.shipping > 0 && (
                    <p className="cart-drawer__free-shipping-hint">
                      Add {formatPrice(999 - cart.subtotal)} more for free shipping
                    </p>
                  )}
                  <Link to="/checkout" onClick={closeCart} className="btn btn-primary btn-full" style={{ textAlign: 'center', marginTop: '16px' }}>
                    Proceed to Checkout
                  </Link>
                  <Link to="/cart" onClick={closeCart} className="btn btn-outline btn-full" style={{ textAlign: 'center', marginTop: '8px' }}>
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>

          <style>{`
            .cart-overlay {
              position: fixed; inset: 0;
              background: rgba(0,0,0,0.7);
              backdrop-filter: blur(4px);
              z-index: 299;
            }
            .cart-drawer {
              position: fixed; top: 0; right: 0;
              width: 420px; height: 100%;
              background: var(--color-charcoal);
              border-left: 1px solid var(--color-border-gold);
              z-index: 300;
              display: flex; flex-direction: column;
              overflow: hidden;
            }
            .cart-drawer__header {
              display: flex; align-items: center;
              padding: var(--space-5) var(--space-6);
              border-bottom: 1px solid var(--color-border);
              gap: var(--space-3);
            }
            .cart-drawer__title { font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-ivory); }
            .cart-drawer__count { font-size: 0.75rem; color: var(--color-gold); background: rgba(201,162,39,0.1); border: 1px solid var(--color-border-gold); padding: 2px 8px; border-radius: 20px; }
            .cart-drawer__close { margin-left: auto; color: var(--color-text-muted); padding: 4px; border-radius: var(--radius-sm); transition: color var(--transition-fast); }
            .cart-drawer__close:hover { color: var(--color-ivory); }
            .cart-drawer__empty {
              flex: 1;
              display: flex; flex-direction: column; align-items: center; justify-content: center;
              padding: var(--space-8);
              text-align: center;
            }
            .cart-drawer__empty-icon { color: var(--color-border); margin-bottom: var(--space-4); }
            .cart-drawer__empty-text { font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-ivory); margin-bottom: var(--space-2); }
            .cart-drawer__empty-sub { font-size: 0.875rem; color: var(--color-text-muted); }
            .cart-drawer__items { flex: 1; overflow-y: auto; padding: var(--space-4) var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
            .cart-item { display: flex; gap: var(--space-4); align-items: flex-start; padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); }
            .cart-item:last-child { border-bottom: none; }
            .cart-item__img { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); background: var(--color-dark-gray); flex-shrink: 0; }
            .cart-item__info { flex: 1; min-width: 0; }
            .cart-item__name { font-size: 0.9rem; color: var(--color-ivory); display: block; margin-bottom: 4px; line-height: 1.3; font-family: var(--font-serif); }
            .cart-item__variant { font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 4px; }
            .cart-item__price { font-size: 0.875rem; color: var(--color-gold); margin-bottom: var(--space-3); }
            .cart-item__qty { display: inline-flex; align-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-md); }
            .cart-item__right { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-2); flex-shrink: 0; }
            .cart-item__total { font-size: 0.9rem; font-weight: 600; color: var(--color-ivory); }
            .cart-item__remove { color: var(--color-text-muted); padding: 4px; border-radius: var(--radius-sm); transition: color var(--transition-fast); }
            .cart-item__remove:hover { color: var(--color-error); }
            .cart-drawer__summary { padding: var(--space-5) var(--space-6); border-top: 1px solid var(--color-border); background: var(--color-rich-black); }
            .cart-drawer__summary-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: var(--space-3); }
            .cart-drawer__total { font-size: 1rem; font-weight: 600; color: var(--color-ivory); border-top: 1px solid var(--color-border); padding-top: var(--space-3); margin-top: var(--space-2); }
            .text-green { color: var(--color-success); }
            .cart-drawer__free-shipping-hint { font-size: 0.75rem; color: var(--color-gold); text-align: center; margin-bottom: var(--space-3); }
            @media (max-width: 480px) { .cart-drawer { width: 100%; } }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
