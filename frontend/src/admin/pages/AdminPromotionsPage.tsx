import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, productsApi, categoriesApi } from '../../services/api';
import toast from 'react-hot-toast';

const PROMOTION_TYPES = [
  'FLASH_SALE', 'FESTIVAL_SALE', 'PRODUCT_DISCOUNT', 'CATEGORY_DISCOUNT', 
  'BUNDLE_OFFER', 'BUY_X_GET_Y', 'FREE_SHIPPING', 'LIMITED_TIME'
];

const AdminPromotionsPage: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    name: '', description: '', type: 'PRODUCT_DISCOUNT', 
    discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', 
    buyQuantity: '', getQuantity: '',
    startDate: '', endDate: '', isActive: true
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data } = useQuery({ queryKey: ['admin-promotions'], queryFn: () => adminApi.getPromotions() });
  const promotions = data?.data?.data || [];

  const { data: prodData } = useQuery({ queryKey: ['admin-products'], queryFn: () => productsApi.getProducts({ limit: 100 }) });
  const products = prodData?.data?.data || [];
  
  const { data: catData } = useQuery({ queryKey: ['admin-categories'], queryFn: () => categoriesApi.getCategories() });
  const categories = catData?.data?.data || [];

  const createMutation = useMutation({ 
    mutationFn: (d: any) => adminApi.createPromotion(d), 
    onSuccess: () => { 
      toast.success('Promotion created'); 
      qc.invalidateQueries({ queryKey: ['admin-promotions'] }); 
      setShowForm(false); 
      resetForm();
    } 
  });
  
  const deleteMutation = useMutation({ 
    mutationFn: (id: string) => adminApi.deletePromotion(id), 
    onSuccess: () => { 
      toast.success('Promotion deleted'); 
      qc.invalidateQueries({ queryKey: ['admin-promotions'] }); 
    } 
  });

  const resetForm = () => {
    setForm({ 
      name: '', description: '', type: 'PRODUCT_DISCOUNT', discountType: 'PERCENTAGE', 
      discountValue: '', minOrderAmount: '', buyQuantity: '', getQuantity: '', 
      startDate: '', endDate: '', isActive: true 
    });
    setSelectedProducts([]);
    setSelectedCategories([]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      toast.error('Start and End dates are required');
      return;
    }
    createMutation.mutate({ 
      ...form, 
      discountValue: form.discountValue ? parseFloat(form.discountValue) : undefined, 
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined, 
      buyQuantity: form.buyQuantity ? parseInt(form.buyQuantity) : undefined,
      getQuantity: form.getQuantity ? parseInt(form.getQuantity) : undefined,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      productIds: ['PRODUCT_DISCOUNT', 'BUY_X_GET_Y', 'BUNDLE_OFFER', 'FLASH_SALE', 'LIMITED_TIME'].includes(form.type) ? selectedProducts : [],
      categoryIds: form.type === 'CATEGORY_DISCOUNT' ? selectedCategories : []
    });
  };

  const handleMultiSelect = (val: string, current: string[], setter: any) => {
    if (current.includes(val)) setter(current.filter((id: string) => id !== val));
    else setter([...current, val]);
  };

  return (
    <>
      <Helmet><title>Promotions — Admin | BJS</title></Helmet>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h1 className="admin-page-title" style={{marginBottom:0}}>Promotions Management</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Create Promotion</button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Name</th><th>Type</th><th>Value</th><th>Active Dates</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {promotions.map((p: any) => (
              <tr key={p.id}>
                <td style={{fontWeight:600}}>{p.name}</td>
                <td><span className="status-badge" style={{background: 'var(--color-bg-elevated)', color: 'var(--color-text)'}}>{p.type}</span></td>
                <td>
                  {p.type === 'FREE_SHIPPING' ? 'Free Shipping' : 
                   p.type === 'BUY_X_GET_Y' ? `Buy ${p.buyQuantity} Get ${p.getQuantity}` :
                   (p.discountType === 'PERCENTAGE' ? p.discountValue + '%' : '₹' + p.discountValue)
                  }
                </td>
                <td style={{fontSize:'0.8rem', color: 'var(--color-text-muted)'}}>
                  {new Date(p.startDate).toLocaleString()} - {new Date(p.endDate).toLocaleString()}
                </td>
                <td><span className={'status-badge '+(p.isActive?'status-delivered':'status-cancelled')}>{p.isActive?'Active':'Inactive'}</span></td>
                <td>
                  <button className="btn btn-sm" style={{color:'var(--color-error)', border:'1px solid var(--color-error)', background:'transparent'}} onClick={() => {if(confirm('Delete promotion?')) deleteMutation.mutate(p.id)}}>Delete</button>
                </td>
              </tr>
            ))}
            {promotions.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:'center', padding:'24px', color:'var(--color-text-muted)'}}>No promotions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.5rem', color:'var(--color-ivory)', marginBottom:'24px'}}>Create Promotion</h3>
            
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:'24px'}}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Promotion Name</label>
                  <input type="text" className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    {PROMOTION_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>

              {form.type !== 'FREE_SHIPPING' && form.type !== 'BUY_X_GET_Y' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Discount Type</label>
                    <select className="form-control" value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}>
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Discount Value</label>
                    <input type="number" step="0.01" className="form-control" required value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} />
                  </div>
                </div>
              )}

              {form.type === 'BUY_X_GET_Y' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Buy Quantity</label>
                    <input type="number" min="1" className="form-control" required value={form.buyQuantity} onChange={e => setForm({...form, buyQuantity: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Get Quantity</label>
                    <input type="number" min="1" className="form-control" required value={form.getQuantity} onChange={e => setForm({...form, getQuantity: e.target.value})} />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Start Date & Time</label>
                  <input type="datetime-local" className="form-control" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>End Date & Time</label>
                  <input type="datetime-local" className="form-control" required value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Minimum Order Amount (Optional)</label>
                <input type="number" className="form-control" placeholder="0" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: e.target.value})} />
              </div>

              {['PRODUCT_DISCOUNT', 'BUY_X_GET_Y', 'BUNDLE_OFFER', 'FLASH_SALE', 'LIMITED_TIME'].includes(form.type) && (
                <div className="form-group">
                  <label>Applicable Products (Leave empty for all products)</label>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px' }}>
                    {products.map((p: any) => (
                      <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => handleMultiSelect(p.id, selectedProducts, setSelectedProducts)} />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {form.type === 'CATEGORY_DISCOUNT' && (
                <div className="form-group">
                  <label>Applicable Categories</label>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px' }}>
                    {categories.map((c: any) => (
                      <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedCategories.includes(c.id)} onChange={() => handleMultiSelect(c.id, selectedCategories, setSelectedCategories)} />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label style={{display:'flex', alignItems:'center', gap:'8px', cursor:'pointer'}}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                  Active
                </label>
              </div>

              <div style={{display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'16px'}}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPromotionsPage;
