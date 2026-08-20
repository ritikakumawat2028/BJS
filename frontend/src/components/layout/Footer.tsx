import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../../hooks/useStoreSettings';

const Footer: React.FC = () => {
  const { data: settings } = useStoreSettings();

  return (
    <footer className="footer" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">
                <img src="/logo.png" alt="BJ'S Nature Care Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
              </div>
              <p className="footer__desc" style={{ whiteSpace: 'pre-line' }}>
                {settings?.footer_desc || "Premium luxury beauty and fragrance brand, crafting exquisite perfumes, skincare, haircare, and body care with the finest natural ingredients since 2018."}
              </p>
              <div className="footer__social">
                <a href={settings?.instagram || 'https://www.instagram.com/bjs.essence?igsi=dWF1c3Uya3NlcHMz&utm_source=qr'} className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                {settings?.facebook && (
                  <a href={settings.facebook} className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                )}
                <a href="https://wa.me/919274596622" className="footer__social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
                {settings?.youtube && (
                  <a href={settings.youtube} className="footer__social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer__col">
              <h3 className="footer__col-title">SHOP</h3>
              <ul className="footer__links">
                {[
                  { label: 'All Products', to: '/shop' },
                  { label: 'Fragrance', to: '/shop?category=fragrance' },
                  { label: 'Hair Care', to: '/shop?category=hair-care' },
                  { label: 'Skin Care', to: '/shop?category=skin-care' },
                  { label: 'Body Care', to: '/shop?category=body-care' },
                  { label: 'Natural Care', to: '/shop?category=natural-care' },
                  { label: 'Gift Sets', to: '/shop?category=gift-sets' },
                ].map((link) => (
                  <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3 className="footer__col-title">HELP</h3>
              <ul className="footer__links">
                {[
                  { label: 'Contact Us', to: '/contact' },
                  { label: 'FAQs', to: '/faq' },
                  { label: 'Shipping Policy', to: '/shipping-policy' },
                  { label: 'Return & Refund', to: '/return-policy' },
                  { label: 'Track Order', to: '/track-order' },
                ].map((link) => (
                  <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3 className="footer__col-title">COMPANY</h3>
              <ul className="footer__links">
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Privacy Policy', to: '/privacy-policy' },
                  { label: 'Terms & Conditions', to: '/terms' },
                ].map((link) => (
                  <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div className="footer__col">
              <h3 className="footer__col-title">CUSTOMER SUPPORT</h3>
              <ul className="footer__links">
                {(settings?.store_phone || '+91 92745 96622') && (
                  <li>
                    <a href={`tel:${settings?.store_phone || '+91 92745 96622'}`} className="footer__link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {settings?.store_phone || '+91 92745 96622'}
                    </a>
                  </li>
                )}
                {(settings?.store_email || 'jay250576@gmail.com') && (
                  <li>
                    <a href={`mailto:${settings?.store_email || 'jay250576@gmail.com'}`} className="footer__link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                      {settings?.store_email || 'jay250576@gmail.com'}
                    </a>
                  </li>
                )}
                {(settings?.store_address || 'Surat, Gujarat, India') && (
                  <li>
                    <div className="footer__link" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'default' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <span style={{ whiteSpace: 'pre-line' }}>{settings?.store_address || 'Surat, Gujarat, India'}</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copyright">© {new Date().getFullYear()} {settings?.store_name || "BJ'S Natural Care"}. All rights reserved.</p>
            <div className="footer__payment-icons">
              <span className="footer__payment-text">We accept:</span>
              <span className="footer__payment-badge" style={{ fontFamily: "sans-serif", fontStyle: "italic", fontWeight: 800 }}>VISA</span>
              <span className="footer__payment-badge">
                <svg width="16" height="10" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="7" />
                  <circle cx="16" cy="8" r="7" />
                </svg>
              </span>
              <span className="footer__payment-badge">UPI</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer { background: var(--color-rich-black); border-top: 1px solid var(--color-border); }
        .footer__top { padding: var(--space-16) 0 var(--space-10); }
        .footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: var(--space-10);
        }
        @media (max-width: 992px) {
          .footer__grid { grid-template-columns: 1fr 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .footer__grid { grid-template-columns: 1fr; }
        }
        .footer__logo { display: flex; flex-direction: row; align-items: center; gap: 12px; margin-bottom: var(--space-5); }
        .footer__logo-circle {
          width: 32px; height: 32px; background-color: #DAA520;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #000; font-family: 'Playfair Display', 'Cormorant Garamond', serif; font-weight: 700; font-size: 1rem;
        }
        .footer__logo-text { font-family: 'Playfair Display', 'Cormorant Garamond', serif; font-size: 1.3rem; color: #ffffff; font-weight: 500; line-height: 1; }
        .footer__logo-highlight { color: #DAA520; }
        .footer__desc { font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #a3a3a3; line-height: 1.6; margin-bottom: var(--space-6); max-width: 320px; }
        .footer__social { display: flex; gap: var(--space-4); }
        .footer__social-link {
          display: flex; align-items: center; justify-content: center;
          color: #a3a3a3;
          transition: all var(--transition-fast);
        }
        .footer__social-link:hover { color: #ffffff; }
        .footer__col-title {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #DAA520;
          margin-bottom: var(--space-5);
        }
        .footer__links { display: flex; flex-direction: column; gap: 16px; }
        .footer__link { font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #a3a3a3; transition: color var(--transition-fast); }
        .footer__link:hover { color: #ffffff; }
        .footer__contact { display: flex; flex-direction: column; gap: var(--space-3); }
        .footer__contact-item { display: flex; align-items: center; gap: var(--space-3); font-size: 0.8rem; color: var(--color-text-muted); }
        .footer__bottom { border-top: 1px solid #333333; padding: var(--space-5) 0; }
        .footer__bottom-inner { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
        .footer__copyright { font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #777777; }
        .footer__payment-icons { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .footer__payment-text { font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #777777; }
        .footer__payment-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #777777;
        }
        @media (max-width: 1024px) {
          .footer__grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); }
          .footer__brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .footer__grid { grid-template-columns: 1fr; gap: var(--space-6); }
          .footer__bottom-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
