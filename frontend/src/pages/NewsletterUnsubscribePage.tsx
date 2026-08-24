import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { newsletterApi } from '../services/api';
import { MailMinus, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const NewsletterUnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'confirm' | 'loading' | 'success' | 'error'>('confirm');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('Invalid unsubscribe link.');
    }
  }, [email]);

  const handleUnsubscribe = async () => {
    if (!email) return;
    
    setStatus('loading');
    try {
      const res = await newsletterApi.unsubscribe(email);
      setStatus('success');
      setMessage(res.message || 'You have been successfully unsubscribed.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Unsubscribe failed. Please try again or contact support.');
    }
  };

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <Helmet><title>Unsubscribe | BJ'S Natural Care</title></Helmet>
      
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        {status === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <MailMinus size={64} style={{ color: 'var(--color-gold)' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-ivory)' }}>Unsubscribe from Newsletter</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Are you sure you want to unsubscribe <strong>{email}</strong> from the BJ'S Natural Care newsletter? 
              You will no longer receive exclusive offers and beauty tips.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <Link to="/" className="btn btn-primary">No, keep me subscribed</Link>
              <button onClick={handleUnsubscribe} className="btn btn-outline" style={{ color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)' }}>Yes, unsubscribe me</button>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Loader2 size={48} className="spin" style={{ color: 'var(--color-gold)' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Processing...</h2>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <CheckCircle size={64} style={{ color: '#2ed573' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-ivory)' }}>Unsubscribed</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{message}</p>
            <Link to="/" className="btn btn-outline" style={{ marginTop: '16px' }}>Return to Store</Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <XCircle size={64} style={{ color: '#ff4757' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-ivory)' }}>Something went wrong</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{message}</p>
            <Link to="/" className="btn btn-outline" style={{ marginTop: '16px' }}>Return to Store</Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default NewsletterUnsubscribePage;
