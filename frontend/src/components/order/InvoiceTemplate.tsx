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
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatPrice = (price: number) => `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <div 
      ref={ref}
      style={{
        width: '794px', // A4 width at 96 DPI
        minHeight: '1123px', // A4 height at 96 DPI
        backgroundColor: '#ffffff',
        position: 'relative',
        color: '#000000',
        fontFamily: 'Helvetica, Arial, sans-serif',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* HEADER BACKGROUND SVG */}
      <svg width="794" height="220" viewBox="0 0 794 220" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <polygon points="0,0 794,0 794,180 500,180 350,220 0,220" fill="#1A1A1A" />
        <polygon points="350,220 500,180 794,180 794,195 485,195 330,220" fill="#C9A227" />
        <polygon points="460,0 560,0 440,200 340,200" fill="#C9A227" opacity="0.8" />
      </svg>

      {/* HEADER TEXT OVERLAY */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', padding: '40px 50px', height: '220px' }}>
        <div style={{ color: '#ffffff' }}>
          <h1 style={{ margin: 0, fontSize: '36px', letterSpacing: '2px', fontWeight: 'bold' }}>BJ'S NATURAL CARE</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', letterSpacing: '4px', color: '#C9A227' }}>PREMIUM LUXURY</p>
        </div>
        <div style={{ textAlign: 'right', color: '#ffffff' }}>
          <h2 style={{ margin: 0, fontSize: '42px', color: '#C9A227', letterSpacing: '2px' }}>INVOICE</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '16px' }}>ID NO : {order.orderNumber}</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#aaaaaa' }}>Date : {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div style={{ padding: '20px 50px' }}>
        {/* ADDRESSES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', marginTop: '20px' }}>
          <div style={{ width: '45%' }}>
            <div style={{ backgroundColor: '#1A1A1A', color: '#C9A227', padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>Invoice To :</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
            </h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#333' }}>Phone : {order.shippingAddress?.phone || 'N/A'}</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
              {order.shippingAddress?.addressLine1}<br/>
              {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br/></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.state}<br/>
              {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
          </div>

          <div style={{ width: '45%' }}>
            <div style={{ backgroundColor: '#1A1A1A', color: '#C9A227', padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>Invoice From :</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>BJ'S Natural Care</h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#333' }}>Phone : {storeSettings?.contactPhone || '+91 99999 99999'}</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
              {storeSettings?.storeAddress || 'Premium Beauty Store Ltd.'}<br/>
              {storeSettings?.storeCity || 'Mumbai, Maharashtra'}<br/>
              {storeSettings?.storeCountry || 'India'}
            </p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', backgroundColor: '#C9A227', color: '#1A1A1A', fontWeight: 'bold', fontSize: '14px', padding: '12px' }}>
            <div style={{ flex: '3' }}>DESCRIPTION</div>
            <div style={{ flex: '1', textAlign: 'center' }}>PRICE</div>
            <div style={{ flex: '1', textAlign: 'center' }}>QTY</div>
            <div style={{ flex: '1', textAlign: 'right' }}>TOTAL</div>
          </div>
          
          <div style={{ borderBottom: '2px solid #1A1A1A' }}>
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', borderBottom: '1px solid #eeeeee', padding: '16px 12px', fontSize: '14px' }}>
                <div style={{ flex: '3', fontWeight: 'bold', color: '#1A1A1A' }}>
                  {item.productName}
                  {item.variantName && <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginTop: '4px' }}>{item.variantName}</div>}
                </div>
                <div style={{ flex: '1', textAlign: 'center' }}>{formatPrice(item.unitPrice)}</div>
                <div style={{ flex: '1', textAlign: 'center' }}>{item.quantity}x</div>
                <div style={{ flex: '1', textAlign: 'right' }}>{formatPrice(item.total)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* LEFT BOTTOM */}
          <div style={{ width: '50%' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#1A1A1A', color: '#C9A227', padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>Payment Method :</div>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Method :</strong> {order.paymentMethod}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Status :</strong> {order.paymentStatus}</p>
            </div>
            
            <div style={{ marginBottom: '40px' }}>
              <div style={{ backgroundColor: '#1A1A1A', color: '#C9A227', padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>Contact Info :</div>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Email :</strong> {storeSettings?.contactEmail || 'support@bjsnaturalcare.com'}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Web :</strong> www.bjsnaturalcare.com</p>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Thanks for your business</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#666', lineHeight: '1.6', maxWidth: '80%' }}>
                We appreciate your trust in BJ'S Natural Care. For any questions regarding your order or our premium products, please contact us.
              </p>
            </div>
          </div>

          {/* RIGHT BOTTOM (TOTALS) */}
          <div style={{ width: '40%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
              <span style={{ fontWeight: 'bold' }}>Subtotal :</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>Discount :</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
              <span style={{ fontWeight: 'bold' }}>Tax :</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
              <span style={{ fontWeight: 'bold' }}>Shipping :</span>
              <span>{order.shippingCharge > 0 ? formatPrice(order.shippingCharge) : 'Free'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#C9A227', color: '#1A1A1A', padding: '12px 16px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>TOTAL</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            <div style={{ marginTop: '80px', textAlign: 'center' }}>
              <div style={{ borderTop: '2px solid #1A1A1A', width: '150px', margin: '0 auto 8px auto' }}></div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>BJ'S Natural Care</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>AUTHORIZED SIGNATURE</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BACKGROUND SVG */}
      <svg width="794" height="60" viewBox="0 0 794 60" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 0 }}>
        <polygon points="0,60 0,30 400,30 430,0 794,0 794,60" fill="#1A1A1A" />
        <polygon points="0,30 380,30 410,0 0,0" fill="#C9A227" opacity="0.9" />
      </svg>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
