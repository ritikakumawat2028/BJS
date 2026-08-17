import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Banner } from '../../types';
import toast from 'react-hot-toast';

const AdminBannersPage: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    desktopImage: '',
    mobileImage: '',
    ctaText: '',
    ctaUrl: '',
    couponCode: '',
    badgeText: '',
    placement: 'HERO',
    priority: '' as string | number,
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-banners'], 
    queryFn: () => adminApi.getBanners() 
  });

  const banners: Banner[] = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createBanner(data),
    onSuccess: () => { 
      toast.success('Banner created successfully'); 
      qc.invalidateQueries({ queryKey: ['admin-banners'] }); 
      setShowForm(false); 
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create banner'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: any }) => adminApi.updateBanner(data.id, data.payload),
    onSuccess: () => { 
      toast.success('Banner updated successfully'); 
      qc.invalidateQueries({ queryKey: ['admin-banners'] }); 
      setShowForm(false); 
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update banner'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBanner(id),
    onSuccess: () => { 
      toast.success('Banner deleted'); 
      qc.invalidateQueries({ queryKey: ['admin-banners'] }); 
      setDeleteId(null); 
    },
    onError: () => toast.error('Failed to delete banner'),
  });

  const openForm = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        desktopImage: banner.desktopImage,
        mobileImage: banner.mobileImage || '',
        ctaText: banner.ctaText || '',
        ctaUrl: banner.ctaUrl || '',
        couponCode: banner.couponCode || '',
        badgeText: banner.badgeText || '',
        placement: banner.placement,
        priority: banner.priority,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
        endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
        isActive: banner.isActive,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        desktopImage: '',
        mobileImage: '',
        ctaText: '',
        ctaUrl: '',
        couponCode: '',
        badgeText: '',
        placement: 'HERO',
        priority: '',
        startDate: '',
        endDate: '',
        isActive: true,
      });
    }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      priority: Number(formData.priority),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    };
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <>
      <Helmet><title>Banners | Admin | BJS Natural Care</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Banners</h1>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Add Banner</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Placement</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: '20px' }} /></td></tr>)
              : banners.map((b) => (
              <tr key={b.id}>
                <td>
                  <img src={b.desktopImage} alt={b.title} style={{ width: '80px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#1A1A1A' }} />
                </td>
                <td style={{ fontSize: '0.9rem' }}>{b.title}</td>
                <td style={{ fontSize: '0.875rem' }}>{b.placement}</td>
                <td>{b.priority}</td>
                <td><span className={`status-badge ${b.isActive ? 'active' : ''}`}>{b.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openForm(b)}>Edit</button>
                    <button className="btn btn-sm" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)', background: 'transparent', border: '1px solid' }} onClick={() => setDeleteId(b.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {banners.length === 0 && !isLoading && (
        <div className="empty-state">
          <p className="empty-state__title">No banners found</p>
          <p className="empty-state__text">Add your first banner to display on the store.</p>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-ivory)', marginBottom: '24px' }}>
              {editingBanner ? 'Edit Banner' : 'Create Banner'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Title *</label>
                  <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Subtitle</label>
                  <input type="text" className="form-input" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="form-label">Description (Optional)</label>
                <textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2}></textarea>
              </div>

              <div>
                <label className="form-label">Desktop Image URL *</label>
                <input type="url" className="form-input" required value={formData.desktopImage} onChange={e => setFormData({...formData, desktopImage: e.target.value})} />
              </div>

              <div>
                <label className="form-label">Mobile Image URL</label>
                <input type="url" className="form-input" value={formData.mobileImage} onChange={e => setFormData({...formData, mobileImage: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">CTA Text</label>
                  <input type="text" className="form-input" value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">CTA URL</label>
                  <input type="text" className="form-input" value={formData.ctaUrl} onChange={e => setFormData({...formData, ctaUrl: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Coupon Code (Promo Banners)</label>
                  <input type="text" className="form-input" value={formData.couponCode} onChange={e => setFormData({...formData, couponCode: e.target.value})} placeholder="e.g. SUMMER25" />
                </div>
                <div>
                  <label className="form-label">Badge Text (Promo Banners)</label>
                  <input type="text" className="form-input" value={formData.badgeText} onChange={e => setFormData({...formData, badgeText: e.target.value})} placeholder="e.g. LIMITED TIME" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Start Date (Optional)</label>
                  <input type="datetime-local" className="form-input" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">End Date (Optional)</label>
                  <input type="datetime-local" className="form-input" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Placement</label>
                  <select className="form-select" value={formData.placement} onChange={e => setFormData({...formData, placement: e.target.value})}>
                    <option value="HERO">Homepage hero</option>
                    <option value="FESTIVAL">Festival poster</option>
                    <option value="PROMO">Promotional banner</option>
                    <option value="PRODUCT_CAMPAIGN">Product campaign</option>
                    <option value="POPUP">Popup banner</option>
                    <option value="MOBILE">Mobile banner</option>
                    <option value="DESKTOP">Desktop banner</option>
                    <option value="SECTION">Section</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Priority</label>
                  <input type="number" className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '28px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-ivory)' }}>
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                    Active
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingBanner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-ivory)', marginBottom: '16px' }}>Confirm Delete</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Are you sure you want to delete this banner? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn" style={{ background: 'var(--color-error)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => deleteMutation.mutate(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBannersPage;

