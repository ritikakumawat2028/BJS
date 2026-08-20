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
    { id: 'store', label: 'Store' },
    { id: 'payments', label: 'Payments' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'tax', label: 'Tax' },
    { id: 'email', label: 'Email' },
    { id: 'social', label: 'Social' },
    { id: 'seo', label: 'SEO' },
    { id: 'pages', label: 'Pages' },
    { id: 'trust', label: 'Trust Elements' },
    { id: 'policies', label: 'Policies' },
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
                <label className="form-label">Store Logo URL</label>
                <input type="url" className="form-input" placeholder="https://res.cloudinary.com/.../logo.png" value={formData.store_logo || ''} onChange={e => handleChange('store_logo', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Store Tagline</label>
                <input type="text" className="form-input" value={formData.store_tagline || ''} onChange={e => handleChange('store_tagline', e.target.value)} />
              </div>
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
              <div className="admin-settings-grid">
                <div>
                  <label className="form-label">Homepage Hero Heading</label>
                  <input type="text" className="form-input" value={formData.hero_heading || ''} onChange={e => handleChange('hero_heading', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Homepage Hero Subheading</label>
                  <input type="text" className="form-input" value={formData.hero_subheading || ''} onChange={e => handleChange('hero_subheading', e.target.value)} />
                </div>
              </div>
              <div className="admin-settings-grid">
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

          {activeTab === 'payments' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">COD Enabled</label>
                <select className="form-input" value={formData.cod_enabled || 'false'} onChange={e => handleChange('cod_enabled', e.target.value)}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="form-label">Razorpay Key ID</label>
                <input type="text" className="form-input" value={formData.razorpay_key_id || ''} onChange={e => handleChange('razorpay_key_id', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Razorpay Key Secret</label>
                <input type="password" placeholder={formData.razorpay_key_secret === '********' ? '********' : 'Enter Secret...'} className="form-input" value={formData.razorpay_key_secret || ''} onChange={e => handleChange('razorpay_key_secret', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Razorpay Webhook Secret</label>
                <input type="password" placeholder={formData.razorpay_webhook_secret === '********' ? '********' : 'Enter Webhook Secret...'} className="form-input" value={formData.razorpay_webhook_secret || ''} onChange={e => handleChange('razorpay_webhook_secret', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">Default Shipping Charge (₹)</label>
                <input type="number" className="form-input" value={formData.default_shipping_charge || '0'} onChange={e => handleChange('default_shipping_charge', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Free Shipping Threshold (₹)</label>
                <input type="number" className="form-input" value={formData.free_shipping_threshold || '500'} onChange={e => handleChange('free_shipping_threshold', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">Default Tax Rate (%)</label>
                <input type="number" className="form-input" value={formData.tax_rate || '18'} onChange={e => handleChange('tax_rate', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">SMTP Host</label>
                <input type="text" className="form-input" placeholder="smtp.gmail.com" value={formData.email_host || ''} onChange={e => handleChange('email_host', e.target.value)} />
              </div>
              <div>
                <label className="form-label">SMTP Port</label>
                <input type="text" className="form-input" placeholder="587" value={formData.email_port || ''} onChange={e => handleChange('email_port', e.target.value)} />
              </div>
              <div>
                <label className="form-label">SMTP User (Email Address)</label>
                <input type="text" className="form-input" value={formData.email_user || ''} onChange={e => handleChange('email_user', e.target.value)} />
              </div>
              <div>
                <label className="form-label">SMTP Password</label>
                <input type="password" placeholder={formData.email_pass === '********' ? '********' : 'Enter Password...'} className="form-input" value={formData.email_pass || ''} onChange={e => handleChange('email_pass', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Sender Email (From)</label>
                <input type="text" className="form-input" placeholder="BJ's Natural Care <jay250576@gmail.com>" value={formData.email_from || ''} onChange={e => handleChange('email_from', e.target.value)} />
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

          {activeTab === 'trust' && (
            <div style={{ display: 'grid', gap: '32px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '8px' }}>Secure Payments</label>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Example: "We use industry-standard encryption for all transactions."</p>
                <input type="text" className="form-input" value={formData.trust_secure_payments || ''} onChange={e => handleChange('trust_secure_payments', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '8px' }}>Quality Products</label>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Example: "Every product is thoughtfully formulated and carefully inspected."</p>
                <input type="text" className="form-input" value={formData.trust_quality_products || ''} onChange={e => handleChange('trust_quality_products', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '8px' }}>Easy Returns</label>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Example: "Hassle-free returns within our standard policy window."</p>
                <input type="text" className="form-input" value={formData.trust_easy_returns || ''} onChange={e => handleChange('trust_easy_returns', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '8px' }}>Customer Support</label>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Example: "Reach out to our team anytime for assistance with your order."</p>
                <input type="text" className="form-input" value={formData.trust_customer_support || ''} onChange={e => handleChange('trust_customer_support', e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                <label className="form-label" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '8px' }}>Fast Delivery</label>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Example: "Orders are typically dispatched within 24-48 hours."</p>
                <input type="text" className="form-input" value={formData.trust_fast_delivery || ''} onChange={e => handleChange('trust_fast_delivery', e.target.value)} />
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

          {activeTab === 'social' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">Footer Description (Short brand intro)</label>
                <textarea className="form-input" rows={4} value={formData.footer_desc || ''} onChange={e => handleChange('footer_desc', e.target.value)} />
              </div>
              <div className="admin-settings-grid">
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
                <div>
                  <label className="form-label">Other Link</label>
                  <input type="url" className="form-input" placeholder="https://..." value={formData.other_links || ''} onChange={e => handleChange('other_links', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label className="form-label">SEO Meta Title (Default)</label>
                <input type="text" className="form-input" value={formData.meta_title || ''} onChange={e => handleChange('meta_title', e.target.value)} />
              </div>
              <div>
                <label className="form-label">SEO Meta Description</label>
                <textarea className="form-input" rows={3} value={formData.meta_description || ''} onChange={e => handleChange('meta_description', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Enable Sitemap Generator</label>
                <select className="form-input" value={formData.sitemap_enabled || 'false'} onChange={e => handleChange('sitemap_enabled', e.target.value)}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 768px) {
          .admin-settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default AdminSettingsPage;
