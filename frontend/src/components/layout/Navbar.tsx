import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import { useWishlistStore } from '../../store/wishlist.store';
import { productsApi } from '../../services/api';
import { Product } from '../../types';
import { NotificationDropdown } from './NotificationDropdown';
import { User, Heart, ShoppingBag, Search, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Load recent searches on mount
    const stored = localStorage.getItem('bjs_recent_searches');
    if (stored) {
      try { setRecentSearches(JSON.parse(stored)); } catch (e) { /* ignore */ }
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await productsApi.search(searchQuery, 6);
        setSuggestions(data.data);
      } catch { setSuggestions([]); }
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addRecentSearch = (query: string) => {
    const q = query.trim();
    if (!q) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('bjs_recent_searches', JSON.stringify(updated));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Shop', to: '/shop' },
    { label: 'Fragrance', to: '/shop?category=fragrance' },
    { label: 'Hair Care', to: '/shop?category=hair-care' },
    { label: 'Skin Care', to: '/shop?category=skin-care' },
    { label: 'Natural Care', to: '/shop?category=natural-care' },
  ];

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Mobile menu toggle */}
          <button className="navbar__hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="navbar__logo" style={{ marginLeft: '64px' }}>
            <img src="/logo.png" alt="BJ'S Nature Care Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar__nav">
            {navLinks.map((link: any) => (
              <div key={link.label} className="navbar__item">
                <Link
                  to={link.to}
                  className="navbar__link"
                >
                  {link.label} {link.children && <span className="navbar__caret">▼</span>}
                </Link>
                {link.children && (
                  <div className="navbar__dropdown">
                    {link.children.map((child: any) => (
                      <NavLink
                        key={child.label}
                        to={child.to}
                        className="navbar__dropdown-link"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar__actions">
            <button className="navbar__action-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link to="/wishlist" className="navbar__action-btn navbar__action-badge-wrap" aria-label="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {isAuthenticated && wishlistItems.length > 0 && <span className="navbar__badge">{wishlistItems.length}</span>}
            </Link>

            <Link to={isAuthenticated ? '/account' : '/login'} className="navbar__action-btn" aria-label="Account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {isAuthenticated && <NotificationDropdown />}

            <button className="navbar__action-btn navbar__action-badge-wrap" onClick={openCart} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount() > 0 && <span className="navbar__badge">{itemCount()}</span>}
            </button>

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" className="navbar__admin-btn btn btn-outline-gold btn-sm" style={{ marginLeft: '8px' }}>Admin</Link>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="search-modal animate-scale-in">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search for products, fragrances, brands..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="search-suggestion-item"
                    onClick={() => {
                      addRecentSearch(p.name);
                      setSearchOpen(false); 
                      setSearchQuery(''); 
                    }}
                  >
                    <img src={p.images[0]?.url} alt={p.name} className="search-suggestion-img" />
                    <div>
                      <div className="search-suggestion-name">{p.name}</div>
                      <div className="search-suggestion-cat">{p.category?.name}</div>
                    </div>
                    <div className="search-suggestion-price">₹{p.price.toLocaleString('en-IN')}</div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Recent Searches */}
            {suggestions.length === 0 && searchQuery.trim() === '' && recentSearches.length > 0 && (
              <div className="search-recent">
                <div className="search-recent-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <span>Recent Searches</span>
                  <button onClick={() => { setRecentSearches([]); localStorage.removeItem('bjs_recent_searches'); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Clear All</button>
                </div>
                <div className="search-recent-list" style={{ display: 'flex', flexDirection: 'column' }}>
                  {recentSearches.map(term => (
                    <div 
                      key={term} 
                      className="search-recent-item" 
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/shop?search=${encodeURIComponent(term)}`);
                        addRecentSearch(term);
                        setSearchOpen(false);
                      }}
                      style={{ padding: '12px 24px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-muted)' }}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                      </svg>
                      {term}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search">✕</button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="mobile-drawer animate-fade-left" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer__header">
              <div className="mobile-drawer__title" style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/logo.png" alt="BJ'S Nature Care Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
              </div>
              <button onClick={() => setMenuOpen(false)} className="mobile-drawer__close text-gold">✕</button>
            </div>
            
            <div className="mobile-drawer__links-container">
              <div className="mobile-drawer__links">
                {navLinks.map((link: any) => (
                  <Link key={link.label} to={link.to} className="mobile-drawer__link" onClick={() => setMenuOpen(false)}>
                    {link.label}
                    <span className="mobile-drawer__link-arrow">›</span>
                  </Link>
                ))}
                
                <hr className="mobile-drawer__divider" />
                
                <Link to="/about" className="mobile-drawer__link" onClick={() => setMenuOpen(false)}>
                  About Us
                  <span className="mobile-drawer__link-arrow">›</span>
                </Link>
                <Link to="/contact" className="mobile-drawer__link" onClick={() => setMenuOpen(false)}>
                  Contact
                  <span className="mobile-drawer__link-arrow">›</span>
                </Link>
              </div>

              <div className="mobile-drawer__bottom">
                <hr className="mobile-drawer__divider" />
                <div className={`mobile-drawer__actions ${isAuthenticated ? 'mobile-drawer__actions--auth' : ''}`}>
                  <Link to={isAuthenticated ? '/account' : '/login'} className="mobile-drawer__action" onClick={() => setMenuOpen(false)}>
                    <User size={24} strokeWidth={1.5} />
                    <span>Account</span>
                  </Link>
                  <Link to="/wishlist" className="mobile-drawer__action" onClick={() => setMenuOpen(false)}>
                    <Heart size={24} strokeWidth={1.5} />
                    <span>Wishlist</span>
                  </Link>
                  <button className="mobile-drawer__action" onClick={() => { openCart(); setMenuOpen(false); }}>
                    <ShoppingBag size={24} strokeWidth={1.5} />
                    <span>Cart</span>
                  </button>
                  {isAuthenticated && (
                    <div className="mobile-drawer__action mobile-drawer__notification">
                      <NotificationDropdown />
                      <span>Alerts</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}


      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: var(--z-sticky);
          height: var(--nav-height);
          transition: all var(--transition-base);
          background: rgba(8,8,8,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(42,42,42,0.5);
        }
        .navbar--scrolled {
          background: rgba(8,8,8,0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom-color: var(--color-border);
        }
        .navbar__inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--space-6);
          height: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-8);
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar__logo-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--color-gold);
          color: var(--color-black);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0;
        }
        .navbar__logo-text {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--color-ivory);
          line-height: 1;
          letter-spacing: 0.02em;
        }
        .text-gold {
          color: var(--color-gold);
        }
        .navbar__nav {
          display: none;
        }
        @media (min-width: 992px) {
          .navbar__nav { 
            display: flex; 
            gap: var(--space-8); 
            flex: 1; 
            justify-content: center; 
          }
        }
        .navbar__item { position: relative; }
        .navbar__caret { font-size: 0.6em; margin-left: 4px; vertical-align: middle; }
        .navbar__link {
          color: var(--color-ivory);
          text-decoration: none;
          font-family: var(--font-sans, 'Inter', sans-serif);
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          position: relative;
        }
        .navbar__link:hover, .navbar__link--active { 
          color: #ffffff; 
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4);
        }
        .navbar__link::after {
          display: none;
        }
        
        .navbar__dropdown {
          position: absolute; top: 100%; left: 0;
          background: rgba(8,8,8,0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          min-width: 200px; padding: 8px 0;
          opacity: 0; visibility: hidden; transform: translateY(10px);
          transition: all 0.2s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 100;
        }
        .navbar__item:hover .navbar__dropdown {
          opacity: 1; visibility: visible; transform: translateY(0);
        }
        .navbar__dropdown-link {
          display: block; padding: 8px 16px;
          color: var(--color-text-secondary); text-decoration: none; font-size: 0.9rem;
          transition: all 0.2s;
        }
        .navbar__dropdown-link:hover { color: var(--color-gold); background: rgba(255,255,255,0.05); }
        .navbar__actions { display: flex; align-items: center; gap: var(--space-3); margin-left: auto; flex-shrink: 0; }
        .navbar__action-btn {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          color: var(--color-ivory);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          position: relative;
        }
        .navbar__action-btn:hover { 
          color: #ffffff; 
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }
        .navbar__action-badge-wrap { position: relative; }
        .navbar__badge {
          position: absolute; top: 0px; right: -2px;
          width: 16px; height: 16px;
          background: var(--color-gold);
          color: var(--color-black);
          font-size: 0.6rem; font-weight: 700;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .navbar__account-menu { display: flex; align-items: center; gap: var(--space-2); }
        .navbar__admin-btn { font-size: 0.7rem !important; padding: 6px 14px !important; }
        .navbar__hamburger { display: none; color: var(--color-text-secondary); }

        /* Search Overlay */
        .search-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(8px);
          z-index: var(--z-modal);
          display: flex; align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
        }
        .search-modal {
          width: 100%;
          max-width: 680px;
          background: var(--color-charcoal);
          border: 1px solid var(--color-border-gold);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          position: relative;
        }
        .search-form { display: flex; gap: var(--space-3); }
        .search-input {
          flex: 1;
          background: var(--color-dark-gray);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          color: var(--color-ivory);
          font-size: 1rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }
        .search-input:focus { border-color: var(--color-gold); }
        .search-input::placeholder { color: var(--color-text-muted); }
        .search-btn {
          padding: 14px 20px;
          background: var(--color-gold);
          color: var(--color-black);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        .search-btn:hover { background: var(--color-soft-gold); }
        .search-close {
          position: absolute; top: var(--space-4); right: var(--space-4);
          color: var(--color-text-muted);
          font-size: 1.25rem;
          padding: var(--space-2);
        }
        .search-close:hover { color: var(--color-ivory); }
        .search-suggestions { margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
        .search-suggestion-item {
          display: flex; align-items: center; gap: var(--space-4);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }
        .search-suggestion-item:hover { background: var(--color-dark-gray); border-color: var(--color-border-gold); }
        .search-suggestion-img { width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); background: var(--color-dark-gray); flex-shrink: 0; }
        .search-suggestion-name { font-size: 0.9rem; color: var(--color-ivory); }
        .search-suggestion-cat { font-size: 0.8rem; color: var(--color-text-muted); }
        .search-suggestion-price { font-size: 0.9rem; color: var(--color-gold); font-weight: 500; margin-left: auto; }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: var(--z-modal);
        }
        .mobile-drawer {
          position: fixed; top: 0; left: 0;
          width: 300px; height: 100%;
          background: #000000;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          z-index: var(--z-modal);
          display: flex; flex-direction: column;
          animation: fadeLeft 0.3s ease forwards;
        }
        @keyframes fadeLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .mobile-drawer__header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .mobile-drawer__title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .mobile-drawer__close { font-size: 1.25rem; cursor: pointer; background: transparent; border: none; font-weight: 300; }
        .mobile-drawer__links-container {
          display: flex; flex-direction: column; flex: 1; overflow-y: auto;
          justify-content: space-between;
        }
        .mobile-drawer__links { display: flex; flex-direction: column; padding: 12px 0; }
        .mobile-drawer__link {
          padding: 16px 24px;
          color: var(--color-gold);
          font-size: 1.05rem;
          font-weight: 500;
          font-family: var(--font-sans);
          display: flex; justify-content: space-between; align-items: center;
          text-decoration: none;
          transition: background 0.2s;
        }
        .mobile-drawer__link:hover { background: rgba(255,255,255,0.05); }
        .mobile-drawer__link-arrow { font-size: 1.25rem; color: rgba(255,255,255,0.3); font-weight: 300; }
        .mobile-drawer__divider { margin: 12px 24px; border: none; border-top: 1px solid rgba(255, 255, 255, 0.2); }
        .mobile-drawer__bottom { padding: 0 0 24px 0; }
        .mobile-drawer__actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 12px 24px; }
        .mobile-drawer__actions--auth { grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4px; padding: 12px 12px; }
        .mobile-drawer__action {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
          color: var(--color-gold);
          text-decoration: none; font-size: 0.85rem; font-family: var(--font-sans);
          background: transparent; border: none; cursor: pointer;
        }
        .mobile-drawer__action:hover { opacity: 0.8; }
        .mobile-drawer__notification .navbar__action-btn { 
          color: var(--color-gold); width: 24px; height: 24px; padding: 0; background: transparent; 
        }
        .mobile-drawer__notification .navbar__action-btn:hover { filter: none; }
        .mobile-drawer__notification .navbar__badge {
          top: -6px; right: -8px;
        }

        @media (max-width: 1024px) {
          .navbar__nav { display: none; }
          .navbar__hamburger { display: flex; }
        }
        @media (max-width: 768px) {
          .navbar__inner { gap: var(--space-4); }
          .navbar__admin-btn { display: none; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
