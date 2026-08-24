import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, adminApi } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCategoriesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<any>({
    name: '', description: '', image: '', sortOrder: 0, metaTitle: '', metaDesc: '', isActive: true
  });
  
  const [subFormData, setSubFormData] = useState<any>({
    name: '', description: '', image: '', sortOrder: 0
  });

  const [editId, setEditId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll()
  });

  const categories = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (newCat: any) => categoriesApi.create(newCat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create category')
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string, data: any }) => categoriesApi.update(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update category')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deactivated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to deactivate category')
  });

  const createSubMutation = useMutation({
    mutationFn: (newSub: any) => categoriesApi.createSub(newSub),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Subcategory created');
      setIsSubModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create subcategory')
  });

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditId(category.id);
      setFormData(category);
    } else {
      setEditId(null);
      setFormData({ name: '', description: '', image: '', sortOrder: 0, metaTitle: '', metaDesc: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleOpenSubModal = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSubFormData({ name: '', description: '', image: '', sortOrder: 0 });
    setIsSubModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isSub: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const { data } = await adminApi.uploadImage(form);
      if (isSub) {
        setSubFormData((prev: any) => ({ ...prev, image: data.data.url }));
      } else {
        setFormData((prev: any) => ({ ...prev, image: data.data.url }));
      }
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required');

    if (editId) {
      updateMutation.mutate({ id: editId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFormData.name || !activeCategoryId) return toast.error('Name is required');
    createSubMutation.mutate({ ...subFormData, categoryId: activeCategoryId });
  };

  const toggleActive = (category: any) => {
    updateMutation.mutate({ id: category.id, data: { isActive: !category.isActive } });
  };

  if (isLoading) return <div className="admin-page"><div className="spinner"></div></div>;

  return (
    <div className="admin-page">
      <Helmet><title>Categories | Admin | BJS Natural Care</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Category Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Category</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Sort Order</th>
              <th>Products</th>
              <th>Subcategories</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No categories found.</td></tr>
            ) : (
              categories.map((c: any) => (
                <React.Fragment key={c.id}>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {c.image ? <img src={c.image} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#333' }}></div>}
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>/{c.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.sortOrder}</td>
                    <td>{c._count?.products || 0} Products</td>
                    <td>
                      <span className="status-badge" style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--color-gold)' }}>
                        {c.subcategories?.length || 0} Subcategories
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleActive(c)} className={`badge ${c.isActive ? 'status-paid' : 'status-failed'}`} style={{ cursor: 'pointer', border: 'none' }}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenSubModal(c.id)}>+ Sub</button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(c)}>Edit</button>
                        <button className="btn btn-outline btn-sm" onClick={() => {
                          if (window.confirm('Deactivate this category?')) deleteMutation.mutate(c.id);
                        }} style={{ color: 'var(--color-error)' }}>Deactivate</button>
                      </div>
                    </td>
                  </tr>
                  {/* Render subcategories underneath */}
                  {c.subcategories && c.subcategories.map((sub: any) => (
                    <tr key={sub.id} style={{ background: 'rgba(255,255,255,0.01)' }}>
                      <td style={{ paddingLeft: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: 'var(--color-border)' }}>↳</span>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{sub.name}</div>
                        </div>
                      </td>
                      <td>{sub.sortOrder}</td>
                      <td>-</td>
                      <td>-</td>
                      <td><span className={`badge ${sub.isActive ? 'status-paid' : 'status-failed'}`}>{sub.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>-</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '24px' }}>
              {editId ? 'Edit Category' : 'Create Category'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="admin-grid-2">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input className="form-input" type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input className="form-input" type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Category Image</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                  <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, false)} disabled={uploading} />
                  </label>
                </div>
                {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: '8px', width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />}
              </div>

              <hr style={{ borderColor: 'var(--color-border)', margin: '24px 0' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '16px' }}>SEO</h3>

              <div className="form-group">
                <label className="form-label">Meta Title</label>
                <input className="form-input" type="text" value={formData.metaTitle || ''} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Meta Description</label>
                <textarea className="form-input" rows={2} value={formData.metaDesc || ''} onChange={e => setFormData({...formData, metaDesc: e.target.value})}></textarea>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="shop-checkbox-label" style={{ fontSize: '1rem' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                  Active Category
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                  {editId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSubModalOpen(false)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setIsSubModalOpen(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '24px' }}>
              Add Subcategory
            </h2>

            <form onSubmit={handleSubSubmit}>
              <div className="admin-grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" type="text" value={subFormData.name} onChange={e => setSubFormData({...subFormData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input className="form-input" type="number" value={subFormData.sortOrder} onChange={e => setSubFormData({...subFormData, sortOrder: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image (Optional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" type="text" value={subFormData.image || ''} onChange={e => setSubFormData({...subFormData, image: e.target.value})} />
                  <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, true)} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsSubModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createSubMutation.isPending || uploading}>
                  Create Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
