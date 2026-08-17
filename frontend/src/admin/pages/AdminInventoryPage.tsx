import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart3, PackageOpen, AlertTriangle, XOctagon, IndianRupee } from 'lucide-react';

const AdminInventoryPage: React.FC = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [adjustItem, setAdjustItem] = useState<any>(null);
  const [historyItem, setHistoryItem] = useState<any>(null);
  
  // Adjust form state
  const [adjustType, setAdjustType] = useState<'ADD' | 'REMOVE' | 'SET'>('ADD');
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState('');

  // Fetch Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-inventory-stats'],
    queryFn: () => adminApi.getInventoryStats()
  });
  const stats = statsData?.data?.data;

  // Fetch List
  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['admin-inventory-list', page, search],
    queryFn: () => adminApi.getInventoryList({ page, limit: 15, search })
  });
  const items = listData?.data?.data || [];
  const pagination = listData?.data?.pagination;

  // Fetch History
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['admin-inventory-history', historyItem?.id],
    queryFn: () => adminApi.getStockHistory(historyItem!.id, historyItem!.isVariant),
    enabled: !!historyItem
  });
  const history = historyData?.data?.data || [];

  // Mutations
  const adjustMutation = useMutation({
    mutationFn: () => adminApi.adjustStock({
      id: adjustItem.id,
      isVariant: adjustItem.isVariant,
      type: adjustType,
      quantity: adjustQty,
      note: adjustNote
    }),
    onSuccess: () => {
      toast.success('Stock adjusted successfully');
      qc.invalidateQueries({ queryKey: ['admin-inventory-list'] });
      qc.invalidateQueries({ queryKey: ['admin-inventory-stats'] });
      setAdjustItem(null);
      setAdjustQty(0);
      setAdjustNote('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'var(--color-success)';
      case 'LOW_STOCK': return 'var(--color-warning)';
      case 'OUT_OF_STOCK': return 'var(--color-error)';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <>
      <Helmet><title>Inventory — Admin | BJS</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Inventory Management</h1>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search by name or SKU..." 
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Metrics Row */}
      {statsLoading ? (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton card" style={{ flex: 1, height: '100px' }} />)}
        </div>
      ) : stats ? (
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="card stat-card">
            <div className="stat-icon"><PackageOpen size={24} color="var(--color-gold)" /></div>
            <div>
              <p className="stat-label">Total Items</p>
              <h3 className="stat-value">{stats.totalItems.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"><BarChart3 size={24} color="var(--color-success)" /></div>
            <div>
              <p className="stat-label">Available Units</p>
              <h3 className="stat-value">{stats.availableStock.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"><AlertTriangle size={24} color="var(--color-warning)" /></div>
            <div>
              <p className="stat-label">Low Stock Items</p>
              <h3 className="stat-value" style={{ color: stats.lowStockCount > 0 ? 'var(--color-warning)' : 'inherit' }}>{stats.lowStockCount.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"><XOctagon size={24} color="var(--color-error)" /></div>
            <div>
              <p className="stat-label">Out of Stock</p>
              <h3 className="stat-value" style={{ color: stats.outOfStockCount > 0 ? 'var(--color-error)' : 'inherit' }}>{stats.outOfStockCount.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          <div className="card stat-card" style={{ border: '1px solid var(--color-gold)' }}>
            <div className="stat-icon"><IndianRupee size={24} color="var(--color-gold)" /></div>
            <div>
              <p className="stat-label">Est. Inventory Value</p>
              <h3 className="stat-value">₹{stats.inventoryValue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>
      ) : null}

      {/* Inventory Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                Array.from({length: 5}).map((_,i) => (
                  <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: '30px' }} /></td></tr>
                ))
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>No inventory items found.</td></tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      {item.isVariant && <span style={{ fontSize: '0.75rem', marginLeft: '8px', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>Variant</span>}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{item.sku || 'N/A'}</td>
                    <td>₹{item.price.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 600 }}>{item.stock}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(item.status), padding: '4px 10px', fontSize: '0.75rem' }}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setAdjustItem(item)}>Adjust</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setHistoryItem(item)}>History</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="pagination" style={{ marginTop: '24px' }}>
            <button className="page-btn" disabled={page===1} onClick={() => setPage(p => p-1)}>←</button>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Page {page} of {pagination.totalPages}</span>
            <button className="page-btn" disabled={page===pagination.totalPages} onClick={() => setPage(p => p+1)}>→</button>
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      {adjustItem && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '400px' }}>
            <button className="modal-close" onClick={() => setAdjustItem(null)}>✕</button>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '16px' }}>Adjust Stock</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>{adjustItem.name} (Current: {adjustItem.stock})</p>
            
            <div className="form-group">
              <label className="form-label">Action</label>
              <select className="form-select" value={adjustType} onChange={(e: any) => setAdjustType(e.target.value)}>
                <option value="ADD">Add Stock (+)</option>
                <option value="REMOVE">Remove Stock (-)</option>
                <option value="SET">Set Absolute Stock (=)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input type="number" min="0" className="form-input" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Note / Reason (Optional)</label>
              <input type="text" className="form-input" placeholder="e.g. Restock from supplier" value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={() => setAdjustItem(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={adjustMutation.isPending} onClick={() => adjustMutation.mutate()}>
                {adjustMutation.isPending ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyItem && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '600px', width: '100%' }}>
            <button className="modal-close" onClick={() => setHistoryItem(null)}>✕</button>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '8px' }}>Stock History</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>{historyItem.name}</p>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {historyLoading ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>Loading...</div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>No history found for this item.</div>
              ) : (
                <table className="table" style={{ fontSize: '0.875rem' }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h: any) => (
                      <tr key={h.id}>
                        <td style={{ color: 'var(--color-text-muted)' }}>{new Date(h.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>
                          <span style={{ 
                            color: h.type === 'ADD' ? 'var(--color-success)' : h.type === 'SALE' || h.type === 'REMOVE' ? 'var(--color-error)' : 'var(--color-text-secondary)',
                            fontWeight: 600 
                          }}>{h.type}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{h.type === 'SALE' || h.type === 'REMOVE' ? '-' : h.type === 'ADD' ? '+' : ''}{h.quantity}</td>
                        <td>{h.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .stat-card { display: flex; align-items: center; gap: 16px; padding: 20px; }
        .stat-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-label { font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .stat-value { font-size: 1.5rem; color: var(--color-ivory); }
      `}</style>
    </>
  );
};
export default AdminInventoryPage;
