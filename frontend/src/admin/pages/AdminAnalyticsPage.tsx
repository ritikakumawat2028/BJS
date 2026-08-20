import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminAnalyticsPage: React.FC = () => {
  const [filter, setFilter] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics', filter, startDate, endDate],
    queryFn: () => adminApi.getDashboard({ filter, startDate: filter === 'custom' ? startDate : undefined, endDate: filter === 'custom' ? endDate : undefined }),
  });

  const analytics = data?.data?.data || null;
  const s = analytics?.summary;

  const formatCurrency = (val: number) => `₹${Number(val).toLocaleString('en-IN')}`;

  const revenueChartData = analytics?.charts?.revenue?.map((r: any) => ({
    date: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    revenue: Number(r._sum?.total || 0),
  })) || [];

  const ordersChartData = analytics?.charts?.orders?.map((r: any) => ({
    date: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    orders: Number(r._count?.id || 0),
  })) || [];

  // Transform top products for PieChart
  const topProductsData = analytics?.charts?.topProducts?.map((p: any) => ({
    name: p.productName,
    value: Number(p._sum?.total || 0),
    quantity: p._sum?.quantity || 0,
  })) || [];

  const COLORS = ['#448aff', '#ffca28', '#00e676', '#ff5252', '#ab47bc'];

  if (isLoading) {
    return (
      <div>
        <h1 className="admin-page-title">Analytics Overview</h1>
        <div className="skeleton" style={{ height: '400px', borderRadius: '12px', marginBottom: '24px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }}></div>
          <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <Helmet><title>Analytics — Admin | BJ'S Natural Care</title></Helmet>

      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: '8px' }}>Analytics Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Detailed insights into your store's performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--color-surface)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <select
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto', border: 'none', background: 'transparent', color: 'var(--color-ivory)', fontWeight: 500 }}
          >
            <option value="today" style={{ color: '#000' }}>Today</option>
            <option value="yesterday" style={{ color: '#000' }}>Yesterday</option>
            <option value="7days" style={{ color: '#000' }}>Last 7 Days</option>
            <option value="30days" style={{ color: '#000' }}>Last 30 Days</option>
            <option value="this_month" style={{ color: '#000' }}>This Month</option>
            <option value="last_month" style={{ color: '#000' }}>Previous Month</option>
            <option value="custom" style={{ color: '#000' }}>Custom Range</option>
          </select>
          {filter === 'custom' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderLeft: '1px solid var(--color-border)', paddingLeft: '12px' }}>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '4px 8px', width: 'auto' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>to</span>
              <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '4px 8px', width: 'auto' }} />
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="analytics-metrics">
        <div className="metric-card">
          <p className="metric-title">Gross Revenue</p>
          <h2 className="metric-value text-blue">{formatCurrency(s?.totalRevenue || 0)}</h2>
          <p className="metric-sub">Across {s?.totalOrders || 0} orders</p>
        </div>
        <div className="metric-card">
          <p className="metric-title">Average Order Value</p>
          <h2 className="metric-value text-gold">{formatCurrency(s?.averageOrderValue || 0)}</h2>
          <p className="metric-sub">Per transaction</p>
        </div>
        <div className="metric-card">
          <p className="metric-title">Conversion Rate</p>
          <h2 className="metric-value text-green">{s?.conversionRate?.toFixed(2) || 0}%</h2>
          <p className="metric-sub">Visits to sales</p>
        </div>
        <div className="metric-card">
          <p className="metric-title">Refunds</p>
          <h2 className="metric-value text-red">{s?.refunds || 0}</h2>
          <p className="metric-sub">Items returned</p>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div className="analytics-card" style={{ marginBottom: '24px' }}>
        <h3 className="analytics-card-title">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#448aff" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#448aff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(201,162,39,0.3)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#448aff' }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#448aff" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-grid">
        {/* Orders Volume */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Orders Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,202,40,0.3)', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="orders" fill="#ffca28" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Top Products by Revenue</h3>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {topProductsData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              No data available for this period.
            </div>
          )}
        </div>
      </div>

      <style>{`
        .analytics-page { padding-bottom: 40px; }
        .analytics-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .metric-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 24px; transition: transform 0.2s; }
        .metric-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); }
        .metric-title { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .metric-value { font-size: 1.75rem; font-weight: 700; margin: 0 0 4px 0; }
        .metric-sub { font-size: 0.8rem; color: var(--color-text-muted); margin: 0; }
        
        .text-blue { color: #448aff; }
        .text-gold { color: #ffca28; }
        .text-green { color: #00e676; }
        .text-red { color: #ff5252; }
        
        .analytics-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .analytics-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 24px; }
        .analytics-card-title { font-size: 1.1rem; font-weight: 600; color: var(--color-ivory); margin: 0 0 24px 0; }
        
        @media (max-width: 1024px) {
          .analytics-metrics { grid-template-columns: repeat(2, 1fr); }
          .analytics-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .analytics-metrics { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminAnalyticsPage;
