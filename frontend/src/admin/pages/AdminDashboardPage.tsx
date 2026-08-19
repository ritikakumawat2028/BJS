import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { adminApi, ordersApi } from '../../services/api';
import { AdminDashboard } from '../../types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const StatCard: React.FC<{ label: string; value: string | number; sub?: string; positive?: boolean }> = ({ label, value, sub, positive }) => (
  <div className="admin-stat-card">
    <p className="admin-stat-label">{label}</p>
    <p className="admin-stat-value">{value}</p>
    {sub && <p className={`admin-stat-change ${positive !== undefined ? (positive ? 'positive' : 'negative') : ''}`}>{sub}</p>}
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [filter, setFilter] = React.useState('30days');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard', filter, startDate, endDate],
    queryFn: () => adminApi.getDashboard({ filter, startDate: filter === 'custom' ? startDate : undefined, endDate: filter === 'custom' ? endDate : undefined }),
  });

  const dashboard: any = data?.data?.data || null;

  const formatCurrency = (val: number) => `₹${Number(val).toLocaleString('en-IN')}`;

  const revenueChartData = dashboard?.charts?.revenue?.map((r: any) => ({
    date: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    revenue: Number(r._sum?.total || 0),
  })) || [];

  const ordersChartData = dashboard?.charts?.orders?.map((r: any) => ({
    date: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    orders: Number(r._count?.id || 0),
  })) || [];

  const monthlyStatsData = dashboard?.charts?.revenue?.map((r: any) => ({
    name: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    Revenue: Number(r._sum?.total || 0),
  })) || [];

  const { data: ordersData } = useQuery({
    queryKey: ['dashboard-recent-orders'],
    queryFn: () => ordersApi.adminGetAll({ page: 1, limit: 5 })
  });
  const recentOrders = ordersData?.data?.data || [];

  const { data: auditLogsData } = useQuery({
    queryKey: ['dashboard-recent-activity'],
    queryFn: () => adminApi.getAuditLogs()
  });
  const recentActivity = auditLogsData?.data?.data?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <div>
        <h1 className="admin-page-title">Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  const s = dashboard?.summary;

  return (
    <>
      <Helmet><title>Dashboard — Admin | BJ'S Natural Care</title></Helmet>

      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto', padding: '8px 12px' }}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Previous Month</option>
            <option value="custom">Custom Range</option>
          </select>
          {filter === 'custom' && (
            <>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: 'auto', padding: '8px 12px' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>to</span>
              <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: 'auto', padding: '8px 12px' }} />
            </>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="dash-stat-row">
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <div className="dash-stat-icon" style={{ color: '#00e676', backgroundColor: 'rgba(0,230,118,0.1)' }}>🛒</div>
          </div>
          <div className="dash-stat-body">
            <div>
              <p className="dash-stat-label">Total Sales</p>
              <h2 className="dash-stat-value">{formatCurrency(s?.totalRevenue || 0)}</h2>
            </div>
            <div className="dash-stat-trend positive">↑ 16.24%</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <div className="dash-stat-icon" style={{ color: '#ff5252', backgroundColor: 'rgba(255,82,82,0.1)' }}>📦</div>
          </div>
          <div className="dash-stat-body">
            <div>
              <p className="dash-stat-label">Total Orders</p>
              <h2 className="dash-stat-value">{s?.totalOrders || 0}</h2>
            </div>
            <div className="dash-stat-trend negative">↓ 3.00%</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <div className="dash-stat-icon" style={{ color: '#448aff', backgroundColor: 'rgba(68,138,255,0.1)' }}>👥</div>
          </div>
          <div className="dash-stat-body">
            <div>
              <p className="dash-stat-label">Daily Visitors</p>
              <h2 className="dash-stat-value">{s?.totalCustomers || 124}</h2>
            </div>
            <div className="dash-stat-trend positive">↑ 8.00%</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <div className="dash-stat-icon" style={{ color: '#ffca28', backgroundColor: 'rgba(255,202,40,0.1)' }}>⭐</div>
          </div>
          <div className="dash-stat-body">
            <div>
              <p className="dash-stat-label">Active Users</p>
              <h2 className="dash-stat-value">{s?.newCustomers || 42}</h2>
            </div>
            <div className="dash-stat-trend positive">↑ 12.50%</div>
          </div>
        </div>
      </div>

      {/* Main Grid Top */}
      <div className="dash-main-grid">
        {/* Left Col: Area Chart + Circular Stats */}
        <div className="dash-left-col">
          <div className="dash-card">
            <div className="dash-card-header" style={{ marginBottom: '16px' }}>
              <h3 className="dash-card-title">Total sales</h3>
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '6px' }}>
                <button style={{ padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>7 Days</button>
                <button style={{ padding: '6px 12px', border: 'none', background: '#ffca28', color: '#000', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}>Monthly</button>
                <button style={{ padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Yearly</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#448aff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#448aff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#448aff" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="dash-circular-row">
            <div className="dash-card circular-stat" style={{ padding: '24px' }}>
              <div>
                <p className="dash-stat-label">Total Products</p>
                <p className="dash-stat-value" style={{ fontSize: '1.4rem' }}>{s?.totalProducts || 0}</p>
              </div>
              <svg width="60" height="30" viewBox="0 0 60 30" style={{ margin: '0 10px' }}>
                 <path d="M0,25 Q15,30 25,15 T45,15 T60,5" fill="none" stroke="#ffca28" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <div className="circle-progress" style={{ width: '70px', height: '70px', borderTopColor: '#ffca28', borderRightColor: '#ffca28' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{(s?.totalProducts || 0)}</span>
              </div>
            </div>
            <div className="dash-card circular-stat" style={{ padding: '24px' }}>
              <div>
                <p className="dash-stat-label">Total Orders</p>
                <p className="dash-stat-value" style={{ fontSize: '1.4rem' }}>{s?.totalOrders || 0}</p>
              </div>
              <svg width="60" height="30" viewBox="0 0 60 30" style={{ margin: '0 10px' }}>
                 <path d="M0,25 Q15,30 25,15 T45,15 T60,5" fill="none" stroke="#00e676" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <div className="circle-progress" style={{ width: '70px', height: '70px', borderTopColor: '#00e676', borderRightColor: '#00e676' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{(s?.totalOrders || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Monthly Statistics */}
        <div className="dash-right-col">
          <div className="dash-card" style={{ height: '100%' }}>
            <div className="dash-card-header" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h3 className="dash-card-title">Monthly Statistics</h3>
                <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <span className="dot yellow" style={{ width: '10px', height: '10px' }}></span> Revenue
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-ivory)', marginTop: '4px' }}>{formatCurrency(s?.totalRevenue || 0)}</div>
                  </div>
                </div>
              </div>
              <select className="form-input" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem', background: 'transparent' }}>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyStatsData} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="Revenue" fill="#ffca28" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="dash-card" style={{ marginBottom: '24px' }}>
        <div className="dash-card-header">
          <h3 className="dash-card-title">Recent Orders</h3>
        </div>
        <div className="table-wrapper" style={{ margin: 0 }}>
          <table className="table" style={{ border: 'none' }}>
            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
              <tr>
                <th style={{ padding: '12px 24px', border: 'none' }}>Order Id</th>
                <th style={{ padding: '12px 24px', border: 'none' }}>Customer</th>
                <th style={{ padding: '12px 24px', border: 'none' }}>Product</th>
                <th style={{ padding: '12px 24px', border: 'none' }}>Amount</th>
                <th style={{ padding: '12px 24px', border: 'none' }}>Vendor</th>
                <th style={{ padding: '12px 24px', border: 'none' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px 24px', border: 'none' }}>{o.id || o.orderNumber}</td>
                  <td style={{ padding: '16px 24px', border: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                    {o.customer || (o.user?.firstName + ' ' + o.user?.lastName)}
                  </td>
                  <td style={{ padding: '16px 24px', border: 'none' }}>{o.product || (o.items?.[0]?.productName) || 'Product Name'}</td>
                  <td style={{ padding: '16px 24px', border: 'none' }}>${Number(o.amount || o.total).toFixed(2)}</td>
                  <td style={{ padding: '16px 24px', border: 'none' }}>{o.vendor || 'BJS Natural Care'}</td>
                  <td style={{ padding: '16px 24px', border: 'none' }}>
                    <span className={`pill-badge ${o.status?.toLowerCase() === 'paid' ? 'paid' : o.status?.toLowerCase() === 'pending' ? 'pending' : 'unpaid'}`}>
                      {o.status || o.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Grid Bottom */}
      <div className="dash-main-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Revenue</h3>
            <div className="dash-legend">
              <span><span className="dot blue"></span> Revenue</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#448aff" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-card" style={{ height: '100%' }}>
          <div className="dash-card-header" style={{ marginBottom: '16px' }}>
            <h3 className="dash-card-title">Recent Activity</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivity.length > 0 ? recentActivity.map((log: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffca28', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-ivory)' }}>
                    <strong>{log.admin?.firstName}</strong> performed <strong>{log.action}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No recent activity found.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dash-stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .dash-stat-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
        .dash-stat-header { display: flex; justify-content: flex-end; margin-bottom: 12px; }
        .dash-stat-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; alignItems: center; justify-content: center; font-size: 1.2rem; }
        .dash-stat-body { display: flex; justify-content: space-between; align-items: flex-end; }
        .dash-stat-label { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 4px; }
        .dash-stat-value { font-size: 1.5rem; font-weight: 600; color: var(--color-ivory); margin: 0; }
        .dash-stat-trend { font-size: 0.75rem; font-weight: 500; padding: 4px 8px; border-radius: 4px; }
        .dash-stat-trend.positive { color: #00e676; background: rgba(0,230,118,0.1); }
        .dash-stat-trend.negative { color: #ff5252; background: rgba(255,82,82,0.1); }

        .dash-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .dash-left-col { display: flex; flex-direction: column; gap: 24px; }
        .dash-right-col { display: flex; flex-direction: column; gap: 24px; }
        
        .dash-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
        .dash-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .dash-card-title { font-family: 'Inter', sans-serif; font-size: 1.1rem; color: var(--color-ivory); margin: 0; font-weight: 600; }
        
        .dash-circular-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .circular-stat { flex-direction: row; justify-content: space-between; align-items: center; padding: 20px 24px; }
        .circle-progress { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; font-size: 0.75rem; font-weight: bold; border: 4px solid var(--color-border); }
        .circle-progress.green { border-top-color: #00e676; border-right-color: #00e676; color: var(--color-ivory); }
        .circle-progress.blue { border-top-color: #00b0ff; color: var(--color-ivory); }

        .dash-legend { display: flex; gap: 16px; font-size: 0.8rem; color: var(--color-text-muted); }
        .dash-legend .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
        .dot.yellow { background: #ffca28; }
        .dot.blue { background: #448aff; }
        .dot.cyan { background: #00e5ff; }

        .pill-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
        .pill-badge.paid { color: #ff5252; background: rgba(255,82,82,0.1); }
        .pill-badge.pending { color: #00e676; background: rgba(0,230,118,0.1); }
        .pill-badge.unpaid { color: #448aff; background: rgba(68,138,255,0.1); }

        @media (max-width: 1200px) {
          .dash-stat-row { grid-template-columns: repeat(2, 1fr); }
          .dash-main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dash-stat-row { grid-template-columns: 1fr; }
          .dash-circular-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default AdminDashboardPage;
