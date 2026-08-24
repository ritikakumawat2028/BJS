import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import toast from 'react-hot-toast';

const AdminReviewsPage: React.FC = () => {
  const qc = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => adminApi.getReviews()
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isApproved, adminReply }: { id: string, isApproved?: boolean, adminReply?: string }) => 
      adminApi.updateReviewStatus(id, { isApproved, adminReply }),
    onSuccess: () => {
      toast.success('Review updated successfully');
      qc.invalidateQueries({ queryKey: ['admin-reviews'] });
      setReplyingTo(null);
      setReplyText('');
    },
    onError: () => toast.error('Failed to update review')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted');
      qc.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: () => toast.error('Failed to delete review')
  });

  const handleApprove = (id: string, currentStatus: boolean) => {
    updateStatusMutation.mutate({ id, isApproved: !currentStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleReplySubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    updateStatusMutation.mutate({ id, adminReply: replyText });
  };

  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < count ? 'var(--color-gold)' : 'var(--color-border)', fontSize: '1rem' }}>★</span>
    ));

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading reviews...</div>;

  const reviews = data?.data?.data || [];

  return (
    <>
      <Helmet><title>Reviews | Admin | BJS Natural Care</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>Reviews Management</h1>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>No reviews found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {reviews.map((review: any) => (
              <div key={review.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px', background: 'var(--color-rich-black)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <img src={review.product.images?.[0]?.url || 'https://via.placeholder.com/60'} alt={review.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <p style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '1.1rem' }}>{review.product.name}</p>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        By {review.user ? `${review.user.firstName} ${review.user.lastName} (${review.user.email})` : (review.title?.replace('Review by ', '') || 'Guest')}
                      </p>
                      {review.isVerifiedBuyer && <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>✓ Verified Purchase</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleApprove(review.id, review.isApproved)}
                      className={`btn ${review.isApproved ? 'btn-outline' : 'btn-primary'}`} 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      disabled={updateStatusMutation.isPending}
                    >
                      {review.isApproved ? 'Reject' : 'Approve'}
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>{renderStars(review.rating)}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  {review.title && <p style={{ fontWeight: 600, color: 'var(--color-ivory)', marginBottom: '4px' }}>{review.title}</p>}
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{review.comment}</p>
                  
                  {review.images && (
                    <img src={review.images} alt="Review attachment" style={{ maxWidth: '120px', borderRadius: '4px', marginTop: '12px' }} />
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  {review.adminReply ? (
                    <div>
                      <p style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Your Reply:</p>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{review.adminReply}</p>
                      <button onClick={() => { setReplyingTo(review.id); setReplyText(review.adminReply); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.8rem', cursor: 'pointer', marginTop: '8px', padding: 0 }}>Edit Reply</button>
                    </div>
                  ) : replyingTo === review.id ? (
                    <form onSubmit={(e) => handleReplySubmit(e, review.id)}>
                      <textarea 
                        className="form-input" 
                        rows={3} 
                        placeholder="Write a public response..." 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        style={{ marginBottom: '12px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} disabled={updateStatusMutation.isPending}>Send Reply</button>
                        <button type="button" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setReplyingTo(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => { setReplyingTo(review.id); setReplyText(''); }} style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>+ Add Public Reply</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminReviewsPage;
