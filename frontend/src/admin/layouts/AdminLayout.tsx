import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';
import { NotificationDropdown } from '../../components/layout/NotificationDropdown';

type NavItem = { label: string; to: string; icon?: string; end?: boolean };
type NavGroup = { label?: string; icon?: string; items: NavItem[]; isCollapsible?: boolean };

const adminSidebarGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', to: '/admin', icon: '◉', end: true },
    ]
  },
  {
    label: 'Catalog',
    icon: '▦',
    isCollapsible: true,
    items: [
      { label: 'Products', to: '/admin/products', icon: '◈' },
      { label: 'Categories', to: '/admin/categories', icon: '▤' },
      { label: 'Inventory', to: '/admin/inventory', icon: '⊟' },
    ]
  },
  {
    label: 'Orders',
    icon: '◎',
    isCollapsible: true,
    items: [
      { label: 'All Orders', to: '/admin/orders', end: true },
      { label: 'Pending', to: '/admin/orders?status=PENDING' },
      { label: 'Processing', to: '/admin/orders?status=PROCESSING' },
      { label: 'Shipped', to: '/admin/orders?status=SHIPPED' },
      { label: 'Delivered', to: '/admin/orders?status=DELIVERED' },
      { label: 'Returns', to: '/admin/orders?status=RETURN_REQUESTED' },
      { label: 'Refunds', to: '/admin/orders?status=REFUNDED' },
    ]
  },
  {
    items: [
      { label: 'Customers', to: '/admin/customers', icon: '◐' },
      { label: 'Payments', to: '/admin/payments', icon: '₹' },
    ]
  },
  {
    label: 'Marketing',
    icon: '✦',
    isCollapsible: true,
    items: [
      { label: 'Banners', to: '/admin/banners' },
      { label: 'Campaigns', to: '/admin/campaigns' },
      { label: 'Coupons', to: '/admin/coupons' },
      { label: 'Promotions', to: '/admin/promotions' },
    ]
  },
  {
    items: [
      { label: 'Reviews', to: '/admin/reviews', icon: '★' },
      { label: 'Analytics', to: '/admin/analytics', icon: '📈' },
    ]
  },
  {
    label: 'Content',
    icon: '✎',
    isCollapsible: true,
    items: [
      { label: 'Homepage', to: '/admin/content/homepage' },
      { label: 'About', to: '/admin/content/about' },
      { label: 'FAQ', to: '/admin/content/faq' },
      { label: 'Policies', to: '/admin/content/policies' },
    ]
  },
  {
    items: [
      { label: 'Settings', to: '/admin/settings', icon: '⚙' },
      { label: 'Admin Activity Logs', to: '/admin/audit-logs', icon: '≡' },
    ]
  }
];

const NavGroupComponent: React.FC<{ group: NavGroup; setSidebarOpen: (o: boolean) => void }> = ({ group, setSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!group.label) {
    return (
      <div className="admin-nav-group" style={{ marginBottom: '8px' }}>
        {group.items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon && <span className="admin-nav-icon">{item.icon}</span>}
            <span className="admin-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-nav-group" style={{ marginBottom: '8px' }}>
      <button 
        className="admin-nav-item" 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {group.icon && <span className="admin-nav-icon">{group.icon}</span>}
          <span className="admin-nav-label" style={{ fontWeight: 600 }}>{group.label}</span>
        </div>
        <span style={{ fontSize: '0.7rem', opacity: 0.5, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2px', 
        overflow: 'hidden', 
        maxHeight: isOpen ? '500px' : '0px', 
        transition: 'max-height 0.3s ease-in-out'
      }}>
        <div style={{ paddingLeft: '36px', paddingTop: '4px', paddingBottom: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {group.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item sub-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              style={{ padding: '6px 12px', fontSize: '0.85rem', minHeight: 'auto', borderRadius: '6px' }}
            >
              {item.icon && <span className="admin-nav-icon" style={{ fontSize: '0.9rem', marginRight: '8px' }}>{item.icon}</span>}
              <span className="admin-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

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

        <nav className="admin-sidebar__nav" style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {adminSidebarGroups.map((group, idx) => (
            <NavGroupComponent key={idx} group={group} setSidebarOpen={setSidebarOpen} />
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ivory)', fontWeight: 500 }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{typeof user?.role === 'string' ? user.role : (user?.role as any)?.name}</p>
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
