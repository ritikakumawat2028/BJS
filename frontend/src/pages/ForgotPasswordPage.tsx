import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet><title>Forgot Password ? BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="container" style={{ flex: 1, padding: '60px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="section-subtitle">BJ'S Natural Care</p>
          <h1 className="section-title">Forgot Password</h1>
          <div className="section-divider" style={{ margin: '24px auto' }} />
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '32px' }}>
            This page content will be dynamically loaded from the CMS or configured via Store Settings in the admin panel.
          </p>
          <Link to="/shop" className="btn btn-outline-gold">Return to Shop</Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
