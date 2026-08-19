import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const TrackOrderPage: React.FC = () => {
  const { data: settings } = useStoreSettings();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      toast.error('Please enter an order number');
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would be a public endpoint to check order status
      // For now, we'll redirect to the account orders page where they can see it if logged in
      toast.success('Searching for order...');
      setTimeout(() => {
        navigate(`/account/orders/${orderId}`);
      }, 1000);
    } catch (error) {
      toast.error('Could not find order. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Track Order — {settings?.store_name || "BJ'S Natural Care"}</title></Helmet>
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="container" style={{ flex: 1, padding: '60px 24px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="section-subtitle">{settings?.store_name || "BJ'S Natural Care"}</p>
            <h1 className="section-title">Track Your Order</h1>
            <div className="section-divider" style={{ margin: '24px auto' }} />
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              Enter your order number and email address below to track the current status of your shipment.
            </p>
          </div>

          <div className="card" style={{ padding: '40px' }}>
            <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Order Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)} 
                  placeholder="e.g., ord_123456789" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email used for the order" 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isLoading}
                style={{ marginTop: '10px', padding: '16px', fontSize: '1rem' }}
              >
                {isLoading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Need help with your order?</p>
            <Link to="/contact" className="btn btn-outline-gold">Contact Support</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrderPage;
