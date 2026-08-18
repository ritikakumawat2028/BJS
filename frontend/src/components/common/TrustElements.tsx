import React from 'react';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import { ShieldCheck, Sparkles, RefreshCcw, HeadphonesIcon, Truck } from 'lucide-react';

export const TrustElements: React.FC = () => {
  const { data: settings } = useStoreSettings();

  const elements = [
    {
      id: 'secure_payments',
      icon: <ShieldCheck size={32} color="var(--color-gold)" />,
      title: 'Secure Payments',
      desc: settings?.trust_secure_payments || 'We use industry-standard encryption for all transactions.'
    },
    {
      id: 'quality_products',
      icon: <Sparkles size={32} color="var(--color-gold)" />,
      title: 'Quality Products',
      desc: settings?.trust_quality_products || 'Every product is thoughtfully formulated and carefully inspected.'
    },
    {
      id: 'easy_returns',
      icon: <RefreshCcw size={32} color="var(--color-gold)" />,
      title: 'Easy Returns',
      desc: settings?.trust_easy_returns || 'Hassle-free returns within our standard policy window.'
    },
    {
      id: 'customer_support',
      icon: <HeadphonesIcon size={32} color="var(--color-gold)" />,
      title: 'Customer Support',
      desc: settings?.trust_customer_support || 'Reach out to our team anytime for assistance with your order.'
    },
    {
      id: 'fast_delivery',
      icon: <Truck size={32} color="var(--color-gold)" />,
      title: 'Fast Delivery',
      desc: settings?.trust_fast_delivery || 'Orders are typically dispatched within 24-48 hours.'
    }
  ];

  return (
    <section style={{
      backgroundColor: 'var(--color-bg-secondary)',
      padding: '60px 24px',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          {elements.map((el, i) => (
            <div key={el.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: `fadeInUp ${0.5 + i * 0.1}s ease-out`
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.1)', // Gold with low opacity
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                {el.icon}
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontFamily: 'var(--font-heading)',
                marginBottom: '12px',
                color: 'var(--color-text)'
              }}>
                {el.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '250px'
              }}>
                {el.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
