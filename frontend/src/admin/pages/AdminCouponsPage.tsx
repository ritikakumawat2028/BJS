import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, productsApi, categoriesApi } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCouponsPage: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    code: '', description: '', discountType: 'PERCENTAGE', discountValue: '', 
    minOrderAmount: '', maxDiscount: '', usageLimit: '', perUserLimit: '',
    startDate: '', expiryDate: '', isActive: true, applicableType: 'ALL'
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data } = useQuery({ queryKey: ['admin-coupons'], queryFn: () => adminApi.getCoupons() });
  const coupons = data?.data?.data || [];

  const { data: prodData } = useQuery({ queryKey: ['admin-products-list'], queryFn: () => productsApi.getAll({ limit: 100 }) });
  const products = prodData?.data?.data || [];
  
  const { data: catData } = useQuery({ queryKey: ['admin-categories-list'], queryFn: () => categoriesApi.getAll() });
  const categories = catData?.data?.data || [];

  const createMutation = useMutation({ 
    mutationFn: (d: any) => adminApi.createCoupon(d), 
    onSuccess: () => { 
      toast.success('Coupon created'); 
      qc.invalidateQueries({ queryKey: ['admin-coupons'] }); 
      setShowForm(false); 
      setForm({ code: '', description: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', perUserLimit: '', startDate: '', expiryDate: '', isActive: true, applicableType: 'ALL' }); 
      setSelectedProducts([]);
      setSelectedCategories([]);
    } 
  });
  
  const deleteMutation = useMutation({ mutationFn: (id: string) => adminApi.deleteCoupon(id), onSuccess: () => { toast.success('Coupon deleted'); qc.invalidateQueries({ queryKey: ['admin-coupons'] }); } });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ 
      ...form, 
      discountValue: parseFloat(form.discountValue), 
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined, 
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined, 
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined, 
      perUserLimit: form.perUserLimit ? parseInt(form.perUserLimit) : undefined, 
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
      products: form.applicableType === 'PRODUCT' ? selectedProducts : [],
      categories: form.applicableType === 'CATEGORY' ? selectedCategories : []
    });
  };

  const handleMultiSelect = (val: string, current: string[], setter: any) => {
    if (current.includes(val)) setter(current.filter(id => id !== val));
    else setter([...current, val]);
  };

  return (
    <>
      <Helmet><title>Coupons — Admin | BJS</title></Helmet>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h1 className="admin-page-title" style={{marginBottom:0}}>Coupons & Discounts</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Create Coupon</button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Scope</th><th>Used</th><th>Active Dates</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {coupons.map((c: any) => (
              <tr key={c.id}>
                <td style={{fontFamily:'monospace', color:'var(--color-gold)', fontWeight:600}}>{c.code}</td>
                <td>{c.discountType}</td>
                <td>{c.discountType === 'PERCENTAGE' ? c.discountValue + '%' : '₹' + c.discountValue}</td>
                <td><span className="status-badge" style={{background: 'var(--color-bg-elevated)', color: 'var(--color-text)'}}>{c.applicableType}</span></td>
                <td>{c.usedCount} {c.usageLimit ? '/ '+c.usageLimit : ''}</td>
                <td style={{fontSize:'0.8rem', color: 'var(--color-text-muted)'}}>
                  {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'Now'} - {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Forever'}
                </td>
                <td><span className={'status-badge '+(c.isActive?'status-delivered':'status-cancelled')}>{c.isActive?'Active':'Inactive'}</span></td>
                <td>
                  <button className="btn btn-sm" style={{color:'var(--color-error)', border:'1px solid var(--color-error)', background:'transparent'}} onClick={() => {if(confirm('Delete coupon?')) deleteMutation.mutate(c.id)}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.5rem', color:'var(--color-ivory)', marginBottom:'24px'}}>Create Coupon</h3>
            
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:'24px'}}>
              <div className="admin-grid-2">
                <div className="form-group"><label className="form-label">Coupon Code *</label><input required className="form-input" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} placeholder="e.g. SAVE20" /></div>
                <div className="form-group"><label className="form-label">Discount Type</label><select className="form-select" value={form.discountType} onChange={e=>setForm(f=>({...f,discountType:e.target.value}))}><option value="PERCENTAGE">Percentage (%)</option><option value="FIXED">Fixed (₹)</option></select></div>
                <div className="form-group"><label className="form-label">Discount Value *</label><input required type="number" className="form-input" value={form.discountValue} onChange={e=>setForm(f=>({...f,discountValue:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Max Discount (₹)</label><input type="number" className="form-input" value={form.maxDiscount} onChange={e=>setForm(f=>({...f,maxDiscount:e.target.value}))} disabled={form.discountType === 'FIXED'} /></div>
                <div className="form-group"><label className="form-label">Min Order (₹)</label><input type="number" className="form-input" value={form.minOrderAmount} onChange={e=>setForm(f=>({...f,minOrderAmount:e.target.value}))} /></div>
              </div>

              <div className="admin-grid-2" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <div className="form-group"><label className="form-label">Usage Limit (Global)</label><input type="number" className="form-input" value={form.usageLimit} onChange={e=>setForm(f=>({...f,usageLimit:e.target.value}))} placeholder="Unlimited" /></div>
                <div className="form-group"><label className="form-label">Per-User Limit</label><input type="number" className="form-input" value={form.perUserLimit} onChange={e=>setForm(f=>({...f,perUserLimit:e.target.value}))} placeholder="e.g. 1" /></div>
                <div className="form-group"><label className="form-label">Start Date & Time</label><input type="datetime-local" className="form-input" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Expiry Date & Time</label><input type="datetime-local" className="form-input" value={form.expiryDate} onChange={e=>setForm(f=>({...f,expiryDate:e.target.value}))} /></div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <label className="form-label">Coupon Scope</label>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" checked={form.applicableType === 'ALL'} onChange={() => setForm(f=>({...f,applicableType:'ALL'}))} /> Entire Store</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" checked={form.applicableType === 'CATEGORY'} onChange={() => setForm(f=>({...f,applicableType:'CATEGORY'}))} /> Specific Categories</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" checked={form.applicableType === 'PRODUCT'} onChange={() => setForm(f=>({...f,applicableType:'PRODUCT'}))} /> Specific Products</label>
                </div>
                
                {form.applicableType === 'CATEGORY' && (
                  <div className="form-group">
                    <label className="form-label">Select Categories</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'var(--color-bg-elevated)', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)', maxHeight: '150px', overflowY: 'auto' }}>
                      {categories.map((c: any) => (
                        <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px 8px', background: 'var(--color-bg)', borderRadius: '4px' }}>
                          <input type="checkbox" checked={selectedCategories.includes(c.id)} onChange={() => handleMultiSelect(c.id, selectedCategories, setSelectedCategories)} /> {c.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {form.applicableType === 'PRODUCT' && (
                  <div className="form-group">
                    <label className="form-label">Select Products</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'var(--color-bg-elevated)', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)', maxHeight: '150px', overflowY: 'auto' }}>
                      {products.map((p: any) => (
                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px 8px', background: 'var(--color-bg)', borderRadius: '4px', fontSize: '0.85rem' }}>
                          <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => handleMultiSelect(p.id, selectedProducts, setSelectedProducts)} /> {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))} />
                <label htmlFor="isActive" style={{ cursor: 'pointer' }}>Coupon is Active</label>
              </div>

              <div style={{display:'flex', gap:'12px', justifyContent:'flex-end', marginTop: '16px'}}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create Coupon'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default AdminCouponsPage;
