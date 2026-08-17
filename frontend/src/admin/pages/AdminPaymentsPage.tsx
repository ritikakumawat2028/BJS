import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';

const AdminPaymentsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-payments', page, search, status], 
    queryFn: () => adminApi.getPayments({ page, limit: 20, search, status }) 
  });
  
  const payments = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const statusOptions = ['PAID', 'PENDING', 'FAILED', 'REFUNDED'];

  return (
    <>
      <Helmet><title>Payments — Admin | BJS</title></Helmet>
      <h1 className="admin-page-title">Payment Transactions</h1>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search by Txn ID, Order #, or Email..." 
          style={{ flex: 1, maxWidth: '360px' }} 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select 
          className="form-select" 
          style={{ width: '200px' }} 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Order #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Payment Status</th>
              <th>Refund Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={8}><div className="skeleton" style={{ height: '20px' }} /></td></tr>
              ))
            ) : payments.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>No payment transactions found.</td></tr>
            ) : (
              payments.map((p: any) => {
                const txnId = p.razorpayPaymentId || p.razorpayOrderId || p.id;
                const isRefunded = p.order?.paymentStatus === 'REFUNDED';
                
                return (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-gold)' }}>
                      {txnId}
                    </td>
                    <td>
                      <Link to={`/admin/orders/${p.orderId}`} style={{ textDecoration: 'underline' }}>
                        {p.order?.orderNumber}
                      </Link>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>
                      {p.order?.user?.firstName} {p.order?.user?.lastName}
                      <br/>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{p.order?.user?.email}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '0.875rem' }}>{p.method}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {new Date(p.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td>
                      <span className={'status-badge ' + (isRefunded ? 'status-refunded' : `status-${p.status.toLowerCase()}`)}>
                        {isRefunded ? 'REFUNDED' : p.status}
                      </span>
                    </td>
                    <td>
                      {p.order?.refund ? (
                        <span className={`status-badge status-${p.order.refund.status.toLowerCase()}`}>
                          {p.order.refund.status} (₹{p.order.refund.amount})
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination" style={{marginTop:'24px'}}>
          <button className="page-btn" disabled={page===1} onClick={() => setPage(p => p-1)}>←</button>
          <span style={{color:'var(--color-text-muted)', fontSize:'0.875rem'}}>Page {page} of {pagination.totalPages}</span>
          <button className="page-btn" disabled={page===pagination.totalPages} onClick={() => setPage(p => p+1)}>→</button>
        </div>
      )}
    </>
  );
};

export default AdminPaymentsPage;
