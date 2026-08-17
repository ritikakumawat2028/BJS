import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { Banner } from '../../types';

const PromoPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  const { data } = useQuery({ 
    queryKey: ['popup-banners'], 
    queryFn: () => adminApi.getBanners('POPUP'),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const popupBanners: Banner[] = data?.data?.data || [];
  const activePopup = popupBanners.length > 0 ? popupBanners[0] : null;

  useEffect(() => {
    if (!activePopup) return;

    // Check if the user already dismissed this specific popup
    const dismissedId = localStorage.getItem('bjs_popup_dismissed_id');
    if (dismissedId === activePopup.id) {
      return;
    }

    // Show popup after 12 seconds
    const timer = setTimeout(() => {
      setShow(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, [activePopup]);

  const handleClose = () => {
    setShow(false);
    setHasDismissed(true);
    if (activePopup) {
      localStorage.setItem('bjs_popup_dismissed_id', activePopup.id);
    }
  };

  if (!show || !activePopup || hasDismissed) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="modal animate-scale-in" 
        style={{ 
          maxWidth: '800px', 
          width: '90%', 
          padding: 0, 
          background: 'var(--color-rich-black)', 
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          border: '1px solid var(--color-border-gold)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <button 
          onClick={handleClose} 
          style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            background: 'rgba(0,0,0,0.5)', 
            border: 'none', 
            color: '#fff', 
            fontSize: '1.5rem', 
            cursor: 'pointer',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <div style={{ flex: 1, minHeight: '300px', position: 'relative' }}>
          <img 
            src={activePopup.desktopImage} 
            alt={activePopup.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} 
          />
        </div>

        <div style={{ flex: 1, padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {activePopup.badgeText && (
            <span style={{ 
              display: 'inline-block', 
              fontSize: '.72rem', 
              fontWeight: 700, 
              color: 'var(--color-black)', 
              background: 'var(--color-gold)', 
              padding: '5px 12px', 
              borderRadius: '2px', 
              marginBottom: '16px', 
              letterSpacing: '.05em', 
              textTransform: 'uppercase' 
            }}>
              {activePopup.badgeText}
            </span>
          )}
          
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-ivory)', marginBottom: '12px' }}>
            {activePopup.title}
          </h2>
          
          {activePopup.subtitle && (
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '16px', fontWeight: 500 }}>
              {activePopup.subtitle}
            </h3>
          )}
          
          {activePopup.description && (
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.95rem' }}>
              {activePopup.description}
            </p>
          )}

          {activePopup.couponCode && (
            <div style={{ border: '1px dashed var(--color-border-gold)', padding: '12px 24px', color: 'var(--color-ivory)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', marginBottom: '24px', background: 'rgba(201, 162, 39, 0.05)' }}>
              Use Code: <span style={{ color: 'var(--color-gold)', fontWeight: 600, marginLeft: '4px' }}>{activePopup.couponCode}</span>
            </div>
          )}

          {activePopup.ctaText && (
            <Link 
              to={activePopup.ctaUrl || '/shop'} 
              className="btn btn-primary" 
              onClick={handleClose}
              style={{ width: '100%', maxWidth: '240px' }}
            >
              {activePopup.ctaText}
            </Link>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .modal.animate-scale-in {
            flex-direction: column !important;
          }
          .modal.animate-scale-in > div:first-of-type {
            min-height: 200px !important;
          }
          .modal.animate-scale-in > div:last-of-type {
            padding: var(--space-6) var(--space-4) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PromoPopup;
