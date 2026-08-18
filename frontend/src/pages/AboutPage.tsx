import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { TrustElements } from '../components/common/TrustElements';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const AboutPage: React.FC = () => {
  const { data: settings } = useStoreSettings();
  const storeName = settings?.store_name || "BJ'S Natural Care";

  return (
    <>
      <Helmet><title>Our Story — {storeName}</title></Helmet>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        paddingTop: 'calc(var(--nav-height) + 60px)',
        paddingBottom: '80px',
        backgroundColor: 'var(--color-bg-secondary)',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <motion.p className="section-subtitle" {...fadeInUp}>{storeName}</motion.p>
          <motion.h1 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '24px' }} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
            Luxury, Naturally Crafted.
          </motion.h1>
          <motion.p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
            Elevating your daily rituals with thoughtfully formulated fragrances and beauty essentials.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container" style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Dynamic Content (If set in Admin CMS) */}
        {settings?.about_content && (
          <motion.div style={{ marginBottom: '80px' }} {...fadeInUp}>
            <div className="glass-card" style={{ padding: '40px', borderRadius: '12px' }}>
              <div style={{ 
                color: 'var(--color-text)', 
                lineHeight: 1.8, 
                fontSize: '1.1rem', 
                whiteSpace: 'pre-line',
                textAlign: 'left'
              }}>
                {settings.about_content}
              </div>
            </div>
          </motion.div>
        )}

        {/* Our Story Grid */}
        <motion.div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '60px', 
          alignItems: 'center',
          marginBottom: '100px'
        }} {...fadeInUp}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Our Story</h2>
            <div className="section-divider" style={{ margin: '0 0 24px 0', width: '60px' }} />
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
              {storeName} began with a simple vision in <strong>[Enter Founding Year]</strong>. Founded by <strong>[Enter Founder Name]</strong>, our journey started in <strong>[Enter City/Location]</strong> with a passion for blending fine natural ingredients with the art of luxury craftsmanship.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              <em>[Expand on the origin story here. Replace this placeholder with the authentic history of how the business started, the initial inspiration, or the first product created.]</em>
            </p>
          </div>
          <motion.div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/5' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img 
              src="https://images.unsplash.com/photo-1615397323862-520e5c8e2358?q=80&w=1000&auto=format&fit=crop" 
              alt="Luxury products" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </motion.div>

        {/* Our Commitment */}
        <motion.div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center', borderRadius: '12px', marginBottom: '80px' }} {...fadeInUp}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Our Commitment</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
            We believe that beauty and fragrance should be an exquisite experience. Our products are thoughtfully formulated to elevate your daily routines, utilizing nature's finest extracts to deliver a premium feel without compromise. 
          </p>
          <div style={{ marginTop: '24px', color: 'var(--color-text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>
            <em>[Add any genuine commitments regarding sourcing or production here. Note: Avoid unsubstantiated claims regarding organic certification or medical benefits unless officially verified.]</em>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div style={{ textAlign: 'center', paddingBottom: '40px' }} {...fadeInUp}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Experience the Collection</h3>
          <Link to="/shop" className="btn btn-primary btn-lg" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            Shop Now
          </Link>
        </motion.div>

      </section>

      <TrustElements />
    </>
  );
};

export default AboutPage;
