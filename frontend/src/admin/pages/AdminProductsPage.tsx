import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi, adminApi } from '../../services/api';
import { Product, Category } from '../../types';
import toast from 'react-hot-toast';

const AdminProductsPage: React.FC = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', sku: '', categoryId: '', 
    price: '' as string | number, comparePrice: '' as string | number,
    stock: '' as string | number,
    description: '', image: '',
    isFeatured: false, isBestseller: false, isNewArrival: false, isActive: true,
    metaTitle: '', metaDesc: '', metaKeywords: '',
    variants: [] as any[],
  });

  const { data, isLoading } = useQuery({ queryKey: ['admin-products', page, search, status], queryFn: () => productsApi.adminGetAll({ page, limit: 20, search, status }) });
  const { data: catsData } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.getAll() });

  const categories: Category[] = catsData?.data?.data || [];
  const products: any[] = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const createMutation = useMutation({
    mutationFn: (payload: any) => productsApi.create(payload),
    onSuccess: () => { toast.success('Product created successfully'); qc.invalidateQueries({ queryKey: ['admin-products'] }); setShowForm(false); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; payload: any }) => productsApi.update(args.id, args.payload),
    onSuccess: () => { toast.success('Product updated successfully'); qc.invalidateQueries({ queryKey: ['admin-products'] }); setShowForm(false); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => { toast.success('Product deactivated'); qc.invalidateQueries({ queryKey: ['admin-products'] }); setDeleteId(null); },
    onError: () => toast.error('Failed to deactivate product'),
  });

  const openForm = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, sku: product.sku, categoryId: product.categoryId || '',
        price: product.price, comparePrice: product.comparePrice || '',
        stock: product.inventory?.quantity ?? '',
        description: product.description || '', image: product.images?.[0]?.url || '',
        isFeatured: product.isFeatured, isBestseller: product.isBestseller, isNewArrival: product.isNewArrival, isActive: product.isActive,
        metaTitle: product.metaTitle || '', metaDesc: product.metaDesc || '', metaKeywords: product.metaKeywords || '',
        variants: product.variants || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', sku: '', categoryId: categories.length > 0 ? categories[0].id : '',
        price: '', comparePrice: '', stock: '', description: '', image: '',
        isFeatured: false, isBestseller: false, isNewArrival: false, isActive: true,
        metaTitle: '', metaDesc: '', metaKeywords: '', variants: [],
      });
    }
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    
    setUploading(true);
    try {
      const res = await adminApi.uploadImage(formDataObj);
      setFormData({ ...formData, image: res.data.data.url });
      toast.success('Image uploaded');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Upload failed'); } 
    finally { setUploading(false); }
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { name: '', sku: '', price: '', comparePrice: '', stock: '' }] });
  };
  const removeVariant = (index: number) => {
    const newVars = [...formData.variants];
    newVars.splice(index, 1);
    setFormData({ ...formData, variants: newVars });
  };
  const updateVariant = (index: number, field: string, value: any) => {
    const newVars = [...formData.variants];
    newVars[index] = { ...newVars[index], [field]: value };
    setFormData({ ...formData, variants: newVars });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
      stock: formData.stock ? Number(formData.stock) : 0,
      initialStock: formData.stock ? Number(formData.stock) : 0,
      variants: formData.variants.map((v: any) => ({
        ...v, price: Number(v.price), comparePrice: v.comparePrice ? Number(v.comparePrice) : null, stock: Number(v.stock)
      }))
    };
    if (editingProduct) updateMutation.mutate({ id: editingProduct.id, payload });
    else createMutation.mutate(payload);
  };

  return (
    <>
      <Helmet><title>Products | Admin | BJS Natural Care</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Products</h1>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Add Product</button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input type="text" className="form-input" placeholder="Search products..." style={{ flex: 1, maxWidth: '320px' }} value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select" style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Variants</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {isLoading ? Array.from({ length: 8 }).map((_, i) => <tr key={i}><td colSpan={8}><div className="skeleton" style={{ height: '20px' }} /></td></tr>)
              : products.map((p) => (
              <tr key={p.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#1A1A1A' }} />
                  <span style={{ fontSize: '0.9rem' }}>{p.name}</span>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.sku}</td>
                <td style={{ fontSize: '0.875rem' }}>{p.category?.name}</td>
                <td>
                  ₹{Number(p.price).toLocaleString('en-IN')}
                  {p.comparePrice && <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '6px' }}>₹{Number(p.comparePrice).toLocaleString()}</span>}
                </td>
                <td>{p.inventory?.quantity ?? '?'}</td>
                <td>{p.variants?.length > 0 ? <span className="status-badge" style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--color-gold)' }}>{p.variants.length} Variants</span> : '-'}</td>
                <td><span className={`status-badge ${p.isActive ? 'active' : ''}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openForm(p)}>Edit</button>
                    <button className="btn btn-sm" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)', background: 'transparent', border: '1px solid' }} onClick={() => setDeleteId(p.id)}>Deactivate</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '24px' }}>
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Page {page} of {pagination.totalPages}</span>
          <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" style={{ zIndex: 1000, padding: '20px' }}>
          <div className="modal animate-scale-in" style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ position: 'sticky', top: 0, background: 'var(--color-surface)', padding: '24px', borderBottom: '1px solid var(--color-border)', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-ivory)', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Basic Info Section */}
              <section>
                <h4 style={{ color: 'var(--color-gold)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Basic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label className="form-label">Name *</label><input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div><label className="form-label">SKU *</label><input type="text" className="form-input" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <label className="form-label">Category *</label>
                    <select className="form-select" required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div><label className="form-label">Price (₹) *</label><input type="number" min="0" step="0.01" className="form-input" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                  <div><label className="form-label">Compare (₹)</label><input type="number" min="0" step="0.01" className="form-input" placeholder="Original Price" value={formData.comparePrice} onChange={e => setFormData({...formData, comparePrice: e.target.value})} /></div>
                  <div><label className="form-label">Base Stock *</label><input type="number" min="0" className="form-input" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div>
                </div>
                <div style={{ marginTop: '16px' }}><label className="form-label">Description</label><textarea className="form-textarea" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
              </section>

              {/* Media Section */}
              <section>
                <h4 style={{ color: 'var(--color-gold)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Media</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Image URL</label>
                    <input type="text" className="form-input" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    {formData.image && <img src={formData.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }} />}
                  </div>
                  <div>
                    <label className="form-label">Or Upload File</label>
                    <input type="file" className="form-input" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <span style={{ fontSize: '12px', color: 'var(--color-gold)', display: 'block', marginTop: '4px' }}>Uploading...</span>}
                  </div>
                </div>
              </section>

              {/* Variants Section */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Variants</h4>
                  <button type="button" className="btn btn-outline btn-sm" onClick={addVariant}>+ Add Variant</button>
                </div>
                
                {formData.variants.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>No variants added. The base product details will be used.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.variants.map((v, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr auto', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)', alignItems: 'end' }}>
                        <div><label className="form-label" style={{ fontSize: '0.75rem' }}>Name/Size</label><input type="text" className="form-input" placeholder="e.g. 50ml" required value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)} /></div>
                        <div><label className="form-label" style={{ fontSize: '0.75rem' }}>SKU</label><input type="text" className="form-input" required value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} /></div>
                        <div><label className="form-label" style={{ fontSize: '0.75rem' }}>Price (₹)</label><input type="number" className="form-input" required value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} /></div>
                        <div><label className="form-label" style={{ fontSize: '0.75rem' }}>Compare (₹)</label><input type="number" className="form-input" value={v.comparePrice} onChange={e => updateVariant(i, 'comparePrice', e.target.value)} /></div>
                        <div><label className="form-label" style={{ fontSize: '0.75rem' }}>Stock</label><input type="number" className="form-input" required value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} /></div>
                        <button type="button" onClick={() => removeVariant(i)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '8px', fontSize: '1.2rem' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* SEO Section */}
              <section>
                <h4 style={{ color: 'var(--color-gold)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Search Engine Optimization</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label className="form-label">Meta Title</label><input type="text" className="form-input" value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} /></div>
                  <div><label className="form-label">Meta Keywords</label><input type="text" className="form-input" placeholder="Comma separated" value={formData.metaKeywords} onChange={e => setFormData({...formData, metaKeywords: e.target.value})} /></div>
                </div>
                <div style={{ marginTop: '16px' }}><label className="form-label">Meta Description</label><textarea className="form-textarea" rows={2} value={formData.metaDesc} onChange={e => setFormData({...formData, metaDesc: e.target.value})}></textarea></div>
              </section>

              {/* Visibility & Tags */}
              <section>
                <h4 style={{ color: 'var(--color-gold)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visibility & Badges</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-ivory)' }}><input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} /> Featured</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-ivory)' }}><input type="checkbox" checked={formData.isBestseller} onChange={e => setFormData({...formData, isBestseller: e.target.checked})} /> Best Seller</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-ivory)' }}><input type="checkbox" checked={formData.isNewArrival} onChange={e => setFormData({...formData, isNewArrival: e.target.checked})} /> New Arrival</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-gold)' }}><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} /> Active (Visible)</label>
                </div>
              </section>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', position: 'sticky', bottom: 0, background: 'var(--color-surface)', padding: '16px 0', borderTop: '1px solid var(--color-border)', zIndex: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-ivory)', marginBottom: '16px' }}>Confirm Deactivation</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Are you sure you want to deactivate this product? It will no longer be visible to customers.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn" style={{ background: 'var(--color-error)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => deleteMutation.mutate(deleteId)}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
