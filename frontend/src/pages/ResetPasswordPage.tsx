import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset token.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSubmitted(true);
      toast.success('Password has been reset successfully!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password — BJ'S Natural Care</title>
      </Helmet>

      <div className="auth-page">
        <div className="auth-card animate-fade-up">
          <div className="auth-header">
            <Link to="/" className="auth-logo">BJ'S NATURAL CARE</Link>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              {submitted
                ? "Your password has been successfully reset."
                : "Please enter your new password below."}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="auth-form">
              {(!token && error) ? (
                <div className="fp-success">
                  <p className="form-error" style={{ fontSize: '1rem', marginBottom: '24px' }}>{error}</p>
                  <Link to="/forgot-password" className="btn btn-outline-gold btn-full">
                    Request New Link
                  </Link>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className={`form-input ${error && password.length > 0 && password.length < 6 ? 'error' : ''}`}
                      placeholder="Enter new password (min 6 characters)"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className={`form-input ${error && password !== confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    />
                    {error && <p className="form-error">{error}</p>}
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`}
                    disabled={loading}
                    style={{ marginTop: '16px' }}
                  >
                    {!loading && 'Reset Password'}
                  </button>
                </>
              )}
            </form>
          ) : (
            <div className="fp-success">
              <div className="fp-success-icon">✓</div>
              <p className="fp-success-text">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link to="/login" className="btn btn-primary btn-full">
                Return to Login
              </Link>
            </div>
          )}
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
      `}</style>
    </>
  );
};

export default ResetPasswordPage;
