import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [deliveryPartner, setDeliveryPartner] = useState('');
  const [timelineMessage, setTimelineMessage] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => ordersApi.adminGetById(id!),
    enabled: !!id,
  });

  const order = data?.data?.data;

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
      setNewPaymentStatus(order.paymentStatus || '');
      setTrackingNumber(order.trackingNumber || '');
      setDeliveryPartner(order.deliveryPartner || '');
    }
  }, [order]);

  const updateMutation = useMutation({
    mutationFn: (vars: any) => ordersApi.adminUpdateStatus(id!, vars),
    onSuccess: () => { 
      toast.success('Order updated successfully'); 
      qc.invalidateQueries({ queryKey: ['admin-order', id] }); 
      setTimelineMessage('');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update order'),
  });

  if (isLoading) return <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }}></div><p style={{ marginTop: '16px' }}>Loading order details...</p></div>;
  if (!order) return <div className="empty-state"><h2>Order Not Found</h2></div>;

  const statusOptions = ['PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED','REFUNDED'];
  const paymentStatusOptions = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

  const handleUpdate = () => {
    updateMutation.mutate({
      status: newStatus,
      paymentStatus: newPaymentStatus,
      trackingNumber,
      deliveryPartner,
      message: timelineMessage || `Status updated to ${newStatus} by Admin`,
      sendEmail: true
    });
  };

  return (
    <>
      <Helmet><title>Order {order.orderNumber} | Admin | BJS</title></Helmet>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/admin/orders" className="btn btn-outline btn-sm">← Back to Orders</Link>
        <h1 className="admin-page-title" style={{ margin: 0 }}>Order {order.orderNumber}</h1>
        <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
        <span className={`status-badge status-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Order Items */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '16px' }}>Purchased Items</h3>
            <table className="table" style={{ width: '100%', marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.image || 'https://via.placeholder.com/40'} alt={item.productName} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.productName}</p>
                        {item.variantName && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Variant: {item.variantName}</p>}
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>SKU: {item.sku}</p>
                      </div>
                    </td>
                    <td>₹{Number(item.unitPrice).toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{Number(item.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  <span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString()}</span>
                </div>
                {Number(order.couponDiscount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gold)', fontSize: '0.9rem' }}>
                    <span>Discount ({order.couponCode})</span><span>- ₹{Number(order.couponDiscount).toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  <span>Shipping</span><span>{Number(order.shippingCharge) === 0 ? 'Free' : `₹${Number(order.shippingCharge).toLocaleString()}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-ivory)', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Total</span><span>₹{Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '16px' }}>Order Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.timeline.map((event: any) => (
                <div key={event.id} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-gold)' }}></div>
                    <div style={{ width: '1px', flex: 1, background: 'var(--color-border)', marginTop: '4px' }}></div>
                  </div>
                  <div style={{ paddingBottom: '16px' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-ivory)' }}>{event.status}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{event.message}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      {new Date(event.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Action / Fulfillment Panel */}
          <div className="card" style={{ padding: '24px', border: '1px solid var(--color-border-gold)', background: 'rgba(201,162,39,0.03)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '16px' }}>Fulfillment & Actions</h3>
            
            <div className="form-group">
              <label className="form-label">Update Order Status</label>
              <select className="form-select" name="orderStatus" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Update Payment Status</label>
              <select className="form-select" value={newPaymentStatus} onChange={(e) => setNewPaymentStatus(e.target.value)}>
                {paymentStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Partner</label>
              <input className="form-input" placeholder="e.g. BlueDart" value={deliveryPartner} onChange={(e) => setDeliveryPartner(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Tracking Number</label>
              <input className="form-input" placeholder="e.g. 789123456" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Timeline Message (Optional)</label>
              <textarea className="form-textarea" rows={2} placeholder="Sent to customer" value={timelineMessage} onChange={(e) => setTimelineMessage(e.target.value)} />
            </div>

            <button className="btn btn-primary btn-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save & Notify Customer'}
            </button>
          </div>

          {/* Customer Info */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontSize: '1.2rem', marginBottom: '16px' }}>Customer</h3>
            <p style={{ fontWeight: 600, color: 'var(--color-ivory)', marginBottom: '4px' }}>{order.user?.firstName} {order.user?.lastName}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{order.user?.email}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{order.user?.phone}</p>
          </div>

          {/* Shipping Address */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontSize: '1.2rem', marginBottom: '16px' }}>Shipping Address</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {order.shippingAddress?.fullName}<br/>
              {order.shippingAddress?.addressLine1}<br/>
              {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br/></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}<br/>
              {order.shippingAddress?.country}<br/>
              Phone: {order.shippingAddress?.mobile}
            </p>
          </div>

          {/* Payment Info */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', fontSize: '1.2rem', marginBottom: '16px' }}>Payment Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-muted)' }}>Method:</span> <span style={{ color: 'var(--color-ivory)', fontWeight: 500 }}>{order.paymentMethod}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-muted)' }}>Status:</span> <span className={`status-badge status-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></div>
              {order.payment?.razorpayOrderId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}><span style={{ color: 'var(--color-text-muted)' }}>Provider ID:</span> <span style={{ color: 'var(--color-gold)', fontFamily: 'monospace' }}>{order.payment.razorpayOrderId}</span></div>
              )}
              {order.payment?.razorpayPaymentId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}><span style={{ color: 'var(--color-text-muted)' }}>Transaction ID:</span> <span style={{ color: 'var(--color-gold)', fontFamily: 'monospace' }}>{order.payment.razorpayPaymentId}</span></div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminOrderDetailPage;
