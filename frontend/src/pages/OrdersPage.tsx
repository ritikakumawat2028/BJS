import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../services/api';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['my-orders'], queryFn: () => ordersApi.getAll() });
  const orders: Order[] = data?.data?.data || [];

  return (
    <>
      <Helmet><title>My Orders - BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/account" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '1.2rem', transition: 'color 0.2s' }}>
              &larr;
            </Link>
            <h1 className="section-title" style={{ marginBottom: 0, fontSize: '2rem' }}>My Orders</h1>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '8px' }} />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <h2 className="empty-state__title">No orders yet</h2>
              <p className="empty-state__text">You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn btn-outline-gold">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <Link to={`/account/orders/${order.id}`} key={order.id} className="order-row-card">
                  <div className="order-row-left">
                    <div className="order-row-header">
                      <span className="order-id">{order.orderNumber}</span>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                      <span className={`status-badge status-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                    </div>
                    <div className="order-row-details">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} 
                      &nbsp;&bull;&nbsp; {order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0} item{order.items?.length !== 1 ? 's' : ''} 
                      &nbsp;&bull;&nbsp; {order.paymentMethod}
                    </div>
                  </div>
                  <div className="order-row-right">
                    <span className="order-total">₹{Number(order.total).toLocaleString('en-IN')}</span>
                    <span className="order-chevron">&gt;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .order-row-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px;
          background: transparent;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .order-row-card:hover {
          border-color: var(--color-gold);
          background: rgba(255,255,255,0.02);
        }
        .order-row-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .order-row-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-id {
          font-family: var(--font-serif);
          color: var(--color-gold);
          font-weight: 600;
          font-size: 1.15rem;
        }
        .order-row-details {
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }
        .order-row-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .order-total {
          color: var(--color-ivory);
          font-weight: 700;
          font-size: 1.1rem;
        }
        .order-chevron {
          color: var(--color-text-muted);
          font-family: monospace;
          font-size: 1.2rem;
          transition: transform 0.2s;
        }
        .order-row-card:hover .order-chevron {
          transform: translateX(4px);
          color: var(--color-gold);
        }
        @media (max-width: 640px) {
          .order-row-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .order-row-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
};
export default OrdersPage;
