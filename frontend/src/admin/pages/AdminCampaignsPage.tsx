import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsApi, adminApi } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCampaignsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<any>({
    name: '', desktopBanner: '', mobileBanner: '', heading: '', subtitle: '', 
    description: '', ctaText: '', ctaUrl: '', discount: '', couponCode: '', 
    startDate: today, endDate: today, priority: 0, isActive: true
  });
  const [editId, setEditId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminCampaigns'],
    queryFn: () => campaignsApi.getAllAdmin()
  });

  const campaigns = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (newCampaign: any) => campaignsApi.create(newCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCampaigns'] });
      toast.success('Campaign created');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create campaign')
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string, data: any }) => campaignsApi.update(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCampaigns'] });
      toast.success('Campaign updated');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to update campaign')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => campaignsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCampaigns'] });
      toast.success('Campaign deleted');
    },
    onError: () => toast.error('Failed to delete campaign')
  });

  const handleOpenModal = (campaign?: any) => {
    if (campaign) {
      setEditId(campaign.id);
      setFormData({
        ...campaign,
        startDate: new Date(campaign.startDate).toISOString().split('T')[0],
        endDate: new Date(campaign.endDate).toISOString().split('T')[0]
      });
    } else {
      setEditId(null);
      setFormData({ 
        name: '', desktopBanner: '', mobileBanner: '', heading: '', subtitle: '', 
        description: '', ctaText: '', ctaUrl: '', discount: '', couponCode: '', 
        startDate: today, endDate: today, priority: 0, isActive: true 
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'desktopBanner' | 'mobileBanner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const { data } = await adminApi.uploadImage(form);
      setFormData(prev => ({ ...prev, [field]: data.data.url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      return toast.error('Name, Start Date, and End Date are required');
    }

    if (editId) {
      updateMutation.mutate({ id: editId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleActive = (campaign: any) => {
    updateMutation.mutate({ id: campaign.id, data: { isActive: !campaign.isActive } });
  };

  if (isLoading) return <div className="admin-page"><div className="spinner"></div></div>;

  return (
    <div className="admin-page">
      <Helmet><title>Campaigns | Admin | BJS Natural Care</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Campaign Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Campaign</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Date Range</th>
              <th>Discount / Coupon</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>No campaigns found.</td></tr>
            ) : (
              campaigns.map((c: any) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{c.heading || 'No heading'}</div>
                  </td>
                  <td>
                    {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                  </td>
                  <td>
                    {c.discount && <span className="status-badge" style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--color-gold)' }}>{c.discount}% OFF</span>}
                    {c.couponCode && <span className="status-badge" style={{ marginLeft: '8px' }}>Code: {c.couponCode}</span>}
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleActive(c)}
                      className={`badge ${c.isActive ? 'status-paid' : 'status-failed'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(c)}>Edit</button>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        if (window.confirm('Delete this campaign?')) deleteMutation.mutate(c.id);
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
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '24px' }}>
              {editId ? 'Edit Campaign' : 'Create Campaign'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Campaign Name (Internal) *</label>
                  <input className="form-input" type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority (Higher = Displayed First)</label>
                  <input className="form-input" type="number" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input className="form-input" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input className="form-input" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                </div>
              </div>

              <hr style={{ borderColor: 'var(--color-border)', margin: '24px 0' }} />

              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '16px' }}>Display Content</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Public Heading</label>
                  <input className="form-input" type="text" value={formData.heading || ''} onChange={e => setFormData({...formData, heading: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input className="form-input" type="text" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description Text</label>
                <textarea className="form-input" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">CTA Button Text</label>
                  <input className="form-input" type="text" placeholder="Shop Sale" value={formData.ctaText || ''} onChange={e => setFormData({...formData, ctaText: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA URL</label>
                  <input className="form-input" type="text" placeholder="/shop" value={formData.ctaUrl || ''} onChange={e => setFormData({...formData, ctaUrl: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Desktop Banner Image</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="form-input" type="text" value={formData.desktopBanner || ''} onChange={e => setFormData({...formData, desktopBanner: e.target.value})} />
                    <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Upload
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, 'desktopBanner')} disabled={uploading} />
                    </label>
                  </div>
                  {formData.desktopBanner && <img src={formData.desktopBanner} alt="Preview" style={{ marginTop: '8px', width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />}
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Banner Image</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="form-input" type="text" value={formData.mobileBanner || ''} onChange={e => setFormData({...formData, mobileBanner: e.target.value})} />
                    <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Upload
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, 'mobileBanner')} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--color-border)', margin: '24px 0' }} />

              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '16px' }}>Promotion Rules</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Discount Percentage (%)</label>
                  <input className="form-input" type="number" name="discount" min="0" max="100" value={formData.discount || ''} onChange={e => setFormData({...formData, discount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Linked Coupon Code (Optional)</label>
                  <input className="form-input" type="text" name="couponCode" value={formData.couponCode || ''} onChange={e => setFormData({...formData, couponCode: e.target.value})} />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="shop-checkbox-label" style={{ fontSize: '1rem' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                  Campaign is Active
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                  {editId ? 'Save Changes' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignsPage;
