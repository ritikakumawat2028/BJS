import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Mail, CheckCircle, XCircle, Search, Calendar } from 'lucide-react';

const AdminNewsletterPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscribers', page, search, status],
    queryFn: () => adminApi.getNewsletterSubscribers({ page, limit: 20, search, status }),
    keepPreviousData: true
  });

  const stats = data?.stats || { total: 0, active: 0, unsubscribed: 0, verified: 0 };
  const subscribers = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  return (
    <div className="admin-page">
      <Helmet><title>Newsletter Subscribers | Admin</title></Helmet>
      
      <div className="admin-page__header">
        <h1 className="admin-page__title">Newsletter Subscribers</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(201, 162, 39, 0.1)', color: 'var(--color-gold)' }}>
            <Mail size={24} />
          </div>
          <div className="admin-stat-content">
            <h3>Total Subscribers</h3>
            <p className="admin-stat-value">{stats.total}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(46, 213, 115, 0.1)', color: '#2ed573' }}>
            <CheckCircle size={24} />
          </div>
          <div className="admin-stat-content">
            <h3>Verified & Active</h3>
            <p className="admin-stat-value">{stats.active}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757' }}>
            <XCircle size={24} />
          </div>
          <div className="admin-stat-content">
            <h3>Unsubscribed</h3>
            <p className="admin-stat-value">{stats.unsubscribed}</p>
          </div>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by email..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="admin-filter-group">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        {isLoading ? (
          <div className="admin-loading">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="admin-empty">No subscribers found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Subscribed At</th>
                <th>Unsubscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub: any) => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{sub.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Source: {sub.source}</div>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${sub.status === 'active' ? 'success' : sub.status === 'pending' ? 'warning' : 'danger'}`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {sub.isVerified ? (
                      <span style={{ color: '#2ed573', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Yes</span>
                    ) : (
                      <span style={{ color: '#ffa502', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Pending</span>
                    )}
                  </td>
                  <td>{new Date(sub.subscribedAt).toLocaleString()}</td>
                  <td>{sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="admin-pagination">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="admin-btn admin-btn--outline"
          >
            Previous
          </button>
          <span>Page {page} of {pagination.pages}</span>
          <button 
            disabled={page === pagination.pages} 
            onClick={() => setPage(p => p + 1)}
            className="admin-btn admin-btn--outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterPage;
