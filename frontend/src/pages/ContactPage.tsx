import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../hooks/useStoreSettings';

const ContactPage: React.FC = () => {
  const { data: settings } = useStoreSettings();

  return (
    <>
      <Helmet><title>Contact Us ? {settings?.store_name || "BJ'S Natural Care"}</title></Helmet>
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="container" style={{ flex: 1, padding: '60px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="section-subtitle">{settings?.store_name || "BJ'S Natural Care"}</p>
          <h1 className="section-title">Contact Us</h1>
          <div className="section-divider" style={{ margin: '24px auto' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', textAlign: 'left', marginBottom: '40px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Email</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>{settings?.store_email || "support@bjsnaturalcare.com"}</p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Phone</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>{settings?.store_phone || "+91 98765 43210"}</p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Working Hours</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>{settings?.contact_hours || "Mon-Fri, 9AM to 6PM"}</p>
            </div>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'left', marginBottom: '40px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Address</h3>
            <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {settings?.store_address || "123 Natural Care Avenue\nBeauty District\nMumbai, Maharashtra 400001\nIndia"}
            </p>
          </div>

          <Link to="/shop" className="btn btn-outline-gold">Return to Shop</Link>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
