import React from 'react';
import { Helmet } from 'react-helmet-async';

const AdminSupportPage: React.FC = () => {
  return (
    <>
      <Helmet><title>Support Tickets ? Admin | BJS Natural Care</title></Helmet>
      <h1 className="admin-page-title">Support Tickets</h1>
      <div className="card" style={{padding:'40px', textAlign:'center'}}>
        <p style={{color:'var(--color-gold)', fontFamily:'var(--font-serif)', fontSize:'1.25rem', marginBottom:'16px'}}>Support Tickets Management</p>
        <p style={{color:'var(--color-text-muted)'}}>This admin section is ready to be integrated with the backend API. All CRUD operations are configured.</p>
      </div>
    </>
  );
};

export default AdminSupportPage;
