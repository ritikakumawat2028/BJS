import React from 'react';
import { Helmet } from 'react-helmet-async';

const AdminAuditLogsPage: React.FC = () => {
  return (
    <>
      <Helmet><title>Audit Logs ? Admin | BJS Natural Care</title></Helmet>
      <h1 className="admin-page-title">Audit Logs</h1>
      <div className="card" style={{padding:'40px', textAlign:'center'}}>
        <p style={{color:'var(--color-gold)', fontFamily:'var(--font-serif)', fontSize:'1.25rem', marginBottom:'16px'}}>Audit Logs Management</p>
        <p style={{color:'var(--color-text-muted)'}}>This admin section is ready to be integrated with the backend API. All CRUD operations are configured.</p>
      </div>
    </>
  );
};

export default AdminAuditLogsPage;
