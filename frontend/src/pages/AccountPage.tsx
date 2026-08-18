import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AccountPage: React.FC = () => {
  const { user, logout, updateUser } = useAuthStore();
  const cartCount = useCartStore(state => state.itemCount());
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authApi.updateMe(formData);
      updateUser(formData);
      toast.success('Profile updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>My Account - BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <div className="account-header-box">
            <div className="account-user-info">
              <div className="account-avatar">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="account-name">Hello, {user?.firstName} {user?.lastName}</h1>
                <p className="account-email">{user?.email}</p>
                <button className="btn-edit-profile" onClick={() => setIsEditModalOpen(true)}>
                  Edit Profile
                </button>
              </div>
            </div>
            <button className="btn-sign-out" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>

          <div className="account-grid">
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="account-card" style={{ borderColor: 'var(--color-gold)' }}>
                <div className="account-card-icon" style={{ color: 'var(--color-gold)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="account-card-title">Admin Dashboard</h3>
                <p className="account-card-desc">Manage store, products & orders</p>
              </Link>
            )}

            <Link to="/account/orders" className="account-card">
              <div className="account-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h3 className="account-card-title">My Orders</h3>
              <p className="account-card-desc">View and track your orders</p>
            </Link>

            <Link to="/wishlist" className="account-card">
              <div className="account-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="account-card-title">Wishlist</h3>
              <p className="account-card-desc">Products you've saved</p>
            </Link>

            <Link to="/account/addresses" className="account-card">
              <div className="account-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="account-card-title">Addresses</h3>
              <p className="account-card-desc">Manage shipping addresses</p>
            </Link>

            <Link to="/cart" className="account-card account-card--cart">
              <div className="account-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h3 className="account-card-title">Shopping Cart</h3>
              <p className="account-card-desc">{cartCount} items in your cart</p>
              {cartCount > 0 && <span className="account-cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '24px', color: 'var(--color-ivory)' }}>Edit Profile</h2>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Optional" />
              </div>
              
              <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .account-header-box {
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .account-user-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .account-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          color: var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
        }
        .account-name {
          font-family: var(--font-serif);
          font-size: 1.7rem;
          color: var(--color-ivory);
          margin-bottom: 4px;
        }
        .account-email {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .btn-edit-profile {
          color: var(--color-gold);
          font-size: 0.85rem;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .btn-edit-profile:hover {
          color: var(--color-soft-gold);
        }
        .btn-sign-out {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .btn-sign-out:hover {
          color: var(--color-error);
        }
        .account-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .account-card {
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.3s ease;
          background: transparent;
          text-decoration: none;
          position: relative;
        }
        .account-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-4px);
        }
        .account-card-icon {
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }
        .account-card-title {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--color-gold);
          margin-bottom: 8px;
        }
        .account-card-desc {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .account-cart-badge {
          position: absolute;
          bottom: 24px;
          right: 24px;
          background-color: var(--color-gold);
          color: var(--color-black);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }
        @media (max-width: 1024px) {
          .account-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .account-header-box {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          .account-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};
export default AccountPage;
