import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ordersApi } from '../../services/api';
import { Order } from '../../types';

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [search, setSearch] = useState(initialSearch);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  React.useEffect(() => {
    setPage(1);
  }, [status, paymentStatus, search, startDate, endDate, minAmount, maxAmount]);

  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-orders', page, status, paymentStatus, search, startDate, endDate, minAmount, maxAmount], 
    queryFn: () => ordersApi.adminGetAll({ 
      page, limit: 20, status, paymentStatus, search, startDate, endDate, minAmount, maxAmount 
    }) 
  });
  
  const orders: any[] = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const statusOptions = ['PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED','REFUNDED'];
  const paymentStatusOptions = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

  return (
    <>
      <Helmet><title>Orders — Admin | BJS</title></Helmet>
      <h1 className="admin-page-title">Order Management</h1>
      
      {/* Filters Bar */}
      <div className="admin-grid-auto" style={{ marginBottom: '24px', background: 'var(--color-surface)', padding: '16px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
        <div>
          <label className="form-label" style={{ fontSize: '0.7rem' }}>Search (Order # / Customer)</label>
          <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.7rem' }}>Order Status</label>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.7rem' }}>Payment Status</label>
          <select className="form-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="">All Payment Statuses</option>
            {paymentStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="admin-grid-2" style={{ gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>From Date</label>
            <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>To Date</label>
            <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Min Amount (₹)</label>
            <input type="number" className="form-input" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Max Amount (₹)</label>
            <input type="number" className="form-input" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {isLoading ? Array.from({length:8}).map((_,i) => <tr key={i}><td colSpan={8}><div className="skeleton" style={{height:'20px'}} /></td></tr>) : orders.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>No orders found matching your filters.</td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td style={{fontFamily:'monospace', fontSize:'0.85rem', color:'var(--color-gold)'}}>{o.orderNumber}</td>
                <td style={{fontSize:'0.875rem'}}>{o.user?.firstName} {o.user?.lastName}<br /><span style={{color:'var(--color-text-muted)', fontSize:'0.75rem'}}>{o.user?.email}</span></td>
                <td>{o.items?.reduce((acc: number, item: any) => acc + item.quantity, 0)} items</td>
                <td style={{fontWeight:600}}>₹{Number(o.total).toLocaleString('en-IN')}</td>
                <td><span className={'status-badge status-' + o.paymentStatus.toLowerCase()}>{o.paymentStatus}</span></td>
                <td><span className={'status-badge status-' + o.status.toLowerCase()}>{o.status}</span></td>
                <td style={{fontSize:'0.8rem', color:'var(--color-text-muted)'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td><button className="btn btn-outline-gold btn-sm" onClick={() => navigate(`/admin/orders/${o.id}`)}>View Details</button></td>
              </tr>
            ))}
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
export default AdminOrdersPage;
