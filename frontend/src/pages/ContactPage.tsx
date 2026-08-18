import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const ContactPage: React.FC = () => {
  const { data: settings } = useStoreSettings();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminApi.createTicket(formData);
      toast.success('Your message has been sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', orderNumber: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us — {settings?.store_name || "BJ'S Natural Care"}</title></Helmet>
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="container" style={{ flex: 1, padding: '60px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.p className="section-subtitle" {...fadeInUp}>{settings?.store_name || "BJ'S Natural Care"}</motion.p>
          <motion.h1 className="section-title" {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>Contact Us</motion.h1>
          <motion.div className="section-divider" style={{ margin: '24px auto' }} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} />
          
          <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', textAlign: 'left', marginBottom: '40px' }} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.3 }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Email</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>{settings?.store_email || "support@bjsnaturalcare.com"}</p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Phone</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>{settings?.store_phone || "+91 98765 43210"}</p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '16px' }}>Address</h3>
              <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {settings?.store_address || "123 Natural Care Avenue\nBeauty District\nMumbai, Maharashtra 400001\nIndia"}
              </p>
            </div>
          </motion.div>

          <motion.div className="card" style={{ padding: '32px', textAlign: 'left', marginBottom: '40px' }} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.3 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '24px', textAlign: 'center' }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number (Optional)</label>
                  <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                </div>
                <div className="form-group">
                  <label className="form-label">Order Number (Optional)</label>
                  <input type="text" name="orderNumber" className="form-input" value={formData.orderNumber} onChange={handleChange} placeholder="BJS-12345" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input type="text" name="subject" className="form-input" required value={formData.subject} onChange={handleChange} placeholder="How can we help?" />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea name="message" className="form-input" required value={formData.message} onChange={handleChange} rows={6} placeholder="Please provide details about your inquiry..." style={{ resize: 'vertical' }}></textarea>
              </div>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '200px' }}>
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </motion.div>

          <Link to="/shop" className="btn btn-outline-gold">Return to Shop</Link>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
