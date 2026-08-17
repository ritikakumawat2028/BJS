import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, Navigate } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { orderId?: string; orderNumber?: string };

  if (!state?.orderNumber) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet><title>Order Confirmed ??? BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(67, 160, 71, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--color-success)', fontSize: '2rem' }}>
            ???
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-ivory)', marginBottom: '16px' }}>Order Confirmed</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', marginBottom: '8px' }}>
            Thank you for shopping with BJ'S Natural Care.
          </p>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
            Your order number is <strong style={{ color: 'var(--color-gold)' }}>{state.orderNumber}</strong>. We've sent a confirmation email with your order details.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to={`/account/orders/${state.orderId}`} className="btn btn-primary">View Order Details</Link>
            <Link to="/shop" className="btn btn-outline-gold">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderSuccessPage;
