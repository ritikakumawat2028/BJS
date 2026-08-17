import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
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
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard('30'),
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

  const topProductsData = dashboard?.charts?.topProducts?.map((p: any) => ({
    name: p.productName?.slice(0, 20),
    sales: Number(p._sum?.total || 0),
  })) || [];

  const paymentStatsData = dashboard?.charts?.paymentStats?.map((p: any) => ({
    name: p.paymentMethod,
    value: Number(p._count?.id || 0),
  })) || [];

  const categoryStatsData = dashboard?.charts?.categoryStats?.map((c: any) => ({
    name: `Cat ID: ${c.categoryId.substring(0,4)}`,
    value: Number(c._count?.id || 0),
  })) || [];

  const PIE_COLORS = ['#C9A227', '#F8F5EE', '#888888', '#444444', '#1A1A1A'];

  if (isLoading) {
    return (
      <div>
        <h1 className="admin-page-title">Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  const s = dashboard?.summary;

  return (
    <>
      <Helmet><title>Dashboard — Admin | BJ'S Natural Care</title></Helmet>
      <h1 className="admin-page-title">Dashboard</h1>

      {/* 10 Summary Cards */}
      <div className="admin-stats-grid">
        <StatCard label="Total Revenue" value={formatCurrency(s?.totalRevenue || 0)} />
        <StatCard label="Today's Revenue" value={formatCurrency(s?.todayRevenue || 0)} />
        <StatCard label="Monthly Revenue" value={formatCurrency(s?.monthRevenue || 0)} />
        <StatCard label="Total Orders" value={s?.totalOrders || 0} />
        <StatCard label="Pending Orders" value={s?.pendingOrders || 0} />
        <StatCard label="Completed Orders" value={s?.completedOrders || 0} />
        <StatCard label="Customers" value={s?.totalCustomers || 0} />
        <StatCard label="Products" value={s?.totalProducts || 0} />
        <StatCard label="Low Stock Products" value={s?.lowStockProducts || 0} positive={s?.lowStockProducts === 0} />
        <StatCard label="Refunds" value={s?.refunds || 0} positive={s?.refunds === 0} />
      </div>

      {/* 5 Charts */}
      <div className="admin-charts-grid">
        {/* 1. Revenue Over Time */}
        <div className="admin-chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="admin-chart-title">Revenue (Last 30 Days)</h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 11 }} />
                <YAxis stroke="#888" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(201,162,39,0.3)', color: '#F8F5EE', fontSize: '0.8rem' }}
                  formatter={(value: any, name: any, props: any) => [formatCurrency(value as number), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A227" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p className="empty-state__text">No revenue data available.</p></div>
          )}
        </div>

        {/* 2. Orders Over Time */}
        <div className="admin-chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="admin-chart-title">Orders (Last 30 Days)</h3>
          {ordersChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 11 }} />
                <YAxis stroke="#888" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(201,162,39,0.3)', color: '#F8F5EE', fontSize: '0.8rem' }}
                  formatter={(value: any, name: any, props: any) => [value, 'Orders']}
                />
                <Bar dataKey="orders" fill="#F8F5EE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p className="empty-state__text">No order data available.</p></div>
          )}
        </div>

        {/* 3. Top Selling Products */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Top Selling Products</h3>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
                <XAxis type="number" stroke="#888" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" stroke="#888" tick={{ fontSize: 10 }} width={100} />
                <Tooltip 
                  contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(201,162,39,0.3)', color: '#F8F5EE', fontSize: '0.8rem' }} 
                  formatter={(value: any, name: any, props: any) => [formatCurrency(value as number), 'Sales']} 
                />
                <Bar dataKey="sales" fill="#C9A227" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p className="empty-state__text">No sales data available.</p></div>
          )}
        </div>

        {/* 4. Payment Method Distribution */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Payment Methods</h3>
          {paymentStatsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={paymentStatsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {paymentStatsData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(201,162,39,0.3)', color: '#F8F5EE', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p className="empty-state__text">No payment data available.</p></div>
          )}
        </div>

        {/* 5. Category Sales Distribution */}
        <div className="admin-chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="admin-chart-title">Active Products by Category</h3>
          {categoryStatsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryStatsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryStatsData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(201,162,39,0.3)', color: '#F8F5EE', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p className="empty-state__text">No category data available.</p></div>
          )}
        </div>
      </div>

      <style>{`
        .admin-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 32px; }
        .admin-charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        .admin-chart-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 24px; }
        .admin-chart-title { font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-ivory); margin-bottom: 20px; text-align: center; }
        @media (max-width: 1400px) { .admin-stats-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 1200px) { .admin-stats-grid { grid-template-columns: repeat(3, 1fr); } .admin-charts-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .admin-stats-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </>
  );
};

export default AdminDashboardPage;
