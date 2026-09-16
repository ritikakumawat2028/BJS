import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';
import { userApi } from '../../services/api';

const AdminProfilePage: React.FC = () => {
  const { user, fetchMe } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Email form
  const [email, setEmail] = useState(user?.email || '');
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await userApi.updateProfile({ email });
      await fetchMe();
      toast.success('Email updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await userApi.updatePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile-page">
      <Helmet><title>Admin Profile — BJ'S Natural Care</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>My Profile</h1>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Update Email</h3>
          <form onSubmit={handleUpdateEmail}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <h3>Change Password</h3>
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .profile-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .profile-card h3 {
          margin-top: 0;
          margin-bottom: 24px;
          color: var(--color-ivory);
          font-size: 1.25rem;
          font-family: var(--font-serif);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }
        .btn-primary {
          background: var(--color-gold);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-primary:hover {
          opacity: 0.9;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdminProfilePage;
