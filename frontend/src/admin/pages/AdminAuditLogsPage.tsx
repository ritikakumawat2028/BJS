import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';

const AdminAuditLogsPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => adminApi.getAuditLogs(),
  });

  const logs = data?.data?.data || [];

  if (isLoading) {
    return (
      <div>
        <h1 className="admin-page-title">Admin Activity Logs</h1>
        <div className="skeleton" style={{ height: '600px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="admin-page-title">Admin Activity Logs</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Failed to load activity logs.</p>
      </div>
    );
  }

  // Format action string nicely (e.g. UPDATE_SETTINGS -> Update Settings)
  const formatAction = (action: string) => {
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('ADD')) return 'text-green bg-green-light';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'text-red bg-red-light';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'text-blue bg-blue-light';
    return 'text-gold bg-gold-light';
  };

  return (
    <div className="audit-logs-page">
      <Helmet><title>Audit Logs — Admin | BJ'S Natural Care</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: '8px' }}>Admin Activity Logs</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Track and review administrative actions performed on the platform.</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ margin: 0, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <table className="table" style={{ border: 'none', margin: 0, width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255,255,255,0.03)', position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Date & Time</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Administrator</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Action</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Entity / Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.map((log: any, idx: number) => (
                <tr key={idx} className="table-row">
                  <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-ivory)' }}>
                      {new Date(log.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(log.createdAt).toLocaleTimeString('en-IN')}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(201,162,39,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {log.admin?.firstName?.[0]}{log.admin?.lastName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-ivory)' }}>{log.admin?.firstName} {log.admin?.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{log.admin?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
                    <span className={`action-badge ${getActionColor(log.action)}`}>
                      {formatAction(log.action)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-ivory)' }}>
                      {log.entity} {log.entityId && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}> (ID: {log.entityId})</span>}
                    </div>
                    {/* Optionally display some truncated new values if any */}
                    {log.newValue && typeof log.newValue === 'object' && Object.keys(log.newValue).length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Data changed...
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }
        .table-row { transition: background 0.2s; }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        
        .action-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        .text-green { color: #00e676; }
        .bg-green-light { background: rgba(0,230,118,0.1); border: 1px solid rgba(0,230,118,0.2); }
        
        .text-red { color: #ff5252; }
        .bg-red-light { background: rgba(255,82,82,0.1); border: 1px solid rgba(255,82,82,0.2); }
        
        .text-blue { color: #448aff; }
        .bg-blue-light { background: rgba(68,138,255,0.1); border: 1px solid rgba(68,138,255,0.2); }
        
        .text-gold { color: #ffca28; }
        .bg-gold-light { background: rgba(255,202,40,0.1); border: 1px solid rgba(255,202,40,0.2); }
      `}</style>
    </div>
  );
};

export default AdminAuditLogsPage;
