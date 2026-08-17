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
        width: '794px',
        minHeight: '1123px',
        backgroundColor: '#ffffff',
        position: 'relative',
        color: '#1a1a1a',
        fontFamily: 'Helvetica, Arial, sans-serif',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
        {/* Decorative CSS polygon to avoid SVG rendering issues */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-120px',
          width: '500px',
          height: '400px',
          backgroundColor: '#C9A227',
          transform: 'rotate(-35deg)',
          zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', padding: '40px 50px' }}>
          <div style={{ color: '#ffffff', flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '32px', letterSpacing: '2px', fontWeight: 'bold' }}>BJ'S NATURAL CARE</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', letterSpacing: '4px', color: '#C9A227' }}>PREMIUM LUXURY</p>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '42px', color: '#1A1A1A', letterSpacing: '2px', fontWeight: 900 }}>INVOICE</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#1A1A1A', fontWeight: 'bold' }}>ID NO : {order.orderNumber}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#1A1A1A', fontWeight: 'bold' }}>Date : {formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '30px 50px' }}>
        {/* ADDRESSES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ width: '45%' }}>
            <div style={{ backgroundColor: '#1A1A1A', color: '#C9A227', padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', fontSize: '12px', marginBottom: '12px' }}>INVOICE TO</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
            </h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#444' }}>Phone : {order.shippingAddress?.phone || 'N/A'}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#444', lineHeight: '1.5' }}>
              {order.shippingAddress?.addressLine1}<br/>
              {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br/></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.state}<br/>
              {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
          </div>

          <div style={{ width: '45%', textAlign: 'right' }}>
            <div style={{ backgroundColor: '#1A1A1A', color: '#C9A227', padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', fontSize: '12px', marginBottom: '12px' }}>INVOICE FROM</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>BJ'S Natural Care</h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#444' }}>Phone : {storeSettings?.contactPhone || '+91 99999 99999'}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#444', lineHeight: '1.5' }}>
              {storeSettings?.storeAddress || 'Premium Beauty Store Ltd.'}<br/>
              {storeSettings?.storeCity || 'Mumbai, Maharashtra'}<br/>
              {storeSettings?.storeCountry || 'India'}
            </p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', backgroundColor: '#1A1A1A', color: '#C9A227', fontWeight: 'bold', fontSize: '12px', padding: '12px', borderBottom: '3px solid #C9A227' }}>
            <div style={{ flex: '3' }}>DESCRIPTION</div>
            <div style={{ flex: '1', textAlign: 'center' }}>PRICE</div>
            <div style={{ flex: '1', textAlign: 'center' }}>QTY</div>
            <div style={{ flex: '1', textAlign: 'right' }}>TOTAL</div>
          </div>
          
          <div>
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', borderBottom: '1px solid #eeeeee', padding: '16px 12px', fontSize: '13px' }}>
                <div style={{ flex: '3', fontWeight: 'bold', color: '#1A1A1A' }}>
                  {item.productName}
                  {item.variantName && <div style={{ fontSize: '11px', color: '#666', fontWeight: 'normal', marginTop: '4px' }}>{item.variantName}</div>}
                </div>
                <div style={{ flex: '1', textAlign: 'center' }}>{formatPrice(item.price)}</div>
                <div style={{ flex: '1', textAlign: 'center' }}>{item.quantity}</div>
                <div style={{ flex: '1', textAlign: 'right', fontWeight: 'bold' }}>{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY SECTION */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '350px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '14px', borderBottom: '1px solid #eeeeee' }}>
              <span style={{ color: '#666' }}>Subtotal:</span>
              <span style={{ fontWeight: 'bold' }}>{formatPrice(order.subtotal)}</span>
            </div>
            
            {order.couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '14px', borderBottom: '1px solid #eeeeee', color: '#059669' }}>
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                <span style={{ fontWeight: 'bold' }}>-{formatPrice(order.couponDiscount)}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '14px', borderBottom: '1px solid #eeeeee' }}>
              <span style={{ color: '#666' }}>Shipping:</span>
              <span style={{ fontWeight: 'bold' }}>{order.shippingCharge > 0 ? formatPrice(order.shippingCharge) : 'Free'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '14px', borderBottom: '1px solid #eeeeee' }}>
              <span style={{ color: '#666' }}>Tax:</span>
              <span style={{ fontWeight: 'bold' }}>{formatPrice(order.tax)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 12px', fontSize: '18px', backgroundColor: '#f9f9f9', marginTop: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#1A1A1A' }}>TOTAL DUE:</span>
              <span style={{ fontWeight: 'bold', color: '#C9A227' }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '80px', borderTop: '1px solid #eeeeee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#1A1A1A' }}>Payment Method:</p>
            <p style={{ margin: 0 }}>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0 }}>Thank you for your business!</p>
          </div>
        </div>
      </div>
      
      {/* BOTTOM DECORATION */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '15px', display: 'flex' }}>
        <div style={{ flex: 1, backgroundColor: '#1A1A1A' }}></div>
        <div style={{ flex: 1, backgroundColor: '#C9A227' }}></div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
