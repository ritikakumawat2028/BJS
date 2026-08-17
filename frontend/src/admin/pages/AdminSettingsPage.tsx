import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { StoreSettings } from '../../types';
import toast from 'react-hot-toast';

const AdminSettingsPage: React.FC = () => {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('store');
  const [formData, setFormData] = useState<StoreSettings>({});

  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-store-settings'], 
    queryFn: () => adminApi.getSettings() 
  });

  useEffect(() => {
    if (data?.data?.data) {
      setFormData(data.data.data);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (settings: StoreSettings) => adminApi.updateSettings(settings as Record<string, string>),
    onSuccess: () => {
      toast.success('Settings updated successfully');
      qc.invalidateQueries({ queryKey: ['admin-store-settings'] });
      qc.invalidateQueries({ queryKey: ['store-settings'] }); // for public hook
    },
    onError: () => toast.error('Failed to update settings')
  });

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading settings...</div>;

  const tabs = [
    { id: 'store', label: 'Store Info' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'pages', label: 'Pages Content' },
    { id: 'policies', label: 'Policies' },
    { id: 'footer', label: 'Footer & Social' },
  ];

  return (
    <>
      <Helmet><title>CMS & Settings ? Admin | BJS Natural Care</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>Content Management (CMS)</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', background: 'var(--color-rich-black)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 24px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-gold)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--color-gold)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '32px' }}>
          {activeTab === 'store' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">Store Name</label>
                <input type="text" className="form-input" value={formData.store_name || ''} onChange={e => handleChange('store_name', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Store Tagline</label>
                <input type="text" className="form-input" value={formData.store_tagline || ''} onChange={e => handleChange('store_tagline', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label className="form-label">SEO Meta Title (Default)</label>
                  <input type="text" className="form-input" value={formData.meta_title || ''} onChange={e => handleChange('meta_title', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">SEO Meta Description</label>
                  <input type="text" className="form-input" value={formData.meta_description || ''} onChange={e => handleChange('meta_description', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label className="form-label">Homepage Hero Heading</label>
                  <input type="text" className="form-input" value={formData.hero_heading || ''} onChange={e => handleChange('hero_heading', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Homepage Hero Subheading</label>
                  <input type="text" className="form-input" value={formData.hero_subheading || ''} onChange={e => handleChange('hero_subheading', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label className="form-label">Announcement Text</label>
                  <input type="text" className="form-input" value={formData.announcement_text || ''} onChange={e => handleChange('announcement_text', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Announcement Link URL</label>
                  <input type="text" className="form-input" value={formData.announcement_link || ''} onChange={e => handleChange('announcement_link', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-input" value={formData.store_email || ''} onChange={e => handleChange('store_email', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Contact Phone</label>
                <input type="text" className="form-input" value={formData.store_phone || ''} onChange={e => handleChange('store_phone', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Physical Address</label>
                <textarea className="form-input" rows={3} value={formData.store_address || ''} onChange={e => handleChange('store_address', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Working Hours</label>
                <input type="text" className="form-input" placeholder="e.g. Mon-Fri, 9AM to 6PM" value={formData.contact_hours || ''} onChange={e => handleChange('contact_hours', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div style={{ display: 'grid', gap: '32px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>About Us Page Content</label>
                <textarea className="form-input" rows={12} placeholder="Write your About Us story here... (Supports multiple paragraphs)" value={formData.about_content || ''} onChange={e => handleChange('about_content', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>FAQ Page Content</label>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Use plain text, markdown, or clear paragraph formatting for your FAQs.</p>
                <textarea className="form-input" rows={12} value={formData.faq_content || ''} onChange={e => handleChange('faq_content', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div style={{ display: 'grid', gap: '32px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>Privacy Policy</label>
                <textarea className="form-input" rows={10} value={formData.privacy_policy || ''} onChange={e => handleChange('privacy_policy', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>Terms & Conditions</label>
                <textarea className="form-input" rows={10} value={formData.terms_conditions || ''} onChange={e => handleChange('terms_conditions', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>Shipping Policy</label>
                <textarea className="form-input" rows={10} value={formData.shipping_policy || ''} onChange={e => handleChange('shipping_policy', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>Return & Refund Policy</label>
                <textarea className="form-input" rows={10} value={formData.return_policy || ''} onChange={e => handleChange('return_policy', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">Footer Description (Short brand intro)</label>
                <textarea className="form-input" rows={4} value={formData.footer_desc || ''} onChange={e => handleChange('footer_desc', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label className="form-label">Instagram Link</label>
                  <input type="url" className="form-input" placeholder="https://instagram.com/..." value={formData.instagram || ''} onChange={e => handleChange('instagram', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Facebook Link</label>
                  <input type="url" className="form-input" placeholder="https://facebook.com/..." value={formData.facebook || ''} onChange={e => handleChange('facebook', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">YouTube Link</label>
                  <input type="url" className="form-input" placeholder="https://youtube.com/..." value={formData.youtube || ''} onChange={e => handleChange('youtube', e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;
