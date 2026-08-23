import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2) e.firstName = 'First name must be at least 2 characters';
    if (!form.lastName.trim() || form.lastName.trim().length < 2) e.lastName = 'Last name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(form.password)) {
      e.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(form.password)) {
      e.password = 'Password must contain at least one number';
    } else if (!/[\W_]/.test(form.password)) {
      e.password = 'Password must contain at least one special character (e.g. @, #, !)';
    }
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { authApi } = await import('../services/api');
      const res = await authApi.sendRegisterOtp(form.email);
      setRegisteredEmail(form.email);
      setStep(2);
      if (res.data.devOtp) {
        toast.success(`OTP Sent! (Dev mode OTP: ${res.data.devOtp})`, { duration: 10000 });
      } else {
        toast.success('OTP sent to your email.');
      }
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
        toast.error(err.response?.data?.message || 'Failed to send OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error('OTP must be 6 digits');
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password, otp });
      toast.success('Account created successfully!');
      navigate('/account');
    } catch (err: any) {
      // Show specific field validation errors if present
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const firstError = err.response.data.errors[0];
        toast.error(firstError?.message || 'Validation failed. Please check your details.');
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const { authApi } = await import('../services/api');
      const res = await authApi.sendRegisterOtp(registeredEmail);
      if (res.data.devOtp) {
        toast.success(`A new OTP has been sent! (Dev mode OTP: ${res.data.devOtp})`, { duration: 10000 });
      } else {
        toast.success('A new OTP has been sent to your email.');
      }
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
            <form onSubmit={handleSendOtp} className="auth-form">
              <div className="register-name-grid">
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
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ paddingRight: '40px' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Repeat your password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} style={{ paddingRight: '40px' }} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`} disabled={loading}>
                {!loading && 'Verify Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <p style={{color:'var(--color-text-muted)', marginBottom:'1rem', textAlign:'center'}}>
                We sent a 6-digit OTP to <strong>{registeredEmail}</strong>.
              </p>
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <input type="text" maxLength={6} className="form-input" placeholder="------" value={otp} onChange={e => setOtp(e.target.value)} style={{letterSpacing:'0.2em', textAlign:'center', fontSize:'1.5rem'}} />
              </div>
              <button type="submit" className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`} disabled={loading}>
                {!loading && 'Create Account'}
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
        .register-name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 480px) { 
          .auth-card { padding: var(--space-6); } 
          .register-name-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default RegisterPage;
