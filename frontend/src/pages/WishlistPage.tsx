import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';
import ProductCard from '../components/product/ProductCard';

const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getWishlist().then(({ data }) => {
      setItems(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>My Wishlist  BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px' }}>
        <div className="container">
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/account" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '1.2rem', transition: 'color 0.2s' }}>
              &larr;
            </Link>
            <h1 className="section-title" style={{ marginBottom: 0, fontSize: '2rem' }}>
              My Wishlist <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>({items.length} items)</span>
            </h1>
          </div>
          {loading ? (
            <div className="products-grid">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '8px' }} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">??????</div>
              <h2 className="empty-state__title">Your wishlist is empty</h2>
              <p className="empty-state__text">Save items you love to view them later.</p>
              <Link to="/shop" className="btn btn-outline-gold">Explore Collection</Link>
            </div>
          ) : (
            <div className="products-grid">
              {items.map(item => (
                <div key={item.id} style={{ position: 'relative' }}>
                  <ProductCard product={item.product} isWishlistPage />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default WishlistPage;
