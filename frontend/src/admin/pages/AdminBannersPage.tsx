import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannersApi, adminApi } from '../../services/api';
import { Banner } from '../../types';
import toast from 'react-hot-toast';

const AdminBannersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '', subtitle: '', description: '', desktopImage: '', mobileImage: '', ctaText: '', ctaUrl: '', couponCode: '', badgeText: '', placement: 'HERO', priority: 0, isActive: true
  });
  const [editId, setEditId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminBanners'],
    queryFn: () => bannersApi.getAllAdmin()
  });

  const banners = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (newBanner: any) => bannersApi.create(newBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      toast.success('Banner created');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create banner')
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string, data: any }) => bannersApi.update(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      toast.success('Banner updated');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to update banner')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bannersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
      toast.success('Banner deleted');
    },
    onError: () => toast.error('Failed to delete banner')
  });

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditId(banner.id);
      setFormData(banner);
    } else {
      setEditId(null);
      setFormData({ title: '', subtitle: '', description: '', desktopImage: '', mobileImage: '', ctaText: '', ctaUrl: '', couponCode: '', badgeText: '', placement: 'HERO', priority: 0, isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'desktopImage' | 'mobileImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const { data } = await adminApi.uploadImage(form);
      setFormData(prev => ({ ...prev, [field]: data.data?.url || data.url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desktopImage) {
      return toast.error('Title and Desktop Image are required');
    }

    if (editId) {
      updateMutation.mutate({ id: editId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleActive = (banner: Banner) => {
    updateMutation.mutate({ id: banner.id, data: { isActive: !banner.isActive } });
  };

  if (isLoading) return <div className="admin-page"><div className="spinner"></div></div>;

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Banner & Poster Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Banner</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Details</th>
              <th>Placement</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No banners found.</td></tr>
            ) : (
              banners.map((b: Banner) => (
                <tr key={b.id}>
                  <td>
                    <img src={b.desktopImage} alt={b.title} style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '4px', background: '#333' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.subtitle}</div>
                  </td>
                  <td><span className="badge" style={{ background: '#333', color: '#fff' }}>{b.placement}</span></td>
                  <td>{b.priority}</td>
                  <td>
                    <button 
                      onClick={() => toggleActive(b)}
                      className={`badge ${b.isActive ? 'status-paid' : 'status-failed'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {b.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(b)}>Edit</button>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        if (window.confirm('Delete this banner?')) deleteMutation.mutate(b.id);
                      }} style={{ color: 'var(--color-error)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '24px' }}>
              {editId ? 'Edit Banner' : 'Create Banner'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" type="text" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Placement *</label>
                  <select className="form-select" value={formData.placement} onChange={e => setFormData({...formData, placement: e.target.value})}>
                    <option value="HERO">HERO (Homepage Top)</option>
                    <option value="PROMO">PROMO (Under Best Sellers)</option>
                    <option value="POPUP">POPUP (Modal Dialog)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority (Higher = First)</label>
                  <input className="form-input" type="number" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Desktop Image (URL or Upload) *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" type="text" value={formData.desktopImage} onChange={e => setFormData({...formData, desktopImage: e.target.value})} required />
                  <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, 'desktopImage')} disabled={uploading} />
                  </label>
                </div>
                {formData.desktopImage && <img src={formData.desktopImage} alt="Desktop Preview" style={{ marginTop: '8px', width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Image (Optional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" type="text" value={formData.mobileImage || ''} onChange={e => setFormData({...formData, mobileImage: e.target.value})} />
                  <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, 'mobileImage')} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">CTA Text (Button)</label>
                  <input className="form-input" type="text" value={formData.ctaText || ''} onChange={e => setFormData({...formData, ctaText: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA URL</label>
                  <input className="form-input" type="text" value={formData.ctaUrl || ''} onChange={e => setFormData({...formData, ctaUrl: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Coupon Code (Optional)</label>
                  <input className="form-input" type="text" value={formData.couponCode || ''} onChange={e => setFormData({...formData, couponCode: e.target.value})} placeholder="e.g. RAKHI30" />
                </div>
                <div className="form-group">
                  <label className="form-label">Badge Text (Optional)</label>
                  <input className="form-input" type="text" value={formData.badgeText || ''} onChange={e => setFormData({...formData, badgeText: e.target.value})} placeholder="e.g. LIMITED TIME" />
                </div>
              </div>

              <div className="form-group">
                <label className="shop-checkbox-label">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  Active
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                  {editId ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage;
