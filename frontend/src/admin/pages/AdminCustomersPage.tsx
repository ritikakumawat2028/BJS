import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCustomersPage: React.FC = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-customers', page, search], 
    queryFn: () => adminApi.getCustomers({ page, limit: 20, search }) 
  });
  
  const customers = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserStatus(id),
    onSuccess: () => { toast.success('User status updated'); qc.invalidateQueries({ queryKey: ['admin-customers'] }); },
  });

  return (
    <>
      <Helmet><title>Customers — Admin | BJS</title></Helmet>
      <h1 className="admin-page-title">Customers</h1>
      
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search by name or email..." 
          style={{ maxWidth: '320px' }} 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined Date</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={9}><div className="skeleton" style={{ height: '20px' }} /></td></tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>No customers found.</td></tr>
            ) : (
              customers.map((c: any) => {
                const totalSpent = c.orders?.reduce((sum: number, o: any) => sum + Number(o.total), 0) || 0;
                const lastOrderDate = c.orders?.[0]?.createdAt;

                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.firstName} {c.lastName}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{c.email}</td>
                    <td style={{ fontSize: '0.875rem' }}>{c.phone || '-'}</td>
                    <td style={{ fontSize: '0.875rem' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>{c._count?.orders || 0}</td>
                    <td style={{ fontWeight: 600 }}>₹{totalSpent.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {lastOrderDate ? new Date(lastOrderDate).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td>
                      <span className={'status-badge ' + (c.isActive ? 'status-delivered' : 'status-cancelled')}>
                        {c.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link 
                          to={`/admin/orders?search=${encodeURIComponent(c.email)}`} 
                          className="btn btn-outline-gold btn-sm"
                        >
                          View Orders
                        </Link>
                        <button 
                          className="btn btn-outline btn-sm" 
                          style={{ borderColor: c.isActive ? 'var(--color-error)' : 'var(--color-success)', color: c.isActive ? 'var(--color-error)' : 'var(--color-success)' }}
                          onClick={() => {
                            if(confirm(`Are you sure you want to ${c.isActive ? 'block' : 'unblock'} this customer?`)) {
                              toggleMutation.mutate(c.id);
                            }
                          }}
                        >
                          {c.isActive ? 'Block' : 'Unblock'}
                        </button>
                      </div>
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
export default AdminCustomersPage;
