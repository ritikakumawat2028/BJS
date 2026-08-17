import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { userApi, adminApi } from '../../services/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface ProductReviewsProps {
  productId: string;
  reviews: any[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews }) => {
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEditClick = (review: any) => {
    setEditingReview(review);
    setRating(review.rating);
    setTitle(review.title || '');
    setComment(review.comment || '');
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingReview(null);
    setRating(5);
    setTitle('');
    setComment('');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to leave a review');
    if (rating < 1 || rating > 5) return toast.error('Rating must be between 1 and 5');
    if (!comment) return toast.error('Review comment is required');

    setSubmitting(true);
    try {
      let uploadedImageUrl = editingReview?.images || '';
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await adminApi.uploadImage(formData);
        uploadedImageUrl = uploadRes.data.data.url;
      }

      const payload = { productId, rating, title, comment, images: uploadedImageUrl };

      if (editingReview) {
        await userApi.updateReview(editingReview.id, payload);
        toast.success('Review updated and pending approval');
      } else {
        await userApi.addReview(payload);
        toast.success('Review submitted successfully! Pending approval.');
      }
      qc.invalidateQueries({ queryKey: ['product'] });
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await userApi.deleteReview(id);
      toast.success('Review deleted');
      qc.invalidateQueries({ queryKey: ['product'] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const renderStars = (count: number, interactive = false) =>
    Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        style={{ color: i < count ? 'var(--color-gold)' : 'var(--color-border)', fontSize: '1.2rem', cursor: interactive ? 'pointer' : 'default' }} 
        onClick={() => interactive && setRating(i + 1)}
      >
        ???
      </span>
    ));

  return (
    <div className="product-reviews">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-ivory)' }}>Customer Reviews</h3>
        {!showForm && isAuthenticated && !reviews.some(r => r.userId === (user as any)?.id || r.userId === (user as any)?.userId) && (
          <button className="btn btn-outline-gold" onClick={() => setShowForm(true)}>Write a Review</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h4 style={{ marginBottom: '16px', color: 'var(--color-gold)' }}>{editingReview ? 'Edit Your Review' : 'Write a Review'}</h4>
          
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Rating</label>
            <div>{renderStars(rating, true)}</div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Title (Optional)</label>
            <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Review</label>
            <textarea className="form-input" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you like or dislike?" required></textarea>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Attach Image (Optional)</label>
            <input type="file" className="form-input" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            {editingReview?.images && !imageFile && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Current image will be kept unless you upload a new one.</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm} disabled={submitting}>Cancel</button>
          </div>
        </form>
      )}

      {reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {reviews.map((review: any) => (
            <div key={review.id} className="review-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--color-ivory)', marginBottom: '4px' }}>
                    {review.user?.firstName} {review.user?.lastName}
                  </p>
                  {review.isVerifiedBuyer && <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>??? Verified Purchase</span>}
                </div>
                <div>{renderStars(review.rating, false)}</div>
              </div>
              
              {review.title && <p style={{ fontWeight: 500, color: 'var(--color-ivory)', marginBottom: '8px' }}>{review.title}</p>}
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{review.comment}</p>
              
              {review.images && (
                <img src={review.images} alt="Review" style={{ maxWidth: '150px', borderRadius: '8px', marginBottom: '16px', display: 'block' }} />
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {((user as any)?.id === review.userId || (user as any)?.userId === review.userId) && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleEditClick(review)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                    <button onClick={() => handleDelete(review.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                  </div>
                )}
              </div>
              
              {review.adminReply && (
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(201, 162, 39, 0.05)', borderLeft: '3px solid var(--color-gold)', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gold)', marginBottom: '4px' }}>Response from BJS Natural Care:</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{review.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>No reviews yet. Be the first to review this product!</p>
            {!isAuthenticated && <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>You must be logged in to leave a review.</p>}
          </div>
        )
      )}
    </div>
  );
};

export default ProductReviews;
