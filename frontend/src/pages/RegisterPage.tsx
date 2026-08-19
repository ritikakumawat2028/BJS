import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      setRegisteredEmail(form.email);
      setStep(2);
      toast.success('Account created! Please enter the OTP sent to your email.');
    } catch (err: any) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const serverErrors: Record<string, string> = {};
        err.response.data.errors.forEach((e: any) => {
          const field = e.field.replace('body.', '');
          serverErrors[field] = e.message;
        });
        setErrors(serverErrors);
        toast.error('Please fix the errors in the form.');
      } else {
        toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error('OTP must be 6 digits');
    setLoading(true);
    try {
      const { authApi } = await import('../services/api');
      await authApi.verifyEmail(registeredEmail, otp);
      toast.success('Email verified successfully!');
      navigate('/account');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const { authApi } = await import('../services/api');
      await authApi.resendOtp(registeredEmail);
      toast.success('A new OTP has been sent to your email.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <>
      <Helmet><title>Create Account | BJ'S Natural Care</title></Helmet>
      <div className="auth-page">
        <div className="auth-card animate-fade-up">
          <div className="auth-header">
            <Link to="/" className="auth-logo">BJ'S NATURAL CARE</Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the BJ'S Natural Care community</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" name="firstName" className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="First name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                  {errors.firstName && <p className="form-error">{errors.firstName}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" name="lastName" className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Last name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                  {errors.lastName && <p className="form-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="Enter your email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <input type="tel" name="phone" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Repeat your password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`} disabled={loading}>
                {!loading && 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <p style={{color:'var(--color-text-muted)', marginBottom:'1rem', textAlign:'center'}}>
                We sent a 6-digit OTP to <strong>{registeredEmail}</strong>.
              </p>
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <input type="text" maxLength={6} className="form-input" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} style={{letterSpacing:'0.2em', textAlign:'center', fontSize:'1.5rem'}} />
              </div>
              <button type="submit" className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`} disabled={loading}>
                {!loading && 'Verify Account'}
              </button>
              <button type="button" onClick={handleResendOtp} className="btn" style={{background:'transparent', color:'var(--color-gold)', width:'100%', marginTop:'8px'}}>
                Resend OTP
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" style={{ color: 'var(--color-gold)' }}>Sign in</Link></p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; background: var(--color-black); display: flex; align-items: center; justify-content: center; padding: var(--space-6); background-image: radial-gradient(ellipse at 20% 50%, rgba(201,162,39,0.04) 0%, transparent 60%); }
        .auth-card { width: 100%; max-width: 520px; background: var(--color-charcoal); border: 1px solid var(--color-border-gold); border-radius: var(--radius-lg); padding: var(--space-10) var(--space-8); }
        .auth-header { text-align: center; margin-bottom: var(--space-8); }
        .auth-logo { display: inline-block; font-family: var(--font-serif); font-size: 0.9rem; letter-spacing: 0.25em; color: var(--color-gold); margin-bottom: var(--space-5); }
        .auth-title { font-family: var(--font-serif); font-size: 2rem; color: var(--color-ivory); margin-bottom: var(--space-2); }
        .auth-subtitle { font-size: 0.875rem; color: var(--color-text-muted); }
        .auth-form { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6); }
        .auth-footer { text-align: center; font-size: 0.875rem; color: var(--color-text-muted); }
        @media (max-width: 480px) { .auth-card { padding: var(--space-6); } }
      `}</style>
    </>
  );
};

export default RegisterPage;
