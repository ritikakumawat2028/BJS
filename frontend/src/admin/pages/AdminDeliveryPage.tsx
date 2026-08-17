import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDeliveryPage: React.FC = () => {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [states, setStates] = useState('');
  const [shippingCharge, setShippingCharge] = useState('');
  const [freeAbove, setFreeAbove] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Global Settings State
  const [globalCharge, setGlobalCharge] = useState('99');
  const [globalFree, setGlobalFree] = useState('999');

  // Queries
  const { data: zonesData, isLoading: zonesLoading } = useQuery({
    queryKey: ['admin-shipping-zones'],
    queryFn: () => adminApi.getShippingZones(),
  });

  const { data: settingsData } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => adminApi.getSettings(),
  });

  const zones = zonesData?.data?.data || [];
  const settings = settingsData?.data?.data || {};

  React.useEffect(() => {
    if (settings.default_shipping_charge) setGlobalCharge(settings.default_shipping_charge);
    if (settings.free_shipping_threshold) setGlobalFree(settings.free_shipping_threshold);
  }, [settings]);

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: (vars: any) => adminApi.updateSettings(vars),
    onSuccess: () => { toast.success('Global settings updated'); qc.invalidateQueries({ queryKey: ['store-settings'] }); },
    onError: () => toast.error('Failed to update settings'),
  });

  const saveZoneMutation = useMutation({
    mutationFn: (vars: any) => editingId ? adminApi.updateShippingZone(editingId, vars) : adminApi.createShippingZone(vars),
    onSuccess: () => {
      toast.success(editingId ? 'Zone updated' : 'Zone created');
      qc.invalidateQueries({ queryKey: ['admin-shipping-zones'] });
      closeModal();
    },
    onError: () => toast.error('Failed to save zone'),
  });

  const deleteZoneMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteShippingZone(id),
    onSuccess: () => { toast.success('Zone deleted'); qc.invalidateQueries({ queryKey: ['admin-shipping-zones'] }); },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      settings: {
        default_shipping_charge: globalCharge,
        free_shipping_threshold: globalFree
      }
    });
  };

  const openModal = (zone?: any) => {
    if (zone) {
      setEditingId(zone.id);
      setName(zone.name);
      setStates(zone.states || '');
      setShippingCharge(zone.shippingCharge);
      setFreeAbove(zone.freeAbove || '');
      setEstimatedDays(zone.estimatedDays || '');
      setIsActive(zone.isActive);
    } else {
      setEditingId(null);
      setName('');
      setStates('');
      setShippingCharge('');
      setFreeAbove('');
      setEstimatedDays('');
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    saveZoneMutation.mutate({
      name,
      states,
      shippingCharge: Number(shippingCharge),
      freeAbove: freeAbove ? Number(freeAbove) : null,
      estimatedDays,
      isActive
    });
  };

  return (
    <>
      <Helmet><title>Delivery Management — Admin | BJS</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>Delivery Management</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Add Delivery Zone</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '16px' }}>Global Shipping Fallbacks</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            These rates apply to customers whose state does not match any specific Delivery Zone.
          </p>
          <div className="form-group">
            <label className="form-label">Default Shipping Charge (₹)</label>
            <input type="number" className="form-input" value={globalCharge} onChange={e => setGlobalCharge(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Free Shipping Threshold (₹)</label>
            <input type="number" className="form-input" value={globalFree} onChange={e => setGlobalFree(e.target.value)} />
          </div>
          <button className="btn btn-outline-gold" onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Global Settings'}
          </button>
        </div>
        
        <div className="card" style={{ padding: '24px', background: 'rgba(201,162,39,0.03)', border: '1px solid var(--color-border-gold)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '16px' }}>How Zones Work</h3>
          <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, paddingLeft: '20px' }}>
            <li>When a customer reaches checkout, the system checks their shipping <strong>State</strong>.</li>
            <li>If the state name exists in the "Covered States" of an active Delivery Zone, those specific rates apply.</li>
            <li>If no zone matches, the <strong>Global Shipping Fallbacks</strong> are used.</li>
            <li>Separate states with commas (e.g. <code>Maharashtra, Gujarat, Goa</code>).</li>
          </ul>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontSize: '1.5rem', marginBottom: '16px' }}>Delivery Zones</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Covered States</th>
              <th>Shipping Charge</th>
              <th>Free Above</th>
              <th>Est. Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zonesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={7}><div className="skeleton" style={{ height: '20px' }} /></td></tr>
              ))
            ) : zones.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>No delivery zones configured.</td></tr>
            ) : (
              zones.map((z: any) => (
                <tr key={z.id}>
                  <td style={{ fontWeight: 500 }}>{z.name}</td>
                  <td style={{ fontSize: '0.85rem', maxWidth: '250px' }}>{z.states || 'All'}</td>
                  <td style={{ fontWeight: 600 }}>₹{Number(z.shippingCharge)}</td>
                  <td>{z.freeAbove ? `₹${Number(z.freeAbove)}` : '-'}</td>
                  <td>{z.estimatedDays || '-'}</td>
                  <td><span className={`status-badge status-${z.isActive ? 'delivered' : 'cancelled'}`}>{z.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openModal(z)}>Edit</button>
                      <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={() => {
                        if (confirm('Delete this zone?')) deleteZoneMutation.mutate(z.id);
                      }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '24px' }}>
              {editingId ? 'Edit Delivery Zone' : 'Add Delivery Zone'}
            </h2>
            <form onSubmit={handleSaveZone}>
              <div className="form-group">
                <label className="form-label">Zone Name</label>
                <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. North India" />
              </div>
              <div className="form-group">
                <label className="form-label">Covered States (Comma separated)</label>
                <textarea className="form-textarea" rows={2} value={states} onChange={e => setStates(e.target.value)} placeholder="e.g. Delhi, Punjab, Haryana" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Shipping Charge (₹)</label>
                  <input type="number" className="form-input" required value={shippingCharge} onChange={e => setShippingCharge(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Free Above (₹) (Optional)</label>
                  <input type="number" className="form-input" value={freeAbove} onChange={e => setFreeAbove(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Delivery Time</label>
                <input type="text" className="form-input" value={estimatedDays} onChange={e => setEstimatedDays(e.target.value)} placeholder="e.g. 2-3 Business Days" />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                <label htmlFor="isActive" style={{ cursor: 'pointer' }}>Zone is Active</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saveZoneMutation.isPending}>
                  {saveZoneMutation.isPending ? 'Saving...' : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDeliveryPage;
