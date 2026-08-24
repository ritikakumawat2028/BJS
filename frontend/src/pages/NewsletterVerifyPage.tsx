import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { newsletterApi } from '../services/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const NewsletterVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await newsletterApi.verify(token, email);
        setStatus('success');
        setMessage(res.message || 'Successfully verified your subscription!');
        setTimeout(() => navigate('/'), 5000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token, email, navigate]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <Helmet><title>Verify Subscription | BJ'S Natural Care</title></Helmet>
      
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Loader2 size={48} className="spin" style={{ color: 'var(--color-gold)' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Verifying Subscription...</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <CheckCircle size={64} style={{ color: '#2ed573' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-ivory)' }}>Subscription Confirmed!</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{message}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Redirecting to homepage...</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Return to Store</Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <XCircle size={64} style={{ color: '#ff4757' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-ivory)' }}>Verification Failed</h2>
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

export default NewsletterVerifyPage;
