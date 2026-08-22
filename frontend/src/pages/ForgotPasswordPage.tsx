import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password — BJ'S Natural Care</title>
      </Helmet>

      <div className="auth-page">
        <div className="auth-card animate-fade-up">
          <div className="auth-header">
            <Link to="/" className="auth-logo">BJ'S NATURAL CARE</Link>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">
              {submitted
                ? "Check your email for the reset link"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  id="forgot-email"
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  autoFocus
                />
                {error && <p className="form-error">{error}</p>}
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {!loading && 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="fp-success">
              <div className="fp-success-icon">✉</div>
              <p className="fp-success-text">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox (and spam folder).
              </p>
              <button
                className="btn btn-outline-gold btn-full"
                onClick={() => { setSubmitted(false); setEmail(''); }}
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="auth-footer" style={{ marginTop: '24px' }}>
            <p>
              Remembered your password?{' '}
              <Link to="/login" style={{ color: 'var(--color-gold)' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: var(--color-black);
          display: flex; align-items: center; justify-content: center;
          padding: var(--space-6);
          background-image: radial-gradient(ellipse at 20% 50%, rgba(201,162,39,0.04) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, rgba(201,162,39,0.02) 0%, transparent 50%);
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--color-charcoal);
          border: 1px solid var(--color-border-gold);
          border-radius: var(--radius-lg);
          padding: var(--space-10) var(--space-8);
        }
        .auth-header { text-align: center; margin-bottom: var(--space-8); }
        .auth-logo {
          display: inline-block;
          font-family: var(--font-serif);
          font-size: 0.9rem;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          margin-bottom: var(--space-5);
        }
        .auth-title { font-family: var(--font-serif); font-size: 2rem; color: var(--color-ivory); margin-bottom: var(--space-2); }
        .auth-subtitle { font-size: 0.875rem; color: var(--color-text-muted); }
        .auth-form { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6); }
        .auth-footer { text-align: center; font-size: 0.875rem; color: var(--color-text-muted); }
        .fp-success { text-align: center; padding: var(--space-4) 0; }
        .fp-success-icon {
          font-size: 3rem;
          margin-bottom: var(--space-4);
          display: block;
          color: var(--color-gold);
        }
        .fp-success-text {
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-6);
          font-size: 0.95rem;
        }
        .fp-success-text strong { color: var(--color-ivory); }
      `}</style>
    </>
  );
};

export default ForgotPasswordPage;
