import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orderNumber?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminSupportPage: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-support-tickets'],
    queryFn: async () => {
      const response = await adminApi.getTickets();
      return response.data?.data || [];
    }
  });

  const tickets: SupportTicket[] = data || [];

  return (
    <>
      <Helmet><title>Support Tickets ? Admin | BJS Natural Care</title></Helmet>
      <h1 className="admin-page-title">Support Tickets</h1>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading tickets...</div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Failed to load tickets.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Subject</th>
                <th>Order Number</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>No support tickets found.</td>
                </tr>
              ) : (
                tickets.map(ticket => (
                  <React.Fragment key={ticket.id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}>
                      <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--color-gold)' }}>{ticket.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{ticket.email}</div>
                      </td>
                      <td>{ticket.subject}</td>
                      <td>{ticket.orderNumber || '-'}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: ticket.status === 'OPEN' ? 'rgba(218, 165, 32, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                          color: ticket.status === 'OPEN' ? 'var(--color-gold)' : 'var(--color-text-muted)'
                        }}>
                          {ticket.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline-gold" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          {selectedTicket?.id === ticket.id ? 'Close' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    {selectedTicket?.id === ticket.id && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0' }}>
                          <div style={{ padding: '24px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                              <div>
                                <h4 style={{ color: 'var(--color-gold)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Contact Details</h4>
                                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Name:</strong> {ticket.name}</p>
                                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Email:</strong> <a href={`mailto:${ticket.email}`} style={{ color: 'var(--color-text)' }}>{ticket.email}</a></p>
                                {ticket.phone && <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Phone:</strong> <a href={`tel:${ticket.phone}`} style={{ color: 'var(--color-text)' }}>{ticket.phone}</a></p>}
                              </div>
                              <div>
                                <h4 style={{ color: 'var(--color-gold)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Ticket Info</h4>
                                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Submitted:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                                {ticket.orderNumber && <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Order #:</strong> {ticket.orderNumber}</p>}
                                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Status:</strong> {ticket.status}</p>
                              </div>
                            </div>
                            
                            <h4 style={{ color: 'var(--color-gold)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Message</h4>
                            <div style={{ padding: '16px', backgroundColor: 'var(--color-background)', borderRadius: '4px', whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: 1.6 }}>
                              {ticket.message}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminSupportPage;
