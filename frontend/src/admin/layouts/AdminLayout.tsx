import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';
import { NotificationDropdown } from '../../components/layout/NotificationDropdown';

const adminNav = [
  { label: 'Dashboard', to: '/admin', icon: '◉', end: true },
  { label: 'Products', to: '/admin/products', icon: '◈' },
  { label: 'Categories', to: '/admin/categories', icon: '▦' },
  { label: 'Inventory', to: '/admin/inventory', icon: '⊟' },
  { label: 'Orders', to: '/admin/orders', icon: '◎' },
  { label: 'Payments', to: '/admin/payments', icon: '₹' },
  { label: 'Delivery', to: '/admin/delivery', icon: '⛟' },
  { label: 'Customers', to: '/admin/customers', icon: '◐' },
  { label: 'Coupons', to: '/admin/coupons', icon: '%' },
  { label: 'Promotions', to: '/admin/promotions', icon: '◈' },
  { label: 'Banners', to: '/admin/banners', icon: '▤' },
  { label: 'Campaigns', to: '/admin/campaigns', icon: '✦' },
  { label: 'Reviews', to: '/admin/reviews', icon: '★' },
  { label: 'Support', to: '/admin/support', icon: '☎' },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: '≡' },
  { label: 'Settings', to: '/admin/settings', icon: '⚙' },
];

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__logo">
          <Link to="/">
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--color-gold)' }}>BJ'S</span>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>ADMIN PANEL</span>
          </Link>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)} style={{ color: 'var(--color-text-muted)' }}>✕</button>
        </div>

        <nav className="admin-sidebar__nav">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ivory)', fontWeight: 500 }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{user?.role}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <Link to="/" className="btn btn-outline btn-sm" style={{ flex: 1, textAlign: 'center' }}>← Store</Link>
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-content">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--color-text-muted)', display: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <Link to="/shop" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }} target="_blank">
              View Store ↗
            </Link>
            <div style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />
            <NotificationDropdown />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{user?.firstName}</span>
          </div>
        </header>
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        .admin-sidebar__logo {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .admin-sidebar__close { display: none; }
        .admin-sidebar__nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
          display: flex; flex-direction: column; gap: 2px;
        }
        .admin-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .admin-nav-item:hover { color: var(--color-ivory); background: var(--color-surface); }
        .admin-nav-item.active { color: var(--color-gold); background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.2); }
        .admin-nav-icon { width: 18px; text-align: center; flex-shrink: 0; font-size: 0.9rem; }
        .admin-nav-label { font-size: 0.875rem; letter-spacing: 0.03em; }
        .admin-sidebar__footer {
          padding: 16px 12px;
          border-top: 1px solid var(--color-border);
        }
        .admin-user { display: flex; align-items: center; gap: 12px; }
        .admin-user__avatar {
          width: 36px; height: 36px;
          background: rgba(201,162,39,0.15);
          border: 1px solid var(--color-border-gold);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 600; color: var(--color-gold);
          flex-shrink: 0;
        }
        .admin-hamburger { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar { position: fixed; top: 0; left: 0; height: 100%; z-index: var(--z-modal); transform: translateX(-100%); transition: transform var(--transition-base); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-sidebar__close { display: flex; }
          .admin-content { margin-left: 0; }
          .admin-hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
