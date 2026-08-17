import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/api';
import toast from 'react-hot-toast';
import { Address } from '../types';

const AddressesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['my-addresses'], queryFn: () => userApi.getAddresses() });
  const addresses: Address[] = data?.data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    isDefault: false
  });

  const addMutation = useMutation({
    mutationFn: (newAddress: any) => userApi.addAddress(newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
      toast.success('Address added successfully');
      setIsModalOpen(false);
      setFormData({ label: 'Home', firstName: '', lastName: '', phone: '', line1: '', line2: '', city: '', state: '', country: 'India', pincode: '', isDefault: false });
    },
    onError: () => toast.error('Failed to add address')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
      toast.success('Address deleted');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  return (
    <>
      <Helmet><title>My Addresses - BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/account" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '1.2rem', transition: 'color 0.2s' }}>
                &larr;
              </Link>
              <h1 className="section-title" style={{ marginBottom: 0, fontSize: '2rem' }}>My Addresses</h1>
            </div>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              + Add New Address
            </button>
          </div>

          {isLoading ? (
            <div className="addresses-grid">
              {[1,2].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '8px' }} />)}
            </div>
          ) : addresses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📍</div>
              <h2 className="empty-state__title">No addresses saved</h2>
              <p className="empty-state__text">Add a shipping address to speed up checkout.</p>
            </div>
          ) : (
            <div className="addresses-grid">
              {addresses.map(addr => (
                <div key={addr.id} className="address-card">
                  <div className="address-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="address-label">{addr.label || 'Home'}</span>
                      {addr.isDefault && <span className="address-badge-default">Default</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {!addr.isDefault && (
                        <button className="btn-text-muted">Set Default</button>
                      )}
                      <button className="btn-icon" onClick={() => deleteMutation.mutate(addr.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="address-card-body">
                    <h3 className="address-name">{addr.firstName} {addr.lastName}</h3>
                    <p className="address-phone">{addr.phone}</p>
                    <p className="address-text">
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br/>
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '24px', color: 'var(--color-ivory)' }}>Add New Address</h2>
            
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Label (e.g. Home, Work)</label>
                  <input type="text" className="form-input" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address Line 1</label>
                <input type="text" className="form-input" required value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Address Line 2 (Optional)</label>
                <input type="text" className="form-input" value={formData.line2} onChange={e => setFormData({...formData, line2: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input type="text" className="form-input" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input type="text" className="form-input" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                    <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                    Set as default address
                  </label>
                </div>
              </div>
              
              <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={addMutation.isPending}>
                  {addMutation.isPending ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .address-card {
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px;
          padding: 24px;
          background: transparent;
          transition: border-color 0.2s;
        }
        .address-card:hover {
          border-color: var(--color-gold);
        }
        .address-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .address-label {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .address-badge-default {
          color: var(--color-gold);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .address-card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .address-name {
          font-family: var(--font-serif);
          color: var(--color-gold);
          font-size: 1.1rem;
          margin-bottom: 2px;
        }
        .address-phone {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          margin-bottom: 12px;
        }
        .address-text {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .btn-text-muted {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-text-muted:hover {
          color: var(--color-ivory);
        }
        .btn-icon {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .btn-icon:hover {
          color: var(--color-error);
        }
        .address-form .form-row {
          display: flex;
          gap: 16px;
        }
        .address-form .form-row > * {
          flex: 1;
        }
        @media (max-width: 768px) {
          .addresses-grid {
            grid-template-columns: 1fr;
          }
          .address-form .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </>
  );
};
export default AddressesPage;
