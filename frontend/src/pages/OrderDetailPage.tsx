import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi, ordersApi } from '../services/api';
import { Order } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { InvoiceTemplate } from '../components/order/InvoiceTemplate';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => ordersApi.getById(id!), enabled: !!id });
  const { data: settingsData } = useQuery({ queryKey: ['store-settings'], queryFn: () => adminApi.getSettings() });
  
  const order = data?.data?.data;
  const storeSettings = settingsData?.data?.data || {};
  
  const invoiceRef = React.useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);



  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current || !order) return;
    try {
      setIsGeneratingPDF(true);
      toast.loading('Generating invoice...', { id: 'pdf-toast' });
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, 1123] // A4 at 96 DPI
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);
      pdf.save(`Invoice_${order.orderNumber}.pdf`);
      toast.success('Invoice downloaded successfully', { id: 'pdf-toast' });
    } catch (error) {
      console.error('Failed to generate invoice', error);
      toast.error('Failed to download invoice', { id: 'pdf-toast' });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    if (order && location.state?.autoDownloadInvoice && invoiceRef.current && !isGeneratingPDF) {
      // Clear the state so it doesn't trigger again on refresh
      navigate(location.pathname, { replace: true, state: {} });
      
      // Slight delay to ensure images/fonts are loaded in the hidden DOM
      setTimeout(() => {
        handleDownloadInvoice();
      }, 1000);
    }
  }, [order, location.state, navigate, location.pathname, isGeneratingPDF]);

  if (isLoading) return <div className="container" style={{ paddingTop: '120px' }}><div className="skeleton" style={{ height: '400px' }} /></div>;
  if (!order) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}><h2>Order not found</h2></div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (price: number | string) => `₹${Number(price).toLocaleString('en-IN')}`;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'var(--color-warning, #f59e0b)';
      case 'CONFIRMED': return '#3b82f6';
      case 'PROCESSING': return '#6366f1';
      case 'PACKED': return '#8b5cf6';
      case 'SHIPPED': return '#0ea5e9';
      case 'OUT_FOR_DELIVERY': return '#14b8a6';
      case 'DELIVERED': return 'var(--color-success, #10b981)';
      case 'CANCELLED': return 'var(--color-error, #ef4444)';
      case 'RETURN_REQUESTED': return '#f97316';
      case 'RETURNED': return '#64748b';
      case 'REFUNDED': return '#059669';
      default: return 'var(--color-text-muted)';
    }
  };

  // Determine standard timeline flow for visual representation
  const standardFlow = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = standardFlow.indexOf(order.status);
  const isCancelledFlow = ['CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(order.status);

  return (
    <>
      <Helmet><title>Order #{order.orderNumber} – BJ'S Natural Care</title></Helmet>
      <div className="order-detail-wrapper" style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--color-black)', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          
          <Link to="/account/orders" className="back-link">
            ← Back to Orders
          </Link>
          
          <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
            <InvoiceTemplate ref={invoiceRef} order={order} storeSettings={storeSettings} />
          </div>
          
          <div className="order-header">
            <div className="order-header__left">
              <h1 className="section-title" style={{ marginBottom: '8px' }}>Order #{order.orderNumber}</h1>
              <p className="order-dates">
                Placed on {formatDate(order.createdAt)} • Last updated: {formatDate(order.updatedAt)}
              </p>
            </div>
            <div className="order-header__right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                className="btn btn-outline-gold btn-sm" 
                onClick={handleDownloadInvoice} 
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? 'Generating...' : 'Download Invoice'}
              </button>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="order-grid">
            {/* Left Column */}
            <div className="order-main">
              
              {/* Order Timeline */}
              <div className="card print-hide">
                <h3 className="card-title">Order Status Tracker</h3>
                <div className="timeline-container">
                  {order.timeline && order.timeline.length > 0 ? (
                    <div className="timeline-vertical">
                      {order.timeline.map((event: any, index: number) => (
                        <div key={event.id} className="timeline-item">
                          <div className="timeline-dot" style={{ backgroundColor: getStatusColor(event.status) }} />
                          {index < order.timeline.length - 1 && <div className="timeline-line" />}
                          <div className="timeline-content">
                            <h4 style={{ color: getStatusColor(event.status) }}>{event.status.replace(/_/g, ' ')}</h4>
                            <p>{event.message}</p>
                            <span className="timeline-time">{formatDate(event.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Fallback visual flow if no timeline events exist yet
                    <div className="timeline-horizontal">
                      {!isCancelledFlow && standardFlow.map((step, index) => (
                        <div key={step} className={`flow-step ${currentIndex >= index ? 'active' : ''}`}>
                          <div className="flow-dot" />
                          <span>{step.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                      {isCancelledFlow && (
                        <div className="flow-step active cancelled">
                          <div className="flow-dot" style={{ backgroundColor: getStatusColor(order.status) }} />
                          <span style={{ color: getStatusColor(order.status) }}>{order.status.replace(/_/g, ' ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items List (Bill representation) */}
              <div className="card">
                <h3 className="card-title">Order Items</h3>
                <div className="items-list">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="order-item">
                      <div className="order-item__image">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} />
                        ) : (
                          <div className="image-placeholder">No Image</div>
                        )}
                      </div>
                      <div className="order-item__details">
                        <h4>{item.productName}</h4>
                        {item.variantName && <p className="variant-name">Variant: {item.variantName}</p>}
                        {item.sku && <p className="sku-text">SKU: {item.sku}</p>}
                      </div>
                      <div className="order-item__pricing">
                        <div className="price-calc">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </div>
                        <div className="item-total">
                          {formatPrice(item.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics */}
              <div className="card">
                <h3 className="card-title">Logistics & Shipping</h3>
                <div className="logistics-grid">
                  <div className="logistics-box">
                    <h4>Delivery Partner</h4>
                    <p>{order.deliveryPartner || 'Awaiting assignment'}</p>
                  </div>
                  <div className="logistics-box">
                    <h4>Tracking Number</h4>
                    <p>{order.trackingNumber ? (
                      <span className="tracking-number">{order.trackingNumber}</span>
                    ) : 'Not available yet'}</p>
                  </div>
                </div>
                
                <div className="addresses-grid">
                  <div className="address-box">
                    <h4>Shipping Address</h4>
                    <p className="address-name">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="address-phone">Phone: {order.shippingAddress.phone}</p>
                  </div>
                  
                  <div className="address-box">
                    <h4>Billing Address</h4>
                    {order.billingAddress ? (
                      <>
                        <p className="address-name">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                        <p>{order.billingAddress.line1}</p>
                        {order.billingAddress.line2 && <p>{order.billingAddress.line2}</p>}
                        <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.pincode}</p>
                        <p>{order.billingAddress.country}</p>
                        <p className="address-phone">Phone: {order.billingAddress.phone}</p>
                      </>
                    ) : (
                      <p>Same as Shipping Address</p>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="order-sidebar">
              <div className="card" style={{ position: 'sticky', top: '100px' }}>
                <h3 className="card-title">Payment Summary</h3>
                
                <div className="payment-status-box">
                  <p>Method: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong></p>
                  <p>Status: <span className="status-badge small" style={{ 
                    backgroundColor: order.paymentStatus === 'PAID' ? 'var(--color-success)' : 
                                     order.paymentStatus === 'FAILED' ? 'var(--color-error)' : 'var(--color-warning)' 
                  }}>{order.paymentStatus}</span></p>
                </div>

                <div className="summary-list">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  
                  {order.couponDiscount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount ({order.couponCode})</span>
                      <span>-{formatPrice(order.couponDiscount)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{order.shippingCharge === 0 ? <span className="free">FREE</span> : formatPrice(order.shippingCharge)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  
                  <div className="divider" />
                  
                  <div className="summary-row total">
                    <span>Grand Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-gold btn-full" 
                  style={{ marginTop: '24px' }} 
                  onClick={handleDownloadInvoice}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? 'Generating...' : 'Download Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .back-link { font-size: 0.9rem; color: var(--color-gold); margin-bottom: 24px; display: inline-block; text-decoration: none; transition: opacity 0.2s; }
        .back-link:hover { opacity: 0.8; }
        
        .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 1px solid var(--color-border); padding-bottom: 24px; }
        .order-dates { color: var(--color-text-muted); font-size: 0.9rem; margin-top: 8px; }
        
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: var(--radius-full); color: #fff; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .status-badge.small { padding: 4px 10px; font-size: 0.75rem; }
        
        .order-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6); }
        
        .card { background: var(--color-charcoal); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); margin-bottom: var(--space-6); }
        .card-title { font-family: var(--font-serif); font-size: 1.3rem; color: var(--color-ivory); margin-bottom: var(--space-5); border-bottom: 1px solid var(--color-border); padding-bottom: 12px; }
        
        /* Vertical Timeline */
        .timeline-vertical { display: flex; flex-direction: column; gap: 0; padding-left: 10px; }
        .timeline-item { display: flex; gap: 20px; position: relative; padding-bottom: 24px; }
        .timeline-item:last-child { padding-bottom: 0; }
        .timeline-dot { width: 14px; height: 14px; border-radius: 50%; z-index: 2; margin-top: 5px; outline: 3px solid var(--color-charcoal); }
        .timeline-line { position: absolute; left: 6px; top: 19px; bottom: 0; width: 2px; background: var(--color-border); z-index: 1; }
        .timeline-content h4 { font-size: 1rem; margin-bottom: 4px; font-weight: 600; }
        .timeline-content p { font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 6px; }
        .timeline-time { font-size: 0.8rem; color: var(--color-text-muted); }
        
        /* Horizontal Flow Fallback */
        .timeline-horizontal { display: flex; justify-content: space-between; padding: 20px 0; overflow-x: auto; }
        .flow-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; min-width: 100px; position: relative; }
        .flow-step::after { content: ''; position: absolute; top: 10px; right: -50%; width: 100%; height: 2px; background: var(--color-border); z-index: 1; }
        .flow-step:last-child::after { display: none; }
        .flow-dot { width: 20px; height: 20px; border-radius: 50%; background: var(--color-border); z-index: 2; position: relative; }
        .flow-step.active .flow-dot { background: var(--color-gold); box-shadow: 0 0 10px rgba(201,162,39,0.5); }
        .flow-step.active::after { background: var(--color-gold); }
        .flow-step span { font-size: 0.8rem; color: var(--color-text-muted); text-align: center; font-weight: 500; }
        .flow-step.active span { color: var(--color-gold); }
        
        /* Items List */
        .items-list { display: flex; flex-direction: column; gap: var(--space-4); }
        .order-item { display: flex; gap: var(--space-4); align-items: center; padding-bottom: var(--space-4); border-bottom: 1px dashed var(--color-border); }
        .order-item:last-child { border-bottom: none; padding-bottom: 0; }
        .order-item__image { width: 80px; height: 80px; flex-shrink: 0; }
        .order-item__image img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
        .image-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--color-surface); font-size: 0.7rem; color: var(--color-text-muted); border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
        .order-item__details { flex: 1; }
        .order-item__details h4 { color: var(--color-ivory); font-weight: 500; font-size: 1.05rem; margin-bottom: 4px; }
        .variant-name { font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 2px; }
        .sku-text { font-size: 0.8rem; color: var(--color-text-muted); font-family: monospace; }
        .order-item__pricing { text-align: right; }
        .price-calc { font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 4px; }
        .item-total { font-size: 1.1rem; font-weight: 600; color: var(--color-gold); }
        
        /* Logistics & Addresses */
        .logistics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-6); padding-bottom: var(--space-5); border-bottom: 1px dashed var(--color-border); }
        .logistics-box h4 { font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .logistics-box p { color: var(--color-ivory); font-weight: 500; }
        .tracking-number { background: rgba(201,162,39,0.1); color: var(--color-gold); padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 1rem; }
        
        .addresses-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        .address-box h4 { font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .address-name { font-weight: 600; color: var(--color-ivory); margin-bottom: 6px; }
        .address-box p { font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5; }
        .address-phone { margin-top: 8px; color: var(--color-gold) !important; font-size: 0.85rem !important; }
        
        /* Sidebar Summary */
        .payment-status-box { background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 24px; border: 1px solid var(--color-border); }
        .payment-status-box p { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.9rem; color: var(--color-text-secondary); }
        .payment-status-box p:last-child { margin-bottom: 0; }
        .payment-status-box strong { color: var(--color-ivory); }
        
        .summary-list { display: flex; flex-direction: column; gap: 20px; }
        .summary-row { display: flex; justify-content: space-between; gap: 16px; color: var(--color-text-secondary); font-size: 0.95rem; }
        .summary-row.discount { color: var(--color-success); }
        .summary-row.total { color: var(--color-ivory); font-size: 1.2rem; font-weight: 600; padding-top: 8px; }
        .free { color: var(--color-success); font-weight: 600; }
        .divider { height: 1px; background: var(--color-border); margin: 8px 0; }
        
        /* Print Styles */
        @media print {
          body { background: white !important; color: black !important; }
          .order-detail-wrapper { background: white !important; padding: 0 !important; }
          .back-link, .btn, .print-hide { display: none !important; }
          .card { border: 1px solid #ccc !important; box-shadow: none !important; margin-bottom: 20px !important; break-inside: avoid; }
          .status-badge { box-shadow: none !important; border: 1px solid #000; }
          * { color: black !important; }
        }
        
        @media (max-width: 992px) {
          .order-grid { grid-template-columns: 1fr; }
          .order-sidebar .card { position: static; }
        }
        @media (max-width: 640px) {
          .order-header { flex-direction: column; gap: 16px; }
          .addresses-grid, .logistics-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};
export default OrderDetailPage;
