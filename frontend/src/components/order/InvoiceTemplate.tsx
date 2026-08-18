import React, { forwardRef } from 'react';
import { Order } from '../../types';

interface InvoiceTemplateProps {
  order: Order | any;
  storeSettings?: any;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ order, storeSettings }, ref) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatPrice = (price: number | string) => `₹${Number(price).toLocaleString('en-IN')}`;

  // Use inline styles to explicitly prevent globals.css overrides in html2canvas
  const colors = {
    black: '#0A0A0A',
    darkGray: '#333333',
    gray: '#666666',
    lightGray: '#EAEAEA',
    gold: '#C9A227',
    white: '#FFFFFF'
  };

  return (
    <div 
      ref={ref}
      style={{
        width: '794px',
        minHeight: '1123px', // A4 height
        backgroundColor: colors.white,
        position: 'relative',
        color: colors.black,
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: '60px 50px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${colors.black}`, paddingBottom: '30px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '4px', textTransform: 'uppercase', color: colors.black }}>
            BJ'S Natural Care
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '10px', letterSpacing: '3px', color: colors.gray, textTransform: 'uppercase' }}>
            Premium Luxury Beauty
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 300, letterSpacing: '6px', color: colors.black, fontFamily: "'Inter', sans-serif" }}>
            INVOICE
          </h2>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: colors.darkGray, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <span style={{ fontWeight: 600, width: '80px', textAlign: 'right' }}>Order No:</span>
              <span style={{ width: '120px', textAlign: 'left' }}>{order.orderNumber}</span>
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: colors.darkGray, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <span style={{ fontWeight: 600, width: '80px', textAlign: 'right' }}>Date:</span>
              <span style={{ width: '120px', textAlign: 'left' }}>{formatDate(order.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ADDRESSES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
        <div style={{ width: '45%' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Billed To</p>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: colors.black, textTransform: 'uppercase' }}>
            {order.billingAddress?.firstName || order.shippingAddress?.firstName} {order.billingAddress?.lastName || order.shippingAddress?.lastName}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: colors.darkGray, lineHeight: '1.6' }}>
            {order.billingAddress?.line1 || order.shippingAddress?.line1}<br/>
            {(order.billingAddress?.line2 || order.shippingAddress?.line2) ? <>{order.billingAddress?.line2 || order.shippingAddress?.line2}<br/></> : ''}
            {order.billingAddress?.city || order.shippingAddress?.city}, {order.billingAddress?.state || order.shippingAddress?.state} {order.billingAddress?.pincode || order.shippingAddress?.pincode}<br/>
            {order.billingAddress?.country || order.shippingAddress?.country}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: colors.darkGray }}>
            Tel: {order.billingAddress?.phone || order.shippingAddress?.phone || 'N/A'}
          </p>
        </div>

        <div style={{ width: '45%', textAlign: 'right' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Shipped From</p>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: colors.black }}>
            BJ'S NATURAL CARE
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: colors.darkGray, lineHeight: '1.6' }}>
            {storeSettings?.storeAddress || 'Premium Beauty Store Ltd.'}<br/>
            {storeSettings?.storeCity || 'Mumbai, Maharashtra'}<br/>
            {storeSettings?.storeCountry || 'India'}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: colors.darkGray }}>
            Tel: {storeSettings?.contactPhone || '+91 99999 99999'}
          </p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={{ marginBottom: '40px' }}>
        {/* Table Header */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${colors.black}`, paddingBottom: '12px', marginBottom: '12px' }}>
          <div style={{ flex: '4', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Description</div>
          <div style={{ flex: '1', textAlign: 'center', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Price</div>
          <div style={{ flex: '1', textAlign: 'center', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Qty</div>
          <div style={{ flex: '1.5', textAlign: 'right', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
        </div>
        
        {/* Table Body */}
        <div>
          {order.items?.map((item: any, idx: number) => {
            const price = Number(item.unitPrice || item.price || 0);
            return (
              <div key={idx} style={{ display: 'flex', borderBottom: `1px solid ${colors.lightGray}`, padding: '16px 0', alignItems: 'center' }}>
                <div style={{ flex: '4' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: colors.black }}>{item.productName}</p>
                  {item.variantName && <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: colors.gray }}>Variant: {item.variantName}</p>}
                  {item.sku && <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: colors.gray, fontFamily: 'monospace' }}>SKU: {item.sku}</p>}
                </div>
                <div style={{ flex: '1', textAlign: 'center', fontSize: '12px', color: colors.darkGray }}>
                  {formatPrice(price)}
                </div>
                <div style={{ flex: '1', textAlign: 'center', fontSize: '12px', color: colors.darkGray }}>
                  {item.quantity}
                </div>
                <div style={{ flex: '1.5', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: colors.black }}>
                  {formatPrice(price * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUMMARY SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        
        <div style={{ width: '40%' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Payment Method</p>
          <p style={{ margin: 0, fontSize: '12px', color: colors.black, fontWeight: 500 }}>
            {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
          </p>
          <p style={{ margin: '24px 0 0 0', fontSize: '10px', letterSpacing: '2px', color: colors.gray, textTransform: 'uppercase', fontWeight: 600 }}>Order Status</p>
          <p style={{ margin: 0, fontSize: '12px', color: colors.black, fontWeight: 500 }}>
            {order.status?.replace(/_/g, ' ') || 'CONFIRMED'}
          </p>
        </div>

        <div style={{ width: '45%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.lightGray}` }}>
            <span style={{ fontSize: '12px', color: colors.darkGray }}>Subtotal</span>
            <span style={{ fontSize: '12px', color: colors.black, fontWeight: 500 }}>{formatPrice(order.subtotal)}</span>
          </div>
          
          {order.couponDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.lightGray}` }}>
              <span style={{ fontSize: '12px', color: colors.gray }}>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
              <span style={{ fontSize: '12px', color: colors.black, fontWeight: 500 }}>-{formatPrice(order.couponDiscount)}</span>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.lightGray}` }}>
            <span style={{ fontSize: '12px', color: colors.darkGray }}>Shipping</span>
            <span style={{ fontSize: '12px', color: colors.black, fontWeight: 500 }}>
              {Number(order.shippingCharge) > 0 ? formatPrice(order.shippingCharge) : 'Free'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.lightGray}` }}>
            <span style={{ fontSize: '12px', color: colors.darkGray }}>Tax</span>
            <span style={{ fontSize: '12px', color: colors.black, fontWeight: 500 }}>{formatPrice(order.tax)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0 8px 0', marginTop: '16px', borderTop: `2px solid ${colors.black}` }}>
            <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: colors.black }}>Grand Total</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: colors.black }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position: 'absolute', bottom: '60px', left: '50px', right: '50px' }}>
        <div style={{ borderTop: `1px solid ${colors.lightGray}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '11px', color: colors.gray }}>
            If you have any questions about this invoice, please contact our support team.
          </p>
          <p style={{ margin: 0, fontSize: '14px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: colors.gold }}>
            Thank you for your trust in BJ'S Natural Care.
          </p>
        </div>
      </div>
      
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
